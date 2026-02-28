# 🖥️ Frontend Applications

AtSpaces has **three separate React/Vite frontend apps** running on different ports, all sharing the same NestJS backend.

---

## 📦 Frontend Apps Overview

| App | Port | Description | Framework |
|-----|------|-------------|-----------|
| `customer-web` | 5173 | Customer booking portal | React 19 + Vite |
| `vendor-web` | 5174 | Vendor space management | React + Vite |
| `admin-web` | 5175 | Admin control panel | React / Next.js |

---

## 🚀 Starting Frontend Apps

### Start All at Once (from monorepo root)
```bash
# From atspaces-web/Backend/
npm run dev
```

### Start Individual Apps
```bash
# Customer Web
cd apps/customer-web
npm run dev

# Vendor Web
cd apps/vendor-web
npm run dev

# Admin Web
cd apps/admin-web
npm run dev
```

---

## 🛍️ Customer Web (`apps/customer-web`)

The main customer-facing portal for discovering and booking workspaces.

**Port:** `5173`  
**Framework:** React 19 + Vite + TypeScript

### Key Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | `Home` / `Dashboard` | Landing/home page |
| `/workspaces` | `Workspaces` | Browse all available spaces |
| `/workspaces/:id` | `WorkspaceDetails` | Detailed space view with booking |
| `/bookings` | `MyBookings` | Customer's booking history |
| `/ai` | `AIAssistantPage` | AI Chat Assistant |
| `/auth/callback` | `AuthCallback` | OAuth2 Google login callback handler |
| `/login` | `Login` | Email/password login form |
| `/register` | `Register` | New account registration |

### Key Dependencies

| Package | Purpose |
|---------|---------|
| `react` `19.x` | UI framework |
| `react-router-dom` `7.x` | Client-side routing |
| `axios` | HTTP client for API calls |
| `socket.io-client` | Real-time AI chat connection |
| `framer-motion` | Page and element animations |
| `lucide-react` | Icon library |
| `leaflet` + `react-leaflet` | Interactive maps for branch locations |

### Environment Variables (`apps/customer-web/.env`)

```env
VITE_BACKEND_URL=http://localhost:3001
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### AI Assistant Feature

The AI Assistant (`/ai`) connects to the backend via **Socket.IO** for real-time streaming:

```
User types message
      ↓
socket.emit('sendMessage', { message, sessionId, token })
      ↓
Server streams response chunk by chunk:
  socket.on('messageChunk', ...)   → appends text on screen
  socket.on('messageComplete', ...) → marks message done
  socket.on('messageError', ...)    → shows error
```

Chat history is persisted in PostgreSQL and loaded on page open via `GET /api/ai/history`.

### Authentication Flow

```
1. User logs in via email or Google
2. JWT token stored in localStorage/sessionStorage
3. All API calls use: Authorization: Bearer <token>
4. Protected pages redirect to /login if no token
```

### Folder Structure

```
apps/customer-web/src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx       # Top navigation bar
│   ├── ChatAssistant.tsx # Popup AI chat widget
│   └── ...
├── context/
│   └── ThemeContext.tsx  # Light/dark theme provider
├── lib/
│   ├── api.ts           # Configured Axios instance
│   └── token.ts         # JWT token helpers
├── pages/
│   ├── Dashboard.tsx
│   ├── Workspaces.tsx
│   ├── WorkspaceDetails.tsx
│   ├── AIAssistant.tsx
│   ├── AuthCallback.tsx
│   └── ...
└── main.tsx             # App entry point
```

---

## 🏪 Vendor Web (`apps/vendor-web`)

The portal for workspace vendors to manage their listings and bookings.

**Port:** `5174`  
**Framework:** React + Vite + TypeScript

### Key Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Revenue & booking stats |
| `/branches` | Branch List | All vendor branches |
| `/branches/new` | Create Branch | Register a new workspace |
| `/branches/:id` | Branch Details | Edit branch info & services |
| `/bookings` | Booking Requests | Incoming booking management |
| `/settings` | Settings | Account & profile settings |

### Key Features
- View and manage branch details (name, location, description)
- Set service offerings and pricing (hourly/daily/weekly/monthly)
- Manage availability calendar
- Accept/reject booking requests
- View earnings and analytics
- Submit requests to admin for capacity changes

---

## 👑 Admin Web (`apps/admin-web`)

The administration dashboard for platform operators.

**Port:** `5175`  
**Framework:** React / Next.js

### Key Pages

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | Dashboard | Platform-wide statistics |
| `/vendors` | Vendor List | All registered vendors |
| `/vendors/pending` | Pending Vendors | Vendors awaiting approval |
| `/spaces` | Space Management | All listed spaces |
| `/bookings` | All Bookings | Platform-wide booking view |
| `/users` | Users | Customer and user management |

### Admin Capabilities
- Approve or reject vendor registrations (with rejection reason)
- Activate/suspend/approve branch spaces
- Approve vendor requests (capacity changes, pause/activate branches)
- View platform-level analytics
- Manage all user accounts

---

## 🎨 Design System

All frontend apps share a consistent design language:

- **Font:** Inter (Google Fonts)
- **Colors:** Primary orange (`#FF5B04`), dark backgrounds
- **Theme:** Light/Dark mode toggle via `ThemeContext`
- **Animations:** Framer Motion for page transitions and micro-animations
- **Icons:** Lucide React icon library
- **CSS Variables:** Shared via CSS custom properties

### CSS Variables
```css
--primary: #FF5B04;
--primary-glow: rgba(255, 91, 4, 0.3);
--bg-deep: #0a0a0f;
--bg-card: rgba(255, 255, 255, 0.03);
--bg-input: rgba(255, 255, 255, 0.07);
--text-primary: #f0f0f0;
--text-secondary: rgba(240, 240, 240, 0.5);
--border: rgba(255, 255, 255, 0.1);
```

---

## 🔧 Building for Production

```bash
# Build all apps
npm run build

# Build individual app
cd apps/customer-web
npm run build
# Output in apps/customer-web/dist/

# Preview production build
npm run preview
```

---

## 📡 API Integration

All frontend apps use a shared `axios` instance configured with the backend base URL:

```typescript
// apps/customer-web/src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api',
});

// Auto-attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```
