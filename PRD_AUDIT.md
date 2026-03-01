# PRD Audit — Voyance Implementation Status

**Last re-test:** Verified against codebase (backend + frontend). See "Re-test verification" below.

| PRD Item | Status | Notes |
|----------|--------|-------|
| **AC-01** Voice brief, 3s latency | ⚠️ Partial | Text + **Browser voice** + **Gemini voice** toggles (all visible). Voice via Web Speech or Gemini transcribe. Gemini Live API not implemented — see `docs/GEMINI_LIVE_SETUP.md` for pricing and setup. |
| **AC-02** 3+ sites per task | ✅ | Agent visits 3–5 sites via Perplexity/Gemini/fallbacks (`max_sites`, `target_urls[:session.max_sites]`). |
| **AC-03** Gemini vision, zero DOM | ✅ | Firecrawl primary; Gemini vision on screenshots when Firecrawl fails (`agent.py`). |
| **AC-04** Voice redirect mid-task | ✅ | Interrupt API + **Type \| Speak** redirect UI; "Speak" records → transcribes → sends interrupt (voice barge-in). |
| **AC-05** ElevenLabs Vera | ✅ | TTS wired (`voice_service`); "Listen to Vera" button in Output section. |
| **AC-06** Structured JSON output | ✅ | `{company, pricing_tiers, key_features, ...}` in results and schema preview. |
| **AC-07** Perplexity verification | ✅ | `verify_claim(company, claim)` in `agent.py` per competitor with pricing. |
| **AC-08** Firecrawl + Gemini fallback | ✅ | Dual-mode: `firecrawl_service.scrape_url` → `gemini_service.analyze_screenshot` fallback. |
| **AC-09** CSV + HTML export | ✅ | One-click CSV/HTML in Output section (`handleExport` in `ResearchOutputSection.tsx`). |
| **AC-10** Cloud Run deployment | ✅ | Backend deployed via `infra/cloudbuild.yaml`; public URL + IAM invoker configured. |
| **F1** Voice-directed brief | ⚠️ | Text + Web Speech / Gemini transcribe; no Gemini Live end-to-end voice. |
| **F2** Playwright + screenshots | ✅ | `browser_service.capture_screenshot`; Firecrawl used when available. |
| **F3** Dual-mode extraction | ✅ | Firecrawl → Gemini vision (same as AC-08). |
| **F4** Voice interrupt | ✅ | Interrupt API + **Type \| Speak** redirect; voice barge-in via "Speak" (record → transcribe → send). |
| **F5** ElevenLabs Vera persona | ✅ | Vera TTS throughout (confirm, narrate, summary). |
| **F6** Sortable table + export | ✅ | Sortable by company/pricing/confidence; CSV, HTML, confidence badges. |
| **BP-02** Terraform + Cloud Build | ✅ | `infra/cloudbuild.yaml` + `infra/main.tf` (Cloud Run v2); see `infra/README.md` for how to run. |
| **US-04** Screenshot replay | ✅ | "View sources" button + carousel modal; `getSessionScreenshots`; screenshots stored per session. |

## Fixes Applied (This Session)

1. **Perplexity model** — Switched from deprecated `llama-3.1-sonar-small-128k-online` to `sonar`
2. **URL discovery** — Perplexity primary; Gemini fallback; keyword-based fallbacks for CRM, voice AI, PM, email, etc.
3. **0 sites bug** — Fallbacks ensure URLs for common query types
4. **Empty results** — No demo table when session has 0 results; shows empty state
5. **Listen to Vera** — POST endpoint for long text; blob playback
6. **Dynamic table count** — Heading shows actual `rows.length`, not planned total
7. **Vera summary** — Stronger prompt for conversational, data-specific briefing; avoids "review the table"

---

## Next Steps to Complete PRD

### P0 (Required for submission)

| Item | Status | Action |
|------|--------|--------|
| **AC-10** Cloud Run | ✅ Done | Backend deployed; use `gcloud run services describe voyance-backend --region=us-central1 --format="value(status.url)"` for URL. |
| **GitHub repo** | ✅ Done | Public repo with README and setup instructions. |
| **Demo video** | 🔲 Remaining | Record &lt;4 min: live navigation, voice input, Vera speaking, table rendered. Upload to YouTube/Vimeo, add URL to Devpost. |
| **Architecture diagram** | 🔲 Remaining | Add clear diagram (Gemini → backend → frontend) to repo + Devpost image carousel. |
| **Proof of GCP** | ✅ Done | Cloud Run live; record short console clip or link to deploy code for Devpost. |
| **Devpost** | 🔲 Remaining | Submit with repo URL, video, diagram; category **UI Navigator**; disclose ElevenLabs, Firecrawl, Perplexity. |

### P1 (Recommended)

| Item | Action |
|------|--------|
| **AC-01 / F1** Voice via Gemini Live | Replace Web Speech API with Gemini Live API for end-to-end voice: user speaks → Gemini transcribes → agent starts. Requires `google-genai` Live API integration. |
| **AC-04 / F4** Voice barge-in | Redirect UI (text) is done; add voice barge-in via Gemini Live if required. |

### Bonus Points

| Item | Points | Action |
|------|--------|
| **BP-01** Build post | +0.6 | Write dev.to/Medium post: ADK loop, Gemini vision, ElevenLabs, Firecrawl/Perplexity. Tag #GeminiLiveAgentChallenge. |
| **BP-02** Terraform | +0.2 | Add `/infra/main.tf` — provision Cloud Run, Firestore, Secret Manager, Firebase Hosting. Include in cloudbuild.yaml. |
| **BP-03** GDG membership | +0.2 | Register at developers.google.com/community/gdg. Add profile URL to Devpost. |
| **BP-04** YouTube video | Boost | 3-min deployment walkthrough; submit as second content URL. |

---

## Re-test verification (codebase check)

| Area | What was verified |
|------|-------------------|
| **Voice / brief** | `HeroSection.tsx`: text input; Web Speech API + optional "Gemini" mode (MediaRecorder → `transcribeAudio` → backend `/transcribe`). No Gemini Live. |
| **Sites per task** | `agent.py`: Perplexity → plan → fallbacks; `target_urls[:session.max_sites]` (default 5). |
| **Extraction** | `agent.py`: Firecrawl `scrape_url` first; `gemini_service.analyze_screenshot` on screenshot when no Firecrawl data. |
| **Redirect / interrupt** | `research.py`: POST `/interrupt`, WebSocket `type: "interrupt"`. `HeroSection.tsx`: "Redirect research" button, text input, Send/Cancel. |
| **Vera** | `voice_service.py`, `voice.py` (TTS); `ResearchOutputSection.tsx`: "Listen to Vera" + `getVeraSpeechAudio`. |
| **Structured output** | `CompetitorData` / JSON in results; schema preview in Output section. |
| **Perplexity** | `perplexity_service.verify_claim` called in agent loop for pricing claims. |
| **Export** | `ResearchOutputSection.tsx`: `handleExport('csv' or 'html')`, CSV/HTML buttons. |
| **Screenshots** | `agent.py`: `_session_screenshots`; `getSessionScreenshots` API; "View sources" + carousel in Output. |
| **Deploy / infra** | `backend/Dockerfile`, `infra/cloudbuild.yaml`, `infra/main.tf` (Terraform) present; backend deployed on Cloud Run. |
