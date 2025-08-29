import { createRequire } from 'module';const require = createRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/utils.ts
import path from "path";
var webEvaluator, tscPather, lintPather, promptPather, getRunnables;
var init_utils = __esm({
  "src/utils.ts"() {
    "use strict";
    webEvaluator = (d, webArgz) => {
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
    tscPather = (entryPoint, platform, projectName) => {
      return path.join(
        "testeranto",
        "reports",
        projectName,
        entryPoint.split(".").slice(0, -1).join("."),
        platform,
        `type_errors.txt`
      );
    };
    lintPather = (entryPoint, platform, projectName) => {
      return path.join(
        "testeranto",
        "reports",
        projectName,
        entryPoint.split(".").slice(0, -1).join("."),
        platform,
        `lint_errors.txt`
      );
    };
    promptPather = (entryPoint, platform, projectName) => {
      return path.join(
        "testeranto",
        "reports",
        projectName,
        entryPoint.split(".").slice(0, -1).join("."),
        platform,
        `prompt.txt`
      );
    };
    getRunnables = (tests, projectName, payload = {
      pythonEntryPoints: {},
      nodeEntryPoints: {},
      nodeEntryPointSidecars: {},
      webEntryPoints: {},
      webEntryPointSidecars: {},
      pureEntryPoints: {},
      pureEntryPointSidecars: {},
      golangEntryPoints: {},
      golangEntryPointSidecars: {},
      pitonoEntryPoints: {},
      pitonoEntryPointSidecars: {}
    }) => {
      const initializedPayload = {
        pythonEntryPoints: payload.pythonEntryPoints || {},
        nodeEntryPoints: payload.nodeEntryPoints || {},
        nodeEntryPointSidecars: payload.nodeEntryPointSidecars || {},
        webEntryPoints: payload.webEntryPoints || {},
        webEntryPointSidecars: payload.webEntryPointSidecars || {},
        pureEntryPoints: payload.pureEntryPoints || {},
        pureEntryPointSidecars: payload.pureEntryPointSidecars || {},
        golangEntryPoints: payload.golangEntryPoints || {},
        golangEntryPointSidecars: payload.golangEntryPointSidecars || {},
        pitonoEntryPoints: payload.pitonoEntryPoints || {},
        pitonoEntryPointSidecars: payload.pitonoEntryPointSidecars || {}
      };
      return tests.reduce((pt, cv, cndx, cry) => {
        if (cv[1] === "node") {
          pt.nodeEntryPoints[cv[0]] = path.resolve(
            `./testeranto/bundles/node/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
          );
        } else if (cv[1] === "web") {
          pt.webEntryPoints[cv[0]] = path.resolve(
            `./testeranto/bundles/web/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
          );
        } else if (cv[1] === "pure") {
          pt.pureEntryPoints[cv[0]] = path.resolve(
            `./testeranto/bundles/pure/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
          );
        } else if (cv[1] === "golang") {
          pt.golangEntryPoints[cv[0]] = path.resolve(cv[0]);
        } else if (cv[1] === "pitono") {
          pt.pitonoEntryPoints[cv[0]] = path.resolve(cv[0]);
        }
        cv[3].filter((t) => t[1] === "node").forEach((t) => {
          pt.nodeEntryPointSidecars[`${t[0]}`] = path.resolve(
            `./testeranto/bundles/node/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
          );
        });
        cv[3].filter((t) => t[1] === "web").forEach((t) => {
          pt.webEntryPointSidecars[`${t[0]}`] = path.resolve(
            `./testeranto/bundles/web/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
          );
        });
        cv[3].filter((t) => t[1] === "pure").forEach((t) => {
          pt.pureEntryPointSidecars[`${t[0]}`] = path.resolve(
            `./testeranto/bundles/pure/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
          );
        });
        cv[3].filter((t) => t[1] === "golang").forEach((t) => {
          pt.golangEntryPointSidecars[`${t[0]}`] = path.resolve(t[0]);
        });
        cv[3].filter((t) => t[1] === "pitono").forEach((t) => {
          pt.pitonoEntryPointSidecars[`${t[0]}`] = path.resolve(t[0]);
        });
        return pt;
      }, initializedPayload);
    };
  }
});

// src/utils/queue.ts
var Queue;
var init_queue = __esm({
  "src/utils/queue.ts"() {
    "use strict";
    Queue = class {
      constructor() {
        this.items = [];
      }
      enqueue(element) {
        this.items.push(element);
      }
      dequeue() {
        if (this.isEmpty()) {
          return "Queue is empty";
        }
        return this.items.shift();
      }
      peek() {
        if (this.isEmpty()) {
          return "Queue is empty";
        }
        return this.items[0];
      }
      isEmpty() {
        return this.items.length === 0;
      }
      size() {
        return this.items.length;
      }
      clear() {
        this.items = [];
      }
      print() {
        console.log(this.items.join(" -> "));
      }
    };
  }
});

// src/PM/base.ts
import fs4 from "fs";
import path4 from "path";
var fileStreams3, fPaths, files, recorders, screenshots, PM_Base;
var init_base = __esm({
  "src/PM/base.ts"() {
    "use strict";
    fileStreams3 = [];
    fPaths = [];
    files = {};
    recorders = {};
    screenshots = {};
    PM_Base = class {
      constructor(configs) {
        this.configs = configs;
      }
      // abstract launchSideCar(n: number, testName: string, projectName: string);
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
      goto(p, url3) {
        return new Promise((res) => {
          this.doInPage(p, async (page) => {
            await page?.goto(url3);
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
      async screencast(ssOpts, testName2, page) {
        const p = ssOpts.path;
        const dir = path4.dirname(p);
        fs4.mkdirSync(dir, {
          recursive: true
        });
        if (!files[testName2]) {
          files[testName2] = /* @__PURE__ */ new Set();
        }
        files[testName2].add(ssOpts.path);
        const sPromise = page.screenshot({
          ...ssOpts,
          path: p
        });
        if (!screenshots[testName2]) {
          screenshots[testName2] = [];
        }
        screenshots[testName2].push(sPromise);
        await sPromise;
        return sPromise;
      }
      async customScreenShot(ssOpts, testName2, pageUid) {
        const p = ssOpts.path;
        const dir = path4.dirname(p);
        fs4.mkdirSync(dir, {
          recursive: true
        });
        if (!files[testName2]) {
          files[testName2] = /* @__PURE__ */ new Set();
        }
        files[testName2].add(ssOpts.path);
        const page = (await this.browser.pages()).find(
          (p2) => p2.mainFrame()._id === pageUid
        );
        const sPromise = page.screenshot({
          ...ssOpts,
          path: p
        });
        if (!screenshots[testName2]) {
          screenshots[testName2] = [];
        }
        screenshots[testName2].push(sPromise);
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
        const testName2 = x[2];
        return new Promise(async (res) => {
          fs4.mkdirSync(path4.dirname(filepath), {
            recursive: true
          });
          if (!files[testName2]) {
            files[testName2] = /* @__PURE__ */ new Set();
          }
          files[testName2].add(filepath);
          await fs4.writeFileSync(filepath, contents);
          res(true);
        });
      }
      async createWriteStream(filepath, testName2) {
        const folder = filepath.split("/").slice(0, -1).join("/");
        return new Promise((res) => {
          if (!fs4.existsSync(folder)) {
            return fs4.mkdirSync(folder, {
              recursive: true
            });
          }
          const f2 = fs4.createWriteStream(filepath);
          fileStreams3.push(f2);
          if (!files[testName2]) {
            files[testName2] = /* @__PURE__ */ new Set();
          }
          files[testName2].add(filepath);
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
              fs4.mkdir(targetDir, { recursive: true }, async (error) => {
                if (error) {
                  console.error(`\u2757\uFE0FtestArtiFactory failed`, targetDir, error);
                }
                fs4.writeFileSync(
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
      // setValue(value: string, p: string) {
      //   this.doInPage(p, (page) => {
      //     return page.keyboard.type(value);
      //   });
      // }
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
  }
});

// src/utils/logFiles.ts
function getLogFilesForRuntime(runtime) {
  const { standard, runtimeSpecific } = getRuntimeLogs(runtime);
  return [...standard, ...runtimeSpecific];
}
var LOG_FILES, STANDARD_LOGS, RUNTIME_SPECIFIC_LOGS, ALL_LOGS, getRuntimeLogs;
var init_logFiles = __esm({
  "src/utils/logFiles.ts"() {
    "use strict";
    LOG_FILES = {
      TESTS: "tests.json",
      TYPE_ERRORS: "type_errors.txt",
      LINT_ERRORS: "lint_errors.txt",
      EXIT: "exit.log",
      MESSAGE: "message.txt",
      PROMPT: "prompt.txt",
      STDOUT: "stdout.log",
      STDERR: "stderr.log",
      INFO: "info.log",
      ERROR: "error.log",
      WARN: "warn.log",
      DEBUG: "debug.log"
    };
    STANDARD_LOGS = {
      TESTS: "tests.json",
      TYPE_ERRORS: "type_errors.txt",
      LINT_ERRORS: "lint_errors.txt",
      EXIT: "exit.log",
      MESSAGE: "message.txt",
      PROMPT: "prompt.txt",
      BUILD: "build.json"
    };
    RUNTIME_SPECIFIC_LOGS = {
      node: {
        STDOUT: "stdout.log",
        STDERR: "stderr.log"
      },
      web: {
        INFO: "info.log",
        ERROR: "error.log",
        WARN: "warn.log",
        DEBUG: "debug.log"
      },
      pure: {}
      // No runtime-specific logs for pure
    };
    ALL_LOGS = {
      ...STANDARD_LOGS,
      ...Object.values(RUNTIME_SPECIFIC_LOGS).reduce((acc, logs) => ({ ...acc, ...logs }), {})
    };
    getRuntimeLogs = (runtime) => {
      return {
        standard: Object.values(STANDARD_LOGS),
        runtimeSpecific: Object.values(RUNTIME_SPECIFIC_LOGS[runtime])
      };
    };
  }
});

// src/utils/makePrompt.ts
import fs5 from "fs";
import path5 from "path";
var makePrompt, makePromptInternal;
var init_makePrompt = __esm({
  "src/utils/makePrompt.ts"() {
    "use strict";
    init_utils();
    init_logFiles();
    init_logFiles();
    makePrompt = async (summary, name, entryPoint, addableFiles, runtime) => {
      summary[entryPoint].prompt = "?";
      const promptPath = promptPather(entryPoint, runtime, name);
      const testDir = path5.join(
        "testeranto",
        "reports",
        name,
        entryPoint.split(".").slice(0, -1).join("."),
        runtime
      );
      if (!fs5.existsSync(testDir)) {
        fs5.mkdirSync(testDir, { recursive: true });
      }
      const testPaths = path5.join(testDir, LOG_FILES.TESTS);
      const lintPath = path5.join(testDir, LOG_FILES.LINT_ERRORS);
      const typePath = path5.join(testDir, LOG_FILES.TYPE_ERRORS);
      const messagePath = path5.join(testDir, LOG_FILES.MESSAGE);
      try {
        await Promise.all([
          fs5.promises.writeFile(
            promptPath,
            `
${addableFiles.map((x) => {
              return `/add ${x}`;
            }).join("\n")}

/read node_modules/testeranto/docs/index.md
/read node_modules/testeranto/docs/style.md
/read node_modules/testeranto/docs/testing.ai.txt
/read node_modules/testeranto/src/CoreTypes.ts

/read ${testPaths}
/read ${typePath}
/read ${lintPath}

/read ${getLogFilesForRuntime(runtime).map((p) => `${testDir}/${p}`).join(" ")}
`
          ),
          fs5.promises.writeFile(
            messagePath,
            `
There are 3 types of test reports.
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
Do not add error throwing/catching to the tests themselves.
`
          )
        ]);
      } catch (e) {
        console.error(`Failed to write prompt files at ${testDir}`);
        console.error(e);
        throw e;
      }
      summary[entryPoint].prompt = `aider --model deepseek/deepseek-chat --load testeranto/${name}/reports/${runtime}/${entryPoint.split(".").slice(0, -1).join(".")}/prompt.txt`;
    };
    makePromptInternal = (summary, name, entryPoint, addableFiles, runTime) => {
      if (runTime === "node") {
        return makePrompt(summary, name, entryPoint, addableFiles, "node");
      }
      if (runTime === "web") {
        return makePrompt(summary, name, entryPoint, addableFiles, "web");
      }
      if (runTime === "pure") {
        return makePrompt(summary, name, entryPoint, addableFiles, "pure");
      }
    };
  }
});

// src/PM/PM_WithEslintAndTsc.ts
import ts from "typescript";
import fs6 from "fs";
import ansiC from "ansi-colors";
import { ESLint } from "eslint";
import tsc from "tsc-prog";
var eslint, formatter, PM_WithEslintAndTsc;
var init_PM_WithEslintAndTsc = __esm({
  async "src/PM/PM_WithEslintAndTsc.ts"() {
    "use strict";
    init_utils();
    init_base();
    init_makePrompt();
    eslint = new ESLint();
    formatter = await eslint.loadFormatter(
      "./node_modules/testeranto/dist/prebuild/esbuildConfigs/eslint-formatter-testeranto.mjs"
    );
    PM_WithEslintAndTsc = class extends PM_Base {
      constructor(configs, name, mode2) {
        super(configs);
        this.summary = {};
        this.tscCheck = async ({
          entrypoint,
          addableFiles,
          platform
        }) => {
          console.log(ansiC.green(ansiC.inverse(`tsc < ${entrypoint}`)));
          try {
            this.typeCheckIsRunning(entrypoint);
          } catch (e) {
            console.error("error in tscCheck");
            console.error(e);
            console.error(entrypoint);
            console.error(JSON.stringify(this.summary, null, 2));
            process.exit(-1);
          }
          const program = tsc.createProgramFromConfig({
            basePath: process.cwd(),
            // always required, used for relative paths
            configFilePath: "tsconfig.json",
            // config to inherit from (optional)
            compilerOptions: {
              outDir: tscPather(entrypoint, platform, this.name),
              // declaration: true,
              // skipLibCheck: true,
              noEmit: true
            },
            include: addableFiles
            //["src/**/*"],
            // exclude: ["node_modules", "../testeranto"],
            // exclude: ["**/*.test.ts", "**/*.spec.ts"],
          });
          const tscPath = tscPather(entrypoint, platform, this.name);
          const allDiagnostics = program.getSemanticDiagnostics();
          const results = [];
          allDiagnostics.forEach((diagnostic) => {
            if (diagnostic.file) {
              const { line, character } = ts.getLineAndCharacterOfPosition(
                diagnostic.file,
                diagnostic.start
              );
              const message = ts.flattenDiagnosticMessageText(
                diagnostic.messageText,
                "\n"
              );
              results.push(
                `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
              );
            } else {
              results.push(
                ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
              );
            }
          });
          fs6.writeFileSync(tscPath, results.join("\n"));
          this.typeCheckIsNowDone(entrypoint, results.length);
        };
        this.eslintCheck = async (entrypoint, platform, addableFiles) => {
          console.log(ansiC.green(ansiC.inverse(`eslint < ${entrypoint}`)));
          try {
            this.lintIsRunning(entrypoint);
          } catch (e) {
            console.error("error in eslintCheck");
            console.error(e);
            console.error(entrypoint);
            console.error(JSON.stringify(this.summary, null, 2));
            process.exit(-1);
          }
          const filepath = lintPather(entrypoint, platform, this.name);
          if (fs6.existsSync(filepath))
            fs6.rmSync(filepath);
          const results = (await eslint.lintFiles(addableFiles)).filter((r) => r.messages.length).filter((r) => {
            return r.messages[0].ruleId !== null;
          }).map((r) => {
            delete r.source;
            return r;
          });
          fs6.writeFileSync(filepath, await formatter.format(results));
          this.lintIsNowDone(entrypoint, results.length);
        };
        this.makePrompt = async (entryPoint, addableFiles, platform) => {
          await makePromptInternal(
            this.summary,
            this.name,
            entryPoint,
            addableFiles,
            platform
          );
          this.checkForShutdown();
        };
        this.typeCheckIsRunning = (src) => {
          if (!this.summary[src]) {
            throw `this.summary[${src}] is undefined`;
          }
          this.summary[src].typeErrors = "?";
        };
        this.typeCheckIsNowDone = (src, failures) => {
          if (!this.summary[src]) {
            throw `this.summary[${src}] is undefined`;
          }
          if (failures === 0) {
            console.log(ansiC.green(ansiC.inverse(`tsc > ${src}`)));
          } else {
            console.log(
              ansiC.red(ansiC.inverse(`tsc > ${src} failed ${failures} times`))
            );
          }
          this.summary[src].typeErrors = failures;
          this.writeBigBoard();
          this.checkForShutdown();
        };
        this.lintIsRunning = (src) => {
          if (!this.summary[src]) {
            throw `this.summary[${src}] is undefined`;
          }
          this.summary[src].staticErrors = "?";
          this.writeBigBoard();
        };
        this.lintIsNowDone = (src, failures) => {
          if (!this.summary[src]) {
            throw `this.summary[${src}] is undefined`;
          }
          if (failures === 0) {
            console.log(ansiC.green(ansiC.inverse(`eslint > ${src}`)));
          } else {
            console.log(
              ansiC.red(ansiC.inverse(`eslint > ${src} failed ${failures} times`))
            );
          }
          this.summary[src].staticErrors = failures;
          this.writeBigBoard();
          this.checkForShutdown();
        };
        this.bddTestIsRunning = (src) => {
          if (!this.summary[src]) {
            throw `this.summary[${src}] is undefined`;
          }
          this.summary[src].runTimeErrors = "?";
          this.writeBigBoard();
        };
        this.bddTestIsNowDone = (src, failures) => {
          if (!this.summary[src]) {
            throw `this.summary[${src}] is undefined`;
          }
          this.summary[src].runTimeErrors = failures;
          this.writeBigBoard();
          this.checkForShutdown();
        };
        this.writeBigBoard = () => {
          const summaryPath = `./testeranto/reports/${this.name}/summary.json`;
          const summaryData = JSON.stringify(this.summary, null, 2);
          fs6.writeFileSync(summaryPath, summaryData);
          this.broadcast({
            type: "summaryUpdate",
            data: this.summary
          });
        };
        this.name = name;
        this.mode = mode2;
        this.summary = {};
        this.configs.tests.forEach(([t, rt, tr, sidecars]) => {
          this.ensureSummaryEntry(t);
          sidecars.forEach(([sidecarName]) => {
            this.ensureSummaryEntry(sidecarName, true);
          });
        });
      }
      ensureSummaryEntry(src, isSidecar = false) {
        if (!this.summary[src]) {
          this.summary[src] = {
            typeErrors: void 0,
            staticErrors: void 0,
            runTimeErrors: void 0,
            prompt: void 0,
            failingFeatures: {}
          };
          if (isSidecar) {
          }
        }
        return this.summary[src];
      }
    };
  }
});

// src/PM/PM_WithWebSocket.ts
import { spawn } from "node:child_process";
import fs7 from "fs";
import http from "http";
import url from "url";
import mime from "mime-types";
import { WebSocketServer } from "ws";
var PM_WithWebSocket;
var init_PM_WithWebSocket = __esm({
  async "src/PM/PM_WithWebSocket.ts"() {
    "use strict";
    await init_PM_WithEslintAndTsc();
    PM_WithWebSocket = class extends PM_WithEslintAndTsc {
      constructor(configs, name, mode2) {
        super(configs, name, mode2);
        this.clients = /* @__PURE__ */ new Set();
        this.runningProcesses = /* @__PURE__ */ new Map();
        this.allProcesses = /* @__PURE__ */ new Map();
        this.processLogs = /* @__PURE__ */ new Map();
        this.httpServer = http.createServer(this.requestHandler.bind(this));
        this.wss = new WebSocketServer({ server: this.httpServer });
        this.wss.on("connection", (ws) => {
          this.clients.add(ws);
          console.log("Client connected");
          ws.on("message", (data) => {
            try {
              const message = JSON.parse(data.toString());
              if (message.type === "executeCommand") {
                if (message.command && message.command.trim().startsWith("aider")) {
                  console.log(`Executing command: ${message.command}`);
                  const processId = Date.now().toString();
                  const child = spawn(message.command, {
                    shell: true,
                    cwd: process.cwd()
                  });
                  this.runningProcesses.set(processId, child);
                  this.allProcesses.set(processId, {
                    child,
                    status: "running",
                    command: message.command,
                    pid: child.pid,
                    timestamp: (/* @__PURE__ */ new Date()).toISOString()
                  });
                  this.processLogs.set(processId, []);
                  this.broadcast({
                    type: "processStarted",
                    processId,
                    command: message.command,
                    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
                    logs: []
                  });
                  child.stdout?.on("data", (data2) => {
                    const logData = data2.toString();
                    const logs = this.processLogs.get(processId) || [];
                    logs.push(logData);
                    this.processLogs.set(processId, logs);
                    this.broadcast({
                      type: "processStdout",
                      processId,
                      data: logData,
                      timestamp: (/* @__PURE__ */ new Date()).toISOString()
                    });
                  });
                  child.stderr?.on("data", (data2) => {
                    const logData = data2.toString();
                    const logs = this.processLogs.get(processId) || [];
                    logs.push(logData);
                    this.processLogs.set(processId, logs);
                    this.broadcast({
                      type: "processStderr",
                      processId,
                      data: logData,
                      timestamp: (/* @__PURE__ */ new Date()).toISOString()
                    });
                  });
                  child.on("error", (error) => {
                    console.error(`Failed to execute command: ${error}`);
                    this.runningProcesses.delete(processId);
                    const processInfo = this.allProcesses.get(processId);
                    if (processInfo) {
                      this.allProcesses.set(processId, {
                        ...processInfo,
                        status: "error",
                        error: error.message
                      });
                    }
                    this.broadcast({
                      type: "processError",
                      processId,
                      error: error.message,
                      timestamp: (/* @__PURE__ */ new Date()).toISOString()
                    });
                  });
                  child.on("exit", (code) => {
                    console.log(`Command exited with code ${code}`);
                    this.runningProcesses.delete(processId);
                    const processInfo = this.allProcesses.get(processId);
                    if (processInfo) {
                      this.allProcesses.set(processId, {
                        ...processInfo,
                        status: "exited",
                        exitCode: code
                      });
                    }
                    this.broadcast({
                      type: "processExited",
                      processId,
                      exitCode: code,
                      timestamp: (/* @__PURE__ */ new Date()).toISOString()
                    });
                  });
                } else {
                  console.error('Invalid command: must start with "aider"');
                }
              } else if (message.type === "getRunningProcesses") {
                const processes = Array.from(this.allProcesses.entries()).map(
                  ([id, procInfo]) => ({
                    processId: id,
                    command: procInfo.command,
                    pid: procInfo.pid,
                    status: procInfo.status,
                    exitCode: procInfo.exitCode,
                    error: procInfo.error,
                    timestamp: procInfo.timestamp,
                    logs: this.processLogs.get(id) || []
                  })
                );
                ws.send(
                  JSON.stringify({
                    type: "runningProcesses",
                    processes
                  })
                );
              } else if (message.type === "getProcess") {
                const processId = message.processId;
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
                      logs: this.processLogs.get(processId) || []
                    })
                  );
                }
              } else if (message.type === "stdin") {
                const processId = message.processId;
                const data2 = message.data;
                console.log("Received stdin for process", processId, ":", data2);
                const childProcess = this.runningProcesses.get(processId);
                if (childProcess && childProcess.stdin) {
                  console.log("Writing to process stdin");
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
              } else if (message.type === "killProcess") {
                const processId = message.processId;
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
              }
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
        this.httpServer.listen(httpPort, () => {
          console.log(`HTTP server running on http://localhost:${httpPort}`);
        });
      }
      requestHandler(req, res) {
        const parsedUrl = url.parse(req.url || "/");
        let pathname = parsedUrl.pathname || "/";
        if (pathname === "/") {
          pathname = "/index.html";
        }
        let filePath = pathname.substring(1);
        if (filePath.startsWith("reports/")) {
          filePath = `testeranto/${filePath}`;
        } else if (filePath.startsWith("metafiles/")) {
          filePath = `testeranto/${filePath}`;
        } else if (filePath === "projects.json") {
          filePath = `testeranto/${filePath}`;
        } else {
          const possiblePaths = [
            `dist/${filePath}`,
            `testeranto/dist/${filePath}`,
            `../dist/${filePath}`,
            `./${filePath}`
          ];
          let foundPath = null;
          for (const possiblePath of possiblePaths) {
            if (fs7.existsSync(possiblePath)) {
              foundPath = possiblePath;
              break;
            }
          }
          if (foundPath) {
            filePath = foundPath;
          } else {
            const indexPath = this.findIndexHtml();
            if (indexPath) {
              fs7.readFile(indexPath, (err, data) => {
                if (err) {
                  res.writeHead(404, { "Content-Type": "text/plain" });
                  res.end("404 Not Found");
                  return;
                }
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
              });
              return;
            } else {
              res.writeHead(404, { "Content-Type": "text/plain" });
              res.end("404 Not Found");
              return;
            }
          }
        }
        fs7.exists(filePath, (exists) => {
          if (!exists) {
            if (!pathname.includes(".") && pathname !== "/") {
              const indexPath = this.findIndexHtml();
              if (indexPath) {
                fs7.readFile(indexPath, (err, data) => {
                  if (err) {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end("404 Not Found");
                    return;
                  }
                  res.writeHead(200, { "Content-Type": "text/html" });
                  res.end(data);
                });
                return;
              } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(`
              <html>
                <body>
                  <h1>Testeranto is running</h1>
                  <p>Frontend files are not built yet. Run 'npm run build' to build the frontend.</p>
                </body>
              </html>
            `);
                return;
              }
            }
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404 Not Found");
            return;
          }
          fs7.readFile(filePath, (err, data) => {
            if (err) {
              res.writeHead(500, { "Content-Type": "text/plain" });
              res.end("500 Internal Server Error");
              return;
            }
            const mimeType = mime.lookup(filePath) || "application/octet-stream";
            res.writeHead(200, { "Content-Type": mimeType });
            res.end(data);
          });
        });
      }
      findIndexHtml() {
        const possiblePaths = [
          "dist/index.html",
          "testeranto/dist/index.html",
          "../dist/index.html",
          "./index.html"
        ];
        for (const path12 of possiblePaths) {
          if (fs7.existsSync(path12)) {
            return path12;
          }
        }
        return null;
      }
      broadcast(message) {
        const data = typeof message === "string" ? message : JSON.stringify(message);
        this.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send(data);
          }
        });
      }
    };
  }
});

// src/PM/utils.ts
import ansiC2 from "ansi-colors";
import path6 from "path";
import fs8 from "fs";
import crypto from "node:crypto";
function runtimeLogs(runtime, reportDest) {
  const safeDest = reportDest || `testeranto/reports/default_${Date.now()}`;
  try {
    if (!fs8.existsSync(safeDest)) {
      fs8.mkdirSync(safeDest, { recursive: true });
    }
    if (runtime === "node") {
      return {
        stdout: fs8.createWriteStream(`${safeDest}/stdout.log`),
        stderr: fs8.createWriteStream(`${safeDest}/stderr.log`),
        exit: fs8.createWriteStream(`${safeDest}/exit.log`)
      };
    } else if (runtime === "web") {
      return {
        info: fs8.createWriteStream(`${safeDest}/info.log`),
        warn: fs8.createWriteStream(`${safeDest}/warn.log`),
        error: fs8.createWriteStream(`${safeDest}/error.log`),
        debug: fs8.createWriteStream(`${safeDest}/debug.log`),
        exit: fs8.createWriteStream(`${safeDest}/exit.log`)
      };
    } else if (runtime === "pure") {
      return {
        exit: fs8.createWriteStream(`${safeDest}/exit.log`)
      };
    } else if (runtime === "pitono") {
      return {
        stdout: fs8.createWriteStream(`${safeDest}/stdout.log`),
        stderr: fs8.createWriteStream(`${safeDest}/stderr.log`),
        exit: fs8.createWriteStream(`${safeDest}/exit.log`)
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
  if (!fs8.existsSync(reportDest)) {
    fs8.mkdirSync(reportDest, { recursive: true });
  }
  const safeDest = reportDest || `testeranto/reports/default_${Date.now()}`;
  try {
    if (!fs8.existsSync(safeDest)) {
      fs8.mkdirSync(safeDest, { recursive: true });
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
async function fileHash(filePath, algorithm = "md5") {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm);
    const fileStream = fs8.createReadStream(filePath);
    fileStream.on("data", (data) => {
      hash.update(data);
    });
    fileStream.on("end", () => {
      const fileHash2 = hash.digest("hex");
      resolve(fileHash2);
    });
    fileStream.on("error", (error) => {
      reject(`Error reading file: ${error.message}`);
    });
  });
}
async function writeFileAndCreateDir(filePath, data) {
  const dirPath = path6.dirname(filePath);
  try {
    await fs8.promises.mkdir(dirPath, { recursive: true });
    await fs8.writeFileSync(filePath, data);
  } catch (error) {
    console.error(`Error writing file: ${error}`);
  }
}
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}
async function pollForFile(path12, timeout = 2e3) {
  const intervalObj = setInterval(function() {
    const file = path12;
    const fileExists = fs8.existsSync(file);
    if (fileExists) {
      clearInterval(intervalObj);
    }
  }, timeout);
}
var statusMessagePretty, filesHash, executablePath, puppeteerConfigs;
var init_utils2 = __esm({
  "src/PM/utils.ts"() {
    "use strict";
    statusMessagePretty = (failures, test, runtime) => {
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
    filesHash = async (files3, algorithm = "md5") => {
      return new Promise((resolve, reject) => {
        resolve(
          files3.reduce(async (mm, f2) => {
            return await mm + await fileHash(f2);
          }, Promise.resolve(""))
        );
      });
    };
    executablePath = "/opt/homebrew/bin/chromium";
    puppeteerConfigs = {
      slowMo: 1,
      waitForInitialPage: false,
      executablePath,
      headless: true,
      defaultViewport: null,
      // Disable default 800x600 viewport
      dumpio: false,
      devtools: false,
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
  }
});

// src/PM/pitonoRunner.ts
var pitonoRunner_exports = {};
__export(pitonoRunner_exports, {
  PitonoRunner: () => PitonoRunner
});
import { execSync } from "child_process";
import path7 from "path";
import fs9 from "fs";
var PitonoRunner;
var init_pitonoRunner = __esm({
  "src/PM/pitonoRunner.ts"() {
    "use strict";
    PitonoRunner = class {
      constructor(config, testName2) {
        this.config = config;
        this.testName = testName2;
      }
      async run() {
        const coreJsonPath = path7.join(process.cwd(), "testeranto", "pitono", this.testName, "core.json");
        const maxWaitTime = 1e4;
        const startTime = Date.now();
        while (!fs9.existsSync(coreJsonPath) && Date.now() - startTime < maxWaitTime) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        if (!fs9.existsSync(coreJsonPath)) {
          console.error(`Pitono core.json not found at: ${coreJsonPath} after waiting ${maxWaitTime}ms`);
          return;
        }
        try {
          const coreData = JSON.parse(fs9.readFileSync(coreJsonPath, "utf-8"));
          const entryPoints = coreData.entryPoints;
          for (const entryPoint of entryPoints) {
            try {
              console.log(`Running pitono test: ${entryPoint}`);
              const absolutePath = path7.resolve(entryPoint);
              if (!fs9.existsSync(absolutePath)) {
                console.error(`Pitono test file not found: ${absolutePath}`);
                continue;
              }
              execSync(`python "${absolutePath}"`, { stdio: "inherit" });
              console.log(`Pitono test completed: ${entryPoint}`);
            } catch (error) {
              console.error(`Pitono test failed: ${entryPoint}`, error);
              throw error;
            }
          }
        } catch (error) {
          console.error(`Error reading or parsing core.json: ${error}`);
        }
      }
    };
  }
});

// src/PM/main.ts
var main_exports = {};
__export(main_exports, {
  PM_Main: () => PM_Main
});
import { spawn as spawn2 } from "node:child_process";
import ansiColors from "ansi-colors";
import net from "net";
import fs10, { watch } from "fs";
import path8 from "path";
import puppeteer, { executablePath as executablePath2 } from "puppeteer-core";
import ansiC3 from "ansi-colors";
import url2 from "url";
import mime2 from "mime-types";
var changes, fileHashes, files2, screenshots2, PM_Main;
var init_main = __esm({
  async "src/PM/main.ts"() {
    "use strict";
    init_utils();
    init_queue();
    await init_PM_WithWebSocket();
    init_utils2();
    changes = {};
    fileHashes = {};
    files2 = {};
    screenshots2 = {};
    PM_Main = class extends PM_WithWebSocket {
      constructor(configs, name, mode2) {
        super(configs, name, mode2);
        this.logStreams = {};
        this.clients = /* @__PURE__ */ new Set();
        this.runningProcesses = /* @__PURE__ */ new Map();
        this.processLogs = /* @__PURE__ */ new Map();
        this.allProcesses = /* @__PURE__ */ new Map();
        this.launchPure = async (src, dest) => {
          console.log(ansiC3.green(ansiC3.inverse(`pure < ${src}`)));
          this.bddTestIsRunning(src);
          const reportDest = `testeranto/reports/${this.name}/${src.split(".").slice(0, -1).join(".")}/pure`;
          if (!fs10.existsSync(reportDest)) {
            fs10.mkdirSync(reportDest, { recursive: true });
          }
          const destFolder = dest.replace(".mjs", "");
          let argz2 = "";
          const testConfig = this.configs.tests.find((t) => {
            return t[0] === src;
          });
          if (!testConfig) {
            console.log(ansiC3.inverse("missing test config! Exiting ungracefully!"));
            process.exit(-1);
          }
          const testConfigResource = testConfig[2];
          const portsToUse = [];
          if (testConfigResource.ports === 0) {
            argz2 = JSON.stringify({
              scheduled: true,
              name: src,
              ports: portsToUse,
              fs: reportDest,
              browserWSEndpoint: this.browser.wsEndpoint()
            });
          } else if (testConfigResource.ports > 0) {
            const openPorts = Object.entries(this.ports).filter(
              ([portnumber, status]) => status === ""
            );
            if (openPorts.length >= testConfigResource.ports) {
              for (let i = 0; i < testConfigResource.ports; i++) {
                portsToUse.push(openPorts[i][0]);
                this.ports[openPorts[i][0]] = src;
              }
              argz2 = JSON.stringify({
                scheduled: true,
                name: src,
                ports: portsToUse,
                fs: destFolder,
                browserWSEndpoint: this.browser.wsEndpoint()
              });
            } else {
              this.queue.push(src);
              return [Math.random(), argz2];
            }
          } else {
            console.error("negative port makes no sense", src);
            process.exit(-1);
          }
          const builtfile = dest;
          const logs = createLogStreams(reportDest, "pure");
          try {
            await import(`${builtfile}?cacheBust=${Date.now()}`).then((module) => {
              return module.default.then((defaultModule) => {
                defaultModule.receiveTestResourceConfig(argz2).then(async (results) => {
                  statusMessagePretty(results.fails, src, "pure");
                  this.bddTestIsNowDone(src, results.fails);
                }).catch((e1) => {
                  console.log(
                    ansiC3.red(`launchPure - ${src} errored with: ${e1.stack}`)
                  );
                  this.bddTestIsNowDone(src, -1);
                  statusMessagePretty(-1, src, "pure");
                });
              }).catch((e2) => {
                console.log(
                  ansiColors.red(
                    `pure ! ${src} failed to execute. No "tests.json" file was generated. Check the logs for more info`
                  )
                );
                logs.exit.write(e2.stack);
                logs.exit.write(-1);
                this.bddTestIsNowDone(src, -1);
                statusMessagePretty(-1, src, "pure");
              });
            });
          } catch (e3) {
            logs.writeExitCode(-1, e3);
            console.log(
              ansiC3.red(
                ansiC3.inverse(
                  `${src} 1 errored with: ${e3}. Check logs for more info`
                )
              )
            );
            logs.exit.write(e3.stack);
            logs.exit.write("-1");
            this.bddTestIsNowDone(src, -1);
            statusMessagePretty(-1, src, "pure");
          }
          for (let i = 0; i <= portsToUse.length; i++) {
            if (portsToUse[i]) {
              this.ports[portsToUse[i]] = "";
            }
          }
        };
        this.launchNode = async (src, dest) => {
          console.log(ansiC3.green(ansiC3.inverse(`node < ${src}`)));
          this.bddTestIsRunning(src);
          const reportDest = `testeranto/reports/${this.name}/${src.split(".").slice(0, -1).join(".")}/node`;
          if (!fs10.existsSync(reportDest)) {
            fs10.mkdirSync(reportDest, { recursive: true });
          }
          let testResources = "";
          const testConfig = this.configs.tests.find((t) => {
            return t[0] === src;
          });
          if (!testConfig) {
            console.log(
              ansiC3.inverse(`missing test config! Exiting ungracefully for '${src}'`)
            );
            process.exit(-1);
          }
          const testConfigResource = testConfig[2];
          const portsToUse = [];
          if (testConfigResource.ports === 0) {
            const t = {
              name: src,
              // ports: portsToUse.map((v) => Number(v)),
              ports: [],
              fs: reportDest,
              browserWSEndpoint: this.browser.wsEndpoint()
            };
            testResources = JSON.stringify(t);
          } else if (testConfigResource.ports > 0) {
            const openPorts = Object.entries(this.ports).filter(
              ([portnumber, portopen]) => portopen === ""
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
                ansiC3.red(
                  `node: cannot run ${src} because there are no open ports ATM. This job will be enqueued and run again run a port is available`
                )
              );
              this.queue.push(src);
              return [Math.random(), argz];
            }
          } else {
            console.error("negative port makes no sense", src);
            process.exit(-1);
          }
          const builtfile = dest;
          let haltReturns = false;
          const ipcfile = "/tmp/tpipe_" + Math.random();
          const child = spawn2(
            "node",
            [
              // "--inspect-brk",
              builtfile,
              testResources,
              ipcfile
            ],
            {
              stdio: ["pipe", "pipe", "pipe", "ipc"]
            }
          );
          let buffer = new Buffer("");
          const server = net.createServer((socket) => {
            const queue = new Queue();
            socket.on("data", (data) => {
              buffer = Buffer.concat([buffer, data]);
              for (let b = 0; b < buffer.length + 1; b++) {
                const c = buffer.slice(0, b);
                let d;
                try {
                  d = JSON.parse(c.toString());
                  queue.enqueue(d);
                  buffer = buffer.slice(b, buffer.length + 1);
                  b = 0;
                } catch (e) {
                }
              }
              while (queue.size() > 0) {
                const message = queue.dequeue();
                if (message) {
                  this.mapping().forEach(async ([command, func]) => {
                    if (message[0] === command) {
                      const x = message.slice(1, -1);
                      const r = await this[command](...x);
                      if (!haltReturns) {
                        child.send(
                          JSON.stringify({
                            payload: r,
                            key: message[message.length - 1]
                          })
                        );
                      }
                    }
                  });
                }
              }
            });
          });
          const logs = createLogStreams(reportDest, "node");
          server.listen(ipcfile, () => {
            child.stdout?.on("data", (data) => {
              logs.stdout?.write(data);
            });
            child.stderr?.on("data", (data) => {
              logs.stderr?.write(data);
            });
            child.on("error", (err) => {
            });
            child.on("close", (code) => {
              const exitCode = code === null ? -1 : code;
              if (exitCode < 0) {
                logs.writeExitCode(
                  exitCode,
                  new Error("Process crashed or was terminated")
                );
              } else {
                logs.writeExitCode(exitCode);
              }
              logs.closeAll();
              server.close();
              if (!files2[src]) {
                files2[src] = /* @__PURE__ */ new Set();
              }
              if (exitCode === 255) {
                console.log(
                  ansiColors.red(
                    `node ! ${src} failed to execute. No "tests.json" file was generated. Check ${reportDest}/stderr.log for more info`
                  )
                );
                this.bddTestIsNowDone(src, -1);
                statusMessagePretty(-1, src, "node");
                return;
              } else if (exitCode === 0) {
                this.bddTestIsNowDone(src, 0);
                statusMessagePretty(0, src, "node");
              } else {
                this.bddTestIsNowDone(src, exitCode);
                statusMessagePretty(exitCode, src, "node");
              }
              haltReturns = true;
            });
            child.on("exit", (code) => {
              haltReturns = true;
              for (let i = 0; i <= portsToUse.length; i++) {
                if (portsToUse[i]) {
                  this.ports[portsToUse[i]] = "";
                }
              }
            });
            child.on("error", (e) => {
              console.log("error");
              haltReturns = true;
              console.log(
                ansiC3.red(
                  ansiC3.inverse(
                    `${src} errored with: ${e.name}. Check error logs for more info`
                  )
                )
              );
              this.bddTestIsNowDone(src, -1);
              statusMessagePretty(-1, src, "node");
            });
          });
        };
        this.launchWeb = async (src, dest) => {
          console.log(ansiC3.green(ansiC3.inverse(`web < ${src}`)));
          this.bddTestIsRunning(src);
          const reportDest = `testeranto/reports/${this.name}/${src.split(".").slice(0, -1).join(".")}/web`;
          if (!fs10.existsSync(reportDest)) {
            fs10.mkdirSync(reportDest, { recursive: true });
          }
          const destFolder = dest.replace(".mjs", "");
          const webArgz = JSON.stringify({
            name: src,
            ports: [].toString(),
            fs: reportDest,
            browserWSEndpoint: this.browser.wsEndpoint()
          });
          const d = `${dest}?cacheBust=${Date.now()}`;
          const logs = createLogStreams(reportDest, "web");
          this.browser.newPage().then((page) => {
            page.on("console", (log) => {
              const msg = `${log.text()}
`;
              switch (log.type()) {
                case "info":
                  logs.info?.write(msg);
                  break;
                case "warn":
                  logs.warn?.write(msg);
                  break;
                case "error":
                  logs.error?.write(msg);
                  break;
                case "debug":
                  logs.debug?.write(msg);
                  break;
                default:
                  break;
              }
            });
            page.on("close", () => {
              logs.writeExitCode(0);
              logs.closeAll();
              logs.closeAll();
            });
            this.mapping().forEach(async ([command, func]) => {
              if (command === "page") {
                page.exposeFunction(command, (x) => {
                  if (x) {
                    return func(x);
                  } else {
                    return func(page.mainFrame()._id);
                  }
                });
              } else {
                return page.exposeFunction(command, func);
              }
            });
            return page;
          }).then(async (page) => {
            const close = () => {
              if (!files2[src]) {
                files2[src] = /* @__PURE__ */ new Set();
              }
              delete files2[src];
              Promise.all(screenshots2[src] || []).then(() => {
                delete screenshots2[src];
                page.close();
              });
              return;
            };
            page.on("pageerror", (err) => {
              logs.writeExitCode(-1, err);
              console.log(
                ansiColors.red(
                  `web ! ${src} failed to execute No "tests.json" file was generated. Check ${reportDest}/error.log for more info`
                )
              );
              this.bddTestIsNowDone(src, -1);
              close();
            });
            await page.goto(`file://${`${destFolder}.html`}`, {});
            await page.evaluate(webEvaluator(d, webArgz)).then(async ({ fails, failed, features }) => {
              statusMessagePretty(fails, src, "web");
              this.bddTestIsNowDone(src, fails);
            }).catch((e) => {
              console.log(ansiC3.red(ansiC3.inverse(e.stack)));
              console.log(
                ansiC3.red(
                  ansiC3.inverse(
                    `web ! ${src} failed to execute. No "tests.json" file was generated. Check logs for more info`
                  )
                )
              );
              this.bddTestIsNowDone(src, -1);
            }).finally(() => {
              close();
            });
            return page;
          });
        };
        this.launchPitono = async (src, dest) => {
          console.log(ansiC3.green(ansiC3.inverse(`pitono < ${src}`)));
          this.bddTestIsRunning(src);
          const reportDest = `testeranto/reports/${this.name}/${src.split(".").slice(0, -1).join(".")}/pitono`;
          if (!fs10.existsSync(reportDest)) {
            fs10.mkdirSync(reportDest, { recursive: true });
          }
          const logs = createLogStreams(reportDest, "node");
          try {
            const { PitonoRunner: PitonoRunner2 } = await Promise.resolve().then(() => (init_pitonoRunner(), pitonoRunner_exports));
            const runner = new PitonoRunner2(this.configs, this.name);
            await runner.run();
            this.bddTestIsNowDone(src, 0);
            statusMessagePretty(0, src, "pitono");
          } catch (error) {
            logs.writeExitCode(-1, error);
            console.log(
              ansiC3.red(
                ansiC3.inverse(
                  `${src} errored with: ${error}. Check logs for more info`
                )
              )
            );
            this.bddTestIsNowDone(src, -1);
            statusMessagePretty(-1, src, "pitono");
          }
        };
        this.launchGolingvu = async (src, dest) => {
          throw "not yet implemented";
        };
        this.receiveFeaturesV2 = (reportDest, srcTest, platform) => {
          const featureDestination = path8.resolve(
            process.cwd(),
            "reports",
            "features",
            "strings",
            srcTest.split(".").slice(0, -1).join(".") + ".features.txt"
          );
          const testReportPath = `${reportDest}/tests.json`;
          if (!fs10.existsSync(testReportPath)) {
            console.error(`tests.json not found at: ${testReportPath}`);
            return;
          }
          const testReport = JSON.parse(fs10.readFileSync(testReportPath, "utf8"));
          if (testReport.tests) {
            testReport.tests.forEach((test) => {
              test.fullPath = path8.resolve(process.cwd(), srcTest);
            });
          }
          testReport.fullPath = path8.resolve(process.cwd(), srcTest);
          fs10.writeFileSync(testReportPath, JSON.stringify(testReport, null, 2));
          testReport.features.reduce(async (mm, featureStringKey) => {
            const accum = await mm;
            const isUrl = isValidUrl(featureStringKey);
            if (isUrl) {
              const u = new URL(featureStringKey);
              if (u.protocol === "file:") {
                const newPath = `${process.cwd()}/testeranto/features/internal/${path8.relative(
                  process.cwd(),
                  u.pathname
                )}`;
                accum.files.push(u.pathname);
              } else if (u.protocol === "http:" || u.protocol === "https:") {
                const newPath = `${process.cwd()}/testeranto/features/external/${u.hostname}${u.pathname}`;
                const body = await this.configs.featureIngestor(featureStringKey);
                writeFileAndCreateDir(newPath, body);
                accum.files.push(newPath);
              }
            } else {
              await fs10.promises.mkdir(path8.dirname(featureDestination), {
                recursive: true
              });
              accum.strings.push(featureStringKey);
            }
            return accum;
          }, Promise.resolve({ files: [], strings: [] })).then(({ files: files3, strings }) => {
            fs10.writeFileSync(
              `testeranto/reports/${this.name}/${srcTest.split(".").slice(0, -1).join(".")}/${platform}/featurePrompt.txt`,
              files3.map((f2) => {
                return `/read ${f2}`;
              }).join("\n")
            );
          });
          testReport.givens.forEach((g) => {
            if (g.failed === true) {
              this.summary[srcTest].failingFeatures[g.key] = g.features;
            }
          });
          this.writeBigBoard();
        };
        this.checkForShutdown = () => {
          this.checkQueue();
          console.log(
            ansiC3.inverse(
              `The following jobs are awaiting resources: ${JSON.stringify(
                this.queue
              )}`
            )
          );
          console.log(
            ansiC3.inverse(`The status of ports: ${JSON.stringify(this.ports)}`)
          );
          this.writeBigBoard();
          if (this.mode === "dev")
            return;
          let inflight = false;
          Object.keys(this.summary).forEach((k) => {
            if (this.summary[k].prompt === "?") {
              console.log(ansiC3.blue(ansiC3.inverse(`\u{1F555} prompt ${k}`)));
              inflight = true;
            }
          });
          Object.keys(this.summary).forEach((k) => {
            if (this.summary[k].runTimeErrors === "?") {
              console.log(ansiC3.blue(ansiC3.inverse(`\u{1F555} runTimeError ${k}`)));
              inflight = true;
            }
          });
          Object.keys(this.summary).forEach((k) => {
            if (this.summary[k].staticErrors === "?") {
              console.log(ansiC3.blue(ansiC3.inverse(`\u{1F555} staticErrors ${k}`)));
              inflight = true;
            }
          });
          Object.keys(this.summary).forEach((k) => {
            if (this.summary[k].typeErrors === "?") {
              console.log(ansiC3.blue(ansiC3.inverse(`\u{1F555} typeErrors ${k}`)));
              inflight = true;
            }
          });
          this.writeBigBoard();
          if (!inflight) {
            if (this.browser) {
              if (this.browser) {
                this.browser.disconnect().then(() => {
                  console.log(
                    ansiC3.inverse(`${this.name} has been tested. Goodbye.`)
                  );
                  process.exit();
                });
              }
            }
          }
        };
        this.launchers = {};
        this.ports = {};
        this.queue = [];
        this.configs.ports.forEach((element) => {
          this.ports[element] = "";
        });
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
      async start() {
        this.mapping().forEach(async ([command, func]) => {
          globalThis[command] = func;
        });
        if (!fs10.existsSync(`testeranto/reports/${this.name}`)) {
          fs10.mkdirSync(`testeranto/reports/${this.name}`);
        }
        try {
          this.browser = await puppeteer.launch(puppeteerConfigs);
        } catch (e) {
          console.error(e);
          console.error(
            "could not start chrome via puppeter. Check this path: ",
            executablePath2
          );
        }
        const {
          nodeEntryPoints,
          webEntryPoints,
          pureEntryPoints,
          pitonoEntryPoints
        } = getRunnables(this.configs.tests, this.name);
        [
          [
            nodeEntryPoints,
            this.launchNode,
            "node",
            (w) => {
              this.nodeMetafileWatcher = w;
            }
          ],
          [
            webEntryPoints,
            this.launchWeb,
            "web",
            (w) => {
              this.webMetafileWatcher = w;
            }
          ],
          [
            pureEntryPoints,
            this.launchPure,
            "pure",
            (w) => {
              this.importMetafileWatcher = w;
            }
          ],
          [
            pitonoEntryPoints,
            this.launchPitono,
            "pitono",
            (w) => {
              this.pitonoMetafileWatcher = w;
            }
          ]
        ].forEach(
          async ([eps, launcher, runtime, watcher]) => {
            let metafile;
            if (runtime === "pitono") {
              metafile = `./testeranto/metafiles/python/core.json`;
              const metafileDir = path8.dirname(metafile);
              if (!fs10.existsSync(metafileDir)) {
                fs10.mkdirSync(metafileDir, { recursive: true });
              }
            } else {
              metafile = `./testeranto/metafiles/${runtime}/${this.name}.json`;
            }
            if (runtime !== "pitono") {
              await pollForFile(metafile);
            }
            Object.entries(eps).forEach(
              async ([inputFile, outputFile]) => {
                this.launchers[inputFile] = () => launcher(inputFile, outputFile);
                this.launchers[inputFile]();
                try {
                  watch(outputFile, async (e, filename) => {
                    const hash = await fileHash(outputFile);
                    if (fileHashes[inputFile] !== hash) {
                      fileHashes[inputFile] = hash;
                      console.log(
                        ansiC3.yellow(ansiC3.inverse(`< ${e} ${filename}`))
                      );
                      this.launchers[inputFile]();
                    }
                  });
                } catch (e) {
                  console.error(e);
                }
              }
            );
            this.metafileOutputs(runtime);
            if (runtime === "pitono") {
              const checkFileExists = () => {
                if (fs10.existsSync(metafile)) {
                  console.log(
                    ansiC3.green(ansiC3.inverse(`Pitono metafile found: ${metafile}`))
                  );
                  watcher(
                    watch(metafile, async (e, filename) => {
                      console.log(
                        ansiC3.yellow(
                          ansiC3.inverse(`< ${e} ${filename} (${runtime})`)
                        )
                      );
                      this.metafileOutputs(runtime);
                    })
                  );
                  this.metafileOutputs(runtime);
                } else {
                  setTimeout(checkFileExists, 1e3);
                }
              };
              checkFileExists();
            } else {
              if (fs10.existsSync(metafile)) {
                watcher(
                  watch(metafile, async (e, filename) => {
                    console.log(
                      ansiC3.yellow(ansiC3.inverse(`< ${e} ${filename} (${runtime})`))
                    );
                    this.metafileOutputs(runtime);
                  })
                );
              }
            }
          }
        );
      }
      async stop() {
        console.log(ansiC3.inverse("Testeranto-Run is shutting down gracefully..."));
        this.mode = "once";
        this.nodeMetafileWatcher.close();
        this.webMetafileWatcher.close();
        this.importMetafileWatcher.close();
        if (this.pitonoMetafileWatcher) {
          this.pitonoMetafileWatcher.close();
        }
        Object.values(this.logStreams || {}).forEach((logs) => logs.closeAll());
        this.wss.close(() => {
          console.log("WebSocket server closed");
        });
        this.clients.forEach((client) => {
          client.terminate();
        });
        this.clients.clear();
        this.httpServer.close(() => {
          console.log("HTTP server closed");
        });
        this.checkForShutdown();
      }
      async metafileOutputs(platform) {
        let metafilePath;
        if (platform === "pitono") {
          metafilePath = `./testeranto/metafiles/python/core.json`;
        } else {
          metafilePath = `./testeranto/metafiles/${platform}/${this.name}.json`;
        }
        if (!fs10.existsSync(metafilePath)) {
          if (platform === "pitono") {
            console.log(
              ansiC3.yellow(
                ansiC3.inverse(`Pitono metafile not found yet: ${metafilePath}`)
              )
            );
          }
          return;
        }
        let metafile;
        try {
          const fileContent = fs10.readFileSync(metafilePath).toString();
          const parsedData = JSON.parse(fileContent);
          if (platform === "pitono") {
            metafile = parsedData.metafile || parsedData;
          } else {
            metafile = parsedData.metafile;
          }
          if (!metafile) {
            console.log(
              ansiC3.yellow(ansiC3.inverse(`No metafile found in ${metafilePath}`))
            );
            return;
          }
        } catch (error) {
          console.error(`Error reading metafile at ${metafilePath}:`, error);
          return;
        }
        const outputs = metafile.outputs;
        Object.keys(outputs).forEach(async (k) => {
          const pattern = `testeranto/bundles/${platform}/${this.name}/${this.configs.src}`;
          if (!k.startsWith(pattern)) {
            return false;
          }
          const addableFiles = Object.keys(outputs[k].inputs).filter((i) => {
            if (!fs10.existsSync(i))
              return false;
            if (i.startsWith("node_modules"))
              return false;
            if (i.startsWith("./node_modules"))
              return false;
            return true;
          });
          const f2 = `${k.split(".").slice(0, -1).join(".")}/`;
          if (!fs10.existsSync(f2)) {
            fs10.mkdirSync(f2);
          }
          const entrypoint = outputs[k].entryPoint;
          if (entrypoint) {
            const changeDigest = await filesHash(addableFiles);
            if (changeDigest === changes[entrypoint]) {
            } else {
              changes[entrypoint] = changeDigest;
              this.tscCheck({
                platform,
                addableFiles,
                entrypoint
              });
              this.eslintCheck(entrypoint, platform, addableFiles);
              this.makePrompt(entrypoint, addableFiles, platform);
            }
          }
        });
      }
      // this method is so horrible. Don't drink and vibe-code kids
      requestHandler(req, res) {
        const parsedUrl = url2.parse(req.url || "/");
        let pathname = parsedUrl.pathname || "/";
        if (pathname === "/") {
          pathname = "/index.html";
        }
        let filePath = pathname.substring(1);
        if (filePath.startsWith("reports/")) {
          filePath = `testeranto/${filePath}`;
        } else if (filePath.startsWith("metafiles/")) {
          filePath = `testeranto/${filePath}`;
        } else if (filePath === "projects.json") {
          filePath = `testeranto/${filePath}`;
        } else {
          const possiblePaths = [
            `dist/${filePath}`,
            `testeranto/dist/${filePath}`,
            `../dist/${filePath}`,
            `./${filePath}`
          ];
          let foundPath = null;
          for (const possiblePath of possiblePaths) {
            if (fs10.existsSync(possiblePath)) {
              foundPath = possiblePath;
              break;
            }
          }
          if (foundPath) {
            filePath = foundPath;
          } else {
            const indexPath = this.findIndexHtml();
            if (indexPath) {
              fs10.readFile(indexPath, (err, data) => {
                if (err) {
                  res.writeHead(404, { "Content-Type": "text/plain" });
                  res.end("404 Not Found");
                  return;
                }
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
              });
              return;
            } else {
              res.writeHead(404, { "Content-Type": "text/plain" });
              res.end("404 Not Found");
              return;
            }
          }
        }
        fs10.exists(filePath, (exists) => {
          if (!exists) {
            if (!pathname.includes(".") && pathname !== "/") {
              const indexPath = this.findIndexHtml();
              if (indexPath) {
                fs10.readFile(indexPath, (err, data) => {
                  if (err) {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end("404 Not Found");
                    return;
                  }
                  res.writeHead(200, { "Content-Type": "text/html" });
                  res.end(data);
                });
                return;
              } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(`
              <html>
                <body>
                  <h1>Testeranto is running</h1>
                  <p>Frontend files are not built yet. Run 'npm run build' to build the frontend.</p>
                </body>
              </html>
            `);
                return;
              }
            }
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404 Not Found");
            return;
          }
          fs10.readFile(filePath, (err, data) => {
            if (err) {
              res.writeHead(500, { "Content-Type": "text/plain" });
              res.end("500 Internal Server Error");
              return;
            }
            const mimeType = mime2.lookup(filePath) || "application/octet-stream";
            res.writeHead(200, { "Content-Type": mimeType });
            res.end(data);
          });
        });
      }
      // this method is also horrible
      findIndexHtml() {
        const possiblePaths = [
          "dist/index.html",
          "testeranto/dist/index.html",
          "../dist/index.html",
          "./index.html"
        ];
        for (const path12 of possiblePaths) {
          if (fs10.existsSync(path12)) {
            return path12;
          }
        }
        return null;
      }
      broadcast(message) {
        const data = typeof message === "string" ? message : JSON.stringify(message);
        this.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send(data);
          }
        });
      }
      checkQueue() {
        const x = this.queue.pop();
        if (!x) {
          ansiC3.inverse(`The following queue is empty`);
          return;
        }
        const test = this.configs.tests.find((t) => t[0] === x);
        if (!test)
          throw `test is undefined ${x}`;
        this.launchers[test[0]]();
      }
    };
  }
});

// src/utils/golingvuMetafile.ts
var golingvuMetafile_exports = {};
__export(golingvuMetafile_exports, {
  generateGolangMetafile: () => generateGolangMetafile,
  writeGolangMetafile: () => writeGolangMetafile
});
import fs11 from "fs";
import path9 from "path";
async function generateGolangMetafile(testName2, entryPoints) {
  const outputs = {};
  for (const entryPoint of entryPoints) {
    try {
      const entryDir = path9.dirname(entryPoint);
      const goFiles = fs11.readdirSync(entryDir).filter((file) => file.endsWith(".go")).map((file) => path9.join(entryDir, file));
      const inputs = {};
      let totalBytes = 0;
      for (const file of goFiles) {
        try {
          const stats = fs11.statSync(file);
          inputs[file] = { bytesInOutput: stats.size };
          totalBytes += stats.size;
        } catch {
          inputs[file] = { bytesInOutput: 0 };
        }
      }
      if (!inputs[entryPoint]) {
        try {
          const entryStats = fs11.statSync(entryPoint);
          inputs[entryPoint] = { bytesInOutput: entryStats.size };
          totalBytes += entryStats.size;
        } catch {
          inputs[entryPoint] = { bytesInOutput: 0 };
        }
      }
      const outputPath = `testeranto/bundles/golang/${testName2}/${entryPoint}`;
      outputs[outputPath] = {
        entryPoint,
        // Use the source file path, not the bundle path
        inputs,
        bytes: totalBytes
      };
    } catch (error) {
      console.error(`Error processing Go entry point ${entryPoint}:`, error);
    }
  }
  const allInputs = {};
  const allGoFiles = /* @__PURE__ */ new Set();
  for (const entryPoint of entryPoints) {
    try {
      const entryDir = path9.dirname(entryPoint);
      const goFiles = fs11.readdirSync(entryDir).filter((file) => file.endsWith(".go")).map((file) => path9.join(entryDir, file));
      goFiles.forEach((file) => allGoFiles.add(file));
      allGoFiles.add(entryPoint);
    } catch (error) {
      console.error(`Error processing Go entry point ${entryPoint} for source files:`, error);
    }
  }
  for (const filePath of Array.from(allGoFiles)) {
    try {
      const stats = fs11.statSync(filePath);
      allInputs[filePath] = {
        bytes: stats.size,
        imports: []
        // Go files don't have imports like JS
      };
    } catch {
      allInputs[filePath] = {
        bytes: 0,
        imports: []
      };
    }
  }
  const esbuildOutputs = {};
  for (const [outputPath, output] of Object.entries(outputs)) {
    esbuildOutputs[outputPath] = {
      bytes: output.bytes,
      inputs: output.inputs,
      entryPoint: output.entryPoint
    };
  }
  return {
    errors: [],
    warnings: [],
    metafile: {
      inputs: allInputs,
      outputs: esbuildOutputs
    }
  };
}
function writeGolangMetafile(testName2, metafile) {
  const metafileDir = path9.join(
    process.cwd(),
    "testeranto",
    "metafiles",
    "golang"
  );
  fs11.mkdirSync(metafileDir, { recursive: true });
  const metafilePath = path9.join(metafileDir, `${testName2}.json`);
  fs11.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
}
var init_golingvuMetafile = __esm({
  "src/utils/golingvuMetafile.ts"() {
    "use strict";
  }
});

// src/utils/pitonoMetafile.ts
var pitonoMetafile_exports = {};
__export(pitonoMetafile_exports, {
  generatePitonoMetafile: () => generatePitonoMetafile,
  writePitonoMetafile: () => writePitonoMetafile
});
import fs12 from "fs";
import path10 from "path";
import { execSync as execSync2 } from "child_process";
async function generatePitonoMetafile(testName2, entryPoints) {
  return {
    testName: testName2,
    entryPoints,
    timestamp: Date.now()
  };
}
function writePitonoMetafile(testName2, metafile) {
  const metafilePath = path10.join(process.cwd(), "testeranto", "pitono", testName2, "metafile.json");
  const metafileDir = path10.dirname(metafilePath);
  if (!fs12.existsSync(metafileDir)) {
    fs12.mkdirSync(metafileDir, { recursive: true });
  }
  fs12.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
  console.log(`Pitono metafile written to: ${metafilePath}`);
  try {
    const command = `pitono-core-generator ${testName2} ${metafile.entryPoints.join(" ")}`;
    execSync2(command, { stdio: "inherit" });
    console.log(`Pitono core.json generated successfully for ${testName2}`);
  } catch (error) {
    console.error(`Failed to generate Pitono core.json with installed command: ${error}`);
    try {
      const pythonCommand = `python ${process.cwd()}/pitono/core_generator.py ${testName2} ${metafile.entryPoints.join(" ")}`;
      execSync2(pythonCommand, { stdio: "inherit" });
      console.log(`Pitono core.json generated successfully using direct Python execution`);
    } catch (fallbackError) {
      console.error(`Direct Python execution also failed: ${fallbackError}`);
      try {
        const coreData = {
          testName: testName2,
          entryPoints: metafile.entryPoints,
          outputs: {},
          metafile: {
            inputs: {},
            outputs: {}
          },
          timestamp: Date.now(),
          runtime: "pitono"
        };
        const coreFilePath = path10.join(process.cwd(), "testeranto", "pitono", testName2, "core.json");
        fs12.writeFileSync(coreFilePath, JSON.stringify(coreData, null, 2));
        console.log(`Pitono core.json created manually as fallback`);
      } catch (manualError) {
        console.error(`Even manual creation failed: ${manualError}`);
      }
    }
  }
}
var init_pitonoMetafile = __esm({
  "src/utils/pitonoMetafile.ts"() {
    "use strict";
  }
});

// src/testeranto.ts
init_utils();
import ansiC4 from "ansi-colors";
import fs13 from "fs";
import path11 from "path";
import readline from "readline";
import esbuild from "esbuild";

// src/utils/buildTemplates.ts
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

// src/esbuildConfigs/index.ts
var esbuildConfigs_default = (config) => {
  return {
    // packages: "external",
    target: "esnext",
    format: "esm",
    splitting: true,
    outExtension: { ".js": ".mjs" },
    outbase: ".",
    jsx: "transform",
    bundle: true,
    minify: config.minify === true,
    write: true,
    loader: {
      ".js": "jsx",
      ".png": "binary",
      ".jpg": "binary"
    }
  };
};

// src/esbuildConfigs/inputFilesPlugin.ts
import fs from "fs";
var otherInputs = {};
var register = (entrypoint, sources) => {
  if (!otherInputs[entrypoint]) {
    otherInputs[entrypoint] = /* @__PURE__ */ new Set();
  }
  sources.forEach((s) => otherInputs[entrypoint].add(s));
};
var inputFilesPlugin_default = (platform, testName2) => {
  const f2 = `testeranto/metafiles/${platform}/${testName2}.json`;
  if (!fs.existsSync(`testeranto/metafiles/${platform}`)) {
    fs.mkdirSync(`testeranto/metafiles/${platform}`, { recursive: true });
  }
  return {
    register,
    inputFilesPluginFactory: {
      name: "metafileWriter",
      setup(build) {
        build.onEnd((result) => {
          fs.writeFileSync(f2, JSON.stringify(result, null, 2));
        });
      }
    }
  };
};

// src/esbuildConfigs/featuresPlugin.ts
import path2 from "path";
var featuresPlugin_default = {
  name: "feature-markdown",
  setup(build) {
    build.onResolve({ filter: /\.md$/ }, (args) => {
      if (args.resolveDir === "")
        return;
      return {
        path: path2.isAbsolute(args.path) ? args.path : path2.join(args.resolveDir, args.path),
        namespace: "feature-markdown"
      };
    });
    build.onLoad(
      { filter: /.*/, namespace: "feature-markdown" },
      async (args) => {
        return {
          contents: `file://${args.path}`,
          loader: "text"
          // contents: JSON.stringify({ path: args.path }),
          // loader: "json",
          // contents: JSON.stringify({
          //   // html: markdownHTML,
          //   raw: markdownContent,
          //   filename: args.path, //path.basename(args.path),
          // }),
          // loader: "json",
        };
      }
    );
  }
};

// src/esbuildConfigs/rebuildPlugin.ts
import fs2 from "fs";
var rebuildPlugin_default = (r) => {
  return {
    name: "rebuild-notify",
    setup: (build) => {
      build.onEnd((result) => {
        console.log(`${r} > build ended with ${result.errors.length} errors`);
        if (result.errors.length > 0) {
          fs2.writeFileSync(
            `./testeranto/reports${r}_build_errors`,
            JSON.stringify(result, null, 2)
          );
        }
      });
    }
  };
};

// src/esbuildConfigs/node.ts
var node_default = (config, entryPoints, testName2) => {
  const { inputFilesPluginFactory, register: register2 } = inputFilesPlugin_default(
    "node",
    testName2
  );
  return {
    ...esbuildConfigs_default(config),
    splitting: true,
    outdir: `testeranto/bundles/node/${testName2}/`,
    inject: [`./node_modules/testeranto/dist/cjs-shim.js`],
    metafile: true,
    supported: {
      "dynamic-import": true
    },
    define: {
      "process.env.FLUENTFFMPEG_COV": "0"
    },
    absWorkingDir: process.cwd(),
    banner: {
      js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`
    },
    platform: "node",
    external: ["react", ...config.externals],
    entryPoints: [...entryPoints],
    plugins: [
      featuresPlugin_default,
      inputFilesPluginFactory,
      rebuildPlugin_default("node"),
      ...config.nodePlugins.map((p) => p(register2, entryPoints)) || []
    ]
  };
};

// src/esbuildConfigs/web.ts
import { polyfillNode } from "esbuild-plugin-polyfill-node";
import path3 from "path";
var web_default = (config, entryPoints, testName2) => {
  const { inputFilesPluginFactory, register: register2 } = inputFilesPlugin_default(
    "web",
    testName2
  );
  return {
    ...esbuildConfigs_default(config),
    treeShaking: true,
    outdir: `testeranto/bundles/web/${testName2}`,
    alias: {
      react: path3.resolve("./node_modules/react")
    },
    metafile: true,
    external: [
      "path",
      "fs",
      "stream",
      "http",
      "constants",
      "net",
      "assert",
      "tls",
      "os",
      "child_process",
      "readline",
      "zlib",
      "crypto",
      "https",
      "util",
      "process",
      "dns"
    ],
    platform: "browser",
    entryPoints: [...entryPoints],
    loader: config.webLoaders,
    plugins: [
      featuresPlugin_default,
      inputFilesPluginFactory,
      polyfillNode({
        // You might need to configure specific Node.js modules you want to polyfill
        // Example:
        // modules: {
        //   'util': true,
        //   'fs': false,
        // }
      }),
      rebuildPlugin_default("web"),
      ...(config.webPlugins || []).map((p) => p(register2, entryPoints)) || []
    ]
  };
};

// src/esbuildConfigs/pure.ts
import { isBuiltin } from "node:module";

// src/esbuildConfigs/consoleDetectorPlugin.ts
import fs3 from "fs";
var consoleDetectorPlugin = {
  name: "console-detector",
  setup(build) {
    build.onLoad({ filter: /\.(js|ts)$/ }, async (args) => {
      const contents = await fs3.promises.readFile(args.path, "utf8");
      const consolePattern = /console\.(log|error|warn|info|debug|trace|dir|dirxml|table|group|groupEnd|clear|count|countReset|assert|profile|profileEnd|time|timeLog|timeEnd|timeStamp|context|memory)/g;
      const matches = contents.match(consolePattern);
      if (matches) {
        const uniqueMethods = [...new Set(matches)];
        return {
          warnings: uniqueMethods.map((method) => ({
            text: `call of "${method}" was detected, which is not supported in the pure runtime.`
            // location: {
            //   file: args.path,
            //   line:
            //     contents
            //       .split("\n")
            //       .findIndex((line) => line.includes(method)) + 1,
            //   column: 0,
            // },
          }))
        };
      }
      return null;
    });
    build.onEnd((buildResult) => {
      if (buildResult.warnings.find((br) => br.pluginName === "console-detector"))
        console.warn(
          `Warning: An unsupported method call was detected in a source file used to build for the pure runtime. It is possible that this method call is in a comment block. If you really want to use this function, change this test to the "node" runtime.`
        );
    });
  }
};

// src/esbuildConfigs/pure.ts
var pure_default = (config, entryPoints, testName2) => {
  const { inputFilesPluginFactory, register: register2 } = inputFilesPlugin_default(
    "pure",
    testName2
  );
  return {
    ...esbuildConfigs_default(config),
    drop: [],
    splitting: true,
    outdir: `testeranto/bundles/pure/${testName2}/`,
    // inject: [`./node_modules/testeranto/dist/cjs-shim.js`],
    metafile: true,
    supported: {
      "dynamic-import": true
    },
    define: {
      "process.env.FLUENTFFMPEG_COV": "0"
    },
    absWorkingDir: process.cwd(),
    banner: {
      js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`
    },
    platform: "node",
    external: ["react", ...config.externals],
    entryPoints: [...entryPoints],
    plugins: [
      featuresPlugin_default,
      inputFilesPluginFactory,
      consoleDetectorPlugin,
      // nativeImportDetectorPlugin,
      {
        name: "native-node-import-filter",
        setup(build) {
          build.onResolve({ filter: /fs/ }, (args) => {
            if (isBuiltin(args.path)) {
              throw new Error(
                `You attempted to import a node module "${args.path}" into a "pure" test, which is not allowed. If you really want to use this package, convert this test from "pure" to "node"`
              );
            }
            return { path: args.path };
          });
        }
      },
      rebuildPlugin_default("pure"),
      ...(config.nodePlugins || []).map((p) => p(register2, entryPoints)) || []
    ]
  };
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
var testName = process.argv[2];
var mode = process.argv[3];
if (mode !== "once" && mode !== "dev") {
  console.error(`The 3rd argument should be 'dev' or 'once', not '${mode}'.`);
  process.exit(-1);
}
var f = process.cwd() + "/testeranto.config.ts";
console.log("config file:", f);
import(f).then(async (module) => {
  const pckge = (await import(`${process.cwd()}/package.json`)).default;
  const bigConfig = module.default;
  const project = bigConfig.projects[testName];
  if (!project) {
    console.error("no project found for", testName, "in testeranto.config.ts");
    process.exit(-1);
  }
  fs13.writeFileSync(
    `${process.cwd()}/testeranto/projects.json`,
    JSON.stringify(Object.keys(bigConfig.projects), null, 2)
  );
  const rawConfig = bigConfig.projects[testName];
  if (!rawConfig) {
    console.error(`Project "${testName}" does not exist in the configuration.`);
    console.error("Available projects:", Object.keys(bigConfig.projects));
    process.exit(-1);
  }
  if (!rawConfig.tests) {
    console.error(testName, "appears to have no tests: ", f);
    console.error(`here is the config:`);
    console.log(JSON.stringify(rawConfig));
    process.exit(-1);
  }
  const config = {
    ...rawConfig,
    buildDir: process.cwd() + "/testeranto/bundles/" + testName
  };
  console.log(ansiC4.inverse("Press 'q' to initiate a graceful shutdown."));
  console.log(ansiC4.inverse("Press 'x' to quit forcefully."));
  process.stdin.on("keypress", (str, key) => {
    if (key.name === "x") {
      console.log(ansiC4.inverse("Shutting down forcefully..."));
      process.exit(-1);
    }
  });
  let nodeDone = false;
  let webDone = false;
  let importDone = false;
  let golangDone = false;
  let pitonoDone = false;
  let status = "build";
  const {
    nodeEntryPoints,
    nodeEntryPointSidecars,
    webEntryPoints,
    webEntryPointSidecars,
    pureEntryPoints,
    pureEntryPointSidecars
  } = getRunnables(config.tests, testName);
  const onNodeDone = () => {
    nodeDone = true;
    onDone();
  };
  const onWebDone = () => {
    webDone = true;
    onDone();
  };
  const onImportDone = () => {
    importDone = true;
    onDone();
  };
  const onGolangDone = () => {
    golangDone = true;
    onDone();
  };
  const onPitonoDone = () => {
    pitonoDone = true;
    onDone();
  };
  let pm = null;
  const onDone = async () => {
    const hasGolangTests2 = config.tests.some((test) => test[1] === "golang");
    const hasPitonoTests2 = config.tests.some((test) => test[1] === "pitono");
    const allDone = nodeDone && webDone && importDone && (!hasGolangTests2 || golangDone) && (!hasPitonoTests2 || pitonoDone);
    if (allDone) {
      status = "built";
      if (!pm) {
        const { PM_Main: PM_Main2 } = await init_main().then(() => main_exports);
        pm = new PM_Main2(config, testName, mode);
        await pm.start();
      }
    }
    if (allDone && mode === "once") {
      console.log(
        ansiC4.inverse(
          `${testName} was built and the builder exited successfully.`
        )
      );
    }
  };
  fs13.writeFileSync(`${process.cwd()}/testeranto/projects.html`, AppHtml());
  Object.keys(bigConfig.projects).forEach((projectName) => {
    console.log(`testeranto/reports/${projectName}`);
    if (!fs13.existsSync(`testeranto/reports/${projectName}`)) {
      fs13.mkdirSync(`testeranto/reports/${projectName}`);
    }
    fs13.writeFileSync(
      `testeranto/reports/${projectName}/config.json`,
      JSON.stringify(config, null, 2)
    );
  });
  const getSecondaryEndpointsPoints = (runtime) => {
    const meta = (ts2, st) => {
      ts2.forEach((t) => {
        if (t[1] === runtime) {
          st.add(t[0]);
        }
        if (Array.isArray(t[3])) {
          meta(t[3], st);
        }
      });
      return st;
    };
    return Array.from(meta(config.tests, /* @__PURE__ */ new Set()));
  };
  [...getSecondaryEndpointsPoints("pitono")].forEach(async (sourceFilePath) => {
    console.log(`Pitono test found: ${sourceFilePath}`);
  });
  const golangTests = config.tests.filter((test) => test[1] === "golang");
  const hasGolangTests = golangTests.length > 0;
  if (hasGolangTests) {
    const { generateGolangMetafile: generateGolangMetafile2, writeGolangMetafile: writeGolangMetafile2 } = await Promise.resolve().then(() => (init_golingvuMetafile(), golingvuMetafile_exports));
    const golangEntryPoints = golangTests.map((test) => test[0]);
    const metafile = await generateGolangMetafile2(testName, golangEntryPoints);
    writeGolangMetafile2(testName, metafile);
    onGolangDone();
  }
  const pitonoTests = config.tests.filter((test) => test[1] === "pitono");
  const hasPitonoTests = pitonoTests.length > 0;
  if (hasPitonoTests) {
    const { generatePitonoMetafile: generatePitonoMetafile2 } = await Promise.resolve().then(() => (init_pitonoMetafile(), pitonoMetafile_exports));
    const pitonoEntryPoints = pitonoTests.map((test) => test[0]);
    const metafile = await generatePitonoMetafile2(testName, pitonoEntryPoints);
    const pitonoMetafilePath = `${process.cwd()}/testeranto/metafiles/python`;
    await fs13.promises.mkdir(pitonoMetafilePath, { recursive: true });
    fs13.writeFileSync(
      `${pitonoMetafilePath}/core.json`,
      JSON.stringify(metafile, null, 2)
    );
    onPitonoDone();
  }
  Promise.resolve(
    Promise.all(
      [...getSecondaryEndpointsPoints("web")].map(async (sourceFilePath) => {
        const sourceFileSplit = sourceFilePath.split("/");
        const sourceDir = sourceFileSplit.slice(0, -1);
        const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
        const sourceFileNameMinusJs = sourceFileName.split(".").slice(0, -1).join(".");
        const htmlFilePath = path11.normalize(
          `${process.cwd()}/testeranto/bundles/web/${testName}/${sourceDir.join(
            "/"
          )}/${sourceFileNameMinusJs}.html`
        );
        const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
        const cssFilePath = `./${sourceFileNameMinusJs}.css`;
        return fs13.promises.mkdir(path11.dirname(htmlFilePath), { recursive: true }).then(
          (x2) => fs13.writeFileSync(
            htmlFilePath,
            web_html_default(jsfilePath, htmlFilePath, cssFilePath)
          )
        );
      })
    )
  );
  const x = [
    ["pure", Object.keys(pureEntryPoints)],
    ["node", Object.keys(nodeEntryPoints)],
    ["web", Object.keys(webEntryPoints)]
  ];
  x.forEach(async ([runtime, keys]) => {
    keys.forEach(async (k) => {
      const folder = `testeranto/reports/${testName}/${k.split(".").slice(0, -1).join(".")}/${runtime}`;
      await fs13.mkdirSync(folder, { recursive: true });
    });
  });
  [
    [pureEntryPoints, pureEntryPointSidecars, "pure"],
    [webEntryPoints, webEntryPointSidecars, "web"],
    [nodeEntryPoints, nodeEntryPointSidecars, "node"]
  ].forEach(
    ([eps, eps2, runtime]) => {
      [...Object.keys(eps), ...Object.keys(eps2)].forEach((ep) => {
        const fp = path11.resolve(
          `testeranto`,
          `reports`,
          testName,
          ep.split(".").slice(0, -1).join("."),
          runtime
        );
        fs13.mkdirSync(fp, { recursive: true });
      });
    }
  );
  await Promise.all([
    ...[
      [
        pure_default,
        pureEntryPoints,
        pureEntryPointSidecars,
        onImportDone
      ],
      [
        node_default,
        nodeEntryPoints,
        nodeEntryPointSidecars,
        onNodeDone
      ],
      [web_default, webEntryPoints, webEntryPointSidecars, onWebDone]
    ].map(([configer, entryPoints, sidecars, done]) => {
      esbuild.context(
        configer(
          config,
          [...Object.keys(entryPoints), ...Object.keys(sidecars)],
          testName
        )
      ).then(async (ctx) => {
        if (mode === "dev") {
          await ctx.watch().then((v) => {
            done();
          });
        } else {
          ctx.rebuild().then((v) => {
            done();
          });
        }
        return ctx;
      });
    })
  ]);
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
