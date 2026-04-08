# Frontend

React application for [afrehner.com](https://afrehner.com) — a portfolio site with an integrated live Playwright test runner.

## Overview

This is a single-page application built with React 18, Vite, and Tailwind CSS. Beyond the standard portfolio sections (hero, about, skills, projects, contact), it includes a **real-time test runner panel** that connects to the backend over WebSocket to stream live Playwright test output directly in the browser.

The test runner panel isn't a static mockup — it renders actual test execution output as it happens, complete with run/stop/reset controls, suite selection, and live pass/fail statistics.

## Content System

All site content is driven by `config.yaml` at the repo root. A build-time code generation step (`scripts/build-config.ts`) validates the YAML against a Zod schema and produces a typed TypeScript module at `src/generated/config.ts`. This means:

- Content changes require zero code changes — edit the YAML, rebuild
- Invalid config is caught at build time, not runtime
- The generated module is fully typed — no `as any`, no loose strings

The prebuild step runs automatically via npm's `prebuild` hook.

## Key Components

### Test Runner (`src/components/test-runner/`)

The `TestRunnerPanel` is the most complex component. It uses the `useTestRunner` hook to manage:

- WebSocket connection lifecycle (connect, subscribe, reconnect)
- Output buffering and display in a terminal-style window
- Status transitions: idle, connecting, running, passed, failed, cancelled, error, busy
- Late-join support — subscribing to an in-progress run replays the full output buffer

The WebSocket URL is derived automatically from the page's location in production, or from `VITE_WS_URL` in development.

### Theming

Dark/light theme toggle using React Context and CSS custom properties defined in `src/globals.css`. Colors are specified as CSS variables (`--bg-primary`, `--text-muted`, `--accent-green`, etc.) so the entire palette switches without component re-renders.

## Development

```bash
npm install
npm run dev        # Vite dev server at http://localhost:5173
npm run build      # Production build to dist/
```

In development, Vite proxies `/api`, `/ws`, and `/reports` to the backend at `localhost:3001` (configured in `vite.config.ts`).

## Tech Stack

React 18, TypeScript, Vite 5, Tailwind CSS 3, Framer Motion, Lucide React, Zod
