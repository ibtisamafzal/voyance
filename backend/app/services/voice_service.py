"""
ElevenLabs (Vera) Voice Service — TTS for Vera persona.
Delivers spoken research briefings and real-time narration.
"""

import os
import base64
import httpx
from typing import Optional

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "EXAVITQu4vr4xnSDxMaL")  # Rachel
MODEL_ID = os.getenv("ELEVENLABS_MODEL_ID", "eleven_multilingual_v2")
BASE_URL = "https://api.elevenlabs.io/v1"


async def text_to_speech(text: str, timeout: float = 20.0) -> Optional[str]:
    """
    Convert text to Vera's voice via ElevenLabs.
    Returns base64-encoded MP3 audio, or None if unavailable.
    """
    if not ELEVENLABS_API_KEY or ELEVENLABS_API_KEY == "your_elevenlabs_api_key_here":
        return None

    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
    }
    payload = {
        "text": text,
        "model_id": MODEL_ID,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.8,
            "style": 0.3,
            "use_speaker_boost": True,
        },
    }

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            resp = await client.post(
                f"{BASE_URL}/text-to-speech/{VOICE_ID}",
                json=payload,
                headers=headers,
            )
            if resp.status_code == 200:
                audio_bytes = resp.content
                return base64.b64encode(audio_bytes).decode("utf-8")
    except Exception as e:
        print(f"ElevenLabs TTS error: {e}")

    return None


async def get_available_voices() -> list[dict]:
    """List available ElevenLabs voices."""
    if not ELEVENLABS_API_KEY or ELEVENLABS_API_KEY == "your_elevenlabs_api_key_here":
        return [{"voice_id": VOICE_ID, "name": "Vera (Demo)", "available": False}]

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                f"{BASE_URL}/voices",
                headers={"xi-api-key": ELEVENLABS_API_KEY},
            )
            if resp.status_code == 200:
                voices = resp.json().get("voices", [])
                return [
                    {"voice_id": v["voice_id"], "name": v["name"]}
                    for v in voices[:10]
                ]
    except Exception:
        pass

    return []


def vera_narrate_step(step: str, site: Optional[str] = None) -> str:
    """Generate Vera's real-time narration text for an agent step."""
    messages = {
        "planning": "Understood. I'm planning the research now — identifying the best sources to visit.",
        "navigating": f"Now navigating to {site}..." if site else "Navigating to the next source...",
        "extracting": f"Extracting pricing and features from {site}..." if site else "Extracting data from the page...",
        "verifying": "Cross-referencing findings with Perplexity to verify accuracy.",
        "synthesizing": "Synthesizing insights across all sources. Almost done.",
        "complete": "Research complete. Here's what I found.",
    }
    return messages.get(step, f"Processing {step}...")
