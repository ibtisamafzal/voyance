# Deploy Voyance Backend to Google Cloud Run

Use this guide to satisfy **"Agents hosted on Google Cloud"** and **"Use at least one Google Cloud service"** for the [Gemini Live Agent Challenge](https://geminiliveagentchallenge.devpost.com/).

**Prerequisites:**

- GCP project with billing enabled ($300 credits claimed).
- **Google Cloud SDK (gcloud)** installed and in your PATH.  
  - **Windows:** [Install gcloud CLI](https://cloud.google.com/sdk/docs/install). If `gcloud` is not recognized after install:
    - **Quick fix (current terminal):** Run once:
      ```powershell
      $env:Path = "$Env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin;$env:Path"
      ```
    - **Permanent fix:** Add to your user PATH: `%LOCALAPPDATA%\Google\Cloud SDK\google-cloud-sdk\bin` (Settings → System → About → Advanced system settings → Environment Variables → User variables → Path → Edit → New).
    - Then open a **new** terminal and run `gcloud --version` to confirm.

---

## Step 1: Set your GCP project and login

Open a terminal (PowerShell or Command Prompt) and run:

```powershell
# Log in (opens browser)
gcloud auth login

# Set the project that has your $300 credits
gcloud config set project YOUR_PROJECT_ID
```

Replace `YOUR_PROJECT_ID` with your actual project ID (e.g. `my-voyance-hackathon`). You can see it in [Google Cloud Console](https://console.cloud.google.com/) → project dropdown.

---

## Step 2: Enable required APIs

Cloud Build and Cloud Run must be enabled:

```powershell
gcloud services enable cloudbuild.googleapis.com run.googleapis.com
```

If you use Container Registry (gcr.io), enable it too:

```powershell
gcloud services enable containerregistry.googleapis.com
```

---

## Step 3: Build and deploy in one go (recommended)

From the **Voyance repository root** (the folder that contains `backend` and `infra`):

```powershell
cd "c:\Users\Laptop Solutions\Downloads\Voyance"
gcloud builds submit --config=infra/cloudbuild.yaml .
```

This will:

1. Build the Docker image from `backend/` (using `backend/Dockerfile`).
2. Push it to `gcr.io/YOUR_PROJECT_ID/voyance-backend:COMMIT_SHA`.
3. Deploy to **Cloud Run** in `us-central1` with public access.

The first build can take several minutes (Playwright + Chromium in the image). When it finishes, you’ll see the **service URL**, e.g.:

```text
Service [voyance-backend] revision [...] has been deployed and is serving 100 percent of traffic.
Service URL: https://voyance-backend-xxxxx-uc.a.run.app
```

**Save this URL** — you’ll use it as the backend for the frontend.

### Get the service URL (if you didn’t save it)

In PowerShell (from any folder):

```powershell
gcloud run services describe voyance-backend --region=us-central1 --format="value(status.url)"
```

Or in [Cloud Console](https://console.cloud.google.com/run) → click **voyance-backend** → the URL is at the top.

---

## Step 4: Set environment variables (secrets) on Cloud Run

The container does **not** use your local `.env` file (it’s excluded by `.dockerignore`). You must set environment variables on the Cloud Run service so the backend can use your API keys.

### Option A: Cloud Console (easiest)

1. Open [Cloud Run](https://console.cloud.google.com/run).
2. Click the service **voyance-backend**.
3. Click **Edit & deploy new revision**.
4. Open the **Variables & secrets** tab.
5. Add the following **Environment variables** (use “Add variable” for each):

   | Name | Value (your real keys) |
   |------|-------------------------|
   | `GEMINI_API_KEY` | Your AI Studio API key |
   | `CORS_ORIGINS` | `https://your-frontend-url.com,http://localhost:5173` (or `*` for testing) |

   Optional (for full features):

   | Name | Value |
   |------|--------|
   | `ELEVENLABS_API_KEY` | Your ElevenLabs key |
   | `FIRECRAWL_API_KEY` | Your Firecrawl key |
   | `PERPLEXITY_API_KEY` | Your Perplexity key |
   | `GOOGLE_CLOUD_PROJECT` | Your GCP project ID |

6. Click **Deploy**.

### Option B: Command line (one-time update)

```powershell
gcloud run services update voyance-backend `
  --region=us-central1 `
  --set-env-vars "GEMINI_API_KEY=YOUR_GEMINI_KEY,CORS_ORIGINS=*"
```

Replace `YOUR_GEMINI_KEY` with your actual key. For production, restrict `CORS_ORIGINS` to your frontend origin.

---

## Step 5: Verify the deployment

1. **Health check:** Open in a browser:
   ```text
   https://YOUR_SERVICE_URL/api/health
   ```
   You should see JSON with `"status": "ok"` and `"gemini": true` if `GEMINI_API_KEY` is set.

2. **Proof for Devpost:** Record a short screen capture showing:
   - [Cloud Run](https://console.cloud.google.com/run) with **voyance-backend** and the service URL, or
   - Logs/console for the running service.

---

## Step 6: Point the frontend to Cloud Run

When running the frontend locally or hosting it elsewhere, set the backend URL:

- **Local dev:** Create or edit `.env` in the **frontend** (Vite) root:
  ```env
  VITE_API_URL=https://YOUR_SERVICE_URL
  ```
  Then restart the dev server (`npm run dev`).

- **Production:** Build the frontend with the same `VITE_API_URL` so the built app calls your Cloud Run backend.

---

## Troubleshooting

| Issue | What to do |
|-------|------------|
| **Build fails: "requirements.txt not found"** | Run `gcloud builds submit` from the **repo root** (where `backend/` and `infra/` are), not from `backend/`. |
| **Build fails: "ttf-unifont" / "playwright install-deps"** | Dockerfile uses Debian-compatible deps only. Pull latest and rebuild. |
| **403 Forbidden** when opening the service URL or `/api/health` | Allow unauthenticated access: `gcloud run services add-iam-policy-binding voyance-backend --region=us-central1 --member="allUsers" --role="roles/run.invoker"` |
| **Permission denied / API not enabled** | Run Step 2 again; ensure the project has billing enabled. |
| **Service returns 503 or doesn’t start** | Check [Cloud Run logs](https://console.cloud.google.com/run/detail/us-central1/voyance-backend/logs). Often caused by missing `GEMINI_API_KEY` or Playwright/Chromium startup — ensure env vars are set (Step 4). |
| **CORS errors from frontend** | Set `CORS_ORIGINS` on the Cloud Run service to include your frontend origin (e.g. `https://your-site.com` or `http://localhost:5173`). |

---

## Summary checklist

- [ ] `gcloud auth login` and `gcloud config set project YOUR_PROJECT_ID`
- [ ] `gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com`
- [ ] From repo root: `gcloud builds submit --config=infra/cloudbuild.yaml .`
- [ ] Set `GEMINI_API_KEY` (and optional keys) in Cloud Run → Variables & secrets
- [ ] Test `https://YOUR_SERVICE_URL/api/health`
- [ ] Set `VITE_API_URL` in frontend to the service URL
- [ ] Record proof of GCP deployment for Devpost
