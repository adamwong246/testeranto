import fs from "fs";
import path from "path";
import crypto from "crypto";
// Common base Dockerfile content
const BASE_DOCKERFILE = `FROM node:18-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache \\
    build-base \\
    python3 \\
    py3-pip \\
    cairo-dev \\
    pango-dev \\
    jpeg-dev \\
    giflib-dev \\
    librsvg-dev \\
    libxml2-utils && \\
    rm -rf /var/cache/apk/*`;
// Common package installation
const COMMON_PACKAGE_INSTALL = `RUN npm install -g node-gyp
COPY package.json .
# Try yarn install, fallback to npm install if it fails
ENV npm_config_build_from_source=false
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN (yarn install --ignore-engines || npm install --legacy-peer-deps) && \\
    npm cache clean --force && \\
    yarn cache clean || true
COPY ./src ./src/`;
// Helper to create directory structure
function createDirectoryStructure(runtime) {
    return `# Create the full directory structure before CMD
RUN mkdir -p /workspace/testeranto
RUN mkdir -p /workspace/testeranto/bundles
RUN mkdir -p /workspace/testeranto/bundles/${runtime}
RUN mkdir -p /workspace/testeranto/bundles/${runtime}/allTests
RUN mkdir -p /workspace/testeranto/metafiles
RUN mkdir -p /workspace/testeranto/metafiles/${runtime}
# Set environment variables for output directories
ENV BUNDLES_DIR=/workspace/testeranto/bundles/${runtime}/allTests.ts
ENV METAFILES_DIR=/workspace/testeranto/metafiles/${runtime}`;
}
export function setupDockerfileForBuildNode(config) {
    return `${BASE_DOCKERFILE}
RUN npm install -g node-gyp tsx
COPY package.json .
# Try yarn install, fallback to npm install if it fails
ENV npm_config_build_from_source=false
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN (yarn install --ignore-engines || npm install --legacy-peer-deps) && \\
    npm install -g tsx && \\
    npm cache clean --force && \\
    yarn cache clean || true
COPY ./src ./src/
COPY ${config} .
ARG NODE_MJS_HASH
# Use the hash to bust cache for the node.mjs copy
RUN echo "Node.mjs hash: $NODE_MJS_HASH" > /tmp/node-mjs-hash.txt
COPY dist/prebuild/builders/node.mjs ./node.mjs
${createDirectoryStructure('node')}
# The actual build command will be provided by the docker-compose service command
# No CMD here, let the service command override
`;
}
// Helper function to compute hash of node.mjs
export function computeNodeMjsHash() {
    const nodeMjsPath = path.join(process.cwd(), "dist/prebuild/builders/node.mjs");
    if (fs.existsSync(nodeMjsPath)) {
        const content = fs.readFileSync(nodeMjsPath);
        return crypto.createHash("md5").update(content).digest("hex");
    }
    // If file doesn't exist, use timestamp
    return Date.now().toString();
}
export function setupDockerfileForBuildWeb(config) {
    const webSpecificPackages = `\\
    chromium \\
    nss \\
    freetype \\
    freetype-dev \\
    harfbuzz \\
    ca-certificates \\
    ttf-freefont \\
    font-noto-emoji`;
    return `FROM node:18-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache \\
    build-base \\
    python3 \\
    py3-pip \\
    cairo-dev \\
    pango-dev \\
    jpeg-dev \\
    giflib-dev \\
    librsvg-dev \\
    libxml2-utils${webSpecificPackages} && \\
    rm -rf /var/cache/apk/*
RUN npm install -g node-gyp
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
${COMMON_PACKAGE_INSTALL}
COPY ${config} .
COPY dist/prebuild/builders/web.mjs ./web.mjs
${createDirectoryStructure('web')}
# Run the build to generate metafiles when container starts
CMD ["sh", "-c", "echo 'Starting build...' && echo 'Current directory:' && pwd && echo 'Listing dist/prebuild/builders/:' && ls -la ./dist/prebuild/builders/ 2>&1 || echo 'Directory does not exist' && echo 'Checking if web.mjs exists:' && if [ -f ./dist/prebuild/builders/web.mjs ]; then echo 'web.mjs exists'; else echo 'ERROR: web.mjs does not exist'; exit 1; fi && echo 'Node version:' && node --version && echo 'npx version:' && npx --version && echo 'Running build...' && npx tsx ./dist/prebuild/builders/web.mjs ${config} dev"]
`;
}
export function setupDockerfileForBuildPython(config) {
    return `${BASE_DOCKERFILE}
# Ensure Python is properly installed and available
RUN python3 --version && pip3 --version
${COMMON_PACKAGE_INSTALL}
COPY ${config} .
COPY dist/prebuild/builders/python.mjs ./python.mjs
${createDirectoryStructure('python')}
# Run the build to generate metafiles when container starts
CMD ["sh", "-c", "echo 'Starting build...' && ls -la ./dist/prebuild/builders/ && which node && which npx && npx tsx ./dist/prebuild/builders/python.mjs ${config}"]
`;
}
export function setupDockerfileForBuildGolang(config) {
    const goSpecificPackages = `\\
    wget`;
    return `FROM node:18-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache \\
    build-base \\
    python3 \\
    py3-pip \\
    cairo-dev \\
    pango-dev \\
    jpeg-dev \\
    giflib-dev \\
    librsvg-dev \\
    libxml2-utils${goSpecificPackages} && \\
    rm -rf /var/cache/apk/*
# Install Go
RUN wget -q -O - https://go.dev/dl/go1.21.0.linux-amd64.tar.gz | tar -xz -C /usr/local
ENV GOROOT=/usr/local/go
ENV PATH=$PATH:$GOROOT/bin
${COMMON_PACKAGE_INSTALL}
COPY ${config} .
COPY dist/prebuild/builders/golang.mjs ./golang.mjs
${createDirectoryStructure('golang')}
# Run the build to generate metafiles when container starts
CMD ["sh", "-c", "echo 'Starting build...' && ls -la ./dist/prebuild/builders/ && which node && which npx && npx tsx ./dist/prebuild/builders/golang.mjs ${config}"]
`;
}
export function setupDockerfileForBuild(runtime, testsName) {
    const configFilePath = process.argv[2];
    let dockerfileContent;
    if (runtime === "node") {
        dockerfileContent = setupDockerfileForBuildNode(configFilePath);
    }
    else if (runtime === "web") {
        dockerfileContent = setupDockerfileForBuildWeb(configFilePath);
    }
    else if (runtime === "python") {
        dockerfileContent = setupDockerfileForBuildPython(configFilePath);
    }
    else if (runtime === "golang") {
        dockerfileContent = setupDockerfileForBuildGolang(configFilePath);
    }
    else {
        throw new Error(`Unsupported runtime for build Dockerfile generation: ${runtime}`);
    }
    if (!dockerfileContent || dockerfileContent.trim().length === 0) {
        console.warn(`Generated empty Build Dockerfile for ${runtime}, using fallback`);
        dockerfileContent = `FROM ${runtime === "node"
            ? "node:18-alpine"
            : runtime === "python"
                ? "node:18-alpine"
                : runtime === "golang"
                    ? "node:18-alpine"
                    : "alpine:latest"}\nWORKDIR /app\nRUN mkdir -p /workspace/testeranto/metafiles\nCOPY . .\nRUN echo 'Build phase completed'\n`;
    }
    const dockerfileName = `${runtime}.Dockerfile`;
    const dockerfileDir = path.join("testeranto", "bundles", testsName, runtime);
    const dockerfilePath = path.join(dockerfileDir, dockerfileName);
    // Ensure we're not writing outside of testeranto/bundles
    const normalizedDir = path.normalize(dockerfileDir);
    if (!normalizedDir.startsWith(path.join("testeranto", "bundles"))) {
        throw new Error(`Invalid Dockerfile directory: ${dockerfileDir}. Must be under testeranto/bundles/`);
    }
    // Create the directory and write the file
    const fullDockerfileDir = path.join(process.cwd(), dockerfileDir);
    fs.mkdirSync(fullDockerfileDir, { recursive: true });
    const fullDockerfilePath = path.join(process.cwd(), dockerfilePath);
    fs.writeFileSync(fullDockerfilePath, dockerfileContent);
    // Verify the file exists
    if (!fs.existsSync(fullDockerfilePath)) {
        throw new Error(`Failed to create build Dockerfile at ${fullDockerfilePath}`);
    }
    return dockerfileDir;
}
