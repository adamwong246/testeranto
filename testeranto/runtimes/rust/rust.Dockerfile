# syntax=docker/dockerfile:1
FROM rust:1.75-alpine3.19

WORKDIR /workspace

# Install system dependencies needed for building Rust projects
RUN apk add --no-cache \
    build-base \
    git \
    curl \
    bash \
    python3 \
    make \
    g++ \
    musl-dev \
    openssl-dev \
    pkgconfig \
    && rm -rf /var/cache/apk/*

# Install additional tools that might be needed for testing
RUN cargo install --version 0.9.0 cargo-audit || true

# Pre-create target directory with proper permissions
RUN mkdir -p /workspace/target && chmod 777 /workspace/target

# Default command: run the Rust builder
CMD ["sh", "-c", "cd /workspace && rustc src/server/runtimes/rust/main.rs -o /tmp/rust-builder && /tmp/rust-builder"]
