# Voyance

**AI-powered visual web research agent** — speak a task, watch it navigate live sites with Gemini vision, get a spoken briefing and a comparison report.

[![Gemini Live Agent Challenge 2026](https://img.shields.io/badge/Gemini%20Live%20Agent%20Challenge-2026-4285F4?style=flat&logo=google)](https://geminiliveagentchallenge.devpost.com/)  
**Track:** [UI Navigator](https://geminiliveagentchallenge.devpost.com/) · **Category:** Visual UI understanding & interaction

---

## What it does

Voyance turns **natural language** into **competitive intelligence** in minutes:

1. **You say** what you need — e.g. *"Compare pricing for the top 5 CRM tools"*.
2. **The agent** plans, visits 3–5 live websites, and “reads” pages with **Gemini multimodal vision** (screenshots only — no DOM scraping).
3. **You get** a sortable comparison table, CSV/HTML export, and **Vera** (ElevenLabs) reading the briefing aloud.

No DOM hacks, no site-specific APIs. It works on any site, through redesigns, forever.

---

## Hackathon alignment

| Requirement | Voyance |
|-------------|---------|
| **Leverage a Gemini model** | ✅ Gemini 2.0 Flash for planning, screenshot analysis, synthesis, and optional transcribe. |
| **Google GenAI SDK or ADK** | ✅ `google-generativeai` + ADK-style agent loop (plan → navigate → extract → verify). |
| **At least one Google Cloud service** | ✅ Backend hosted on **Google Cloud Run**. |
| **UI Navigator: Gemini multimodal + executable actions** | ✅ Screenshots analyzed by Gemini vision; agent outputs navigation and extraction actions. |

**Third-party integrations (disclosed):** ElevenLabs (Vera TTS), Firecrawl (fast extraction), Perplexity (fact verification).

---

## Quick start (for judges & developers)

### Prerequisites

- **Node.js** 18+
- **Python** 3.10+
- **API keys:** [Google AI Studio](https://aistudio.google.com/) (Gemini), [ElevenLabs](https://elevenlabs.io/), [Firecrawl](https://firecrawl.dev/), [Perplexity](https://www.perplexity.ai/) — see `backend/.env.example`.

### 1. Clone and install

```bash
git clone https://github.com/ibtisamafzal/voyance.git
cd voyance
npm install
```

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
playwright install chromium
cp .env.example .env
# Edit .env with your API keys
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Backend: **http://localhost:8000** · API docs: **http://localhost:8000/api/docs**

### 3. Frontend

From the **repo root** (new terminal):

```bash
npm run dev
```

Frontend: **http://localhost:5173**

### 4. Run a research task

1. Enter a query in the hero (e.g. *"Compare pricing for top 5 CRM tools"*).
2. Click **Research** — the agent plans, navigates, extracts, and verifies.
3. In the Output section: sort the table, export **CSV** or **HTML**, and click **Listen to Vera** for the spoken briefing.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| **AI & vision** | Gemini 2.0 Flash (planning, screenshot analysis, synthesis) |
| **Browser** | Playwright (headless Chromium), screenshot-based only |
| **Extraction** | Firecrawl API → Gemini vision fallback when blocked |
| **Verification** | Perplexity API (claim verification) |
| **Voice** | ElevenLabs TTS (Vera persona) |
| **Backend** | FastAPI, WebSockets; deployed on **Google Cloud Run** |
| **Frontend** | React, Vite, Tailwind |
| **Infra** | Docker, Cloud Build, Terraform (`infra/`) |

---

## Environment variables

Copy `backend/.env.example` to `backend/.env` and set:

| Variable | Purpose |
|----------|---------|
| `GEMINI_API_KEY` | Google AI Studio |
| `ELEVENLABS_API_KEY` | Vera TTS |
| `FIRECRAWL_API_KEY` | Fast extraction path |
| `PERPLEXITY_API_KEY` | Fact verification |
| `GOOGLE_CLOUD_PROJECT` | Optional (Firestore); in-memory fallback if unset |

---

## Deployment

| Target | Guide |
|--------|--------|
| **Backend (Cloud Run)** | [docs/DEPLOY_TO_CLOUD_RUN.md](docs/DEPLOY_TO_CLOUD_RUN.md) |
| **Frontend (Vercel) + GitHub** | [docs/DEPLOY_FRONTEND_GITHUB.md](docs/DEPLOY_FRONTEND_GITHUB.md) |

**Proof of Google Cloud:** Backend runs on Cloud Run; deploy via `infra/cloudbuild.yaml`. See Cloud Run console or the deploy doc for verification.

---

## Project structure

```
├── src/app/              # React frontend
│   ├── components/       # HeroSection, ResearchOutputSection, Navbar, etc.
│   └── context/         # ResearchContext (shared state)
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── agent.py      # Research loop (plan → navigate → extract → verify)
│   │   ├── routers/      # Research, voice, health, sessions
│   │   └── services/     # Gemini, Firecrawl, Perplexity, Playwright, ElevenLabs
│   └── main.py
├── infra/                 # GCP automation (bonus)
│   ├── cloudbuild.yaml   # Build & deploy to Cloud Run
│   └── main.tf           # Terraform (Cloud Run, etc.)
└── docs/                  # Deployment and setup guides
```

---

## Implementation status

- **Done:** 3+ sites per task, Gemini vision (zero DOM), Firecrawl + Gemini fallback, Perplexity verification, ElevenLabs Vera, CSV/HTML export, voice redirect (Type | Speak), Cloud Run deployment, Terraform + Cloud Build, screenshot replay.
- **Partial:** Voice brief via Web Speech / Gemini transcribe (Gemini Live API not wired end-to-end).
- **Remaining for submission:** Demo video (&lt;4 min), architecture diagram, Devpost submission with all links and disclosures.

---

## Links

- **Hackathon:** [Gemini Live Agent Challenge](https://geminiliveagentchallenge.devpost.com/) (Deadline: Mar 16, 2026)
- **Category:** [UI Navigator](https://geminiliveagentchallenge.devpost.com/) — visual UI understanding & interaction
- **Alignment:** [docs/HACKATHON_ALIGNMENT.md](docs/HACKATHON_ALIGNMENT.md)

---

## License

MIT
