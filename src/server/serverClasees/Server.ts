// This is a process manager which needs to be refactored. It is ATM broken
// ATM, there are 3 checks for web and node tests- tsc check, lint check, and the bdd test
// ATM, these 3 processes are scheduled separatly
// We need to redo this process manager such that these processes are now executed together
// Before if we had 2 tests, there would be 2 * 3 processes
// We need to redo this so that there are only 3 processes scheduled

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { default as ansiC } from "ansi-colors";
import { ChildProcess } from "child_process";
import fs, { watch } from "fs";
import path from "path";
import puppeteer, { executablePath } from "puppeteer-core";
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
import { ISummary, IBuiltConfig, IRunTime } from "../../Types";
import { checkForShutdown } from "../docker/ProcessManager/checkForShutdown";
import configTests from "../configTests";
import { ensureSummaryEntry } from "./../docker/ProcessManager/ensureSummaryEntry";
import { pythonLintCheck } from "../python/pythonLintCheck";
import { pythonTypeCheck } from "../python/pythonTypeCheck";
import { getRunnables } from "../utils";
import { Server_DockerCompose } from "./Server_DockerCompose";
import { ChildProcessHandler } from "./ChildProcessHandler";
import { TestEnvironmentSetup } from "./TestEnvironmentSetup";
import { WebLauncher } from "./WebLauncher";
import { NodeLauncher } from "./NodeLauncher";
import { BuildProcessManager } from "./BuildProcessManager";
import { BuildProcessStarter } from "./BuildProcessStarter";
import { PythonLauncher } from "./PythonLauncher";
import { GolangLauncher } from "./GolangLauncher";
import { EntrypointFinder } from "./EntrypointFinder";
import { TscCheck } from "./TscCheck";
import { EslintCheck } from "./EslintCheck";
import { ServerTestEnvironmentSetup } from "./ServerTestEnvironmentSetup";
import { TypeCheckNotifier } from "./TypeCheckNotifier";

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

  private testEnvironmentSetup: TestEnvironmentSetup;
  private buildProcessManager: BuildProcessManager;
  private buildProcessStarter: BuildProcessStarter;
  private typeCheckNotifier: TypeCheckNotifier;

  constructor(configs: IBuiltConfig, testName: string, mode: string) {
    super(process.cwd(), configs, testName, mode);

    this.launchers = {};

    this.testName = testName;
    this.composeDir = process.cwd();
    this.composeFile = path.join(
      this.composeDir,
      "testeranto",
      "bundles",
      `${this.testName}-docker-compose.yml`
    );

    // Initialize TestEnvironmentSetup
    // Note: ports, browser, and queue will be set later
    // We'll need to update them when they're available
    this.testEnvironmentSetup = new TestEnvironmentSetup(
      this.ports,
      this.projectName,
      this.browser,
      this.queue
    );

    // Initialize BuildProcessManager
    this.buildProcessManager = new BuildProcessManager(
      this.projectName,
      this.configs,
      this.mode,
      this.webSocketBroadcastMessage.bind(this),
      this.addPromiseProcess?.bind(this)
    );
    // Initialize BuildProcessStarter
    this.buildProcessStarter = new BuildProcessStarter(
      this.projectName,
      this.configs,
      this.buildProcessManager
    );

    // Initialize TypeCheckNotifier
    this.typeCheckNotifier = new TypeCheckNotifier(
      this.summary,
      this.writeBigBoard.bind(this),
      this.checkForShutdown.bind(this)
    );
  }

  currentBuildResolve: (() => void) | null = null;
  currentBuildReject: ((error: any) => void) | null = null;

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
    const serverTestEnvironmentSetup = new ServerTestEnvironmentSetup(
      this.ports,
      this.projectName,
      this.browser,
      this.queue,
      this.configs,
      this.bddTestIsRunning
    );
    return serverTestEnvironmentSetup.setupTestEnvironment(src, runtime);
  }

  private cleanupPorts(portsToUse: string[]) {
    this.testEnvironmentSetup.cleanupPorts(portsToUse);
  }

  private handleChildProcess(
    child: ChildProcess,
    logs: LogStreams,
    reportDest: string,
    src: string,
    runtime: IRunTime
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Use the extracted ChildProcessHandler
      ChildProcessHandler.handleChildProcess(
        child,
        logs,
        reportDest,
        src,
        runtime
      )
        .then(() => {
          // On success, update status
          this.bddTestIsNowDone(src, 0);
          statusMessagePretty(0, src, runtime);
          resolve();
        })
        .catch((error) => {
          // On error, update status appropriately
          if (error.message.startsWith("Process exited with code")) {
            const exitCode = parseInt(error.message.match(/\d+/)?.[0] || "-1");
            this.bddTestIsNowDone(src, exitCode);
            statusMessagePretty(exitCode, src, runtime);
          } else {
            this.bddTestIsNowDone(src, -1);
            statusMessagePretty(-1, src, runtime);
          }
          reject(error);
        });
    });
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

  private findTestNameByEntrypoint(
    entrypoint: string,
    platform: IRunTime
  ): string | null {
    const finder = new EntrypointFinder(this.configs, this.projectName);
    return finder.findTestNameByEntrypoint(entrypoint, platform);
  }

  async start() {
    // Wait for build processes to complete first
    try {
      await this.buildProcessStarter.startBuildProcesses();

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

  // private cleanupTestProcesses(testName: string) {
  //   const processesToCleanup =
  //     this.processManager.cleanupTestProcesses(testName);

  //   // Broadcast process exit for each cleaned up process
  //   processesToCleanup.forEach((processId) => {
  //     this.webSocketBroadcastMessage({
  //       type: "processExited",
  //       processId,
  //       exitCode: -1,
  //       timestamp: new Date().toISOString(),
  //       logs: ["Process killed due to source file change"],
  //     });
  //   });
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

  // private ensureSummaryEntry(src: string, isSidecar = false) {
  //   ensureSummaryEntry(this.summary, src, isSidecar);
  //   return this.summary[src];
  // }

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

  private tscCheckInstance: TscCheck | null = null;

  private getTscCheck(): TscCheck {
    if (!this.tscCheckInstance) {
      this.tscCheckInstance = new TscCheck(
        this.projectName,
        this.typeCheckIsRunning,
        this.typeCheckIsNowDone,
        this.addPromiseProcess.bind(this)
      );
    }
    return this.tscCheckInstance;
  }

  tscCheck = async ({
    entrypoint,
    addableFiles,
    platform,
  }: {
    entrypoint: string;
    addableFiles: string[];
    platform: IRunTime;
  }): Promise<void> => {
    return this.getTscCheck().tscCheck({
      entrypoint,
      addableFiles,
      platform,
    });
  };

  private eslintCheckInstance: EslintCheck | null = null;

  private getEslintCheck(): EslintCheck {
    if (!this.eslintCheckInstance) {
      this.eslintCheckInstance = new EslintCheck(
        this.projectName,
        this.lintIsRunning,
        this.lintIsNowDone,
        this.addPromiseProcess.bind(this),
        this.writeBigBoard.bind(this),
        this.checkForShutdown.bind(this)
      );
    }
    return this.eslintCheckInstance;
  }

  eslintCheck = async ({
    entrypoint,
    addableFiles,
    platform,
  }: {
    entrypoint: string;
    addableFiles: string[];
    platform: IRunTime;
  }) => {
    return this.getEslintCheck().eslintCheck({
      entrypoint,
      addableFiles,
      platform,
    });
  };

  typeCheckIsRunning = (src: string) => {
    this.summaryManager.ensureSummaryEntry(src);
    this.summary[src].typeErrors = "?";
  };

  typeCheckIsNowDone = (src: string, failures: number) => {
    this.typeCheckNotifier.typeCheckIsNowDone(src, failures);
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

  launchNode = async (src: string, dest: string) => {
    // Use the extracted NodeLauncher class
    const nodeLauncher = new NodeLauncher(
      this.projectName,
      this.setupTestEnvironment.bind(this),
      this.cleanupPorts.bind(this),
      this.handleChildProcess.bind(this),
      this.bddTestIsRunning,
      this.bddTestIsNowDone,
      this.addPromiseProcess.bind(this),
      this.checkQueue.bind(this)
    );
    return nodeLauncher.launchNode(src, dest);
  };

  launchWeb = async (src: string, dest: string) => {
    // Use the extracted WebLauncher class
    const webLauncher = new WebLauncher(
      this.projectName,
      this.browser,
      this.bddTestIsRunning,
      this.bddTestIsNowDone,
      this.addPromiseProcess.bind(this),
      this.checkQueue.bind(this)
    );
    return webLauncher.launchWeb(src, dest);
  };

  launchPython = async (src: string, dest: string) => {
    // Use the extracted PythonLauncher class
    const pythonLauncher = new PythonLauncher(
      this.projectName,
      this.setupTestEnvironment.bind(this),
      this.handleChildProcess.bind(this),
      this.cleanupPorts.bind(this),
      this.bddTestIsRunning,
      this.bddTestIsNowDone,
      this.addPromiseProcess.bind(this),
      this.checkQueue.bind(this)
    );
    return pythonLauncher.launchPython(src, dest);
  };

  launchGolang = async (src: string, dest: string) => {
    // Use the extracted GolangLauncher class
    const golangLauncher = new GolangLauncher(
      this.projectName,
      this.setupTestEnvironment.bind(this),
      this.handleChildProcess.bind(this),
      this.cleanupPorts.bind(this),
      this.bddTestIsRunning,
      this.bddTestIsNowDone,
      this.addPromiseProcess.bind(this),
      this.checkQueue.bind(this)
    );
    return golangLauncher.launchGolang(src, dest);
  };
}
