// src/testeranto.ts
import path3 from "path";

// src/server/serverClasees/Server.ts
import fs3 from "fs";
import readline from "readline";

// src/server/serverClasees/Server_Docker.ts
import ansiColors from "ansi-colors";
import { exec, execSync, spawn } from "child_process";
import fs2 from "fs";
import yaml from "js-yaml";
import path2 from "path";
import { promisify } from "util";

// src/server/runtimes/golang/docker.ts
var golangDockerComposeFile = (config, projectName) => {
  return {
    build: {
      context: process.cwd(),
      dockerfile: config.golang.dockerfile
    },
    container_name: `golang-builder-${projectName}`,
    environment: {
      NODE_ENV: "production",
      ...config.env
    },
    working_dir: "/workspace",
    volumes: [
      `${process.cwd()}/src:/workspace/src`,
      `${process.cwd()}/example:/workspace/example`,
      `${process.cwd()}/dist:/workspace/dist`,
      `${process.cwd()}/testeranto:/workspace/testeranto`
    ],
    command: golangBuildCommand()
  };
};
var golangBuildCommand = () => {
  return "go run src/server/runtimes/golang/main.go";
};
var golangBddCommand = () => {
  const jsonStr = JSON.stringify({ ports: [1111] });
  return `go run example/cmd/calculator-test`;
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
      `${process.cwd()}/dist:/workspace/dist`,
      `${process.cwd()}/testeranto:/workspace/testeranto`
    ],
    command: nodeBuildCommand(config.httpPort || 3456)
  };
};
var nodeBuildCommand = (port) => {
  return `yarn tsx src/server/runtimes/node/node.ts /workspace/testeranto/runtimes/node/node.js`;
};
var nodeBddCommand = (port) => {
  const jsonStr = JSON.stringify({ ports: [1111] });
  return `node testeranto/bundles/allTests/node/example/Calculator.test.mjs /workspace/node.js '${jsonStr}' || echo "Build process exited with code $?, but keeping container alive for health checks";`;
};

// src/server/runtimes/python/docker.ts
var pythonDockerComposeFile = (config, projectName) => {
  return {
    build: {
      context: process.cwd(),
      dockerfile: config.python.dockerfile
    },
    container_name: `python-builder-${projectName}`,
    environment: {
      NODE_ENV: "production",
      ...config.env
    },
    working_dir: "/workspace",
    volumes: [
      `${process.cwd()}/src:/workspace/src`,
      `${process.cwd()}/example:/workspace/example`,
      `${process.cwd()}/dist:/workspace/dist`,
      `${process.cwd()}/testeranto:/workspace/testeranto`
    ],
    command: pythonBuildCommand()
  };
};
var pythonBuildCommand = () => {
  return `python src/server/runtimes/python/pitono.py`;
};
var pythonBDDCommand = (port) => {
  return `python /workspace/testeranto/bundles/allTests/python/Calculator.pitono.test.bundle.py`;
};

// src/server/runtimes/ruby/docker.ts
var rubyDockerComposeFile = (config, projectName) => {
  return {
    build: {
      context: process.cwd(),
      dockerfile: config.ruby?.dockerfile || "testeranto/runtimes/ruby/ruby.Dockerfile"
    },
    container_name: `ruby-builder-${projectName}`,
    environment: {
      NODE_ENV: "production",
      ...config.env
    },
    working_dir: "/workspace",
    volumes: [
      `${process.cwd()}/src:/workspace/src`,
      `${process.cwd()}/example:/workspace/example`,
      `${process.cwd()}/dist:/workspace/dist`,
      `${process.cwd()}/testeranto:/workspace/testeranto`
    ],
    command: rubyBuildCommand()
  };
};
var rubyBuildCommand = () => {
  return `ls; pwd; `;
};
var rubyBddCommand = () => {
  const jsonStr = JSON.stringify({ ports: [1111] });
  return `ruby example/Calculator-test.rb '${jsonStr}'`;
};

// src/server/runtimes/web/docker.ts
var webDockerComposeFile = (config, projectName) => {
  const service = {
    build: {
      context: process.cwd(),
      dockerfile: config.web.dockerfile
    },
    container_name: `web-builder-${projectName}`,
    environment: {
      NODE_ENV: "production",
      DOCKER_ENV: "true",
      // CHROME_HOST: `web-builder`,
      ...config.env
    },
    working_dir: "/workspace",
    volumes: [
      `${process.cwd()}/src:/workspace/src`,
      `${process.cwd()}/example:/workspace/example`,
      `${process.cwd()}/dist:/workspace/dist`,
      `${process.cwd()}/testeranto:/workspace/testeranto`
    ],
    // Expose port 9222 for Chrome DevTools Protocol
    // This allows other containers to connect to Chrome
    // Use 'expose' to make the port available to linked containers
    // and 'ports' to also expose to the host for debugging
    command: webBuildCommand()
  };
  return service;
};
var webBuildCommand = () => {
  return `yarn tsx src/server/runtimes/web/web.ts testeranto/runtimes/web/web.js`;
};
var webBddCommand = () => {
  return `yarn tsx  src/server/runtimes/web/hoist.ts testeranto/bundles/allTests/web/example/Calculator.test.mjs`;
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
  staticTestDockerComposeFile(config, runtime, container_name, command) {
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
      working_dir: "/workspace",
      command
    };
  }
  bddTestDockerComposeFile(config, runtime, container_name, command) {
    const service = {
      build: {
        context: process.cwd(),
        dockerfile: `${config[runtime].dockerfile}`
      },
      container_name,
      environment: {
        NODE_ENV: "production",
        ...config.env
      },
      working_dir: "/workspace",
      volumes: [
        `${process.cwd()}/src:/workspace/src`,
        `${process.cwd()}/example:/workspace/example`,
        `${process.cwd()}/dist:/workspace/dist`,
        `${process.cwd()}/testeranto:/workspace/testeranto`
      ],
      // ports: [
      //   "9222:9222"
      // ],
      command
    };
    return service;
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
    services["browser"] = {
      image: "browserless/chrome:latest",
      container_name: "browser-allTests",
      environment: {
        CONNECTION_TIMEOUT: "60000",
        MAX_CONCURRENT_SESSIONS: "10",
        ENABLE_CORS: "true",
        TOKEN: ""
      },
      ports: [
        "3000:3000",
        "9222:9222"
      ],
      networks: ["default"]
      // healthcheck: {
      //   test: ["CMD", "curl", "-f", "http://localhost:3000h"],
      //   interval: "30s",
      //   timeout: "10s",
      //   retries: 3,
      //   start_period: "40s"
      // }
    };
    for (const runtime of runtimes) {
      if (runtime === "node") {
        services[`${runtime}-builder`] = nodeDockerComposeFile(config, "allTests");
      } else if (runtime === "web") {
        services[`${runtime}-builder`] = webDockerComposeFile(config, "allTests");
      } else if (runtime === "golang") {
        services[`${runtime}-builder`] = golangDockerComposeFile(config, "allTests");
      } else if (runtime === "python") {
        services[`${runtime}-builder`] = pythonDockerComposeFile(config, "allTests");
      } else if (runtime === "ruby") {
        services[`${runtime}-builder`] = rubyDockerComposeFile(config, "allTests");
      } else {
        throw `unknown runtime ${runtime}`;
      }
      for (const test in config[runtime].tests) {
        const uid = `${runtime}-${test.toLowerCase().replaceAll("/", "_").replaceAll(".", "-")}`;
        for (const [index, check] of config[runtime].checks.entries()) {
          const tuid = `${uid}-static-${index}`;
          const checkCommand = typeof check === "function" ? check(test) : check;
          services[tuid] = this.staticTestDockerComposeFile(config, runtime, tuid, checkCommand);
        }
        let bddCommand = "";
        if (runtime === "node") {
          bddCommand = nodeBddCommand(config.httpPort || 3456);
        } else if (runtime === "web") {
          bddCommand = webBddCommand();
        } else if (runtime === "golang") {
          bddCommand = golangBddCommand();
        } else if (runtime === "python") {
          bddCommand = pythonBDDCommand(0);
        } else if (runtime === "ruby") {
          bddCommand = rubyBddCommand();
        }
        services[`${uid}-bdd`] = this.bddTestDockerComposeFile(config, runtime, `${uid}-bdd`, bddCommand);
        services[`${uid}-aider`] = this.aiderDockerComposeFile(config, runtime, `${uid}-aider`);
      }
    }
    for (const serviceName in services) {
      if (!services[serviceName].networks) {
        services[serviceName].networks = ["default"];
      }
    }
    console.log(JSON.stringify(services, null, 2));
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

// src/server/serverClasees/Server_WS.ts
import { WebSocket, WebSocketServer } from "ws";

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

// src/server/serverClasees/Server_HTTP.ts
import fs from "fs";
import http from "http";
import path from "path";

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

// src/server/serverClasees/Server_Base.ts
var Server_Base = class {
  constructor(configs, projectName, mode2) {
    this.configs = configs;
    this.mode = mode2;
    this.projectName = projectName;
    this.configsV2 = ["node.js", "web.js", "golang.go", "python.py"];
  }
  async start() {
    console.log(`[Server_Base] start()`);
  }
  async stop() {
    console.log(`[Server_Base] stop()`);
    process.exit();
  }
};

// src/server/serverClasees/Server_HTTP.ts
var Server_HTTP = class extends Server_Base {
  constructor(configs, name, mode2) {
    super(configs, name, mode2);
    this.http = new HttpManager();
    this.httpServer = http.createServer();
    this.httpServer.on("error", (error) => {
      console.error(`[HTTP] error:`, error);
    });
    this.httpServer.on("request", this.handleHttpRequest.bind(this));
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
    const filePath = path.join(projectRoot, normalizedPath);
    if (!filePath.startsWith(path.resolve(projectRoot))) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    fs.stat(filePath, (err, stats) => {
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
        fs.readdir(filePath, (readErr, files) => {
          if (readErr) {
            res.writeHead(500);
            res.end(`Server Error: ${readErr.message}`);
            return;
          }
          const items = files.map((file) => {
            try {
              const stat = fs.statSync(path.join(filePath, file));
              const isDir = stat.isDirectory();
              const slash = isDir ? "/" : "";
              return `<li><a href="${path.join(
                normalizedPath,
                file
              )}${slash}">${file}${slash}</a></li>`;
            } catch {
              return `<li><a href="${path.join(
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
    fs.readFile(filePath, (err, data) => {
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

// src/server/serverClasees/Server_WS.ts
var Server_WS = class extends Server_HTTP {
  constructor(configs, name, mode2) {
    super(configs, name, mode2);
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
};

// src/server/serverClasees/Server_Docker.ts
var Server_Docker = class extends Server_WS {
  constructor(configs, projectName, mode2) {
    super(configs, projectName, mode2);
    this.dockerManager = new DockerManager(path2.join(
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
    const baseReportsDir = path2.join(process.cwd(), "testeranto", "reports");
    try {
      fs2.mkdirSync(baseReportsDir, { recursive: true });
      console.log(`[Server_Docker] Created base reports directory: ${baseReportsDir}`);
    } catch (error) {
      console.error(`[Server_Docker] Failed to create base reports directory ${baseReportsDir}: ${error.message}`);
    }
    console.log(`[Server_Docker] Dropping everything...`);
    try {
      const downCmd = `docker compose -f "${this.dockerManager.composeFile}" down -v --remove-orphans`;
      console.log(`[Server_Docker] Running: ${downCmd}`);
      await this.spawnPromise(downCmd);
      console.log(`[Server_Docker] Docker compose down completed`);
    } catch (error) {
      console.log(`[Server_Docker] Docker compose down noted: ${error.message}`);
    }
    const runtimes = ["node", "web", "golang", "python", "ruby"];
    for (const runtime of runtimes) {
      const serviceName = `${runtime}-builder`;
      console.log(`[Server_Docker] Starting builder service: ${serviceName}`);
      try {
        await this.spawnPromise(`docker compose -f "${this.dockerManager.composeFile}" up -d ${serviceName}`);
      } catch (error) {
        console.error(`[Server_Docker] Failed to start ${serviceName}: ${error.message}`);
      }
    }
    console.log(`[Server_Docker] Starting browser service...`);
    try {
      await this.spawnPromise(`docker compose -f "${this.dockerManager.composeFile}" up -d browser`);
    } catch (error) {
      console.error(`[Server_Docker] Failed to start browser service: ${error.message}`);
    }
    console.log(`[Server_Docker] Waiting for browser container to be healthy...`);
    await this.waitForContainerHealthy("browser-allTests", 6e4);
    for (const runtime of runtimes) {
      let ext = "";
      if (runtime === "node") {
        ext = "ts";
      } else if (runtime === "web") {
        ext = "ts";
      } else if (runtime === "golang") {
        ext = "go";
      } else if (runtime === "python") {
        ext = "py";
      } else if (runtime === "ruby") {
        ext = "rb";
      }
      const aiderServiceName = `${runtime}-example_calculator-test-${ext}-aider`;
      console.log(`[Server_Docker] Starting aider service: ${aiderServiceName}`);
      try {
        await this.spawnPromise(`docker compose -f "${this.dockerManager.composeFile}" up -d ${aiderServiceName}`);
      } catch (error) {
        console.error(`[Server_Docker] Failed to start ${aiderServiceName}: ${error.message}`);
      }
    }
    for (const runtime of runtimes) {
      const tests = this.configs[runtime]?.tests;
      if (!tests) continue;
      for (const testName in tests) {
        const uid = `${runtime}-${testName.toLowerCase().replaceAll("/", "_").replaceAll(".", "-")}`;
        const bddServiceName = `${uid}-bdd`;
        const reportDir = "testeranto/reports/allTests/example/";
        try {
          fs2.mkdirSync(reportDir, { recursive: true });
          console.log(`[Server_Docker] Created report directory: ${reportDir} for test ${testName} and runtime ${runtime}`);
        } catch (error) {
          console.error(`[Server_Docker] Failed to create report directory ${reportDir}: ${error.message}`);
        }
        console.log(`[Server_Docker] Starting BDD service: ${bddServiceName}`);
        try {
          await this.spawnPromise(`docker compose -f "${this.dockerManager.composeFile}" up -d ${bddServiceName}`);
        } catch (error) {
          console.error(`[Server_Docker] Failed to start ${bddServiceName}: ${error.message}`);
        }
      }
    }
    for (const runtime of runtimes) {
      const tests = this.configs[runtime]?.tests;
      if (!tests) continue;
      for (const testName in tests) {
        const uid = `${runtime}-${testName.toLowerCase().replaceAll("/", "_").replaceAll(".", "-")}`;
        const checks = this.configs[runtime]?.checks || [];
        for (let i = 0; i < checks.length; i++) {
          const staticServiceName = `${uid}-static-${i}`;
          console.log(`[Server_Docker] Starting static test service: ${staticServiceName}`);
          try {
            await this.spawnPromise(`docker compose -f "${this.dockerManager.composeFile}" up -d ${staticServiceName}`);
          } catch (error) {
            console.error(`[Server_Docker] Failed to start ${staticServiceName}: ${error.message}`);
          }
        }
      }
    }
  }
  async waitForContainerHealthy(containerName, timeoutMs) {
    const startTime = Date.now();
    const checkInterval = 2e3;
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
    const composeDir = path2.join(process.cwd(), "testeranto", "bundles");
    try {
      fs2.mkdirSync(composeDir, { recursive: true });
      const runtimes = ["node", "web", "golang", "python", "ruby"];
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
    const composeFilePath = path2.join(
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
  getProcessSummary() {
    console.log(`[Server_Docker] getProcessSummary called`);
    try {
      const output = execSync('docker ps --format "{{.Names}}|{{.Image}}|{{.Status}}|{{.Ports}}|{{.State}}|{{.Command}}"').toString();
      const processes = output.trim().split("\n").filter((line) => line.trim()).map((line) => {
        const parts = line.split("|");
        const [name, image, status, ports, state, command] = parts;
        return {
          processId: name,
          command: command || image,
          image,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          status,
          state,
          ports,
          // Add additional fields that might be useful for the frontend
          runtime: this.getRuntimeFromName(name),
          health: "unknown"
          // We could add health check status here
        };
      });
      return {
        processes,
        total: processes.length,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      console.error(`[Server_Docker] Error getting docker processes: ${error.message}`);
      return {
        processes: [],
        total: 0,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        error: error.message
      };
    }
  }
  getRuntimeFromName(name) {
    if (name.includes("node")) return "node";
    if (name.includes("web")) return "web";
    if (name.includes("golang")) return "golang";
    if (name.includes("python")) return "python";
    if (name.includes("ruby")) return "ruby";
    if (name.includes("browser")) return "browser";
    return "unknown";
  }
};

// src/server/serverClasees/Server.ts
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);
var Server = class extends Server_Docker {
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
    const runtimesDir = `testeranto/runtimes/`;
    fs3.mkdirSync(runtimesDir, { recursive: true });
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
var testsName = path3.basename(configFilepath).split(".").slice(0, -1).join(".");
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
