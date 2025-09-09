# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a **Turborepo monorepo** using **Yarn workspaces** for a Korean life planning application called "plott-life". The architecture consists of:

### Core Applications
- `apps/web/` - Main Astro-based frontend application with Preact integration and TailwindCSS styling

### Shared Packages
- `packages/ui/` - Shared UI components built with Preact, TailwindCSS, and DaisyUI
- `packages/utils/` - Shared utility functions and common code
- `packages/dev/` - Development tooling, ESLint configurations, and TypeScript configs

### Infrastructure
- `terraform/` - Google Cloud Platform infrastructure using Terraform
- Deployed to Google Cloud Run with container images stored in Google Artifact Registry
- Uses GCS backend for Terraform state management

## Key Commands

### Development
```bash
yarn dev          # Start development servers for all apps
yarn build        # Build all packages and apps  
yarn start        # Start production builds
yarn lint         # Run linting across all packages
```

### Application-Specific (from apps/web/)
```bash
yarn dev          # Start Astro dev server (astro dev)
yarn build        # Build for production (astro build)
yarn start        # Preview production build (astro preview)
yarn lint         # Run ESLint (eslint .)
```

### UI Package (from packages/ui/)
```bash
yarn dev          # Watch and compile TailwindCSS
yarn build        # Build TailwindCSS output
yarn lint         # Run ESLint
```

### Docker Build
```bash
# Build Docker image (from repository root)
docker build -t plott-life-front -f apps/web/Dockerfile .
```

## Technology Stack

- **Build System**: Turborepo with Yarn workspaces
- **Frontend Framework**: Astro v5 with Preact integration
- **Styling**: TailwindCSS v4 with DaisyUI components
- **Language**: TypeScript throughout
- **Deployment**: Google Cloud Run (serverless containers)
- **Infrastructure**: Terraform for GCP resource management

## Architecture Notes

- The Astro application is configured for **server-side rendering** (`output: "server"`) with Node.js adapter in standalone mode
- UI components are shared across the monorepo through the `@plott-life/ui` package
- All packages use workspace protocol (`workspace:*`) for internal dependencies
- ESLint configurations are centralized in the dev package and extended by other packages
- The application runs on port 4321 in production (configured in Cloud Run)

## Infrastructure Details

- **Environment**: Uses Terraform workspaces for environment management
- **Location**: Asia Northeast 3 (Seoul) region
- **Scaling**: Cloud Run configured for 1-3 instances with CPU idle disabled
- **Registry**: Images stored in Google Artifact Registry with naming pattern `web-{environment}:latest`