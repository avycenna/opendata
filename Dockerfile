# Stage 1: Build
FROM node:20-bullseye-slim AS builder
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Generate Prisma client before build
RUN pnpx prisma generate

# Build app
RUN pnpm build

# Remove dev dependencies to reduce size
RUN pnpm prune --prod

# Stage 2: Production image
FROM node:20-bullseye-slim
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set production environment
ENV NODE_ENV=production

# Copy built app
COPY --from=builder /app ./

# Expose container port
EXPOSE 3000

# Start app
CMD ["pnpm", "start"]
