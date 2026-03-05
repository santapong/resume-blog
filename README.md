# Resume Blog — Medieval Portfolio

> *"A knight's portfolio, forged in code and presented upon digital parchment."*

A full-stack, medieval-themed personal portfolio website for showcasing experience, skills, projects, and a resume/CV. Features rich parchment textures, scroll-reveal animations, floating embers, and a fully functional admin dashboard.

## Tech Stack
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript
- **Backend:** Express.js, Prisma ORM, SQLite, JWT Auth
- **Environment:** Bun runtime, Docker

---

## 🚀 How to Run

You can run this project either using **Docker** (recommended for production/easy setup) or locally using **Bun** (recommended for development).

### Option 1: Using Docker (Easiest)
Requires [Docker](https://docs.docker.com/get-docker/) installed on your machine.

1. Clone the repository and navigate to the project root:
   ```bash
   cd resume-blog
   ```
2. Build and start the containers in detached mode:
   ```bash
   docker compose up -d --build
   ```
3. Access the application:
   - **Portfolio Site:** [http://localhost:12000](http://localhost:12000)
   - **Admin Gatehouse:** [http://localhost:12000/admin](http://localhost:12000/admin)

To stop the servers, run: `docker compose down`

---

### Option 2: Local Development with Bun
Requires [Bun](https://bun.sh/) installed on your machine.

#### 1. Setup the Backend
Open a terminal and run the following:
```bash
cd backend
bun install
bunx prisma db push     # Create/sync the SQLite database
bun run seed            # Seed initial data and admin user
bun run dev             # Start the backend API server
```
*The backend will run on `http://localhost:12001`*

#### 2. Setup the Frontend
Open a **second terminal** and run the following:
```bash
cd frontend
bun install
bun run dev             # Start the Next.js development server
```
*The frontend will run on `http://localhost:3000`*

3. Access the application:
   - **Portfolio Site:** [http://localhost:3000](http://localhost:3000)
   - **Admin Gatehouse:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🔐 Default Admin Credentials
To access the admin dashboard to manage your portfolio:
- **Username:** `admin`
- **Password:** `admin123`

*(Change these in `backend/.env` before deploying to production!)*
