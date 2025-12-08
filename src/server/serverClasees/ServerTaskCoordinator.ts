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
import fs from "fs";
import { createLogStreams } from "../../clients/utils";
import { IBuiltConfig, IRunTime, ISummary } from "../../Types";
import { getRunnables } from "../utils";
import { Server_DockerCompose } from "./Server_DockerCompose";

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

export class ServerTaskCoordinator extends Server_DockerCompose {
  // queueManager: QueueManager;
  // portManager: PortManager;
  // processManager: ProcessManager = new ProcessManager();
  // metafileManager: MetafileManager = new MetafileManager();

  logStreams: Record<string, ReturnType<typeof createLogStreams>> = {};
  launchers: Record<string, () => void>;
  clients: Set<any> = new Set();
  connected: boolean;
  private queue: Array<{
    testName: string;
    runtime: IRunTime;
    addableFiles?: string[];
  }> = [];

  // Process management fields
  private runningProcesses: Map<string, ChildProcess | Promise<any>> =
    new Map();
  private allProcesses: Map<string, ProcessInfo> = new Map();
  private processLogs: Map<string, string[]> = new Map();
  private processingQueue: boolean = false;
  ports: Record<number, string> = {};

  // private ports: Record<number, string> = {};

  constructor(configs: IBuiltConfig, testName: string, mode: string) {
    super(process.cwd(), configs, testName, mode);

    // Initialize ports if configs.ports exists
    if (configs.ports && Array.isArray(configs.ports)) {
      configs.ports.forEach((port) => {
        this.ports[port] = ""; // set ports as open
      });
    }

    this.launchers = {};
  }

  // SummaryManager methods
  ensureSummaryEntry(src: string, isSidecar = false) {
    ensureSummaryEntry(this.summary, src, isSidecar);
    return this.summary[src];
  }

  getSummary() {
    return this.summary;
  }

  setSummary(summary: ISummary) {
    this.summary = summary;
  }

  updateSummaryEntry(
    src: string,
    updates: Partial<{
      typeErrors: number | "?" | undefined;
      staticErrors: number | "?" | undefined;
      runTimeErrors: number | "?" | undefined;
      prompt: string | "?" | undefined;
      failingFeatures: object | undefined;
    }>
  ) {
    if (!this.summary[src]) {
      this.ensureSummaryEntry(src);
    }
    this.summary[src] = { ...this.summary[src], ...updates };
  }

  writeBigBoard = () => {
    const summaryPath = `./testeranto/reports/${this.projectName}/summary.json`;
    const summaryData = JSON.stringify(this.summary, null, 2);
    fs.writeFileSync(summaryPath, summaryData);

    // Broadcast the update if WebSocket is available
    if (this.webSocketBroadcastMessage) {
      this.webSocketBroadcastMessage({
        type: "summaryUpdate",
        data: this.summary,
      });
    }
  };

  typeCheckIsRunning(src: string) {
    this.updateSummaryEntry(src, { typeErrors: "?" });
  }

  typeCheckIsNowDone(src: string, failures: number) {
    this.updateSummaryEntry(src, { typeErrors: failures });
  }

  lintIsRunning(src: string) {
    this.updateSummaryEntry(src, { staticErrors: "?" });
  }

  lintIsNowDone(src: string, failures: number) {
    this.updateSummaryEntry(src, { staticErrors: failures });
  }

  bddTestIsNowDone(src: string, failures: number) {
    this.updateSummaryEntry(src, { runTimeErrors: failures });
    this.writeBigBoard();
    this.checkForShutdown();
  }

  currentBuildResolve: (() => void) | null = null;
  currentBuildReject: ((error: any) => void) | null = null;

  webSocketBroadcastMessage(message: any) {
    const data =
      typeof message === "string" ? message : JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(data);
      }
    });
  }

  async stop() {
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

  private cleanupTestProcessesInternal(testName: string) {
    // Use the integrated process management to clean up processes
    // const cleanedProcessIds = this.cleanupTestProcesses(testName);
    // if (cleanedProcessIds.length > 0) {
    //   console.log(
    //     `Cleaned up ${cleanedProcessIds.length} processes for test: ${testName}`
    //   );
    // }
  }

  protected async processQueueItem(
    testName: string,
    runtime: IRunTime,
    addableFiles?: string[]
  ): Promise<void> {
    // This method should be overridden by derived classes
    throw new Error(`processQueueItem should be implemented by derived class for ${testName} (${runtime})`);
  }

  checkQueue = async () => {
    // Don't start processing if we're already processing
    if (this.processingQueue) {
      return;
    }

    this.processingQueue = true;

    try {
      while (this.queue.length > 0) {
        // Get the next test from the queue (FIFO)
        const item = this.queue.shift();
        if (!item) {
          continue;
        }

        const { testName, runtime, addableFiles } = item;

        console.log(
          ansiC.blue(
            ansiC.inverse(`Processing ${testName} (${runtime}) from queue`)
          )
        );

        try {
          await this.processQueueItem(testName, runtime, addableFiles);
        } catch (error) {
          console.error(
            ansiC.red(`Error executing test ${testName} (${runtime}): ${error}`)
          );
        }

        // Update the queue after processing
        this.writeBigBoard();
      }
    } finally {
      this.processingQueue = false;
    }

    // Check if we should shut down after processing all tests
    this.checkForShutdown();
  };

  checkForShutdown = async () => {
    // First, check the queue
    this.checkQueue();

    console.log(
      ansiC.inverse(
        `The following jobs are awaiting resources: ${JSON.stringify(
          this.getAllQueueItems()
        )}`
      )
    );

    this.writeBigBoard();

    if (this.mode === "dev") return;

    let inflight = false;
    const summary = this.getSummary();

    Object.keys(summary).forEach((k) => {
      if (summary[k].prompt === "?") {
        console.log(ansiC.blue(ansiC.inverse(`🕕 prompt ${k}`)));
        inflight = true;
      }
    });

    Object.keys(summary).forEach((k) => {
      if (summary[k].runTimeErrors === "?") {
        console.log(ansiC.blue(ansiC.inverse(`🕕 runTimeError ${k}`)));
        inflight = true;
      }
    });

    Object.keys(summary).forEach((k) => {
      if (summary[k].staticErrors === "?") {
        console.log(ansiC.blue(ansiC.inverse(`🕕 staticErrors ${k}`)));
        inflight = true;
      }
    });

    Object.keys(summary).forEach((k) => {
      if (summary[k].typeErrors === "?") {
        console.log(ansiC.blue(ansiC.inverse(`🕕 typeErrors ${k}`)));
        inflight = true;
      }
    });

    this.writeBigBoard();

    // Check if we should shut down
    if (!inflight) {
      // Check if there are any processes still running
      const hasRunningProcesses = Array.from(this.allProcesses.values()).some(
        (process) => process.status === "running"
      );

      // Check if the queue is empty
      const isQueueEmpty = this.queueLength === 0;

      if (!hasRunningProcesses && isQueueEmpty) {
        console.log(
          ansiC.inverse(`${this.projectName} has been tested. Goodbye.`)
        );
        // Optionally, we could exit the process
        // process.exit();
      }
    }
  };


  // QueueManager methods
  addToQueue(
    src: string,
    runtime: IRunTime,
    configs: any,
    projectName: string,
    cleanupTestProcesses: (testName: string) => void,
    checkQueue: () => void,
    addableFiles?: string[]
  ) {
    // Store the original src for logging
    const originalSrc = src;

    // Ensure we're using the original test source path, not a bundle path
    // The src parameter might be a bundle path from metafile changes
    // We need to find the corresponding test source path

    // First, check if this looks like a bundle path (contains 'testeranto/bundles')
    if (src.includes("testeranto/bundles")) {
      // Try to find the original test name that corresponds to this bundle
      const runnables = getRunnables(configs, projectName);
      const allEntryPoints = [
        ...Object.entries(runnables.nodeEntryPoints),
        ...Object.entries(runnables.webEntryPoints),
        ...Object.entries(runnables.pythonEntryPoints),
        ...Object.entries(runnables.golangEntryPoints),
      ];

      // Normalize the source path for comparison
      const normalizedSrc = src.replace(/\\/g, "/");

      // First, try to match by extracting the test name from the bundle path
      // Pattern: .../testeranto/bundles/{runtime}/{projectName}/{testPath}.mjs
      const bundlePattern = new RegExp(
        `testeranto/bundles/${runtime}/${projectName}/(.+\\.)mjs$`
      );
      const match = normalizedSrc.match(bundlePattern);
      if (match) {
        // Reconstruct the test name by replacing .mjs with .ts
        const testNameWithoutExt = match[1].slice(0, -1); // Remove trailing dot
        const potentialTestName = testNameWithoutExt + ".ts";

        // Verify this test name exists in the entry points
        for (const [testName, bundlePath] of allEntryPoints) {
          if (testName === potentialTestName) {
            src = testName;
            console.log(
              "Mapped bundle path to test name:",
              originalSrc,
              "->",
              src
            );
            break;
          }
        }
      }

      // If we still haven't found a match, try the original approach
      if (src === originalSrc) {
        for (const [testName, bundlePath] of allEntryPoints) {
          const normalizedBundlePath = (bundlePath as string).replace(
            /\\/g,
            "/"
          );
          // Check if the source path ends with the bundle path
          if (normalizedSrc.endsWith(normalizedBundlePath)) {
            src = testName;
            console.log("Fallback mapping:", originalSrc, "->", src);
            break;
          }
        }
      }
    }

    // First, clean up any existing processes for this test
    this.cleanupTestProcessesInternal(src);

    // Add the test to the queue (using the original test source path and runtime)
    // Make sure we don't add duplicates (consider both name and runtime)
    const alreadyInQueue = this.queue.some(
      (item) => item.testName === src && item.runtime === runtime
    );

    if (!alreadyInQueue) {
      this.queue.push({ testName: src, runtime, addableFiles });
      console.log(
        ansiC.green(
          ansiC.inverse(`Added ${src} (${runtime}) to the processing queue`)
        )
      );
      // Try to process the queue
      checkQueue();
    } else {
      console.log(
        ansiC.yellow(
          ansiC.inverse(
            `Test ${src} (${runtime}) is already in the queue, skipping`
          )
        )
      );
    }
  }

  pop():
    | { testName: string; runtime: IRunTime; addableFiles?: string[] }
    | undefined {
    return this.queue.pop();
  }

  includes(testName: string, runtime?: IRunTime): boolean {
    if (runtime !== undefined) {
      return this.queue.some(
        (item) => item.testName === testName && item.runtime === runtime
      );
    }
    return this.queue.some((item) => item.testName === testName);
  }

  get queueLength(): number {
    return this.queue.length;
  }

  clearQueue(): void {
    this.queue = [];
  }

  getAllQueueItems(): Array<{
    testName: string;
    runtime: IRunTime;
    addableFiles?: string[];
  }> {
    return [...this.queue];
  }

  allocatePorts(numPorts: number, testName: string): number[] | null {
    const openPorts = Object.entries(this.ports)
      .filter(([, status]) => status === "")
      .map(([port]) => parseInt(port));

    if (openPorts.length >= numPorts) {
      const allocatedPorts = openPorts.slice(0, numPorts);
      allocatedPorts.forEach((port) => {
        this.ports[port] = testName;
      });
      return allocatedPorts;
    }
    return null;
  }

  releasePorts(ports: number[]) {
    ports.forEach((port) => {
      this.ports[port] = "";
    });
  }

  getPortStatus() {
    return { ...this.ports };
  }

  isPortAvailable(port: number): boolean {
    return this.ports[port] === "";
  }

  getPortOwner(port: number): string | null {
    return this.ports[port] || null;
  }

  // Add promise process tracking
  addPromiseProcess = (
    processId: string,
    promise: Promise<any>,
    command: string,
    category: ProcessCategory,
    testName?: string,
    platform?: IRunTime
  ) => {
    // Store the process info
    const processInfo: ProcessInfo = {
      promise,
      status: "running",
      command,
      timestamp: new Date().toISOString(),
      type: "promise",
      category,
      testName,
      platform: platform || "node",
    };

    this.allProcesses.set(processId, processInfo);
    this.runningProcesses.set(processId, promise);

    // Set up promise completion handlers
    promise
      .then(() => {
        const info = this.allProcesses.get(processId);
        if (info) {
          info.status = "completed";
          info.exitCode = 0;
        }
        this.runningProcesses.delete(processId);
      })
      .catch((error) => {
        const info = this.allProcesses.get(processId);
        if (info) {
          info.status = "error";
          info.exitCode = -1;
          info.error = error.message;
        }
        this.runningProcesses.delete(processId);
      });

    // Broadcast process update if WebSocket is available
    if (this.webSocketBroadcastMessage) {
      this.webSocketBroadcastMessage({
        type: "processUpdate",
        processId,
        process: processInfo,
      });
    }
  };
}
