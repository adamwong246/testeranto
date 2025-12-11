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
  // Interpreted languages - use lightweight process pools
  node: {
    name: "node",
    category: "interpreted",
    processPoolType: "lightweight",
    image: "node:20-alpine",
    buildService: true,
    staticAnalysisService: true,
    processPoolService: true
  },
  python: {
    name: "python",
    category: "interpreted",
    processPoolType: "lightweight",
    image: "python:3.11-alpine",
    buildService: true,
    staticAnalysisService: true,
    processPoolService: true
  },
  ruby: {
    name: "ruby",
    category: "interpreted",
    processPoolType: "lightweight",
    image: "ruby:3-alpine",
    buildService: true,
    staticAnalysisService: true,
    processPoolService: true
  },
  php: {
    name: "php",
    category: "interpreted",
    processPoolType: "lightweight",
    image: "php:8.2-alpine",
    buildService: true,
    staticAnalysisService: true,
    processPoolService: true
  },
  // Compiled languages - use binary process pools
  go: {
    name: "go",
    category: "compiled",
    processPoolType: "binary",
    image: "golang:1.21-alpine",
    buildService: true,
    staticAnalysisService: true,
    processPoolService: true
  },
  rust: {
    name: "rust",
    category: "compiled",
    processPoolType: "binary",
    image: "rust:1.70-alpine",
    buildService: true,
    staticAnalysisService: true,
    processPoolService: true
  },
  // VM language - use shared JVM process pool
  java: {
    name: "java",
    category: "VM",
    processPoolType: "shared-jvm",
    image: "openjdk:17-alpine",
    buildService: true,
    staticAnalysisService: true,
    processPoolService: true
  },
  // Browser environment - use shared Chrome process pool
  web: {
    name: "web",
    category: "chrome",
    processPoolType: "shared-chrome",
    image: "node:20-alpine",
    buildService: true,
    staticAnalysisService: true,
    processPoolService: true
  }
};
function getStrategyForRuntime(runtime) {
  const runtimeName = runtime;
  if (RUNTIME_STRATEGIES[runtimeName]) {
    const processPoolType = RUNTIME_STRATEGIES[runtimeName].processPoolType;
    switch (processPoolType) {
      case "lightweight":
      case "binary":
        return "combined-build-test-process-pools";
      case "shared-jvm":
        return "combined-service-shared-jvm";
      case "shared-chrome":
        return "combined-service-shared-chrome";
      default:
        return "combined-build-test-process-pools";
    }
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
function getProcessPoolType(runtime) {
  const runtimeName = runtime;
  if (RUNTIME_STRATEGIES[runtimeName]) {
    return RUNTIME_STRATEGIES[runtimeName].processPoolType;
  }
  return "lightweight";
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

// src/server/aider/configParser.ts
import fs3 from "fs";
import path3 from "path";
import yaml from "js-yaml";
function parseAiderConfig() {
  console.log("parseAiderConfig: Looking for .aider.conf.yml");
  const configPath = path3.join(process.cwd(), ".aider.conf.yml");
  if (!fs3.existsSync(configPath)) {
    console.log(`No .aider.conf.yml file found at ${configPath}`);
    return null;
  }
  try {
    console.log(`Found .aider.conf.yml at ${configPath}`);
    const fileContent = fs3.readFileSync(configPath, "utf8");
    console.log(`Raw config content (first 200 chars): "${fileContent.substring(0, 200)}"`);
    const cleanedContent = fileContent.replace(/\r\n/g, "\n").replace(/\t/g, "  ").replace(/[^\x20-\x7E\n\r]/g, "").trim();
    console.log(`Cleaned content (first 200 chars): "${cleanedContent.substring(0, 200)}"`);
    const config = yaml.load(cleanedContent, { json: true });
    if (!config) {
      console.log("Config file is empty or contains only comments");
      return null;
    }
    console.log(`Successfully parsed aider config. Keys found: ${Object.keys(config).join(", ")}`);
    return config;
  } catch (error) {
    console.error(`Failed to parse .aider.conf.yml:`, error.message);
    try {
      const lines = fs3.readFileSync(configPath, "utf8").split("\n");
      console.error("File contents (line by line):");
      lines.forEach((line, index) => {
        console.error(`Line ${index + 1}: "${line}"`);
        const hasInvalidChars = /[^\x20-\x7E]/.test(line);
        if (hasInvalidChars) {
          console.error(`  WARNING: Line ${index + 1} contains non-printable characters`);
        }
      });
    } catch (readError) {
      console.error("Could not read file for line-by-line analysis:", readError);
    }
    return null;
  }
}
function extractApiKeys(config) {
  console.log("extractApiKeys");
  const apiKeys = {};
  if (!config) {
    console.log("No config provided to extractApiKeys");
    return apiKeys;
  }
  if (typeof config["api-key"] === "string") {
    console.log(`Found single api-key string: ${config["api-key"]}`);
    const [provider, key] = config["api-key"].split("=");
    if (provider && key) {
      apiKeys[provider.trim()] = key.trim();
      console.log(`Extracted API key for provider: ${provider.trim()}`);
    }
  } else if (Array.isArray(config["api-key"])) {
    console.log(`Found api-key array with ${config["api-key"].length} entries`);
    config["api-key"].forEach((keyEntry, index) => {
      console.log(`Processing api-key entry ${index + 1}: ${keyEntry}`);
      const [provider, key] = keyEntry.split("=");
      if (provider && key) {
        apiKeys[provider.trim()] = key.trim();
        console.log(`Extracted API key for provider: ${provider.trim()}`);
      } else {
        console.log(`Could not parse api-key entry: ${keyEntry}`);
      }
    });
  } else if (config["api-key"]) {
    console.log(`api-key has unexpected type: ${typeof config["api-key"]}, value: ${config["api-key"]}`);
  }
  if (config["openai-api-key"]) {
    apiKeys["openai"] = config["openai-api-key"];
    console.log(`Extracted OpenAI API key`);
  }
  if (config["anthropic-api-key"]) {
    apiKeys["anthropic"] = config["anthropic-api-key"];
    console.log(`Extracted Anthropic API key`);
  }
  console.log(`Extracted API keys for providers: ${Object.keys(apiKeys).join(", ")}`);
  return apiKeys;
}
function getApiKeyEnvironmentVariables(config) {
  const apiKeys = extractApiKeys(config);
  const envVars = {};
  const providerToEnvVar = {
    openai: "OPENAI_API_KEY",
    anthropic: "ANTHROPIC_API_KEY",
    deepseek: "DEEPSEEK_API_KEY",
    google: "GOOGLE_API_KEY",
    groq: "GROQ_API_KEY",
    mistral: "MISTRAL_API_KEY",
    cohere: "COHERE_API_KEY",
    together: "TOGETHER_API_KEY"
  };
  for (const [provider, key] of Object.entries(apiKeys)) {
    const envVarName = providerToEnvVar[provider.toLowerCase()] || `${provider.toUpperCase()}_API_KEY`;
    envVars[envVarName] = key;
    console.log(`Setting environment variable ${envVarName} for provider ${provider}`);
  }
  return envVars;
}

// src/server/docker/aiderPoolService.ts
function loadAiderApiKeys() {
  try {
    console.log("Attempting to load API keys from .aider.conf.yml...");
    const config = parseAiderConfig();
    if (config) {
      const envVars = getApiKeyEnvironmentVariables(config);
      if (Object.keys(envVars).length > 0) {
        console.log("Successfully loaded API keys from .aider.conf.yml");
        return envVars;
      } else {
        console.log("No API keys found in .aider.conf.yml");
      }
    } else {
      console.log("Could not parse .aider.conf.yml or file not found");
    }
  } catch (error) {
    console.error("Failed to load API keys from .aider.conf.yml:", error);
  }
  return {};
}
var aiderPoolService_default = {
  image: "paulgauthier/aider-full:latest",
  restart: "unless-stopped",
  environment: {
    PYTHONUNBUFFERED: "1",
    AIDER_POOL_HOST: "0.0.0.0",
    AIDER_POOL_PORT: "8765",
    // Load API keys from .aider.conf.yml (will be empty if parsing fails)
    ...loadAiderApiKeys(),
    GIT_AUTHOR_NAME: "Testeranto Bot",
    GIT_AUTHOR_EMAIL: "bot@testeranto.local",
    GIT_COMMITTER_NAME: "Testeranto Bot",
    GIT_COMMITTER_EMAIL: "bot@testeranto.local"
  },
  networks: ["default"],
  volumes: [
    `${process.cwd()}:/workspace`,
    "node_modules:/workspace/node_modules",
    "/var/run/docker.sock:/var/run/docker.sock",
    // Mount the aider config file so aider can read it directly if needed
    `${process.cwd()}/.aider.conf.yml:/workspace/.aider.conf.yml:ro`
  ],
  working_dir: "/workspace",
  ports: ["8765:8765", "9000-9100:9000-9100"],
  command: [
    "sh",
    "-c",
    `
    
    
    pwd
    ls -al
  `
  ]
};

// src/server/docker/serviceGenerator.ts
async function generateServices(config, runtimes, webSocketPort, log, error) {
  const services = {};
  const chromiumPort = config.chromiumPort || config.httpPort + 1;
  services["chromium"] = chromiumService_default(config.httpPort, chromiumPort);
  services["aider-pool"] = {
    ...aiderPoolService_default
    // Note: .aider.conf.yml is mounted as a volume in aiderPoolService.ts
    // It's not an environment variable file, so we don't use env_file here
  };
  for (const serviceName in services) {
    services[serviceName].networks = ["default"];
  }
  for (const runtime of runtimes) {
    const hasTests = config[runtime]?.tests && Object.keys(config[runtime].tests).length > 0;
    if (!hasTests)
      continue;
    const buildServiceName = `${runtime}-build`;
    const buildService = await import("./buildService-QFZFKTIB.mjs");
    const buildServiceConfig = buildService.default(runtime);
    if (!buildServiceConfig.environment) {
      buildServiceConfig.environment = {};
    }
    buildServiceConfig.environment.COMPLETION_SIGNAL_PATH = `/workspace/testeranto/metafiles/${runtime}/build_complete`;
    services[buildServiceName] = buildServiceConfig;
    const analysisServiceName = `${runtime}-analysis`;
    const analysisServiceConfig = await generateStaticAnalysisService(
      config,
      runtime
    );
    services[analysisServiceName] = analysisServiceConfig;
    const processPoolServiceName = `${runtime}-process-pool`;
    const processPoolServiceConfig = await generateProcessPoolService(
      config,
      runtime
    );
    services[processPoolServiceName] = processPoolServiceConfig;
  }
  return services;
}
async function generateStaticAnalysisService(config, runtime) {
  const runtimeInfo = getRuntimeInfo(runtime);
  const serviceConfig = {
    restart: "no",
    environment: {
      RUNTIME: runtime,
      WS_HOST: "host.docker.internal",
      WS_PORT: config.httpPort.toString(),
      IN_DOCKER: "true",
      COMPLETION_SIGNAL_PATH: `/workspace/testeranto/metafiles/${runtime}/analysis_complete`
    },
    networks: ["default"],
    image: runtimeInfo.image,
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
    serviceConfig.depends_on.chromium = {
      condition: "service_healthy"
    };
  }
  serviceConfig.command = generateAnalysisCommand(runtime, config);
  return serviceConfig;
}
async function generateProcessPoolService(config, runtime) {
  const runtimeInfo = getRuntimeInfo(runtime);
  const processPoolType = getProcessPoolType(runtime);
  const serviceConfig = {
    restart: "unless-stopped",
    environment: {
      RUNTIME: runtime,
      WS_HOST: "host.docker.internal",
      WS_PORT: config.httpPort.toString(),
      IN_DOCKER: "true",
      PROCESS_POOL_TYPE: processPoolType,
      MAX_CONCURRENT_TESTS: config.processPool?.maxConcurrent?.toString() || "4",
      TEST_TIMEOUT_MS: config.processPool?.timeoutMs?.toString() || "30000"
    },
    networks: ["default"],
    image: runtimeInfo.image,
    volumes: [
      `${process.cwd()}:/workspace`,
      "node_modules:/workspace/node_modules"
    ],
    working_dir: "/workspace",
    depends_on: {
      [`${runtime}-build`]: {
        condition: "service_healthy"
      },
      [`${runtime}-analysis`]: {
        condition: "service_completed_successfully"
      }
    }
  };
  if (runtime === "web") {
    serviceConfig.depends_on.chromium = {
      condition: "service_healthy"
    };
  }
  if (runtime === "web") {
    serviceConfig.environment.CHROME_MAX_CONTEXTS = config.chrome?.maxContexts?.toString() || "6";
    serviceConfig.environment.CHROME_MEMORY_LIMIT_MB = config.chrome?.memoryLimitMB?.toString() || "512";
  }
  serviceConfig.command = generateProcessPoolCommand(runtime, processPoolType);
  return serviceConfig;
}
function generateAnalysisCommand(runtime, config) {
  const command = `
    echo "=== Starting static analysis for ${runtime} ==="
    
    # Wait for build to complete
    echo "Waiting for build service to complete..."
    while [ ! -f /workspace/testeranto/metafiles/${runtime}/build_complete ]; do
      sleep 1
    done
    
    echo "Build complete. Running static analysis..."
    
    # Run static analysis based on runtime
    case "${runtime}" in
      "node"|"web")
        echo "Running Node.js/Web static analysis..."
        # Check if there are any checks configured
        if [ -n "$(echo '${JSON.stringify(
    config.checks || {}
  )}' | grep -v '^[{}]*$')" ]; then
          echo "User-defined checks found, running analysis..."
          # Run analysis (simplified for now)
          find /workspace/src -name "*.ts" -o -name "*.tsx" | head -5 | while read file; do
            echo "Analyzing: $file"
          done
        else
          echo "No checks configured, skipping analysis."
        fi
        ;;
      "python")
        echo "Running Python static analysis..."
        # Python analysis would go here
        ;;
      "golang")
        echo "Running Go static analysis..."
        # Go analysis would go here
        ;;
    esac
    
    echo "Static analysis complete. Creating completion signal..."
    touch /workspace/testeranto/metafiles/${runtime}/analysis_complete
    
    echo "Analysis service complete. Keeping container alive..."
    sleep 3600
  `;
  return ["sh", "-c", command];
}
function generateProcessPoolCommand(runtime, processPoolType) {
  const command = `
    echo "Starting ${runtime} process pool (type: ${processPoolType})..."
    
    # Wait for build and analysis to complete
    echo "Waiting for build and analysis services..."
    while [ ! -f /workspace/testeranto/metafiles/${runtime}/build_complete ] || 
          [ ! -f /workspace/testeranto/metafiles/${runtime}/analysis_complete ]; do
      sleep 1
    done
    
    echo "Build and analysis complete. Starting process pool..."
    
    # Create metafiles directory if it doesn't exist
    mkdir -p /workspace/testeranto/metafiles/${runtime}
    
    # Start the appropriate process pool manager
    case "${processPoolType}" in
      "lightweight")
        echo "Starting lightweight process pool for ${runtime}..."
        # For interpreted languages, we'll run tests directly
        echo "Lightweight process pool ready for ${runtime}"
        ;;
      "binary")
        echo "Starting binary process pool for ${runtime}..."
        echo "Binary process pool ready for ${runtime}"
        ;;
      "shared-jvm")
        echo "Starting shared JVM process pool..."
        echo "Shared JVM process pool ready"
        ;;
      "shared-chrome")
        echo "Starting shared Chrome process pool..."
        echo "Shared Chrome process pool ready"
        ;;
    esac
    
    echo "Process pool running. Waiting for test execution requests..."
    
    # Keep container alive
    while true; do
      sleep 3600
    done
  `;
  return ["sh", "-c", command];
}
function getRuntimeInfo(runtime) {
  const runtimeName = runtime;
  if (RUNTIME_STRATEGIES[runtimeName]) {
    return RUNTIME_STRATEGIES[runtimeName];
  }
  return {
    image: "alpine:latest",
    processPoolType: "lightweight"
  };
}

// src/server/docker/composeWriter.ts
import fs4 from "fs";
import yaml2 from "js-yaml";
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
    fs4.writeFileSync(
      composeFilePath,
      yaml2.dump(baseCompose_default(services, testsName), {
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
