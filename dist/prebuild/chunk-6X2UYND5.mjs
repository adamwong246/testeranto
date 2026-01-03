// src/testeranto.ts
import ansiC4 from "ansi-colors";
import fs14 from "fs";
import path13 from "path";
import readline from "readline";

// src/server/serverClasees/utils/fileSystemSetup.ts
import fs from "fs";

// src/clients/utils/buildTemplates.ts
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

// src/server/serverClasees/utils/fileSystemSetup.ts
function setupFileSystem(config2, testsName2) {
  fs.writeFileSync(
    `${process.cwd()}/testeranto/ProcessManger.html`,
    ProcessMangerHtml()
  );
  fs.writeFileSync(`${process.cwd()}/testeranto/index.html`, IndexHtml());
  if (!fs.existsSync(`testeranto/reports/${testsName2}`)) {
    fs.mkdirSync(`testeranto/reports/${testsName2}`, { recursive: true });
  }
  fs.writeFileSync(
    `testeranto/reports/${testsName2}/config.json`,
    JSON.stringify(config2, null, 2)
  );
}

// src/server/keypressHandler.ts
import ansiC from "ansi-colors";
function setupKeypressHandling() {
  process.stdin.on("keypress", (str, key) => {
    if (key.name === "x") {
      console.log(ansiC.inverse("Shutting down forcefully..."));
      process.exit(-1);
    }
    if (key.name === "q") {
      console.log("Testeranto is shutting down gracefully...");
      process.exit(0);
    }
  });
}

// src/server/serverClasees/Server.ts
import fs11 from "fs";
import { default as ansiC3 } from "ansi-colors";
import path10 from "path";

// src/server/serverClasees/ServerTaskCoordinator.ts
import { default as ansiC2 } from "ansi-colors";
import { WebSocket as WebSocket3 } from "ws";

// src/server/utils.ts
import path from "path";
var getRunnables = (config2, projectName) => {
  return {
    // pureEntryPoints: payload.pureEntryPoints || {},
    golangEntryPoints: Object.entries(config2.golang.tests).reduce((pt, cv) => {
      pt[cv[0]] = path.resolve(cv[0]);
      return pt;
    }, {}),
    // golangEntryPointSidecars: payload.golangEntryPointSidecars || {},
    nodeEntryPoints: Object.entries(config2.node.tests).reduce((pt, cv) => {
      pt[cv[0]] = path.resolve(
        `./testeranto/bundles/${projectName}/node/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
      return pt;
    }, {}),
    // nodeEntryPointSidecars: payload.nodeEntryPointSidecars || {},
    pythonEntryPoints: Object.entries(config2.python.tests).reduce((pt, cv) => {
      pt[cv[0]] = path.resolve(cv[0]);
      return pt;
    }, {}),
    // pythonEntryPointSidecars: payload.pythonEntryPointSidecars || {},
    webEntryPoints: Object.entries(config2.web.tests).reduce((pt, cv) => {
      pt[cv[0]] = path.resolve(
        `./testeranto/bundles/${projectName}/web/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
      return pt;
    }, {})
    // webEntryPointSidecars: payload.webEntryPointSidecars || {},
  };
};

// src/server/serverClasees/ServerTaskManager.ts
import fs9 from "fs";

// src/server/serverClasees/Server_DockerCompose.ts
import {
  down,
  logs,
  ps,
  upAll,
  upOne
} from "docker-compose";
import fs8 from "fs";
import path9 from "path";

// src/server/serverClasees/Server_TCP_Commands.ts
import fs7 from "fs";
import path8 from "path";

// src/server/serverClasees/utils/Server_TCP_utils.ts
import path3 from "path";

// src/server/serverClasees/Server_TCP_constants.ts
import path2 from "path";
var SERVER_CONSTANTS = {
  HOST: "0.0.0.0"
};
var WEB_TEST_FILES_PATH = {
  NEW_PREFIX: "/web/",
  NEW_PREFIX_REGEX: /^\/web\//,
  OLD_PREFIX: "/bundles/web/",
  BASE_DIR: path2.join("testeranto", "bundles", "allTests", "web")
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
var WEBSOCKET_MESSAGE_TYPES = {
  GET_RUNNING_PROCESSES: "getRunningProcesses",
  RUNNING_PROCESSES: "runningProcesses",
  GET_PROCESS: "getProcess",
  PROCESS_DATA: "processData",
  STDIN: "stdin",
  KILL_PROCESS: "killProcess",
  GET_CHAT_HISTORY: "getChatHistory",
  CHAT_HISTORY: "chatHistory",
  ERROR: "error"
};
var ERROR_MESSAGES = {
  IPC_FORMAT_NO_LONGER_SUPPORTED: "IPC format messages are no longer supported. Node tests must use WebSocket messages with 'type' field.",
  FAILED_TO_GET_CHAT_HISTORY: "Failed to get chat history",
  FILE_NOT_FOUND: "404 Not Found",
  INTERNAL_SERVER_ERROR: "500"
};
var OTHER_CONSTANTS = {
  STREAM_ID_PREFIX: "stream_",
  SIGTERM: "SIGTERM"
};

// src/server/serverClasees/utils/Server_TCP_utils.ts
function getContentType(filePath) {
  if (filePath.endsWith(".html"))
    return CONTENT_TYPES.HTML;
  else if (filePath.endsWith(".js") || filePath.endsWith(".mjs"))
    return CONTENT_TYPES.JAVASCRIPT;
  else if (filePath.endsWith(".css"))
    return CONTENT_TYPES.CSS;
  else if (filePath.endsWith(".json"))
    return CONTENT_TYPES.JSON;
  else if (filePath.endsWith(".png"))
    return CONTENT_TYPES.PNG;
  else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg"))
    return CONTENT_TYPES.JPEG;
  else if (filePath.endsWith(".gif"))
    return CONTENT_TYPES.GIF;
  else if (filePath.endsWith(".svg"))
    return CONTENT_TYPES.SVG;
  else
    return CONTENT_TYPES.PLAIN;
}
function generateStreamId() {
  return "stream_" + Math.random().toString(36).substr(2, 9);
}
function serializeProcessInfo(id, procInfo, logs2) {
  return {
    processId: id,
    command: procInfo.command,
    pid: procInfo.pid,
    status: procInfo.status,
    exitCode: procInfo.exitCode,
    error: procInfo.error,
    timestamp: procInfo.timestamp,
    category: procInfo.category,
    testName: procInfo.testName,
    platform: procInfo.platform,
    logs: logs2 || []
  };
}
function prepareCommandArgs(commandData) {
  if (commandData === void 0 || commandData === null) {
    return [];
  }
  return Array.isArray(commandData) ? commandData : [commandData];
}
function handlePromiseResult(promise, type, key, ws) {
  promise.then((resolvedResult) => {
    console.log(`Command ${type} resolved:`, resolvedResult);
    ws.send(
      JSON.stringify({
        key,
        payload: resolvedResult
      })
    );
  }).catch((error) => {
    console.error(`Error executing command ${type}:`, error);
    ws.send(
      JSON.stringify({
        key,
        payload: null,
        error: error?.toString()
      })
    );
  });
}
function sendErrorResponse(ws, key, error) {
  ws.send(
    JSON.stringify({
      key,
      payload: null,
      error: error?.toString()
    })
  );
}

// src/server/serverClasees/Server_TCP_FileService.ts
import fs6 from "fs";

// src/server/serverClasees/utils/getAllFilesRecursively.ts
import fs2 from "fs";
import path4 from "path";
async function getAllFilesRecursively(directoryPath) {
  let fileList = [];
  const files2 = await fs2.readdirSync(directoryPath, { withFileTypes: true });
  for (const file of files2) {
    const fullPath = path4.join(directoryPath, file.name);
    if (file.isDirectory()) {
      fileList = fileList.concat(await getAllFilesRecursively(fullPath));
    } else if (file.isFile()) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

// src/server/serverClasees/Server_TCP_WebSocketProcess.ts
import fs5 from "fs";
import path7 from "path";
import { WebSocket as WebSocket2 } from "ws";

// src/server/serverClasees/Server_TCP_Http.ts
import fs4 from "fs";
import path6 from "path";

// src/server/serverClasees/Server_TCP_Core.ts
import http from "http";
import { WebSocketServer } from "ws";

// src/server/serverClasees/Server_Base.ts
import fs3 from "fs";
import path5 from "path";
var fileStreams3 = [];
var fPaths = [];
var files = {};
var recorders = {};
var screenshots = {};
var Server_Base = class {
  constructor(configs, projectName, mode2) {
    this.configs = configs;
    this.mode = mode2;
    this.projectName = projectName;
  }
  mapping() {
    return [
      ["$", this.$],
      ["click", this.click],
      ["closePage", this.closePage],
      ["createWriteStream", this.createWriteStream],
      ["customclose", this.customclose],
      ["customScreenShot", this.customScreenShot.bind(this)],
      ["end", this.end],
      ["existsSync", this.existsSync],
      ["focusOn", this.focusOn],
      ["getAttribute", this.getAttribute],
      ["getInnerHtml", this.getInnerHtml],
      // ["setValue", this.setValue],
      ["goto", this.goto.bind(this)],
      ["isDisabled", this.isDisabled],
      // ["launchSideCar", this.launchSideCar.bind(this)],
      ["mkdirSync", this.mkdirSync],
      ["newPage", this.newPage],
      ["page", this.page],
      ["pages", this.pages],
      ["screencast", this.screencast],
      ["screencastStop", this.screencastStop],
      // ["stopSideCar", this.stopSideCar.bind(this)],
      ["typeInto", this.typeInto],
      ["waitForSelector", this.waitForSelector],
      ["write", this.write],
      ["writeFileSync", this.writeFileSync]
    ];
  }
  customclose() {
    throw new Error("customclose not implemented.");
  }
  waitForSelector(p, s) {
    return new Promise((res) => {
      this.doInPage(p, async (page) => {
        const x = page.$(s);
        const y = await x;
        res(y !== null);
      });
    });
  }
  closePage(p) {
    return new Promise((res) => {
      this.doInPage(p, async (page) => {
        page.close();
        res({});
      });
    });
  }
  async newPage() {
    return (await this.browser.newPage()).mainFrame()._id;
  }
  goto(p, url) {
    return new Promise((res) => {
      this.doInPage(p, async (page) => {
        await page?.goto(url);
        res({});
      });
    });
  }
  $(selector, p) {
    return new Promise((res) => {
      this.doInPage(p, async (page) => {
        const x = await page.$(selector);
        const y = await x?.jsonValue();
        res(y);
      });
    });
  }
  async pages() {
    return (await this.browser.pages()).map((p) => {
      return p.mainFrame()._id;
    });
  }
  async screencast(ssOpts, testName, page) {
    const p = ssOpts.path;
    const dir = path5.dirname(p);
    fs3.mkdirSync(dir, {
      recursive: true
    });
    if (!files[testName]) {
      files[testName] = /* @__PURE__ */ new Set();
    }
    files[testName].add(ssOpts.path);
    const sPromise = page.screenshot({
      ...ssOpts,
      path: p
    });
    if (!screenshots[testName]) {
      screenshots[testName] = [];
    }
    screenshots[testName].push(sPromise);
    await sPromise;
    return sPromise;
  }
  async customScreenShot(ssOpts, testName, pageUid) {
    const p = ssOpts.path;
    const dir = path5.dirname(p);
    fs3.mkdirSync(dir, {
      recursive: true
    });
    if (!files[testName]) {
      files[testName] = /* @__PURE__ */ new Set();
    }
    files[testName].add(ssOpts.path);
    const page = (await this.browser.pages()).find(
      (p2) => p2.mainFrame()._id === pageUid
    );
    const sPromise = page.screenshot({
      ...ssOpts,
      path: p
    });
    if (!screenshots[testName]) {
      screenshots[testName] = [];
    }
    screenshots[testName].push(sPromise);
    await sPromise;
    return sPromise;
  }
  async end(uid) {
    await fileStreams3[uid].end();
    return true;
  }
  existsSync(destFolder) {
    return fs3.existsSync(destFolder);
  }
  async mkdirSync(fp) {
    if (!fs3.existsSync(fp)) {
      return fs3.mkdirSync(fp, {
        recursive: true
      });
    }
    return false;
  }
  async writeFileSync(...x) {
    const filepath = x[0];
    const contents = x[1];
    const testName = x[2];
    return new Promise(async (res) => {
      fs3.mkdirSync(path5.dirname(filepath), {
        recursive: true
      });
      if (!files[testName]) {
        files[testName] = /* @__PURE__ */ new Set();
      }
      files[testName].add(filepath);
      await fs3.writeFileSync(filepath, contents);
      res(true);
    });
  }
  async createWriteStream(filepath, testName) {
    const folder = filepath.split("/").slice(0, -1).join("/");
    return new Promise((res) => {
      if (!fs3.existsSync(folder)) {
        return fs3.mkdirSync(folder, {
          recursive: true
        });
      }
      const f = fs3.createWriteStream(filepath);
      fileStreams3.push(f);
      if (!files[testName]) {
        files[testName] = /* @__PURE__ */ new Set();
      }
      files[testName].add(filepath);
      res(fileStreams3.length - 1);
    });
  }
  testArtiFactoryfileWriter(tLog, callback) {
    return (fPath, value) => {
      callback(
        new Promise((res, rej) => {
          const cleanPath = path5.resolve(fPath);
          fPaths.push(cleanPath.replace(process.cwd(), ``));
          const targetDir = cleanPath.split("/").slice(0, -1).join("/");
          fs3.mkdir(targetDir, { recursive: true }, async (error) => {
            if (error) {
            }
            fs3.writeFileSync(
              path5.resolve(
                targetDir.split("/").slice(0, -1).join("/"),
                "manifest"
              ),
              fPaths.join(`
`),
              {
                encoding: "utf-8"
              }
            );
            if (Buffer.isBuffer(value)) {
              fs3.writeFileSync(fPath, value, "binary");
              res();
            } else if (`string` === typeof value) {
              fs3.writeFileSync(fPath, value.toString(), {
                encoding: "utf-8"
              });
              res();
            } else {
              const pipeStream = value;
              const myFile = fs3.createWriteStream(fPath);
              pipeStream.pipe(myFile);
              pipeStream.on("close", () => {
                myFile.close();
                res();
              });
            }
          });
        })
      );
    };
  }
  async write(uid, contents) {
    return new Promise((res) => {
      const x = fileStreams3[uid].write(contents);
      res(x);
    });
  }
  page(p) {
    return p;
  }
  click(selector, page) {
    return page.click(selector);
  }
  async focusOn(selector, p) {
    this.doInPage(p, (page) => {
      return page.focus(selector);
    });
  }
  async typeInto(value, p) {
    this.doInPage(p, (page) => {
      return page.keyboard.type(value);
    });
  }
  getAttribute(selector, attribute, p) {
    this.doInPage(p, (page) => {
      return page.$eval(selector, (input) => input.getAttribute(attribute));
    });
  }
  async getInnerHtml(selector, p) {
    return new Promise((res, rej) => {
      this.doInPage(p, async (page) => {
        const e = await page.$(selector);
        if (!e) {
          rej();
        } else {
          const text = await (await e.getProperty("textContent")).jsonValue();
          res(text);
        }
      });
    });
  }
  isDisabled(selector, p) {
    this.doInPage(p, async (page) => {
      return await page.$eval(selector, (input) => {
        return input.disabled;
      });
    });
  }
  screencastStop(s) {
    return recorders[s].stop();
  }
  async doInPage(p, cb) {
    (await this.browser.pages()).forEach((page) => {
      const frame = page.mainFrame();
      if (frame._id === p) {
        return cb(page);
      }
    });
  }
};

// src/server/serverClasees/Server_TCP_Core.ts
var Server_TCP_Core = class extends Server_Base {
  constructor(configs, name, mode2) {
    super(configs, name, mode2);
    this.httpServer = http.createServer();
    this.wss = new WebSocketServer({ server: this.httpServer });
    const httpPort = configs.httpPort || Number(process.env.HTTP_PORT) || Number(process.env.WS_PORT) || 3456;
    console.log(`[Server_TCP_Core] Starting HTTP server on port ${httpPort}, host ${SERVER_CONSTANTS.HOST}`);
    this.httpServer.listen(httpPort, SERVER_CONSTANTS.HOST, () => {
      const addr = this.httpServer.address();
      console.log(`[Server_TCP_Core] HTTP server running on http://localhost:${httpPort}`);
      console.log(`[Server_TCP_Core] WebSocket server available on ws://localhost:${httpPort}/ws`);
      console.log(`[Server_TCP_Core] Actual address:`, addr);
    });
  }
  // Basic getters
  getWebSocketServer() {
    return this.wss;
  }
  getHttpServer() {
    return this.httpServer;
  }
  getClients() {
    return this.clients;
  }
};

// src/server/serverClasees/Server_TCP_Http.ts
var Server_TCP_Http = class extends Server_TCP_Core {
  constructor(configs, name, mode2) {
    super(configs, name, mode2);
    console.log(`[HTTP] Server_TCP_Http constructor called`);
    console.log(`[HTTP] httpServer exists: ${!!this.httpServer}`);
    if (this.httpServer) {
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
    }
    this.httpServer.on("request", this.handleHttpRequest.bind(this));
    console.log(`[HTTP] HTTP request handler attached`);
  }
  handleHttpRequest(req, res) {
    this.serveStaticFile(req, res);
    return;
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
    const normalizedPath = path6.normalize(relativePath);
    if (normalizedPath.includes("..")) {
      res.writeHead(403);
      res.end("Forbidden: Directory traversal not allowed");
      return;
    }
    const projectRoot = process.cwd();
    const filePath = path6.join(projectRoot, normalizedPath);
    if (!filePath.startsWith(path6.resolve(projectRoot))) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    fs4.stat(filePath, (err, stats) => {
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
        fs4.readdir(filePath, (readErr, files2) => {
          if (readErr) {
            res.writeHead(500);
            res.end(`Server Error: ${readErr.message}`);
            return;
          }
          const items = files2.map((file) => {
            try {
              const stat = fs4.statSync(path6.join(filePath, file));
              const isDir = stat.isDirectory();
              const slash = isDir ? "/" : "";
              return `<li><a href="${path6.join(
                urlPath,
                file
              )}${slash}">${file}${slash}</a></li>`;
            } catch {
              return `<li><a href="${path6.join(
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
    fs4.readFile(filePath, (err, data) => {
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
};

// src/server/serverClasees/Server_TCP_WebSocketBase.ts
var FileService_methods = [
  "writeFile_send",
  "writeFile_receive",
  "readFile_receive",
  "readFile_send",
  "createDirectory_receive",
  "createDirectory_send",
  "deleteFile_receive",
  "deleteFile_send",
  "files_send",
  "files_receive",
  "projects_send",
  "projects_receive",
  "tests_send",
  "tests_receive",
  "report_send",
  "report_receive"
];
var Server_TCP_WebSocketBase = class extends Server_TCP_Http {
  constructor(configs, name, mode2) {
    console.log(`[WebSocket] Creating Server_TCP_WebSocketBase with configs:`, {
      httpPort: configs.httpPort,
      name,
      mode: mode2
    });
    const httpPort = configs.httpPort || Number(process.env.WS_PORT) || Number(process.env.HTTP_PORT) || 3e3;
    const updatedConfigs = {
      ...configs,
      httpPort
    };
    console.log(
      `[WebSocket] Server_TCP_WebSocketBase constructor: using httpPort=${httpPort}`
    );
    super(updatedConfigs, name, mode2);
    console.log(`[WebSocket] After super() call`);
    console.log(`[WebSocket] wss exists: ${!!this.wss}`);
    console.log(`[WebSocket] httpServer exists: ${!!this.httpServer}`);
    if (this.wss) {
      console.log(`[WebSocket] WebSocket server address:`, this.wss.address());
      console.log(
        `[WebSocket] WebSocket server event names:`,
        this.wss.eventNames()
      );
    }
    if (this.httpServer) {
      const address = this.httpServer.address();
      console.log(`[WebSocket] HTTP server address:`, address);
      if (address && typeof address === "object") {
        console.log(
          `[WebSocket] HTTP server listening on port ${address.port}`
        );
      }
    }
    if (!this.processLogs) {
      this.processLogs = /* @__PURE__ */ new Map();
    }
    if (!this.clients) {
      this.clients = /* @__PURE__ */ new Set();
    }
    if (!this.allProcesses) {
      this.allProcesses = /* @__PURE__ */ new Map();
    }
    if (!this.runningProcesses) {
      this.runningProcesses = /* @__PURE__ */ new Map();
    } else {
      if (!(this.runningProcesses instanceof Map)) {
        const entries = Object.entries(this.runningProcesses);
        this.runningProcesses = new Map(entries);
      }
    }
    this.logSubscriptions = /* @__PURE__ */ new Map();
    console.log(`[WebSocket] Setting up WebSocket handlers`);
    this.setupWebSocketHandlers();
    console.log(`[WebSocket] Server_TCP_WebSocketBase constructor completed`);
  }
  setupWebSocketHandlers() {
    console.log(`[WebSocket] Setting up WebSocket handlers on server`);
    if (!this.wss) {
      console.error(
        `[WebSocket] ERROR: WebSocket server (wss) is not initialized!`
      );
      return;
    }
    const address = this.httpServer.address();
    const host = SERVER_CONSTANTS.HOST;
    let port = 3456;
    if (address && typeof address === "object") {
      port = address.port;
    }
    console.log(
      `[WebSocket] WebSocket server is available on ws://${host}:${port}/ws, attaching connection handler`
    );
    this.wss.on("connection", (ws, req) => {
      console.log(
        `[WebSocket] Client connected from: ${req.socket.remoteAddress}, URL: ${req.url}`
      );
      this.clients.add(ws);
      console.log(`[WebSocket] Total clients: ${this.clients.size}`);
      const timeoutId = setTimeout(() => {
        console.log(`[WebSocket] No greeting received after 2 seconds, sending test greeting`);
        const testGreeting = {
          type: "greeting",
          data: {
            testId: `test-${Date.now()}`,
            testName: "DebugTest",
            runtime: "node"
          }
        };
        console.log(`[WebSocket] Simulating greeting:`, testGreeting);
        this.handleWebSocketMessage(JSON.stringify(testGreeting), ws);
      }, 2e3);
      ws.on("message", (data) => {
        clearTimeout(timeoutId);
        console.log(
          `[WebSocket] Received message from client: ${data.toString().substring(0, 100)}...`
        );
        try {
          this.handleWebSocketMessage(data, ws);
        } catch (error) {
          console.error("[WebSocket] Error handling WebSocket message:", error);
        }
      });
      ws.on("close", () => {
        console.log(`[WebSocket] Client disconnected`);
        this.clients.delete(ws);
        clearTimeout(timeoutId);
        console.log(`[WebSocket] Total clients: ${this.clients.size}`);
      });
      ws.on("error", (error) => {
        console.error(`[WebSocket] WebSocket error:`, error);
        this.clients.delete(ws);
        clearTimeout(timeoutId);
        console.log(`[WebSocket] Total clients: ${this.clients.size}`);
      });
    });
    console.log(`[WebSocket] WebSocket handlers setup complete`);
  }
  handleWebSocketMessage(data, ws) {
    try {
      const rawData = data.toString();
      console.log(`[WebSocket] Received raw message: ${rawData.substring(0, 200)}...`);
      let parsed;
      try {
        parsed = JSON.parse(rawData);
      } catch (parseError) {
        console.error(
          "[WebSocket] Failed to parse WebSocket message as JSON:",
          rawData.substring(0, 200),
          parseError
        );
        return;
      }
      if (Array.isArray(parsed)) {
        console.error(ERROR_MESSAGES.IPC_FORMAT_NO_LONGER_SUPPORTED);
        console.error("[WebSocket] Received array message:", parsed);
        ws.send(
          JSON.stringify({
            error: ERROR_MESSAGES.IPC_FORMAT_NO_LONGER_SUPPORTED,
            received: parsed
          })
        );
        return;
      }
      const wsm = parsed;
      console.log(`[WebSocket] Parsed message type: ${wsm.type}`);
      let handled = false;
      FileService_methods.forEach((fsm) => {
        if (wsm.type === fsm) {
          console.log("[WebSocket] Handling as FileService method:", fsm);
          this[fsm](wsm, ws);
          handled = true;
        }
      });
      if (handled)
        return;
      if (wsm.type && typeof this[wsm.type] === "function") {
        const { data: commandData, key } = wsm;
        const args = prepareCommandArgs(commandData);
        try {
          const result = this[wsm.type](...args);
          console.log(`[WebSocket] Command ${wsm.type} returned:`, result);
          if (result instanceof Promise) {
            handlePromiseResult(result, wsm.type, key, ws);
          } else {
            ws.send(
              JSON.stringify({
                key,
                payload: result
              })
            );
          }
        } catch (error) {
          console.error(`[WebSocket] Error executing command ${wsm.type}:`, error);
          sendErrorResponse(ws, key, error);
        }
        return;
      }
      this.handleWebSocketMessageTypes(wsm, ws);
    } catch (error) {
      console.error("[WebSocket] Error handling WebSocket message:", error);
    }
  }
  handleWebSocketMessageTypes(wsm, ws) {
    if (wsm.type === WEBSOCKET_MESSAGE_TYPES.GET_RUNNING_PROCESSES) {
      const processes = Array.from(this.allProcesses.entries()).map(
        ([id, procInfo]) => serializeProcessInfo(id, procInfo, this.processLogs.get(id) || [])
      );
      ws.send(
        JSON.stringify({
          type: WEBSOCKET_MESSAGE_TYPES.RUNNING_PROCESSES,
          processes
        })
      );
    } else if (wsm.type === WEBSOCKET_MESSAGE_TYPES.GET_PROCESS) {
      const processId = wsm.data.processId;
      const procInfo = this.allProcesses.get(processId);
      if (procInfo) {
        ws.send(
          JSON.stringify({
            type: WEBSOCKET_MESSAGE_TYPES.PROCESS_DATA,
            ...serializeProcessInfo(
              processId,
              procInfo,
              this.processLogs.get(processId) || []
            )
          })
        );
      }
    } else if (wsm.type === WEBSOCKET_MESSAGE_TYPES.STDIN) {
      const processId = wsm.data.processId;
      const data = wsm.data.data;
      const childProcess = this.runningProcesses.get(processId);
      if (childProcess && childProcess.stdin) {
        childProcess.stdin.write(data);
      } else {
        console.log("Cannot write to stdin - process not found or no stdin:", {
          processExists: !!childProcess,
          stdinExists: childProcess?.stdin ? true : false
        });
      }
    } else if (wsm.type === WEBSOCKET_MESSAGE_TYPES.KILL_PROCESS) {
      const processId = wsm.processId;
      console.log("Received killProcess for process", processId);
      const childProcess = this.runningProcesses.get(processId);
      if (childProcess) {
        console.log("Killing process");
        childProcess.kill(OTHER_CONSTANTS.SIGTERM);
      } else {
        console.log("Cannot kill process - process not found:", {
          processExists: !!childProcess
        });
      }
    } else if (wsm.type === WEBSOCKET_MESSAGE_TYPES.GET_CHAT_HISTORY) {
      if (this.getChatHistory) {
        this.getChatHistory().then((history) => {
          ws.send(
            JSON.stringify({
              type: WEBSOCKET_MESSAGE_TYPES.CHAT_HISTORY,
              messages: history
            })
          );
        }).catch((error) => {
          console.error("Error getting chat history:", error);
          ws.send(
            JSON.stringify({
              type: WEBSOCKET_MESSAGE_TYPES.ERROR,
              message: ERROR_MESSAGES.FAILED_TO_GET_CHAT_HISTORY
            })
          );
        });
      }
    } else {
      console.warn("Unhandled WebSocket message type:", wsm.type);
    }
  }
};

// src/server/serverClasees/Server_TCP_WebSocketProcess.ts
var Server_TCP_WebSocketProcess = class extends Server_TCP_WebSocketBase {
  constructor(configs, name, mode2) {
    console.log(`[WebSocketProcess] Creating Server_TCP_WebSocketProcess`);
    super(configs, name, mode2);
    this.testInfoMap = /* @__PURE__ */ new Map();
    console.log(`[WebSocketProcess] Super constructor completed`);
    console.log(`[WebSocketProcess] wss exists: ${!!this.wss}`);
    console.log(`[WebSocketProcess] httpServer exists: ${!!this.httpServer}`);
    if (this.wss) {
      console.log(
        `[WebSocketProcess] WebSocket server event listeners:`,
        this.wss.eventNames()
      );
    }
    console.log(`[WebSocketProcess] Overriding runningProcesses.set`);
    this.overrideRunningProcessesSet();
    setTimeout(() => {
      console.log(
        `[WebSocketProcess] Attaching log capture to existing processes`
      );
      this.attachLogCaptureToExistingProcesses();
    }, 100);
    console.log(`[WebSocketProcess] Overriding launch methods`);
    this.overrideLaunchMethods();
    console.log(`[WebSocketProcess] Constructor completed`);
  }
  handleWebSocketMessageTypes(wsm, ws) {
    console.log(
      `[WebSocketProcess] Handling WebSocket message type: ${wsm.type}`
    );
    console.log(
      `[WebSocketProcess] Message data:`,
      JSON.stringify(wsm.data).substring(0, 200)
    );
    super.handleWebSocketMessageTypes(wsm, ws);
    if (wsm.type === "getProcesses") {
      console.log(`[WebSocketProcess] Handling getProcesses request`);
      ws.send(
        JSON.stringify({
          type: "processes",
          data: this.getProcessSummary(),
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        })
      );
      console.log(`[WebSocketProcess] Sent processes data`);
    } else if (wsm.type === "getLogs") {
      const processId = wsm.data?.processId;
      console.log(
        `[WebSocketProcess] Handling getLogs request for process: ${processId}`
      );
      if (processId) {
        ws.send(
          JSON.stringify({
            type: "logs",
            processId,
            logs: this.getProcessLogs(processId),
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          })
        );
        console.log(`[WebSocketProcess] Sent logs for process ${processId}`);
      }
    } else if (wsm.type === "subscribeToLogs") {
      const processId = wsm.data?.processId;
      console.log(
        `[WebSocketProcess] Handling subscribeToLogs for process: ${processId}`
      );
      if (processId) {
        if (!this.logSubscriptions) {
          this.logSubscriptions = /* @__PURE__ */ new Map();
        }
        const subscriptions = this.logSubscriptions.get(processId) || /* @__PURE__ */ new Set();
        subscriptions.add(ws);
        this.logSubscriptions.set(processId, subscriptions);
        ws.send(
          JSON.stringify({
            type: "logSubscription",
            processId,
            status: "subscribed",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          })
        );
        console.log(
          `[WebSocketProcess] Subscribed to logs for process ${processId}`
        );
      }
    } else if (wsm.type === "greeting") {
      const testName = wsm.data?.testName;
      const runtime = wsm.data?.runtime;
      const testId = wsm.data?.testId;
      console.log(
        `[WebSocketProcess] Received greeting from test: ${testName} (${runtime}), testId: ${testId}`
      );
      console.log(
        `[WebSocketProcess] Full greeting data:`,
        JSON.stringify(wsm.data, null, 2)
      );
      if (!this.testConnections) {
        this.testConnections = /* @__PURE__ */ new Map();
      }
      this.testConnections.set(testId, ws);
      console.log(
        `[WebSocketProcess] Stored WebSocket connection for test ${testId}. Total connections: ${this.testConnections.size}`
      );
      console.log(`[WebSocketProcess] Calling scheduleTestForExecution...`);
      this.scheduleTestForExecution(testId, testName, runtime, ws);
      const ackMessage = {
        type: "greetingAck",
        testId,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      console.log(
        `[WebSocketProcess] Sending greeting acknowledgment for test ${testId}:`,
        ackMessage
      );
      try {
        ws.send(JSON.stringify(ackMessage));
        console.log(
          `[WebSocketProcess] Greeting acknowledgment sent successfully for test ${testId}`
        );
      } catch (error) {
        console.error(
          `[WebSocketProcess] Failed to send greeting acknowledgment for test ${testId}:`,
          error
        );
      }
    } else if (wsm.type === "testResult") {
      console.log(`[WebSocketProcess] Received testResult message`);
      console.log(
        `[WebSocketProcess] Test result data:`,
        JSON.stringify(wsm.data, null, 2)
      );
      this.handleTestResult(wsm.data, ws);
    } else if (wsm.type === "testError") {
      console.log(`[WebSocketProcess] Received testError message`);
      console.log(
        `[WebSocketProcess] Test error data:`,
        JSON.stringify(wsm.data, null, 2)
      );
      this.handleTestError(wsm.data, ws);
    } else {
      console.log(
        `[WebSocketProcess] Unhandled WebSocket message type: ${wsm.type}`
      );
    }
  }
  getProcessSummary() {
    const processes = Array.from(this.allProcesses.entries()).map(
      ([id, procInfo]) => this.serializeProcessInfo(id, procInfo, this.processLogs.get(id) || [])
    );
    return { processes };
  }
  getProcessLogs(processId) {
    return this.processLogs.get(processId) || [];
  }
  // Method to broadcast logs to subscribed clients
  broadcastLogs(processId, logEntry) {
    if (!this.logSubscriptions) {
      this.logSubscriptions = /* @__PURE__ */ new Map();
    }
    const subscriptions = this.logSubscriptions.get(processId);
    if (subscriptions) {
      const message = JSON.stringify({
        type: "logs",
        processId,
        logs: [logEntry],
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      subscriptions.forEach((client) => {
        if (client.readyState === WebSocket2.OPEN) {
          client.send(message);
        }
      });
    }
    const generalMessage = JSON.stringify({
      type: "logs",
      processId: "system",
      logs: [logEntry],
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket2.OPEN) {
        client.send(generalMessage);
      }
    });
  }
  // Attach log capture to existing processes
  attachLogCaptureToExistingProcesses() {
    if (!this.runningProcesses || !(this.runningProcesses instanceof Map)) {
      console.warn("runningProcesses is not available or not a Map");
      return;
    }
    for (const [processId, proc] of this.runningProcesses.entries()) {
      this.attachLogCapture(processId, proc);
    }
  }
  // Override runningProcesses.set to capture logs for new processes
  overrideRunningProcessesSet() {
    console.log(
      "Attempting to override runningProcesses.set",
      this.runningProcesses
    );
    if (!(this.runningProcesses instanceof Map)) {
      console.warn("runningProcesses is not a Map, cannot override set");
      return;
    }
    const originalSet = this.runningProcesses.set.bind(this.runningProcesses);
    this.runningProcesses.set = (key, value) => {
      console.log(`runningProcesses.set called for ${key}`);
      const result = originalSet(key, value);
      this.attachLogCapture(key, value);
      return result;
    };
  }
  // Attach log capture to a single process
  attachLogCapture(processId, childProcess) {
    console.log(
      `Attaching log capture to process ${processId}`,
      childProcess ? "has childProcess" : "no childProcess"
    );
    if (!childProcess) {
      console.warn(`No childProcess for ${processId}`);
      return;
    }
    if (childProcess.stdout && typeof childProcess.stdout.on === "function") {
      console.log(`Process ${processId} has stdout`);
      childProcess.stdout.on("data", (data) => {
        const message = data.toString().trim();
        if (message) {
          this.addProcessLog(processId, "info", message, "stdout");
        }
      });
    } else {
      console.warn(`Child process ${processId} has no stdout or stdout.on`);
    }
    if (childProcess.stderr && typeof childProcess.stderr.on === "function") {
      console.log(`Process ${processId} has stderr`);
      childProcess.stderr.on("data", (data) => {
        const message = data.toString().trim();
        if (message) {
          this.addProcessLog(processId, "error", message, "stderr");
        }
      });
    } else {
      console.warn(`Child process ${processId} has no stderr or stderr.on`);
    }
  }
  // Override launch methods to capture errors
  overrideLaunchMethods() {
    const methods = ["launchNode", "launchWeb", "launchPython", "launchGolang"];
    methods.forEach((methodName) => {
      if (this[methodName] && typeof this[methodName] === "function") {
        const originalMethod = this[methodName];
        this[methodName] = async (...args) => {
          try {
            const result = await originalMethod.apply(this, args);
            return result;
          } catch (error) {
            const processId = `failed_${methodName}_${Date.now()}`;
            this.addProcessLog(
              processId,
              "error",
              `Failed to launch via ${methodName}: ${error?.message || error}`,
              "launch"
            );
            throw error;
          }
        };
      }
    });
  }
  // Call this method when a process outputs data
  addProcessLog(processId, level, message, source) {
    if (!this.processLogs) {
      console.error("processLogs not initialized");
      return;
    }
    const logEntry = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      level,
      message,
      source: source || "process"
    };
    console.log(`[LOG] ${processId} ${level}: ${message} (${source})`);
    const logs2 = this.processLogs.get(processId) || [];
    logs2.push(logEntry);
    this.processLogs.set(processId, logs2);
    this.broadcastLogs(processId, logEntry);
  }
  // Schedule test for execution - to be overridden by subclasses
  scheduleTestForExecution(testId, testName, runtime, ws) {
    console.log(
      `[WebSocketProcess] Default scheduleTestForExecution called for test ${testId}`
    );
    this.testInfoMap.set(testId, { testName, runtime });
    console.log(`[WebSocketProcess] Stored test info for ${testId}:`, {
      testName,
      runtime
    });
    const testResourceConfiguration = {
      name: testName,
      fs: process.cwd(),
      ports: [3e3],
      timeout: 3e4,
      retries: 3,
      environment: {}
    };
    if (runtime === "web") {
      testResourceConfiguration.browserWSEndpoint = process.env.BROWSER_WS_ENDPOINT || "";
    }
    const message = {
      type: "testResource",
      data: {
        testId,
        testName,
        runtime,
        allocatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        testResourceConfiguration
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    console.log(`[WebSocketProcess] Sending immediate test resource:`, message);
    ws.send(JSON.stringify(message));
  }
  // Handle test result from client
  handleTestResult(testResultData, ws) {
    try {
      console.log(`[WebSocketProcess] Handling test result`);
      let testId;
      if (this.testConnections) {
        for (const [id, connection] of this.testConnections.entries()) {
          if (connection === ws) {
            testId = id;
            break;
          }
        }
      }
      if (!testId) {
        throw new Error(
          "Could not find testId associated with WebSocket connection. The test must send a greeting before sending results."
        );
      }
      const testInfo = this.testInfoMap.get(testId);
      if (!testInfo) {
        throw new Error(
          `No stored test info found for testId: ${testId}. The test must send a greeting before sending results.`
        );
      }
      const { testName, runtime } = testInfo;
      console.log(
        `[WebSocketProcess] Retrieved stored test info for ${testId}:`,
        { testName, runtime }
      );
      this.handleTestResultWithInfo(
        testId,
        testName,
        runtime,
        testResultData,
        ws
      );
    } catch (error) {
      console.error(`[WebSocketProcess] Error handling test result:`, error);
      const errorMessage = {
        type: "testResultError",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        error: error.message
      };
      ws.send(JSON.stringify(errorMessage));
    }
  }
  handleTestResultWithInfo(testId, testName, runtime, testResultData, ws) {
    const reportDest = `testeranto/reports/${this.projectName || "default"}/${testName}/${runtime}`;
    if (!fs5.existsSync(reportDest)) {
      fs5.mkdirSync(reportDest, { recursive: true });
    }
    const testsJsonPath = path7.join(reportDest, "tests.json");
    const testsJsonContent = JSON.stringify(testResultData, null, 2);
    fs5.writeFileSync(testsJsonPath, testsJsonContent);
    console.log(`[WebSocketProcess] Wrote test results to ${testsJsonPath}`);
    this.testInfoMap.delete(testId);
    console.log(`[WebSocketProcess] Removed stored test info for ${testId}`);
    const ackMessage = {
      type: "testResultAck",
      testId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      message: "Test results saved successfully"
    };
    ws.send(JSON.stringify(ackMessage));
    console.log(
      `[WebSocketProcess] Sent test result acknowledgment for test ${testId}`
    );
  }
  // Handle test error from client
  handleTestError(testErrorData, ws) {
    try {
      console.log(`[WebSocketProcess] Handling test error`);
      let testId;
      if (this.testConnections) {
        for (const [id, connection] of this.testConnections.entries()) {
          if (connection === ws) {
            testId = id;
            break;
          }
        }
      }
      if (!testId) {
        throw new Error(
          "Could not find testId associated with WebSocket connection. The test must send a greeting before sending errors."
        );
      }
      const testInfo = this.testInfoMap.get(testId);
      if (!testInfo) {
        throw new Error(
          `No stored test info found for testId: ${testId}. The test must send a greeting before sending errors.`
        );
      }
      const { testName, runtime } = testInfo;
      console.log(
        `[WebSocketProcess] Retrieved stored test info for ${testId}:`,
        { testName, runtime }
      );
      this.handleTestErrorWithInfo(
        testId,
        testName,
        runtime,
        testErrorData,
        ws
      );
    } catch (error) {
      console.error(`[WebSocketProcess] Error handling test error:`, error);
      const errorMessage = {
        type: "testErrorError",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        error: error.message
      };
      ws.send(JSON.stringify(errorMessage));
    }
  }
  handleTestErrorWithInfo(testId, testName, runtime, testErrorData, ws) {
    const reportDest = `testeranto/reports/${this.projectName || "default"}/${testName}/${runtime}`;
    if (!fs5.existsSync(reportDest)) {
      fs5.mkdirSync(reportDest, { recursive: true });
    }
    const errorJsonPath = path7.join(reportDest, "error.json");
    const errorJsonContent = JSON.stringify(testErrorData, null, 2);
    fs5.writeFileSync(errorJsonPath, errorJsonContent);
    console.log(`[WebSocketProcess] Wrote test error to ${errorJsonPath}`);
    this.testInfoMap.delete(testId);
    console.log(`[WebSocketProcess] Removed stored test info for ${testId}`);
    const ackMessage = {
      type: "testErrorAck",
      testId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      message: "Test error saved successfully"
    };
    ws.send(JSON.stringify(ackMessage));
    console.log(
      `[WebSocketProcess] Sent test error acknowledgment for test ${testId}`
    );
  }
  // Helper method to serialize process info
  serializeProcessInfo(id, procInfo, logs2) {
    return {
      processId: id,
      command: procInfo.command || "unknown",
      pid: procInfo.pid,
      timestamp: procInfo.timestamp || (/* @__PURE__ */ new Date()).toISOString(),
      status: procInfo.status || "unknown",
      logs: logs2.slice(-50)
      // Last 50 logs
    };
  }
};

// src/server/serverClasees/Server_TCP_FileService.ts
var Server_TCP_FileService = class extends Server_TCP_WebSocketProcess {
  constructor(configs, name, mode2) {
    super(configs, name, mode2);
  }
  // FileService methods
  writeFile_send(wsm, ws) {
    ws.send(JSON.stringify(["writeFile", wsm.data.path]));
  }
  writeFile_receive(wsm, ws) {
    fs6.writeFileSync(wsm.data.path, wsm.data.content);
  }
  readFile_receive(wsm, ws) {
    this.readFile_send(wsm, ws, fs6.readFileSync(wsm.data.path).toString());
  }
  readFile_send(wsm, ws, content) {
    ws.send(JSON.stringify(["readFile", wsm.data.path, content]));
  }
  createDirectory_receive(wsm, ws) {
    fs6.mkdirSync(wsm.data.path);
    this.createDirectory_send(wsm, ws);
  }
  createDirectory_send(wsm, ws) {
    ws.send(JSON.stringify(["createDirectory", wsm.data.path]));
  }
  deleteFile_receive(wsm, ws) {
    fs6.unlinkSync(wsm.data.path);
    this.deleteFile_send(wsm, ws);
  }
  deleteFile_send(wsm, ws) {
    ws.send(JSON.stringify(["deleteFile", wsm.data.path]));
  }
  async files_receive(wsm, ws) {
    this.files_send(wsm, ws, await getAllFilesRecursively("."));
  }
  files_send(wsm, ws, files2) {
    ws.send(JSON.stringify(["files", files2]));
  }
  projects_receive(wsm, ws) {
    this.projects_send(
      wsm,
      ws,
      JSON.parse(fs6.readFileSync("./testeranto/projects.json", "utf-8"))
    );
  }
  projects_send(wsm, ws, projects) {
    ws.send(JSON.stringify(["projects", projects]));
  }
  report_receive(wsm, ws) {
    this.report_send(wsm, ws);
  }
  async report_send(wsm, ws) {
  }
  async test_receive(wsm, ws) {
  }
  test_send(wsm, ws, project) {
    ws.send(JSON.stringify(["tests", project]));
  }
};

// src/server/serverClasees/Server_TCP_Commands.ts
var Server_TCP_Commands = class extends Server_TCP_FileService {
  constructor(configs, name, mode2) {
    super(configs, name, mode2);
  }
  // Command handlers for PM_Node
  async writeFileSync(filepath, contents, testName) {
    console.log("Server.writeFileSync called:", {
      filepath,
      testName,
      contentsLength: contents.length,
      cwd: process.cwd()
    });
    let resolvedPath = filepath;
    if (!path8.isAbsolute(filepath)) {
      resolvedPath = path8.join(process.cwd(), filepath);
      console.log("Resolved relative path to:", resolvedPath);
    }
    const dir = path8.dirname(resolvedPath);
    if (!fs7.existsSync(dir)) {
      console.log("Creating directory:", dir);
      fs7.mkdirSync(dir, { recursive: true });
    }
    console.log("Writing file:", resolvedPath);
    try {
      fs7.writeFileSync(resolvedPath, contents);
      console.log("File written successfully to", resolvedPath);
      return true;
    } catch (error) {
      console.error("Error writing file:", error);
      return false;
    }
  }
  existsSync(filepath) {
    return fs7.existsSync(filepath);
  }
  mkdirSync(filepath) {
    fs7.mkdirSync(filepath, { recursive: true });
  }
  readFile(filepath) {
    const fullPath = path8.join(process.cwd(), filepath);
    return fs7.readFileSync(fullPath, "utf-8");
  }
  createWriteStream(filepath, testName) {
    const dir = path8.dirname(filepath);
    if (!fs7.existsSync(dir)) {
      fs7.mkdirSync(dir, { recursive: true });
    }
    const stream = fs7.createWriteStream(filepath);
    return generateStreamId();
  }
  end(uid) {
    return true;
  }
  customclose(fsPath, testName) {
    return true;
  }
};

// src/server/serverClasees/Server_DockerCompose.ts
var Server_DockerCompose = class extends Server_TCP_Commands {
  constructor(cwd, configs, name, mode2) {
    super(configs, name, mode2);
    this.cwd = cwd;
    this.config = path9.join(
      "testeranto",
      "bundles",
      `${this.projectName}-docker-compose.yml`
    );
    this.composeDir = process.cwd();
    this.composeFile = path9.join(
      this.composeDir,
      "testeranto",
      "bundles",
      `${this.projectName}-docker-compose.yml`
    );
    this.initializeAndStart().catch((error) => {
      console.error("Failed to initialize docker-compose:", error);
    });
  }
  async initializeAndStart() {
    const { setupDockerCompose } = await import("./dockerComposeGenerator-FY3U4LJK.mjs");
    await setupDockerCompose(this.configs, this.projectName, {
      logger: {
        log: (...args) => console.log(...args),
        error: (...args) => console.error(...args)
      }
    });
    await this.startServices();
  }
  async startServices() {
    if (!fs8.existsSync(this.composeFile)) {
      console.error(`Docker-compose file not found: ${this.composeFile}`);
      console.error(`Current directory: ${process.cwd()}`);
      const bundlesDir = path9.join(process.cwd(), "testeranto", "bundles");
      if (fs8.existsSync(bundlesDir)) {
        console.error(`Contents of ${bundlesDir}:`);
        try {
          const files2 = fs8.readdirSync(bundlesDir);
          console.error(files2);
        } catch (e) {
          console.error(`Error reading directory: ${e}`);
        }
      }
      return;
    }
    try {
      const result = await this.DC_upAll();
      console.log(
        `docker-compose up completed with exit code: ${result.exitCode}`
      );
      if (result.exitCode !== 0) {
        console.error(
          `docker-compose up failed with exit code ${result.exitCode}:`
        );
        console.error(`Error: ${result.err}`);
        console.error(`Output: ${result.out}`);
      } else {
        console.log(`Waiting for services to become healthy (15 seconds)...`);
        await new Promise((resolve) => setTimeout(resolve, 15e3));
        const psResult2 = await this.DC_ps();
        console.log(`Service status after startup:`, psResult2.out);
      }
    } catch (error) {
      console.error(
        `Error starting docker-compose services:`,
        error,
        this.composeFile
      );
      console.error(`Full error:`, error);
    }
  }
  async DC_upAll(options) {
    const opts = this.mergeOptions(options);
    return await upAll(opts);
  }
  async DC_down(options) {
    const opts = this.mergeOptions(options);
    return await down(opts);
  }
  async DC_upOne(serviceName, options) {
    const opts = this.mergeOptions(options);
    return await upOne(serviceName, opts);
  }
  async DC_ps(options) {
    const opts = this.mergeOptions(options);
    return await ps(opts);
  }
  async DC_logs(serviceName, options) {
    const opts = this.mergeOptions(options);
    return await logs(serviceName, opts);
  }
  mergeOptions(options) {
    const base = {
      cwd: this.composeDir,
      // Use composeDir which is process.cwd()
      config: this.config,
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
    return this.config;
  }
  // Static methods for direct usage without creating an instance
  static async upAll(options) {
    return await upAll(options);
  }
  static async down(options) {
    return await down(options);
  }
  static async logs(serviceName, options) {
    return await logs(serviceName, options);
  }
};

// src/server/serverClasees/ServerTaskManagerBase.ts
var ServerTaskManagerBase = class extends Server_DockerCompose {
  constructor(configs, testName, mode2) {
    super(process.cwd(), configs, testName, mode2);
    this.logStreams = {};
    this.clients = /* @__PURE__ */ new Set();
    // Process management fields
    this.runningProcesses = /* @__PURE__ */ new Map();
    this.allProcesses = /* @__PURE__ */ new Map();
    this.processLogs = /* @__PURE__ */ new Map();
    this.webProcesses = /* @__PURE__ */ new Map();
    this.ports = {};
    this.summary = {};
    // Start monitoring broadcast using existing WebSocket server
    this.startMonitoringBroadcast = () => {
      console.log("Starting monitoring broadcast via existing WebSocket server");
      if (this.webSocketBroadcastMessage) {
        setInterval(() => {
          this.webSocketBroadcastMessage({
            type: "statusUpdate",
            data: this.getProcessSummary(),
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
        }, this.configs.monitoring?.updateInterval || 1e3);
      }
    };
    // Get process summary for monitoring
    this.getProcessSummary = () => {
      const processes = [];
      for (const [id, info] of this.allProcesses.entries()) {
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
        processes
      };
    };
    // Get logs for a process
    this.getProcessLogs = (processId) => {
      return this.processLogs.get(processId) || [];
    };
    // Add log entry from any source
    this.addLogEntry = (processId, source, message, timestamp = /* @__PURE__ */ new Date()) => {
      if (!this.processLogs.has(processId)) {
        this.processLogs.set(processId, []);
      }
      const logEntry = `[${timestamp.toISOString()}] [${source}] ${message}`;
      this.processLogs.get(processId).push(logEntry);
      if (this.webSocketBroadcastMessage) {
        this.webSocketBroadcastMessage({
          type: "logUpdate",
          processId,
          source,
          message,
          timestamp: timestamp.toISOString()
        });
      }
      if (this.webSocketBroadcastMessage) {
        this.webSocketBroadcastMessage({
          type: "monitoringLog",
          processId,
          source,
          message,
          timestamp: timestamp.toISOString()
        });
      }
      if (this.logSubscriptions) {
        const subscriptions = this.logSubscriptions.get(processId);
        if (subscriptions) {
          const logMessage = {
            type: "logEntry",
            processId,
            source,
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
    // Add promise process tracking
    this.addPromiseProcess = (processId, promise, command, category, testName, platform) => {
      const actualPromise = promise || Promise.resolve();
      const processInfo = {
        promise: actualPromise,
        status: "running",
        command,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        type: "promise",
        category,
        testName,
        platform: platform || "node"
      };
      this.allProcesses.set(processId, processInfo);
      this.runningProcesses.set(processId, actualPromise);
      actualPromise.then(() => {
        const info = this.allProcesses.get(processId);
        if (info) {
          info.status = "completed";
          info.exitCode = 0;
        }
        this.runningProcesses.delete(processId);
      }).catch((error) => {
        const info = this.allProcesses.get(processId);
        if (info) {
          info.status = "error";
          info.exitCode = -1;
          info.error = error.message;
        }
        this.runningProcesses.delete(processId);
      });
      if (this.webSocketBroadcastMessage) {
        this.webSocketBroadcastMessage({
          type: "processUpdate",
          processId,
          process: processInfo
        });
      }
    };
    // Add web process (browser context)
    this.addWebProcess = (processId, contextId, testName, url) => {
      this.webProcesses.set(processId, {
        contextId,
        testName,
        startTime: /* @__PURE__ */ new Date(),
        logs: [],
        status: "running"
      });
      const processInfo = {
        status: "running",
        command: `Web test: ${testName} (${url})`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        type: "process",
        category: "bdd-test",
        testName,
        platform: "web"
      };
      this.allProcesses.set(processId, processInfo);
      if (this.webSocketBroadcastMessage) {
        this.webSocketBroadcastMessage({
          type: "processUpdate",
          processId,
          process: processInfo
        });
      }
      this.addLogEntry(
        processId,
        "console",
        `Started web test: ${testName} at ${url}`
      );
    };
    // Update web process status
    this.updateWebProcessStatus = (processId, status, exitCode, error) => {
      const webProcess = this.webProcesses.get(processId);
      if (webProcess) {
        webProcess.status = status;
      }
      const processInfo = this.allProcesses.get(processId);
      if (processInfo) {
        processInfo.status = status;
        if (exitCode !== void 0)
          processInfo.exitCode = exitCode;
        if (error)
          processInfo.error = error;
      }
      if (this.webSocketBroadcastMessage) {
        this.webSocketBroadcastMessage({
          type: "processUpdate",
          processId,
          process: processInfo
        });
      }
      const message = status === "completed" ? `Web test completed: ${webProcess?.testName || processId}` : `Web test failed: ${webProcess?.testName || processId} - ${error || "Unknown error"}`;
      this.addLogEntry(
        processId,
        status === "completed" ? "stdout" : "stderr",
        message
      );
    };
    // Check for shutdown (to be overridden or used by derived classes)
    this.checkForShutdown = async () => {
    };
    this.configs = configs;
    this.projectName = testName;
    if (configs.ports && Array.isArray(configs.ports)) {
      configs.ports.forEach((port) => {
        this.ports[port] = "";
      });
    }
    this.launchers = {};
    if (configs.monitoring) {
      setTimeout(() => {
        this.startMonitoringBroadcast();
      }, 1e3);
    }
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
  // WebSocket broadcast method - to be implemented by derived classes or parent
  webSocketBroadcastMessage(message) {
    const data = typeof message === "string" ? message : JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(data);
      }
    });
  }
};

// src/server/serverClasees/ServerTaskManager.ts
var ServerTaskManager = class extends ServerTaskManagerBase {
  constructor(configs, testName, mode2) {
    super(configs, testName, mode2);
    this.currentBuildResolve = null;
    this.currentBuildReject = null;
    this.writeBigBoard = () => {
      const summaryPath = `./testeranto/reports/${this.projectName}/summary.json`;
      const summaryData = JSON.stringify(this.summary, null, 2);
      fs9.writeFileSync(summaryPath, summaryData);
      if (this.webSocketBroadcastMessage) {
        this.webSocketBroadcastMessage({
          type: "summaryUpdate",
          data: this.summary
        });
      }
    };
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
  // deprecated
  // typeCheckIsRunning(src: string) {
  //   this.updateSummaryEntry(src, { typeErrors: "?" });
  // }
  // typeCheckIsNowDone(src: string, failures: number) {
  //   this.updateSummaryEntry(src, { typeErrors: failures });
  // }
  // lintIsRunning(src: string) {
  //   this.updateSummaryEntry(src, { staticErrors: "?" });
  // }
  // lintIsNowDone(src: string, failures: number) {
  //   this.updateSummaryEntry(src, { staticErrors: failures });
  // }
  // bddTestIsNowDone(src: string, failures: number) {
  //   this.updateSummaryEntry(src, { runTimeErrors: failures });
  //   this.writeBigBoard();
  //   this.checkForShutdown();
  // }
  async stop() {
    Object.values(this.logStreams || {}).forEach((logs2) => logs2.closeAll());
    if (this.wss) {
      this.wss.close(() => {
        console.log("WebSocket server closed");
      });
    }
    this.clients.forEach((client) => {
      if (client.terminate) {
        client.terminate();
      }
    });
    this.clients.clear();
    if (this.httpServer) {
      this.httpServer.close(() => {
        console.log("HTTP server closed");
      });
    }
    this.checkForShutdown();
  }
};

// src/server/serverClasees/ServerTaskCoordinator.ts
var ServerTaskCoordinator = class extends ServerTaskManager {
  constructor(configs, testName, mode2) {
    super(configs, testName, mode2);
    this.queue = [];
    this.processingQueue = false;
    this.testSchedulingQueue = [];
    this.processingSchedulingQueue = false;
    this.checkQueue = async () => {
      if (this.processingQueue) {
        return;
      }
      this.processingQueue = true;
      try {
        while (this.queue.length > 0) {
          const item = this.queue.shift();
          if (!item) {
            continue;
          }
          const { testName, runtime, addableFiles } = item;
          console.log(
            ansiC2.blue(
              ansiC2.inverse(`Processing ${testName} (${runtime}) from queue`)
            )
          );
          try {
            await this.processQueueItem(testName, runtime, addableFiles);
          } catch (error) {
            console.error(
              ansiC2.red(`Error executing test ${testName} (${runtime}): ${error}`)
            );
          }
          this.writeBigBoard();
        }
      } finally {
        this.processingQueue = false;
      }
      this.checkForShutdown();
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
      if (this.mode === "dev")
        return;
      let inflight = false;
      const summary = this.getSummary();
      Object.keys(summary).forEach((k) => {
        if (summary[k].prompt === "?") {
          console.log(ansiC2.blue(ansiC2.inverse(`\u{1F555} prompt ${k}`)));
          inflight = true;
        }
      });
      Object.keys(summary).forEach((k) => {
        if (summary[k].runTimeErrors === "?") {
          console.log(ansiC2.blue(ansiC2.inverse(`\u{1F555} runTimeError ${k}`)));
          inflight = true;
        }
      });
      Object.keys(summary).forEach((k) => {
        if (summary[k].staticErrors === "?") {
          console.log(ansiC2.blue(ansiC2.inverse(`\u{1F555} staticErrors ${k}`)));
          inflight = true;
        }
      });
      Object.keys(summary).forEach((k) => {
        if (summary[k].typeErrors === "?") {
          console.log(ansiC2.blue(ansiC2.inverse(`\u{1F555} typeErrors ${k}`)));
          inflight = true;
        }
      });
      this.writeBigBoard();
      if (!inflight) {
        const hasRunningProcesses = Array.from(this.allProcesses.values()).some(
          (process2) => process2.status === "running"
        );
        const isQueueEmpty = this.queueLength === 0;
        if (!hasRunningProcesses && isQueueEmpty) {
          console.log(
            ansiC2.inverse(`${this.projectName} has been tested. Goodbye.`)
          );
        }
      }
    };
  }
  // Method to add test to scheduling queue (called from WebSocket handler)
  addTestToSchedulingQueue(testId, testName, runtime, ws) {
    console.log(
      `[SCHEDULING] addTestToSchedulingQueue called for test ${testId} (${testName})`
    );
    const alreadyInQueue = this.testSchedulingQueue.some(
      (item) => item.testId === testId
    );
    if (!alreadyInQueue) {
      this.testSchedulingQueue.push({
        testId,
        testName,
        runtime,
        ws,
        timestamp: /* @__PURE__ */ new Date()
      });
      console.log(
        `[SCHEDULING] Added test ${testName} (${testId}) to scheduling queue. Queue length: ${this.testSchedulingQueue.length}`
      );
      this.processSchedulingQueue();
    } else {
      console.log(
        `[SCHEDULING] Test ${testName} (${testId}) is already in scheduling queue`
      );
    }
  }
  // Process the scheduling queue to allocate test resources
  async processSchedulingQueue() {
    console.log(
      `[SCHEDULING] processSchedulingQueue called. Queue length: ${this.testSchedulingQueue.length}, processing: ${this.processingSchedulingQueue}`
    );
    if (this.processingSchedulingQueue || this.testSchedulingQueue.length === 0) {
      console.log(
        `[SCHEDULING] Skipping processing: processing=${this.processingSchedulingQueue}, empty=${this.testSchedulingQueue.length === 0}`
      );
      return;
    }
    this.processingSchedulingQueue = true;
    console.log(`[SCHEDULING] Started processing scheduling queue`);
    try {
      while (this.testSchedulingQueue.length > 0) {
        const item = this.testSchedulingQueue.shift();
        if (!item)
          continue;
        const { testId, testName, runtime, ws } = item;
        console.log(
          `[SCHEDULING] Processing test ${testName} (${testId}) from scheduling queue`
        );
        let allocatedPorts = null;
        const testResourceConfiguration = {
          name: testName,
          fs: process.cwd(),
          ports: [],
          timeout: 3e4,
          retries: 3,
          environment: {}
        };
        switch (runtime) {
          case "web":
            allocatedPorts = this.allocatePorts(2, testName);
            testResourceConfiguration.ports = allocatedPorts || [3e3, 3001];
            testResourceConfiguration.browserWSEndpoint = process.env.BROWSER_WS_ENDPOINT || "";
            break;
          case "node":
            allocatedPorts = this.allocatePorts(1, testName);
            testResourceConfiguration.ports = allocatedPorts || [3e3];
            break;
          case "python":
            allocatedPorts = this.allocatePorts(1, testName);
            testResourceConfiguration.ports = allocatedPorts || [3e3];
            break;
          case "golang":
            allocatedPorts = this.allocatePorts(1, testName);
            testResourceConfiguration.ports = allocatedPorts || [3e3];
            break;
          default:
            allocatedPorts = this.allocatePorts(1, testName);
            testResourceConfiguration.ports = allocatedPorts || [3e3];
        }
        console.log(
          `[SCHEDULING] Allocated ports for test ${testId}:`,
          allocatedPorts
        );
        const testResource = {
          testId,
          testName,
          runtime,
          allocatedAt: (/* @__PURE__ */ new Date()).toISOString(),
          testResourceConfiguration,
          // Add the test to the main processing queue
          shouldExecute: true
        };
        console.log(
          `[SCHEDULING] Prepared test resource for test ${testId}:`,
          testResource
        );
        console.log(`[SCHEDULING] Checking WebSocket readyState for test ${testId}: ${ws.readyState}`);
        if (ws.readyState === WebSocket3.OPEN) {
          const testResourceConfig = {
            name: testName,
            fs: process.cwd(),
            ports: testResourceConfiguration.ports,
            timeout: testResourceConfiguration.timeout,
            retries: testResourceConfiguration.retries,
            environment: testResourceConfiguration.environment
          };
          if (runtime === "web" && testResourceConfiguration.browserWSEndpoint) {
            testResourceConfig.browserWSEndpoint = testResourceConfiguration.browserWSEndpoint;
          }
          const message = {
            type: "testResource",
            data: {
              testId,
              testName,
              runtime,
              allocatedAt: (/* @__PURE__ */ new Date()).toISOString(),
              testResourceConfiguration: testResourceConfig
            },
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          };
          console.log(
            `[SCHEDULING] Sending test resource to test ${testId}:`,
            JSON.stringify(message, null, 2)
          );
          try {
            ws.send(JSON.stringify(message));
            console.log(
              `[SCHEDULING] Sent test resource to test ${testName} (${testId})`
            );
          } catch (error) {
            console.error(`[SCHEDULING] Error sending test resource:`, error);
            console.log(
              `[SCHEDULING] Putting test ${testId} back to the front of the queue due to send error`
            );
            this.testSchedulingQueue.unshift(item);
          }
        } else {
          console.warn(
            `[SCHEDULING] WebSocket for test ${testName} (${testId}) is not open (readyState: ${ws.readyState}), cannot send resource`
          );
          console.log(
            `[SCHEDULING] Putting test ${testId} back to the front of the queue`
          );
          this.testSchedulingQueue.unshift(item);
        }
      }
    } finally {
      this.processingSchedulingQueue = false;
      console.log(
        `[SCHEDULING] Finished processing scheduling queue. Remaining items: ${this.testSchedulingQueue.length}`
      );
    }
  }
  // Override to ensure we have access to the method from WebSocket handler
  // We'll add a getter to access addTestToSchedulingQueue
  getSchedulingQueueMethod() {
    return this.addTestToSchedulingQueue.bind(this);
  }
  // Override scheduleTestForExecution to use the scheduling queue
  scheduleTestForExecution(testId, testName, runtime, ws) {
    console.log(
      `[ServerTaskCoordinator] scheduleTestForExecution called for test ${testId}`
    );
    if (!this.testInfoMap) {
      this.testInfoMap = /* @__PURE__ */ new Map();
    }
    this.testInfoMap.set(testId, { testName, runtime });
    console.log(`[ServerTaskCoordinator] Stored test info for ${testId}:`, { testName, runtime });
    this.addTestToSchedulingQueue(testId, testName, runtime, ws);
  }
  // addToQueue(src: string, runtime: IRunTime, addableFiles?: string[]) {
  //   this.addToQueue(
  //     src,
  //     runtime,
  //     this.configs,
  //     this.projectName,
  //     this.cleanupTestProcesses.bind(this),
  //     this.checkQueue.bind(this),
  //     addableFiles
  //   );
  // }
  cleanupTestProcessesInternal(testName) {
  }
  async processQueueItem(testName, runtime, addableFiles) {
    throw new Error(
      `processQueueItem should be implemented by derived class for ${testName} (${runtime})`
    );
  }
  // QueueManager methods
  addToQueue(src, runtime, configs, projectName, cleanupTestProcesses, checkQueue, addableFiles) {
    const originalSrc = src;
    if (src.includes("testeranto/bundles")) {
      const runnables = getRunnables(configs, projectName);
      const allEntryPoints = [
        ...Object.entries(runnables.nodeEntryPoints),
        ...Object.entries(runnables.webEntryPoints),
        ...Object.entries(runnables.pythonEntryPoints),
        ...Object.entries(runnables.golangEntryPoints)
      ];
      const normalizedSrc = src.replace(/\\/g, "/");
      const bundlePattern = new RegExp(
        `testeranto/bundles/${runtime}/${projectName}/(.+\\.)mjs$`
      );
      const match = normalizedSrc.match(bundlePattern);
      if (match) {
        const testNameWithoutExt = match[1].slice(0, -1);
        const potentialTestName = testNameWithoutExt + ".ts";
        for (const [testName, bundlePath] of allEntryPoints) {
          if (testName === potentialTestName) {
            src = testName;
            console.log(
              "Mapped bundle path to test name:",
              originalSrc,
              "->",
              src
            );
            break;
          }
        }
      }
      if (src === originalSrc) {
        for (const [testName, bundlePath] of allEntryPoints) {
          const normalizedBundlePath = bundlePath.replace(
            /\\/g,
            "/"
          );
          if (normalizedSrc.endsWith(normalizedBundlePath)) {
            src = testName;
            console.log("Fallback mapping:", originalSrc, "->", src);
            break;
          }
        }
      }
    }
    this.cleanupTestProcessesInternal(src);
    const alreadyInQueue = this.queue.some(
      (item) => item.testName === src && item.runtime === runtime
    );
    if (!alreadyInQueue) {
      this.queue.push({ testName: src, runtime, addableFiles });
      console.log(
        ansiC2.green(
          ansiC2.inverse(`Added ${src} (${runtime}) to the processing queue`)
        )
      );
      checkQueue();
    } else {
      console.log(
        ansiC2.yellow(
          ansiC2.inverse(
            `Test ${src} (${runtime}) is already in the queue, skipping`
          )
        )
      );
    }
  }
  pop() {
    return this.queue.pop();
  }
  includes(testName, runtime) {
    if (runtime !== void 0) {
      return this.queue.some(
        (item) => item.testName === testName && item.runtime === runtime
      );
    }
    return this.queue.some((item) => item.testName === testName);
  }
  get queueLength() {
    return this.queue.length;
  }
  clearQueue() {
    this.queue = [];
  }
  getAllQueueItems() {
    return [...this.queue];
  }
};

// src/server/serverClasees/utils/TestEnvironmentSetup.ts
import fs10 from "fs";
import ansiColors from "ansi-colors";
var TestEnvironmentSetup = class {
  constructor(ports, projectName, browser, queue) {
    this.ports = ports;
    this.projectName = projectName;
    this.browser = browser;
    this.queue = queue;
  }
  async setupTestEnvironment(src, runtime) {
    const reportDest = `testeranto/reports/${this.projectName}/${src.split(".").slice(0, -1).join(".")}/${runtime}`;
    if (!fs10.existsSync(reportDest)) {
      fs10.mkdirSync(reportDest, { recursive: true });
    }
    const testConfig = null;
    const testConfigResource = { ports: 0 };
    const portsToUse = [];
    let testResources = "";
    const browserWsEndpoint = this.browser ? this.browser.wsEndpoint() : "no-browser";
    console.log(
      `TestEnvironmentSetup: browser WebSocket endpoint for ${src}: ${browserWsEndpoint}`
    );
    if (testConfigResource.ports === 0) {
      testResources = JSON.stringify({
        name: src,
        ports: [],
        fs: reportDest,
        browserWSEndpoint: browserWsEndpoint
      });
    } else if (testConfigResource.ports > 0) {
      const openPorts = Object.entries(this.ports).filter(
        ([, status]) => status === ""
      );
      if (openPorts.length >= testConfigResource.ports) {
        for (let i = 0; i < testConfigResource.ports; i++) {
          portsToUse.push(openPorts[i][0]);
          this.ports[openPorts[i][0]] = src;
        }
        testResources = JSON.stringify({
          scheduled: true,
          name: src,
          ports: portsToUse,
          fs: reportDest,
          browserWSEndpoint: browserWsEndpoint
        });
      } else {
        console.log(
          ansiColors.red(
            `${runtime}: cannot run ${src} because there are no open ports ATM. This job will be enqueued and run again when a port is available`
          )
        );
        this.queue.push(src);
        throw new Error("No ports available");
      }
    } else {
      console.error("negative port makes no sense", src);
      process.exit(-1);
    }
    return {
      reportDest,
      testConfig,
      testConfigResource,
      portsToUse,
      testResources
    };
  }
  cleanupPorts(portsToUse) {
    portsToUse.forEach((port) => {
      this.ports[port] = "";
    });
  }
};

// src/server/serverClasees/Server.ts
var Server = class extends ServerTaskCoordinator {
  constructor(configs, testName, mode2) {
    super(configs, testName, mode2);
    fs11.writeFileSync(
      path10.join(process.cwd(), "testeranto", `${testName}.json`),
      JSON.stringify(configs, null, 2)
    );
    configs.ports.forEach((port) => {
      this.ports[port] = "";
    });
    this.launchers = {};
    this.testName = testName;
    this.composeDir = process.cwd();
    this.composeFile = path10.join(
      this.composeDir,
      "testeranto",
      "bundles",
      `${this.testName}-docker-compose.yml`
    );
    this.testEnvironmentSetup = new TestEnvironmentSetup(
      this.ports,
      this.projectName,
      this.browser,
      this.queue
    );
  }
  async start() {
    try {
    } catch (error) {
      console.error("Build processes failed:", error);
      return;
    }
    this.mapping().forEach(async ([command, func]) => {
      globalThis[command] = func;
    });
    if (!fs11.existsSync(`testeranto/reports/${this.projectName}`)) {
      fs11.mkdirSync(`testeranto/reports/${this.projectName}`);
    }
  }
  async stop() {
    console.log(ansiC3.inverse("Testeranto-Run is shutting down gracefully..."));
    this.mode = "once";
    super.stop();
  }
};

// src/makeHtmlTestFiles.ts
import path11 from "path";
import fs12 from "fs";

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
var createLangConfig = (testFile, check, options) => {
  return {
    plugins: options?.plugins || [],
    loaders: options?.loaders || {},
    tests: { [testFile]: { ports: 0 } },
    externals: options?.externals || [],
    test: options?.testBlocks,
    prod: options?.prodBlocks,
    check
    // build: options?.build,
    // processPool: options?.processPool,
    // chrome: options?.chrome,
    // monitoring: options?.monitoring || {}, // Include monitoring config
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
  golang: createLangConfig(
    "example/Calculator.golingvu.test.go",
    "example/staticAnalysis/golang.ts"
  ),
  python: createLangConfig(
    "example/Calculator.pitono.test.py",
    "example/staticAnalysis/python.py"
  ),
  web: createLangConfig(
    "example/Calculator.test.ts",
    "example/staticAnalysis/web.ts"
  ),
  node: createLangConfig(
    "example/Calculator.test.ts",
    "example/staticAnalysis/node.ts"
  )
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
    const htmlFilePath = path11.normalize(
      `${process.cwd()}/testeranto/bundles/${testsName2}/${sourceDir.join(
        "/"
      )}/${sourceFileNameMinusJs}.html`
    );
    const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
    const cssFilePath = `./${sourceFileNameMinusJs}.css`;
    fs12.mkdirSync(path11.dirname(htmlFilePath), { recursive: true });
    fs12.writeFileSync(
      htmlFilePath,
      web_html_default(jsfilePath, htmlFilePath, cssFilePath)
    );
    console.log(`Generated HTML file: ${htmlFilePath}`);
  }
};

// src/makeHtmlReportFile.ts
import path12 from "path";
import fs13 from "fs";

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
  const runtimes = [];
  for (const runtime of ["node", "web", "golang", "python"]) {
    const runtimeConfig = config2[runtime];
    if (runtimeConfig && runtimeConfig.tests) {
      if (Object.keys(runtimeConfig.tests).includes(testPath)) {
        runtimes.push(runtime);
      }
    }
  }
  return runtimes;
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
      const htmlFilePath = path12.normalize(
        `${process.cwd()}/testeranto/reports/${testsName2}/${sourceDir.join(
          "/"
        )}/${sourceFileNameMinusExtension}/${runtime}/index.html`
      );
      fs13.mkdirSync(path12.dirname(htmlFilePath), { recursive: true });
      const htmlDir = path12.dirname(htmlFilePath);
      const reportJsPath = path12.join(
        process.cwd(),
        "dist",
        "prebuild",
        "Report.js"
      );
      const relativeReportJsPath = path12.relative(htmlDir, reportJsPath);
      const relativeReportJsUrl = relativeReportJsPath.split(path12.sep).join("/");
      const reportCssPath = path12.join(
        process.cwd(),
        "dist",
        "prebuild",
        "Report.css"
      );
      const relativeReportCssPath = path12.relative(htmlDir, reportCssPath);
      const relativeReportCssUrl = relativeReportCssPath.split(path12.sep).join("/");
      const htmlContent = generateHtmlContent({
        sourceFileNameMinusExtension,
        relativeReportCssUrl,
        relativeReportJsUrl,
        runtime,
        sourceFilePath,
        testsName: testsName2
      });
      fs13.writeFileSync(htmlFilePath, htmlContent);
      console.log(`Generated HTML file: ${htmlFilePath}`);
    }
  }
};

// src/testeranto.ts
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
if (!process.argv[2]) {
  console.error(`The 2nd argument should be a testeranto config file name.`);
  process.exit(-1);
}
var configFilepath = process.argv[2];
var testsName = path13.basename(configFilepath).split(".").slice(0, -1).join(".");
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
  console.log(ansiC4.inverse("Press 'q' to initiate a graceful shutdown."));
  console.log(ansiC4.inverse("Press 'x' to quit forcefully."));
  setupKeypressHandling();
  setupFileSystem(config2, testsName);
  let pm = null;
  pm = new Server(config2, testsName, mode);
  await pm.start();
  if (!fs14.existsSync(`testeranto/reports/${testsName}`)) {
    fs14.mkdirSync(`testeranto/reports/${testsName}`);
  }
  fs14.writeFileSync(
    `testeranto/reports/${testsName}/config.json`,
    JSON.stringify(config2, null, 2)
  );
  makeHtmlTestFiles(testsName);
  makeHtmlReportFile(testsName, config2);
  const {
    nodeEntryPoints,
    // nodeEntryPointSidecars,
    webEntryPoints,
    // webEntryPointSidecars,
    // pureEntryPoints,
    // pureEntryPointSidecars,
    pythonEntryPoints,
    // pythonEntryPointSidecars,
    golangEntryPoints
    // golangEntryPointSidecars,
  } = getRunnables(config2, testsName);
  [
    ["node", Object.keys(nodeEntryPoints)],
    ["web", Object.keys(webEntryPoints)],
    ["python", Object.keys(pythonEntryPoints)],
    ["golang", Object.keys(golangEntryPoints)]
  ].forEach(async ([runtime, keys]) => {
    keys.forEach(async (k) => {
      fs14.mkdirSync(
        `testeranto/reports/${testsName}/${k.split(".").slice(0, -1).join(".")}/${runtime}`,
        { recursive: true }
      );
    });
  });
  process.stdin.on("keypress", (str, key) => {
    if (key.name === "q") {
      console.log("Testeranto is shutting down gracefully...");
      if (pm) {
        pm.stop();
      } else {
        process.exit();
      }
    }
  });
});
