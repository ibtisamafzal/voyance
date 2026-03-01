"""
Firestore Service — Session state and navigation log persistence.
Falls back to in-memory storage for local development without GCP credentials.
"""

import os
from typing import Optional
from datetime import datetime

# In-memory fallback store (for local dev without Firestore)
_in_memory: dict[str, dict] = {}
_firestore_client = None
_using_firestore = False


async def init_firestore():
    """Initialize Firestore client if credentials are available."""
    global _firestore_client, _using_firestore
    project = os.getenv("GOOGLE_CLOUD_PROJECT", "")
    if not project:
        print("⚠️  GOOGLE_CLOUD_PROJECT not set — using in-memory session store")
        return

    try:
        from google.cloud import firestore
        _firestore_client = firestore.AsyncClient(project=project)
        _using_firestore = True
        print(f"✅ Firestore connected to project: {project}")
    except Exception as e:
        print(f"⚠️  Firestore init failed ({e}) — using in-memory store")


async def save_session(session_id: str, data: dict):
    """Persist a session to Firestore or in-memory."""
    data["updated_at"] = datetime.utcnow().isoformat()
    if _using_firestore and _firestore_client:
        try:
            doc_ref = _firestore_client.collection("sessions").document(session_id)
            await doc_ref.set(data, merge=True)
            return
        except Exception as e:
            print(f"Firestore write error: {e}")
    _in_memory[session_id] = data


async def get_session(session_id: str) -> Optional[dict]:
    """Retrieve a session by ID."""
    if _using_firestore and _firestore_client:
        try:
            doc_ref = _firestore_client.collection("sessions").document(session_id)
            doc = await doc_ref.get()
            if doc.exists:
                return doc.to_dict()
        except Exception:
            pass
    return _in_memory.get(session_id)


async def list_sessions(limit: int = 20) -> list[dict]:
    """List recent sessions."""
    if _using_firestore and _firestore_client:
        try:
            docs = _firestore_client.collection("sessions").order_by(
                "updated_at", direction="DESCENDING"
            ).limit(limit)
            return [doc.to_dict() async for doc in docs.stream()]
        except Exception:
            pass
    sessions = list(_in_memory.values())
    sessions.sort(key=lambda s: s.get("updated_at", ""), reverse=True)
    return sessions[:limit]


async def delete_session(session_id: str) -> bool:
    """Delete a session."""
    if _using_firestore and _firestore_client:
        try:
            doc_ref = _firestore_client.collection("sessions").document(session_id)
            await doc_ref.delete()
        except Exception:
            pass
    return _in_memory.pop(session_id, None) is not None


def is_using_firestore() -> bool:
    return _using_firestore
