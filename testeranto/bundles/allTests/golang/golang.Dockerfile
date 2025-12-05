FROM golang:latest
WORKDIR /workspace

# Create necessary directories
RUN mkdir -p /workspace/testeranto/bundles/allTests/golang
RUN mkdir -p /workspace/testeranto/metafiles/golang

# Install Node.js for running the builder
RUN apt-get update && apt-get install -y nodejs npm
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm install -g tsx --no-audit --no-fund --ignore-scripts --no-optional

# Install esbuild for the correct platform (Linux)
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional

# Default command (will be overridden by docker-compose)
CMD ["npx", "tsx", "golang.mjs", "allTests.ts", "dev"]