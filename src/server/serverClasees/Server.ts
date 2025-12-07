// This is a process manager which needs to be refactored. It is ATM broken
// ATM, there are 3 checks for web and node tests- tsc check, lint check, and the bdd test
// ATM, these 3 processes are scheduled separatly
// We need to redo this process manager such that these processes are now executed together
// Before if we had 2 tests, there would be 2 * 3 processes
// We need to redo this so that there are only 3 processes scheduled

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import nodeEsbuildConfiger from "./../../esbuildConfigs/node";
import webEsbuildConfiger from "./../../esbuildConfigs/web";

import { default as ansiC, default as ansiColors } from "ansi-colors";
import { ChildProcess, spawn } from "child_process";
import esbuild from "esbuild";
import fs, { watch } from "fs";
import path from "path";
import puppeteer, { ConsoleMessage, executablePath } from "puppeteer-core";
import {
  createLogStreams,
  LogStreams,
  statusMessagePretty,
  puppeteerConfigs,
  pollForFile,
} from "../../clients/utils";
import {
  generatePitonoMetafile,
  writePitonoMetafile,
} from "../../clients/utils/pitonoMetafile";
import { IFinalResults } from "../../lib";
import { ISummary, IBuiltConfig, IRunTime } from "../../Types";
import { checkForShutdown } from "../docker/ProcessManager/checkForShutdown";
import configTests from "../configTests";
import { ensureSummaryEntry } from "./../docker/ProcessManager/ensureSummaryEntry";
import { generatePromptFiles } from "../aider/generatePromptFiles";
import { lintCheck } from "../node+web/lintCheck";
import { processGoTestOutput } from "../golang/processGoTestOutput";
import { pythonLintCheck } from "../python/pythonLintCheck";
import { pythonTypeCheck } from "../python/pythonTypeCheck";
import { TestExecutor } from "../docker/ProcessManager/TestExecutor";
import { tscCheck } from "../node+web/tscCheck";
import { getRunnables, tscPather, lintPather, webEvaluator } from "../utils";
import { Server_DockerCompose } from "./Server_DockerCompose";

export class Server extends Server_DockerCompose {
  webMetafileWatcher: fs.FSWatcher;
  nodeMetafileWatcher: fs.FSWatcher;
  importMetafileWatcher: fs.FSWatcher;
  pitonoMetafileWatcher: fs.FSWatcher;
  golangMetafileWatcher: fs.FSWatcher;

  // queueManager: QueueManager;
  // portManager: PortManager;
  // processManager: ProcessManager = new ProcessManager();
  // metafileManager: MetafileManager = new MetafileManager();
  // summaryManager: SummaryManager = new SummaryManager();

  summary: ISummary = {};
  ports: Record<number, string>;
  logStreams: Record<string, ReturnType<typeof createLogStreams>> = {};
  launchers: Record<string, () => void>;
  clients: Set<any> = new Set();
  connected: boolean;

  testName: string;
  private composeDir: string;
  private composeFile: string;
  // private logger: {
  //   log: (...args: any[]) => void;
  //   error: (...args: any[]) => void;
  //   warn: (...args: any[]) => void;
  //   info: (...args: any[]) => void;
  // };

  // private tcpServer: TcpServer;
  // private webSocketServer: WebSocketServerManager;
  // private fileSystem: FileSystem;
  // private dockerCompose: DockerCompose;
  // private browserManager: BrowserManager;
  // private testServiceManager: TestServiceManager;
  // private buildServiceMonitor: BuildServiceMonitor;
  // private tcpPort: number = 0;
  // private webSocketPort: number = 0;

  private isProcessingQueue = false;

  constructor(configs: IBuiltConfig, testName: string, mode: string) {
    super(process.cwd(), configs, testName, mode);

    this.launchers = {};
    // this.portManager = new PortManager(this.configs.ports);
    // this.queueManager = new QueueManager();
    // this.summaryManager = new SummaryManager();

    // this.configTests().forEach(([t, rt, tr, sidecars]) => {
    //   this.summaryManager.ensureSummaryEntry(t);
    //   // sidecars.forEach(([sidecarName]) => {
    //   //   this.summaryManager.ensureSummaryEntry(sidecarName, true);
    //   // });
    // });

    this.testName = testName;
    this.composeDir = process.cwd();
    this.composeFile = path.join(
      this.composeDir,
      "testeranto",
      "bundles",
      `${this.testName}-docker-compose.yml`
    );
  }

  currentBuildResolve: (() => void) | null = null;
  currentBuildReject: ((error: any) => void) | null = null;

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
      this.startBuildProcess(nodeEsbuildConfiger, nodeEntryPoints, "node"),
      this.startBuildProcess(webEsbuildConfiger, webEntryPoints, "web"),
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

  // addPromiseProcess(
  //   processId: string,
  //   promise: Promise<any>,
  //   command: string,
  //   category: "aider" | "bdd-test" | "build-time" | "other" = "other",
  //   testName: string,
  //   platform: IRunTime,
  //   onResolve?: (result: any) => void,
  //   onReject?: (error: any) => void
  // ) {
  //   const id = this.addPromiseProcess(
  //     processId,
  //     promise,
  //     command,
  //     category,
  //     testName,
  //     platform,
  //     onResolve,
  //     onReject
  //   );

  //   const startMessage = `Starting: ${command}`;
  //   this.webSocketBroadcastMessage({
  //     type: "processStarted",
  //     processId: id,
  //     command,
  //     timestamp: new Date().toISOString(),
  //     logs: [startMessage],
  //   });

  //   promise
  //     .then((result) => {
  //       const successMessage = `Completed successfully with result: ${JSON.stringify(
  //         result
  //       )}`;
  //       this.webSocketBroadcastMessage({
  //         type: "processExited",
  //         processId: id,
  //         exitCode: 0,
  //         timestamp: new Date().toISOString(),
  //         logs: [successMessage],
  //       });
  //     })
  //     .catch((error) => {
  //       const errorMessage = `Failed with error: ${error.message}`;
  //       this.webSocketBroadcastMessage({
  //         type: "processError",
  //         processId: id,
  //         error: error.message,
  //         timestamp: new Date().toISOString(),
  //         logs: [errorMessage],
  //       });
  //     });

  //   return id;
  // }

  getProcessesByCategory(
    category: "aider" | "bdd-test" | "build-time" | "other"
  ) {
    return this.getProcessesByCategory(category);
  }

  getBDDTestProcesses() {
    return this.getProcessesByCategory("bdd-test");
  }

  getBuildTimeProcesses() {
    return this.getProcessesByCategory("build-time");
  }

  // getProcessesByTestName(testName: string) {
  //   return this.processManager.getProcessesByTestName(testName);
  // }

  // getProcessesByPlatform(platform: IRunTime) {
  //   return this.processManager.getProcessesByPlatform(platform);
  // }

  // async metafileOutputs(platform: IRunTime) {
  //   // Create no-op check functions since checks will be run as part of test execution
  //   const noopCheck = async ({
  //     entrypoint,
  //     addableFiles,
  //     platform: p,
  //   }: {
  //     entrypoint: string;
  //     addableFiles: string[];
  //     platform: IRunTime;
  //   }) => {
  //     // Do nothing - checks will be run via TestExecutor
  //     return Promise.resolve();
  //   };

  //   const noopPythonCheck = async (
  //     entrypoint: string,
  //     addableFiles: string[]
  //   ) => {
  //     // Do nothing - checks will be run via TestExecutor
  //     return Promise.resolve();
  //   };

  //   await this.metafileManager.processMetafile(
  //     platform,
  //     this.projectName,
  //     this.configTests.bind(this),
  //     noopCheck,
  //     noopCheck,
  //     noopPythonCheck,
  //     noopPythonCheck,
  //     (summary, projectName, entrypoint, addableFiles, platform) => {
  //       // Ensure the summary entry exists before calling makePrompt
  //       if (!this.summary[entrypoint]) {
  //         this.ensureSummaryEntry(entrypoint);
  //       }
  //       makePrompt(
  //         this.summary,
  //         projectName,
  //         entrypoint,
  //         addableFiles,
  //         platform
  //       );
  //     },
  //     this.findTestNameByEntrypoint.bind(this),
  //     (testName, platform, addableFiles) =>
  //       this.addToQueue(testName, platform, addableFiles)
  //   );
  // }

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
        // this.addToQueue(entryPoint, runtime, undefined);
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
              // await this.metafileOutputs(runtime as IRunTime);
              // After processing metafile changes, check the queue to run tests
              console.log(
                ansiC.blue(
                  `Metafile processed, checking queue for tests to run`
                )
              );
              // this.checkQueue();
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
        // await this.metafileOutputs(runtime as IRunTime);
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

  // addToQueue(src: string, runtime: IRunTime, addableFiles?: string[]) {
  //   this.addToQueue(
  //     src,
  //     runtime,
  //     this.configs,
  //     this.projectName,
  //     this.cleanupTestProcesses.bind(this),
  //     this.checkQueue.bind(this),
  //     addableFiles
  //   );
  // }

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

  private testExecutor: TestExecutor | null = null;

  // async checkQueue() {
  //   // If already processing the queue, wait
  //   if (this.isProcessingQueue) {
  //     return;
  //   }

  //   this.isProcessingQueue = true;

  //   try {
  //     // Process one item at a time
  //     const queueItem = this.queueManager.pop();
  //     if (!queueItem) {
  //       this.isProcessingQueue = false;
  //       if (this.queueManager.length === 0) {
  //         console.log(ansiC.inverse(`The queue is empty`));
  //       }
  //       return;
  //     }

  //     const { testName: x, runtime, addableFiles } = queueItem;

  //     // Check if this test is already running (shouldn't happen with our logic)
  //     if (this.processManager.isTestRunning(x)) {
  //       console.log(
  //         ansiC.yellow(
  //           `Skipping ${x} (${runtime}) - already running, putting back in queue`
  //         )
  //       );
  //       // Put it back at the end of the queue
  //       this.queueManager.addToQueue(
  //         x,
  //         runtime,
  //         this.configs,
  //         this.projectName,
  //         this.cleanupTestProcesses.bind(this),
  //         () => {} // Don't trigger checkQueue here
  //       );
  //       this.isProcessingQueue = false;
  //       // Try again after a delay
  //       setTimeout(() => this.checkQueue(), 1000);
  //       return;
  //     }

  //     // Find the test configuration that matches both name AND runtime
  //     const test = this.configTests().find(
  //       (t) => t[0] === x && t[1] === runtime
  //     );
  //     if (!test) {
  //       console.error(
  //         `test is undefined ${x} (${runtime}), ${JSON.stringify(
  //           this.configTests(),
  //           null,
  //           2
  //         )}`
  //       );
  //       this.isProcessingQueue = false;
  //       // Try the next item
  //       setTimeout(() => this.checkQueue(), 100);
  //       return;
  //     }

  //     // Initialize test executor if not already done
  //     if (!this.testExecutor) {
  //       this.testExecutor = new TestExecutor({
  //         projectName: this.projectName,
  //         configs: this.configs,
  //         summary: this.summary,
  //         summaryManager: this.summaryManager,
  //         processManager: this.processManager,
  //         portManager: this.portManager,
  //         browser: this.browser,
  //         webSocketBroadcastMessage: this.webSocketBroadcastMessage.bind(this),
  //         typeCheckIsRunning: this.typeCheckIsRunning,
  //         typeCheckIsNowDone: this.typeCheckIsNowDone,
  //         lintIsRunning: this.lintIsRunning,
  //         lintIsNowDone: this.lintIsNowDone,
  //         bddTestIsRunning: this.bddTestIsRunning,
  //         bddTestIsNowDone: this.bddTestIsNowDone,
  //         launchNode: this.launchNode,
  //         launchWeb: this.launchWeb,
  //         launchPython: this.launchPython,
  //         launchGolang: this.launchGolang,
  //         addPromiseProcess: this.addPromiseProcess.bind(this),
  //         pythonLintCheck: this.pythonLintCheck.bind(this),
  //         pythonTypeCheck: this.pythonTypeCheck.bind(this),
  //       });
  //     }

  //     // Execute all three phases together
  //     try {
  //       await this.testExecutor.executeTest(x, runtime, addableFiles);
  //     } catch (error) {
  //       console.error(`Error executing test ${x} (${runtime}):`, error);
  //     } finally {
  //       // Mark as done and check for next item
  //       this.isProcessingQueue = false;
  //       setTimeout(() => this.checkQueue(), 100);
  //     }
  //   } catch (error) {
  //     console.error(`Error in checkQueue:`, error);
  //     this.isProcessingQueue = false;
  //     // Try again after a delay
  //     setTimeout(() => this.checkQueue(), 1000);
  //   }
  // }

  checkForShutdown = async () => {
    checkForShutdown(
      this.mode,
      this.summaryManager,
      this.queueManager,
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

      const tscPath = tscPather(entrypoint, platform, this.projectName);

      const results = tscCheck({
        entrypoint,
        addableFiles,
        platform,
        projectName: this.projectName,
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
      entrypoint,
      platform
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
      const results = await lintCheck(addableFiles);
      fs.writeFileSync(filepath, results);
      this.lintIsNowDone(entrypoint, results.length);
      return results.length;
    })();

    this.addPromiseProcess(
      processId,
      eslintPromise,
      command,
      "build-time",
      entrypoint,
      platform
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

  // setupIpcHandler is no longer used since node tests now use WebSocket communication
  // All communication should go through WebSocket messages handled in Server_TCP

  launchNode = async (src: string, dest: string) => {
    console.log(ansiC.green(ansiC.inverse(`node < ${src}`)));

    const processId = `node-${src}-${Date.now()}`;
    const command = `node test: ${src}`;

    const nodePromise = (async () => {
      try {
        const { reportDest, testResources, portsToUse } =
          await this.setupTestEnvironment(src, "node");

        const builtfile = dest;
        const logs = createLogStreams(reportDest, "node");

        // Spawn without IPC - use only stdio pipes
        // Pass WebSocket port via environment variable for congruence
        const child = spawn("node", [builtfile, testResources], {
          stdio: ["pipe", "pipe", "pipe"],
          env: {
            ...process.env,
            WS_PORT: "3000",
          },
        });

        // Handle stdout and stderr normally
        child.stdout?.on("data", (data) => {
          logs.stdout?.write(data);
        });

        child.stderr?.on("data", (data) => {
          logs.stderr?.write(data);
        });

        try {
          await this.handleChildProcess(child, logs, reportDest, src, "node");

          // Generate prompt files for Node tests
          generatePromptFiles(reportDest, src);
        } finally {
          this.cleanupPorts(portsToUse);
        }
      } catch (error: any) {
        if (error.message !== "No ports available") {
          console.error(`Error in launchNode for ${src}:`, error);
        }
      }
    })();

    this.addPromiseProcess(
      processId,
      nodePromise,
      command,
      "bdd-test",
      src,
      "node",
      () => {
        setTimeout(() => this.checkQueue(), 100);
      },
      () => {
        setTimeout(() => this.checkQueue(), 100);
      }
    );
  };

  launchWeb = async (src: string, dest: string) => {
    console.log(ansiC.green(ansiC.inverse(`web < ${src}`)));

    const processId = `web-${src}-${Date.now()}`;
    const command = `web test: ${src}`;

    // Create the promise
    const webPromise = (async () => {
      try {
        this.bddTestIsRunning(src);

        const reportDest = `testeranto/reports/${this.projectName}/${src
          .split(".")
          .slice(0, -1)
          .join(".")}/web`;
        if (!fs.existsSync(reportDest)) {
          fs.mkdirSync(reportDest, { recursive: true });
        }

        const destFolder = dest.replace(".mjs", "");
        const htmlPath = `${destFolder}.html`;

        const webArgz = JSON.stringify({
          name: src,
          ports: [],
          fs: reportDest,
          browserWSEndpoint: this.browser.wsEndpoint(),
        });

        const logs = createLogStreams(reportDest, "web");

        // Use HTTP URL instead of file:// to allow WebSocket connections
        const httpPort = Number(process.env.HTTP_PORT) || 3000;

        // Convert HTML file path to relative URL under /bundles/web/
        // htmlPath is something like: /Users/adam/Code/testeranto/testeranto/bundles/web/allTests/example/Calculator.test.html
        // We need: /bundles/web/allTests/example/Calculator.test.html
        let relativePath: string;
        const match = htmlPath.match(/testeranto\/bundles\/web\/(.*)/);
        if (match) {
          relativePath = match[1];
        } else {
          // Try to extract from absolute path
          const absMatch = htmlPath.match(/\/bundles\/web\/(.*)/);
          if (absMatch) {
            relativePath = absMatch[1];
          } else {
            // Fallback: just use the filename
            relativePath = path.basename(htmlPath);
          }
        }

        // Encode the test resource configuration as a URL query parameter
        // This ensures it's available immediately when the page loads
        const encodedConfig = encodeURIComponent(webArgz);
        const url = `http://localhost:${httpPort}/bundles/web/${relativePath}?config=${encodedConfig}`;
        console.log(
          `Navigating to ${url} (HTML file exists: ${fs.existsSync(htmlPath)})`
        );

        const page = await this.browser.newPage();

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
          logs.writeExitCode(0);
          logs.closeAll();
        });

        // Note: Functions are no longer exposed via page.exposeFunction()
        // The web tests should use PM_Web which communicates via WebSocket
        // PM_Web is instantiated in the browser context and connects to the WebSocket server

        const close = () => {
          // logs.info?.write("close2");
          // if (!files[src]) {
          //   files[src] = new Set();
          // }
          // delete files[src];
          // Promise.all(screenshots[src] || []).then(() => {
          //   delete screenshots[src];
          // });
        };

        page.on("pageerror", (err: Error) => {
          logs.info?.write("pageerror: " + err.message);
          console.error("Page error in web test:", err);
          logs.writeExitCode(-1, err);
          console.log(
            ansiColors.red(
              `web ! ${src} failed to execute. No "tests.json" file was generated. Check ${reportDest}/error.log for more info`
            )
          );
          this.bddTestIsNowDone(src, -1);
          close();
          throw err;
        });

        // Log console messages for debugging
        page.on("console", (msg) => {
          const text = msg.text();
          console.log(`Browser console [${msg.type()}]: ${text}`);
        });

        // Navigate to the HTML page with the config in the query parameter
        await page.goto(url, { waitUntil: "networkidle0" });

        // The HTML page loads the JS bundle, but we need to actually run the test
        // Use webEvaluator to import and run the test module
        // First, get the JS file path from the dest
        const jsPath = dest;
        // Convert to relative URL for the browser
        let jsRelativePath: string;
        const jsMatch = jsPath.match(/testeranto\/bundles\/web\/(.*)/);
        if (jsMatch) {
          jsRelativePath = jsMatch[1];
        } else {
          const jsAbsMatch = jsPath.match(/\/bundles\/web\/(.*)/);
          if (jsAbsMatch) {
            jsRelativePath = jsAbsMatch[1];
          } else {
            jsRelativePath = path.basename(jsPath);
          }
        }
        const jsUrl = `/bundles/web/${jsRelativePath}?cacheBust=${Date.now()}`;

        // Evaluate the test using webEvaluator
        const evaluation = webEvaluator(jsUrl, webArgz);
        console.log("Evaluating web test with URL:", jsUrl);

        try {
          const results = (await page.evaluate(evaluation)) as IFinalResults;
          const { fails, failed, features } = results;
          logs.info?.write("\n idk1");
          statusMessagePretty(fails, src, "web");
          this.bddTestIsNowDone(src, fails);
        } catch (error) {
          console.error("Error evaluating web test:", error);
          logs.info?.write("\n Error evaluating web test");
          statusMessagePretty(-1, src, "web");
          this.bddTestIsNowDone(src, -1);
        }

        // Generate prompt files for Web tests
        generatePromptFiles(reportDest, src);

        await page.close();
        close();
      } catch (error) {
        console.error(`Error in web test ${src}:`, error);
        this.bddTestIsNowDone(src, -1);
        throw error;
      }
    })();

    // Add to process manager
    this.addPromiseProcess(
      processId,
      webPromise,
      command,
      "bdd-test",
      src,
      "web",
      () => {
        setTimeout(() => this.checkQueue(), 100);
      },
      () => {
        setTimeout(() => this.checkQueue(), 100);
      }
    );
  };

  launchPython = async (src: string, dest: string) => {
    console.log(ansiC.green(ansiC.inverse(`python < ${src}`)));

    const processId = `python-${src}-${Date.now()}`;
    const command = `python test: ${src}`;

    const pythonPromise = (async () => {
      try {
        const { reportDest, testResources, portsToUse } =
          await this.setupTestEnvironment(src, "python");

        const logs = createLogStreams(reportDest, "python");

        // Determine Python command
        const venvPython = `./venv/bin/python3`;
        const pythonCommand = fs.existsSync(venvPython)
          ? venvPython
          : "python3";

        // Pass WebSocket port via environment variable for congruence
        const child = spawn(pythonCommand, [src, testResources], {
          stdio: ["pipe", "pipe", "pipe"],
          env: {
            ...process.env,
            WS_PORT: "3000",
          },
        });

        // Handle stdout and stderr normally
        child.stdout?.on("data", (data) => {
          logs.stdout?.write(data);
        });

        child.stderr?.on("data", (data) => {
          logs.stderr?.write(data);
        });

        try {
          await this.handleChildProcess(child, logs, reportDest, src, "python");

          // Generate prompt files for Python tests
          await generatePromptFiles(reportDest, src);
        } finally {
          this.cleanupPorts(portsToUse);
        }
      } catch (error: any) {
        if (error.message !== "No ports available") {
          console.error(`Error in launchPython for ${src}:`, error);
        }
      }
    })();

    this.addPromiseProcess(
      processId,
      pythonPromise,
      command,
      "bdd-test",
      src,
      "python",
      () => {
        setTimeout(() => this.checkQueue(), 100);
      },
      () => {
        setTimeout(() => this.checkQueue(), 100);
      }
    );
  };

  launchGolang = async (src: string, dest: string) => {
    console.log(ansiC.green(ansiC.inverse(`goland < ${src}`)));

    const processId = `golang-${src}-${Date.now()}`;
    const command = `golang test: ${src}`;

    const golangPromise = (async () => {
      try {
        const { reportDest, testResources, portsToUse } =
          await this.setupTestEnvironment(src, "golang");

        const logs = createLogStreams(reportDest, "golang");

        // For Go tests, we need to run from the directory containing the go.mod file
        // Find the nearest go.mod file by walking up the directory tree
        let currentDir = path.dirname(src);
        let goModDir = null;

        while (currentDir !== path.parse(currentDir).root) {
          if (fs.existsSync(path.join(currentDir, "go.mod"))) {
            goModDir = currentDir;
            break;
          }
          currentDir = path.dirname(currentDir);
        }

        if (!goModDir) {
          console.error(`Could not find go.mod file for test ${src}`);
          // Try running from the test file's directory as a fallback
          goModDir = path.dirname(src);
          console.error(`Falling back to: ${goModDir}`);
        }

        // Get the relative path to the test file from the go.mod directory
        const relativeTestPath = path.relative(goModDir, src);

        // Pass WebSocket port (3000) via environment variable
        // The Go test should connect to WebSocket at ws://localhost:3000
        const child = spawn(
          "go",
          ["test", "-v", "-json", "./" + path.dirname(relativeTestPath)],
          {
            stdio: ["pipe", "pipe", "pipe"],
            env: {
              ...process.env,
              TEST_RESOURCES: testResources,
              WS_PORT: "3000", // Pass WebSocket port
              GO111MODULE: "on",
            },
            cwd: goModDir,
          }
        );

        // Handle stdout and stderr normally
        child.stdout?.on("data", (data) => {
          logs.stdout?.write(data);
        });

        child.stderr?.on("data", (data) => {
          logs.stderr?.write(data);
        });

        await this.handleChildProcess(child, logs, reportDest, src, "golang");

        // Generate prompt files for Golang tests
        generatePromptFiles(reportDest, src);

        // Ensure tests.json exists by parsing the go test JSON output
        processGoTestOutput(reportDest, src);

        this.cleanupPorts(portsToUse);
      } catch (error) {
        if (error.message !== "No ports available") {
          throw error;
        }
      }
    })();

    this.addPromiseProcess(
      processId,
      golangPromise,
      command,
      "bdd-test",
      src,
      "golang",
      () => {
        setTimeout(() => this.checkQueue(), 100);
      },
      () => {
        setTimeout(() => this.checkQueue(), 100);
      }
    );
  };
}
