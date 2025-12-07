import ansiC from "ansi-colors";
import { IRunTime } from "../Types.js";
import { getRunnables } from "./utils.js";

export class QueueManager {
  private queue: string[] = [];

  constructor() {}

  addToQueue(
    src: string,
    runtime: IRunTime,
    configs: any,
    projectName: string,
    cleanupTestProcesses: (testName: string) => void,
    checkQueue: () => void
  ) {
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

      for (const [testName, bundlePath] of allEntryPoints) {
        const normalizedBundlePath = (bundlePath as string).replace(/\\/g, "/");
        // Check if the source path ends with the bundle path
        if (normalizedSrc.endsWith(normalizedBundlePath)) {
          // Use the original test name instead of the bundle path
          src = testName;
          break;
        }
      }
    }

    // First, clean up any existing processes for this test
    cleanupTestProcesses(src);

    // Add the test to the queue (using the original test source path)
    // Make sure we don't add duplicates
    if (!this.queue.includes(src)) {
      this.queue.push(src);
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
          ansiC.inverse(`Test ${src} is already in the queue, skipping`)
        )
      );
    }
  }

  pop(): string | undefined {
    return this.queue.pop();
  }

  includes(item: string): boolean {
    return this.queue.includes(item);
  }

  get length(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
  }

  getAll(): string[] {
    return [...this.queue];
  }
}
