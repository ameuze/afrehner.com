# ── Base image with system browsers for Playwright ────────────────────────────
FROM node:22-alpine AS base

WORKDIR /app

# Install Chromium and dependencies for Playwright
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    bash

# Tell Playwright to use system Chromium (skip download)
ENV PLAYWRIGHT_BROWSERS_PATH=/usr/bin
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV CHROMIUM_PATH=/usr/bin/chromium-browser

# ── Development stage ─────────────────────────────────────────────────────────
FROM base AS development

COPY backend/package*.json ./
RUN npm ci

COPY backend/tsconfig.json ./
COPY backend/src ./src

EXPOSE 3001
CMD ["npm", "run", "dev"]

# ── Build stage ───────────────────────────────────────────────────────────────
FROM base AS builder

COPY backend/package*.json ./
RUN npm ci

COPY backend/tsconfig.json ./
COPY backend/src ./src
RUN npm run build

# ── Production stage ──────────────────────────────────────────────────────────
FROM base AS production

WORKDIR /app

# Backend deps and built code
COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# Install playwright-tests deps
WORKDIR /app/playwright-tests
COPY playwright-tests/package*.json ./
RUN npm ci --omit=dev

# Copy playwright tests
COPY playwright-tests/ .

# Create reports dir
RUN mkdir -p /app/reports

WORKDIR /app

ENV PLAYWRIGHT_TESTS_DIR=/app/playwright-tests
ENV REPORTS_DIR=/app/reports

EXPOSE 3001
CMD ["node", "dist/index.js"]
