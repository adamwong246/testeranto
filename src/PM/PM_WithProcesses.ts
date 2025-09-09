/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import fs, { watch } from "fs";
import path from "path";
import puppeteer, { executablePath } from "puppeteer-core";
import ansiC from "ansi-colors";

import { getRunnables } from "../utils";
import { IBuiltConfig, IRunTime } from "../Types.js";

import {
  fileHash,
  createLogStreams,
  isValidUrl,
  pollForFile,
  writeFileAndCreateDir,
  puppeteerConfigs,
  filesHash,
  IOutputs,
} from "./utils.js";

import { PM_WithGit } from "./PM_WithGit.js";

const fileHashes = {};
const changes: Record<string, string> = {};

export abstract class PM_WithProcesses extends PM_WithGit {
  webMetafileWatcher: fs.FSWatcher;
  nodeMetafileWatcher: fs.FSWatcher;
  importMetafileWatcher: fs.FSWatcher;
  pitonoMetafileWatcher: fs.FSWatcher;
  golangMetafileWatcher: fs.FSWatcher;

  ports: Record<number, string>;
  queue: string[];
  logStreams: Record<string, ReturnType<typeof createLogStreams>> = {};
  launchers: Record<string, () => void>;

  abstract launchNode(src: string, dest: string);
  abstract launchWeb(src: string, dest: string);
  abstract launchPure(src: string, dest: string);
  abstract launchPython(src: string, dest: string);
  abstract launchGolang(src: string, dest: string);

  constructor(configs: IBuiltConfig, name: string, mode: "once" | "dev") {
    super(configs, name, mode);

    this.launchers = {};
    this.ports = {};
    this.queue = [];

    this.configs.ports.forEach((element) => {
      this.ports[element] = ""; // set ports as open
    });
  }

  bddTestIsRunning(src: string) {
    this.summary[src] = {
      prompt: "?",
      runTimeErrors: "?",
      staticErrors: "?",
      typeErrors: "?",
      failingFeatures: {},
    };
  }

  async metafileOutputs(platform: IRunTime) {
    console.log("mark3", platform);

    let metafilePath: string;
    if (platform === "python") {
      metafilePath = `./testeranto/metafiles/python/core.json`;
    } else {
      metafilePath = `./testeranto/metafiles/${platform}/${this.name}.json`;
    }

    let metafile;
    try {
      const fileContent = fs.readFileSync(metafilePath).toString();
      const parsedData = JSON.parse(fileContent);
      // Handle different metafile structures
      if (platform === "python") {
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

    const outputs: IOutputs | undefined = metafile.outputs;

    // Check if outputs exists and is an object
    // if (!outputs || typeof outputs !== "object") {
    //   console.log(
    //     ansiC.yellow(
    //       ansiC.inverse(`No outputs found in metafile at ${metafilePath}`)
    //     )
    //   );
    //   return;
    // }

    console.log("mark335", platform);

    Object.keys(outputs).forEach(async (k) => {
      const pattern = `testeranto/bundles/${platform}/${this.name}/${this.configs.src}`;
      if (!k.startsWith(pattern)) {
        return;
      }

      const output = outputs[k];
      // Check if the output entry exists and has inputs
      if (!output || !output.inputs) {
        return;
      }

      const addableFiles = Object.keys(output.inputs).filter((i) => {
        if (!fs.existsSync(i)) return false;
        if (i.startsWith("node_modules")) return false;
        if (i.startsWith("./node_modules")) return false;

        return true;
      });

      const f = `${k.split(".").slice(0, -1).join(".")}/`;

      if (!fs.existsSync(f)) {
        fs.mkdirSync(f, { recursive: true });
      }

      const entrypoint = output.entryPoint;

      console.log("mark334", platform, entrypoint);

      if (entrypoint) {
        const changeDigest = await filesHash(addableFiles);

        if (changeDigest === changes[entrypoint]) {
          // skip
        } else {
          changes[entrypoint] = changeDigest;

          console.log("mark333", platform);

          // Run appropriate static analysis based on platform
          if (
            platform === "node" ||
            platform === "web" ||
            platform === "pure"
          ) {
            this.tscCheck({
              platform,
              addableFiles,
              entrypoint: entrypoint,
            });
            this.eslintCheck(entrypoint, platform, addableFiles);
          } else if (platform === "python") {
            this.pythonLintCheck(entrypoint, addableFiles);
            this.pythonTypeCheck(entrypoint, addableFiles);
          }

          this.makePrompt(entrypoint, addableFiles, "golang");
        }
      }
    });
  }

  async pythonLintCheck(entrypoint: string, addableFiles: string[]) {
    const reportDest = `testeranto/reports/${this.name}/${entrypoint
      .split(".")
      .slice(0, -1)
      .join(".")}/python`;

    if (!fs.existsSync(reportDest)) {
      fs.mkdirSync(reportDest, { recursive: true });
    }

    const lintErrorsPath = `${reportDest}/lint_errors.txt`;

    try {
      // Use flake8 for Python linting
      const { spawn } = await import("child_process");
      const child = spawn("flake8", [entrypoint, "--max-line-length=88"], {
        stdio: ["pipe", "pipe", "pipe"],
      });

      let stderr = "";
      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      let stdout = "";
      child.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      return new Promise<void>((resolve) => {
        child.on("close", (code) => {
          const output = stdout + stderr;
          if (output.trim()) {
            fs.writeFileSync(lintErrorsPath, output);
            this.summary[entrypoint].staticErrors = output.split("\n").length;
          } else {
            if (fs.existsSync(lintErrorsPath)) {
              fs.unlinkSync(lintErrorsPath);
            }
            this.summary[entrypoint].staticErrors = 0;
          }
          resolve();
        });
      });
    } catch (error) {
      console.error(`Error running flake8 on ${entrypoint}:`, error);
      fs.writeFileSync(
        lintErrorsPath,
        `Error running flake8: ${error.message}`
      );
      this.summary[entrypoint].staticErrors = -1;
    }
  }

  async pythonTypeCheck(entrypoint: string, addableFiles: string[]) {
    const reportDest = `testeranto/reports/${this.name}/${entrypoint
      .split(".")
      .slice(0, -1)
      .join(".")}/python`;

    if (!fs.existsSync(reportDest)) {
      fs.mkdirSync(reportDest, { recursive: true });
    }

    const typeErrorsPath = `${reportDest}/type_errors.txt`;

    try {
      // Use mypy for Python type checking
      const { spawn } = await import("child_process");
      const child = spawn("mypy", [entrypoint], {
        stdio: ["pipe", "pipe", "pipe"],
      });

      let stderr = "";
      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      let stdout = "";
      child.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      return new Promise<void>((resolve) => {
        child.on("close", (code) => {
          const output = stdout + stderr;
          if (output.trim()) {
            fs.writeFileSync(typeErrorsPath, output);
            this.summary[entrypoint].typeErrors = output.split("\n").length;
          } else {
            if (fs.existsSync(typeErrorsPath)) {
              fs.unlinkSync(typeErrorsPath);
            }
            this.summary[entrypoint].typeErrors = 0;
          }
          resolve();
        });
      });
    } catch (error) {
      console.error(`Error running mypy on ${entrypoint}:`, error);
      fs.writeFileSync(typeErrorsPath, `Error running mypy: ${error.message}`);
      this.summary[entrypoint].typeErrors = -1;
    }
  }

  async start() {
    // Wait for build processes to complete first
    try {
      await this.startBuildProcesses();
      this.onBuildDone();
    } catch (error) {
      console.error("Build processes failed:", error);
      return;
    }

    // Continue with the rest of the setup after builds are done
    this.mapping().forEach(async ([command, func]) => {
      globalThis[command] = func;
    });

    if (!fs.existsSync(`testeranto/reports/${this.name}`)) {
      fs.mkdirSync(`testeranto/reports/${this.name}`);
    }

    try {
      this.browser = await puppeteer.launch(puppeteerConfigs);
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
      pythonEntryPoints,
      golangEntryPoints,
    } = getRunnables(this.configs.tests, this.name);

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
        pythonEntryPoints,
        this.launchPython,
        "python",
        (w) => {
          this.pitonoMetafileWatcher = w;
        },
      ],
      [
        golangEntryPoints,
        this.launchGolang,
        "golang",
        (w) => {
          this.golangMetafileWatcher = w;
        },
      ],
    ].forEach(
      async ([eps, launcher, runtime, watcher]: [
        Record<string, string>,
        (src: string, dest: string) => Promise<void>,
        IRunTime,
        (f: fs.FSWatcher) => void
      ]) => {
        // let metafile: string;

        // if (runtime === "python") {
        //   metafile = `./testeranto/metafiles/python/core.json`;

        //   const metafileDir = path.dirname(metafile);
        //   if (!fs.existsSync(metafileDir)) {
        //     fs.mkdirSync(metafileDir, { recursive: true });
        //   }
        // } else {
        //   metafile = `./testeranto/metafiles/${runtime}/${this.name}.json`;
        // }
        const metafile = `./testeranto/metafiles/${runtime}/${this.name}.json`;
        await pollForFile(metafile);

        console.log("metafile", metafile);

        // Only poll for file if it's not a pitono runtime
        // if (runtime !== "python") {
        //   await pollForFile(metafile);
        // }

        // Object.entries(eps).forEach(
        //   async ([inputFile, outputFile]: [string, string]) => {
        //     this.launchers[inputFile] = () => launcher(inputFile, outputFile);
        //     this.launchers[inputFile]();

        //     try {
        //       // Check if the file exists before watching
        //       if (fs.existsSync(outputFile)) {
        //         watch(outputFile, async (e, filename) => {
        //           const hash = await fileHash(outputFile);
        //           if (fileHashes[inputFile] !== hash) {
        //             fileHashes[inputFile] = hash;
        //             console.log(
        //               ansiC.yellow(ansiC.inverse(`< ${e} ${filename}`))
        //             );
        //             this.launchers[inputFile]();
        //           }
        //         });
        //       } else {
        //         console.log(
        //           ansiC.yellow(
        //             ansiC.inverse(
        //               `File not found, skipping watch: ${outputFile}`
        //             )
        //           )
        //         );
        //       }
        //     } catch (e) {
        //       console.error(e);
        //     }
        //   }
        // );

        // this.metafileOutputs(runtime);

        // // For pitono, we need to wait for the file to be created
        // if (runtime === "python") {
        //   // Use polling to wait for the file to exist
        //   const checkFileExists = () => {
        //     if (fs.existsSync(metafile)) {
        //       console.log(
        //         ansiC.green(ansiC.inverse(`Pitono metafile found: ${metafile}`))
        //       );
        //       // Set up the watcher once the file exists
        //       watcher(
        //         watch(metafile, async (e, filename) => {
        //           console.log(
        //             ansiC.yellow(
        //               ansiC.inverse(`< ${e} ${filename} (${runtime})`)
        //             )
        //           );
        //           this.metafileOutputs(runtime);
        //         })
        //       );
        //       // Read the metafile immediately
        //       this.metafileOutputs(runtime);
        //     } else {
        //       // Check again after a delay
        //       setTimeout(checkFileExists, 1000);
        //     }
        //   };
        //   // Start checking for the file
        //   checkFileExists();
        // } else {
        //   // For other runtimes, only set up watcher if the file exists
        //   if (fs.existsSync(metafile)) {
        //     watcher(
        //       watch(metafile, async (e, filename) => {
        //         console.log(
        //           ansiC.yellow(ansiC.inverse(`< ${e} ${filename} (${runtime})`))
        //         );
        //         this.metafileOutputs(runtime);
        //       })
        //     );
        //   }
        // }
      }
    );
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

    testReport.givens.forEach((g) => {
      if (g.failed === true) {
        this.summary[srcTest].failingFeatures[g.key] = g.features;
      }
    });

    this.writeBigBoard();
  };

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

  addToQueue(src: string, runtime: IRunTime) {
    // Add the test to the queue
    this.queue.push(src);
    console.log(
      ansiC.green(
        ansiC.inverse(`Added ${src} (${runtime}) to the processing queue`)
      )
    );
    // Try to process the queue
    this.checkQueue();
  }

  checkQueue() {
    const x = this.queue.pop();
    if (!x) {
      console.log(ansiC.inverse(`The queue is empty`));
      return;
    }
    const test = this.configs.tests.find((t) => t[0] === x);
    if (!test) throw `test is undefined ${x}`;

    // Get the appropriate launcher based on the runtime type
    const runtime = test[1];

    // Get the destination path from the runnables
    const runnables = getRunnables(this.configs.tests, this.name);
    let dest: string;

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

  onBuildDone(): void {
    console.log("Build processes completed");
    // The builds are done, which means the files are ready to be watched
    // This matches the original behavior where builds completed before PM_Main started

    // Start Git watcher for development mode
    this.startGitWatcher();
  }

  checkForShutdown = () => {
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
