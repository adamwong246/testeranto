/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ChildProcess, spawn } from "node:child_process";
import ansiColors from "ansi-colors";
import net from "net";
import { Page } from "puppeteer-core/lib/esm/puppeteer";
import fs, { watch } from "fs";
import path from "path";
import puppeteer, { ConsoleMessage } from "puppeteer-core";
import ansiC from "ansi-colors";
import crypto from "node:crypto";
import { WebSocketServer } from "ws";
import http from "http";
import url from "url";
import mime from "mime-types";

import {
  IFinalResults,
  IRunnables,
  ITTestResourceConfiguration,
} from "../lib/index.js";
import { getRunnables } from "../utils";
import { IBuiltConfig, IRunTime, ITestTypes } from "../Types.js";
import { Sidecar } from "../lib/Sidecar.js";
import { Queue } from "../utils/queue.js";

import { PM_WithWebSocket } from "./PM_WithWebSocket.js";

type IOutputs = Record<
  string,
  {
    entryPoint: string;
    inputs: Record<string, string>;
  }
>;

const changes: Record<string, string> = {};
const fileHashes = {};
const files: Record<string, Set<string>> = {};
const screenshots: Record<string, Promise<Uint8Array>[]> = {};

type LogStreams = {
  closeAll: () => void;
  writeExitCode: (code: number, error?: Error) => void;
  stdout?: fs.WriteStream;
  stderr?: fs.WriteStream;
  info?: fs.WriteStream;
  warn?: fs.WriteStream;
  error?: fs.WriteStream;
  debug?: fs.WriteStream;
  exit: fs.WriteStream;
};

function runtimeLogs(
  runtime: IRunTime,
  reportDest: string
): Record<string, fs.WriteStream> {
  const safeDest = reportDest || `testeranto/reports/default_${Date.now()}`;

  try {
    if (!fs.existsSync(safeDest)) {
      fs.mkdirSync(safeDest, { recursive: true });
    }

    if (runtime === "node") {
      return {
        stdout: fs.createWriteStream(`${safeDest}/stdout.log`),
        stderr: fs.createWriteStream(`${safeDest}/stderr.log`),
        exit: fs.createWriteStream(`${safeDest}/exit.log`),
      };
    } else if (runtime === "web") {
      return {
        info: fs.createWriteStream(`${safeDest}/info.log`),
        warn: fs.createWriteStream(`${safeDest}/warn.log`),
        error: fs.createWriteStream(`${safeDest}/error.log`),
        debug: fs.createWriteStream(`${safeDest}/debug.log`),
        exit: fs.createWriteStream(`${safeDest}/exit.log`),
      };
    } else if (runtime === "pure") {
      return {
        exit: fs.createWriteStream(`${safeDest}/exit.log`),
      };
    } else if (runtime === "pitono") {
      return {
        stdout: fs.createWriteStream(`${safeDest}/stdout.log`),
        stderr: fs.createWriteStream(`${safeDest}/stderr.log`),
        exit: fs.createWriteStream(`${safeDest}/exit.log`),
      };
    } else {
      throw `unknown runtime: ${runtime}`;
    }
  } catch (e) {
    console.error(`Failed to create log streams in ${safeDest}:`, e);
    throw e;
  }
}

function createLogStreams(reportDest: string, runtime: IRunTime): LogStreams {
  // Create directory if it doesn't exist
  if (!fs.existsSync(reportDest)) {
    fs.mkdirSync(reportDest, { recursive: true });
  }

  const streams = runtimeLogs(runtime, reportDest);

  // const streams = {
  //   exit: fs.createWriteStream(`${reportDest}/exit.log`),
  const safeDest = reportDest || `testeranto/reports/default_${Date.now()}`;

  try {
    if (!fs.existsSync(safeDest)) {
      fs.mkdirSync(safeDest, { recursive: true });
    }

    const streams = runtimeLogs(runtime, safeDest);
    // const streams = {
    //   exit: fs.createWriteStream(`${safeDest}/exit.log`),
    //   ...(runtime === "node" || runtime === "pure"
    //     ? {
    //         stdout: fs.createWriteStream(`${safeDest}/stdout.log`),
    //         stderr: fs.createWriteStream(`${safeDest}/stderr.log`),
    //       }
    //     : {
    //         info: fs.createWriteStream(`${safeDest}/info.log`),
    //         warn: fs.createWriteStream(`${safeDest}/warn.log`),
    //         error: fs.createWriteStream(`${safeDest}/error.log`),
    //         debug: fs.createWriteStream(`${safeDest}/debug.log`),
    //       }),
    // };

    return {
      ...streams,
      closeAll: () => {
        Object.values(streams).forEach(
          (stream) => !stream.closed && stream.close()
        );
      },
      writeExitCode: (code: number, error?: Error) => {
        if (error) {
          streams.exit.write(`Error: ${error.message}\n`);
          if (error.stack) {
            streams.exit.write(`Stack Trace:\n${error.stack}\n`);
          }
        }
        streams.exit.write(`${code}\n`);
      },
      exit: streams.exit,
    };
  } catch (e) {
    console.error(`Failed to create log streams in ${safeDest}:`, e);
    throw e;
  }
}

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

const statusMessagePretty = (
  failures: number,
  test: string,
  runtime: IRunTime
) => {
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

async function writeFileAndCreateDir(filePath, data) {
  const dirPath = path.dirname(filePath);

  try {
    await fs.promises.mkdir(dirPath, { recursive: true });
    await fs.writeFileSync(filePath, data);
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
async function pollForFile(path, timeout = 2000) {
  const intervalObj = setInterval(function () {
    const file = path;
    const fileExists = fs.existsSync(file);
    if (fileExists) {
      clearInterval(intervalObj);
    }
  }, timeout);
}

export class PM_Main extends PM_WithWebSocket {
  ports: Record<number, string>;
  queue: string[];
  logStreams: Record<string, ReturnType<typeof createLogStreams>> = {};
  webMetafileWatcher: fs.FSWatcher;
  nodeMetafileWatcher: fs.FSWatcher;
  importMetafileWatcher: fs.FSWatcher;
  pitonoMetafileWatcher: fs.FSWatcher;
  pureSidecars: Record<number, Sidecar>;
  nodeSidecars: Record<number, ChildProcess>;
  webSidecars: Record<number, Page>;
  sidecars: Record<number, any> = {};
  launchers: Record<string, () => void>;

  wss: WebSocketServer;
  clients: Set<any> = new Set();
  httpServer: http.Server;
  runningProcesses: Map<string, ChildProcess> = new Map();
  allProcesses: Map<
    string,
    {
      child?: ChildProcess;
      status: "running" | "exited" | "error";
      exitCode?: number;
      error?: string;
      command: string;
      pid?: number;
      timestamp: string;
    }
  > = new Map();
  processLogs: Map<string, string[]> = new Map();

  constructor(configs: IBuiltConfig, name: string, mode: "once" | "dev") {
    super(configs, name, mode);

    this.launchers = {};
    this.ports = {};
    this.queue = [];

    this.nodeSidecars = {};
    this.webSidecars = {};
    this.pureSidecars = {};

    this.configs.ports.forEach((element) => {
      this.ports[element] = ""; // set ports as open
    });
  }

  async stopSideCar(uid: number): Promise<any> {
    console.log(ansiC.green(ansiC.inverse(`stopSideCar ${uid}`)));

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

  async launchSideCar(
    n: number,
    name: string
  ): Promise<[number, ITTestResourceConfiguration]> {
    const c = this.configs.tests.find(([v, r]) => {
      return v === name;
    }) as ITestTypes;

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

  mapping(): [string, (...a) => any][] {
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
      ["writeFileSync", this.writeFileSync],
    ];
  }

  async start() {
    // set up the "pure" listeners
    this.mapping().forEach(async ([command, func]) => {
      globalThis[command] = func;
    });

    if (!fs.existsSync(`testeranto/reports/${this.name}`)) {
      fs.mkdirSync(`testeranto/reports/${this.name}`);
    }

    const executablePath = "/opt/homebrew/bin/chromium";

    try {
      this.browser = await puppeteer.launch({
        slowMo: 1,
        waitForInitialPage: false,
        executablePath,
        headless: true,
        defaultViewport: null, // Disable default 800x600 viewport
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
          `--remote-debugging-port=3234`,
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
      });
    } catch (e) {
      console.error(e);
      console.error(
        "could not start chrome via puppeter. Check this path: ",
        executablePath
      );
    }

    const {
      nodeEntryPoints,
      webEntryPoints,
      pureEntryPoints,
      pitonoEntryPoints,
    } = this.getRunnables(this.configs.tests, this.name);

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
        pureEntryPoints,
        this.launchPure,
        "pure",
        (w) => {
          this.importMetafileWatcher = w;
        },
      ],
      [
        pitonoEntryPoints,
        this.launchPitono,
        "pitono",
        (w) => {
          this.pitonoMetafileWatcher = w;
        },
      ],
    ].forEach(
      async ([eps, launcher, runtime, watcher]: [
        Record<string, string>,
        (src: string, dest: string) => Promise<void>,
        IRunTime,
        (f: fs.FSWatcher) => void
      ]) => {
        let metafile: string;
        if (runtime === "pitono") {
          metafile = `./testeranto/metafiles/python/core.json`;
          // Ensure the directory exists before trying to watch
          const metafileDir = path.dirname(metafile);
          if (!fs.existsSync(metafileDir)) {
            fs.mkdirSync(metafileDir, { recursive: true });
          }
        } else {
          metafile = `./testeranto/metafiles/${runtime}/${this.name}.json`;
        }

        // Only poll for file if it's not a pitono runtime
        if (runtime !== "pitono") {
          await pollForFile(metafile);
        }

        Object.entries(eps).forEach(
          async ([inputFile, outputFile]: [string, string]) => {
            // await pollForFile(outputFile);\

            this.launchers[inputFile] = () => launcher(inputFile, outputFile);
            this.launchers[inputFile]();

            try {
              watch(outputFile, async (e, filename) => {
                const hash = await fileHash(outputFile);
                if (fileHashes[inputFile] !== hash) {
                  fileHashes[inputFile] = hash;
                  console.log(
                    ansiC.yellow(ansiC.inverse(`< ${e} ${filename}`))
                  );
                  // launcher(inputFile, outputFile);
                  this.launchers[inputFile]();
                }
              });
            } catch (e) {
              console.error(e);
            }
          }
        );

        this.metafileOutputs(runtime);

        // For pitono, we need to wait for the file to be created
        if (runtime === "pitono") {
          // Use polling to wait for the file to exist
          const checkFileExists = () => {
            if (fs.existsSync(metafile)) {
              console.log(
                ansiC.green(ansiC.inverse(`Pitono metafile found: ${metafile}`))
              );
              // Set up the watcher once the file exists
              watcher(
                watch(metafile, async (e, filename) => {
                  console.log(
                    ansiC.yellow(
                      ansiC.inverse(`< ${e} ${filename} (${runtime})`)
                    )
                  );
                  this.metafileOutputs(runtime);
                })
              );
              // Read the metafile immediately
              this.metafileOutputs(runtime);
            } else {
              // Check again after a delay
              setTimeout(checkFileExists, 1000);
            }
          };
          // Start checking for the file
          checkFileExists();
        } else {
          // For other runtimes, only set up watcher if the file exists
          if (fs.existsSync(metafile)) {
            watcher(
              watch(metafile, async (e, filename) => {
                console.log(
                  ansiC.yellow(ansiC.inverse(`< ${e} ${filename} (${runtime})`))
                );
                this.metafileOutputs(runtime);
              })
            );
          }
        }
      }
    );

    // Object.keys(this.configs.externalTests).forEach((et) => {
    //   this.launchExternalTest(et, this.configs.externalTests[et]);
    // });
  }

  async stop() {
    console.log(ansiC.inverse("Testeranto-Run is shutting down gracefully..."));
    this.mode = "once";
    this.nodeMetafileWatcher.close();
    this.webMetafileWatcher.close();
    this.importMetafileWatcher.close();
    if (this.pitonoMetafileWatcher) {
      this.pitonoMetafileWatcher.close();
    }

    // Close any remaining log streams
    Object.values(this.logStreams || {}).forEach((logs) => logs.closeAll());

    // Close WebSocket server
    this.wss.close(() => {
      console.log("WebSocket server closed");
    });

    // Close all client connections
    this.clients.forEach((client) => {
      client.terminate();
    });
    this.clients.clear();

    // Close HTTP server
    this.httpServer.close(() => {
      console.log("HTTP server closed");
    });

    this.checkForShutdown();
  }

  getRunnables = (
    tests: ITestTypes[],
    testName: string,
    payload = {
      nodeEntryPoints: {},
      nodeEntryPointSidecars: {},
      webEntryPoints: {},
      webEntryPointSidecars: {},
      pureEntryPoints: {},
      pureEntryPointSidecars: {},
    }
  ): IRunnables => {
    return getRunnables(tests, testName, payload);
  };

  async metafileOutputs(platform: IRunTime) {
    let metafilePath: string;
    if (platform === "pitono") {
      metafilePath = `./testeranto/metafiles/python/core.json`;
    } else {
      metafilePath = `./testeranto/metafiles/${platform}/${this.name}.json`;
    }

    // Check if the file exists
    if (!fs.existsSync(metafilePath)) {
      if (platform === "pitono") {
        console.log(
          ansiC.yellow(
            ansiC.inverse(`Pitono metafile not found yet: ${metafilePath}`)
          )
        );
      }
      return;
    }

    let metafile;
    try {
      const fileContent = fs.readFileSync(metafilePath).toString();
      const parsedData = JSON.parse(fileContent);
      // Handle different metafile structures
      if (platform === "pitono") {
        // Pitono metafile might be the entire content or have a different structure
        metafile = parsedData.metafile || parsedData;
      } else {
        metafile = parsedData.metafile;
      }
      if (!metafile) {
        console.log(
          ansiC.yellow(ansiC.inverse(`No metafile found in ${metafilePath}`))
        );
        return;
      }
    } catch (error) {
      console.error(`Error reading metafile at ${metafilePath}:`, error);
      return;
    }

    const outputs: IOutputs = metafile.outputs;

    Object.keys(outputs).forEach(async (k) => {
      const pattern = `testeranto/bundles/${platform}/${this.name}/${this.configs.src}`;
      if (!k.startsWith(pattern)) {
        return false;
      }

      const addableFiles = Object.keys(outputs[k].inputs).filter((i) => {
        if (!fs.existsSync(i)) return false;
        if (i.startsWith("node_modules")) return false;
        if (i.startsWith("./node_modules")) return false;

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
            entrypoint: entrypoint,
          });
          this.eslintCheck(entrypoint, platform, addableFiles);
          this.makePrompt(entrypoint, addableFiles, platform);
        }
      }
    });
  }

  launchPure = async (src: string, dest: string) => {
    console.log(ansiC.green(ansiC.inverse(`pure < ${src}`)));
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

    const portsToUse: string[] = [];
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
        ([portnumber, status]) => status === ""
      );

      if (openPorts.length >= testConfigResource.ports) {
        for (let i = 0; i < testConfigResource.ports; i++) {
          portsToUse.push(openPorts[i][0]);

          this.ports[openPorts[i][0]] = src; // port is now claimed
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
        return [Math.random(), argz];
      }
    } else {
      console.error("negative port makes no sense", src);
      process.exit(-1);
    }

    const builtfile = dest;

    // const webSideCares: Page[] = [];

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

    const logs = createLogStreams(reportDest, "pure");

    try {
      await import(`${builtfile}?cacheBust=${Date.now()}`).then((module) => {
        // Override console methods to redirect logs
        // Only override stdout/stderr methods for pure runtime
        const originalConsole = { ...console };

        // console.log = (...args) => {
        //   logs.stdout.write(args.join(" ") + "\n");
        //   originalConsole.log(...args);
        // };

        // console.error = (...args) => {
        //   logs.stderr.write(args.join(" ") + "\n");
        //   originalConsole.error(...args);
        // };

        return module.default
          .then((defaultModule) => {
            defaultModule
              .receiveTestResourceConfig(argz)
              .then(async (results: IFinalResults) => {
                // this.receiveFeatures(results.features, destFolder, src, "pure");
                // this.receiveFeaturesV2(reportDest, src, "pure");

                statusMessagePretty(results.fails, src, "pure");
                this.bddTestIsNowDone(src, results.fails);
              })
              .catch((e1) => {
                console.log(
                  ansiC.red(`launchPure - ${src} errored with: ${e1.stack}`)
                );
                this.bddTestIsNowDone(src, -1);
                statusMessagePretty(-1, src, "pure");
              });
            // .finally(() => {
            //   // webSideCares.forEach((webSideCar) => webSideCar.close());
            // });
          })
          .catch((e2) => {
            console.log(
              ansiColors.red(
                `pure ! ${src} failed to execute. No "tests.json" file was generated. Check the logs for more info`
              )
            );

            logs.exit.write(e2.stack);
            logs.exit.write(-1);
            this.bddTestIsNowDone(src, -1);
            statusMessagePretty(-1, src, "pure");
            // console.error(e);
          })
          .finally((x) => {
            // const fileSet = files[src] || new Set();
            // fs.writeFileSync(
            //   reportDest + "/manifest.json",
            //   JSON.stringify(Array.from(fileSet))
            // );
          });
      });
    } catch (e3) {
      logs.writeExitCode(-1, e3);
      console.log(
        ansiC.red(
          ansiC.inverse(
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
        this.ports[portsToUse[i]] = ""; //port is open again
      }
    }
  };

  launchNode = async (src: string, dest: string) => {
    console.log(ansiC.green(ansiC.inverse(`node < ${src}`)));
    this.bddTestIsRunning(src);

    const reportDest = `testeranto/reports/${this.name}/${src
      .split(".")
      .slice(0, -1)
      .join(".")}/node`;
    if (!fs.existsSync(reportDest)) {
      fs.mkdirSync(reportDest, { recursive: true });
    }

    // const destFolder = dest.replace(".mjs", "");

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

    const portsToUse: string[] = [];
    if (testConfigResource.ports === 0) {
      const t: ITTestResourceConfiguration = {
        name: src,
        // ports: portsToUse.map((v) => Number(v)),
        ports: [],
        fs: reportDest,
        browserWSEndpoint: this.browser.wsEndpoint(),
      };

      testResources = JSON.stringify(t);
    } else if (testConfigResource.ports > 0) {
      const openPorts: [string, string][] = Object.entries(this.ports).filter(
        ([portnumber, portopen]) => portopen === ""
      );

      if (openPorts.length >= testConfigResource.ports) {
        for (let i = 0; i < testConfigResource.ports; i++) {
          portsToUse.push(openPorts[i][0]); // Convert string port to number

          this.ports[openPorts[i][0]] = src; // port is now claimed
        }

        testResources = JSON.stringify({
          scheduled: true,
          name: src,
          ports: portsToUse,
          fs: reportDest,
          browserWSEndpoint: this.browser.wsEndpoint(),
        });
      } else {
        console.log(
          ansiC.red(
            `node: cannot run ${src} because there are no open ports ATM. This job will be enqueued and run again run a port is available`
          )
        );
        this.queue.push(src);
        return [Math.random(), argz]; // Add this return
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
        ipcfile,
      ],
      {
        stdio: ["pipe", "pipe", "pipe", "ipc"],
      }
    );

    let buffer: Buffer<ArrayBufferLike> = new Buffer("");

    const server = net.createServer((socket) => {
      const queue = new Queue<string[]>();

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
            // b++;
          }
        }

        while (queue.size() > 0) {
          const message = queue.dequeue();

          if (message) {
            // set up the "node" listeners
            this.mapping().forEach(async ([command, func]) => {
              if (message[0] === command) {
                const x = message.slice(1, -1);
                const r = await this[command](...x);

                if (!haltReturns) {
                  child.send(
                    JSON.stringify({
                      payload: r,
                      key: message[message.length - 1],
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
      // Only handle stdout/stderr for node runtime
      child.stdout?.on("data", (data) => {
        logs.stdout?.write(data); // Add null check
      });

      child.stderr?.on("data", (data) => {
        logs.stderr?.write(data); // Add null check
      });
      child.on("error", (err) => {});
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

        if (!files[src]) {
          files[src] = new Set();
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
            this.ports[portsToUse[i]] = ""; //port is open again
          }
        }
      });
      child.on("error", (e) => {
        console.log("error");

        haltReturns = true;

        console.log(
          ansiC.red(
            ansiC.inverse(
              `${src} errored with: ${e.name}. Check error logs for more info`
            )
          )
        );
        this.bddTestIsNowDone(src, -1);
        statusMessagePretty(-1, src, "node");
      });
    });
  };

  launchWeb = async (src: string, dest: string) => {
    console.log(ansiC.green(ansiC.inverse(`web < ${src}`)));
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
      name: src,
      ports: [].toString(),
      fs: reportDest,
      browserWSEndpoint: this.browser.wsEndpoint(),
    });

    const d = `${dest}?cacheBust=${Date.now()}`;

    const logs = createLogStreams(reportDest, "web");

    this.browser
      .newPage()
      .then((page) => {
        page.on("console", (log: ConsoleMessage) => {
          const msg = `${log.text()}\n`;

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
          logs.writeExitCode(0); // Web tests exit with 0 unless there's an error
          logs.closeAll();
          logs.closeAll();
        });
        this.mapping().forEach(async ([command, func]) => {
          if (command === "page") {
            page.exposeFunction(command, (x?) => {
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
      })
      .then(async (page) => {
        const close = () => {
          if (!files[src]) {
            files[src] = new Set();
          }
          // files[t].add(filepath);

          // fs.writeFileSync(
          //   destFolder + "/manifest.json",
          //   JSON.stringify(Array.from(files[src]))
          // );
          delete files[src];

          Promise.all(screenshots[src] || []).then(() => {
            delete screenshots[src];
            page.close();
          });

          return;
        };

        page.on("pageerror", (err: Error) => {
          logs.writeExitCode(-1, err);
          console.log(
            ansiColors.red(
              `web ! ${src} failed to execute No "tests.json" file was generated. Check ${reportDest}/error.log for more info`
            )
          );
          this.bddTestIsNowDone(src, -1);
          close();
        });

        // page.on("console", (log: ConsoleMessage) => {});

        await page.goto(`file://${`${destFolder}.html`}`, {});

        await page
          .evaluate(
            `
import('${d}').then(async (x) => {
  try {
    return await (await x.default).receiveTestResourceConfig(${webArgz})
  } catch (e) {
    console.log("web run failure", e.toString())
  }
})
`
          )
          .then(async ({ fails, failed, features }: IFinalResults) => {
            statusMessagePretty(fails, src, "web");
            this.bddTestIsNowDone(src, fails);
            // close();
          })
          .catch((e) => {
            console.log(ansiC.red(ansiC.inverse(e.stack)));

            console.log(
              ansiC.red(
                ansiC.inverse(
                  `web ! ${src} failed to execute. No "tests.json" file was generated. Check logs for more info`
                )
              )
            );
            this.bddTestIsNowDone(src, -1);
          })
          .finally(() => {
            // process.exit(-1);
            close();
          });

        return page;
      });
  };

  launchPitono = async (src: string, dest: string) => {
    console.log(ansiC.green(ansiC.inverse(`pitono < ${src}`)));
    this.bddTestIsRunning(src);

    const reportDest = `testeranto/reports/${this.name}/${src
      .split(".")
      .slice(0, -1)
      .join(".")}/pitono`;
    if (!fs.existsSync(reportDest)) {
      fs.mkdirSync(reportDest, { recursive: true });
    }

    const logs = createLogStreams(reportDest, "node"); // Use node-style logs for pitono

    try {
      // Execute the Python test using the pitono runner
      const { PitonoRunner } = await import("./pitonoRunner");
      const runner = new PitonoRunner(this.configs, this.name);
      await runner.run();

      this.bddTestIsNowDone(src, 0);
      statusMessagePretty(0, src, "pitono");
    } catch (error) {
      logs.writeExitCode(-1, error);
      console.log(
        ansiC.red(
          ansiC.inverse(
            `${src} errored with: ${error}. Check logs for more info`
          )
        )
      );
      this.bddTestIsNowDone(src, -1);
      statusMessagePretty(-1, src, "pitono");
    }
  };

  launchGolingvu = async (src: string, dest: string) => {
    throw "not yet implemented";
  };

  receiveFeaturesV2 = (
    reportDest: string,
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

    // Read and parse the test report
    const testReportPath = `${reportDest}/tests.json`;
    if (!fs.existsSync(testReportPath)) {
      console.error(`tests.json not found at: ${testReportPath}`);
      return;
    }

    const testReport = JSON.parse(fs.readFileSync(testReportPath, "utf8"));

    // Add full path information to each test
    if (testReport.tests) {
      testReport.tests.forEach((test) => {
        // Add the full path to each test
        test.fullPath = path.resolve(process.cwd(), srcTest);
      });
    }

    // Add full path to the report itself
    testReport.fullPath = path.resolve(process.cwd(), srcTest);

    // Write the modified report back
    fs.writeFileSync(testReportPath, JSON.stringify(testReport, null, 2));

    testReport.features
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

            // await fs.promises.mkdir(path.dirname(newPath), { recursive: true });

            // try {
            //   await fs.unlinkSync(newPath);
            //   // console.log(`Removed existing link at ${newPath}`);
            // } catch (error) {
            //   if (error.code !== "ENOENT") {
            //     // throw error;
            //   }
            // }

            // fs.symlink(u.pathname, newPath, (err) => {
            //   if (err) {
            //     // console.error("Error creating symlink:", err);
            //   } else {
            //     // console.log("Symlink created successfully");
            //   }
            // });
            accum.files.push(u.pathname);
          } else if (u.protocol === "http:" || u.protocol === "https:") {
            const newPath = `${process.cwd()}/testeranto/features/external/${
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
        // Markdown files must be referenced in the prompt but string style features are already present in the tests.json file

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

    // const f: Record<string, string> = {};

    testReport.givens.forEach((g) => {
      if (g.failed === true) {
        this.summary[srcTest].failingFeatures[g.key] = g.features;
      }
    });

    // this.summary[srcTest].failingFeatures = f;
    this.writeBigBoard();
  };

  requestHandler(req: http.IncomingMessage, res: http.ServerResponse) {
    // Parse the URL
    const parsedUrl = url.parse(req.url || "/");
    let pathname = parsedUrl.pathname || "/";

    // Handle root path
    if (pathname === "/") {
      pathname = "/index.html";
    }

    // Remove leading slash
    let filePath = pathname.substring(1);

    // Determine which directory to serve from
    if (filePath.startsWith("reports/")) {
      // Serve from reports directory
      filePath = `testeranto/${filePath}`;
    } else if (filePath.startsWith("metafiles/")) {
      // Serve from metafiles directory
      filePath = `testeranto/${filePath}`;
    } else if (filePath === "projects.json") {
      // Serve projects.json
      filePath = `testeranto/${filePath}`;
    } else {
      // For frontend assets, try multiple possible locations
      // First, try the dist directory
      const possiblePaths = [
        `dist/${filePath}`,
        `testeranto/dist/${filePath}`,
        `../dist/${filePath}`,
        `./${filePath}`,
      ];

      // Find the first existing file
      let foundPath = null;
      for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
          foundPath = possiblePath;
          break;
        }
      }

      if (foundPath) {
        filePath = foundPath;
      } else {
        // If no file found, serve index.html for SPA routing
        const indexPath = this.findIndexHtml();
        if (indexPath) {
          fs.readFile(indexPath, (err, data) => {
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

    // Check if file exists
    fs.exists(filePath, (exists) => {
      if (!exists) {
        // For SPA routing, serve index.html if the path looks like a route
        if (!pathname.includes(".") && pathname !== "/") {
          const indexPath = this.findIndexHtml();
          if (indexPath) {
            fs.readFile(indexPath, (err, data) => {
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
            // Serve a simple message if index.html is not found
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

      // Read and serve the file
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("500 Internal Server Error");
          return;
        }

        // Get MIME type
        const mimeType = mime.lookup(filePath) || "application/octet-stream";
        res.writeHead(200, { "Content-Type": mimeType });
        res.end(data);
      });
    });
  }

  findIndexHtml(): string | null {
    const possiblePaths = [
      "dist/index.html",
      "testeranto/dist/index.html",
      "../dist/index.html",
      "./index.html",
    ];

    for (const path of possiblePaths) {
      if (fs.existsSync(path)) {
        return path;
      }
    }
    return null;
  }

  broadcast(message: any) {
    const data =
      typeof message === "string" ? message : JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === 1) {
        // WebSocket.OPEN
        client.send(data);
      }
    });
  }

  checkQueue() {
    const x = this.queue.pop();
    if (!x) {
      ansiC.inverse(`The following queue is empty`);
      return;
    }
    const test = this.configs.tests.find((t) => t[0] === x);
    if (!test) throw `test is undefined ${x}`;

    // const [src, runtime, ...xx]: [string, IRunTime, ...any] = test;
    this.launchers[test[0]]();
  }

  checkForShutdown = () => {
    // console.log(ansiC.inverse(JSON.stringify(this.summary, null, 2)));

    this.checkQueue();

    console.log(
      ansiC.inverse(
        `The following jobs are awaiting resources: ${JSON.stringify(
          this.queue
        )}`
      )
    );
    console.log(
      ansiC.inverse(`The status of ports: ${JSON.stringify(this.ports)}`)
    );

    this.writeBigBoard();

    if (this.mode === "dev") return;

    let inflight = false;

    Object.keys(this.summary).forEach((k) => {
      if (this.summary[k].prompt === "?") {
        console.log(ansiC.blue(ansiC.inverse(`🕕 prompt ${k}`)));
        inflight = true;
      }
    });

    Object.keys(this.summary).forEach((k) => {
      if (this.summary[k].runTimeErrors === "?") {
        console.log(ansiC.blue(ansiC.inverse(`🕕 runTimeError ${k}`)));
        inflight = true;
      }
    });

    Object.keys(this.summary).forEach((k) => {
      if (this.summary[k].staticErrors === "?") {
        console.log(ansiC.blue(ansiC.inverse(`🕕 staticErrors ${k}`)));
        inflight = true;
      }
    });

    Object.keys(this.summary).forEach((k) => {
      if (this.summary[k].typeErrors === "?") {
        console.log(ansiC.blue(ansiC.inverse(`🕕 typeErrors ${k}`)));
        inflight = true;
      }
    });

    this.writeBigBoard();

    if (!inflight) {
      if (this.browser) {
        if (this.browser) {
          this.browser.disconnect().then(() => {
            console.log(
              ansiC.inverse(`${this.name} has been tested. Goodbye.`)
            );
            process.exit();
          });
        }
      }
    }
  };
}
