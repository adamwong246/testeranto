

FROM node:20-alpine
WORKDIR /workspace

EXPOSE 3456
ENV BUNDLES_DIR=/workspace/testeranto/bundles/allTests/web
ENV METAFILES_DIR=/workspace/testeranto/metafiles/web
ENV IN_DOCKER=true

# Install necessary packages for Chromium using apk (Alpine package manager)
RUN apk update && apk add --no-cache     chromium     chromium-chromedriver     nss     freetype     freetype-dev     harfbuzz     ca-certificates     ttf-freefont     font-noto-emoji     && rm -rf /var/cache/apk/*

# Set Chromium path for Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV CHROMIUM_PATH=/usr/bin/chromium-browser



