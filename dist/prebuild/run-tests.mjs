import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/Puppeteer.ts
import readline from "readline";
import fs2 from "fs";
import watch from "recursive-watch";

// src/PM/main.ts
import fs from "fs";
import path2 from "path";
import puppeteer from "puppeteer-core";
import crypto from "crypto";

// src/PM/index.ts
var PM = class {
};

// src/utils.ts
import path from "path";
var destinationOfRuntime = (f, r, configs) => {
  return path.normalize(`${configs.buildDir}/${r}/${f}`).split(".").slice(0, -1).join(".");
};

// src/PM/main.ts
var fileStreams3 = [];
var fPaths = [];
var files = {};
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
      console.log("launchNode", src);
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
      const builtfile = dest + ".mjs";
      await Promise.all(
        testConfig[3].map((sidecar) => {
          if (sidecar[1] === "web") {
            return this.launchWebSideCar(
              sidecar[0],
              destinationOfRuntime(sidecar[0], "web", this.configs),
              sidecar
            );
          }
          if (sidecar[1] === "node") {
            return this.launchNodeSideCar(
              sidecar[0],
              destinationOfRuntime(sidecar[0], "node", this.configs),
              sidecar
            );
          }
        })
      );
      this.server[builtfile] = await import(`${builtfile}?cacheBust=${Date.now()}`).then((module) => {
        return module.default.then((defaultModule) => {
          defaultModule.receiveTestResourceConfig(argz).then(async (features) => {
            this.receiveFeatures(features, destFolder);
          }).catch((e) => {
            console.log("catch", e);
          }).finally(() => {
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
      const webArgz = JSON.stringify({
        name: dest,
        ports: [].toString(),
        fs: destFolder,
        browserWSEndpoint: this.browser.wsEndpoint()
      });
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
          page.exposeFunction("customclose", (p, testName) => {
            fs.writeFileSync(
              p + "/manifest.json",
              JSON.stringify(Array.from(files[testName]))
            );
            delete files[testName];
            Promise.all(screenshots[testName] || []).then(() => {
              delete screenshots[testName];
            });
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
    this.launchWeb = (t, dest, sidecars) => {
      console.log("launchWeb", t, dest);
      this.register(t);
      sidecars.map((sidecar) => {
        if (sidecar[1] === "node") {
          return this.launchNodeSideCar(
            sidecar[0],
            destinationOfRuntime(sidecar[0], "node", this.configs),
            sidecar
          );
        }
      });
      const destFolder = dest.replace(".mjs", "");
      const webArgz = JSON.stringify({
        name: dest,
        ports: [].toString(),
        fs: destFolder,
        browserWSEndpoint: this.browser.wsEndpoint()
      });
      const evaluation = `
    console.log("importing ${dest}.mjs");
    import('${dest}.mjs').then(async (x) => {
      console.log("imported", (await x.default));
      try {
        return await (await x.default).receiveTestResourceConfig(${webArgz})
      } catch (e) {
        console.log("fail", e)
      }
    })`;
      const fileStreams2 = [];
      const doneFileStream2 = [];
      const stdoutStream = fs.createWriteStream(`${dest}/stdout.log`);
      const stderrStream = fs.createWriteStream(`${dest}/stderr.log`);
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
            const dir = path2.dirname(fp);
            fs.mkdirSync(dir, {
              recursive: true
            });
            const p = new Promise(async (res, rej) => {
              fs.writeFileSync(fp, contents);
              res(fp);
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
        page.exposeFunction("customclose", (p, testName) => {
          fs.writeFileSync(
            p + "/manifest.json",
            JSON.stringify(Array.from(files[testName]))
          );
          delete files[testName];
          Promise.all(screenshots[testName] || []).then(() => {
            delete screenshots[testName];
          });
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
          console.log("evaluation complete.", dest);
          this.deregister(t);
          stderrStream.close();
          stdoutStream.close();
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
        await page.goto(`file://${`${dest}.html`}`, {});
        await page.evaluate(evaluation).then(async (features) => {
          this.receiveFeatures(features, destFolder);
        }).catch((e) => {
          console.log("evaluation failed.", dest);
          console.log(e);
        }).finally(() => {
          close();
        });
        return page;
      });
    };
    this.receiveFeatures = (features, destFolder) => {
      console.log("this.receiveFeatures", features);
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
            accum.push(newPath);
          } else if (u.protocol === "http:" || u.protocol === "https:") {
            const newPath = `${process.cwd()}/docs/features/external${u.hostname}${u.pathname}`;
            const body = await this.configs.featureIngestor(featureStringKey);
            writeFileAndCreateDir(newPath, body);
            accum.push(newPath);
          }
        } else {
          const newPath = `${process.cwd()}/docs/features/plain/${await sha256(
            featureStringKey
          )}`;
          writeFileAndCreateDir(newPath, featureStringKey);
          accum.push(newPath);
        }
        return accum;
      }, Promise.resolve([])).then((features2) => {
        fs.writeFileSync(
          `${destFolder}/featurePrompt.txt`,
          features2.map((f) => {
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
    globalThis["mkdirSync"] = (fp) => {
      if (!fs.existsSync(fp)) {
        return fs.mkdirSync(fp, {
          recursive: true
        });
      }
      return false;
    };
    globalThis["writeFileSync"] = (filepath, contents, testName) => {
      const dir = path2.dirname(filepath.split("/").slice(0, -1).join("/"));
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
    globalThis["customScreenShot"] = async (opts, page) => {
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
    globalThis["customclose"] = (p, testName) => {
      if (!files[testName]) {
        files[testName] = /* @__PURE__ */ new Set();
      }
      fs.writeFileSync(
        p + "/manifest.json",
        JSON.stringify(Array.from(files[testName]))
      );
      delete files[testName];
    };
  }
  $(selector) {
    throw new Error("Method not implemented.");
  }
  screencast(opts) {
    throw new Error("Method not implemented.");
  }
  customScreenShot(opts) {
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
  const dirPath = path2.dirname(filePath);
  try {
    await fs.promises.mkdir(dirPath, { recursive: true });
    await fs.promises.writeFile(filePath, data);
  } catch (error) {
    console.error(`Error writing file: ${error}`);
  }
}
async function sha256(rawData) {
  const data = typeof rawData === "object" ? JSON.stringify(rawData) : String(rawData);
  const msgBuffer = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

// src/Puppeteer.ts
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
var Puppeteer_default = async (partialConfig) => {
  const config = {
    ...partialConfig,
    buildDir: process.cwd() + "/" + partialConfig.outdir
  };
  fs2.writeFileSync(
    `${config.outdir}/testeranto.json`,
    JSON.stringify(
      {
        ...config,
        buildDir: process.cwd() + "/" + config.outdir
      },
      null,
      2
    )
  );
  const pm = new PM_Main(config);
  await pm.startPuppeteer(
    {
      // timeout: 1,
      waitForInitialPage: false,
      executablePath: (
        // process.env.CHROMIUM_PATH || "/opt/homebrew/bin/chromium",
        "/opt/homebrew/bin/chromium"
      ),
      headless: false,
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
  console.log(
    "\n Puppeteer is running. Press 'q' to shutdown softly. Press 'x' to shutdown forcefully.\n"
  );
  process.stdin.on("keypress", (str, key) => {
    if (key.name === "q") {
      pm.shutDown();
    }
    if (key.name === "x") {
      process.exit(-1);
    }
  });
  config.tests.forEach(([test, runtime, tr, sidecars]) => {
    if (runtime === "node") {
      pm.launchNode(test, destinationOfRuntime(test, "node", config));
    } else if (runtime === "web") {
      pm.launchWeb(test, destinationOfRuntime(test, "web", config), sidecars);
    } else {
      console.error("runtime makes no sense", runtime);
    }
  });
  if (config.devMode) {
    console.log("ready and watching for changes...", config.buildDir);
    watch(config.buildDir, (eventType, changedFile) => {
      if (changedFile) {
        config.tests.forEach(([test, runtime, tr, sidecars]) => {
          if (eventType === "change" || eventType === "rename") {
            if (changedFile === test.replace("./", "node/").split(".").slice(0, -1).concat("mjs").join(".")) {
              pm.launchNode(test, destinationOfRuntime(test, "node", config));
            }
            if (changedFile === test.replace("./", "web/").split(".").slice(0, -1).concat("mjs").join(".")) {
              pm.launchWeb(
                test,
                destinationOfRuntime(test, "web", config),
                sidecars
              );
            }
          }
        });
      }
    });
  } else {
    pm.shutDown();
  }
};

// src/run-tests.ts
import process2 from "process";
if (!process2.argv[2]) {
  console.log("You didn't pass a config file");
  process2.exit(-1);
} else {
  import(process2.cwd() + "/" + process2.argv[2]).then((module) => {
    Puppeteer_default(module.default);
  });
}
