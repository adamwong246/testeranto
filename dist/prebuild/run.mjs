import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/run.ts
import ansiC2 from "ansi-colors";
import readline from "readline";

// src/PM/main.ts
import { spawn } from "node:child_process";
import ts from "typescript";
import net from "net";
import fs2, { watch } from "fs";
import path3 from "path";
import puppeteer from "puppeteer-core";
import ansiC from "ansi-colors";
import crypto from "node:crypto";
import { ESLint } from "eslint";
import tsc from "tsc-prog";

// src/utils.ts
import path from "path";
var tscPather = (entryPoint, platform, projectName) => {
  return path.join(
    "testeranto",
    "reports",
    projectName,
    entryPoint.split(".").slice(0, -1).join("."),
    platform,
    `type_errors.txt`
  );
};
var lintPather = (entryPoint, platform, projectName) => {
  return path.join(
    "testeranto",
    "reports",
    projectName,
    entryPoint.split(".").slice(0, -1).join("."),
    platform,
    `lint_errors.json`
  );
};
var promptPather = (entryPoint, platform, projectName) => {
  return path.join(
    "testeranto",
    "reports",
    projectName,
    entryPoint.split(".").slice(0, -1).join("."),
    platform,
    `prompt.txt`
  );
};
var getRunnables = (tests, projectName, payload = {
  nodeEntryPoints: {},
  webEntryPoints: {},
  importEntryPoints: {}
}) => {
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
      pt.importEntryPoints[cv[0]] = path.resolve(
        `./testeranto/bundles/pure/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    }
    return pt;
  }, payload);
};

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
    throw new Error("Method not implemented.");
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
  newPage() {
    return this.browser.newPage();
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
        const x = page.$(selector);
        const y = await x;
        res(y !== null);
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
    const dir = path2.dirname(p);
    fs.mkdirSync(dir, {
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
  async customScreenShot(ssOpts, testName2, page) {
    const p = ssOpts.path;
    const dir = path2.dirname(p);
    fs.mkdirSync(dir, {
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
  async writeFileSync(filepath, contents, testName2) {
    return new Promise(async (res) => {
      fs.mkdirSync(path2.dirname(filepath), {
        recursive: true
      });
      if (!files[testName2]) {
        files[testName2] = /* @__PURE__ */ new Set();
      }
      files[testName2].add(filepath);
      await fs.writeFileSync(filepath, contents);
      res(true);
    });
  }
  async createWriteStream(filepath, testName2) {
    const folder = filepath.split("/").slice(0, -1).join("/");
    return new Promise((res) => {
      if (!fs.existsSync(folder)) {
        return fs.mkdirSync(folder, {
          recursive: true
        });
      }
      const f = fs.createWriteStream(filepath);
      fileStreams3.push(f);
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
  page() {
    throw new Error("Method not implemented.");
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
  getValue(value, p) {
    this.doInPage(p, (page) => {
      return page.keyboard.type(value);
    });
  }
  getAttribute(selector, attribute, p) {
    this.doInPage(p, (page) => {
      return page.$eval(selector, (input) => input.getAttribute("value"));
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
      if (page.mainFrame()._id === p) {
        return cb(page);
      }
    });
  }
};

// src/PM/main.ts
var eslint = new ESLint();
var formatter = await eslint.loadFormatter(
  "./node_modules/testeranto/dist/prebuild/esbuildConfigs/eslint-formatter-testeranto.mjs"
);
var changes = {};
var fileHashes = {};
var files2 = {};
var screenshots2 = {};
async function fileHash(filePath, algorithm = "md5") {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm);
    const fileStream = fs2.createReadStream(filePath);
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
var statusMessagePretty = (failures, test) => {
  if (failures === 0) {
    console.log(ansiC.green(ansiC.inverse(`> ${test} completed successfully`)));
  } else {
    console.log(ansiC.red(ansiC.inverse(`> ${test} failed ${failures} times`)));
  }
};
async function writeFileAndCreateDir(filePath, data) {
  const dirPath = path3.dirname(filePath);
  try {
    await fs2.promises.mkdir(dirPath, { recursive: true });
    await fs2.appendFileSync(filePath, data);
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
function pollForFile(path4, timeout = 2e3) {
  const intervalObj = setInterval(function() {
    const file = path4;
    const fileExists = fs2.existsSync(file);
    if (fileExists) {
      clearInterval(intervalObj);
    }
  }, timeout);
}
var PM_Main = class extends PM_Base {
  constructor(configs, name, mode2) {
    super(configs);
    this.bigBoard = {};
    this.getRunnables = (tests, testName2, payload = {
      nodeEntryPoints: {},
      webEntryPoints: {},
      importEntryPoints: {}
    }) => {
      return getRunnables(tests, testName2, payload);
    };
    this.tscCheck = async ({
      entrypoint,
      addableFiles,
      platform
    }) => {
      console.log(ansiC.green(ansiC.inverse(`tsc < ${entrypoint}`)));
      this.typeCheckIsRunning(entrypoint);
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
      let allDiagnostics = program.getSemanticDiagnostics();
      const results = [];
      allDiagnostics.forEach((diagnostic) => {
        if (diagnostic.file) {
          let { line, character } = ts.getLineAndCharacterOfPosition(
            diagnostic.file,
            diagnostic.start
          );
          let message = ts.flattenDiagnosticMessageText(
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
      fs2.writeFileSync(tscPath, results.join("\n"));
      this.typeCheckIsNowDone(entrypoint, results.length);
    };
    this.eslintCheck = async (entrypoint, platform, addableFiles) => {
      console.log(ansiC.green(ansiC.inverse(`eslint < ${entrypoint}`)));
      this.lintIsRunning(entrypoint);
      const results = (await eslint.lintFiles(addableFiles)).filter((r) => r.messages.length).filter((r) => {
        return r.messages[0].ruleId !== null;
      }).map((r) => {
        delete r.source;
        return r;
      });
      fs2.writeFileSync(
        lintPather(entrypoint, platform, this.name),
        await formatter.format(results)
      );
      this.lintIsNowDone(entrypoint, results.length);
    };
    this.makePrompt = async (entryPoint, addableFiles, platform) => {
      this.bigBoard[entryPoint].prompt = "?";
      const promptPath = promptPather(entryPoint, platform, this.name);
      const testPaths = path3.join(
        "testeranto",
        "reports",
        this.name,
        platform,
        entryPoint.split(".").slice(0, -1).join("."),
        `tests.json`
      );
      const featuresPath = path3.join(
        "testeranto",
        "reports",
        this.name,
        platform,
        entryPoint.split(".").slice(0, -1).join("."),
        `featurePrompt.txt`
      );
      fs2.writeFileSync(
        promptPath,
        `
${addableFiles.map((x) => {
          return `/add ${x}`;
        }).join("\n")}

/read ${lintPather(entryPoint, platform, this.name)}
/read ${tscPather(entryPoint, platform, this.name)}
/read ${testPaths}

/load ${featuresPath}

/code Fix the failing tests described in ${testPaths}. Correct any type signature errors described in the files ${tscPather(
          entryPoint,
          platform,
          this.name
        )}. Implement any method which throws "Function not implemented. Resolve the lint errors described in ${lintPather(
          entryPoint,
          platform,
          this.name
        )}"
          `
      );
      this.bigBoard[entryPoint].prompt = `aider --model deepseek/deepseek-chat --load testeranto/${this.name}/reports/${platform}/${entryPoint.split(".").slice(0, -1).join(".")}/prompt.txt`;
      this.checkForShutdown();
    };
    this.checkForShutdown = () => {
      this.writeBigBoard();
      if (this.mode === "dev")
        return;
      let inflight = false;
      Object.keys(this.bigBoard).forEach((k) => {
        if (this.bigBoard[k].prompt === "?") {
          console.log(ansiC.blue(ansiC.inverse(`\u{1F555} prompt ${k}`)));
          inflight = true;
        }
      });
      Object.keys(this.bigBoard).forEach((k) => {
        if (this.bigBoard[k].runTimeError === "?") {
          console.log(ansiC.blue(ansiC.inverse(`\u{1F555} runTimeError ${k}`)));
          inflight = true;
        }
      });
      Object.keys(this.bigBoard).forEach((k) => {
        if (this.bigBoard[k].staticErrors === "?") {
          console.log(ansiC.blue(ansiC.inverse(`\u{1F555} staticErrors ${k}`)));
          inflight = true;
        }
      });
      Object.keys(this.bigBoard).forEach((k) => {
        if (this.bigBoard[k].typeErrors === "?") {
          console.log(ansiC.blue(ansiC.inverse(`\u{1F555} typeErrors ${k}`)));
          inflight = true;
        }
      });
      this.writeBigBoard();
      if (!inflight) {
        this.browser.disconnect().then(() => {
          console.log(ansiC.inverse(`${this.name} has been tested. Goodbye.`));
          process.exit();
        });
      }
    };
    this.typeCheckIsRunning = (src) => {
      this.bigBoard[src].typeErrors = "?";
    };
    this.typeCheckIsNowDone = (src, failures) => {
      this.bigBoard[src].typeErrors = failures;
      this.writeBigBoard();
      this.checkForShutdown();
    };
    this.lintIsRunning = (src) => {
      this.bigBoard[src].staticErrors = "?";
      this.writeBigBoard();
    };
    this.lintIsNowDone = (src, failures) => {
      this.bigBoard[src].staticErrors = failures;
      this.writeBigBoard();
      this.checkForShutdown();
    };
    this.bddTestIsRunning = (src) => {
      this.bigBoard[src].runTimeError = "?";
      this.writeBigBoard();
    };
    this.bddTestIsNowDone = (src, failures) => {
      this.bigBoard[src].runTimeError = failures;
      this.writeBigBoard();
      this.checkForShutdown();
    };
    this.launchPure = async (src, dest) => {
      console.log(ansiC.green(ansiC.inverse(`! pure, ${src}`)));
      this.bddTestIsRunning(src);
      const reportDest = `testeranto/reports/${this.name}/${src.split(".").slice(0, -1).join(".")}/pure`;
      if (!fs2.existsSync(reportDest)) {
        fs2.mkdirSync(reportDest, { recursive: true });
      }
      const destFolder = dest.replace(".mjs", "");
      let argz = "";
      const testConfig = this.configs.tests.find((t) => {
        return t[0] === src;
      });
      if (!testConfig) {
        console.log(ansiC.inverse("missing test config! Exiting ungracefully!"));
        process.exit(-1);
      }
      const testConfigResource = testConfig[2];
      let portsToUse = [];
      if (testConfigResource.ports === 0) {
        argz = JSON.stringify({
          scheduled: true,
          name: src,
          ports: portsToUse,
          fs: reportDest,
          browserWSEndpoint: this.browser.wsEndpoint()
        });
      } else if (testConfigResource.ports > 0) {
        const openPorts = Object.entries(this.ports).filter(
          ([portnumber, portopen]) => portopen
        );
        if (openPorts.length >= testConfigResource.ports) {
          for (let i = 0; i < testConfigResource.ports; i++) {
            portsToUse.push(openPorts[i][0]);
            this.ports[openPorts[i][0]] = false;
          }
          argz = JSON.stringify({
            scheduled: true,
            name: src,
            ports: portsToUse,
            fs: destFolder,
            browserWSEndpoint: this.browser.wsEndpoint()
          });
        } else {
          this.queue.push(src);
          return;
        }
      } else {
        console.error("negative port makes no sense", src);
        process.exit(-1);
      }
      const builtfile = dest;
      const webSideCares = [];
      try {
        await import(`${builtfile}?cacheBust=${Date.now()}`).then((module) => {
          return module.default.then((defaultModule) => {
            defaultModule.receiveTestResourceConfig(argz).then(async (results) => {
              this.receiveFeatures(results.features, destFolder, src, "pure");
              statusMessagePretty(results.fails, src);
              this.bddTestIsNowDone(src, results.fails);
            }).catch((e) => {
              console.log(
                ansiC.red(ansiC.inverse(`${src} errored with: ${e}`))
              );
              this.bddTestIsNowDone(src, -1);
            }).finally(() => {
              webSideCares.forEach((webSideCar) => webSideCar.close());
            });
          }).catch((e) => {
            console.log(
              ansiC.red(
                ansiC.inverse(
                  `${src} errored with: ${e}. Check ${reportDest}/error.txt for more info`
                )
              )
            );
            this.writeFileSync(`${reportDest}/error.txt`, e.stack, src);
            this.bddTestIsNowDone(src, -1);
            statusMessagePretty(-1, src);
          });
        });
      } catch (e) {
        console.log(
          ansiC.red(
            ansiC.inverse(
              `${src} errored with: ${e}. Check ${reportDest}/error.txt for more info`
            )
          )
        );
        this.writeFileSync(`${reportDest}/error.txt`, e.stack, src);
        this.bddTestIsNowDone(src, -1);
        statusMessagePretty(-1, src);
      }
      for (let i = 0; i <= portsToUse.length; i++) {
        if (portsToUse[i]) {
          this.ports[portsToUse[i]] = "true";
        }
      }
    };
    this.launchNode = async (src, dest) => {
      console.log(ansiC.green(ansiC.inverse(`! node, ${src}`)));
      this.bddTestIsRunning(src);
      const reportDest = `testeranto/reports/${this.name}/${src.split(".").slice(0, -1).join(".")}/node`;
      if (!fs2.existsSync(reportDest)) {
        fs2.mkdirSync(reportDest, { recursive: true });
      }
      const destFolder = dest.replace(".mjs", "");
      let testResources = "";
      const testConfig = this.configs.tests.find((t) => {
        return t[0] === src;
      });
      if (!testConfig) {
        console.log(
          ansiC.inverse(`missing test config! Exiting ungracefully for '${src}'`)
        );
        process.exit(-1);
      }
      const testConfigResource = testConfig[2];
      let portsToUse = [];
      if (testConfigResource.ports === 0) {
        testResources = JSON.stringify({
          scheduled: true,
          name: src,
          ports: portsToUse,
          fs: reportDest,
          browserWSEndpoint: this.browser.wsEndpoint()
        });
      } else if (testConfigResource.ports > 0) {
        const openPorts = Object.entries(this.ports).filter(
          ([portnumber, portopen]) => portopen
        );
        if (openPorts.length >= testConfigResource.ports) {
          for (let i = 0; i < testConfigResource.ports; i++) {
            portsToUse.push(openPorts[i][0]);
            this.ports[openPorts[i][0]] = false;
          }
          testResources = JSON.stringify({
            scheduled: true,
            name: src,
            ports: portsToUse,
            fs: destFolder,
            browserWSEndpoint: this.browser.wsEndpoint()
          });
        } else {
          this.queue.push(src);
          return;
        }
      } else {
        console.error("negative port makes no sense", src);
        process.exit(-1);
      }
      const builtfile = dest;
      let haltReturns = false;
      let buffer = new Buffer("");
      const server = net.createServer((socket) => {
        socket.on("data", (data) => {
          buffer = Buffer.concat([buffer, data]);
          let messages = [];
          for (let b = 0; b < buffer.length + 1; b++) {
            let c = buffer.slice(0, b);
            let d;
            try {
              d = JSON.parse(c.toString());
              messages.push(d);
              buffer = buffer.slice(b, buffer.length + 1);
              b = 0;
            } catch (e) {
            }
          }
          messages.forEach(async (payload) => {
            this.mapping().forEach(async ([command, func]) => {
              if (payload[0] === command) {
                const x = payload.slice(1, -1);
                const r = await this[command](...x);
                if (!haltReturns) {
                  child.send(
                    JSON.stringify({
                      payload: r,
                      key: payload[payload.length - 1]
                    })
                  );
                }
              }
            });
          });
        });
      });
      const oStream = fs2.createWriteStream(`${reportDest}/console_log.txt`);
      const child = spawn(
        "node",
        [builtfile, testResources, "--trace-warnings"],
        {
          stdio: ["pipe", "pipe", "pipe", "ipc"]
          // silent: true
        }
      );
      const p = destFolder + "/pipe";
      const errFile = `${reportDest}/error.txt`;
      if (fs2.existsSync(errFile)) {
        fs2.rmSync(errFile);
      }
      server.listen(p, () => {
        child.stderr?.on("data", (data) => {
          oStream.write(`stderr data ${data}`);
        });
        child.stdout?.on("data", (data) => {
          oStream.write(`stdout data ${data}`);
        });
        child.on("close", (code) => {
          oStream.close();
          server.close();
          if (code === null) {
            this.bddTestIsNowDone(src, -1);
            statusMessagePretty(-1, src);
          } else if (code === 0) {
            this.bddTestIsNowDone(src, 0);
            statusMessagePretty(0, src);
          } else {
            this.bddTestIsNowDone(src, code);
            statusMessagePretty(code, src);
          }
          if (fs2.existsSync(p)) {
            fs2.rmSync(p);
          }
          haltReturns = true;
        });
        child.on("exit", (code) => {
          haltReturns = true;
        });
        child.on("error", (e) => {
          haltReturns = true;
          if (fs2.existsSync(p)) {
            fs2.rmSync(p);
          }
          console.log(
            ansiC.red(
              ansiC.inverse(
                `${src} errored with: ${e.name}. Check ${errFile}for more info`
              )
            )
          );
          this.writeFileSync(`${reportDest}/error.txt`, e.toString(), src);
          this.bddTestIsNowDone(src, -1);
          statusMessagePretty(-1, src);
        });
      });
      child.send({ path: p });
      for (let i = 0; i <= portsToUse.length; i++) {
        if (portsToUse[i]) {
          this.ports[portsToUse[i]] = "true";
        }
      }
    };
    this.launchWebSideCar = async (src, dest, testConfig) => {
      const d = dest + ".mjs";
      console.log(ansiC.green(ansiC.inverse(`launchWebSideCar ${src}`)));
      const fileStreams2 = [];
      const doneFileStream2 = [];
      return new Promise((res, rej) => {
        this.browser.newPage().then((page) => {
          page.exposeFunction(
            "custom-screenshot",
            async (ssOpts, testName2) => {
              const p = ssOpts.path;
              const dir = path3.dirname(p);
              fs2.mkdirSync(dir, {
                recursive: true
              });
              files2[testName2].add(ssOpts.path);
              const sPromise = page.screenshot({
                ...ssOpts,
                path: p
              });
              if (!screenshots2[testName2]) {
                screenshots2[testName2] = [];
              }
              screenshots2[testName2].push(sPromise);
              await sPromise;
              return sPromise;
            }
          );
          page.exposeFunction(
            "writeFileSync",
            (fp, contents, testName2) => {
              const dir = path3.dirname(fp);
              fs2.mkdirSync(dir, {
                recursive: true
              });
              const p = new Promise(async (res2, rej2) => {
                fs2.writeFileSync(fp, contents);
                res2(fp);
              });
              doneFileStream2.push(p);
              if (!files2[testName2]) {
                files2[testName2] = /* @__PURE__ */ new Set();
              }
              files2[testName2].add(fp);
              return p;
            }
          );
          page.exposeFunction("existsSync", (fp, contents) => {
            return fs2.existsSync(fp);
          });
          page.exposeFunction("mkdirSync", (fp) => {
            if (!fs2.existsSync(fp)) {
              return fs2.mkdirSync(fp, {
                recursive: true
              });
            }
            return false;
          });
          page.exposeFunction(
            "createWriteStream",
            (fp, testName2) => {
              const f = fs2.createWriteStream(fp);
              files2[testName2].add(fp);
              const p = new Promise((res2, rej2) => {
                res2(fp);
              });
              doneFileStream2.push(p);
              f.on("close", async () => {
                await p;
              });
              fileStreams2.push(f);
              return {
                ...JSON.parse(JSON.stringify(f)),
                uid: fileStreams2.length - 1
              };
            }
          );
          page.exposeFunction(
            "write",
            async (uid, contents) => {
              return fileStreams2[uid].write(contents);
            }
          );
          page.exposeFunction("end", async (uid) => {
            return fileStreams2[uid].end();
          });
          return page;
        }).then(async (page) => {
          await page.goto(`file://${`${dest}.html`}`, {});
          res(page);
        });
      });
    };
    this.launchNodeSideCar = async (src, dest, testConfig) => {
      const d = dest + ".mjs";
      console.log(ansiC.green(ansiC.inverse(`launchNodeSideCar ${src}`)));
      const destFolder = dest.replace(".mjs", "");
      let argz = "";
      const testConfigResource = testConfig[2];
      let portsToUse = [];
      if (testConfigResource.ports === 0) {
        argz = JSON.stringify({
          scheduled: true,
          name: src,
          ports: portsToUse,
          fs: destFolder,
          browserWSEndpoint: this.browser.wsEndpoint()
        });
      } else if (testConfigResource.ports > 0) {
        const openPorts = Object.entries(this.ports).filter(
          ([portnumber, portopen]) => portopen
        );
        if (openPorts.length >= testConfigResource.ports) {
          for (let i = 0; i < testConfigResource.ports; i++) {
            portsToUse.push(openPorts[i][0]);
            this.ports[openPorts[i][0]] = false;
          }
          argz = JSON.stringify({
            scheduled: true,
            name: src,
            // ports: [3333],
            ports: portsToUse,
            fs: ".",
            browserWSEndpoint: this.browser.wsEndpoint()
          });
        } else {
          this.queue.push(src);
          return;
        }
      } else {
        console.error("negative port makes no sense", src);
        process.exit(-1);
      }
      const builtfile = dest + ".mjs";
      await import(`${builtfile}?cacheBust=${Date.now()}`).then((module) => {
        return module.default.then((defaultModule) => {
          const s = new defaultModule();
          s.receiveTestResourceConfig(argz);
        });
      });
      for (let i = 0; i <= portsToUse.length; i++) {
        if (portsToUse[i]) {
          this.ports[portsToUse[i]] = "true";
        }
      }
    };
    this.launchWeb = async (src, dest) => {
      console.log(ansiC.green(ansiC.inverse(`! web ${src}`)));
      this.bddTestIsRunning(src);
      const reportDest = `testeranto/reports/${this.name}/${src.split(".").slice(0, -1).join(".")}/web`;
      if (!fs2.existsSync(reportDest)) {
        fs2.mkdirSync(reportDest, { recursive: true });
      }
      const destFolder = dest.replace(".mjs", "");
      const webArgz = JSON.stringify({
        name: dest,
        ports: [].toString(),
        fs: reportDest,
        browserWSEndpoint: this.browser.wsEndpoint()
      });
      const d = `${dest}?cacheBust=${Date.now()}`;
      const evaluation = `

    import('${d}').then(async (x) => {

      try {
        return await (await x.default).receiveTestResourceConfig(${webArgz})
      } catch (e) {
        console.log("fail", e)
      }
    })`;
      const oStream = fs2.createWriteStream(`${reportDest}/console_log.txt`);
      this.browser.newPage().then((page) => {
        this.mapping().forEach(async ([command, func]) => {
          page.exposeFunction(command, func);
        });
        return page;
      }).then(async (page) => {
        const close = () => {
          if (!files2[src]) {
            files2[src] = /* @__PURE__ */ new Set();
          }
          fs2.writeFileSync(
            destFolder + "/manifest.json",
            JSON.stringify(Array.from(files2[src]))
          );
          delete files2[src];
          Promise.all(screenshots2[src] || []).then(() => {
            delete screenshots2[src];
            page.close();
            oStream.close();
          });
        };
        page.on("pageerror", (err) => {
          console.debug(`Error from ${src}: [${err.name}] `);
          oStream.write(err.name);
          oStream.write("\n");
          if (err.cause) {
            console.debug(`Error from ${src} cause: [${err.cause}] `);
            oStream.write(err.cause);
            oStream.write("\n");
          }
          if (err.stack) {
            console.debug(`Error from stack ${src}: [${err.stack}] `);
            oStream.write(err.stack);
            oStream.write("\n");
          }
          console.debug(`Error from message ${src}: [${err.message}] `);
          oStream.write(err.message);
          oStream.write("\n");
          this.bddTestIsNowDone(src, -1);
          close();
        });
        page.on("console", (log) => {
          oStream.write(log.text());
          oStream.write(JSON.stringify(log.location()));
          oStream.write(JSON.stringify(log.stackTrace()));
          oStream.write("\n");
        });
        await page.goto(`file://${`${destFolder}.html`}`, {});
        await page.evaluate(evaluation).then(async ({ fails, failed, features }) => {
          this.receiveFeatures(features, destFolder, src, "web");
          statusMessagePretty(fails, src);
          this.bddTestIsNowDone(src, fails);
        }).catch((e) => {
          console.log(ansiC.red(ansiC.inverse(`${src} errored with: ${e}`)));
        }).finally(() => {
          this.bddTestIsNowDone(src, -1);
          close();
        });
        return page;
      });
    };
    this.receiveFeatures = (features, destFolder, srcTest, platform) => {
      const featureDestination = path3.resolve(
        process.cwd(),
        "reports",
        "features",
        "strings",
        srcTest.split(".").slice(0, -1).join(".") + ".features.txt"
      );
      features.reduce(async (mm, featureStringKey) => {
        const accum = await mm;
        const isUrl = isValidUrl(featureStringKey);
        if (isUrl) {
          const u = new URL(featureStringKey);
          if (u.protocol === "file:") {
            const newPath = `${process.cwd()}/testeranto/features/internal/${path3.relative(
              process.cwd(),
              u.pathname
            )}`;
            await fs2.promises.mkdir(path3.dirname(newPath), { recursive: true });
            try {
              await fs2.unlinkSync(newPath);
            } catch (error) {
              if (error.code !== "ENOENT") {
              }
            }
            accum.files.push(newPath);
          } else if (u.protocol === "http:" || u.protocol === "https:") {
            const newPath = `${process.cwd()}/testeranto/features/external${u.hostname}${u.pathname}`;
            const body = await this.configs.featureIngestor(featureStringKey);
            writeFileAndCreateDir(newPath, body);
            accum.files.push(newPath);
          }
        } else {
          await fs2.promises.mkdir(path3.dirname(featureDestination), {
            recursive: true
          });
          accum.strings.push(featureStringKey);
        }
        return accum;
      }, Promise.resolve({ files: [], strings: [] })).then(({ files: files3, strings }) => {
        fs2.writeFileSync(
          `testeranto/reports/${this.name}/${srcTest.split(".").slice(0, -1).join(".")}/${platform}/featurePrompt.txt`,
          files3.map((f) => {
            return `/read ${f}`;
          }).join("\n")
        );
      });
    };
    this.writeBigBoard = () => {
      fs2.writeFileSync(
        `./testeranto/reports/${this.name}/summary.json`,
        JSON.stringify(this.bigBoard, null, 2)
      );
    };
    this.name = name;
    this.mode = mode2;
    this.ports = {};
    this.configs.tests.forEach(([t]) => {
      this.bigBoard[t] = {
        runTimeError: "?",
        typeErrors: "?",
        staticErrors: "?",
        prompt: "?"
      };
    });
    this.configs.ports.forEach((element) => {
      this.ports[element] = "true";
    });
  }
  mapping() {
    return [
      ["$", this.$],
      ["click", this.click],
      ["closePage", this.closePage],
      ["createWriteStream", this.createWriteStream],
      ["customclose", this.customclose],
      ["customScreenShot", this.customScreenShot],
      ["end", this.end],
      ["existsSync", this.existsSync],
      ["focusOn", this.focusOn],
      ["getAttribute", this.getAttribute],
      ["getValue", this.getValue],
      ["goto", this.goto],
      ["isDisabled", this.isDisabled],
      ["mkdirSync", this.mkdirSync],
      ["newPage", this.newPage],
      ["page", this.page],
      ["pages", this.pages],
      ["screencast", this.screencast],
      ["screencastStop", this.screencastStop],
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
    if (!fs2.existsSync(`testeranto/reports/${this.name}`)) {
      fs2.mkdirSync(`testeranto/reports/${this.name}`);
    }
    this.browser = await puppeteer.launch({
      slowMo: 1,
      waitForInitialPage: false,
      executablePath: (
        // process.env.CHROMIUM_PATH || "/opt/homebrew/bin/chromium",
        "/opt/homebrew/bin/chromium"
      ),
      headless: true,
      dumpio: false,
      devtools: false,
      args: [
        "--allow-file-access-from-files",
        "--allow-insecure-localhost",
        "--allow-running-insecure-content",
        "--auto-open-devtools-for-tabs",
        "--disable-dev-shm-usage",
        "--disable-extensions",
        "--disable-gpu",
        "--disable-setuid-sandbox",
        "--disable-site-isolation-trials",
        "--disable-site-isolation-trials",
        "--disable-web-security",
        "--no-first-run",
        "--no-sandbox",
        "--no-startup-window",
        "--reduce-security-for-testing",
        "--remote-allow-origins=*",
        `--remote-debugging-port=3234`,
        "--unsafely-treat-insecure-origin-as-secure=*"
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
    const { nodeEntryPoints, webEntryPoints, importEntryPoints } = this.getRunnables(this.configs.tests, this.name);
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
        importEntryPoints,
        this.launchPure,
        "pure",
        (w) => {
          this.importMetafileWatcher = w;
        }
      ]
    ].forEach(
      async ([eps, launcher, runtime, watcher]) => {
        const metafile = `./testeranto/bundles/${runtime}/${this.name}/metafile.json`;
        await pollForFile(metafile);
        Object.entries(eps).forEach(
          async ([k, outputFile]) => {
            launcher(k, outputFile);
            try {
              watch(outputFile, async (e, filename) => {
                const hash = await fileHash(outputFile);
                if (fileHashes[k] !== hash) {
                  fileHashes[k] = hash;
                  console.log(
                    ansiC.yellow(ansiC.inverse(`< ${e} ${filename}`))
                  );
                  launcher(k, outputFile);
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
              ansiC.yellow(ansiC.inverse(`< ${e} ${filename} (${runtime})`))
            );
            this.metafileOutputs(runtime);
          })
        );
      }
    );
  }
  async stop() {
    console.log(ansiC.inverse("Testeranto-Run is shutting down gracefully..."));
    this.mode = "once";
    this.nodeMetafileWatcher.close();
    this.webMetafileWatcher.close();
    this.importMetafileWatcher.close();
    this.checkForShutdown();
  }
  async metafileOutputs(platform) {
    const metafile = JSON.parse(
      fs2.readFileSync(
        `./testeranto/bundles/${platform}/${this.name}/metafile.json`
      ).toString()
    ).metafile;
    if (!metafile)
      return;
    const outputs = metafile.outputs;
    Object.keys(outputs).forEach(async (k) => {
      const addableFiles = Object.keys(outputs[k].inputs).filter((i) => {
        if (!fs2.existsSync(i))
          return false;
        if (i.startsWith("node_modules"))
          return false;
        return true;
      });
      const f = `${k.split(".").slice(0, -1).join(".")}/`;
      if (!fs2.existsSync(f)) {
        fs2.mkdirSync(f);
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
            entrypoint: "./" + entrypoint
          });
          this.eslintCheck("./" + entrypoint, platform, addableFiles);
          this.makePrompt("./" + entrypoint, addableFiles, platform);
        }
      }
    });
  }
};

// src/run.ts
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
console.log(ansiC2.inverse("Press 'x' to shutdown forcefully."));
process.stdin.on("keypress", (str, key) => {
  if (key.name === "x") {
    console.log(ansiC2.inverse("Shutting down forcefully..."));
    process.exit(-1);
  }
});
var testName = process.argv[2];
var mode = process.argv[3];
if (mode !== "once" && mode !== "dev") {
  console.error("the 2nd argument should be 'dev' or 'once' ");
  process.exit(-1);
}
console.log("testeranto is running", testName, mode);
import(process.cwd() + "/testeranto.config.ts").then(async (module) => {
  const bigConfig = module.default;
  const rawConfig = bigConfig.projects[testName];
  const config = {
    ...rawConfig,
    buildDir: process.cwd() + `/testeranto/${testName}.json`
  };
  const pm = new PM_Main(config, testName, mode);
  pm.start();
  process.stdin.on("keypress", (str, key) => {
    if (key.name === "q") {
      pm.stop();
    }
  });
});
