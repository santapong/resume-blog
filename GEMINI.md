# Resume Blog — Frieren Theme

> *"A mage's portfolio, woven from logic and presented upon ethereal parchment."*

A full-stack Frieren-inspired personal portfolio website for showcasing experience, skills, projects, and a resume/CV.

## Architecture

```
resume-blog/
├── frontend/        → Next.js 16 + Tailwind CSS 4 + TypeScript
├── backend/         → Express.js + Prisma + SQLite + TypeScript
├── docker-compose.yml → Full-stack orchestration
└── GEMINI.md        → This file
```

## Tech Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | Next.js 16, React 19, Tailwind CSS 4, TypeScript |
| Backend    | Express.js, Prisma ORM, SQLite              |
| Auth       | JWT (admin only)                             |
| Runtime    | Bun                                         |
| Deploy     | Docker, Dokploy                              |
| Fonts      | Cinzel (headings), IM Fell English (body)    |

## Features

- **✨ Ethereal Frieren Theme** — Soft parchment textures, twilight blues, mana cyan sparkles, and elegant gold accents
- **📖 Journey's Log** — Vertical timeline of experience with pulsing mana nodes
- **🔮 Grimoire of Knowledge** — Skills display featuring elegant glass cards
- **📜 Scrolls of Magic** — Project gallery showcasing magical creations and artifacts
- **📄 Mage's Certification** — Embedded PDF resume viewer
- **🔐 Admin Panel** — JWT-protected dashboard for managing all content via API
- **📱 Responsive** — Mobile-first design

## Pages

| Route       | Name                  | Description                          |
|-------------|-----------------------|--------------------------------------|
| `/`         | The Grand Hall        | Hero, skills, experience sections    |
| `/projects` | Scrolls of Magic      | Project showcase grid                |
| `/resume`   | Mage's Certification  | PDF resume viewer/download           |
| `/admin`    | The Gatehouse         | Login + content management dashboard |

## API Endpoints

| Method | Endpoint               | Auth | Description              |
|--------|------------------------|------|--------------------------|
| GET    | `/api/experiences`     | No   | List all experiences     |
| POST   | `/api/experiences`     | Yes  | Create experience        |
| PUT    | `/api/experiences/:id` | Yes  | Update experience        |
| DELETE | `/api/experiences/:id` | Yes  | Delete experience        |
| GET    | `/api/skills`          | No   | List all skills          |
| POST   | `/api/skills`          | Yes  | Create skill             |
| PUT    | `/api/skills/:id`      | Yes  | Update skill             |
| DELETE | `/api/skills/:id`      | Yes  | Delete skill             |
| GET    | `/api/projects`        | No   | List all projects        |
| POST   | `/api/projects`        | Yes  | Create project           |
| PUT    | `/api/projects/:id`    | Yes  | Update project           |
| DELETE | `/api/projects/:id`    | Yes  | Delete project           |
| GET    | `/api/resume`          | No   | Get active resume PDF    |
| POST   | `/api/resume`          | Yes  | Upload new resume PDF    |
| POST   | `/api/auth/login`      | No   | Admin login (returns JWT)|
| GET    | `/api/config`          | No   | Get site configuration   |
| PUT    | `/api/config`          | Yes  | Update site configuration|

## Development & Testing Policy

**CRITICAL POLICY:** When a change or feature is finished, it **MUST** be thoroughly tested for errors, visual bugs (like poor contrast or layout duplication), and logic flaws. 
If an error or issue is found:
1. It must be logged immediately in `/errorlog.md`, detailing the issue, root cause, and the fix.
2. The error must be resolved before presenting the final result.

```bash
# Backend
cd backend && bun install && bun run dev   # http://localhost:12001

# Frontend
cd frontend && bun install && bun run dev  # http://localhost:3000
```

## Docker Deployment

```bash
# Build and run everything
docker compose up -d --build

# Frontend: http://localhost:12000
# Backend:  http://localhost:12001
```

## Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="$2b$10$..."   # bcrypt hash
PORT=12001
```

### Frontend (`frontend/.env`)
```env
NEXT_PUBLIC_API_URL=http://localhost:12001/api
```

## Database Schema

```prisma
model Experience {
  id           Int      @id @default(autoincrement())
  title        String
  company      String
  period       String
  description  String
  technologies String   // JSON array
  order        Int      @default(0)
  createdAt    DateTime @default(now())
}

model Skill {
  id       Int    @id @default(autoincrement())
  category String
  items    String // JSON array
  order    Int    @default(0)
}

model Project {
  id           Int      @id @default(autoincrement())
  title        String
  description  String
  imageUrl     String?
  liveUrl      String?
  repoUrl      String?
  technologies String   // JSON array
  featured     Boolean  @default(false)
  order        Int      @default(0)
  createdAt    DateTime @default(now())
}

model Resume {
  id         Int      @id @default(autoincrement())
  filename   String
  isActive   Boolean  @default(true)
  uploadedAt DateTime @default(now())
}

model SiteConfig {
  id           Int    @id @default(1)
  heroTitle    String @default("Software & Automation Engineer")
  heroSubtitle String @default("")
  aboutText    String @default("")
}
```

## Color Palette

| Name         | Hex       | Usage                    |
|--------------|-----------|--------------------------|
| Parchment    | `#f8fafc` | Ethereal white backgrounds |
| Dark Wood    | `#1e293b` | Deep slate blue text/headers |
| Gold         | `#fbbf24` | Accents, borders, magical glows |
| Mana Cyan    | `#0ea5e9` | Highlights, hover states, auras |
| Forest Green | `#047857` | Secondary accents        |
| Aged Paper   | `#e2e8f0` | Cool card backgrounds    |
| Iron         | `#475569` | Body text                |
