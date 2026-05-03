# Deployment Guide

Step-by-step guide to deploy this portfolio to Vercel using only free services.

## Services you'll create (all free)

| Service | Purpose | Cost |
|---|---|---|
| [GitHub](https://github.com) | Host the source code | Free |
| [Neon](https://neon.tech) | Postgres database | Free tier (3 GB, no expiry) |
| [Vercel](https://vercel.com) | Host the Next.js app + API + Blob storage | Free hobby plan |

**Total time:** ~20 minutes.

---

## Step 0 — Generate production secrets

Do this first so you can paste them in Step 4. Run from your terminal:

```bash
cd frontend

# 1. Generate JWT_SECRET — copy the output
openssl rand -hex 32

# 2. Generate ADMIN_PASSWORD_HASH — pick a strong password, copy the bcrypt output
bun run hash:password 'YOUR_STRONG_PASSWORD_HERE'
```

Keep both outputs in a temporary notes file. You'll paste them into Vercel in Step 4.

---

## Step 1 — Push to GitHub

If the repo isn't on GitHub yet:

1. Go to [github.com/new](https://github.com/new) and create a repo named `resume-blog` (private or public).
2. **Do not** add a README, license, or gitignore (you already have them).
3. From your terminal:

```bash
git add -A
git commit -m "migrate to vercel-only architecture"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/resume-blog.git
git push -u origin main
```

> If `git remote add` errors with "already exists", skip it and just `git push`.

---

## Step 2 — Create a Neon Postgres database

1. Go to [neon.tech](https://neon.tech) and **Sign up** (GitHub SSO is fastest).
2. After signup, click **Create project**.
   - Project name: `resume-blog`
   - Region: closest to you
   - Click **Create**
3. Neon shows a **Connection string** panel. Two strings are visible:
   - **Pooled connection** (has `-pooler` in the host) — **use this one**
   - **Direct connection** — do not use
4. Copy the **pooled** connection string. It looks like:
   ```
   postgresql://user:pass@ep-xyz-pooler.region.aws.neon.tech/dbname?sslmode=require
   ```

---

## Step 3 — Apply schema and seed the database

From your local machine, point Prisma at Neon and push the schema + seed data:

```bash
cd frontend

# Save the Neon URL to a local-only env file (gitignored)
echo 'DATABASE_URL="paste-your-neon-pooled-url-here"' > .env.local

bun run db:push    # creates the tables
bun run db:seed    # inserts the initial portfolio data
```

Expected output: `✅ Database seeded successfully!`

---

## Step 4 — Deploy to Vercel

1. Go to [vercel.com/signup](https://vercel.com/signup) and sign up with GitHub.
2. Click **Add New → Project**.
3. Find the `resume-blog` repo and click **Import**.
4. Configure the project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** click **Edit** → select `frontend` → **Continue**
   - Build / Install / Output: leave at defaults
5. Expand **Environment Variables** and add these four:

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | Neon pooled URL from Step 2 |
   | `JWT_SECRET` | random hex from Step 0 |
   | `ADMIN_USERNAME` | `admin` |
   | `ADMIN_PASSWORD_HASH` | bcrypt hash from Step 0 |

6. Click **Deploy**.
7. Wait ~1-2 minutes. You'll get a "Congratulations" screen with your `*.vercel.app` URL.
8. Open the URL. Visit `/admin` and log in with the password you chose in Step 0.

> **Resume upload won't work yet** because Blob storage isn't enabled. That's Step 5.

---

## Step 5 — Enable Vercel Blob

For resume PDF uploads.

1. In your Vercel project dashboard → **Storage** tab → **Create Database** → choose **Blob**.
2. Name it (e.g. `resume-blog-blob`) → **Create**.
3. Vercel asks "Connect to project?" — select your `resume-blog` project, all environments (**Production / Preview / Development**) → **Connect**.
4. Vercel auto-injects `BLOB_READ_WRITE_TOKEN` into your project's env vars.
5. Trigger a redeploy so the new env var takes effect:
   - **Deployments** tab → click **⋯** on the latest deploy → **Redeploy** → confirm.

After the redeploy finishes, resume upload works.

---

## Step 6 — Test the live site

Visit your `*.vercel.app` URL and verify each of:

- [ ] Home page loads with experience, skills, projects sections
- [ ] `/blog` shows the seeded blog posts
- [ ] `/admin` login works with your new password
- [ ] In the admin dashboard, edit a field (e.g. hero title) and save — it persists on refresh
- [ ] Upload a resume PDF — it appears on the public `/resume` page

If anything breaks, check the Vercel **Logs** tab for the failing function.

---

## Step 7 (optional) — Custom domain

To use `yourname.com` instead of `*.vercel.app`:

1. Vercel project → **Settings** → **Domains** → **Add**
2. Type your domain → follow Vercel's DNS instructions (usually a CNAME at your registrar)
3. Wait 5-30 minutes for DNS to propagate

---

## Day-to-day workflow

**Code changes:**

```bash
git add -A
git commit -m "your message"
git push
```

Vercel auto-rebuilds and redeploys within 1-2 minutes.

**Schema changes** (you edit `frontend/prisma/schema.prisma`):

```bash
cd frontend
bun run db:push   # applies the change to Neon directly
```

**Forgot the admin password:** generate a new hash with `bun run hash:password 'newpw'`, paste it into Vercel env vars, then redeploy.

---

## Troubleshooting

**"Can't reach database" on Vercel:**
- Confirm `DATABASE_URL` uses the **pooled** connection string (has `-pooler` in the hostname).
- Confirm `?sslmode=require` is in the URL.

**"Invalid credentials" on admin login:**
- The `ADMIN_PASSWORD_HASH` env var on Vercel must be the bcrypt hash, not the raw password.
- `$` characters in env vars don't need escaping in Vercel's UI (unlike `docker-compose`).

**Resume upload returns 500:**
- Check that Step 5 (Vercel Blob) is done and you've redeployed since enabling it.
- Check the Vercel function logs for the resume route.

**`bun run db:push` fails with SSL error locally:**
- Make sure `?sslmode=require` is at the end of your `DATABASE_URL`.

**Build succeeds but pages return 500:**
- Most often: missing env var on Vercel. Check **Settings → Environment Variables** has all four from Step 4.
- After adding/changing env vars, you must redeploy — env changes don't apply to existing deploys.
