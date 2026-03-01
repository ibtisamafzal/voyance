"""
Voyance Agent — ADK-style Plan → Navigate → Extract → Verify → Report loop.
Orchestrates all sub-services and streams real-time updates over WebSocket.
"""

import asyncio
import uuid
from datetime import datetime
from typing import Callable, Awaitable, Optional

from app.models import (
    ResearchSession, SessionStatus, AgentStep,
    NavigationStep, CompetitorData, AgentUpdate,
)
from app.services import gemini_service, browser_service, firecrawl_service, perplexity_service, voice_service
from app.services.firestore_service import save_session


# Callback type: async fn(AgentUpdate) → None
UpdateCallback = Callable[[AgentUpdate], Awaitable[None]]

# Active sessions keyed by session_id
_active_sessions: dict[str, ResearchSession] = {}
# Interrupt signals keyed by session_id
_interrupts: dict[str, str] = {}
# Screenshot cache: session_id → [{step_number, url, screenshot_b64}, ...]
_session_screenshots: dict[str, list[dict]] = {}


def get_session(session_id: str) -> Optional[ResearchSession]:
    return _active_sessions.get(session_id)


def interrupt_session(session_id: str, instruction: str):
    """Signal a running session to redirect."""
    _interrupts[session_id] = instruction


def get_session_screenshots(session_id: str) -> list[dict]:
    """Return cached screenshots for a session (US-04)."""
    return _session_screenshots.get(session_id, [])


async def run_research(
    session: ResearchSession,
    on_update: UpdateCallback,
) -> ResearchSession:
    """
    Main ADK agent loop. Runs asynchronously, calls on_update for each step.
    """
    _active_sessions[session.session_id] = session
    session.status = SessionStatus.RUNNING
    sid = session.session_id

    async def emit(step: AgentStep, message: str, site: str = "", progress: float = 0.0, data: CompetitorData = None):
        """Emit an agent update and optionally generate Vera speech."""
        vera_text = voice_service.vera_narrate_step(step.value, site or None)
        update = AgentUpdate(
            session_id=sid,
            step=step,
            message=message,
            site=site or None,
            progress=progress,
            data=data,
            vera_speech=vera_text,
        )
        session.vera_transcript.append(f"[{step.value.upper()}] {vera_text}")
        try:
            await on_update(update)
        except Exception:
            pass

    try:
        # ── STEP 1: PLANNING ──────────────────────────────────────────────────
        session.current_step = AgentStep.PLANNING
        await emit(AgentStep.PLANNING, "Generating research plan...", progress=0.05)

        # Primary: Perplexity (online, reliable for current tools) — then Gemini
        target_urls: list[str] = []
        competitors = await perplexity_service.search_competitors(session.query)
        for c in competitors:
            w = (c.get("website") or c.get("url") or c.get("link") or "").strip()
            if w and "." in w:
                if not w.startswith("http"):
                    w = f"https://{w}"
                if w not in target_urls:
                    target_urls.append(w)

        if not target_urls:
            plan = await gemini_service.generate_research_plan(session.query, session.max_sites)
            target_urls = [u for u in (plan.get("target_sites") or []) if u and str(u).startswith("http")]
            for u in plan.get("target_sites") or []:
                u = str(u).strip()
                if u and "." in u and u not in target_urls:
                    if not u.startswith("http"):
                        u = f"https://{u}"
                    target_urls.append(u)

        # Fallback: known URLs by query keywords
        if not target_urls:
            q = session.query.lower()
            FALLBACKS = [
                (["voice agent", "voice ai", "ai phone", "conversational ai", "voice bot"], [
                    "https://vapi.ai", "https://bland.ai", "https://retell.ai", "https://vocode.dev", "https://livekit.io",
                ]),
                (["crm", "sales crm", "customer relationship"], [
                    "https://hubspot.com/pricing", "https://salesforce.com", "https://pipedrive.com/pricing",
                    "https://monday.com/pricing", "https://zoho.com/crm",
                ]),
                (["project management", "pm tool", "task management"], [
                    "https://asana.com/pricing", "https://monday.com", "https://clickup.com/pricing",
                    "https://notion.so/pricing", "https://linear.app/pricing",
                ]),
                (["email marketing", "email tool", "newsletter"], [
                    "https://mailchimp.com/pricing", "https://sendinblue.com/pricing", "https://constantcontact.com",
                    "https://convertkit.com/pricing", "https://beehiiv.com",
                ]),
                (["ai writing", "copywriting", "content ai"], [
                    "https://jasper.ai", "https://copy.ai", "https://writesonic.com", "https://rytr.me", "https://surfer.ai",
                ]),
            ]
            for keywords, urls in FALLBACKS:
                if any(k in q for k in keywords):
                    target_urls = urls[:session.max_sites]
                    break

        target_urls = target_urls[:session.max_sites]

        await emit(
            AgentStep.PLANNING,
            f"Plan ready — visiting {len(target_urls)} sites: {', '.join(target_urls[:3])}...",
            progress=0.1,
        )

        # Vera confirms the plan
        confirmation = "Got it! I'll research that for you now. Starting analysis..."
        vera_audio = await voice_service.text_to_speech(confirmation)
        await on_update(AgentUpdate(
            session_id=sid,
            step=AgentStep.PLANNING,
            message=confirmation,
            progress=0.12,
            vera_speech=confirmation,
        ))

        results: list[CompetitorData] = []
        total = len(target_urls)

        # ── STEP 2–4: NAVIGATE → EXTRACT → VERIFY per site ────────────────────
        for i, url in enumerate(target_urls):
            # Check for interrupt
            if sid in _interrupts:
                instruction = _interrupts.pop(sid)
                session.vera_transcript.append(f"[INTERRUPT] {instruction}")
                await emit(AgentStep.PLANNING, f"Redirecting: {instruction}", progress=(i / total) * 0.7)
                # Re-plan based on the interrupt
                plan = await gemini_service.generate_research_plan(instruction, session.max_sites - i)
                new_urls = plan.get("target_sites", [])
                if new_urls:
                    target_urls = list(target_urls[:i]) + new_urls[: (total - i)]

            if not url or not url.startswith("http"):
                continue

            step_base_progress = 0.12 + (i / total) * 0.7

            # ── Navigate ──────────────────────────────────────────────────────
            session.current_step = AgentStep.NAVIGATING
            await emit(AgentStep.NAVIGATING, f"Navigating to {url}...", site=url, progress=step_base_progress)

            screenshot_b64 = None
            nav_step = NavigationStep(
                step_number=i + 1,
                url=url,
                action="screenshot",
            )

            try:
                screenshot_b64, duration_ms = await browser_service.capture_screenshot(url)
                nav_step.duration_ms = duration_ms
                nav_step.screenshot_ref = f"session_{sid[:8]}/{i+1}_{url.split('//')[1][:20]}.png"
                # Store screenshot for replay (US-04)
                if screenshot_b64:
                    _session_screenshots.setdefault(sid, []).append({
                        "step_number": i + 1,
                        "url": url,
                        "screenshot_b64": screenshot_b64,
                    })
            except Exception as e:
                nav_step.action = f"screenshot_failed: {e}"
                # Continue — Firecrawl can extract without screenshot

            session.navigation_log.append(nav_step)
            session.sites_visited += 1

            # ── Extract (Firecrawl fast path → Gemini vision fallback) ────────
            session.current_step = AgentStep.EXTRACTING
            await emit(AgentStep.EXTRACTING, f"Extracting data from {url}...", site=url,
                       progress=step_base_progress + 0.08)

            raw_data = None

            # Try Firecrawl first
            raw_data = await firecrawl_service.scrape_url(url)

            # Fall back to Gemini vision
            if not raw_data and screenshot_b64:
                raw_data = await gemini_service.analyze_screenshot(
                    screenshot_b64,
                    context=f"User researching: {session.query}. Focus on pricing and features.",
                )

            if not raw_data:
                continue

            competitor = gemini_service.structure_competitor_data(raw_data, url)

            # ── Verify ────────────────────────────────────────────────────────
            if competitor.pricing_tiers:
                session.current_step = AgentStep.VERIFYING
                await emit(AgentStep.VERIFYING, f"Verifying {competitor.company} pricing via Perplexity...",
                           site=url, progress=step_base_progress + 0.16)

                claim = f"{competitor.company} pricing is {competitor.pricing_tiers[0].price} per {competitor.pricing_tiers[0].period}"
                verification = await perplexity_service.verify_claim(competitor.company, claim)
                competitor.perplexity_verified = verification["verified"]
                if verification["verified"]:
                    competitor.confidence_score = max(competitor.confidence_score, verification["confidence"])

            # Update confidence enum based on final score
            from app.models import ConfidenceLevel
            if competitor.confidence_score >= 0.8:
                competitor.confidence = ConfidenceLevel.VERIFIED
            elif competitor.confidence_score >= 0.5:
                competitor.confidence = ConfidenceLevel.UNCONFIRMED
            else:
                competitor.confidence = ConfidenceLevel.LOW

            results.append(competitor)
            session.results = results

            await emit(
                AgentStep.EXTRACTING,
                f"✓ {competitor.company} extracted ({competitor.confidence.value})",
                site=url,
                progress=step_base_progress + 0.22,
                data=competitor,
            )

            # Persist session progress
            await save_session(sid, session.model_dump(mode="json"))

            # Small delay to avoid hammering sites
            await asyncio.sleep(0.5)

        # ── STEP 5: SYNTHESIZE ────────────────────────────────────────────────
        session.current_step = AgentStep.SYNTHESIZING
        await emit(AgentStep.SYNTHESIZING, "Synthesizing final report...", progress=0.9)

        results_dicts = [r.model_dump(mode="json") for r in results]
        vera_summary = await gemini_service.synthesize_report(results_dicts, session.query)
        session.vera_summary = vera_summary

        # Generate Vera's spoken briefing
        vera_audio_final = await voice_service.text_to_speech(vera_summary)

        # ── COMPLETE ──────────────────────────────────────────────────────────
        session.current_step = AgentStep.COMPLETE
        session.status = SessionStatus.COMPLETE
        session.updated_at = datetime.utcnow()

        # Save before broadcasting so GET /research/{id} returns results immediately
        await save_session(sid, session.model_dump(mode="json"))

        final_update = AgentUpdate(
            session_id=sid,
            step=AgentStep.COMPLETE,
            message=vera_summary,
            progress=1.0,
            vera_speech=vera_summary,
        )
        await on_update(final_update)

    except Exception as e:
        session.status = SessionStatus.ERROR
        session.error = str(e)
        await emit(AgentStep.COMPLETE, f"Error: {e}", progress=1.0)
        await save_session(sid, session.model_dump(mode="json"))

    finally:
        _active_sessions.pop(sid, None)

    return session
