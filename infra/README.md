# Voyance Infrastructure (BP-02)

Terraform and Cloud Build for deploying Voyance to Google Cloud.

## Prerequisites

- [Terraform](https://www.terraform.io/downloads) >= 1.0
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) (`gcloud`)
- A GCP project with billing enabled

## How to deploy

### 1. Build and push the backend image

From the **repository root** (not `infra/`):

```bash
# Set your project
gcloud config set project YOUR_PROJECT_ID

# Build and push using Cloud Build (creates image gcr.io/PROJECT_ID/voyance-backend:COMMIT_SHA)
gcloud builds submit --config=infra/cloudbuild.yaml .
```

To tag as `latest` for Terraform:

```bash
docker build -t gcr.io/YOUR_PROJECT_ID/voyance-backend:latest -f backend/Dockerfile .
docker push gcr.io/YOUR_PROJECT_ID/voyance-backend:latest
# Or use the image from the Cloud Build step and tag it.
```

### 2. Provision infrastructure with Terraform

```bash
cd infra
terraform init
terraform plan -var="project_id=YOUR_PROJECT_ID"
terraform apply -var="project_id=YOUR_PROJECT_ID"
```

To use a specific image (e.g. from Cloud Build):

```bash
terraform apply \
  -var="project_id=YOUR_PROJECT_ID" \
  -var="backend_image=gcr.io/YOUR_PROJECT_ID/voyance-backend:COMMIT_SHA"
```

### 3. Output

After `apply`, Terraform prints `voyance_backend_url`. Use that as `VITE_API_URL` in the frontend (or point your hosting to it).

## Optional: Secret Manager and Firestore

- **Secrets**: Create secrets in [Secret Manager](https://console.cloud.google.com/security/secret-manager), then reference them in `main.tf` under `template.containers[0].env` with `value_source { secret_key_ref { ... } }`.
- **Firestore**: Enable the Firestore API and use the same project; the backend uses `GOOGLE_APPLICATION_CREDENTIALS` or default credentials when running on Cloud Run.
- **Firebase Hosting**: Add a `firebase.json` and deploy the frontend separately; set `VITE_API_URL` to the Cloud Run backend URL.

## Connecting Cloud Build to Terraform

To run Terraform from Cloud Build after a successful build, add a step to your `cloudbuild.yaml` that runs `terraform apply` (store state in GCS and use a service account with permission to run Terraform).
