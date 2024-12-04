# syntax = docker/dockerfile:1

# Base stage with Bun
FROM debian:bullseye-slim as base

# Install necessary packages including curl and nginx
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y ca-certificates curl unzip nginx && \
    rm -rf /var/lib/apt/lists/*

# Install Bun using nixpacks-compatible approach
RUN curl -fsSL https://bun.sh/install | bash

# Add Bun to PATH
ENV PATH="/root/.bun/bin:${PATH}"
ENV NODE_ENV="production"

# Set working directory
WORKDIR /app

# Build stage
FROM base as build

# Install build dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3 && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json ./
COPY frontend/package.json ./frontend/

# Install dependencies
RUN bun install --ci
RUN cd frontend && bun install --ci

# Copy source code
COPY . .

# Build frontend
WORKDIR /app/frontend
RUN bun run build
# Clean up frontend directory except dist
RUN find . -mindepth 1 ! -regex '^./dist\(/.*\)?' -delete

# Final stage
FROM base

# Copy built application
COPY --from=build /app /app

# Configure nginx
RUN echo ' \
server { \
    listen 3000; \
    root /app/frontend/dist; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Nixpacks configuration through environment variables
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]