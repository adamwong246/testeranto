# Do NOT use --platform=linux/amd64 here
FROM alpine:latest

WORKDIR /workspace
COPY ./tsconfig*.json ./
COPY ./package.json ./package.json
COPY ./.yarnrc.yml ./



# Install the native ARM64 version of Chromium
RUN apk add --no-cache \
    libc6-compat \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    libstdc++ \
    chromium-chromedriver

# Ensure Puppeteer knows exactly where the native binary is
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN yarn install

# Expose port for Chrome remote debugging
EXPOSE 9222
