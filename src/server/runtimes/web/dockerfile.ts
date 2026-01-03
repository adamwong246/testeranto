export const webDockerFile = `

FROM node:20-alpine
WORKDIR /workspace

EXPOSE 3456
ENV BUNDLES_DIR=/workspace/testeranto/bundles/allTests/web
ENV METAFILES_DIR=/workspace/testeranto/metafiles/web
ENV IN_DOCKER=true

# Install necessary packages for Chromium using apk (Alpine package manager)
RUN apk update && apk add --no-cache \
    chromium \
    chromium-chromedriver \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto-emoji \
    && rm -rf /var/cache/apk/*

# Set Chromium path for Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV CHROMIUM_PATH=/usr/bin/chromium-browser

CMD ["sh", "-c", "echo 'Starting web build in watch mode...'; \
  echo 'Installing dependencies in /workspace/node_modules...'; \
  cd /workspace && \
  rm -f .npmrc .npmrc.* || true && \
  npm cache clean --force && \
  npm config delete _auth 2>/dev/null || true && \
  npm config delete _authToken 2>/dev/null || true && \
  npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true && \
  npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true && \
  npm config delete always-auth 2>/dev/null || true && \
  npm config delete registry 2>/dev/null || true && \
  npm config set registry https://registry.npmjs.org/ && \
  npm config set always-auth false && \
  npm install --legacy-peer-deps --no-audit --no-fund --ignore-scripts || echo 'npm install may have warnings'; \
  echo 'Ensuring esbuild and esbuild-sass-plugin are installed for Linux platform...'; \
  npm list esbuild 2>/dev/null || npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts || echo 'esbuild installation may have issues'; \
  npm list esbuild-sass-plugin 2>/dev/null || npm install --no-save esbuild-sass-plugin --no-audit --no-fund --ignore-scripts || echo 'esbuild-sass-plugin installation may have issues'; \
  echo 'Creating output directory...'; \
  mkdir -p /workspace/testeranto/bundles/allTests/web; \
  mkdir -p /workspace/testeranto/metafiles/web; \
  echo 'BUNDLES_DIR env:' "$BUNDLES_DIR"; \
  echo 'Starting build process for web...'; \
  TEST_NAME=allTests WS_PORT=3456 yarn tsx dist/prebuild/server/runtimes/web/web.mjs allTests.ts dev || echo 'Build process exited with code $?, but keeping container alive for health checks'"]

`;

export default webDockerFile;
