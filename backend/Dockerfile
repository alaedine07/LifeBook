# -----------------------
# Build stage (Node)
# -----------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build NestJS app
RUN npx nest build

# -----------------------
# Production stage
# -----------------------
FROM node:20-alpine

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy built app
COPY --from=builder /app/dist ./dist

# Copy Prisma schema (needed for runtime)
COPY prisma ./prisma

# Expose port
EXPOSE 3000

# Start the app using the compiled JS
CMD ["node", "dist/main.js"]
