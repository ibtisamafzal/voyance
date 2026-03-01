# Voyance AI — Visual Web Research Agent

AI-powered autonomous web research agent that navigates browsers visually. Users speak a research task in natural language; Voyance visits live websites, extracts structured data, and returns a spoken briefing with a downloadable comparison report.

**Track:** UI Navigator | **Hackathon:** Gemini Live Agent Challenge 2026

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- API keys: Gemini, ElevenLabs, Firecrawl, Perplexity (see `.env.example`)

### Frontend

```bash
npm install
npm run dev
```

Runs at **http://localhost:5173**

### Backend

```bash
cd backend
pip install -r requirements.txt
playwright install chromium
cp .env.example .env
# Edit .env with your API keys
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Runs at **http://localhost:8000** · Docs at **http://localhost:8000/api/docs**

### End-to-end Flow

1. Enter a research query in the hero (e.g. "Compare pricing for top 5 CRM tools")
2. Click **Research** — the agent plans, navigates, extracts, and verifies
3. View real-time progress and scroll to the Output section when complete
4. Sort, export CSV/HTML, and **Listen to Vera** for the spoken briefing

## Stack

| Layer | Technology |
|-------|------------|
| AI | Gemini 2.0 Flash (vision + planning) |
| Browser | Playwright (headless Chromium) |
| Extraction | Firecrawl API → Gemini vision fallback |
| Verification | Perplexity API |
| Voice | ElevenLabs TTS (Vera persona) |
| Backend | FastAPI + WebSocket |
| Frontend | React + Vite + Tailwind |

## Environment Variables

Create `backend/.env` from `backend/.env.example`:

- `GEMINI_API_KEY` — Google AI Studio
- `ELEVENLABS_API_KEY`
- `FIRECRAWL_API_KEY`
- `PERPLEXITY_API_KEY`
- `GOOGLE_CLOUD_PROJECT` — optional (Firestore); in-memory fallback if unset

## Project Structure

```
├── src/app/           # React frontend
│   ├── components/    # HeroSection, ResearchOutputSection, etc.
│   └── context/      # ResearchContext (shared state)
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── agent.py   # ADK-style research loop
│   │   ├── routers/   # Research, voice, health, sessions
│   │   └── services/  # Gemini, Firecrawl, Perplexity, Playwright, ElevenLabs
│   └── main.py
└── prd_extracted/     # PRD source
```

## Deployment

- **Backend (Cloud Run):** [docs/DEPLOY_TO_CLOUD_RUN.md](docs/DEPLOY_TO_CLOUD_RUN.md)
- **Get URL, test, GitHub, frontend (Vercel):** [docs/DEPLOY_FRONTEND_GITHUB.md](docs/DEPLOY_FRONTEND_GITHUB.md)

## License

MIT
