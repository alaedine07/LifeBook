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

# Expose the port your app listens on
EXPOSE 3000

# Command to run the app
CMD ["bun", "src/main.js"]
