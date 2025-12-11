import {
  baseNodeImage,
  init_nodeVersion
} from "./chunk-X7KD2R3Q.mjs";
import "./chunk-3X2YHN6Q.mjs";

// src/server/docker/dockerComposeGenerator.ts
import fs4 from "fs";
import path4 from "path";

// src/server/docker/composeWriter.ts
import fs from "fs";
import yaml from "js-yaml";
import path from "path";

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
  const composeFilePath = path.join(
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
    fs.writeFileSync(
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

// src/server/docker/runtimeDockerfileGenerator.ts
init_nodeVersion();
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
      dockerfileContent = // strategyHeader +
      `
FROM ${baseNodeImage}
# Create necessary directories
RUN mkdir -p /workspace/testeranto/bundles/allTests/${runtime}
RUN mkdir -p /workspace/testeranto/metafiles/${runtime}

# Install Node.js for running the builder
RUN apt-get update && apt-get install -y nodejs npm
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm install -g tsx --no-audit --no-fund --ignore-scripts --no-optional

# Install esbuild for the correct platform (Linux)
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional

COPY dist/prebuild/server/builders/${runtime}.mjs ./${runtime}.mjs
WORKDIR /workspace

    `;
    } else if (runtime === "web") {
      return ``;
    } else if (runtime === "python") {
      return ``;
    } else if (runtime === "golang") {
      return ``;
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
import yaml2 from "js-yaml";
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
    const config = yaml2.load(cleanedContent, { json: true });
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
  ports: ["8765:8765", "9000-9100:9000-9100"]
  // command: [
  //   "sh",
  //   "-c",
  //   `
  //   pwd
  //   ls -al
  // `,
  // ],
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
    const buildService = await import("./buildService-UHFSUTYW.mjs");
    const buildServiceConfig = buildService.default(runtime);
    console.log("buildServiceConfig", buildService);
    if (!buildServiceConfig.environment) {
      buildServiceConfig.environment = {};
    }
    buildServiceConfig.environment.COMPLETION_SIGNAL_PATH = `/workspace/testeranto/metafiles/${runtime}/build_complete`;
    services[buildServiceName] = buildServiceConfig;
  }
  return services;
}

// src/server/docker/dockerComposeGenerator.ts
async function setupDockerCompose(config, testsName, options) {
  const logger = options?.logger;
  const webSocketPort = options?.webSocketPort;
  const log = logger?.log || console.log;
  const error = logger?.error || console.error;
  if (!testsName || testsName.trim() === "") {
    testsName = "allTests";
    log(`WARNING: testsName was empty, using default: ${testsName}`);
  }
  const runtimes = ["node", "web", "golang", "python"];
  log("Generating docker-compose with strategies:");
  const composeDir = path4.join(process.cwd(), "testeranto", "bundles");
  try {
    fs4.mkdirSync(composeDir, { recursive: true });
    await generateRuntimeDockerfiles(config, runtimes, composeDir, log, error);
    const services = await generateServices(
      config,
      runtimes,
      webSocketPort,
      log,
      error
    );
    await writeComposeFile(services, testsName, composeDir, error);
    log(
      "Docker-compose generation complete with strategy-aware configurations"
    );
  } catch (err) {
    error(`Error in setupDockerCompose:`, err);
    throw err;
  }
}
export {
  setupDockerCompose
};
