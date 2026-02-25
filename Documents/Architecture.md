# Project Architecture

Overview of the AtSpaces technical stack and directory structure.

## 🛠️ Stack Overview

| Layer | Technology |
| :--- | :--- |
| **Main Web App** | React, TypeScript, Vite (in `/atspaces-web`). |
| **Admin Dashboard** | React, TypeScript, Vite (in `/atspaces-admin-web`). |
| **Vendor Dashboard**| React, TypeScript, Vite (in `/atspaces-vendor-web`). |
| **API Backend** | NestJS, Turbo (in `/atspaces-web/Backend`). |
| **Database** | PostgreSQL 16. |
| **Cache/Real-time** | Redis 7. |

## 📁 Folder Structure

```text
AtSpaces-Front/
├── atspaces-web/           # Main Customer app + Backend
│   └── Backend/            # Shared NestJS API & Prisma
├── atspaces-admin-web/     # Admin management portal
├── atspaces-vendor-web/    # Vendor management portal
├── Documents/              # Centralized technical documentation
└── README.md               # project entry point
```

## 🔌 Connection Points
- **API**: All frontend apps connect to the NestJS API in `atspaces-web/Backend`.
- **Database**: All backend services share the same PostgreSQL instance.
- **Real-time**: Socket.io used for chat and notifications.

---

👉 [Back to Getting Started](./GettingStarted.md)
