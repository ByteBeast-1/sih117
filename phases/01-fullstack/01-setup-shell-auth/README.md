# Sub-Phase 1 — Setup, Shell & Auth

## Goal

Get a running React app and FastAPI service talking to each other, with a login screen that
correctly routes to either an (empty, for now) Admin Dashboard or an (empty, for now) Client Shell.

## Tech Stack

React + Vite + Tailwind (frontend) · FastAPI + Uvicorn + PostgreSQL + SQLAlchemy + PyJWT (backend).

## Expected Files After This Sub-Phase

```
phases/01-fullstack/
  app/                      (React app - Vite scaffold)
    src/
      pages/Login.jsx
      pages/AdminShell.jsx  (empty placeholder page)
      pages/ClientShell.jsx (empty placeholder page, has the sidebar structure only)
      App.jsx               (routing)
  backend/
    app/
      main.py
      models.py             (User table)
      schemas.py
      auth.py               (JWT issue/verify)
      routers/auth.py       (POST /api/v1/auth/login)
    requirements.txt
  .env.example
```

## Setup Steps

1. `cd phases/01-fullstack && npm create vite@latest app -- --template react`
2. `cd app && npm install && npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`
3. `cd .. && python3 -m venv backend/venv && source backend/venv/bin/activate`
4. `pip install fastapi uvicorn[standard] sqlalchemy[asyncio] asyncpg pyjwt passlib[bcrypt] python-multipart`
5. Run Postgres locally (Docker, once you have it — see `phases/03-devops-infra/01-local-dev-environment`)
   or use SQLite for now if Docker isn't set up yet: `DATABASE_URL=sqlite+aiosqlite:///./dev.db`
6. `uvicorn backend.app.main:app --reload --port 8000` and `npm run dev` (in `app/`) in two terminals.

## What "Done" Looks Like

- Visiting the frontend shows a login screen.
- Submitting any username/password against a seeded test user in the DB returns a JWT and routes
  to the correct shell based on role (`admin` → Admin Dashboard, anything else → Client Shell).
- Both shell pages exist but are empty/placeholder — they get built out in sub-phases 2–4.

## Hands Off To

Sub-phase 2 builds real content inside `ClientShell.jsx`'s sidebar.
