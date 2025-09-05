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
import path2 from "path";
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
      return path2.join(
        "testeranto",
        "reports",
        projectName,
        entryPoint.split(".").slice(0, -1).join("."),
        platform,
        `type_errors.txt`
      );
    };
    lintPather = (entryPoint, platform, projectName) => {
      return path2.join(
        "testeranto",
        "reports",
        projectName,
        entryPoint.split(".").slice(0, -1).join("."),
        platform,
        `lint_errors.txt`
      );
    };
    promptPather = (entryPoint, platform, projectName) => {
      return path2.join(
        "testeranto",
        "reports",
        projectName,
        entryPoint.split(".").slice(0, -1).join("."),
        platform,
        `prompt.txt`
      );
    };
    getRunnables = (tests, projectName, payload = {
      nodeEntryPoints: {},
      nodeEntryPointSidecars: {},
      webEntryPoints: {},
      webEntryPointSidecars: {},
      pureEntryPoints: {},
      pureEntryPointSidecars: {},
      golangEntryPoints: {},
      golangEntryPointSidecars: {},
      pythonEntryPoints: {},
      pythonEntryPointSidecars: {}
    }) => {
      const initializedPayload = {
        nodeEntryPoints: payload.nodeEntryPoints || {},
        nodeEntryPointSidecars: payload.nodeEntryPointSidecars || {},
        webEntryPoints: payload.webEntryPoints || {},
        webEntryPointSidecars: payload.webEntryPointSidecars || {},
        pureEntryPoints: payload.pureEntryPoints || {},
        pureEntryPointSidecars: payload.pureEntryPointSidecars || {},
        golangEntryPoints: payload.golangEntryPoints || {},
        golangEntryPointSidecars: payload.golangEntryPointSidecars || {},
        pythonEntryPoints: payload.pythonEntryPoints || {},
        pythonEntryPointSidecars: payload.pythonEntryPointSidecars || {}
      };
      return tests.reduce((pt, cv, cndx, cry) => {
        if (cv[1] === "node") {
          pt.nodeEntryPoints[cv[0]] = path2.resolve(
            `./testeranto/bundles/node/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
          );
        } else if (cv[1] === "web") {
          pt.webEntryPoints[cv[0]] = path2.resolve(
            `./testeranto/bundles/web/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
          );
        } else if (cv[1] === "pure") {
          pt.pureEntryPoints[cv[0]] = path2.resolve(
            `./testeranto/bundles/pure/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
          );
        } else if (cv[1] === "golang") {
          pt.golangEntryPoints[cv[0]] = path2.resolve(cv[0]);
        } else if (cv[1] === "python") {
          pt.pythonEntryPoints[cv[0]] = path2.resolve(cv[0]);
        }
        cv[3].filter((t) => t[1] === "node").forEach((t) => {
          pt.nodeEntryPointSidecars[`${t[0]}`] = path2.resolve(
            `./testeranto/bundles/node/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
          );
        });
        cv[3].filter((t) => t[1] === "web").forEach((t) => {
          pt.webEntryPointSidecars[`${t[0]}`] = path2.resolve(
            `./testeranto/bundles/web/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
          );
        });
        cv[3].filter((t) => t[1] === "pure").forEach((t) => {
          pt.pureEntryPointSidecars[`${t[0]}`] = path2.resolve(
            `./testeranto/bundles/pure/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
          );
        });
        cv[3].filter((t) => t[1] === "golang").forEach((t) => {
          pt.golangEntryPointSidecars[`${t[0]}`] = path2.resolve(t[0]);
        });
        cv[3].filter((t) => t[1] === "python").forEach((t) => {
          pt.pythonEntryPointSidecars[`${t[0]}`] = path2.resolve(t[0]);
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

// src/PM/utils.ts
import ansiC from "ansi-colors";
import path3 from "path";
import fs from "fs";
import crypto from "node:crypto";
function runtimeLogs(runtime, reportDest) {
  const safeDest = reportDest || `testeranto/reports/default_${Date.now()}`;
  try {
    if (!fs.existsSync(safeDest)) {
      fs.mkdirSync(safeDest, { recursive: true });
    }
    if (runtime === "node") {
      return {
        stdout: fs.createWriteStream(`${safeDest}/stdout.log`),
        stderr: fs.createWriteStream(`${safeDest}/stderr.log`),
        exit: fs.createWriteStream(`${safeDest}/exit.log`)
      };
    } else if (runtime === "web") {
      return {
        info: fs.createWriteStream(`${safeDest}/info.log`),
        warn: fs.createWriteStream(`${safeDest}/warn.log`),
        error: fs.createWriteStream(`${safeDest}/error.log`),
        debug: fs.createWriteStream(`${safeDest}/debug.log`),
        exit: fs.createWriteStream(`${safeDest}/exit.log`)
      };
    } else if (runtime === "pure") {
      return {
        exit: fs.createWriteStream(`${safeDest}/exit.log`)
      };
    } else if (runtime === "python") {
      return {
        stdout: fs.createWriteStream(`${safeDest}/stdout.log`),
        stderr: fs.createWriteStream(`${safeDest}/stderr.log`),
        exit: fs.createWriteStream(`${safeDest}/exit.log`)
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
  if (!fs.existsSync(reportDest)) {
    fs.mkdirSync(reportDest, { recursive: true });
  }
  const safeDest = reportDest || `testeranto/reports/default_${Date.now()}`;
  try {
    if (!fs.existsSync(safeDest)) {
      fs.mkdirSync(safeDest, { recursive: true });
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
    const fileStream = fs.createReadStream(filePath);
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
  const dirPath = path3.dirname(filePath);
  try {
    await fs.promises.mkdir(dirPath, { recursive: true });
    await fs.writeFileSync(filePath, data);
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
async function pollForFile(path13, timeout = 2e3) {
  const intervalObj = setInterval(function() {
    const file = path13;
    const fileExists = fs.existsSync(file);
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
        console.log(ansiC.green(ansiC.inverse(`${runtime} > ${test}`)));
      } else if (failures > 0) {
        console.log(
          ansiC.red(
            ansiC.inverse(
              `${runtime} > ${test} failed ${failures} times (exit code: ${failures})`
            )
          )
        );
      } else {
        console.log(
          ansiC.red(ansiC.inverse(`${runtime} > ${test} crashed (exit code: -1)`))
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

// src/esbuildConfigs/index.ts
var esbuildConfigs_default;
var init_esbuildConfigs = __esm({
  "src/esbuildConfigs/index.ts"() {
    "use strict";
    esbuildConfigs_default = (config) => {
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
  }
});

// src/esbuildConfigs/inputFilesPlugin.ts
import fs2 from "fs";
var otherInputs, register, inputFilesPlugin_default;
var init_inputFilesPlugin = __esm({
  "src/esbuildConfigs/inputFilesPlugin.ts"() {
    "use strict";
    otherInputs = {};
    register = (entrypoint, sources) => {
      if (!otherInputs[entrypoint]) {
        otherInputs[entrypoint] = /* @__PURE__ */ new Set();
      }
      sources.forEach((s) => otherInputs[entrypoint].add(s));
    };
    inputFilesPlugin_default = (platform, testName2) => {
      const f2 = `testeranto/metafiles/${platform}/${testName2}.json`;
      if (!fs2.existsSync(`testeranto/metafiles/${platform}`)) {
        fs2.mkdirSync(`testeranto/metafiles/${platform}`, { recursive: true });
      }
      return {
        register,
        inputFilesPluginFactory: {
          name: "metafileWriter",
          setup(build) {
            build.onEnd((result) => {
              fs2.writeFileSync(f2, JSON.stringify(result, null, 2));
            });
          }
        }
      };
    };
  }
});

// src/esbuildConfigs/featuresPlugin.ts
import path4 from "path";
var featuresPlugin_default;
var init_featuresPlugin = __esm({
  "src/esbuildConfigs/featuresPlugin.ts"() {
    "use strict";
    featuresPlugin_default = {
      name: "feature-markdown",
      setup(build) {
        build.onResolve({ filter: /\.md$/ }, (args) => {
          if (args.resolveDir === "")
            return;
          return {
            path: path4.isAbsolute(args.path) ? args.path : path4.join(args.resolveDir, args.path),
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
  }
});

// src/esbuildConfigs/rebuildPlugin.ts
import fs3 from "fs";
var rebuildPlugin_default;
var init_rebuildPlugin = __esm({
  "src/esbuildConfigs/rebuildPlugin.ts"() {
    "use strict";
    rebuildPlugin_default = (r) => {
      return {
        name: "rebuild-notify",
        setup: (build) => {
          build.onEnd((result) => {
            console.log(`${r} > build ended with ${result.errors.length} errors`);
            if (result.errors.length > 0) {
              fs3.writeFileSync(
                `./testeranto/reports${r}_build_errors`,
                JSON.stringify(result, null, 2)
              );
            }
          });
        }
      };
    };
  }
});

// src/esbuildConfigs/node.ts
var node_default;
var init_node = __esm({
  "src/esbuildConfigs/node.ts"() {
    "use strict";
    init_esbuildConfigs();
    init_inputFilesPlugin();
    init_featuresPlugin();
    init_rebuildPlugin();
    node_default = (config, entryPoints, testName2) => {
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
  }
});

// src/esbuildConfigs/web.ts
import { polyfillNode } from "esbuild-plugin-polyfill-node";
import path5 from "path";
var web_default;
var init_web = __esm({
  "src/esbuildConfigs/web.ts"() {
    "use strict";
    init_esbuildConfigs();
    init_inputFilesPlugin();
    init_featuresPlugin();
    init_rebuildPlugin();
    web_default = (config, entryPoints, testName2) => {
      const { inputFilesPluginFactory, register: register2 } = inputFilesPlugin_default(
        "web",
        testName2
      );
      return {
        ...esbuildConfigs_default(config),
        treeShaking: true,
        outdir: `testeranto/bundles/web/${testName2}`,
        alias: {
          react: path5.resolve("./node_modules/react")
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
  }
});

// src/esbuildConfigs/consoleDetectorPlugin.ts
import fs4 from "fs";
var consoleDetectorPlugin;
var init_consoleDetectorPlugin = __esm({
  "src/esbuildConfigs/consoleDetectorPlugin.ts"() {
    "use strict";
    consoleDetectorPlugin = {
      name: "console-detector",
      setup(build) {
        build.onLoad({ filter: /\.(js|ts)$/ }, async (args) => {
          const contents = await fs4.promises.readFile(args.path, "utf8");
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
  }
});

// src/esbuildConfigs/pure.ts
import { isBuiltin } from "node:module";
var pure_default;
var init_pure = __esm({
  "src/esbuildConfigs/pure.ts"() {
    "use strict";
    init_esbuildConfigs();
    init_inputFilesPlugin();
    init_featuresPlugin();
    init_consoleDetectorPlugin();
    init_rebuildPlugin();
    pure_default = (config, entryPoints, testName2) => {
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
  }
});

// src/PM/base.ts
import fs5 from "fs";
import path6 from "path";
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
      // keep this forever. do not delete
      // mapping(): [string, (...a) => any][] {
      //   return [
      //     ["$", (...args) => this.$(...args)],
      //     ["click", (...args) => this.click(...args)],
      //     ["closePage", (...args) => this.closePage(...args)],
      //     ["createWriteStream", (...args) => this.createWriteStream(...args)],
      //     ["customclose", (...args) => this.customclose(...args)],
      //     ["customScreenShot", (...args) => this.customScreenShot(...args)],
      //     ["end", (...args) => this.end(...args)],
      //     ["existsSync", (...args) => this.existsSync(...args)],
      //     ["focusOn", (...args) => this.focusOn(...args)],
      //     ["getAttribute", (...args) => this.getAttribute(...args)],
      //     ["getInnerHtml", (...args) => this.getInnerHtml(...args)],
      //     // ["setValue", (...args) => this.setValue(...args)],
      //     ["goto", (...args) => this.goto(...args)],
      //     ["isDisabled", (...args) => this.isDisabled(...args)],
      //     // ["launchSideCar", (...args) => this.launchSideCar(...args)],
      //     ["mkdirSync", (...args) => this.mkdirSync(...args)],
      //     ["newPage", (...args) => this.newPage(...args)],
      //     ["page", (...args) => this.page(...args)],
      //     ["pages", (...args) => this.pages(...args)],
      //     ["screencast", (...args) => this.screencast(...args)],
      //     ["screencastStop", (...args) => this.screencastStop(...args)],
      //     // ["stopSideCar", (...args) => this.stopSideCar(...args)],
      //     ["typeInto", (...args) => this.typeInto(...args)],
      //     ["waitForSelector", (...args) => this.waitForSelector(...args)],
      //     ["write", (...args) => this.write(...args)],
      //     ["writeFileSync", (...args) => this.writeFileSync(...args)],
      //   ];
      // }
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
        const dir = path6.dirname(p);
        fs5.mkdirSync(dir, {
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
        const dir = path6.dirname(p);
        fs5.mkdirSync(dir, {
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
        return fs5.existsSync(destFolder);
      }
      async mkdirSync(fp) {
        if (!fs5.existsSync(fp)) {
          return fs5.mkdirSync(fp, {
            recursive: true
          });
        }
        return false;
      }
      async writeFileSync(...x) {
        console.log("writeFileSync", x);
        const filepath = x[0];
        const contents = x[1];
        const testName2 = x[2];
        return new Promise(async (res) => {
          fs5.mkdirSync(path6.dirname(filepath), {
            recursive: true
          });
          if (!files[testName2]) {
            files[testName2] = /* @__PURE__ */ new Set();
          }
          files[testName2].add(filepath);
          await fs5.writeFileSync(filepath, contents);
          res(true);
        });
      }
      async createWriteStream(filepath, testName2) {
        const folder = filepath.split("/").slice(0, -1).join("/");
        return new Promise((res) => {
          if (!fs5.existsSync(folder)) {
            return fs5.mkdirSync(folder, {
              recursive: true
            });
          }
          const f2 = fs5.createWriteStream(filepath);
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
              const cleanPath = path6.resolve(fPath);
              fPaths.push(cleanPath.replace(process.cwd(), ``));
              const targetDir = cleanPath.split("/").slice(0, -1).join("/");
              fs5.mkdir(targetDir, { recursive: true }, async (error) => {
                if (error) {
                  console.error(`\u2757\uFE0FtestArtiFactory failed`, targetDir, error);
                }
                fs5.writeFileSync(
                  path6.resolve(
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
                  fs5.writeFileSync(fPath, value, "binary");
                  res();
                } else if (`string` === typeof value) {
                  fs5.writeFileSync(fPath, value.toString(), {
                    encoding: "utf-8"
                  });
                  res();
                } else {
                  const pipeStream = value;
                  const myFile = fs5.createWriteStream(fPath);
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

// src/PM/PM_WithWebSocket.ts
import { spawn } from "node:child_process";
import fs6 from "fs";
import http from "http";
import url from "url";
import mime from "mime-types";
import { WebSocketServer } from "ws";
var PM_WithWebSocket;
var init_PM_WithWebSocket = __esm({
  "src/PM/PM_WithWebSocket.ts"() {
    "use strict";
    init_base();
    PM_WithWebSocket = class extends PM_Base {
      constructor(configs) {
        super(configs);
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
              if (message.type === "chatMessage") {
                console.log(`Received chat message: ${message.content}`);
                if (this.handleChatMessage) {
                  this.handleChatMessage(message.content);
                } else {
                  console.log("PM_WithHelpo not available - message not processed");
                }
                return;
              }
              if (message.type === "listDirectory") {
                this.handleWebSocketListDirectory(ws, message);
              } else if (message.type === "executeCommand") {
                const executeMessage = message;
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
                    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
                    type: "process",
                    category: "aider"
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
                const getRunningMessage = message;
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
              } else if (message.type === "getProcess") {
                const getProcessMessage = message;
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
                      category: procInfo.category,
                      testName: procInfo.testName,
                      platform: procInfo.platform,
                      logs: this.processLogs.get(processId) || []
                    })
                  );
                }
              } else if (message.type === "stdin") {
                const stdinMessage = message;
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
                const killProcessMessage = message;
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
              } else if (message.type === "getChatHistory") {
                if (this.getChatHistory) {
                  this.getChatHistory().then((history) => {
                    ws.send(JSON.stringify({
                      type: "chatHistory",
                      messages: history
                    }));
                  }).catch((error) => {
                    console.error("Error getting chat history:", error);
                    ws.send(JSON.stringify({
                      type: "error",
                      message: "Failed to get chat history"
                    }));
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
        const parsedUrl = url.parse(req.url || "/", true);
        const pathname = parsedUrl.pathname || "/";
        if (pathname?.startsWith("/api/files/")) {
          this.handleFilesApi(req, res);
          return;
        }
        if (pathname === "/health") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() })
          );
          return;
        }
        let processedPathname = pathname;
        if (processedPathname === "/") {
          processedPathname = "/index.html";
        }
        let filePath = processedPathname.substring(1);
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
            if (fs6.existsSync(possiblePath)) {
              foundPath = possiblePath;
              break;
            }
          }
          if (foundPath) {
            filePath = foundPath;
          } else {
            const indexPath = this.findIndexHtml();
            if (indexPath) {
              fs6.readFile(indexPath, (err, data) => {
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
        fs6.exists(filePath, (exists) => {
          if (!exists) {
            if (!processedPathname.includes(".") && processedPathname !== "/") {
              const indexPath = this.findIndexHtml();
              if (indexPath) {
                fs6.readFile(indexPath, (err, data) => {
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
          fs6.readFile(filePath, (err, data) => {
            if (err) {
              res.writeHead(500, { "Content-Type": "text/plain" });
              res.end("500 Internal Server Error");
              return;
            }
            if (filePath.endsWith(".html")) {
              let content = data.toString();
              if (content.includes("</body>")) {
                const configScript = `
              <script>
                window.testerantoConfig = ${JSON.stringify({
                  githubOAuth: {
                    clientId: process.env.GITHUB_CLIENT_ID || ""
                  },
                  serverOrigin: process.env.SERVER_ORIGIN || "http://localhost:3000"
                })};
              </script>
            `;
                content = content.replace("</body>", `${configScript}</body>`);
              }
              res.writeHead(200, { "Content-Type": "text/html" });
              res.end(content);
            } else {
              const mimeType = mime.lookup(filePath) || "application/octet-stream";
              res.writeHead(200, { "Content-Type": mimeType });
              res.end(data);
            }
          });
        });
      }
      handleFilesApi(req, res) {
        const parsedUrl = url.parse(req.url || "/", true);
        const pathname = parsedUrl.pathname || "/";
        const query = parsedUrl.query || {};
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        if (req.method === "OPTIONS") {
          res.writeHead(200);
          res.end();
          return;
        }
        try {
          if (pathname === "/api/files/list" && req.method === "GET") {
            this.handleListDirectory(req, res, query);
          } else if (pathname === "/api/files/read" && req.method === "GET") {
            this.handleReadFile(req, res, query);
          } else if (pathname === "/api/files/exists" && req.method === "GET") {
            this.handleFileExists(req, res, query);
          } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Not found" }));
          }
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Internal server error" }));
        }
      }
      async handleListDirectory(req, res, query) {
        const path13 = query.path;
        if (!path13) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Path parameter required" }));
          return;
        }
        try {
          const fullPath = this.resolvePath(path13);
          const items = await this.listDirectory(fullPath);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(items));
        } catch (error) {
          console.error("Error listing directory:", error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to list directory" }));
        }
      }
      async handleReadFile(req, res, query) {
        const path13 = query.path;
        if (!path13) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Path parameter required" }));
          return;
        }
        try {
          const fullPath = this.resolvePath(path13);
          const content = await fs6.promises.readFile(fullPath, "utf-8");
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end(content);
        } catch (error) {
          console.error("Error reading file:", error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to read file" }));
        }
      }
      async handleFileExists(req, res, query) {
        const path13 = query.path;
        if (!path13) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Path parameter required" }));
          return;
        }
        try {
          const fullPath = this.resolvePath(path13);
          const exists = fs6.existsSync(fullPath);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ exists }));
        } catch (error) {
          console.error("Error checking file existence:", error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to check file existence" }));
        }
      }
      resolvePath(requestedPath) {
        const normalizedPath = requestedPath.replace(/\.\./g, "").replace(/^\//, "").replace(/\/+/g, "/");
        return `${process.cwd()}/${normalizedPath}`;
      }
      async listDirectory(dirPath) {
        try {
          const items = await fs6.promises.readdir(dirPath, { withFileTypes: true });
          const result = [];
          for (const item of items) {
            if (item.name.startsWith("."))
              continue;
            const fullPath = `${dirPath}/${item.name}`;
            const relativePath = fullPath.replace(process.cwd(), "").replace(/^\//, "");
            if (item.isDirectory()) {
              result.push({
                name: item.name,
                type: "folder",
                path: "/" + relativePath
              });
            } else if (item.isFile()) {
              result.push({
                name: item.name,
                type: "file",
                path: "/" + relativePath
              });
            }
          }
          return result;
        } catch (error) {
          console.error("Error listing directory:", error);
          throw error;
        }
      }
      findIndexHtml() {
        const possiblePaths = [
          "dist/index.html",
          "testeranto/dist/index.html",
          "../dist/index.html",
          "./index.html"
        ];
        for (const path13 of possiblePaths) {
          if (fs6.existsSync(path13)) {
            return path13;
          }
        }
        return null;
      }
      // Add a method to track promise-based processes
      addPromiseProcess(processId, promise, command, category = "other", testName2, platform, onResolve, onReject) {
        this.runningProcesses.set(processId, promise);
        this.allProcesses.set(processId, {
          promise,
          status: "running",
          command,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          type: "promise",
          category,
          testName: testName2,
          platform
        });
        this.processLogs.set(processId, []);
        const startMessage = `Starting: ${command}`;
        const logs = this.processLogs.get(processId) || [];
        logs.push(startMessage);
        this.processLogs.set(processId, logs);
        this.broadcast({
          type: "processStarted",
          processId,
          command,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          logs: [startMessage]
        });
        promise.then((result) => {
          this.runningProcesses.delete(processId);
          const processInfo = this.allProcesses.get(processId);
          if (processInfo) {
            this.allProcesses.set(processId, {
              ...processInfo,
              status: "completed",
              exitCode: 0
            });
          }
          const successMessage = `Completed successfully with result: ${JSON.stringify(
            result
          )}`;
          const currentLogs = this.processLogs.get(processId) || [];
          currentLogs.push(successMessage);
          this.processLogs.set(processId, currentLogs);
          this.broadcast({
            type: "processExited",
            processId,
            exitCode: 0,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            logs: [successMessage]
          });
          if (onResolve)
            onResolve(result);
        }).catch((error) => {
          this.runningProcesses.delete(processId);
          const processInfo = this.allProcesses.get(processId);
          if (processInfo) {
            this.allProcesses.set(processId, {
              ...processInfo,
              status: "error",
              error: error.message
            });
          }
          const errorMessage = `Failed with error: ${error.message}`;
          const currentLogs = this.processLogs.get(processId) || [];
          currentLogs.push(errorMessage);
          this.processLogs.set(processId, currentLogs);
          this.broadcast({
            type: "processError",
            processId,
            error: error.message,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            logs: [errorMessage]
          });
          if (onReject)
            onReject(error);
        });
        return processId;
      }
      async handleWebSocketListDirectory(ws, message) {
        try {
          const path13 = message.path;
          if (!path13) {
            ws.send(JSON.stringify({
              type: "error",
              message: "Path parameter required"
            }));
            return;
          }
          const fullPath = this.resolvePath(path13);
          const items = await this.listDirectory(fullPath);
          ws.send(JSON.stringify({
            type: "directoryListing",
            path: path13,
            items
          }));
        } catch (error) {
          console.error("Error handling WebSocket directory listing:", error);
          ws.send(JSON.stringify({
            type: "error",
            message: "Failed to list directory"
          }));
        }
      }
      broadcast(message) {
        const data = typeof message === "string" ? message : JSON.stringify(message);
        this.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send(data);
          }
        });
      }
      // Helper methods to get processes by category
      getProcessesByCategory(category) {
        return Array.from(this.allProcesses.entries()).filter(([id, procInfo]) => procInfo.category === category).map(([id, procInfo]) => ({
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
        }));
      }
      getBDDTestProcesses() {
        return this.getProcessesByCategory("bdd-test");
      }
      getBuildTimeProcesses() {
        return this.getProcessesByCategory("build-time");
      }
      getAiderProcesses() {
        return this.getProcessesByCategory("aider");
      }
      getProcessesByTestName(testName2) {
        return Array.from(this.allProcesses.entries()).filter(([id, procInfo]) => procInfo.testName === testName2).map(([id, procInfo]) => ({
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
        }));
      }
      getProcessesByPlatform(platform) {
        return Array.from(this.allProcesses.entries()).filter(([id, procInfo]) => procInfo.platform === platform).map(([id, procInfo]) => ({
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
        }));
      }
    };
  }
});

// src/PM/PM_WithBuild.ts
import esbuild from "esbuild";
var PM_WithBuild;
var init_PM_WithBuild = __esm({
  "src/PM/PM_WithBuild.ts"() {
    "use strict";
    init_node();
    init_web();
    init_pure();
    init_utils();
    init_PM_WithWebSocket();
    PM_WithBuild = class extends PM_WithWebSocket {
      constructor(configs, name, mode2) {
        super(configs);
        this.currentBuildResolve = null;
        this.currentBuildReject = null;
        this.configs = configs;
        this.name = name;
        this.mode = mode2;
      }
      async startBuildProcesses() {
        const { nodeEntryPoints, webEntryPoints, pureEntryPoints } = getRunnables(
          this.configs.tests,
          this.name
        );
        console.log(`Starting build processes for ${this.name}...`);
        console.log(`  Node entry points: ${Object.keys(nodeEntryPoints).length}`);
        console.log(`  Web entry points: ${Object.keys(webEntryPoints).length}`);
        console.log(`  Pure entry points: ${Object.keys(pureEntryPoints).length}`);
        await Promise.all([
          this.startBuildProcess(node_default, nodeEntryPoints, "node"),
          this.startBuildProcess(web_default, webEntryPoints, "web"),
          this.startBuildProcess(pure_default, pureEntryPoints, "pure")
        ]);
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
              const command = `esbuild ${runtime} for ${self.name}`;
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
                  self.name,
                  runtime
                );
              }
              console.log(`Starting ${runtime} build for ${entryPointKeys.length} entry points`);
              if (self.broadcast) {
                self.broadcast({
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
                console.error(`Build ${runtime} failed with ${result.errors.length} errors`);
                if (self.currentBuildReject) {
                  self.currentBuildReject(new Error(`Build failed with ${result.errors.length} errors`));
                }
              } else {
                console.log(`Build ${runtime} completed successfully`);
                if (self.currentBuildResolve) {
                  self.currentBuildResolve();
                }
              }
              if (self.broadcast) {
                self.broadcast(event);
              }
              self.currentBuildResolve = null;
              self.currentBuildReject = null;
            });
          }
        };
        const baseConfig = configer(this.configs, entryPointKeys, this.name);
        const configWithPlugin = {
          ...baseConfig,
          plugins: [...baseConfig.plugins || [], buildProcessTrackerPlugin]
        };
        try {
          const ctx = await esbuild.context(configWithPlugin);
          if (this.mode === "dev") {
            await ctx.watch();
          } else {
            const result = await ctx.rebuild();
            await ctx.dispose();
          }
        } catch (error) {
          console.error(`Failed to start ${runtime} build context:`, error);
          if (this.broadcast) {
            this.broadcast({
              type: "buildEvent",
              event: "error",
              runtime,
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              errors: 1,
              warnings: 0,
              message: error.message
            });
          }
        }
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
import fs7 from "fs";
import path7 from "path";
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
      const testDir = path7.join(
        "testeranto",
        "reports",
        name,
        entryPoint.split(".").slice(0, -1).join("."),
        runtime
      );
      if (!fs7.existsSync(testDir)) {
        fs7.mkdirSync(testDir, { recursive: true });
      }
      const testPaths = path7.join(testDir, LOG_FILES.TESTS);
      const lintPath = path7.join(testDir, LOG_FILES.LINT_ERRORS);
      const typePath = path7.join(testDir, LOG_FILES.TYPE_ERRORS);
      const messagePath = path7.join(testDir, LOG_FILES.MESSAGE);
      try {
        await Promise.all([
          fs7.promises.writeFile(
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
          fs7.promises.writeFile(
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
import fs8 from "fs";
import ansiC2 from "ansi-colors";
import { ESLint } from "eslint";
import tsc from "tsc-prog";
var eslint, formatter, PM_WithEslintAndTsc;
var init_PM_WithEslintAndTsc = __esm({
  async "src/PM/PM_WithEslintAndTsc.ts"() {
    "use strict";
    init_utils();
    init_PM_WithBuild();
    init_makePrompt();
    eslint = new ESLint();
    formatter = await eslint.loadFormatter(
      "./node_modules/testeranto/dist/prebuild/esbuildConfigs/eslint-formatter-testeranto.mjs"
    );
    PM_WithEslintAndTsc = class extends PM_WithBuild {
      constructor(configs, name, mode2) {
        super(configs, name, mode2);
        this.summary = {};
        this.tscCheck = async ({
          entrypoint,
          addableFiles,
          platform
        }) => {
          const processId = `tsc-${entrypoint}-${Date.now()}`;
          const command = `tsc check for ${entrypoint}`;
          const tscPromise = (async () => {
            try {
              this.typeCheckIsRunning(entrypoint);
            } catch (e) {
              throw new Error(`Error in tscCheck: ${e.message}`);
            }
            const program = tsc.createProgramFromConfig({
              basePath: process.cwd(),
              configFilePath: "tsconfig.json",
              compilerOptions: {
                outDir: tscPather(entrypoint, platform, this.name),
                noEmit: true
              },
              include: addableFiles
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
            fs8.writeFileSync(tscPath, results.join("\n"));
            this.typeCheckIsNowDone(entrypoint, results.length);
            return results.length;
          })();
          if (this.addPromiseProcess) {
            this.addPromiseProcess(
              processId,
              tscPromise,
              command,
              "build-time",
              entrypoint
            );
          } else {
            await tscPromise;
          }
        };
        this.eslintCheck = async (entrypoint, platform, addableFiles) => {
          const processId = `eslint-${entrypoint}-${Date.now()}`;
          const command = `eslint check for ${entrypoint}`;
          const eslintPromise = (async () => {
            try {
              this.lintIsRunning(entrypoint);
            } catch (e) {
              throw new Error(`Error in eslintCheck: ${e.message}`);
            }
            const filepath = lintPather(entrypoint, platform, this.name);
            if (fs8.existsSync(filepath))
              fs8.rmSync(filepath);
            const results = (await eslint.lintFiles(addableFiles)).filter((r) => r.messages.length).filter((r) => {
              return r.messages[0].ruleId !== null;
            }).map((r) => {
              delete r.source;
              return r;
            });
            fs8.writeFileSync(filepath, await formatter.format(results));
            this.lintIsNowDone(entrypoint, results.length);
            return results.length;
          })();
          if (this.addPromiseProcess) {
            this.addPromiseProcess(
              processId,
              eslintPromise,
              command,
              "build-time",
              entrypoint
            );
          } else {
            await eslintPromise;
          }
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
            console.log(ansiC2.green(ansiC2.inverse(`tsc > ${src}`)));
          } else {
            console.log(
              ansiC2.red(ansiC2.inverse(`tsc > ${src} failed ${failures} times`))
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
            console.log(ansiC2.green(ansiC2.inverse(`eslint > ${src}`)));
          } else {
            console.log(
              ansiC2.red(ansiC2.inverse(`eslint > ${src} failed ${failures} times`))
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
          fs8.writeFileSync(summaryPath, summaryData);
          this.broadcast({
            type: "summaryUpdate",
            data: this.summary
          });
        };
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

// src/PM/PM_WithGit.ts
import fs9 from "fs";
import url2 from "url";
var PM_WithGit;
var init_PM_WithGit = __esm({
  async "src/PM/PM_WithGit.ts"() {
    "use strict";
    await init_PM_WithEslintAndTsc();
    PM_WithGit = class extends PM_WithEslintAndTsc {
      constructor(configs, name, mode2) {
        super(configs, name, mode2);
        this.gitWatchTimeout = null;
        this.gitWatcher = null;
      }
      // Override requestHandler to add Git-specific endpoints
      requestHandler(req, res) {
        const parsedUrl = url2.parse(req.url || "/");
        const pathname = parsedUrl.pathname || "/";
        if (pathname?.startsWith("/api/git/")) {
          this.handleGitApi(req, res);
          return;
        }
        if (pathname === "/api/auth/github/token" && req.method === "POST") {
          this.handleGitHubTokenExchange(req, res);
          return;
        }
        if (pathname === "/auth/github/callback") {
          const callbackHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>GitHub Authentication - Testeranto</title>
    <script>
        // Extract the code from the URL and send it to the parent window
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        
        if (code) {
            window.opener.postMessage({ type: 'github-auth-callback', code }, '*');
        } else if (error) {
            window.opener.postMessage({ type: 'github-auth-error', error }, '*');
        }
        window.close();
    </script>
</head>
<body>
    <p>Completing authentication...</p>
</body>
</html>`;
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(callbackHtml);
          return;
        }
        super.requestHandler(req, res);
      }
      // this method is also horrible
      handleGitApi(req, res) {
        const parsedUrl = url2.parse(req.url || "/");
        const pathname = parsedUrl.pathname || "/";
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        if (req.method === "OPTIONS") {
          res.writeHead(200);
          res.end();
          return;
        }
        try {
          if (pathname === "/api/git/changes" && req.method === "GET") {
            this.handleGitChanges(req, res);
          } else if (pathname === "/api/git/status" && req.method === "GET") {
            this.handleGitFileStatus(req, res);
          } else if (pathname === "/api/git/commit" && req.method === "POST") {
            this.handleGitCommit(req, res);
          } else if (pathname === "/api/git/push" && req.method === "POST") {
            this.handleGitPush(req, res);
          } else if (pathname === "/api/git/pull" && req.method === "POST") {
            this.handleGitPull(req, res);
          } else if (pathname === "/api/git/branch" && req.method === "GET") {
            this.handleGitBranch(req, res);
          } else if (pathname === "/api/git/remote-status" && req.method === "GET") {
            this.handleGitRemoteStatus(req, res);
          } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Not found" }));
          }
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Internal server error" }));
        }
      }
      async handleGitChanges(req, res) {
        try {
          const changes2 = await this.getGitChanges();
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(changes2));
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to get changes" }));
        }
      }
      async handleGitFileStatus(req, res) {
        const parsedUrl = url2.parse(req.url || "/");
        const query = parsedUrl.query || "";
        const params = new URLSearchParams(query);
        const path13 = params.get("path");
        if (!path13) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Path parameter required" }));
          return;
        }
        try {
          const status = await this.getGitFileStatus(path13);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(status));
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to get file status" }));
        }
      }
      async handleGitCommit(req, res) {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", async () => {
          try {
            const { message, description } = JSON.parse(body);
            await this.executeGitCommit(message, description);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true }));
          } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Failed to commit" }));
          }
        });
      }
      async handleGitPush(req, res) {
        try {
          await this.executeGitPush();
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to push" }));
        }
      }
      async handleGitPull(req, res) {
        try {
          await this.executeGitPull();
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to pull" }));
        }
      }
      async handleGitBranch(req, res) {
        try {
          const branch = await this.getCurrentGitBranch();
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end(branch);
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to get branch" }));
        }
      }
      async handleGitHubTokenExchange(req, res) {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", async () => {
          try {
            const { code } = JSON.parse(body);
            const tokenResponse = await fetch(
              "https://github.com/login/oauth/access_token",
              {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  client_id: process.env.GITHUB_CLIENT_ID,
                  client_secret: process.env.GITHUB_CLIENT_SECRET,
                  code
                })
              }
            );
            const tokenData = await tokenResponse.json();
            if (tokenData.error) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: tokenData.error_description }));
              return;
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ access_token: tokenData.access_token }));
          } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Failed to exchange token" }));
          }
        });
      }
      async handleGitRemoteStatus(req, res) {
        try {
          const status = await this.getGitRemoteStatus();
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(status));
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to get remote status" }));
        }
      }
      async getGitFileStatus(path13) {
        try {
          const changes2 = await this.getGitChanges();
          const fileChange = changes2.find((change) => change.path === path13);
          if (fileChange) {
            return { status: fileChange.status };
          }
          return { status: "unchanged" };
        } catch (error) {
          console.error("Failed to get file status:", error);
          return { status: "unchanged" };
        }
      }
      async executeGitCommit(message, description) {
        try {
          const { exec } = await import("child_process");
          const fullMessage = description ? `${message}

${description}` : message;
          return new Promise((resolve, reject) => {
            exec("git add -A", { cwd: process.cwd() }, (error) => {
              if (error) {
                reject(new Error(`Failed to stage changes: ${error.message}`));
                return;
              }
              const commitCommand = `git commit -m "${fullMessage.replace(
                /"/g,
                '\\"'
              )}"`;
              exec(commitCommand, { cwd: process.cwd() }, (commitError) => {
                if (commitError) {
                  reject(new Error(`Failed to commit: ${commitError.message}`));
                  return;
                }
                resolve();
              });
            });
          });
        } catch (error) {
          throw new Error(
            `Failed to execute commit: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      }
      async executeGitPush() {
        try {
          const { exec } = await import("child_process");
          return new Promise((resolve, reject) => {
            exec("git push", { cwd: process.cwd() }, (error) => {
              if (error) {
                reject(new Error(`Failed to push: ${error.message}`));
                return;
              }
              resolve();
            });
          });
        } catch (error) {
          throw new Error(
            `Failed to execute push: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      }
      async executeGitPull() {
        try {
          const { exec } = await import("child_process");
          return new Promise((resolve, reject) => {
            exec("git pull", { cwd: process.cwd() }, (error) => {
              if (error) {
                reject(new Error(`Failed to pull: ${error.message}`));
                return;
              }
              resolve();
            });
          });
        } catch (error) {
          throw new Error(
            `Failed to execute pull: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      }
      // private async sendInitialState(ws: WebSocket) {
      //   try {
      //     const changes = await this.getGitChanges();
      //     const status = await this.getGitRemoteStatus();
      //     const branch = await this.getCurrentGitBranch();
      //     ws.send(JSON.stringify({ type: "changes", changes }));
      //     ws.send(JSON.stringify({ type: "status", status }));
      //     ws.send(JSON.stringify({ type: "branch", branch }));
      //   } catch (error) {
      //     console.error("Error sending initial state:", error);
      //     ws.send(
      //       JSON.stringify({
      //         type: "error",
      //         message: "Failed to get Git status",
      //       })
      //     );
      //   }
      // }
      // private async refreshGitStatus() {
      //   try {
      //     const changes = await this.getGitChanges();
      //     const status = await this.getGitRemoteStatus();
      //     const branch = await this.getCurrentGitBranch();
      //     this.broadcast({ type: "changes", changes });
      //     this.broadcast({ type: "status", status });
      //     this.broadcast({ type: "branch", branch });
      //   } catch (error) {
      //     console.error("Error refreshing Git status:", error);
      //   }
      // }
      onBuildDone() {
        console.log("Build processes completed");
        this.startGitWatcher();
      }
      async startGitWatcher() {
        console.log("Starting Git watcher for real-time updates");
        const watcher = (await import("fs")).watch(
          process.cwd(),
          { recursive: true },
          async (eventType, filename) => {
            if (filename && !filename.includes(".git")) {
              try {
                clearTimeout(this.gitWatchTimeout);
                this.gitWatchTimeout = setTimeout(async () => {
                  const changes2 = await this.getGitChanges();
                  const status = await this.getGitRemoteStatus();
                  const branch = await this.getCurrentGitBranch();
                  this.broadcast({ type: "changes", changes: changes2 });
                  this.broadcast({ type: "status", status });
                  this.broadcast({ type: "branch", branch });
                }, 500);
              } catch (error) {
                console.error("Error checking Git status:", error);
              }
            }
          }
        );
        setInterval(async () => {
          try {
            const changes2 = await this.getGitChanges();
            const status = await this.getGitRemoteStatus();
            const branch = await this.getCurrentGitBranch();
            this.broadcast({ type: "changes", changes: changes2 });
            this.broadcast({ type: "status", status });
            this.broadcast({ type: "branch", branch });
          } catch (error) {
            console.error("Error checking Git status:", error);
          }
        }, 1e4);
        this.gitWatcher = watcher;
      }
      async getGitChanges() {
        try {
          const { exec } = await import("child_process");
          return new Promise((resolve, reject) => {
            console.log("Current working directory:", process.cwd());
            exec(
              "git status --porcelain=v1",
              { cwd: process.cwd() },
              async (error, stdout, stderr) => {
                if (stderr) {
                  console.error("Git stderr:", stderr);
                }
                if (error) {
                  console.error("Error getting git changes:", error);
                  resolve([]);
                  return;
                }
                console.log("Raw git status output:", stdout);
                const changes2 = [];
                const lines = stdout.trim().split("\n");
                for (const line of lines) {
                  console.log("Processing git status line:", JSON.stringify(line));
                  if (!line.trim())
                    continue;
                  const match = line.match(/^(.{2}) (.*)$/);
                  if (!match) {
                    console.warn("Could not parse git status line:", line);
                    continue;
                  }
                  const status = match[1];
                  let path13 = match[2];
                  if (status === "R " && path13.includes(" -> ")) {
                    const parts = path13.split(" -> ");
                    path13 = parts[parts.length - 1];
                  }
                  path13 = path13.trim();
                  let fileStatus = "unchanged";
                  const firstChar = status.charAt(0);
                  if (firstChar === "M" || firstChar === " ") {
                    fileStatus = "modified";
                  } else if (firstChar === "A") {
                    fileStatus = "added";
                  } else if (firstChar === "D") {
                    fileStatus = "deleted";
                  } else if (firstChar === "U") {
                    fileStatus = "conflicted";
                  } else if (status === "??") {
                    fileStatus = "added";
                  } else if (status === "R ") {
                    fileStatus = "modified";
                  }
                  if (fileStatus !== "unchanged") {
                    const fullPath = `${process.cwd()}/${path13}`;
                    try {
                      await fs9.promises.access(fullPath);
                    } catch (error2) {
                      console.warn("Path does not exist:", fullPath);
                    }
                    changes2.push({
                      path: path13,
                      status: fileStatus
                    });
                  }
                }
                resolve(changes2);
              }
            );
          });
        } catch (error) {
          console.error("Failed to get git changes:", error);
          return [];
        }
      }
      async getGitRemoteStatus() {
        try {
          const { exec } = await import("child_process");
          return new Promise((resolve) => {
            exec(
              "git rev-list --left-right --count HEAD...@{u}",
              { cwd: process.cwd() },
              (error, stdout, stderr) => {
                if (error) {
                  resolve({ ahead: 0, behind: 0 });
                  return;
                }
                const [behind, ahead] = stdout.trim().split("	").map(Number);
                resolve({ ahead, behind });
              }
            );
          });
        } catch (error) {
          console.error("Failed to get remote status:", error);
          return { ahead: 0, behind: 0 };
        }
      }
      async getCurrentGitBranch() {
        try {
          const { exec } = await import("child_process");
          return new Promise((resolve) => {
            exec(
              "git branch --show-current",
              { cwd: process.cwd() },
              (error, stdout, stderr) => {
                if (error) {
                  console.error("Error getting current branch:", error);
                  resolve("main");
                  return;
                }
                resolve(stdout.trim() || "main");
              }
            );
          });
        } catch (error) {
          console.error("Failed to get current branch:", error);
          return "main";
        }
      }
    };
  }
});

// src/PM/PM_WithProcesses.ts
import fs10, { watch } from "fs";
import path8 from "path";
import puppeteer, { executablePath as executablePath2 } from "puppeteer-core";
import ansiC3 from "ansi-colors";
var fileHashes, changes, PM_WithProcesses;
var init_PM_WithProcesses = __esm({
  async "src/PM/PM_WithProcesses.ts"() {
    "use strict";
    init_utils();
    init_utils2();
    await init_PM_WithGit();
    fileHashes = {};
    changes = {};
    PM_WithProcesses = class extends PM_WithGit {
      constructor(configs, name, mode2) {
        super(configs, name, mode2);
        this.logStreams = {};
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
      async metafileOutputs(platform) {
        let metafilePath;
        if (platform === "python") {
          metafilePath = `./testeranto/metafiles/python/core.json`;
        } else {
          metafilePath = `./testeranto/metafiles/${platform}/${this.name}.json`;
        }
        if (!fs10.existsSync(metafilePath)) {
          if (platform === "python") {
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
          if (platform === "python") {
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
        if (!outputs || typeof outputs !== "object") {
          console.log(
            ansiC3.yellow(ansiC3.inverse(`No outputs found in metafile at ${metafilePath}`))
          );
          return;
        }
        Object.keys(outputs).forEach(async (k) => {
          const pattern = `testeranto/bundles/${platform}/${this.name}/${this.configs.src}`;
          if (!k.startsWith(pattern)) {
            return;
          }
          const output = outputs[k];
          if (!output || !output.inputs) {
            return;
          }
          const addableFiles = Object.keys(output.inputs).filter((i) => {
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
            fs10.mkdirSync(f2, { recursive: true });
          }
          const entrypoint = output.entryPoint;
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
      async start() {
        try {
          await this.startBuildProcesses();
          this.onBuildDone();
        } catch (error) {
          console.error("Build processes failed:", error);
          return;
        }
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
          pythonEntryPoints,
          golangEntryPoints
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
            pythonEntryPoints,
            this.launchPython,
            "python",
            (w) => {
              this.pitonoMetafileWatcher = w;
            }
          ],
          [
            golangEntryPoints,
            this.launchGolang,
            "golang",
            (w) => {
            }
          ]
        ].forEach(
          async ([eps, launcher, runtime, watcher]) => {
            let metafile;
            if (runtime === "python") {
              metafile = `./testeranto/metafiles/python/core.json`;
              const metafileDir = path8.dirname(metafile);
              if (!fs10.existsSync(metafileDir)) {
                fs10.mkdirSync(metafileDir, { recursive: true });
              }
            } else {
              metafile = `./testeranto/metafiles/${runtime}/${this.name}.json`;
            }
            if (runtime !== "python") {
              await pollForFile(metafile);
            }
            Object.entries(eps).forEach(
              async ([inputFile, outputFile]) => {
                this.launchers[inputFile] = () => launcher(inputFile, outputFile);
                this.launchers[inputFile]();
                try {
                  if (fs10.existsSync(outputFile)) {
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
                  } else {
                    console.log(
                      ansiC3.yellow(
                        ansiC3.inverse(
                          `File not found, skipping watch: ${outputFile}`
                        )
                      )
                    );
                  }
                } catch (e) {
                  console.error(e);
                }
              }
            );
            this.metafileOutputs(runtime);
            if (runtime === "python") {
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
        if (this.gitWatcher) {
          this.gitWatcher.close();
        }
        if (this.gitWatchTimeout) {
          clearTimeout(this.gitWatchTimeout);
        }
        Object.values(this.logStreams || {}).forEach((logs) => logs.closeAll());
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
      findIndexHtml() {
        const possiblePaths = [
          "dist/index.html",
          "testeranto/dist/index.html",
          "../dist/index.html",
          "./index.html"
        ];
        for (const path13 of possiblePaths) {
          if (fs10.existsSync(path13)) {
            return path13;
          }
        }
        return null;
      }
      addToQueue(src, runtime) {
        this.queue.push(src);
        console.log(
          ansiC3.green(
            ansiC3.inverse(`Added ${src} (${runtime}) to the processing queue`)
          )
        );
        this.checkQueue();
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
        const runtime = test[1];
        const runnables = getRunnables(this.configs.tests, this.name);
        let dest;
        switch (runtime) {
          case "node":
            dest = runnables.nodeEntryPoints[x];
            if (dest) {
              this.launchNode(x, dest);
            } else {
              console.error(`No destination found for node test: ${x}`);
            }
            break;
          case "web":
            dest = runnables.webEntryPoints[x];
            if (dest) {
              this.launchWeb(x, dest);
            } else {
              console.error(`No destination found for web test: ${x}`);
            }
            break;
          case "pure":
            dest = runnables.pureEntryPoints[x];
            if (dest) {
              this.launchPure(x, dest);
            } else {
              console.error(`No destination found for pure test: ${x}`);
            }
            break;
          case "python":
            dest = runnables.pythonEntryPoints[x];
            if (dest) {
              this.launchPython(x, dest);
            } else {
              console.error(`No destination found for python test: ${x}`);
            }
            break;
          case "golang":
            dest = runnables.golangEntryPoints[x];
            if (dest) {
              this.launchGolang(x, dest);
            } else {
              console.error(`No destination found for golang test: ${x}`);
            }
            break;
          default:
            console.error(`Unknown runtime: ${runtime} for test ${x}`);
            break;
        }
      }
      onBuildDone() {
        console.log("Build processes completed");
        this.startGitWatcher();
      }
    };
  }
});

// src/PM/PM_WithHelpo.ts
import { spawnSync } from "node:child_process";
import pty from "node-pty";
import fs11 from "fs";
import path9 from "path";
import ansiColors from "ansi-colors";
var PM_WithHelpo;
var init_PM_WithHelpo = __esm({
  async "src/PM/PM_WithHelpo.ts"() {
    "use strict";
    await init_PM_WithProcesses();
    PM_WithHelpo = class extends PM_WithProcesses {
      constructor(configs, name, mode2) {
        super(configs, name, mode2);
        this.aiderProcess = null;
        this.MAX_HISTORY_SIZE = 10 * 1024;
        // 10KB
        this.isAiderAtPrompt = false;
        this.chatHistoryPath = path9.join(
          process.cwd(),
          "testeranto",
          "helpo_chat_history.json"
        );
        this.initializeChatHistory();
        this.startAiderProcess();
      }
      initializeChatHistory() {
        fs11.writeFileSync(this.chatHistoryPath, JSON.stringify([]));
        const messagePath = path9.join(
          process.cwd(),
          "testeranto",
          "helpo_chat_message.txt"
        );
        const messageDir = path9.dirname(messagePath);
        if (!fs11.existsSync(messageDir)) {
          fs11.mkdirSync(messageDir, { recursive: true });
        }
        fs11.writeFileSync(messagePath, "");
      }
      startAiderProcess() {
        const promptPath = path9.join(process.cwd(), "src", "helpo", "prompt.txt");
        try {
          const whichAider = spawnSync("which", ["aider"]);
          if (whichAider.status !== 0) {
            console.error(
              "aider command not found. Please install aider: pip install aider-chat"
            );
            return;
          }
          const ptyProcess = pty.spawn(
            "aider",
            ["--no-auto-commits", "--load", promptPath, "--edit-format", "ask"],
            {
              name: "xterm-color",
              cols: 80,
              rows: 30,
              cwd: process.cwd(),
              env: {
                ...process.env,
                TERM: "xterm-color",
                FORCE_COLOR: "0",
                NO_COLOR: "1",
                PYTHONUNBUFFERED: "1"
              }
            }
          );
          const aiderProcess = ptyProcess;
          this.aiderProcess = ptyProcess;
          ptyProcess.onData((data) => {
            const output = data.toString();
            const cleanOutput = output.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "");
            console.log(ansiColors.cyan(`\u{1F916}: ${cleanOutput}`));
            if (cleanOutput.includes("ask>")) {
              this.isAiderAtPrompt = true;
              console.log("Aider is at prompt");
            }
            if (cleanOutput.includes("PROCESS_CHAT_HISTORY_AND_RESPOND")) {
              console.log("Aider received our command");
            }
          });
          ptyProcess.onExit(({ exitCode, signal }) => {
            console.log(
              `aider process exited with code ${exitCode}, signal ${signal}`
            );
            this.aiderProcess = null;
            if (exitCode !== 0) {
              console.log("Restarting aider process...");
              setTimeout(() => this.startAiderProcess(), 1e3);
            }
          });
          const messagePath = path9.join(
            process.cwd(),
            "testeranto",
            "helpo_chat_message.txt"
          );
          if (!fs11.existsSync(messagePath)) {
            fs11.writeFileSync(messagePath, "");
          }
          const watcher = fs11.watch(messagePath, (eventType, filename) => {
            console.log(`File ${filename} event: ${eventType}`);
            if (eventType === "change") {
              setTimeout(() => {
                fs11.readFile(messagePath, "utf8", (err, data) => {
                  if (err) {
                    if (err.code === "ENOENT") {
                      return;
                    }
                    console.error("Error reading message file:", err);
                    return;
                  }
                  console.log(`Message file content: "${data}"`);
                  const trimmedData = data.trim();
                  if (trimmedData.length > 0) {
                    this.processAiderResponse(trimmedData);
                    fs11.writeFileSync(messagePath, "");
                  } else {
                    console.log("Ignoring empty message file change");
                  }
                });
              }, 100);
            }
          });
          aiderProcess.on("exit", () => {
            watcher.close();
          });
        } catch (e) {
          console.error("Error starting aider process:", e);
        }
      }
      async processAiderResponse(response) {
        const cleanResponse = response.trim();
        if (!cleanResponse) {
          return;
        }
        const assistantMessage = {
          type: "assistant",
          content: cleanResponse,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        await this.addToChatHistory(assistantMessage);
        const history = await this.getChatHistory();
        this.broadcast({
          type: "chatHistory",
          messages: history
        });
        await this.trimChatHistory();
      }
      restartAiderProcess() {
        if (this.aiderProcess) {
          this.aiderProcess.kill();
        }
        this.startAiderProcess();
      }
      isAiderAvailable() {
        try {
          const whichAider = spawnSync("which", ["aider"]);
          return whichAider.status === 0;
        } catch (error) {
          return false;
        }
      }
      async addToChatHistory(message) {
        const history = await this.getChatHistory();
        history.push(message);
        fs11.writeFileSync(this.chatHistoryPath, JSON.stringify(history, null, 2));
        console.log(
          `Added message to chat history: ${message.content.substring(0, 50)}...`
        );
      }
      async trimChatHistory() {
        const history = await this.getChatHistory();
        let currentSize = Buffer.from(JSON.stringify(history)).length;
        while (currentSize > this.MAX_HISTORY_SIZE && history.length > 0) {
          history.shift();
          currentSize = Buffer.from(JSON.stringify(history)).length;
        }
        fs11.writeFileSync(this.chatHistoryPath, JSON.stringify(history, null, 2));
      }
      async getChatHistory() {
        try {
          const data = fs11.readFileSync(this.chatHistoryPath, "utf-8");
          return JSON.parse(data);
        } catch (error) {
          return [];
        }
      }
      async handleChatMessage(userMessage) {
        const userChatMessage = {
          type: "user",
          content: userMessage,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        await this.addToChatHistory(userChatMessage);
        const history = await this.getChatHistory();
        this.broadcast({
          type: "chatHistory",
          messages: history
        });
        console.log(`User message recorded: ${userMessage}`);
        if (!this.aiderProcess) {
          console.log(
            "Aider process is not available - message recorded but not processed"
          );
          return;
        }
        setTimeout(() => {
          try {
            if (this.aiderProcess) {
              const messagePath = path9.join(
                process.cwd(),
                "testeranto",
                "helpo_chat_message.txt"
              );
              fs11.writeFileSync(messagePath, "");
              const ptyProcess = this.aiderProcess;
              ptyProcess.write(
                "PROCESS_CHAT_HISTORY_AND_RESPOND: Read the chat history and write your response ONLY to testeranto/helpo_chat_message.txt. Do NOT print to stdout.\n"
              );
            } else {
              console.log("Aider process is not available");
            }
          } catch (error) {
            console.error("Error writing to aider process:", error);
          }
        }, 100);
      }
      // Override WebSocket message handling to include chat messages
      setupWebSocketHandlers() {
      }
      // This method should be called when a WebSocket message is received
      handleWebSocketMessage(ws, message) {
        try {
          const parsedMessage = JSON.parse(message.toString());
          if (parsedMessage.type === "chatMessage") {
            this.handleChatMessage(parsedMessage.content);
          } else {
            super.handleWebSocketMessage?.(ws, message);
          }
        } catch (error) {
          console.error("Error handling WebSocket message:", error);
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
import { spawn as spawn3 } from "node:child_process";
import ansiColors2 from "ansi-colors";
import net from "net";
import fs12 from "fs";
import ansiC4 from "ansi-colors";
var files2, screenshots2, PM_Main;
var init_main = __esm({
  async "src/PM/main.ts"() {
    "use strict";
    init_utils();
    init_queue();
    init_utils2();
    await init_PM_WithHelpo();
    files2 = {};
    screenshots2 = {};
    PM_Main = class extends PM_WithHelpo {
      constructor() {
        super(...arguments);
        this.launchPure = async (src, dest) => {
          const processId = `pure-${src}-${Date.now()}`;
          const command = `pure test: ${src}`;
          const purePromise = (async () => {
            this.bddTestIsRunning(src);
            const reportDest = `testeranto/reports/${this.name}/${src.split(".").slice(0, -1).join(".")}/pure`;
            if (!fs12.existsSync(reportDest)) {
              fs12.mkdirSync(reportDest, { recursive: true });
            }
            const destFolder = dest.replace(".mjs", "");
            let argz = "";
            const testConfig = this.configs.tests.find((t) => {
              return t[0] === src;
            });
            if (!testConfig) {
              console.log(
                ansiC4.inverse("missing test config! Exiting ungracefully!")
              );
              process.exit(-1);
            }
            const testConfigResource = testConfig[2];
            const portsToUse = [];
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
                ([portnumber, status]) => status === ""
              );
              if (openPorts.length >= testConfigResource.ports) {
                for (let i = 0; i < testConfigResource.ports; i++) {
                  portsToUse.push(openPorts[i][0]);
                  this.ports[openPorts[i][0]] = src;
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
                return [Math.random(), argz];
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
                  return defaultModule.receiveTestResourceConfig(argz).then(async (results) => {
                    statusMessagePretty(results.fails, src, "pure");
                    this.bddTestIsNowDone(src, results.fails);
                    return results.fails;
                  });
                }).catch((e2) => {
                  console.log(
                    ansiColors2.red(
                      `pure ! ${src} failed to execute. No "tests.json" file was generated. Check the logs for more info`
                    )
                  );
                  logs.exit.write(e2.stack);
                  logs.exit.write(-1);
                  this.bddTestIsNowDone(src, -1);
                  statusMessagePretty(-1, src, "pure");
                  throw e2;
                });
              });
            } catch (e3) {
              logs.writeExitCode(-1, e3);
              console.log(
                ansiC4.red(
                  ansiC4.inverse(
                    `${src} 1 errored with: ${e3}. Check logs for more info`
                  )
                )
              );
              logs.exit.write(e3.stack);
              logs.exit.write("-1");
              this.bddTestIsNowDone(src, -1);
              statusMessagePretty(-1, src, "pure");
              throw e3;
            } finally {
              for (let i = 0; i <= portsToUse.length; i++) {
                if (portsToUse[i]) {
                  this.ports[portsToUse[i]] = "";
                }
              }
            }
          })();
          this.addPromiseProcess(
            processId,
            purePromise,
            command,
            "bdd-test",
            src,
            "pure"
          );
        };
        this.launchNode = async (src, dest) => {
          const processId = `node-${src}-${Date.now()}`;
          const command = `node test: ${src}`;
          const nodePromise = (async () => {
            this.bddTestIsRunning(src);
            const reportDest = `testeranto/reports/${this.name}/${src.split(".").slice(0, -1).join(".")}/node`;
            if (!fs12.existsSync(reportDest)) {
              fs12.mkdirSync(reportDest, { recursive: true });
            }
            let testResources = "";
            const testConfig = this.configs.tests.find((t) => {
              return t[0] === src;
            });
            if (!testConfig) {
              console.log(
                ansiC4.inverse(
                  `missing test config! Exiting ungracefully for '${src}'`
                )
              );
              process.exit(-1);
            }
            const testConfigResource = testConfig[2];
            const portsToUse = [];
            if (testConfigResource.ports === 0) {
              const t = {
                name: src,
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
                  ansiC4.red(
                    `node: cannot run ${src} because there are no open ports ATM. This job will be enqueued and run again run a port is available`
                  )
                );
                this.queue.push(src);
                return [Math.random(), testResources];
              }
            } else {
              console.error("negative port makes no sense", src);
              process.exit(-1);
            }
            const builtfile = dest;
            let haltReturns = false;
            const ipcfile = "/tmp/tpipe_" + Math.random();
            const child = spawn3("node", [builtfile, testResources, ipcfile], {
              stdio: ["pipe", "pipe", "pipe", "ipc"]
            });
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
                    this.mapping().forEach(async ([command2, func]) => {
                      if (message[0] === command2) {
                        const x = message.slice(1, -1);
                        const r = await this[command2](...x);
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
            return new Promise((resolve, reject) => {
              server.listen(ipcfile, () => {
                child.stdout?.on("data", (data) => {
                  logs.stdout?.write(data);
                });
                child.stderr?.on("data", (data) => {
                  logs.stderr?.write(data);
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
                  if (exitCode === 255) {
                    console.log(
                      ansiColors2.red(
                        `node ! ${src} failed to execute. No "tests.json" file was generated. Check ${reportDest}/stderr.log for more info`
                      )
                    );
                    this.bddTestIsNowDone(src, -1);
                    statusMessagePretty(-1, src, "node");
                    reject(new Error(`Process exited with code ${exitCode}`));
                  } else if (exitCode === 0) {
                    this.bddTestIsNowDone(src, 0);
                    statusMessagePretty(0, src, "node");
                    resolve();
                  } else {
                    this.bddTestIsNowDone(src, exitCode);
                    statusMessagePretty(exitCode, src, "node");
                    reject(new Error(`Process exited with code ${exitCode}`));
                  }
                  haltReturns = true;
                });
                child.on("error", (e) => {
                  console.log("error");
                  haltReturns = true;
                  console.log(
                    ansiC4.red(
                      ansiC4.inverse(
                        `${src} errored with: ${e.name}. Check error logs for more info`
                      )
                    )
                  );
                  this.bddTestIsNowDone(src, -1);
                  statusMessagePretty(-1, src, "node");
                  reject(e);
                });
              });
            }).finally(() => {
              for (let i = 0; i <= portsToUse.length; i++) {
                if (portsToUse[i]) {
                  this.ports[portsToUse[i]] = "";
                }
              }
            });
          })();
          this.addPromiseProcess(
            processId,
            nodePromise,
            command,
            "bdd-test",
            src,
            "node"
          );
        };
        this.launchWeb = async (src, dest) => {
          const processId = `web-${src}-${Date.now()}`;
          const command = `web test: ${src}`;
          const webPromise = (async () => {
            this.bddTestIsRunning(src);
            const reportDest = `testeranto/reports/${this.name}/${src.split(".").slice(0, -1).join(".")}/web`;
            if (!fs12.existsSync(reportDest)) {
              fs12.mkdirSync(reportDest, { recursive: true });
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
            return new Promise((resolve, reject) => {
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
                });
                this.mapping().forEach(async ([command2, func]) => {
                  if (command2 === "page") {
                    page.exposeFunction(command2, (x) => {
                      if (x) {
                        return func(x);
                      } else {
                        return func(page.mainFrame()._id);
                      }
                    });
                  } else {
                    return page.exposeFunction(command2, func);
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
                };
                page.on("pageerror", (err) => {
                  logs.writeExitCode(-1, err);
                  console.log(
                    ansiColors2.red(
                      `web ! ${src} failed to execute No "tests.json" file was generated. Check ${reportDest}/error.log for more info`
                    )
                  );
                  this.bddTestIsNowDone(src, -1);
                  close();
                  reject(err);
                });
                await page.goto(`file://${`${destFolder}.html`}`, {});
                await page.evaluate(webEvaluator(d, webArgz)).then(async ({ fails, failed, features }) => {
                  statusMessagePretty(fails, src, "web");
                  this.bddTestIsNowDone(src, fails);
                  resolve();
                }).catch((e) => {
                  console.log(ansiC4.red(ansiC4.inverse(e.stack)));
                  console.log(
                    ansiC4.red(
                      ansiC4.inverse(
                        `web ! ${src} failed to execute. No "tests.json" file was generated. Check logs for more info`
                      )
                    )
                  );
                  this.bddTestIsNowDone(src, -1);
                  reject(e);
                }).finally(() => {
                  close();
                });
              }).catch((error) => {
                reject(error);
              });
            });
          })();
          this.addPromiseProcess(
            processId,
            webPromise,
            command,
            "bdd-test",
            src,
            "web"
          );
        };
        this.launchPython = async (src, dest) => {
          const processId = `python-${src}-${Date.now()}`;
          const command = `python test: ${src}`;
          const pythonPromise = (async () => {
            this.bddTestIsRunning(src);
            const reportDest = `testeranto/reports/${this.name}/${src.split(".").slice(0, -1).join(".")}/python`;
            if (!fs12.existsSync(reportDest)) {
              fs12.mkdirSync(reportDest, { recursive: true });
            }
            let testResources = "";
            const testConfig = this.configs.tests.find((t) => t[0] === src);
            if (!testConfig) {
              console.log(
                ansiColors2.inverse(
                  `missing test config! Exiting ungracefully for '${src}'`
                )
              );
              process.exit(-1);
            }
            const testConfigResource = testConfig[2];
            const portsToUse = [];
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
                    `python: cannot run ${src} because there are no open ports ATM. This job will be enqueued and run again when a port is available`
                  )
                );
                this.queue.push(src);
                return;
              }
            } else {
              console.error("negative port makes no sense", src);
              process.exit(-1);
            }
            const logs = createLogStreams(reportDest, "python");
            const venvPython = `./venv/bin/python3`;
            const pythonCommand = fs12.existsSync(venvPython) ? venvPython : "python3";
            const ipcfile = "/tmp/tpipe_python_" + Math.random();
            const child = spawn3(pythonCommand, [src, testResources, ipcfile], {
              stdio: ["pipe", "pipe", "pipe", "ipc"]
            });
            let buffer = Buffer.from("");
            let haltReturns = false;
            const server = net.createServer((socket) => {
              const queue = new Queue();
              socket.on("data", (data) => {
                buffer = Buffer.concat([buffer, data]);
                for (let b = 0; b < buffer.length + 1; b++) {
                  const c = buffer.slice(0, b);
                  try {
                    const d = JSON.parse(c.toString());
                    queue.enqueue(d);
                    buffer = buffer.slice(b);
                    b = 0;
                  } catch (e) {
                  }
                }
                while (queue.size() > 0) {
                  const message = queue.dequeue();
                  if (message) {
                    this.mapping().forEach(async ([command2, func]) => {
                      if (message[0] === command2) {
                        const args = message.slice(1, -1);
                        try {
                          const result = await this[command2](...args);
                          if (!haltReturns) {
                            socket.write(JSON.stringify({
                              payload: result,
                              key: message[message.length - 1]
                            }));
                          }
                        } catch (error) {
                          console.error(`Error handling command ${command2}:`, error);
                        }
                      }
                    });
                  }
                }
              });
            });
            return new Promise((resolve, reject) => {
              server.listen(ipcfile, () => {
                child.stdout?.on("data", (data) => {
                  logs.stdout?.write(data);
                });
                child.stderr?.on("data", (data) => {
                  logs.stderr?.write(data);
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
                  if (exitCode === 0) {
                    this.bddTestIsNowDone(src, 0);
                    statusMessagePretty(0, src, "python");
                    resolve();
                  } else {
                    console.log(
                      ansiColors2.red(
                        `python ! ${src} failed to execute. Check ${reportDest}/stderr.log for more info`
                      )
                    );
                    this.bddTestIsNowDone(src, exitCode);
                    statusMessagePretty(exitCode, src, "python");
                    reject(new Error(`Process exited with code ${exitCode}`));
                  }
                  haltReturns = true;
                });
                child.on("error", (e) => {
                  console.log(
                    ansiColors2.red(
                      ansiColors2.inverse(
                        `python: ${src} errored with: ${e.name}. Check error logs for more info`
                      )
                    )
                  );
                  this.bddTestIsNowDone(src, -1);
                  statusMessagePretty(-1, src, "python");
                  server.close();
                  haltReturns = true;
                  reject(e);
                });
              });
              server.on("error", (e) => {
                console.error("Server error:", e);
                reject(e);
              });
            }).finally(() => {
              portsToUse.forEach((port) => {
                this.ports[port] = "";
              });
              try {
                server.close();
              } catch (e) {
              }
            });
          })();
          this.addPromiseProcess(
            processId,
            pythonPromise,
            command,
            "bdd-test",
            src,
            "python"
          );
        };
        this.launchGolang = async (src, dest) => {
          const processId = `golang-${src}-${Date.now()}`;
          const command = `golang test: ${src}`;
          const golangPromise = (async () => {
            this.bddTestIsRunning(src);
            const reportDest = `testeranto/reports/${this.name}/${src.split(".").slice(0, -1).join(".")}/golang`;
            if (!fs12.existsSync(reportDest)) {
              fs12.mkdirSync(reportDest, { recursive: true });
            }
            let testResources = "";
            const testConfig = this.configs.tests.find((t) => t[0] === src);
            if (!testConfig) {
              console.log(
                ansiColors2.inverse(
                  `golang: missing test config! Exiting ungracefully for '${src}'`
                )
              );
              process.exit(-1);
            }
            const testConfigResource = testConfig[2];
            const portsToUse = [];
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
                    `golang: cannot run ${src} because there are no open ports ATM. This job will be enqueued and run again when a port is available`
                  )
                );
                this.queue.push(src);
                return;
              }
            } else {
              console.error("negative port makes no sense", src);
              process.exit(-1);
            }
            const buildDir = path.dirname(dest);
            const binaryName = path.basename(dest, ".go");
            const binaryPath = path.join(buildDir, binaryName);
            const logs = createLogStreams(reportDest, "golang");
            const compileProcess = spawn3("go", ["build", "-o", binaryPath, dest]);
            return new Promise((resolve, reject) => {
              compileProcess.stdout?.on("data", (data) => {
                logs.stdout?.write(data);
              });
              compileProcess.stderr?.on("data", (data) => {
                logs.stderr?.write(data);
              });
              compileProcess.on("close", (compileCode) => {
                if (compileCode !== 0) {
                  console.log(
                    ansiColors2.red(
                      `golang ! ${src} failed to compile. Check ${reportDest}/stderr.log for more info`
                    )
                  );
                  this.bddTestIsNowDone(src, compileCode || -1);
                  statusMessagePretty(compileCode || -1, src, "golang");
                  reject(new Error(`Compilation failed with code ${compileCode}`));
                  return;
                }
                const child = spawn3(binaryPath, [testResources], {
                  stdio: ["pipe", "pipe", "pipe", "ipc"]
                });
                child.stdout?.on("data", (data) => {
                  logs.stdout?.write(data);
                });
                child.stderr?.on("data", (data) => {
                  logs.stderr?.write(data);
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
                  if (exitCode === 0) {
                    this.bddTestIsNowDone(src, 0);
                    statusMessagePretty(0, src, "golang");
                    resolve();
                  } else {
                    console.log(
                      ansiColors2.red(
                        `golang ! ${src} failed to execute. Check ${reportDest}/stderr.log for more info`
                      )
                    );
                    this.bddTestIsNowDone(src, exitCode);
                    statusMessagePretty(exitCode, src, "golang");
                    reject(new Error(`Process exited with code ${exitCode}`));
                  }
                });
                child.on("error", (e) => {
                  console.log(
                    ansiColors2.red(
                      ansiColors2.inverse(
                        `golang: ${src} errored with: ${e.name}. Check error logs for more info`
                      )
                    )
                  );
                  this.bddTestIsNowDone(src, -1);
                  statusMessagePretty(-1, src, "golang");
                  reject(e);
                });
              });
              compileProcess.on("error", (e) => {
                console.log(
                  ansiColors2.red(
                    ansiColors2.inverse(
                      `golang: ${src} compilation errored with: ${e.name}. Check error logs for more info`
                    )
                  )
                );
                this.bddTestIsNowDone(src, -1);
                statusMessagePretty(-1, src, "golang");
                reject(e);
              });
            }).finally(() => {
              portsToUse.forEach((port) => {
                this.ports[port] = "";
              });
            });
          })();
          this.addPromiseProcess(
            processId,
            golangPromise,
            command,
            "bdd-test",
            src,
            "golang"
          );
        };
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
import fs13 from "fs";
import path10 from "path";
async function generateGolangMetafile(testName2, entryPoints) {
  const outputs = {};
  for (const entryPoint of entryPoints) {
    try {
      const entryDir = path10.dirname(entryPoint);
      const goFiles = fs13.readdirSync(entryDir).filter((file) => file.endsWith(".go")).map((file) => path10.join(entryDir, file));
      const inputs = {};
      let totalBytes = 0;
      for (const file of goFiles) {
        try {
          const stats = fs13.statSync(file);
          inputs[file] = { bytesInOutput: stats.size };
          totalBytes += stats.size;
        } catch {
          inputs[file] = { bytesInOutput: 0 };
        }
      }
      if (!inputs[entryPoint]) {
        try {
          const entryStats = fs13.statSync(entryPoint);
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
      const entryDir = path10.dirname(entryPoint);
      const goFiles = fs13.readdirSync(entryDir).filter((file) => file.endsWith(".go")).map((file) => path10.join(entryDir, file));
      goFiles.forEach((file) => allGoFiles.add(file));
      allGoFiles.add(entryPoint);
    } catch (error) {
      console.error(`Error processing Go entry point ${entryPoint} for source files:`, error);
    }
  }
  for (const filePath of Array.from(allGoFiles)) {
    try {
      const stats = fs13.statSync(filePath);
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
  const metafileDir = path10.join(
    process.cwd(),
    "testeranto",
    "metafiles",
    "golang"
  );
  fs13.mkdirSync(metafileDir, { recursive: true });
  const metafilePath = path10.join(metafileDir, `${testName2}.json`);
  fs13.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
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
import fs14 from "fs";
import path11 from "path";
import { execSync } from "child_process";
async function generatePitonoMetafile(testName2, entryPoints) {
  return {
    testName: testName2,
    entryPoints,
    timestamp: Date.now()
  };
}
function writePitonoMetafile(testName2, metafile) {
  const metafilePath = path11.join(process.cwd(), "testeranto", "pitono", testName2, "metafile.json");
  const metafileDir = path11.dirname(metafilePath);
  if (!fs14.existsSync(metafileDir)) {
    fs14.mkdirSync(metafileDir, { recursive: true });
  }
  fs14.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
  console.log(`Pitono metafile written to: ${metafilePath}`);
  try {
    const command = `pitono-core-generator ${testName2} ${metafile.entryPoints.join(" ")}`;
    execSync(command, { stdio: "inherit" });
    console.log(`Pitono core.json generated successfully for ${testName2}`);
  } catch (error) {
    console.error(`Failed to generate Pitono core.json with installed command: ${error}`);
    try {
      const pythonCommand = `python ${process.cwd()}/pitono/core_generator.py ${testName2} ${metafile.entryPoints.join(" ")}`;
      execSync(pythonCommand, { stdio: "inherit" });
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
        const coreFilePath = path11.join(process.cwd(), "testeranto", "pitono", testName2, "core.json");
        fs14.writeFileSync(coreFilePath, JSON.stringify(coreData, null, 2));
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
import ansiC5 from "ansi-colors";
import fs15 from "fs";
import path12 from "path";
import readline from "readline";

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
  try {
    fs15.writeFileSync(
      `${process.cwd()}/testeranto/projects.json`,
      JSON.stringify(Object.keys(bigConfig.projects), null, 2)
    );
  } catch (e) {
    console.error("there was a problem");
    console.error(e);
  }
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
  console.log(ansiC5.inverse("Press 'q' to initiate a graceful shutdown."));
  console.log(ansiC5.inverse("Press 'x' to quit forcefully."));
  process.stdin.on("keypress", (str, key) => {
    if (key.name === "x") {
      console.log(ansiC5.inverse("Shutting down forcefully..."));
      process.exit(-1);
    }
  });
  let pm = null;
  const { PM_Main: PM_Main2 } = await init_main().then(() => main_exports);
  pm = new PM_Main2(config, testName, mode);
  await pm.start();
  fs15.writeFileSync(`${process.cwd()}/testeranto/projects.html`, AppHtml());
  Object.keys(bigConfig.projects).forEach((projectName) => {
    console.log(`testeranto/reports/${projectName}`);
    if (!fs15.existsSync(`testeranto/reports/${projectName}`)) {
      fs15.mkdirSync(`testeranto/reports/${projectName}`);
    }
    fs15.writeFileSync(
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
  [...getSecondaryEndpointsPoints("python")].forEach(async (sourceFilePath) => {
    console.log(`Pitono test found: ${sourceFilePath}`);
  });
  const golangTests = config.tests.filter((test) => test[1] === "golang");
  const hasGolangTests = golangTests.length > 0;
  if (hasGolangTests) {
    const { generateGolangMetafile: generateGolangMetafile2, writeGolangMetafile: writeGolangMetafile2 } = await Promise.resolve().then(() => (init_golingvuMetafile(), golingvuMetafile_exports));
    const golangEntryPoints = golangTests.map((test) => test[0]);
    const metafile = await generateGolangMetafile2(testName, golangEntryPoints);
    writeGolangMetafile2(testName, metafile);
  }
  const pitonoTests = config.tests.filter((test) => test[1] === "python");
  const hasPitonoTests = pitonoTests.length > 0;
  if (hasPitonoTests) {
    const { generatePitonoMetafile: generatePitonoMetafile2 } = await Promise.resolve().then(() => (init_pitonoMetafile(), pitonoMetafile_exports));
    const pitonoEntryPoints = pitonoTests.map((test) => test[0]);
    const metafile = await generatePitonoMetafile2(testName, pitonoEntryPoints);
    const pitonoMetafilePath = `${process.cwd()}/testeranto/metafiles/python`;
    await fs15.promises.mkdir(pitonoMetafilePath, { recursive: true });
    fs15.writeFileSync(
      `${pitonoMetafilePath}/core.json`,
      JSON.stringify(metafile, null, 2)
    );
    console.log(
      ansiC5.green(
        ansiC5.inverse(
          `Python metafile written to: ${pitonoMetafilePath}/core.json`
        )
      )
    );
    pitonoEntryPoints.forEach((entryPoint) => {
      if (pm) {
        pm.addToQueue(entryPoint, "python");
      }
    });
  }
  Promise.resolve(
    Promise.all(
      [...getSecondaryEndpointsPoints("web")].map(async (sourceFilePath) => {
        const sourceFileSplit = sourceFilePath.split("/");
        const sourceDir = sourceFileSplit.slice(0, -1);
        const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
        const sourceFileNameMinusJs = sourceFileName.split(".").slice(0, -1).join(".");
        const htmlFilePath = path12.normalize(
          `${process.cwd()}/testeranto/bundles/web/${testName}/${sourceDir.join(
            "/"
          )}/${sourceFileNameMinusJs}.html`
        );
        const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
        const cssFilePath = `./${sourceFileNameMinusJs}.css`;
        return fs15.promises.mkdir(path12.dirname(htmlFilePath), { recursive: true }).then(
          (x2) => fs15.writeFileSync(
            htmlFilePath,
            web_html_default(jsfilePath, htmlFilePath, cssFilePath)
          )
        );
      })
    )
  );
  const {
    nodeEntryPoints,
    nodeEntryPointSidecars,
    webEntryPoints,
    webEntryPointSidecars,
    pureEntryPoints,
    pureEntryPointSidecars,
    pythonEntryPoints,
    pythonEntryPointSidecars
  } = getRunnables(config.tests, testName);
  const x = [
    ["pure", Object.keys(pureEntryPoints)],
    ["node", Object.keys(nodeEntryPoints)],
    ["web", Object.keys(webEntryPoints)],
    ["python", Object.keys(pythonEntryPoints)]
  ];
  x.forEach(async ([runtime, keys]) => {
    keys.forEach(async (k) => {
      const folder = `testeranto/reports/${testName}/${k.split(".").slice(0, -1).join(".")}/${runtime}`;
      await fs15.mkdirSync(folder, { recursive: true });
    });
  });
  [
    [pureEntryPoints, pureEntryPointSidecars, "pure"],
    [webEntryPoints, webEntryPointSidecars, "web"],
    [nodeEntryPoints, nodeEntryPointSidecars, "node"],
    [pythonEntryPoints, pythonEntryPointSidecars, "python"]
  ].forEach(
    ([eps, eps2, runtime]) => {
      [...Object.keys(eps), ...Object.keys(eps2)].forEach((ep) => {
        const fp = path12.resolve(
          `testeranto`,
          `reports`,
          testName,
          ep.split(".").slice(0, -1).join("."),
          runtime
        );
        fs15.mkdirSync(fp, { recursive: true });
      });
    }
  );
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
