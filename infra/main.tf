# Voyance Infrastructure (BP-02)
# Provisions Cloud Run for the backend. Optionally extend for Firestore, Secret Manager, Firebase Hosting.
#
# How to run:
#   1. Install Terraform: https://www.terraform.io/downloads
#   2. cd infra
#   3. terraform init
#   4. terraform plan -var="project_id=YOUR_GCP_PROJECT_ID"
#   5. terraform apply -var="project_id=YOUR_GCP_PROJECT_ID"
#
# Before apply: build and push the backend image, e.g.:
#   gcloud builds submit --config=infra/cloudbuild.yaml .
#   Then set image = "gcr.io/YOUR_PROJECT_ID/voyance-backend:latest" in the template below,
#   or use a variable for the image tag.

terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

variable "project_id" {
  type        = string
  description = "GCP project ID"
}

variable "region" {
  type        = string
  default     = "us-central1"
  description = "Region for Cloud Run"
}

variable "backend_image" {
  type        = string
  description = "Full image URI for voyance-backend (e.g. gcr.io/PROJECT_ID/voyance-backend:latest)"
  default     = ""
}

locals {
  image = var.backend_image != "" ? var.backend_image : "gcr.io/${var.project_id}/voyance-backend:latest"
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Cloud Run service for Voyance backend (FastAPI + Playwright)
resource "google_cloud_run_v2_service" "voyance_backend" {
  name     = "voyance-backend"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = local.image

      ports {
        container_port = 8080
      }

      resources {
        limits = {
          cpu    = "2"
          memory = "2Gi"
        }
        cpu_idle = true
      }

      startup_probe {
        http_get {
          path = "/api/health"
          port = 8080
        }
        initial_delay_seconds = 10
        timeout_seconds       = 3
        period_seconds        = 10
        failure_threshold     = 3
      }

      env {
        name  = "PYTHONUNBUFFERED"
        value = "1"
      }
      # Add secrets via env or Secret Manager in production:
      # env { name = "GEMINI_API_KEY"; value_source { secret_key_ref { secret = "gemini-api-key"; version = "latest" } } }
    }

    scaling {
      min_instance_count = 0
      max_instance_count = 5
    }
  }
}

# Allow unauthenticated access (public API)
resource "google_cloud_run_v2_service_iam_member" "public" {
  location = google_cloud_run_v2_service.voyance_backend.location
  name     = google_cloud_run_v2_service.voyance_backend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

output "voyance_backend_url" {
  value       = google_cloud_run_v2_service.voyance_backend.uri
  description = "URL of the deployed Voyance backend"
}
