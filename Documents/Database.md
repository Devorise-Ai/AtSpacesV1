# Database Documentation

Detailed overview of the AtSpaces data layer, schema, and maintenance procedures.

## 1. Schema Overview

The project uses a shared **PostgreSQL** database managed via **Prisma ORM** in the `atspaces-web/Backend` workspace.

### Key Features:
- **Multitenancy**: Vendors managing multiple branches.
- **Service Catalog**: Dynamic coworking services (Hot Desks, Offices).
- **Booking Engine**: Real-time availability and capacity tracking.

## 2. Core Tables

| Table | Purpose |
| :--- | :--- |
| `users` | Management of Customers, Vendors, and Admins. |
| `branches` | Physical branch locations in Jordan. |
| `vendor_services` | Links services to branches with pricing and capacity. |
| `availability` | Time-slot based capacity management. |

## 3. Maintenance & Workflow

### Location of Files
- **Schema**: `atspaces-web/Backend/apps/api/prisma/schema.prisma`
- **Seed Script**: `atspaces-web/Backend/apps/api/prisma/seed.ts`
- **Root Proxy Scripts**: Found in `atspaces-web/Backend/package.json`

### Key Commands (from atspaces-web/Backend directory)
- **Apply Change**: `npm run db:migrate`
- **Refresh Data**: `npm run db:seed`
- **View Data**: `npx prisma studio --schema apps/api/prisma/schema.prisma`

---

👉 [Back to Getting Started](./GettingStarted.md)
