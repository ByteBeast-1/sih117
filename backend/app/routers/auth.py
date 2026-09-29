from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import timedelta

from app import schemas, models, auth
from app.database import get_db

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/login")
async def login_for_access_token(user_credentials: schemas.UserLogin, db: AsyncSession = Depends(get_db)):
    """Authenticate user and return JWT + user info.
    Response shape matches what the React frontend expects:
    { user: { username, role }, token: "<jwt>" }
    """
    # Find user in DB by username
    result = await db.execute(select(models.User).where(models.User.username == user_credentials.username))
    user = result.scalars().first()

    if not user or not auth.verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create JWT with username and role embedded
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username, "role": user.role}, expires_delta=access_token_expires
    )

    # Return shape that the frontend Login.jsx expects
    return {
        "user": {"username": user.username, "role": user.role},
        "token": access_token,
    }


@router.get("/me")
async def get_current_user(current_user: dict = Depends(auth.get_current_user)):
    """Return the currently authenticated user's info.
    Called by the frontend on page reload to verify the stored token is still valid.
    """
    return current_user
