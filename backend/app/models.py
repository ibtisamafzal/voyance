"""Pydantic models / schemas for Voyance API."""

from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum
import uuid
from datetime import datetime


class ConfidenceLevel(str, Enum):
    VERIFIED = "verified"
    UNCONFIRMED = "unconfirmed"
    LOW = "low"


class SessionStatus(str, Enum):
    IDLE = "idle"
    RUNNING = "running"
    PAUSED = "paused"
    COMPLETE = "complete"
    ERROR = "error"


class AgentStep(str, Enum):
    PLANNING = "planning"
    NAVIGATING = "navigating"
    EXTRACTING = "extracting"
    VERIFYING = "verifying"
    SYNTHESIZING = "synthesizing"
    COMPLETE = "complete"


# ─── Request Models ────────────────────────────────────────────────────────────

class ResearchRequest(BaseModel):
    query: str = Field(..., description="Natural language research request", example="Compare pricing for top 5 CRM tools")
    max_sites: int = Field(default=5, ge=1, le=10, description="Max number of sites to visit")
    session_id: Optional[str] = Field(default=None)
    voice_enabled: bool = Field(default=True)


class VoiceInterruptRequest(BaseModel):
    session_id: str
    instruction: str = Field(..., description="Mid-session voice redirect instruction")


# ─── Data Models ───────────────────────────────────────────────────────────────

class PricingTier(BaseModel):
    name: str
    price: str
    seats: Optional[int] = None
    period: Optional[str] = "month"


class CompetitorData(BaseModel):
    company: str
    website: str
    pricing_tiers: List[PricingTier] = []
    key_features: List[str] = []
    target_segment: str = ""
    source_url: str = ""
    screenshot_ref: Optional[str] = None
    perplexity_verified: bool = False
    confidence_score: float = Field(default=0.5, ge=0.0, le=1.0)
    confidence: ConfidenceLevel = ConfidenceLevel.UNCONFIRMED
    extracted_at: datetime = Field(default_factory=datetime.utcnow)


# ─── Session Models ─────────────────────────────────────────────────────────────

class NavigationStep(BaseModel):
    step_number: int
    url: str
    action: str
    screenshot_ref: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    duration_ms: Optional[int] = None


class ResearchSession(BaseModel):
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    query: str
    status: SessionStatus = SessionStatus.IDLE
    current_step: AgentStep = AgentStep.PLANNING
    sites_visited: int = 0
    max_sites: int = 5
    results: List[CompetitorData] = []
    navigation_log: List[NavigationStep] = []
    vera_transcript: List[str] = []
    vera_summary: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    error: Optional[str] = None


# ─── Response Models ────────────────────────────────────────────────────────────

class ResearchResponse(BaseModel):
    session_id: str
    status: SessionStatus
    message: str
    results: List[CompetitorData] = []
    vera_summary: Optional[str] = None
    total_sites: int = 0
    duration_seconds: Optional[float] = None


class AgentUpdate(BaseModel):
    """Sent over WebSocket to frontend."""
    session_id: str
    step: AgentStep
    message: str
    site: Optional[str] = None
    progress: float = Field(default=0.0, ge=0.0, le=1.0)
    data: Optional[CompetitorData] = None
    vera_speech: Optional[str] = None


class VoiceResponse(BaseModel):
    text: str
    audio_base64: Optional[str] = None
    voice_id: str = ""
    duration_ms: Optional[int] = None


class HealthResponse(BaseModel):
    status: str
    version: str
    services: dict
