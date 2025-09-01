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
} from "./utils.js";
import { PM_WithGit } from "./PM_WithGit.js";

const fileHashes = {};

export class PM_WithProcesses extends PM_WithGit {
  ports: Record<number, string>;
  queue: string[];
  logStreams: Record<string, ReturnType<typeof createLogStreams>> = {};
  launchers: Record<string, () => void>;

  constructor(configs: IBuiltConfig, name: string, mode: "once" | "dev") {
    super(configs, name, mode);

    this.launchers = {};
    this.ports = {};
    this.queue = [];

    // this.nodeSidecars = {};
    // this.webSidecars = {};
    // this.pureSidecars = {};

    this.configs.ports.forEach((element) => {
      this.ports[element] = ""; // set ports as open
    });
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
      // pitonoEntryPoints is stubbed out
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
      // pitonoEntryPoints is commented out since it's stubbed
      // [
      //   pitonoEntryPoints,
      //   this.launchPitono,
      //   "pitono",
      //   (w) => {
      //     this.pitonoMetafileWatcher = w;
      //   },
      // ],
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
            this.launchers[inputFile] = () => launcher(inputFile, outputFile);
            this.launchers[inputFile]();

            try {
              // Check if the file exists before watching
              if (fs.existsSync(outputFile)) {
                watch(outputFile, async (e, filename) => {
                  const hash = await fileHash(outputFile);
                  if (fileHashes[inputFile] !== hash) {
                    fileHashes[inputFile] = hash;
                    console.log(
                      ansiC.yellow(ansiC.inverse(`< ${e} ${filename}`))
                    );
                    this.launchers[inputFile]();
                  }
                });
              } else {
                console.log(
                  ansiC.yellow(
                    ansiC.inverse(
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

  checkQueue() {
    const x = this.queue.pop();
    if (!x) {
      ansiC.inverse(`The following queue is empty`);
      return;
    }
    const test = this.configs.tests.find((t) => t[0] === x);
    if (!test) throw `test is undefined ${x}`;

    this.launchers[test[0]]();
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
