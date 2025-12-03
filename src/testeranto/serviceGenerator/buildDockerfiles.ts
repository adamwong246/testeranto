import fs from "fs";
import path from "path";
import { IRunTime } from "../../Types";

import crypto from "crypto";

export function setupDockerfileForBuildNode(config: string): string {
  // Add ARG for cache busting
  return `
FROM node:18-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache \
    build-base \
    python3 \
    py3-pip \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev \
    libxml2-utils
RUN npm install -g node-gyp tsx
COPY package.json .
RUN yarn install --ignore-engines
RUN npm install -g tsx
COPY ./src ./src/
COPY ${config} .
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
`;
}

// Helper function to compute hash of node.mjs
export function computeNodeMjsHash(): string {
  const nodeMjsPath = path.join(
    process.cwd(),
    "dist/prebuild/builders/node.mjs"
  );
  if (fs.existsSync(nodeMjsPath)) {
    const content = fs.readFileSync(nodeMjsPath);
    return crypto.createHash("md5").update(content).digest("hex");
  }
  // If file doesn't exist, use timestamp
  return Date.now().toString();
}

export function setupDockerfileForBuildWeb(config: string): string {
  return `
FROM node:18-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache \
    build-base \
    python3 \
    py3-pip \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev \
    libxml2-utils \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto-emoji
RUN npm install -g node-gyp
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
COPY package.json .
RUN yarn install --ignore-engines
COPY ./src ./src/
COPY ${config} .
COPY dist/prebuild/builders/web.mjs ./web.mjs
# Create the full directory structure before CMD
RUN mkdir -p /workspace/testeranto
RUN mkdir -p /workspace/testeranto/bundles
RUN mkdir -p /workspace/testeranto/bundles/web
RUN mkdir -p /workspace/testeranto/bundles/web/allTests
RUN mkdir -p /workspace/testeranto/metafiles
RUN mkdir -p /workspace/testeranto/metafiles/web
# Set environment variables for output directories
ENV BUNDLES_DIR=/workspace/testeranto/bundles/web/allTests.ts
ENV METAFILES_DIR=/workspace/testeranto/metafiles/web
# Run the build to generate metafiles when container starts
CMD ["sh", "-c", "echo 'Starting build...' && echo 'Current directory:' && pwd && echo 'Listing dist/prebuild/builders/:' && ls -la ./dist/prebuild/builders/ 2>&1 || echo 'Directory does not exist' && echo 'Checking if web.mjs exists:' && if [ -f ./dist/prebuild/builders/web.mjs ]; then echo 'web.mjs exists'; else echo 'ERROR: web.mjs does not exist'; exit 1; fi && echo 'Node version:' && node --version && echo 'npx version:' && npx --version && echo 'Running build...' && npx tsx ./dist/prebuild/builders/web.mjs ${config} dev"]
`;
}

export function setupDockerfileForBuildPython(config: string): string {
  return `
FROM node:18-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache \
    build-base \
    python3 \
    py3-pip \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev \
    libxml2-utils
# Ensure Python is properly installed and available
RUN python3 --version && pip3 --version
RUN npm install -g node-gyp
COPY package.json .
RUN yarn install --ignore-engines
COPY ./src ./src/
COPY ${config} .
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
CMD ["sh", "-c", "echo 'Starting build...' && ls -la ./dist/prebuild/builders/ && which node && which npx && npx tsx ./dist/prebuild/builders/python.mjs ${config}"]

`;
}

export function setupDockerfileForBuildGolang(config: string): string {
  return `
FROM node:18-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache \
    build-base \
    python3 \
    py3-pip \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev \
    libxml2-utils \
    wget
# Install Go
RUN wget -q -O - https://go.dev/dl/go1.21.0.linux-amd64.tar.gz | tar -xz -C /usr/local
ENV GOROOT=/usr/local/go
ENV PATH=$PATH:$GOROOT/bin
RUN npm install -g node-gyp
COPY package.json .
RUN yarn install --ignore-engines
COPY ./src ./src/
COPY ${config} .
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
CMD ["sh", "-c", "echo 'Starting build...' && ls -la ./dist/prebuild/builders/ && which node && which npx && npx tsx ./dist/prebuild/builders/golang.mjs ${config}"]
`;
}

export function setupDockerfileForBuild(
  runtime: IRunTime,
  testsName: string
): string {
  const configFilePath = process.argv[2];

  let dockerfileContent: string;

  if (runtime === "node") {
    dockerfileContent = setupDockerfileForBuildNode(configFilePath);
  } else if (runtime === "web") {
    dockerfileContent = setupDockerfileForBuildWeb(configFilePath);
  } else if (runtime === "python") {
    dockerfileContent = setupDockerfileForBuildPython(configFilePath);
  } else if (runtime === "golang") {
    dockerfileContent = setupDockerfileForBuildGolang(configFilePath);
  } else {
    throw new Error(
      `Unsupported runtime for build Dockerfile generation: ${runtime}`
    );
  }

  if (!dockerfileContent || dockerfileContent.trim().length === 0) {
    console.warn(
      `Generated empty Build Dockerfile for ${runtime}, using fallback`
    );
    dockerfileContent = `FROM ${
      runtime === "node"
        ? "node:18-alpine"
        : runtime === "python"
        ? "node:18-alpine"
        : runtime === "golang"
        ? "node:18-alpine"
        : "alpine:latest"
    }\nWORKDIR /app\nRUN mkdir -p /workspace/testeranto/metafiles\nCOPY . .\nRUN echo 'Build phase completed'\n`;
  }

  const dockerfileName = `${runtime}.Dockerfile`;
  const dockerfileDir = path.join("testeranto", "bundles", testsName, runtime);
  const dockerfilePath = path.join(dockerfileDir, dockerfileName);

  // Ensure we're not writing outside of testeranto/bundles
  const normalizedDir = path.normalize(dockerfileDir);
  if (!normalizedDir.startsWith(path.join("testeranto", "bundles"))) {
    throw new Error(
      `Invalid Dockerfile directory: ${dockerfileDir}. Must be under testeranto/bundles/`
    );
  }

  // Create the directory and write the file
  const fullDockerfileDir = path.join(process.cwd(), dockerfileDir);
  fs.mkdirSync(fullDockerfileDir, { recursive: true });
  const fullDockerfilePath = path.join(process.cwd(), dockerfilePath);
  fs.writeFileSync(fullDockerfilePath, dockerfileContent);

  // Verify the file exists
  if (!fs.existsSync(fullDockerfilePath)) {
    throw new Error(
      `Failed to create build Dockerfile at ${fullDockerfilePath}`
    );
  }

  return dockerfileDir;
}
