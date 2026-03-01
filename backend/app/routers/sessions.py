"""Sessions router — list, get, and delete research sessions."""

from fastapi import APIRouter, HTTPException
from app.services.firestore_service import get_session, list_sessions, delete_session

router = APIRouter(tags=["Sessions"])


@router.get("/")
async def list_all_sessions(limit: int = 20):
    """List recent research sessions."""
    sessions = await list_sessions(limit)
    return {"sessions": sessions, "count": len(sessions)}


@router.get("/{session_id}")
async def get_session_by_id(session_id: str):
    """Get a specific session by ID."""
    data = await get_session(session_id)
    if not data:
        raise HTTPException(status_code=404, detail="Session not found")
    return data


@router.delete("/{session_id}")
async def delete_session_by_id(session_id: str):
    """Delete a session."""
    deleted = await delete_session(session_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"status": "deleted", "session_id": session_id}
