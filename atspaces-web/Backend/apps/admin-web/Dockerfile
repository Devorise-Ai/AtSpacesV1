FROM node:20-alpine

WORKDIR /app

# Copy root workspace files
COPY package.json package-lock.json turbo.json ./
COPY apps/admin-web/package.json apps/admin-web/package-lock.json ./apps/admin-web/
COPY packages/ ./packages/

# Install dependencies
RUN npm install

# Copy source
COPY apps/admin-web/ ./apps/admin-web/

EXPOSE 3003

CMD ["npx", "turbo", "run", "dev", "--filter=admin-web"]
