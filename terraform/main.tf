terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 7"
    }
  }
  backend "gcs" {
    bucket = "plott-terraform"
    prefix = "plott-life-web"
  }
}

provider "google" {
  project = "plott-co-kr"
  region  = local.locaiton

  default_labels = {
    service     = local.service_name
    environment = local.environment
    managed_by  = "terraform"
  }
}

locals {
  locaiton          = "asia-northeast3"
  environment       = terraform.workspace
  service_name      = "plott-life"
  resource_name     = "${local.environment}-${local.service_name}"
  web_resource_name = "${local.resource_name}-web"
  web_image_name    = "web-${local.environment}"
}

data "google_artifact_registry_repository" "frontend" {
  location      = local.locaiton
  repository_id = "${local.service_name}-frontend"
}

resource "google_cloud_run_v2_service" "web" {
  location = local.locaiton
  name     = local.web_resource_name
  ingress  = "INGRESS_TRAFFIC_INTERNAL_ONLY"

  invoker_iam_disabled = true

  scaling {
    min_instance_count = 1
    max_instance_count = 3
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  template {
    containers {
      image = "${data.google_artifact_registry_repository.frontend.registry_uri}/${local.web_image_name}:latest"
      ports {
        container_port = 4321
      }
      resources {
        cpu_idle          = false
        startup_cpu_boost = true
      }
    }

    vpc_access {
      egress = "PRIVATE_RANGES_ONLY"

      network_interfaces {
        network    = "default"
        subnetwork = "default"
      }
    }
  }

  lifecycle {
    ignore_changes = [
      client,
      client_version,
      // 테라폼 기본 레이블 무시
      template[0].labels["service"],
      template[0].labels["environment"],
      template[0].labels["managed_by"],
      // 클라우드 빌드 레이블 무시
      template[0].labels["repo"],
      template[0].labels["commit"],
      template[0].labels["build_id"],
    ]
  }
}
