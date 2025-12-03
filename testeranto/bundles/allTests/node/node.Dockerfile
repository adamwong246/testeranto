
FROM node:18-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache     build-base     python3     py3-pip     cairo-dev     pango-dev     jpeg-dev     giflib-dev     librsvg-dev     libxml2-utils
RUN npm install -g node-gyp tsx
COPY package.json .
RUN yarn install --ignore-engines
RUN npm install -g tsx
COPY ./src ./src/
COPY allTests.ts .
ARG NODE_MJS_HASH
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
