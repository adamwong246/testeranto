# syntax=docker/dockerfile:1
FROM ruby:3.2-alpine
WORKDIR /example

# Install system dependencies needed for building/testing
RUN apk add --no-cache \
    build-base \
    git \
    curl \
    bash \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Install Ruby gems including rubocop
RUN bundle install --jobs 4 --retry 3

