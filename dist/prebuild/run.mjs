import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/run.ts
import ansiC3 from "ansi-colors";
import readline from "readline";

// src/PM/main.ts
import { spawn } from "node:child_process";
import ansiColors from "ansi-colors";
import net from "net";
import fs4, { watch } from "fs";
import path4 from "path";
import puppeteer from "puppeteer-core";
import ansiC2 from "ansi-colors";
import crypto from "node:crypto";

// src/utils.ts
import path from "path";
var tscPather = (entryPoint, platform, projectName2) => {
  return path.join(
    "testeranto",
    "reports",
    projectName2,
    entryPoint.split(".").slice(0, -1).join("."),
    platform,
    `type_errors.txt`
  );
};
var lintPather = (entryPoint, platform, projectName2) => {
  return path.join(
    "testeranto",
    "reports",
    projectName2,
    entryPoint.split(".").slice(0, -1).join("."),
    platform,
    `lint_errors.txt`
  );
};
var promptPather = (entryPoint, platform, projectName2) => {
  return path.join(
    "testeranto",
    "reports",
    projectName2,
    entryPoint.split(".").slice(0, -1).join("."),
    platform,
    `prompt.txt`
  );
};
var getRunnables = (tests, projectName2, payload = {
  nodeEntryPoints: {},
  nodeEntryPointSidecars: {},
  webEntryPoints: {},
  webEntryPointSidecars: {},
  pureEntryPoints: {},
  pureEntryPointSidecars: {}
}) => {
  return tests.reduce((pt, cv, cndx, cry) => {
    if (cv[1] === "node") {
      pt.nodeEntryPoints[cv[0]] = path.resolve(
        `./testeranto/bundles/node/${projectName2}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    } else if (cv[1] === "web") {
      pt.webEntryPoints[cv[0]] = path.resolve(
        `./testeranto/bundles/web/${projectName2}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    } else if (cv[1] === "pure") {
      pt.pureEntryPoints[cv[0]] = path.resolve(
        `./testeranto/bundles/pure/${projectName2}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    }
    cv[3].filter((t) => t[1] === "node").forEach((t) => {
      pt.nodeEntryPointSidecars[`${t[0]}`] = path.resolve(
        `./testeranto/bundles/node/${projectName2}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    });
    cv[3].filter((t) => t[1] === "web").forEach((t) => {
      pt.webEntryPointSidecars[`${t[0]}`] = path.resolve(
        `./testeranto/bundles/web/${projectName2}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    });
    cv[3].filter((t) => t[1] === "pure").forEach((t) => {
      pt.pureEntryPointSidecars[`${t[0]}`] = path.resolve(
        `./testeranto/bundles/pure/${projectName2}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    });
    return pt;
  }, payload);
};

// src/utils/queue.ts
var Queue = class {
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

// src/PM/PM_WithEslintAndTsc.ts
import ts from "typescript";
import fs3 from "fs";
import ansiC from "ansi-colors";
import { ESLint } from "eslint";
import tsc from "tsc-prog";

// src/PM/base.ts
import fs from "fs";
import path2 from "path";
var fileStreams3 = [];
var fPaths = [];
var files = {};
var recorders = {};
var screenshots = {};
var PM_Base = class {
  constructor(configs) {
    this.configs = configs;
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
    const dir = path2.dirname(p);
    fs.mkdirSync(dir, {
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
    const dir = path2.dirname(p);
    fs.mkdirSync(dir, {
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
    return fs.existsSync(destFolder);
  }
  async mkdirSync(fp) {
    if (!fs.existsSync(fp)) {
      return fs.mkdirSync(fp, {
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
      fs.mkdirSync(path2.dirname(filepath), {
        recursive: true
      });
      if (!files[testName]) {
        files[testName] = /* @__PURE__ */ new Set();
      }
      files[testName].add(filepath);
      await fs.writeFileSync(filepath, contents);
      res(true);
    });
  }
  async createWriteStream(filepath, testName) {
    const folder = filepath.split("/").slice(0, -1).join("/");
    return new Promise((res) => {
      if (!fs.existsSync(folder)) {
        return fs.mkdirSync(folder, {
          recursive: true
        });
      }
      const f = fs.createWriteStream(filepath);
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
          const cleanPath = path2.resolve(fPath);
          fPaths.push(cleanPath.replace(process.cwd(), ``));
          const targetDir = cleanPath.split("/").slice(0, -1).join("/");
          fs.mkdir(targetDir, { recursive: true }, async (error) => {
            if (error) {
              console.error(`\u2757\uFE0FtestArtiFactory failed`, targetDir, error);
            }
            fs.writeFileSync(
              path2.resolve(
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
              fs.writeFileSync(fPath, value, "binary");
              res();
            } else if (`string` === typeof value) {
              fs.writeFileSync(fPath, value.toString(), {
                encoding: "utf-8"
              });
              res();
            } else {
              const pipeStream = value;
              const myFile = fs.createWriteStream(fPath);
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

// src/utils/makePrompt.ts
import fs2 from "fs";
import path3 from "path";

// src/utils/logFiles.ts
var NODE_LOG_FILES = ["stdout.log", "stderr.log", "exit.log"];
var WEB_LOG_FILES = [
  "info.log",
  "debug.log",
  "error.log",
  "warn.log",
  "exit.log"
];
var PURE_LOG_FILES = ["exit.log"];
var getLogFilesForRuntime = (runtime) => {
  switch (runtime) {
    case "node":
      return NODE_LOG_FILES;
    case "web":
      return WEB_LOG_FILES;
    case "pure":
      return PURE_LOG_FILES;
    default:
      throw new Error(`Unknown runtime: ${runtime}`);
  }
};

// src/utils/makePrompt.ts
var makePrompt = async (summary, name, entryPoint, addableFiles, runtime) => {
  summary[entryPoint].prompt = "?";
  const promptPath = promptPather(entryPoint, runtime, name);
  const testDir = path3.join(
    "testeranto",
    "reports",
    name,
    entryPoint.split(".").slice(0, -1).join("."),
    runtime
  );
  if (!fs2.existsSync(testDir)) {
    fs2.mkdirSync(testDir, { recursive: true });
  }
  const testPaths = path3.join(testDir, "tests.json");
  const lintPath = path3.join(testDir, "lint_errors.txt");
  const typePath = path3.join(testDir, "type_errors.txt");
  const messagePath = path3.join(testDir, "message.txt");
  try {
    await Promise.all([
      fs2.promises.writeFile(
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
      fs2.promises.writeFile(
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
var makePromptInternal = (summary, name, entryPoint, addableFiles, runTime) => {
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

// src/PM/PM_WithEslintAndTsc.ts
var eslint = new ESLint();
var formatter = await eslint.loadFormatter(
  "./node_modules/testeranto/dist/prebuild/esbuildConfigs/eslint-formatter-testeranto.mjs"
);
var PM_WithEslintAndTsc = class extends PM_Base {
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
      fs3.writeFileSync(tscPath, results.join("\n"));
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
      if (fs3.existsSync(filepath))
        fs3.rmSync(filepath);
      const results = (await eslint.lintFiles(addableFiles)).filter((r) => r.messages.length).filter((r) => {
        return r.messages[0].ruleId !== null;
      }).map((r) => {
        delete r.source;
        return r;
      });
      fs3.writeFileSync(filepath, await formatter.format(results));
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
      fs3.writeFileSync(
        `./testeranto/reports/${this.name}/summary.json`,
        JSON.stringify(this.summary, null, 2)
      );
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

// src/PM/main.ts
var changes = {};
var fileHashes = {};
var files2 = {};
var screenshots2 = {};
function runtimeLogs(runtime, reportDest) {
  const safeDest = reportDest || `testeranto/reports/default_${Date.now()}`;
  try {
    if (!fs4.existsSync(safeDest)) {
      fs4.mkdirSync(safeDest, { recursive: true });
    }
    if (runtime === "node") {
      return {
        stdout: fs4.createWriteStream(`${safeDest}/stdout.log`),
        stderr: fs4.createWriteStream(`${safeDest}/stderr.log`),
        exit: fs4.createWriteStream(`${safeDest}/exit.log`)
      };
    } else if (runtime === "web") {
      return {
        info: fs4.createWriteStream(`${safeDest}/info.log`),
        warn: fs4.createWriteStream(`${safeDest}/warn.log`),
        error: fs4.createWriteStream(`${safeDest}/error.log`),
        debug: fs4.createWriteStream(`${safeDest}/debug.log`),
        exit: fs4.createWriteStream(`${safeDest}/exit.log`)
      };
    } else if (runtime === "pure") {
      return {
        exit: fs4.createWriteStream(`${safeDest}/exit.log`)
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
  if (!fs4.existsSync(reportDest)) {
    fs4.mkdirSync(reportDest, { recursive: true });
  }
  const streams = runtimeLogs(runtime, reportDest);
  const safeDest = reportDest || `testeranto/reports/default_${Date.now()}`;
  try {
    if (!fs4.existsSync(safeDest)) {
      fs4.mkdirSync(safeDest, { recursive: true });
    }
    const streams2 = runtimeLogs(runtime, safeDest);
    return {
      ...streams2,
      closeAll: () => {
        Object.values(streams2).forEach(
          (stream) => !stream.closed && stream.close()
        );
      },
      writeExitCode: (code, error) => {
        if (error) {
          streams2.exit.write(`Error: ${error.message}
`);
          if (error.stack) {
            streams2.exit.write(`Stack Trace:
${error.stack}
`);
          }
        }
        streams2.exit.write(`${code}
`);
      },
      exit: streams2.exit
    };
  } catch (e) {
    console.error(`Failed to create log streams in ${safeDest}:`, e);
    throw e;
  }
}
async function fileHash(filePath, algorithm = "md5") {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm);
    const fileStream = fs4.createReadStream(filePath);
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
async function writeFileAndCreateDir(filePath, data) {
  const dirPath = path4.dirname(filePath);
  try {
    await fs4.promises.mkdir(dirPath, { recursive: true });
    await fs4.writeFileSync(filePath, data);
  } catch (error) {
    console.error(`Error writing file: ${error}`);
  }
}
var filesHash = async (files3, algorithm = "md5") => {
  return new Promise((resolve, reject) => {
    resolve(
      files3.reduce(async (mm, f) => {
        return await mm + await fileHash(f);
      }, Promise.resolve(""))
    );
  });
};
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}
async function pollForFile(path5, timeout = 2e3) {
  const intervalObj = setInterval(function() {
    const file = path5;
    const fileExists = fs4.existsSync(file);
    if (fileExists) {
      clearInterval(intervalObj);
    }
  }, timeout);
}
var PM_Main = class extends PM_WithEslintAndTsc {
  constructor(configs, name, mode2) {
    super(configs, name, mode2);
    this.logStreams = {};
    this.sidecars = {};
    this.getRunnables = (tests, testName, payload = {
      nodeEntryPoints: {},
      nodeEntryPointSidecars: {},
      webEntryPoints: {},
      webEntryPointSidecars: {},
      pureEntryPoints: {},
      pureEntryPointSidecars: {}
    }) => {
      return getRunnables(tests, testName, payload);
    };
    this.launchPure = async (src, dest) => {
      console.log(ansiC2.green(ansiC2.inverse(`pure < ${src}`)));
      this.bddTestIsRunning(src);
      const reportDest = `testeranto/reports/${this.name}/${src.split(".").slice(0, -1).join(".")}/pure`;
      if (!fs4.existsSync(reportDest)) {
        fs4.mkdirSync(reportDest, { recursive: true });
      }
      const destFolder = dest.replace(".mjs", "");
      let argz2 = "";
      const testConfig = this.configs.tests.find((t) => {
        return t[0] === src;
      });
      if (!testConfig) {
        console.log(ansiC2.inverse("missing test config! Exiting ungracefully!"));
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
          const originalConsole = { ...console };
          return module.default.then((defaultModule) => {
            defaultModule.receiveTestResourceConfig(argz2).then(async (results) => {
              statusMessagePretty(results.fails, src, "pure");
              this.bddTestIsNowDone(src, results.fails);
            }).catch((e1) => {
              console.log(
                ansiC2.red(`launchPure - ${src} errored with: ${e1.stack}`)
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
          }).finally((x) => {
          });
        });
      } catch (e3) {
        logs.writeExitCode(-1, e3);
        console.log(
          ansiC2.red(
            ansiC2.inverse(
              `${src} 1 errored with: ${e3}. Check logs for more info`
            )
          )
        );
        logs.exit.write(e3.stack);
        logs.exit.write(-1);
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
      console.log(ansiC2.green(ansiC2.inverse(`node < ${src}`)));
      this.bddTestIsRunning(src);
      const reportDest = `testeranto/reports/${this.name}/${src.split(".").slice(0, -1).join(".")}/node`;
      if (!fs4.existsSync(reportDest)) {
        fs4.mkdirSync(reportDest, { recursive: true });
      }
      let testResources = "";
      const testConfig = this.configs.tests.find((t) => {
        return t[0] === src;
      });
      if (!testConfig) {
        console.log(
          ansiC2.inverse(`missing test config! Exiting ungracefully for '${src}'`)
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
            ansiC2.red(
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
      const child = spawn(
        "node",
        // "node",
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
            ansiC2.red(
              ansiC2.inverse(
                `${src} errored with: ${e.name}. Check error logs for more info`
              )
            )
          );
          this.bddTestIsNowDone(src, -1);
          statusMessagePretty(-1, src, "node");
        });
      });
    };
    this.launchWebSideCar = async (testConfig) => {
      const src = testConfig[0];
      const dest = src.split(".").slice(0, -1).join(".");
      const destFolder = dest.replace(".mjs", "");
      console.log(ansiC2.green(ansiC2.inverse(`launchWebSideCar ${src}`)));
      const logs = createLogStreams(dest, "web");
      return new Promise((res, rej) => {
        this.browser.newPage().then(async (page) => {
          this.mapping().forEach(async ([command, func]) => {
            page.exposeFunction(command, func);
          });
          const close = () => {
            if (!files2[src]) {
              files2[src] = /* @__PURE__ */ new Set();
            }
            delete files2[src];
            Promise.all(screenshots2[src] || []).then(() => {
              delete screenshots2[src];
              page.close();
            });
          };
          page.on("pageerror", (err) => {
            console.debug(`Error from ${src}: [${err.name}] `);
            console.debug(`Error from ${src}: [${err.name}] `);
            if (err.cause) {
              console.debug(`Error from ${src} cause: [${err.cause}] `);
            }
            if (err.stack) {
              console.debug(`Error from stack ${src}: [${err.stack}] `);
            }
            console.debug(`Error from message ${src}: [${err.message}] `);
            this.bddTestIsNowDone(src, -1);
            close();
          });
          page.on("console", (log) => {
            const msg = `${log.text()}
${JSON.stringify(
              log.location()
            )}
${JSON.stringify(log.stackTrace())}
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
          await page.goto(`file://${`${destFolder}.html`}`, {});
          const webArgz = JSON.stringify({
            name: dest,
            ports: [].toString(),
            fs: dest,
            browserWSEndpoint: this.browser.wsEndpoint()
          });
          const d = `${dest}?cacheBust=${Date.now()}`;
          const evaluation = `
    import('${d}').then(async (x) => {

      try {
        return await (await x.default).receiveTestResourceConfig(${webArgz})
      } catch (e) {
        console.log("fail", e.toString())
      }
    })`;
          await page.evaluate(evaluation).then(async ({ fails, failed, features }) => {
            statusMessagePretty(fails, src, "web");
            this.bddTestIsNowDone(src, fails);
          }).catch((e) => {
            console.log(
              ansiC2.red(
                ansiC2.inverse(`launchWebSidecar - ${src} errored with: ${e}`)
              )
            );
          }).finally(() => {
            this.bddTestIsNowDone(src, -1);
            close();
          });
          return page;
        }).then(async (page) => {
          await page.goto(`file://${`${dest}.html`}`, {});
          res([Math.random(), page]);
        });
      });
    };
    this.launchNodeSideCar = async (sidecar) => {
      const src = sidecar[0];
      const dest = process.cwd() + `/testeranto/bundles/node/${this.name}/${sidecar[0]}`;
      const d = dest + ".mjs";
      console.log(ansiC2.green(ansiC2.inverse(`launchNodeSideCar ${sidecar[0]}`)));
      const destFolder = dest.replace(".ts", "");
      const reportDest = `testeranto/reports/${this.name}/${src.split(".").slice(0, -1).join(".")}/node`;
      const argz2 = {
        name: sidecar[0],
        ports: [],
        fs: destFolder,
        browserWSEndpoint: this.browser.wsEndpoint()
      };
      const testReq = sidecar[2];
      const logs = createLogStreams(dest, "node");
      const portsToUse = [];
      if (testReq.ports === 0) {
      } else if (testReq.ports > 0) {
        const openPorts = Object.entries(this.ports).filter(
          ([portnumber, portopen]) => portopen === ""
        );
        if (openPorts.length >= testReq.ports) {
          for (let i = 0; i < testReq.ports; i++) {
            portsToUse.push(Number(openPorts[i][0]));
            this.ports[openPorts[i][0]] = src;
          }
          argz2.ports = portsToUse;
          const builtfile = destFolder + ".mjs";
          let haltReturns = false;
          let buffer = new Buffer("");
          const server = net.createServer((socket) => {
            socket.on("data", (data) => {
              buffer = Buffer.concat([buffer, data]);
              const messages = [];
              for (let b = 0; b < buffer.length + 1; b++) {
                const c = buffer.slice(0, b);
                let d2;
                try {
                  d2 = JSON.parse(c.toString());
                  messages.push(d2);
                  buffer = buffer.slice(b, buffer.length + 1);
                  b = 0;
                } catch (e) {
                }
              }
              messages.forEach(async (payload) => {
                this.mapping().forEach(async ([command, func]) => {
                  if (payload[0] === command) {
                    const x = payload.slice(1, -1);
                    const r2 = await this[command](...x);
                    if (!haltReturns) {
                      child.send(
                        JSON.stringify({
                          payload: r2,
                          key: payload[payload.length - 1]
                        })
                      );
                    }
                  }
                });
              });
            });
          });
          const child = spawn("node", [builtfile, JSON.stringify(argz2)], {
            stdio: ["pipe", "pipe", "pipe", "ipc"]
            // silent: true
          });
          const p = "/tmp/tpipe" + Math.random();
          server.listen(p, () => {
            child.on("close", (code) => {
              server.close();
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
              if (fs4.existsSync(p)) {
                fs4.rmSync(p);
              }
              haltReturns = true;
              console.log(
                ansiC2.red(
                  ansiC2.inverse(
                    `launchNodeSideCar - ${src} errored with: ${e.name}. Check logs for more info`
                  )
                )
              );
              logs.error?.write(e.toString() + "\n");
            });
          });
          child.send({ path: p });
          const r = Math.random();
          this.nodeSidecars[r] = child;
          return [r, argz2];
        } else {
          console.log(
            ansiC2.red(
              `cannot ${src} because there are no open ports. the job will be unqueued`
            )
          );
          this.queue.push(sidecar[0]);
          return [Math.random(), argz2];
        }
      } else {
        console.error("negative port makes no sense", sidecar[0]);
        process.exit(-1);
      }
    };
    this.stopPureSideCar = async (uid) => {
      console.log(ansiC2.green(ansiC2.inverse(`stopPureSideCar ${uid}`)));
      await this.sidecars[uid].shutdown();
      return;
    };
    this.launchPureSideCar = async (sidecar) => {
      console.log(ansiC2.green(ansiC2.inverse(`launchPureSideCar ${sidecar[0]}`)));
      const r = Math.random();
      const dest = process.cwd() + `/testeranto/bundles/pure/${this.name}/${sidecar[0]}`;
      const builtfile = dest.split(".").slice(0, -1).concat("mjs").join(".");
      const destFolder = dest.replace(".mjs", "");
      let argz2;
      const z = sidecar[2];
      const testConfigResource = sidecar[2];
      const src = sidecar[0];
      const portsToUse = [];
      if (testConfigResource.ports === 0) {
        argz2 = {
          // scheduled: true,
          name: src,
          ports: portsToUse,
          fs: destFolder,
          browserWSEndpoint: this.browser.wsEndpoint()
        };
      } else if (testConfigResource.ports > 0) {
        const openPorts = Object.entries(this.ports).filter(
          ([portnumber, portopen]) => portopen === ""
        );
        if (openPorts.length >= testConfigResource.ports) {
          for (let i = 0; i < testConfigResource.ports; i++) {
            portsToUse.push(Number(openPorts[i][0]));
            this.ports[openPorts[i][0]] = src;
          }
          argz2 = {
            // scheduled: true,
            name: src,
            // ports: [3333],
            ports: portsToUse,
            fs: ".",
            browserWSEndpoint: this.browser.wsEndpoint()
          };
        } else {
          this.queue.push(src);
        }
      } else {
        console.error("negative port makes no sense", src);
        process.exit(-1);
      }
      await import(`${builtfile}?cacheBust=${Date.now()}`).then((module) => {
        if (!this.pureSidecars)
          this.pureSidecars = {};
        this.pureSidecars[r] = module.default;
        this.pureSidecars[r].start(argz2);
      });
      return [r, argz2];
    };
    this.launchWeb = async (src, dest) => {
      console.log(ansiC2.green(ansiC2.inverse(`web < ${src}`)));
      this.bddTestIsRunning(src);
      const reportDest = `testeranto/reports/${this.name}/${src.split(".").slice(0, -1).join(".")}/web`;
      if (!fs4.existsSync(reportDest)) {
        fs4.mkdirSync(reportDest, { recursive: true });
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
        await page.evaluate(
          `
import('${d}').then(async (x) => {
  try {
    return await (await x.default).receiveTestResourceConfig(${webArgz})
  } catch (e) {
    console.log("web run failure", e.toString())
  }
})
`
        ).then(async ({ fails, failed, features }) => {
          statusMessagePretty(fails, src, "web");
          this.bddTestIsNowDone(src, fails);
        }).catch((e) => {
          console.log(ansiC2.red(ansiC2.inverse(e.stack)));
          console.log(
            ansiC2.red(
              ansiC2.inverse(
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
    this.receiveFeaturesV2 = (reportDest, srcTest, platform) => {
      const featureDestination = path4.resolve(
        process.cwd(),
        "reports",
        "features",
        "strings",
        srcTest.split(".").slice(0, -1).join(".") + ".features.txt"
      );
      const testReport = JSON.parse(
        fs4.readFileSync(`${reportDest}/tests.json`).toString()
      );
      testReport.features.reduce(async (mm, featureStringKey) => {
        const accum = await mm;
        const isUrl = isValidUrl(featureStringKey);
        if (isUrl) {
          const u = new URL(featureStringKey);
          if (u.protocol === "file:") {
            const newPath = `${process.cwd()}/testeranto/features/internal/${path4.relative(
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
          await fs4.promises.mkdir(path4.dirname(featureDestination), {
            recursive: true
          });
          accum.strings.push(featureStringKey);
        }
        return accum;
      }, Promise.resolve({ files: [], strings: [] })).then(({ files: files3, strings }) => {
        fs4.writeFileSync(
          `testeranto/reports/${this.name}/${srcTest.split(".").slice(0, -1).join(".")}/${platform}/featurePrompt.txt`,
          files3.map((f) => {
            return `/read ${f}`;
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
        ansiC2.inverse(
          `The following jobs are awaiting resources: ${JSON.stringify(
            this.queue
          )}`
        )
      );
      console.log(
        ansiC2.inverse(`The status of ports: ${JSON.stringify(this.ports)}`)
      );
      this.writeBigBoard();
      if (this.mode === "dev")
        return;
      let inflight = false;
      Object.keys(this.summary).forEach((k) => {
        if (this.summary[k].prompt === "?") {
          console.log(ansiC2.blue(ansiC2.inverse(`\u{1F555} prompt ${k}`)));
          inflight = true;
        }
      });
      Object.keys(this.summary).forEach((k) => {
        if (this.summary[k].runTimeErrors === "?") {
          console.log(ansiC2.blue(ansiC2.inverse(`\u{1F555} runTimeError ${k}`)));
          inflight = true;
        }
      });
      Object.keys(this.summary).forEach((k) => {
        if (this.summary[k].staticErrors === "?") {
          console.log(ansiC2.blue(ansiC2.inverse(`\u{1F555} staticErrors ${k}`)));
          inflight = true;
        }
      });
      Object.keys(this.summary).forEach((k) => {
        if (this.summary[k].typeErrors === "?") {
          console.log(ansiC2.blue(ansiC2.inverse(`\u{1F555} typeErrors ${k}`)));
          inflight = true;
        }
      });
      this.writeBigBoard();
      if (!inflight) {
        if (this.browser) {
          if (this.browser) {
            this.browser.disconnect().then(() => {
              console.log(
                ansiC2.inverse(`${this.name} has been tested. Goodbye.`)
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
    this.nodeSidecars = {};
    this.webSidecars = {};
    this.pureSidecars = {};
    this.configs.ports.forEach((element) => {
      this.ports[element] = "";
    });
  }
  async stopSideCar(uid) {
    console.log(ansiC2.green(ansiC2.inverse(`stopSideCar ${uid}`)));
    Object.entries(this.pureSidecars).forEach(async ([k, v]) => {
      if (Number(k) === uid) {
        await this.pureSidecars[Number(k)].stop();
        delete this.pureSidecars[Number(k)];
      }
    });
    Object.entries(this.nodeSidecars).forEach(async ([k, v]) => {
      if (Number(k) === uid) {
        await this.nodeSidecars[Number(k)].send("stop");
        delete this.nodeSidecars[Number(k)];
      }
    });
    Object.entries(this.webSidecars).forEach(async ([k, v]) => {
      if (Number(k) === uid) {
        (await this.browser.pages()).forEach(async (p) => {
          if (p.mainFrame()._id === k) {
            await this.webSidecars[Number(k)].close();
            delete this.webSidecars[Number(k)];
          }
        });
      }
    });
    return;
  }
  async launchSideCar(n, name) {
    const c = this.configs.tests.find(([v, r2]) => {
      return v === name;
    });
    const s = c[3][n];
    const r = s[1];
    if (r === "node") {
      return this.launchNodeSideCar(s);
    } else if (r === "web") {
      return this.launchWebSideCar(s);
    } else if (r === "pure") {
      return this.launchPureSideCar(s);
    } else {
      throw `unknown runtime ${r}`;
    }
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
      ["launchSideCar", this.launchSideCar.bind(this)],
      ["mkdirSync", this.mkdirSync],
      ["newPage", this.newPage],
      ["page", this.page],
      ["pages", this.pages],
      ["screencast", this.screencast],
      ["screencastStop", this.screencastStop],
      ["stopSideCar", this.stopSideCar.bind(this)],
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
    if (!fs4.existsSync(`testeranto/reports/${this.name}`)) {
      fs4.mkdirSync(`testeranto/reports/${this.name}`);
    }
    const executablePath = "/opt/homebrew/bin/chromium";
    try {
      this.browser = await puppeteer.launch({
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
      });
    } catch (e) {
      console.error(e);
      console.error(
        "could not start chrome via puppeter. Check this path: ",
        executablePath
      );
    }
    const { nodeEntryPoints, webEntryPoints, pureEntryPoints } = this.getRunnables(this.configs.tests, this.name);
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
      ]
    ].forEach(
      async ([eps, launcher, runtime, watcher]) => {
        const metafile = `./testeranto/metafiles/${runtime}/${this.name}.json`;
        await pollForFile(metafile);
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
                    ansiC2.yellow(ansiC2.inverse(`< ${e} ${filename}`))
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
        watcher(
          watch(metafile, async (e, filename) => {
            console.log(
              ansiC2.yellow(ansiC2.inverse(`< ${e} ${filename} (${runtime})`))
            );
            this.metafileOutputs(runtime);
          })
        );
      }
    );
  }
  // async launchExternalTest(
  //   externalTestName: string,
  //   externalTest: {
  //     watch: string[];
  //     exec: string;
  //   }
  // ) {
  //   // fs.mkdirSync(`testeranto/externalTests/${externalTestName}`);
  //   // exec(externalTest.exec, (error, stdout, stderr) => {
  //   //   if (error) {
  //   //     fs.writeFileSync(
  //   //       `testeranto/externalTests/${externalTestName}/exitcode.txt`,
  //   //       `${error.name}\n${error.message}\n${error.code}\n`
  //   //     );
  //   //   } else {
  //   //     fs.writeFileSync(
  //   //       `testeranto/externalTests/${externalTestName}/exitcode.txt`,
  //   //       `0`
  //   //     );
  //   //   }
  //   //   fs.writeFileSync(
  //   //     `testeranto/externalTests/${externalTestName}/stdout.txt`,
  //   //     stdout
  //   //   );
  //   //   fs.writeFileSync(
  //   //     `testeranto/externalTests/${externalTestName}/stderr.txt`,
  //   //     stderr
  //   //   );
  //   // });
  // }
  async stop() {
    console.log(ansiC2.inverse("Testeranto-Run is shutting down gracefully..."));
    this.mode = "once";
    this.nodeMetafileWatcher.close();
    this.webMetafileWatcher.close();
    this.importMetafileWatcher.close();
    Object.values(this.logStreams || {}).forEach((logs) => logs.closeAll());
    this.checkForShutdown();
  }
  async metafileOutputs(platform) {
    const metafile = JSON.parse(
      fs4.readFileSync(
        `./testeranto/metafiles/${platform}/${this.name}.json`
      ).toString()
    ).metafile;
    if (!metafile)
      return;
    const outputs = metafile.outputs;
    Object.keys(outputs).forEach(async (k) => {
      const pattern = `testeranto/bundles/${platform}/${this.name}/${this.configs.src}`;
      if (!k.startsWith(pattern)) {
        return false;
      }
      const addableFiles = Object.keys(outputs[k].inputs).filter((i) => {
        if (!fs4.existsSync(i))
          return false;
        if (i.startsWith("node_modules"))
          return false;
        if (i.startsWith("./node_modules"))
          return false;
        return true;
      });
      const f = `${k.split(".").slice(0, -1).join(".")}/`;
      if (!fs4.existsSync(f)) {
        fs4.mkdirSync(f);
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
  checkQueue() {
    const x = this.queue.pop();
    if (!x) {
      ansiC2.inverse(`The following queue is empty`);
      return;
    }
    const test = this.configs.tests.find((t) => t[0] === x);
    if (!test)
      throw `test is undefined ${x}`;
    this.launchers[test[0]]();
  }
};

// src/run.ts
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
console.log(ansiC3.inverse("Press 'q' to initiate a graceful shutdown."));
console.log(ansiC3.inverse("Press 'x' to quit forcefully."));
process.stdin.on("keypress", (str, key) => {
  if (key.name === "x") {
    console.log(ansiC3.inverse("Shutting down forcefully..."));
    process.exit(-1);
  }
});
var projectName = process.argv[2];
var mode = process.argv[3];
if (mode !== "once" && mode !== "dev") {
  console.error("the 2nd argument should be 'dev' or 'once' ");
  process.exit(-1);
}
import(process.cwd() + "/testeranto.config.ts").then(async (module) => {
  const bigConfig = module.default;
  const rawConfig = bigConfig.projects[projectName];
  const config = {
    ...rawConfig,
    buildDir: process.cwd() + `/testeranto/${projectName}.json`
  };
  if (!config.tests)
    throw "config has no tests?";
  const pm = new PM_Main(config, projectName, mode);
  pm.start();
  process.stdin.on("keypress", (str, key) => {
    if (key.name === "q") {
      pm.stop();
    }
  });
});
