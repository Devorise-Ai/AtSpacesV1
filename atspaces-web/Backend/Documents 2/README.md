# 🏢 AtSpaces — Full-Stack Workspace Booking Platform

AtSpaces is a multi-tenant coworking space booking platform built as a **Turborepo monorepo**. It allows customers to discover and book workspaces (hot desks, private offices, meeting rooms), vendors to manage their spaces, and administrators to oversee the entire platform.

---

## 📁 Project Structure

```
atspaces-web/Backend/
├── apps/
│   ├── api/              # NestJS REST + WebSocket backend (Port 3001)
│   ├── customer-web/     # React Vite — Customer portal (Port 5173)
│   ├── vendor-web/       # React Vite — Vendor portal (Port 5174)
│   └── admin-web/        # React / Next.js — Admin dashboard (Port 5175)
├── packages/             # Shared utilities and types
├── docker-compose.yml    # PostgreSQL + Redis containers
├── turbo.json            # Turborepo pipeline config
└── package.json          # Root monorepo package.json
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18 or higher
- **npm** v11 or higher
- **Docker Desktop** (for database containers)
- **Git**

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Database (Docker)
```bash
docker-compose up -d
```
This starts **PostgreSQL** on port `5432` and **Redis** on port `6379`.

### 3. Configure Environment Variables
Copy `.env.example` to `.env` in the root and in `apps/api/`:
```bash
cp .env.example .env
```
Fill in your values — see [Database README](./DATABASE.md) for details.

### 4. Run Database Migrations
```bash
npm run db:migrate
```

### 5. Start All Apps (Development)
```bash
npm run dev
```
This starts all apps concurrently via Turborepo.

---

## 📌 Application URLs

| App            | URL                        | Description             |
|----------------|----------------------------|-------------------------|
| API Backend    | http://localhost:3001      | NestJS REST API         |
| Swagger Docs   | http://localhost:3001/api/docs | Interactive API docs |
| Customer Web   | http://localhost:5173      | Customer booking portal |
| Vendor Web     | http://localhost:5174      | Vendor management       |
| Admin Web      | http://localhost:5175      | Admin dashboard         |

---

## 📚 Documentation Index

| Document | Description |
|----------|-------------|
| [BACKEND.md](./BACKEND.md) | NestJS API architecture, endpoints, and auth |
| [DATABASE.md](./DATABASE.md) | Prisma schema, models, Docker setup |
| [FRONTEND.md](./FRONTEND.md) | Frontend apps, components, and routing |
| [DOCKER.md](./DOCKER.md) | Full Docker & environment setup guide |

---

## 🛠️ Tech Stack at a Glance

| Layer | Technology |
|-------|-----------|
| Monorepo | Turborepo + npm workspaces |
| Backend | NestJS (Node.js) |
| Database | PostgreSQL 16 + Prisma ORM |
| Cache/Queue | Redis 7 |
| Frontend | React 19 + Vite + TypeScript |
| Auth | JWT + Google OAuth2 |
| AI | OpenAI GPT + Socket.IO streaming |
| Maps | Leaflet / react-leaflet |
| Animations | Framer Motion |

---

## 🔑 Key Features

- **Customer Portal** — Search workspaces, book services, AI chat assistant
- **Vendor Portal** — Manage branches, services, availability, and view bookings
- **Admin Dashboard** — Approve vendors, manage disputes, platform analytics
- **AI Assistant** — Real-time streaming chat powered by OpenAI, with persistent history
- **Authentication** — Email/password + Google OAuth2 with JWT tokens
- **OTP Verification** — Phone-based OTP for signup/login
