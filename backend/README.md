# Backend

Node.js server that powers [afrehner.com](https://afrehner.com) — serving the frontend, orchestrating live Playwright test execution, and streaming results over WebSocket.

## Overview

This is an Express application with an attached WebSocket server. Its primary job beyond serving static files is acting as a **test execution engine**: it spawns Playwright as a child process, captures stdout/stderr in real time, and broadcasts the output to connected browser clients. This enables the portfolio's live test runner feature, where visitors watch real test automation execute from the browser.

## API

### REST Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/test-runs` | List recent test runs (paginated via `limit`/`offset`) |
| `GET` | `/api/test-runs/:id` | Get a specific run's details |
| `POST` | `/api/test-runs` | Trigger a new test run (`{ suiteId }`) |
| `POST` | `/api/test-runs/:id/cancel` | Cancel a running test |

The trigger endpoint is rate-limited to **5 requests per 10 minutes** and rejects requests when **2 runs are already active** (HTTP 429).

### WebSocket (`/ws`)

Clients subscribe to a `runId` and receive real-time events:

| Event | Payload | When |
|---|---|---|
| `run:started` | `{ startedAt, suiteLabel }` | Process spawned |
| `run:output` | `{ chunk, stream, ts }` | Each stdout/stderr line |
| `run:finished` | `{ status, durationMs, totalTests, passedTests, failedTests, skippedTests }` | Process exited |
| `run:error` | `{ message }` | Spawn or runtime error |

Late-joining clients receive the full buffered output on subscribe, so they see the complete test history even if they connect mid-run.

The server runs a 30-second heartbeat cycle to detect and clean up dead connections.

## Test Execution Engine

The `TestRunnerService` (`src/services/testRunner.service.ts`) is the core of the backend:

1. Spawns `npx playwright test <spec>` with JSON + list reporters
2. Streams stdout/stderr through an EventEmitter to the WebSocket layer
3. Buffers all output lines for late-joining clients
4. Parses Playwright's JSON report on completion for structured results
5. Cleans up report files from disk after parsing — only stats are retained

The service explicitly passes `PORTFOLIO_URL` to the child process environment so the portfolio test suite targets the correct host in production.

## Data Storage

Test run metadata is stored **in-memory** (no database). Runs are deleted after completion — the backend is stateless across restarts by design. The `DATABASE_URL` env var exists in the schema for future use.

## Development

```bash
npm install
npm run dev        # tsx watch mode at http://localhost:3001
npm run build      # TypeScript compilation to dist/
npm start          # Run compiled output
```

## Environment Variables

All validated at startup via Zod (`src/config/env.ts`). The server exits immediately on invalid config.

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Server port |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |
| `PORTFOLIO_URL` | `http://localhost:5173` | URL the portfolio test suite runs against |
| `PLAYWRIGHT_TESTS_DIR` | `../playwright-tests` | Path to test suite directory |
| `REPORTS_DIR` | `./reports` | Temporary directory for Playwright JSON reports |

## Tech Stack

Node.js, Express 4, WebSocket (`ws`), TypeScript, Zod, `child_process`
