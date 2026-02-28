FROM node:20-alpine

WORKDIR /app

# Copy root workspace files
COPY package.json package-lock.json turbo.json ./
COPY apps/vendor-web/package.json apps/vendor-web/package-lock.json ./apps/vendor-web/
COPY packages/ ./packages/

# Install dependencies
RUN npm install

# Copy source
COPY apps/vendor-web/ ./apps/vendor-web/

EXPOSE 3002

CMD ["npx", "turbo", "run", "dev", "--filter=vendor-web"]
