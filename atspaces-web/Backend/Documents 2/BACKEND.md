# ⚙️ Backend — NestJS API

The backend is a **NestJS** REST + WebSocket API using **Domain-Driven Design (DDD)** architecture. It runs on **port 3001** and exposes a full Swagger UI.

---

## 📁 Architecture

```
apps/api/src/
├── app.module.ts            # Root module
├── main.ts                  # Bootstrap (CORS, Swagger, port)
│
├── domain/                  # Business logic (pure, no frameworks)
│   ├── entities/            # Domain entities
│   ├── enums/               # Domain enumerations
│   ├── interfaces/          # Repository & service contracts
│   ├── exceptions/          # Custom business exceptions
│   └── value-objects/       # Value objects
│
├── application/             # Use cases / app services
│
├── infrastructure/          # Framework & DB implementations
│   ├── auth/                # Passport strategies (JWT, Google)
│   ├── prisma/              # Prisma client service
│   ├── repositories/        # Prisma repository implementations
│   └── services/            # Infrastructure services (email, etc.)
│
└── presentation/            # HTTP & WebSocket layer
    ├── controllers/         # REST controllers
    └── gateways/            # Socket.IO gateways
```

---

## 🚀 Starting the Backend

### Method 1 — From Monorepo Root (Recommended)
```bash
# From the atspaces-web/Backend directory:
npm run dev
```

### Method 2 — API Only
```bash
cd apps/api
npm run dev
```

The API will be available at: **http://localhost:3001**
Swagger docs at: **http://localhost:3001/api/docs**

---

## 🔌 API Endpoints

All routes are prefixed with `/api`.

### 🔐 Authentication — `/api/auth`

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login with email + password | No |
| GET | `/api/auth/google` | Initiate Google OAuth2 flow | No |
| GET | `/api/auth/google/callback` | Google OAuth2 callback | No |
| GET | `/api/auth/profile` | Get current user profile | JWT |

**Login Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### 🏢 Branches — `/api/branches`

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| GET | `/api/branches` | List all branches | No |
| GET | `/api/branches/:id` | Get branch details | No |
| POST | `/api/branches` | Create a branch (vendor) | JWT (vendor) |
| PATCH | `/api/branches/:id` | Update branch | JWT (vendor) |

### 📅 Bookings — `/api/bookings`

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| POST | `/api/bookings` | Create a booking | JWT |
| GET | `/api/bookings/my` | Get my bookings | JWT |
| PATCH | `/api/bookings/:id/cancel` | Cancel a booking | JWT |

### 🛠️ Services — `/api/services`
Returns available service types: `hot_desk`, `private_office`, `meeting_room`

### 🏷️ Facilities — `/api/facilities`
Returns available facility tags (e.g., WiFi, Parking, Coffee).

### 🤖 AI Assistant — `/api/ai`

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| GET | `/api/ai/history` | Fetch persisted chat history | JWT |

**AI Real-Time Streaming (Socket.IO)**

The AI assistant uses Socket.IO for streaming responses. Connect to `ws://localhost:3001`.

| Event (client → server) | Payload |
|--------------------------|---------|
| `sendMessage` | `{ message: string, sessionId: string, token?: string }` |

| Event (server → client) | Payload |
|--------------------------|---------|
| `messageChunk` | `{ chunk: string }` |
| `messageComplete` | `{}` |
| `messageError` | `{ error: string }` |

### 👑 Admin Endpoints — `/api/admin`
- Approve/reject vendor registrations
- View platform statistics
- Manage pending spaces

### 🏪 Vendor Endpoints — `/api/vendor`
- Manage branch details
- Set service availability and pricing
- View incoming bookings

---

## 🔐 Authentication Flow

```
1. User POSTS to /api/auth/login with { email, password }
2. Server validates credentials, returns JWT access_token
3. Frontend stores token (localStorage/sessionStorage)
4. All protected requests include: Authorization: Bearer <token>
5. JWT guard validates token on every protected route
```

### Google OAuth Flow
```
1. User visits /api/auth/google
2. Redirected to Google consent screen
3. Google calls /api/auth/google/callback
4. Server creates/finds user, issues JWT
5. Redirects to frontend: /auth/callback?token=...&user=...
```

---

## ⚙️ Environment Variables

Create `.env` in the monorepo root:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/atspaces"

# JWT
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRES_IN="1d"

# OpenAI (for AI assistant)
OPENAI_API_KEY="sk-..."

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3001/api/auth/google/callback"

# Email (Gmail SMTP)
SMTP_EMAIL="your@gmail.com"
SMTP_APP_PASSWORD="your-gmail-app-password"

# Frontend URL (for OAuth redirects)
FRONTEND_URL="http://localhost:5173"

# Server
PORT=3001
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `@nestjs/core` | NestJS framework |
| `@nestjs/jwt` | JWT authentication |
| `@nestjs/passport` | Auth strategies |
| `passport-google-oauth20` | Google OAuth2 |
| `@prisma/client` | Database ORM |
| `socket.io` | WebSocket server |
| `@nestjs/swagger` | API documentation |
| `openai` | AI chat completion |
| `ioredis` | Redis client |

---

## 🧪 Running Tests
```bash
cd apps/api
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
```
