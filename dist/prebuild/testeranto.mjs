import {
  node_default
} from "./chunk-KEX7JEVY.mjs";
import {
  web_default
} from "./chunk-UGGLWEUL.mjs";
import "./chunk-SFBHYNUJ.mjs";
import {
  GolingvuBuild
} from "./chunk-5YQS2HQH.mjs";
import {
  PitonoBuild,
  generatePitonoMetafile,
  writePitonoMetafile
} from "./chunk-W2DJ422C.mjs";
import {
  baseNodeImage
} from "./chunk-D7FJV2YP.mjs";

// src/testeranto.ts
import ansiC6 from "ansi-colors";
import fs18 from "fs";
import path11 from "path";
import readline from "readline";

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

  <script>
    function initApp() {
      if (window.React && window.ReactDOM && window.App) {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(App));
      } else {
        setTimeout(initApp, 100);
      }
    }
    window.addEventListener('DOMContentLoaded', initApp);
  </script>
`;
var AppHtml = () => `
  ${getBaseHtml("Testeranto")}
  
  <link rel="stylesheet" href="App.css" />
  <script src="App.js"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;

// src/server/serverClasees/fileSystemSetup.ts
import fs from "fs";
function setupFileSystem(config, testsName2) {
  fs.writeFileSync(`${process.cwd()}/testeranto/index.html`, AppHtml());
  if (!fs.existsSync(`testeranto/reports/${testsName2}`)) {
    fs.mkdirSync(`testeranto/reports/${testsName2}`, { recursive: true });
  }
  fs.writeFileSync(
    `testeranto/reports/${testsName2}/config.json`,
    JSON.stringify(config, null, 2)
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
import { default as ansiC5 } from "ansi-colors";
import fs17, { watch } from "fs";
import path10 from "path";
import puppeteer, { executablePath as executablePath2 } from "puppeteer-core";

// src/clients/utils.ts
import ansiC2 from "ansi-colors";
import path from "path";
import fs2 from "fs";
function runtimeLogs(runtime, reportDest) {
  const safeDest = reportDest || `testeranto/reports/default_${Date.now()}`;
  try {
    if (!fs2.existsSync(safeDest)) {
      fs2.mkdirSync(safeDest, { recursive: true });
    }
    if (runtime === "node") {
      return {
        stdout: fs2.createWriteStream(`${safeDest}/stdout.log`),
        stderr: fs2.createWriteStream(`${safeDest}/stderr.log`),
        exit: fs2.createWriteStream(`${safeDest}/exit.log`)
      };
    } else if (runtime === "web") {
      return {
        info: fs2.createWriteStream(`${safeDest}/info.log`),
        warn: fs2.createWriteStream(`${safeDest}/warn.log`),
        error: fs2.createWriteStream(`${safeDest}/error.log`),
        debug: fs2.createWriteStream(`${safeDest}/debug.log`),
        exit: fs2.createWriteStream(`${safeDest}/exit.log`)
      };
    } else if (runtime === "pure") {
      return {
        exit: fs2.createWriteStream(`${safeDest}/exit.log`)
      };
    } else if (runtime === "python") {
      return {
        stdout: fs2.createWriteStream(`${safeDest}/stdout.log`),
        stderr: fs2.createWriteStream(`${safeDest}/stderr.log`),
        exit: fs2.createWriteStream(`${safeDest}/exit.log`)
      };
    } else if (runtime === "golang") {
      return {
        stdout: fs2.createWriteStream(`${safeDest}/stdout.log`),
        stderr: fs2.createWriteStream(`${safeDest}/stderr.log`),
        exit: fs2.createWriteStream(`${safeDest}/exit.log`)
      };
    } else {
      throw `unknown runtime: ${runtime}`;
    }
  } catch (e) {
    console.error(`Failed to create log streams in ${safeDest}:`, e);
    throw e;
  }
}
function createLogStreams(reportDest, runtime) {
  if (!fs2.existsSync(reportDest)) {
    fs2.mkdirSync(reportDest, { recursive: true });
  }
  const safeDest = reportDest || `testeranto/reports/default_${Date.now()}`;
  try {
    if (!fs2.existsSync(safeDest)) {
      fs2.mkdirSync(safeDest, { recursive: true });
    }
    const streams = runtimeLogs(runtime, safeDest);
    return {
      ...streams,
      closeAll: () => {
        Object.values(streams).forEach(
          (stream) => !stream.closed && stream.close()
        );
      },
      writeExitCode: (code, error) => {
        if (error) {
          streams.exit.write(`Error: ${error.message}
`);
          if (error.stack) {
            streams.exit.write(`Stack Trace:
${error.stack}
`);
          }
        }
        streams.exit.write(`${code}
`);
      },
      exit: streams.exit
    };
  } catch (e) {
    console.error(`Failed to create log streams in ${safeDest}:`, e);
    throw e;
  }
}
var statusMessagePretty = (failures, test, runtime) => {
  if (failures === 0) {
    console.log(ansiC2.green(ansiC2.inverse(`${runtime} > ${test}`)));
  } else if (failures > 0) {
    console.log(
      ansiC2.red(
        ansiC2.inverse(
          `${runtime} > ${test} failed ${failures} times (exit code: ${failures})`
        )
      )
    );
  } else {
    console.log(
      ansiC2.red(ansiC2.inverse(`${runtime} > ${test} crashed (exit code: -1)`))
    );
  }
};
async function pollForFile(path12, timeout = 2e3) {
  const intervalObj = setInterval(function() {
    const file = path12;
    const fileExists = fs2.existsSync(file);
    if (fileExists) {
      clearInterval(intervalObj);
    }
  }, timeout);
}
var executablePath = "/opt/homebrew/bin/chromium";
var puppeteerConfigs = {
  slowMo: 1,
  waitForInitialPage: false,
  executablePath,
  defaultViewport: null,
  // Disable default 800x600 viewport
  dumpio: false,
  // headless: true,
  // devtools: false,
  headless: false,
  devtools: true,
  args: [
    "--allow-file-access-from-files",
    "--allow-insecure-localhost",
    "--allow-running-insecure-content",
    "--auto-open-devtools-for-tabs",
    "--disable-dev-shm-usage",
    "--disable-extensions",
    "--disable-features=site-per-process",
    "--disable-gpu",
    "--disable-setuid-sandbox",
    "--disable-site-isolation-trials",
    "--disable-web-security",
    "--no-first-run",
    "--no-sandbox",
    "--no-startup-window",
    "--reduce-security-for-testing",
    "--remote-allow-origins=*",
    "--start-maximized",
    "--unsafely-treat-insecure-origin-as-secure=*",
    `--remote-debugging-port=3234`
    // "--disable-features=IsolateOrigins,site-per-process",
    // "--disable-features=IsolateOrigins",
    // "--disk-cache-dir=/dev/null",
    // "--disk-cache-size=1",
    // "--no-zygote",
    // "--remote-allow-origins=ws://localhost:3234",
    // "--single-process",
    // "--start-maximized",
    // "--unsafely-treat-insecure-origin-as-secure",
    // "--unsafely-treat-insecure-origin-as-secure=ws://192.168.0.101:3234",
  ]
};

// src/server/docker/ProcessManager/checkForShutdown.ts
import ansiC3 from "ansi-colors";
function checkForShutdown(mode2, summaryManager, queueManager, checkQueue, writeBigBoard) {
  checkQueue();
  console.log(
    ansiC3.inverse(
      `The following jobs are awaiting resources: ${JSON.stringify(
        queueManager.getAll()
      )}`
    )
  );
  writeBigBoard();
  if (mode2 === "dev")
    return;
  let inflight = false;
  const summary = summaryManager.getSummary();
  Object.keys(summary).forEach((k) => {
    if (summary[k].prompt === "?") {
      console.log(ansiC3.blue(ansiC3.inverse(`\u{1F555} prompt ${k}`)));
      inflight = true;
    }
  });
  Object.keys(summary).forEach((k) => {
    if (summary[k].runTimeErrors === "?") {
      console.log(ansiC3.blue(ansiC3.inverse(`\u{1F555} runTimeError ${k}`)));
      inflight = true;
    }
  });
  Object.keys(summary).forEach((k) => {
    if (summary[k].staticErrors === "?") {
      console.log(ansiC3.blue(ansiC3.inverse(`\u{1F555} staticErrors ${k}`)));
      inflight = true;
    }
  });
  Object.keys(summary).forEach((k) => {
    if (summary[k].typeErrors === "?") {
      console.log(ansiC3.blue(ansiC3.inverse(`\u{1F555} typeErrors ${k}`)));
      inflight = true;
    }
  });
  writeBigBoard();
}

// src/server/configTests.ts
var configTests_default = (configs) => {
  return [
    ...Object.keys(configs.node.tests).map((t) => [
      t,
      "node",
      configs.node.tests[t],
      []
    ]),
    ...Object.keys(configs.web.tests).map((t) => [
      t,
      "web",
      configs.web.tests[t],
      []
    ]),
    ...Object.keys(configs.python.tests).map((t) => [
      t,
      "python",
      configs.python.tests[t],
      []
    ]),
    ...Object.keys(configs.golang.tests).map((t) => [
      t,
      "golang",
      configs.golang.tests[t],
      []
    ])
  ];
};

// src/server/python/pythonLintCheck.ts
import fs3 from "fs";
import { spawn } from "child_process";
async function pythonLintCheck(entrypoint, addableFiles, projectName, summary) {
  const reportDest = `testeranto/reports/${projectName}/${entrypoint.split(".").slice(0, -1).join(".")}/python`;
  if (!fs3.existsSync(reportDest)) {
    fs3.mkdirSync(reportDest, { recursive: true });
  }
  const lintErrorsPath = `${reportDest}/lint_errors.txt`;
  if (!summary[entrypoint]) {
    summary[entrypoint] = {
      typeErrors: void 0,
      staticErrors: void 0,
      runTimeErrors: void 0,
      prompt: void 0,
      failingFeatures: {}
    };
  }
  try {
    const child = spawn("flake8", [entrypoint, "--max-line-length=88"], {
      stdio: ["pipe", "pipe", "pipe"]
    });
    let stderr = "";
    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });
    let stdout = "";
    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    return new Promise((resolve) => {
      child.on("close", () => {
        const logOut = stdout + stderr;
        if (logOut.trim()) {
          fs3.writeFileSync(lintErrorsPath, logOut);
          summary[entrypoint].staticErrors = logOut.split("\n").length;
        } else {
          if (fs3.existsSync(lintErrorsPath)) {
            fs3.unlinkSync(lintErrorsPath);
          }
          summary[entrypoint].staticErrors = 0;
        }
        resolve();
      });
    });
  } catch (error) {
    console.error(`Error running flake8 on ${entrypoint}:`, error);
    fs3.writeFileSync(lintErrorsPath, `Error running flake8: ${error.message}`);
    summary[entrypoint].staticErrors = -1;
  }
}

// src/server/python/pythonTypeCheck.ts
import fs4 from "fs";
import { spawn as spawn2 } from "child_process";
async function pythonTypeCheck(entrypoint, addableFiles, projectName, summary) {
  const reportDest = `testeranto/reports/${projectName}/${entrypoint.split(".").slice(0, -1).join(".")}/python`;
  if (!fs4.existsSync(reportDest)) {
    fs4.mkdirSync(reportDest, { recursive: true });
  }
  const typeErrorsPath = `${reportDest}/type_errors.txt`;
  if (!summary[entrypoint]) {
    summary[entrypoint] = {
      typeErrors: void 0,
      staticErrors: void 0,
      runTimeErrors: void 0,
      prompt: void 0,
      failingFeatures: {}
    };
  }
  try {
    const child = spawn2("mypy", [entrypoint], {
      stdio: ["pipe", "pipe", "pipe"]
    });
    let stderr = "";
    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });
    let stdout = "";
    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    return new Promise((resolve) => {
      child.on("close", () => {
        const logOut = stdout + stderr;
        if (logOut.trim()) {
          fs4.writeFileSync(typeErrorsPath, logOut);
          summary[entrypoint].typeErrors = logOut.split("\n").length;
        } else {
          if (fs4.existsSync(typeErrorsPath)) {
            fs4.unlinkSync(typeErrorsPath);
          }
          summary[entrypoint].typeErrors = 0;
        }
        resolve();
      });
    });
  } catch (error) {
    console.error(`Error running mypy on ${entrypoint}:`, error);
    fs4.writeFileSync(typeErrorsPath, `Error running mypy: ${error.message}`);
    summary[entrypoint].typeErrors = -1;
  }
}

// src/server/utils.ts
import path2 from "path";
var webEvaluator = (d, webArgz) => {
  return `
import('${d}').then(async (x) => {
  try {
    return await (await x.default).receiveTestResourceConfig(${webArgz})
  } catch (e) {
    console.log("web run failure", e.toString())
  }
})
`;
};
var tscPather = (entryPoint, platform, projectName) => {
  return path2.join(
    "testeranto",
    "reports",
    projectName,
    entryPoint.split(".").slice(0, -1).join("."),
    platform,
    `type_errors.txt`
  );
};
var lintPather = (entryPoint, platform, projectName) => {
  return path2.join(
    "testeranto",
    "reports",
    projectName,
    entryPoint.split(".").slice(0, -1).join("."),
    platform,
    `lint_errors.txt`
  );
};
var getRunnables = (config, projectName) => {
  return {
    // pureEntryPoints: payload.pureEntryPoints || {},
    golangEntryPoints: Object.entries(config.golang.tests).reduce((pt, cv) => {
      pt[cv[0]] = path2.resolve(cv[0]);
      return pt;
    }, {}),
    // golangEntryPointSidecars: payload.golangEntryPointSidecars || {},
    nodeEntryPoints: Object.entries(config.node.tests).reduce((pt, cv) => {
      pt[cv[0]] = path2.resolve(
        `./testeranto/bundles/node/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
      return pt;
    }, {}),
    // nodeEntryPointSidecars: payload.nodeEntryPointSidecars || {},
    pythonEntryPoints: Object.entries(config.python.tests).reduce((pt, cv) => {
      pt[cv[0]] = path2.resolve(cv[0]);
      return pt;
    }, {}),
    // pythonEntryPointSidecars: payload.pythonEntryPointSidecars || {},
    webEntryPoints: Object.entries(config.web.tests).reduce((pt, cv) => {
      pt[cv[0]] = path2.resolve(
        `./testeranto/bundles/web/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
      return pt;
    }, {})
    // webEntryPointSidecars: payload.webEntryPointSidecars || {},
  };
};

// src/server/serverClasees/Server_DockerCompose.ts
import {
  buildMany,
  down,
  logs,
  ps,
  upAll,
  upOne
} from "docker-compose";
import fs8 from "fs";
import path6 from "path";

// src/server/constants/COMMON_PACKAGE_INSTALL.ts
var COMMON_PACKAGE_INSTALL = `RUN npm install -g node-gyp
COPY package.json .
# Try yarn install, fallback to npm install if it fails
ENV npm_config_build_from_source=false
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN (yarn install --ignore-engines || npm install --legacy-peer-deps) && \\
    npm cache clean --force && \\
    yarn cache clean || true
COPY ./src ./src/`;

// src/server/golang/setupDockerfileForBuildGolang.ts
var setupDockerfileForBuildGolang = (config) => {
  const goSpecificPackages = `\\
    wget`;
  return `FROM ${baseNodeImage}
WORKDIR /workspace
RUN apk update && apk add --no-cache \\
    build-base \\
    python3 \\
    py3-pip \\
    cairo-dev \\
    pango-dev \\
    jpeg-dev \\
    giflib-dev \\
    librsvg-dev \\
    libxml2-utils${goSpecificPackages} && \\
    rm -rf /var/cache/apk/*
# Install Go
RUN wget -q -O - https://go.dev/dl/go1.21.0.linux-amd64.tar.gz | tar -xz -C /usr/local
ENV GOROOT=/usr/local/go
ENV PATH=$PATH:$GOROOT/bin
${COMMON_PACKAGE_INSTALL}
COPY ${config} .
COPY dist/prebuild/server/builders/golang.mjs ./golang.mjs
# Run the build to generate metafiles when container starts
CMD ["sh", "-c", "echo 'Starting build...' && ls -la ./dist/prebuild/server/builders/ && which node && which npx && npx tsx ./dist/prebuild/server/builders/golang.mjs ${config}"]
`;
};

// src/server/constants/BASE_DOCKERFILE.ts
var BASE_DOCKERFILE = `FROM ${baseNodeImage}
WORKDIR /workspace
RUN apk update && apk add --no-cache \\
    build-base \\
    python3 \\
    py3-pip \\
    cairo-dev \\
    pango-dev \\
    jpeg-dev \\
    giflib-dev \\
    librsvg-dev \\
    libxml2-utils \\
    netcat-openbsd \\
    make \\
    g++ \\
    linux-headers && \\
    rm -rf /var/cache/apk/*`;

// src/server/node/setupDockerfileForBuildNode.ts
var setupDockerfileForBuildNode = (config) => {
  return `${BASE_DOCKERFILE}
# Create necessary directories for build service
RUN mkdir -p /workspace/testeranto/bundles/allTests/node
RUN mkdir -p /workspace/testeranto/metafiles/node

RUN npm install -g node-gyp tsx
COPY package.json .
# Try yarn install, fallback to npm install if it fails
ENV npm_config_build_from_source=false
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN (yarn install --ignore-engines || npm install --legacy-peer-deps) && \\
    npm install -g tsx && \\
    npm cache clean --force && \\
    yarn cache clean || true
COPY ./src ./src/
COPY ${config} .
ARG NODE_MJS_HASH
# Use the hash to bust cache for the node.mjs copy
RUN echo "Node.mjs hash: $NODE_MJS_HASH" > /tmp/node-mjs-hash.txt
COPY dist/prebuild/server/builders/node.mjs ./node.mjs

# Default command that keeps the container alive
# This will be overridden by docker-compose, but serves as a fallback
CMD ["sh", "-c", "echo 'Build service started' && tail -f /dev/null"]
`;
};

// src/server/python/setupDockerfileForBuildPython.ts
var setupDockerfileForBuildPython = (config) => {
  return `${BASE_DOCKERFILE}
# Ensure Python is properly installed and available
RUN python3 --version && pip3 --version
${COMMON_PACKAGE_INSTALL}
COPY ${config} .
COPY dist/prebuild/server/builders/python.mjs ./python.mjs
# Run the build to generate metafiles when container starts
CMD ["sh", "-c", "echo 'Starting build...' && ls -la ./dist/prebuild/server/builders/ && which node && which npx && npx tsx ./dist/prebuild/server/builders/python.mjs ${config}"]
`;
};

// src/server/web/setupDockerfileForBuildWeb.ts
function setupDockerfileForBuildWeb(config) {
  const webSpecificPackages = `\\
    chromium \\
    nss \\
    freetype \\
    freetype-dev \\
    harfbuzz \\
    ca-certificates \\
    ttf-freefont \\
    font-noto-emoji`;
  return `FROM ${baseNodeImage}
WORKDIR /workspace
RUN apk update && apk add --no-cache \\
    build-base \\
    python3 \\
    py3-pip \\
    cairo-dev \\
    pango-dev \\
    jpeg-dev \\
    giflib-dev \\
    librsvg-dev \\
    libxml2-utils${webSpecificPackages} && \\
    rm -rf /var/cache/apk/*
RUN npm install -g node-gyp
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
${COMMON_PACKAGE_INSTALL}
COPY ${config} .
COPY dist/prebuild/server/builders/web.mjs ./web.mjs
# Default command that keeps the container alive
# The actual build command will be run by docker-compose
CMD ["sh", "-c", "echo 'Web build service started' && tail -f /dev/null"]
`;
}

// src/server/serverClasees/Server_TCP.ts
import { WebSocketServer } from "ws";
import http from "http";
import fs7 from "fs";
import path5 from "path";

// src/app/FileService.ts
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

// src/server/serverClasees/getAllFilesRecursively.ts
import fs5 from "fs";
import path3 from "path";
async function getAllFilesRecursively(directoryPath) {
  let fileList = [];
  const files2 = await fs5.readdirSync(directoryPath, { withFileTypes: true });
  for (const file of files2) {
    const fullPath = path3.join(directoryPath, file.name);
    if (file.isDirectory()) {
      fileList = fileList.concat(await getAllFilesRecursively(fullPath));
    } else if (file.isFile()) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

// src/server/serverClasees/Server_Base.ts
import fs6 from "fs";
import path4 from "path";
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
    const dir = path4.dirname(p);
    fs6.mkdirSync(dir, {
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
    const dir = path4.dirname(p);
    fs6.mkdirSync(dir, {
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
    return fs6.existsSync(destFolder);
  }
  async mkdirSync(fp) {
    if (!fs6.existsSync(fp)) {
      return fs6.mkdirSync(fp, {
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
      fs6.mkdirSync(path4.dirname(filepath), {
        recursive: true
      });
      if (!files[testName]) {
        files[testName] = /* @__PURE__ */ new Set();
      }
      files[testName].add(filepath);
      await fs6.writeFileSync(filepath, contents);
      res(true);
    });
  }
  async createWriteStream(filepath, testName) {
    const folder = filepath.split("/").slice(0, -1).join("/");
    return new Promise((res) => {
      if (!fs6.existsSync(folder)) {
        return fs6.mkdirSync(folder, {
          recursive: true
        });
      }
      const f = fs6.createWriteStream(filepath);
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
          const cleanPath = path4.resolve(fPath);
          fPaths.push(cleanPath.replace(process.cwd(), ``));
          const targetDir = cleanPath.split("/").slice(0, -1).join("/");
          fs6.mkdir(targetDir, { recursive: true }, async (error) => {
            if (error) {
            }
            fs6.writeFileSync(
              path4.resolve(
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
              fs6.writeFileSync(fPath, value, "binary");
              res();
            } else if (`string` === typeof value) {
              fs6.writeFileSync(fPath, value.toString(), {
                encoding: "utf-8"
              });
              res();
            } else {
              const pipeStream = value;
              const myFile = fs6.createWriteStream(fPath);
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

// src/server/serverClasees/Server_TCP.ts
var Server_TCP = class extends Server_Base {
  constructor(configs, name, mode2) {
    super(configs, name, mode2);
    this.httpServer = http.createServer(this.handleHttpRequest.bind(this));
    this.wss = new WebSocketServer({ server: this.httpServer });
    this.wss.on("connection", (ws, req) => {
      this.clients.add(ws);
      console.log("Client connected from:", req.socket.remoteAddress, req.url);
      ws.on("message", (data) => {
        try {
          this.websocket(data, ws);
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
    const httpPort = Number(process.env.HTTP_PORT) || 3e3;
    this.httpServer.listen(httpPort, "0.0.0.0", () => {
      console.log(`HTTP server running on http://localhost:${httpPort}`);
    });
  }
  websocket(data, ws) {
    try {
      const rawData = data.toString();
      let parsed;
      try {
        parsed = JSON.parse(rawData);
      } catch (parseError) {
        console.error("Failed to parse WebSocket message as JSON:", rawData);
        return;
      }
      if (Array.isArray(parsed)) {
        console.error(
          "IPC format messages are no longer supported. Node tests must use WebSocket messages with 'type' field."
        );
        console.error("Received array message:", parsed);
        ws.send(
          JSON.stringify({
            error: "IPC format messages are no longer supported. Use WebSocket messages with 'type' field.",
            received: parsed
          })
        );
        return;
      }
      const wsm = parsed;
      console.log(
        "WebSocket message type:",
        wsm.type,
        "key:",
        wsm.key,
        "data:",
        JSON.stringify(wsm.data)
      );
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
        let args;
        if (commandData === void 0 || commandData === null) {
          args = [];
        } else {
          args = Array.isArray(commandData) ? commandData : [commandData];
        }
        try {
          const result = this[wsm.type](...args);
          console.log(`Command ${wsm.type} returned:`, result);
          if (result instanceof Promise) {
            result.then((resolvedResult) => {
              console.log(`Command ${wsm.type} resolved:`, resolvedResult);
              ws.send(
                JSON.stringify({
                  key,
                  payload: resolvedResult
                })
              );
            }).catch((error) => {
              console.error(`Error executing command ${wsm.type}:`, error);
              ws.send(
                JSON.stringify({
                  key,
                  payload: null,
                  error: error?.toString()
                })
              );
            });
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
          ws.send(
            JSON.stringify({
              key,
              payload: null,
              error: error?.toString()
            })
          );
        }
        return;
      }
      if (wsm.type === "getRunningProcesses") {
        const processes = Array.from(this.allProcesses.entries()).map(
          ([id, procInfo]) => ({
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
            logs: this.processLogs.get(id) || []
          })
        );
        ws.send(
          JSON.stringify({
            type: "runningProcesses",
            processes
          })
        );
      } else if (wsm.type === "getProcess") {
        const processId = wsm.data.processId;
        const procInfo = this.allProcesses.get(processId);
        if (procInfo) {
          ws.send(
            JSON.stringify({
              type: "processData",
              processId,
              command: procInfo.command,
              pid: procInfo.pid,
              status: procInfo.status,
              exitCode: procInfo.exitCode,
              error: procInfo.error,
              timestamp: procInfo.timestamp,
              category: procInfo.category,
              testName: procInfo.testName,
              platform: procInfo.platform,
              logs: this.processLogs.get(processId) || []
            })
          );
        }
      } else if (wsm.type === "stdin") {
        const processId = wsm.data.processId;
        const data2 = wsm.data.data;
        const childProcess = this.runningProcesses.get(processId);
        if (childProcess && childProcess.stdin) {
          childProcess.stdin.write(data2);
        } else {
          console.log(
            "Cannot write to stdin - process not found or no stdin:",
            {
              processExists: !!childProcess,
              stdinExists: childProcess?.stdin ? true : false
            }
          );
        }
      } else if (wsm.type === "killProcess") {
        const processId = wsm.processId;
        console.log("Received killProcess for process", processId);
        const childProcess = this.runningProcesses.get(processId);
        if (childProcess) {
          console.log("Killing process");
          childProcess.kill("SIGTERM");
        } else {
          console.log("Cannot kill process - process not found:", {
            processExists: !!childProcess
          });
        }
      } else if (wsm.type === "getChatHistory") {
        if (this.getChatHistory) {
          this.getChatHistory().then((history) => {
            ws.send(
              JSON.stringify({
                type: "chatHistory",
                messages: history
              })
            );
          }).catch((error) => {
            console.error("Error getting chat history:", error);
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Failed to get chat history"
              })
            );
          });
        }
      } else {
        console.warn("Unhandled WebSocket message type:", wsm.type);
      }
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
    }
  }
  handleHttpRequest(req, res) {
    console.log(req.method, req.url);
    if (req.url?.startsWith("/bundles/web/")) {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const pathname = url.pathname;
      const relativePath = pathname.replace(/^\/bundles\/web\//, "");
      const filePath = path5.join(
        process.cwd(),
        "testeranto",
        "bundles",
        "web",
        relativePath
      );
      console.log(`Serving file: ${req.url}`);
      console.log(`  Pathname: ${pathname}`);
      console.log(`  Looking for: ${filePath}`);
      console.log(`  File exists: ${fs7.existsSync(filePath)}`);
      fs7.readFile(filePath, (err, data) => {
        if (err) {
          console.error(`Error serving ${req.url}:`, err.message);
          console.error(`  Full path: ${filePath}`);
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end(
            `404 Not Found: ${req.url}
Path: ${filePath}
Error: ${err.message}`
          );
          return;
        }
        let contentType = "text/plain";
        if (pathname.endsWith(".html"))
          contentType = "text/html";
        else if (pathname.endsWith(".js") || pathname.endsWith(".mjs"))
          contentType = "application/javascript";
        else if (pathname.endsWith(".css"))
          contentType = "text/css";
        else if (pathname.endsWith(".json"))
          contentType = "application/json";
        console.log(`  Successfully served ${req.url} (${contentType})`);
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
      });
      return;
    }
    if (req.url === "/testeranto/index.html" /* root */) {
      fs7.readFile("./testeranto/index.html" /* root */, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end(`500 ${err.toString()}`);
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      });
      return;
    } else if (req.url === "/testeranto/App.css" /* style */) {
      fs7.readFile("./testeranto/App.css" /* style */, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end(`500 ${err.toString()}`);
          return;
        }
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(data);
      });
      return;
    } else if (req.url === "/testeranto/App.js" /* script */) {
      fs7.readFile("./testeranto/App.js" /* script */, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end(`500 ${err.toString()}`);
          return;
        }
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(data);
        return;
      });
      return;
    } else {
      res.writeHead(404);
      res.end(`404 Not Found. ${req.url}`);
      return;
    }
  }
  // FileService methods
  writeFile_send(wsm, ws) {
    ws.send(JSON.stringify(["writeFile", wsm.data.path]));
  }
  writeFile_receive(wsm, ws) {
    fs7.writeFileSync(wsm.data.path, wsm.data.content);
  }
  readFile_receive(wsm, ws) {
    this.readFile_send(wsm, ws, fs7.readFileSync(wsm.data.path).toString());
  }
  readFile_send(wsm, ws, content) {
    ws.send(JSON.stringify(["readFile", wsm.data.path, content]));
  }
  createDirectory_receive(wsm, ws) {
    fs7.mkdirSync(wsm.data.path);
    this.createDirectory_send(wsm, ws);
  }
  createDirectory_send(wsm, ws) {
    ws.send(JSON.stringify(["createDirectory", wsm.data.path]));
  }
  deleteFile_receive(wsm, ws) {
    fs7.unlinkSync(wsm.data.path);
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
      JSON.parse(fs7.readFileSync("./testeranto/projects.json", "utf-8"))
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
  // Command handlers for PM_Node
  writeFileSync(filepath, contents, testName) {
    console.log("Server.writeFileSync called:", {
      filepath,
      testName,
      contentsLength: contents.length,
      cwd: process.cwd()
    });
    let resolvedPath = filepath;
    if (!path5.isAbsolute(filepath)) {
      resolvedPath = path5.join(process.cwd(), filepath);
      console.log("Resolved relative path to:", resolvedPath);
    }
    const dir = path5.dirname(resolvedPath);
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
    const fullPath = path5.join(process.cwd(), filepath);
    return fs7.readFileSync(fullPath, "utf-8");
  }
  createWriteStream(filepath, testName) {
    const dir = path5.dirname(filepath);
    if (!fs7.existsSync(dir)) {
      fs7.mkdirSync(dir, { recursive: true });
    }
    const stream = fs7.createWriteStream(filepath);
    return "stream_" + Math.random().toString(36).substr(2, 9);
  }
  end(uid) {
    return true;
  }
  customclose(fsPath, testName) {
    return true;
  }
};

// src/server/serverClasees/Server_DockerCompose.ts
var Server_DockerCompose = class extends Server_TCP {
  constructor(cwd, configs, name, mode2) {
    super(configs, name, mode2);
    this.cwd = cwd;
    this.config = path6.join(
      "testeranto",
      "bundles",
      `${this.projectName}-docker-compose.yml`
    );
    this.composeDir = process.cwd();
    this.composeFile = path6.join(
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
    console.log(`Setting up docker-compose for ${this.projectName}...`);
    const { setupDockerCompose } = await import("./dockerComposeGenerator-CYAJWX36.mjs");
    await setupDockerCompose(this.configs, this.projectName, {
      logger: {
        log: (...args) => console.log(...args),
        error: (...args) => console.error(...args)
      }
    });
    if (!fs8.existsSync(this.composeFile)) {
      console.error(`Docker-compose file not found after generation: ${this.composeFile}`);
      const dir = path6.dirname(this.composeFile);
      if (fs8.existsSync(dir)) {
        console.error(`Contents of ${dir}:`);
        try {
          const files2 = fs8.readdirSync(dir);
          console.error(files2);
        } catch (e) {
          console.error(`Error reading directory: ${e}`);
        }
      }
      return;
    }
    console.log(`Docker-compose file created at: ${this.composeFile}`);
    await this.startServices();
  }
  async startServices() {
    console.log(`Starting docker-compose services for ${this.projectName}...`);
    console.log(`Compose file path: ${this.composeFile}`);
    console.log(`Working directory: ${this.composeDir}`);
    console.log(`Config path: ${this.config}`);
    if (!fs8.existsSync(this.composeFile)) {
      console.error(`Docker-compose file not found: ${this.composeFile}`);
      console.error(`Current directory: ${process.cwd()}`);
      const bundlesDir = path6.join(process.cwd(), "testeranto", "bundles");
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
      const composeContent = fs8.readFileSync(this.composeFile, "utf-8");
      console.log(`Docker-compose file content (first 3000 chars):`);
      console.log(composeContent.substring(0, 3e3));
      console.log(`File size: ${composeContent.length} bytes`);
    } catch (error) {
      console.error(`Error reading compose file: ${error}`);
    }
    try {
      console.log(`Checking current service status...`);
      const psResult = await this.DC_ps();
      console.log(`Current service status:`, psResult.out);
      console.log(`Exit code: ${psResult.exitCode}`);
      if (psResult.err) {
        console.error(`Error from ps:`, psResult.err);
      }
    } catch (error) {
      console.error(`Error checking service status:`, error);
    }
    try {
      console.log(`Building docker-compose images...`);
      const buildResult = await this.DC_buildAll();
      console.log(`docker-compose build completed with exit code: ${buildResult.exitCode}`);
      if (buildResult.exitCode !== 0) {
        console.error(
          `docker-compose build failed with exit code ${buildResult.exitCode}:`
        );
        console.error(`Error: ${buildResult.err}`);
        console.error(`Output: ${buildResult.out}`);
        return;
      } else {
        console.log(`docker-compose images built successfully`);
      }
      console.log(`Running docker-compose up...`);
      const result = await this.DC_upAll();
      console.log(`docker-compose up completed with exit code: ${result.exitCode}`);
      if (result.exitCode !== 0) {
        console.error(
          `docker-compose up failed with exit code ${result.exitCode}:`
        );
        console.error(`Error: ${result.err}`);
        console.error(`Output: ${result.out}`);
      } else {
        console.log(`docker-compose services started successfully`);
        console.log(`Output (first 3000 chars): ${result.out?.substring(0, 3e3)}`);
        console.log(`Waiting for services to become healthy (15 seconds)...`);
        await new Promise((resolve) => setTimeout(resolve, 15e3));
        console.log(`Checking service status after startup...`);
        const psResult2 = await this.DC_ps();
        console.log(`Service status after startup:`, psResult2.out);
        if (!psResult2.out || psResult2.out.trim() === "") {
          console.error(`No services found in docker-compose ps output!`);
          console.error(`This suggests the services weren't started properly.`);
          console.error(`Trying to get logs for all services...`);
          const composeContent = fs8.readFileSync(this.composeFile, "utf-8");
          const yaml = await import("js-yaml");
          const composeObj = yaml.load(composeContent);
          const serviceNames = Object.keys(composeObj?.services || {});
          console.log(`Services defined in compose file: ${serviceNames.join(", ")}`);
          for (const serviceName of serviceNames) {
            try {
              console.log(`Getting logs for ${serviceName}...`);
              const logsResult = await this.DC_logs(serviceName);
              console.log(`${serviceName} logs (first 1000 chars):`, logsResult.out?.substring(0, 1e3));
            } catch (e) {
              console.error(`Error getting logs for ${serviceName}:`, e);
            }
          }
        } else {
          console.log(`Getting logs for build services...`);
          const serviceOutput = psResult2.out || "";
          if (serviceOutput.includes("bundles-node-build") || serviceOutput.includes("node-build")) {
            try {
              const nodeBuildLogs = await this.DC_logs("node-build");
              console.log(`node-build logs (first 2000 chars):`, nodeBuildLogs.out?.substring(0, 2e3));
            } catch (e) {
              console.error(`Error getting node-build logs:`, e);
            }
          } else {
            console.log(`node-build service not found in running services`);
          }
          if (serviceOutput.includes("bundles-web-build") || serviceOutput.includes("web-build")) {
            try {
              const webBuildLogs = await this.DC_logs("web-build");
              console.log(`web-build logs (first 2000 chars):`, webBuildLogs.out?.substring(0, 2e3));
            } catch (e) {
              console.error(`Error getting web-build logs:`, e);
            }
          } else {
            console.log(`web-build service not found in running services`);
          }
        }
      }
    } catch (error) {
      console.error(`Error starting docker-compose services:`, error);
      console.error(`Full error:`, error);
    }
  }
  setupDockerfileForBuild(runtime, testsName2) {
    const configFilePath = process.argv[2];
    let dockerfileContent;
    if (runtime === "node") {
      dockerfileContent = setupDockerfileForBuildNode(configFilePath);
    } else if (runtime === "web") {
      dockerfileContent = setupDockerfileForBuildWeb(configFilePath);
    } else if (runtime === "python") {
      dockerfileContent = setupDockerfileForBuildPython(configFilePath);
    } else if (runtime === "golang") {
      dockerfileContent = setupDockerfileForBuildGolang(configFilePath);
    } else {
      throw new Error(
        `Unsupported runtime for build Dockerfile generation: ${runtime}`
      );
    }
    if (!dockerfileContent || dockerfileContent.trim().length === 0) {
      console.warn(
        `Generated empty Build Dockerfile for ${runtime}, using fallback`
      );
      const baseNodeImage2 = "node:20.19.4-alpine";
      dockerfileContent = `FROM ${runtime === "node" ? baseNodeImage2 : runtime === "python" ? "python:3.11-alpine" : runtime === "golang" ? "golang:1.21-alpine" : baseNodeImage2}
WORKDIR /app
RUN mkdir -p /workspace/testeranto/metafiles
COPY . .
RUN echo 'Build phase completed'
CMD ["sh", "-c", "echo 'Build service started' && tail -f /dev/null"]
`;
    }
    const dockerfileName = `${runtime}.Dockerfile`;
    const dockerfileDir = path6.join(
      "testeranto",
      "bundles",
      testsName2,
      runtime
    );
    const dockerfilePath = path6.join(dockerfileDir, dockerfileName);
    const normalizedDir = path6.normalize(dockerfileDir);
    if (!normalizedDir.startsWith(path6.join("testeranto", "bundles"))) {
      throw new Error(
        `Invalid Dockerfile directory: ${dockerfileDir}. Must be under testeranto/bundles/`
      );
    }
    const fullDockerfileDir = path6.join(process.cwd(), dockerfileDir);
    fs8.mkdirSync(fullDockerfileDir, { recursive: true });
    const fullDockerfilePath = path6.join(process.cwd(), dockerfilePath);
    fs8.writeFileSync(fullDockerfilePath, dockerfileContent);
    if (!fs8.existsSync(fullDockerfilePath)) {
      throw new Error(
        `Failed to create build Dockerfile at ${fullDockerfilePath}`
      );
    }
    return dockerfileDir;
  }
  generateBuildServiceForRuntime(c, runtime, testsName2, logger) {
    const buildDockerfileDir = setupDockerfileForBuild(
      runtime,
      testsName2,
      logger
    );
    return createBuildService(runtime, buildDockerfileDir, testsName2);
  }
  async DC_buildAll(options) {
    const opts = this.mergeOptions(options);
    const composeContent = fs8.readFileSync(this.composeFile, "utf-8");
    const yaml = await import("js-yaml");
    const composeObj = yaml.load(composeContent);
    const serviceNames = Object.keys(composeObj?.services || {});
    if (serviceNames.length === 0) {
      return { exitCode: 0, out: "No services to build", err: "" };
    }
    return await buildMany(serviceNames, opts);
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
      config: this.composeFile,
      // Use absolute path to docker-compose.yml file
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

// src/server/serverClasees/ChildProcessHandler.ts
import ansiColors from "ansi-colors";
var ChildProcessHandler = class {
  static async handleChildProcess(child, logs2, reportDest, src, runtime) {
    return new Promise((resolve, reject) => {
      child.stdout?.on("data", (data) => {
        logs2.stdout?.write(data);
      });
      child.stderr?.on("data", (data) => {
        logs2.stderr?.write(data);
      });
      child.on("close", (code) => {
        const exitCode = code === null ? -1 : code;
        if (exitCode < 0) {
          logs2.writeExitCode(
            exitCode,
            new Error("Process crashed or was terminated")
          );
        } else {
          logs2.writeExitCode(exitCode);
        }
        logs2.closeAll();
        if (exitCode === 0) {
          resolve();
        } else {
          console.log(
            ansiColors.red(
              `${runtime} ! ${src} failed to execute. Check ${reportDest}/stderr.log for more info`
            )
          );
          reject(new Error(`Process exited with code ${exitCode}`));
        }
      });
      child.on("error", (e) => {
        console.log(
          ansiColors.red(
            ansiColors.inverse(
              `${src} errored with: ${e.name}. Check error logs for more info`
            )
          )
        );
        reject(e);
      });
    });
  }
};

// src/server/serverClasees/TestEnvironmentSetup.ts
import fs9 from "fs";
import ansiColors2 from "ansi-colors";
var TestEnvironmentSetup = class {
  constructor(ports, projectName, browser, queue) {
    this.ports = ports;
    this.projectName = projectName;
    this.browser = browser;
    this.queue = queue;
  }
  async setupTestEnvironment(src, runtime) {
    const reportDest = `testeranto/reports/${this.projectName}/${src.split(".").slice(0, -1).join(".")}/${runtime}`;
    if (!fs9.existsSync(reportDest)) {
      fs9.mkdirSync(reportDest, { recursive: true });
    }
    const testConfig = null;
    const testConfigResource = { ports: 0 };
    const portsToUse = [];
    let testResources = "";
    if (testConfigResource.ports === 0) {
      testResources = JSON.stringify({
        name: src,
        ports: [],
        fs: reportDest,
        browserWSEndpoint: this.browser.wsEndpoint()
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
          browserWSEndpoint: this.browser.wsEndpoint()
        });
      } else {
        console.log(
          ansiColors2.red(
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

// src/server/serverClasees/WebLauncher.ts
import fs11 from "fs";
import path7 from "path";
import ansiColors3 from "ansi-colors";

// src/server/aider/generatePromptFiles.ts
import fs10 from "fs";

// src/server/aider/promptTemplates.ts
var message = () => {
  return `There are 3 types of test reports.
1) bdd (highest priority)
2) type checker
3) static analysis (lowest priority)

"tests.json" is the detailed result of the bdd tests.
if these files do not exist, then something has gone badly wrong and needs to be addressed.

"type_errors.txt" is the result of the type checker.
if this file does not exist, then type check passed without errors;

"lint_errors.txt" is the result of the static analysis.
if this file does not exist, then static analysis passed without errors;

BDD failures are the highest priority. Focus on passing BDD tests before addressing other concerns.
Do not add error throwing/catching to the tests themselves.`;
};
var promptContent = (reportDest) => {
  return `/read node_modules/testeranto/docs/index.md
/read node_modules/testeranto/docs/style.md
/read node_modules/testeranto/docs/testing.ai.txt
/read node_modules/testeranto/src/CoreTypes.ts

/read ${reportDest}/tests.json
/read ${reportDest}/type_errors.txt
/read ${reportDest}/lint_errors.txt

/read ${reportDest}/stdout.log
/read ${reportDest}/stderr.log
/read ${reportDest}/exit.log
/read ${reportDest}/message.txt`;
};

// src/server/aider/generatePromptFiles.ts
var generatePromptFiles = (reportDest, src) => {
  try {
    if (!fs10.existsSync(reportDest)) {
      fs10.mkdirSync(reportDest, { recursive: true });
    }
    const messagePath = `${reportDest}/message.txt`;
    const messageContent = message();
    fs10.writeFileSync(messagePath, messageContent);
    const promptPath = `${reportDest}/prompt.txt`;
    fs10.writeFileSync(promptPath, promptContent(reportDest));
  } catch (error) {
    console.error(`Failed to generate prompt files for ${src}:`, error);
  }
};

// src/server/serverClasees/WebLauncher.ts
var WebLauncher = class {
  constructor(projectName, browser, bddTestIsRunning, bddTestIsNowDone, addPromiseProcess, checkQueue) {
    this.projectName = projectName;
    this.browser = browser;
    this.bddTestIsRunning = bddTestIsRunning;
    this.bddTestIsNowDone = bddTestIsNowDone;
    this.addPromiseProcess = addPromiseProcess;
    this.checkQueue = checkQueue;
  }
  async launchWeb(src, dest) {
    console.log(ansiColors3.green(ansiColors3.inverse(`web < ${src}`)));
    const processId = `web-${src}-${Date.now()}`;
    const command = `web test: ${src}`;
    const webPromise = (async () => {
      try {
        this.bddTestIsRunning(src);
        const reportDest = `testeranto/reports/${this.projectName}/${src.split(".").slice(0, -1).join(".")}/web`;
        if (!fs11.existsSync(reportDest)) {
          fs11.mkdirSync(reportDest, { recursive: true });
        }
        const destFolder = dest.replace(".mjs", "");
        const htmlPath = `${destFolder}.html`;
        const webArgz = JSON.stringify({
          name: src,
          ports: [],
          fs: reportDest,
          browserWSEndpoint: this.browser.wsEndpoint()
        });
        const logs2 = createLogStreams(reportDest, "web");
        const httpPort = Number(process.env.HTTP_PORT) || 3e3;
        let relativePath;
        const match = htmlPath.match(/testeranto\/bundles\/web\/(.*)/);
        if (match) {
          relativePath = match[1];
        } else {
          const absMatch = htmlPath.match(/\/bundles\/web\/(.*)/);
          if (absMatch) {
            relativePath = absMatch[1];
          } else {
            relativePath = path7.basename(htmlPath);
          }
        }
        const encodedConfig = encodeURIComponent(webArgz);
        const url = `http://localhost:${httpPort}/bundles/web/${relativePath}?config=${encodedConfig}`;
        console.log(
          `Navigating to ${url} (HTML file exists: ${fs11.existsSync(htmlPath)})`
        );
        const page = await this.browser.newPage();
        page.on("console", (log) => {
          const msg = `${log.text()}
`;
          switch (log.type()) {
            case "info":
              logs2.info?.write(msg);
              break;
            case "warn":
              logs2.warn?.write(msg);
              break;
            case "error":
              logs2.error?.write(msg);
              break;
            case "debug":
              logs2.debug?.write(msg);
              break;
            default:
              break;
          }
        });
        page.on("close", () => {
          logs2.writeExitCode(0);
          logs2.closeAll();
        });
        const close = () => {
        };
        page.on("pageerror", (err) => {
          logs2.info?.write("pageerror: " + err.message);
          console.error("Page error in web test:", err);
          logs2.writeExitCode(-1, err);
          console.log(
            ansiColors3.red(
              `web ! ${src} failed to execute. No "tests.json" file was generated. Check ${reportDest}/error.log for more info`
            )
          );
          this.bddTestIsNowDone(src, -1);
          close();
          throw err;
        });
        page.on("console", (msg) => {
          const text = msg.text();
          console.log(`Browser console [${msg.type()}]: ${text}`);
        });
        await page.goto(url, { waitUntil: "networkidle0" });
        let jsRelativePath;
        const jsMatch = dest.match(/testeranto\/bundles\/web\/(.*)/);
        if (jsMatch) {
          jsRelativePath = jsMatch[1];
        } else {
          const jsAbsMatch = dest.match(/\/bundles\/web\/(.*)/);
          if (jsAbsMatch) {
            jsRelativePath = jsAbsMatch[1];
          } else {
            jsRelativePath = path7.basename(dest);
          }
        }
        const jsUrl = `/bundles/web/${jsRelativePath}?cacheBust=${Date.now()}`;
        const evaluation = webEvaluator(jsUrl, webArgz);
        console.log("Evaluating web test with URL:", jsUrl);
        try {
          const results = await page.evaluate(evaluation);
          const { fails } = results;
          logs2.info?.write("\n idk1");
          statusMessagePretty(fails, src, "web");
          this.bddTestIsNowDone(src, fails);
        } catch (error) {
          console.error("Error evaluating web test:", error);
          logs2.info?.write("\n Error evaluating web test");
          statusMessagePretty(-1, src, "web");
          this.bddTestIsNowDone(src, -1);
        }
        generatePromptFiles(reportDest, src);
        await page.close();
        close();
      } catch (error) {
        console.error(`Error in web test ${src}:`, error);
        this.bddTestIsNowDone(src, -1);
        throw error;
      }
    })();
    this.addPromiseProcess(
      processId,
      webPromise,
      command,
      "bdd-test",
      src,
      "web",
      () => {
        setTimeout(() => this.checkQueue(), 100);
      },
      () => {
        setTimeout(() => this.checkQueue(), 100);
      }
    );
  }
};

// src/server/serverClasees/NodeLauncher.ts
import { spawn as spawn3 } from "child_process";
import ansiColors4 from "ansi-colors";
var NodeLauncher = class {
  constructor(projectName, setupTestEnvironment, cleanupPorts, handleChildProcess, bddTestIsRunning, bddTestIsNowDone, addPromiseProcess, checkQueue) {
    this.projectName = projectName;
    this.setupTestEnvironment = setupTestEnvironment;
    this.cleanupPorts = cleanupPorts;
    this.handleChildProcess = handleChildProcess;
    this.bddTestIsRunning = bddTestIsRunning;
    this.bddTestIsNowDone = bddTestIsNowDone;
    this.addPromiseProcess = addPromiseProcess;
    this.checkQueue = checkQueue;
  }
  async launchNode(src, dest) {
    console.log(ansiColors4.green(ansiColors4.inverse(`node < ${src}`)));
    const processId = `node-${src}-${Date.now()}`;
    const command = `node test: ${src}`;
    const nodePromise = (async () => {
      try {
        this.bddTestIsRunning(src);
        const setupResult = await this.setupTestEnvironment(src, "node");
        const { reportDest, testResources, portsToUse } = setupResult;
        const builtfile = dest;
        const logs2 = createLogStreams(reportDest, "node");
        const child = spawn3("node", [builtfile, testResources], {
          stdio: ["pipe", "pipe", "pipe"],
          env: {
            ...process.env,
            WS_PORT: "3000"
          }
        });
        child.stdout?.on("data", (data) => {
          logs2.stdout?.write(data);
        });
        child.stderr?.on("data", (data) => {
          logs2.stderr?.write(data);
        });
        try {
          await this.handleChildProcess(child, logs2, reportDest, src, "node");
          generatePromptFiles(reportDest, src);
        } finally {
          this.cleanupPorts(portsToUse);
        }
      } catch (error) {
        if (error.message !== "No ports available") {
          console.error(`Error in launchNode for ${src}:`, error);
        }
      }
    })();
    this.addPromiseProcess(
      processId,
      nodePromise,
      command,
      "bdd-test",
      src,
      "node",
      () => {
        setTimeout(() => this.checkQueue(), 100);
      },
      () => {
        setTimeout(() => this.checkQueue(), 100);
      }
    );
  }
};

// src/server/serverClasees/BuildProcessManager.ts
import esbuild from "esbuild";
var BuildProcessManager = class {
  constructor(projectName, configs, mode2, webSocketBroadcastMessage, addPromiseProcess) {
    this.projectName = projectName;
    this.configs = configs;
    this.mode = mode2;
    this.webSocketBroadcastMessage = webSocketBroadcastMessage;
    this.addPromiseProcess = addPromiseProcess;
    this.currentBuildResolve = null;
    this.currentBuildReject = null;
  }
  async startBuildProcess(configer, entryPoints, runtime) {
    const entryPointKeys = Object.keys(entryPoints);
    if (entryPointKeys.length === 0)
      return;
    const self = this;
    const buildProcessTrackerPlugin = {
      name: "build-process-tracker",
      setup(build) {
        build.onStart(() => {
          const processId = `build-${runtime}-${Date.now()}`;
          const command = `esbuild ${runtime} for ${self.projectName}`;
          const buildPromise = new Promise((resolve, reject) => {
            self.currentBuildResolve = resolve;
            self.currentBuildReject = reject;
          });
          if (self.addPromiseProcess) {
            self.addPromiseProcess(
              processId,
              buildPromise,
              command,
              "build-time",
              self.projectName,
              runtime
            );
          }
          console.log(
            `Starting ${runtime} build for ${entryPointKeys.length} entry points`
          );
          if (self.webSocketBroadcastMessage) {
            self.webSocketBroadcastMessage({
              type: "buildEvent",
              event: "start",
              runtime,
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              entryPoints: entryPointKeys.length,
              processId
            });
          }
        });
        build.onEnd((result) => {
          const event = {
            type: "buildEvent",
            event: result.errors.length > 0 ? "error" : "success",
            runtime,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            errors: result.errors.length,
            warnings: result.warnings.length
          };
          if (result.errors.length > 0) {
            console.error(
              `Build ${runtime} failed with ${result.errors.length} errors`
            );
            if (self.currentBuildReject) {
              self.currentBuildReject(
                new Error(`Build failed with ${result.errors.length} errors`)
              );
            }
          } else {
            console.log(`Build ${runtime} completed successfully`);
            if (self.currentBuildResolve) {
              self.currentBuildResolve();
            }
          }
          if (self.webSocketBroadcastMessage) {
            self.webSocketBroadcastMessage(event);
          }
          self.currentBuildResolve = null;
          self.currentBuildReject = null;
        });
      }
    };
    const baseConfig = configer(this.configs, entryPointKeys, this.projectName);
    const configWithPlugin = {
      ...baseConfig,
      plugins: [...baseConfig.plugins || [], buildProcessTrackerPlugin]
    };
    try {
      if (this.mode === "dev") {
        const ctx = await esbuild.context(configWithPlugin);
        await ctx.rebuild();
        await ctx.watch();
      } else {
        const result = await esbuild.build(configWithPlugin);
        if (result.errors.length === 0) {
          console.log(`Successfully built ${runtime} bundle`);
        }
      }
    } catch (error) {
      console.error(`Failed to build ${runtime}:`, error);
      if (this.webSocketBroadcastMessage) {
        this.webSocketBroadcastMessage({
          type: "buildEvent",
          event: "error",
          runtime,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          errors: 1,
          warnings: 0,
          message: error.message
        });
      }
      throw error;
    }
  }
};

// src/server/serverClasees/BuildProcessStarter.ts
var BuildProcessStarter = class {
  constructor(projectName, configs, buildProcessManager) {
    this.projectName = projectName;
    this.configs = configs;
    this.buildProcessManager = buildProcessManager;
  }
  async startBuildProcesses() {
    const { nodeEntryPoints, webEntryPoints } = getRunnables(
      this.configs,
      this.projectName
    );
    console.log(`Starting build processes for ${this.projectName}...`);
    console.log(`  Node entry points: ${Object.keys(nodeEntryPoints).length}`);
    console.log(`  Web entry points: ${Object.keys(webEntryPoints).length}`);
    await Promise.all([
      this.buildProcessManager.startBuildProcess(
        node_default,
        nodeEntryPoints,
        "node"
      ),
      this.buildProcessManager.startBuildProcess(
        web_default,
        webEntryPoints,
        "web"
      )
      // this.buildProcessManager.startBuildProcess(esbuildImportConfiger, pureEntryPoints, "pure"),
    ]);
  }
};

// src/server/serverClasees/PythonLauncher.ts
import { spawn as spawn4 } from "child_process";
import fs12 from "fs";
var PythonLauncher = class {
  constructor(projectName, setupTestEnvironment, handleChildProcess, cleanupPorts, bddTestIsRunning, bddTestIsNowDone, addPromiseProcess, checkQueue) {
    this.projectName = projectName;
    this.setupTestEnvironment = setupTestEnvironment;
    this.handleChildProcess = handleChildProcess;
    this.cleanupPorts = cleanupPorts;
    this.bddTestIsRunning = bddTestIsRunning;
    this.bddTestIsNowDone = bddTestIsNowDone;
    this.addPromiseProcess = addPromiseProcess;
    this.checkQueue = checkQueue;
  }
  async launchPython(src, dest) {
    console.log(`python < ${src}`);
    const processId = `python-${src}-${Date.now()}`;
    const command = `python test: ${src}`;
    const pythonPromise = (async () => {
      try {
        const { reportDest, testResources, portsToUse } = await this.setupTestEnvironment(src, "python");
        const logs2 = createLogStreams(reportDest, "python");
        const venvPython = `./venv/bin/python3`;
        const pythonCommand = fs12.existsSync(venvPython) ? venvPython : "python3";
        const child = spawn4(pythonCommand, [src, testResources], {
          stdio: ["pipe", "pipe", "pipe"],
          env: {
            ...process.env,
            WS_PORT: "3000"
          }
        });
        child.stdout?.on("data", (data) => {
          logs2.stdout?.write(data);
        });
        child.stderr?.on("data", (data) => {
          logs2.stderr?.write(data);
        });
        try {
          await this.handleChildProcess(child, logs2, reportDest, src, "python");
          await generatePromptFiles(reportDest, src);
        } finally {
          this.cleanupPorts(portsToUse);
        }
      } catch (error) {
        if (error.message !== "No ports available") {
          console.error(`Error in launchPython for ${src}:`, error);
        }
      }
    })();
    this.addPromiseProcess(
      processId,
      pythonPromise,
      command,
      "bdd-test",
      src,
      "python",
      () => {
        setTimeout(() => this.checkQueue(), 100);
      },
      () => {
        setTimeout(() => this.checkQueue(), 100);
      }
    );
  }
};

// src/server/serverClasees/GolangLauncher.ts
import { spawn as spawn5 } from "child_process";
import fs14 from "fs";
import path9 from "path";

// src/server/golang/processGoTestOutput.ts
import fs13 from "fs";
import path8 from "path";
var processGoTestOutput = (reportDest, src) => {
  const testsJsonPath = `${reportDest}/tests.json`;
  const stdoutPath = `${reportDest}/stdout.log`;
  if (fs13.existsSync(stdoutPath)) {
    try {
      const stdoutContent = fs13.readFileSync(stdoutPath, "utf-8");
      const lines = stdoutContent.split("\n").filter((line) => line.trim());
      const testResults = {
        tests: [],
        features: [],
        givens: [],
        fullPath: path8.resolve(process.cwd(), src)
      };
      for (const line of lines) {
        try {
          const event = JSON.parse(line);
          if (event.Action === "pass" || event.Action === "fail") {
            testResults.tests.push({
              name: event.Test || event.Package,
              status: event.Action === "pass" ? "passed" : "failed",
              time: event.Elapsed ? `${event.Elapsed}s` : "0s"
            });
          }
        } catch (e) {
        }
      }
      fs13.writeFileSync(testsJsonPath, JSON.stringify(testResults, null, 2));
      return;
    } catch (error) {
      console.error("Error processing go test output:", error);
    }
  }
};

// src/server/serverClasees/GolangLauncher.ts
var GolangLauncher = class {
  constructor(projectName, setupTestEnvironment, handleChildProcess, cleanupPorts, bddTestIsRunning, bddTestIsNowDone, addPromiseProcess, checkQueue) {
    this.projectName = projectName;
    this.setupTestEnvironment = setupTestEnvironment;
    this.handleChildProcess = handleChildProcess;
    this.cleanupPorts = cleanupPorts;
    this.bddTestIsRunning = bddTestIsRunning;
    this.bddTestIsNowDone = bddTestIsNowDone;
    this.addPromiseProcess = addPromiseProcess;
    this.checkQueue = checkQueue;
  }
  async launchGolang(src, dest) {
    const { default: ansiC7 } = await import("ansi-colors");
    console.log(ansiC7.green(ansiC7.inverse(`goland < ${src}`)));
    const processId = `golang-${src}-${Date.now()}`;
    const command = `golang test: ${src}`;
    const golangPromise = (async () => {
      try {
        const { reportDest, testResources, portsToUse } = await this.setupTestEnvironment(src, "golang");
        const logs2 = createLogStreams(reportDest, "golang");
        let currentDir = path9.dirname(src);
        let goModDir = null;
        while (currentDir !== path9.parse(currentDir).root) {
          if (fs14.existsSync(path9.join(currentDir, "go.mod"))) {
            goModDir = currentDir;
            break;
          }
          currentDir = path9.dirname(currentDir);
        }
        if (!goModDir) {
          console.error(`Could not find go.mod file for test ${src}`);
          goModDir = path9.dirname(src);
          console.error(`Falling back to: ${goModDir}`);
        }
        const relativeTestPath = path9.relative(goModDir, src);
        const child = spawn5(
          "go",
          ["test", "-v", "-json", "./" + path9.dirname(relativeTestPath)],
          {
            stdio: ["pipe", "pipe", "pipe"],
            env: {
              ...process.env,
              TEST_RESOURCES: testResources,
              WS_PORT: "3000",
              // Pass WebSocket port
              GO111MODULE: "on"
            },
            cwd: goModDir
          }
        );
        child.stdout?.on("data", (data) => {
          logs2.stdout?.write(data);
        });
        child.stderr?.on("data", (data) => {
          logs2.stderr?.write(data);
        });
        await this.handleChildProcess(child, logs2, reportDest, src, "golang");
        generatePromptFiles(reportDest, src);
        processGoTestOutput(reportDest, src);
        this.cleanupPorts(portsToUse);
      } catch (error) {
        if (error.message !== "No ports available") {
          throw error;
        }
      }
    })();
    this.addPromiseProcess(
      processId,
      golangPromise,
      command,
      "bdd-test",
      src,
      "golang",
      () => {
        setTimeout(() => this.checkQueue(), 100);
      },
      () => {
        setTimeout(() => this.checkQueue(), 100);
      }
    );
  }
};

// src/server/serverClasees/EntrypointFinder.ts
var EntrypointFinder = class {
  constructor(configs, projectName) {
    this.configs = configs;
    this.projectName = projectName;
  }
  findTestNameByEntrypoint(entrypoint, platform) {
    const runnables = getRunnables(this.configs, this.projectName);
    let entryPointsMap;
    switch (platform) {
      case "node":
        entryPointsMap = runnables.nodeEntryPoints;
        break;
      case "web":
        entryPointsMap = runnables.webEntryPoints;
        break;
      case "python":
        entryPointsMap = runnables.pythonEntryPoints;
        break;
      case "golang":
        entryPointsMap = runnables.golangEntryPoints;
        break;
      default:
        throw "wtf";
    }
    if (!entryPointsMap) {
      console.error("idk");
    }
    if (!entryPointsMap[entrypoint]) {
      console.error(`${entrypoint} not found 1`, entryPointsMap);
      console.trace();
      throw `${entrypoint} not found`;
    }
    return entryPointsMap[entrypoint];
  }
};

// src/server/serverClasees/TscCheck.ts
import fs15 from "fs";

// src/server/node+web/tscCheck.ts
import tsc from "tsc-prog";
import ts from "typescript";
var tscCheck = ({
  entrypoint,
  addableFiles,
  platform,
  projectName
}) => {
  const program = tsc.createProgramFromConfig({
    basePath: process.cwd(),
    configFilePath: "tsconfig.json",
    compilerOptions: {
      outDir: tscPather(entrypoint, platform, projectName),
      noEmit: true
    },
    include: addableFiles
  });
  const allDiagnostics = program.getSemanticDiagnostics();
  const results = [];
  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      const { line, character } = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start
      );
      const message2 = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      results.push(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message2}`
      );
    } else {
      results.push(
        ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
      );
    }
  });
  return results;
};

// src/server/serverClasees/TscCheck.ts
var TscCheck = class {
  constructor(projectName, typeCheckIsRunning, typeCheckIsNowDone, addPromiseProcess) {
    this.projectName = projectName;
    this.typeCheckIsRunning = typeCheckIsRunning;
    this.typeCheckIsNowDone = typeCheckIsNowDone;
    this.addPromiseProcess = addPromiseProcess;
  }
  async tscCheck({
    entrypoint,
    addableFiles,
    platform
  }) {
    const processId = `tsc-${entrypoint}-${Date.now()}`;
    const command = `tsc check for ${entrypoint}`;
    const tscPromise = (async () => {
      try {
        this.typeCheckIsRunning(entrypoint);
      } catch (e) {
        throw new Error(`Error in tscCheck: ${e.message}`);
      }
      const tscPath = tscPather(entrypoint, platform, this.projectName);
      const results = tscCheck({
        entrypoint,
        addableFiles,
        platform,
        projectName: this.projectName
      });
      fs15.writeFileSync(tscPath, results.join("\n"));
      this.typeCheckIsNowDone(entrypoint, results.length);
      return results.length;
    })();
    this.addPromiseProcess(
      processId,
      tscPromise,
      command,
      "build-time",
      entrypoint,
      platform
    );
  }
};

// src/server/serverClasees/EslintCheck.ts
import fs16 from "fs";

// src/server/node+web/lintCheck.ts
import { ESLint } from "eslint";
var eslint = new ESLint();
var formatter = await eslint.loadFormatter(
  "./node_modules/testeranto/dist/prebuild/esbuildConfigs/eslint-formatter-testeranto.mjs"
);
var lintCheck = async (addableFiles) => {
  const results = (await eslint.lintFiles(addableFiles)).filter((r) => r.messages.length).filter((r) => {
    return r.messages[0].ruleId !== null;
  }).map((r) => {
    delete r.source;
    return r;
  });
  return await formatter.format(results);
};

// src/server/serverClasees/EslintCheck.ts
var EslintCheck = class {
  constructor(projectName, lintIsRunning, lintIsNowDone, addPromiseProcess, writeBigBoard, checkForShutdown2) {
    this.projectName = projectName;
    this.lintIsRunning = lintIsRunning;
    this.lintIsNowDone = lintIsNowDone;
    this.addPromiseProcess = addPromiseProcess;
    this.writeBigBoard = writeBigBoard;
    this.checkForShutdown = checkForShutdown2;
  }
  async eslintCheck({
    entrypoint,
    addableFiles,
    platform
  }) {
    const processId = `eslint-${entrypoint}-${Date.now()}`;
    const command = `eslint check for ${entrypoint}`;
    const eslintPromise = (async () => {
      try {
        this.lintIsRunning(entrypoint);
      } catch (e) {
        throw new Error(`Error in eslintCheck: ${e.message}`);
      }
      const filepath = lintPather(entrypoint, platform, this.projectName);
      if (fs16.existsSync(filepath))
        fs16.rmSync(filepath);
      const results = await lintCheck(addableFiles);
      fs16.writeFileSync(filepath, results);
      this.lintIsNowDone(entrypoint, results.length);
      return results.length;
    })();
    this.addPromiseProcess(
      processId,
      eslintPromise,
      command,
      "build-time",
      entrypoint,
      platform
    );
  }
};

// src/server/serverClasees/ServerTestEnvironmentSetup.ts
import ansiC4 from "ansi-colors";
var ServerTestEnvironmentSetup = class {
  constructor(ports, projectName, browser, queue, configs, bddTestIsRunning) {
    this.ports = ports;
    this.projectName = projectName;
    this.browser = browser;
    this.queue = queue;
    this.configs = configs;
    this.bddTestIsRunning = bddTestIsRunning;
  }
  async setupTestEnvironment(src, runtime) {
    this.bddTestIsRunning(src);
    const testConfig = configTests_default(this.configs).find((t) => t[0] === src);
    if (!testConfig) {
      console.log(
        ansiC4.inverse(`missing test config! Exiting ungracefully for '${src}'`)
      );
      process.exit(-1);
    }
    const testEnvironmentSetup = new TestEnvironmentSetup(
      this.ports,
      this.projectName,
      this.browser,
      this.queue
    );
    const result = await testEnvironmentSetup.setupTestEnvironment(
      src,
      runtime
    );
    return {
      ...result,
      testConfig,
      testConfigResource: testConfig[2]
    };
  }
};

// src/server/serverClasees/TypeCheckNotifier.ts
import ansiColors5 from "ansi-colors";
var TypeCheckNotifier = class {
  constructor(summary, writeBigBoard, checkForShutdown2) {
    this.summary = summary;
    this.writeBigBoard = writeBigBoard;
    this.checkForShutdown = checkForShutdown2;
  }
  typeCheckIsNowDone(src, failures) {
    if (failures === 0) {
      console.log(ansiColors5.green(ansiColors5.inverse(`tsc > ${src}`)));
    } else {
      console.log(
        ansiColors5.red(ansiColors5.inverse(`tsc > ${src} failed ${failures} times`))
      );
    }
    this.summary[src].typeErrors = failures;
    this.writeBigBoard();
    this.checkForShutdown();
  }
  typeCheckIsRunning(src) {
  }
};

// src/server/serverClasees/Server.ts
var Server = class extends Server_DockerCompose {
  constructor(configs, testName, mode2) {
    super(process.cwd(), configs, testName, mode2);
    // queueManager: QueueManager;
    // portManager: PortManager;
    // processManager: ProcessManager = new ProcessManager();
    // metafileManager: MetafileManager = new MetafileManager();
    // summaryManager: SummaryManager = new SummaryManager();
    this.summary = {};
    this.logStreams = {};
    this.clients = /* @__PURE__ */ new Set();
    this.currentBuildResolve = null;
    this.currentBuildReject = null;
    this.configTests = () => {
      return configTests_default(this.configs);
    };
    this.writeBigBoard = () => {
      this.summaryManager.writeBigBoard(
        this.projectName,
        this.webSocketBroadcastMessage.bind(this)
      );
    };
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
    // private cleanupTestProcesses(testName: string) {
    //   const processesToCleanup =
    //     this.processManager.cleanupTestProcesses(testName);
    //   // Broadcast process exit for each cleaned up process
    //   processesToCleanup.forEach((processId) => {
    //     this.webSocketBroadcastMessage({
    //       type: "processExited",
    //       processId,
    //       exitCode: -1,
    //       timestamp: new Date().toISOString(),
    //       logs: ["Process killed due to source file change"],
    //     });
    //   });
    // }
    this.checkForShutdown = async () => {
      checkForShutdown(
        this.mode,
        this.summaryManager,
        this.queueManager,
        this.checkQueue.bind(this),
        this.writeBigBoard.bind(this)
      );
    };
    this.tscCheckInstance = null;
    this.tscCheck = async ({
      entrypoint,
      addableFiles,
      platform
    }) => {
      return this.getTscCheck().tscCheck({
        entrypoint,
        addableFiles,
        platform
      });
    };
    this.eslintCheckInstance = null;
    this.eslintCheck = async ({
      entrypoint,
      addableFiles,
      platform
    }) => {
      return this.getEslintCheck().eslintCheck({
        entrypoint,
        addableFiles,
        platform
      });
    };
    this.typeCheckIsRunning = (src) => {
      this.summaryManager.ensureSummaryEntry(src);
      this.summary[src].typeErrors = "?";
    };
    this.typeCheckIsNowDone = (src, failures) => {
      this.typeCheckNotifier.typeCheckIsNowDone(src, failures);
    };
    this.lintIsRunning = (src) => {
      this.summaryManager.ensureSummaryEntry(src);
      this.summary[src].staticErrors = "?";
      this.writeBigBoard();
    };
    this.bddTestIsNowDone = (src, failures) => {
      this.summary[src].runTimeErrors = failures;
      this.writeBigBoard();
      this.checkForShutdown();
    };
    this.lintIsNowDone = (src, failures) => {
      if (failures === 0) {
        console.log(ansiC5.green(ansiC5.inverse(`eslint > ${src}`)));
      } else {
        console.log(
          ansiC5.red(ansiC5.inverse(`eslint > ${src} failed ${failures} times`))
        );
      }
      this.summary[src].staticErrors = failures;
      this.writeBigBoard();
      this.checkForShutdown();
    };
    this.launchNode = async (src, dest) => {
      const nodeLauncher = new NodeLauncher(
        this.projectName,
        this.setupTestEnvironment.bind(this),
        this.cleanupPorts.bind(this),
        this.handleChildProcess.bind(this),
        this.bddTestIsRunning,
        this.bddTestIsNowDone,
        this.addPromiseProcess.bind(this),
        this.checkQueue.bind(this)
      );
      return nodeLauncher.launchNode(src, dest);
    };
    this.launchWeb = async (src, dest) => {
      const webLauncher = new WebLauncher(
        this.projectName,
        this.browser,
        this.bddTestIsRunning,
        this.bddTestIsNowDone,
        this.addPromiseProcess.bind(this),
        this.checkQueue.bind(this)
      );
      return webLauncher.launchWeb(src, dest);
    };
    this.launchPython = async (src, dest) => {
      const pythonLauncher = new PythonLauncher(
        this.projectName,
        this.setupTestEnvironment.bind(this),
        this.handleChildProcess.bind(this),
        this.cleanupPorts.bind(this),
        this.bddTestIsRunning,
        this.bddTestIsNowDone,
        this.addPromiseProcess.bind(this),
        this.checkQueue.bind(this)
      );
      return pythonLauncher.launchPython(src, dest);
    };
    this.launchGolang = async (src, dest) => {
      const golangLauncher = new GolangLauncher(
        this.projectName,
        this.setupTestEnvironment.bind(this),
        this.handleChildProcess.bind(this),
        this.cleanupPorts.bind(this),
        this.bddTestIsRunning,
        this.bddTestIsNowDone,
        this.addPromiseProcess.bind(this),
        this.checkQueue.bind(this)
      );
      return golangLauncher.launchGolang(src, dest);
    };
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
    this.buildProcessManager = new BuildProcessManager(
      this.projectName,
      this.configs,
      this.mode,
      this.webSocketBroadcastMessage.bind(this),
      this.addPromiseProcess?.bind(this)
    );
    this.buildProcessStarter = new BuildProcessStarter(
      this.projectName,
      this.configs,
      this.buildProcessManager
    );
    this.typeCheckNotifier = new TypeCheckNotifier(
      this.summary,
      this.writeBigBoard.bind(this),
      this.checkForShutdown.bind(this)
    );
  }
  async setupTestEnvironment(src, runtime) {
    const serverTestEnvironmentSetup = new ServerTestEnvironmentSetup(
      this.ports,
      this.projectName,
      this.browser,
      this.queue,
      this.configs,
      this.bddTestIsRunning
    );
    return serverTestEnvironmentSetup.setupTestEnvironment(src, runtime);
  }
  cleanupPorts(portsToUse) {
    this.testEnvironmentSetup.cleanupPorts(portsToUse);
  }
  handleChildProcess(child, logs2, reportDest, src, runtime) {
    return new Promise((resolve, reject) => {
      ChildProcessHandler.handleChildProcess(
        child,
        logs2,
        reportDest,
        src,
        runtime
      ).then(() => {
        this.bddTestIsNowDone(src, 0);
        statusMessagePretty(0, src, runtime);
        resolve();
      }).catch((error) => {
        if (error.message.startsWith("Process exited with code")) {
          const exitCode = parseInt(error.message.match(/\d+/)?.[0] || "-1");
          this.bddTestIsNowDone(src, exitCode);
          statusMessagePretty(exitCode, src, runtime);
        } else {
          this.bddTestIsNowDone(src, -1);
          statusMessagePretty(-1, src, runtime);
        }
        reject(error);
      });
    });
  }
  webSocketBroadcastMessage(message2) {
    const data = typeof message2 === "string" ? message2 : JSON.stringify(message2);
    this.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(data);
      }
    });
  }
  getProcessesByCategory(category) {
    return this.getProcessesByCategory(category);
  }
  getBDDTestProcesses() {
    return this.getProcessesByCategory("bdd-test");
  }
  getBuildTimeProcesses() {
    return this.getProcessesByCategory("build-time");
  }
  findTestNameByEntrypoint(entrypoint, platform) {
    const finder = new EntrypointFinder(this.configs, this.projectName);
    return finder.findTestNameByEntrypoint(entrypoint, platform);
  }
  async start() {
    try {
      await this.buildProcessStarter.startBuildProcesses();
      const pythonTests = this.configTests().filter(
        (test) => test[1] === "python"
      );
      if (pythonTests.length > 0) {
        const entryPoints = pythonTests.map((test) => test[0]);
        const metafile = await generatePitonoMetafile(
          this.projectName,
          entryPoints
        );
        writePitonoMetafile(this.projectName, metafile);
      }
    } catch (error) {
      console.error("Build processes failed:", error);
      return;
    }
    this.mapping().forEach(async ([command, func]) => {
      globalThis[command] = func;
    });
    if (!fs17.existsSync(`testeranto/reports/${this.projectName}`)) {
      fs17.mkdirSync(`testeranto/reports/${this.projectName}`);
    }
    try {
      this.browser = await puppeteer.launch(puppeteerConfigs);
    } catch (e) {
      console.error(e);
      console.error(
        "could not start chrome via puppetter. Check this path: ",
        executablePath2
      );
    }
    const runnables = getRunnables(this.configs, this.projectName);
    const {
      nodeEntryPoints,
      webEntryPoints,
      // pureEntryPoints,
      pythonEntryPoints,
      golangEntryPoints
    } = runnables;
    [
      ["node", nodeEntryPoints],
      ["web", webEntryPoints],
      // ["pure", pureEntryPoints],
      ["python", pythonEntryPoints],
      ["golang", golangEntryPoints]
    ].forEach(([runtime, entryPoints]) => {
      Object.keys(entryPoints).forEach((entryPoint) => {
        const reportDest = `testeranto/reports/${this.projectName}/${entryPoint.split(".").slice(0, -1).join(".")}/${runtime}`;
        if (!fs17.existsSync(reportDest)) {
          fs17.mkdirSync(reportDest, { recursive: true });
        }
      });
    });
    const runtimeConfigs = [
      ["node", nodeEntryPoints],
      ["web", webEntryPoints],
      // ["pure", pureEntryPoints],
      ["python", pythonEntryPoints],
      ["golang", golangEntryPoints]
    ];
    for (const [runtime, entryPoints] of runtimeConfigs) {
      if (Object.keys(entryPoints).length === 0)
        continue;
      let metafile;
      if (runtime === "python") {
        metafile = `./testeranto/metafiles/${runtime}/core.json`;
      } else {
        metafile = `./testeranto/metafiles/${runtime}/${this.projectName}.json`;
      }
      const metafileDir = metafile.split("/").slice(0, -1).join("/");
      if (!fs17.existsSync(metafileDir)) {
        fs17.mkdirSync(metafileDir, { recursive: true });
      }
      try {
        if (runtime === "python" && !fs17.existsSync(metafile)) {
          const entryPointList = Object.keys(entryPoints);
          if (entryPointList.length > 0) {
            const metafileData = await generatePitonoMetafile(
              this.projectName,
              entryPointList
            );
            writePitonoMetafile(this.projectName, metafileData);
          }
        }
        await pollForFile(metafile);
        let timeoutId;
        const watcher = watch(metafile, async (e, filename) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(async () => {
            console.log(
              ansiC5.yellow(ansiC5.inverse(`< ${e} ${filename} (${runtime})`))
            );
            try {
              console.log(
                ansiC5.blue(
                  `Metafile processed, checking queue for tests to run`
                )
              );
            } catch (error) {
              console.error(`Error processing metafile changes:`, error);
            }
          }, 300);
        });
        switch (runtime) {
          case "node":
            this.nodeMetafileWatcher = watcher;
            break;
          case "web":
            this.webMetafileWatcher = watcher;
            break;
          case "python":
            this.pitonoMetafileWatcher = watcher;
            break;
          case "golang":
            this.golangMetafileWatcher = watcher;
            break;
        }
      } catch (error) {
        console.error(`Error setting up watcher for ${runtime}:`, error);
      }
    }
  }
  async stop() {
    console.log(ansiC5.inverse("Testeranto-Run is shutting down gracefully..."));
    this.mode = "once";
    this.nodeMetafileWatcher.close();
    this.webMetafileWatcher.close();
    this.importMetafileWatcher.close();
    if (this.pitonoMetafileWatcher) {
      this.pitonoMetafileWatcher.close();
    }
    Object.values(this.logStreams || {}).forEach((logs2) => logs2.closeAll());
    if (this.wss) {
      this.wss.close(() => {
        console.log("WebSocket server closed");
      });
    }
    this.clients.forEach((client) => {
      client.terminate();
    });
    this.clients.clear();
    if (this.httpServer) {
      this.httpServer.close(() => {
        console.log("HTTP server closed");
      });
    }
    this.checkForShutdown();
  }
  // private ensureSummaryEntry(src: string, isSidecar = false) {
  //   ensureSummaryEntry(this.summary, src, isSidecar);
  //   return this.summary[src];
  // }
  async pythonLintCheck(entrypoint, addableFiles) {
    return pythonLintCheck(
      entrypoint,
      addableFiles,
      this.projectName,
      this.summary
    );
  }
  async pythonTypeCheck(entrypoint, addableFiles) {
    return pythonTypeCheck(
      entrypoint,
      addableFiles,
      this.projectName,
      this.summary
    );
  }
  getTscCheck() {
    if (!this.tscCheckInstance) {
      this.tscCheckInstance = new TscCheck(
        this.projectName,
        this.typeCheckIsRunning,
        this.typeCheckIsNowDone,
        this.addPromiseProcess.bind(this)
      );
    }
    return this.tscCheckInstance;
  }
  getEslintCheck() {
    if (!this.eslintCheckInstance) {
      this.eslintCheckInstance = new EslintCheck(
        this.projectName,
        this.lintIsRunning,
        this.lintIsNowDone,
        this.addPromiseProcess.bind(this),
        this.writeBigBoard.bind(this),
        this.checkForShutdown.bind(this)
      );
    }
    return this.eslintCheckInstance;
  }
  bddTestIsRunning(src) {
    this.summaryManager.bddTestIsRunning(src);
  }
};

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

// src/testeranto.ts
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
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
  try {
  } catch (e) {
    console.error("there was a problem");
    console.error(e);
  }
  const config = {
    ...bigConfig,
    buildDir: process.cwd() + "/testeranto/bundles/" + testsName
  };
  console.log(ansiC6.inverse("Press 'q' to initiate a graceful shutdown."));
  console.log(ansiC6.inverse("Press 'x' to quit forcefully."));
  console.log(ansiC6.inverse("Press 'q' to initiate a graceful shutdown."));
  console.log(ansiC6.inverse("Press 'x' to quit forcefully."));
  setupKeypressHandling();
  setupFileSystem(config, testsName);
  let pm = null;
  pm = new Server(config, testsName, mode);
  await pm.start();
  fs18.writeFileSync(`${process.cwd()}/testeranto/index.html`, AppHtml());
  if (!fs18.existsSync(`testeranto/reports/${testsName}`)) {
    fs18.mkdirSync(`testeranto/reports/${testsName}`);
  }
  fs18.writeFileSync(
    `testeranto/reports/${testsName}/config.json`,
    JSON.stringify(config, null, 2)
  );
  const getSecondaryEndpointsPoints = (runtime) => {
    return Object.keys(config[runtime].tests || {});
  };
  const webTests = [...getSecondaryEndpointsPoints("web")];
  for (const sourceFilePath of webTests) {
    const sourceFileSplit = sourceFilePath.split("/");
    const sourceDir = sourceFileSplit.slice(0, -1);
    const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
    const sourceFileNameMinusJs = sourceFileName.split(".").slice(0, -1).join(".");
    const htmlFilePath = path11.normalize(
      `${process.cwd()}/testeranto/bundles/web/${testsName}/${sourceDir.join(
        "/"
      )}/${sourceFileNameMinusJs}.html`
    );
    const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
    const cssFilePath = `./${sourceFileNameMinusJs}.css`;
    fs18.mkdirSync(path11.dirname(htmlFilePath), { recursive: true });
    fs18.writeFileSync(
      htmlFilePath,
      web_html_default(jsfilePath, htmlFilePath, cssFilePath)
    );
    console.log(`Generated HTML file: ${htmlFilePath}`);
  }
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
  } = getRunnables(config, testsName);
  console.log("Node entry points:", Object.keys(nodeEntryPoints));
  console.log("Web entry points:", Object.keys(webEntryPoints));
  const hasGolangTests = Object.keys(config.golang).length > 0;
  if (hasGolangTests) {
    const golingvuBuild = new GolingvuBuild(config, testsName);
    const golangEntryPoints2 = await golingvuBuild.build();
    golingvuBuild.onBundleChange(() => {
      Object.keys(golangEntryPoints2).forEach((entryPoint) => {
        if (pm) {
          pm.addToQueue(entryPoint, "golang");
        }
      });
    });
  }
  const hasPitonoTests = Object.keys(config.python).length > 0;
  if (hasPitonoTests) {
    const pitonoBuild = new PitonoBuild(config, testsName);
    const pitonoEntryPoints = await pitonoBuild.build();
    pitonoBuild.onBundleChange(() => {
      Object.keys(pitonoEntryPoints).forEach((entryPoint) => {
        if (pm) {
          pm.addToQueue(entryPoint, "python");
        }
      });
    });
  }
  [
    ["node", Object.keys(nodeEntryPoints)],
    ["web", Object.keys(webEntryPoints)],
    ["python", Object.keys(pythonEntryPoints)],
    ["golang", Object.keys(golangEntryPoints)]
  ].forEach(async ([runtime, keys]) => {
    keys.forEach(async (k) => {
      fs18.mkdirSync(
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
