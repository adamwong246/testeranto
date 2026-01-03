// src/server/docker/dockerComposeGenerator.ts
import fs3 from "fs";
import path3 from "path";

// src/server/runtimes/web/dockerfile.ts
var webDockerFile = `

FROM node:20-alpine
WORKDIR /workspace
COPY . .
RUN npm install --legacy-peer-deps --no-audit --no-fund --ignore-scripts --no-optional
RUN npm list esbuild 2>/dev/null || npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional
RUN npm list esbuild-sass-plugin 2>/dev/null || npm install --no-save esbuild-sass-plugin --no-audit --no-fund --ignore-scripts --no-optional
RUN mkdir -p /workspace/testeranto/bundles/allTests/web
RUN mkdir -p /workspace/testeranto/metafiles/web
EXPOSE 3456
ENV BUNDLES_DIR=/workspace/testeranto/bundles/allTests/web
ENV METAFILES_DIR=/workspace/testeranto/metafiles/web
ENV IN_DOCKER=true
HEALTHCHECK --interval=10s --timeout=30s --retries=10 --start-period=60s \\


RUN apt-get update && apt-get install -y --no-install-recommends     ca-certificates     fonts-liberation     libasound2     libatk-bridge2.0-0     libatk1.0-0     libc6     libcairo2     libcups2     libdbus-1-3     libexpat1     libfontconfig1     libgbm1     libgcc1     libglib2.0-0     libgtk-3-0     libnspr4     libnss3     libpango-1.0-0     libpangocairo-1.0-0     libstdc++6     libx11-6     libx11-xcb1     libxcb1     libxcomposite1     libxcursor1     libxdamage1     libxext6     libxfixes3     libxi6     libxrandr2     libxrender1     libxss1     libxtst6     lsb-release     wget     xdg-utils     && rm -rf /var/lib/apt/lists/*


RUN  apt-get update && apt-get install -y --no-install-recommends chromium chromium-sandbox && rm -rf /var/lib/apt/lists/*

CMD ["sh", "-c", "echo 'WTF world'"]
  
  
  `;
var dockerfile_default = webDockerFile;

// src/server/docker/composeWriter.ts
import fs from "fs";
import yaml from "js-yaml";
import path from "path";

// src/server/docker/baseCompose.ts
var baseCompose_default = (services) => {
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
  try {
    fs.writeFileSync(
      composeFilePath,
      yaml.dump(baseCompose_default(services), {
        lineWidth: -1,
        noRefs: true
      })
    );
  } catch (err) {
    error(`Error writing compose file:`, err);
    throw err;
  }
}

// src/server/nodeVersion.ts
var version = "20.19.4";
var baseNodeImage = `node:${version}-alpine`;

// src/server/runtimes/golang/golangDocker.ts
var golangDockerCmd = `FROM ${baseNodeImage}
WORKDIR /workspace
# Install libxml2-utils for xmllint and netcat-openbsd for network checks
RUN apk add --update --no-cache libxml2-utils netcat-openbsd
# Reinstall esbuild for Linux platform
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm uninstall esbuild @esbuild/darwin-arm64 @esbuild/darwin-x64 @esbuild/win32-x64 @esbuild/win32-arm64 2>/dev/null || true
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional
`;
var golangDockerFile = (config) => {
  return {
    build: {
      context: "/Users/adam/Code/testeranto",
      dockerfile: `testeranto/bundles/allTests/golang.Dockerfile`,
      tags: [`bundles-golang-build:latest`]
      //   args:
      //     runtime === "node"
      //       ? {
      //           NODE_MJS_HASH: "cab84cac12fc3913ce45e7e53425b8bb",
      //         }
      //       : {},
      // },
    },
    volumes: [
      "/Users/adam/Code/testeranto:/workspace",
      "node_modules:/workspace/node_modules"
      // config.check["golang"],
    ],
    image: `bundles-golang-build:latest`,
    restart: "unless-stopped",
    environment: {
      BUNDLES_DIR: `/workspace/testeranto/bundles/allTests/golang`,
      METAFILES_DIR: `/workspace/testeranto/metafiles/golang`,
      // Don't serve files - Server_TCP will handle that
      ESBUILD_SERVE_PORT: "0",
      // Disable esbuild serve
      IN_DOCKER: "true"
      // Indicate we're running in Docker
    },
    extra_hosts: ["host.docker.internal:host-gateway"],
    command: [
      "sh",
      "-c",
      `echo 'Starting golang build in watch mode...'; 
                echo 'Installing dependencies in /workspace/node_modules...'; 
                cd /workspace &&                 # Remove any .npmrc files
                rm -f .npmrc .npmrc.* || true &&                 # Clear npm cache and authentication
                npm cache clean --force &&                 # Clear any npm authentication
                npm config delete _auth 2>/dev/null || true &&                 npm config delete _authToken 2>/dev/null || true &&                 npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&                 npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true &&                 npm config delete always-auth 2>/dev/null || true &&                 npm config delete registry 2>/dev/null || true &&                 npm config set registry https://registry.npmjs.org/ &&                 npm config set always-auth false &&                 npm install --legacy-peer-deps --no-audit --no-fund --ignore-scripts --no-optional || echo "npm install may have warnings";
                echo 'Ensuring esbuild and esbuild-sass-plugin are installed for Linux platform...';
                npm list esbuild 2>/dev/null || npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional || echo "esbuild installation may have issues";
                npm list esbuild-sass-plugin 2>/dev/null || npm install --no-save esbuild-sass-plugin --no-audit --no-fund --ignore-scripts --no-optional || echo "esbuild-sass-plugin installation may have issues";
                echo 'Creating output directory...'; 
                mkdir -p /workspace/testeranto/bundles/allTests/golang;
                mkdir -p /workspace/testeranto/metafiles/golang;
                echo 'BUNDLES_DIR env:' "$BUNDLES_DIR"; 
                
                echo "Starting build process for golang..."
                npx tsx dist/prebuild/server/builders/golang.mjs allTests.ts dev || echo "Build process exited with code $?, but keeping container alive for health checks";
                
                echo "Build complete. Creating completion signal..."
                touch /workspace/testeranto/metafiles/golang/build_complete
                
                echo "Build service ready. Keeping container alive..."
                while true; do
                  sleep 3600
                done`
    ],
    healthcheck: {
      test: [
        "CMD-SHELL",
        `[ -f /workspace/testeranto/metafiles/golang/allTests.json ] && echo "healthy" || exit 1`
      ],
      interval: "10s",
      timeout: "30s",
      retries: 10,
      start_period: "60s"
    }
  };
};

// src/server/runtimes/node/nodeDocker.ts
var nodeDockerCmd = `FROM ${baseNodeImage}
WORKDIR /workspace
# Install libxml2-utils for xmllint and netcat-openbsd for network checks
RUN apk add --update --no-cache libxml2-utils netcat-openbsd
# Reinstall esbuild for Linux platform
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm uninstall esbuild @esbuild/darwin-arm64 @esbuild/darwin-x64 @esbuild/win32-x64 @esbuild/win32-arm64 2>/dev/null || true
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional
`;
var nodeDockerFile = (config) => {
  return {
    build: {
      context: "/Users/adam/Code/testeranto",
      dockerfile: `testeranto/bundles/allTests/node.Dockerfile`,
      tags: [`bundles-node-build:latest`],
      args: {
        NODE_MJS_HASH: "cab84cac12fc3913ce45e7e563425b8bb"
      }
    },
    volumes: [
      "/Users/adam/Code/testeranto:/workspace",
      "node_modules:/workspace/node_modules"
      // config.check["node"],
    ],
    image: `bundles-node-build:latest`,
    restart: "unless-stopped",
    environment: {
      BUNDLES_DIR: `/workspace/testeranto/bundles/allTests/node`,
      METAFILES_DIR: `/workspace/testeranto/metafiles/node`,
      // Don't serve files - Server_TCP will handle that
      //   ESBUILD_SERVE_PORT: "0", // Disable esbuild serve
      IN_DOCKER: "true"
      // Indicate we're running in Docker
    },
    extra_hosts: ["host.docker.internal:host-gateway"],
    command: [
      "sh",
      "-c",
      `echo 'Starting node build in watch mode...'; 
                echo 'Installing dependencies in /workspace/node_modules...'; 
                cd /workspace &&                 # Remove any .npmrc files
                rm -f .npmrc .npmrc.* || true &&                 # Clear npm cache and authentication
                npm cache clean --force &&                 # Clear any npm authentication
                npm config delete _auth 2>/dev/null || true &&                 npm config delete _authToken 2>/dev/null || true &&                 npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&                 npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true &&                 npm config delete always-auth 2>/dev/null || true &&                 npm config delete registry 2>/dev/null || true &&                 npm config set registry https://registry.npmjs.org/ &&                 npm config set always-auth false &&                 npm install --legacy-peer-deps --no-audit --no-fund --ignore-scripts --no-optional || echo "npm install may have warnings";
                echo 'Ensuring esbuild and esbuild-sass-plugin are installed for Linux platform...';
                npm list esbuild 2>/dev/null || npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional || echo "esbuild installation may have issues";
                npm list esbuild-sass-plugin 2>/dev/null || npm install --no-save esbuild-sass-plugin --no-audit --no-fund --ignore-scripts --no-optional || echo "esbuild-sass-plugin installation may have issues";
                echo 'Creating output directory...'; 
                mkdir -p /workspace/testeranto/bundles/allTests/node;
                mkdir -p /workspace/testeranto/metafiles/node;
                echo 'BUNDLES_DIR env:' "$BUNDLES_DIR"; 
                
                echo "Starting build process for node..."
                TEST_NAME=allTests WS_PORT=${config.httpPort} npx tsx dist/prebuild/server/runtimes/node/node.mjs allTests.ts dev || echo "Build process exited with code $?, but keeping container alive for health checks";
                `
    ],
    healthcheck: {
      test: [
        "CMD-SHELL",
        `[ -f /workspace/testeranto/metafiles/node/allTests.json ] && echo "healthy" || exit 1`
      ],
      interval: "10s",
      timeout: "30s",
      retries: 10,
      start_period: "60s"
    }
  };
};

// src/server/runtimes/python/pythonDocker.ts
var pythonDockerCmd = `FROM ${baseNodeImage}
WORKDIR /workspace
# Install libxml2-utils for xmllint and netcat-openbsd for network checks
RUN apk add --update --no-cache libxml2-utils netcat-openbsd
# Reinstall esbuild for Linux platform
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm uninstall esbuild @esbuild/darwin-arm64 @esbuild/darwin-x64 @esbuild/win32-x64 @esbuild/win32-arm64 2>/dev/null || true
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional
`;
var pythonDockerFile = (config) => {
  return {
    build: {
      context: "/Users/adam/Code/testeranto",
      dockerfile: `testeranto/bundles/allTests/python.Dockerfile`,
      tags: [`bundles-python-build:latest`]
      //   args:
      //     runtime === "node"
      //       ? {
      //           NODE_MJS_HASH: "cab84cac12fc3913ce45e7e53425b8bb",
      //         }
      //       : {},
      // },
    },
    volumes: [
      "/Users/adam/Code/testeranto:/workspace",
      "node_modules:/workspace/node_modules"
      // config.check["python"],
    ],
    image: `bundles-python-build:latest`,
    restart: "unless-stopped",
    environment: {
      BUNDLES_DIR: `/workspace/testeranto/bundles/allTests/python`,
      METAFILES_DIR: `/workspace/testeranto/metafiles/python`,
      // Don't serve files - Server_TCP will handle that
      ESBUILD_SERVE_PORT: "0",
      // Disable esbuild serve
      IN_DOCKER: "true"
      // Indicate we're running in Docker
    },
    extra_hosts: ["host.docker.internal:host-gateway"],
    command: [
      "sh",
      "-c",
      `echo 'Starting python build in watch mode...'; 
                echo 'Installing dependencies in /workspace/node_modules...'; 
                cd /workspace &&                 # Remove any .npmrc files
                rm -f .npmrc .npmrc.* || true &&                 # Clear npm cache and authentication
                npm cache clean --force &&                 # Clear any npm authentication
                npm config delete _auth 2>/dev/null || true &&                 npm config delete _authToken 2>/dev/null || true &&                 npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&                 npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true &&                 npm config delete always-auth 2>/dev/null || true &&                 npm config delete registry 2>/dev/null || true &&                 npm config set registry https://registry.npmjs.org/ &&                 npm config set always-auth false &&                 npm install --legacy-peer-deps --no-audit --no-fund --ignore-scripts --no-optional || echo "npm install may have warnings";
                echo 'Ensuring esbuild and esbuild-sass-plugin are installed for Linux platform...';
                npm list esbuild 2>/dev/null || npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional || echo "esbuild installation may have issues";
                npm list esbuild-sass-plugin 2>/dev/null || npm install --no-save esbuild-sass-plugin --no-audit --no-fund --ignore-scripts --no-optional || echo "esbuild-sass-plugin installation may have issues";
                echo 'Creating output directory...'; 
                mkdir -p /workspace/testeranto/bundles/allTests/python;
                mkdir -p /workspace/testeranto/metafiles/python;
                echo 'BUNDLES_DIR env:' "$BUNDLES_DIR"; 
                
                echo "Starting build process for python..."
                npx tsx dist/prebuild/server/builders/python.mjs allTests.ts dev || echo "Build process exited with code $?, but keeping container alive for health checks";
                
                echo "Build complete. Creating completion signal..."
                touch /workspace/testeranto/metafiles/python/build_complete
                
                echo "Build service ready. Keeping container alive..."
                while true; do
                  sleep 3600
                done`
    ],
    healthcheck: {
      test: [
        "CMD-SHELL",
        `[ -f /workspace/testeranto/metafiles/python/allTests.json ] && echo "healthy" || exit 1`
      ],
      interval: "10s",
      timeout: "30s",
      retries: 10,
      start_period: "60s"
    }
  };
};

// src/server/runtimes/web/dockerCompose.ts
var webDockerCompose = (config) => {
  return {
    build: {
      context: "/Users/adam/Code/testeranto",
      dockerfile: `testeranto/bundles/allTests/web/web.Dockerfile`,
      tags: [`bundles-web-build:latest`]
      //   args:
      //     runtime === "node"
      //       ? {
      //           NODE_MJS_HASH: "cab84cac12fc3913ce45e7e53425b8bb",
      //         }
      //       : {},
      // },
    },
    volumes: [
      "/Users/adam/Code/testeranto:/workspace",
      "node_modules:/workspace/node_modules"
      // config.check["web"],
    ],
    image: `bundles-web-build:latest`,
    restart: "unless-stopped",
    environment: {
      BUNDLES_DIR: `/workspace/testeranto/bundles/allTests/web`,
      METAFILES_DIR: `/workspace/testeranto/metafiles/web`,
      // Don't serve files - Server_TCP will handle that
      ESBUILD_SERVE_PORT: "0",
      // Disable esbuild serve
      IN_DOCKER: "true"
      // Indicate we're running in Docker
    },
    extra_hosts: ["host.docker.internal:host-gateway"],
    healthcheck: {
      test: [
        "CMD-SHELL",
        `[ -f /workspace/testeranto/metafiles/web/allTests.json ] && echo "healthy" || exit 1`
      ],
      interval: "10s",
      timeout: "30s",
      retries: 10,
      start_period: "60s"
    }
  };
};

// src/server/aider/configParser.ts
import fs2 from "fs";
import path2 from "path";
import yaml2 from "js-yaml";
function parseAiderConfig() {
  console.log("parseAiderConfig: Looking for .aider.conf.yml");
  const configPath = path2.join(process.cwd(), ".aider.conf.yml");
  if (!fs2.existsSync(configPath)) {
    console.log(`No .aider.conf.yml file found at ${configPath}`);
    return null;
  }
  try {
    console.log(`Found .aider.conf.yml at ${configPath}`);
    const fileContent = fs2.readFileSync(configPath, "utf8");
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
      const lines = fs2.readFileSync(configPath, "utf8").split("\n");
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
async function generateServices(config, runtimes2, webSocketPort, log, error) {
  const services = {};
  services["aider-pool"] = {
    ...aiderPoolService_default
    // Note: .aider.conf.yml is mounted as a volume in aiderPoolService.ts
    // It's not an environment variable file, so we don't use env_file here
  };
  for (const serviceName in services) {
    services[serviceName].networks = ["default"];
  }
  for (const runtime of runtimes2) {
    if (runtime === "node") {
      services[`${runtime}-builder`] = nodeDockerFile(config);
    } else if (runtime === "web") {
      services[`${runtime}-builder`] = webDockerCompose(config);
    } else if (runtime === "golang") {
      services[`${runtime}-builder`] = golangDockerFile(config);
    } else if (runtime === "python") {
      services[`${runtime}-builder`] = pythonDockerFile(config);
    } else {
      throw `unknown runtime ${runtime}`;
    }
  }
  return services;
}

// src/server/docker/dockerComposeGenerator.ts
var runtimes = ["node", "web", "golang", "python"];
function generateDockerfileContent(runtime, config) {
  switch (runtime) {
    case "node":
      return `FROM node:20-alpine
WORKDIR /workspace
COPY . .
RUN npm install --legacy-peer-deps --no-audit --no-fund --ignore-scripts --no-optional
RUN npm list esbuild 2>/dev/null || npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional
RUN npm list esbuild-sass-plugin 2>/dev/null || npm install --no-save esbuild-sass-plugin --no-audit --no-fund --ignore-scripts --no-optional
RUN mkdir -p /workspace/testeranto/bundles/allTests/node
RUN mkdir -p /workspace/testeranto/metafiles/node
EXPOSE 3456
ENV BUNDLES_DIR=/workspace/testeranto/bundles/allTests/node
ENV METAFILES_DIR=/workspace/testeranto/metafiles/node
ENV IN_DOCKER=true
HEALTHCHECK --interval=10s --timeout=30s --retries=10 --start-period=60s \\
  CMD [ -f /workspace/testeranto/metafiles/node/allTests.json ] && echo "healthy" || exit 1
CMD ["sh", "-c", "echo 'Starting node build in watch mode...'; \\
  echo 'Installing dependencies in /workspace/node_modules...'; \\
  cd /workspace && \\
  rm -f .npmrc .npmrc.* || true && \\
  npm cache clean --force && \\
  npm config delete _auth 2>/dev/null || true && \\
  npm config delete _authToken 2>/dev/null || true && \\
  npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true && \\
  npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true && \\
  npm config delete always-auth 2>/dev/null || true && \\
  npm config delete registry 2>/dev/null || true && \\
  npm config set registry https://registry.npmjs.org/ && \\
  npm config set always-auth false && \\
  npm install --legacy-peer-deps --no-audit --no-fund --ignore-scripts --no-optional || echo 'npm install may have warnings'; \\
  echo 'Ensuring esbuild and esbuild-sass-plugin are installed for Linux platform...'; \\
  npm list esbuild 2>/dev/null || npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional || echo 'esbuild installation may have issues'; \\
  npm list esbuild-sass-plugin 2>/dev/null || npm install --no-save esbuild-sass-plugin --no-audit --no-fund --ignore-scripts --no-optional || echo 'esbuild-sass-plugin installation may have issues'; \\
  echo 'Creating output directory...'; \\
  mkdir -p /workspace/testeranto/bundles/allTests/node; \\
  mkdir -p /workspace/testeranto/metafiles/node; \\
  echo 'BUNDLES_DIR env:' \\"$BUNDLES_DIR\\"; \\
  echo 'Starting build process for node...'; \\
  TEST_NAME=allTests WS_PORT=3456 npx tsx dist/prebuild/server/runtimes/node/node.mjs allTests.ts dev || echo 'Build process exited with code $?, but keeping container alive for health checks'"]`;
    case "web":
      return dockerfile_default;
    case "golang":
      return `FROM golang:1.21-alpine
WORKDIR /workspace
COPY . .
RUN mkdir -p /workspace/testeranto/bundles/allTests/golang
RUN mkdir -p /workspace/testeranto/metafiles/golang
EXPOSE 3456
ENV BUNDLES_DIR=/workspace/testeranto/bundles/allTests/golang
ENV METAFILES_DIR=/workspace/testeranto/metafiles/golang
ENV IN_DOCKER=true
CMD ["sh", "-c", "echo 'Go build container ready'; \\
                    mkdir -p /workspace/testeranto/bundles/allTests/golang; \\
                    mkdir -p /workspace/testeranto/metafiles/golang; \\
                    tail -f /dev/null"]`;
    case "python":
      return `FROM python:3.11-alpine
WORKDIR /workspace
COPY . .
RUN pip install --no-cache-dir pytest
RUN mkdir -p /workspace/testeranto/bundles/allTests/python
RUN mkdir -p /workspace/testeranto/metafiles/python
EXPOSE 3456
ENV BUNDLES_DIR=/workspace/testeranto/bundles/allTests/python
ENV METAFILES_DIR=/workspace/testeranto/metafiles/python
ENV IN_DOCKER=true
CMD ["sh", "-c", "echo 'Python build container ready'; \\
                    mkdir -p /workspace/testeranto/bundles/allTests/python; \\
                    mkdir -p /workspace/testeranto/metafiles/python; \\
                    tail -f /dev/null"]`;
    default:
      return `FROM alpine:latest
WORKDIR /workspace
COPY . .
CMD ["sh", "-c", "echo 'Generic build container ready' && tail -f /dev/null"]`;
  }
}
async function generateRuntimeDockerfiles(config, runtimes2, composeDir, log, error) {
  log(`Generating Dockerfiles for runtimes: ${runtimes2.join(", ")}`);
  for (const runtime of runtimes2) {
    const runtimeDockerfilePath = path3.join(
      composeDir,
      "allTests",
      runtime,
      `${runtime}.Dockerfile`
    );
    log(
      `Creating directory for ${runtime} Dockerfile: ${path3.dirname(
        runtimeDockerfilePath
      )}`
    );
    fs3.mkdirSync(path3.dirname(runtimeDockerfilePath), { recursive: true });
    log(`Generating ${runtime} Dockerfile at: ${runtimeDockerfilePath}`);
    const dockerfileContent = generateDockerfileContent(runtime, config);
    fs3.writeFileSync(runtimeDockerfilePath, dockerfileContent);
    log(`Generated ${runtime} Dockerfile successfully`);
  }
}
async function setupDockerCompose(config, testsName, options) {
  const logger = options?.logger;
  const webSocketPort = options?.webSocketPort;
  const log = logger?.log || console.log;
  const error = logger?.error || console.error;
  if (!testsName || testsName.trim() === "") {
    testsName = "allTests";
    log(`WARNING: testsName was empty, using default: ${testsName}`);
  }
  const composeDir = path3.join(process.cwd(), "testeranto", "bundles");
  try {
    fs3.mkdirSync(composeDir, { recursive: true });
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
