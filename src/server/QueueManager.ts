import ansiC from "ansi-colors";
import { IRunTime } from "../Types.js";
import { getRunnables } from "./utils.js";

export class QueueManager {
  private queue: Array<{ testName: string; runtime: IRunTime }> = [];

  constructor() {}

  addToQueue(
    src: string,
    runtime: IRunTime,
    configs: any,
    projectName: string,
    cleanupTestProcesses: (testName: string) => void,
    checkQueue: () => void
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
    cleanupTestProcesses(src);

    // Add the test to the queue (using the original test source path and runtime)
    // Make sure we don't add duplicates (consider both name and runtime)
    const alreadyInQueue = this.queue.some(
      (item) => item.testName === src && item.runtime === runtime
    );

    if (!alreadyInQueue) {
      this.queue.push({ testName: src, runtime });
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

  pop(): { testName: string; runtime: IRunTime } | undefined {
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

  get length(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
  }

  getAll(): Array<{ testName: string; runtime: IRunTime }> {
    return [...this.queue];
  }
}
