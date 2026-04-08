# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
# Install all packages
npm run install:all

# Run full dev environment (frontend + backend concurrently)
npm run dev

# Run individual packages
npm run dev:frontend          # Vite dev server (port 5173)
npm run dev:backend           # Express + WebSocket (port 3001)

# Build all packages
npm run build

# Docker
docker build . -t afrehner.com
docker compose up
```

### Playwright Tests

```bash
cd playwright-tests
npx playwright test                              # Run all tests
npx playwright test tests/portfolio.spec.ts      # Run single spec
PORTFOLIO_URL=https://afrehner.com npx playwright test tests/portfolio.spec.ts  # Against production
```

## Architecture

Monorepo with three packages: `frontend/`, `backend/`, `playwright-tests/`.

**Frontend** — React 18 + Vite + Tailwind CSS. Single-page portfolio site with an integrated live test runner UI. All site content (hero, projects, skills, test suites) is driven by `config.yaml` at the repo root, which is validated with Zod and code-generated into `frontend/src/generated/config.ts` at build time via `frontend/scripts/build-config.ts`. The prebuild step runs automatically.

**Backend** — Express + WebSocket (`ws`). Serves the built frontend as static files in production and provides a REST API (`/api/test-runs`) plus WebSocket (`/ws`) for triggering and streaming Playwright test runs. Test execution spawns `npx playwright test` as a child process; the `TestRunnerService` emits lifecycle events that the WebSocket server broadcasts to connected clients. Max 2 concurrent test runs enforced at the controller level.

**Playwright Tests** — Two suites: `demo-saucedemo.spec.ts` (external site) and `portfolio.spec.ts` (self-testing the portfolio). Uses Page Object Model pattern with `BasePage` abstract class. The portfolio suite reads `PORTFOLIO_URL` env var, defaulting to `localhost:5173`.

### Frontend-Backend Communication

- REST: `POST /api/test-runs` triggers a run, `GET` lists/fetches runs, `POST /:id/cancel` cancels
- WebSocket: client subscribes to a `runId` and receives `run:started`, `run:output`, `run:finished` events. Output is buffered so late-joining clients get full history.
- The `useTestRunner` hook manages WebSocket connection, output buffering, and state transitions
- Vite proxies `/api`, `/ws`, `/reports` to the backend in dev mode

### Key Patterns

- All theming uses CSS custom properties defined in `frontend/src/globals.css` (`--bg-primary`, `--text-muted`, `--accent-green`, etc.) with a dark/light toggle via React Context
- Test run data is **in-memory only** (Map in `backend/src/db/queries/testRuns.queries.ts`) — no persistent database. Runs are deleted after completion.
- Test reports are generated to disk, parsed for stats, then immediately deleted (`testRunner.service.ts`)
- Available test suites are defined in both `config.yaml` (frontend display) and `testRuns.controller.ts` (backend fallback via `AVAILABLE_SUITES` env var)

### Environment Variables (Backend)

Key vars configured in `backend/src/config/env.ts` with Zod validation:
- `PORT` (default 3001), `CORS_ORIGIN`, `PORTFOLIO_URL` (default `localhost:5173`)
- `PLAYWRIGHT_TESTS_DIR`, `REPORTS_DIR`, `CHROMIUM_PATH` (for Docker)

### Docker

Multi-stage Dockerfile: builds frontend with config generation, compiles backend TypeScript, then produces a production image based on Node Alpine with system Chromium for Playwright.
