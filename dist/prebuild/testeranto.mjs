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

// src/runtimes.ts
var RUN_TIMES = ["node", "web", "python", "golang", "java", "rust", "ruby"];

// src/server/runtimes/golang/docker.ts
var golangDockerComposeFile = (config, container_name) => {
  return {
    build: {
      context: process.cwd(),
      dockerfile: config[container_name].dockerfile
    },
    container_name,
    environment: {
      // NODE_ENV: "production",
      // ...config.env,
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

// src/server/runtimes/java/docker.ts
var javaDockerComposeFile = (config, container_name, fpath) => {
  return {
    build: {
      context: process.cwd(),
      dockerfile: config[container_name].dockerfile
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
    command: javaBuildCommand(fpath)
  };
};
var javaBuildCommand = (fpath) => {
  return `java src/server/runtimes/java/java.java /workspace/${fpath}`;
};
var javaBddCommand = (fpath) => {
  return `java testeranto/bundles/java/${fpath} /workspace/java.java`;
};

// src/server/runtimes/node/docker.ts
var nodeDockerComposeFile = (config, container_name, projectConfigPath, nodeConfigPath, testName) => {
  return {
    build: {
      context: process.cwd(),
      dockerfile: config[container_name].dockerfile
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
    command: nodeBuildCommand(projectConfigPath, nodeConfigPath, testName)
  };
};
var nodeBuildCommand = (projectConfigPath, nodeConfigPath, testName) => {
  return `yarn tsx node_modules/testeranto/src/server/runtimes/node/node.ts /workspace/testeranto/testeranto.ts /workspace/${nodeConfigPath} ${testName}`;
};
var nodeBddCommand = (fpath, nodeConfigPath) => {
  return `yarn tsx testeranto/bundles/allTests/node/src/ts/Calculator.test.mjs /workspace/${nodeConfigPath}`;
};

// src/server/runtimes/python/docker.ts
var pythonDockerComposeFile = (config, container_name, fpath) => {
  return {
    build: {
      context: `${process.cwd()}/example`,
      dockerfile: config[container_name].dockerfile
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
    command: pythonBuildCommand(fpath)
  };
};
var pythonBuildCommand = (fpath) => {
  return `python src/server/runtimes/python/pitono.py /workspace/${fpath}`;
};
var pythonBddCommand = (fpath) => {
  const jsonStr = JSON.stringify({ ports: [1111] });
  return `python ${fpath} '${jsonStr}'`;
};

// src/server/runtimes/ruby/docker.ts
var rubyDockerComposeFile = (config, container_name, projectConfigPath, rubyConfigPath, testName) => {
  return {
    build: {
      context: process.cwd(),
      dockerfile: config[container_name].dockerfile
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
    command: rubyBuildCommand(projectConfigPath, rubyConfigPath, testName)
  };
};
var rubyBuildCommand = (projectConfigPath, rubyConfigPath, testName) => {
  return `bundle exec rubeno /workspace/testeranto/testeranto.ts /workspace/${rubyConfigPath} ${testName}`;
};
var rubyBddCommand = (fpath) => {
  const jsonStr = JSON.stringify({ ports: [1111] });
  return `ruby ${fpath} '${jsonStr}'`;
};

// src/server/runtimes/rust/docker.ts
var rustDockerComposeFile = (config, container_name, fpath) => {
  return {
    build: {
      context: `${process.cwd()}`,
      dockerfile: config[container_name].dockerfile
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
    command: rustBuildCommand(fpath)
  };
};
var rustBuildCommand = (fpath) => {
  return `sh -c "CONFIG_PATH=/workspace/${fpath} cargo build --release && ./target/release/my_program"`;
};
var rustBddCommand = (fpath) => {
  return `rustc testeranto/bundles/rust/${fpath} /workspace/rust.rs`;
};

// src/server/runtimes/web/docker.ts
var webDockerComposeFile = (config, container_name, fpath) => {
  return {
    platform: "linux/arm64",
    build: {
      context: process.cwd(),
      dockerfile: config[container_name].dockerfile
    },
    container_name,
    environment: {
      // NODE_ENV: "production",
      // ...config.env,
    },
    working_dir: "/workspace",
    volumes: [
      `${process.cwd()}/src:/workspace/src`,
      `${process.cwd()}/example:/workspace/example`,
      `${process.cwd()}/dist:/workspace/dist`,
      `${process.cwd()}/testeranto:/workspace/testeranto`
    ],
    command: webBuildCommand(fpath)
  };
};
var webBuildCommand = (fpath) => {
  return `yarn tsx src/server/runtimes/web/web.ts /workspace/${fpath}`;
};
var webBddCommand = (fpath) => {
  return `node dist/prebuild/server/runtimes/web/hoist.mjs `;
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

// src/server/serverClasees/Server_Base.ts
var Server_Base = class {
  constructor(configs, mode2) {
    this.configs = configs;
    this.mode = mode2;
    console.log(`[Base] ${this.configs}`);
  }
  async start() {
  }
  async stop() {
    console.log(`[Server_Base] stop()`);
    process.exit();
  }
};

// src/server/serverClasees/Server_HTTP.ts
var Server_HTTP = class extends Server_Base {
  constructor(configs, mode2) {
    super(configs, mode2);
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
        console.log(`[HTTP] HTTP server is now listening on ${addr}`);
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
  constructor(configs, mode2) {
    super(configs, mode2);
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
  constructor(configs, mode2) {
    super(configs, mode2);
    this.logProcesses = /* @__PURE__ */ new Map();
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
        allTests_network: {
          driver: "bridge"
        }
      }
    };
  }
  staticTestDockerComposeFile(runtime, container_name, command) {
    let dockerfilePath = "";
    for (const [key, value] of Object.entries(this.configs.runtimes)) {
      if (value.runtime === runtime) {
        dockerfilePath = value.dockerfile;
        break;
      }
    }
    if (!dockerfilePath) {
      throw `[Docker] [staticTestDockerComposeFile] no dockerfile found for ${dockerfilePath}, ${Object.entries(this.configs)}`;
    }
    return {
      build: {
        context: process.cwd(),
        dockerfile: dockerfilePath
      },
      container_name,
      environment: {
        // NODE_ENV: "production",
        // ...config.env,
      },
      working_dir: "/workspace",
      command,
      networks: ["allTests_network"]
    };
  }
  bddTestDockerComposeFile(runtime, container_name, command) {
    let dockerfilePath = "";
    for (const [key, value] of Object.entries(this.configs.runtimes)) {
      if (value.runtime === runtime) {
        dockerfilePath = value.dockerfile;
        break;
      }
    }
    if (!dockerfilePath) {
      throw `[Docker] [bddTestDockerComposeFile] no dockerfile found for ${dockerfilePath}, ${Object.entries(this.configs)}`;
    }
    const service = {
      build: {
        context: process.cwd(),
        dockerfile: dockerfilePath
      },
      container_name,
      environment: {
        // NODE_ENV: "production",
        // ...config.env,
      },
      working_dir: "/workspace",
      volumes: [
        `${process.cwd()}/src:/workspace/src`,
        `${process.cwd()}/example:/workspace/example`,
        `${process.cwd()}/dist:/workspace/dist`,
        `${process.cwd()}/testeranto:/workspace/testeranto`
      ],
      command,
      networks: ["allTests_network"]
    };
    return service;
  }
  aiderDockerComposeFile(container_name) {
    return {
      build: {
        context: process.cwd(),
        dockerfile: "aider.Dockerfile"
      },
      container_name,
      environment: {
        // NODE_ENV: "production",
        // ...config.env,
      },
      working_dir: "/workspace",
      command: "aider",
      networks: ["allTests_network"]
    };
  }
  generateServices() {
    const services = {};
    console.log("mark1");
    const runTimeToCompose = {
      "node": [nodeDockerComposeFile, nodeBuildCommand, nodeBddCommand],
      "web": [webDockerComposeFile, webBuildCommand, webBddCommand],
      "python": [pythonDockerComposeFile, pythonBuildCommand, pythonBddCommand],
      "golang": [golangDockerComposeFile, golangBuildCommand, golangBddCommand],
      "ruby": [rubyDockerComposeFile, rubyBuildCommand, rubyBddCommand],
      "rust": [rustDockerComposeFile, rustBuildCommand, rustBddCommand],
      "java": [javaDockerComposeFile, javaBuildCommand, javaBddCommand]
    };
    for (const [runtimeTestsName, runtimeTests] of Object.entries(this.configs.runtimes)) {
      const runtime = runtimeTests.runtime;
      const dockerfile = runtimeTests.dockerfile;
      const buildOptions = runtimeTests.buildOptions;
      const testsObj = runtimeTests.tests;
      for (const [t, c] of Object.entries(this.configs.runtimes)) {
        if (c.runtime === runtime) {
          if (RUN_TIMES.includes(runtime)) {
            const buildCommand = runTimeToCompose[runtime][1](
              buildOptions,
              c.buildOptions,
              runtimeTestsName
            );
            console.log(`[Server_Docker] [generateServices] ${runtimeTestsName} build command: "${buildCommand}"`);
            const builderServiceName = `${runtime}-builder`;
            let dockerfilePath = dockerfile;
            const fullDockerfilePath = path2.join(process.cwd(), dockerfilePath);
            if (!fs2.existsSync(fullDockerfilePath)) {
              throw `[Server_Docker] Dockerfile not found at ${fullDockerfilePath}`;
            }
            services[builderServiceName] = {
              build: {
                context: process.cwd(),
                dockerfile: dockerfilePath
              },
              container_name: builderServiceName,
              environment: {},
              working_dir: "/workspace",
              volumes: [
                `${process.cwd()}/src:/workspace/src`,
                `${process.cwd()}/example:/workspace/example`,
                `${process.cwd()}/dist:/workspace/dist`,
                `${process.cwd()}/testeranto:/workspace/testeranto`
              ],
              command: buildCommand,
              networks: ["allTests_network"]
            };
            for (const tName of testsObj) {
              const cleanTestName = tName.toLowerCase().replaceAll("/", "_").replaceAll(".", "-").replace(/[^a-z0-9_-]/g, "");
              const uid = `${runtimeTestsName.toLowerCase()}-${cleanTestName}`;
              const bddCommandFunc = runTimeToCompose[runtime][2];
              const filePath = `testeranto/bundles/allTests/${runtime}/${tName}`;
              const bddCommand = bddCommandFunc(filePath, this.configs.runtimes[runtimeTestsName].buildOptions);
              console.log(`[Server_Docker] [generateServices] ${runtimeTestsName} BDD command: "${bddCommand}"`);
              services[`${uid}-bdd`] = this.bddTestDockerComposeFile(runtime, `${uid}-bdd`, bddCommand);
              services[`${uid}-aider`] = this.aiderDockerComposeFile(`${uid}-aider`);
            }
          } else {
            throw `unknown runtime ${runtime}`;
          }
        }
      }
    }
    for (const serviceName in services) {
      if (!services[serviceName].networks) {
        services[serviceName].networks = ["allTests_network"];
      }
    }
    return services;
  }
  autogenerateStamp(x) {
    return `# This file is autogenerated. Do not edit it directly
${x}
    `;
  }
  getUpCommand() {
    return `docker compose up -d`;
  }
  getDownCommand() {
    return `docker compose down -v --remove-orphans`;
  }
  getPsCommand() {
    return `docker compose ps`;
  }
  getLogsCommand(serviceName, tail = 100) {
    const base = `docker compose logs --no-color --tail=${tail}`;
    return serviceName ? `${base} ${serviceName}` : base;
  }
  getConfigServicesCommand() {
    return `docker compose config --services`;
  }
  getBuildCommand() {
    return `docker compose build`;
  }
  getStartCommand() {
    return `docker compose start`;
  }
  // private async waitForContainerExists(serviceName: string, maxAttempts: number = 30, delayMs: number = 1000): Promise<boolean> {
  //   for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  //     try {
  //       const cmd = `docker compose -f "testeranto/docker-compose.yml" ps -q ${serviceName}`;
  //       const { execSync } = require('child_process');
  //       const containerId = execSync(cmd, {
  //         // cwd:this.dockerManager.cwd
  //       }).toString().trim();
  //       if (containerId && containerId.length > 0) {
  //         console.log(`[Server_Docker] Container for ${serviceName} exists with ID: ${containerId.substring(0, 12)}`);
  //         return true;
  //       }
  //     } catch (error) {
  //       // Container doesn't exist yet or command failed
  //     }
  //     if (attempt < maxAttempts) {
  //       await new Promise(resolve => setTimeout(resolve, delayMs));
  //     }
  //   }
  //   console.warn(`[Server_Docker] Container for ${serviceName} did not appear after ${maxAttempts} attempts`);
  //   return false;
  // }
  async startServiceLogging(serviceName, runtime) {
    const reportDir = path2.join(
      process.cwd(),
      "testeranto",
      "reports",
      "allTests",
      "example",
      runtime
    );
    try {
      fs2.mkdirSync(reportDir, { recursive: true });
    } catch (error) {
      console.error(`[Server_Docker] Failed to create report directory ${reportDir}: ${error.message}`);
      return;
    }
    const logFilePath = path2.join(reportDir, `${serviceName}.log`);
    const exitCodeFilePath = path2.join(reportDir, `${serviceName}.exitcode`);
    const logScript = `
      # Wait for container to exist
      for i in {1..30}; do
        if docker compose -f "testeranto/docker-compose.yml" ps -q ${serviceName} > /dev/null 2>&1; then
          break
        fi
        sleep 1
      done
      # Capture logs from the beginning
      docker compose -f "testeranto/docker-compose.yml" logs --no-color -f ${serviceName}
    `;
    console.log(`[Server_Docker] Starting log capture for ${serviceName} to ${logFilePath}`);
    const logStream = fs2.createWriteStream(logFilePath, { flags: "a" });
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    logStream.write(`=== Log started at ${timestamp} for service ${serviceName} ===

`);
    const child = spawn("bash", ["-c", logScript], {
      stdio: ["ignore", "pipe", "pipe"]
      // cwd: this.dockerManager.cwd
    });
    let containerId = null;
    try {
      const containerIdCmd = `docker compose -f "testeranto/docker-compose.yml" ps -q ${serviceName}`;
      containerId = execSync(containerIdCmd, {
        // cwd: this.dockerManager.cwd
      }).toString().trim();
    } catch (error) {
      console.warn(`[Server_Docker] Could not get container ID for ${serviceName}, will track by service name`);
    }
    child.stdout?.on("data", (data) => {
      logStream.write(data);
    });
    child.stderr?.on("data", (data) => {
      logStream.write(data);
    });
    child.on("error", (error) => {
      console.error(`[Server_Docker] Log process error for ${serviceName}:`, error);
      logStream.write(`
=== Log process error: ${error.message} ===
`);
      logStream.end();
      fs2.writeFileSync(exitCodeFilePath, "-1");
    });
    child.on("close", (code) => {
      const endTimestamp = (/* @__PURE__ */ new Date()).toISOString();
      logStream.write(`
=== Log ended at ${endTimestamp}, process exited with code ${code} ===
`);
      logStream.end();
      console.log(`[Server_Docker] Log process for ${serviceName} exited with code ${code}`);
      fs2.writeFileSync(exitCodeFilePath, code?.toString() || "0");
      this.captureContainerExitCode(serviceName, reportDir);
      if (containerId) {
        this.logProcesses.delete(containerId);
      } else {
        for (const [id, proc] of this.logProcesses.entries()) {
          if (proc.serviceName === serviceName) {
            this.logProcesses.delete(id);
            break;
          }
        }
      }
    });
    const trackingKey = containerId || serviceName;
    this.logProcesses.set(trackingKey, { process: child, serviceName });
  }
  async captureContainerExitCode(serviceName, reportDir) {
    try {
      const containerIdCmd = `docker compose -f "testeranto/docker-compose.yml" ps -a -q ${serviceName}`;
      const containerId = execSync(containerIdCmd, {
        // cwd: this.dockerManager.cwd
      }).toString().trim();
      if (containerId) {
        const inspectCmd = `docker inspect --format='{{.State.ExitCode}}' ${containerId}`;
        const exitCode = execSync(inspectCmd, {
          // cwd: this.dockerManager.cwd
        }).toString().trim();
        const containerExitCodeFilePath = path2.join(reportDir, `${serviceName}.container.exitcode`);
        fs2.writeFileSync(containerExitCodeFilePath, exitCode);
        console.log(`[Server_Docker] Container ${serviceName} (${containerId.substring(0, 12)}) exited with code ${exitCode}`);
        const statusCmd = `docker inspect --format='{{.State.Status}}' ${containerId}`;
        const status = execSync(statusCmd, {
          // cwd: this.dockerManager.cwd
        }).toString().trim();
        const statusFilePath = path2.join(reportDir, `${serviceName}.container.status`);
        fs2.writeFileSync(statusFilePath, status);
      } else {
        console.debug(`[Server_Docker] No container found for service ${serviceName}`);
      }
    } catch (error) {
      console.debug(`[Server_Docker] Could not capture container exit code for ${serviceName}: ${error.message}`);
    }
  }
  async start() {
    console.log(`[Server_Docker] start()`);
    super.start();
    await this.setupDockerCompose();
    const baseReportsDir = path2.join(process.cwd(), "testeranto", "reports");
    try {
      fs2.mkdirSync(baseReportsDir, { recursive: true });
      console.log(`[Server_Docker] Created base reports directory: ${baseReportsDir}`);
    } catch (error) {
      console.error(`[Server_Docker] Failed to create base reports directory ${baseReportsDir}: ${error.message}`);
    }
    console.log(`[Server_Docker] Dropping everything...`);
    try {
      const downCmd = `docker compose -f "testeranto/docker-compose.yml" down -v --remove-orphans`;
      console.log(`[Server_Docker] Running: ${downCmd}`);
      await this.spawnPromise(downCmd);
      console.log(`[Server_Docker] Docker compose down completed`);
    } catch (error) {
      console.log(`[Server_Docker] Docker compose down noted: ${error.message}`);
    }
    for (const runtime of RUN_TIMES) {
      const serviceName = `${runtime}-builder`;
      console.log(`[Server_Docker] Starting builder service: ${serviceName}`);
      try {
        await this.spawnPromise(`docker compose -f "testeranto/docker-compose.yml" up -d ${serviceName}`);
        this.startServiceLogging(serviceName, runtime).catch((error) => console.error(`[Server_Docker] Failed to start logging for ${serviceName}:`, error));
        this.captureExistingLogs(serviceName, runtime);
      } catch (error) {
        console.error(`[Server_Docker] Failed to start ${serviceName}: ${error.message}`);
      }
    }
    console.log(`[Server_Docker] Starting browser service...`);
    try {
      await this.spawnPromise(`docker compose -f "testeranto/docker-compose.yml" up -d browser`);
    } catch (error) {
      console.error(`[Server_Docker] Failed to start browser service: ${error.message}`);
    }
    console.log(`[Server_Docker] Waiting for browser container to be healthy...`);
    await this.waitForContainerHealthy("browser-allTests", 6e4);
    for (const [configKey, configValue] of Object.entries(this.configs.runtimes)) {
      const runtime = configValue.runtime;
      const tests = configValue.tests;
      console.log(`[Server_Docker] Found tests for ${runtime}:`, JSON.stringify(tests));
      for (const testName of tests) {
        const uid = `${configKey}-${testName.toLowerCase().replaceAll("/", "_").replaceAll(".", "-")}`;
        const aiderServiceName = `${uid}-aider`;
        console.log(`[Server_Docker] Starting aider service: ${aiderServiceName} for test ${testName}`);
        try {
          await this.spawnPromise(`docker compose -f "testeranto/docker-compose.yml" up -d ${aiderServiceName}`);
          this.startServiceLogging(aiderServiceName, runtime).catch((error) => console.error(`[Server_Docker] Failed to start logging for ${aiderServiceName}:`, error));
          this.captureExistingLogs(aiderServiceName, runtime).catch((error) => console.error(`[Server_Docker] Failed to capture existing logs for ${aiderServiceName}:`, error));
        } catch (error) {
          console.error(`[Server_Docker] Failed to start ${aiderServiceName}: ${error.message}`);
        }
      }
    }
    for (const [configKey, configValue] of Object.entries(this.configs.runtimes)) {
      const runtime = configValue.runtime;
      const tests = configValue.tests;
      console.log(`[Server_Docker] Found tests for ${runtime}:`, JSON.stringify(tests));
      for (const testName of tests) {
        const uid = `${configKey}-${testName.toLowerCase().replaceAll("/", "_").replaceAll(".", "-")}`;
        const bddServiceName = `${uid}-bdd`;
        console.log(`[Server_Docker] Starting BDD service: ${bddServiceName}, ${configKey}, ${configValue}`);
        try {
          await this.spawnPromise(`docker compose -f "testeranto/docker-compose.yml" up -d ${bddServiceName}`);
          this.startServiceLogging(bddServiceName, runtime).catch((error) => console.error(`[Server_Docker] Failed to start logging for ${bddServiceName}:`, error));
          this.captureExistingLogs(bddServiceName, runtime).catch((error) => console.error(`[Server_Docker] Failed to capture existing logs for ${bddServiceName}:`, error));
        } catch (error) {
          console.error(`[Server_Docker] Failed to start ${bddServiceName}: ${error.message}`);
          this.captureExistingLogs(bddServiceName, runtime).catch((err) => console.error(`[Server_Docker] Also failed to capture logs:`, err));
        }
      }
    }
    for (const [configKey, configValue] of Object.entries(this.configs)) {
      const runtime = configValue[0];
      const testsObj = configValue[3];
      const tests = testsObj?.tests || {};
      for (const testName in tests) {
        const uid = `${configKey}-${testName.toLowerCase().replaceAll("/", "_").replaceAll(".", "-")}`;
        const checks = testsObj?.checks || [];
        for (let i = 0; i < checks.length; i++) {
          const staticServiceName = `${uid}-static-${i}`;
          console.log(`[Server_Docker] Starting static test service: ${staticServiceName}`);
          try {
            await this.spawnPromise(`docker compose -f "testeranto/docker-compose.yml" up -d ${staticServiceName}`);
            this.startServiceLogging(staticServiceName, runtime).catch((error) => console.error(`[Server_Docker] Failed to start logging for ${staticServiceName}:`, error));
            this.captureExistingLogs(staticServiceName, runtime).catch((error) => console.error(`[Server_Docker] Failed to capture existing logs for ${staticServiceName}:`, error));
          } catch (error) {
            console.error(`[Server_Docker] Failed to start ${staticServiceName}: ${error.message}`);
            this.captureExistingLogs(staticServiceName, runtime).catch((err) => console.error(`[Server_Docker] Also failed to capture logs:`, err));
          }
        }
      }
    }
  }
  async captureExistingLogs(serviceName, runtime) {
    const reportDir = path2.join(
      process.cwd(),
      "testeranto",
      "reports",
      "allTests",
      "example",
      runtime
    );
    try {
      fs2.mkdirSync(reportDir, { recursive: true });
    } catch (error) {
      console.error(`[Server_Docker] Failed to create report directory ${reportDir}: ${error.message}`);
      return;
    }
    const logFilePath = path2.join(reportDir, `${serviceName}.log`);
    try {
      const checkCmd = `docker compose -f "testeranto/docker-compose.yml" ps -a -q ${serviceName}`;
      const containerId = execSync(checkCmd, {
        // cwd: this.dockerManager.cwd,
        encoding: "utf-8"
      }).toString().trim();
      if (!containerId) {
        console.debug(`[Server_Docker] No container found for service ${serviceName}`);
        return;
      }
      const cmd = `docker compose -f "testeranto/docker-compose.yml" logs --no-color ${serviceName} 2>/dev/null || true`;
      const existingLogs = execSync(cmd, {
        // cwd: this.dockerManager.cwd,
        encoding: "utf-8",
        maxBuffer: 10 * 1024 * 1024
        // 10MB
      });
      if (existingLogs && existingLogs.trim().length > 0) {
        fs2.appendFileSync(logFilePath, existingLogs);
        console.log(`[Server_Docker] Captured ${existingLogs.length} bytes of existing logs for ${serviceName}`);
      }
      this.captureContainerExitCode(serviceName, reportDir);
    } catch (error) {
      console.debug(`[Server_Docker] No existing logs for ${serviceName}: ${error.message}`);
    }
  }
  async waitForContainerHealthy(containerName, timeoutMs) {
    const startTime = Date.now();
    const checkInterval = 2e3;
  }
  async stop() {
    console.log(`[Server_Docker] stop()`);
    for (const [containerId, logProcess] of this.logProcesses.entries()) {
      try {
        logProcess.process.kill("SIGTERM");
        console.log(`[Server_Docker] Stopped log process for container ${containerId} (${logProcess.serviceName})`);
      } catch (error) {
        console.error(`[Server_Docker] Error stopping log process for ${containerId}:`, error);
      }
    }
    this.logProcesses.clear();
    const result = await this.DC_down();
    if (result.exitCode !== 0) {
      console.error(`Docker Compose down failed: ${result.err}`);
    }
    super.stop();
  }
  async setupDockerCompose() {
    const composeDir = path2.join(process.cwd(), "testeranto", "bundles");
    try {
      fs2.mkdirSync(composeDir, { recursive: true });
      const services = this.generateServices(
        // config,
      );
      this.writeComposeFile(services);
    } catch (err) {
      console.error(`Error in setupDockerCompose:`, err);
      throw err;
    }
  }
  writeComposeFile(services) {
    const dockerComposeFileContents = this.BaseCompose(services);
    fs2.writeFileSync(
      "testeranto/docker-compose.yml",
      yaml.dump(dockerComposeFileContents, {
        lineWidth: -1,
        noRefs: true
      })
    );
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
        shell: true
        // cwd: this.dockerManager.cwd
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
      const cmd = this.getUpCommand();
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
      const cmd = this.getDownCommand();
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
      const cmd = this.getPsCommand();
      const { stdout, stderr } = await this.exec(cmd, {
        // cwd: this.dockerManager.cwd
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
        err: `Error getting service status: ${error.message}`,
        data: null
      };
    }
  }
  async DC_logs(serviceName, options) {
    const tail = options?.tail ?? 100;
    try {
      const cmd = this.getLogsCommand(serviceName, tail);
      const { stdout, stderr } = await this.exec(cmd, {
        // cwd: this.dockerManager.cwd
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
  async DC_configServices() {
    try {
      const cmd = this.getConfigServicesCommand();
      const { stdout, stderr } = await this.exec(cmd, {
        // cwd: this.dockerManager.cwd
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
        err: `Error getting services from config: ${error.message}`,
        data: null
      };
    }
  }
  async DC_start() {
    try {
      const startCommand = this.getStartCommand();
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
      const buildCommand = this.getBuildCommand();
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
        let exitCode = null;
        try {
          const inspectCmd = `docker inspect --format='{{.State.ExitCode}}' ${name} 2>/dev/null || echo ""`;
          const exitCodeStr = execSync(inspectCmd).toString().trim();
          if (exitCodeStr !== "") {
            exitCode = parseInt(exitCodeStr, 10);
            if (state === "running") {
              exitCode = null;
            }
          }
        } catch (error) {
        }
        return {
          processId: name,
          command: command || image,
          image,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          status,
          state,
          ports,
          exitCode,
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
  constructor(configs, mode2) {
    super(configs, mode2);
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
var fs4 = await import("fs/promises");
var mode = process.argv[3];
if (mode !== "once" && mode !== "dev") {
  console.error(`The 3rd argument should be 'dev' or 'once', not '${mode}'.`);
  process.exit(-1);
}
var main = async () => {
  const config = (await import(process.cwd() + "/testeranto/testeranto.ts")).default;
  await new Server(config, mode).start();
};
main();
