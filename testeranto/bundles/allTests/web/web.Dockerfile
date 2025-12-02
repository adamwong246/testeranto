
FROM node:18-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache     build-base     python3     py3-pip     cairo-dev     pango-dev     jpeg-dev     giflib-dev     librsvg-dev     libxml2-utils     chromium     nss     freetype     freetype-dev     harfbuzz     ca-certificates     ttf-freefont     font-noto-emoji
RUN npm install -g node-gyp
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
COPY package.json .
RUN yarn install --ignore-engines
COPY ./src ./src/
COPY allTests.ts .
COPY dist/prebuild/builders/web.mjs ./web.mjs
# Create the full directory structure before CMD
RUN mkdir -p /workspace/testeranto
RUN mkdir -p /workspace/testeranto/bundles
RUN mkdir -p /workspace/testeranto/bundles/allTests
RUN mkdir -p /workspace/testeranto/bundles/allTests/web
RUN mkdir -p /workspace/testeranto/metafiles
RUN mkdir -p /workspace/testeranto/metafiles/web
# Run the build to generate metafiles when container starts
CMD ["sh", "-c", "echo 'Starting build...' && ls -la ./dist/prebuild/builders/ && which node && which npx && npx tsx ./dist/prebuild/builders/web.mjs allTests.ts"]
