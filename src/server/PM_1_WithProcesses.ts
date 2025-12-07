/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import esbuildWebConfiger from "../esbuildConfigs/web.js";
import esbuildNodeConfiger from "../esbuildConfigs/node.js";
import ansiC from "ansi-colors";
import esbuild from "esbuild";
import { ESLint } from "eslint";
import fs, { watch } from "fs";
import puppeteer, { executablePath } from "puppeteer-core";
import tsc from "tsc-prog";
import ts from "typescript";
import { IBuiltConfig, IRunTime, ISummary } from "../Types.js";
import {
  createLogStreams,
  LogStreams,
  pollForFile,
  puppeteerConfigs,
  statusMessagePretty,
} from "../clients/utils.js";
import {
  generatePitonoMetafile,
  writePitonoMetafile,
} from "../clients/utils/pitonoMetafile.js";
import { MetafileManager } from "./MetafileManager.js";
import { PM_0 } from "./PM_0.js";
import { PortManager } from "./PortManager.js";
import { ProcessManager } from "./ProcessManager.js";
import { QueueManager } from "./QueueManager.js";
import { SummaryManager } from "./SummaryManager.js";
import configTests from "./configTests.js";
import { ensureSummaryEntry } from "./ensureSummaryEntry.js";
import { makePrompt } from "./makePrompt.js";
import { pythonLintCheck } from "./pythonLintCheck.js";
import { pythonTypeCheck } from "./pythonTypeCheck.js";
import { lintPather, tscPather } from "./utils";
import { getRunnables } from "./utils.js";
import ansiColors from "ansi-colors";
import { ChildProcess } from "child_process";

const eslint = new ESLint();
const formatter = await eslint.loadFormatter(
  "./node_modules/testeranto/dist/prebuild/esbuildConfigs/eslint-formatter-testeranto.mjs"
);

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
  // abstract startBuildProcesses(): Promise<void>;
  abstract onBuildDone(): void;

  clients: Set<any> = new Set();
  public fs: import("@isomorphic-git/lightning-fs");
  connected: boolean;

  constructor(configs: IBuiltConfig, name: string, mode: string) {
    super(configs, name, mode);

    this.launchers = {};
    this.portManager = new PortManager(this.configs.ports);
    this.queueManager = new QueueManager();
    this.summaryManager = new SummaryManager();

    this.configTests().forEach(([t, rt, tr, sidecars]) => {
      this.summaryManager.ensureSummaryEntry(t);
      sidecars.forEach(([sidecarName]) => {
        this.summaryManager.ensureSummaryEntry(sidecarName, true);
      });
    });
  }

  async startBuildProcesses(): Promise<void> {
    const { nodeEntryPoints, webEntryPoints } = getRunnables(
      this.configs,
      this.projectName
    );

    console.log(`Starting build processes for ${this.projectName}...`);
    console.log(`  Node entry points: ${Object.keys(nodeEntryPoints).length}`);
    console.log(`  Web entry points: ${Object.keys(webEntryPoints).length}`);
    // console.log(`  Pure entry points: ${Object.keys(pureEntryPoints).length}`);

    // Start all build processes (only node, web, pure)
    await Promise.all([
      this.startBuildProcess(esbuildNodeConfiger, nodeEntryPoints, "node"),
      this.startBuildProcess(esbuildWebConfiger, webEntryPoints, "web"),
      // this.startBuildProcess(esbuildImportConfiger, pureEntryPoints, "pure"),
    ]);
  }

  private async setupTestEnvironment(
    src: string,
    runtime: IRunTime
  ): Promise<{
    reportDest: string;
    testConfig: any;
    testConfigResource: any;
    portsToUse: string[];
    testResources: string;
  }> {
    this.bddTestIsRunning(src);

    const reportDest = `testeranto/reports/${this.projectName}/${src
      .split(".")
      .slice(0, -1)
      .join(".")}/${runtime}`;

    if (!fs.existsSync(reportDest)) {
      fs.mkdirSync(reportDest, { recursive: true });
    }

    const testConfig = this.configTests().find((t) => t[0] === src);
    if (!testConfig) {
      console.log(
        ansiC.inverse(`missing test config! Exiting ungracefully for '${src}'`)
      );
      process.exit(-1);
    }

    const testConfigResource = testConfig[2];

    const portsToUse: string[] = [];
    let testResources = "";

    if (testConfigResource.ports === 0) {
      testResources = JSON.stringify({
        name: src,
        ports: [],
        fs: reportDest,
        browserWSEndpoint: this.browser.wsEndpoint(),
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
          browserWSEndpoint: this.browser.wsEndpoint(),
        });
      } else {
        console.log(
          ansiC.red(
            `${runtime}: cannot run ${src} because there are no open ports ATM. This job will be enqueued and run again when a port is available`
          )
        );
        this.queue.push(src);
        throw new Error("No ports available");
      }
    } else {
      console.error("negative port makes no sense", src);
      process.exit(-1);
    }

    return {
      reportDest,
      testConfig,
      testConfigResource,
      portsToUse,
      testResources,
    };
  }

  private cleanupPorts(portsToUse: string[]) {
    portsToUse.forEach((port) => {
      this.ports[port] = "";
    });
  }

  private handleChildProcess(
    child: ChildProcess,
    logs: LogStreams,
    reportDest: string,
    src: string,
    runtime: IRunTime
  ): Promise<void> {
    return new Promise((resolve, reject) => {
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
          statusMessagePretty(0, src, runtime);
          resolve();
        } else {
          console.log(
            ansiColors.red(
              `${runtime} ! ${src} failed to execute. Check ${reportDest}/stderr.log for more info`
            )
          );
          this.bddTestIsNowDone(src, exitCode);
          statusMessagePretty(exitCode, src, runtime);
          reject(new Error(`Process exited with code ${exitCode}`));
        }
      });

      child.on("error", (e) => {
        console.log(
          ansiC.red(
            ansiC.inverse(
              `${src} errored with: ${e.name}. Check error logs for more info`
            )
          )
        );
        this.bddTestIsNowDone(src, -1);
        statusMessagePretty(-1, src, runtime);
        reject(e);
      });
    });
  }

  currentBuildResolve: (() => void) | null = null;
  currentBuildReject: ((error: any) => void) | null = null;

  async startBuildProcess(
    configer: (
      config: IBuiltConfig,
      entryPoints: string[],
      testName: string
    ) => any,
    entryPoints: Record<string, string>,
    runtime: string
  ): Promise<void> {
    const entryPointKeys = Object.keys(entryPoints);
    if (entryPointKeys.length === 0) return;

    // Store reference to 'this' for use in the plugin
    const self = this;

    // Create a custom plugin to track build processes
    const buildProcessTrackerPlugin = {
      name: "build-process-tracker",
      setup(build) {
        build.onStart(() => {
          const processId = `build-${runtime}-${Date.now()}`;
          const command = `esbuild ${runtime} for ${self.projectName}`;

          // Create a promise that will resolve when the build completes
          const buildPromise = new Promise<void>((resolve, reject) => {
            // Store resolve and reject functions to call them in onEnd
            self.currentBuildResolve = resolve;
            self.currentBuildReject = reject;
          });

          // Add to process manager
          if (self.addPromiseProcess) {
            self.addPromiseProcess(
              processId,
              buildPromise,
              command,
              "build-time",
              self.projectName,
              runtime as any
            );
          }

          console.log(
            `Starting ${runtime} build for ${entryPointKeys.length} entry points`
          );
          // Broadcast build start event
          if (self.webSocketBroadcastMessage) {
            self.webSocketBroadcastMessage({
              type: "buildEvent",
              event: "start",
              runtime,
              timestamp: new Date().toISOString(),
              entryPoints: entryPointKeys.length,
              processId,
            });
          }
        });

        build.onEnd((result) => {
          const event = {
            type: "buildEvent",
            event: result.errors.length > 0 ? "error" : "success",
            runtime,
            timestamp: new Date().toISOString(),
            errors: result.errors.length,
            warnings: result.warnings.length,
          };

          if (result.errors.length > 0) {
            console.error(
              `Build ${runtime} failed with ${result.errors.length} errors`
            );
            if (self.currentBuildReject) {
              self.currentBuildReject(
                new Error(`Build failed with ${result.errors.length} errors`)
              );
            }
          } else {
            console.log(`Build ${runtime} completed successfully`);
            if (self.currentBuildResolve) {
              self.currentBuildResolve();
            }
          }

          // Broadcast build result event
          if (self.webSocketBroadcastMessage) {
            self.webSocketBroadcastMessage(event);
          }

          // Clear the current build handlers
          self.currentBuildResolve = null;
          self.currentBuildReject = null;
        });
      },
    };

    // Get the base config and add our tracking plugin
    const baseConfig = configer(this.configs, entryPointKeys, this.projectName);
    const configWithPlugin = {
      ...baseConfig,
      plugins: [...(baseConfig.plugins || []), buildProcessTrackerPlugin],
    };

    try {
      // Always build first, then watch if in dev mode
      if (this.mode === "dev") {
        const ctx = await esbuild.context(configWithPlugin);
        // Build once and then watch
        await ctx.rebuild();
        await ctx.watch();
      } else {
        // In once mode, just build
        const result = await esbuild.build(configWithPlugin);
        if (result.errors.length === 0) {
          console.log(`Successfully built ${runtime} bundle`);
        }
      }
    } catch (error) {
      console.error(`Failed to build ${runtime}:`, error);
      // Broadcast error event
      if (this.webSocketBroadcastMessage) {
        this.webSocketBroadcastMessage({
          type: "buildEvent",
          event: "error",
          runtime,
          timestamp: new Date().toISOString(),
          errors: 1,
          warnings: 0,
          message: error.message,
        });
      }
      throw error;
    }
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

  private isProcessingQueue = false;

  async checkQueue() {
    // If already processing the queue, wait
    if (this.isProcessingQueue) {
      return;
    }

    this.isProcessingQueue = true;

    try {
      // Process one item at a time
      const queueItem = this.queueManager.pop();
      if (!queueItem) {
        this.isProcessingQueue = false;
        if (this.queueManager.length === 0) {
          console.log(ansiC.inverse(`The queue is empty`));
        }
        return;
      }

      const { testName: x, runtime } = queueItem;

      // Check if this test is already running (shouldn't happen with our logic)
      if (this.processManager.isTestRunning(x)) {
        console.log(
          ansiC.yellow(
            `Skipping ${x} (${runtime}) - already running, putting back in queue`
          )
        );
        // Put it back at the end of the queue
        this.queueManager.addToQueue(
          x,
          runtime,
          this.configs,
          this.projectName,
          this.cleanupTestProcesses.bind(this),
          () => {} // Don't trigger checkQueue here
        );
        this.isProcessingQueue = false;
        // Try again after a delay
        setTimeout(() => this.checkQueue(), 1000);
        return;
      }

      // Find the test configuration that matches both name AND runtime
      const test = this.configTests().find(
        (t) => t[0] === x && t[1] === runtime
      );
      if (!test) {
        console.error(
          `test is undefined ${x} (${runtime}), ${JSON.stringify(
            this.configTests(),
            null,
            2
          )}`
        );
        this.isProcessingQueue = false;
        // Try the next item
        setTimeout(() => this.checkQueue(), 100);
        return;
      }

      const runnables = getRunnables(this.configs, this.projectName);
      let dest: string;

      // Launch the test with error handling
      const launchTest = () => {
        try {
          switch (runtime) {
            case "node":
              dest = runnables.nodeEntryPoints[x];
              if (dest) {
                this.launchNode(x, dest);
              } else {
                console.error(`No destination found for node test: ${x}`);
                this.isProcessingQueue = false;
                setTimeout(() => this.checkQueue(), 100);
              }
              break;
            case "web":
              dest = runnables.webEntryPoints[x];
              if (dest) {
                this.launchWeb(x, dest);
              } else {
                console.error(`No destination found for web test: ${x}`);
                this.isProcessingQueue = false;
                setTimeout(() => this.checkQueue(), 100);
              }
              break;
            case "python":
              dest = runnables.pythonEntryPoints[x];
              if (dest) {
                this.launchPython(x, dest);
              } else {
                console.error(`No destination found for python test: ${x}`);
                this.isProcessingQueue = false;
                setTimeout(() => this.checkQueue(), 100);
              }
              break;
            case "golang":
              dest = runnables.golangEntryPoints[x];
              if (dest) {
                this.launchGolang(x, dest);
              } else {
                console.error(`No destination found for golang test: ${x}`);
                this.isProcessingQueue = false;
                setTimeout(() => this.checkQueue(), 100);
              }
              break;
            default:
              console.error(`Unknown runtime: ${runtime} for test ${x}`);
              this.isProcessingQueue = false;
              setTimeout(() => this.checkQueue(), 100);
              break;
          }
        } catch (error) {
          console.error(`Error launching test ${x} (${runtime}):`, error);
          this.isProcessingQueue = false;
          setTimeout(() => this.checkQueue(), 100);
        }
      };

      // Launch the test
      launchTest();
    } catch (error) {
      console.error(`Error in checkQueue:`, error);
      this.isProcessingQueue = false;
      // Try again after a delay
      setTimeout(() => this.checkQueue(), 1000);
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

  async pythonLintCheck(entrypoint: string, addableFiles: string[]) {
    return pythonLintCheck(
      entrypoint,
      addableFiles,
      this.projectName,
      this.summary
    );
  }

  async pythonTypeCheck(entrypoint: string, addableFiles: string[]) {
    return pythonTypeCheck(
      entrypoint,
      addableFiles,
      this.projectName,
      this.summary
    );
  }

  tscCheck = async ({
    entrypoint,
    addableFiles,
    platform,
  }: {
    entrypoint: string;
    addableFiles: string[];
    platform: IRunTime;
  }): Promise<any> => {
    const processId = `tsc-${entrypoint}-${Date.now()}`;
    const command = `tsc check for ${entrypoint}`;

    const tscPromise = (async () => {
      try {
        this.typeCheckIsRunning(entrypoint);
      } catch (e) {
        // Log error through process manager
        throw new Error(`Error in tscCheck: ${e.message}`);
      }

      const program = tsc.createProgramFromConfig({
        basePath: process.cwd(),
        configFilePath: "tsconfig.json",
        compilerOptions: {
          outDir: tscPather(entrypoint, platform, this.projectName),
          noEmit: true,
        },
        include: addableFiles,
      });
      const tscPath = tscPather(entrypoint, platform, this.projectName);

      const allDiagnostics = program.getSemanticDiagnostics();

      const results: string[] = [];
      allDiagnostics.forEach((diagnostic) => {
        if (diagnostic.file) {
          const { line, character } = ts.getLineAndCharacterOfPosition(
            diagnostic.file,
            diagnostic.start!
          );
          const message = ts.flattenDiagnosticMessageText(
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
      return results.length;
    })();

    this.addPromiseProcess(
      processId,
      tscPromise,
      command,
      "build-time",
      entrypoint
    );
  };

  eslintCheck = async ({
    entrypoint,
    addableFiles,
    platform,
  }: {
    entrypoint: string;
    addableFiles: string[];
    platform: IRunTime;
  }) => {
    const processId = `eslint-${entrypoint}-${Date.now()}`;
    const command = `eslint check for ${entrypoint}`;

    const eslintPromise = (async () => {
      try {
        this.lintIsRunning(entrypoint);
      } catch (e) {
        throw new Error(`Error in eslintCheck: ${e.message}`);
      }

      const filepath = lintPather(entrypoint, platform, this.projectName);
      if (fs.existsSync(filepath)) fs.rmSync(filepath);
      const results = (await eslint.lintFiles(addableFiles))
        .filter((r) => r.messages.length)
        .filter((r) => {
          return r.messages[0].ruleId !== null;
        })
        .map((r) => {
          delete r.source;
          return r;
        });

      fs.writeFileSync(filepath, await formatter.format(results));
      this.lintIsNowDone(entrypoint, results.length);
      return results.length;
    })();

    this.addPromiseProcess(
      processId,
      eslintPromise,
      command,
      "build-time",
      entrypoint
    );
  };

  typeCheckIsRunning = (src: string) => {
    this.summaryManager.ensureSummaryEntry(src);
    this.summary[src].typeErrors = "?";
  };

  typeCheckIsNowDone = (src: string, failures: number) => {
    if (failures === 0) {
      console.log(ansiC.green(ansiC.inverse(`tsc > ${src}`)));
    } else {
      console.log(
        ansiC.red(ansiC.inverse(`tsc > ${src} failed ${failures} times`))
      );
    }

    this.summary[src].typeErrors = failures;
    this.writeBigBoard();
    this.checkForShutdown();
  };

  lintIsRunning = (src: string) => {
    this.summaryManager.ensureSummaryEntry(src);
    this.summary[src].staticErrors = "?";
    this.writeBigBoard();
  };

  bddTestIsRunning(src: string) {
    this.summaryManager.bddTestIsRunning(src);
  }

  bddTestIsNowDone = (src: string, failures: number) => {
    this.summary[src].runTimeErrors = failures;
    this.writeBigBoard();
    this.checkForShutdown();
  };

  lintIsNowDone = (src: string, failures: number) => {
    if (failures === 0) {
      console.log(ansiC.green(ansiC.inverse(`eslint > ${src}`)));
    } else {
      console.log(
        ansiC.red(ansiC.inverse(`eslint > ${src} failed ${failures} times`))
      );
    }

    this.summary[src].staticErrors = failures;
    this.writeBigBoard();
    this.checkForShutdown();
  };
}
