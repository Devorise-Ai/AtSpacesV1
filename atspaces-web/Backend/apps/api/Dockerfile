FROM node:20-alpine AS base

# API Dockerfile
WORKDIR /app

# Copy root workspace files
COPY package.json package-lock.json turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/ ./packages/

# Install all dependencies
RUN npm install

# Copy API source code
COPY apps/api/ ./apps/api/

# Generate Prisma client
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma

# Build the API
WORKDIR /app/apps/api
RUN npx nest build

WORKDIR /app

EXPOSE 3001

# Start the API in dev mode
CMD ["npx", "turbo", "run", "dev", "--filter=api"]
