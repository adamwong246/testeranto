/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { default as ansiC } from "ansi-colors";
import { WebSocket } from "ws";
import { getRunnables } from "../utils";
import { ServerTaskManager } from "./ServerTaskManager";
import { IMode } from "../types";
import { IRunTime, IBuiltConfig } from "../../Types";
import { ITTestResourceConfiguration } from "../../../lib/index";

export class ServerTaskCoordinator extends ServerTaskManager {
  private queue: Array<{
    testName: string;
    runtime: IRunTime;
    addableFiles?: string[];
  }> = [];
  private processingQueue: boolean = false;

  private testSchedulingQueue: Array<{
    testId: string;
    testName: string;
    runtime: IRunTime;
    ws: any;
    timestamp: Date;
  }> = [];
  private processingSchedulingQueue: boolean = false;

  constructor(configs: IBuiltConfig, testName: string, mode: IMode) {
    super(configs, testName, mode);
  }

  // Method to add test to scheduling queue (called from WebSocket handler)
  public addTestToSchedulingQueue(
    testId: string,
    testName: string,
    runtime: IRunTime,
    ws: any
  ): void {
    console.log(
      `[SCHEDULING] addTestToSchedulingQueue called for test ${testId} (${testName})`
    );
    // Check if test is already in queue
    const alreadyInQueue = this.testSchedulingQueue.some(
      (item) => item.testId === testId
    );
    if (!alreadyInQueue) {
      this.testSchedulingQueue.push({
        testId,
        testName,
        runtime,
        ws,
        timestamp: new Date(),
      });
      console.log(
        `[SCHEDULING] Added test ${testName} (${testId}) to scheduling queue. Queue length: ${this.testSchedulingQueue.length}`
      );
      // Try to process the scheduling queue
      this.processSchedulingQueue();
    } else {
      console.log(
        `[SCHEDULING] Test ${testName} (${testId}) is already in scheduling queue`
      );
    }
  }

  // Process the scheduling queue to allocate test resources
  private async processSchedulingQueue(): Promise<void> {
    console.log(
      `[SCHEDULING] processSchedulingQueue called. Queue length: ${this.testSchedulingQueue.length}, processing: ${this.processingSchedulingQueue}`
    );
    if (
      this.processingSchedulingQueue ||
      this.testSchedulingQueue.length === 0
    ) {
      console.log(
        `[SCHEDULING] Skipping processing: processing=${
          this.processingSchedulingQueue
        }, empty=${this.testSchedulingQueue.length === 0}`
      );
      return;
    }

    this.processingSchedulingQueue = true;
    console.log(`[SCHEDULING] Started processing scheduling queue`);

    try {
      while (this.testSchedulingQueue.length > 0) {
        const item = this.testSchedulingQueue.shift();
        if (!item) continue;

        const { testId, testName, runtime, ws } = item;

        console.log(
          `[SCHEDULING] Processing test ${testName} (${testId}) from scheduling queue`
        );

        // Allocate test resources based on runtime
        let allocatedPorts: number[] | null = null;
        const testResourceConfiguration: any = {
          name: testName,
          fs: process.cwd(),
          ports: [],
          timeout: 30000,
          retries: 3,
          environment: {},
        };

        // Allocate ports based on runtime requirements
        switch (runtime) {
          case "web":
            allocatedPorts = this.allocatePorts(2, testName); // Web tests often need multiple ports
            testResourceConfiguration.ports = allocatedPorts || [3000, 3001];
            testResourceConfiguration.browserWSEndpoint =
              process.env.BROWSER_WS_ENDPOINT || "";
            break;
          case "node":
            allocatedPorts = this.allocatePorts(1, testName);
            testResourceConfiguration.ports = allocatedPorts || [3000];
            break;
          case "python":
            allocatedPorts = this.allocatePorts(1, testName);
            testResourceConfiguration.ports = allocatedPorts || [3000];
            break;
          case "golang":
            allocatedPorts = this.allocatePorts(1, testName);
            testResourceConfiguration.ports = allocatedPorts || [3000];
            break;
          default:
            allocatedPorts = this.allocatePorts(1, testName);
            testResourceConfiguration.ports = allocatedPorts || [3000];
        }

        console.log(
          `[SCHEDULING] Allocated ports for test ${testId}:`,
          allocatedPorts
        );

        const testResource = {
          testId,
          testName,
          runtime,
          allocatedAt: new Date().toISOString(),
          testResourceConfiguration,
          // Add the test to the main processing queue
          shouldExecute: true,
        };

        console.log(
          `[SCHEDULING] Prepared test resource for test ${testId}:`,
          testResource
        );

        // Send test resource to the test via WebSocket
        console.log(`[SCHEDULING] Checking WebSocket readyState for test ${testId}: ${ws.readyState}`);
        if (ws.readyState === WebSocket.OPEN) {
          // Prepare the test resource configuration according to ITTestResourceConfiguration
          const testResourceConfig: ITTestResourceConfiguration = {
            name: testName,
            fs: process.cwd(),
            ports: testResourceConfiguration.ports,
            timeout: testResourceConfiguration.timeout,
            retries: testResourceConfiguration.retries,
            environment: testResourceConfiguration.environment,
          };
          // Add browserWSEndpoint for web runtime
          if (runtime === 'web' && testResourceConfiguration.browserWSEndpoint) {
            testResourceConfig.browserWSEndpoint = testResourceConfiguration.browserWSEndpoint;
          }
          
          const message = {
            type: "testResource",
            data: {
              testId,
              testName,
              runtime,
              allocatedAt: new Date().toISOString(),
              testResourceConfiguration: testResourceConfig,
            },
            timestamp: new Date().toISOString(),
          };
          console.log(
            `[SCHEDULING] Sending test resource to test ${testId}:`,
            JSON.stringify(message, null, 2)
          );
          try {
            ws.send(JSON.stringify(message));
            console.log(
              `[SCHEDULING] Sent test resource to test ${testName} (${testId})`
            );
            // Do NOT add to the main processing queue - the client will handle execution
          } catch (error) {
            console.error(`[SCHEDULING] Error sending test resource:`, error);
            // Put back in queue or handle error
            console.log(
              `[SCHEDULING] Putting test ${testId} back to the front of the queue due to send error`
            );
            this.testSchedulingQueue.unshift(item);
          }
        } else {
          console.warn(
            `[SCHEDULING] WebSocket for test ${testName} (${testId}) is not open (readyState: ${ws.readyState}), cannot send resource`
          );
          // Put back in queue or handle error
          console.log(
            `[SCHEDULING] Putting test ${testId} back to the front of the queue`
          );
          this.testSchedulingQueue.unshift(item);
        }
      }
    } finally {
      this.processingSchedulingQueue = false;
      console.log(
        `[SCHEDULING] Finished processing scheduling queue. Remaining items: ${this.testSchedulingQueue.length}`
      );
    }
  }

  // Override to ensure we have access to the method from WebSocket handler
  // We'll add a getter to access addTestToSchedulingQueue
  getSchedulingQueueMethod() {
    return this.addTestToSchedulingQueue.bind(this);
  }

  // Override scheduleTestForExecution to use the scheduling queue
  protected scheduleTestForExecution(
    testId: string,
    testName: string,
    runtime: any,
    ws: any
  ): void {
    console.log(
      `[ServerTaskCoordinator] scheduleTestForExecution called for test ${testId}`
    );
    // Store test information for later use in result handling
    // First, ensure testInfoMap exists (it's in the parent class)
    if (!(this as any).testInfoMap) {
      (this as any).testInfoMap = new Map();
    }
    (this as any).testInfoMap.set(testId, { testName, runtime });
    console.log(`[ServerTaskCoordinator] Stored test info for ${testId}:`, { testName, runtime });
    
    this.addTestToSchedulingQueue(testId, testName, runtime, ws);
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
    throw new Error(
      `processQueueItem should be implemented by derived class for ${testName} (${runtime})`
    );
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
    // Don't check the queue here to avoid recursion
    // The queue is already checked by checkQueue before calling this method

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
}
