import fs from "fs";
import path from "path";
import { IBuiltConfig, IRunTime } from "../../Types";
import { baseNodeImage } from "../nodeVersion";
import { getStrategyForRuntime, getCategoryForRuntime } from "../strategies";

export async function generateRuntimeDockerfiles(
  config: IBuiltConfig,
  runtimes: IRunTime[],
  composeDir: string,
  log: (...args: any[]) => void,
  error: (...args: any[]) => void
) {
  for (const runtime of runtimes) {
    const hasTests =
      config[runtime]?.tests && Object.keys(config[runtime].tests).length > 0;
    if (!hasTests) continue;

    const runtimeDockerfilePath = path.join(
      composeDir,
      "allTests",
      runtime,
      `${runtime}.Dockerfile`
    );

    // Ensure directory exists
    fs.mkdirSync(path.dirname(runtimeDockerfilePath), { recursive: true });

    const strategy = getStrategyForRuntime(runtime);
    const category = getCategoryForRuntime(runtime);
    
    log(`Generating Dockerfile for ${runtime} (${category}, ${strategy})`);

    let dockerfileContent = "";
    
    // Common header with strategy information
    const strategyHeader = `# Testeranto Dockerfile for ${runtime}
# Strategy: ${strategy} (${category})
# Generated: ${new Date().toISOString()}
`;
    
    if (runtime === "node") {
      dockerfileContent = strategyHeader + `FROM ${baseNodeImage}
ARG TIMESTAMP
WORKDIR /workspace

# Strategy: ${strategy} - Interpreted language with process pools
ENV STRATEGY=${strategy}
ENV RUNTIME=${runtime}
ENV CATEGORY=${category}

# Install Python and build tools needed for npm packages with native addons
RUN apk add --update --no-cache python3 make g++ linux-headers libxml2-utils netcat-openbsd

# Create necessary directories
RUN mkdir -p /workspace/testeranto/bundles/allTests/${runtime}
RUN mkdir -p /workspace/testeranto/metafiles/${runtime}
RUN mkdir -p /workspace/dist/prebuild/builders

# Create a fresh node_modules directory in /workspace to avoid host platform binaries
WORKDIR /workspace
# Remove any .npmrc files that might contain authentication
RUN rm -f .npmrc .npmrc.* || true
# Clear npm cache and authentication
RUN npm cache clean --force
# Set npm registry to public and disable authentication
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set always-auth false && \
    npm config delete _auth 2>/dev/null || true && \
    npm config delete _authToken 2>/dev/null || true && \
    npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true && \
    npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
# Copy only package.json (not package-lock.json which might have private registry URLs)
COPY package.json ./
# Install without authentication prompts, scripts, audit, or fund
RUN npm install --legacy-peer-deps --no-audit --no-fund --ignore-scripts --no-optional
# Ensure esbuild and esbuild-sass-plugin are installed for Linux
RUN npm list esbuild 2>/dev/null || npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional
RUN npm list esbuild-sass-plugin 2>/dev/null || npm install --no-save esbuild-sass-plugin --no-audit --no-fund --ignore-scripts --no-optional
# Install tsx for running TypeScript files
RUN npm list tsx 2>/dev/null || npm install --no-save tsx --no-audit --no-fund --ignore-scripts --no-optional

# Copy the builder file to the location expected by the old command
COPY dist/prebuild/server/builders/${runtime}.mjs ./dist/prebuild/builders/${runtime}.mjs
# Also copy to current directory for the new command
COPY dist/prebuild/server/builders/${runtime}.mjs ./${runtime}.mjs

# Default command (will be overridden by docker-compose)
CMD ["npx", "tsx", "${runtime}.mjs", "allTests.ts", "dev"]`;
    } else if (runtime === "web") {
      dockerfileContent = strategyHeader + `FROM ${baseNodeImage}
ARG TIMESTAMP
WORKDIR /workspace

# Strategy: ${strategy} - Browser environment with shared Chrome
ENV STRATEGY=${strategy}
ENV RUNTIME=${runtime}
ENV CATEGORY=${category}

# Install Python, build tools, Chromium for web/Puppeteer, libxml2-utils for xmllint, and netcat-openbsd for network checks
RUN apk add --update --no-cache python3 make g++ linux-headers libxml2-utils netcat-openbsd \\
    chromium \\
    nss \\
    freetype \\
    freetype-dev \\
    harfbuzz \\
    ca-certificates \\
    ttf-freefont \\
    font-noto-emoji

# Set Puppeteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Create necessary directories
RUN mkdir -p /workspace/testeranto/bundles/allTests/${runtime}
RUN mkdir -p /workspace/testeranto/metafiles/${runtime}

# Reinstall esbuild for the correct platform (Linux)
# Remove any existing esbuild binaries and reinstall for the container's platform
RUN rm -f .npmrc .npmrc.* || true && \
    npm cache clean --force && \
    npm config set registry https://registry.npmjs.org/ && \
    npm config set always-auth false && \
    npm config delete _auth 2>/dev/null || true && \
    npm config delete _authToken 2>/dev/null || true && \
    npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true && \
    npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm uninstall esbuild @esbuild/darwin-arm64 @esbuild/darwin-x64 @esbuild/win32-x64 @esbuild/win32-arm64 2>/dev/null || true
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional
# Ensure esbuild-sass-plugin is installed for web runtime
RUN npm list esbuild-sass-plugin 2>/dev/null || npm install --no-save esbuild-sass-plugin --no-audit --no-fund --ignore-scripts --no-optional
# Install tsx for running TypeScript files
RUN npm list tsx 2>/dev/null || npm install --no-save tsx --no-audit --no-fund --ignore-scripts --no-optional

# Copy the builder file
COPY dist/prebuild/server/builders/${runtime}.mjs ./${runtime}.mjs

# Default command (will be overridden by docker-compose)
CMD ["npx", "tsx", "${runtime}.mjs", "allTests.ts", "dev"]`;
    } else if (runtime === "golang") {
      dockerfileContent = strategyHeader + `FROM golang:latest
WORKDIR /workspace

# Strategy: ${strategy} - Compiled language with separate build
ENV STRATEGY=${strategy}
ENV RUNTIME=${runtime}
ENV CATEGORY=${category}

# Create necessary directories
RUN mkdir -p /workspace/testeranto/bundles/allTests/${runtime}
RUN mkdir -p /workspace/testeranto/metafiles/${runtime}

# Install Node.js for running the builder
RUN apt-get update && apt-get install -y nodejs npm
RUN rm -f .npmrc .npmrc.* || true && \
    npm cache clean --force && \
    npm config set registry https://registry.npmjs.org/ && \
    npm config set always-auth false && \
    npm config delete _auth 2>/dev/null || true && \
    npm config delete _authToken 2>/dev/null || true && \
    npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true && \
    npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm install -g tsx --no-audit --no-fund --ignore-scripts --no-optional

# Install esbuild for the correct platform (Linux)
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional

# Copy the builder file
COPY dist/prebuild/server/builders/${runtime}.mjs ./${runtime}.mjs

# Default command (will be overridden by docker-compose)
CMD ["npx", "tsx", "${runtime}.mjs", "allTests.ts", "dev"]`;
    } else if (runtime === "python") {
      dockerfileContent = strategyHeader + `FROM python:3.11-alpine
WORKDIR /workspace

# Strategy: ${strategy} - Interpreted language with process pools
ENV STRATEGY=${strategy}
ENV RUNTIME=${runtime}
ENV CATEGORY=${category}

# Install required Python packages including websockets for WebSocket communication
RUN pip install websockets>=12.0

# Create necessary directories
RUN mkdir -p /workspace/testeranto/bundles/allTests/${runtime}
RUN mkdir -p /workspace/testeranto/metafiles/${runtime}

# Install Node.js for running the builder
RUN apk add --update nodejs npm
RUN rm -f .npmrc .npmrc.* || true && \
    npm cache clean --force && \
    npm config set registry https://registry.npmjs.org/ && \
    npm config set always-auth false && \
    npm config delete _auth 2>/dev/null || true && \
    npm config delete _authToken 2>/dev/null || true && \
    npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true && \
    npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm install -g tsx --no-audit --no-fund --ignore-scripts --no-optional

# Install esbuild for the correct platform (Linux)
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional

# Copy the builder file
COPY dist/prebuild/server/builders/${runtime}.mjs ./${runtime}.mjs

# Default command (will be overridden by docker-compose)
CMD ["npx", "tsx", "${runtime}.mjs", "allTests.ts", "dev"]`;
    }

    fs.writeFileSync(runtimeDockerfilePath, dockerfileContent);
  }
}
