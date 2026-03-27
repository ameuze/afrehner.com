# Build context is the project root (afrehner.com/)
# ── Build stage ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy config.yaml from project root
COPY config.yaml ./

# Install frontend dependencies
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm ci

# Copy frontend source
COPY frontend/ .

# Generate config.ts from YAML, then build
RUN CONFIG_PATH=/app/config.yaml npm run build:config
RUN npm run build

# ── Production stage with Nginx ───────────────────────────────────────────────
FROM nginx:alpine AS production

# Copy built assets
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Copy nginx config
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
