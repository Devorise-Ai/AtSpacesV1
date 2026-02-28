# 🐳 Complete Setup Tutorial — Docker, Backend & Frontend

This guide walks you through setting up the full AtSpaces platform from scratch.

---

## ✅ Prerequisites

Before starting, ensure you have these installed:

| Tool | Required Version | Download |
|------|-----------------|---------|
| Node.js | v18 or higher | [nodejs.org](https://nodejs.org) |
| npm | v11 or higher | Comes with Node.js |
| Docker Desktop | Latest | [docker.com](https://www.docker.com/products/docker-desktop) |
| Git | Any | [git-scm.com](https://git-scm.com) |

Verify your installations:
```bash
node --version      # Should be v18+
npm --version       # Should be v11+
docker --version    # Should be 24+
docker compose version
```

---

## 📥 Step 1 — Clone the Repository

```bash
git clone https://github.com/devorise/atspaces-6601d797.git
cd atspaces-6601d797/atspaces-web/Backend
```

---

## 📦 Step 2 — Install Dependencies

```bash
npm install
```

This installs packages for all apps and packages in the monorepo.

---

## ⚙️ Step 3 — Configure Environment Variables

Create a `.env` file in the `Backend/` root directory:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS / Linux
cp .env.example .env
```

Then open `.env` and fill in your values:

```env
# ─────────────────────────────────
# 🗄️  DATABASE
# ─────────────────────────────────
DATABASE_URL="postgresql://postgres:password@localhost:5432/atspaces"

# ─────────────────────────────────
# 🔐 JWT AUTHENTICATION
# ─────────────────────────────────
JWT_SECRET="change-this-to-a-secure-random-string-in-production"
JWT_EXPIRES_IN="1d"

# ─────────────────────────────────
# 🤖 OPENAI (AI ASSISTANT)
# ─────────────────────────────────
OPENAI_API_KEY="sk-your-openai-api-key"

# ─────────────────────────────────
# 🔑 GOOGLE OAUTH2
# ─────────────────────────────────
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3001/api/auth/google/callback"

# ─────────────────────────────────
# 📧 EMAIL (GMAIL SMTP)
# ─────────────────────────────────
SMTP_EMAIL="your@gmail.com"
SMTP_APP_PASSWORD="your-gmail-app-password"

# ─────────────────────────────────
# 🌐 FRONTEND URL (for OAuth redirects)
# ─────────────────────────────────
FRONTEND_URL="http://localhost:5173"

# ─────────────────────────────────
# 🚀 SERVER
# ─────────────────────────────────
PORT=3001
```

> **Tip:** To get a Gmail App Password:
> 1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
> 2. Enable 2-Factor Authentication
> 3. Go to App Passwords → Generate one for "Mail"

---

## 🐳 Step 4 — Start the Database with Docker

This starts **PostgreSQL 16** and **Redis 7** as Docker containers.

```bash
# Start containers in the background
docker-compose up -d
```

**Verify containers are running:**
```bash
docker ps
```

Expected output:
```
CONTAINER ID   IMAGE                COMMAND                  STATUS          NAMES
abc123456789   postgres:16-alpine   "docker-entrypoint.s…"   Up 2 minutes    atspaces-postgres
def987654321   redis:7-alpine       "docker-entrypoint.s…"   Up 2 minutes    atspaces-redis
```

**Check PostgreSQL is accepting connections:**
```bash
docker exec -it atspaces-postgres psql -U postgres -d atspaces -c "SELECT version();"
```

---

## 🗄️ Step 5 — Run Database Migrations

Apply the Prisma schema to create all database tables:

```bash
npm run db:migrate
```

Seed the database with initial data (service types, facilities, etc.):
```bash
npm run db:seed
```

**Optional — Open Prisma Studio (visual DB browser):**
```bash
npx prisma studio --schema apps/api/prisma/schema.prisma
```
This opens at [http://localhost:5555](http://localhost:5555)

---

## 🔥 Step 6 — Start the Backend

### Option A — Start Everything at Once (Recommended)

```bash
# This starts API + all frontend apps
npm run dev
```

### Option B — Start Backend Only

```bash
cd apps/api
npm run dev
```

✅ **Backend is running at:** [http://localhost:3001](http://localhost:3001)  
✅ **Swagger API Docs:** [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

**Expected console output:**
```
[Env] Attempting to load root .env: .../Backend/.env
[Env] Attempting to load api .env: .../Backend/apps/api/.env
[Env] Detected GOOGLE_CLIENT_ID starting with: 844078748...
Server is running on port 3001
```

---

## 🌐 Step 7 — Start the Frontend Apps

### Option A — All Together (via monorepo root)

```bash
npm run dev
```

### Option B — Individual Frontend Apps

**Customer Web:**
```bash
cd apps/customer-web
npm run dev
# Runs at http://localhost:5173
```

**Vendor Web:**
```bash
cd apps/vendor-web
npm run dev
# Runs at http://localhost:5174
```

**Admin Web:**
```bash
cd apps/admin-web
npm run dev
# Runs at http://localhost:5175
```

---

## 📍 All Running Services Summary

| Service | URL | Status |
|---------|-----|--------|
| 🗄️ PostgreSQL | `localhost:5432` | Started by Docker |
| 🔴 Redis | `localhost:6379` | Started by Docker |
| ⚙️ NestJS API | http://localhost:3001 | `npm run dev` |
| 📖 Swagger Docs | http://localhost:3001/api/docs | Auto with API |
| 🛍️ Customer Portal | http://localhost:5173 | `npm run dev` |
| 🏪 Vendor Portal | http://localhost:5174 | `npm run dev` |
| 👑 Admin Panel | http://localhost:5175 | `npm run dev` |

---

## 🛑 Stopping Everything

```bash
# Stop frontend dev servers: Ctrl+C in terminal

# Stop Docker containers (keeps data)
docker-compose down

# Stop Docker containers and DELETE all data (full reset)
docker-compose down -v
```

---

## 🔄 After Pulling New Code

When you pull new changes from Git:

```bash
# 1. Install any new packages
npm install

# 2. Apply any new database migrations
npm run db:migrate

# 3. Start the dev servers
npm run dev
```

---

## 🐛 Troubleshooting

### ❌ "Cannot connect to database"
```bash
# Check Docker is running
docker ps

# Restart containers
docker-compose down && docker-compose up -d

# Check DATABASE_URL in .env matches docker-compose.yml
# DATABASE_URL="postgresql://postgres:password@localhost:5432/atspaces"
```

### ❌ "Port 5432 already in use"
```bash
# Find and stop the process using port 5432
# Windows:
netstat -ano | findstr :5432
taskkill /PID <PID> /F

# macOS:
lsof -i :5432
kill -9 <PID>
```

### ❌ "JWT Secret missing" or "Invalid token"
Make sure `.env` has a valid `JWT_SECRET` and that you restarted the API server after editing `.env`.

### ❌ "Google OAuth not working"
Ensure your Google Cloud Console has `http://localhost:3001/api/auth/google/callback` added as an Authorized Redirect URI.

### ❌ "AI Assistant shows 'Backend offline'"
Make sure the NestJS backend is running on port 3001 and that `OPENAI_API_KEY` is set in `.env`.

### ❌ Prisma migration fails
```bash
# Reset database and re-run migrations (⚠️ deletes all data)
npx prisma migrate reset --schema apps/api/prisma/schema.prisma
npm run db:seed
```

---

## 🏗️ Production Build

```bash
# Build all apps for production
npm run build

# Output locations:
# API:          apps/api/dist/
# Customer Web: apps/customer-web/dist/
# Vendor Web:   apps/vendor-web/dist/
# Admin Web:    apps/admin-web/dist/ (or .next/)
```
