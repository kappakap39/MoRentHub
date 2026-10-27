FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Copy source and build
COPY tsconfig.json ./
COPY src ./src

RUN npx prisma generate
RUN npx tsc

# Production runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy package and prisma FIRST so postinstall (prisma generate) has the schema
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --omit=dev && npm install tsx
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

# Create uploads and data directory
RUN mkdir -p /app/uploads /app/data

EXPOSE 5000

# Script to auto-migrate/push db and start server
CMD ["sh", "-c", "npx prisma db push && npx tsx prisma/seed.ts && node dist/index.js"]
