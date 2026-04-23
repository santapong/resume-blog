# Stage 1: Install dependencies
FROM oven/bun:latest AS deps
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile || bun install

# Stage 2: Generate Prisma client
FROM oven/bun:latest AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bunx prisma generate

# Stage 3: Production runner
FROM oven/bun:latest AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=12001
# SQLite lives inside the mounted `data/` subdirectory so the named
# volume does not shadow the baked-in schema.prisma at /app/prisma.
ENV DATABASE_URL=file:./data/dev.db

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./

# Install curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Create runtime directories. `prisma/data` must exist in the image so
# Docker seeds the named volume from it on first attach.
RUN mkdir -p uploads/resumes prisma/data

EXPOSE 12001

# Startup sequence:
#   1. `prisma db push` materialises the latest schema (including new
#      models like BlogPost) onto the SQLite file inside the volume.
#   2. First-boot seed is guarded by a `.seeded` marker file that lives
#      inside the volume, so it runs exactly once per fresh volume and
#      is skipped on every subsequent restart.
#   3. Server starts.
CMD ["sh", "-c", "bunx prisma db push --skip-generate && if [ ! -f /app/prisma/data/.seeded ]; then bun run db:seed && touch /app/prisma/data/.seeded; fi && bun src/index.ts"]
