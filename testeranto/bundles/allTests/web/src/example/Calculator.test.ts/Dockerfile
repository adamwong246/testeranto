FROM node:18-alpine
RUN 
# Install Chromium and necessary dependencies for headless operation
RUN apk update && apk add --no-cache     chromium     nss     freetype     freetype-dev     harfbuzz     ca-certificates     ttf-freefont     font-noto-emoji     && rm -rf /var/cache/apk/*
          
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV TESTERANTO_RUNTIME=web
RUN mkdir -p /workspace/testeranto
RUN mkdir -p /workspace/testeranto/bundles
RUN mkdir -p /workspace/testeranto/metafiles
RUN mkdir -p /workspace/testeranto/reports
