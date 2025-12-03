
FROM node:18-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache     build-base     python3     py3-pip     cairo-dev     pango-dev     jpeg-dev     giflib-dev     librsvg-dev     libxml2-utils     wget &&     rm -rf /var/cache/apk/*
# Install Go
RUN wget -q -O - https://go.dev/dl/go1.21.0.linux-amd64.tar.gz | tar -xz -C /usr/local
ENV GOROOT=/usr/local/go
ENV PATH=$PATH:$GOROOT/bin
RUN npm install -g node-gyp
COPY package.json .
# Try yarn install, fallback to npm install if it fails
ENV npm_config_build_from_source=false
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN (yarn install --ignore-engines || npm install --legacy-peer-deps) &&     npm cache clean --force &&     yarn cache clean || true
COPY ./src ./src/
COPY allTests.ts .
COPY dist/prebuild/builders/golang.mjs ./golang.mjs
# Create the full directory structure before CMD
RUN mkdir -p /workspace/testeranto
RUN mkdir -p /workspace/testeranto/bundles
RUN mkdir -p /workspace/testeranto/bundles/golang
RUN mkdir -p /workspace/testeranto/bundles/golang/allTests
RUN mkdir -p /workspace/testeranto/metafiles
RUN mkdir -p /workspace/testeranto/metafiles/golang
# Set environment variables for output directories
ENV BUNDLES_DIR=/workspace/testeranto/bundles/golang/allTests.ts
ENV METAFILES_DIR=/workspace/testeranto/metafiles/golang
# Run the build to generate metafiles when container starts
CMD ["sh", "-c", "echo 'Starting build...' && ls -la ./dist/prebuild/builders/ && which node && which npx && npx tsx ./dist/prebuild/builders/golang.mjs allTests.ts"]
