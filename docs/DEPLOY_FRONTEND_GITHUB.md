# Get Backend URL, Test It, Push to GitHub, and Deploy Frontend on Vercel

Use this guide after you’ve deployed **voyance-backend** to Cloud Run.

---

## 1. Get the Cloud Run service URL

In PowerShell:

```powershell
gcloud run services describe voyance-backend --region=us-central1 --format="value(status.url)"
```

Copy the URL (e.g. `https://voyance-backend-xxxxx-uc.a.run.app`).

**Alternative:** [Cloud Run](https://console.cloud.google.com/run) → click **voyance-backend** → copy the URL at the top.

---

## 2. Test the backend

1. **Health check** — open in a browser:
   ```text
   https://YOUR_SERVICE_URL/api/health
   ```
   You should see JSON with `"status": "ok"` and `"gemini": true` if `GEMINI_API_KEY` is set on Cloud Run.

2. **Set CORS for your frontend** (needed before using the app):
   - In [Cloud Run](https://console.cloud.google.com/run) → **voyance-backend** → **Edit & deploy new revision** → **Variables & secrets**.
   - Add or set `CORS_ORIGINS` to your frontend origin(s), e.g.:
     - For Vercel: `https://your-app.vercel.app`
     - For local dev: `http://localhost:5173`
     - For testing: `*`
   - Deploy the new revision.

---

## 3. Push the project to GitHub

Do this from the **Voyance repo root** (the folder that contains `backend`, `docs`, `src`, `package.json`).

### 3.1 Initialize Git (if not already)

```powershell
cd "c:\Users\Laptop Solutions\Downloads\Voyance"
git init
```

### 3.2 Create a repo on GitHub

1. Go to [github.com](https://github.com) and sign in.
2. Click **+** → **New repository**.
3. Name it (e.g. `voyance`), leave it empty (no README/license).
4. Copy the repo URL (e.g. `https://github.com/YOUR_USERNAME/voyance.git`).

### 3.3 Commit and push

```powershell
cd "c:\Users\Laptop Solutions\Downloads\Voyance"

# Add all files (respects .gitignore)
git add .
git status

# First commit
git commit -m "Initial commit: Voyance backend + frontend"

# Add your GitHub repo as remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/voyance.git

# Push (main branch)
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `voyance` with your GitHub username and repo name. If GitHub asks for auth, use a **Personal Access Token** as the password (Settings → Developer settings → Personal access tokens).

---

## 4. Deploy the frontend on Vercel

### 4.1 Sign in to Vercel

Go to [vercel.com](https://vercel.com) and sign in (GitHub is easiest).

### 4.2 Import the GitHub repo

1. **Add New…** → **Project**.
2. **Import** the **voyance** (or your repo name) repository.
3. If asked, authorize Vercel to access your GitHub account.

### 4.3 Configure the project

- **Framework Preset:** Vite (should be auto-detected).
- **Root Directory:** leave as **./** (repo root).
- **Build Command:** `npm run build` (default).
- **Output Directory:** `dist` (Vite default).
- **Install Command:** `npm install` (default).

### 4.4 Set environment variable for the backend

1. Expand **Environment Variables**.
2. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** your Cloud Run URL (e.g. `https://voyance-backend-xxxxx-uc.a.run.app`) — **no trailing slash**.
3. Apply to **Production** (and Preview if you want).

### 4.5 Deploy

Click **Deploy**. Wait for the build to finish.

### 4.6 After deploy

1. Vercel gives you a URL (e.g. `https://voyance-xxx.vercel.app`).
2. In **Cloud Run** → voyance-backend → **Edit & deploy new revision** → **Variables & secrets**, set:
   - `CORS_ORIGINS` = `https://voyance-xxx.vercel.app` (your Vercel URL).
3. Deploy the new revision so the backend allows requests from the frontend.

---

## Summary

| Step | What you did |
|------|----------------|
| 1 | Got backend URL with `gcloud run services describe ...` |
| 2 | Tested `https://YOUR_SERVICE_URL/api/health` and set `CORS_ORIGINS` |
| 3 | `git init`, `git add .`, `git commit`, `git remote add origin`, `git push` |
| 4 | Imported repo on Vercel, set `VITE_API_URL`, deployed; then set `CORS_ORIGINS` on Cloud Run to the Vercel URL |

Your app is live: **Vercel URL** = frontend, **Cloud Run URL** = backend.
