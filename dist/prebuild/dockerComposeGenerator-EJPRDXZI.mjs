import {
  baseNodeImage
} from "./chunk-D7FJV2YP.mjs";
import "./chunk-3X2YHN6Q.mjs";

// src/server/docker/dockerComposeGenerator.ts
import path5 from "path";

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

// src/server/strategies.ts
var RUNTIME_STRATEGIES = {
  // Interpreted languages
  node: {
    name: "node",
    category: "interpreted",
    strategy: "combined-build-test-process-pools",
    image: "node:20-alpine",
    buildService: true,
    testService: true,
    processPool: true,
    sharedInstance: false
  },
  python: {
    name: "python",
    category: "interpreted",
    strategy: "combined-build-test-process-pools",
    image: "python:3.11-alpine",
    buildService: true,
    testService: true,
    processPool: true,
    sharedInstance: false
  },
  ruby: {
    name: "ruby",
    category: "interpreted",
    strategy: "combined-build-test-process-pools",
    image: "ruby:3-alpine",
    buildService: true,
    testService: true,
    processPool: true,
    sharedInstance: false
  },
  php: {
    name: "php",
    category: "interpreted",
    strategy: "combined-build-test-process-pools",
    image: "php:8.2-alpine",
    buildService: true,
    testService: true,
    processPool: true,
    sharedInstance: false
  },
  // Compiled languages
  go: {
    name: "go",
    category: "compiled",
    strategy: "separate-build-combined-test",
    image: "golang:1.21-alpine",
    buildService: true,
    testService: true,
    processPool: false,
    sharedInstance: false
  },
  rust: {
    name: "rust",
    category: "compiled",
    strategy: "separate-build-combined-test",
    image: "rust:1.70-alpine",
    buildService: true,
    testService: true,
    processPool: false,
    sharedInstance: false
  },
  // VM languages
  java: {
    name: "java",
    category: "VM",
    strategy: "combined-service-shared-jvm",
    image: "openjdk:17-alpine",
    buildService: true,
    testService: true,
    processPool: false,
    sharedInstance: true
  },
  // Browser environment
  web: {
    name: "web",
    category: "chrome",
    strategy: "combined-service-shared-chrome",
    image: "node:20-alpine",
    buildService: true,
    testService: true,
    processPool: false,
    sharedInstance: true
  }
};
function getStrategyForRuntime(runtime) {
  const runtimeName = runtime;
  if (RUNTIME_STRATEGIES[runtimeName]) {
    return RUNTIME_STRATEGIES[runtimeName].strategy;
  }
  return "combined-build-test-process-pools";
}
function getCategoryForRuntime(runtime) {
  const runtimeName = runtime;
  if (RUNTIME_STRATEGIES[runtimeName]) {
    return RUNTIME_STRATEGIES[runtimeName].category;
  }
  return "interpreted";
}
function shouldUseSharedInstance(runtime) {
  const runtimeName = runtime;
  if (RUNTIME_STRATEGIES[runtimeName]) {
    return RUNTIME_STRATEGIES[runtimeName].sharedInstance;
  }
  return false;
}

// src/server/docker/directorySetup.ts
async function setupDirectories(config, runtimes, composeDir, log, error) {
  try {
    fs.mkdirSync(composeDir, { recursive: true });
    for (const runtime of runtimes) {
      const hasTests = config[runtime]?.tests && Object.keys(config[runtime].tests).length > 0;
      if (hasTests) {
        const strategy = getStrategyForRuntime(runtime);
        const runtimeDir = path.join(composeDir, "allTests", runtime);
        fs.mkdirSync(runtimeDir, { recursive: true });
        const strategyInfoPath = path.join(runtimeDir, "strategy.info");
        const strategyInfo = `runtime: ${runtime}
strategy: ${strategy}
generated: ${(/* @__PURE__ */ new Date()).toISOString()}
`;
        fs.writeFileSync(strategyInfoPath, strategyInfo);
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
                  dockerfileContent = `# Strategy: ${strategy}
# Runtime: ${runtime}

` + dockerfileContent;
                  fs.writeFileSync(dockerfilePath, dockerfileContent);
                }
              }
            }
          }
        }
        if (strategy === "separate-build-combined-test") {
          const buildCacheDir = path.join(composeDir, "build-cache", runtime);
          fs.mkdirSync(buildCacheDir, { recursive: true });
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
    const strategy = getStrategyForRuntime(runtime);
    const category = getCategoryForRuntime(runtime);
    log(`Generating Dockerfile for ${runtime} (${category}, ${strategy})`);
    let dockerfileContent = "";
    const strategyHeader = `# Testeranto Dockerfile for ${runtime}
# Strategy: ${strategy} (${category})
# Generated: ${(/* @__PURE__ */ new Date()).toISOString()}
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
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
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

// src/server/docker/chromiumService.ts
var chromiumService_default = (httpPort, chromiumPort) => ({
  image: "browserless/chrome:latest",
  container_name: "chromium",
  restart: "unless-stopped",
  ports: [`${chromiumPort}:${chromiumPort}`, "9222:9222"],
  shm_size: "2g",
  environment: {
    CONNECTION_TIMEOUT: "60000",
    MAX_CONCURRENT_SESSIONS: "10",
    ENABLE_CORS: "true",
    REMOTE_DEBUGGING_PORT: "9222",
    REMOTE_DEBUGGING_ADDRESS: "0.0.0.0",
    PORT: chromiumPort.toString()
  },
  healthcheck: {
    test: ["CMD", "curl", "-f", `http://localhost:${chromiumPort}/health`],
    interval: "10s",
    timeout: "10s",
    retries: 30,
    start_period: "120s"
  },
  networks: ["default"]
});

// src/server/docker/testServiceGenerator.ts
import path3 from "path";
async function generateTestServices(config, runtimes) {
  const services = {};
  for (const runtime of runtimes) {
    const tests = config[runtime]?.tests;
    if (!tests)
      continue;
    for (const [testPath, testConfig] of Object.entries(tests)) {
      if (runtime === "web") {
        continue;
      }
      const sanitizedTestPath = testPath.toLowerCase().replace(/\//g, "-").replace(/\./g, "-").replace(/[^a-z0-9-]/g, "-");
      const serviceName = `${runtime}-${sanitizedTestPath}`;
      let betterTestPath = testPath;
      if (runtime === "node") {
        betterTestPath = testPath.replace(".ts", ".mjs");
      } else if (runtime === "web") {
        betterTestPath = testPath.replace(".ts", ".mjs");
      } else if (runtime === "golang") {
      } else if (runtime === "python") {
      } else {
        throw "unknown runtime";
      }
      const serviceConfig = {
        restart: "no",
        shm_size: "2g",
        environment: {
          CONNECTION_TIMEOUT: "60000",
          MAX_CONCURRENT_SESSIONS: "10",
          ENABLE_CORS: "true",
          REMOTE_DEBUGGING_PORT: "9222",
          REMOTE_DEBUGGING_ADDRESS: "0.0.0.0",
          WS_PORT: config.httpPort.toString(),
          WS_HOST: "host.docker.internal",
          IN_DOCKER: "true"
        },
        networks: ["default"]
      };
      const dockerfileDir = path3.join(
        "testeranto",
        "bundles",
        "allTests",
        runtime,
        path3.dirname(testPath)
      );
      const dockerfilePath = path3.join(dockerfileDir, "Dockerfile");
      serviceConfig.build = {
        context: process.cwd(),
        dockerfile: dockerfilePath
      };
      serviceConfig.volumes = [
        `${process.cwd()}:/workspace`,
        "node_modules:/workspace/node_modules"
      ];
      serviceConfig.working_dir = "/workspace";
      serviceConfig.depends_on = {
        [`${runtime}-build`]: {
          condition: "service_healthy"
        }
      };
      if (runtime === "node" || runtime === "web") {
        serviceConfig.depends_on.chromium = {
          condition: "service_healthy"
        };
      }
      if (config.monitoring) {
        serviceConfig.environment.MONITORING_WS_PORT = config.httpPort.toString();
        serviceConfig.environment.MONITORING_API_PORT = config.monitoring.apiPort?.toString() || "3003";
      }
      if (runtime === "node" && config.node?.monitoring) {
        serviceConfig.environment.MONITOR_CAPTURE_CONSOLE = config.node.monitoring.captureConsole?.toString() || "true";
        serviceConfig.environment.MONITOR_CAPTURE_UNCAUGHT_EXCEPTIONS = config.node.monitoring.captureUncaughtExceptions?.toString() || "true";
      } else if (runtime === "python" && config.python?.monitoring) {
        serviceConfig.environment.MONITOR_CAPTURE_PYTEST_OUTPUT = config.python.monitoring.capturePytestOutput?.toString() || "true";
        serviceConfig.environment.MONITOR_CAPTURE_LOGGING = config.python.monitoring.captureLogging?.toString() || "true";
      } else if (runtime === "golang" && config.golang?.monitoring) {
        serviceConfig.environment.MONITOR_CAPTURE_TEST_OUTPUT = config.golang.monitoring.captureTestOutput?.toString() || "true";
        serviceConfig.environment.MONITOR_CAPTURE_COVERAGE = config.golang.monitoring.captureCoverage?.toString() || "false";
      }
      if (runtime === "node") {
        const bundlePath = `/workspace/testeranto/bundles/allTests/${runtime}/${betterTestPath}`;
        serviceConfig.command = [
          "sh",
          "-c",
          `
          echo "=== Running Node.js BDD test ==="
          echo "Static analysis is running in parallel service"
          if [ -f "${bundlePath}" ]; then 
            node "${bundlePath}"
          else 
            echo "Bundle not found: ${bundlePath}"
            exit 1
          fi
          echo "BDD test completed, keeping container alive..."
          sleep 3600
        `
        ];
      } else if (runtime === "golang") {
        const testDir = path3.dirname(testPath);
        serviceConfig.command = [
          "sh",
          "-c",
          `
          echo "=== Running Go BDD test ==="
          echo "Static analysis was performed during build phase"
          cd /workspace/${testDir} && go test -v ./...
          echo "BDD test completed, keeping container alive..."
          sleep 3600
        `
        ];
      } else if (runtime === "python") {
        const fullTestPath = `/workspace/${betterTestPath}`;
        serviceConfig.command = [
          "sh",
          "-c",
          `
          echo "=== Running Python BDD test ==="
          echo "Static analysis is running in parallel service"
          if [ -f "${fullTestPath}" ]; then 
            python3 -m pytest "${fullTestPath}" -v
          else 
            echo "Test file not found: ${fullTestPath}"
            exit 1
          fi
          echo "BDD test completed, keeping container alive..."
          sleep 3600
        `
        ];
      }
      if (runtime !== "web" && runtime !== "node") {
        services[serviceName] = serviceConfig;
      }
    }
  }
  return services;
}

// src/server/docker/staticAnalysisServiceGenerator.ts
async function generateStaticAnalysisServices(config, runtimes) {
  const services = {};
  for (const runtime of runtimes) {
    const tests = config[runtime]?.tests;
    if (!tests)
      continue;
    const runtimeChecks = config[runtime]?.checks || config.checks;
    if (!runtimeChecks || Object.keys(runtimeChecks).length === 0) {
      continue;
    }
    for (const [testPath, testConfig] of Object.entries(tests)) {
      const sanitizedTestPath = testPath.toLowerCase().replace(/\//g, "-").replace(/\./g, "-").replace(/[^a-z0-9-]/g, "-");
      const serviceName = `${runtime}-${sanitizedTestPath}`;
      const staticAnalysisServiceName = `${serviceName}-static-analysis`;
      let betterTestPath = testPath;
      if (runtime === "node") {
        betterTestPath = testPath.replace(".ts", ".mjs");
      } else if (runtime === "web") {
        betterTestPath = testPath.replace(".ts", ".mjs");
      } else if (runtime === "golang") {
      } else if (runtime === "python") {
      } else {
        throw "unknown runtime";
      }
      const staticAnalysisServiceConfig = {
        restart: "no",
        shm_size: "2g",
        environment: {
          CONNECTION_TIMEOUT: "60000",
          MAX_CONCURRENT_SESSIONS: "10",
          ENABLE_CORS: "true",
          REMOTE_DEBUGGING_PORT: "9222",
          REMOTE_DEBUGGING_ADDRESS: "0.0.0.0",
          WS_PORT: config.httpPort.toString(),
          WS_HOST: "host.docker.internal",
          IN_DOCKER: "true",
          // Add runtime and test path for tool configuration
          RUNTIME: runtime,
          TEST_PATH: betterTestPath
        },
        networks: ["default"],
        image: getRuntimeImage(runtime),
        volumes: [
          `${process.cwd()}:/workspace`,
          "node_modules:/workspace/node_modules"
        ],
        working_dir: "/workspace",
        depends_on: {
          [`${runtime}-build`]: {
            condition: "service_healthy"
          }
        }
      };
      if (runtime === "web") {
        staticAnalysisServiceConfig.depends_on.chromium = {
          condition: "service_healthy"
        };
      }
      if (config.monitoring) {
        if (!staticAnalysisServiceConfig.environment) {
          staticAnalysisServiceConfig.environment = {};
        }
        staticAnalysisServiceConfig.environment.WS_PORT = config.httpPort.toString();
        staticAnalysisServiceConfig.environment.WS_HOST = "host.docker.internal";
        staticAnalysisServiceConfig.environment.IN_DOCKER = "true";
        staticAnalysisServiceConfig.environment.MONITORING_WS_PORT = config.httpPort.toString();
        staticAnalysisServiceConfig.environment.MONITORING_API_PORT = config.monitoring.apiPort?.toString() || "3003";
      }
      staticAnalysisServiceConfig.command = generateAnalysisCommand(
        runtime,
        betterTestPath,
        runtimeChecks,
        config
      );
      services[staticAnalysisServiceName] = staticAnalysisServiceConfig;
    }
  }
  return services;
}
function getRuntimeImage(runtime) {
  switch (runtime) {
    case "node":
    case "web":
      return "node:20.19.4-alpine";
    case "python":
      return "python:3.11-alpine";
    case "golang":
      return "golang:1.21-alpine";
    default:
      return "alpine:latest";
  }
}
function generateAnalysisCommand(runtime, testPath, checks, config) {
  const sourcePath = `/workspace/${testPath}`;
  const sourceDir = `/workspace/${testPath.split("/").slice(0, -1).join("/")}`;
  let command = `
    echo "=== Running static analysis for ${runtime} ==="
    echo "User-defined checks: ${Object.keys(checks).join(", ")}"
  `;
  if (runtime === "node" || runtime === "web") {
    command += `
      # Install npm if not available
      if ! command -v npm &> /dev/null; then
        echo "Installing npm..."
        apk add --update npm 2>/dev/null || echo "npm installation may have failed"
      fi
      # Install dependencies
      if [ -f "/workspace/package.json" ]; then
        echo "Installing dependencies from package.json..."
        cd /workspace && npm install --no-audit --no-fund --ignore-scripts 2>&1 | tail -5 || echo "npm install may have warnings"
      fi
    `;
    command += `
      # Run ESLint if configured
      if [ -n "$(echo '${JSON.stringify(checks)}' | grep -i eslint)" ]; then
        echo "Running ESLint..."
        if npx --no-install eslint --version 2>/dev/null; then
          npx eslint "${sourcePath}" 2>&1 || echo "ESLint check completed"
        else
          echo "ESLint not available, installing..."
          npm install --no-save eslint 2>/dev/null || true
          npx eslint "${sourcePath}" 2>&1 || echo "ESLint check completed"
        fi
      fi
      
      # Run TypeScript check if configured
      if [ -n "$(echo '${JSON.stringify(checks)}' | grep -i typescript)" ]; then
        echo "Running TypeScript type check..."
        if npx --no-install tsc --version 2>/dev/null; then
          npx tsc --noEmit "${sourcePath}" 2>&1 || echo "TypeScript check completed"
        else
          echo "TypeScript not available, installing..."
          npm install --no-save typescript 2>/dev/null || true
          npx tsc --noEmit "${sourcePath}" 2>&1 || echo "TypeScript check completed"
        fi
      fi
      
      # Run stylelint for web if configured
      if [ "${runtime}" = "web" ] && [ -n "$(echo '${JSON.stringify(checks)}' | grep -i stylelint)" ]; then
        echo "Running stylelint..."
        if npx --no-install stylelint --version 2>/dev/null; then
          find $(dirname "${sourcePath}") -name "*.css" -o -name "*.scss" 2>/dev/null | head -3 | while read cssFile; do
            if [ -f "$cssFile" ]; then
              npx stylelint "$cssFile" 2>&1 || echo "stylelint check completed for $cssFile"
            fi
          done
        else
          echo "stylelint not available, installing..."
          npm install --no-save stylelint 2>/dev/null || true
          find $(dirname "${sourcePath}") -name "*.css" -o -name "*.scss" 2>/dev/null | head -3 | while read cssFile; do
            if [ -f "$cssFile" ]; then
              npx stylelint "$cssFile" 2>&1 || echo "stylelint check completed for $cssFile"
            fi
          done
        fi
      fi
    `;
  } else if (runtime === "python") {
    command += `
      # Install Python static analysis tools if not available
      echo "Installing Python static analysis tools..."
      pip install --quiet flake8 pylint mypy 2>/dev/null || echo "Tool installation may have failed"
      
      # Run flake8 if configured
      if [ -n "$(echo '${JSON.stringify(checks)}' | grep -i flake8)" ]; then
        echo "Running flake8..."
        if command -v flake8 &> /dev/null && [ -f "${sourcePath}" ]; then
          flake8 "${sourcePath}" 2>&1 || echo "flake8 completed"
        else
          echo "flake8 not available"
        fi
      fi
      
      # Run pylint if configured
      if [ -n "$(echo '${JSON.stringify(checks)}' | grep -i pylint)" ]; then
        echo "Running pylint..."
        if command -v pylint &> /dev/null && [ -f "${sourcePath}" ]; then
          pylint "${sourcePath}" 2>&1 || echo "pylint completed"
        else
          echo "pylint not available"
        fi
      fi
      
      # Run mypy if configured
      if [ -n "$(echo '${JSON.stringify(checks)}' | grep -i mypy)" ]; then
        echo "Running mypy..."
        if command -v mypy &> /dev/null && [ -f "${sourcePath}" ]; then
          mypy "${sourcePath}" 2>&1 || echo "mypy completed"
        else
          echo "mypy not available"
        fi
      fi
    `;
  } else if (runtime === "golang") {
    command += `
      # Setup Go environment
      echo "Setting up Go environment..."
      go version
      
      # Run go vet if configured
      if [ -n "$(echo '${JSON.stringify(checks)}' | grep -i vet)" ]; then
        echo "Running go vet..."
        cd /workspace
        go vet ./... 2>&1 || echo "go vet completed"
      fi
      
      # Run staticcheck if configured
      if [ -n "$(echo '${JSON.stringify(checks)}' | grep -i staticcheck)" ]; then
        echo "Running staticcheck..."
        if command -v staticcheck &> /dev/null; then
          staticcheck ./... 2>&1 || echo "staticcheck completed"
        else
          echo "Installing staticcheck..."
          go install honnef.co/go/tools/cmd/staticcheck@latest 2>/dev/null || true
          staticcheck ./... 2>&1 || echo "staticcheck completed"
        fi
      fi
      
      # Run golangci-lint if configured
      if [ -n "$(echo '${JSON.stringify(checks)}' | grep -i golangci)" ]; then
        echo "Running golangci-lint..."
        if command -v golangci-lint &> /dev/null; then
          golangci-lint run ./... 2>&1 || echo "golangci-lint completed"
        else
          echo "Installing golangci-lint..."
          curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $(go env GOPATH)/bin v1.54.2 2>/dev/null || true
          golangci-lint run ./... 2>&1 || echo "golangci-lint completed"
        fi
      fi
    `;
  }
  if (JSON.stringify(checks).includes("coverage") || JSON.stringify(checks).includes("c8") || JSON.stringify(checks).includes("istanbul") || JSON.stringify(checks).includes("nyc")) {
    command += `
      echo "Running coverage analysis..."
      # This is a placeholder for coverage tools
      # In a real implementation, we would run the specific coverage tool
      echo "Coverage analysis would run here based on user configuration"
    `;
  }
  command += `
    echo "Static analysis completed, keeping container alive..."
    sleep 3600
  `;
  return ["sh", "-c", command];
}

// src/server/docker/serviceGenerator.ts
async function generateServices(config, runtimes, webSocketPort, log, error) {
  const services = {};
  const chromiumPort = config.chromiumPort || config.httpPort + 1;
  services["chromium"] = chromiumService_default(config.httpPort, chromiumPort);
  for (const serviceName in services) {
    services[serviceName].networks = ["default"];
  }
  for (const runtime of runtimes) {
    const buildServiceName = `${runtime}-build`;
    const hasTests = config[runtime]?.tests && Object.keys(config[runtime].tests).length > 0;
    if (!hasTests)
      continue;
    const buildService = await import("./buildService-22FA57BS.mjs");
    const serviceConfig = buildService.default(runtime);
    const strategy = getStrategyForRuntime(runtime);
    const useSharedInstance = shouldUseSharedInstance(runtime);
    if (!serviceConfig.environment) {
      serviceConfig.environment = {};
    }
    serviceConfig.environment.STRATEGY = strategy;
    serviceConfig.environment.RUNTIME = runtime;
    switch (strategy) {
      case "combined-service-shared-chrome":
        if (!serviceConfig.depends_on) {
          serviceConfig.depends_on = {};
        }
        serviceConfig.depends_on.chromium = {
          condition: "service_healthy"
        };
        serviceConfig.environment.CHROME_MAX_CONTEXTS = config.chrome?.maxContexts?.toString() || "6";
        serviceConfig.environment.CHROME_MEMORY_LIMIT_MB = config.chrome?.memoryLimitMB?.toString() || "512";
        break;
      case "combined-build-test-process-pools":
        if (config.processPool) {
          serviceConfig.environment.MAX_CONCURRENT_PROCESSES = config.processPool.maxConcurrent?.toString() || "4";
          serviceConfig.environment.PROCESS_TIMEOUT_MS = config.processPool.timeoutMs?.toString() || "30000";
        }
        break;
      case "separate-build-combined-test":
        if (!serviceConfig.volumes) {
          serviceConfig.volumes = [];
        }
        serviceConfig.volumes.push(
          "./testeranto/build-cache:/workspace/testeranto/build-cache"
        );
        break;
    }
    if (useSharedInstance) {
      serviceConfig.environment.SHARED_INSTANCE = "true";
      if (!serviceConfig.restart || serviceConfig.restart === "no") {
        serviceConfig.restart = "unless-stopped";
      }
    }
    services[buildServiceName] = serviceConfig;
  }
  const testServices = await generateTestServices(config, runtimes);
  const filteredTestServices = {};
  for (const [serviceName, serviceConfig] of Object.entries(testServices)) {
    let foundRuntime = null;
    for (const runtime of runtimes) {
      if (serviceName.includes(runtime)) {
        foundRuntime = runtime;
        break;
      }
    }
    if (foundRuntime) {
      const strategy = getStrategyForRuntime(foundRuntime);
      if (strategy === "separate-build-combined-test") {
        if (!serviceConfig.environment) {
          serviceConfig.environment = {};
        }
        serviceConfig.environment.STRATEGY = strategy;
        serviceConfig.environment.RUNTIME = foundRuntime;
        if (!serviceConfig.depends_on) {
          serviceConfig.depends_on = {};
        }
        serviceConfig.depends_on[`${foundRuntime}-build`] = {
          condition: "service_healthy"
        };
        filteredTestServices[serviceName] = serviceConfig;
      }
    }
  }
  Object.assign(services, filteredTestServices);
  const staticAnalysisServices = await generateStaticAnalysisServices(
    config,
    runtimes
  );
  Object.assign(services, staticAnalysisServices);
  return services;
}

// src/server/docker/composeWriter.ts
import fs3 from "fs";
import yaml from "js-yaml";
import path4 from "path";

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
  const composeFilePath = path4.join(
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
  log("Generating docker-compose with strategies:");
  for (const runtime of runtimes) {
    const strategy = getStrategyForRuntime(runtime);
    const category = getCategoryForRuntime(runtime);
    log(`  ${runtime}: ${category} -> ${strategy}`);
    if (strategy === "separate-build-combined-test") {
      log(`    -> Separate test containers for compiled language`);
    } else {
      log(`    -> Tests run within build container`);
    }
  }
  const composeDir = path5.join(process.cwd(), "testeranto", "bundles");
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
    log("Docker-compose generation complete with strategy-aware configurations");
  } catch (err) {
    error(`Error in setupDockerCompose:`, err);
    throw err;
  }
}
export {
  setupDockerCompose
};
