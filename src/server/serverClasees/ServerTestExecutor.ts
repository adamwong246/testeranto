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
import { IBuiltConfig, IRunTime } from "../../lib";
import configTests from "../configTests";
import { IMode } from "../types";
import { getRunnables } from "../utils";
import { BuildProcessManager } from "./BuildProcessManager";
import { BuildProcessStarter } from "./BuildProcessStarter";
import { ChildProcessHandler } from "./ChildProcessHandler";
import { GolangLauncher } from "./GolangLauncher";
import { NodeLauncher } from "./NodeLauncher";
import { PythonLauncher } from "./PythonLauncher";
import { ServerTaskCoordinator } from "./ServerTaskCoordinator";
import { ServerTestEnvironmentSetup } from "./ServerTestEnvironmentSetup";
import { TestEnvironmentSetup } from "./TestEnvironmentSetup";
import { TypeCheckNotifier } from "./TypeCheckNotifier";
import { WebLauncher } from "./WebLauncher";

export class ServerTestExecutor extends ServerTaskCoordinator {
  launchers: Record<string, () => void>;
  private testEnvironmentSetup: TestEnvironmentSetup;
  private buildProcessManager: BuildProcessManager;
  private buildProcessStarter: BuildProcessStarter;
  private typeCheckNotifier: TypeCheckNotifier;
  protected httpPort: number;
  protected chromiumPort: number;

  constructor(configs: IBuiltConfig, testName: string, mode: IMode) {
    super(configs, testName, mode);

    // Store httpPort and chromiumPort from configs with defaults
    this.httpPort = configs.httpPort || 3456;
    this.chromiumPort = configs.chromiumPort || 4567;

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
      this.addPromiseProcess
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
      this.bddTestIsRunning.bind(this)
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

  // private cleanupTestProcessesInternal(testName: string) {
  //   // Use the integrated process management to clean up processes
  //   // const cleanedProcessIds = this.cleanupTestProcesses(testName);
  //   // if (cleanedProcessIds.length > 0) {
  //   //   console.log(
  //   //     `Cleaned up ${cleanedProcessIds.length} processes for test: ${testName}`
  //   //   );
  //   // }
  // }

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
    console.log(`[launchNode] this.httpPort is ${this.httpPort}`);

    // Use httpPort with fallback to 3456
    const httpPort = this.httpPort || 3456;
    console.log(`[launchNode] Using httpPort ${httpPort}`);

    // Use the extracted NodeLauncher class
    const nodeLauncher = new NodeLauncher(
      httpPort,
      this.setupTestEnvironment.bind(this),
      this.cleanupPorts.bind(this),
      this.handleChildProcess.bind(this),
      this.bddTestIsRunning.bind(this),
      this.bddTestIsNowDone.bind(this),
      this.addPromiseProcess,
      this.checkQueue.bind(this)
    );
    console.log(`[launchNode] NodeLauncher created, calling launchNode method`);
    const result = await nodeLauncher.launchNode(src, dest);
    console.log(`[launchNode] Node test completed: ${src}`);
    return result;
  };

  launchWeb = async (src: string, dest: string) => {
    // Use httpPort with fallback to 3456, chromiumPort with fallback to 4567
    const httpPort = this.httpPort || 3456;
    const chromiumPort = this.chromiumPort || 4567;
    // Use the extracted WebLauncher class
    const webLauncher = new WebLauncher(
      this.projectName,
      httpPort,
      chromiumPort,
      this.bddTestIsRunning.bind(this),
      this.bddTestIsNowDone.bind(this),
      this.addPromiseProcess.bind(this),
      this.checkQueue.bind(this)
    );
    return webLauncher.launchWeb(src, dest);
  };

  launchPython = async (src: string, dest: string) => {
    // Use httpPort with fallback to 3456
    const httpPort = this.httpPort || 3456;
    // Use the extracted PythonLauncher class
    const pythonLauncher = new PythonLauncher(
      this.projectName,
      httpPort,
      this.setupTestEnvironment.bind(this),
      this.handleChildProcess.bind(this),
      this.cleanupPorts.bind(this),
      this.bddTestIsRunning.bind(this),
      this.bddTestIsNowDone.bind(this),
      this.addPromiseProcess.bind(this),
      this.checkQueue.bind(this)
    );
    return pythonLauncher.launchPython(src, dest);
  };

  launchGolang = async (src: string, dest: string) => {
    // Use httpPort with fallback to 3456
    const httpPort = this.httpPort || 3456;
    // Use the extracted GolangLauncher class
    const golangLauncher = new GolangLauncher(
      this.projectName,
      httpPort,
      this.setupTestEnvironment.bind(this),
      this.handleChildProcess.bind(this),
      this.cleanupPorts.bind(this),
      this.bddTestIsRunning.bind(this),
      this.bddTestIsNowDone.bind(this),
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

    // Run the BDD test
    await this.runBddTest(src, runtime, dest);
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
