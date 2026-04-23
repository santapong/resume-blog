# Stage 1: Install dependencies
FROM oven/bun:latest AS deps
WORKDIR /app

# Copy configuration files
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Stage 2: Build the application
FROM oven/bun:latest AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* variables must be present as env at `next build` time so
# they are embedded into the client bundle. Compose passes this via
# build.args; the default here keeps local `docker build .` working.
ARG NEXT_PUBLIC_API_URL=http://localhost:12001/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Next.js build
ENV NODE_ENV=production
RUN bun run build

# Stage 3: Production Runner
FROM oven/bun:latest AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install wget for the compose healthcheck. The oven/bun image is
# Debian-slim and ships without wget or curl in the runner stage.
RUN apt-get update \
    && apt-get install -y --no-install-recommends wget \
    && rm -rf /var/lib/apt/lists/*

# Copy necessary files for standalone execution
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

# Run the standalone server using Bun
CMD ["bun", "server.js"]
