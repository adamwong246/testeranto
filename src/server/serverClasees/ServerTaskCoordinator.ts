/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { default as ansiC } from "ansi-colors";
import { IBuiltConfig, IRunTime } from "../../Types";
import { getRunnables } from "../utils";
import { ServerTaskManager } from "./ServerTaskManager";
import { IMode } from "../../app/frontend/types";

export class ServerTaskCoordinator extends ServerTaskManager {
  private queue: Array<{
    testName: string;
    runtime: IRunTime;
    addableFiles?: string[];
  }> = [];
  private processingQueue: boolean = false;

  constructor(configs: IBuiltConfig, testName: string, mode: IMode) {
    super(configs, testName, mode);
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
