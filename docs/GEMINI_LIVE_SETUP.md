# Gemini Live API — Configuration & Setup

This guide answers: **Are these APIs paid?** and **What you need to do** to use the Live API, using the official docs you linked.

---

## 1. Are the Live API and Gemini APIs paid?

**Yes.** Both the standard Gemini API (which Voyance already uses for transcribe, vision, planning) and the **Gemini Live API** are paid, with a **free tier** and then usage-based pricing.

- **Official pricing:** [Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- **Live API specifics:**
  - **Audio input:** ~\$2.10 per million tokens (1 second of audio ≈ 32 tokens).
  - **Text/output:** Depends on the model (e.g. Gemini 2.0 Flash); see the pricing page.
  - **Rough example:** ~1 hour of Live audio input ≈ 115,200 tokens ≈ ~\$0.24 for input; total cost depends on model output and conversation length.

You can use the same **API key** for both standard Gemini and Live API. Billing is per project in [Google AI Studio](https://aistudio.google.com/) / Google Cloud.

**What you need to do:** Ensure billing is set up for the project that owns your API key (free tier still requires a billing account in many regions). No separate “enable Live” step is required beyond having a valid Gemini API key.

---

## 1b. Is there a way to use the Live API (or Gemini) for free? GCP $300 credits?

**Yes — several options:**

### Gemini API free tier (Google AI Studio)

- **No credit card required** for the free tier in many regions. You get a limited quota (e.g. 5–15 RPM, daily caps). See [Gemini API billing](https://ai.google.dev/gemini-api/docs/billing) and [rate limits](https://ai.google.dev/gemini-api/docs/rate-limits).
- **Same API key** works for standard Gemini and for the **Live API**. If the free tier includes Live (check [pricing](https://ai.google.dev/gemini-api/docs/pricing)), you can try Live within those limits without paying.
- Good for hackathon demos and testing.

### Google Cloud $300 free credits (new accounts)

- **New GCP customers** get **$300 in free credits** for 90 days. Sign up at [cloud.google.com/free](https://cloud.google.com/free). Payment method required for verification; you are not charged until you turn on a paid account after the trial.
- **Use credits for:** Cloud Run (hosting Voyance), Vertex AI, Firestore, etc. The $300 applies to **Google Cloud** billing. **AI Studio** (Gemini API key) has its own free tier / pay-as-you-go — the $300 does not apply to AI Studio. To use $300 for Gemini usage, use **Vertex AI** (Gemini on GCP).
- **Practical:** Use **$300** for **Cloud Run** (satisfies hackathon). Use **Gemini free tier** (AI Studio key) for API calls; or Vertex AI so usage draws from $300.

### Practical hackathon setup

1. **Gemini API key** in [Google AI Studio](https://aistudio.google.com/apikey) — free tier for dev/demo.
2. **GCP account** + **$300 credits** at [cloud.google.com/free](https://cloud.google.com/free).
3. **Deploy backend to Cloud Run** — uses $300; satisfies "hosted on Google Cloud."
4. **Live API:** Use within free tier if available; or small pay-as-you-go. For heavy use, consider Vertex AI.

---

## 2. What you need from the three pages

### [Live API — WebSockets API reference](https://ai.google.dev/api/live)

- **Endpoint:**  
  `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent`
- **First message:** Session config (model, `generationConfig`, `systemInstruction`, tools).
- **Client sends:** `setup` (once), then `clientContent`, `realtimeInput` (audio/video/text), `toolResponse`.
- **Realtime input:** `realtimeInput` can include `audio` (e.g. PCM), `video`, `text`, and activity signals (`activityStart` / `activityEnd`).
- **Barge-in:** Default is `START_OF_ACTIVITY_INTERRUPTS` — user can interrupt the model.
- **Auth:** For browser/client apps, use **ephemeral tokens** ([CreateToken](https://ai.google.dev/api/live#ephemeral-authentication-tokens)) instead of exposing the API key.

**What you need to do:** Nothing extra for “enabling” the API; use the same Gemini API key. For production browser apps, plan to use ephemeral tokens (create token on your backend, pass to client).

---

### [Get started with Live API (mic stream)](https://ai.google.dev/gemini-api/docs/live?example=mic-stream)

- **Two patterns:**
  - **Server-to-server:** Backend connects to Live API over WebSockets; client sends stream to your server, server forwards to Gemini.
  - **Client-to-server:** Frontend connects directly to Live API (better latency); for production, use ephemeral tokens instead of an API key.
- **Audio format:** Input **16-bit PCM, 16 kHz, mono**. Output **24 kHz**.
- **Python (new SDK):**  
  `pip install google-genai` (and for mic: `pyaudio`).  
  Then: `from google import genai` → `client = genai.Client()` → `async with client.aio.live.connect(model=..., config=...) as session` → `session.send_realtime_input(audio=...)`.
- **Model example:** `gemini-2.5-flash-native-audio-preview-12-2025` (or current equivalent on the pricing page).
- **Config example:** `response_modalities: ["AUDIO"]`, `system_instruction: "..."`.

**What you need to do:**

1. **Get/create API key:** [Google AI Studio](https://aistudio.google.com/apikey) (same key as for your current Gemini usage).
2. **Backend (Python):** Install the **new** SDK:  
   `pip install google-genai`  
   (Voyance currently uses `google-generativeai` for non-Live Gemini; Live uses `google-genai`.)
3. **Optional for mic streaming:** `pip install pyaudio` (and system deps, e.g. [PyAudio](https://pypi.org/project/PyAudio/)).
4. **Backend .env:** Keep or add `GEMINI_API_KEY=...`; the Live client can use the same key server-side.

No separate “enable Live” checkbox; if your key works for Gemini API, it works for Live.

---

### [ADK — Gemini Live API Toolkit (streaming)](https://google.github.io/adk-docs/streaming/)

- **ADK** (Agent Development Kit) has a **Gemini Live API Toolkit** for bidirectional streaming (voice/video, barge-in, tools).
- **Useful if:** You want to integrate Live with an ADK-based agent (e.g. tools, session management, run configuration).
- **Voyance:** Already uses `google-adk` for the research agent loop. Adding Live would mean either:
  - Using ADK’s Live toolkit to drive the voice/session, or  
  - Using the Live API directly (e.g. `google-genai` + WebSockets) and passing transcribed text or control into your existing agent.

**What you need to do:** Optional. If you adopt ADK’s Live toolkit, follow the [streaming docs](https://google.github.io/adk-docs/streaming/) and the [development guide series](https://google.github.io/adk-docs/streaming/) (Parts 1–5). No extra billing or API enablement.

---

## 3. Summary: actions you need to perform

| Step | Action |
|------|--------|
| 1. API key | Use or create a key in [Google AI Studio](https://aistudio.google.com/apikey). Same key for Gemini and Live. |
| 2. Billing | Ensure the project has billing enabled (required for paid usage; free tier may still need it). [Pricing](https://ai.google.dev/gemini-api/docs/pricing). |
| 3. Backend SDK (for Live) | Install **`google-genai`** (new SDK): `pip install google-genai`. Voyance already has `google-generativeai` for non-Live. |
| 4. Optional: ephemeral tokens | For browser clients talking to Live, create tokens on your backend via [CreateToken](https://ai.google.dev/api/live#ephemeral-authentication-tokens) and pass to the client. |
| 5. No “enable Live” step | No separate activation; valid Gemini API key is enough. |

---

## 4. Current Voyance flow vs Live

- **Current (AC-01 partial):** User speaks → browser records → upload to `/api/voice/transcribe` → Gemini (REST) transcribes → text used as research query. No real-time streaming or barge-in at the voice layer.
- **With Live API:** User speaks → audio streamed (e.g. 16 kHz PCM) over WebSocket to Gemini Live → model can respond with audio and **transcription** in real time; **barge-in** supported. You could use the Live session to get the “research query” text (and optional voice reply) and then start your existing research agent.

Implementing Live in Voyance would mean adding either:

- A **backend WebSocket** that uses `google-genai`’s `client.aio.live.connect(...)`, receives audio from the frontend, and forwards it to Live (server-to-server), or  
- A **client-to-server** flow where the frontend connects to Live (with an ephemeral token from your backend) and streams mic audio, then sends the transcribed query to your backend to start research.

If you want, the next step can be a minimal backend Live endpoint (e.g. `/api/voice/live` WebSocket) using `google-genai` and the steps above.
