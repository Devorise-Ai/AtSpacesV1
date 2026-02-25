# Getting Started - AtSpaces Full Stack

This guide provides the complete sequence of steps to launch the entire AtSpaces ecosystem, including the database, backend, and all frontend applications.

## 📋 Prerequisites
- **Docker & Docker Compose** (for PostgreSQL and Redis)
- **Node.js** (v18+)
- **Git**

---

## 🚀 Unified Launch Sequence

Follow these steps in order to ensure all dependencies are resolved.

### Step 1: Infrastructure (Docker)
Start the database and cache services from the `atspaces-web/Backend` directory:
```bash
cd atspaces-web/Backend
docker compose up -d
```
*This starts PostgreSQL (5432) and Redis (6379).*

### Step 2: Backend Setup
Install dependencies and initialize the database from the `atspaces-web/Backend` directory:
```bash
cd atspaces-web/Backend

# Install dependencies
npm install

# Apply database migrations and generate Prisma Client
npm run db:migrate -- --name init_schema

# Seed the database with Jordanian branch data
npm run db:seed
```

### Step 3: Start Applications

#### A. Backend & Main Web App (Turbo)
Navigate to `atspaces-web/Backend` and run:
```bash
npm run dev
```

#### B. Main Frontend (Vite)
Navigate to `atspaces-web` and run:
```bash
npm install
------
npm run dev
```

#### C. Admin Dashboard
Navigate to `atspaces-admin-web` and run:
```bash
npm run dev
```

#### D. Vendor Dashboard
Navigate to `atspaces-vendor-web` and run:
```bash
npm run dev
```

---

## 🛠️ Management Commands

| Action | Working Directory | Command |
| :--- | :--- | :--- |
| **Reset Database** | `atspaces-web/Backend` | `npx prisma migrate reset --schema apps/api/prisma/schema.prisma` |
| **Open Admin UI** | `atspaces-web/Backend` | `npx prisma studio --schema apps/api/prisma/schema.prisma` |
| **Check Logs** | `atspaces-web/Backend` | `docker compose logs -f postgres` |

---

## 📄 Related Documentation
- [Database & Schema](./Database.md)
- [Project Architecture](./Architecture.md)
