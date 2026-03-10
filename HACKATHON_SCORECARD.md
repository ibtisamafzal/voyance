# Voyance Hackathon Scorecard

Last updated: 2026-03-10
Source reviewed: https://geminiliveagentchallenge.devpost.com/

Legend: `✅` met, `⚠️` partially met, `❌` pending

## 1) Requirement Coverage (Official)

| Requirement | Status | Evidence in Repo | What is still needed |
| --- | --- | --- | --- |
| Build a new, next-generation multimodal agent (beyond text-in/text-out) | ✅ | Voice input path in `src/app/components/HeroSection.tsx`; voice transcription endpoint in `backend/app/routers/voice.py`; spoken output in `backend/app/services/voice_service.py` and `src/app/components/ResearchOutputSection.tsx` | Keep demo focused on live multimodal flow |
| Use a Gemini model | ✅ | Gemini usage in `backend/app/services/gemini_service.py`; dependency in `backend/requirements.txt` (`google-generativeai`) | None |
| Build agent using Google GenAI SDK or ADK | ✅ | Google GenAI SDK (`google-generativeai`) in `backend/requirements.txt`; imports in `backend/app/services/gemini_service.py`; custom loop in `backend/app/agent.py` | None |
| Use at least one Google Cloud service | ✅ | Cloud Run deployment config in `infra/cloudbuild.yaml` and `infra/main.tf`; Firestore integration in `backend/app/services/firestore_service.py` | Provide explicit submission proof that backend is running on GCP |
| Category mandatory tech (UI Navigator): use Gemini multimodal for screenshot/screen understanding and output actions | ✅ | Screenshot capture in `backend/app/services/browser_service.py`; screenshot analysis in `backend/app/services/gemini_service.py`; action loop in `backend/app/agent.py` | In demo video, clearly show this loop in real time |
| Agents hosted on Google Cloud | ⚠️ | Hosting target and deployment scripts exist in `infra/cloudbuild.yaml` and `infra/main.tf` | Include concrete proof in submission (recording or strong code evidence links) |

## 2) Submission Checklist (Devpost)

| Submission item | Status | Evidence in Repo | Action before submit |
| --- | --- | --- | --- |
| Text description (features, tech used, data sources, learnings) | ❌ | Material exists in `README.md` and `_to_remove/BLOG_POST_DRAFT.md` | Paste/refine into Devpost text fields |
| Public code repository URL + reproducible spin-up instructions | ✅ | Setup and run steps in `README.md` | Verify instructions still match current env vars and ports |
| Proof of Google Cloud deployment | ⚠️ | Cloud Run/IaC code exists in `infra/cloudbuild.yaml` and `infra/main.tf` | Add one of: (1) short GCP console/log recording, or (2) explicit code links in submission proving GCP service usage |
| Architecture diagram | ✅ | `Architecture diagram for Voyance.png` | Upload this file in Devpost media section so judges can find it quickly |
| Demo video (<4 min, real-time, no mockups) | ❌ | N/A | Record final demo and keep under 4 minutes |

## 3) Bonus Points Readiness

| Bonus item | Status | Evidence | Action |
| --- | --- | --- | --- |
| Publish content (blog/podcast/video) with required contest language | ⚠️ | Draft now includes required language in `_to_remove/BLOG_POST_DRAFT.md` | Ensure the published post/video description includes the same required language + hashtag `#GeminiLiveAgentChallenge` |
| Automated cloud deployment via scripts/IaC in public repo | ✅ | `infra/cloudbuild.yaml`, `infra/main.tf` | Reference these files directly in Devpost submission |
| GDG profile link | ❌ | N/A | Add only if you complete signup |

## 4) Claims Reality Check (Audit Summary)

This audit validated stack and pipeline claims against implementation and corrected overstatements in UI/docs.

### Corrected mismatches
- Removed/updated claims that said Google ADK is used (actual implementation is Google GenAI SDK + custom async loop).
- Removed/updated "Gemini Live API" claims where not implemented.
- Reworded absolute guarantees like "every data point verified", "under X seconds", and similar hard promises.
- Updated README wording to avoid unverifiable runtime/deadline statements.

### Files updated in this audit
- `README.md`
- `_to_remove/BLOG_POST_DRAFT.md`
- `backend/app/agent.py`
- `backend/app/routers/research.py`
- `src/app/pages/AboutPage.tsx`
- `src/app/pages/FAQPage.tsx`
- `src/app/components/HeroSection.tsx`
- `src/app/components/FeaturesSection.tsx`
- `src/app/components/PipelineSection.tsx`
- `src/app/components/LiveAgentSection.tsx`
- `src/app/components/ArchitectureSection.tsx`
- `src/app/components/CommunitySection.tsx`
- `src/app/components/TourGuide.tsx`
- `src/app/components/StatsBar.tsx`
- `src/app/components/WhyVoyanceSection.tsx`

## 5) Highest-Impact Final Actions Before Submission

1. Record and upload the required <4 minute demo video showing real-time agent execution (no mockups).
2. Add explicit proof of GCP backend deployment in submission media or links.
3. Ensure your published blog/video includes the required phrase that it was created for entering this hackathon.
4. In Devpost text, link directly to `infra/cloudbuild.yaml`, `infra/main.tf`, and architecture diagram for judge convenience.
