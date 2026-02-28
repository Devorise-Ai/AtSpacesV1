FROM node:20-slim

# Install OpenSSL for Prisma compatibility
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy all workspace files
COPY package.json package-lock.json turbo.json ./
COPY .npmrc* ./
COPY apps/ ./apps/
COPY packages/ ./packages/

# Install all dependencies (including devDependencies for dev mode)
RUN npm install --legacy-peer-deps

# Generate Prisma client from the api workspace
WORKDIR /app/apps/api
RUN npx prisma generate

WORKDIR /app

EXPOSE 3000 3001 3002 5173
