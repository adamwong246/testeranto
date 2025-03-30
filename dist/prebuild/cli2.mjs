import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/cli2.ts
import { watch } from "fs";

// src/PM/main.ts
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer-core";
import crypto from "crypto";

// src/PM/index.ts
var PM = class {
};

// src/PM/main.ts
var fileStreams3 = [];
var fPaths = [];
var files = {};
var recorders = {};
var screenshots = {};
var PM_Main = class extends PM {
  constructor(configs) {
    super();
    this.shutdownMode = false;
    this.checkForShutdown = () => {
      const anyRunning = Object.values(this.registry).filter((x) => x === false).length > 0;
      if (anyRunning) {
      } else {
        this.browser.disconnect().then(() => {
          console.log("Goodbye");
          process.exit();
        });
      }
    };
    this.register = (src) => {
      this.registry[src] = false;
    };
    this.deregister = (src) => {
      this.registry[src] = true;
      if (this.shutdownMode) {
        this.checkForShutdown();
      }
    };
    this.launchNode = async (src, dest) => {
      console.log("! node", src);
      this.register(src);
      const destFolder = dest.replace(".mjs", "");
      let argz = "";
      const testConfig = this.configs.tests.find((t) => {
        return t[0] === src;
      });
      if (!testConfig) {
        console.error("missing test config");
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
            console.log(`${src} completed with ${failed} errors`);
          }).catch((e) => {
            console.log(`${src} errored with`, e);
          }).finally(() => {
            webSideCares.forEach((webSideCar) => webSideCar.close());
            this.deregister(src);
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
      console.log("launchWebSideCar", src, dest, d);
      const destFolder = dest.replace(".mjs", "");
      const fileStreams2 = [];
      const doneFileStream2 = [];
      return new Promise((res, rej) => {
        this.browser.newPage().then((page) => {
          page.exposeFunction(
            "custom-screenshot",
            async (ssOpts, testName) => {
              const p = ssOpts.path;
              const dir = path.dirname(p);
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
              const dir = path.dirname(fp);
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
      console.log("launchNodeSideCar", src, dest, d);
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
      console.log("! web", t);
      this.register(t);
      const destFolder = dest.replace(".mjs", "");
      const webArgz = JSON.stringify({
        name: dest,
        ports: [].toString(),
        fs: destFolder,
        browserWSEndpoint: this.browser.wsEndpoint()
      });
      const d = `${dest}?cacheBust=${Date.now()}`;
      const evaluation = `
    console.log("importing ${d}");
    import('${d}').then(async (x) => {
      console.log("imported", (await x.default));
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
            const dir = path.dirname(p);
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
            const dir = path.dirname(p);
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
            this.deregister(t);
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
        });
        page.on("console", (log) => {
          stdoutStream.write(log.text());
          stdoutStream.write(JSON.stringify(log.location()));
          stdoutStream.write(JSON.stringify(log.stackTrace()));
        });
        await page.goto(`file://${`${destFolder}.html`}`, {});
        await page.evaluate(evaluation).then(async ({ failed, features }) => {
          this.receiveFeatures(features, destFolder, t);
          console.log(`${t} completed with ${failed} errors`);
        }).catch((e) => {
          console.log(`${t} errored with`, e);
        }).finally(() => {
          close();
        });
        return page;
      });
    };
    this.receiveFeatures = (features, destFolder, srcTest) => {
      const featureDestination = path.resolve(
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
            const newPath = `${process.cwd()}/docs/features/internal/${path.relative(
              process.cwd(),
              u.pathname
            )}`;
            await fs.promises.mkdir(path.dirname(newPath), { recursive: true });
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
          await fs.promises.mkdir(path.dirname(featureDestination), {
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
    };
    this.server = {};
    this.configs = configs;
    this.ports = {};
    this.registry = {};
    this.configs.ports.forEach((element) => {
      this.ports[element] = "true";
    });
    globalThis["waitForSelector"] = async (pageKey, sel) => {
      console.log("waitForSelector", pageKey, sel);
      const page = (await this.browser.pages()).find(
        (p) => p.mainFrame()._id === pageKey
      );
      await page?.waitForSelector(sel);
    };
    globalThis["screencastStop"] = async (path3) => {
      return recorders[path3].stop();
    };
    globalThis["closePage"] = async (pageKey) => {
      const page = (await this.browser.pages()).find(
        (p) => p.mainFrame()._id === pageKey
      );
      return page.close();
    };
    globalThis["goto"] = async (pageKey, url) => {
      const page = (await this.browser.pages()).find(
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
      const dir = path.dirname(filepath);
      fs.mkdirSync(dir, {
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
        (p2) => p2.mainFrame()._id === pageKey
      );
      const p = opts.path;
      const dir = path.dirname(p);
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
        (p2) => p2.mainFrame()._id === pageKey
      );
      const p = opts.path;
      const dir = path.dirname(p);
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
          const cleanPath = path.resolve(fPath);
          fPaths.push(cleanPath.replace(process.cwd(), ``));
          const targetDir = cleanPath.split("/").slice(0, -1).join("/");
          fs.mkdir(targetDir, { recursive: true }, async (error) => {
            if (error) {
              console.error(`\u2757\uFE0FtestArtiFactory failed`, targetDir, error);
            }
            fs.writeFileSync(
              path.resolve(
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
  ////////////////////////////////////////////////////////////////////////////////
  shutDown() {
    console.log("shutting down...");
    this.shutdownMode = true;
    this.checkForShutdown();
  }
};
async function writeFileAndCreateDir(filePath, data) {
  const dirPath = path.dirname(filePath);
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

// src/cli2.ts
import path2 from "path";
import crypto2 from "node:crypto";
import fs2 from "fs";
var fileHashes = {};
async function fileHash(filePath, algorithm = "md5") {
  return new Promise((resolve, reject) => {
    const hash = crypto2.createHash(algorithm);
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
var getRunnables = (tests, payload = {
  nodeEntryPoints: {},
  webEntryPoints: {}
}) => {
  return tests.reduce((pt, cv, cndx, cry) => {
    if (cv[1] === "node") {
      pt.nodeEntryPoints[cv[0]] = path2.resolve(
        `./docs/node/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    } else if (cv[1] === "web") {
      pt.webEntryPoints[cv[0]] = path2.resolve(
        `./docs/web/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    }
    if (cv[3].length) {
      getRunnables(cv[3], payload);
    }
    return pt;
  }, payload);
};
import(process.cwd() + "/" + process.argv[2]).then(async (module) => {
  const rawConfig = module.default;
  const config = {
    ...rawConfig,
    buildDir: process.cwd() + "/" + rawConfig.outdir
  };
  let pm = new PM_Main(config);
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
      console.log("watching", outputFile);
      try {
        watch(outputFile, async (filename) => {
          const hash = await fileHash(outputFile);
          if (fileHashes[k] !== hash) {
            fileHashes[k] = hash;
            console.log(`< ${filename} `);
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
      console.log("watching", outputFile);
      watch(outputFile, async (filename) => {
        const hash = await fileHash(outputFile);
        console.log(`< ${filename} ${hash}`);
        if (fileHashes[k] !== hash) {
          fileHashes[k] = hash;
          pm.launchWeb(k, outputFile);
        }
      });
    }
  );
});
