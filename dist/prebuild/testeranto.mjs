import "./chunk-Y6FXYEAI.mjs";

// src/testeranto.ts
import path11 from "path";

// src/server/serverClasees/Server.ts
import readline from "readline";
import { default as ansiC2 } from "ansi-colors";

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
      `echo 'Starting Go metafile generator...';
      
      cd /workspace/src/server/runtimes/golang;
      
      # Build the metafile generator
      go build -buildvcs=false -o /usr/local/bin/golang-main .;
      
      # Run the metafile generator
      /usr/local/bin/golang-main /workspace/testeranto/allTests.json;
      
      echo 'Go metafile generator completed. Keeping container alive...';
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
var golangBddCommand = (port) => {
  const jsonStr = JSON.stringify({ ports: [1111] });
  return `cd /workspace/example && go run example/Calculator.golingvu.test.go '${jsonStr}'`;
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

# Create a go.mod file for the metafile generator if it doesn't exist
RUN cd /workspace/src/server/runtimes/golang &&     if [ ! -f go.mod ]; then         go mod init golang-metafile-generator &&         echo "Created new go.mod file";     else         echo "go.mod already exists, skipping initialization";     fi &&     echo "=== Go files present: ===" &&     ls *.go

# Download dependencies for the metafile generator
RUN cd /workspace/src/server/runtimes/golang &&     echo "=== Downloading dependencies ===" &&     go mod download

# Compile the Go metafile generator (build with all Go files)
RUN cd /workspace/src/server/runtimes/golang &&     echo "=== Building in directory: $(pwd) ===" &&     go build -buildvcs=false -o /usr/local/bin/golang-main .


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
      `TEST_NAME=allTests WS_PORT=${config2.httpPort} yarn tsx dist/prebuild/server/runtimes/node/node.mjs allTests.ts '{"ports": [1111]}' || echo "Build process exited with code $?, but keeping container alive for health checks";`
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
var nodeBddCommand = (port) => {
  const jsonStr = JSON.stringify({ ports: [1111] });
  return `TEST_NAME=allTests WS_PORT=${port} ENV=node  node testeranto/bundles/allTests/node/example/Calculator.test.mjs allTests.ts '${jsonStr}' || echo "Build process exited with code $?, but keeping container alive for health checks";`;
};
var nodeDockerFile = `
FROM node:20.19.4-alpine
WORKDIR /workspace
COPY ./tsconfig*.json ./
COPY ./package.json ./package.json
COPY ./.yarnrc.yml ./

RUN apk add --no-cache python3 make g++ libxml2-utils

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


# Install Python dependencies from requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

RUN echo "Python environment ready with pylint and all dependencies"
`;
var pythonBDDCommand = (port) => {
  return `cd /workspace && python -m pytest example/ -v`;
};
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
      `
       
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
      `TEST_NAME=allTests WS_PORT=${config2.httpPort} yarn tsx dist/prebuild/server/runtimes/web/web.mjs allTests.ts '{"ports": [1111]}' || echo "Build process exited with code $?, but keeping container alive for health checks";`
    ]
  };
};
var webBddCommand = (port) => {
  const jsonStr = JSON.stringify({ ports: [1111] });
  return `
    # Wait for chromium to be ready
    until curl -f http://chromium:9222/json/version >/dev/null 2>&1; do
      echo "Waiting for chromium to be ready..."
      sleep 1
    done
    
    # Run the test
    TEST_NAME=allTests WS_PORT=${port} ENV=web node testeranto/bundles/allTests/web/example/Calculator.test.mjs allTests.ts '${jsonStr}'
  `;
};
var webDockerFile = `

FROM node:20.19.4-alpine
WORKDIR /workspace
COPY ./tsconfig*.json ./
COPY ./package.json ./package.json
COPY ./.yarnrc.yml ./

RUN apk add --no-cache     --repository dl-cdn.alpinelinux.org     chromium     nss     freetype     harfbuzz     ttf-freefont     python3 make g++ libxml2-utils

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
      case "sourceFilesUpdated":
        this.handleSourceFilesUpdated(ws, message.data);
        break;
      case "getBuildListenerState":
        this.handleGetBuildListenerState(ws);
        break;
      case "getBuildEvents":
        this.handleGetBuildEvents(ws);
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
  handleSourceFilesUpdated(ws, data) {
    const { testName, hash, files } = data || {};
    if (!testName || !hash || !files) {
      ws.send(JSON.stringify({
        type: "sourceFilesUpdated",
        status: "error",
        message: "Missing required fields: testName, hash, or files",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }));
      return;
    }
    console.log(`[WebSocket] Forwarding source files update to build listener for test: ${testName}`);
    if (typeof this.sourceFilesUpdated === "function") {
      try {
        this.sourceFilesUpdated(testName, hash, files);
        ws.send(JSON.stringify({
          type: "sourceFilesUpdated",
          status: "success",
          testName,
          message: "Build update processed successfully",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }));
      } catch (error) {
        console.error("[WebSocket] Error processing source files update:", error);
        ws.send(JSON.stringify({
          type: "sourceFilesUpdated",
          status: "error",
          testName,
          message: `Error processing build update: ${error}`,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }));
      }
    } else {
      console.warn("[WebSocket] sourceFilesUpdated method not available on this instance");
      ws.send(JSON.stringify({
        type: "sourceFilesUpdated",
        status: "error",
        testName,
        message: "Build listener functionality not available",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }));
    }
  }
  handleGetBuildListenerState(ws) {
    console.log("[WebSocket] Handling getBuildListenerState request");
    if (typeof this.getBuildListenerState === "function") {
      try {
        const state = this.getBuildListenerState();
        ws.send(JSON.stringify({
          type: "buildListenerState",
          data: state,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }));
      } catch (error) {
        console.error("[WebSocket] Error getting build listener state:", error);
        ws.send(JSON.stringify({
          type: "buildListenerState",
          status: "error",
          message: `Error getting build listener state: ${error}`,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }));
      }
    } else {
      ws.send(JSON.stringify({
        type: "buildListenerState",
        status: "error",
        message: "Build listener state not available",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }));
    }
  }
  handleGetBuildEvents(ws) {
    console.log("[WebSocket] Handling getBuildEvents request");
    if (typeof this.getBuildEvents === "function") {
      try {
        const events = this.getBuildEvents();
        ws.send(JSON.stringify({
          type: "buildEvents",
          events,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }));
      } catch (error) {
        console.error("[WebSocket] Error getting build events:", error);
        ws.send(JSON.stringify({
          type: "buildEvents",
          status: "error",
          message: `Error getting build events: ${error}`,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }));
      }
    } else {
      ws.send(JSON.stringify({
        type: "buildEvents",
        status: "error",
        message: "Build events not available",
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
    console.log(`[HTTP] routing ${routeName} of ${JSON.stringify(routes)}`);
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
            <link href="/dist/prebuild/style.css" rel="stylesheet">
            
          </head>
          <body>
            <div id="root"></div>
            <script src="/dist/prebuild/server/serverClasees/ProcessManagerReactApp.js"></script>
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
    if (routeName === "build_listener") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Build Listener</title>
            <link href="/dist/prebuild/style.css" rel="stylesheet">
            
          </head>
          <body>
            <div id="root"></div>
            <script src="/dist/prebuild/server/serverClasees/BuildListenerReactApp.js"></script>
            <script>
              // The bundled script automatically calls initApp when loaded
              // Ensure the root element exists
              if (!document.getElementById('root').innerHTML) {
                document.getElementById('root').innerHTML = '<div class="text-center mt-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Loading Build Listener...</p></div>';
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
    checks,
    volumes: options?.volumes
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
    (x) => `pylint ${x.join(" ")}}`
  ]),
  web: createLangConfig("example/Calculator.test.ts", [
    (x) => `yarn eslint ${x.join(" ")}`,
    (x) => `yarn tsc --noEmit ${x.join(" ")}`
  ], { volumes: ["eslint.config.mjs"] }),
  node: createLangConfig("example/Calculator.test.ts", [
    (x) => `yarn eslint ${x.join(" ")}`,
    (x) => `yarn tsc --noEmit ${x.join(" ")}`
  ], { volumes: ["eslint.config.mjs"] })
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

    <link rel="stylesheet" href="/dist/prebuild/style.css" />

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
    <script src="/dist/prebuild/frontend/Report.js"></script>
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
        "style.css"
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
    this.queuedItems = [];
    this.getProcessSummary = () => {
      const processes = [];
      for (const [id, info] of this.allProcesses.entries()) {
        if (!id) {
          throw `[ProcessManager] Found process with undefined ID, info: ${info}`;
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
    this.getProcessLogs = (processId) => {
      return this.processLogs.get(processId) || [];
    };
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
    this.executeCommand = async (processId, command, category, testName, platform, options) => {
      if (!this.processExecution) {
        const { ProcessExecution } = await import("./ProcessExecution-CIAOJJAI.mjs");
        this.processExecution = new ProcessExecution(
          this.addLogEntry,
          this.allProcesses,
          this.runningProcesses
        );
      }
      return this.processExecution.executeCommand(
        processId,
        command,
        category,
        testName,
        platform,
        options
      );
    };
    this.addPromiseProcessAndGetSafePromise = async (processId, promise, command, category, testName, platform) => {
      if (!this.processExecution) {
        const { ProcessExecution } = await import("./ProcessExecution-CIAOJJAI.mjs");
        this.processExecution = new ProcessExecution(
          this.addLogEntry,
          this.allProcesses,
          this.runningProcesses
        );
      }
      return this.processExecution.addPromiseProcessAndGetSafePromise(
        processId,
        promise,
        command,
        category,
        testName,
        platform
      );
    };
    this.addPromiseProcess = async (processId, promise, command, category, testName, platform) => {
      const actualPromise = promise || Promise.resolve({ stdout: "", stderr: "" });
      await this.addPromiseProcessAndGetSafePromise(
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
    configs.ports.forEach((port) => {
      this.ports[port] = "";
    });
    this.processExecution = null;
    this.routes({});
  }
  routes(routes) {
    super.routes({
      process_manager: {},
      ...routes
    });
  }
  async stop() {
    if (this.jobQueue) {
      this.jobQueue.end();
      this.jobQueue.stop();
    }
    Object.values(this.logStreams || {}).forEach((logs) => logs.closeAll());
    await super.stop();
  }
  writeToProcessLogFile(processId, source, message, timestamp) {
    let runtime = "unknown";
    if (processId.startsWith("allTests-")) {
      const parts = processId.split("-");
      if (parts.length >= 2) {
        runtime = parts[1];
      }
    }
    const logDir = path10.join(
      process.cwd(),
      "testeranto",
      "reports",
      this.projectName,
      runtime,
      "example"
    );
    let logFileName = processId;
    if (processId.startsWith("allTests-")) {
      const withoutPrefix = processId.substring("allTests-".length);
      const firstDashIndex = withoutPrefix.indexOf("-");
      if (firstDashIndex !== -1) {
        logFileName = withoutPrefix.substring(firstDashIndex + 1);
      }
    }
    const logFile = path10.join(logDir, `${logFileName}.log`);
    const logEntry = `[${timestamp.toISOString()}] [${source}] ${message}
`;
    fs7.appendFileSync(logFile, logEntry);
  }
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
  async runBddTestInDocker(processId, testPath, runtime, bddCommand) {
    const containerName = `bdd-${runtime}-${testPath.replace(/[^a-zA-Z0-9]/g, "-")}`;
    const checkCmd = `docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`;
    const checkResult = await this.executeCommand(
      `${processId}-check`,
      checkCmd,
      "bdd-test",
      testPath,
      runtime
    );
    if (checkResult.success && checkResult.stdout && checkResult.stdout.trim() === containerName) {
      await this.executeCommand(
        `${processId}-remove`,
        `docker rm -f ${containerName}`,
        "bdd-test",
        testPath,
        runtime
      );
    }
    const baseImage = this.getRuntimeImage(runtime);
    const dockerRunCmd = `docker run --rm       --name ${containerName}       --network allTests_network       -v ${process.cwd()}:/workspace       -w /workspace       ${baseImage}       sh -c "${bddCommand}"`;
    const result = await this.executeCommand(
      processId,
      dockerRunCmd,
      "bdd-test",
      testPath,
      runtime
    );
    if (!result.success) {
      console.log(`[ProcessManager] BDD test ${processId} failed:`, result.error?.message);
    } else {
      console.log(`[ProcessManager] BDD test ${processId} completed successfully`);
    }
  }
  getRuntimeImage(runtime) {
    switch (runtime) {
      case "node":
        return "bundles-node-build:latest";
      case "web":
        return "bundles-web-build:latest";
      case "python":
        return "bundles-python-build:latest";
      case "golang":
        return "bundles-golang-build:latest";
      default:
        return "alpine:latest";
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
        const containerName = `queue-${runtime}-${testPath.replace(/[^a-zA-Z0-9]/g, "-")}`;
        const checkCmd = `docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`;
        const checkResult = await this.executeCommand(
          `${processId}-check`,
          checkCmd,
          "bdd-test",
          testName,
          runtime
        );
        if (checkResult.success && checkResult.stdout && checkResult.stdout.trim() === containerName) {
          await this.executeCommand(
            `${processId}-remove`,
            `docker rm -f ${containerName}`,
            "bdd-test",
            testName,
            runtime
          );
        }
        const baseImage = this.getRuntimeImage(runtime);
        const dockerRunCmd = `docker run --rm           --name ${containerName}           --network allTests_network           -v ${process.cwd()}:/workspace           -w /workspace           ${baseImage}           sh -c "${command}"`;
        await this.executeCommand(
          processId,
          dockerRunCmd,
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
  pop() {
    const item = this.queuedItems.pop();
    if (item) {
      console.warn(
        `[Queue] Item ${item.testName} marked as popped, but may still be in queue`
      );
    }
    return item;
  }
  includes(testName, runtime) {
    if (runtime !== void 0) {
      return this.queuedItems.some(
        (item) => item.testName === testName && item.runtime === runtime
      );
    }
    return this.queuedItems.some((item) => item.testName === testName);
  }
  get queueLength() {
    return this.jobQueue ? this.jobQueue.length : 0;
  }
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
  getAllQueueItems() {
    return [...this.queuedItems];
  }
};

// src/server/serverClasees/Server_Aider.ts
var Server_Aider = class extends Server_ProcessManager {
  constructor() {
    super(...arguments);
    this.aiderProcesses = /* @__PURE__ */ new Map();
    // Create aider process for a specific test as a background command
    this.createAiderProcess = async (runtime, testPath, metafile) => {
      if (!this.aiderProcessManager) {
        const { AiderProcessManager } = await import("./AiderProcessManager-25VHFOXA.mjs");
        this.aiderProcessManager = new AiderProcessManager(
          this.executeCommand,
          this.addLogEntry,
          this.allProcesses,
          this.aiderProcesses
        );
      }
      return this.aiderProcessManager.createAiderProcess(runtime, testPath, metafile);
    };
  }
  // Store actual aider processes
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
    await super.stop();
  }
};

// src/server/serverClasees/Server_Scheduler.ts
var Server_Scheduler = class extends Server_Aider {
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
    let bddCommand = "";
    if (runtime === "node") {
      bddCommand = nodeBddCommand(this.configs.httpPort);
    } else if (runtime === "web") {
      bddCommand = webBddCommand(this.configs.httpPort);
    } else if (runtime === "python") {
      bddCommand = pythonBDDCommand(this.configs.httpPort);
    } else if (runtime === "golang") {
      bddCommand = golangBddCommand(this.configs.httpPort);
    } else {
      bddCommand = `echo 'not yet implemented'`;
    }
    await this.runBddTestInDocker(processId, testPath, runtime, bddCommand);
  }
  async scheduleStaticTests(metafile, runtime, entrypoint, addableFiles) {
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
      const processId = `allTests-${runtime}-${testPath}-static-${checkIndex}`;
      const checkCommand = check(addableFiles);
      const containerName = `static-${runtime}-${testPath.replace(/[^a-zA-Z0-9]/g, "-")}-${checkIndex}`;
      const checkCmd = `docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`;
      const checkResult = await this.executeCommand(
        `${processId}-check`,
        checkCmd,
        "build-time",
        testPath,
        runtime
      );
      if (checkResult.success && checkResult.stdout && checkResult.stdout.trim() === containerName) {
        await this.executeCommand(
          `${processId}-remove`,
          `docker rm -f ${containerName}`,
          "build-time",
          testPath,
          runtime
        );
      }
      const baseImage = this.getRuntimeImage(runtime);
      const dockerRunCmd = `docker run --rm           --name ${containerName}           --network allTests_network           -v ${process.cwd()}:/workspace           -w /workspace           ${baseImage}           sh -c "${checkCommand}"`;
      const result = await this.executeCommand(
        processId,
        dockerRunCmd,
        "build-time",
        testPath,
        runtime
      );
      if (!result.success) {
        console.log(`[ProcessManager] Static test ${processId} failed:`, result.error?.message);
      } else {
        console.log(`[ProcessManager] Static test ${processId} completed successfully`);
      }
      checkIndex++;
    }
  }
};

// src/server/serverClasees/Server_BuildListener.ts
var Server_BuildListener = class extends Server_Scheduler {
  constructor(configs, name, mode2) {
    super(configs, name, mode2);
    // Map test name to IHashes
    this.hashes = /* @__PURE__ */ new Map();
    // Store build events for UI
    this.buildEvents = [];
    // Maximum number of events to keep
    this.maxEvents = 100;
  }
  sourceFilesUpdated(testName, hash, files) {
    console.log(`[BuildListener] Source files updated for test: ${testName}, hash: ${hash}`);
    const previousHash = this.hashes.has(testName) ? this.hashes.get(testName)?.hash : null;
    this.hashes.set(testName, { hash, files });
    const event = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      testName,
      hash,
      files,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      status: "pending",
      message: `Build update received for ${testName}`
    };
    this.addBuildEvent(event);
    if (previousHash !== hash) {
      console.log(`[BuildListener] Hash changed for ${testName}. Scheduling tests...`);
      event.status = "processing";
      event.message = `Hash changed for ${testName}. Scheduling tests...`;
      this.updateBuildEvent(event);
      this.scheduleTest(testName, files);
      event.status = "scheduled";
      event.message = `Test ${testName} scheduled for execution`;
      this.updateBuildEvent(event);
      this.broadcastBuildUpdate(testName, hash, files);
    } else {
      console.log(`[BuildListener] Hash unchanged for ${testName}. No action needed.`);
      event.status = "completed";
      event.message = `Hash unchanged for ${testName}. No action needed.`;
      this.updateBuildEvent(event);
    }
  }
  addBuildEvent(event) {
    this.buildEvents.unshift(event);
    if (this.buildEvents.length > this.maxEvents) {
      this.buildEvents.pop();
    }
    this.broadcastBuildEvents();
  }
  updateBuildEvent(updatedEvent) {
    const index = this.buildEvents.findIndex((e) => e.id === updatedEvent.id);
    if (index !== -1) {
      this.buildEvents[index] = updatedEvent;
      this.broadcastBuildEvents();
    }
  }
  scheduleTest(testName, files) {
    console.log(`[BuildListener] Scheduling test: ${testName}`);
  }
  broadcastBuildUpdate(testName, hash, files) {
    if (typeof this.broadcast === "function") {
      this.broadcast({
        type: "buildUpdate",
        testName,
        hash,
        files,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  }
  broadcastBuildEvents() {
    if (typeof this.broadcast === "function") {
      this.broadcast({
        type: "buildEvents",
        events: this.buildEvents,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  }
  getBuildEvents() {
    return this.buildEvents;
  }
  getBuildListenerState() {
    return {
      hashes: Array.from(this.hashes.entries()).map(([testName, data]) => ({
        testName,
        hash: data.hash,
        fileCount: data.files.length
      })),
      recentEvents: this.buildEvents.slice(0, 10),
      // Last 10 events
      totalEvents: this.buildEvents.length,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  routes(routes) {
    super.routes({
      build_listener: {},
      ...routes
    });
  }
};

// src/server/serverClasees/Server.ts
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);
var Server = class extends Server_BuildListener {
  constructor(configs, testName, mode2) {
    super(configs, testName, mode2);
    console.log(ansiC2.inverse("Press 'q' to initiate a graceful shutdown."));
    console.log(ansiC2.inverse("Press 'CTRL + c' to quit forcefully."));
    console.log(
      ansiC2.inverse("Note: In raw mode, use 'CTRL + c' to force quit.")
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
    console.log(ansiC2.blue(ansiC2.inverse("Starting Server...")));
    await super.start();
    console.log(ansiC2.green(ansiC2.inverse("Server started successfully")));
  }
};

// src/testeranto.ts
if (!process.argv[2]) {
  console.error(`The 2nd argument should be a testeranto config file name.`);
  process.exit(-1);
}
var configFilepath = process.argv[2];
var testsName = path11.basename(configFilepath).split(".").slice(0, -1).join(".");
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
