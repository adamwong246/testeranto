/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import path from "path";
import puppeteer, { executablePath } from "puppeteer-core";
import ansiC from "ansi-colors";
import { IBuiltConfig, IRunTime, ISummary } from "../Types.js";
import fs, { watch } from "fs";

import {
  createLogStreams,
  isValidUrl,
  pollForFile,
  puppeteerConfigs,
  writeFileAndCreateDir,
} from "../clients/utils.js";

import { PM_0 } from "./PM_0.js";
import { makePrompt } from "./makePrompt.js";
import { getRunnables } from "./utils.js";
import { ProcessManager } from "./ProcessManager.js";
import { QueueManager } from "./QueueManager.js";
import { MetafileManager } from "./MetafileManager.js";
import { PortManager } from "./PortManager.js";
import { SummaryManager } from "./SummaryManager.js";
import { ensureSummaryEntry } from "./ensureSummaryEntry.js";
import configTests from "./configTests.js";
import {
  generatePitonoMetafile,
  writePitonoMetafile,
} from "../clients/utils/pitonoMetafile.js";

export abstract class PM_1_WithProcesses extends PM_0 {
  summary: ISummary = {};

  webMetafileWatcher: fs.FSWatcher;
  nodeMetafileWatcher: fs.FSWatcher;
  importMetafileWatcher: fs.FSWatcher;
  pitonoMetafileWatcher: fs.FSWatcher;
  golangMetafileWatcher: fs.FSWatcher;

  ports: Record<number, string>;
  queueManager: QueueManager;
  logStreams: Record<string, ReturnType<typeof createLogStreams>> = {};
  launchers: Record<string, () => void>;

  portManager: PortManager;
  processManager: ProcessManager = new ProcessManager();
  metafileManager: MetafileManager = new MetafileManager();
  summaryManager: SummaryManager = new SummaryManager();

  abstract launchNode(src: string, dest: string);
  abstract launchWeb(src: string, dest: string);
  abstract launchPython(src: string, dest: string);
  abstract launchGolang(src: string, dest: string);
  abstract startBuildProcesses(): Promise<void>;

  abstract tscCheck({
    entrypoint,
    addableFiles,
    platform,
  }: {
    entrypoint: string;
    addableFiles: string[];
    platform: IRunTime;
  });

  abstract eslintCheck({
    entrypoint,
    addableFiles,
    platform,
  }: {
    entrypoint: string;
    addableFiles: string[];
    platform: IRunTime;
  });

  abstract onBuildDone(): void;

  clients: Set<any> = new Set();
  public fs: import("@isomorphic-git/lightning-fs");
  connected: boolean;

  constructor(configs: IBuiltConfig, name: string, mode: string) {
    super(configs, name, mode);

    this.configTests().forEach(([t, rt, tr, sidecars]) => {
      this.summaryManager.ensureSummaryEntry(t);
      sidecars.forEach(([sidecarName]) => {
        this.summaryManager.ensureSummaryEntry(sidecarName, true);
      });
    });

    this.launchers = {};
    this.portManager = new PortManager(this.configs.ports);
    this.queueManager = new QueueManager();
    this.summaryManager = new SummaryManager();
  }

  configTests: () => [string, IRunTime, { ports: number }, object][] = () => {
    return configTests(this.configs);
  };

  writeBigBoard = () => {
    this.summaryManager.writeBigBoard(
      this.projectName,
      this.webSocketBroadcastMessage.bind(this)
    );
  };

  webSocketBroadcastMessage(message: any) {
    const data =
      typeof message === "string" ? message : JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(data);
      }
    });
  }

  addPromiseProcess(
    processId: string,
    promise: Promise<any>,
    command: string,
    category: "aider" | "bdd-test" | "build-time" | "other" = "other",
    testName: string,
    platform: IRunTime,
    onResolve?: (result: any) => void,
    onReject?: (error: any) => void
  ) {
    const id = this.processManager.addPromiseProcess(
      processId,
      promise,
      command,
      category,
      testName,
      platform,
      onResolve,
      onReject
    );

    const startMessage = `Starting: ${command}`;
    this.webSocketBroadcastMessage({
      type: "processStarted",
      processId: id,
      command,
      timestamp: new Date().toISOString(),
      logs: [startMessage],
    });

    promise
      .then((result) => {
        const successMessage = `Completed successfully with result: ${JSON.stringify(
          result
        )}`;
        this.webSocketBroadcastMessage({
          type: "processExited",
          processId: id,
          exitCode: 0,
          timestamp: new Date().toISOString(),
          logs: [successMessage],
        });
      })
      .catch((error) => {
        const errorMessage = `Failed with error: ${error.message}`;
        this.webSocketBroadcastMessage({
          type: "processError",
          processId: id,
          error: error.message,
          timestamp: new Date().toISOString(),
          logs: [errorMessage],
        });
      });

    return id;
  }

  getProcessesByCategory(
    category: "aider" | "bdd-test" | "build-time" | "other"
  ) {
    return this.processManager.getProcessesByCategory(category);
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

  getProcessesByTestName(testName: string) {
    return this.processManager.getProcessesByTestName(testName);
  }

  getProcessesByPlatform(platform: IRunTime) {
    return this.processManager.getProcessesByPlatform(platform);
  }

  bddTestIsRunning(src: string) {
    this.summaryManager.bddTestIsRunning(src);
  }

  async metafileOutputs(platform: IRunTime) {
    await this.metafileManager.processMetafile(
      platform,
      this.projectName,
      this.configTests.bind(this),
      this.tscCheck.bind(this),
      this.eslintCheck.bind(this),
      this.pythonLintCheck.bind(this),
      this.pythonTypeCheck.bind(this),
      (summary, projectName, entrypoint, addableFiles, platform) => {
        // Ensure the summary entry exists before calling makePrompt
        if (!this.summary[entrypoint]) {
          this.ensureSummaryEntry(entrypoint);
        }
        makePrompt(
          this.summary,
          projectName,
          entrypoint,
          addableFiles,
          platform
        );
      },
      this.findTestNameByEntrypoint.bind(this),
      this.addToQueue.bind(this)
    );
  }

  private findTestNameByEntrypoint(
    entrypoint: string,
    platform: IRunTime
  ): string | null {
    console.log("findTestNameByEntrypoint", entrypoint, platform);
    const runnables = getRunnables(this.configs, this.projectName);

    let entryPointsMap: Record<string, string>;

    switch (platform) {
      case "node":
        entryPointsMap = runnables.nodeEntryPoints;
        break;
      case "web":
        entryPointsMap = runnables.webEntryPoints;
        break;
      // case "pure":
      //   entryPointsMap = runnables.pureEntryPoints;
      //   break;
      case "python":
        entryPointsMap = runnables.pythonEntryPoints;
        break;
      case "golang":
        entryPointsMap = runnables.golangEntryPoints;
        break;
      default:
        throw "wtf";
    }

    if (!entryPointsMap) {
      console.error("idk");
    }

    if (!entryPointsMap[entrypoint]) {
      console.error(`${entrypoint} not found 1`, entryPointsMap);
      console.trace();
      throw `${entrypoint} not found`;
    }

    return entryPointsMap[entrypoint];
  }

  async pythonLintCheck(entrypoint: string, addableFiles: string[]) {
    const { pythonLintCheck } = await import("./pythonLintCheck.js");
    return pythonLintCheck(
      entrypoint,
      addableFiles,
      this.projectName,
      this.summary
    );
  }

  async pythonTypeCheck(entrypoint: string, addableFiles: string[]) {
    const { pythonTypeCheck } = await import("./pythonTypeCheck.js");
    return pythonTypeCheck(
      entrypoint,
      addableFiles,
      this.projectName,
      this.summary
    );
  }

  async start() {
    // Wait for build processes to complete first
    try {
      await this.startBuildProcesses();

      // Generate Python metafile if there are Python tests
      const pythonTests = this.configTests().filter(
        (test) => test[1] === "python"
      );
      if (pythonTests.length > 0) {
        const entryPoints = pythonTests.map((test) => test[0]);
        const metafile = await generatePitonoMetafile(
          this.projectName,
          entryPoints
        );
        writePitonoMetafile(this.projectName, metafile);
      }

      // this.onBuildDone();
    } catch (error) {
      console.error("Build processes failed:", error);
      return;
    }

    // Continue with the rest of the setup after builds are done
    this.mapping().forEach(async ([command, func]) => {
      globalThis[command] = func;
    });

    if (!fs.existsSync(`testeranto/reports/${this.projectName}`)) {
      fs.mkdirSync(`testeranto/reports/${this.projectName}`);
    }

    try {
      this.browser = await puppeteer.launch(puppeteerConfigs);
    } catch (e) {
      console.error(e);
      console.error(
        "could not start chrome via puppetter. Check this path: ",
        executablePath
      );
    }

    const runnables = getRunnables(this.configs, this.projectName);
    const {
      nodeEntryPoints,
      webEntryPoints,
      // pureEntryPoints,
      pythonEntryPoints,
      golangEntryPoints,
    } = runnables;

    // Add all tests to the queue
    [
      ["node", nodeEntryPoints],
      ["web", webEntryPoints],
      // ["pure", pureEntryPoints],
      ["python", pythonEntryPoints],
      ["golang", golangEntryPoints],
    ].forEach(([runtime, entryPoints]: [IRunTime, Record<string, string>]) => {
      Object.keys(entryPoints).forEach((entryPoint) => {
        // Create the report directory
        const reportDest = `testeranto/reports/${this.projectName}/${entryPoint
          .split(".")
          .slice(0, -1)
          .join(".")}/${runtime}`;
        if (!fs.existsSync(reportDest)) {
          fs.mkdirSync(reportDest, { recursive: true });
        }

        // Add to the processing queue
        this.addToQueue(entryPoint, runtime);
      });
    });

    // Set up metafile watchers for each runtime
    const runtimeConfigs = [
      ["node", nodeEntryPoints],
      ["web", webEntryPoints],
      // ["pure", pureEntryPoints],
      ["python", pythonEntryPoints],
      ["golang", golangEntryPoints],
    ];

    for (const [runtime, entryPoints] of runtimeConfigs) {
      if (Object.keys(entryPoints).length === 0) continue;

      // For python, the metafile path is different
      let metafile: string;
      if (runtime === "python") {
        metafile = `./testeranto/metafiles/${runtime}/core.json`;
      } else {
        metafile = `./testeranto/metafiles/${runtime}/${this.projectName}.json`;
      }

      // Ensure the directory exists
      const metafileDir = metafile.split("/").slice(0, -1).join("/");
      if (!fs.existsSync(metafileDir)) {
        fs.mkdirSync(metafileDir, { recursive: true });
      }

      try {
        // For python, we may need to generate the metafile first
        if (runtime === "python" && !fs.existsSync(metafile)) {
          const entryPointList = Object.keys(entryPoints);
          if (entryPointList.length > 0) {
            const metafileData = await generatePitonoMetafile(
              this.projectName,
              entryPointList
            );
            writePitonoMetafile(this.projectName, metafileData);
          }
        }

        await pollForFile(metafile);
        // console.log("Found metafile for", runtime, metafile);

        // Set up watcher for the metafile with debouncing
        let timeoutId: NodeJS.Timeout;
        const watcher = watch(metafile, async (e, filename) => {
          // Debounce to avoid multiple rapid triggers
          clearTimeout(timeoutId);
          timeoutId = setTimeout(async () => {
            console.log(
              ansiC.yellow(ansiC.inverse(`< ${e} ${filename} (${runtime})`))
            );
            try {
              await this.metafileOutputs(runtime as IRunTime);
              // After processing metafile changes, check the queue to run tests
              console.log(
                ansiC.blue(
                  `Metafile processed, checking queue for tests to run`
                )
              );
              this.checkQueue();
            } catch (error) {
              console.error(`Error processing metafile changes:`, error);
            }
          }, 300); // 300ms debounce
        });

        // Store the watcher based on runtime
        switch (runtime) {
          case "node":
            this.nodeMetafileWatcher = watcher;
            break;
          case "web":
            this.webMetafileWatcher = watcher;
            break;
          // case "pure":
          //   this.importMetafileWatcher = watcher;
          //   break;
          case "python":
            this.pitonoMetafileWatcher = watcher;
            break;
          case "golang":
            this.golangMetafileWatcher = watcher;
            break;
        }

        // Read the metafile immediately
        await this.metafileOutputs(runtime as IRunTime);
      } catch (error) {
        console.error(`Error setting up watcher for ${runtime}:`, error);
      }
    }
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

    // if (this.gitWatcher) {
    //   this.gitWatcher.close();
    // }

    // if (this.gitWatchTimeout) {
    //   clearTimeout(this.gitWatchTimeout);
    // }

    Object.values(this.logStreams || {}).forEach((logs) => logs.closeAll());

    // if (this.wss) {
    //   this.wss.close(() => {
    //     console.log("WebSocket server closed");
    //   });
    // }

    this.clients.forEach((client) => {
      client.terminate();
    });
    this.clients.clear();

    // if (this.httpServer) {
    //   this.httpServer.close(() => {
    //     console.log("HTTP server closed");
    //   });
    // }
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
        const accumulator = await mm;

        const isUrl = isValidUrl(featureStringKey);

        if (isUrl) {
          const u = new URL(featureStringKey);

          if (u.protocol === "file:") {
            accumulator.files.push(u.pathname);
          } else if (u.protocol === "http:" || u.protocol === "https:") {
            const newPath = `${process.cwd()}/testeranto/features/external/${
              u.hostname
            }${u.pathname}`;

            const body = await this.configs.featureIngestor(featureStringKey);

            writeFileAndCreateDir(newPath, body);
            accumulator.files.push(newPath);
          }
        } else {
          await fs.promises.mkdir(path.dirname(featureDestination), {
            recursive: true,
          });

          accumulator.strings.push(featureStringKey);
        }

        return accumulator;
      }, Promise.resolve({ files: [] as string[], strings: [] as string[] }))

      .then(({ files }: { files: string[]; strings: string[] }) => {
        // Markdown files must be referenced in the prompt but string style features are already present in the tests.json file

        fs.writeFileSync(
          `testeranto/reports/${this.projectName}/${srcTest
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
        const currentSummary = this.summaryManager.getSummary();
        if (currentSummary[srcTest]) {
          currentSummary[srcTest].failingFeatures =
            currentSummary[srcTest].failingFeatures || {};
          (currentSummary[srcTest].failingFeatures as any)[g.key] = g.features;
        }
      }
    });

    this.writeBigBoard();
  };

  addToQueue(src: string, runtime: IRunTime) {
    this.queueManager.addToQueue(
      src,
      runtime,
      this.configs,
      this.projectName,
      this.cleanupTestProcesses.bind(this),
      this.checkQueue.bind(this)
    );
  }

  private cleanupTestProcesses(testName: string) {
    const processesToCleanup =
      this.processManager.cleanupTestProcesses(testName);

    // Broadcast process exit for each cleaned up process
    processesToCleanup.forEach((processId) => {
      this.webSocketBroadcastMessage({
        type: "processExited",
        processId,
        exitCode: -1,
        timestamp: new Date().toISOString(),
        logs: ["Process killed due to source file change"],
      });
    });
  }

  checkQueue() {
    // this.queueManager.checkQueue();
    // Process all items in the queue
    while (this.queueManager.length > 0) {
      const x = this.queueManager.pop();
      if (!x) continue;

      // Check if this test is already running
      if (this.processManager.isTestRunning(x)) {
        console.log(
          ansiC.yellow(
            `Skipping ${x} - already running, will be re-queued when current run completes`
          )
        );
        continue;
      }

      const test = this.configTests().find((t) => t[0] === x);
      if (!test) {
        console.error(
          `test is undefined ${x}, ${JSON.stringify(
            this.configTests(),
            null,
            2
          )}`
        );
        process.exit(-1);
        continue;
      }

      // Get the appropriate launcher based on the runtime type
      const runtime = test[1];

      const runnables = getRunnables(this.configs, this.projectName);
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

    if (this.queueManager.length === 0) {
      console.log(ansiC.inverse(`The queue is empty`));
    }
  }

  checkForShutdown = async () => {
    const { checkForShutdown } = await import("./checkForShutdown.js");
    checkForShutdown(
      this.mode,
      this.summaryManager,
      this.queueManager,
      this.projectName,
      this.browser,
      this.checkQueue.bind(this),
      this.writeBigBoard.bind(this)
    );
  };

  private ensureSummaryEntry(src: string, isSidecar = false) {
    ensureSummaryEntry(this.summary, src, isSidecar);
    return this.summary[src];
  }
}
