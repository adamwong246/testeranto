
FROM node:18-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache     build-base     python3     py3-pip     cairo-dev     pango-dev     jpeg-dev     giflib-dev     librsvg-dev     libxml2-utils &&     rm -rf /var/cache/apk/*
RUN npm install -g node-gyp tsx
COPY package.json .
# Try yarn install, fallback to npm install if it fails
ENV npm_config_build_from_source=false
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN (yarn install --ignore-engines || npm install --legacy-peer-deps) &&     npm install -g tsx &&     npm cache clean --force &&     yarn cache clean || true
COPY ./src ./src/
COPY allTests.ts .
ARG NODE_MJS_HASH
# Use the hash to bust cache for the node.mjs copy
RUN echo "Node.mjs hash: $NODE_MJS_HASH" > /tmp/node-mjs-hash.txt
COPY dist/prebuild/builders/node.mjs ./node.mjs
# Create the full directory structure before CMD
RUN mkdir -p /workspace/testeranto
RUN mkdir -p /workspace/testeranto/bundles
RUN mkdir -p /workspace/testeranto/bundles/node
RUN mkdir -p /workspace/testeranto/bundles/node/allTests
RUN mkdir -p /workspace/testeranto/metafiles
RUN mkdir -p /workspace/testeranto/metafiles/node
# Set environment variables for output directories
ENV BUNDLES_DIR=/workspace/testeranto/bundles/allTests/node
ENV METAFILES_DIR=/workspace/testeranto/metafiles/node
# The actual build command will be provided by the docker-compose service command
# No CMD here, let the service command override
