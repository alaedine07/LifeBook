FROM oven/bun:latest AS builder

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY . .

RUN bun prisma generate

RUN bun run build

# ===========================
# Production stage
# ===========================
FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --production

COPY --from=builder /app/dist ./dist

COPY prisma ./prisma

EXPOSE 5001

CMD ["bun", "run", "start"]
