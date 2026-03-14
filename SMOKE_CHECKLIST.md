# Voyance Manual Smoke Checklist

Run this checklist from a clean checkout before recording the final demo and before final submission.

## 1) Environment Setup

- [ ] Clone repo and run `npm install` from root.
- [ ] In `backend/`, run `pip install -r requirements.txt` and `playwright install chromium`.
- [ ] Copy `backend/.env.example` to `backend/.env` and provide required API keys.
- [ ] Start backend: `uvicorn main:app --host 0.0.0.0 --port 8000 --reload`.
- [ ] Start frontend from root: `npm run dev`.

## 2) Core Health Checks

- [ ] Open `http://localhost:8000/api/health` and confirm status is reachable.
- [ ] Open frontend at `http://localhost:5173`.
- [ ] Confirm the app connects to backend without "Connecting..." stuck state.

## 3) End-to-End Research Flow

- [ ] Submit a text query (example: "Compare top 5 CRM pricing").
- [ ] Confirm streamed progress appears (planning, navigating, extracting, verifying, synthesizing).
- [ ] Confirm at least 2 sites produce structured rows in output.
- [ ] Confirm export actions work (CSV and HTML).
- [ ] Confirm Vera audio summary can be played.

## 4) Interrupt + Replan Flow

- [ ] Start a research run and wait until navigation/extraction begins.
- [ ] Send a redirect instruction (text or voice).
- [ ] Confirm interrupt acknowledgement is visible and run continues with replanning behavior.
- [ ] Confirm final results still complete without fatal errors.

## 5) Cloud Run Proof and Submission Assets

- [ ] Verify live backend URL responds: `https://voyance-backend-712979751443.us-central1.run.app`.
- [ ] Ensure `Google-Cloud-Logs-Voyance.png` is present and readable.
- [ ] Ensure architecture diagram is attached in submission media.
- [ ] Ensure demo video is under 4 minutes and shows real-time flow (no mockups).

## 6) Messaging Consistency Check

- [ ] Public copy states Google GenAI SDK + custom agent loop.
- [ ] Public copy does not claim Google ADK or Gemini Live API implementation.
- [ ] Public post/video description includes required challenge mention and `#GeminiLiveAgentChallenge`.
