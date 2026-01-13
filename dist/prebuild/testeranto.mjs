import {
  __require
} from "./chunk-Y6FXYEAI.mjs";

// src/testeranto.ts
import path12 from "path";

// src/server/serverClasees/Server.ts
import readline from "readline";
import { default as ansiC3 } from "ansi-colors";

// src/server/serverClasees/Server_MetafileWatcher.ts
import fs8 from "fs";
import { default as ansiC2 } from "ansi-colors";
import path11 from "path";
import chokidar from "chokidar";

// src/server/serverClasees/Server_ProcessManager.ts
import { default as ansiC } from "ansi-colors";
import Queue from "queue";
import fs7 from "fs";
import path10 from "path";

// src/server/serverClasees/Server_FS.ts
import fs6 from "fs";
import path9 from "path";

// src/server/serverClasees/Server_HTTP.ts
import fs3 from "fs";
import http from "http";
import path5 from "path";

// src/server/serverClasees/utils/Server_TCP_constants.ts
import path from "path";
var SERVER_CONSTANTS = {
  HOST: "0.0.0.0"
};
var WEB_TEST_FILES_PATH = {
  NEW_PREFIX: "/web/",
  NEW_PREFIX_REGEX: /^\/web\//,
  OLD_PREFIX: "/bundles/web/",
  BASE_DIR: path.join("testeranto", "bundles", "allTests", "web")
};
var CONTENT_TYPES = {
  PLAIN: "text/plain",
  HTML: "text/html",
  JAVASCRIPT: "application/javascript",
  CSS: "text/css",
  JSON: "application/json",
  PNG: "image/png",
  JPEG: "image/jpeg",
  GIF: "image/gif",
  SVG: "image/svg+xml",
  ICO: "image/x-icon",
  WOFF: "font/woff",
  WOFF2: "font/woff2",
  TTF: "font/ttf",
  EOT: "application/vnd.ms-fontobject",
  XML: "application/xml",
  PDF: "application/pdf",
  ZIP: "application/zip",
  OCTET_STREAM: "application/octet-stream"
};

// src/server/serverClasees/Server_WS.ts
import { WebSocketServer, WebSocket } from "ws";

// src/server/serverClasees/Server_DockerCompose.ts
import fs2 from "fs";
import path3 from "path";
import { exec } from "child_process";
import { promisify } from "util";

// src/server/serverClasees/Server_Base.ts
var Server_Base = class {
  constructor(configs, projectName, mode2) {
    this.configs = configs;
    this.mode = mode2;
    this.projectName = projectName;
  }
  start() {
  }
};

// src/server/runtimes/golang/docker.ts
var golangDockerComposeFile = (config2) => {
  return {
    build: {
      context: "/Users/adam/Code/testeranto",
      dockerfile: `testeranto/bundles/allTests/golang/golang.Dockerfile`,
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
      "/Users/adam/Code/testeranto:/workspace"
      // "node_modules:/workspace/node_modules",
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
      `echo 'Starting Go build service...'; 
       echo 'BUNDLES_DIR env:' "$BUNDLES_DIR"; 
       
       # Create necessary directories
       mkdir -p /workspace/testeranto/bundles/allTests/golang
       mkdir -p /workspace/testeranto/metafiles/golang
       
       # The Go metafile generator should already be built in the Dockerfile
       echo "Checking for Go metafile generator...";
       if [ -f /usr/local/bin/golang-main ]; then
         echo "\u2705 Go metafile generator found at /usr/local/bin/golang-main";
       else
         echo "\u274C Go metafile generator not found at /usr/local/bin/golang-main";
         echo "Trying to build it...";
         cd /workspace/src/server/runtimes/golang &&          go build -buildvcs=false -o /usr/local/bin/golang-main .
         if [ $? -eq 0 ]; then
           echo "\u2705 Go metafile generator built successfully";
         else
           echo "\u274C Failed to build Go metafile generator";
           exit 1
         fi
       fi
       
       # If example directory exists, download its dependencies
       if [ -f /workspace/example/go.mod ]; then
         echo "Example project found, downloading dependencies...";
         cd /workspace/example && go mod download
       fi
       
       # Check if allTests.json exists
       if [ -f /workspace/testeranto/allTests.json ]; then
         echo "Config file found at /workspace/testeranto/allTests.json";
         echo "Contents of config file (first 200 chars):";
         head -c 200 /workspace/testeranto/allTests.json;
         echo "";
         # Run the Go metafile generator
         echo "Running Go metafile generator...";
         set +e
         /usr/local/bin/golang-main /workspace/testeranto/allTests.json
         EXIT_CODE=$?
         set -e
         
         echo "Go metafile generator exited with code: $EXIT_CODE";
         echo "Checking generated metafile:";
         ls -la /workspace/testeranto/metafiles/golang/ 2>/dev/null || echo "Go metafiles directory not found";
         if [ -f /workspace/testeranto/metafiles/golang/allTests.json ]; then
           echo "Metafile exists at /workspace/testeranto/metafiles/golang/allTests.json";
           echo "Metafile size:";
           wc -c /workspace/testeranto/metafiles/golang/allTests.json;
           echo "Metafile contents (first 500 chars):";
           head -c 500 /workspace/testeranto/metafiles/golang/allTests.json;
           echo "";
         else
           echo "\u274C Metafile not generated!";
           # Create an empty metafile to satisfy healthcheck
           echo "Creating empty metafile...";
           mkdir -p /workspace/testeranto/metafiles/golang
           echo '{"binaries":[]}' > /workspace/testeranto/metafiles/golang/allTests.json
         fi
         echo "Checking generated binaries:";
         ls -la /workspace/testeranto/bundles/allTests/golang/ 2>/dev/null || echo "Bundles directory not found";
         echo "Listing all files in bundles directory:";
         find /workspace/testeranto/bundles/allTests/golang -type f 2>/dev/null || echo "No files found";
       else
         echo "Config file NOT found at /workspace/testeranto/allTests.json";
         echo "Creating empty metafile to satisfy healthcheck...";
         mkdir -p /workspace/testeranto/metafiles/golang
         echo '{"binaries":[]}' > /workspace/testeranto/metafiles/golang/allTests.json
         echo "Searching for config files...";
         find /workspace -name "allTests.json" -type f 2>/dev/null | head -10;
       fi
       
       echo "Go build service ready. Keeping container alive...";
       while true; do
         sleep 3600
       done`
    ],
    healthcheck: {
      test: [
        "CMD-SHELL",
        `if [ -f /workspace/testeranto/metafiles/golang/allTests.json ]; then
           echo "healthy - metafile exists"
           exit 0
         else
           echo "unhealthy - no metafile found"
           exit 1
         fi`
      ],
      interval: "10s",
      timeout: "30s",
      retries: 10,
      start_period: "60s"
    }
  };
};
var golangDockerFile = `FROM golang:1.21-alpine
WORKDIR /workspace

# Install git for Go modules and golangci-lint
RUN apk add --no-cache git curl
# Install golangci-lint
RUN curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b /usr/local/bin v1.60.3

# Create necessary directories
RUN mkdir -p /workspace/testeranto/bundles/allTests/golang &&     mkdir -p /workspace/testeranto/metafiles/golang

# Copy all Go source files for the metafile generator
COPY src/server/runtimes/golang/ /workspace/src/server/runtimes/golang/

# Debug: List copied files
RUN echo "=== Listing files in /workspace/src/server/runtimes/golang ===" &&     ls -la /workspace/src/server/runtimes/golang/

# Create a go.mod file for the metafile generator if it doesn't exist
RUN cd /workspace/src/server/runtimes/golang &&     if [ ! -f go.mod ]; then         go mod init golang-metafile-generator &&         echo "Created new go.mod file";     else         echo "go.mod already exists, skipping initialization";     fi &&     echo "=== Go files present: ===" &&     ls *.go

# Download dependencies for the metafile generator
RUN cd /workspace/src/server/runtimes/golang &&     echo "=== Downloading dependencies ===" &&     go mod download

# Compile the Go metafile generator (build with all Go files)
RUN cd /workspace/src/server/runtimes/golang &&     echo "=== Building in directory: $(pwd) ===" &&     go build -buildvcs=false -o /usr/local/bin/golang-main .

# Verify golangci-lint installation
RUN echo "=== Verifying golangci-lint ===" &&     golangci-lint --version
`;

// src/server/runtimes/node/docker.ts
var nodeDockerComposeFile = (config2) => {
  return {
    build: {
      context: "/Users/adam/Code/testeranto",
      dockerfile: `testeranto/bundles/allTests/node/node.Dockerfile`,
      tags: [`bundles-node-build:latest`],
      args: {
        NODE_MJS_HASH: "cab84cac12fc3913ce45e7e563425b8bb"
      }
    },
    volumes: [
      "/Users/adam/Code/testeranto/testeranto:/workspace/testeranto",
      "/Users/adam/Code/testeranto/src:/workspace/src",
      "/Users/adam/Code/testeranto/example:/workspace/example",
      "/Users/adam/Code/testeranto/dist:/workspace/dist",
      "/Users/adam/Code/testeranto/allTests.ts:/workspace/allTests.ts",
      "/Users/adam/Code/testeranto/allTestsUtils.ts:/workspace/allTestsUtils.ts"
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
      `TEST_NAME=allTests WS_PORT=${config2.httpPort} yarn tsx dist/prebuild/server/runtimes/node/node.mjs allTests.ts dev || echo "Build process exited with code $?, but keeping container alive for health checks";`
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
var nodeDockerFile = `
FROM node:20.19.4-alpine
WORKDIR /workspace
COPY ./tsconfig*.json ./
COPY ./package.json ./package.json
COPY ./.yarnrc.yml ./

# Install system dependencies
RUN apk add --no-cache python3 make g++ libxml2-utils

# Install dependencies
RUN yarn install
`;

// src/server/runtimes/python/docker.ts
var pythonDockerFile = `FROM python:3.11-alpine
ARG CACHE_BUST=1
WORKDIR /workspace

# Install system dependencies needed for building Python packages
RUN apk add --no-cache     gcc     musl-dev     python3-dev     libffi-dev     openssl-dev     cargo     git     && rm -rf /var/cache/apk/*

# Copy requirements.txt from the example directory
# The build context is the project root, so example/requirements.txt should be available
# First, check if the file exists and print diagnostic info
RUN echo "Checking for requirements.txt..." &&     find /workspace -name "requirements.txt" -type f 2>/dev/null | head -5 &&     ls -la /workspace/example/ 2>/dev/null || echo "example directory not found"

COPY example/requirements.txt /tmp/requirements.txt

# Verify the file was copied successfully
RUN if [ ! -f /tmp/requirements.txt ]; then         echo "ERROR: requirements.txt not found at /tmp/requirements.txt" &&         echo "Current directory:" && pwd &&         echo "Files in /workspace:" && ls -la /workspace &&         echo "Files in /workspace/example:" && ls -la /workspace/example 2>/dev/null || echo "example directory not found" &&         exit 1;     else         echo "requirements.txt found, installing dependencies..." &&         cat /tmp/requirements.txt;     fi

# Install Python dependencies from requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Verify pylint is installed and available in PATH
RUN python -c "import pylint; print(f'pylint version: {pylint.__version__}')" &&     echo "Pylint installation verified successfully" &&     which pylint &&     pylint --version

RUN echo "Python environment ready with pylint and all dependencies"
`;
var pythonDockerComposeFile = (config2) => {
  return {
    build: {
      context: process.cwd(),
      dockerfile: `testeranto/bundles/allTests/python/python.Dockerfile`,
      tags: [`bundles-python-build:latest`],
      args: {
        BUILD_TIMESTAMP: "${BUILD_TIMESTAMP:-${CURRENT_TIMESTAMP}}"
      }
    },
    volumes: [
      `${process.cwd()}:/workspace`
      // "node_modules:/workspace/node_modules",
    ],
    image: `bundles-python-build:latest`,
    restart: "unless-stopped",
    environment: {
      BUNDLES_DIR: `/workspace/testeranto/bundles/allTests/python`,
      METAFILES_DIR: `/workspace/testeranto/metafiles/python`,
      ESBUILD_SERVE_PORT: "0",
      IN_DOCKER: "true"
    },
    extra_hosts: ["host.docker.internal:host-gateway"],
    command: [
      "sh",
      "-c",
      `echo 'Python service starting...';
       # Verify pylint is available
       python -c "import pylint; print(f'pylint {pylint.__version__} is available')" || {
         echo "ERROR: pylint not available";
         exit 1;
       };
       mkdir -p /workspace/testeranto/metafiles/python;
       echo "Checking if allTests.json exists at /workspace/testeranto/allTests.json:";
       if [ -f /workspace/testeranto/allTests.json ]; then
         echo "Config file found";
       else
         echo "Config file NOT found";
         ls -la /workspace/testeranto/ || true;
       fi
       # Run the pitono.py script with the allTests.json config
       cd /workspace && python src/server/runtimes/python/pitono.py /workspace/testeranto/allTests.json;
       echo "Checking if metafile was generated:";
       ls -la /workspace/testeranto/metafiles/python/ || echo "Python metafiles directory not found";
       echo "Checking if bundles were generated:";
       ls -la /workspace/testeranto/bundles/allTests/python/ || echo "Python bundles directory not found";
       echo "Checking for generated text files:";
       find /workspace/testeranto/bundles/allTests/python/ -name "*.txt" -type f | head -10;
       echo 'Python bundle generation completed';`
    ],
    healthcheck: {
      test: ["CMD-SHELL", 'python -c "import pylint; import sys; sys.exit(0)" || exit 1'],
      interval: "10s",
      timeout: "30s",
      retries: 10,
      start_period: "60s"
    }
  };
};

// src/server/runtimes/web/docker.ts
var webDockerCompose = (config2) => {
  return {
    build: {
      context: process.cwd(),
      dockerfile: `testeranto/bundles/allTests/web/web.Dockerfile`,
      tags: [`bundles-web-build:latest`]
    },
    volumes: [
      "/Users/adam/Code/testeranto/testeranto:/workspace/testeranto",
      "/Users/adam/Code/testeranto/src:/workspace/src",
      "/Users/adam/Code/testeranto/example:/workspace/example",
      "/Users/adam/Code/testeranto/dist:/workspace/dist",
      "/Users/adam/Code/testeranto/allTests.ts:/workspace/allTests.ts",
      "/Users/adam/Code/testeranto/allTestsUtils.ts:/workspace/allTestsUtils.ts"
    ],
    image: `bundles-web-build:latest`,
    restart: "no",
    environment: {
      BUNDLES_DIR: `/workspace/testeranto/bundles/allTests/web`,
      METAFILES_DIR: `/workspace/testeranto/metafiles/web`,
      ESBUILD_SERVE_PORT: "0",
      IN_DOCKER: "true",
      CHROMIUM_PATH: "/usr/bin/chromium-browser"
    },
    extra_hosts: ["host.docker.internal:host-gateway"],
    ports: [
      "9222:9222"
      // Expose Chrome's remote debugging port
    ],
    command: [
      "sh",
      "-c",
      `TEST_NAME=allTests WS_PORT=${config2.httpPort} yarn tsx dist/prebuild/server/runtimes/web/web.mjs allTests.ts dev || echo "Build process exited with code $?, but keeping container alive for health checks";`
    ]
  };
};
var webDockerFile = `

FROM node:20.19.4-alpine
WORKDIR /workspace
COPY ./tsconfig*.json ./
COPY ./package.json ./package.json
COPY ./.yarnrc.yml ./

# Install system dependencies
RUN apk add --no-cache python3 make g++ libxml2-utils

# Install dependencies
RUN yarn install

`;

// src/server/docker/index.ts
import fs from "fs";
import yaml from "js-yaml";
import path2 from "path";
var BaseCompose = (services) => {
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
async function writeComposeFile(services, testsName2, composeDir, error) {
  const composeFilePath = path2.join(
    composeDir,
    `${testsName2}-docker-compose.yml`
  );
  try {
    fs.writeFileSync(
      composeFilePath,
      yaml.dump(BaseCompose(services), {
        lineWidth: -1,
        noRefs: true
      })
    );
  } catch (err) {
    error(`Error writing compose file:`, err);
    throw err;
  }
}
var runtimes = ["node", "web", "golang", "python"];
function generateDockerfileContent(runtime, config2) {
  switch (runtime) {
    case "node":
      return nodeDockerFile;
    case "web":
      return webDockerFile;
    case "golang":
      return golangDockerFile;
    case "python":
      return pythonDockerFile;
    default:
      throw "unknown runtime";
  }
}
async function generateRuntimeDockerfiles(config2, runtimes2, composeDir, log, error) {
  log(`Generating Dockerfiles for runtimes: ${runtimes2.join(", ")}`);
  for (const runtime of runtimes2) {
    const runtimeDockerfilePath = path2.join(
      composeDir,
      "allTests",
      runtime,
      `${runtime}.Dockerfile`
    );
    log(
      `Creating directory for ${runtime} Dockerfile: ${path2.dirname(
        runtimeDockerfilePath
      )}`
    );
    fs.mkdirSync(path2.dirname(runtimeDockerfilePath), { recursive: true });
    log(`Generating ${runtime} Dockerfile at: ${runtimeDockerfilePath}`);
    const dockerfileContent = generateDockerfileContent(runtime, config2);
    fs.writeFileSync(runtimeDockerfilePath, dockerfileContent);
    log(`Generated ${runtime} Dockerfile successfully`);
  }
}
async function setupDockerCompose(config2, testsName2, options) {
  const logger = options?.logger;
  const webSocketPort = options?.webSocketPort;
  const log = logger?.log || console.log;
  const error = logger?.error || console.error;
  if (!testsName2 || testsName2.trim() === "") {
    testsName2 = "allTests";
    log(`WARNING: testsName was empty, using default: ${testsName2}`);
  }
  const composeDir = path2.join(process.cwd(), "testeranto", "bundles");
  try {
    fs.mkdirSync(composeDir, { recursive: true });
    await generateRuntimeDockerfiles(config2, runtimes, composeDir, log, error);
    const services = await generateServices(
      config2,
      runtimes,
      webSocketPort,
      log,
      error
    );
    await writeComposeFile(services, testsName2, composeDir, error);
  } catch (err) {
    error(`Error in setupDockerCompose:`, err);
    throw err;
  }
}
async function generateServices(config2, runtimes2, webSocketPort, log, error) {
  const services = {};
  for (const serviceName in services) {
    services[serviceName].networks = ["default"];
  }
  for (const runtime of runtimes2) {
    if (runtime === "node") {
      services[`${runtime}-builder`] = nodeDockerComposeFile(config2);
    } else if (runtime === "web") {
      services[`${runtime}-builder`] = webDockerCompose(config2);
    } else if (runtime === "golang") {
      services[`${runtime}-builder`] = golangDockerComposeFile(config2);
    } else if (runtime === "python") {
      services[`${runtime}-builder`] = pythonDockerComposeFile(config2);
    } else {
      throw `unknown runtime ${runtime}`;
    }
  }
  return services;
}

// src/server/serverClasees/utils/DockerComposeExecutor.ts
var DockerComposeExecutor = class {
  constructor(exec2) {
    this.exec = exec2;
  }
  async upAll(composeFile, cwd) {
    try {
      const cmd = `docker compose -f "${composeFile}" up -d`;
      const { stdout, stderr } = await this.exec(cmd, { cwd });
      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null
      };
    } catch (error) {
      return {
        exitCode: 1,
        out: "",
        err: `Error starting services: ${error.message}`,
        data: null
      };
    }
  }
  async down(composeFile, cwd) {
    try {
      const cmd = `docker compose -f "${composeFile}" down`;
      const { stdout, stderr } = await this.exec(cmd, { cwd });
      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null
      };
    } catch (error) {
      return {
        exitCode: 1,
        out: "",
        err: `Error stopping services: ${error.message}`,
        data: null
      };
    }
  }
  async upOne(serviceName, composeFile, cwd) {
    try {
      const cmd = `docker compose -f "${composeFile}" up -d ${serviceName}`;
      const { stdout, stderr } = await this.exec(cmd, { cwd });
      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null
      };
    } catch (error) {
      return {
        exitCode: 1,
        out: "",
        err: `Error starting service ${serviceName}: ${error.message}`,
        data: null
      };
    }
  }
  async ps(composeFile, cwd) {
    try {
      const cmd = `docker compose -f "${composeFile}" ps`;
      const { stdout, stderr } = await this.exec(cmd, { cwd });
      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null
      };
    } catch (error) {
      return {
        exitCode: 1,
        out: "",
        err: `Error getting service status: ${error.message}`,
        data: null
      };
    }
  }
  async logs(serviceName, composeFile, cwd, tail = 100, options) {
    try {
      const composeCmd = `docker compose -f "${composeFile}" logs --no-color --tail=${tail}`;
      const fullCmd = serviceName ? `${composeCmd} ${serviceName}` : composeCmd;
      const { stdout, stderr } = await this.exec(fullCmd, { cwd });
      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null
      };
    } catch (error) {
      return {
        exitCode: 1,
        out: "",
        err: `Error getting logs for ${serviceName}: ${error.message}`,
        data: null
      };
    }
  }
  async configServices(composeFile, cwd) {
    try {
      const cmd = `docker compose -f "${composeFile}" config --services`;
      const { stdout, stderr } = await this.exec(cmd, { cwd });
      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null
      };
    } catch (error) {
      return {
        exitCode: 1,
        out: "",
        err: `Error getting services from config: ${error.message}`,
        data: null
      };
    }
  }
  async build(composeFile, cwd) {
    try {
      const cmd = `docker compose -f "${composeFile}" build`;
      const { stdout, stderr } = await this.exec(cmd, { cwd });
      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null
      };
    } catch (error) {
      return {
        exitCode: 1,
        out: "",
        err: `Error building services: ${error.message}`,
        data: null
      };
    }
  }
};

// src/server/serverClasees/Server_DockerCompose.ts
var Server_DockerCompose = class extends Server_Base {
  constructor(configs, name, mode2) {
    super(configs, name, mode2);
    this.serviceLogStreams = /* @__PURE__ */ new Map();
    this.logCaptureInterval = null;
    this.cwd = process.cwd();
    this.dockerComposeYml = path3.join(
      "testeranto",
      "bundles",
      `${this.projectName}-docker-compose.yml`
    );
    this.composeDir = process.cwd();
    this.composeFile = path3.join(
      this.composeDir,
      "testeranto",
      "bundles",
      `${this.projectName}-docker-compose.yml`
    );
    const execAsync = promisify(exec);
    const execFunction = async (command, options) => {
      return await execAsync(command, options);
    };
    this.executor = new DockerComposeExecutor(execFunction);
    this.initializeAndStart().catch((error) => {
      console.error("Failed to initialize docker-compose:", error);
    });
  }
  async initializeAndStart() {
    await setupDockerCompose(this.configs, this.projectName, {
      logger: {
        log: (...args) => console.log(...args),
        error: (...args) => console.error(...args)
      }
    });
    await this.startServices();
  }
  async startServices() {
    if (!fs2.existsSync(this.composeFile)) {
      console.error(`Docker-compose file not found: ${this.composeFile}`);
      console.error(`Current directory: ${process.cwd()}`);
      const bundlesDir = path3.join(process.cwd(), "testeranto", "bundles");
      if (fs2.existsSync(bundlesDir)) {
        console.error(`Contents of ${bundlesDir}:`);
        try {
          const files = fs2.readdirSync(bundlesDir);
          console.error(files);
        } catch (e) {
          console.error(`Error reading directory: ${e}`);
        }
      }
      return;
    }
    await this.captureBuildLogs();
    await this.setupServiceLogFiles();
    this.startLogCapture();
    try {
      const result = await this.DC_upAll();
      console.log(
        `docker-compose up completed with exit code: ${result.exitCode}`
      );
      await this.captureServiceLogs();
      if (result.exitCode !== 0) {
        console.error(
          `docker-compose up failed with exit code ${result.exitCode}:`
        );
        console.error(`Error: ${result.err}`);
        console.error(`Output: ${result.out}`);
        for (const [
          serviceName,
          writeStream
        ] of this.serviceLogStreams.entries()) {
          const errorHeader = `
=== docker-compose up failed with exit code ${result.exitCode} ===
`;
          writeStream.write(errorHeader);
          if (result.err) {
            writeStream.write(`Error: ${result.err}
`);
          }
          if (result.out) {
            writeStream.write(`Output: ${result.out}
`);
          }
        }
      } else {
        console.log(`Waiting for services to become healthy (15 seconds)...`);
        await new Promise((resolve) => setTimeout(resolve, 15e3));
        const psResult2 = await this.DC_ps();
        console.log(`Service status after startup:`, psResult2.out);
        await this.captureServiceLogs();
      }
    } catch (error) {
      console.error(
        `Error starting docker-compose services:`,
        error,
        this.composeFile
      );
      console.error(`Full error:`, error);
      for (const [
        serviceName,
        writeStream
      ] of this.serviceLogStreams.entries()) {
        const errorHeader = `
=== Error starting docker-compose services ===
`;
        writeStream.write(errorHeader);
        writeStream.write(`Error: ${error}
`);
      }
    }
  }
  async captureBuildLogs() {
    const buildLogPath = path3.join(
      process.cwd(),
      "testeranto",
      "reports",
      this.projectName,
      "docker-logs",
      "docker-compose-build.log"
    );
    const buildLogDir = path3.dirname(buildLogPath);
    if (!fs2.existsSync(buildLogDir)) {
      fs2.mkdirSync(buildLogDir, { recursive: true });
    }
    const buildLogStream = fs2.createWriteStream(buildLogPath, { flags: "a" });
    let header = `=== Docker Compose Build Logs ===
`;
    header += `Started at: ${(/* @__PURE__ */ new Date()).toISOString()}
`;
    header += `Project: ${this.projectName}
`;
    header += `Compose file: ${this.composeFile}
`;
    header += "=".repeat(50) + "\n\n";
    buildLogStream.write(header);
    console.log(`Starting docker-compose build to capture build logs...`);
    try {
      const result = await this.executor.build(
        this.composeFile,
        this.composeDir
      );
      if (result.out) {
        buildLogStream.write(result.out + "\n");
      }
      if (result.err) {
        buildLogStream.write(`[STDERR] ${result.err}
`);
      }
      if (result.exitCode === 0) {
        buildLogStream.write("\nBuild process completed successfully\n");
        console.log(`docker-compose build completed successfully`);
      } else {
        buildLogStream.write(
          `
Build process failed with exit code: ${result.exitCode}
`
        );
        console.error(
          `docker-compose build failed with exit code ${result.exitCode}`
        );
      }
    } catch (error) {
      buildLogStream.write(
        `
Unexpected error during build: ${error.message}
`
      );
      console.error(`docker-compose build process error:`, error);
    } finally {
      if (!buildLogStream.closed) {
        buildLogStream.end();
      }
    }
  }
  async setupServiceLogFiles() {
    try {
      try {
        const psResult = await this.DC_ps();
        if (psResult.out) {
          const lines = psResult.out.split("\n").filter((line) => line.trim());
          for (const line of lines) {
            if (line.includes("NAME") && line.includes("COMMAND") && line.includes("STATUS")) {
              continue;
            }
            const parts = line.split(/\s+/);
            if (parts.length > 0) {
              const serviceName = parts[0];
              if (serviceName && !serviceName.startsWith("-") && serviceName !== "NAME") {
                if (!this.serviceLogStreams.has(serviceName)) {
                  await this.createLogFileForService(serviceName);
                }
              }
            }
          }
        }
      } catch (psError) {
        console.log(
          "docker-compose ps failed, trying docker-compose config:",
          psError.message
        );
        try {
          const result = await this.executor.configServices(
            this.composeFile,
            this.composeDir
          );
          if (result.exitCode === 0) {
            const serviceNames = result.out.trim().split("\n").filter((name) => name.trim());
            for (const serviceName of serviceNames) {
              if (!this.serviceLogStreams.has(serviceName)) {
                await this.createLogFileForService(serviceName);
              }
            }
          } else {
            throw new Error(result.err);
          }
        } catch (configError) {
          console.log(
            "docker-compose config also failed:",
            configError.message
          );
          await this.createLogFileForService("docker-compose");
        }
      }
    } catch (error) {
      console.error("Error setting up service log files:", error);
      await this.createLogFileForService("docker-compose");
    }
  }
  async createLogFileForService(serviceName) {
    const reportsDir = path3.join(
      process.cwd(),
      "testeranto",
      "reports",
      this.projectName,
      "docker-logs"
    );
    if (!fs2.existsSync(reportsDir)) {
      fs2.mkdirSync(reportsDir, { recursive: true });
    }
    const logFilePath = path3.join(reportsDir, `${serviceName}.log`);
    const writeStream = fs2.createWriteStream(logFilePath, { flags: "a" });
    let header = `=== Docker Logs for service: ${serviceName} ===
`;
    header += `Started at: ${(/* @__PURE__ */ new Date()).toISOString()}
`;
    header += `Project: ${this.projectName}
`;
    header += "=".repeat(50) + "\n\n";
    writeStream.write(header);
    this.serviceLogStreams.set(serviceName, writeStream);
    console.log(`Created log file for service ${serviceName}: ${logFilePath}`);
  }
  startLogCapture() {
    let captureCount = 0;
    const captureInterval = () => {
      this.logCaptureInterval = setInterval(async () => {
        await this.captureServiceLogs();
        captureCount++;
        if (captureCount >= 15 && this.logCaptureInterval) {
          clearInterval(this.logCaptureInterval);
          this.logCaptureInterval = setInterval(async () => {
            await this.captureServiceLogs();
          }, 5e3);
        }
      }, 2e3);
    };
    captureInterval();
    setTimeout(async () => {
      await this.captureServiceLogs();
    }, 1e3);
  }
  async captureServiceLogs() {
    if (this.serviceLogStreams.size === 0) {
      await this.setupServiceLogFiles();
    }
    const serviceNames = Array.from(this.serviceLogStreams.keys());
    for (const serviceName of serviceNames) {
      const writeStream = this.serviceLogStreams.get(serviceName);
      if (!writeStream) {
        continue;
      }
      try {
        const logResult = await this.DC_logs(serviceName, {
          follow: false,
          tail: 100
          // Get last 100 lines
        });
        if (logResult.out) {
          const timestamp = (/* @__PURE__ */ new Date()).toISOString();
          const logEntry = `[${timestamp}] ${logResult.out}
`;
          writeStream.write(logEntry);
        }
        if (logResult.err) {
          const timestamp = (/* @__PURE__ */ new Date()).toISOString();
          const errorEntry = `[${timestamp}] [ERROR] ${logResult.err}
`;
          writeStream.write(errorEntry);
        }
      } catch (error) {
        try {
          const psResult = await this.DC_ps();
          const serviceExists = psResult.out && psResult.out.includes(serviceName);
          if (!serviceExists) {
            this.serviceLogStreams.delete(serviceName);
            const timestamp = (/* @__PURE__ */ new Date()).toISOString();
            const removalMessage = `[${timestamp}] [INFO] Service ${serviceName} no longer exists, stopping log capture
`;
            writeStream.write(removalMessage);
            writeStream.end();
            console.log(
              `Stopped log capture for non-existent service: ${serviceName}`
            );
          } else {
            const timestamp = (/* @__PURE__ */ new Date()).toISOString();
            const errorMessage = `[${timestamp}] [LOG CAPTURE ERROR] Failed to get logs: ${error.message}
`;
            writeStream.write(errorMessage);
          }
        } catch (psError) {
          const timestamp = (/* @__PURE__ */ new Date()).toISOString();
          const errorMessage = `[${timestamp}] [LOG CAPTURE ERROR] Failed to get logs: ${error.message}
`;
          writeStream.write(errorMessage);
        }
      }
    }
    try {
      const allLogsResult = await this.DC_logs("", {
        follow: false,
        tail: 50
      });
      if (allLogsResult.out || allLogsResult.err) {
        const timestamp = (/* @__PURE__ */ new Date()).toISOString();
        const generalLogFile = path3.join(
          process.cwd(),
          "testeranto",
          "reports",
          this.projectName,
          "docker-logs",
          "docker-compose-general.log"
        );
        const reportsDir = path3.dirname(generalLogFile);
        if (!fs2.existsSync(reportsDir)) {
          fs2.mkdirSync(reportsDir, { recursive: true });
        }
        const writeStream = fs2.createWriteStream(generalLogFile, {
          flags: "a"
        });
        if (allLogsResult.out) {
          writeStream.write(`[${timestamp}] ${allLogsResult.out}
`);
        }
        if (allLogsResult.err) {
          writeStream.write(`[${timestamp}] [ERROR] ${allLogsResult.err}
`);
        }
        writeStream.end();
      }
    } catch (error) {
    }
  }
  async stopLogCapture() {
    if (this.logCaptureInterval) {
      clearInterval(this.logCaptureInterval);
      this.logCaptureInterval = null;
    }
    await this.captureServiceLogs();
    for (const [serviceName, writeStream] of this.serviceLogStreams.entries()) {
      try {
        const footer = `

=== Log capture stopped at: ${(/* @__PURE__ */ new Date()).toISOString()} ===
`;
        writeStream.write(footer);
        writeStream.end();
        console.log(`Closed log stream for service ${serviceName}`);
      } catch (error) {
        console.error(`Error closing log stream for ${serviceName}:`, error);
      }
    }
    this.serviceLogStreams.clear();
  }
  async DC_upAll(options) {
    return this.executor.upAll(this.composeFile, this.composeDir);
  }
  async DC_down(options) {
    await this.stopLogCapture();
    if (!fs2.existsSync(this.composeFile)) {
      console.error(`Docker compose file not found: ${this.composeFile}`);
      return {
        exitCode: 1,
        out: "",
        err: `Compose file not found: ${this.composeFile}`,
        data: null
      };
    }
    const result = await this.executor.down(this.composeFile, this.composeDir);
    if (result.exitCode !== 0) {
      console.error(`Failed to stop Docker Compose services: ${result.err}`);
      console.error(`Compose file: ${this.composeFile}`);
      console.error(`Working directory: ${this.composeDir}`);
    }
    return result;
  }
  async DC_upOne(serviceName, options) {
    return this.executor.upOne(serviceName, this.composeFile, this.composeDir);
  }
  async DC_ps(options) {
    return this.executor.ps(this.composeFile, this.composeDir);
  }
  async DC_logs(serviceName, options) {
    const tail = options?.tail ?? 100;
    return this.executor.logs(
      serviceName,
      this.composeFile,
      this.composeDir,
      tail,
      options
    );
  }
  mergeOptions(options) {
    const base = {
      cwd: this.composeDir,
      // Use composeDir which is process.cwd()
      config: this.dockerComposeYml,
      // Path to the docker-compose.yml file
      log: true
    };
    const merged = { ...base, ...options };
    return merged;
  }
  getCwd() {
    return this.cwd;
  }
  getConfig() {
    return this.dockerComposeYml;
  }
  // Static methods for direct usage without creating an instance
  static async upAll(options) {
    try {
      const execAsync = promisify(exec);
      const cmd = `docker compose -f "${options.config}" up -d`;
      const { stdout, stderr } = await execAsync(cmd, {
        cwd: options.cwd
      });
      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null
      };
    } catch (error) {
      return {
        exitCode: 1,
        out: "",
        err: `Error starting services: ${error.message}`,
        data: null
      };
    }
  }
  static async down(options) {
    try {
      const execAsync = promisify(exec);
      const cmd = `docker compose -f "${options.config}" down`;
      const { stdout, stderr } = await execAsync(cmd, {
        cwd: options.cwd
      });
      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null
      };
    } catch (error) {
      return {
        exitCode: 1,
        out: "",
        err: `Error stopping services: ${error.message}`,
        data: null
      };
    }
  }
  static async logs(serviceName, options) {
    try {
      const execAsync = promisify(exec);
      const composeCmd = `docker compose -f "${options.config}" logs --no-color --tail=100`;
      const fullCmd = serviceName ? `${composeCmd} ${serviceName}` : composeCmd;
      const { stdout, stderr } = await execAsync(fullCmd, {
        cwd: options.cwd,
        maxBuffer: 10 * 1024 * 1024
      });
      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null
      };
    } catch (error) {
      return {
        exitCode: 1,
        out: "",
        err: `Error getting logs for ${serviceName}: ${error.message}`,
        data: null
      };
    }
  }
  async stop() {
    console.log(`[Server_DockerCompose] stop()...`);
    await this.stopLogCapture();
    const result = await this.DC_down();
    if (result.exitCode !== 0) {
      console.error(`Docker Compose down failed: ${result.err}`);
    }
    console.log(`[Server_DockerCompose] stop() result`, result);
  }
};

// src/server/serverClasees/Server_WS.ts
var Server_WS = class extends Server_DockerCompose {
  constructor(configs, name, mode2) {
    super(configs, name, mode2);
    this.wsClients = /* @__PURE__ */ new Set();
    this.ws = new WebSocketServer({
      noServer: true
    });
    this.setupWebSocketHandlers();
  }
  setupWebSocketHandlers() {
    this.ws.on("connection", (ws, request) => {
      console.log(`[WebSocket] New connection from ${request.socket.remoteAddress}`);
      this.wsClients.add(ws);
      ws.send(JSON.stringify({
        type: "connected",
        message: "Connected to Process Manager WebSocket",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }));
      setTimeout(() => {
        const testEvent = {
          type: "enqueue",
          processId: "test-process-123",
          runtime: "node",
          command: "yarn test example/Calculator.test.ts",
          testName: "Calculator.test",
          testPath: "Calculator.test",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          details: "Test event to verify WebSocket connection"
        };
        ws.send(JSON.stringify(testEvent));
        console.log("[WebSocket] Sent test enqueue event to new client");
      }, 1e3);
      ws.on("message", (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleWebSocketMessage(ws, message);
        } catch (error) {
          console.error("[WebSocket] Error parsing message:", error);
          ws.send(JSON.stringify({
            type: "error",
            message: "Invalid JSON message",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }));
        }
      });
      ws.on("close", () => {
        console.log("[WebSocket] Client disconnected");
        this.wsClients.delete(ws);
      });
      ws.on("error", (error) => {
        console.error("[WebSocket] Error:", error);
        this.wsClients.delete(ws);
      });
    });
    this.ws.on("error", (error) => {
      console.error("[WebSocket] Server error:", error);
    });
    this.ws.on("close", () => {
      console.log("[WebSocket] Server closed");
      this.wsClients.clear();
    });
  }
  // This method is called by Server_HTTP to attach the WebSocket upgrade handler
  attachWebSocketToHttpServer(httpServer) {
    if (!httpServer) {
      console.error("[WebSocket] HTTP server not available for WebSocket attachment");
      return;
    }
    httpServer.on("upgrade", (request, socket, head) => {
      const pathname = new URL(request.url || "", `http://${request.headers.host}`).pathname;
      if (pathname === "/ws") {
        console.log("[WebSocket] Upgrade request for /ws");
        this.ws.handleUpgrade(request, socket, head, (ws) => {
          this.ws.emit("connection", ws, request);
        });
      } else {
        socket.destroy();
      }
    });
    console.log("[HTTP] WebSocket upgrade handler attached");
  }
  handleWebSocketMessage(ws, message) {
    console.log("[WebSocket] Received message:", message.type);
    switch (message.type) {
      case "getProcesses":
        this.handleGetProcesses(ws);
        break;
      case "subscribeToLogs":
        this.handleSubscribeToLogs(ws, message.data);
        break;
      case "getLogs":
        this.handleGetLogs(ws, message.data);
        break;
      case "ping":
        ws.send(JSON.stringify({
          type: "pong",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }));
        break;
      default:
        console.log("[WebSocket] Unknown message type:", message.type);
        ws.send(JSON.stringify({
          type: "error",
          message: `Unknown message type: ${message.type}`,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }));
    }
  }
  handleGetProcesses(ws) {
    const processManager = this;
    if (typeof processManager.getProcessSummary === "function") {
      const summary = processManager.getProcessSummary();
      ws.send(JSON.stringify({
        type: "processes",
        data: summary,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }));
    } else {
      ws.send(JSON.stringify({
        type: "processes",
        data: { processes: [], totalProcesses: 0, running: 0 },
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }));
    }
  }
  handleSubscribeToLogs(ws, data) {
    const { processId } = data || {};
    if (!processId) {
      ws.send(JSON.stringify({
        type: "logSubscription",
        status: "error",
        message: "Missing processId",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }));
      return;
    }
    ws.send(JSON.stringify({
      type: "logSubscription",
      status: "subscribed",
      processId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }));
  }
  handleGetLogs(ws, data) {
    const { processId } = data || {};
    if (!processId) {
      ws.send(JSON.stringify({
        type: "logs",
        status: "error",
        message: "Missing processId",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }));
      return;
    }
    const processManager = this;
    if (typeof processManager.getProcessLogs === "function") {
      const logs = processManager.getProcessLogs(processId);
      ws.send(JSON.stringify({
        type: "logs",
        processId,
        logs: logs.map((log) => {
          let level = "info";
          let source = "process";
          let message = log;
          const match = log.match(/\[(.*?)\] \[(.*?)\] (.*)/);
          if (match) {
            const timestamp = match[1];
            source = match[2];
            message = match[3];
            if (source === "stderr" || source === "error") {
              level = "error";
            } else if (source === "warn") {
              level = "warn";
            } else if (source === "debug") {
              level = "debug";
            } else {
              level = "info";
            }
          }
          return {
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            level,
            message,
            source
          };
        }),
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }));
    } else {
      ws.send(JSON.stringify({
        type: "logs",
        processId,
        logs: [],
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }));
    }
  }
  // Broadcast a message to all connected WebSocket clients
  broadcast(message) {
    const data = typeof message === "string" ? message : JSON.stringify(message);
    console.log(`[WebSocket] Broadcasting to ${this.wsClients.size} clients:`, message.type || message);
    let sentCount = 0;
    this.wsClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
        sentCount++;
      } else {
        console.log(`[WebSocket] Client not open, state: ${client.readyState}`);
      }
    });
    console.log(`[WebSocket] Sent to ${sentCount} clients`);
  }
  async stop() {
    this.wsClients.forEach((client) => {
      client.close();
    });
    this.wsClients.clear();
    this.ws.close(() => {
      console.log("[WebSocket] Server closed");
    });
    await super.stop();
  }
};

// src/server/serverClasees/utils/Server_TCP_utils.ts
import path4 from "path";
function getContentType(filePath) {
  if (filePath.endsWith(".html")) return CONTENT_TYPES.HTML;
  else if (filePath.endsWith(".js") || filePath.endsWith(".mjs"))
    return CONTENT_TYPES.JAVASCRIPT;
  else if (filePath.endsWith(".css")) return CONTENT_TYPES.CSS;
  else if (filePath.endsWith(".json")) return CONTENT_TYPES.JSON;
  else if (filePath.endsWith(".png")) return CONTENT_TYPES.PNG;
  else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg"))
    return CONTENT_TYPES.JPEG;
  else if (filePath.endsWith(".gif")) return CONTENT_TYPES.GIF;
  else if (filePath.endsWith(".svg")) return CONTENT_TYPES.SVG;
  else return CONTENT_TYPES.PLAIN;
}

// src/server/serverClasees/Server_HTTP.ts
var Server_HTTP = class extends Server_WS {
  constructor(configs, name, mode2) {
    super(configs, name, mode2);
    this.httpServer = http.createServer();
    const httpPort = configs.httpPort || Number(process.env.HTTP_PORT) || Number(process.env.WS_PORT) || 3456;
    console.log(
      `[Server_TCP] Starting HTTP server on port ${httpPort}, host ${SERVER_CONSTANTS.HOST}`
    );
    this.httpServer.listen(httpPort, SERVER_CONSTANTS.HOST, () => {
      const addr = this.httpServer.address();
      console.log(
        `[Server_TCP] HTTP server running on http://localhost:${httpPort}`
      );
    });
    const address = this.httpServer.address();
    console.log(`[HTTP] HTTP server address:`, address);
    this.httpServer.on("listening", () => {
      const addr = this.httpServer.address();
      console.log(`[HTTP] HTTP server is now listening on port ${addr.port}`);
    });
    this.httpServer.on("error", (error) => {
      console.error(`[HTTP] HTTP server error:`, error);
    });
    this.httpServer.on("close", () => {
      console.log(`[HTTP] HTTP server closed`);
    });
    this.httpServer.on("request", this.handleHttpRequest.bind(this));
    console.log(`[HTTP] HTTP request handler attached`);
    this.setupWebSocketUpgrade();
  }
  routes(routes) {
    this._routes = routes;
  }
  handleHttpRequest(req, res) {
    if (req.url && req.url.startsWith("/~/")) {
      this.handleRouteRequest(req, res);
    } else {
      this.serveStaticFile(req, res);
    }
  }
  handleRouteRequest(req, res) {
    const urlPath = new URL(req.url, `http://${req.headers.host}`).pathname;
    const routeName = urlPath.slice(3);
    const routes = this._routes;
    if (!routes || !routes[routeName]) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(`<h1>Route not found: /~/${routeName}</h1>`);
      return;
    }
    if (routeName === "process_manager") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Process Manager</title>
            <link href="/dist/prebuild/ProcessManger.css" rel="stylesheet">
            
          </head>
          <body>
            <div id="root"></div>
            <script src="/dist/prebuild/ProcessManagerReactApp.js"></script>
            <script>
              // The bundled script automatically calls initApp when loaded
              // Ensure the root element exists
              if (!document.getElementById('root').innerHTML) {
                document.getElementById('root').innerHTML = '<div class="text-center mt-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Loading Process Manager...</p></div>';
              }
            </script>
          </body>
        </html>
      `);
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${routeName}</title>
        </head>
        <body>
          <div id="root"></div>
          <script>
            document.getElementById('root').innerHTML = '<h1>${routeName}</h1><p>Component not fully implemented.</p>';
          </script>
        </body>
      </html>
    `);
  }
  serveStaticFile(req, res) {
    if (!req.url) {
      res.writeHead(400);
      res.end("Bad Request");
      return;
    }
    const urlPath = new URL(req.url, `http://${req.headers.host}`).pathname;
    const decodedPath = decodeURIComponent(urlPath);
    const relativePath = decodedPath.startsWith("/") ? decodedPath.slice(1) : decodedPath;
    const normalizedPath = path5.normalize(relativePath);
    if (normalizedPath.includes("..")) {
      res.writeHead(403);
      res.end("Forbidden: Directory traversal not allowed");
      return;
    }
    const projectRoot = process.cwd();
    const filePath = path5.join(projectRoot, normalizedPath);
    if (!filePath.startsWith(path5.resolve(projectRoot))) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    fs3.stat(filePath, (err, stats) => {
      if (err) {
        if (err.code === "ENOENT") {
          res.writeHead(404);
          res.end(`File not found: ${urlPath}`);
          return;
        } else {
          res.writeHead(500);
          res.end(`Server Error: ${err.message}`);
          return;
        }
      }
      if (stats.isDirectory()) {
        fs3.readdir(filePath, (readErr, files) => {
          if (readErr) {
            res.writeHead(500);
            res.end(`Server Error: ${readErr.message}`);
            return;
          }
          const items = files.map((file) => {
            try {
              const stat = fs3.statSync(path5.join(filePath, file));
              const isDir = stat.isDirectory();
              const slash = isDir ? "/" : "";
              return `<li><a href="${path5.join(
                urlPath,
                file
              )}${slash}">${file}${slash}</a></li>`;
            } catch {
              return `<li><a href="${path5.join(
                urlPath,
                file
              )}">${file}</a></li>`;
            }
          }).join("");
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(`
            <!DOCTYPE html>
            <html>
            <head><title>Directory listing for ${urlPath}</title></head>
            <body>
              <h1>Directory listing for ${urlPath}</h1>
              <ul>
                ${items}
              </ul>
            </body>
            </html>
          `);
        });
      } else {
        this.serveFile(filePath, res);
      }
    });
  }
  serveFile(filePath, res) {
    const contentType = getContentType(filePath) || CONTENT_TYPES.OCTET_STREAM;
    fs3.readFile(filePath, (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          res.writeHead(404);
          res.end(`File not found: ${filePath}`);
        } else {
          res.writeHead(500);
          res.end(`Server Error: ${err.message}`);
        }
        return;
      }
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  }
  setupWebSocketUpgrade() {
    console.log("[HTTP] Setting up WebSocket upgrade handler");
    if (this.ws) {
      console.log("[HTTP] WebSocket server is available, attaching to HTTP server");
      this.attachWebSocketToHttpServer(this.httpServer);
    } else {
      console.error("[HTTP] WebSocket server not available");
    }
  }
  async stop() {
    if (this.httpServer) {
      this.httpServer.close(() => {
        console.log("HTTP server closed");
      });
    }
    await super.stop();
  }
};

// src/makeHtmlTestFiles.ts
import path6 from "path";
import fs4 from "fs";

// src/web.html.ts
var web_html_default = (jsfilePath, htmlFilePath, cssfilePath) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <script type="module" src="${jsfilePath}"></script>
  <link rel="stylesheet" href="${cssfilePath}">
</head>

<body>
  <div id="root">
  </div>
</body>

</html>
`;

// allTestsUtils.ts
var createLangConfig = (testFile, checks, options) => {
  return {
    plugins: options?.plugins || [],
    loaders: options?.loaders || {},
    tests: { [testFile]: { ports: 0 } },
    externals: options?.externals || [],
    test: options?.testBlocks,
    prod: options?.prodBlocks,
    checks
  };
};

// allTests.ts
var config = {
  featureIngestor: function(s) {
    throw new Error("Function not implemented.");
  },
  importPlugins: [],
  httpPort: 3456,
  chromiumPort: 4567,
  ports: ["3333", "3334"],
  src: "",
  // processPool: {
  //   maxConcurrent: 4,
  //   timeoutMs: 30000,
  // },
  // chrome: {
  //   sharedInstance: true,
  //   maxContexts: 6,
  //   memoryLimitMB: 512,
  // },
  golang: createLangConfig("example/Calculator.golingvu.test.go", [
    (x) => `cd /workspace/example && golangci-lint run ${x.replace("example/", "")}`
  ]),
  python: createLangConfig("example/Calculator.pitono.test.py", [
    (x) => `pylint ${x}`
  ]),
  web: createLangConfig("example/Calculator.test.ts", [
    (x) => `yarn eslint ${x}`,
    (x) => `yarn tsc --noEmit ${x.join(" ")}`
  ]),
  node: createLangConfig("example/Calculator.test.ts", [
    (x) => `yarn eslint ${x}`,
    (x) => `yarn tsc --noEmit ${x.join(" ")}`
  ])
};
var allTests_default = config;

// src/makeHtmlTestFiles.ts
var getSecondaryEndpointsPoints = (runtime) => {
  const runtimeConfig = allTests_default[runtime];
  if (!runtimeConfig || !runtimeConfig.tests) {
    return [];
  }
  return Object.keys(runtimeConfig.tests);
};
var makeHtmlTestFiles = (testsName2) => {
  const webTests = [...getSecondaryEndpointsPoints("web")];
  for (const sourceFilePath of webTests) {
    const sourceFileSplit = sourceFilePath.split("/");
    const sourceDir = sourceFileSplit.slice(0, -1);
    const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
    const sourceFileNameMinusJs = sourceFileName.split(".").slice(0, -1).join(".");
    const htmlFilePath = path6.normalize(
      `${process.cwd()}/testeranto/bundles/${testsName2}/${sourceDir.join(
        "/"
      )}/${sourceFileNameMinusJs}.html`
    );
    const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
    const cssFilePath = `./${sourceFileNameMinusJs}.css`;
    fs4.mkdirSync(path6.dirname(htmlFilePath), { recursive: true });
    fs4.writeFileSync(
      htmlFilePath,
      web_html_default(jsfilePath, htmlFilePath, cssFilePath)
    );
    console.log(`Generated HTML file: ${htmlFilePath}`);
  }
};

// src/makeHtmlReportFile.ts
import path7 from "path";
import fs5 from "fs";

// src/htmlReportLogic.ts
var getSecondaryEndpointsPoints2 = (config2) => {
  const result = [];
  for (const runtime of ["node", "web", "golang", "python"]) {
    const runtimeConfig = config2[runtime];
    if (runtimeConfig && runtimeConfig.tests) {
      const testKeys = Object.keys(runtimeConfig.tests);
      result.push(...testKeys);
    }
  }
  return result;
};
var getApplicableRuntimes = (config2, testPath) => {
  const runtimes2 = [];
  for (const runtime of ["node", "web", "golang", "python"]) {
    const runtimeConfig = config2[runtime];
    if (runtimeConfig && runtimeConfig.tests) {
      if (Object.keys(runtimeConfig.tests).includes(testPath)) {
        runtimes2.push(runtime);
      }
    }
  }
  return runtimes2;
};
var generateHtmlContent = (params) => {
  const {
    sourceFileNameMinusExtension,
    relativeReportCssUrl,
    relativeReportJsUrl,
    runtime,
    sourceFilePath,
    testsName: testsName2
  } = params;
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Report: ${sourceFileNameMinusExtension}</title>

    <link rel="stylesheet" href="${relativeReportCssUrl}" />

    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
        }
        #react-report-root {
            margin: 0 auto;
        }
    </style>
    <script src="${relativeReportJsUrl}"></script>
</head>
<body>
    <div id="react-report-root"></div>
    <script>
        // Wait for the bundled script to load and render the React component
        document.addEventListener('DOMContentLoaded', function() {
            // Check if renderReport function is available
            if (typeof renderReport === 'function') {
                renderReport('react-report-root', {
                    testName: '${sourceFileNameMinusExtension}',
                    runtime: '${runtime}',
                    sourceFilePath: '${sourceFilePath}',
                    testSuite: '${testsName2}'
                });
            } else {
                console.error('renderReport function not found. Make sure Report.js is loaded.');
                // Try again after a short delay
                setTimeout(() => {
                    if (typeof renderReport === 'function') {
                        renderReport('react-report-root', {
                            testName: '${sourceFileNameMinusExtension}',
                            runtime: '${runtime}',
                            sourceFilePath: '${sourceFilePath}',
                            testSuite: '${testsName2}'
                        });
                    } else {
                        console.error('Still unable to find renderReport.');
                    }
                }, 100);
            }
        });
    </script>
</body>
</html>`;
};

// src/makeHtmlReportFile.ts
var makeHtmlReportFile = (testsName2, config2) => {
  const tests = [...getSecondaryEndpointsPoints2(config2)];
  for (const sourceFilePath of tests) {
    const sourceFileSplit = sourceFilePath.split("/");
    const sourceDir = sourceFileSplit.slice(0, -1);
    const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
    const sourceFileNameMinusExtension = sourceFileName.split(".").slice(0, -1).join(".");
    const applicableRuntimes = getApplicableRuntimes(config2, sourceFilePath);
    console.log(
      `Test "${sourceFilePath}" applicable to runtimes: ${applicableRuntimes.join(
        ", "
      )}`
    );
    for (const runtime of applicableRuntimes) {
      const htmlFilePath = path7.normalize(
        `${process.cwd()}/testeranto/reports/${testsName2}/${sourceDir.join(
          "/"
        )}/${sourceFileNameMinusExtension}/${runtime}/index.html`
      );
      fs5.mkdirSync(path7.dirname(htmlFilePath), { recursive: true });
      const htmlDir = path7.dirname(htmlFilePath);
      const reportJsPath = path7.join(
        process.cwd(),
        "dist",
        "prebuild",
        "Report.js"
      );
      const relativeReportJsPath = path7.relative(htmlDir, reportJsPath);
      const relativeReportJsUrl = relativeReportJsPath.split(path7.sep).join("/");
      const reportCssPath = path7.join(
        process.cwd(),
        "dist",
        "prebuild",
        "Report.css"
      );
      const relativeReportCssPath = path7.relative(htmlDir, reportCssPath);
      const relativeReportCssUrl = relativeReportCssPath.split(path7.sep).join("/");
      const htmlContent = generateHtmlContent({
        sourceFileNameMinusExtension,
        relativeReportCssUrl,
        relativeReportJsUrl,
        runtime,
        sourceFilePath,
        testsName: testsName2
      });
      fs5.writeFileSync(htmlFilePath, htmlContent);
      console.log(`Generated HTML file: ${htmlFilePath}`);
    }
  }
};

// src/server/serverClasees/utils/getRunnables.ts
import path8 from "path";
var getRunnables = (config2, projectName) => {
  return {
    // pureEntryPoints: payload.pureEntryPoints || {},
    golangEntryPoints: Object.entries(config2.golang.tests).reduce((pt, cv) => {
      pt[cv[0]] = path8.resolve(cv[0]);
      return pt;
    }, {}),
    // golangEntryPointSidecars: payload.golangEntryPointSidecars || {},
    nodeEntryPoints: Object.entries(config2.node.tests).reduce((pt, cv) => {
      pt[cv[0]] = path8.resolve(
        `./testeranto/bundles/${projectName}/node/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
      return pt;
    }, {}),
    // nodeEntryPointSidecars: payload.nodeEntryPointSidecars || {},
    pythonEntryPoints: Object.entries(config2.python.tests).reduce((pt, cv) => {
      pt[cv[0]] = path8.resolve(cv[0]);
      return pt;
    }, {}),
    // pythonEntryPointSidecars: payload.pythonEntryPointSidecars || {},
    webEntryPoints: Object.entries(config2.web.tests).reduce((pt, cv) => {
      pt[cv[0]] = path8.resolve(
        `./testeranto/bundles/${projectName}/web/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
      return pt;
    }, {})
    // webEntryPointSidecars: payload.webEntryPointSidecars || {},
  };
};

// src/server/serverClasees/utils/Server_FS.ts
var getBaseHtml = (title) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="description" content="Webpage description goes here" />
  <meta charset="utf-8" />
  <title>${title} - testeranto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="author" content="" />


`;
var ProcessMangerHtml = () => `
  ${getBaseHtml("Testeranto")}
  
  <link rel="stylesheet" href="ProcessManger.css" />
  <script src="ProcessManger.js"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;
var IndexHtml = () => `
  ${getBaseHtml("Testeranto")}
  
  <link rel="stylesheet" href="Index.css" />
  <script src="Index.js"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;

// src/server/serverClasees/Server_FS.ts
var Server_FS = class extends Server_HTTP {
  constructor(configs, testName, mode2) {
    super(configs, testName, mode2);
    this.summary = {};
    this.currentBuildResolve = null;
    this.currentBuildReject = null;
    this.writeBigBoard = () => {
      const summaryPath = `./testeranto/reports/${this.projectName}/summary.json`;
      const summaryData = JSON.stringify(this.summary, null, 2);
      fs6.writeFileSync(summaryPath, summaryData);
    };
    fs6.writeFileSync(
      path9.join(process.cwd(), "testeranto", `${testName}.json`),
      JSON.stringify(configs, null, 2)
    );
    if (!fs6.existsSync(`testeranto/reports/${testName}`)) {
      fs6.mkdirSync(`testeranto/reports/${testName}`);
    }
    fs6.writeFileSync(
      `testeranto/reports/${testName}/config.json`,
      JSON.stringify(configs, null, 2)
    );
    makeHtmlTestFiles(testName);
    makeHtmlReportFile(testName, configs);
    const {
      nodeEntryPoints,
      webEntryPoints,
      pythonEntryPoints,
      golangEntryPoints
    } = getRunnables(configs, testName);
    [
      ["node", Object.keys(nodeEntryPoints)],
      ["web", Object.keys(webEntryPoints)],
      ["python", Object.keys(pythonEntryPoints)],
      ["golang", Object.keys(golangEntryPoints)]
    ].forEach(async ([runtime, keys]) => {
      keys.forEach(async (k) => {
        fs6.mkdirSync(
          `testeranto/reports/${testName}/${k.split(".").slice(0, -1).join(".")}/${runtime}`,
          { recursive: true }
        );
      });
    });
    setupFileSystem(configs, testName);
    if (!fs6.existsSync(`testeranto/reports/${this.projectName}`)) {
      fs6.mkdirSync(`testeranto/reports/${this.projectName}`);
    }
  }
  ensureSummaryEntry(src, isSidecar = false) {
    if (!this.summary[src]) {
      this.summary[src] = {
        runTimeTests: void 0,
        runTimeErrors: void 0,
        typeErrors: void 0,
        staticErrors: void 0,
        prompt: void 0,
        failingFeatures: void 0
      };
    }
    return this.summary[src];
  }
  getSummary() {
    return this.summary;
  }
  setSummary(summary) {
    this.summary = summary;
  }
  updateSummaryEntry(src, updates) {
    if (!this.summary[src]) {
      this.ensureSummaryEntry(src);
    }
    this.summary[src] = { ...this.summary[src], ...updates };
  }
  async stop() {
    await super.stop();
  }
};
function setupFileSystem(config2, testsName2) {
  fs6.writeFileSync(
    `${process.cwd()}/testeranto/ProcessManger.html`,
    ProcessMangerHtml()
  );
  fs6.writeFileSync(`${process.cwd()}/testeranto/index.html`, IndexHtml());
  if (!fs6.existsSync(`testeranto/reports/${testsName2}`)) {
    fs6.mkdirSync(`testeranto/reports/${testsName2}`, { recursive: true });
  }
  fs6.writeFileSync(
    `testeranto/reports/${testsName2}/config.json`,
    JSON.stringify(config2, null, 2)
  );
}

// src/server/serverClasees/Server_ProcessManager.ts
var Server_ProcessManager = class extends Server_FS {
  constructor(configs, testName, mode2) {
    super(configs, testName, mode2);
    this.ports = {};
    this.logStreams = {};
    this.allProcesses = /* @__PURE__ */ new Map();
    this.processLogs = /* @__PURE__ */ new Map();
    this.runningProcesses = /* @__PURE__ */ new Map();
    this.aiderProcesses = /* @__PURE__ */ new Map();
    // Store actual aider processes
    // Track queued items for monitoring
    this.queuedItems = [];
    // Get process summary for monitoring
    this.getProcessSummary = () => {
      const processes = [];
      console.log(`[ProcessManager] All process IDs:`, Array.from(this.allProcesses.keys()));
      for (const [id, info] of this.allProcesses.entries()) {
        if (!id) {
          console.warn(`[ProcessManager] Found process with undefined ID, info:`, info);
          continue;
        }
        processes.push({
          id,
          command: info.command,
          status: info.status,
          type: info.type,
          category: info.category,
          testName: info.testName,
          platform: info.platform,
          timestamp: info.timestamp,
          exitCode: info.exitCode,
          error: info.error,
          logs: this.getProcessLogs(id).slice(-10)
          // Last 10 logs
        });
      }
      return {
        totalProcesses: this.allProcesses.size,
        running: Array.from(this.allProcesses.values()).filter(
          (p) => p.status === "running"
        ).length,
        completed: Array.from(this.allProcesses.values()).filter(
          (p) => p.status === "completed"
        ).length,
        errors: Array.from(this.allProcesses.values()).filter(
          (p) => p.status === "error"
        ).length,
        processes,
        queueLength: this.jobQueue ? this.jobQueue.length : 0,
        queuedItems: this.queuedItems
      };
    };
    // Get logs for a process
    this.getProcessLogs = (processId) => {
      return this.processLogs.get(processId) || [];
    };
    // Add log entry from any source
    this.addLogEntry = (processId, source, message, timestamp = /* @__PURE__ */ new Date(), level) => {
      if (!this.processLogs.has(processId)) {
        this.processLogs.set(processId, []);
      }
      let logLevel = level;
      if (!logLevel) {
        switch (source) {
          case "stderr":
          case "error":
            logLevel = "error";
            break;
          case "stdout":
            logLevel = "info";
            break;
          default:
            logLevel = "info";
        }
      }
      const logEntry = `[${timestamp.toISOString()}] [${source}] ${message}`;
      this.processLogs.get(processId).push(logEntry);
      this.writeToProcessLogFile(processId, source, message, timestamp);
      if (this.logSubscriptions) {
        const subscriptions = this.logSubscriptions.get(processId);
        if (subscriptions) {
          const logMessage = {
            type: "logEntry",
            processId,
            source,
            level: logLevel,
            message,
            timestamp: timestamp.toISOString()
          };
          subscriptions.forEach((client) => {
            if (client.readyState === 1) {
              client.send(JSON.stringify(logMessage));
            }
          });
        }
      }
    };
    // Execute a command and track it as a process
    this.executeCommand = async (processId, command, category, testName, platform, options) => {
      console.log(`[ProcessManager] ${processId} ${command}`);
      if (!processId || typeof processId !== "string") {
        console.error(`[ProcessManager] Invalid processId: ${processId}. Generating fallback ID.`);
        processId = `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }
      const { exec: exec2 } = await import("child_process");
      const { promisify: promisify2 } = await import("util");
      const execAsync = promisify2(exec2);
      this.addLogEntry(processId, "stdout", `Starting command: ${command}`, /* @__PURE__ */ new Date(), "info");
      const originalPromise = execAsync(command, {
        ...options,
        maxBuffer: 10 * 1024 * 1024
        // 10MB buffer for large outputs
      }).then(({ stdout, stderr }) => {
        return { stdout, stderr };
      }).catch((error) => {
        error.stdout = error.stdout || "";
        error.stderr = error.stderr || "";
        throw error;
      });
      const safePromise = this.addPromiseProcessAndGetSafePromise(
        processId,
        originalPromise,
        command,
        category,
        testName,
        platform
      );
      return safePromise;
    };
    // Helper method to add promise process and get the safe promise
    this.addPromiseProcessAndGetSafePromise = (processId, promise, command, category, testName, platform) => {
      if (!processId || typeof processId !== "string") {
        console.error(`[ProcessManager] Invalid processId in addPromiseProcessAndGetSafePromise: ${processId}`);
        processId = `invalid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }
      const safePromise = new Promise(async (resolve) => {
        try {
          const result = await promise;
          resolve({
            success: true,
            stdout: result?.stdout,
            stderr: result?.stderr
          });
        } catch (error) {
          console.log(
            `[Process ${processId}] Non-critical error:`,
            error.message
          );
          const stdout = error.stdout || error.output?.[1] || error.message;
          const stderr = error.stderr || error.output?.[2] || error.stack;
          resolve({ success: false, error, stdout, stderr });
        }
      });
      const processInfo = {
        promise: safePromise,
        status: "running",
        command,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        type: "promise",
        category,
        testName,
        platform: platform || "node"
      };
      this.allProcesses.set(processId, processInfo);
      this.runningProcesses.set(processId, safePromise);
      safePromise.then(({ success, error, stdout, stderr }) => {
        const info = this.allProcesses.get(processId);
        if (info) {
          info.status = "completed";
          info.exitCode = success ? 0 : 1;
          let errorMessage = "";
          if (error) {
            errorMessage = error.message || String(error);
          }
          const details = [];
          if (stdout) details.push(`stdout: ${stdout}`);
          if (stderr) details.push(`stderr: ${stderr}`);
          if (details.length > 0) {
            info.error = `${errorMessage}
${details.join("\n")}`;
          } else if (errorMessage) {
            info.error = errorMessage;
          }
        }
        this.runningProcesses.delete(processId);
        if (stdout) {
          this.addLogEntry(processId, "stdout", stdout, /* @__PURE__ */ new Date(), "info");
        }
        if (stderr) {
          this.addLogEntry(processId, "stderr", stderr, /* @__PURE__ */ new Date(), "error");
        }
        const message = success ? `Process ${processId} completed successfully` : `Process ${processId} completed with non-critical error`;
        this.addLogEntry(processId, success ? "stdout" : "stderr", message, /* @__PURE__ */ new Date(), success ? "info" : "warn");
      }).catch((error) => {
        const info = this.allProcesses.get(processId);
        if (info) {
          info.status = "completed";
          info.exitCode = 1;
          info.error = error?.message || String(error);
        }
        this.runningProcesses.delete(processId);
        this.addLogEntry(
          processId,
          "stderr",
          `Process ${processId} completed with unexpected error: ${error?.message || String(error)}`,
          /* @__PURE__ */ new Date(),
          "error"
        );
      });
      return safePromise;
    };
    // Create aider process for a specific test as a background command
    this.createAiderProcess = async (runtime, testPath, metafile) => {
      const processId = `allTests-${runtime}-${testPath}-aider`;
      console.log(`[ProcessManager] Creating aider Docker container: ${processId}`);
      const imageReady = await this.ensureAiderImage();
      if (!imageReady) {
        console.error("[ProcessManager] Cannot create aider container: base image not available");
        this.addLogEntry(processId, "error", "Failed to build aider base image", /* @__PURE__ */ new Date(), "error");
        return;
      }
      const contextFiles = [];
      if (metafile.metafile && metafile.metafile.inputs) {
        const inputs = metafile.metafile.inputs;
        if (inputs instanceof Map) {
          contextFiles.push(...Array.from(inputs.keys()));
        } else if (typeof inputs === "object") {
          contextFiles.push(...Object.keys(inputs));
        }
      }
      const sourceFiles = contextFiles.filter(
        (file) => file.endsWith(".ts") || file.endsWith(".js") || file.endsWith(".py") || file.endsWith(".go")
      ).slice(0, 10);
      const containerName = `aider-${runtime}-${testPath.replace(/[^a-zA-Z0-9]/g, "-")}`;
      const checkRunningCmd = `docker ps --filter "name=${containerName}" --filter "status=running" --format "{{.Names}}"`;
      const checkRunningResult = await this.executeCommand(
        `${processId}-check-running`,
        checkRunningCmd,
        "aider",
        testPath,
        runtime
      );
      if (checkRunningResult.success && checkRunningResult.stdout && checkRunningResult.stdout.trim() === containerName) {
        console.log(`[ProcessManager] Aider container ${containerName} is already running, skipping creation`);
        this.addLogEntry(processId, "stdout", `Aider Docker container already running: ${containerName}`, /* @__PURE__ */ new Date(), "info");
        const processInfo2 = {
          promise: Promise.resolve({ stdout: "", stderr: "" }),
          status: "running",
          command: "docker container already running",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          type: "docker",
          category: "aider",
          testName: testPath,
          platform: runtime,
          containerName
        };
        this.allProcesses.set(processId, processInfo2);
        this.aiderProcesses.set(processId, { containerName });
        return;
      }
      const checkAllCmd = `docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`;
      const checkAllResult = await this.executeCommand(
        `${processId}-check-all`,
        checkAllCmd,
        "aider",
        testPath,
        runtime
      );
      if (checkAllResult.success && checkAllResult.stdout && checkAllResult.stdout.trim() === containerName) {
        console.log(`[ProcessManager] Container ${containerName} exists but is not running, removing...`);
        const removeResult = await this.executeCommand(
          `${processId}-remove`,
          `docker rm -f ${containerName}`,
          "aider",
          testPath,
          runtime
        );
        if (!removeResult.success) {
          console.error(`[ProcessManager] Failed to remove existing container ${containerName}:`, removeResult.error);
        } else {
          console.log(`[ProcessManager] Removed existing container ${containerName}`);
        }
      }
      const apiKeys = this.loadAiderApiKeys();
      const envVars = Object.entries(apiKeys).map(([key, value]) => `-e ${key}=${value}`);
      const dockerArgs = [
        "docker",
        "run",
        "-d",
        // Run in detached mode
        "--name",
        containerName,
        "-v",
        `${process.cwd()}:/workspace`,
        // Mount the current directory
        "-w",
        "/workspace",
        // Set working directory
        "--network",
        "allTests_network",
        // Use the same network as other services
        ...envVars,
        // Add API key environment variables
        "testeranto-aider:latest",
        // Pass source files to aider
        ...sourceFiles.slice(0, 5)
        // Limit to first 5 files to avoid command line being too long
      ];
      const command = dockerArgs.join(" ");
      const result = await this.executeCommand(
        processId,
        command,
        "aider",
        testPath,
        runtime
      );
      const processInfo = {
        promise: Promise.resolve({ stdout: "", stderr: "" }),
        status: "running",
        command,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        type: "docker",
        category: "aider",
        testName: testPath,
        platform: runtime,
        containerName
      };
      this.allProcesses.set(processId, processInfo);
      this.aiderProcesses.set(processId, { containerName });
      if (result.success) {
        this.addLogEntry(processId, "stdout", `Aider Docker container started: ${containerName}`, /* @__PURE__ */ new Date(), "info");
        console.log(`[ProcessManager] Aider Docker container ${containerName} started`);
        setTimeout(async () => {
          const logResult = await this.executeCommand(
            `${processId}-logs`,
            `docker logs ${containerName}`,
            "aider",
            testPath,
            runtime
          );
        }, 2e3);
      } else {
        this.addLogEntry(processId, "error", `Failed to start aider Docker container: ${result.error}`, /* @__PURE__ */ new Date(), "error");
        console.error(`[ProcessManager] Failed to start aider Docker container:`, result.error);
      }
      const connectionInfo = `To connect to this aider session, use: docker exec -it ${containerName} /bin/bash`;
      this.addLogEntry(processId, "stdout", connectionInfo, /* @__PURE__ */ new Date(), "info");
      const vscodeCommand = `docker exec -it ${containerName} bash -c "aider --yes --dark-mode ${sourceFiles.join(" ")}"`;
      this.addLogEntry(processId, "stdout", `VS Code terminal command: ${vscodeCommand}`, /* @__PURE__ */ new Date(), "info");
    };
    // Add promise process tracking
    this.addPromiseProcess = (processId, promise, command, category, testName, platform) => {
      const actualPromise = promise || Promise.resolve({ stdout: "", stderr: "" });
      this.addPromiseProcessAndGetSafePromise(
        processId,
        actualPromise,
        command,
        category,
        testName,
        platform
      );
    };
    this.checkForShutdown = async () => {
      console.log(
        ansiC.inverse(
          `The following jobs are awaiting resources: ${JSON.stringify(
            this.getAllQueueItems()
          )}`
        )
      );
      this.writeBigBoard();
      const summary = this.getSummary();
      const hasRunningProcesses = this.runningProcesses.size > 0;
      const queueLength = this.jobQueue ? this.jobQueue.length : 0;
      if (this.shouldShutdown(summary, queueLength, hasRunningProcesses, this.mode)) {
        console.log(
          ansiC.inverse(`${this.projectName} has been tested. Goodbye.`)
        );
      }
    };
    this.configs = configs;
    this.projectName = testName;
    this.jobQueue = new Queue();
    this.jobQueue.autostart = true;
    this.jobQueue.concurrency = 1;
    if (configs.ports && Array.isArray(configs.ports)) {
      configs.ports.forEach((port) => {
        this.ports[port] = "";
      });
    }
    this.routes({});
  }
  routes(routes) {
    super.routes({
      process_manager: {},
      ...routes
    });
  }
  async stop() {
    for (const [processId, aiderProcess] of this.aiderProcesses.entries()) {
      try {
        this.addLogEntry(processId, "stdout", `Stopping aider process ${processId}`, /* @__PURE__ */ new Date(), "info");
        aiderProcess.kill("SIGTERM");
        setTimeout(() => {
          if (!aiderProcess.killed) {
            aiderProcess.kill("SIGKILL");
          }
        }, 2e3);
      } catch (error) {
        console.error(`[ProcessManager] Failed to stop aider process ${processId}:`, error);
      }
    }
    this.aiderProcesses.clear();
    if (this.jobQueue) {
      this.jobQueue.end();
      this.jobQueue.stop();
    }
    Object.values(this.logStreams || {}).forEach((logs) => logs.closeAll());
    await super.stop();
  }
  writeToProcessLogFile(processId, source, message, timestamp) {
    const logDir = path10.join(
      process.cwd(),
      "testeranto",
      "reports",
      this.projectName,
      "docker-process-logs"
    );
    if (!fs7.existsSync(logDir)) {
      fs7.mkdirSync(logDir, { recursive: true });
    }
    const logFile = path10.join(logDir, `${processId}.log`);
    const logEntry = `[${timestamp.toISOString()}] [${source}] ${message}
`;
    fs7.appendFileSync(logFile, logEntry);
  }
  // Port management methods
  allocatePorts(numPorts, testName) {
    const openPorts = Object.entries(this.ports).filter(([, status]) => status === "").map(([port]) => parseInt(port));
    if (openPorts.length >= numPorts) {
      const allocatedPorts = openPorts.slice(0, numPorts);
      allocatedPorts.forEach((port) => {
        this.ports[port] = testName;
      });
      return allocatedPorts;
    }
    return null;
  }
  releasePorts(ports) {
    ports.forEach((port) => {
      this.ports[port] = "";
    });
  }
  getPortStatus() {
    return { ...this.ports };
  }
  isPortAvailable(port) {
    return this.ports[port] === "";
  }
  getPortOwner(port) {
    return this.ports[port] || null;
  }
  // Load aider API keys from .aider.conf.yml
  loadAiderApiKeys() {
    try {
      const configPath = path10.join(process.cwd(), ".aider.conf.yml");
      if (!fs7.existsSync(configPath)) {
        console.log("[ProcessManager] No .aider.conf.yml file found");
        return {};
      }
      const yaml2 = __require("js-yaml");
      const config2 = yaml2.load(fs7.readFileSync(configPath, "utf8"));
      const apiKeys = {};
      if (config2["openai-api-key"]) {
        apiKeys["OPENAI_API_KEY"] = config2["openai-api-key"];
      }
      if (config2["anthropic-api-key"]) {
        apiKeys["ANTHROPIC_API_KEY"] = config2["anthropic-api-key"];
      }
      if (config2["api-key"]) {
        if (Array.isArray(config2["api-key"])) {
          config2["api-key"].forEach((key, index) => {
            apiKeys[`API_KEY_${index}`] = key;
          });
        } else {
          apiKeys["API_KEY"] = config2["api-key"];
        }
      }
      console.log("[ProcessManager] Loaded API keys from .aider.conf.yml");
      return apiKeys;
    } catch (error) {
      console.error("[ProcessManager] Failed to load API keys from .aider.conf.yml:", error);
      return {};
    }
  }
  // Build the aider base image if not already built
  async ensureAiderImage() {
    const imageName = "testeranto-aider:latest";
    const checkImageCmd = `docker images -q ${imageName}`;
    const checkResult = await this.executeCommand(
      "aider-image-check",
      checkImageCmd,
      "aider",
      "image-check",
      "node"
    );
    if (checkResult.success && checkResult.stdout && checkResult.stdout.trim() !== "") {
      console.log("[ProcessManager] Aider base image already exists");
      return true;
    }
    console.log("[ProcessManager] Building aider base image...");
    const dockerfileContent = [
      "FROM python:3.11-slim",
      "WORKDIR /workspace",
      "RUN pip install --no-cache-dir aider-chat",
      "# Create a non-root user for security",
      "RUN useradd -m -u 1000 aider && chown -R aider:aider /workspace",
      "USER aider",
      "# Default command starts aider in interactive mode",
      'CMD ["aider", "--yes", "--dark-mode"]'
    ].join("\n");
    const tempDir = path10.join(process.cwd(), "testeranto", "temp");
    if (!fs7.existsSync(tempDir)) {
      fs7.mkdirSync(tempDir, { recursive: true });
    }
    const dockerfilePath = path10.join(tempDir, "Dockerfile.aider");
    fs7.writeFileSync(dockerfilePath, dockerfileContent);
    const buildCmd = `docker build -t ${imageName} -f ${dockerfilePath} ${tempDir}`;
    const buildResult = await this.executeCommand(
      "aider-image-build",
      buildCmd,
      "aider",
      "image-build",
      "node"
    );
    if (buildResult.success) {
      console.log("[ProcessManager] Aider base image built successfully");
      return true;
    } else {
      console.error("[ProcessManager] Failed to build aider base image:", buildResult.error);
      return false;
    }
  }
  async scheduleBddTest(metafile, runtime, entrypoint) {
    console.log(
      `[ProcessManager] Scheduling BDD test for ${entrypoint} (${runtime})`
    );
    if (!entrypoint || typeof entrypoint !== "string") {
      console.error(`[ProcessManager] Invalid entrypoint: ${entrypoint}`);
      return;
    }
    const testPath = entrypoint.replace(/\.[^/.]+$/, "").replace(/^example\//, "");
    if (!testPath || testPath.trim() === "") {
      console.error(`[ProcessManager] Invalid testPath derived from entrypoint: ${entrypoint}`);
      return;
    }
    await this.createAiderProcess(runtime, testPath, metafile);
    const processId = `allTests-${runtime}-${testPath}-bdd`;
    console.log(`[ProcessManager] BDD process ID: ${processId}`);
    const command = `yarn tsx ${entrypoint}`;
    const result = await this.executeCommand(
      processId,
      command,
      "bdd-test",
      testPath,
      runtime
    );
    if (!result.success) {
      console.log(`[ProcessManager] BDD test ${processId} failed:`, result.error?.message);
    }
  }
  async scheduleStaticTests(metafile, runtime, entrypoint, addableFiles) {
    console.log(
      `[ProcessManager] Scheduling Static test for ${entrypoint} (${runtime})`
    );
    if (!entrypoint || typeof entrypoint !== "string") {
      console.error(`[ProcessManager] Invalid entrypoint: ${entrypoint}`);
      return;
    }
    const testPath = entrypoint.replace(/\.[^/.]+$/, "").replace(/^example\//, "");
    if (!testPath || testPath.trim() === "") {
      console.error(`[ProcessManager] Invalid testPath derived from entrypoint: ${entrypoint}`);
      return;
    }
    if (!this.configs[runtime] || !Array.isArray(this.configs[runtime].checks)) {
      console.error(`[ProcessManager] No checks configured for runtime: ${runtime}`);
      return;
    }
    let checkIndex = 0;
    for (const check of this.configs[runtime].checks) {
      const processId = `allTests-${runtime}-${testPath}-${checkIndex}`;
      console.log(`[ProcessManager] Static process ID: ${processId}`);
      const command = `${check(addableFiles)}`;
      const result = await this.executeCommand(
        processId,
        command,
        "build-time",
        testPath,
        runtime
      );
      if (!result.success) {
        console.log(`[ProcessManager] Static test ${processId} failed:`, result.error?.message);
      }
      checkIndex++;
    }
  }
  shouldShutdown(summary, queueLength, hasRunningProcesses, mode2) {
    if (mode2 === "dev") return false;
    const inflight = Object.keys(summary).some(
      (k) => summary[k].prompt === "?" || summary[k].runTimeErrors === "?" || summary[k].staticErrors === "?" || summary[k].typeErrors === "?"
    );
    return !inflight && !hasRunningProcesses && queueLength === 0;
  }
  async enqueue(runtime, command, addableFiles = []) {
    let testName = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const match = command.match(/example\/([^.\s]+)/);
    if (match) {
      testName = match[1];
    }
    const testPath = testName;
    const processId = `allTests-${runtime}-${testPath}-job`;
    this.broadcast({
      type: "enqueue",
      processId,
      runtime,
      command,
      testName,
      testPath,
      addableFiles,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      queueLength: this.jobQueue.length + 1
      // +1 because we're about to add this job
    });
    const job = async () => {
      console.log(
        ansiC.blue(
          ansiC.inverse(`Processing ${processId} (${runtime}) from queue`)
        )
      );
      this.broadcast({
        type: "dequeue",
        processId,
        runtime,
        command,
        testName,
        testPath,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        details: "Started processing job from queue"
      });
      try {
        await this.executeCommand(
          processId,
          command,
          "bdd-test",
          testName,
          runtime
        );
      } catch (error) {
        console.error(
          ansiC.red(`Error executing test ${processId} (${runtime}): ${error}`)
        );
      }
      this.queuedItems = this.queuedItems.filter(
        (item) => item.testName !== testName
      );
      this.writeBigBoard();
      this.checkForShutdown();
    };
    this.jobQueue.push(job);
    this.queuedItems.push({
      testName,
      runtime,
      addableFiles,
      command
    });
    console.log(
      `[Queue] Added job ${processId} to queue. Queue length: ${this.jobQueue.length}`
    );
  }
  async checkQueue(processQueueItem, writeBigBoard, checkForShutdown) {
    if (this.jobQueue && !this.jobQueue.running) {
      this.jobQueue.start();
    }
    writeBigBoard();
    if (this.jobQueue && this.jobQueue.length === 0 && this.runningProcesses.size === 0) {
      checkForShutdown();
    }
  }
  // Remove and return the last item from the queue
  pop() {
    const item = this.queuedItems.pop();
    if (item) {
      console.warn(
        `[Queue] Item ${item.testName} marked as popped, but may still be in queue`
      );
    }
    return item;
  }
  // Check if a test is in the queue
  includes(testName, runtime) {
    if (runtime !== void 0) {
      return this.queuedItems.some(
        (item) => item.testName === testName && item.runtime === runtime
      );
    }
    return this.queuedItems.some((item) => item.testName === testName);
  }
  // Get the current queue length
  get queueLength() {
    return this.jobQueue ? this.jobQueue.length : 0;
  }
  // Clear the entire queue
  clearQueue() {
    if (this.jobQueue) {
      this.jobQueue.end();
      this.jobQueue.stop();
    }
    this.jobQueue = new Queue();
    this.jobQueue.autostart = true;
    this.jobQueue.concurrency = 1;
    this.queuedItems = [];
  }
  // Get all items in the queue
  getAllQueueItems() {
    return [...this.queuedItems];
  }
};

// src/server/serverClasees/Server_MetafileWatcher.ts
var metafiles = [
  "testeranto/metafiles/golang/allTests.json",
  "testeranto/metafiles/node/allTests.json",
  "testeranto/metafiles/python/allTests.json",
  "testeranto/metafiles/web/allTests.json"
];
var Server_MetafileWatcher = class extends Server_ProcessManager {
  constructor(configs, testName, mode2) {
    super(configs, testName, mode2);
    this.watchers = [];
    this.metafilePaths = [];
    this.lastProcessed = /* @__PURE__ */ new Map();
    this.initializeMetafilePaths();
  }
  initializeMetafilePaths() {
    const baseDir = process.cwd();
    this.metafilePaths = metafiles.map((file) => path11.join(baseDir, file));
    if (this.configs.src) {
      const srcDir = this.configs.src;
      const runtimes2 = ["golang", "node", "python", "web"];
      runtimes2.forEach((runtime) => {
        const metafilePath = path11.join(
          baseDir,
          srcDir,
          "testeranto",
          "metafiles",
          runtime,
          "allTests.json"
        );
        if (!this.metafilePaths.includes(metafilePath)) {
          this.metafilePaths.push(metafilePath);
        }
      });
    }
  }
  // async start() {
  //   this.startWatchingMetafiles();
  // }
  async start() {
    console.log(ansiC2.blue(ansiC2.inverse("Starting metafile watchers...")));
    const existingMetafiles = this.metafilePaths.filter((file) => {
      const exists = fs8.existsSync(file);
      if (!exists) {
        console.log(
          ansiC2.yellow(
            `Metafile does not exist, will watch when created: ${file}`
          )
        );
      }
      return exists;
    });
    if (existingMetafiles.length === 0) {
      console.log(
        ansiC2.yellow(
          "No existing metafiles found to watch. Will watch for creation."
        )
      );
    }
    const watchDirs = [
      path11.join(process.cwd(), "testeranto", "metafiles"),
      ...this.configs.src ? [
        path11.join(
          process.cwd(),
          this.configs.src,
          "testeranto",
          "metafiles"
        )
      ] : []
    ].filter((dir) => fs8.existsSync(dir));
    if (watchDirs.length === 0) {
      console.log(ansiC2.yellow("No metafile directories found to watch."));
      return;
    }
    watchDirs.forEach((dir) => {
      console.log(ansiC2.blue(`Watching directory: ${dir}`));
      const watcher = chokidar.watch(dir, {
        persistent: true,
        ignoreInitial: true,
        depth: 2,
        awaitWriteFinish: {
          stabilityThreshold: 1e3,
          pollInterval: 100
        }
      });
      watcher.on("add", (filePath) => this.handleMetafileChange("add", filePath)).on(
        "change",
        (filePath) => this.handleMetafileChange("change", filePath)
      ).on(
        "unlink",
        (filePath) => this.handleMetafileChange("unlink", filePath)
      ).on(
        "error",
        (error) => console.error(ansiC2.red(`Watcher error: ${error}`))
      );
      this.watchers.push(watcher);
    });
    existingMetafiles.forEach((metafile) => {
      const dir = path11.dirname(metafile);
      const watcher = chokidar.watch(metafile, {
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: {
          stabilityThreshold: 1e3,
          pollInterval: 100
        }
      });
      watcher.on(
        "change",
        (filePath) => this.handleMetafileChange("change", filePath)
      ).on(
        "unlink",
        (filePath) => this.handleMetafileChange("unlink", filePath)
      ).on(
        "error",
        (error) => console.error(ansiC2.red(`Metafile watcher error: ${error}`))
      );
      this.watchers.push(watcher);
      console.log(ansiC2.blue(`Watching metafile: ${metafile}`));
    });
    console.log(
      ansiC2.green(
        ansiC2.inverse(`Started ${this.watchers.length} metafile watchers`)
      )
    );
  }
  handleMetafileChange(event, filePath) {
    if (!filePath.endsWith(".json") || !filePath.includes("metafiles")) {
      return;
    }
    const isMetafile = this.metafilePaths.some(
      (metafile) => path11.resolve(metafile) === path11.resolve(filePath) || filePath.includes("allTests.json")
    );
    if (!isMetafile) {
      return;
    }
    const now = Date.now();
    const lastProcessed = this.lastProcessed.get(filePath) || 0;
    if (now - lastProcessed < 1e3) {
      return;
    }
    this.lastProcessed.set(filePath, now);
    console.log(ansiC2.cyan(`Metafile ${event}: ${filePath}`));
    switch (event) {
      case "add":
      case "change":
        this.processMetafileUpdate(filePath);
        break;
      case "unlink":
        console.log(ansiC2.yellow(`Metafile removed: ${filePath}`));
        break;
    }
  }
  processMetafileUpdate(metaFileSourcePath) {
    try {
      if (!fs8.existsSync(metaFileSourcePath)) {
        console.log(
          ansiC2.yellow(`Metafile doesn't exist: ${metaFileSourcePath}`)
        );
        return;
      }
      const data = fs8.readFileSync(metaFileSourcePath, "utf8");
      const parsed = JSON.parse(data);
      console.log(ansiC2.cyan(`Parsed metafile keys: ${Object.keys(parsed).join(", ")}`));
      let metafileData = parsed;
      if (parsed.metafile) {
        metafileData = parsed.metafile;
      }
      const metafile = {
        errors: parsed.errors || [],
        warnings: parsed.warnings || [],
        metafile: {
          inputs: /* @__PURE__ */ new Map(),
          outputs: /* @__PURE__ */ new Map()
        }
      };
      if (metafileData.inputs) {
        if (metafileData.inputs instanceof Map) {
          metafile.metafile.inputs = metafileData.inputs;
        } else if (typeof metafileData.inputs === "object") {
          const inputsMap = /* @__PURE__ */ new Map();
          for (const [key, value] of Object.entries(metafileData.inputs)) {
            inputsMap.set(key, value);
          }
          metafile.metafile.inputs = inputsMap;
        }
      }
      if (metafileData.outputs) {
        if (metafileData.outputs instanceof Map) {
          metafile.metafile.outputs = metafileData.outputs;
        } else if (typeof metafileData.outputs === "object") {
          const outputsMap = /* @__PURE__ */ new Map();
          for (const [key, value] of Object.entries(metafileData.outputs)) {
            outputsMap.set(key, value);
          }
          metafile.metafile.outputs = outputsMap;
        }
      }
      console.log(ansiC2.green(`Metafile processed: ${metaFileSourcePath}`));
      console.log(ansiC2.cyan(`Inputs count: ${metafile.metafile.inputs.size}`));
      console.log(ansiC2.cyan(`Outputs count: ${metafile.metafile.outputs.size}`));
      const runtime = this.extractRuntimeFromPath(metaFileSourcePath);
      this.scheduleTestsFromMetafile(metafile, runtime);
    } catch (error) {
      console.error(
        ansiC2.red(`Error processing metafile ${metaFileSourcePath}:`),
        error
      );
    }
  }
  extractRuntimeFromPath(filePath) {
    const pathParts = filePath.split(path11.sep);
    const metafilesIndex = pathParts.indexOf("metafiles");
    if (metafilesIndex !== -1 && metafilesIndex + 1 < pathParts.length) {
      const runtime = pathParts[metafilesIndex + 1];
      if (["golang", "node", "python", "web"].includes(runtime)) {
        return runtime;
      }
    }
    if (filePath.includes("golang")) return "golang";
    if (filePath.includes("node")) return "node";
    if (filePath.includes("python")) return "python";
    if (filePath.includes("web")) return "web";
    throw "unknown runtime";
  }
  async scheduleTestsFromMetafile(metafile, runtime) {
    if (!metafile.metafile) {
      console.error(ansiC2.red("Metafile missing metafile property"));
      return;
    }
    if (!metafile.metafile.outputs) {
      console.error(ansiC2.red("Metafile missing outputs property"));
      return;
    }
    const outputsMap = metafile.metafile.outputs;
    console.log(ansiC2.cyan(`Processing ${outputsMap.size} outputs for ${runtime}`));
    const scheduledEntrypoints = /* @__PURE__ */ new Set();
    for (const [outputFile, outputs] of outputsMap.entries()) {
      console.log(ansiC2.magenta(`Output file: ${outputFile}`));
      if (!outputs || typeof outputs !== "object") {
        console.error(ansiC2.yellow(`Skipping invalid output entry for ${outputFile}`));
        continue;
      }
      const entrypoint = outputs.entryPoint || outputs.entrypoint;
      if (!entrypoint) {
        console.log(ansiC2.yellow(`No entrypoint for ${outputFile}`));
        continue;
      }
      console.log(ansiC2.magenta(`Outputs entrypoint: ${entrypoint}`));
      const isChunkFile = outputFile.includes("chunk-") || outputFile.includes("Node-") || !outputFile.includes("example/");
      if (isChunkFile) {
        console.log(ansiC2.yellow(`Skipping chunk file: ${outputFile}`));
        continue;
      }
      const isSourceEntrypoint = entrypoint.endsWith(".ts") || entrypoint.endsWith(".js") || entrypoint.endsWith(".go") || entrypoint.endsWith(".py");
      if (!isSourceEntrypoint) {
        console.log(ansiC2.yellow(`Entrypoint ${entrypoint} doesn't appear to be a source file`));
        continue;
      }
      if (scheduledEntrypoints.has(entrypoint)) {
        console.log(ansiC2.yellow(`Entrypoint ${entrypoint} already scheduled`));
        continue;
      }
      let addableFiles = [];
      if (outputs.inputs) {
        if (outputs.inputs instanceof Map) {
          addableFiles = Array.from(outputs.inputs.keys());
        } else if (typeof outputs.inputs === "object") {
          addableFiles = Object.keys(outputs.inputs);
        }
      } else {
        const entrypointOutputs = outputsMap.get(entrypoint);
        if (entrypointOutputs?.inputs) {
          if (entrypointOutputs.inputs instanceof Map) {
            addableFiles = Array.from(entrypointOutputs.inputs.keys());
          } else if (typeof entrypointOutputs.inputs === "object") {
            addableFiles = Object.keys(entrypointOutputs.inputs);
          }
        }
      }
      if (addableFiles.length === 0 && metafile.metafile.inputs) {
        const inputsMap = metafile.metafile.inputs;
        if (inputsMap instanceof Map) {
          addableFiles = Array.from(inputsMap.keys());
        } else if (typeof inputsMap === "object") {
          addableFiles = Object.keys(inputsMap);
        }
      }
      console.log(ansiC2.green(`Scheduling tests for ${entrypoint} with ${addableFiles.length} addable files`));
      this.scheduleStaticTests(
        metafile,
        runtime,
        entrypoint,
        addableFiles
      );
      this.scheduleBddTest(metafile, runtime, entrypoint);
      scheduledEntrypoints.add(entrypoint);
    }
    if (scheduledEntrypoints.size === 0) {
      console.log(ansiC2.yellow(`No valid entrypoints found for ${runtime}. Checking all outputs...`));
      for (const [outputFile, outputs] of outputsMap.entries()) {
        if (outputs && typeof outputs === "object") {
          const entrypoint = outputs.entryPoint || outputs.entrypoint;
          if (entrypoint && entrypoint.includes("example/")) {
            console.log(ansiC2.yellow(`Fallback scheduling for ${entrypoint}`));
            let addableFiles = [];
            if (metafile.metafile.inputs) {
              const inputsMap = metafile.metafile.inputs;
              if (inputsMap instanceof Map) {
                addableFiles = Array.from(inputsMap.keys());
              } else if (typeof inputsMap === "object") {
                addableFiles = Object.keys(inputsMap);
              }
            }
            this.scheduleStaticTests(
              metafile,
              runtime,
              entrypoint,
              addableFiles
            );
            this.scheduleBddTest(metafile, runtime, entrypoint);
            break;
          }
        }
      }
    }
  }
  async stop() {
    console.log(ansiC2.blue(ansiC2.inverse("Stopping metafile watchers...")));
    this.watchers.forEach((watcher) => {
      watcher.close();
    });
    this.watchers = [];
    await super.stop();
  }
};

// src/server/serverClasees/Server.ts
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);
var Server = class extends Server_MetafileWatcher {
  constructor(configs, testName, mode2) {
    super(configs, testName, mode2);
    console.log(ansiC3.inverse("Press 'q' to initiate a graceful shutdown."));
    console.log(ansiC3.inverse("Press 'CTRL + c' to quit forcefully."));
    console.log(
      ansiC3.inverse("Note: In raw mode, use 'CTRL + c' to force quit.")
    );
    process.stdin.on("keypress", async (str, key) => {
      if (key.name === "q") {
        console.log("Testeranto is shutting down gracefully...");
        await this.stop();
        process.exit(0);
      }
      if (key.ctrl && key.name === "c") {
        console.log("\nForce quitting...");
        process.exit(1);
      }
    });
    process.on("SIGINT", async () => {
      console.log("\nForce quitting...");
      process.exit(1);
    });
  }
  async start() {
    console.log(ansiC3.blue(ansiC3.inverse("Starting Server...")));
    await super.start();
    console.log(ansiC3.green(ansiC3.inverse("Server started successfully")));
  }
};

// src/testeranto.ts
if (!process.argv[2]) {
  console.error(`The 2nd argument should be a testeranto config file name.`);
  process.exit(-1);
}
var configFilepath = process.argv[2];
var testsName = path12.basename(configFilepath).split(".").slice(0, -1).join(".");
var mode = process.argv[3];
if (mode !== "once" && mode !== "dev") {
  console.error(`The 3rd argument should be 'dev' or 'once', not '${mode}'.`);
  process.exit(-1);
}
import(`${process.cwd()}/${configFilepath}`).then(async (module) => {
  const bigConfig = module.default;
  const config2 = {
    ...bigConfig,
    buildDir: process.cwd() + "/testeranto/bundles/" + testsName
  };
  await new Server(config2, testsName, mode).start();
});
