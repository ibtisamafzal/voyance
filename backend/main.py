"""
Voyance Backend — FastAPI Application Factory
Gemini Live Agent Challenge 2026 · UI Navigator Track
"""

import asyncio
import sys

# Fix Playwright + asyncio on Windows: use ProactorEventLoop for subprocess support
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

# Load .env FIRST before any service imports that need env vars
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

from app.services.firestore_service import init_firestore
from app.routers import research, sessions, voice, health


@asynccontextmanager
async def lifespan(application: FastAPI):
    """Startup / shutdown lifecycle."""
    print("🚀 Voyance backend starting...")
    try:
        await init_firestore()
    except Exception as e:
        print(f"⚠️  Firestore unavailable (local mode): {e}")
    yield
    print("🛑 Voyance backend shutting down.")
    try:
        from app.services.browser_service import close_browser
        await close_browser()
    except Exception:
        pass


def create_app() -> FastAPI:
    application = FastAPI(
        title="Voyance API",
        description="AI-Powered Visual Web Research Agent — Gemini Live Agent Challenge 2026",
        version="1.0.0",
        lifespan=lifespan,
        docs_url="/api/docs",
        redoc_url="/api/redoc",
    )

    # ─── CORS ────────────────────────────────────────────────────────────────
    origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],          # Broad for dev; restrict in prod
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ─── Routers ─────────────────────────────────────────────────────────────
    application.include_router(health.router, prefix="/api")
    application.include_router(sessions.router, prefix="/api/sessions")
    application.include_router(research.router, prefix="/api/research")
    application.include_router(voice.router, prefix="/api/voice")

    @application.get("/")
    async def root():
        return {
            "name": "Voyance API",
            "version": "1.0.0",
            "status": "running",
            "docs": "/api/docs",
        }

    return application


app = create_app()
