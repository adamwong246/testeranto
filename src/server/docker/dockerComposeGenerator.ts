/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { IBuiltConfig, IRunTime } from "../../Types";
import { golangDocker } from "../golang/golangDocker";
import { nodeDocker } from "../node/nodeDocker";
import { baseNodeImage } from "../nodeVersion";
import { pythonDocker } from "../python/pythonDocker";
import { webDocker } from "../web/webDocker";
import baseCompose from "./baseCompose";
import buildService from "./buildService";
import chromiumService from "./chromiumService";
import serviceConfiger from "./serviceConfig";
import serviceConfigCommand from "./serviceConfigCommand";
// import baseCompose from "./baseCompose";

export async function setupDockerCompose(
  config: IBuiltConfig,
  testsName: string,
  options?: {
    logger?: {
      log: (...args: any[]) => void;
      error: (...args: any[]) => void;
    };
    dockerManPort?: number;
    webSocketPort?: number;
  }
) {
  const logger = options?.logger;
  const dockerManPort = options?.dockerManPort;
  const webSocketPort = options?.webSocketPort;
  const log = logger?.log || console.log;
  const error = logger?.error || console.error;

  // Ensure testsName is valid
  if (!testsName || testsName.trim() === "") {
    testsName = "allTests";
    log(`WARNING: testsName was empty, using default: ${testsName}`);
  }

  // Define runtimes once at the beginning
  const runtimes: IRunTime[] = ["node", "web", "golang", "python"];

  // First, ensure all necessary directories exist
  const composeDir = path.join(process.cwd(), "testeranto", "bundles");

  try {
    fs.mkdirSync(composeDir, { recursive: true });
    log(`Created directory: ${composeDir}`);

    // Also create runtime-specific directories for all runtimes that have tests
    for (const runtime of runtimes) {
      const hasTests =
        config[runtime]?.tests && Object.keys(config[runtime].tests).length > 0;
      if (hasTests) {
        const runtimeDir = path.join(composeDir, "allTests", runtime);
        fs.mkdirSync(runtimeDir, { recursive: true });
        log(`Created runtime directory: ${runtimeDir}`);

        // Also create test-specific directories for each test
        // But skip creating Dockerfiles for web tests since they won't have services
        const tests = config[runtime]?.tests;
        if (tests) {
          for (const testPath of Object.keys(tests)) {
            // Create directory for the test's Dockerfile
            // testPath is a file path like "src/example/Calculator.golingvu.test.go"
            // We need to extract the directory part
            const testDirPath = path.dirname(testPath);
            const testDir = path.join(runtimeDir, testDirPath);
            fs.mkdirSync(testDir, { recursive: true });
            log(`Created test directory: ${testDir}`);

            // Only create Dockerfiles for non-web runtimes
            // Web tests don't need individual Dockerfiles since they won't have services
            if (runtime !== "web") {
              const dockerfilePath = path.join(testDir, "Dockerfile");

              // Create a simple Dockerfile for the test service
              if (!fs.existsSync(dockerfilePath)) {
                // Create a minimal Dockerfile
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
                  log(`Created Dockerfile at: ${dockerfilePath}`);
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

  // First, create runtime-specific Dockerfiles for build services
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
      dockerfileContent = `FROM golang:latest
WORKDIR /workspace

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
      dockerfileContent = `FROM python:latest
WORKDIR /workspace

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
    }

    fs.writeFileSync(runtimeDockerfilePath, dockerfileContent);
    log(`Created runtime Dockerfile at: ${runtimeDockerfilePath}`);
  }

  // Generate services according to the example structure
  const services: any = {};

  // Add Chromium service for web tests using browserless/chrome
  services["chromium"] = chromiumService;

  // Add build services for each runtime
  for (const runtime of runtimes) {
    const buildServiceName = `${runtime}-build`;

    // Check if the runtime has tests in the config
    const hasTests =
      config[runtime]?.tests && Object.keys(config[runtime].tests).length > 0;
    if (!hasTests) continue;

    // Build service configuration
    services[buildServiceName] = buildService(runtime);
  }

  // Add test services for each test, but skip web tests
  // Web tests should all run through the single Chromium service
  for (const runtime of runtimes) {
    const tests = config[runtime]?.tests;
    if (!tests) continue;

    // Skip creating services for web tests
    // Web tests will run through the Chromium service's API/web interface
    if (runtime === "web") {
      log(`Skipping Docker service creation for web tests. Web tests will run through Chromium service.`);
      continue;
    }

    for (const [testPath, testConfig] of Object.entries(tests)) {
      // Generate service name from test path
      // Docker requires lowercase names for images
      // Convert everything to lowercase and replace all non-alphanumeric characters with hyphens
      const sanitizedTestPath = testPath
        .toLowerCase()
        .replace(/\//g, "-")
        .replace(/\./g, "-")
        .replace(/[^a-z0-9-]/g, "-");
      const serviceName = `${runtime}-${sanitizedTestPath}`;

      // Extract test name without extension for display
      const testNameParts = testPath.split("/");
      const testFileName = testNameParts[testNameParts.length - 1];
      const testName = testFileName.replace(/\.[^/.]+$/, "");

      // Determine the bundle file extension based on runtime
      let betterTestPath = testPath;

      if (runtime === "node") {
        betterTestPath = testPath.replace(".ts", ".mjs");
      } else if (runtime === "golang") {
        // No change for golang
      } else if (runtime === "python") {
        // No change for python
      } else {
        throw "unknown runtime";
      }

      // Build service configuration
      const serviceConfig: any = { ...serviceConfiger };

      // Always remove container_name for test services to avoid conflicts
      // Docker Compose will generate unique names automatically
      delete serviceConfig.container_name;

      // Remove image field if present, we'll use build instead
      delete serviceConfig.image;

      // Set build configuration to use the Dockerfile we created
      const dockerfileDir = path.join(
        "testeranto",
        "bundles",
        "allTests",
        runtime,
        path.dirname(testPath)
      );
      const dockerfilePath = path.join(dockerfileDir, "Dockerfile");
      
      serviceConfig.build = {
        context: process.cwd(),
        dockerfile: dockerfilePath,
      };

      // For non-web runtimes, use the original command
      serviceConfig.command = serviceConfigCommand(
        runtime,
        testPath,
        betterTestPath
      );

      services[serviceName] = serviceConfig;
    }
  }

  const composeFilePath = path.join(
    composeDir,
    `${testsName}-docker-compose.yml`
  );

  console.log(
    "baseCompose(services, testsName)",
    baseCompose(services, testsName)
  );

  try {
    fs.writeFileSync(
      composeFilePath,
      yaml.dump(baseCompose(services, testsName), {
        lineWidth: -1,
        noRefs: true,
      })
    );
    log(`Generated docker-compose file: ${composeFilePath}`);
  } catch (err) {
    error(`Error writing compose file:`, err);
    throw err;
  }
}
