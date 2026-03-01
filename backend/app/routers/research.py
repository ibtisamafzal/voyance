"""
Research router — REST + WebSocket endpoints for the main agent loop.

POST /api/research/start       → start research, return session_id
WS   /api/research/ws/{sid}   → stream real-time agent updates
POST /api/research/interrupt   → mid-session voice redirect
GET  /api/research/{sid}       → get session results
"""

import asyncio
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, BackgroundTasks
from app.models import (
    ResearchRequest, ResearchResponse, VoiceInterruptRequest,
    ResearchSession, AgentUpdate, SessionStatus,
)
from app import agent
from app.services.firestore_service import get_session, save_session

router = APIRouter(tags=["Research"])

# WebSocket connection pool: session_id → list of connected WebSockets
_ws_connections: dict[str, list[WebSocket]] = {}


async def _broadcast(session_id: str, update: AgentUpdate):
    """Broadcast an agent update to all WebSocket clients for this session."""
    payload = update.model_dump_json()
    dead: list[WebSocket] = []
    for ws in _ws_connections.get(session_id, []):
        try:
            await ws.send_text(payload)
        except Exception:
            dead.append(ws)
    for ws in dead:
        _ws_connections.get(session_id, []).remove(ws)


@router.post("/start", response_model=ResearchResponse)
async def start_research(req: ResearchRequest, background_tasks: BackgroundTasks):
    """Start a new research session. Runs the agent loop in the background."""
    session = ResearchSession(
        query=req.query,
        max_sites=req.max_sites,
    )
    if req.session_id:
        session.session_id = req.session_id

    await save_session(session.session_id, session.model_dump(mode="json"))

    # Run agent in background so the HTTP response returns immediately
    background_tasks.add_task(
        agent.run_research,
        session,
        lambda upd: _broadcast(session.session_id, upd),
    )

    return ResearchResponse(
        session_id=session.session_id,
        status=SessionStatus.RUNNING,
        message=f"Research started for: {req.query}. Connect to /api/research/ws/{session.session_id} for live updates.",
    )


@router.websocket("/ws/{session_id}")
async def research_websocket(websocket: WebSocket, session_id: str):
    """WebSocket endpoint — streams real-time agent updates to the frontend."""
    await websocket.accept()

    # Register connection
    if session_id not in _ws_connections:
        _ws_connections[session_id] = []
    _ws_connections[session_id].append(websocket)

    try:
        # Send any existing session state
        session_data = await get_session(session_id)
        if session_data:
            await websocket.send_text(json.dumps({
                "type": "session_state",
                "data": session_data,
            }))

        # Keep connection alive, receive interrupts from frontend.
        # Ping every 8s so load balancers (e.g. Cloud Run) don't close the WS as idle.
        while True:
            try:
                msg = await asyncio.wait_for(websocket.receive_text(), timeout=8.0)
                data = json.loads(msg)
                if data.get("type") == "interrupt":
                    instruction = data.get("instruction", "")
                    agent.interrupt_session(session_id, instruction)
                    await websocket.send_text(json.dumps({
                        "type": "interrupt_ack",
                        "instruction": instruction,
                    }))
            except asyncio.TimeoutError:
                # Send heartbeat ping (keeps WS alive past ~10s idle timeouts)
                try:
                    await websocket.send_text(json.dumps({"type": "ping"}))
                except Exception:
                    break
    except WebSocketDisconnect:
        pass
    finally:
        conns = _ws_connections.get(session_id, [])
        if websocket in conns:
            conns.remove(websocket)


@router.post("/interrupt")
async def interrupt_research(req: VoiceInterruptRequest):
    """Mid-session voice redirect — agent replans within 5 seconds."""
    session = agent.get_session(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found or not running")

    agent.interrupt_session(req.session_id, req.instruction)
    return {"status": "interrupt_queued", "instruction": req.instruction}


@router.get("/{session_id}/screenshots")
async def get_session_screenshots(session_id: str):
    """Return cached screenshots for a session (US-04)."""
    screenshots = agent.get_session_screenshots(session_id)
    return {"session_id": session_id, "screenshots": screenshots}


@router.get("/{session_id}", response_model=ResearchResponse)
async def get_research_results(session_id: str):
    """Retrieve completed research results for a session."""
    session = agent.get_session(session_id)
    if not session:
        data = await get_session(session_id)
        if not data:
            raise HTTPException(status_code=404, detail="Session not found")
        session = ResearchSession(**data)

    return ResearchResponse(
        session_id=session.session_id,
        status=session.status,
        message=session.vera_summary or (session.vera_transcript[-1] if session.vera_transcript else "Research in progress..."),
        results=session.results,
        vera_summary=session.vera_summary,
        total_sites=session.sites_visited,
    )
