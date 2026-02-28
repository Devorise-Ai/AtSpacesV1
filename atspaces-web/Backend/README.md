<p align="center">
  <img src="apps/admin-web/public/favicon.svg" width="80" alt="AtSpaces Logo" />
</p>

<h1 align="center">AtSpaces — Premium Workspace Booking Platform</h1>

<p align="center">
  <strong>A full-stack, multi-portal workspace booking platform built for the Jordanian market.</strong><br/>
  Customers discover and book workspaces · Vendors manage their listings · Admins oversee the network.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" />
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Portals](#portals)
  - [Customer Portal](#-customer-portal)
  - [Vendor Portal](#-vendor-portal)
  - [Admin Portal](#-admin-portal)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Development Status](#development-status)

---

## Overview

**AtSpaces** is a premium coworking & workspace booking platform designed for the Jordanian market (Amman, Irbid, Zarqa, Aqaba, and more). It provides three distinct portals:

- **Customers** browse, filter, and book workspaces (hot desks, private offices, meeting rooms)
- **Vendors** manage their branches, resources, availability, and track revenue analytics
- **Admins** oversee the entire network — approve vendors, manage branches, configure pricing

The platform features a modern glassmorphism UI, JWT authentication, Google OAuth, real-time availability management, and a fully containerized Docker deployment.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                       AtSpaces Platform                      │
├─────────────┬─────────────┬─────────────┬────────────────────┤
│ Customer    │ Vendor      │ Admin       │ API Backend        │
│ Portal      │ Portal      │ Portal      │ (NestJS)           │
│ (Vite+React)│ (Next.js)   │ (Next.js)   │                    │
│ :5173       │ :3002       │ :3000       │ :3001              │
├─────────────┴─────────────┴─────────────┴────────────────────┤
│                    Shared UI Package (@repo/ui)              │
├──────────────────────────────────────────────────────────────┤
│  PostgreSQL (Prisma ORM)    │    Redis (Sessions/Cache)      │
└──────────────────────────────────────────────────────────────┘
```

---

## Portals

### 🟢 Customer Portal

`apps/customer-web` — React + Vite (Port 5173)

| Feature | Description |
|---------|-------------|
| **Workspace Discovery** | Browse workspaces with rich cards, photos, and ratings |
| **Advanced Search & Filters** | Filter by city, service type, price range (min/max sliders), rating, amenities |
| **Booking Wizard** | Multi-step date/time selection with real-time availability checking |
| **My Bookings** | View all bookings with status badges and full booking details |
| **E-Ticket System** | QR-code based digital tickets for confirmed bookings |
| **Interactive Map** | MapView integration showing workspace locations |
| **AI Assistant** | AI-powered chat assistant for workspace recommendations |
| **Google OAuth** | Sign in with Google alongside email/password authentication |

### 🔵 Vendor Portal

`apps/vendor-web` — Next.js (Port 3002)

| Feature | Description |
|---------|-------------|
| **Dashboard** | KPI cards (bookings, revenue, occupancy) with Recharts analytics |
| **Revenue Analytics** | Area chart (7-day revenue trend) + Pie chart (service distribution) |
| **Resources & Capacity** | Manage service pricing, availability status, and max capacity |
| **Availability Calendar** | Monthly calendar view — block/unblock time slots manually |
| **Booking Management** | Search, filter, and update booking statuses (confirm/cancel/complete) |
| **Become a Vendor** | Self-service vendor onboarding application flow |
| **Notifications** | In-app notification center for booking updates |

### 🔴 Admin Portal

`apps/admin-web` — Next.js (Port 3000)

| Feature | Description |
|---------|-------------|
| **Dashboard** | Platform-wide KPIs (users, branches, bookings, pending approvals) + alerts |
| **Branch Management** | List/search/filter branches · Pause/Resume branches via API · View details |
| **Vendor Management** | List vendors · Suspend/Activate accounts · Invite new vendors |
| **Approval Requests** | Review and approve/reject vendor applications with notes |
| **Network Analytics** | Recharts dashboards — occupancy by city, service usage, revenue comparison, peak hours heatmap, branch performance table |
| **Pricing & Policies** | Edit service pricing per tier · Manage booking policies (cancellation, no-show) |
| **Settings** | Profile management · Security (password change) · Notification preferences · Activity log |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | NestJS, Prisma 5.10, PostgreSQL, Redis, JWT, Swagger |
| **Customer Frontend** | React 18, Vite, TailwindCSS, Axios, Framer Motion |
| **Vendor Frontend** | Next.js 14, TailwindCSS, Recharts, Axios, Lucide Icons |
| **Admin Frontend** | Next.js 14, TailwindCSS, Recharts, Axios, Lucide Icons |
| **Shared** | Turborepo monorepo, `@repo/ui` component library |
| **Infrastructure** | Docker Compose, PostgreSQL 16, Redis 7 |
| **Auth** | JWT tokens, Google OAuth 2.0, OTP sessions |

---

## Project Structure

```
Backend/
├── apps/
│   ├── api/                    # NestJS Backend API
│   │   ├── prisma/             # Schema, migrations, seed
│   │   └── src/
│   │       ├── application/    # Services, guards, DTOs
│   │       ├── domain/         # Entities, enums, interfaces
│   │       ├── infrastructure/ # Prisma repos, external services
│   │       └── presentation/   # Controllers, modules
│   ├── customer-web/           # React + Vite customer portal
│   │   └── src/
│   │       ├── components/     # Hero, Navbar, Footer, Maps, etc.
│   │       ├── pages/          # Workspaces, BookingConfirm, Dashboard
│   │       └── services/       # API service layer
│   ├── vendor-web/             # Next.js vendor portal
│   │   └── src/
│   │       ├── app/(dashboard)/ # Dashboard, Bookings, Calendar, Capacity
│   │       ├── components/     # Layout, Dashboard, UI components
│   │       └── services/       # Vendor API service
│   └── admin-web/              # Next.js admin portal
│       └── src/
│           ├── app/(dashboard)/ # Dashboard, Branches, Vendors, Analytics
│           ├── components/     # Layout, UI components
│           └── services/       # Admin API service
├── packages/
│   ├── ui/                     # Shared component library (@repo/ui)
│   ├── eslint-config/          # Shared ESLint configuration
│   └── typescript-config/      # Shared TypeScript configuration
├── docker-compose.yml          # Full-stack Docker orchestration
├── Dockerfile                  # Multi-stage build
├── package.json                # Turborepo workspace root
└── turbo.json                  # Turborepo pipeline config
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Docker & Docker Compose** (for database + Redis)
- **npm** (comes with Node.js)

### Quick Start (Docker)

```bash
# Clone the repository
git clone https://github.com/Devorise-Ai/AtSpacesV1.git
cd AtSpacesV1/Backend

# Start all services (DB, Redis, API, Customer, Vendor, Admin)
docker-compose up --build
```

Services will be available at:
- **Customer Portal**: http://localhost:5173
- **Admin Portal**: http://localhost:3000
- **Vendor Portal**: http://localhost:3002
- **API**: http://localhost:3001/api

### Local Development

```bash
# Install dependencies
npm install

# Start database & Redis via Docker
docker-compose up db redis -d

# Run database migrations
npx prisma migrate dev --schema apps/api/prisma/schema.prisma

# Seed the database
npx prisma db seed --schema apps/api/prisma/schema.prisma

# Start all apps in dev mode
npm run dev
```

---

## Environment Variables

Create `apps/api/.env`:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/atspaces"

# AI Assistant
OPENAI_API_KEY="your-openai-key"

# Email (SMTP)
SMTP_EMAIL="your-email@gmail.com"
SMTP_APP_PASSWORD="your-app-password"

# JWT Authentication
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1d"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3001/api/auth/google/callback"

# Server
PORT=3001
NODE_ENV=development
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login with email/password |
| GET | `/api/auth/google` | Google OAuth login |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | List user bookings |
| POST | `/api/bookings` | Create a new booking |
| PATCH | `/api/bookings/:id/cancel` | Cancel a booking |
| PATCH | `/api/bookings/:id/status` | Update booking status |

### Branches & Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/branches` | List all branches |
| GET | `/api/branches/:id` | Get branch details |
| GET | `/api/services` | List service types |

### Vendor
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vendor/dashboard` | Vendor dashboard stats |
| GET | `/api/vendor/availability` | Get availability slots |
| PATCH | `/api/vendor/availability/toggle-block` | Block/unblock a slot |
| PATCH | `/api/vendor/services/:id` | Update service details |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Platform-wide statistics |
| GET | `/api/admin/users` | List all users |
| PATCH | `/api/admin/users/:id/suspend` | Suspend a user |
| PATCH | `/api/admin/users/:id/activate` | Activate a user |
| PATCH | `/api/admin/branches/:id/pause` | Suspend a branch |
| PATCH | `/api/admin/branches/:id/resume` | Resume a branch |
| PATCH | `/api/admin/branches/:id/amenities` | Update branch facilities |
| PATCH | `/api/admin/pricing/:serviceId` | Update service pricing |
| GET | `/api/admin/approval-requests` | List approval requests |
| PATCH | `/api/admin/approval-requests/:id/approve` | Approve a request |
| PATCH | `/api/admin/approval-requests/:id/reject` | Reject a request |

---

## Database Schema

**Core Models**: User, Branch, Service, VendorService, Availability, Booking, Payment, ApprovalRequest

**Enums**: UserRole (customer/vendor/admin), BranchStatus (active/suspended/pending), ServiceName (hot_desk/private_office/meeting_room), BookingStatus, PaymentStatus, PriceUnit

See full schema: [`apps/api/prisma/schema.prisma`](apps/api/prisma/schema.prisma)

---

## Development Status

### ✅ Phase 1 — Foundation
- Monorepo setup (Turborepo)
- PostgreSQL + Prisma schema with 15+ models
- NestJS API with Clean Architecture (Domain → Application → Infrastructure → Presentation)
- JWT authentication + Google OAuth
- Docker Compose orchestration

### ✅ Phase 2 — Design Integration
- Premium glassmorphism UI across all portals
- Responsive layouts with mobile-first design
- Consistent design system via `@repo/ui` shared components
- Framer Motion animations

### ✅ Phase 3 — Core Functional Workflows
- **Customer**: Multi-step booking wizard, My Bookings with E-tickets, advanced search filters
- **Vendor**: Resource management, availability calendar, revenue analytics (Recharts)
- **Admin**: Branch pause/resume, vendor suspend/activate, pricing management, approval workflow

---

## 🛠️ Scripts

```bash
npm run dev          # Start all apps in development mode
npm run build        # Build all apps for production
npm run lint         # Lint all apps
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed the database
```

---

## 📄 License

This project is proprietary software developed by **Devorise AI** for **AtSpaces**.

---

<p align="center">
  Built with ❤️ by <strong>Devorise AI</strong>
</p>
