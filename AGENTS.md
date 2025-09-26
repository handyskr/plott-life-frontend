# Repository Guidelines

## Project Structure & Modules
- Monorepo managed by Turborepo and Yarn workspaces.
- Apps: `apps/web` (Astro + Preact UI, public assets in `public/`).
- Packages: `packages/ui` (shared UI components, Tailwind CSS, icons), `packages/utils` (TS utilities), `packages/dev` (shared ESLint/TS configs).
- Infra: `cloudbuild/`, `terraform/`. Root configs: `turbo.json`, `.editorconfig`, `package.json`.

## Build, Test, and Development
- Run all workspaces: `yarn dev` (dev), `yarn build` (build), `yarn start` (preview), `yarn lint` (ESLint).
- App-only: `yarn workspace @plott-life/web dev|build|start`.
- UI package: `yarn workspace @plott-life/ui dev:styles` (watch CSS), `dev:icons` (watch SVG to JSX), `build:*` (one-off builds).
- Icons (web): `yarn workspace @plott-life/web run generate:icons`.
- Optional deploy helpers (see README): `gcloud builds submit ...`, `docker build -f apps/web/Dockerfile .`.

## Coding Style & Naming
- Formatting: `.editorconfig` (LF, UTF-8, 2 spaces). Prettier is included; ESLint extends `eslint-config-prettier`.
- Linting: Flat ESLint configs from `packages/dev` → `packages/ui` → `apps/web`. Key rules: `no-console: warn`, double quotes, TS import resolver.
- TypeScript everywhere; prefer explicit types on exports.
- Naming: React/Preact components `PascalCase.tsx` (e.g., `packages/ui/components/Card.tsx`); utilities `camelCase.ts`. Env files: `.env.development(.local)`, `.env.production` in `apps/web`.

## Testing Guidelines
- No test runner is configured yet. If you add tests, use Vitest + Testing Library.
- Suggested locations: `apps/web/src/__tests__/*.test.tsx`, `packages/*/src/**/*.test.ts`.
- Add `"test": "vitest"` to affected `package.json` and wire a `test` task in `turbo.json` if needed.

## Commit & PR Guidelines
- Convention: prefix with issue key, then summary (e.g., `[TF-153] Update SEO tags`).
- Branches: `feature/TF-153-short-desc`, `fix/TF-151-bug`.
- PRs: clear description, linked issue (TF-###), screenshots for UI changes, steps to reproduce, and notes on env/config updates.
- Before submitting: run `yarn lint` and `yarn build`; ensure icons/CSS are generated when relevant.

## Security & Configuration
- Do not commit secrets. Use `.env.*` files; prefer `.env.development.local` for machine-specific values.
- Astro dev listens on `0.0.0.0`; verify you trust your network when exposing ports.
