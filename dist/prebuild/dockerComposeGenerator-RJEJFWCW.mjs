import {
  baseNodeImage,
  generateServices
} from "./chunk-RO54TLJI.mjs";

// src/server/docker/dockerComposeGenerator.ts
import path4 from "path";

// src/server/docker/directorySetup.ts
import fs from "fs";
import path from "path";

// src/server/node/nodeDocker.ts
var nodeDocker = `FROM ${baseNodeImage}
WORKDIR /workspace
# Install libxml2-utils for xmllint and netcat-openbsd for network checks
RUN apk add --update --no-cache libxml2-utils netcat-openbsd
# Reinstall esbuild for Linux platform
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm uninstall esbuild @esbuild/darwin-arm64 @esbuild/darwin-x64 @esbuild/win32-x64 @esbuild/win32-arm64 2>/dev/null || true
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional
`;

// src/server/golang/golangDocker.ts
var golangDocker = `FROM golang:latest
WORKDIR /workspace
# Install Node.js and esbuild for Linux platform
RUN apt-get update && apt-get install -y nodejs npm
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional`;

// src/server/python/pythonDocker.ts
var pythonDocker = `FROM python:latest
WORKDIR /workspace
# Install Node.js and esbuild for Linux platform
RUN apt-get update && apt-get install -y nodejs npm
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional
`;

// src/server/docker/directorySetup.ts
async function setupDirectories(config, runtimes, composeDir, log, error) {
  try {
    fs.mkdirSync(composeDir, { recursive: true });
    for (const runtime of runtimes) {
      const hasTests = config[runtime]?.tests && Object.keys(config[runtime].tests).length > 0;
      if (hasTests) {
        const runtimeDir = path.join(composeDir, "allTests", runtime);
        fs.mkdirSync(runtimeDir, { recursive: true });
        const tests = config[runtime]?.tests;
        if (tests) {
          for (const testPath of Object.keys(tests)) {
            const testDirPath = path.dirname(testPath);
            const testDir = path.join(runtimeDir, testDirPath);
            fs.mkdirSync(testDir, { recursive: true });
            if (runtime !== "web") {
              const dockerfilePath = path.join(testDir, "Dockerfile");
              if (!fs.existsSync(dockerfilePath)) {
                let dockerfileContent = "";
                if (runtime === "node") {
                  dockerfileContent = nodeDocker;
                } else if (runtime === "golang") {
                  dockerfileContent = golangDocker;
                } else if (runtime === "python") {
                  dockerfileContent = pythonDocker;
                }
                if (dockerfileContent) {
                  fs.writeFileSync(dockerfilePath, dockerfileContent);
                }
              }
            }
          }
        }
      }
    }
  } catch (err) {
    error(`Error creating directories:`, err);
    throw err;
  }
}

// src/server/docker/runtimeDockerfileGenerator.ts
import fs2 from "fs";
import path2 from "path";
async function generateRuntimeDockerfiles(config, runtimes, composeDir, log, error) {
  for (const runtime of runtimes) {
    const hasTests = config[runtime]?.tests && Object.keys(config[runtime].tests).length > 0;
    if (!hasTests)
      continue;
    const runtimeDockerfilePath = path2.join(
      composeDir,
      "allTests",
      runtime,
      `${runtime}.Dockerfile`
    );
    fs2.mkdirSync(path2.dirname(runtimeDockerfilePath), { recursive: true });
    let dockerfileContent = "";
    if (runtime === "node") {
      dockerfileContent = `FROM ${baseNodeImage}
ARG TIMESTAMP
WORKDIR /workspace

# Install Python and build tools needed for npm packages with native addons
RUN apk add --update --no-cache python3 make g++ linux-headers libxml2-utils netcat-openbsd

# Create necessary directories
RUN mkdir -p /workspace/testeranto/bundles/allTests/${runtime}
RUN mkdir -p /workspace/testeranto/metafiles/${runtime}
RUN mkdir -p /workspace/dist/prebuild/builders
RUN mkdir -p /workspace/dist/prebuild/builders
RUN mkdir -p /workspace/dist/prebuild/builders
RUN mkdir -p /workspace/dist/prebuild/builders

# Create a fresh node_modules directory in /workspace to avoid host platform binaries
WORKDIR /workspace
# Remove any .npmrc files that might contain authentication
RUN rm -f .npmrc .npmrc.* || true
# Clear npm cache and authentication
RUN npm cache clean --force
# Set npm registry to public and disable authentication
RUN npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
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
      dockerfileContent = `FROM ${baseNodeImage}
ARG TIMESTAMP
WORKDIR /workspace

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
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
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
      dockerfileContent = `FROM golang:latest
WORKDIR /workspace

# Create necessary directories
RUN mkdir -p /workspace/testeranto/bundles/allTests/${runtime}
RUN mkdir -p /workspace/testeranto/metafiles/${runtime}

# Install Node.js for running the builder
RUN apt-get update && apt-get install -y nodejs npm
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm install -g tsx --no-audit --no-fund --ignore-scripts --no-optional

# Install esbuild for the correct platform (Linux)
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional

# Copy the builder file
COPY dist/prebuild/server/builders/${runtime}.mjs ./${runtime}.mjs

# Default command (will be overridden by docker-compose)
CMD ["npx", "tsx", "${runtime}.mjs", "allTests.ts", "dev"]`;
    } else if (runtime === "python") {
      dockerfileContent = `FROM python:3.11-alpine
WORKDIR /workspace

# Install required Python packages including websockets for WebSocket communication
RUN pip install websockets>=12.0

# Create necessary directories
RUN mkdir -p /workspace/testeranto/bundles/allTests/${runtime}
RUN mkdir -p /workspace/testeranto/metafiles/${runtime}

# Install Node.js for running the builder
RUN apk add --update nodejs npm
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm install -g tsx --no-audit --no-fund --ignore-scripts --no-optional

# Install esbuild for the correct platform (Linux)
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional

# Copy the builder file
COPY dist/prebuild/server/builders/${runtime}.mjs ./${runtime}.mjs

# Default command (will be overridden by docker-compose)
CMD ["npx", "tsx", "${runtime}.mjs", "allTests.ts", "dev"]`;
    }
    fs2.writeFileSync(runtimeDockerfilePath, dockerfileContent);
  }
}

// src/server/docker/composeWriter.ts
import fs3 from "fs";
import yaml from "js-yaml";
import path3 from "path";

// src/server/docker/baseCompose.ts
var baseCompose_default = (services, testsName) => {
  return {
    version: "3.8",
    services,
    volumes: {
      node_modules: {
        driver: "local"
      }
    },
    networks: {
      default: {
        name: "allTests_network"
      }
    }
  };
};

// src/server/docker/composeWriter.ts
async function writeComposeFile(services, testsName, composeDir, error) {
  const composeFilePath = path3.join(
    composeDir,
    `${testsName}-docker-compose.yml`
  );
  for (const [serviceName, serviceConfig] of Object.entries(services)) {
    if (serviceName.includes("-example-") || serviceName.includes("-test-")) {
      serviceConfig.restart = "no";
      delete serviceConfig.healthcheck;
    }
  }
  try {
    fs3.writeFileSync(
      composeFilePath,
      yaml.dump(baseCompose_default(services, testsName), {
        lineWidth: -1,
        noRefs: true
      })
    );
  } catch (err) {
    error(`Error writing compose file:`, err);
    throw err;
  }
}

// src/server/docker/dockerComposeGenerator.ts
async function setupDockerCompose(config, testsName, options) {
  const logger = options?.logger;
  const dockerManPort = options?.dockerManPort;
  const webSocketPort = options?.webSocketPort;
  const log = logger?.log || console.log;
  const error = logger?.error || console.error;
  if (!testsName || testsName.trim() === "") {
    testsName = "allTests";
    log(`WARNING: testsName was empty, using default: ${testsName}`);
  }
  const runtimes = ["node", "web", "golang", "python"];
  const composeDir = path4.join(process.cwd(), "testeranto", "bundles");
  try {
    await setupDirectories(config, runtimes, composeDir, log, error);
    await generateRuntimeDockerfiles(config, runtimes, composeDir, log, error);
    const services = await generateServices(
      config,
      runtimes,
      webSocketPort,
      log,
      error
    );
    await writeComposeFile(services, testsName, composeDir, error);
  } catch (err) {
    error(`Error in setupDockerCompose:`, err);
    throw err;
  }
}
export {
  setupDockerCompose
};
