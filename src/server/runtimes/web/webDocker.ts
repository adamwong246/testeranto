import { baseNodeImage } from "../../nodeVersion";

export const webDocker = `FROM ${baseNodeImage}
WORKDIR /workspace
# Install libxml2-utils for xmllint, netcat-openbsd for network checks, and Chromium for browser tests
RUN apk add --update --no-cache libxml2-utils netcat-openbsd chromium nss freetype freetype-dev harfbuzz ca-certificates ttf-freefont font-noto-emoji
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
# Reinstall esbuild for Linux platform
RUN rm -f .npmrc .npmrc.* || true && \
    npm cache clean --force && \
    npm config set registry https://registry.npmjs.org/ && \
    npm config set always-auth false && \
    npm config delete _auth 2>/dev/null || true && \
    npm config delete _authToken 2>/dev/null || true && \
    npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true && \
    npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm uninstall esbuild @esbuild/darwin-arm64 @esbuild/darwin-x64 @esbuild/win32-x64 @esbuild/win32-arm64 2>/dev/null || true
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional
# Install puppeteer-core for browser automation
RUN npm install --no-save puppeteer-core --no-audit --no-fund --ignore-scripts --no-optional
`;
