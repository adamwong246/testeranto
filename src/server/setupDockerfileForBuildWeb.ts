import { COMMON_PACKAGE_INSTALL } from "./COMMON_PACKAGE_INSTALL";

export function setupDockerfileForBuildWeb(config: string): string {
  const webSpecificPackages = `\\
    chromium \\
    nss \\
    freetype \\
    freetype-dev \\
    harfbuzz \\
    ca-certificates \\
    ttf-freefont \\
    font-noto-emoji`;

  return `FROM node:18-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache \\
    build-base \\
    python3 \\
    py3-pip \\
    cairo-dev \\
    pango-dev \\
    jpeg-dev \\
    giflib-dev \\
    librsvg-dev \\
    libxml2-utils${webSpecificPackages} && \\
    rm -rf /var/cache/apk/*
RUN npm install -g node-gyp
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
${COMMON_PACKAGE_INSTALL}
COPY ${config} .
COPY dist/prebuild/builders/web.mjs ./web.mjs
# Run the build to generate metafiles when container starts
CMD ["sh", "-c", "echo 'Starting build...' && echo 'Current directory:' && pwd && echo 'Listing dist/prebuild/builders/:' && ls -la ./dist/prebuild/builders/ 2>&1 || echo 'Directory does not exist' && echo 'Checking if web.mjs exists:' && if [ -f ./dist/prebuild/builders/web.mjs ]; then echo 'web.mjs exists'; else echo 'ERROR: web.mjs does not exist'; exit 1; fi && echo 'Node version:' && node --version && echo 'npx version:' && npx --version && echo 'Running build...' && npx tsx ./dist/prebuild/builders/web.mjs ${config} dev"]
`;
}
