# syntax = docker/dockerfile:1

# Base stage with Bun
FROM debian:bullseye-slim as base

# Install necessary packages including curl
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y ca-certificates curl unzip && \
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
COPY package.json bun.lockb ./
COPY frontend/package.json frontend/bun.lockb ./frontend/

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

# Nixpacks configuration through environment variables
ENV PORT=3000
ENV START_COMMAND="bun run start"

# Expose port
EXPOSE 3000

# Start command
CMD ["bun", "run", "start"]