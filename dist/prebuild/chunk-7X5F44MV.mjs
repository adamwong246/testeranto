import {
  buildService_exports,
  golangDockerFile,
  init_buildService,
  init_golangDocker,
  init_nodeDocker,
  init_pythonDocker,
  init_webDocker,
  nodeDockerFile,
  pythonDockerFile,
  webDockerFile
} from "./chunk-JQDRING4.mjs";
import {
  node_default
} from "./chunk-EH2APWUF.mjs";
import {
  web_default
} from "./chunk-4KMVPZBT.mjs";
import {
  GolingvuBuild
} from "./chunk-5YQS2HQH.mjs";
import {
  PitonoBuild,
  generatePitonoMetafile,
  writePitonoMetafile
} from "./chunk-W2DJ422C.mjs";
import {
  __toCommonJS
} from "./chunk-3X2YHN6Q.mjs";

// src/testeranto.ts
import ansiC6 from "ansi-colors";
import fs19 from "fs";
import path17 from "path";
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
import { default as ansiC5 } from "ansi-colors";
import fs16, { watch } from "fs";
import path14 from "path";

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
async function pollForFile(path18, timeout = 2e3) {
  const intervalObj = setInterval(function() {
    const file = path18;
    const fileExists = fs2.existsSync(file);
    if (fileExists) {
      clearInterval(intervalObj);
    }
  }, timeout);
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
var getRunnables = (config2, projectName) => {
  return {
    // pureEntryPoints: payload.pureEntryPoints || {},
    golangEntryPoints: Object.entries(config2.golang.tests).reduce((pt, cv) => {
      pt[cv[0]] = path2.resolve(cv[0]);
      return pt;
    }, {}),
    // golangEntryPointSidecars: payload.golangEntryPointSidecars || {},
    nodeEntryPoints: Object.entries(config2.node.tests).reduce((pt, cv) => {
      pt[cv[0]] = path2.resolve(
        `./testeranto/bundles/${projectName}/node/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
      return pt;
    }, {}),
    // nodeEntryPointSidecars: payload.nodeEntryPointSidecars || {},
    pythonEntryPoints: Object.entries(config2.python.tests).reduce((pt, cv) => {
      pt[cv[0]] = path2.resolve(cv[0]);
      return pt;
    }, {}),
    // pythonEntryPointSidecars: payload.pythonEntryPointSidecars || {},
    webEntryPoints: Object.entries(config2.web.tests).reduce((pt, cv) => {
      pt[cv[0]] = path2.resolve(
        `./testeranto/bundles/${projectName}/web/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
      return pt;
    }, {})
    // webEntryPointSidecars: payload.webEntryPointSidecars || {},
  };
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
    // Add monitoring support for build processes
    this.addBuildLogEntry = (processId, message2, level = "info") => {
      const prefix = `[${(/* @__PURE__ */ new Date()).toISOString()}] [build:${level}]`;
      console.log(`${prefix} ${message2}`);
      if (this.webSocketBroadcastMessage) {
        this.webSocketBroadcastMessage({
          type: "buildLog",
          processId,
          level,
          message: message2,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    };
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
    const baseConfig = configer(
      this.configs,
      entryPointKeys,
      this.projectName,
      this.configs.buildDir
    );
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

// src/server/serverClasees/ChildProcessHandler.ts
import ansiColors from "ansi-colors";
var ChildProcessHandler = class {
  static async handleChildProcess(child, logs2, reportDest, src, runtime) {
    if (!child || typeof child.on !== "function") {
      console.error(
        "ChildProcessHandler: child is not a valid ChildProcess object:",
        child
      );
      if (logs2 && typeof logs2.writeExitCode === "function") {
        logs2.writeExitCode(-1, new Error("Invalid child process"));
      } else {
        console.error(
          "ChildProcessHandler: logs.writeExitCode is not a function"
        );
      }
      if (logs2 && typeof logs2.closeAll === "function") {
        logs2.closeAll();
      }
      throw new Error(`Invalid child process for ${src || "undefined source"}`);
    }
    return new Promise((resolve, reject) => {
      child.stdout?.on("data", (data) => {
        if (logs2.stdout && typeof logs2.stdout.write === "function") {
          logs2.stdout.write(data);
        }
      });
      child.stderr?.on("data", (data) => {
        if (logs2.stderr && typeof logs2.stderr.write === "function") {
          logs2.stderr.write(data);
        }
      });
      child.on("close", (code) => {
        const exitCode = code === null ? -1 : code;
        if (exitCode < 0) {
          if (logs2 && typeof logs2.writeExitCode === "function") {
            logs2.writeExitCode(
              exitCode,
              new Error("Process crashed or was terminated")
            );
          } else {
            console.error(
              "ChildProcessHandler: logs.writeExitCode is not a function"
            );
          }
        } else {
          if (logs2 && typeof logs2.writeExitCode === "function") {
            logs2.writeExitCode(exitCode);
          }
        }
        if (logs2 && typeof logs2.closeAll === "function") {
          logs2.closeAll();
        }
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

// src/server/serverClasees/GolangLauncher.ts
import { spawn } from "child_process";
import fs5 from "fs";
import path4 from "path";

// src/server/aider/generatePromptFiles.ts
import fs3 from "fs";

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
    if (!fs3.existsSync(reportDest)) {
      fs3.mkdirSync(reportDest, { recursive: true });
    }
    const messagePath = `${reportDest}/message.txt`;
    const messageContent = message();
    fs3.writeFileSync(messagePath, messageContent);
    const promptPath = `${reportDest}/prompt.txt`;
    fs3.writeFileSync(promptPath, promptContent(reportDest));
  } catch (error) {
    console.error(`Failed to generate prompt files for ${src}:`, error);
  }
};

// src/server/runtimes/golang/processGoTestOutput.ts
import fs4 from "fs";
import path3 from "path";
var processGoTestOutput = (reportDest, src) => {
  const testsJsonPath = `${reportDest}/tests.json`;
  const stdoutPath = `${reportDest}/stdout.log`;
  if (fs4.existsSync(stdoutPath)) {
    try {
      const stdoutContent = fs4.readFileSync(stdoutPath, "utf-8");
      const lines = stdoutContent.split("\n").filter((line) => line.trim());
      const testResults = {
        tests: [],
        features: [],
        givens: [],
        fullPath: path3.resolve(process.cwd(), src)
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
      fs4.writeFileSync(testsJsonPath, JSON.stringify(testResults, null, 2));
      return;
    } catch (error) {
      console.error("Error processing go test output:", error);
    }
  }
};

// src/server/serverClasees/GolangLauncher.ts
var GolangLauncher = class {
  constructor(projectName, httpPort, setupTestEnvironment, handleChildProcess, cleanupPorts, bddTestIsRunning, bddTestIsNowDone, addPromiseProcess, checkQueue) {
    this.projectName = projectName;
    this.httpPort = httpPort;
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
    const portToUse = this.httpPort || 3456;
    console.log(`GolangLauncher: Using httpPort ${portToUse}`);
    const processId = `golang-${src}-${Date.now()}`;
    const command = `golang test: ${src}`;
    const golangPromise = (async () => {
      try {
        const { reportDest, testResources, portsToUse } = await this.setupTestEnvironment(src, "golang");
        const logs2 = createLogStreams(reportDest, "golang");
        let currentDir = path4.dirname(src);
        let goModDir = null;
        while (currentDir !== path4.parse(currentDir).root) {
          if (fs5.existsSync(path4.join(currentDir, "go.mod"))) {
            goModDir = currentDir;
            break;
          }
          currentDir = path4.dirname(currentDir);
        }
        if (!goModDir) {
          console.error(`Could not find go.mod file for test ${src}`);
          goModDir = path4.dirname(src);
          console.error(`Falling back to: ${goModDir}`);
        }
        const relativeTestPath = path4.relative(goModDir, src);
        const child = spawn(
          "go",
          ["test", "-v", "-json", "./" + path4.dirname(relativeTestPath)],
          {
            stdio: ["pipe", "pipe", "pipe"],
            env: {
              ...process.env,
              TEST_RESOURCES: testResources,
              WS_PORT: portToUse.toString(),
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
    if (!golangPromise) {
      console.error("GolangLauncher: golangPromise is undefined for", src);
      throw new Error(`golangPromise is undefined for ${src}`);
    }
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

// src/server/serverClasees/NodeLauncher.ts
import ansiColors2 from "ansi-colors";
import { spawn as spawn2, spawnSync } from "child_process";
import fs6 from "fs";
import path5 from "path";
var NodeLauncher = class {
  constructor(httpPort, setupTestEnvironment, cleanupPorts, handleChildProcess, bddTestIsRunning, bddTestIsNowDone, addPromiseProcess, checkQueue) {
    this.httpPort = httpPort;
    this.setupTestEnvironment = setupTestEnvironment;
    this.cleanupPorts = cleanupPorts;
    this.handleChildProcess = handleChildProcess;
    this.bddTestIsRunning = bddTestIsRunning;
    this.bddTestIsNowDone = bddTestIsNowDone;
    this.addPromiseProcess = addPromiseProcess;
    this.checkQueue = checkQueue;
  }
  async launchNode(src, dest) {
    console.log(ansiColors2.green(ansiColors2.inverse(`node < ${src}`)));
    console.log(
      ansiColors2.green(
        `[STRATEGY] Node.js uses "combined-build-test-process-pools" strategy`
      )
    );
    console.log(
      ansiColors2.green(
        `[STRATEGY] Tests will run inside node-build container via docker exec (aligned with architecture)`
      )
    );
    const portToUse = this.httpPort || 3456;
    console.log(`NodeLauncher: Using httpPort ${portToUse} for test execution`);
    const processId = `node-${src}-${Date.now()}`;
    const command = `node test: ${src}`;
    const nodePromise = (async () => {
      try {
        this.bddTestIsRunning(src);
        if (typeof this.setupTestEnvironment !== "function") {
          throw new Error(
            `NodeLauncher: setupTestEnvironment is not a function. It is ${typeof this.setupTestEnvironment}. Check ServerTestExecutor setup.`
          );
        }
        const setupResult = await this.setupTestEnvironment(src, "node");
        const { reportDest, testResources, portsToUse } = setupResult;
        console.log("setupResult portsToUse:", portsToUse);
        const builtfile = dest;
        const logs2 = createLogStreams(reportDest, "node");
        console.log(`NodeLauncher: Waiting for bundle at ${builtfile}`);
        console.log(`Current working directory: ${process.cwd()}`);
        if (fs6.existsSync(builtfile)) {
          console.log(`Bundle file exists immediately at ${builtfile}`);
        } else {
          console.log(`Bundle file does not exist yet at ${builtfile}`);
          const dir = path5.dirname(builtfile);
          if (fs6.existsSync(dir)) {
            console.log(`Directory ${dir} exists, contents:`);
            try {
              const files2 = fs6.readdirSync(dir);
              files2.forEach((file) => {
                console.log(`  ${file}`);
              });
            } catch (e) {
              console.log(`Could not read directory ${dir}: ${e.message}`);
            }
          } else {
            console.log(`Directory ${dir} does not exist`);
          }
        }
        const maxBundleRetries = 30;
        let bundleRetryCount = 0;
        while (!fs6.existsSync(builtfile) && bundleRetryCount < maxBundleRetries) {
          console.log(
            `Bundle not ready yet (attempt ${bundleRetryCount + 1}/${maxBundleRetries}) at path: ${builtfile}`
          );
          bundleRetryCount++;
          await new Promise((resolve) => setTimeout(resolve, 1e3));
        }
        if (!fs6.existsSync(builtfile)) {
          const dir = path5.dirname(builtfile);
          if (fs6.existsSync(dir)) {
            const files2 = fs6.readdirSync(dir);
            const mjsFiles = files2.filter((f) => f.endsWith(".mjs"));
            console.log(`Found .mjs files in ${dir}:`, mjsFiles);
            if (mjsFiles.length > 0) {
              const alternativePath = path5.join(dir, mjsFiles[0]);
              console.log(`Trying alternative path: ${alternativePath}`);
              if (fs6.existsSync(alternativePath)) {
                console.log(
                  `Using alternative bundle file: ${alternativePath}`
                );
                throw new Error(
                  `Expected bundle file ${builtfile} does not exist, but found ${alternativePath}. This suggests a path mismatch between build and launch configurations.`
                );
              }
            }
          }
          throw new Error(
            `Bundle file ${builtfile} does not exist after waiting. Current directory: ${process.cwd()}. Make sure the build process is creating the correct bundle.`
          );
        }
        console.log(`Build is ready at ${builtfile}. Proceeding with test...`);
        const { prepareTestResources, escapeForShell } = await import("./TestResourceUtils-FD6QQPHQ.mjs");
        const testResourcesJson = prepareTestResources(
          testResources,
          portsToUse,
          src,
          reportDest
        );
        const portToUse2 = this.httpPort || 3456;
        console.log("launchNode", [
          builtfile,
          portToUse2.toString(),
          testResourcesJson
        ]);
        console.log(
          `Full command: node ${builtfile} ${portToUse2} ${testResourcesJson.substring(
            0,
            100
          )}...`
        );
        try {
          const parsedTestResources = JSON.parse(testResourcesJson);
          console.log("Test resources ports:", parsedTestResources.ports);
        } catch (e) {
          console.log("Could not parse testResourcesJson:", e.message);
        }
        try {
          const stats = fs6.statSync(builtfile);
          console.log(`Bundle file size: ${stats.size} bytes`);
        } catch (e) {
          console.error(`Cannot access bundle file ${builtfile}:`, e.message);
          throw new Error(
            `Bundle file ${builtfile} is not accessible: ${e.message}`
          );
        }
        console.log(
          "NodeLauncher: Node.js uses 'combined-build-test-process-pools' strategy"
        );
        console.log(
          "NodeLauncher: Running tests via docker exec into node-build container"
        );
        const containerCheck = spawnSync("docker", [
          "ps",
          "--format",
          "{{.Names}}"
        ]);
        const allContainers = containerCheck.stdout.toString().trim().split("\n");
        const nodeBuildContainers = allContainers.filter(
          (name) => name.includes("node") && name.includes("build")
        );
        if (nodeBuildContainers.length === 0) {
          console.error("NodeLauncher: No node-build container found!");
          console.error(
            "NodeLauncher: Docker ps output:",
            containerCheck.stdout.toString()
          );
          console.error(
            "NodeLauncher: Docker ps error:",
            containerCheck.stderr.toString()
          );
          throw new Error(
            `NodeLauncher: No node-build container found. Node.js uses "combined-build-test-process-pools" strategy which requires tests to run in the build container. Make sure docker-compose services are running. Check with: docker-compose -f testeranto/bundles/*-docker-compose.yml ps`
          );
        }
        const containerName = nodeBuildContainers[0];
        console.log(`NodeLauncher: Found container: ${containerName}`);
        const containerBuiltfile = builtfile.replace(
          process.cwd(),
          "/workspace"
        );
        const escapedTestResources = testResourcesJson.replace(/'/g, `'"'"'`);
        const dockerCommand = [
          "docker",
          "exec",
          "-i",
          "-e",
          `WS_HOST=host.docker.internal`,
          "-e",
          `WS_PORT=${portToUse2}`,
          containerName,
          "sh",
          "-c",
          `cd /workspace && node ${containerBuiltfile} ${portToUse2} '${escapedTestResources}'`
        ];
        console.log("NodeLauncher: Running command:", dockerCommand.join(" "));
        const child = spawn2(dockerCommand[0], dockerCommand.slice(1), {
          stdio: ["pipe", "pipe", "pipe"]
        });
        child.stdout.on("data", (data) => {
          const output = data.toString();
          console.log(`NodeLauncher [docker exec stdout]: ${output}`);
          logs2.stdout?.write(data);
        });
        child.stderr.on("data", (data) => {
          const output = data.toString();
          console.log(`NodeLauncher [docker exec stderr]: ${output}`);
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
        throw error;
      }
    })();
    console.log(`NodeLauncher: Adding node test process for ${src}`);
    this.addPromiseProcess(
      processId,
      nodePromise,
      command,
      "bdd-test",
      src,
      "node",
      () => {
        console.log(`NodeLauncher: Node test completed successfully: ${src}`);
        setTimeout(() => this.checkQueue(), 100);
      },
      () => {
        console.error(`NodeLauncher: Node test failed or rejected: ${src}`);
        setTimeout(() => this.checkQueue(), 100);
      }
    );
  }
};

// src/server/serverClasees/PythonLauncher.ts
import { spawn as spawn3 } from "child_process";
var PythonLauncher = class {
  constructor(projectName, httpPort, setupTestEnvironment, handleChildProcess, cleanupPorts, bddTestIsRunning, bddTestIsNowDone, addPromiseProcess, checkQueue) {
    this.projectName = projectName;
    this.httpPort = httpPort;
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
    const portToUse = this.httpPort || 3456;
    console.log(`PythonLauncher: Using httpPort ${portToUse}`);
    const processId = `python-${src}-${Date.now()}`;
    const command = `python test: ${src}`;
    const pythonPromise = (async () => {
      try {
        const { reportDest, testResources, portsToUse } = await this.setupTestEnvironment(src, "python");
        const logs2 = createLogStreams(reportDest, "python");
        if (!logs2 || typeof logs2.writeExitCode !== "function") {
          console.error(
            "PythonLauncher: logs object is invalid or missing writeExitCode method"
          );
          throw new Error(`Failed to create logs for ${src}`);
        }
        console.log("mark12", src, testResources);
        const { prepareTestResources, escapeForShell } = await import("./TestResourceUtils-FD6QQPHQ.mjs");
        const testResourcesJson = prepareTestResources(
          testResources,
          portsToUse,
          src,
          reportDest
        );
        console.log("PythonLauncher: testResourcesJson:", testResourcesJson);
        const escapedTestResources = escapeForShell(testResourcesJson);
        const dockerImage = "python:3.11-alpine";
        const dockerCommand = [
          "docker",
          "run",
          "--rm",
          "-v",
          `${process.cwd()}:/workspace`,
          "-w",
          "/workspace",
          "--network",
          "host",
          // Use host network to access WebSocket on localhost
          "-e",
          `WS_PORT=${portToUse}`,
          dockerImage,
          "sh",
          "-c",
          `pip install websockets>=12.0 > /dev/null 2>&1 && python3 ${escapeForShell(
            src
          )} ${escapedTestResources} "${portToUse}"`
        ];
        console.log("PythonLauncher: dockerCommand:", dockerCommand);
        let child;
        try {
          child = spawn3(dockerCommand[0], dockerCommand.slice(1), {
            stdio: ["pipe", "pipe", "pipe"]
          });
          console.log("PythonLauncher: child process created:", child?.pid);
        } catch (spawnError) {
          console.error("PythonLauncher: spawn failed:", spawnError);
          throw spawnError;
        }
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
    if (!pythonPromise) {
      console.error("PythonLauncher: pythonPromise is undefined for", src);
      throw new Error(`pythonPromise is undefined for ${src}`);
    }
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

// src/server/serverClasees/ServerTaskCoordinator.ts
import { default as ansiC3 } from "ansi-colors";

// src/server/serverClasees/ServerTaskManager.ts
import fs13 from "fs";

// src/server/serverClasees/Server_DockerCompose.ts
import yaml from "js-yaml";
import {
  down,
  logs,
  ps,
  upAll,
  upOne
} from "docker-compose";
import fs12 from "fs";
import path12 from "path";

// src/server/docker/buildServiceGenerator.ts
function createBuildService(runtime, dockerfileDir, testsName2) {
  const buildService = (init_buildService(), __toCommonJS(buildService_exports)).default;
  return {
    [`${runtime}-build`]: buildService(runtime)
  };
}

// src/server/serverClasees/Server_DockerCompose.ts
init_nodeDocker();
init_webDocker();
init_pythonDocker();

// src/server/serverClasees/Server_TCP_Commands.ts
import fs11 from "fs";
import path11 from "path";

// src/server/serverClasees/Server_TCP_utils.ts
import path7 from "path";

// src/server/serverClasees/Server_TCP_constants.ts
import path6 from "path";
var SERVER_CONSTANTS = {
  HOST: "0.0.0.0"
};
var WEB_TEST_FILES_PATH = {
  NEW_PREFIX: "/web/",
  NEW_PREFIX_REGEX: /^\/web\//,
  OLD_PREFIX: "/bundles/web/",
  BASE_DIR: path6.join("testeranto", "bundles", "allTests", "web")
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
import fs10 from "fs";

// src/server/serverClasees/getAllFilesRecursively.ts
import fs7 from "fs";
import path8 from "path";
async function getAllFilesRecursively(directoryPath) {
  let fileList = [];
  const files2 = await fs7.readdirSync(directoryPath, { withFileTypes: true });
  for (const file of files2) {
    const fullPath = path8.join(directoryPath, file.name);
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
import fs9 from "fs";
import path10 from "path";

// src/server/serverClasees/Server_TCP_Core.ts
import http from "http";
import { WebSocketServer } from "ws";

// src/server/serverClasees/Server_Base.ts
import fs8 from "fs";
import path9 from "path";
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
    const dir = path9.dirname(p);
    fs8.mkdirSync(dir, {
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
    const dir = path9.dirname(p);
    fs8.mkdirSync(dir, {
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
    return fs8.existsSync(destFolder);
  }
  async mkdirSync(fp) {
    if (!fs8.existsSync(fp)) {
      return fs8.mkdirSync(fp, {
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
      fs8.mkdirSync(path9.dirname(filepath), {
        recursive: true
      });
      if (!files[testName]) {
        files[testName] = /* @__PURE__ */ new Set();
      }
      files[testName].add(filepath);
      await fs8.writeFileSync(filepath, contents);
      res(true);
    });
  }
  async createWriteStream(filepath, testName) {
    const folder = filepath.split("/").slice(0, -1).join("/");
    return new Promise((res) => {
      if (!fs8.existsSync(folder)) {
        return fs8.mkdirSync(folder, {
          recursive: true
        });
      }
      const f = fs8.createWriteStream(filepath);
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
          const cleanPath = path9.resolve(fPath);
          fPaths.push(cleanPath.replace(process.cwd(), ``));
          const targetDir = cleanPath.split("/").slice(0, -1).join("/");
          fs8.mkdir(targetDir, { recursive: true }, async (error) => {
            if (error) {
            }
            fs8.writeFileSync(
              path9.resolve(
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
              fs8.writeFileSync(fPath, value, "binary");
              res();
            } else if (`string` === typeof value) {
              fs8.writeFileSync(fPath, value.toString(), {
                encoding: "utf-8"
              });
              res();
            } else {
              const pipeStream = value;
              const myFile = fs8.createWriteStream(fPath);
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
    const normalizedPath = path10.normalize(relativePath);
    if (normalizedPath.includes("..")) {
      res.writeHead(403);
      res.end("Forbidden: Directory traversal not allowed");
      return;
    }
    const projectRoot = process.cwd();
    const filePath = path10.join(projectRoot, normalizedPath);
    if (!filePath.startsWith(path10.resolve(projectRoot))) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    fs9.stat(filePath, (err, stats) => {
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
        fs9.readdir(filePath, (readErr, files2) => {
          if (readErr) {
            res.writeHead(500);
            res.end(`Server Error: ${readErr.message}`);
            return;
          }
          const items = files2.map((file) => {
            try {
              const stat = fs9.statSync(path10.join(filePath, file));
              const isDir = stat.isDirectory();
              const slash = isDir ? "/" : "";
              return `<li><a href="${path10.join(
                urlPath,
                file
              )}${slash}">${file}${slash}</a></li>`;
            } catch {
              return `<li><a href="${path10.join(
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
    fs9.readFile(filePath, (err, data) => {
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
      const message2 = JSON.stringify({
        type: "logs",
        processId,
        logs: [logEntry],
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      subscriptions.forEach((client) => {
        if (client.readyState === WebSocket2.OPEN) {
          client.send(message2);
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
        const message2 = data.toString().trim();
        if (message2) {
          this.addProcessLog(processId, "info", message2, "stdout");
        }
      });
    } else {
      console.warn(`Child process ${processId} has no stdout or stdout.on`);
    }
    if (childProcess.stderr && typeof childProcess.stderr.on === "function") {
      console.log(`Process ${processId} has stderr`);
      childProcess.stderr.on("data", (data) => {
        const message2 = data.toString().trim();
        if (message2) {
          this.addProcessLog(processId, "error", message2, "stderr");
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
  addProcessLog(processId, level, message2, source) {
    if (!this.processLogs) {
      console.error("processLogs not initialized");
      return;
    }
    const logEntry = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      level,
      message: message2,
      source: source || "process"
    };
    console.log(`[LOG] ${processId} ${level}: ${message2} (${source})`);
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
    fs10.writeFileSync(wsm.data.path, wsm.data.content);
  }
  readFile_receive(wsm, ws) {
    this.readFile_send(wsm, ws, fs10.readFileSync(wsm.data.path).toString());
  }
  readFile_send(wsm, ws, content) {
    ws.send(JSON.stringify(["readFile", wsm.data.path, content]));
  }
  createDirectory_receive(wsm, ws) {
    fs10.mkdirSync(wsm.data.path);
    this.createDirectory_send(wsm, ws);
  }
  createDirectory_send(wsm, ws) {
    ws.send(JSON.stringify(["createDirectory", wsm.data.path]));
  }
  deleteFile_receive(wsm, ws) {
    fs10.unlinkSync(wsm.data.path);
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
      JSON.parse(fs10.readFileSync("./testeranto/projects.json", "utf-8"))
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
    if (!path11.isAbsolute(filepath)) {
      resolvedPath = path11.join(process.cwd(), filepath);
      console.log("Resolved relative path to:", resolvedPath);
    }
    const dir = path11.dirname(resolvedPath);
    if (!fs11.existsSync(dir)) {
      console.log("Creating directory:", dir);
      fs11.mkdirSync(dir, { recursive: true });
    }
    console.log("Writing file:", resolvedPath);
    try {
      fs11.writeFileSync(resolvedPath, contents);
      console.log("File written successfully to", resolvedPath);
      return true;
    } catch (error) {
      console.error("Error writing file:", error);
      return false;
    }
  }
  existsSync(filepath) {
    return fs11.existsSync(filepath);
  }
  mkdirSync(filepath) {
    fs11.mkdirSync(filepath, { recursive: true });
  }
  readFile(filepath) {
    const fullPath = path11.join(process.cwd(), filepath);
    return fs11.readFileSync(fullPath, "utf-8");
  }
  createWriteStream(filepath, testName) {
    const dir = path11.dirname(filepath);
    if (!fs11.existsSync(dir)) {
      fs11.mkdirSync(dir, { recursive: true });
    }
    const stream = fs11.createWriteStream(filepath);
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
init_golangDocker();
var Server_DockerCompose = class extends Server_TCP_Commands {
  constructor(cwd, configs, name, mode2) {
    super(configs, name, mode2);
    this.cwd = cwd;
    this.config = path12.join(
      "testeranto",
      "bundles",
      `${this.projectName}-docker-compose.yml`
    );
    this.composeDir = process.cwd();
    this.composeFile = path12.join(
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
    const { setupDockerCompose } = await import("./dockerComposeGenerator-KNUZUQTY.mjs");
    await setupDockerCompose(this.configs, this.projectName, {
      logger: {
        log: (...args) => console.log(...args),
        error: (...args) => console.error(...args)
      }
    });
    await this.startServices();
  }
  async startServices() {
    if (!fs12.existsSync(this.composeFile)) {
      console.error(`Docker-compose file not found: ${this.composeFile}`);
      console.error(`Current directory: ${process.cwd()}`);
      const bundlesDir = path12.join(process.cwd(), "testeranto", "bundles");
      if (fs12.existsSync(bundlesDir)) {
        console.error(`Contents of ${bundlesDir}:`);
        try {
          const files2 = fs12.readdirSync(bundlesDir);
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
  setupDockerfileForBuild(runtime, testsName2) {
    let dockerfileContent;
    if (runtime === "node") {
      dockerfileContent = nodeDockerFile(runtime);
    } else if (runtime === "web") {
      dockerfileContent = webDockerFile(runtime);
    } else if (runtime === "python") {
      dockerfileContent = pythonDockerFile(runtime);
    } else if (runtime === "golang") {
      dockerfileContent = golangDockerFile(runtime);
    } else {
      throw new Error(
        `Unsupported runtime for build Dockerfile generation: ${runtime}`
      );
    }
    const dockerfileName = `${runtime}.Dockerfile`;
    const dockerfileDir = path12.join(
      "testeranto",
      "bundles",
      testsName2,
      runtime
    );
    const dockerfilePath = path12.join(dockerfileDir, dockerfileName);
    const normalizedDir = path12.normalize(dockerfileDir);
    if (!normalizedDir.startsWith(path12.join("testeranto", "bundles"))) {
      throw new Error(
        `Invalid Dockerfile directory: ${dockerfileDir}. Must be under testeranto/bundles/`
      );
    }
    const fullDockerfileDir = path12.join(process.cwd(), dockerfileDir);
    fs12.mkdirSync(fullDockerfileDir, { recursive: true });
    const fullDockerfilePath = path12.join(process.cwd(), dockerfilePath);
    fs12.writeFileSync(fullDockerfilePath, yaml.dump(dockerfileContent));
    return dockerfileDir;
  }
  generateBuildServiceForRuntime(c, runtime, testsName2) {
    const buildDockerfileDir = this.setupDockerfileForBuild(
      runtime,
      testsName2
      // logger
    );
    return createBuildService(runtime, buildDockerfileDir, testsName2);
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
    this.addLogEntry = (processId, source, message2, timestamp = /* @__PURE__ */ new Date()) => {
      if (!this.processLogs.has(processId)) {
        this.processLogs.set(processId, []);
      }
      const logEntry = `[${timestamp.toISOString()}] [${source}] ${message2}`;
      this.processLogs.get(processId).push(logEntry);
      if (this.webSocketBroadcastMessage) {
        this.webSocketBroadcastMessage({
          type: "logUpdate",
          processId,
          source,
          message: message2,
          timestamp: timestamp.toISOString()
        });
      }
      if (this.webSocketBroadcastMessage) {
        this.webSocketBroadcastMessage({
          type: "monitoringLog",
          processId,
          source,
          message: message2,
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
            message: message2,
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
      const message2 = status === "completed" ? `Web test completed: ${webProcess?.testName || processId}` : `Web test failed: ${webProcess?.testName || processId} - ${error || "Unknown error"}`;
      this.addLogEntry(
        processId,
        status === "completed" ? "stdout" : "stderr",
        message2
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
  webSocketBroadcastMessage(message2) {
    const data = typeof message2 === "string" ? message2 : JSON.stringify(message2);
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
      fs13.writeFileSync(summaryPath, summaryData);
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
            ansiC3.blue(
              ansiC3.inverse(`Processing ${testName} (${runtime}) from queue`)
            )
          );
          try {
            await this.processQueueItem(testName, runtime, addableFiles);
          } catch (error) {
            console.error(
              ansiC3.red(`Error executing test ${testName} (${runtime}): ${error}`)
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
        ansiC3.inverse(
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
      this.writeBigBoard();
      if (!inflight) {
        const hasRunningProcesses = Array.from(this.allProcesses.values()).some(
          (process2) => process2.status === "running"
        );
        const isQueueEmpty = this.queueLength === 0;
        if (!hasRunningProcesses && isQueueEmpty) {
          console.log(
            ansiC3.inverse(`${this.projectName} has been tested. Goodbye.`)
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
        ansiC3.green(
          ansiC3.inverse(`Added ${src} (${runtime}) to the processing queue`)
        )
      );
      checkQueue();
    } else {
      console.log(
        ansiC3.yellow(
          ansiC3.inverse(
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

// src/server/serverClasees/TestEnvironmentSetup.ts
import fs14 from "fs";
import ansiColors3 from "ansi-colors";
var TestEnvironmentSetup = class {
  constructor(ports, projectName, browser, queue) {
    this.ports = ports;
    this.projectName = projectName;
    this.browser = browser;
    this.queue = queue;
  }
  async setupTestEnvironment(src, runtime) {
    const reportDest = `testeranto/reports/${this.projectName}/${src.split(".").slice(0, -1).join(".")}/${runtime}`;
    if (!fs14.existsSync(reportDest)) {
      fs14.mkdirSync(reportDest, { recursive: true });
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
          ansiColors3.red(
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
import ansiColors4 from "ansi-colors";
var TypeCheckNotifier = class {
  constructor(summary, writeBigBoard, checkForShutdown) {
    this.summary = summary;
    this.writeBigBoard = writeBigBoard;
    this.checkForShutdown = checkForShutdown;
  }
  typeCheckIsNowDone(src, failures) {
    if (failures === 0) {
      console.log(ansiColors4.green(ansiColors4.inverse(`tsc > ${src}`)));
    } else {
      console.log(
        ansiColors4.red(
          ansiColors4.inverse(`tsc > ${src} failed ${failures} times`)
        )
      );
    }
    this.summary[src].typeErrors = failures;
    this.writeBigBoard();
    this.checkForShutdown();
  }
  typeCheckIsRunning(src) {
  }
};

// src/server/serverClasees/WebLauncher.ts
import ansiColors5 from "ansi-colors";
import fs15 from "fs";
import path13 from "path";
var WebLauncher = class {
  constructor(projectName, httpPort, chromiumPort, bddTestIsRunning, bddTestIsNowDone, addPromiseProcess, checkQueue) {
    this.projectName = projectName;
    this.httpPort = httpPort;
    this.chromiumPort = chromiumPort;
    this.bddTestIsRunning = bddTestIsRunning;
    this.bddTestIsNowDone = bddTestIsNowDone;
    this.addPromiseProcess = addPromiseProcess;
    this.checkQueue = checkQueue;
  }
  async launchWeb(src, dest) {
    console.log(ansiColors5.green(ansiColors5.inverse(`web < ${src}`)));
    const processId = `web-${src}-${Date.now()}`;
    const command = `web test: ${src}`;
    const webPromise = (async () => {
      let browser = null;
      try {
        this.bddTestIsRunning(src);
        const reportDest = `testeranto/reports/${this.projectName}/${src.split(".").slice(0, -1).join(".")}/web`;
        if (!fs15.existsSync(reportDest)) {
          fs15.mkdirSync(reportDest, { recursive: true });
        }
        const destFolder = dest.replace(".mjs", "");
        const htmlPath = `${destFolder}.html`;
        const inDocker = process.env.IN_DOCKER === "true";
        const chromeHost = inDocker ? "chromium" : process.env.CHROME_HOST || "host.docker.internal";
        const chromePort = process.env.CHROME_PORT || (this.chromiumPort ? this.chromiumPort.toString() : "4567");
        console.log(
          `Connecting to Chrome at ${chromeHost}:${chromePort} (IN_DOCKER=${inDocker})`
        );
        const puppeteer = await import("puppeteer-core");
        const endpoints = [
          `ws://${chromeHost}:${chromePort}/devtools/browser`,
          `ws://${chromeHost}:${chromePort}/json/version`,
          `ws://${chromeHost}:${chromePort}/`
        ];
        const maxRetries = 10;
        let lastError;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          for (const endpoint of endpoints) {
            try {
              console.log(
                `Attempt ${attempt}/${maxRetries}: Trying to connect to Chrome at ${endpoint}`
              );
              browser = await puppeteer.connect({
                browserWSEndpoint: endpoint,
                defaultViewport: null
              });
              console.log("Connected to Chrome via WebSocket at", endpoint);
              break;
            } catch (error) {
              lastError = error;
              console.log(
                `Attempt ${attempt} failed for ${endpoint}:`,
                error.message
              );
              if (error.message.includes("ENOTFOUND") || error.message.includes("getaddrinfo")) {
                const delay = 2e3 * attempt;
                console.log(
                  `DNS resolution failed, waiting ${delay}ms before next attempt...`
                );
                await new Promise((resolve) => setTimeout(resolve, delay));
                break;
              }
            }
          }
          if (browser)
            break;
        }
        if (!browser) {
          console.error(
            `Failed to connect to Chrome after ${maxRetries} attempts`
          );
          console.error(
            `Make sure the chromium service is running and healthy at ${chromeHost}:${chromePort}`
          );
          console.error(`Last error:`, lastError?.message);
          throw new Error(
            `Failed to connect to Chrome. Check that the chromium service is running and the network is configured correctly.`
          );
        }
        const browserWSEndpoint = browser.wsEndpoint();
        const webArgz = JSON.stringify({
          name: src,
          ports: [],
          fs: reportDest,
          browserWSEndpoint
        });
        const logs2 = createLogStreams(reportDest, "web");
        const httpPort = Number(process.env.HTTP_PORT) || (this.httpPort ? this.httpPort : 3456);
        const serverHost = inDocker ? "host.docker.internal" : process.env.SERVER_HOST || "localhost";
        console.log(
          `Using Server_TCP host: ${serverHost}:${httpPort} (IN_DOCKER=${inDocker})`
        );
        let relativePath;
        const match = htmlPath.match(
          /testeranto\/bundles\/allTests\/web\/(.*)/
        );
        if (match) {
          relativePath = match[1];
        } else {
          const absMatch = htmlPath.match(/\/bundles\/allTests\/web\/(.*)/);
          if (absMatch) {
            relativePath = absMatch[1];
          } else {
            const oldMatch = htmlPath.match(/bundles\/web\/(.*)/);
            if (oldMatch) {
              relativePath = oldMatch[1];
            } else {
              relativePath = path13.basename(htmlPath);
            }
          }
        }
        const encodedConfig = encodeURIComponent(webArgz);
        const url = `http://${serverHost}:${httpPort}/web/${relativePath}?config=${encodedConfig}`;
        console.log(
          `Navigating to ${url} (HTML file exists: ${fs15.existsSync(htmlPath)})`
        );
        const page = await browser.newPage();
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
            ansiColors5.red(
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
        const jsMatch = dest.match(/testeranto\/bundles\/allTests\/web\/(.*)/);
        if (jsMatch) {
          jsRelativePath = jsMatch[1];
        } else {
          const jsAbsMatch = dest.match(/\/bundles\/allTests\/web\/(.*)/);
          if (jsAbsMatch) {
            jsRelativePath = jsAbsMatch[1];
          } else {
            const oldMatch = dest.match(/bundles\/web\/(.*)/);
            if (oldMatch) {
              jsRelativePath = oldMatch[1];
            } else {
              jsRelativePath = path13.basename(dest);
            }
          }
        }
        const jsUrl = `/web/${jsRelativePath}?cacheBust=${Date.now()}`;
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
        await browser.disconnect();
        close();
      } catch (error) {
        console.error(`Error in web test ${src}:`, error);
        try {
          if (browser) {
            await browser.disconnect();
          }
        } catch (disconnectError) {
        }
        this.bddTestIsNowDone(src, -1);
        throw error;
      }
    })();
    if (!webPromise) {
      console.error("WebLauncher: webPromise is undefined for", src);
      throw new Error(`webPromise is undefined for ${src}`);
    }
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

// src/server/serverClasees/ServerTestExecutor.ts
var ServerTestExecutor = class extends ServerTaskCoordinator {
  constructor(configs, testName, mode2) {
    super(configs, testName, mode2);
    this.currentBuildResolve = null;
    this.currentBuildReject = null;
    this.configTests = () => {
      return configTests_default(this.configs);
    };
    this.launchNode = async (src, dest) => {
      console.log(`[launchNode] Starting node test: ${src}, dest: ${dest}`);
      console.log(`[launchNode] this.httpPort is ${this.httpPort}`);
      const httpPort = this.httpPort || 3456;
      console.log(`[launchNode] Using httpPort ${httpPort}`);
      const nodeLauncher = new NodeLauncher(
        httpPort,
        this.setupTestEnvironment.bind(this),
        this.cleanupPorts.bind(this),
        this.handleChildProcess.bind(this),
        this.bddTestIsRunning.bind(this),
        this.bddTestIsNowDone.bind(this),
        this.addPromiseProcess,
        this.checkQueue.bind(this)
      );
      console.log(`[launchNode] NodeLauncher created, calling launchNode method`);
      const result = await nodeLauncher.launchNode(src, dest);
      console.log(`[launchNode] Node test completed: ${src}`);
      return result;
    };
    this.launchWeb = async (src, dest) => {
      const httpPort = this.httpPort || 3456;
      const chromiumPort = this.chromiumPort || 4567;
      const webLauncher = new WebLauncher(
        this.projectName,
        httpPort,
        chromiumPort,
        this.bddTestIsRunning.bind(this),
        this.bddTestIsNowDone.bind(this),
        this.addPromiseProcess.bind(this),
        this.checkQueue.bind(this)
      );
      return webLauncher.launchWeb(src, dest);
    };
    this.launchPython = async (src, dest) => {
      const httpPort = this.httpPort || 3456;
      const pythonLauncher = new PythonLauncher(
        this.projectName,
        httpPort,
        this.setupTestEnvironment.bind(this),
        this.handleChildProcess.bind(this),
        this.cleanupPorts.bind(this),
        this.bddTestIsRunning.bind(this),
        this.bddTestIsNowDone.bind(this),
        this.addPromiseProcess.bind(this),
        this.checkQueue.bind(this)
      );
      return pythonLauncher.launchPython(src, dest);
    };
    this.launchGolang = async (src, dest) => {
      const httpPort = this.httpPort || 3456;
      const golangLauncher = new GolangLauncher(
        this.projectName,
        httpPort,
        this.setupTestEnvironment.bind(this),
        this.handleChildProcess.bind(this),
        this.cleanupPorts.bind(this),
        this.bddTestIsRunning.bind(this),
        this.bddTestIsNowDone.bind(this),
        this.addPromiseProcess.bind(this),
        this.checkQueue.bind(this)
      );
      return golangLauncher.launchGolang(src, dest);
    };
    this.httpPort = configs.httpPort || 3456;
    this.chromiumPort = configs.chromiumPort || 4567;
    this.launchers = {};
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
      this.addPromiseProcess
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
      this.bddTestIsRunning.bind(this)
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
  // private cleanupTestProcessesInternal(testName: string) {
  //   // Use the integrated process management to clean up processes
  //   // const cleanedProcessIds = this.cleanupTestProcesses(testName);
  //   // if (cleanedProcessIds.length > 0) {
  //   //   console.log(
  //   //     `Cleaned up ${cleanedProcessIds.length} processes for test: ${testName}`
  //   //   );
  //   // }
  // }
  bddTestIsRunning(src) {
    this.updateSummaryEntry(src, {
      prompt: "?",
      runTimeErrors: "?",
      staticErrors: "?",
      typeErrors: "?",
      failingFeatures: {}
    });
  }
  async processQueueItem(src, runtime, addableFiles) {
    return this.executeTest(src, runtime, addableFiles);
  }
  async executeTest(src, runtime, addableFiles) {
    const runnables = getRunnables(this.configs, this.projectName);
    let dest;
    switch (runtime) {
      case "node":
        dest = runnables.nodeEntryPoints[src];
        break;
      case "web":
        dest = runnables.webEntryPoints[src];
        break;
      case "python":
        dest = runnables.pythonEntryPoints[src];
        break;
      case "golang":
        dest = runnables.golangEntryPoints[src];
        break;
      default:
        throw new Error(`Unsupported runtime: ${runtime}`);
    }
    await this.runBddTest(src, runtime, dest);
  }
  async runBddTest(src, runtime, dest) {
    console.log(`[runBddTest] Starting BDD test for ${src} (${runtime})`);
    this.bddTestIsRunning(src);
    switch (runtime) {
      case "node":
        console.log(`[runBddTest] Calling launchNode for ${src}`);
        await this.launchNode(src, dest);
        break;
      case "web":
        console.log(`[runBddTest] Calling launchWeb for ${src}`);
        await this.launchWeb(src, dest);
        break;
      case "python":
        console.log(`[runBddTest] Calling launchPython for ${src}`);
        await this.launchPython(src, dest);
        break;
      case "golang":
        console.log(`[runBddTest] Calling launchGolang for ${src}`);
        await this.launchGolang(src, dest);
        break;
      default:
        throw new Error(`Unsupported runtime for BDD test: ${runtime}`);
    }
    console.log(`[runBddTest] Completed BDD test for ${src} (${runtime})`);
  }
};

// src/server/serverClasees/Server.ts
var Server = class extends ServerTestExecutor {
  constructor(configs, testName, mode2) {
    super(configs, testName, mode2);
    configs.ports.forEach((port) => {
      this.ports[port] = "";
    });
    this.launchers = {};
    this.testName = testName;
    this.composeDir = process.cwd();
    this.composeFile = path14.join(
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
  async start() {
    try {
      await this.buildProcessStarter.startBuildProcesses();
    } catch (error) {
      console.error("Build processes failed:", error);
      return;
    }
    this.mapping().forEach(async ([command, func]) => {
      globalThis[command] = func;
    });
    if (!fs16.existsSync(`testeranto/reports/${this.projectName}`)) {
      fs16.mkdirSync(`testeranto/reports/${this.projectName}`);
    }
    this.browser = null;
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
        if (!fs16.existsSync(reportDest)) {
          fs16.mkdirSync(reportDest, { recursive: true });
        }
        this.addToQueue(
          entryPoint,
          runtime,
          this.configs,
          this.projectName,
          this.cleanupTestProcessesInternal.bind(this),
          this.checkQueue.bind(this),
          void 0
        );
      });
    });
    this.checkQueue();
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
      if (!fs16.existsSync(metafileDir)) {
        fs16.mkdirSync(metafileDir, { recursive: true });
      }
      if (!fs16.existsSync(metafile)) {
        fs16.writeFileSync(metafile, JSON.stringify({}));
      }
      try {
        if (runtime === "python") {
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
    super.stop();
  }
};

// src/makeHtmlTestFiles.ts
import path15 from "path";
import fs17 from "fs";

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
var CHECKS_CONFIG = {
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
  checks: CHECKS_CONFIG,
  // Legacy - kept for backward compatibility
  // New runtime-native check configuration
  check: {
    node: "src/staticAnalysis/node.js",
    python: "src/staticAnalysis/python.py",
    golang: "src/staticAnalysis/go.go",
    web: "src/staticAnalysis/web.js",
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
    const htmlFilePath = path15.normalize(
      `${process.cwd()}/testeranto/bundles/${testsName2}/${sourceDir.join(
        "/"
      )}/${sourceFileNameMinusJs}.html`
    );
    const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
    const cssFilePath = `./${sourceFileNameMinusJs}.css`;
    fs17.mkdirSync(path15.dirname(htmlFilePath), { recursive: true });
    fs17.writeFileSync(
      htmlFilePath,
      web_html_default(jsfilePath, htmlFilePath, cssFilePath)
    );
    console.log(`Generated HTML file: ${htmlFilePath}`);
  }
};

// src/makeHtmlReportFile.ts
import path16 from "path";
import fs18 from "fs";

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
      const htmlFilePath = path16.normalize(
        `${process.cwd()}/testeranto/reports/${testsName2}/${sourceDir.join(
          "/"
        )}/${sourceFileNameMinusExtension}/${runtime}/index.html`
      );
      fs18.mkdirSync(path16.dirname(htmlFilePath), { recursive: true });
      const htmlDir = path16.dirname(htmlFilePath);
      const reportJsPath = path16.join(
        process.cwd(),
        "dist",
        "prebuild",
        "Report.js"
      );
      const relativeReportJsPath = path16.relative(htmlDir, reportJsPath);
      const relativeReportJsUrl = relativeReportJsPath.split(path16.sep).join("/");
      const reportCssPath = path16.join(
        process.cwd(),
        "dist",
        "prebuild",
        "Report.css"
      );
      const relativeReportCssPath = path16.relative(htmlDir, reportCssPath);
      const relativeReportCssUrl = relativeReportCssPath.split(path16.sep).join("/");
      const htmlContent = generateHtmlContent({
        sourceFileNameMinusExtension,
        relativeReportCssUrl,
        relativeReportJsUrl,
        runtime,
        sourceFilePath,
        testsName: testsName2
      });
      fs18.writeFileSync(htmlFilePath, htmlContent);
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
var testsName = path17.basename(configFilepath).split(".").slice(0, -1).join(".");
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
  console.log(ansiC6.inverse("Press 'q' to initiate a graceful shutdown."));
  console.log(ansiC6.inverse("Press 'x' to quit forcefully."));
  setupKeypressHandling();
  setupFileSystem(config2, testsName);
  let pm = null;
  pm = new Server(config2, testsName, mode);
  await pm.start();
  if (!fs19.existsSync(`testeranto/reports/${testsName}`)) {
    fs19.mkdirSync(`testeranto/reports/${testsName}`);
  }
  fs19.writeFileSync(
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
  const hasGolangTests = Object.keys(config2.golang).length > 0;
  if (hasGolangTests) {
    const golingvuBuild = new GolingvuBuild(config2, testsName);
    const golangEntryPoints2 = await golingvuBuild.build();
    golingvuBuild.onBundleChange(() => {
      Object.keys(golangEntryPoints2).forEach((entryPoint) => {
        if (pm) {
          pm.addToQueue(entryPoint, "golang");
        }
      });
    });
  }
  const hasPitonoTests = Object.keys(config2.python).length > 0;
  if (hasPitonoTests) {
    const pitonoBuild = new PitonoBuild(config2, testsName);
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
      fs19.mkdirSync(
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
