"""Health check router."""

from fastapi import APIRouter
from app.models import HealthResponse
from app.services.firestore_service import is_using_firestore
import os

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Check backend and service connectivity."""
    services = {
        "gemini": bool(os.getenv("GEMINI_API_KEY", "").strip("your_gemini_api_key_here")),
        "elevenlabs": bool(os.getenv("ELEVENLABS_API_KEY", "").strip("your_elevenlabs_api_key_here")),
        "firecrawl": bool(os.getenv("FIRECRAWL_API_KEY", "").strip("your_firecrawl_api_key_here")),
        "perplexity": bool(os.getenv("PERPLEXITY_API_KEY", "").strip("your_perplexity_api_key_here")),
        "firestore": is_using_firestore(),
        "playwright": _check_playwright(),
    }
    all_core = services["gemini"]
    return HealthResponse(
        status="ok" if all_core else "degraded",
        version="1.0.0",
        services=services,
    )


def _check_playwright() -> bool:
    try:
        import playwright
        return True
    except ImportError:
        return False
