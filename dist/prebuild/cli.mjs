import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/cli.ts
import { spawn } from "child_process";
import esbuild from "esbuild";
import fs3 from "fs";
import path5 from "path";
import readline from "readline";
import { glob } from "glob";
import watch from "recursive-watch";

// src/esbuildConfigs/index.ts
var esbuildConfigs_default = (config) => {
  return {
    // packages: "external",
    target: "esnext",
    format: "esm",
    splitting: true,
    outExtension: { ".js": ".mjs" },
    outbase: config.outbase,
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
import path from "path";
var otherInputs = {};
var register = (entrypoint, sources) => {
  if (!otherInputs[entrypoint]) {
    otherInputs[entrypoint] = /* @__PURE__ */ new Set();
  }
  sources.forEach((s) => otherInputs[entrypoint].add(s));
};
function tree(meta, key) {
  const outputKey = Object.keys(meta.outputs).find((k) => {
    return meta.outputs[k].entryPoint === key;
  });
  if (!outputKey) {
    console.error("No outputkey found");
    process.exit(-1);
  }
  return Object.keys(meta.outputs[outputKey].inputs).filter(
    (k) => k.startsWith("src")
  );
}
var inputFilesPlugin_default = (platform, entryPoints) => {
  return {
    register,
    inputFilesPluginFactory: {
      name: "metafileWriter",
      setup(build) {
        build.onEnd((result) => {
          fs.writeFileSync(
            `docs/${platform}/metafile.json`,
            JSON.stringify(result, null, 2)
          );
          if (result.errors.length === 0) {
            entryPoints.forEach((entryPoint) => {
              const filePath = path.join(
                "./docs/",
                platform,
                entryPoint.split(".").slice(0, -1).join("."),
                `inputFiles.json`
              );
              const dirName = path.dirname(filePath);
              if (!fs.existsSync(dirName)) {
                fs.mkdirSync(dirName, { recursive: true });
              }
              const promptPath = path.join(
                "./docs/",
                platform,
                entryPoint.split(".").slice(0, -1).join("."),
                `prompt.txt`
              );
              const testPaths = path.join(
                "./docs/",
                platform,
                entryPoint.split(".").slice(0, -1).join("."),
                `tests.json`
              );
              const featuresPath = path.join(
                "./docs/",
                platform,
                entryPoint.split(".").slice(0, -1).join("."),
                `featurePrompt.txt`
              );
              const stderrPath = path.join(
                "./docs/",
                platform,
                entryPoint.split(".").slice(0, -1).join("."),
                `stderr.log`
              );
              const stdoutPath = path.join(
                "./docs/",
                platform,
                entryPoint.split(".").slice(0, -1).join("."),
                `stdout.log`
              );
              if (result.metafile) {
                const addableFiles = tree(
                  result.metafile,
                  entryPoint.split("/").slice(1).join("/")
                ).map((y) => {
                  if (otherInputs[y]) {
                    return Array.from(otherInputs[y]);
                  }
                  return y;
                }).flat();
                const typeErrorFiles = addableFiles.map(
                  (t) => `docs/types/${t}.type_errors.txt`
                );
                fs.writeFileSync(
                  promptPath,
                  `
${addableFiles.map((x) => {
                    return `/add ${x}`;
                  }).join("\n")}
  
${typeErrorFiles.map((x) => {
                    return `/read ${x}`;
                  }).join("\n")}
  
/read ${testPaths}
/read ${stdoutPath}
/read ${stderrPath}

/load ${featuresPath}

/code Fix the failing tests described in ${testPaths}. Correct any type signature errors described in the files [${typeErrorFiles.join(
                    ", "
                  )}]. Implement any method which throws "Function not implemented."
`
                );
              }
            });
          }
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

// src/esbuildConfigs/node.ts
var node_default = (config, entryPoints) => {
  const { inputFilesPluginFactory, register: register2 } = inputFilesPlugin_default(
    "node",
    entryPoints
  );
  return {
    ...esbuildConfigs_default(config),
    splitting: true,
    outdir: config.outdir + "/node",
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
    external: [
      // "testeranto.json",
      // "features.test.js",
      "react",
      // "events",
      // "ganache"
      ...config.externals
    ],
    entryPoints: [...entryPoints],
    plugins: [
      featuresPlugin_default,
      ...config.nodePlugins.map((p) => p(register2, entryPoints)) || [],
      inputFilesPluginFactory,
      // inputFilesPlugin("node", entryPoints),
      {
        name: "rebuild-notify",
        setup(build) {
          build.onEnd((result) => {
            console.log(
              `> node build ended with ${result.errors.length} errors`
            );
            if (result.errors.length > 0) {
              console.log(result);
            }
          });
        }
      }
    ]
  };
};

// src/esbuildConfigs/web.ts
import path3 from "path";
var web_default = (config, entryPoints) => {
  const { inputFilesPluginFactory, register: register2 } = inputFilesPlugin_default(
    "web",
    entryPoints
  );
  return {
    ...esbuildConfigs_default(config),
    // inject: ["./node_modules/testeranto/dist/cjs-shim.js"],
    // banner: {
    //   js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
    // },
    // splitting: true,
    outdir: config.outdir + "/web",
    alias: {
      react: path3.resolve("./node_modules/react")
    },
    metafile: true,
    external: [
      // "testeranto.json",
      // "features.test.ts",
      // "url",
      // "react",
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
    plugins: [
      featuresPlugin_default,
      // markdownPlugin({}),
      ...config.nodePlugins.map((p) => p(register2, entryPoints)) || [],
      inputFilesPluginFactory,
      {
        name: "rebuild-notify",
        setup(build) {
          build.onEnd((result) => {
            console.log(
              `> web build ended with ${result.errors.length} errors`
            );
            if (result.errors.length > 0) {
              console.log(result);
            }
          });
        }
      }
    ]
  };
};

// src/web.html.ts
var web_html_default = (jsfilePath, htmlFilePath) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <script type="module" src="${jsfilePath}"></script>

</head>

<body>
  <h1>${htmlFilePath}</h1>
  <div id="root">

  </div>
</body>

<footer></footer>

</html>
`;

// src/PM/main.ts
import fs2 from "fs";
import path4 from "path";
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
            this.receiveFeatures(features, destFolder);
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
              const dir = path4.dirname(p);
              fs2.mkdirSync(dir, {
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
              const dir = path4.dirname(fp);
              fs2.mkdirSync(dir, {
                recursive: true
              });
              const p = new Promise(async (res2, rej2) => {
                fs2.writeFileSync(fp, contents);
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
            (fp, testName) => {
              const f = fs2.createWriteStream(fp);
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
      const stdoutStream = fs2.createWriteStream(`${dest}/stdout.log`);
      const stderrStream = fs2.createWriteStream(`${dest}/stderr.log`);
      this.browser.newPage().then((page) => {
        page.exposeFunction(
          "screencast",
          async (ssOpts, testName) => {
            const p = ssOpts.path;
            const dir = path4.dirname(p);
            fs2.mkdirSync(dir, {
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
            const dir = path4.dirname(p);
            fs2.mkdirSync(dir, {
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
          (fp, testName) => {
            const f = fs2.createWriteStream(fp);
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
          fs2.writeFileSync(
            dest + "/manifest.json",
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
        await page.goto(`file://${`${dest}.html`}`, {});
        await page.evaluate(evaluation).then(async ({ failed, features }) => {
          this.receiveFeatures(features, destFolder);
          console.log(`${t} completed with ${failed} errors`);
        }).catch((e) => {
          console.log(`${t} errored with`, e);
        }).finally(() => {
          close();
        });
        return page;
      });
    };
    this.receiveFeatures = (features, destFolder) => {
      features.reduce(async (mm, featureStringKey) => {
        const accum = await mm;
        const isUrl = isValidUrl(featureStringKey);
        if (isUrl) {
          const u = new URL(featureStringKey);
          if (u.protocol === "file:") {
            const newPath = `${process.cwd()}/docs/features/internal/${path4.relative(
              process.cwd(),
              u.pathname
            )}`;
            await fs2.promises.mkdir(path4.dirname(newPath), { recursive: true });
            try {
              await fs2.unlinkSync(newPath);
            } catch (error) {
              if (error.code !== "ENOENT") {
              }
            }
            fs2.symlink(u.pathname, newPath, (err) => {
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
        fs2.writeFileSync(
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
    globalThis["waitForSelector"] = async (pageKey, sel) => {
      console.log("waitForSelector", pageKey, sel);
      const page = (await this.browser.pages()).find(
        (p) => p.mainFrame()._id === pageKey
      );
      await page?.waitForSelector(sel);
    };
    globalThis["screencastStop"] = async (path6) => {
      return recorders[path6].stop();
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
      if (!fs2.existsSync(fp)) {
        return fs2.mkdirSync(fp, {
          recursive: true
        });
      }
      return false;
    };
    globalThis["writeFileSync"] = (filepath, contents, testName) => {
      const dir = path4.dirname(filepath);
      fs2.mkdirSync(dir, {
        recursive: true
      });
      if (!files[testName]) {
        files[testName] = /* @__PURE__ */ new Set();
      }
      files[testName].add(filepath);
      return fs2.writeFileSync(filepath, contents);
    };
    globalThis["createWriteStream"] = (filepath, testName) => {
      const f = fs2.createWriteStream(filepath);
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
      const dir = path4.dirname(p);
      fs2.mkdirSync(dir, {
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
      const dir = path4.dirname(p);
      fs2.mkdirSync(dir, {
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
    return fs2.existsSync(destFolder);
  }
  async mkdirSync(fp) {
    if (!fs2.existsSync(fp)) {
      return fs2.mkdirSync(fp, {
        recursive: true
      });
    }
    return false;
  }
  writeFileSync(fp, contents) {
    fs2.writeFileSync(fp, contents);
  }
  createWriteStream(filepath) {
    return fs2.createWriteStream(filepath);
  }
  testArtiFactoryfileWriter(tLog, callback) {
    return (fPath, value) => {
      callback(
        new Promise((res, rej) => {
          tLog("testArtiFactory =>", fPath);
          const cleanPath = path4.resolve(fPath);
          fPaths.push(cleanPath.replace(process.cwd(), ``));
          const targetDir = cleanPath.split("/").slice(0, -1).join("/");
          fs2.mkdir(targetDir, { recursive: true }, async (error) => {
            if (error) {
              console.error(`\u2757\uFE0FtestArtiFactory failed`, targetDir, error);
            }
            fs2.writeFileSync(
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
              fs2.writeFileSync(fPath, value, "binary");
              res();
            } else if (`string` === typeof value) {
              fs2.writeFileSync(fPath, value.toString(), {
                encoding: "utf-8"
              });
              res();
            } else {
              const pipeStream = value;
              const myFile = fs2.createWriteStream(fPath);
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
  const dirPath = path4.dirname(filePath);
  try {
    await fs2.promises.mkdir(dirPath, { recursive: true });
    await fs2.promises.writeFile(filePath, data);
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

// src/cli.ts
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
var logContent = [];
function parseTsErrors() {
  try {
    const regex = /(^src(.*?))\(\d*,\d*\): error/gm;
    const brokenFilesToLines = {};
    for (let i = 0; i < logContent.length - 1; i++) {
      let m;
      while ((m = regex.exec(logContent[i])) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        if (!brokenFilesToLines[m[1]]) {
          brokenFilesToLines[m[1]] = /* @__PURE__ */ new Set();
        }
        brokenFilesToLines[m[1]].add(i);
      }
    }
    const final = Object.keys(brokenFilesToLines).reduce((mm, lm, ndx) => {
      mm[lm] = Array.from(brokenFilesToLines[lm]).map((l, ndx3) => {
        const a = Array.from(brokenFilesToLines[lm]);
        return Object.keys(a).reduce((mm2, lm2, ndx2) => {
          const acc = [];
          let j = a[lm2] + 1;
          let working = true;
          while (j < logContent.length - 1 && working) {
            if (!logContent[j].match(regex) && working && !logContent[j].match(/^..\/(.*?)\(\d*,\d*\)/)) {
              acc.push(logContent[j]);
            } else {
              working = false;
            }
            j++;
          }
          mm2[lm] = [logContent[l], ...acc];
          return mm2;
        }, {})[lm];
      });
      return mm;
    }, {});
    Object.keys(final).forEach((k) => {
      fs3.mkdirSync(`./docs/types/${k.split("/").slice(0, -1).join("/")}`, {
        recursive: true
      });
      fs3.writeFileSync(
        `./docs/types/${k}.type_errors.txt`,
        final[k].flat().flat().join("\r\n")
      );
    });
  } catch (error) {
    console.error("Error reading or parsing the log file:", error);
    process.exit(1);
  }
}
var typecheck = () => {
  console.log("typechecking...");
  return new Promise((resolve, reject) => {
    const tsc = spawn("tsc", ["-noEmit"]);
    tsc.stdout.on("data", (data) => {
      const lines = data.toString().split("\n");
      logContent.push(...lines);
    });
    tsc.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
      process.exit(-1);
    });
    tsc.on("close", (code) => {
      parseTsErrors();
      console.log("...typechecking done");
      resolve(`tsc process exited with code ${code}`);
    });
  });
};
var getRunnables = (tests, payload = {
  nodeEntryPoints: {},
  webEntryPoints: {}
}) => {
  return tests.reduce((pt, cv, cndx, cry) => {
    if (cv[1] === "node") {
      pt.nodeEntryPoints[cv[0]] = path5.resolve(
        `./docs/node/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    } else if (cv[1] === "web") {
      pt.nodeEntryPoints[cv[0]] = path5.resolve(
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
  const getSecondaryEndpointsPoints = (runtime) => {
    const meta = (ts, st) => {
      ts.forEach((t) => {
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
  const config = {
    ...rawConfig,
    buildDir: process.cwd() + "/" + rawConfig.outdir
  };
  let nodeDone = false;
  let webDone = false;
  let mode = config.devMode ? "DEV" : "PROD";
  let status = "build";
  let pm = new PM_Main(config);
  const onNodeDone = () => {
    nodeDone = true;
    onDone();
  };
  const onWebDone = () => {
    webDone = true;
    onDone();
  };
  const onDone = async () => {
    if (nodeDone && webDone && mode === "PROD") {
      console.log("Testeranto-EsBuild is all done. Goodbye!");
      process.exit();
    } else {
      if (mode === "PROD") {
        console.log("waiting for tests to finish");
        console.log(
          JSON.stringify(
            {
              nodeDone,
              webDone,
              mode
            },
            null,
            2
          )
        );
      } else {
        console.log("waiting for tests to change");
      }
      console.log("press 'q' to quit");
      if (config.devMode) {
        console.log("ready and watching for changes...");
      } else {
        pm.shutDown();
      }
    }
  };
  console.log(
    `Press 'q' to shutdown gracefully. Press 'x' to shutdown forcefully.`
  );
  process.stdin.on("keypress", (str, key) => {
    if (key.name === "q") {
      console.log("Testeranto-EsBuild is shutting down...");
      mode = "PROD";
      onDone();
    }
  });
  fs3.writeFileSync(
    `${config.outdir}/testeranto.json`,
    JSON.stringify(config, null, 2)
  );
  Promise.resolve(
    Promise.all(
      [...getSecondaryEndpointsPoints("web")].map(async (sourceFilePath) => {
        const sourceFileSplit = sourceFilePath.split("/");
        const sourceDir = sourceFileSplit.slice(0, -1);
        const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
        const sourceFileNameMinusJs = sourceFileName.split(".").slice(0, -1).join(".");
        const htmlFilePath = path5.normalize(
          `${process.cwd()}/${config.outdir}/web/${sourceDir.join(
            "/"
          )}/${sourceFileNameMinusJs}.html`
        );
        const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
        return fs3.promises.mkdir(path5.dirname(htmlFilePath), { recursive: true }).then(
          (x) => fs3.writeFileSync(
            htmlFilePath,
            web_html_default(jsfilePath, htmlFilePath)
          )
        );
      })
    )
  );
  const { nodeEntryPoints, webEntryPoints } = getRunnables(config.tests);
  glob(`./${config.outdir}/chunk-*.mjs`, {
    ignore: "node_modules/**"
  }).then((chunks) => {
    chunks.forEach((chunk) => {
      fs3.unlinkSync(chunk);
    });
  });
  await pm.startPuppeteer(
    {
      slowMo: 1,
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
  console.log("Puppeteer is running.");
  await typecheck();
  watch(config.src, (changedFile) => {
    typecheck();
  });
  await Promise.all([
    esbuild.context(node_default(config, Object.keys(nodeEntryPoints))).then(async (nodeContext) => {
      if (config.devMode) {
        await nodeContext.watch().then((v) => {
          onNodeDone();
        });
      } else {
        nodeContext.rebuild().then((v) => {
          onNodeDone();
        });
      }
      return nodeContext;
    }),
    esbuild.context(web_default(config, Object.keys(webEntryPoints))).then(async (webContext) => {
      if (config.devMode) {
        await webContext.watch().then((v) => {
          onWebDone();
        });
      } else {
        webContext.rebuild().then((v) => {
          onWebDone();
        });
      }
      return webContext;
    })
  ]);
  Object.entries(nodeEntryPoints).forEach(([k, outputFile]) => {
    fs3.watch(outputFile, (eventType, filename) => {
      if (eventType === "change") {
        console.log(`< ${filename} `);
        pm.launchNode(k, outputFile);
      }
    });
  });
  Object.entries(webEntryPoints).forEach(([k, outputFile]) => {
    fs3.watch(outputFile, (eventType, filename) => {
      if (eventType === "change") {
        console.log(`< ${filename} `);
        pm.launchWeb(k, outputFile);
      }
    });
  });
});
