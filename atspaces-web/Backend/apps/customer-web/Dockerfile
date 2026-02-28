FROM node:20-alpine

WORKDIR /app

# Copy root workspace files
COPY package.json package-lock.json turbo.json ./
COPY apps/customer-web/package.json ./apps/customer-web/
COPY packages/ ./packages/

# Install dependencies
RUN npm install

# Copy source
COPY apps/customer-web/ ./apps/customer-web/

EXPOSE 5173

CMD ["npx", "turbo", "run", "dev", "--filter=customer-web"]
