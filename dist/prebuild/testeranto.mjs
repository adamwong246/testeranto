import {
  __require
} from "./chunk-Y6FXYEAI.mjs";

// src/testeranto.ts
import path7 from "path";

// src/server/serverClasees/Server.ts
import readline from "readline";

// src/server/htmlTemplate.ts
function generateReactAppHtml(title, scriptPath, appName) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="/dist/prebuild/style.css" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script src="/dist/prebuild/server/serverClasees/${scriptPath}.js"></script>
    <script>
      // The bundled script automatically calls initApp when loaded
      // Ensure the root element exists
      if (!document.getElementById('root').innerHTML) {
        document.getElementById('root').innerHTML = '<div class="text-center mt-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Loading ${appName}...</p></div>';
      }
    </script>
  </body>
</html>
  `.trim();
}

// src/server/serverClasees/Server_TestManager.ts
import { default as ansiC3 } from "ansi-colors";
import fs6 from "fs";
import path5 from "path";

// src/server/serverManagers/ProcessManager.ts
var ProcessManager = class {
  constructor() {
    this.logStreams = {};
    this.processLogs = /* @__PURE__ */ new Map();
    this.logStreams = {};
    this.processLogs = /* @__PURE__ */ new Map();
  }
};
var getRuntimeImage = (runtime) => {
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
      throw "unknown runtime";
  }
};

// src/server/serverManagers/TestManager.ts
var TestManager = class {
  constructor() {
    this.ports = {};
    this.processLogs = /* @__PURE__ */ new Map();
    this.jobQueue = [];
  }
  add(pid, executor) {
    this.jobSet[pid] = new Promise(executor);
  }
  get entries() {
    return this.jobSet.entries();
  }
  async enqueue(runtime, command, addableFiles = [], normalizedTestName, category) {
    console.log(`[Queue] enqueue called: runtime=${runtime}, command=${command}, category=${category}`);
    const item = {
      testName: normalizedTestName,
      runtime,
      addableFiles,
      command,
      category
    };
    this.jobQueue.push(item);
  }
  async dequeue() {
    console.log(`[Queue] dequeue()`);
    this.jobQueue.shift();
  }
  includes(testName, runtime) {
    if (runtime) {
      return this.jobQueue.some(
        (item) => item.testName === testName && item.runtime === runtime
      );
    } else {
      return this.jobQueue.some((item) => item.testName === testName);
    }
  }
  get queueLength() {
    return this.jobQueue.length;
  }
  clearQueue() {
    this.jobQueue = [];
  }
  getAllQueueItems() {
    return this.jobQueue.map((item) => ({
      testName: item.testName,
      runtime: item.runtime,
      addableFiles: item.addableFiles
    }));
  }
};

// src/server/serverClasees/Server_BuildManager.ts
import { default as ansiC2 } from "ansi-colors";
import fs5 from "fs";
import path4 from "path";

// src/server/serverClasees/Server_ProcessManager.ts
import { default as ansiC } from "ansi-colors";
import fs4 from "fs";
import path3 from "path";

// src/server/serverClasees/Server_WS.ts
import { WebSocketServer, WebSocket } from "ws";

// src/server/serverClasees/Server_HTTP.ts
import fs3 from "fs";
import http from "http";
import path2 from "path";

// src/server/serverClasees/Server_Docker.ts
import { exec, spawn } from "child_process";
import fs2 from "fs";
import yaml from "js-yaml";
import path from "path";
import { promisify } from "util";

// src/server/runtimes/golang/docker.ts
var golangDockerComposeFile = (config, projectName) => {
  return {
    build: {
      context: process.cwd(),
      // Use the project root as build context
      dockerfile: config.golang.dockerfile
    },
    container_name: `golang-builder-${projectName}`,
    environment: {
      ...config.env
    },
    working_dir: "/workspace",
    volumes: [
      `${process.cwd()}:/workspace`
    ]
  };
};
var golangBddCommand = () => {
  const jsonStr = JSON.stringify({ ports: [1111] });
  return `go run example/Calculator.golingvu.test.go '${jsonStr}'`;
};

// src/server/runtimes/node/docker.ts
var nodeDockerComposeFile = (config, projectName) => {
  return {
    build: {
      context: process.cwd(),
      dockerfile: config.node.dockerfile
    },
    container_name: `node-builder-${projectName}`,
    environment: {
      NODE_ENV: "production",
      ...config.env
    },
    working_dir: "/workspace",
    volumes: [
      `${process.cwd()}/src:/workspace/src`,
      `${process.cwd()}/example:/workspace/example`,
      `${process.cwd()}/dist:/workspace/dist`
    ],
    command: `sh -c "pwd; ls -al; yarn tsx dist/prebuild/server/runtimes/node/node.mjs /workspace/allTests.ts"`
    // command: `sh -c "ls -al"`,
  };
};
var nodeBddCommand = (port) => {
  const jsonStr = JSON.stringify({ ports: [1111] });
  return `TEST_NAME=allTests WS_PORT=${port} ENV=node  node testeranto/bundles/allTests/node/example/Calculator.test.mjs allTests.ts '${jsonStr}' || echo "Build process exited with code $?, but keeping container alive for health checks";`;
};

// src/server/runtimes/python/docker.ts
var pythonBDDCommand = (port) => {
  return `cd /workspace && python -m example/xyz -v`;
};
var pythonDockerComposeFile = (config, projectName) => {
  return {
    build: {
      context: process.cwd(),
      // Project root (where docker-compose is run from)
      dockerfile: config.python.dockerfile
    },
    container_name: `python-builder-${projectName}`,
    environment: {
      PYTHONUNBUFFERED: "1",
      ...config.env
    },
    volumes: [
      `${process.cwd()}:/workspace`
    ],
    working_dir: "/workspace",
    command: "python main.py"
  };
};

// src/server/runtimes/web/docker.ts
var webDockerComposeFile = (config, projectName) => {
  return {
    build: {
      context: process.cwd(),
      dockerfile: config.web.dockerfile
    },
    container_name: `web-builder-${projectName}`,
    working_dir: "/workspace",
    volumes: [
      `${process.cwd()}:/workspace`
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

// src/server/serverManagers/DockerManager.ts
var DockerManager = class {
  constructor(composeFile, projectName) {
    this.cwd = process.cwd();
    this.composeFile = composeFile;
    this.projectName = projectName;
  }
  buildLogsHeader() {
    let header = `=== Docker Compose Build Logs ===
`;
    header += `Started at: ${(/* @__PURE__ */ new Date()).toISOString()}
`;
    header += `Project: ${this.projectName}
`;
    header += `Compose file: ${this.composeFile}
`;
    header += "=".repeat(50) + "\n\n";
    return header;
  }
  BaseCompose(services) {
    return {
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
  }
  staticTestDockerComposeFile(config, runtime, container_name) {
    return {
      build: {
        context: process.cwd(),
        dockerfile: `${config[runtime].dockerfile}`
      },
      container_name,
      environment: {
        NODE_ENV: "production",
        ...config.env
      },
      working_dir: "/workspace"
    };
  }
  bddTestDockerComposeFile(config, runtime, container_name) {
    return {
      build: {
        context: process.cwd(),
        dockerfile: `${config[runtime].dockerfile}`
      },
      container_name,
      environment: {
        NODE_ENV: "production",
        ...config.env
      },
      working_dir: "/workspace"
    };
  }
  aiderDockerComposeFile(config, runtime, container_name) {
    return {
      build: {
        context: process.cwd(),
        dockerfile: "aider.Dockerfile"
      },
      container_name,
      environment: {
        NODE_ENV: "production",
        ...config.env
      },
      working_dir: "/workspace",
      command: "aider"
    };
  }
  generateServices(config, runtimes) {
    const services = {};
    for (const runtime of runtimes) {
      if (runtime === "node") {
        services[`${runtime}-builder`] = nodeDockerComposeFile(config, "allTests");
      } else if (runtime === "web") {
        services[`${runtime}-builder`] = webDockerComposeFile(config, "allTests");
      } else if (runtime === "golang") {
        services[`${runtime}-builder`] = golangDockerComposeFile(config, "allTests");
      } else if (runtime === "python") {
        services[`${runtime}-builder`] = pythonDockerComposeFile(config, "allTests");
      } else {
        throw `unknown runtime ${runtime}`;
      }
      for (const test in config[runtime].tests) {
        const uid = `${runtime}-${test.toLowerCase().replaceAll("/", "_").replaceAll(".", "-")}`;
        for (const [index, check] of config[runtime].checks.entries()) {
          const tuid = `${uid}-static-${index}`;
          services[tuid] = this.staticTestDockerComposeFile(config, runtime, tuid);
        }
        services[`${uid}-bdd`] = this.bddTestDockerComposeFile(config, runtime, `${uid}-bdd`);
        services[`${uid}-aider`] = this.aiderDockerComposeFile(config, runtime, `${uid}-aider`);
      }
    }
    for (const serviceName in services) {
      services[serviceName].networks = ["default"];
    }
    return services;
  }
  autogenerateStamp(x) {
    return `# This file is autogenerated. Do not edit it directly
${x}
    `;
  }
  getUpCommand() {
    return `docker compose -f "${this.composeFile}" up -d`;
  }
  getDownCommand() {
    return `docker compose -f "${this.composeFile}" down -v --remove-orphans`;
  }
  getPsCommand() {
    return `docker compose -f "${this.composeFile}" ps`;
  }
  getLogsCommand(serviceName, tail = 100) {
    const base = `docker compose -f "${this.composeFile}" logs --no-color --tail=${tail}`;
    return serviceName ? `${base} ${serviceName}` : base;
  }
  getConfigServicesCommand() {
    return `docker compose -f "${this.composeFile}" config --services`;
  }
  getBuildCommand() {
    return `docker compose -f "${this.composeFile}" build`;
  }
  getStartCommand() {
    return `docker compose -f "${this.composeFile}" start`;
  }
};

// src/server/serverClasees/Server_Base.ts
var Server_Base = class {
  constructor(configs, projectName, mode2) {
    this.configs = configs;
    this.mode = mode2;
    this.projectName = projectName;
  }
  async start() {
    console.log(`[Server_Base] start()`);
  }
  async stop() {
    console.log(`[Server_Base] stop()`);
    process.exit();
  }
};

// src/server/serverClasees/Server_Docker.ts
import ansiColors from "ansi-colors";
var Server_Docker = class extends Server_Base {
  constructor(configs, projectName, mode2) {
    super(configs, projectName, mode2);
    this.dockerManager = new DockerManager(path.join(
      process.cwd(),
      "testeranto",
      "bundles",
      `${this.projectName}-docker-compose.yml`
    ), projectName);
  }
  async start() {
    console.log(`[Server_Docker] start()`);
    super.start();
    await this.setupDockerCompose(this.configs, this.projectName);
    console.log(`[Server_Docker] Dropping everything...`);
    try {
      const downCmd = `docker compose -f "${this.dockerManager.composeFile}" down -v --remove-orphans`;
      console.log(`[Server_Docker] Running: ${downCmd}`);
      await this.spawnPromise(downCmd);
      console.log(`[Server_Docker] Docker compose down completed`);
    } catch (error) {
      console.log(`[Server_Docker] Docker compose down noted: ${error.message}`);
    }
    try {
      const listCmd = `docker ps -a --format "{{.Names}}"`;
      const execAsync = promisify(exec);
      const { stdout } = await execAsync(listCmd, { cwd: this.dockerManager.cwd });
      const containerNames = stdout.trim().split("\n").filter((name) => name.trim());
      for (const name of containerNames) {
        if (name.includes(this.projectName) || name.includes("example/Calculator")) {
          console.log(`[Server_Docker] Removing stray container: ${name}`);
          try {
            await this.spawnPromise(`docker rm -f ${name}`);
          } catch (rmError) {
            console.log(`[Server_Docker] Could not remove container ${name}: ${rmError.message}`);
          }
        }
      }
    } catch (error) {
      console.log(`[Server_Docker] Stray container cleanup noted: ${error.message}`);
    }
    try {
      const networkName = "allTests_network";
      await this.spawnPromise(`docker network rm ${networkName} 2>/dev/null || true`);
    } catch (error) {
    }
    await this.DC_build();
    await this.DC_upAll();
  }
  async stop() {
    console.log(`[Server_Docker] stop()`);
    const result = await this.DC_down();
    if (result.exitCode !== 0) {
      console.error(`Docker Compose down failed: ${result.err}`);
    }
    super.stop();
  }
  async setupDockerCompose(config, testsName2) {
    const composeDir = path.join(process.cwd(), "testeranto", "bundles");
    try {
      fs2.mkdirSync(composeDir, { recursive: true });
      const runtimes = ["node", "web", "golang", "python"];
      const services = this.dockerManager.generateServices(
        config,
        runtimes
      );
      this.writeComposeFile(services, testsName2, composeDir);
    } catch (err) {
      console.error(`Error in setupDockerCompose:`, err);
      throw err;
    }
  }
  writeComposeFile(services, testsName2, composeDir) {
    const composeFilePath = path.join(
      composeDir,
      `${testsName2}-docker-compose.yml`
    );
    const dockerComposeFileContents = this.dockerManager.BaseCompose(services);
    try {
      fs2.writeFileSync(
        composeFilePath,
        yaml.dump(dockerComposeFileContents, {
          lineWidth: -1,
          noRefs: true
        })
      );
    } catch (err) {
      console.error(JSON.stringify(dockerComposeFileContents));
      throw err;
    }
  }
  async exec(cmd, options) {
    const execAsync = promisify(exec);
    return execAsync(cmd, { cwd: options.cwd });
  }
  spawnPromise(command) {
    return new Promise((resolve, reject) => {
      console.log(`[spawnPromise] Executing: ${command}`);
      const child = spawn(command, {
        stdio: "inherit",
        shell: true,
        cwd: this.dockerManager.cwd
      });
      child.on("error", (error) => {
        console.error(`[spawnPromise] Failed to start process: ${error.message}`);
        reject(error);
      });
      child.on("close", (code) => {
        if (code === 0) {
          console.log(`[spawnPromise] Process completed successfully`);
          resolve(code);
        } else {
          console.error(`[spawnPromise] Process exited with code ${code}`);
          reject(new Error(`Process exited with code ${code}`));
        }
      });
    });
  }
  async DC_upAll() {
    try {
      const cmd = this.dockerManager.getUpCommand();
      await this.spawnPromise(cmd);
      return {
        exitCode: 0,
        out: "",
        err: "",
        data: null
      };
    } catch (error) {
      console.error(
        `[Docker] docker compose up \u274C ${ansiColors.bgBlue(error.message.replaceAll("\\n", "\n"))}`
      );
      return {
        exitCode: 1,
        out: "",
        err: `Error starting services: ${error.message}`,
        data: null
      };
    }
  }
  async DC_down() {
    try {
      const cmd = this.dockerManager.getDownCommand();
      await this.spawnPromise(cmd);
      return {
        exitCode: 0,
        out: "",
        err: "",
        data: null
      };
    } catch (error) {
      console.log(`[DC_down] Error during down: ${error.message}`);
      return {
        exitCode: 1,
        out: "",
        err: `Error stopping services: ${error.message}`,
        data: null
      };
    }
  }
  async DC_ps() {
    try {
      const cmd = this.dockerManager.getPsCommand();
      const { stdout, stderr } = await this.exec(cmd, { cwd: this.dockerManager.cwd });
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
  async DC_logs(serviceName, options) {
    const tail = options?.tail ?? 100;
    try {
      const cmd = this.dockerManager.getLogsCommand(serviceName, tail);
      const { stdout, stderr } = await this.exec(cmd, { cwd: this.dockerManager.cwd });
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
  async DC_configServices() {
    try {
      const cmd = this.dockerManager.getConfigServicesCommand();
      const { stdout, stderr } = await this.exec(cmd, { cwd: this.dockerManager.cwd });
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
  async DC_start() {
    try {
      const startCommand = this.dockerManager.getStartCommand();
      await this.spawnPromise(startCommand);
      return {
        exitCode: 0,
        data: null
      };
    } catch (error) {
      console.error(
        `[Docker] docker compose start \u274C ${ansiColors.bgBlue(error.message.replaceAll("\\n", "\n"))}`
      );
      return {
        exitCode: 1,
        data: null
      };
    }
  }
  async DC_build() {
    try {
      const buildCommand = this.dockerManager.getBuildCommand();
      await this.spawnPromise(buildCommand);
      console.log(`[DC_build] Build completed successfully`);
      return {
        exitCode: 0,
        out: "",
        err: "",
        data: null
      };
    } catch (error) {
      console.error(
        `[Docker] docker-compose build \u274C ${ansiColors.bgBlue(error.message.replaceAll("\\n", "\n"))}`
      );
      return {
        exitCode: 1,
        out: "",
        err: `Error building services: ${error.message}`,
        data: null
      };
    }
  }
};

// src/server/serverManagers/tcp.ts
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

// src/server/serverManagers/HttpManager.ts
var HttpManager = class {
  routeName(req) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const urlPath = url.pathname;
    return urlPath.slice(3);
  }
  decodedPath(req) {
    const urlPath = new URL(req.url, `http://${req.headers.host}`).pathname;
    const decodedPath = decodeURIComponent(urlPath);
    return decodedPath.startsWith("/") ? decodedPath.slice(1) : decodedPath;
  }
  matchRoute(routeName, routes) {
    if (routes && routes[routeName]) {
      return { handler: routes[routeName], params: {} };
    }
    for (const [pattern, handler] of Object.entries(routes)) {
      if (pattern.includes(":")) {
        const patternParts = pattern.split("/");
        const routeParts = routeName.split("/");
        const lastPatternPart = patternParts[patternParts.length - 1];
        const isLastParamWithExtension = lastPatternPart.includes(":") && lastPatternPart.includes(".xml");
        if (isLastParamWithExtension) {
          let matches = true;
          const params = {};
          for (let i = 0; i < patternParts.length - 1; i++) {
            const patternPart = patternParts[i];
            const routePart = routeParts[i];
            if (patternPart.startsWith(":")) {
              const paramName = patternPart.slice(1);
              params[paramName] = routePart;
            } else if (patternPart !== routePart) {
              matches = false;
              break;
            }
          }
          if (matches) {
            const lastParamName = lastPatternPart.slice(1, lastPatternPart.indexOf(".xml"));
            const remainingParts = routeParts.slice(patternParts.length - 1);
            let paramValue = remainingParts.join("/");
            if (paramValue.endsWith(".xml")) {
              paramValue = paramValue.slice(0, -4);
            }
            params[lastParamName] = paramValue;
            return { handler, params };
          }
        } else {
          if (patternParts.length !== routeParts.length) {
            continue;
          }
          let matches = true;
          const params = {};
          for (let i = 0; i < patternParts.length; i++) {
            const patternPart = patternParts[i];
            const routePart = routeParts[i];
            if (patternPart.startsWith(":")) {
              const paramName = patternPart.slice(1);
              params[paramName] = routePart;
            } else if (patternPart !== routePart) {
              matches = false;
              break;
            }
          }
          if (matches) {
            return { handler, params };
          }
        }
      }
    }
    return null;
  }
  extractParams(pattern, routeName) {
    const patternParts = pattern.split("/");
    const routeParts = routeName.split("/");
    if (patternParts.length !== routeParts.length) {
      return null;
    }
    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const routePart = routeParts[i];
      if (patternPart.startsWith(":")) {
        const paramName = patternPart.slice(1);
        params[paramName] = routePart;
      } else if (patternPart !== routePart) {
        return null;
      }
    }
    return params;
  }
};

// src/server/serverClasees/Server_HTTP.ts
var Server_HTTP = class extends Server_Docker {
  constructor(configs, name, mode2, routes) {
    super(configs, name, mode2);
    this.http = new HttpManager();
    this.httpServer = http.createServer();
    this.httpServer.on("error", (error) => {
      console.error(`[HTTP] error:`, error);
    });
    this.httpServer.on("request", this.handleHttpRequest.bind(this));
    this.routes = routes;
  }
  async start() {
    console.log(`[Server_HTTP] start()`);
    super.start();
    return new Promise((resolve) => {
      this.httpServer.on("listening", () => {
        const addr = this.httpServer.address();
        console.log(`[HTTP] HTTP server is now listening on port ${3456}`);
        resolve();
      });
    });
  }
  async stop() {
    console.log(`[Server_HTTP] stop()`);
    this.httpServer.close(() => {
      console.log("[HTTP] HTTP server closed");
    });
    await super.stop();
  }
  handleHttpRequest(req, res) {
    console.log(`[Server_HTTP] handleHttpRequest(${req.url})`);
    if (req.url && req.url.startsWith("/~/")) {
      this.handleRouteRequest(req, res);
    } else {
      this.serveStaticFile(req, res);
    }
  }
  handleRouteRequest(req, res) {
    console.log(`[Server_HTTP] handleRouteRequest(${req.url})`);
    const routeName = this.http.routeName(req);
    console.log(`[HTTP] Handling route: /~/${routeName}`);
    const match = this.http.matchRoute(routeName, this.routes);
    if (match) {
      req.params = match.params;
      try {
        match.handler(req, res);
      } catch (error) {
        console.error(`[HTTP] Error in route handler for /~/${routeName}:`, error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(`Internal Server Error: ${error}`);
      }
      return;
    }
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end(`Route not found: /~/${routeName}`);
  }
  serveStaticFile(req, res) {
    console.log(`[Server_HTTP] serveStaticFile(${req.url})`);
    if (!req.url) {
      res.writeHead(400);
      res.end("Bad Request");
      return;
    }
    const normalizedPath = this.http.decodedPath(req);
    if (normalizedPath.includes("..")) {
      res.writeHead(403);
      res.end("Forbidden: Directory traversal not allowed");
      return;
    }
    const projectRoot = process.cwd();
    const filePath = path2.join(projectRoot, normalizedPath);
    if (!filePath.startsWith(path2.resolve(projectRoot))) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    fs3.stat(filePath, (err, stats) => {
      if (err) {
        if (err.code === "ENOENT") {
          res.writeHead(404);
          res.end(`File not found: ${normalizedPath}`);
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
              const stat = fs3.statSync(path2.join(filePath, file));
              const isDir = stat.isDirectory();
              const slash = isDir ? "/" : "";
              return `<li><a href="${path2.join(
                normalizedPath,
                file
              )}${slash}">${file}${slash}</a></li>`;
            } catch {
              return `<li><a href="${path2.join(
                normalizedPath,
                file
              )}">${file}</a></li>`;
            }
          }).join("");
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(`
            <!DOCTYPE html>
            <html>
            <head><title>Directory listing for ${normalizedPath}</title></head>
            <body>
              <h1>Directory listing for ${normalizedPath}</h1>
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
    console.log(`[Server_HTTP] serveFile(${filePath})`);
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
  // The route method is no longer abstract since we're using the routes() method
  // This is kept for backward compatibility
  router(a) {
    return a;
  }
};

// src/server/serverManagers/WsManager.ts
var WsManager = class {
  constructor() {
  }
  escapeXml(unsafe) {
    if (!unsafe) return "";
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "&":
          return "&amp;";
        case "'":
          return "&apos;";
        case '"':
          return "&quot;";
        default:
          return c;
      }
    });
  }
  // Process message and return response data
  processMessage(type, data, getProcessSummary, getProcessLogs) {
    console.log("[WsManager] Processing message:", type);
    switch (type) {
      case "ping":
        return {
          type: "pong",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
      case "getProcesses":
        if (getProcessSummary) {
          const summary = getProcessSummary();
          return {
            type: "processes",
            data: summary,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          };
        } else {
          return {
            type: "processes",
            data: { processes: [], totalProcesses: 0, running: 0 },
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          };
        }
      case "getLogs":
        const { processId } = data || {};
        if (!processId) {
          return {
            type: "logs",
            status: "error",
            message: "Missing processId",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          };
        }
        if (getProcessLogs) {
          const logs = getProcessLogs(processId);
          return {
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
          };
        } else {
          return {
            type: "logs",
            processId,
            logs: [],
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          };
        }
      case "subscribeToLogs":
        const { processId: subProcessId } = data || {};
        if (!subProcessId) {
          return {
            type: "logSubscription",
            status: "error",
            message: "Missing processId",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          };
        }
        return {
          type: "logSubscription",
          status: "subscribed",
          processId: subProcessId,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
      case "sourceFilesUpdated":
        const { testName, hash, files, runtime } = data || {};
        if (!testName || !hash || !files || !runtime) {
          return {
            type: "sourceFilesUpdated",
            status: "error",
            message: "Missing required fields: testName, hash, files, or runtime",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          };
        }
        return {
          type: "sourceFilesUpdated",
          status: "success",
          testName,
          runtime,
          message: "Build update processed successfully",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
      case "getBuildListenerState":
        return {
          type: "buildListenerState",
          status: "error",
          message: "Build listener state not available",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
      case "getBuildEvents":
        return {
          type: "buildEvents",
          status: "error",
          message: "Build events not available",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
      default:
        return {
          type: "error",
          message: `Unknown message type: ${type}`,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
    }
  }
  // Helper methods for specific message types
  getProcessesResponse(processSummary) {
    return {
      type: "processes",
      data: processSummary,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  getLogsResponse(processId, logs) {
    return {
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
    };
  }
  getSourceFilesUpdatedResponse(testName, runtime, status, message) {
    return {
      type: "sourceFilesUpdated",
      status,
      testName,
      runtime,
      message: message || "Build update processed successfully",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  getErrorResponse(type, errorMessage) {
    return {
      type,
      status: "error",
      message: errorMessage,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  getSuccessResponse(type, data) {
    return {
      type,
      status: "success",
      data,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
};

// src/server/serverClasees/Server_WS.ts
var Server_WS = class extends Server_HTTP {
  constructor(configs, name, mode2, routes) {
    super(configs, name, mode2, {
      websockets: (req, res) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(generateReactAppHtml(
          "Websockets",
          "WebsocketsReactApp",
          "Websockets"
        ));
      },
      ...routes
    });
    this.wsClients = /* @__PURE__ */ new Set();
    this.ws = new WebSocketServer({
      noServer: true
    });
    this.wsManager = new WsManager();
    this.setupWebSocketHandlers();
  }
  async start() {
    console.log(`[Server_WS] start()`);
    await super.start();
    this.attachWebSocketToHttpServer(this.httpServer);
  }
  async stop() {
    console.log(`[Server_WS] stop()`);
    this.wsClients.forEach((client) => {
      client.close();
    });
    this.wsClients.clear();
    this.ws.close(() => {
      console.log("[WebSocket] Server closed");
    });
    await super.stop();
  }
  escapeXml(unsafe) {
    return this.wsManager.escapeXml(unsafe);
  }
  attachWebSocketToHttpServer(httpServer) {
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
  }
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
  setupWebSocketHandlers() {
    this.ws.on("connection", (ws, request) => {
      console.log(`[WebSocket] New connection from ${request.socket.remoteAddress}`);
      this.wsClients.add(ws);
      ws.send(JSON.stringify({
        type: "connected",
        message: "Connected to Process Manager WebSocket",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }));
      ws.send(JSON.stringify({
        type: "processes",
        data: this.getProcessSummary ? this.getProcessSummary() : { processes: [] },
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }));
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
      console.log("[WebSocket] Server closing...");
      this.wsClients.clear();
    });
  }
  handleWebSocketMessage(ws, message) {
    console.log("[WebSocket] Received message:", message.type);
    const response = this.wsManager.processMessage(
      message.type,
      message.data,
      () => this.getProcessSummary(),
      (processId) => {
        const processManager = this;
        if (typeof processManager.getProcessLogs === "function") {
          return processManager.getProcessLogs(processId);
        }
        return [];
      }
    );
    ws.send(JSON.stringify(response));
    switch (message.type) {
      case "sourceFilesUpdated":
        this.handleSourceFilesUpdatedSideEffects(ws, message.data, response);
        break;
      case "getBuildListenerState":
        this.handleGetBuildListenerStateSideEffects(ws);
        break;
      case "getBuildEvents":
        this.handleGetBuildEventsSideEffects(ws);
        break;
    }
  }
  handleSourceFilesUpdatedSideEffects(ws, data, response) {
    const { testName, hash, files, runtime } = data || {};
    if (!testName || !hash || !files || !runtime) {
      return;
    }
    console.log(`[WebSocket] Forwarding source files update to build listener for test: ${testName} (runtime: ${runtime})`);
    if (typeof this.sourceFilesUpdated === "function") {
      console.log(`[WebSocket] sourceFilesUpdated method found, calling it`);
      try {
        this.sourceFilesUpdated(testName, hash, files, runtime);
        console.log(`[WebSocket] sourceFilesUpdated called successfully`);
        this.broadcast({
          type: "sourceFilesUpdated",
          testName,
          hash,
          files,
          runtime,
          status: "processed",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          message: "Source files update processed successfully"
        });
        if (response.status === "success") {
          ws.send(JSON.stringify({
            type: "sourceFilesUpdated",
            status: "processed",
            testName,
            runtime,
            message: "Build update processed and broadcasted successfully",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }));
        }
      } catch (error) {
        console.error("[WebSocket] Error processing source files update:", error);
        ws.send(JSON.stringify({
          type: "sourceFilesUpdated",
          status: "error",
          testName,
          runtime,
          message: `Error processing build update: ${error}`,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }));
      }
    } else {
      console.warn("[WebSocket] sourceFilesUpdated method not available on this instance");
    }
  }
  handleGetBuildListenerStateSideEffects(ws) {
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
    }
  }
  handleGetBuildEventsSideEffects(ws) {
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
    }
  }
  handleGetProcesses(ws) {
    if (typeof this.getProcessSummary === "function") {
      const summary = this.getProcessSummary();
      ws.send(JSON.stringify({
        type: "processes",
        data: summary,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }));
    } else {
      ws.send(JSON.stringify({
        type: "processes",
        data: { processes: [], message: "getProcessSummary not available" },
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }));
    }
  }
  // Broadcast a message to all connected WebSocket clients
};

// src/server/serverClasees/Server_ProcessManager.ts
var Server_ProcessManager = class extends Server_WS {
  constructor(configs, testName, mode2, routes) {
    super(configs, testName, mode2, {
      "process_manager": (req, res) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(generateReactAppHtml(
          "Process Manager",
          "ProcessManagerReactApp",
          "Process Manager"
        ));
      },
      "process_manager/:runtime/:testname.xml": (req, res) => {
        const params = req.params;
        if (!params) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            error: "Route parameters not found"
          }));
          return;
        }
        const runtime = params.runtime;
        const testname = params.testname;
        if (!runtime || !testname) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            error: "Missing runtime or testname parameters"
          }));
          return;
        }
        const testnameWithoutXml = testname;
        const summary = this.getProcessSummary();
        const processes = summary.processes || [];
        const normalizedTest = testnameWithoutXml.replace(/\.[^/.]+$/, "").replace(/^example\//, "");
        const matchingProcess = processes.find((p) => {
          const processId = p.id || "";
          const processTestName = p.testName || "";
          if (processId.includes(`allTests-${runtime}-${normalizedTest}`)) {
            return true;
          }
          if (processTestName === testnameWithoutXml || processTestName === normalizedTest) {
            return true;
          }
          const testWithoutExample = testnameWithoutXml.replace(/^example\//, "");
          const testWithoutExt = testWithoutExample.replace(/\.[^/.]+$/, "");
          if (processId.includes(testWithoutExt)) {
            return true;
          }
          return false;
        });
        if (matchingProcess) {
          res.writeHead(200, { "Content-Type": "text/xml" });
          res.end(`
            <process>
              <id>${this.escapeXml(matchingProcess.id)}</id>
              <command>${this.escapeXml(matchingProcess.command)}</command>
              <status>${this.escapeXml(matchingProcess.status)}</status>
              <timestamp>${this.escapeXml(matchingProcess.timestamp)}</timestamp>
              <testName>${this.escapeXml(matchingProcess.testName)}</testName>
              <platform>${this.escapeXml(matchingProcess.platform)}</platform>
              <category>${this.escapeXml(matchingProcess.category)}</category>
            </process>
          `);
        } else {
          const processIds = processes.map((p) => p.id).join(", ");
          res.writeHead(404, { "Content-Type": "text/xml" });
          res.end(`
            <error>
              Process not found for runtime: ${runtime}, test: ${testnameWithoutXml}
              Normalized test: ${normalizedTest}
              Available process IDs: ${processIds}
            </error>
          `);
        }
      },
      ...routes
    });
    this.executeCommand = async (processId, command, category, testName, platform, options) => {
      console.log(`[ProcessManager] executeCommand called: ${processId}, ${category}, ${testName}, ${platform}`);
      console.log(`[ProcessManager] Command: ${command}`);
      console.log(`[ProcessManager] allProcesses size before: ${this.queueLength}`);
      let formattedProcessId = processId;
      if (testName && platform) {
        if (!processId.startsWith("allTests-")) {
          const baseId = `allTests-${platform}-${testName}`;
          switch (category) {
            case "bdd-test":
              formattedProcessId = `${baseId}-bdd`;
              break;
            case "aider":
              formattedProcessId = `${baseId}-aider`;
              break;
            case "build-time":
              formattedProcessId = `${baseId}-builder`;
              break;
            default:
              if (category === "other" && processId.includes("-static-")) {
                formattedProcessId = processId;
              } else {
                formattedProcessId = baseId;
              }
          }
          console.log(`[ProcessManager] Formatted process ID: ${formattedProcessId} (was: ${processId})`);
        }
      }
      const result = await this.executeCommand(
        formattedProcessId,
        command,
        category,
        testName,
        platform,
        options
      );
      console.log(`[ProcessManager] executeCommand result for ${formattedProcessId}:`, result.success ? "success" : "error");
      return result;
    };
    this.getProcessSummary = () => {
      console.log("[ProcessManager] getProcessSummary called");
      const processes = [];
      for (const [id, info] of this.jobQueue.entries()) {
        console.log(`[ProcessManager] Processing process ${id}:`, info);
        if (!id) {
          console.error(`[ProcessManager] Found process with undefined ID, info: ${info}`);
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
      const summary = {
        // totalProcesses: this.allProcesses.size,
        // running: Array.from(this.allProcesses.values()).filter(
        //   (p) => p.status === "running"
        // ).length,
        // completed: Array.from(this.allProcesses.values()).filter(
        //   (p) => p.status === "completed"
        // ).length,
        // errors: Array.from(this.allProcesses.values()).filter(
        //   (p) => p.status === "error"
        // ).length,
        // processes,
        // queueLength: this.jobQueue ? this.jobQueue.length : 0,
        // queuedItems: this.queuedItems,
      };
      return summary;
    };
    this.getProcessLogs = (processId) => {
      return this.processLogs.get(processId) || [];
    };
    this.addLogEntry = (processId, source, message, timestamp = /* @__PURE__ */ new Date(), level) => {
      if (!this.processManager.processLogs.has(processId)) {
        this.processManager.processLogs.set(processId, []);
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
      this.processManager.processLogs.get(processId).push(logEntry);
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
      const hasRunningProcesses = this.jobQueue.length > 0;
      const queueLength = this.jobQueue.length;
      if (this.shouldShutdown(summary, queueLength, hasRunningProcesses, this.mode)) {
        console.log(
          ansiC.inverse(`${this.projectName} has been tested. Goodbye.`)
        );
      }
    };
    this.processManager = new ProcessManager();
  }
  async start() {
    console.log(`[Server_ProcessManager] start()`);
    await super.start();
  }
  async stop() {
    console.log(`[Server_ProcessManager] stop()`);
    Object.values(this.processManager.logStreams || {}).forEach((logs) => logs.closeAll());
    await super.stop();
  }
  // each process is a docker command
  // processes should stay alive until the same identical processes supercedes it, 
  // where "identical processes" are processes with matching processId
  async runTestInDocker(processId, testPath, runtime, command, category = "bdd-test") {
    console.log(`[ProcessManager] runTestInDocker: ${processId}, ${testPath}, ${runtime}, ${category}`);
    let formattedProcessId = processId;
    if (!processId.startsWith("allTests-")) {
      formattedProcessId = `allTests-${runtime}-${testPath}-${category}`;
    }
    const containerName = formattedProcessId.replace(/[^a-zA-Z0-9_-]/g, "-");
    const checkCmd = `docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`;
    const checkResult = await this.executeCommand(
      `${formattedProcessId}-check`,
      checkCmd,
      category,
      testPath,
      runtime
    );
    if (checkResult.success && checkResult.stdout && checkResult.stdout.trim() === containerName) {
      console.log(`[ProcessManager] Stopping existing container ${containerName} before starting new one`);
      await this.executeCommand(
        `${formattedProcessId}-remove`,
        `docker rm -f ${containerName}`,
        category,
        testPath,
        runtime
      );
    }
    const baseImage = getRuntimeImage(runtime);
    const runOptions = category === "aider" || category === "build-time" ? "-d" : "--rm";
    const dockerRunCmd = `docker run ${runOptions}       --name ${containerName}       --network allTests_network       -v ${process.cwd()}:/workspace       -w /workspace       ${baseImage}       sh -c "${command}"`;
    console.log(`[ProcessManager] Running docker command: ${dockerRunCmd}`);
    await this.executeCommand(
      formattedProcessId,
      dockerRunCmd,
      category,
      testPath,
      runtime
    );
  }
  async enqueue(runtime, command, addableFiles = [], normalizedTestName, category = "bdd-test") {
    console.log(`[ProcessManager] enqueue called: runtime=${runtime}, command=${command}, category=${category}`);
    let testName = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const match = command.match(/example\/([^.\s]+)/);
    if (match) {
      testName = match[1];
    }
    if (normalizedTestName) {
      testName = normalizedTestName;
      console.log(`[ProcessManager] Using normalized test name: ${testName}`);
    }
    const testPath = testName;
    let processId;
    switch (category) {
      case "bdd-test":
        processId = `allTests-${runtime}-${testPath}-bdd`;
        break;
      case "aider":
        processId = `allTests-${runtime}-${testPath}-aider`;
        break;
      case "build-time":
        processId = `allTests-${runtime}-${testPath}-builder`;
        break;
      default:
        if (category === "other") {
          const staticCount = Array.from(this.jobSet.keys()).filter(
            (id) => id.startsWith(`allTests-${runtime}-${testPath}-static-`)
          ).length;
          processId = `allTests-${runtime}-${testPath}-static-${staticCount}`;
        } else {
          processId = `allTests-${runtime}-${testPath}-job`;
        }
    }
    console.log(`[ProcessManager] Created processId: ${processId} for category: ${category}`);
    if (typeof this.broadcast === "function") {
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
    } else {
      console.log(`[ProcessManager] broadcast method not available`);
    }
    if (typeof this.broadcast === "function") {
      setTimeout(() => {
        this.broadcast({
          type: "processes",
          data: this.getProcessSummary(),
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      }, 100);
    }
  }
  writeToProcessLogFile(processId, source, message, timestamp) {
    let runtime = "unknown";
    if (processId.startsWith("allTests-")) {
      const parts = processId.split("-");
      if (parts.length >= 2) {
        runtime = parts[1];
      }
    }
    const logDir = path3.join(
      process.cwd(),
      "testeranto",
      "reports",
      this.projectName,
      runtime,
      "example"
    );
    try {
      fs4.mkdirSync(logDir, { recursive: true });
    } catch (err) {
      console.error(`[ProcessManager] Failed to create log directory ${logDir}:`, err.message);
      return;
    }
    let logFileName = processId;
    if (processId.startsWith("allTests-")) {
      const withoutPrefix = processId.substring("allTests-".length);
      const firstDashIndex = withoutPrefix.indexOf("-");
      if (firstDashIndex !== -1) {
        logFileName = withoutPrefix.substring(firstDashIndex + 1);
      }
    }
    const logFile = path3.join(logDir, `${logFileName}.log`);
    const logFileDir = path3.dirname(logFile);
    try {
      fs4.mkdirSync(logFileDir, { recursive: true });
    } catch (err) {
      console.error(`[ProcessManager] Failed to create log file directory ${logFileDir}:`, err.message);
      return;
    }
    const logEntry = `[${timestamp.toISOString()}] [${source}] ${message}
`;
    try {
      fs4.appendFileSync(logFile, logEntry);
    } catch (err) {
      console.error(`[ProcessManager] Failed to write log to ${logFile}:`, err.message);
    }
  }
  allocatePorts(numPorts, testName) {
    const openPorts = Object.entries(this.processManager.ports).filter(([, status]) => status === "").map(([port]) => parseInt(port));
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
  shouldShutdown(summary, queueLength, hasRunningProcesses, mode2) {
    if (mode2 === "dev") return false;
    const inflight = Object.keys(summary).some(
      (k) => summary[k].prompt === "?" || summary[k].runTimeErrors === "?" || summary[k].staticErrors === "?" || summary[k].typeErrors === "?"
    );
    return !inflight && !hasRunningProcesses && queueLength === 0;
  }
  async startAiderProcess(testPath, runtime, command) {
    const processId = `allTests-${runtime}-${testPath}-aider`;
    console.log(`[ProcessManager] Starting aider process: ${processId}`);
    await this.runTestInDocker(
      processId,
      testPath,
      runtime,
      command,
      "aider"
    );
  }
  async startBuilderProcess(runtime, command) {
    const testPath = "builder";
    const processId = `allTests-${runtime}-${testPath}-builder`;
    console.log(`[ProcessManager] Starting builder process: ${processId}`);
    await this.runTestInDocker(
      processId,
      testPath,
      runtime,
      command,
      "build-time"
    );
  }
  async startBddTestProcess(testPath, runtime, command) {
    const processId = `allTests-${runtime}-${testPath}-bdd`;
    console.log(`[ProcessManager] Starting BDD test process: ${processId}`);
    await this.runTestInDocker(
      processId,
      testPath,
      runtime,
      command,
      "bdd-test"
    );
  }
  async startStaticTestProcess(testPath, runtime, command, index) {
    const processId = `allTests-${runtime}-${testPath}-static-${index}`;
    console.log(`[ProcessManager] Starting static test process: ${processId}`);
    await this.runTestInDocker(
      processId,
      testPath,
      runtime,
      command,
      "other"
    );
  }
};

// src/server/serverClasees/Server_BuildManager.ts
var Server_BuildManager = class extends Server_ProcessManager {
  constructor(configs, testName, mode2, routes) {
    super(configs, testName, mode2, routes);
    this.executeCommand = async (processId, command, category, testName, platform, options) => {
      console.log(`[ProcessManager] executeCommand called: ${processId}, ${category}, ${testName}, ${platform}`);
      console.log(`[ProcessManager] Command: ${command}`);
      console.log(`[ProcessManager] allProcesses size before: ${this.queueLength}`);
      let formattedProcessId = processId;
      if (testName && platform) {
        if (!processId.startsWith("allTests-")) {
          const baseId = `allTests-${platform}-${testName}`;
          switch (category) {
            case "bdd-test":
              formattedProcessId = `${baseId}-bdd`;
              break;
            case "aider":
              formattedProcessId = `${baseId}-aider`;
              break;
            case "build-time":
              formattedProcessId = `${baseId}-builder`;
              break;
            default:
              if (category === "static" && processId.includes("-static-")) {
                formattedProcessId = processId;
              } else {
                formattedProcessId = baseId;
              }
          }
          console.log(`[ProcessManager] Formatted process ID: ${formattedProcessId} (was: ${processId})`);
        }
      }
      const result = await this.executeCommand(
        formattedProcessId,
        command,
        category,
        testName,
        platform,
        options
      );
      console.log(`[ProcessManager] executeCommand result for ${formattedProcessId}:`, result.success ? "success" : "error");
      return result;
    };
    this.getProcessSummary = () => {
      console.log("[ProcessManager] getProcessSummary called");
      const processes = [];
      for (const [id, info] of this.jobQueue.entries()) {
        console.log(`[ProcessManager] Processing process ${id}:`, info);
        if (!id) {
          console.error(`[ProcessManager] Found process with undefined ID, info: ${info}`);
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
      const summary = {
        // totalProcesses: this.allProcesses.size,
        // running: Array.from(this.allProcesses.values()).filter(
        //   (p) => p.status === "running"
        // ).length,
        // completed: Array.from(this.allProcesses.values()).filter(
        //   (p) => p.status === "completed"
        // ).length,
        // errors: Array.from(this.allProcesses.values()).filter(
        //   (p) => p.status === "error"
        // ).length,
        // processes,
        // queueLength: this.jobQueue ? this.jobQueue.length : 0,
        // queuedItems: this.queuedItems,
      };
      return summary;
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
    this.checkForShutdown = async () => {
      console.log(
        ansiC2.inverse(
          `The following jobs are awaiting resources: ${JSON.stringify(
            this.getAllQueueItems()
          )}`
        )
      );
      this.writeBigBoard();
      const summary = this.getSummary();
      const hasRunningProcesses = this.jobQueue.length > 0;
      const queueLength = this.jobQueue.length;
      if (this.shouldShutdown(summary, queueLength, hasRunningProcesses, this.mode)) {
        console.log(
          ansiC2.inverse(`${this.projectName} has been tested. Goodbye.`)
        );
      }
    };
  }
  async start() {
    console.log(`[Server_BuildManager] start()`);
    super.start();
  }
  async stop() {
    console.log(`[Server_BuildManager] stop()`);
    super.stop();
  }
  // each process is a docker command
  // processes should stay alive until the same identical processes supercedes it, 
  // where "identical processes" are processes with matching processId
  async runTestInDocker(processId, testPath, runtime, command, category = "bdd-test") {
    console.log(`[ProcessManager] runTestInDocker: ${processId}, ${testPath}, ${runtime}, ${category}`);
    let formattedProcessId = processId;
    if (!processId.startsWith("allTests-")) {
      formattedProcessId = `allTests-${runtime}-${testPath}-${category}`;
    }
    const containerName = formattedProcessId.replace(/[^a-zA-Z0-9_-]/g, "-");
    const checkCmd = `docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`;
    const checkResult = await this.executeCommand(
      `${formattedProcessId}-check`,
      checkCmd,
      category,
      testPath,
      runtime
    );
    if (checkResult.success && checkResult.stdout && checkResult.stdout.trim() === containerName) {
      console.log(`[ProcessManager] Stopping existing container ${containerName} before starting new one`);
      await this.executeCommand(
        `${formattedProcessId}-remove`,
        `docker rm -f ${containerName}`,
        category,
        testPath,
        runtime
      );
    }
    const dockerRunCmd = this.buildManager.dockerRunCmd(category, command, runtime);
    await this.executeCommand(
      formattedProcessId,
      dockerRunCmd,
      category,
      testPath,
      runtime
    );
  }
  async enqueue(runtime, command, addableFiles = [], normalizedTestName, category = "bdd-test") {
    console.log(`[ProcessManager] enqueue called: runtime=${runtime}, command=${command}, category=${category}`);
    let testName = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const match = command.match(/example\/([^.\s]+)/);
    if (match) {
      testName = match[1];
    }
    if (normalizedTestName) {
      testName = normalizedTestName;
      console.log(`[ProcessManager] Using normalized test name: ${testName}`);
    }
    const testPath = testName;
    let processId;
    switch (category) {
      case "bdd-test":
        processId = `allTests-${runtime}-${testPath}-bdd`;
        break;
      case "aider":
        processId = `allTests-${runtime}-${testPath}-aider`;
        break;
      case "build-time":
        processId = `allTests-${runtime}-${testPath}-builder`;
        break;
      default:
        if (category === "static") {
          const staticCount = Array.from(this.jobSet.keys()).filter(
            (id) => id.startsWith(`allTests-${runtime}-${testPath}-static-`)
          ).length;
          processId = `allTests-${runtime}-${testPath}-static-${staticCount}`;
        } else {
          processId = `allTests-${runtime}-${testPath}-job`;
        }
    }
    console.log(`[ProcessManager] Created processId: ${processId} for category: ${category}`);
    if (typeof this.broadcast === "function") {
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
    } else {
      console.log(`[ProcessManager] broadcast method not available`);
    }
    if (typeof this.broadcast === "function") {
      setTimeout(() => {
        this.broadcast({
          type: "processes",
          data: this.getProcessSummary(),
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      }, 100);
    }
  }
  writeToProcessLogFile(processId, source, message, timestamp) {
    let runtime = "unknown";
    if (processId.startsWith("allTests-")) {
      const parts = processId.split("-");
      if (parts.length >= 2) {
        runtime = parts[1];
      }
    }
    const logDir = path4.join(
      process.cwd(),
      "testeranto",
      "reports",
      this.projectName,
      runtime,
      "example"
    );
    try {
      fs5.mkdirSync(logDir, { recursive: true });
    } catch (err) {
      console.error(`[ProcessManager] Failed to create log directory ${logDir}:`, err.message);
      return;
    }
    let logFileName = processId;
    if (processId.startsWith("allTests-")) {
      const withoutPrefix = processId.substring("allTests-".length);
      const firstDashIndex = withoutPrefix.indexOf("-");
      if (firstDashIndex !== -1) {
        logFileName = withoutPrefix.substring(firstDashIndex + 1);
      }
    }
    const logFile = path4.join(logDir, `${logFileName}.log`);
    const logFileDir = path4.dirname(logFile);
    try {
      fs5.mkdirSync(logFileDir, { recursive: true });
    } catch (err) {
      console.error(`[ProcessManager] Failed to create log file directory ${logFileDir}:`, err.message);
      return;
    }
    const logEntry = `[${timestamp.toISOString()}] [${source}] ${message}
`;
    try {
      fs5.appendFileSync(logFile, logEntry);
    } catch (err) {
      console.error(`[ProcessManager] Failed to write log to ${logFile}:`, err.message);
    }
  }
  shouldShutdown(summary, queueLength, hasRunningProcesses, mode2) {
    if (mode2 === "dev") return false;
    const inflight = Object.keys(summary).some(
      (k) => summary[k].prompt === "?" || summary[k].runTimeErrors === "?" || summary[k].staticErrors === "?" || summary[k].typeErrors === "?"
    );
    return !inflight && !hasRunningProcesses && queueLength === 0;
  }
  async startAiderProcess(testPath, runtime, command) {
    const processId = `allTests-${runtime}-${testPath}-aider`;
    await this.runTestInDocker(
      processId,
      testPath,
      runtime,
      command,
      "aider"
    );
  }
  async startBuilderProcess(runtime, command) {
    const testPath = "builder";
    const processId = `allTests-${runtime}-${testPath}-builder`;
    await this.runTestInDocker(
      processId,
      testPath,
      runtime,
      command,
      "build-time"
    );
  }
  async startBddTestProcess(testPath, runtime, command) {
    const processId = `allTests-${runtime}-${testPath}-bdd`;
    await this.runTestInDocker(
      processId,
      testPath,
      runtime,
      command,
      "bdd-test"
    );
  }
  async startStaticTestProcess(testPath, runtime, command, index) {
    const processId = `allTests-${runtime}-${testPath}-static-${index}`;
    await this.runTestInDocker(
      processId,
      testPath,
      runtime,
      command,
      "static"
    );
  }
};

// src/server/serverClasees/Server_TestManager.ts
var Server_TestManager = class extends Server_BuildManager {
  constructor(configs, testName, mode2, routes) {
    super(configs, testName, mode2, routes);
    this.executeCommand = async (processId, command, category, testName, platform, options) => {
      console.log(`[ProcessManager] executeCommand called: ${processId}, ${category}, ${testName}, ${platform}`);
      console.log(`[ProcessManager] Command: ${command}`);
      let formattedProcessId = processId;
      if (testName && platform) {
        if (!processId.startsWith("allTests-")) {
          const baseId = `allTests-${platform}-${testName}`;
          switch (category) {
            case "bdd-test":
              formattedProcessId = `${baseId}-bdd`;
              break;
            case "aider":
              formattedProcessId = `${baseId}-aider`;
              break;
            case "build-time":
              formattedProcessId = `${baseId}-builder`;
              break;
            default:
              if (category === "static" && processId.includes("-static-")) {
                formattedProcessId = processId;
              } else {
                formattedProcessId = baseId;
              }
          }
          console.log(`[ProcessManager] Formatted process ID: ${formattedProcessId} (was: ${processId})`);
        }
      }
      const result = await this.executeCommand(
        formattedProcessId,
        command,
        category,
        testName,
        platform,
        options
      );
      console.log(`[ProcessManager] executeCommand result for ${formattedProcessId}:`, result.success ? "success" : "error");
      return result;
    };
    this.getProcessSummary = () => {
      console.log("[ProcessManager] getProcessSummary called");
      const processes = [];
      for (const [id, info] of this.testManger.jobQueue.entries()) {
        console.log(`[ProcessManager] Processing process ${id}:`, info);
        if (!id) {
          console.error(`[ProcessManager] Found process with undefined ID, info: ${info}`);
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
      const summary = {
        // totalProcesses: this.allProcesses.size,
        // running: Array.from(this.allProcesses.values()).filter(
        //   (p) => p.status === "running"
        // ).length,
        // completed: Array.from(this.allProcesses.values()).filter(
        //   (p) => p.status === "completed"
        // ).length,
        // errors: Array.from(this.allProcesses.values()).filter(
        //   (p) => p.status === "error"
        // ).length,
        // processes,
        // queueLength: this.jobQueue ? this.jobQueue.length : 0,
        // queuedItems: this.queuedItems,
      };
      return summary;
    };
    this.getProcessLogs = (processId) => {
      return this.testManger.processLogs.get(processId) || [];
    };
    this.addLogEntry = (processId, source, message, timestamp = /* @__PURE__ */ new Date(), level) => {
      if (!this.testManger.processLogs.has(processId)) {
        this.testManger.processLogs.set(processId, []);
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
      this.testManger.processLogs.get(processId).push(logEntry);
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
    this.checkForShutdown = async () => {
      console.log(
        ansiC3.inverse(
          `The following jobs are awaiting resources: ${JSON.stringify(
            this.testManger.getAllQueueItems()
          )}`
        )
      );
      this.writeBigBoard();
      const summary = this.getSummary();
      const hasRunningProcesses = this.jobQueue.length > 0;
      const queueLength = this.jobQueue.length;
      if (this.shouldShutdown(summary, queueLength, hasRunningProcesses, this.mode)) {
        console.log(
          ansiC3.inverse(`${this.projectName} has been tested. Goodbye.`)
        );
      }
    };
    this.testManger = new TestManager();
  }
  async start() {
    console.log(`[Server_TestManager] start()`);
    super.start();
  }
  async stop() {
    console.log(`[Server_TestManager] stop()`);
    super.stop();
  }
  // each process is a docker command
  // processes should stay alive until the same identical processes supercedes it, 
  // where "identical processes" are processes with matching processId
  async runTestInDocker(processId, testPath, runtime, command, category = "bdd-test") {
    console.log(`[ProcessManager] runTestInDocker: ${processId}, ${testPath}, ${runtime}, ${category}`);
    let formattedProcessId = processId;
    if (!processId.startsWith("allTests-")) {
      formattedProcessId = `allTests-${runtime}-${testPath}-${category}`;
    }
    const containerName = formattedProcessId.replace(/[^a-zA-Z0-9_-]/g, "-");
    const checkCmd = `docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`;
    const checkResult = await this.executeCommand(
      `${formattedProcessId}-check`,
      checkCmd,
      category,
      testPath,
      runtime
    );
    if (checkResult.success && checkResult.stdout && checkResult.stdout.trim() === containerName) {
      console.log(`[ProcessManager] Stopping existing container ${containerName} before starting new one`);
      await this.executeCommand(
        `${formattedProcessId}-remove`,
        `docker rm -f ${containerName}`,
        category,
        testPath,
        runtime
      );
    }
    const baseImage = getRuntimeImage(runtime);
    const runOptions = category === "aider" || category === "build-time" ? "-d" : "--rm";
    const dockerRunCmd = `docker run ${runOptions}       --name ${containerName}       --network allTests_network       -v ${process.cwd()}:/workspace       -w /workspace       ${baseImage}       sh -c "${command}"`;
    console.log(`[ProcessManager] Running docker command: ${dockerRunCmd}`);
    await this.executeCommand(
      formattedProcessId,
      dockerRunCmd,
      category,
      testPath,
      runtime
    );
  }
  async enqueue(runtime, command, addableFiles = [], normalizedTestName, category = "bdd-test") {
    console.log(`[ProcessManager] enqueue called: runtime=${runtime}, command=${command}, category=${category}`);
    let testName = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const match = command.match(/example\/([^.\s]+)/);
    if (match) {
      testName = match[1];
    }
    if (normalizedTestName) {
      testName = normalizedTestName;
      console.log(`[ProcessManager] Using normalized test name: ${testName}`);
    }
    const testPath = testName;
    let processId;
    switch (category) {
      case "bdd-test":
        processId = `allTests-${runtime}-${testPath}-bdd`;
        break;
      case "aider":
        processId = `allTests-${runtime}-${testPath}-aider`;
        break;
      case "build-time":
        processId = `allTests-${runtime}-${testPath}-builder`;
        break;
      default:
        if (category === "static") {
          const staticCount = Array.from(this.testManger.jobSet.keys()).filter(
            (id) => id.startsWith(`allTests-${runtime}-${testPath}-static-`)
          ).length;
          processId = `allTests-${runtime}-${testPath}-static-${staticCount}`;
        } else {
          processId = `allTests-${runtime}-${testPath}-job`;
        }
    }
    console.log(`[ProcessManager] Created processId: ${processId} for category: ${category}`);
    if (typeof this.broadcast === "function") {
      this.broadcast({
        type: "enqueue",
        processId,
        runtime,
        command,
        testName,
        testPath,
        addableFiles,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        queueLength: this.testManger.jobQueue.length + 1
        // +1 because we're about to add this job
      });
    } else {
      console.log(`[ProcessManager] broadcast method not available`);
    }
    if (typeof this.broadcast === "function") {
      setTimeout(() => {
        this.broadcast({
          type: "processes",
          data: this.getProcessSummary(),
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      }, 100);
    }
  }
  writeToProcessLogFile(processId, source, message, timestamp) {
    let runtime = "unknown";
    if (processId.startsWith("allTests-")) {
      const parts = processId.split("-");
      if (parts.length >= 2) {
        runtime = parts[1];
      }
    }
    const logDir = path5.join(
      process.cwd(),
      "testeranto",
      "reports",
      this.projectName,
      runtime,
      "example"
    );
    try {
      fs6.mkdirSync(logDir, { recursive: true });
    } catch (err) {
      console.error(`[ProcessManager] Failed to create log directory ${logDir}:`, err.message);
      return;
    }
    let logFileName = processId;
    if (processId.startsWith("allTests-")) {
      const withoutPrefix = processId.substring("allTests-".length);
      const firstDashIndex = withoutPrefix.indexOf("-");
      if (firstDashIndex !== -1) {
        logFileName = withoutPrefix.substring(firstDashIndex + 1);
      }
    }
    const logFile = path5.join(logDir, `${logFileName}.log`);
    const logFileDir = path5.dirname(logFile);
    try {
      fs6.mkdirSync(logFileDir, { recursive: true });
    } catch (err) {
      console.error(`[ProcessManager] Failed to create log file directory ${logFileDir}:`, err.message);
      return;
    }
    const logEntry = `[${timestamp.toISOString()}] [${source}] ${message}
`;
    try {
      fs6.appendFileSync(logFile, logEntry);
    } catch (err) {
      console.error(`[ProcessManager] Failed to write log to ${logFile}:`, err.message);
    }
  }
  allocatePorts(numPorts, testName) {
    const openPorts = Object.entries(this.testManger.ports).filter(([, status]) => status === "").map(([port]) => parseInt(port));
    if (openPorts.length >= numPorts) {
      const allocatedPorts = openPorts.slice(0, numPorts);
      allocatedPorts.forEach((port) => {
        this.testManger.ports[port] = testName;
      });
      return allocatedPorts;
    }
    return null;
  }
  releasePorts(ports) {
    ports.forEach((port) => {
      this.testManger.ports[port] = "";
    });
  }
  getPortStatus() {
    return { ...this.testManger.ports };
  }
  isPortAvailable(port) {
    return this.testManger.ports[port] === "";
  }
  getPortOwner(port) {
    return this.testManger.ports[port] || null;
  }
  shouldShutdown(summary, queueLength, hasRunningProcesses, mode2) {
    if (mode2 === "dev") return false;
    const inflight = Object.keys(summary).some(
      (k) => summary[k].prompt === "?" || summary[k].runTimeErrors === "?" || summary[k].staticErrors === "?" || summary[k].typeErrors === "?"
    );
    return !inflight && !hasRunningProcesses && queueLength === 0;
  }
  async startAiderProcess(testPath, runtime, command) {
    const processId = `allTests-${runtime}-${testPath}-aider`;
    console.log(`[ProcessManager] Starting aider process: ${processId}`);
    await this.runTestInDocker(
      processId,
      testPath,
      runtime,
      command,
      "aider"
    );
  }
  async startBuilderProcess(runtime, command) {
    const testPath = "builder";
    const processId = `allTests-${runtime}-${testPath}-builder`;
    console.log(`[ProcessManager] Starting builder process: ${processId}`);
    await this.runTestInDocker(
      processId,
      testPath,
      runtime,
      command,
      "build-time"
    );
  }
  async startBddTestProcess(testPath, runtime, command) {
    const processId = `allTests-${runtime}-${testPath}-bdd`;
    console.log(`[ProcessManager] Starting BDD test process: ${processId}`);
    await this.runTestInDocker(
      processId,
      testPath,
      runtime,
      command,
      "bdd-test"
    );
  }
  async startStaticTestProcess(testPath, runtime, command, index) {
    const processId = `allTests-${runtime}-${testPath}-static-${index}`;
    console.log(`[ProcessManager] Starting static test process: ${processId}`);
    await this.runTestInDocker(
      processId,
      testPath,
      runtime,
      command,
      "static"
    );
  }
};

// src/server/serverManagers/AiderManager.ts
import * as fs7 from "fs";
import * as path6 from "path";
var AiderManager = class {
  constructor(configs, testName, mode2) {
    this.processes = /* @__PURE__ */ new Map();
    this.configs = configs;
    this.testName = testName;
    this.mode = mode2;
  }
  // Add a new aider process
  addProcess(processInfo) {
    this.processes.set(processInfo.processId, processInfo);
  }
  // Get all processes
  get entries() {
    return this.processes.entries();
  }
  // Get a specific process
  getProcess(processId) {
    return this.processes.get(processId);
  }
  // Remove a process
  removeProcess(processId) {
    return this.processes.delete(processId);
  }
  // Stop all processes
  async stopAll() {
    for (const [processId, processInfo] of this.processes) {
      await this.stopProcess(processId);
    }
  }
  // Stop a specific process
  async stopProcess(processId) {
    const processInfo = this.processes.get(processId);
    if (!processInfo) {
      return false;
    }
    try {
      if (processInfo.type === "docker" && processInfo.containerName) {
        const { exec: exec2 } = __require("child_process");
        const util = __require("util");
        const execPromise = util.promisify(exec2);
        await execPromise(`docker stop ${processInfo.containerName}`);
        await execPromise(`docker rm -f ${processInfo.containerName}`);
      } else if (processInfo.process) {
        processInfo.process.kill("SIGTERM");
        setTimeout(() => {
          if (!processInfo.process?.killed) {
            processInfo.process?.kill("SIGKILL");
          }
        }, 2e3);
      }
      processInfo.status = "stopped";
      return true;
    } catch (error) {
      console.error(`Failed to stop aider process ${processId}:`, error);
      processInfo.status = "error";
      return false;
    }
  }
  // Load API keys from .aider.conf.yml
  loadAiderApiKeys() {
    try {
      const configPath = path6.join(process.cwd(), ".aider.conf.yml");
      if (!fs7.existsSync(configPath)) {
        console.log("[AiderManager] No .aider.conf.yml file found");
        return {};
      }
      const yaml2 = __require("js-yaml");
      const config = yaml2.load(fs7.readFileSync(configPath, "utf8"));
      const apiKeys = {};
      if (config["openai-api-key"]) {
        apiKeys["OPENAI_API_KEY"] = config["openai-api-key"];
      }
      if (config["anthropic-api-key"]) {
        apiKeys["ANTHROPIC_API_KEY"] = config["anthropic-api-key"];
      }
      if (config["api-key"]) {
        if (Array.isArray(config["api-key"])) {
          config["api-key"].forEach((key, index) => {
            apiKeys[`API_KEY_${index}`] = key;
          });
        } else {
          apiKeys["API_KEY"] = config["api-key"];
        }
      }
      console.log("[AiderManager] Loaded API keys from .aider.conf.yml");
      return apiKeys;
    } catch (error) {
      console.error("[AiderManager] Failed to load API keys from .aider.conf.yml:", error);
      return {};
    }
  }
  // Build the aider base image if not already built
  async ensureAiderImage() {
    const imageName = "testeranto-aider:latest";
    const { exec: exec2 } = __require("child_process");
    const util = __require("util");
    const execPromise = util.promisify(exec2);
    try {
      const checkResult = await execPromise(`docker images -q ${imageName}`);
      if (checkResult.stdout && checkResult.stdout.trim() !== "") {
        console.log("[AiderManager] Aider base image already exists");
        return true;
      }
      console.log("[AiderManager] Building aider base image...");
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
      const tempDir = path6.join(process.cwd(), "testeranto", "temp");
      if (!fs7.existsSync(tempDir)) {
        fs7.mkdirSync(tempDir, { recursive: true });
      }
      const dockerfilePath = path6.join(tempDir, "Dockerfile.aider");
      fs7.writeFileSync(dockerfilePath, dockerfileContent);
      await execPromise(`docker build -t ${imageName} -f ${dockerfilePath} ${tempDir}`);
      console.log("[AiderManager] Aider base image built successfully");
      return true;
    } catch (error) {
      console.error("[AiderManager] Failed to build aider base image:", error);
      return false;
    }
  }
};

// src/server/serverClasees/Server_AiderManager.ts
var Server_AiderManager = class extends Server_TestManager {
  constructor(configs, name, mode2, routes) {
    super(configs, name, mode2, routes);
    this.aider = new AiderManager(configs, name, mode2);
  }
  async start() {
    console.log(`[Server_AiderManager] start()`);
    super.start();
  }
  async stop() {
    console.log(`[Server_AiderManager] stop()`);
    this.aider.stopAll();
    super.stop();
  }
  // Create aider process for a specific test as a background command
  async createAiderProcess(runtime, testPath, sourceFiles) {
    const processId = `allTests-${runtime}-${testPath}-aider`;
    console.log(`[Server_AiderManager] Creating aider Docker container: ${processId}`);
    const imageReady = await this.aider.ensureAiderImage();
    if (!imageReady) {
      console.error("[Server_AiderManager] Cannot create aider container: base image not available");
      this.addLogEntry(processId, "error", "Failed to build aider base image", /* @__PURE__ */ new Date(), "error");
      return;
    }
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
      console.log(`[Server_AiderManager] Aider container ${containerName} is already running, skipping creation`);
      this.addLogEntry(processId, "stdout", `Aider Docker container already running: ${containerName}`, /* @__PURE__ */ new Date(), "info");
      const processInfo2 = {
        processId,
        containerName,
        status: "running",
        command: "docker container already running",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        type: "docker",
        category: "aider",
        testName: testPath,
        platform: runtime
      };
      this.aider.addProcess(processInfo2);
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
      console.log(`[Server_AiderManager] Container ${containerName} exists but is not running, removing...`);
      const removeResult = await this.executeCommand(
        `${processId}-remove`,
        `docker rm -f ${containerName}`,
        "aider",
        testPath,
        runtime
      );
      if (!removeResult.success) {
        console.error(`[Server_AiderManager] Failed to remove existing container ${containerName}:`, removeResult.error);
      } else {
        console.log(`[Server_AiderManager] Removed existing container ${containerName}`);
      }
    }
    const apiKeys = this.aider.loadAiderApiKeys();
    const envVars = Object.entries(apiKeys).map(([key, value]) => `-e ${key}=${value}`);
    const dockerArgs = [
      "docker",
      "run",
      "-d",
      "--name",
      containerName,
      "-v",
      `${process.cwd()}:/workspace`,
      "-w",
      "/workspace",
      "--network",
      "allTests_network",
      ...envVars,
      "testeranto-aider:latest",
      ...sourceFiles
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
      processId,
      containerName,
      status: result.success ? "running" : "error",
      command,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      type: "docker",
      category: "aider",
      testName: testPath,
      platform: runtime
    };
    this.aider.addProcess(processInfo);
    if (result.success) {
      this.addLogEntry(processId, "stdout", `Aider Docker container started: ${containerName}`, /* @__PURE__ */ new Date(), "info");
      console.log(`[Server_AiderManager] Aider Docker container ${containerName} started`);
      setTimeout(async () => {
        await this.executeCommand(
          `${processId}-logs`,
          `docker logs ${containerName}`,
          "aider",
          testPath,
          runtime
        );
      }, 2e3);
    } else {
      this.addLogEntry(processId, "error", `Failed to start aider Docker container: ${result.error}`, /* @__PURE__ */ new Date(), "error");
      console.error(`[Server_AiderManager] Failed to start aider Docker container:`, result.error);
    }
    const connectionInfo = `To connect to this aider session, use: docker exec -it ${containerName} /bin/bash`;
    this.addLogEntry(processId, "stdout", connectionInfo, /* @__PURE__ */ new Date(), "info");
    const vscodeCommand = `docker exec -it ${containerName} bash -c "aider --yes --dark-mode ${sourceFiles.join(" ")}"`;
    this.addLogEntry(processId, "stdout", `VS Code terminal command: ${vscodeCommand}`, /* @__PURE__ */ new Date(), "info");
  }
};

// src/server/serverClasees/Server_Scheduler.ts
var Server_Scheduler = class extends Server_AiderManager {
  constructor(configs, name, mode2, routes) {
    super(configs, name, mode2, routes);
  }
  async start() {
    console.log(`[Server_Scheduler] start()`);
    super.start();
  }
  async stop() {
    console.log(`[Server_Scheduler] stop()`);
    super.stop();
  }
  async scheduleBddTest(entrypoint, runtime, sourceFiles) {
    console.log(
      `[Scheduler] scheduleBddTest called for ${entrypoint} (${runtime})`
    );
    try {
      await this.createAiderProcess(runtime, entrypoint, sourceFiles);
    } catch (error) {
      console.error(`[Scheduler] Error creating aider process:`, error);
    }
    const processId = `allTests-${runtime}-${entrypoint}-bdd`;
    if (runtime === "node") {
      super.runTestInDocker(processId, entrypoint, runtime, nodeBddCommand(this.configs.httpPort));
    } else if (runtime === "web") {
      super.runTestInDocker(processId, entrypoint, runtime, webBddCommand(this.configs.httpPort));
    } else if (runtime === "python") {
      super.runTestInDocker(processId, entrypoint, runtime, pythonBDDCommand(this.configs.httpPort));
    } else if (runtime === "golang") {
      super.runTestInDocker(processId, entrypoint, runtime, golangBddCommand(this.configs.httpPort));
    } else {
      throw "unknown runtime";
    }
  }
  async scheduleStaticTests(entrypoint, runtime, sourceFiles) {
    console.log(`[Scheduler] scheduleStaticTests( ${runtime}, ${entrypoint}, ${sourceFiles})`);
    this.configs[runtime][entrypoint].checks.forEach((c, ndx) => {
      const processId = `allTests-${runtime}-${entrypoint}-static-${ndx}`;
      super.runTestInDocker(processId, entrypoint, runtime, c(sourceFiles));
    });
  }
};

// src/server/serverClasees/Server_BuildListener.ts
var Server_BuildListener = class extends Server_Scheduler {
  constructor(configs, name, mode2) {
    super(configs, name, mode2, {
      build_listener: (req, res) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(generateReactAppHtml(
          "Build Listener",
          "BuildListenerReactApp",
          "Build Listener"
        ));
      }
    });
    // Map test name to IHashes
    this.hashes = /* @__PURE__ */ new Map();
    // Store build events for UI
    this.buildEvents = [];
    // Maximum number of events to keep
    this.maxEvents = 100;
  }
  sourceFilesUpdated(testName, hash, files, runtime) {
    if (!runtime) {
      console.error(`[BuildListener] No runtime provided for test: ${testName}. Cannot track or schedule tests.`);
      return;
    }
    const testKey = `${runtime}:${testName}`;
    console.log(`[BuildListener] Source files updated for test: ${testKey}, hash: ${hash}`);
    const previousHash = this.hashes.has(testKey) ? this.hashes.get(testKey)?.hash : null;
    this.hashes.set(testKey, { hash, files });
    const event = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      testName,
      hash,
      files,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      status: "pending",
      message: `Build update received for ${testKey}`,
      runtime
    };
    this.addBuildEvent(event);
    if (previousHash !== hash) {
      console.log(`[BuildListener] Hash changed for ${testKey}. Scheduling tests...`);
      event.status = "processing";
      event.message = `Hash changed for ${testKey}. Scheduling tests...`;
      this.updateBuildEvent(event);
      this.scheduleBddTest(testName, runtime, files);
      this.scheduleStaticTests(testName, runtime, files);
      event.status = "scheduled";
      event.message = `Test ${testKey} scheduled for execution`;
      this.updateBuildEvent(event);
      this.broadcastBuildUpdate(testName, hash, files, runtime);
    } else {
      console.log(`[BuildListener] Hash unchanged for ${testKey}. No action needed.`);
      event.status = "completed";
      event.message = `Hash unchanged for ${testKey}. No action needed.`;
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
  broadcastBuildUpdate(testName, hash, files, runtime) {
    if (typeof this.broadcast === "function") {
      const testKey = runtime ? `${runtime}:${testName}` : testName;
      this.broadcast({
        type: "buildUpdate",
        testKey,
        testName,
        hash,
        files,
        runtime,
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
      hashes: Array.from(this.hashes.entries()).map(([testKey, data]) => {
        const [runtime, testName] = testKey.split(":", 2);
        return {
          testKey,
          runtime,
          testName,
          hash: data.hash,
          fileCount: data.files.length
        };
      }),
      recentEvents: this.buildEvents.slice(0, 10),
      // Last 10 events
      totalEvents: this.buildEvents.length,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  async start() {
    console.log(`[Server_BuildListener] start()`);
    super.start();
  }
  async stop() {
    console.log(`[Server_BuildListener] stop()`);
    super.stop();
  }
};

// src/server/serverClasees/Server.ts
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);
var Server = class extends Server_BuildListener {
  constructor(configs, testName, mode2) {
    super(configs, testName, mode2);
    console.log("[Server] Press 'q' to initiate a graceful shutdown.");
    console.log("[Server] Press 'CTRL + c' to quit forcefully.");
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
    console.log(`[Server] start()`);
    await super.start();
  }
  async stop() {
    console.log(`[Server] stop()`);
    await super.stop();
  }
};

// src/testeranto.ts
if (!process.argv[2]) {
  console.error(`The 2nd argument should be a testeranto config file name.`);
  process.exit(-1);
}
var configFilepath = process.argv[2];
var testsName = path7.basename(configFilepath).split(".").slice(0, -1).join(".");
var mode = process.argv[3];
if (mode !== "once" && mode !== "dev") {
  console.error(`The 3rd argument should be 'dev' or 'once', not '${mode}'.`);
  process.exit(-1);
}
import(`${process.cwd()}/${configFilepath}`).then(async (module) => {
  const bigConfig = module.default;
  const config = {
    ...bigConfig,
    buildDir: process.cwd() + "/testeranto/bundles/" + testsName
  };
  await new Server(config, testsName, mode).start();
});
