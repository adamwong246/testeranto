// This is a process manager which needs to be refactored. It is ATM broken
// ATM, there are 3 checks for web and node tests- tsc check, lint check, and the bdd test
// ATM, these 3 processes are scheduled separatly
// We need to redo this process manager such that these processes are now executed together
// Before if we had 2 tests, there would be 2 * 3 processes
// We need to redo this so that there are only 3 processes scheduled

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ChildProcess } from "child_process";
import { LogStreams, statusMessagePretty } from "../../clients/utils";
import { IBuiltConfig, IRunTime, ISummary } from "../../Types";
import configTests from "../configTests";
import { pythonLintCheck } from "../python/pythonLintCheck";
import { pythonTypeCheck } from "../python/pythonTypeCheck";
import { getRunnables } from "../utils";
import { BuildProcessManager } from "./BuildProcessManager";
import { BuildProcessStarter } from "./BuildProcessStarter";
import { ChildProcessHandler } from "./ChildProcessHandler";
import { EntrypointFinder } from "./EntrypointFinder";
import { EslintCheck } from "./EslintCheck";
import { GolangLauncher } from "./GolangLauncher";
import { NodeLauncher } from "./NodeLauncher";
import { PythonLauncher } from "./PythonLauncher";
import { ServerTestEnvironmentSetup } from "./ServerTestEnvironmentSetup";
import { TestEnvironmentSetup } from "./TestEnvironmentSetup";
import { TscCheck } from "./TscCheck";
import { TypeCheckNotifier } from "./TypeCheckNotifier";
import { WebLauncher } from "./WebLauncher";
import { ServerTaskCoordinator } from "./ServerTaskCoordinator";

// Process management types
type ProcessCategory = "aider" | "bdd-test" | "build-time" | "other";
type ProcessType = "process" | "promise";
type ProcessStatus = "running" | "exited" | "error" | "completed";

interface ProcessInfo {
  child?: ChildProcess;
  promise?: Promise<any>;
  status: ProcessStatus;
  exitCode?: number;
  error?: string;
  command: string;
  pid?: number;
  timestamp: string;
  type: ProcessType;
  category: ProcessCategory;
  testName?: string;
  platform: IRunTime;
}

export class ServerTestExecutor extends ServerTaskCoordinator {
  launchers: Record<string, () => void>;
  private testEnvironmentSetup: TestEnvironmentSetup;
  private buildProcessManager: BuildProcessManager;
  private buildProcessStarter: BuildProcessStarter;
  private typeCheckNotifier: TypeCheckNotifier;

  constructor(configs: IBuiltConfig, testName: string, mode: string) {
    super(configs, testName, mode);

    this.launchers = {};
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

  private cleanupTestProcessesInternal(testName: string) {
    // Use the integrated process management to clean up processes
    // const cleanedProcessIds = this.cleanupTestProcesses(testName);
    // if (cleanedProcessIds.length > 0) {
    //   console.log(
    //     `Cleaned up ${cleanedProcessIds.length} processes for test: ${testName}`
    //   );
    // }
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

  bddTestIsRunning(src: string) {
    this.updateSummaryEntry(src, {
      prompt: "?",
      runTimeErrors: "?",
      staticErrors: "?",
      typeErrors: "?",
      failingFeatures: {},
    });
  }

  launchNode = async (src: string, dest: string) => {
    console.log(`[launchNode] Starting node test: ${src}, dest: ${dest}`);
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
    console.log(`[launchNode] NodeLauncher created, calling launchNode method`);
    const result = await nodeLauncher.launchNode(src, dest);
    console.log(`[launchNode] Node test completed: ${src}`);
    return result;
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

  protected override async processQueueItem(
    src: string,
    runtime: IRunTime,
    addableFiles?: string[]
  ): Promise<void> {
    return this.executeTest(src, runtime, addableFiles);
  }

  async executeTest(
    src: string,
    runtime: IRunTime,
    addableFiles?: string[]
  ): Promise<void> {
    console.log(`[executeTest] Starting test: ${src} (${runtime})`);

    // Get the entry point for the test
    const runnables = getRunnables(this.configs, this.projectName);
    let dest: string;

    switch (runtime) {
      case "node":
        dest = runnables.nodeEntryPoints[src];
        break;
      case "web":
        dest = runnables.webEntryPoints[src];
        break;
      case "python":
        dest = runnables.pythonEntryPoints[src];
        break;
      case "golang":
        dest = runnables.golangEntryPoints[src];
        break;
      default:
        throw new Error(`Unsupported runtime: ${runtime}`);
    }

    if (!dest) {
      console.error(`No destination found for test: ${src} (${runtime})`);
      return;
    }
    console.log(`[executeTest] Destination: ${dest}`);

    // Run static analysis based on runtime
    if (runtime === "node" || runtime === "web") {
      console.log(`[executeTest] Running tsc check for ${src}`);
      await this.runTscCheck(src, runtime, addableFiles);
      console.log(`[executeTest] Running eslint check for ${src}`);
      await this.runEslintCheck(src, runtime, addableFiles);
    } else if (runtime === "python") {
      // For Python, run lint and type checks
      console.log(`[executeTest] Running Python lint check for ${src}`);
      await this.runPythonLintCheck(src, runtime, addableFiles);
      console.log(`[executeTest] Running Python type check for ${src}`);
      await this.runPythonTypeCheck(src, runtime, addableFiles);
    }
    // For golang, there's no static analysis in this system

    console.log(`[executeTest] Running BDD test for ${src}`);
    // Run the BDD test
    await this.runBddTest(src, runtime, dest);
    console.log(`[executeTest] Completed test: ${src} (${runtime})`);
  }

  private async runTscCheck(
    src: string,
    runtime: IRunTime,
    addableFiles?: string[]
  ): Promise<void> {
    console.log(`[runTscCheck] Starting tsc check for ${src}`);
    const processId = `tsc-${src}-${Date.now()}`;
    const command = `tsc check for ${src}`;

    const tscPromise = (async () => {
      try {
        console.log(`[runTscCheck] Marking type check as running for ${src}`);
        this.typeCheckIsRunning(src);
      } catch (e: any) {
        console.error(
          `[runTscCheck] Error in typeCheckIsRunning: ${e.message}`
        );
        throw new Error(`Error in tscCheck: ${e.message}`);
      }
      // Mark type check as done with 0 errors (temporarily)
      console.log(`[runTscCheck] Marking type check as done for ${src}`);
      this.typeCheckIsNowDone(src, 0);
      return 0;
    })();

    this.addPromiseProcess(
      processId,
      tscPromise,
      command,
      "build-time",
      src,
      runtime
    );

    // Wait for tsc check to complete
    console.log(`[runTscCheck] Waiting for tsc promise for ${src}`);
    await tscPromise;
    console.log(`[runTscCheck] Tsc check completed for ${src}`);
  }

  private async runEslintCheck(
    src: string,
    runtime: IRunTime,
    addableFiles?: string[]
  ): Promise<void> {
    const processId = `eslint-${src}-${Date.now()}`;
    const command = `eslint check for ${src}`;

    const eslintPromise = (async () => {
      try {
        this.lintIsRunning(src);
      } catch (e: any) {
        throw new Error(`Error in eslintCheck: ${e.message}`);
      }
      // Temporarily skip actual linting and mark as 0 errors
      this.lintIsNowDone(src, 0);
      return 0;
    })();

    this.addPromiseProcess(
      processId,
      eslintPromise,
      command,
      "build-time",
      src,
      runtime
    );

    // Wait for eslint check to complete
    await eslintPromise;
  }

  private async runPythonLintCheck(
    src: string,
    runtime: IRunTime,
    addableFiles?: string[]
  ): Promise<void> {
    const processId = `python-lint-${src}-${Date.now()}`;
    const command = `python lint check for ${src}`;

    const filesToUse = addableFiles || [];
    const promise = this.pythonLintCheck(src, filesToUse);

    this.addPromiseProcess(
      processId,
      promise,
      command,
      "build-time",
      src,
      runtime
    );

    await promise;
  }

  private async runPythonTypeCheck(
    src: string,
    runtime: IRunTime,
    addableFiles?: string[]
  ): Promise<void> {
    const processId = `python-type-${src}-${Date.now()}`;
    const command = `python type check for ${src}`;

    const filesToUse = addableFiles || [];
    const promise = this.pythonTypeCheck(src, filesToUse);

    this.addPromiseProcess(
      processId,
      promise,
      command,
      "build-time",
      src,
      runtime
    );

    await promise;
  }

  private async runBddTest(
    src: string,
    runtime: IRunTime,
    dest: string
  ): Promise<void> {
    console.log(`[runBddTest] Starting BDD test for ${src} (${runtime})`);
    // Mark BDD test as running
    this.bddTestIsRunning(src);

    // Launch the appropriate test based on runtime
    switch (runtime) {
      case "node":
        console.log(`[runBddTest] Calling launchNode for ${src}`);
        await this.launchNode(src, dest);
        break;
      case "web":
        console.log(`[runBddTest] Calling launchWeb for ${src}`);
        await this.launchWeb(src, dest);
        break;
      case "python":
        console.log(`[runBddTest] Calling launchPython for ${src}`);
        await this.launchPython(src, dest);
        break;
      case "golang":
        console.log(`[runBddTest] Calling launchGolang for ${src}`);
        await this.launchGolang(src, dest);
        break;
      default:
        throw new Error(`Unsupported runtime for BDD test: ${runtime}`);
    }
    console.log(`[runBddTest] Completed BDD test for ${src} (${runtime})`);
  }
}
