# ── Stage 1: Build frontend ────────────────────────────────────────────────────
FROM node:22-alpine AS frontend-build

WORKDIR /app
COPY config.yaml ./
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci
COPY frontend/ ./frontend/
RUN cd frontend && CONFIG_PATH=/app/config.yaml npm run build

# ── Stage 2: Build backend ─────────────────────────────────────────────────────
FROM node:22-alpine AS backend-build

WORKDIR /app
COPY backend/package*.json ./
RUN npm ci
COPY backend/tsconfig.json ./
COPY backend/src ./src
RUN npm run build

# ── Stage 3: Production ────────────────────────────────────────────────────────
# Official Playwright image has Chromium + all dependencies pre-installed
FROM mcr.microsoft.com/playwright:v1.58.2-noble AS production

ENV NODE_ENV=production

WORKDIR /app

# Backend production dependencies
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Compiled backend
COPY --from=backend-build /app/dist ./dist

# Frontend static files served by backend
COPY --from=frontend-build /app/frontend/dist ./public

# Playwright tests
COPY playwright-tests/package*.json ./playwright-tests/
RUN cd playwright-tests && npm ci
COPY playwright-tests/ ./playwright-tests/

RUN mkdir -p /app/reports

ENV PLAYWRIGHT_TESTS_DIR=/app/playwright-tests
ENV REPORTS_DIR=/app/reports

EXPOSE 3001
CMD ["node", "dist/index.js"]
