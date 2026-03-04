# Use the Bun runtime
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package.json bun.lock ./

# Install all dependencies
RUN bun install

# Copy the rest of your app
COPY . .

# Generate Prisma client
RUN bun prisma generate

# Resolve the initial migration if it was already applied manually
# This handles cases where the database schema already exists but wasn't created via migrations
RUN bun prisma migrate resolve --applied 20260225231410 || true

# Deploy migrations to the database
RUN bun prisma migrate deploy

# Expose the port your app listens on
EXPOSE 3000

# Command to run the app
CMD ["bun", "src/main.js"]
