# Gemini Live Agent Challenge — Voyance Alignment

Reference: [Gemini Live Agent Challenge on Devpost](https://geminiliveagentchallenge.devpost.com/)

**Category:** **UI Navigator**  
**Deadline:** Mar 16, 2026 @ 5:00pm PDT

---

## 1. Category: UI Navigator ✅

**Focus:** Visual UI Understanding & Interaction — agent becomes the user’s hands on screen, observes browser/display, interprets visual elements (with or without DOM), performs actions based on user intent.

| Requirement | Voyance status |
|-------------|-----------------|
| Agent observes browser/device display | ✅ Playwright captures screenshots of pages. |
| Interprets visual elements with or without DOM | ✅ **Zero DOM**: Firecrawl first; when it fails, **Gemini multimodal** interprets **screenshots** (no DOM). |
| Outputs executable actions | ✅ Agent decides which URLs to visit, extracts data, verifies via Perplexity; actions = navigate, extract, verify. |
| **Mandatory tech: Gemini multimodal for screenshots/screen recordings + executable actions** | ✅ `gemini_service.analyze_screenshot()` + structured extraction; agent loop produces navigation and data actions. |
| **Mandatory tech: Agents hosted on Google Cloud** | ⚠️ **Not yet deployed.** Dockerfile + Cloud Build + Terraform ready; need to deploy to Cloud Run (see P0 in PRD_AUDIT). |

**Verdict:** Aligned with UI Navigator. **You must deploy the backend to Google Cloud (e.g. Cloud Run)** before submission.

---

## 2. All Projects MUST ✅ / ⚠️

| Rule | Voyance |
|------|--------|
| **Leverage a Gemini model** | ✅ Gemini 2.0 Flash for: research plan, screenshot analysis, report synthesis, **audio transcribe**. |
| **Agents built with Google GenAI SDK OR ADK** | ✅ **Google GenAI SDK**: `google-generativeai` used for all Gemini calls (vision, plan, transcribe). `google-adk` is in requirements; agent loop is ADK-style (plan → navigate → extract → verify). |
| **Use at least one Google Cloud service** | ⚠️ **Code-ready, not yet live:** Firestore (`google-cloud-firestore`), Cloud Run (Terraform + Cloud Build). Deploy backend to **Cloud Run** to satisfy this. |

**Verdict:** Satisfied once backend is **deployed on GCP** (e.g. Cloud Run). No code change required for “at least one GCP service” if you deploy there.

---

## 3. What to Submit — Checklist

| Item | Status | Notes |
|------|--------|-------|
| **Text description** | 🔲 | Summary, features, tech (Gemini, Firecrawl, Perplexity, ElevenLabs), findings. |
| **Public code repo URL** | 🔲 | GitHub public repo with **spin-up instructions in README** (judges must be able to run it). |
| **Proof of Google Cloud deployment** | 🔲 | **(Required.)** Either: (1) Short screen recording showing app running on GCP (e.g. Cloud Run console / logs), or (2) Link to code that shows GCP usage (e.g. Cloud Run deploy, Firestore). Deploy backend to Cloud Run and record or link. |
| **Architecture diagram** | 🔲 | Clear picture: Gemini ↔ backend ↔ frontend (and Firestore, etc.). Add to Devpost image carousel. |
| **Demo video** | 🔲 | **< 4 minutes.** Real-time demo (no mockups): multimodal/agent features, problem + value. |

---

## 4. Bonus (Optional)

| Bonus | Voyance |
|-------|--------|
| Publish content (blog/video) with #GeminiLiveAgentChallenge | 🔲 Optional. |
| **Automated Cloud deployment (scripts / IaC) in repo** | ✅ **Terraform** (`infra/main.tf`) + **Cloud Build** (`infra/cloudbuild.yaml`) in repo. |
| Sign up for GDG, add profile link on Devpost | 🔲 Optional. |

---

## 5. Judging (for reference)

- **Innovation & Multimodal UX (40%)** — Beyond text box; see/hear/speak; persona (Vera); live, context-aware.
- **Technical implementation & agent architecture (30%)** — GenAI SDK/ADK use; backend on Google Cloud; agent logic; errors; grounding.
- **Demo & presentation (30%)** — Problem/solution; architecture diagram; proof of Cloud; real software in video.

---

## 6. Gaps to Close Before Submitting

1. **Deploy backend to Google Cloud** (Cloud Run) — Required. **Step-by-step:** See **`docs/DEPLOY_TO_CLOUD_RUN.md`** (enable APIs, `gcloud builds submit`, set env vars, verify).
2. **README** — Add clear spin-up instructions (env vars, backend run, frontend run, optional Firestore).
3. **Proof of GCP** — Record a short clip of Cloud Run (or point to deploy code).
4. **Architecture diagram** — Create and add to repo + Devpost.
5. **Demo video** — < 4 min; show live navigation, voice input, Vera, table; state problem and value.
6. **Disclose** — In description, mention ElevenLabs, Firecrawl, Perplexity (and any other data/APIs).

---

## 7. Live API (Optional for UI Navigator)

- **UI Navigator** mandatory tech is **Gemini multimodal** (screenshots + actions), **not** Live API. Voyance already meets that with Gemini vision + agent loop.
- **Live API** is mandatory for the **Live Agents** category. For UI Navigator it can strengthen “innovation & multimodal UX” (e.g. true voice-in with barge-in) but is **not required** for eligibility.
- If you add Live later: see `docs/GEMINI_LIVE_SETUP.md` for setup and free/paid options.
