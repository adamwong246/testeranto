import { spawn } from "node:child_process";

import ts from "typescript";
import net from "net";
import { Page } from "puppeteer-core/lib/esm/puppeteer";
import fs, { watch } from "fs";
import path from "path";
import puppeteer, { ConsoleMessage, ScreenshotOptions } from "puppeteer-core";
import ansiC from "ansi-colors";
import crypto from "node:crypto";
import { ESLint } from "eslint";
import tsc from "tsc-prog";

import { IFinalResults, IRunnables } from "../lib/index.js";
import {
  getRunnables,
  ISummary,
  lintPather,
  promptPather,
  tscPather,
} from "../utils";
import { IBuiltConfig, IRunTime, ITestTypes } from "../Types.js";

import { PM_Base } from "./base.js";

type IOutputs = Record<
  string,
  {
    entryPoint: string;
    inputs: Record<string, string>;
  }
>;
const eslint = new ESLint();
const formatter = await eslint.loadFormatter(
  "./node_modules/testeranto/dist/prebuild/esbuildConfigs/eslint-formatter-testeranto.mjs"
);
const changes: Record<string, string> = {};
const fileHashes = {};
const files: Record<string, Set<string>> = {};
const screenshots: Record<string, Promise<Uint8Array>[]> = {};

async function fileHash(filePath, algorithm = "md5") {
  return new Promise<string>((resolve, reject) => {
    const hash = crypto.createHash(algorithm);
    const fileStream = fs.createReadStream(filePath);

    fileStream.on("data", (data) => {
      hash.update(data);
    });

    fileStream.on("end", () => {
      const fileHash = hash.digest("hex");
      resolve(fileHash);
    });

    fileStream.on("error", (error) => {
      reject(`Error reading file: ${error.message}`);
    });
  });
}

const statusMessagePretty = (failures: number, test: string) => {
  if (failures === 0) {
    console.log(ansiC.green(ansiC.inverse(`> ${test} completed successfully`)));
  } else {
    console.log(ansiC.red(ansiC.inverse(`> ${test} failed ${failures} times`)));
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

const filesHash = async (files: string[], algorithm = "md5") => {
  return new Promise<string>((resolve, reject) => {
    resolve(
      files.reduce(async (mm: Promise<string>, f) => {
        return (await mm) + (await fileHash(f));
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

// Wait for file to exist, checks every 2 seconds by default
function pollForFile(path, timeout = 2000) {
  const intervalObj = setInterval(function () {
    const file = path;
    const fileExists = fs.existsSync(file);

    // console.log("Checking for: ", file);
    // console.log("Exists: ", fileExists);

    if (fileExists) {
      clearInterval(intervalObj);
    }
  }, timeout);
}

export class PM_Main extends PM_Base {
  name: string;
  ports: Record<number, boolean>;
  queue: any[];
  mode: "once" | "dev";
  bigBoard: ISummary = {};
  webMetafileWatcher: fs.FSWatcher;
  nodeMetafileWatcher: fs.FSWatcher;
  importMetafileWatcher: fs.FSWatcher;

  constructor(configs: IBuiltConfig, name: string, mode: "once" | "dev") {
    super(configs);

    this.name = name;
    this.mode = mode;
    this.ports = {};

    this.configs.tests.forEach(([t]) => {
      this.bigBoard[t] = {
        runTimeError: "?",
        typeErrors: "?",
        staticErrors: "?",
        prompt: "?",
      };
    });

    this.configs.ports.forEach((element) => {
      this.ports[element] = "true"; // set ports as open
    });
  }

  mapping(): [string, (...a) => any][] {
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
      ["writeFileSync", this.writeFileSync],
    ];
  }

  async start() {
    // set up the "pure" listeners
    this.mapping().forEach(async ([command, func]) => {
      // page.exposeFunction(command, func);
      globalThis[command] = func;
    });

    if (!fs.existsSync(`testeranto/reports/${this.name}`)) {
      fs.mkdirSync(`testeranto/reports/${this.name}`);
    }

    // await pollForFile();

    this.browser = (await puppeteer.launch({
      slowMo: 1,
      waitForInitialPage: false,
      executablePath:
        // process.env.CHROMIUM_PATH || "/opt/homebrew/bin/chromium",
        "/opt/homebrew/bin/chromium",
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
        "--unsafely-treat-insecure-origin-as-secure=*",
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
      ],
    })) as any;

    const { nodeEntryPoints, webEntryPoints, importEntryPoints } =
      this.getRunnables(this.configs.tests, this.name);

    [
      [
        nodeEntryPoints,
        this.launchNode,
        "node",
        (w) => {
          this.nodeMetafileWatcher = w;
        },
      ],
      [
        webEntryPoints,
        this.launchWeb,
        "web",
        (w) => {
          this.webMetafileWatcher = w;
        },
      ],
      [
        importEntryPoints,
        this.launchPure,
        "pure",
        (w) => {
          this.importMetafileWatcher = w;
        },
      ],
    ].forEach(
      async ([eps, launcher, runtime, watcher]: [
        Record<string, string>,
        (src: string, dest: string) => Promise<void>,
        IRunTime,
        (f: fs.FSWatcher) => void
      ]) => {
        const metafile = `./testeranto/bundles/${runtime}/${this.name}/metafile.json`;

        await pollForFile(metafile);

        Object.entries(eps).forEach(
          async ([k, outputFile]: [string, string]) => {
            // await pollForFile(outputFile);

            launcher(k, outputFile);
            try {
              watch(outputFile, async (e, filename) => {
                const hash = await fileHash(outputFile);
                if (fileHashes[k] !== hash) {
                  fileHashes[k] = hash;
                  console.log(ansiC.green(ansiC.inverse(`< ${e} ${filename}`)));
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
              ansiC.green(ansiC.inverse(`< ${e} ${filename} (${runtime})`))
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

  getRunnables = (
    tests: ITestTypes[],
    testName: string,
    payload = {
      nodeEntryPoints: {},
      webEntryPoints: {},
      importEntryPoints: {},
    }
  ): IRunnables => {
    return getRunnables(tests, testName, payload);
  };

  async metafileOutputs(platform: IRunTime) {
    const metafile = JSON.parse(
      fs
        .readFileSync(
          `./testeranto/bundles/${platform}/${this.name}/metafile.json`
        )
        .toString()
    ).metafile;

    if (!metafile) return;

    const outputs: IOutputs = metafile.outputs;

    Object.keys(outputs).forEach(async (k) => {
      const addableFiles = Object.keys(outputs[k].inputs).filter((i) => {
        if (!fs.existsSync(i)) return false;
        if (i.startsWith("node_modules")) return false;
        return true;
      });

      const f = `${k.split(".").slice(0, -1).join(".")}/`;
      if (!fs.existsSync(f)) {
        fs.mkdirSync(f);
      }

      const entrypoint = outputs[k].entryPoint;

      if (entrypoint) {
        const changeDigest = await filesHash(addableFiles);

        if (changeDigest === changes[entrypoint]) {
          // skip
        } else {
          changes[entrypoint] = changeDigest;
          this.tscCheck({
            platform,
            addableFiles,
            entrypoint: "./" + entrypoint,
          });
          this.eslintCheck("./" + entrypoint, platform, addableFiles);
          this.makePrompt("./" + entrypoint, addableFiles, platform);
        }
      }
    });
  }

  tscCheck = async ({
    entrypoint,
    addableFiles,
    platform,
  }: {
    platform: IRunTime;
    entrypoint: string;
    addableFiles: string[];
  }) => {
    console.log(ansiC.green(ansiC.inverse(`tsc < ${entrypoint}`)));
    this.typeCheckIsRunning(entrypoint);

    const program = tsc.createProgramFromConfig({
      basePath: process.cwd(), // always required, used for relative paths
      configFilePath: "tsconfig.json", // config to inherit from (optional)
      compilerOptions: {
        rootDir: "src",
        outDir: tscPather(entrypoint, platform, this.name),
        // declaration: true,
        // skipLibCheck: true,
        noEmit: true,
      },
      include: addableFiles, //["src/**/*"],
      // exclude: ["node_modules", "../testeranto"],
      // exclude: ["**/*.test.ts", "**/*.spec.ts"],
    });
    const tscPath = tscPather(entrypoint, platform, this.name);

    let allDiagnostics = program.getSemanticDiagnostics();

    const results: string[] = [];
    allDiagnostics.forEach((diagnostic) => {
      if (diagnostic.file) {
        let { line, character } = ts.getLineAndCharacterOfPosition(
          diagnostic.file,
          diagnostic.start!
        );
        let message = ts.flattenDiagnosticMessageText(
          diagnostic.messageText,
          "\n"
        );
        results.push(
          `${diagnostic.file.fileName} (${line + 1},${
            character + 1
          }): ${message}`
        );
      } else {
        results.push(
          ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
        );
      }
    });

    fs.writeFileSync(tscPath, results.join("\n"));

    this.typeCheckIsNowDone(entrypoint, results.length);
  };

  eslintCheck = async (
    entrypoint: string,
    platform: IRunTime,
    addableFiles: string[]
  ) => {
    console.log(ansiC.green(ansiC.inverse(`eslint < ${entrypoint}`)));
    this.lintIsRunning(entrypoint);

    const results = (await eslint.lintFiles(addableFiles))
      .filter((r) => r.messages.length)
      .filter((r) => {
        return r.messages[0].ruleId !== null;
      })
      .map((r) => {
        delete r.source;
        return r;
      });

    fs.writeFileSync(
      lintPather(entrypoint, platform, this.name),
      await formatter.format(results)
    );
    this.lintIsNowDone(entrypoint, results.length);
  };

  makePrompt = async (
    entryPoint: string,
    addableFiles: string[],
    platform: IRunTime
  ) => {
    this.bigBoard[entryPoint].prompt = "?";
    const promptPath = promptPather(entryPoint, platform, this.name);

    const testPaths = path.join(
      "testeranto",
      "reports",
      this.name,
      platform,
      entryPoint.split(".").slice(0, -1).join("."),
      `tests.json`
    );

    const featuresPath = path.join(
      "testeranto",
      "reports",
      this.name,
      platform,
      entryPoint.split(".").slice(0, -1).join("."),
      `featurePrompt.txt`
    );

    fs.writeFileSync(
      promptPath,
      `
${addableFiles
  .map((x) => {
    return `/add ${x}`;
  })
  .join("\n")}

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
    this.bigBoard[
      entryPoint
    ].prompt = `aider --model deepseek/deepseek-chat --load testeranto/${
      this.name
    }/reports/${platform}/${entryPoint
      .split(".")
      .slice(0, -1)
      .join(".")}/prompt.txt`;
    this.checkForShutdown();
  };

  checkForShutdown = () => {
    this.writeBigBoard();

    if (this.mode === "dev") return;

    let inflight = false;

    Object.keys(this.bigBoard).forEach((k) => {
      if (this.bigBoard[k].prompt === "?") {
        console.log(ansiC.blue(ansiC.inverse(`🕕 prompt ${k}`)));
        inflight = true;
      }
    });

    Object.keys(this.bigBoard).forEach((k) => {
      if (this.bigBoard[k].runTimeError === "?") {
        console.log(ansiC.blue(ansiC.inverse(`🕕 runTimeError ${k}`)));
        inflight = true;
      }
    });

    Object.keys(this.bigBoard).forEach((k) => {
      if (this.bigBoard[k].staticErrors === "?") {
        console.log(ansiC.blue(ansiC.inverse(`🕕 staticErrors ${k}`)));
        inflight = true;
      }
    });

    Object.keys(this.bigBoard).forEach((k) => {
      if (this.bigBoard[k].typeErrors === "?") {
        console.log(ansiC.blue(ansiC.inverse(`🕕 typeErrors ${k}`)));
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

  typeCheckIsRunning = (src: string) => {
    this.bigBoard[src].typeErrors = "?";
  };

  typeCheckIsNowDone = (src: string, failures: number) => {
    this.bigBoard[src].typeErrors = failures;
    this.writeBigBoard();
    this.checkForShutdown();
  };

  lintIsRunning = (src: string) => {
    this.bigBoard[src].staticErrors = "?";
    this.writeBigBoard();
  };

  lintIsNowDone = (src: string, failures: number) => {
    this.bigBoard[src].staticErrors = failures;
    this.writeBigBoard();
    this.checkForShutdown();
  };

  bddTestIsRunning = (src: string) => {
    this.bigBoard[src].runTimeError = "?";
    this.writeBigBoard();
  };

  bddTestIsNowDone = (src: string, failures: number) => {
    this.bigBoard[src].runTimeError = failures;
    this.writeBigBoard();
    this.checkForShutdown();
  };

  launchPure = async (src: string, dest: string) => {
    console.log(ansiC.green(ansiC.inverse(`! pure, ${src}`)));
    this.bddTestIsRunning(src);

    const reportDest = `testeranto/reports/${this.name}/${src
      .split(".")
      .slice(0, -1)
      .join(".")}/pure`;
    if (!fs.existsSync(reportDest)) {
      fs.mkdirSync(reportDest, { recursive: true });
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

    let portsToUse: string[] = [];
    if (testConfigResource.ports === 0) {
      argz = JSON.stringify({
        scheduled: true,
        name: src,
        ports: portsToUse,
        fs: reportDest,
        browserWSEndpoint: this.browser.wsEndpoint(),
      });
    } else if (testConfigResource.ports > 0) {
      const openPorts = Object.entries(this.ports).filter(
        ([portnumber, portopen]) => portopen
      );

      if (openPorts.length >= testConfigResource.ports) {
        for (let i = 0; i < testConfigResource.ports; i++) {
          portsToUse.push(openPorts[i][0]);

          this.ports[openPorts[i][0]] = false; // port is now closed
        }

        argz = JSON.stringify({
          scheduled: true,
          name: src,
          ports: portsToUse,
          fs: destFolder,
          browserWSEndpoint: this.browser.wsEndpoint(),
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

    const webSideCares: Page[] = [];

    // fs.writeFileSync(
    //   `${reportDest}/stdlog.txt`,
    //   "THIS FILE IS AUTO GENERATED. IT IS PURPOSEFULLY LEFT BLANK."
    // );

    // await Promise.all(
    //   testConfig[3].map(async (sidecar) => {
    //     if (sidecar[1] === "web") {
    //       const s = await this.launchWebSideCar(
    //         sidecar[0],
    //         destinationOfRuntime(sidecar[0], "web", this.configs),
    //         sidecar
    //       );
    //       webSideCares.push(s);
    //       return s;
    //     }

    //     if (sidecar[1] === "node") {
    //       return this.launchNodeSideCar(
    //         sidecar[0],
    //         destinationOfRuntime(sidecar[0], "node", this.configs),
    //         sidecar
    //       );
    //     }
    //   })
    // );

    await import(`${builtfile}?cacheBust=${Date.now()}`).then((module) => {
      return module.default.then((defaultModule) => {
        defaultModule
          .receiveTestResourceConfig(argz)
          .then(async (results: IFinalResults) => {
            this.receiveFeatures(results.features, destFolder, src, "pure");
            statusMessagePretty(results.fails, src);
            this.bddTestIsNowDone(src, results.fails);
          })
          .catch((e) => {
            console.log(ansiC.red(ansiC.inverse(`${src} errored with: ${e}`)));
            this.bddTestIsNowDone(src, -1);
          })
          .finally(() => {
            webSideCares.forEach((webSideCar) => webSideCar.close());
          });
      });
    });

    // console.log("portsToUse", portsToUse);
    for (let i = 0; i <= portsToUse.length; i++) {
      if (portsToUse[i]) {
        this.ports[portsToUse[i]] = "true"; //port is open again
      }
    }
  };

  launchNode = async (src: string, dest: string) => {
    console.log(ansiC.green(ansiC.inverse(`! node, ${src}`)));
    this.bddTestIsRunning(src);

    const reportDest = `testeranto/reports/${this.name}/${src
      .split(".")
      .slice(0, -1)
      .join(".")}/node`;
    if (!fs.existsSync(reportDest)) {
      fs.mkdirSync(reportDest, { recursive: true });
    }

    const destFolder = dest.replace(".mjs", "");

    let testResources = "";

    const testConfig = this.configs.tests.find((t) => {
      return t[0] === src;
    });

    if (!testConfig) {
      console.log(ansiC.inverse("missing test config! Exiting ungracefully!"));
      process.exit(-1);
    }
    const testConfigResource = testConfig[2];

    let portsToUse: string[] = [];
    if (testConfigResource.ports === 0) {
      testResources = JSON.stringify({
        scheduled: true,
        name: src,
        ports: portsToUse,
        fs: reportDest,
        browserWSEndpoint: this.browser.wsEndpoint(),
      });
    } else if (testConfigResource.ports > 0) {
      const openPorts = Object.entries(this.ports).filter(
        ([portnumber, portopen]) => portopen
      );

      if (openPorts.length >= testConfigResource.ports) {
        for (let i = 0; i < testConfigResource.ports; i++) {
          portsToUse.push(openPorts[i][0]);

          this.ports[openPorts[i][0]] = false; // port is now closed
        }

        testResources = JSON.stringify({
          scheduled: true,
          name: src,
          ports: portsToUse,
          fs: destFolder,
          browserWSEndpoint: this.browser.wsEndpoint(),
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

    // const webSideCares: Page[] = [];

    // await Promise.all(
    //   testConfig[3].map(async (sidecar) => {
    //     if (sidecar[1] === "web") {
    //       const s = await this.launchWebSideCar(
    //         sidecar[0],
    //         destinationOfRuntime(sidecar[0], "web", this.configs),
    //         sidecar
    //       );
    //       webSideCares.push(s);
    //       return s;
    //     }

    //     if (sidecar[1] === "node") {
    //       return this.launchNodeSideCar(
    //         sidecar[0],
    //         destinationOfRuntime(sidecar[0], "node", this.configs),
    //         sidecar
    //       );
    //     }
    //   })
    // );

    // const f = fork(builtfile, [testResources], {
    //   silent: true,
    //   // detached: true,
    //   // stdio: "ignore",
    // });

    let haltReturns = false;

    let buffer: Buffer<ArrayBufferLike> = new Buffer("");
    const server = net.createServer((socket) => {
      socket.on("data", (data) => {
        buffer = Buffer.concat([buffer, data]);

        let messages: string[][] = [];
        for (let b = 0; b < buffer.length + 1; b++) {
          let c = buffer.slice(0, b);
          let d;
          try {
            d = JSON.parse(c.toString());

            messages.push(d);
            buffer = buffer.slice(b, buffer.length + 1);
            b = 0;
          } catch (e) {
            // b++;
          }
        }

        messages.forEach(async (payload) => {
          // set up the "node" listeners
          this.mapping().forEach(async ([command, func]) => {
            if (payload[0] === command) {
              const x = payload.slice(1, -1);
              const r = await this[command](...x);

              if (!haltReturns) {
                child.send(
                  JSON.stringify({
                    payload: r,
                    key: payload[payload.length - 1],
                  })
                );
              }
            }
          });
        });
      });
    });

    const oStream = fs.createWriteStream(`${reportDest}/console_log.txt`);

    const child = spawn("node", [builtfile, testResources], {
      stdio: ["pipe", "pipe", "pipe", "ipc"],
      // silent: true
    });

    const p = destFolder + "/pipe";
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

        // haltReturns = true;
      });
      child.on("exit", (code) => {});
    });

    child.send({ path: p });

    for (let i = 0; i <= portsToUse.length; i++) {
      if (portsToUse[i]) {
        this.ports[portsToUse[i]] = "true"; //port is open again
      }
    }
  };

  launchWebSideCar = async (
    src: string,
    dest: string,
    testConfig: ITestTypes
  ): Promise<Page> => {
    const d = dest + ".mjs";

    console.log(ansiC.green(ansiC.inverse(`launchWebSideCar ${src}`)));

    const fileStreams2: fs.WriteStream[] = [];
    const doneFileStream2: Promise<any>[] = [];

    return new Promise((res, rej) => {
      this.browser
        .newPage()
        .then((page) => {
          // page.on("console", (msg) => {
          //   console.log("web > ", msg.args(), msg.text());
          //   // for (let i = 0; i < msg._args.length; ++i)
          //   //   console.log(`${i}: ${msg._args[i]}`);
          // });

          page.exposeFunction(
            "custom-screenshot",
            async (ssOpts: ScreenshotOptions, testName: string) => {
              const p = ssOpts.path as string;
              const dir = path.dirname(p);
              fs.mkdirSync(dir, {
                recursive: true,
              });
              files[testName].add(ssOpts.path as string);

              const sPromise = page.screenshot({
                ...ssOpts,
                path: p,
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
            (fp: string, contents: string, testName: string) => {
              const dir = path.dirname(fp);

              fs.mkdirSync(dir, {
                recursive: true,
              });

              const p = new Promise<string>(async (res, rej) => {
                fs.writeFileSync(fp, contents);
                res(fp);
              });
              doneFileStream2.push(p);

              if (!files[testName]) {
                files[testName] = new Set();
              }
              files[testName].add(fp);
              return p;
            }
          );

          page.exposeFunction("existsSync", (fp: string, contents: string) => {
            return fs.existsSync(fp);
          });

          page.exposeFunction("mkdirSync", (fp: string) => {
            if (!fs.existsSync(fp)) {
              return fs.mkdirSync(fp, {
                recursive: true,
              });
            }
            return false;
          });

          page.exposeFunction(
            "createWriteStream",
            (fp: string, testName: string) => {
              const f = fs.createWriteStream(fp);

              files[testName].add(fp);

              const p = new Promise<string>((res, rej) => {
                res(fp);
              });
              doneFileStream2.push(p);
              f.on("close", async () => {
                await p;
              });
              fileStreams2.push(f);
              return {
                ...JSON.parse(JSON.stringify(f)),
                uid: fileStreams2.length - 1,
              };
            }
          );

          page.exposeFunction(
            "write",
            async (uid: number, contents: string) => {
              return fileStreams2[uid].write(contents);
            }
          );

          page.exposeFunction("end", async (uid: number) => {
            return fileStreams2[uid].end();
          });

          return page;
        })
        .then(async (page) => {
          await page.goto(`file://${`${dest}.html`}`, {});

          /* @ts-ignore:next-line */
          res(page);
        });
    });
  };

  launchNodeSideCar = async (
    src: string,
    dest: string,
    testConfig: ITestTypes
  ) => {
    const d = dest + ".mjs";
    console.log(ansiC.green(ansiC.inverse(`launchNodeSideCar ${src}`)));

    const destFolder = dest.replace(".mjs", "");

    let argz = "";

    const testConfigResource = testConfig[2];

    let portsToUse: string[] = [];
    if (testConfigResource.ports === 0) {
      argz = JSON.stringify({
        scheduled: true,
        name: src,
        ports: portsToUse,
        fs: destFolder,
        browserWSEndpoint: this.browser.wsEndpoint(),
      });
    } else if (testConfigResource.ports > 0) {
      const openPorts = Object.entries(this.ports).filter(
        ([portnumber, portopen]) => portopen
      );
      // console.log("openPorts", openPorts);
      if (openPorts.length >= testConfigResource.ports) {
        for (let i = 0; i < testConfigResource.ports; i++) {
          portsToUse.push(openPorts[i][0]);

          this.ports[openPorts[i][0]] = false; // port is now closed
        }

        argz = JSON.stringify({
          scheduled: true,
          name: src,
          // ports: [3333],
          ports: portsToUse,
          fs: ".",
          browserWSEndpoint: this.browser.wsEndpoint(),
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
        // console.log("defaultModule", defaultModule);
        const s = new defaultModule();
        s.receiveTestResourceConfig(argz);
        // Object.create(defaultModule);

        // defaultModule
        //   .receiveTestResourceConfig(argz)
        //   .then((x) => {
        //     console.log("then", x);
        //     return x;
        //   })
        //   .catch((e) => {
        //     console.log("catch", e);
        //   });
      });
    });

    for (let i = 0; i <= portsToUse.length; i++) {
      if (portsToUse[i]) {
        this.ports[portsToUse[i]] = "true"; //port is open again
      }
    }
  };

  launchWeb = async (src: string, dest: string) => {
    console.log(ansiC.green(ansiC.inverse(`! web ${src}`)));
    this.bddTestIsRunning(src);

    const reportDest = `testeranto/reports/${this.name}/${src
      .split(".")
      .slice(0, -1)
      .join(".")}/web`;
    if (!fs.existsSync(reportDest)) {
      fs.mkdirSync(reportDest, { recursive: true });
    }

    const destFolder = dest.replace(".mjs", "");

    const webArgz = JSON.stringify({
      name: dest,
      ports: [].toString(),
      fs: reportDest,
      browserWSEndpoint: this.browser.wsEndpoint(),
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

    const oStream = fs.createWriteStream(`${reportDest}/console_log.txt`);

    this.browser
      .newPage()
      .then((page) => {
        // set up the "node" listeners
        this.mapping().forEach(async ([command, func]) => {
          page.exposeFunction(command, func);
        });

        return page;
      })
      .then(async (page) => {
        const close = () => {
          if (!files[src]) {
            files[src] = new Set();
          }
          // files[t].add(filepath);

          fs.writeFileSync(
            destFolder + "/manifest.json",
            JSON.stringify(Array.from(files[src]))
          );
          delete files[src];

          Promise.all(screenshots[src] || []).then(() => {
            delete screenshots[src];
            page.close();
            oStream.close();
          });
        };

        page.on("pageerror", (err: Error) => {
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
        page.on("console", (log: ConsoleMessage) => {
          oStream.write(log.text());
          oStream.write(JSON.stringify(log.location()));
          oStream.write(JSON.stringify(log.stackTrace()));
          oStream.write("\n");
        });
        await page.goto(`file://${`${destFolder}.html`}`, {});

        await page
          .evaluate(evaluation)
          .then(async ({ fails, failed, features }: IFinalResults) => {
            this.receiveFeatures(features, destFolder, src, "web");
            statusMessagePretty(fails, src);
            this.bddTestIsNowDone(src, fails);
          })
          .catch((e) => {
            console.log(ansiC.red(ansiC.inverse(`${src} errored with: ${e}`)));
          })
          .finally(() => {
            this.bddTestIsNowDone(src, -1);
            close();
          });

        return page;
      });
  };

  receiveFeatures = (
    features: string[],
    destFolder: string,
    srcTest: string,
    platform: IRunTime
  ) => {
    const featureDestination = path.resolve(
      process.cwd(),
      "reports",
      "features",
      "strings",
      srcTest.split(".").slice(0, -1).join(".") + ".features.txt"
    );

    features
      .reduce(async (mm, featureStringKey) => {
        const accum = await mm;

        const isUrl = isValidUrl(featureStringKey);

        if (isUrl) {
          const u = new URL(featureStringKey);

          if (u.protocol === "file:") {
            const newPath = `${process.cwd()}/testeranto/features/internal/${path.relative(
              process.cwd(),
              u.pathname
            )}`;

            await fs.promises.mkdir(path.dirname(newPath), { recursive: true });

            try {
              await fs.unlinkSync(newPath);
              // console.log(`Removed existing link at ${newPath}`);
            } catch (error) {
              if (error.code !== "ENOENT") {
                // throw error;
              }
            }

            // fs.symlink(u.pathname, newPath, (err) => {
            //   if (err) {
            //     // console.error("Error creating symlink:", err);
            //   } else {
            //     // console.log("Symlink created successfully");
            //   }
            // });
            accum.files.push(newPath);
          } else if (u.protocol === "http:" || u.protocol === "https:") {
            const newPath = `${process.cwd()}/testeranto/features/external${
              u.hostname
            }${u.pathname}`;
            const body = await this.configs.featureIngestor(featureStringKey);
            writeFileAndCreateDir(newPath, body);
            accum.files.push(newPath);
          }
        } else {
          await fs.promises.mkdir(path.dirname(featureDestination), {
            recursive: true,
          });

          accum.strings.push(featureStringKey);
        }

        return accum;
      }, Promise.resolve({ files: [] as string[], strings: [] as string[] }))

      .then(({ files, strings }: { files: string[]; strings: string[] }) => {
        fs.writeFileSync(
          `testeranto/reports/${this.name}/${srcTest
            .split(".")
            .slice(0, -1)
            .join(".")}/${platform}/featurePrompt.txt`,
          files
            .map((f) => {
              return `/read ${f}`;
            })
            .join("\n")
        );
      });
  };

  writeBigBoard = () => {
    fs.writeFileSync(
      `./testeranto/reports/${this.name}/summary.json`,
      JSON.stringify(this.bigBoard, null, 2)
    );
  };
}
