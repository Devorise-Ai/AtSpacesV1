# 🗄️ Database — PostgreSQL + Prisma ORM

AtSpaces uses **PostgreSQL 16** as its primary database, **Prisma** as the ORM, and **Redis 7** as a caching and job-queue layer. Both are orchestrated via Docker.

---

## 🐳 Starting the Database with Docker

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Step 1 — Start Containers
```bash
# From the atspaces-web/Backend directory:
docker-compose up -d
```

This will start:
- **PostgreSQL** → `localhost:5432` (database: `atspaces`)
- **Redis** → `localhost:6379`

### Step 2 — Verify Containers are Running
```bash
docker ps
```

You should see:
```
CONTAINER ID   IMAGE                NAMES
xxxxxxxxxxxx   postgres:16-alpine   atspaces-postgres
xxxxxxxxxxxx   redis:7-alpine       atspaces-redis
```

### Step 3 — Stop Containers
```bash
docker-compose down
```

### Step 4 — Stop and Remove All Data (Reset)
```bash
docker-compose down -v
```

---

## 🔌 Docker Compose Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: atspaces-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: atspaces
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: atspaces-redis
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

---

## ⚙️ Running Migrations

```bash
# From the monorepo root (atspaces-web/Backend/):

# Run all pending migrations (development)
npm run db:migrate

# Seed initial data
npm run db:seed

# Open Prisma Studio (visual DB browser)
npx prisma studio --schema apps/api/prisma/schema.prisma
```

> **Note:** The `DATABASE_URL` must be set in `.env` before running migrations.

---

## 📋 Database Schema

Prisma schema located at: `apps/api/prisma/schema.prisma`

### Enumerations

| Enum | Values |
|------|--------|
| `UserRole` | `customer`, `vendor`, `admin` |
| `UserStatus` | `pending`, `active`, `suspended` |
| `BranchStatus` | `active`, `suspended`, `pending` |
| `ServiceName` | `hot_desk`, `private_office`, `meeting_room` |
| `PriceUnit` | `hour`, `day`, `week`, `month` |
| `BookingStatus` | `pending`, `confirmed`, `completed`, `cancelled`, `no_show` |
| `PaymentStatus` | `pending`, `paid`, `failed` |
| `PaymentMethod` | `cash`, `card`, `apple_pay` |
| `RequestType` | `capacity_change`, `pause_branch`, `activate_branch` |
| `ApprovalStatus` | `pending`, `approved`, `rejected` |
| `OtpPurpose` | `login`, `signup`, `verify` |

---

### Data Models

#### `users` Table
Central user model — represents customers, vendors, and admins.

| Column | Type | Description |
|--------|------|-------------|
| `id` | Int (PK) | Auto-increment primary key |
| `full_name` | VarChar(100) | User's display name |
| `email` | VarChar(100) | Unique email |
| `phone_number` | VarChar(20) | Unique phone number |
| `password_hash` | VarChar(255) | Bcrypt hashed password |
| `role` | UserRole | `customer`, `vendor`, or `admin` |
| `status` | UserStatus | `pending` by default |
| `is_phone_verified` | Boolean | Phone OTP verification status |
| `is_email_verified` | Boolean | Email verification status |
| `created_at` | DateTime | Record creation timestamp |
| `updated_at` | DateTime | Auto-updated timestamp |

**Relations:** `branches[]`, `bookings[]`, `requestsSubmitted[]`, `requestsReviewed[]`, `otpSessions[]`, `aiChatMessages[]`

---

#### `branches` Table
A workspace location owned by a vendor.

| Column | Type | Description |
|--------|------|-------------|
| `id` | Int (PK) | Primary key |
| `vendor_id` | Int (FK → users) | Owner vendor |
| `name` | VarChar(100) | Branch name |
| `description` | Text | Detailed description |
| `city` | VarChar(50) | City location |
| `address` | VarChar(255) | Full address |
| `latitude` | Decimal(10,8) | GPS latitude |
| `longitude` | Decimal(11,8) | GPS longitude |
| `status` | BranchStatus | `pending` → admin approval flow |

---

#### `vendor_services` Table
A service offering (desk/office/room) at a specific branch.

| Column | Type | Description |
|--------|------|-------------|
| `id` | Int (PK) | Primary key |
| `branch_id` | Int (FK → branches) | Parent branch |
| `service_id` | Int (FK → services) | Service type |
| `max_capacity` | Int | Max bookable units |
| `price_per_unit` | Decimal(10,2) | Price per time unit |
| `price_unit` | PriceUnit | `hour`, `day`, `week`, or `month` |
| `min_booking_duration` | Int | Minimum booking length |
| `max_booking_duration` | Int? | Maximum booking length |
| `cancellation_policy` | Text | Cancellation terms |

---

#### `bookings` Table
A customer's reservation of a vendor service.

| Column | Type | Description |
|--------|------|-------------|
| `id` | Int (PK) | Primary key |
| `booking_number` | VarChar(20) | Unique booking reference |
| `customer_id` | Int (FK → users) | Booking customer |
| `vendor_service_id` | Int (FK → vendor_services) | Service booked |
| `booking_date` | Date | Date of booking |
| `start_time` | Time | Start time |
| `end_time` | Time | End time |
| `quantity` | Int | Number of units |
| `total_price` | Decimal(10,2) | Calculated total |
| `status` | BookingStatus | Booking lifecycle status |
| `payment_status` | PaymentStatus | Payment lifecycle |
| `payment_method` | PaymentMethod? | How it was paid |

---

#### `payments` Table
Tracks payment transactions for bookings.

| Column | Type | Description |
|--------|------|-------------|
| `booking_id` | Int (FK → bookings) | Associated booking |
| `transaction_id` | VarChar(100) | External gateway ID |
| `amount` | Decimal(10,2) | Amount charged |
| `payment_method` | PaymentMethod | Payment method used |
| `gateway_response` | JSON | Raw gateway response |

---

#### `availability` Table
Day-by-day availability slots for vendor services.

| Column | Type | Description |
|--------|------|-------------|
| `vendor_service_id` | Int (FK) | Associated service |
| `date` | Date | Availability date |
| `start_time` | Time | Slot start |
| `end_time` | Time | Slot end |
| `available_units` | Int | Units still bookable |
| `is_blocked` | Boolean | Admin/vendor block flag |

---

#### `otp_sessions` Table
Stores phone OTP codes for verification.

| Column | Type | Description |
|--------|------|-------------|
| `phone_number` | VarChar(20) | Target phone |
| `otp_code` | VarChar(6) | 6-digit OTP |
| `purpose` | OtpPurpose | `login`, `signup`, or `verify` |
| `expires_at` | DateTime | Expiry time |
| `is_used` | Boolean | Consumed flag |

---

#### `ai_chat_messages` Table
Persists chat history for the AI Assistant.

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | Int (FK → users) | Message owner |
| `role` | VarChar(50) | `user` or `assistant` |
| `content` | Text | Message content |
| `created_at` | DateTime | Timestamp |

---

#### Other Tables

| Table | Description |
|-------|-------------|
| `services` | Service type catalog (hot_desk, private_office, meeting_room) |
| `facilities` | Branch amenities (WiFi, Parking, Coffee, etc.) |
| `branch_facilities` | Many-to-many: branches ↔ facilities |
| `features` | Service features (projector, whiteboard, etc.) |
| `service_features` | Many-to-many: vendor_services ↔ features |
| `approval_requests` | Vendor requests requiring admin approval |

---

## 🔗 Entity Relationship Diagram

```
users
  └── branches (vendor owns many branches)
        └── vendor_services (branch offers many services)
              ├── availability (service has schedule slots)
              ├── bookings (customers book services)
              │     └── payments
              └── service_features (service has amenity features)
        └── branch_facilities (branch has facilities)
        └── approval_requests (branch change requests)
users
  └── otp_sessions
  └── ai_chat_messages
  └── bookings (customer makes bookings)
```

---

## 🔍 Useful Prisma Commands

```bash
# View DB in browser GUI
npx prisma studio --schema apps/api/prisma/schema.prisma

# Generate Prisma client after schema changes
npx prisma generate --schema apps/api/prisma/schema.prisma

# Create a new migration
npm run db:migrate

# Push schema without migration (dev only)
npx prisma db push --schema apps/api/prisma/schema.prisma

# Reset DB (drops all data)
npx prisma migrate reset --schema apps/api/prisma/schema.prisma
```
