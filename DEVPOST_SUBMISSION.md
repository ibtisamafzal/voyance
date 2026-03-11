# Voyance

AI-powered visual web research agent — Describe your research task in plain English, watch an intelligent agent navigate live websites with Gemini vision, and get a spoken briefing plus a structured comparison report—no DOM scraping, no site-specific APIs, no coding required.

---

## Project Story

### Inspiration

Competitive research today relies on:
- Brittle CSS selectors that break when sites redesign
- Site-specific scrapers that need constant maintenance
- Manual copy-paste from multiple tabs
- Hours of work for what should take minutes

We imagined a different approach: **What if an AI agent could see the web the way humans do?** Instead of fighting DOM structures, use computer vision + planning to browse like a real analyst. That's Voyance—natural language in, structured intelligence out. Built for the **Gemini Live Agent Challenge** and its **UI Navigator track**, which explicitly asks: *Can an agent observe and interact with interfaces using multimodal vision?*

### What It Does

Voyance turns a natural-language query into competitive intelligence in seconds:

1. **You speak or type** — e.g., *"Compare pricing for the top 5 CRM tools"*
2. **The agent plans** — Gemini 2.0 Flash + Perplexity identify target websites and data points
3. **It navigates** — Playwright headless browser visits 3–5 live sites and captures screenshots
4. **It extracts** — Firecrawl attempts fast structured extraction; if it fails, Gemini multimodal vision reads the screenshots like a human
5. **It verifies** — Perplexity cross-checks key claims (pricing, features) against live web sources
6. **You get**:
   - **Sortable comparison table** — Company, segment, pricing, key features, confidence badges
   - **Spoken briefing** — ElevenLabs persona *Vera* narrates the findings with analyst-grade voice quality
   - **Export** — Download results as CSV or HTML
   - **Live transcript** — Full research pipeline narrated step-by-step in real time

**Zero DOM dependencies.** Works across site redesigns forever, because it reads pages like a human does.

### How We Built It

#### **Agent Loop: Plan → Navigate → Extract → Verify → Report**

All orchestrated in a **custom async agent** using the **Google GenAI SDK** (`google-generativeai`), streamed over WebSockets for real-time UI feedback:

**1. Planning** — Research Intent Generation  
- Primary: **Perplexity API** lookup (e.g., "top 5 CRM tools") → real URLs
- Fallback: **Gemini 2.0 Flash** generates a JSON research plan (intent, target sites, data points, exclusions)
- Keyword-based fallbacks (pre-configured lists) ensure we never have zero targets

**2. Navigation** — Screenshot Capture  
- **Playwright (headless Chromium)** loads each URL
- Captures raw screenshot (base64) — no DOM interaction
- Pixel data becomes the only input for vision analysis

**3. Extraction** — Dual-Path Intelligence  
- **Fast path:** **Firecrawl API** extracts structured data (company, pricing tiers, features, segment) with a small JSON schema. Low latency on "easy" pages.
- **Fallback path:** Base64 screenshot → **Gemini 2.0 Flash multimodal** with vision prompt. Extracts same fields from visual content. Handles SPAs, paywalls, and rate limits gracefully.
- **Robustness:** If company name missing from extraction, infer from domain (e.g., assetpanda.com → "Assetpanda")
- **Inference:** Handle enterprise "Contact sales" pages by returning real tiers like "Enterprise" and "Contact sales" instead of "Unknown"

**4. Verification** — Claim Cross-Check  
- For each competitor and key claim (e.g., "Company X pricing is $49/month"):
  - **Perplexity API** (`sonar` model, citations on, low temperature)
  - Returns `verified` flag + confidence score
  - Drives UI badges: "Verified," "Unconfirmed," "Low Confidence"

**5. Report** — Synthesis & Voice  
- **Gemini 2.0 Flash** aggregates all records and writes a short, conversational narrative
- **ElevenLabs TTS** (Rachel/Vera voice, Multilingual v2 model) renders narrative + step-level narration as MP3
- Frontend plays audio in `<audio>` element; backend returns base64 MP3

**Interrupts (User Redirection):**  
- Users can say "skip this site" or "focus on HubSpot" mid-run
- Agent stores instruction, re-plans with Gemini, adjusts URL list on next iteration

#### **Tech Stack Overview**

| Layer | Technology |
|-------|-----------|
| **AI & Multimodal** | Gemini 2.0 Flash (planning, vision, synthesis) |
| **Browser** | Playwright + Chromium headless (screenshot-based only) |
| **Extraction** | Firecrawl API (primary); Gemini vision (fallback) |
| **Verification** | Perplexity API (claim checking, URL discovery) |
| **Voice** | ElevenLabs TTS (Vera persona, multilingual) |
| **Backend** | FastAPI, WebSockets, Python 3.11 |
| **Frontend** | React 19, Vite, Tailwind CSS |
| **State & Sessions** | Google Firestore (session storage) |
| **Infrastructure** | Docker, Google Cloud Build, Terraform (`infra/`), Cloud Run deployment |
| **Session Caching** | In-memory (default) + Firestore persistence |

#### **Frontend Features**

- **Hero Section** — Natural language input (text or optional voice transcription)
- **Live Progress Feed** — Real-time UI updates over WebSocket; shows which site is being researched and which step is active
- **Output Section**:
  - Sortable, filterable comparison table
  - **Listen to Vera** button → plays MP3 briefing
  - CSV/HTML export buttons
  - Source link tracking (which URL each row came from)
- **Architecture Diagram** — Interactive 3-zone visualization of the system (Input → Processing → Output)
- **Mobile-responsive** — Hero, table, and controls adapt to all screen sizes
- **Accessibility** — Aria labels, keyboard navigation, WCAG AA compliance

#### **Deployment & IaC (Bonus: Automated Cloud Deployment)**

- **Cloud Run:** FastAPI backend + Playwright container (requires 1 GiB memory, 1 CPU for browser headroom)
- **Cloud Build:** Automated pipeline (`infra/cloudbuild.yaml`) — commits trigger build → deploy to Cloud Run
- **Terraform** (`infra/main.tf`) — Infrastructure-as-code for Cloud Run service, Firestore, and networking
- **Secret Manager** — All API keys (Gemini, ElevenLabs, Firecrawl, Perplexity) stored securely
- **Frontend:** Vercel deployment with environment-based API URL injection

### Challenges We Ran Into

**1. Screenshot Parsing at Scale**  
- **Problem:** Gemini vision can be slow and noisy on complex pages. URLs like "Unknown Company" when logo isn't in screenshot.
- **Solution:** Fallback to URL-based inference (e.g., extract domain name when vision fails). Also batch similar sites and cache screenshots per session.

**2. WebSocket Timeout on Cloud Run**  
- **Problem:** Load-balancer idle timeout (~10s) dropped long-running agent sessions.
- **Solution:** Client-side ping every 5s; if connection drops, frontend polls backend for latest session state. Graceful degradation.

**3. Hallucinations & Unverified Data**  
- **Problem:** Gemini would invent pricing or features on extraction fallback.
- **Solution:** Perplexity verification step: "Is Company X pricing $49/month?" cross-checked against live web + citations. Only report what Perplexity confirms or flag as "Unconfirmed."

**4. Playwright Memory & Timeout**  
- **Problem:** Chromium headless needed >512 MiB; some sites took >30s to load or were unresponsive.
- **Solution:** Increased Cloud Run to 1 GiB, added request timeout (30s), and parallel site visits (up to 5 concurrent navigations).

**5. Firecrawl Failures & Rate Limits**  
- **Problem:** Firecrawl didn't always return structured data; sometimes rate-limited.
- **Solution:** Graceful fallback to Gemini vision. Also pre-configure extraction schema so retries are fast.

**6. Live Voice During Agent Execution**  
- **Problem:** Users wanted to hear narration *as the agent works*, not just a final summary.
- **Solution:** Step-level TTS: ElevenLabs narrates each step ("Visiting HubSpot… accessing pricing page…") in real time, streamed to frontend.

### Accomplishments We're Proud Of

1. **True Visual UI Navigation** — Zero DOM dependency. Works on any site redesign forever. Demonstrates the Gemini Live Agent Challenge's core value: agents that *see* like humans.

2. **Hybrid Extraction Pipeline** — Firecrawl + Gemini vision fallback = fast *and* robust. We never "give up" on a page; we always have a path forward.

3. **Production-Grade Verification** — Perplexity fact-checking prevents hallucinated prices and features from appearing in reports. Analyst-level trustworthiness.

4. **Intelligent Interrupts** — Mid-run user feedback (e.g., "focus on Salesforce") triggers re-planning without losing session state. Agentic flexibility.

5. **Vera Voice Briefings** — ElevenLabs persona Vera makes reports feel *human*. Step narration + final synthesis = immersive research experience.

6. **Infrastructure-as-Code (IaC) Bonus** — Full Terraform + Cloud Build pipeline ready to deploy. Production-grade setup for a hackathon project.

7. **Comprehensive Documentation** — Blog post (Dev.to), README with spin-up instructions, architecture diagrams, and API docs. Judges can understand *and* run the project.

### What We Learned

1. **Multimodal Vision > DOM Scraping**  
   - Brittle CSS selectors break. Screenshot-based understanding is more resilient and future-proof.
   - Lesson: When building agents, prioritize human-like perception (vision) over brittle APIs.

2. **User Feedback in Agentic Loops**  
   - Users want *control* mid-execution, not just fire-and-forget agents.
   - Implementing interrupts + re-planning was key to making the agent feel trustworthy and responsive.

3. **Verification Separates Hallucinations from Facts**  
   - LLMs are great at extraction, but terrible at truthfulness without grounding.
   - Perplexity fact-checks turned our agent from "cool demo" to "business-ready tool."

4. **WebSockets Are Fragile; Fallback Polling Matters**  
   - Real-world production deployments require resilience.
   - Graceful degradation (WebSocket → polling) ensured our agent worked reliably on cloud infrastructure.

5. **Memory Budgets for Playwright**  
   - Headless browser is resource-hungry. 512 MiB ≠ enough. 1 GiB was the breakeven for 5 concurrent navigations + Gemini calls.

6. **Stream Everything**  
   - Real-time WebSocket updates made the experience feel *alive*. Users saw progress, heard Vera narrate, and felt agency over the agent.
   - Lesson: Agentic UX is about feedback loops, not silent processing.

### What's Next for Voyance

1. **Gemini Live API Integration** — End-to-end voice: user speaks → Gemini Live transcribes + interprets → agent plans & executes. True voice-first research.

2. **Screenshot Replay & Source Linking** — Expose stored screenshots per session in a carousel UI. Every table row links to the screenshot it was extracted from (transparent, auditable extraction).

3. **Stronger Fact-Checking** — Structured Perplexity output (JSON claims + citations). Multi-claim verification per competitor. Confidence confidence scoring.

4. **Custom Research Schemas** — Let users define what to extract (not just pricing & features). Flexible reusable schemas for different industries.

5. **Scheduled Reports** — "Compare these 5 tools every Monday" → recurring multi-site research + email summaries.

6. **Competitor Tracking Dashboard** — Historical pricing trends, feature parity charts, market insights over time.

7. **Multi-Language Support** — Extend Vera's voice support. Perplexity verification in other languages.

---

## Built With

### Core AI & Multimodal
- **Gemini 2.0 Flash** — LLM backbone for planning, screenshot analysis, report synthesis
- **Google GenAI SDK** (`google-generativeai`) — Official SDK for all Gemini API calls
- **Gemini Multimodal Vision** — Screenshot-based understanding (zero DOM)

### Data Sources & Verification
- **Perplexity API** (`sonar` model) — URL discovery, fact verification, live web grounding
- **Firecrawl API** — Structured extraction fallback (markdown, JSON schema)

### Browser & Navigation
- **Playwright** — Headless Chromium, screenshot capture, zero-selector browsing
- **Chromium** — Browser engine in Docker container

### Voice & Audio
- **ElevenLabs API** — Vera TTS (Rachel voice, Multilingual v2, adaptive tuning)

### Backend
- **FastAPI** — HTTP server, REST API, WebSocket server
- **WebSockets** — Real-time bidirectional communication (agent updates → UI)
- **Python 3.11** — Server language
- **Pydantic** — Request/response validation

### State & Data
- **Google Firestore** — Session persistence, research results storage
- **Google Cloud Storage** (optional) — Screenshot archival

### Frontend
- **React 19** — UI framework
- **Vite** — Lightning-fast build tool
- **Tailwind CSS** — Utility-first styling
- **Radix UI** — Accessible component primitives
- **Framer Motion** — Smooth animations
- **Lucide React** — Icon library

### Infrastructure & Deployment
- **Docker** — Containerization (backend + Playwright)
- **Google Cloud Run** — Serverless backend hosting
- **Google Cloud Build** — CI/CD automation
- **Terraform** — Infrastructure-as-Code (IaC)
- **Vercel** — Frontend deployment
- **Google Secret Manager** — API key management

### Development & Testing
- **Uvicorn** — ASGI server
- **pydantic-multipart** — File upload support
- **python-dotenv** — Environment configuration
- **GitHub** — Version control & collaboration

---

## Try It Out

### 🚀 Live Demo
- **Website:** [https://voyance-beta.vercel.app/](https://voyance-beta.vercel.app/)
- **Architecture Diagram:** [See interactive diagram on site](https://voyance-beta.vercel.app/#architecture)

### 💻 Source Code
- **GitHub Repository:** [https://github.com/ibtisamafzal/voyance](https://github.com/ibtisamafzal/voyance)  
  Full source with README, quick-start guide, and reproducible testing instructions.

### 📖 Blog & Documentation
- **Dev.to Article:** [How We Built Voyance: An AI Agent That Researches the Web by 'Seeing' It](https://dev.to/ibtisamafzal/how-we-built-voyance-an-ai-agent-that-researches-the-web-by-seeing-it-214h)  
  Detailed technical deep-dive: agent loop, Gemini vision, ElevenLabs integration, lessons learned.

- **GitHub README:** Includes:
  - Quick-start (clone, install, run)
  - Backend setup (`pip install -r requirements.txt`)
  - Frontend setup (`npm install && npm run dev`)
  - Environment variables (`.env.example`)
  - Testing instructions (how to run a research task)
  - Architecture diagram
  - Hackathon alignment checklist

### 🎯 Spin-Up Instructions (5 minutes)

**Prerequisites:**
- Node.js 18+
- Python 3.10+
- API Keys: Gemini (Google AI Studio), ElevenLabs, Firecrawl, Perplexity

**Steps:**

1. **Clone & Install**
   ```bash
   git clone https://github.com/ibtisamafzal/voyance.git
   cd voyance
   npm install
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   playwright install chromium
   cp .env.example .env
   # Edit .env with your API keys
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

3. **Frontend Setup** (new terminal, from repo root)
   ```bash
   npm run dev
   ```

4. **Test the Agent**
   - Open http://localhost:5173
   - Enter: *"Compare pricing for top 5 CRM tools"*
   - Click **Research**
   - Watch the agent plan, navigate, extract, and verify in real time
   - Listen to Vera's spoken briefing

---

## Reproducible Testing

✅ Testing guide is in the [GitHub README](https://github.com/ibtisamafzal/voyance#quick-start).

Included in README:
- Step-by-step backend & frontend startup
- Environment variable setup (`.env.example` → `.env`)
- API documentation (http://localhost:8000/api/docs)
- Example research queries
- Screenshots of expected output (hero, results table, Vera audio player)
- Troubleshooting (WebSocket connection, Playwright headless, Firestore emulator)

---

## Bonus: Automated Cloud Deployment (IaC)

✅ Infrastructure-as-Code is in the `infra/` folder.

**Files:**
- **`infra/cloudbuild.yaml`** — Google Cloud Build pipeline:
  - Triggers on commit/push
  - Builds Docker image
  - Deploys to Cloud Run
  - Sets environment variables from Secret Manager

- **`infra/main.tf`** — Terraform:
  - Cloud Run service definition (backend)
  - Firestore database
  - IAM roles & permissions
  - Environment variables & secrets

**To Deploy:**
```bash
# 1. Authenticate
gcloud auth login
gcloud config set project YOUR_GCP_PROJECT

# 2. Push repo to Google Cloud Source Repository or GitHub (linked to Cloud Build)

# 3. Create Cloud Build trigger pointing to infra/cloudbuild.yaml

# 4. Deploy infrastructure
terraform init
terraform apply -var="gcp_project=YOUR_PROJECT" -var="region=us-central1"
```

**Result:** Backend auto-deploys on every push; all infrastructure versioned & reproducible.

