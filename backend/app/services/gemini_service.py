"""
Gemini Service — multimodal vision + plan generation
Uses Gemini 2.0 Flash for screenshot analysis and research planning.
"""

import os
import base64
import json
import re
from typing import Optional
import google.generativeai as genai
from app.models import CompetitorData, PricingTier, ConfidenceLevel

genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))

MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")


def _model() -> genai.GenerativeModel:
    return genai.GenerativeModel(MODEL_NAME)


async def generate_research_plan(query: str, max_sites: int = 5) -> dict:
    """
    Given a natural language query, produce a structured research plan.
    Returns: { intent, target_sites: [url], data_points: [str], exclusions: [str] }
    """
    prompt = f"""You are Vera, Voyance's research agent. A user said: "{query}"

Produce a JSON research plan with these fields:
- intent: one-sentence description of what they want
- confirmation_message: what Vera should say to confirm (warm, confident tone, 1-2 sentences)
- target_sites: list of up to {max_sites} website URLs to visit (just the homepage or pricing page)
- data_points: list of data types to extract (e.g., "pricing", "features", "target segment")
- exclusions: list of any sites/topics to skip
- search_queries: list of Perplexity search queries to verify findings (max 3)

Respond ONLY with valid JSON. No markdown.
"""
    try:
        model = _model()
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Strip markdown code fences if present
        text = re.sub(r'^```(?:json)?\n?', '', text).rstrip('`').strip()
        return json.loads(text)
    except Exception as e:
        # Fallback: return empty target_sites so agent uses Perplexity to find real URLs
        return {
            "intent": query,
            "confirmation_message": f"Got it! I'll research that for you now. Starting analysis...",
            "target_sites": [],
            "data_points": ["pricing", "features", "target segment"],
            "exclusions": [],
            "search_queries": [query],
            "error": str(e),
        }


async def analyze_screenshot(screenshot_b64: str, context: str = "") -> dict:
    """
    Send a screenshot to Gemini Vision and extract structured competitive data.
    Returns raw extraction dict.
    """
    prompt = f"""You are a visual research analyst. Analyze this webpage screenshot.
Context: {context}

Extract and return ONLY valid JSON with these fields:
- company_name: string
- page_type: "pricing" | "features" | "homepage" | "other"
- pricing_tiers: array of {{name, price, period, seats}}
- key_features: array of strings (max 8)
- target_segment: string (e.g., "Enterprise", "SMB", "Startup")
- cta_text: string (primary call to action button text)
- confidence: float 0-1 (how confident you are in the data)
- notes: any other relevant observations

Respond ONLY with valid JSON. No markdown.
"""
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        image_part = {"inline_data": {"mime_type": "image/png", "data": screenshot_b64}}
        response = model.generate_content([prompt, image_part])
        text = response.text.strip()
        text = re.sub(r'^```(?:json)?\n?', '', text).rstrip('`').strip()
        return json.loads(text)
    except Exception as e:
        return {
            "company_name": "Unknown",
            "page_type": "other",
            "pricing_tiers": [],
            "key_features": [],
            "target_segment": "Unknown",
            "confidence": 0.3,
            "error": str(e),
        }


async def synthesize_report(results: list[dict], query: str) -> str:
    """
    Given extracted data from all sites, produce Vera's spoken summary.
    Returns plain text ready for TTS — dynamic, conversational, specific to the data.
    """
    if not results:
        return "Research complete. No data was extracted from the sites visited. Try a different query or check back later."
    results_text = json.dumps(results, indent=2, default=str)
    prompt = f"""You are Vera, Voyance's research agent — warm, analytical, conversational.

The user asked: "{query}"

Here is the structured data collected from {len(results)} sites:
{results_text}

Write a spoken briefing (4-6 sentences) that:
1. Opens by confirming what you researched ("I looked into X for you...")
2. Narrates 2-3 specific findings — mention company names, actual prices, and standout features by name
3. Compares them briefly ("A is great for Y, while B offers Z at $X")
4. Recommends the best option for the user's need with a short reason
5. Ends with one actionable next step (e.g. "I'd start a trial with...")

Be specific. Say actual numbers, company names, and features. Sound like a knowledgeable colleague briefing them — NOT like a generic assistant. Never say "review the table" or "see the comparison below". Give them the insights directly.
Write as natural speech only. No markdown, bullets, or headers."""
    try:
        model = _model()
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception:
        companies = [r.get("company", "Unknown") for r in results[:3]]
        return f"Research complete. I analyzed {', '.join(companies)}{' and more' if len(results) > 3 else ''}. The comparison table has the full details — pricing, features, and confidence scores for each."


async def transcribe_audio(audio_bytes: bytes, mime_type: str = "audio/webm") -> str:
    """
    Transcribe audio using Gemini (AC-01). Returns plain text transcript.
    Supports audio/webm, audio/mp4, audio/mpeg, audio/wav.
    """
    try:
        model = _model()
        audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")
        # Map common types; Gemini supports audio/webm, audio/mp4, audio/mpeg, etc.
        if mime_type not in ("audio/webm", "audio/mp4", "audio/mpeg", "audio/wav", "audio/ogg"):
            mime_type = "audio/webm"  # fallback for unknown
        prompt = "Transcribe this audio accurately. Return only the transcribed text, nothing else. Do not add punctuation beyond what you hear."
        audio_part = {"inline_data": {"mime_type": mime_type, "data": audio_b64}}
        response = model.generate_content([prompt, audio_part])
        return (response.text or "").strip()
    except Exception as e:
        raise ValueError(f"Gemini transcription failed: {e}") from e


def structure_competitor_data(raw: dict, url: str) -> CompetitorData:
    """Convert raw Gemini extraction into a CompetitorData model."""
    conf_score = raw.get("confidence", 0.5)
    if conf_score >= 0.8:
        confidence = ConfidenceLevel.VERIFIED
    elif conf_score >= 0.5:
        confidence = ConfidenceLevel.UNCONFIRMED
    else:
        confidence = ConfidenceLevel.LOW

    tiers = []
    for t in raw.get("pricing_tiers", []):
        if isinstance(t, dict):
            tiers.append(PricingTier(
                name=str(t.get("name", "Standard")),
                price=str(t.get("price", "N/A")),
                seats=t.get("seats"),
                period=str(t.get("period", "month")),
            ))

    return CompetitorData(
        company=raw.get("company_name", "Unknown"),
        website=url,
        pricing_tiers=tiers,
        key_features=raw.get("key_features", []),
        target_segment=raw.get("target_segment", ""),
        source_url=url,
        confidence_score=conf_score,
        confidence=confidence,
        perplexity_verified=False,
    )
