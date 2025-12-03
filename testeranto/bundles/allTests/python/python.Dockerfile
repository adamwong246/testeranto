
FROM node:18-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache     build-base     python3     py3-pip     cairo-dev     pango-dev     jpeg-dev     giflib-dev     librsvg-dev     libxml2-utils &&     rm -rf /var/cache/apk/*
# Ensure Python is properly installed and available
RUN python3 --version && pip3 --version
RUN npm install -g node-gyp
COPY package.json .
# Try yarn install, fallback to npm install if it fails
ENV npm_config_build_from_source=false
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN (yarn install --ignore-engines || npm install --legacy-peer-deps) &&     npm cache clean --force &&     yarn cache clean || true
COPY ./src ./src/
COPY allTests.ts .
COPY dist/prebuild/builders/python.mjs ./python.mjs
# Create the full directory structure before CMD
RUN mkdir -p /workspace/testeranto
RUN mkdir -p /workspace/testeranto/bundles
RUN mkdir -p /workspace/testeranto/bundles/python
RUN mkdir -p /workspace/testeranto/bundles/python/allTests
RUN mkdir -p /workspace/testeranto/metafiles
RUN mkdir -p /workspace/testeranto/metafiles/python
# Set environment variables for output directories
ENV BUNDLES_DIR=/workspace/testeranto/bundles/python/allTests.ts
ENV METAFILES_DIR=/workspace/testeranto/metafiles/python
# Run the build to generate metafiles when container starts
CMD ["sh", "-c", "echo 'Starting build...' && ls -la ./dist/prebuild/builders/ && which node && which npx && npx tsx ./dist/prebuild/builders/python.mjs allTests.ts"]

