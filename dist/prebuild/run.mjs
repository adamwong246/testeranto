import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/run.ts
import ansiC2 from "ansi-colors";
import { watch } from "fs";
import path3 from "path";
import crypto from "node:crypto";
import fs2 from "fs";
import tsc from "tsc-prog";
import { ESLint } from "eslint";
import ts from "typescript";
import readline from "readline";

// src/PM/main.ts
import fs from "fs";
import path2 from "path";
import puppeteer from "puppeteer-core";
import ansiC from "ansi-colors";

// src/utils.ts
import path from "path";
var tscPather = (entryPoint, platform) => {
  return path.join(
    "./docs/",
    platform,
    entryPoint.split(".").slice(0, -1).join("."),
    `type_errors.txt`
  );
};
var tscExitCodePather = (entryPoint, platform) => {
  return path.join(
    "./docs/",
    platform,
    entryPoint.split(".").slice(0, -1).join("."),
    `type_errors.exitcode`
  );
};
var lintPather = (entryPoint, platform) => {
  return path.join(
    "./docs/",
    platform,
    entryPoint.split(".").slice(0, -1).join("."),
    `lint_errors.json`
  );
};
var lintExitCodePather = (entryPoint, platform) => {
  return path.join(
    "./docs/",
    platform,
    entryPoint.split(".").slice(0, -1).join("."),
    `lint_errors.exitcode`
  );
};
var bddExitCodePather = (entryPoint, platform) => {
  return path.join(
    "./docs/",
    platform,
    entryPoint.split(".").slice(0, -1).join("."),
    `exitcode`
  );
};

// src/PM/index.ts
var PM = class {
};

// src/PM/main.ts
var fileStreams3 = [];
var fPaths = [];
var files = {};
var recorders = {};
var screenshots = {};
var statusMessagePretty = (failures, test) => {
  if (failures === 0) {
    console.log(ansiC.green(ansiC.inverse(`> ${test} completed successfully`)));
  } else {
    console.log(ansiC.red(ansiC.inverse(`> ${test} failed ${failures} times`)));
  }
};
async function writeFileAndCreateDir(filePath, data) {
  const dirPath = path2.dirname(filePath);
  try {
    await fs.promises.mkdir(dirPath, { recursive: true });
    await fs.appendFileSync(filePath, data);
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
var PM_Main = class extends PM {
  constructor(configs) {
    super();
    this.shutdownMode = false;
    this.bigBoard = {};
    this.checkForShutdown = () => {
      const anyRunning = Object.values(this.bigBoard).filter((x) => x.status === "running").length > 0;
      if (anyRunning) {
      } else {
        this.browser.disconnect().then(() => {
          const final = {
            timestamp: Date.now(),
            tests: this.configs.tests.reduce((mm, t) => {
              const bddErrors = fs.readFileSync(bddExitCodePather(t[0], t[1])).toString();
              const lintErrors = fs.readFileSync(lintExitCodePather(t[0], t[1])).toString();
              const typeErrors = fs.readFileSync(tscExitCodePather(t[0], t[1])).toString();
              mm[t[0]] = {
                bddErrors,
                lintErrors,
                typeErrors
              };
              return mm;
            }, {})
          };
          const s = JSON.stringify(final, null, 2);
          fs.writeFileSync("docs/summary.json", s);
          console.log(ansiC.inverse("Goodbye"));
          process.exit();
        });
      }
    };
    this.testIsNowRunning = (src) => {
      this.bigBoard[src].status = "running";
    };
    this.testIsNowDone = (src) => {
      this.bigBoard[src].status = "waiting";
      if (this.shutdownMode) {
        this.checkForShutdown();
      }
    };
    this.launchNode = async (src, dest) => {
      console.log(ansiC.green(ansiC.inverse(`! node, ${src}`)));
      this.testIsNowRunning(src);
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
      this.server[builtfile] = await import(`${builtfile}?cacheBust=${Date.now()}`).then((module) => {
        return module.default.then((defaultModule) => {
          defaultModule.receiveTestResourceConfig(argz).then(async ({ features, failed }) => {
            this.receiveFeatures(features, destFolder, src);
            statusMessagePretty(failed, src);
            this.receiveExitCode(src, failed);
          }).catch((e) => {
            console.log(ansiC.red(ansiC.inverse(`${src} errored with: ${e}`)));
          }).finally(() => {
            webSideCares.forEach((webSideCar) => webSideCar.close());
            this.testIsNowDone(src);
          });
        });
      });
      for (let i = 0; i <= portsToUse.length; i++) {
        if (portsToUse[i]) {
          this.ports[portsToUse[i]] = "true";
        }
      }
    };
    this.launchWebSideCar = async (src, dest, testConfig) => {
      const d = dest + ".mjs";
      console.log(ansiC.green(ansiC.inverse(`launchWebSideCar ${src}`)));
      const destFolder = dest.replace(".mjs", "");
      const fileStreams2 = [];
      const doneFileStream2 = [];
      return new Promise((res, rej) => {
        this.browser.newPage().then((page) => {
          page.exposeFunction(
            "custom-screenshot",
            async (ssOpts, testName) => {
              const p = ssOpts.path;
              const dir = path2.dirname(p);
              fs.mkdirSync(dir, {
                recursive: true
              });
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
          );
          page.exposeFunction(
            "writeFileSync",
            (fp, contents, testName) => {
              const dir = path2.dirname(fp);
              fs.mkdirSync(dir, {
                recursive: true
              });
              const p = new Promise(async (res2, rej2) => {
                fs.writeFileSync(fp, contents);
                res2(fp);
              });
              doneFileStream2.push(p);
              if (!files[testName]) {
                files[testName] = /* @__PURE__ */ new Set();
              }
              files[testName].add(fp);
              return p;
            }
          );
          page.exposeFunction("existsSync", (fp, contents) => {
            return fs.existsSync(fp);
          });
          page.exposeFunction("mkdirSync", (fp) => {
            if (!fs.existsSync(fp)) {
              return fs.mkdirSync(fp, {
                recursive: true
              });
            }
            return false;
          });
          page.exposeFunction(
            "createWriteStream",
            (fp, testName) => {
              const f = fs.createWriteStream(fp);
              files[testName].add(fp);
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
      this.server[builtfile] = await import(`${builtfile}?cacheBust=${Date.now()}`).then((module) => {
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
    this.launchWeb = (t, dest) => {
      console.log(ansiC.green(ansiC.inverse(`! web ${t}`)));
      this.testIsNowRunning(t);
      const destFolder = dest.replace(".mjs", "");
      const webArgz = JSON.stringify({
        name: dest,
        ports: [].toString(),
        fs: destFolder,
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
      const fileStreams2 = [];
      const doneFileStream2 = [];
      const stdoutStream = fs.createWriteStream(`${destFolder}/stdout.log`);
      const stderrStream = fs.createWriteStream(`${destFolder}/stderr.log`);
      this.browser.newPage().then((page) => {
        page.exposeFunction(
          "screencast",
          async (ssOpts, testName) => {
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
        );
        page.exposeFunction(
          "customScreenShot",
          async (ssOpts, testName) => {
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
        );
        page.exposeFunction(
          "writeFileSync",
          (fp, contents, testName) => {
            return globalThis["writeFileSync"](fp, contents, testName);
          }
        );
        page.exposeFunction("existsSync", (fp, contents) => {
          return fs.existsSync(fp);
        });
        page.exposeFunction("mkdirSync", (fp) => {
          if (!fs.existsSync(fp)) {
            return fs.mkdirSync(fp, {
              recursive: true
            });
          }
          return false;
        });
        page.exposeFunction(
          "createWriteStream",
          (fp, testName) => {
            const f = fs.createWriteStream(fp);
            if (!files[testName]) {
              files[testName] = /* @__PURE__ */ new Set();
            }
            files[testName].add(fp);
            const p = new Promise((res, rej) => {
              res(fp);
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
        page.exposeFunction("write", async (uid, contents) => {
          return fileStreams2[uid].write(contents);
        });
        page.exposeFunction("end", async (uid) => {
          return fileStreams2[uid].end();
        });
        page.exposeFunction("page", () => {
          return page.mainFrame()._id;
        });
        page.exposeFunction("click", (sel) => {
          return page.click(sel);
        });
        page.exposeFunction("focusOn", (sel) => {
          return page.focus(sel);
        });
        page.exposeFunction(
          "typeInto",
          async (value) => await page.keyboard.type(value)
        );
        page.exposeFunction(
          "getValue",
          (selector) => page.$eval(selector, (input) => input.getAttribute("value"))
        );
        page.exposeFunction(
          "getAttribute",
          async (selector, attribute) => {
            const attributeValue = await page.$eval(selector, (input) => {
              return input.getAttribute(attribute);
            });
            return attributeValue;
          }
        );
        page.exposeFunction("isDisabled", async (selector) => {
          const attributeValue = await page.$eval(
            selector,
            (input) => {
              return input.disabled;
            }
          );
          return attributeValue;
        });
        page.exposeFunction("$", async (selector) => {
          const x = page.$(selector);
          const y = await x;
          return y;
        });
        return page;
      }).then(async (page) => {
        const close = () => {
          if (!files[t]) {
            files[t] = /* @__PURE__ */ new Set();
          }
          fs.writeFileSync(
            destFolder + "/manifest.json",
            JSON.stringify(Array.from(files[t]))
          );
          delete files[t];
          Promise.all(screenshots[t] || []).then(() => {
            delete screenshots[t];
            page.close();
            this.testIsNowDone(t);
            stderrStream.close();
            stdoutStream.close();
          });
        };
        page.on("pageerror", (err) => {
          console.debug(`Error from ${t}: [${err.name}] `);
          stderrStream.write(err.name);
          if (err.cause) {
            console.debug(`Error from ${t} cause: [${err.cause}] `);
            stderrStream.write(err.cause);
          }
          if (err.stack) {
            console.debug(`Error from stack ${t}: [${err.stack}] `);
            stderrStream.write(err.stack);
          }
          console.debug(`Error from message ${t}: [${err.message}] `);
          stderrStream.write(err.message);
          close();
        });
        page.on("console", (log) => {
          stdoutStream.write(log.text());
          stdoutStream.write(JSON.stringify(log.location()));
          stdoutStream.write(JSON.stringify(log.stackTrace()));
        });
        await page.goto(`file://${`${destFolder}.html`}`, {});
        await page.evaluate(evaluation).then(async ({ failed, features }) => {
          this.receiveFeatures(features, destFolder, t);
          statusMessagePretty(failed, t);
          this.receiveExitCode(t, failed);
        }).catch((e) => {
          console.log(ansiC.red(ansiC.inverse(`${t} errored with: ${e}`)));
        }).finally(() => {
          close();
        });
        return page;
      });
    };
    this.receiveFeatures = (features, destFolder, srcTest) => {
      const featureDestination = path2.resolve(
        process.cwd(),
        "docs",
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
            const newPath = `${process.cwd()}/docs/features/internal/${path2.relative(
              process.cwd(),
              u.pathname
            )}`;
            await fs.promises.mkdir(path2.dirname(newPath), { recursive: true });
            try {
              await fs.unlinkSync(newPath);
            } catch (error) {
              if (error.code !== "ENOENT") {
              }
            }
            fs.symlink(u.pathname, newPath, (err) => {
              if (err) {
              } else {
              }
            });
            accum.files.push(newPath);
          } else if (u.protocol === "http:" || u.protocol === "https:") {
            const newPath = `${process.cwd()}/docs/features/external${u.hostname}${u.pathname}`;
            const body = await this.configs.featureIngestor(featureStringKey);
            writeFileAndCreateDir(newPath, body);
            accum.files.push(newPath);
          }
        } else {
          await fs.promises.mkdir(path2.dirname(featureDestination), {
            recursive: true
          });
          accum.strings.push(featureStringKey);
        }
        return accum;
      }, Promise.resolve({ files: [], strings: [] })).then(({ files: files2, strings }) => {
        fs.writeFileSync(
          `${destFolder}/featurePrompt.txt`,
          files2.map((f) => {
            return `/read ${f}`;
          }).join("\n")
        );
      });
      this.writeBigBoard();
    };
    this.receiveExitCode = (srcTest, failures) => {
      this.bigBoard[srcTest].runTimeError = failures;
      this.writeBigBoard();
    };
    this.writeBigBoard = () => {
      fs.writeFileSync(
        "./docs/bigBoard.json",
        JSON.stringify(this.bigBoard, null, 2)
      );
    };
    this.server = {};
    this.configs = configs;
    this.ports = {};
    this.configs.tests.forEach(([t]) => {
      this.bigBoard[t] = {
        status: "?"
      };
    });
    this.configs.ports.forEach((element) => {
      this.ports[element] = "true";
    });
    globalThis["waitForSelector"] = async (pageKey, sel) => {
      const page = (await this.browser.pages()).find(
        /* @ts-ignore:next-line */
        (p) => p.mainFrame()._id === pageKey
      );
      await page?.waitForSelector(sel);
    };
    globalThis["screencastStop"] = async (path4) => {
      return recorders[path4].stop();
    };
    globalThis["closePage"] = async (pageKey) => {
      const page = (await this.browser.pages()).find(
        /* @ts-ignore:next-line */
        (p) => p.mainFrame()._id === pageKey
      );
      return page.close();
    };
    globalThis["goto"] = async (pageKey, url) => {
      const page = (await this.browser.pages()).find(
        /* @ts-ignore:next-line */
        (p) => p.mainFrame()._id === pageKey
      );
      await page?.goto(url);
      return;
    };
    globalThis["newPage"] = () => {
      return this.browser.newPage();
    };
    globalThis["pages"] = () => {
      return this.browser.pages();
    };
    globalThis["mkdirSync"] = (fp) => {
      if (!fs.existsSync(fp)) {
        return fs.mkdirSync(fp, {
          recursive: true
        });
      }
      return false;
    };
    globalThis["writeFileSync"] = (filepath, contents, testName) => {
      fs.mkdirSync(path2.dirname(filepath), {
        recursive: true
      });
      if (!files[testName]) {
        files[testName] = /* @__PURE__ */ new Set();
      }
      files[testName].add(filepath);
      return fs.writeFileSync(filepath, contents);
    };
    globalThis["createWriteStream"] = (filepath, testName) => {
      const f = fs.createWriteStream(filepath);
      fileStreams3.push(f);
      if (!files[testName]) {
        files[testName] = /* @__PURE__ */ new Set();
      }
      files[testName].add(filepath);
      return {
        ...JSON.parse(JSON.stringify(f)),
        uid: fileStreams3.length - 1
      };
    };
    globalThis["write"] = (uid, contents) => {
      fileStreams3[uid].write(contents);
    };
    globalThis["end"] = (uid) => {
      fileStreams3[uid].end();
    };
    globalThis["customScreenShot"] = async (opts, pageKey, testName) => {
      const page = (await this.browser.pages()).find(
        /* @ts-ignore:next-line */
        (p2) => p2.mainFrame()._id === pageKey
      );
      const p = opts.path;
      const dir = path2.dirname(p);
      fs.mkdirSync(dir, {
        recursive: true
      });
      if (!files[opts.path]) {
        files[opts.path] = /* @__PURE__ */ new Set();
      }
      files[opts.path].add(opts.path);
      const sPromise = page.screenshot({
        ...opts,
        path: p
      });
      if (!screenshots[opts.path]) {
        screenshots[opts.path] = [];
      }
      screenshots[opts.path].push(sPromise);
      await sPromise;
      return sPromise;
    };
    globalThis["screencast"] = async (opts, pageKey) => {
      const page = (await this.browser.pages()).find(
        /* @ts-ignore:next-line */
        (p2) => p2.mainFrame()._id === pageKey
      );
      const p = opts.path;
      const dir = path2.dirname(p);
      fs.mkdirSync(dir, {
        recursive: true
      });
      const recorder = await page?.screencast({
        ...opts,
        path: p
      });
      recorders[opts.path] = recorder;
      return opts.path;
    };
  }
  customclose() {
    throw new Error("Method not implemented.");
  }
  waitForSelector(p, s) {
    throw new Error("Method not implemented.");
  }
  closePage(p) {
    throw new Error("Method not implemented.");
  }
  newPage() {
    throw new Error("Method not implemented.");
  }
  goto(p, url) {
    throw new Error("Method not implemented.");
  }
  $(selector) {
    throw new Error("Method not implemented.");
  }
  screencast(opts) {
    throw new Error("Method not implemented.");
  }
  customScreenShot(opts, cdpPage) {
    throw new Error("Method not implemented.");
  }
  end(accessObject) {
    throw new Error("Method not implemented.");
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
  writeFileSync(fp, contents) {
    fs.writeFileSync(fp, contents);
  }
  createWriteStream(filepath) {
    return fs.createWriteStream(filepath);
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
  write(accessObject, contents) {
    throw new Error("Method not implemented.");
  }
  page() {
    throw new Error("Method not implemented.");
  }
  click(selector) {
    throw new Error("Method not implemented.");
  }
  focusOn(selector) {
    throw new Error("Method not implemented.");
  }
  typeInto(value) {
    throw new Error("Method not implemented.");
  }
  getValue(value) {
    throw new Error("Method not implemented.");
  }
  getAttribute(selector, attribute) {
    throw new Error("Method not implemented.");
  }
  isDisabled(selector) {
    throw new Error("Method not implemented.");
  }
  screencastStop(s) {
    throw new Error("Method not implemented.");
  }
  ////////////////////////////////////////////////////////////////////////////////
  async startPuppeteer(options, destfolder) {
    this.browser = await puppeteer.launch(options);
  }
  // goodbye = () => {
  //   this.browser.disconnect().then(() => {
  //     console.log("Goodbye");
  //     process.exit();
  //   });
  // };
  shutDown() {
    this.shutdownMode = true;
    this.checkForShutdown();
  }
};

// src/run.ts
console.log(ansiC2.inverse("Press 'x' to shutdown forcefully."));
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
process.stdin.on("keypress", (str, key) => {
  if (key.name === "x") {
    console.log(ansiC2.inverse("Shutting down forcefully..."));
    process.exit(-1);
  }
});
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
async function filesHash(files2, algorithm = "md5") {
  return new Promise((resolve, reject) => {
    resolve(
      files2.reduce(async (mm, f) => {
        return await mm + await fileHash(f);
      }, Promise.resolve(""))
    );
  });
}
var getRunnables = (tests, payload = {
  nodeEntryPoints: {},
  webEntryPoints: {}
}) => {
  return tests.reduce((pt, cv, cndx, cry) => {
    if (cv[1] === "node") {
      pt.nodeEntryPoints[cv[0]] = path3.resolve(
        `./docs/node/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    } else if (cv[1] === "web") {
      pt.webEntryPoints[cv[0]] = path3.resolve(
        `./docs/web/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    }
    if (cv[3].length) {
      getRunnables(cv[3], payload);
    }
    return pt;
  }, payload);
};
var changes = {};
var tscCheck = async ({
  entrypoint,
  addableFiles,
  platform
}) => {
  console.log(ansiC2.green(ansiC2.inverse(`tsc < ${entrypoint}`)));
  const program = tsc.createProgramFromConfig({
    basePath: process.cwd(),
    // always required, used for relative paths
    configFilePath: "tsconfig.json",
    // config to inherit from (optional)
    compilerOptions: {
      rootDir: "src",
      outDir: tscPather(entrypoint, platform),
      // declaration: true,
      // skipLibCheck: true,
      noEmit: true
    },
    include: addableFiles
    //["src/**/*"],
    // exclude: ["**/*.test.ts", "**/*.spec.ts"],
  });
  const tscPath = tscPather(entrypoint, platform);
  let allDiagnostics = program.getSemanticDiagnostics();
  const d = [];
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
      d.push(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    } else {
      d.push(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
    }
  });
  fs2.writeFileSync(tscPath, d.join("\n"));
  fs2.writeFileSync(
    tscExitCodePather(entrypoint, platform),
    d.length.toString()
  );
};
var eslint = new ESLint();
var formatter = await eslint.loadFormatter(
  "./node_modules/testeranto/dist/prebuild/esbuildConfigs/eslint-formatter-testeranto.mjs"
);
var eslintCheck = async (entrypoint, platform, addableFiles) => {
  console.log(ansiC2.green(ansiC2.inverse(`eslint < ${entrypoint}`)));
  const results = (await eslint.lintFiles(addableFiles)).filter((r) => r.messages.length).filter((r) => {
    return r.messages[0].ruleId !== null;
  }).map((r) => {
    delete r.source;
    return r;
  });
  fs2.writeFileSync(
    lintPather(entrypoint, platform),
    await formatter.format(results)
  );
  fs2.writeFileSync(
    lintExitCodePather(entrypoint, platform),
    results.length.toString()
  );
};
var makePrompt = async (entryPoint, addableFiles, platform) => {
  const promptPath = path3.join(
    "./docs/",
    platform,
    entryPoint.split(".").slice(0, -1).join("."),
    `prompt.txt`
  );
  const testPaths = path3.join(
    "./docs/",
    platform,
    entryPoint.split(".").slice(0, -1).join("."),
    `tests.json`
  );
  const featuresPath = path3.join(
    "./docs/",
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

/read ${lintPather(entryPoint, platform)}
/read ${tscPather(entryPoint, platform)}
/read ${testPaths}

/load ${featuresPath}

/code Fix the failing tests described in ${testPaths}. Correct any type signature errors described in the files ${tscPather(
      entryPoint,
      platform
    )}. Implement any method which throws "Function not implemented. Resolve the lint errors described in ${lintPather(
      entryPoint,
      platform
    )}"
          `
  );
};
var metafileOutputs = async (platform) => {
  const metafile = JSON.parse(
    fs2.readFileSync(`docs/${platform}/metafile.json`).toString()
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
        tscCheck({ platform, addableFiles, entrypoint });
        eslintCheck(entrypoint, platform, addableFiles);
        makePrompt(entrypoint, addableFiles, platform);
      }
    }
  });
};
import(process.cwd() + "/" + process.argv[2]).then(async (module) => {
  const rawConfig = module.default;
  const config = {
    ...rawConfig,
    buildDir: process.cwd() + "/" + rawConfig.outdir
  };
  let mode = config.devMode ? "DEV" : "PROD";
  const fileHashes = {};
  let pm = new PM_Main(config);
  console.log(ansiC2.inverse(`Press 'q' to shutdown gracefully`));
  process.stdin.on("keypress", (str, key) => {
    if (key.name === "q") {
      console.log(
        ansiC2.inverse("Testeranto-Run is shutting down gracefully...")
      );
      mode = "PROD";
      nodeMetafileWatcher.close();
      webMetafileWatcher.close();
      pm.shutDown();
    }
  });
  metafileOutputs("node");
  const nodeMetafileWatcher = watch(
    "docs/node/metafile.json",
    async (e, filename) => {
      console.log(ansiC2.green(ansiC2.inverse(`< ${e} ${filename} (node)`)));
      metafileOutputs("node");
    }
  );
  metafileOutputs("web");
  const webMetafileWatcher = watch(
    "docs/web/metafile.json",
    async (e, filename) => {
      console.log(ansiC2.green(ansiC2.inverse(`< ${e} ${filename} (web)`)));
      metafileOutputs("web");
    }
  );
  await pm.startPuppeteer(
    {
      slowMo: 1,
      // timeout: 1,
      waitForInitialPage: false,
      executablePath: (
        // process.env.CHROMIUM_PATH || "/opt/homebrew/bin/chromium",
        "/opt/homebrew/bin/chromium"
      ),
      headless: true,
      dumpio: true,
      // timeout: 0,
      devtools: true,
      args: [
        "--auto-open-devtools-for-tabs",
        `--remote-debugging-port=3234`,
        // "--disable-features=IsolateOrigins,site-per-process",
        "--disable-site-isolation-trials",
        "--allow-insecure-localhost",
        "--allow-file-access-from-files",
        "--allow-running-insecure-content",
        "--disable-dev-shm-usage",
        "--disable-extensions",
        "--disable-gpu",
        "--disable-setuid-sandbox",
        "--disable-site-isolation-trials",
        "--disable-web-security",
        "--no-first-run",
        "--no-sandbox",
        "--no-startup-window",
        // "--no-zygote",
        "--reduce-security-for-testing",
        "--remote-allow-origins=*",
        "--unsafely-treat-insecure-origin-as-secure=*"
        // "--disable-features=IsolateOrigins",
        // "--remote-allow-origins=ws://localhost:3234",
        // "--single-process",
        // "--unsafely-treat-insecure-origin-as-secure",
        // "--unsafely-treat-insecure-origin-as-secure=ws://192.168.0.101:3234",
        // "--disk-cache-dir=/dev/null",
        // "--disk-cache-size=1",
        // "--start-maximized",
      ]
    },
    "."
  );
  const { nodeEntryPoints, webEntryPoints } = getRunnables(config.tests);
  Object.entries(nodeEntryPoints).forEach(
    ([k, outputFile]) => {
      pm.launchNode(k, outputFile);
      try {
        watch(outputFile, async (e, filename) => {
          const hash = await fileHash(outputFile);
          if (fileHashes[k] !== hash) {
            fileHashes[k] = hash;
            console.log(ansiC2.green(ansiC2.inverse(`< ${e} ${filename}`)));
            pm.launchNode(k, outputFile);
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
  );
  Object.entries(webEntryPoints).forEach(
    ([k, outputFile]) => {
      pm.launchWeb(k, outputFile);
      watch(outputFile, async (e, filename) => {
        const hash = await fileHash(outputFile);
        if (fileHashes[k] !== hash) {
          fileHashes[k] = hash;
          console.log(ansiC2.green(ansiC2.inverse(`< ${e} ${filename}`)));
          pm.launchWeb(k, outputFile);
        }
      });
    }
  );
});
