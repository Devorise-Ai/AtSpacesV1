# 🧑‍💻 Teammate Local Setup Guide

Welcome to the **AtSpaces** project! We have consolidated the core Customer App and Backend API into a single, high-performance monorepo for easier development.

## 🛠️ Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **NPM** (v11 or higher)
- **Docker & Docker Desktop** (for the database)

## 🚀 One-Time Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Devorise-Ai/AtSpacesV1.git
cd AtSpacesV1
```

### 2. Install Dependencies
Go to the core directory and install everything:
```bash
cd atspaces-web/Backend
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in `atspaces-web/Backend/` and add the following (get the actual values from the team lead):
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/atspaces"
OPENAI_API_KEY="your-api-key"
SMTP_EMAIL="your-email"
SMTP_APP_PASSWORD="your-app-password"
```

### 4. Start the Database
Ensure Docker Desktop is running, then start the PostgreSQL container:
```bash
# In atspaces-web/Backend
docker-compose up -d
```

### 5. Initialize the Database
```bash
# Run migrations and seed the data
npm run db:migrate
npm run db:seed
```

---

## ⚡ Daily Development
You only need **one command** to start everything:

1. Open your terminal in `atspaces-web/Backend`.
2. Run: **`npm run dev`**

This will automatically launch:
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **Customer Web**: [http://localhost:5173](http://localhost:5173)

### 📊 Dashboard Access
- **Admin Dashboard**: `cd atspaces-admin-web && npm run dev`
- **Vendor Dashboard**: `cd atspaces-vendor-web && npm run dev`
