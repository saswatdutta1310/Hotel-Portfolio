# Stage 1: Build
FROM node:26-slim AS builder

# Install pnpm directly via npm pinned to 12.18.0 (corepack removed from Node 25+)
RUN npm install -g pnpm@12.18.0

WORKDIR /app

# Copy dependency manifests and config
COPY package.json pnpm-lock.yaml .npmrc ./

# Install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy application source, data, scripts, and tsconfig
COPY tsconfig.json ./
COPY src ./src
COPY data ./data
COPY scripts ./scripts

# Build TypeScript source
RUN pnpm run build

# Stage 2: Production Runtime
FROM node:26-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Install curl for HEALTHCHECK
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Copy node_modules from builder or install directly
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy compiled dist from builder
COPY --from=builder /app/dist ./dist

# Copy hotel data files and validation scripts needed for prestart and runtime loader
COPY --from=builder /app/data ./data
COPY --from=builder /app/scripts ./scripts

# Switch to non-root user (node user provided by node:20-slim)
USER node

EXPOSE 4000

# Healthcheck on /health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

# Start server directly (or run prestart validation)
CMD ["sh", "-c", "node -e \"const { getAllHotels } = require('./dist/services/hotel-loader.js'); getAllHotels();\" 2>/dev/null || node -e \"const { getAllHotels } = await import('./dist/services/hotel-loader.js'); getAllHotels();\" && node dist/server.js"]
