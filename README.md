# Resume Blog — Cosmic Portfolio

> *"A knight's portfolio, forged in code and presented upon digital parchment."*

A full-stack personal portfolio with experience, skills, projects, blog, and an admin dashboard. Built as a single Next.js app — runs entirely on Vercel's free tier.

## Tech Stack
- **Framework:** Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript
- **Database:** Prisma + Postgres (Neon free tier)
- **File storage:** Vercel Blob (for resume PDF uploads)
- **Auth:** JWT, bcrypt
- **Runtime:** Bun (local), Vercel serverless (production)

---

## 🚀 Local Development

Requires [Bun](https://bun.sh/), and a Postgres database (use [Neon](https://neon.tech) — free, no install — or run Postgres locally).

```bash
cd frontend
bun install                        # also runs prisma generate
cp .env.example .env.local         # fill in DATABASE_URL, JWT_SECRET, ADMIN_PASSWORD_HASH
bun run hash:password 'admin123'   # generates the bcrypt hash to paste into .env.local
bun run db:push                    # apply schema to Postgres
bun run db:seed                    # seed initial portfolio data
bun run dev                        # http://localhost:3000
```

Admin dashboard: http://localhost:3000/admin (login with the username/password matching `ADMIN_PASSWORD_HASH`).

---

## ☁️ Deploying to Vercel

The whole app — frontend, API, database access, and file uploads — runs on Vercel. No separate backend host needed.

### 1. Create a Postgres database (Neon, free)

1. Sign up at [neon.tech](https://neon.tech).
2. Create a project. Copy the **pooled** connection string (Neon labels it for serverless).
3. Save it for step 3.

### 2. Push code to GitHub

If you haven't already: create a GitHub repo and push this project.

### 3. Import to Vercel

1. [vercel.com/new](https://vercel.com/new) → import the repo.
2. **Root Directory** → `frontend`.
3. Framework auto-detects as Next.js. Leave build/install commands as defaults.
4. Add **Environment Variables**:
   - `DATABASE_URL` — your Neon connection string
   - `JWT_SECRET` — long random string: `openssl rand -hex 32`
   - `ADMIN_USERNAME` — e.g. `admin`
   - `ADMIN_PASSWORD_HASH` — bcrypt hash; generate with:
     ```bash
     cd frontend && bun run hash:password 'YOUR_STRONG_PASSWORD'
     ```
5. **Deploy.** First build will fail at runtime if the DB schema isn't applied yet — see step 4.

### 4. Apply schema and seed (one-time)

After the first deploy, run from your local machine using the same `DATABASE_URL`:

```bash
cd frontend
DATABASE_URL='<neon-url>' bun run db:push
DATABASE_URL='<neon-url>' bun run db:seed
```

### 5. Enable Vercel Blob (for resume uploads)

1. In the Vercel dashboard → your project → **Storage** → **Create** → **Blob**.
2. Vercel auto-injects `BLOB_READ_WRITE_TOKEN` into your project's env vars.
3. Redeploy (or trigger by pushing a commit) so the new env var takes effect.

That's it. Visit your `*.vercel.app` URL.

---

## 🔐 Default Admin Credentials

For local dev only:
- **Username:** `admin`
- **Password:** `admin123`

**Generate fresh credentials before deploying.** Use `bun run hash:password 'NEW_PASSWORD'` and update `ADMIN_PASSWORD_HASH` in Vercel's env vars.

---

## 📁 Project Structure

```
frontend/
  app/
    api/             — Next.js route handlers (the "backend")
    admin/           — admin dashboard pages
    blog/, projects/, resume/  — public pages
    components/, lib/, data/   — shared client code
  lib/               — shared server code (prisma, auth)
  prisma/
    schema.prisma    — database schema
    seed.ts          — initial portfolio data
  scripts/
    hash-password.ts — bcrypt hash generator
```
