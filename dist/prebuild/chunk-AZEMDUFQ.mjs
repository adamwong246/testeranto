// src/testeranto.ts
import ansiC4 from "ansi-colors";
import fs13 from "fs";
import path12 from "path";
import readline from "readline";

// src/server/serverClasees/fileSystemSetup.ts
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

// src/server/serverClasees/fileSystemSetup.ts
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
import { default as ansiC3 } from "ansi-colors";
import fs10 from "fs";
import path9 from "path";

// src/server/serverClasees/TestEnvironmentSetup.ts
import fs2 from "fs";
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
    if (!fs2.existsSync(reportDest)) {
      fs2.mkdirSync(reportDest, { recursive: true });
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

// src/server/serverClasees/ServerTaskCoordinator.ts
import { default as ansiC2 } from "ansi-colors";

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
import path8 from "path";

// src/server/serverClasees/Server_TCP_Commands.ts
import fs7 from "fs";
import path7 from "path";

// src/server/serverClasees/Server_TCP_utils.ts
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

// src/server/serverClasees/Server_TCP_utils.ts
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

// src/server/serverClasees/getAllFilesRecursively.ts
import fs3 from "fs";
import path4 from "path";
async function getAllFilesRecursively(directoryPath) {
  let fileList = [];
  const files2 = await fs3.readdirSync(directoryPath, { withFileTypes: true });
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
import { WebSocket as WebSocket2 } from "ws";

// src/server/serverClasees/Server_TCP_Http.ts
import fs5 from "fs";
import path6 from "path";

// src/server/serverClasees/Server_TCP_Core.ts
import http from "http";
import { WebSocketServer } from "ws";

// src/server/serverClasees/Server_Base.ts
import fs4 from "fs";
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
    fs4.mkdirSync(dir, {
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
    fs4.mkdirSync(dir, {
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
    return fs4.existsSync(destFolder);
  }
  async mkdirSync(fp) {
    if (!fs4.existsSync(fp)) {
      return fs4.mkdirSync(fp, {
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
      fs4.mkdirSync(path5.dirname(filepath), {
        recursive: true
      });
      if (!files[testName]) {
        files[testName] = /* @__PURE__ */ new Set();
      }
      files[testName].add(filepath);
      await fs4.writeFileSync(filepath, contents);
      res(true);
    });
  }
  async createWriteStream(filepath, testName) {
    const folder = filepath.split("/").slice(0, -1).join("/");
    return new Promise((res) => {
      if (!fs4.existsSync(folder)) {
        return fs4.mkdirSync(folder, {
          recursive: true
        });
      }
      const f = fs4.createWriteStream(filepath);
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
          tLog("testArtiFactory =>", fPath);
          const cleanPath = path5.resolve(fPath);
          fPaths.push(cleanPath.replace(process.cwd(), ``));
          const targetDir = cleanPath.split("/").slice(0, -1).join("/");
          fs4.mkdir(targetDir, { recursive: true }, async (error) => {
            if (error) {
            }
            fs4.writeFileSync(
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
              fs4.writeFileSync(fPath, value, "binary");
              res();
            } else if (`string` === typeof value) {
              fs4.writeFileSync(fPath, value.toString(), {
                encoding: "utf-8"
              });
              res();
            } else {
              const pipeStream = value;
              const myFile = fs4.createWriteStream(fPath);
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
    const httpPort = configs.httpPort || Number(process.env.HTTP_PORT) || 3456;
    this.httpServer.listen(httpPort, SERVER_CONSTANTS.HOST, () => {
      console.log(`HTTP server running on http://localhost:${httpPort}`);
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
    this.httpServer.on("request", this.handleHttpRequest.bind(this));
  }
  handleHttpRequest(req, res) {
    console.log(req.method, req.url);
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
    fs5.stat(filePath, (err, stats) => {
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
        fs5.readdir(filePath, (readErr, files2) => {
          if (readErr) {
            res.writeHead(500);
            res.end(`Server Error: ${readErr.message}`);
            return;
          }
          const items = files2.map((file) => {
            try {
              const stat = fs5.statSync(path6.join(filePath, file));
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
    fs5.readFile(filePath, (err, data) => {
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
    const updatedConfigs = {
      ...configs,
      httpPort: configs.httpPort || 3e3
    };
    super(updatedConfigs, name, mode2);
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
    this.setupWebSocketHandlers();
  }
  setupWebSocketHandlers() {
    this.wss.on("connection", (ws, req) => {
      this.clients.add(ws);
      console.log("Client connected from:", req.socket.remoteAddress, req.url);
      ws.on("message", (data) => {
        try {
          this.handleWebSocketMessage(data, ws);
        } catch (error) {
          console.error("Error handling WebSocket message:", error);
        }
      });
      ws.on("close", () => {
        this.clients.delete(ws);
        console.log("Client disconnected");
      });
      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
        this.clients.delete(ws);
      });
    });
  }
  handleWebSocketMessage(data, ws) {
    try {
      const rawData = data.toString();
      let parsed;
      try {
        parsed = JSON.parse(rawData);
      } catch (parseError) {
        console.error(
          "Failed to parse WebSocket message as JSON:",
          rawData,
          parseError
        );
        return;
      }
      if (Array.isArray(parsed)) {
        console.error(ERROR_MESSAGES.IPC_FORMAT_NO_LONGER_SUPPORTED);
        console.error("Received array message:", parsed);
        ws.send(
          JSON.stringify({
            error: ERROR_MESSAGES.IPC_FORMAT_NO_LONGER_SUPPORTED,
            received: parsed
          })
        );
        return;
      }
      const wsm = parsed;
      let handled = false;
      FileService_methods.forEach((fsm) => {
        if (wsm.type === fsm) {
          console.log("Handling as FileService method:", fsm);
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
          console.log(`Command ${wsm.type} returned:`, result);
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
          console.error(`Error executing command ${wsm.type}:`, error);
          sendErrorResponse(ws, key, error);
        }
        return;
      }
      this.handleWebSocketMessageTypes(wsm, ws);
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
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
    super(configs, name, mode2);
    this.overrideRunningProcessesSet();
    setTimeout(() => {
      this.attachLogCaptureToExistingProcesses();
    }, 100);
    this.overrideLaunchMethods();
  }
  handleWebSocketMessageTypes(wsm, ws) {
    super.handleWebSocketMessageTypes(wsm, ws);
    if (wsm.type === "getProcesses") {
      ws.send(
        JSON.stringify({
          type: "processes",
          data: this.getProcessSummary(),
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        })
      );
    } else if (wsm.type === "getLogs") {
      const processId = wsm.data?.processId;
      if (processId) {
        ws.send(
          JSON.stringify({
            type: "logs",
            processId,
            logs: this.getProcessLogs(processId),
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          })
        );
      }
    } else if (wsm.type === "subscribeToLogs") {
      const processId = wsm.data?.processId;
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
      }
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
    if (!path7.isAbsolute(filepath)) {
      resolvedPath = path7.join(process.cwd(), filepath);
      console.log("Resolved relative path to:", resolvedPath);
    }
    const dir = path7.dirname(resolvedPath);
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
    const fullPath = path7.join(process.cwd(), filepath);
    return fs7.readFileSync(fullPath, "utf-8");
  }
  createWriteStream(filepath, testName) {
    const dir = path7.dirname(filepath);
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
    this.config = path8.join(
      "testeranto",
      "bundles",
      `${this.projectName}-docker-compose.yml`
    );
    this.composeDir = process.cwd();
    this.composeFile = path8.join(
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
    const { setupDockerCompose } = await import("./dockerComposeGenerator-TDM5VGEV.mjs");
    console.log("mark4", this.projectName);
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
      const bundlesDir = path8.join(process.cwd(), "testeranto", "bundles");
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
  // setupDockerfileForBuild(runtime: IRunTime, testsName: string): string {
  //   // const configFilePath = process.argv[2];
  //   // let dockerfileContent: object;
  //   // if (runtime === "node") {
  //   //   dockerfileContent = nodeDockerFile(runtime);
  //   // } else if (runtime === "web") {
  //   //   dockerfileContent = webDockerFile(runtime);
  //   // } else if (runtime === "python") {
  //   //   dockerfileContent = pythonDockerFile(runtime);
  //   // } else if (runtime === "golang") {
  //   //   dockerfileContent = golangDockerFile(runtime);
  //   // } else {
  //   //   throw new Error(
  //   //     `Unsupported runtime for build Dockerfile generation: ${runtime}`
  //   //   );
  //   // }
  //   // if (!dockerfileContent || dockerfileContent.trim().length === 0) {
  //   //   console.warn(
  //   //     `Generated empty Build Dockerfile for ${runtime}, using fallback`
  //   //   );
  //   //   const baseNodeImage = "node:20.19.4-alpine";
  //   //   dockerfileContent = `FROM ${
  //   //     runtime === "node"
  //   //       ? baseNodeImage
  //   //       : runtime === "python"
  //   //       ? "python:3.11-alpine"
  //   //       : runtime === "golang"
  //   //       ? "golang:1.21-alpine"
  //   //       : baseNodeImage
  //   //   }\nWORKDIR /app\nRUN mkdir -p /workspace/testeranto/metafiles\nCOPY . .\nRUN echo 'Build phase completed'\nCMD ["sh", "-c", "echo 'Build service started' && tail -f /dev/null"]\n`;
  //   // }
  //   // const dockerfileName = `${runtime}.Dockerfile`;
  //   // const dockerfileDir = path.join(
  //   //   "testeranto",
  //   //   "bundles",
  //   //   testsName,
  //   //   runtime
  //   // );
  //   // const dockerfilePath = path.join(dockerfileDir, dockerfileName);
  //   // // Ensure we're not writing outside of testeranto/bundles
  //   // const normalizedDir = path.normalize(dockerfileDir);
  //   // if (!normalizedDir.startsWith(path.join("testeranto", "bundles"))) {
  //   //   throw new Error(
  //   //     `Invalid Dockerfile directory: ${dockerfileDir}. Must be under testeranto/bundles/`
  //   //   );
  //   // }
  //   // // Create the directory and write the file
  //   // const fullDockerfileDir = path.join(process.cwd(), dockerfileDir);
  //   // fs.mkdirSync(fullDockerfileDir, { recursive: true });
  //   // const fullDockerfilePath = path.join(process.cwd(), dockerfilePath);
  //   // fs.writeFileSync(fullDockerfilePath, yaml.dump(dockerfileContent));
  //   // // Verify the file exists
  //   // if (!fs.existsSync(fullDockerfilePath)) {
  //   //   throw new Error(
  //   //     `Failed to create build Dockerfile at ${fullDockerfilePath}`
  //   //   );
  //   // }
  //   return "dockerfileDir";
  // }
  // public generateBuildServiceForRuntime(
  //   c: IBuiltConfig,
  //   runtime: IRunTime,
  //   testsName: string
  //   // logger?: {
  //   //   log: (...args: any[]) => void;
  //   // }
  // ): Record<string, any> {
  //   const buildDockerfileDir = this.setupDockerfileForBuild(
  //     runtime,
  //     testsName
  //     // logger
  //   );
  //   return createBuildService(runtime, buildDockerfileDir, testsName);
  // }
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

// src/server/serverClasees/Server.ts
var Server = class extends ServerTaskCoordinator {
  constructor(configs, testName, mode2) {
    super(configs, testName, mode2);
    fs10.writeFileSync(
      path9.join(process.cwd(), "testeranto", `${testName}.json`),
      JSON.stringify(configs, null, 2)
    );
    configs.ports.forEach((port) => {
      this.ports[port] = "";
    });
    this.launchers = {};
    this.testName = testName;
    this.composeDir = process.cwd();
    this.composeFile = path9.join(
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
    if (!fs10.existsSync(`testeranto/reports/${this.projectName}`)) {
      fs10.mkdirSync(`testeranto/reports/${this.projectName}`);
    }
    this.browser = null;
  }
  async stop() {
    console.log(ansiC3.inverse("Testeranto-Run is shutting down gracefully..."));
    this.mode = "once";
    super.stop();
  }
};

// src/makeHtmlTestFiles.ts
import path10 from "path";
import fs11 from "fs";

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
function getStepsForFlavor(flavor) {
  const [flavorType] = flavor;
  const image = flavor[1];
  switch (flavorType) {
    case "interpreted":
      if (image.includes("python")) {
        return {
          base: PYTHON_BASE_STEPS,
          staticAnalysis: [],
          // Keep empty for now, focus on metafile-based
          metafileAnalysis: PYTHON_METAFILE_ANALYSIS,
          test: PYTHON_TEST_STEPS
        };
      } else {
        return {
          base: NODE_BASE_STEPS,
          staticAnalysis: [],
          // Keep empty for now, focus on metafile-based
          metafileAnalysis: NODE_METAFILE_ANALYSIS,
          test: NODE_TEST_STEPS
        };
      }
    case "compiled":
      return {
        base: GOLANG_BASE_STEPS,
        staticAnalysis: [],
        // Keep empty for now, focus on metafile-based
        metafileAnalysis: GOLANG_METAFILE_ANALYSIS,
        test: GOLANG_TEST_STEPS
      };
    case "chrome":
      return {
        base: WEB_BASE_STEPS,
        staticAnalysis: [],
        // Keep empty for now, focus on metafile-based
        metafileAnalysis: WEB_METAFILE_ANALYSIS,
        test: WEB_TEST_STEPS
      };
    default:
      return {
        base: NODE_BASE_STEPS,
        staticAnalysis: [],
        // Keep empty for now, focus on metafile-based
        metafileAnalysis: NODE_METAFILE_ANALYSIS,
        test: NODE_TEST_STEPS
      };
  }
}
var NODE_BASE_STEPS = [
  ["RUN", "apk add --update make g++ linux-headers python3 libxml2-utils"],
  ["WORKDIR", "/workspace"],
  ["COPY", "package*.json ./ "],
  ["RUN", "npm install --legacy-peer-deps"],
  ["COPY", "./src ./src"]
];
var PYTHON_BASE_STEPS = [
  ["WORKDIR", "/workspace"],
  ["COPY", "requirements.txt ./ "],
  ["RUN", "pip install -r requirements.txt"],
  // Install Python linting tools and websockets for WebSocket communication
  ["RUN", "pip install pylint mypy flake8 websockets>=12.0"],
  ["COPY", "./src ./src"]
];
var GOLANG_BASE_STEPS = [
  ["WORKDIR", "/workspace"],
  ["COPY", "go.mod go.sum ./ "],
  ["RUN", "go mod download"],
  ["COPY", "./src ./src"]
];
var WEB_BASE_STEPS = [
  ["RUN", "apk add --update make g++ linux-headers python3 libxml2-utils"],
  ["WORKDIR", "/workspace"],
  ["COPY", "package*.json ./ "],
  ["RUN", "npm install --legacy-peer-deps"],
  ["COPY", "./src ./src"]
];
var NODE_METAFILE_ANALYSIS = [
  ...NODE_BASE_STEPS,
  [
    "RUN",
    `node -e "export const fs = require('fs'); export const metafile = JSON.parse(fs.readFileSync(process.env.METAFILE_PATH, 'utf8')); export const files = metafile.inputs ? Object.keys(metafile.inputs) : []; if (files.length > 0) { process.exit(require('child_process').execSync('npx eslint ' + files.join(' ')).status); } else { console.log('No files to lint'); } "`
  ],
  [
    "RUN",
    `node -e "export const fs = require('fs'); export const metafile = JSON.parse(fs.readFileSync(process.env.METAFILE_PATH, 'utf8')); export const files = metafile.inputs ? Object.keys(metafile.inputs) : []; if (files.length > 0) { process.exit(require('child_process').execSync('npx tsc --noEmit ' + files.join(' ')).status); } else { console.log('No files to type-check'); } "`
  ]
];
var WEB_METAFILE_ANALYSIS = [
  ...WEB_BASE_STEPS,
  [
    "RUN",
    `node -e "export const fs = require('fs'); export const metafile = JSON.parse(fs.readFileSync(process.env.METAFILE_PATH, 'utf8')); export const files = metafile.inputs ? Object.keys(metafile.inputs) : []; if (files.length > 0) { process.exit(require('child_process').execSync('npx eslint ' + files.join(' ')).status); } else { console.log('No files to lint'); } "`
  ],
  [
    "RUN",
    `node -e "export const fs = require('fs'); export const metafile = JSON.parse(fs.readFileSync(process.env.METAFILE_PATH, 'utf8')); export const files = metafile.inputs ? Object.keys(metafile.inputs) : []; if (files.length > 0) { process.exit(require('child_process').execSync('npx tsc --noEmit ' + files.join(' ')).status); } else { console.log('No files to type-check'); } "`
  ],
  [
    "RUN",
    `node -e "export const fs = require('fs'); export const metafile = JSON.parse(fs.readFileSync(process.env.METAFILE_PATH, 'utf8')); export const files = metafile.inputs ? Object.keys(metafile.inputs) : []; if (files.length > 0) { process.exit(require('child_process').execSync('npx stylelint ' + files.filter(f => f.endsWith('.css') || f.endsWith('.scss')).join(' ')).status); } else { console.log('No style files to check'); } "`
  ]
];
var PYTHON_METAFILE_ANALYSIS = [
  ...PYTHON_BASE_STEPS,
  // Create a script to run static analysis based on metafile
  [
    "RUN",
    `cat > /tmp/run_python_analysis.py << 'EOF'
import json
import os
import subprocess
import sys

def run_analysis():
    metafile_path = os.environ.get('METAFILE_PATH')
    if not metafile_path or not os.path.exists(metafile_path):
        print("No metafile found at METAFILE_PATH")
        return 0
    
    with open(metafile_path, 'r') as f:
        data = json.load(f)
    
    # Get input files from metafile
    inputs = data.get('inputs', {})
    files = list(inputs.keys()) if isinstance(inputs, dict) else []
    
    if not files:
        print("No files to analyze")
        return 0
    
    # Filter for Python files
    python_files = [f for f in files if f.endswith('.py')]
    if not python_files:
        print("No Python files to analyze")
        return 0
    
    exit_code = 0
    
    # Run flake8
    print("Running flake8...")
    result = subprocess.run(['flake8'] + python_files, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stdout)
        print(result.stderr)
        exit_code = result.returncode
    
    # Run pylint
    print("Running pylint...")
    result = subprocess.run(['pylint'] + python_files, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stdout)
        print(result.stderr)
        exit_code = result.returncode
    
    # Run mypy
    print("Running mypy...")
    result = subprocess.run(['mypy'] + python_files, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stdout)
        print(result.stderr)
        exit_code = result.returncode
    
    return exit_code

if __name__ == '__main__':
    sys.exit(run_analysis())
EOF`
  ],
  ["RUN", "python3 /tmp/run_python_analysis.py"]
];
var GOLANG_METAFILE_ANALYSIS = [
  ...GOLANG_BASE_STEPS,
  [
    "RUN",
    `sh -c 'if [ -f "$METAFILE_PATH" ]; then go vet $(jq -r ".inputs | keys[]" "$METAFILE_PATH" 2>/dev/null | grep "\\.go$" | xargs echo); else echo "No metafile for go vet"; fi'`
  ],
  [
    "RUN",
    `sh -c 'if [ -f "$METAFILE_PATH" ]; then staticcheck $(jq -r ".inputs | keys[]" "$METAFILE_PATH" 2>/dev/null | grep "\\.go$" | xargs echo); else echo "No metafile for staticcheck"; fi'`
  ]
];
var NODE_TEST_STEPS = [
  ...NODE_BASE_STEPS,
  ...NODE_METAFILE_ANALYSIS.slice(NODE_BASE_STEPS.length),
  ["RUN", "npm test"]
];
var WEB_TEST_STEPS = [
  ...WEB_BASE_STEPS,
  ["RUN", "npm test"]
];
var PYTHON_TEST_STEPS = [
  ...PYTHON_BASE_STEPS,
  [
    "RUN",
    `python3 -c "import sys; import subprocess; import pkg_resources; required = {'pylint', 'mypy', 'flake8', 'websockets'}; installed = {pkg.key for pkg in pkg_resources.working_set}; missing = required - installed; print('Missing packages:', missing) if missing else print('All required packages installed')"`
  ],
  ...PYTHON_METAFILE_ANALYSIS.slice(PYTHON_BASE_STEPS.length),
  ["RUN", "pytest"]
];
var GOLANG_TEST_STEPS = [
  ...GOLANG_BASE_STEPS,
  ["RUN", "go test ./..."]
];
var BUILD_PROD_STEP = [
  "RUN",
  "BUILD YOU PRODUCTION BUNDLE"
];
var BUILD_THING_STEP = [
  "RUN",
  "BUILD YOU THING"
];
var BUILD_ANOTHER_STEP = [
  "RUN",
  "BUILD ANOTHER THING"
];
var SINGLE_TEST_BLOCK = [
  NODE_TEST_STEPS
];
var SINGLE_PROD_BLOCK = [
  NODE_BASE_STEPS.concat([BUILD_PROD_STEP])
];
var DOUBLE_PROD_BLOCK = [
  NODE_BASE_STEPS.concat([BUILD_THING_STEP]),
  NODE_BASE_STEPS.concat([BUILD_ANOTHER_STEP])
];
var createLangConfig = (flavor, testFile, options) => {
  let strategy;
  if (options?.strategy) {
    strategy = options.strategy;
  } else {
    const [flavorType] = flavor;
    switch (flavorType) {
      case "interpreted":
        strategy = "combined-build-test-process-pools";
        break;
      case "compiled":
        strategy = "separate-build-combined-test";
        break;
      case "chrome":
        strategy = "combined-service-shared-chrome";
        break;
      case "VM":
        strategy = "combined-service-shared-jvm";
        break;
      default:
        strategy = "combined-build-test-process-pools";
    }
  }
  const { base, metafileAnalysis, test } = getStepsForFlavor(flavor);
  const defaultTestBlock = [test];
  const defaultChecks = {
    "metafile-analysis": [metafileAnalysis, "echo 'Running metafile analysis'"]
  };
  return {
    plugins: options?.plugins || [],
    loaders: options?.loaders || {},
    tests: { [testFile]: { ports: 0 } },
    externals: options?.externals || [],
    flavor,
    strategy,
    test: options?.testBlocks || defaultTestBlock,
    prod: options?.prodBlocks || [base.concat([BUILD_PROD_STEP])],
    checks: options?.checks || defaultChecks,
    build: options?.build,
    processPool: options?.processPool,
    chrome: options?.chrome,
    monitoring: options?.monitoring || {}
    // Include monitoring config
  };
};

// golangConfig.ts
var GOLANG_BUILD_STEPS = [
  ...GOLANG_BASE_STEPS,
  ["RUN", "go build -o /tmp/test-binary ./..."],
  ...GOLANG_METAFILE_ANALYSIS.slice(GOLANG_BASE_STEPS.length)
];
var GO_STATIC_ANALYSIS = {
  "go-vet": [[["WORKDIR", "/workspace"]], "go vet ./..."],
  staticcheck: [[["WORKDIR", "/workspace"]], "staticcheck ./..."],
  "go-fmt": [[["WORKDIR", "/workspace"]], "go fmt ./..."],
  gocyclo: [[["WORKDIR", "/workspace"]], "gocyclo -over 15 ."]
};
var golangConfig = {
  flavor: ["compiled", "golang:1.21-alpine"],
  testFile: "example/Calculator.golingvu.test.go",
  options: {
    prodBlocks: [
      GOLANG_BASE_STEPS.concat([["RUN", "BUILD THING"]]),
      GOLANG_BASE_STEPS.concat([["RUN", "BUILD ANOTHER THING"]])
    ],
    build: [GOLANG_BUILD_STEPS],
    checks: GO_STATIC_ANALYSIS
  }
};

// pythonConfig.ts
var PYTHON_STATIC_ANALYSIS = {
  pylint: [
    [
      ["WORKDIR", "/workspace"],
      ["RUN", "pip install pylint"]
    ],
    "pylint --rcfile=.pylintrc src/"
  ],
  mypy: [
    [
      ["WORKDIR", "/workspace"],
      ["RUN", "pip install mypy"]
    ],
    "mypy src/"
  ],
  flake8: [
    [
      ["WORKDIR", "/workspace"],
      ["RUN", "pip install flake8"]
    ],
    "flake8 src/"
  ],
  bandit: [
    [
      ["WORKDIR", "/workspace"],
      ["RUN", "pip install bandit"]
    ],
    "bandit -r src/ -ll"
  ]
};
var pythonConfig = {
  flavor: ["interpreted", "python:3.11-alpine"],
  testFile: "example/Calculator.pitono.test.py",
  options: {
    processPool: {
      maxConcurrent: 3,
      timeoutMs: 2e4
    },
    checks: PYTHON_STATIC_ANALYSIS
  }
};

// webConfig.ts
import { sassPlugin } from "esbuild-sass-plugin";
var WEB_BUILD_STEPS = [
  ...WEB_BASE_STEPS,
  ...WEB_METAFILE_ANALYSIS.slice(WEB_BASE_STEPS.length),
  ["RUN", "npm run build"]
];
var WEB_STATIC_ANALYSIS = {
  eslint: [
    [
      ["WORKDIR", "/workspace"],
      [
        "RUN",
        "npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin"
      ]
    ],
    "npx eslint src/ --ext .ts,.tsx --max-warnings=0"
  ],
  typescript: [
    [
      ["WORKDIR", "/workspace"],
      ["RUN", "npm install --save-dev typescript"]
    ],
    "npx tsc --noEmit"
  ],
  stylelint: [
    [
      ["WORKDIR", "/workspace"],
      ["RUN", "npm install --save-dev stylelint"]
    ],
    "npx stylelint 'src/**/*.css' 'src/**/*.scss'"
  ],
  prettier: [
    [
      ["WORKDIR", "/workspace"],
      ["RUN", "npm install --save-dev prettier"]
    ],
    "npx prettier --check src/"
  ]
};
var webConfig = {
  flavor: ["chrome", "node:20.19.4-alpine-chrome"],
  testFile: "example/Calculator.test.ts",
  options: {
    plugins: [() => sassPlugin()],
    loaders: { ".ttf": "file" },
    chrome: {
      sharedInstance: true,
      maxContexts: 4,
      memoryLimitMB: 256
    },
    checks: WEB_STATIC_ANALYSIS,
    build: [WEB_BUILD_STEPS]
  }
};

// nodeConfig.ts
var NODE_STATIC_ANALYSIS = {
  eslint: [
    [
      ["WORKDIR", "/workspace"],
      [
        "RUN",
        "npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin"
      ]
    ],
    "npx eslint src/ --ext .ts,.tsx --max-warnings=0"
  ],
  typescript: [
    [
      ["WORKDIR", "/workspace"],
      ["RUN", "npm install --save-dev typescript"]
    ],
    "npx tsc --noEmit"
  ],
  "audit-ci": [
    [
      ["WORKDIR", "/workspace"],
      ["RUN", "npm install --save-dev audit-ci"]
    ],
    "npx audit-ci --critical"
  ],
  depcheck: [
    [
      ["WORKDIR", "/workspace"],
      ["RUN", "npm install --save-dev depcheck"]
    ],
    "npx depcheck"
  ]
};
var nodeConfig = {
  flavor: ["interpreted", "node:20.19.4-alpine"],
  testFile: "example/Calculator.test.ts",
  options: {
    processPool: {
      maxConcurrent: 5,
      timeoutMs: 25e3
    },
    checks: NODE_STATIC_ANALYSIS
  }
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
  test: SINGLE_TEST_BLOCK,
  prod: SINGLE_PROD_BLOCK,
  check: {
    node: "example/staticAnalysis/node.ts",
    python: "example/staticAnalysis/python.py",
    golang: "example/staticAnalysis/go.go",
    web: "example/staticAnalysis/web.ts",
    enabled: true,
    failOnError: true
  },
  build: [golangConfig.options.build],
  processPool: {
    maxConcurrent: 4,
    timeoutMs: 3e4
  },
  chrome: {
    sharedInstance: true,
    maxContexts: 6,
    memoryLimitMB: 512
  },
  golang: createLangConfig(
    golangConfig.flavor,
    golangConfig.testFile,
    golangConfig.options
  ),
  python: createLangConfig(
    pythonConfig.flavor,
    pythonConfig.testFile,
    pythonConfig.options
  ),
  web: createLangConfig(
    webConfig.flavor,
    webConfig.testFile,
    webConfig.options
  ),
  node: createLangConfig(
    nodeConfig.flavor,
    nodeConfig.testFile,
    nodeConfig.options
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
    const htmlFilePath = path10.normalize(
      `${process.cwd()}/testeranto/bundles/${testsName2}/${sourceDir.join(
        "/"
      )}/${sourceFileNameMinusJs}.html`
    );
    const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
    const cssFilePath = `./${sourceFileNameMinusJs}.css`;
    fs11.mkdirSync(path10.dirname(htmlFilePath), { recursive: true });
    fs11.writeFileSync(
      htmlFilePath,
      web_html_default(jsfilePath, htmlFilePath, cssFilePath)
    );
    console.log(`Generated HTML file: ${htmlFilePath}`);
  }
};

// src/makeHtmlReportFile.ts
import path11 from "path";
import fs12 from "fs";

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
      const htmlFilePath = path11.normalize(
        `${process.cwd()}/testeranto/reports/${testsName2}/${sourceDir.join(
          "/"
        )}/${sourceFileNameMinusExtension}/${runtime}/index.html`
      );
      fs12.mkdirSync(path11.dirname(htmlFilePath), { recursive: true });
      const htmlDir = path11.dirname(htmlFilePath);
      const reportJsPath = path11.join(
        process.cwd(),
        "dist",
        "prebuild",
        "Report.js"
      );
      const relativeReportJsPath = path11.relative(htmlDir, reportJsPath);
      const relativeReportJsUrl = relativeReportJsPath.split(path11.sep).join("/");
      const reportCssPath = path11.join(
        process.cwd(),
        "dist",
        "prebuild",
        "Report.css"
      );
      const relativeReportCssPath = path11.relative(htmlDir, reportCssPath);
      const relativeReportCssUrl = relativeReportCssPath.split(path11.sep).join("/");
      const htmlContent = generateHtmlContent({
        sourceFileNameMinusExtension,
        relativeReportCssUrl,
        relativeReportJsUrl,
        runtime,
        sourceFilePath,
        testsName: testsName2
      });
      fs12.writeFileSync(htmlFilePath, htmlContent);
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
  console.log(ansiC4.inverse("Press 'q' to initiate a graceful shutdown."));
  console.log(ansiC4.inverse("Press 'x' to quit forcefully."));
  setupKeypressHandling();
  setupFileSystem(config2, testsName);
  let pm = null;
  pm = new Server(config2, testsName, mode);
  await pm.start();
  if (!fs13.existsSync(`testeranto/reports/${testsName}`)) {
    fs13.mkdirSync(`testeranto/reports/${testsName}`);
  }
  fs13.writeFileSync(
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
      fs13.mkdirSync(
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
