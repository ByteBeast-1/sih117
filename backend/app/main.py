"""
SIH26 Sovereign Workbench API — FastAPI Backend
Main entry point: auth, agent routing, admin dashboard, knowledge base.
100% on-premise, zero external API calls.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select

from app.routers import auth, agents, admin
from app.database import engine, Base
from app import models
from app.auth import get_password_hash
from app.knowledge_base import knowledge_base

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(name)-25s | %(levelname)-7s | %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: create tables, seed users, initialize knowledge base.
    Using lifespan instead of deprecated @app.on_event("startup").
    """
    logger.info("🚀 Starting SIH26 Sovereign Workbench API...")

    # Create all tables if they don't exist yet
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("✅ Database tables ready")

    # Seed test users for the prototype (admin + engineer)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        result = await session.execute(
            select(models.User).where(models.User.username == "admin")
        )
        if not result.scalars().first():
            admin_user = models.User(
                username="admin",
                hashed_password=get_password_hash("admin123"),
                role="admin",
            )
            engineer = models.User(
                username="eng_rajesh",
                hashed_password=get_password_hash("engineer123"),
                role="user",
            )
            session.add_all([admin_user, engineer])
            await session.commit()
            logger.info("✅ Seed users created (admin/admin123, eng_rajesh/engineer123)")

    # Initialize knowledge base (ChromaDB + sample documents)
    await knowledge_base.initialize()
    logger.info("✅ Knowledge base initialized")

    logger.info("=" * 60)
    logger.info("  SIH26 Sovereign Workbench API is READY")
    logger.info("  Backend:  http://localhost:8000")
    logger.info("  API Docs: http://localhost:8000/docs")
    logger.info("=" * 60)

    yield  # App runs here

    # Shutdown
    logger.info("Shutting down SIH26 Sovereign Workbench API")


app = FastAPI(
    title="SIH26 Sovereign Workbench API",
    description=(
        "Backend gateway for the MRPL on-premise AI workbench. "
        "All inference runs locally via Ollama. Zero external API calls."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow all origins for prototype/local development.
# In production, restrict to the exact frontend origin.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(auth.router)
app.include_router(agents.router)
app.include_router(admin.router)


@app.get("/")
async def root():
    """Health check — confirms the API is running."""
    return {
        "status": "ok",
        "service": "SIH26 Sovereign Workbench API",
        "version": "1.0.0",
        "sovereign": True,
        "description": "100% on-premise AI workbench — zero external calls",
    }
