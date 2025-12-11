# Testeranto Dockerfile for python
# Strategy: combined-build-test-process-pools (interpreted)
# Generated: 2025-12-11T06:53:51.361Z
FROM python:3.11-alpine
WORKDIR /workspace

# Strategy: combined-build-test-process-pools - Interpreted language with process pools
ENV STRATEGY=combined-build-test-process-pools
ENV RUNTIME=python
ENV CATEGORY=interpreted

# Install required Python packages including websockets for WebSocket communication
RUN pip install websockets>=12.0

# Create necessary directories
RUN mkdir -p /workspace/testeranto/bundles/allTests/python
RUN mkdir -p /workspace/testeranto/metafiles/python

# Install Node.js for running the builder
RUN apk add --update nodejs npm
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm install -g tsx --no-audit --no-fund --ignore-scripts --no-optional

# Install esbuild for the correct platform (Linux)
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional

# Copy the builder file
COPY dist/prebuild/server/builders/python.mjs ./python.mjs

# Default command (will be overridden by docker-compose)
CMD ["npx", "tsx", "python.mjs", "allTests.ts", "dev"]