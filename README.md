# afrehner.com

**A portfolio that doesn't just talk about test automation — it runs it live.**

This is the source code for [afrehner.com](https://afrehner.com), the portfolio site of Annette Frehner, a Software Development Engineer in Test with 8+ years of experience in QA automation and manual testing.

Most portfolios show screenshots and bullet points. This one ships with a built-in **live test runner** — visitors can trigger real Playwright test suites directly from the browser and watch them execute in real time over WebSocket. No recordings, no faked terminal output, just actual `npx playwright test` running against a live site.

## What's Inside

| Directory | What it does |
|---|---|
| [`frontend/`](frontend/) | React + Vite + Tailwind portfolio UI with integrated test runner panel |
| [`backend/`](backend/) | Express + WebSocket server that orchestrates Playwright test execution |
| [`playwright-tests/`](playwright-tests/) | Two Playwright test suites using Page Object Model architecture |

## The Live Test Runner

The standout feature is the test runner embedded in the portfolio itself. Here's how it works:

1. A visitor clicks **"Run Tests"** in the browser
2. The frontend sends a `POST /api/test-runs` request to the backend
3. The backend spawns a `npx playwright test` child process
4. Test output streams back to the browser in real time over WebSocket
5. Results (pass/fail counts, duration) are parsed and displayed when the run completes

This isn't a demo — it's production infrastructure. The backend enforces concurrency limits (max 2 simultaneous runs), rate limiting (5 triggers per 10 minutes), and graceful cancellation via `SIGTERM`. Late-joining WebSocket clients receive the full buffered output so they never miss context.

## Available Test Suites

| Suite | Target | Tests |
|---|---|---|
| **SauceDemo E2E** | [saucedemo.com](https://www.saucedemo.com) | 6 tests covering login flows, cart operations, checkout, and product sorting |
| **Portfolio Self-Test** | [afrehner.com](https://afrehner.com) | 7 tests validating the portfolio's own sections, navigation, theme toggle, and contact links |

## Quick Start

```bash
# Install dependencies for all packages
npm run install:all

# Run the full stack in development
npm run dev
# Frontend: http://localhost:5173
# Backend:  http://localhost:3001

# Build everything
npm run build
```

### Docker (Production)

```bash
docker compose up --build
# App available at http://localhost:3001
```

The production Docker image uses Microsoft's official Playwright base image with Chromium pre-installed, built via a multi-stage Dockerfile that compiles the frontend, backend, and test suites into a single deployable container.

## Architecture Overview

```
Browser
  |
  |-- REST API (/api/test-runs) --> Express --> TestRunnerService --> spawns Playwright
  |
  |-- WebSocket (/ws) <---------- Event Emitter <--- stdout/stderr from child process
  |
  |-- Static files (/*)  ------> Vite-built React app (served by Express in production)
```

Site content (bio, skills, projects, test suite config) is defined in a single `config.yaml` at the repo root. At build time, a Zod-validated code generation step produces a typed TypeScript module consumed by the frontend — no runtime YAML parsing, no untyped config objects.

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
**Backend:** Node.js, Express, WebSocket (`ws`), Zod
**Testing:** Playwright, Page Object Model, TypeScript
**Infrastructure:** Docker (multi-stage), Docker Compose
