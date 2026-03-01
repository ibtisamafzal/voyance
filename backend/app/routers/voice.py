"""Voice router — ElevenLabs TTS and voice management."""

from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import Response
import base64
from pydantic import BaseModel
from app.models import VoiceResponse
from app.services.voice_service import text_to_speech, get_available_voices
from app.services.gemini_service import transcribe_audio

router = APIRouter(tags=["Voice"])


class SpeakRequest(BaseModel):
    text: str


@router.post("/speak", response_model=VoiceResponse)
async def vera_speak(text: str):
    """Convert text to Vera's voice. Returns base64 MP3 audio."""
    audio_b64 = await text_to_speech(text)
    return VoiceResponse(
        text=text,
        audio_base64=audio_b64,
        voice_id="EXAVITQu4vr4xnSDxMaL",
    )


async def _speak_audio_response(text: str):
    """Shared logic: text -> MP3 Response."""
    audio_b64 = await text_to_speech(text)
    if not audio_b64:
        return Response(
            content=b"",
            status_code=503,
            headers={"X-Error": "ElevenLabs API not configured"},
        )
    audio_bytes = base64.b64decode(audio_b64)
    return Response(
        content=audio_bytes,
        media_type="audio/mpeg",
        headers={
            "Content-Disposition": f'attachment; filename="vera_speech.mp3"',
            "Cache-Control": "no-cache",
        },
    )


@router.get("/speak/audio")
async def vera_speak_audio_get(text: str = ""):
    """Stream Vera's voice as MP3 (short text via query param)."""
    if not text:
        return Response(content=b"", status_code=400, headers={"X-Error": "Missing text"})
    return await _speak_audio_response(text)


@router.post("/speak/audio")
async def vera_speak_audio_post(req: SpeakRequest):
    """Stream Vera's voice as MP3 (POST for long text — use this for Vera summaries)."""
    if not req.text:
        return Response(content=b"", status_code=400, headers={"X-Error": "Missing text"})
    return await _speak_audio_response(req.text)


@router.get("/voices")
async def list_voices():
    """List available ElevenLabs voices."""
    voices = await get_available_voices()
    return {"voices": voices}


@router.post("/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    """
    Transcribe audio via Gemini (AC-01). Accepts audio/webm, audio/mp4, audio/mpeg.
    Returns { "text": "transcribed text" }.
    """
    mime = audio.content_type or ""
    if not mime.startswith("audio/"):
        # Infer from filename
        fn = (audio.filename or "").lower()
        if fn.endswith(".webm"):
            mime = "audio/webm"
        elif fn.endswith(".mp4") or fn.endswith(".m4a"):
            mime = "audio/mp4"
        elif fn.endswith(".mp3"):
            mime = "audio/mpeg"
        else:
            mime = "audio/webm"  # default for MediaRecorder
    data = await audio.read()
    if len(data) > 20 * 1024 * 1024:  # 20 MB limit
        raise HTTPException(400, "Audio file too large (max 20MB)")
    try:
        text = await transcribe_audio(data, mime)
        return {"text": text}
    except ValueError as e:
        raise HTTPException(502, str(e))
