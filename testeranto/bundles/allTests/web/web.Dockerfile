FROM node:18-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache \
    build-base \
    python3 \
    py3-pip \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev \
    libxml2-utils\
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto-emoji && \
    rm -rf /var/cache/apk/*
RUN npm install -g node-gyp
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
RUN npm install -g node-gyp
COPY package.json .
# Try yarn install, fallback to npm install if it fails
ENV npm_config_build_from_source=false
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN (yarn install --ignore-engines || npm install --legacy-peer-deps) && \
    npm cache clean --force && \
    yarn cache clean || true
COPY ./src ./src/
COPY allTests.ts .
COPY dist/prebuild/builders/web.mjs ./web.mjs
# Create the full directory structure before CMD
RUN mkdir -p /workspace/testeranto
RUN mkdir -p /workspace/testeranto/bundles
RUN mkdir -p /workspace/testeranto/bundles/web
RUN mkdir -p /workspace/testeranto/bundles/web/allTests
RUN mkdir -p /workspace/testeranto/metafiles
RUN mkdir -p /workspace/testeranto/metafiles/web
# Set environment variables for output directories
ENV BUNDLES_DIR=/workspace/testeranto/bundles/web/allTests.ts
ENV METAFILES_DIR=/workspace/testeranto/metafiles/web
# Run the build to generate metafiles when container starts
CMD ["sh", "-c", "echo 'Starting build...' && echo 'Current directory:' && pwd && echo 'Listing dist/prebuild/builders/:' && ls -la ./dist/prebuild/builders/ 2>&1 || echo 'Directory does not exist' && echo 'Checking if web.mjs exists:' && if [ -f ./dist/prebuild/builders/web.mjs ]; then echo 'web.mjs exists'; else echo 'ERROR: web.mjs does not exist'; exit 1; fi && echo 'Node version:' && node --version && echo 'npx version:' && npx --version && echo 'Running build...' && npx tsx ./dist/prebuild/builders/web.mjs allTests.ts dev"]
