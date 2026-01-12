// import { default as ansiC } from "ansi-colors";
// import { extractTestNameFromBundlePath, shouldAddToQueue } from "./QueueUtils";
// import { IRunTime } from "../../../Types";
// import { getRunnables } from "./getRunnables";

// export class QueueManager {
//   // private queue: Array<{
//   //   testName: string;
//   //   runtime: IRunTime;
//   //   addableFiles: string[];
//   // }> = [];
//   // private processingQueue: boolean = false;

// //   async enqueue(runtime: IRunTime, command: string) {}

// //   // Process the queue
// //   async checkQueue(
// //     processQueueItem: (
// //       testName: string,
// //       runtime: IRunTime,
// //       addableFiles: string[]
// //     ) => Promise<void>,
// //     writeBigBoard: () => void,
// //     checkForShutdown: () => void
// //   ) {
// //     // Don't start processing if we're already processing
// //     if (this.processingQueue) {
// //       return;
// //     }

// //     this.processingQueue = true;

// //     try {
// //       while (this.queue.length > 0) {
// //         // Get the next test from the queue (FIFO)
// //         const item = this.queue.shift();
// //         if (!item) {
// //           continue;
// //         }

// //         const { testName, runtime, addableFiles } = item;

// //         console.log(
// //           ansiC.blue(
// //             ansiC.inverse(`Processing ${testName} (${runtime}) from queue`)
// //           )
// //         );

// //         try {
// //           await processQueueItem(testName, runtime, addableFiles);
// //         } catch (error) {
// //           console.error(
// //             ansiC.red(`Error executing test ${testName} (${runtime}): ${error}`)
// //           );
// //         }

// //         // Update the queue after processing
// //         writeBigBoard();
// //       }
// //     } finally {
// //       this.processingQueue = false;
// //     }

// //     // Check if we should shut down after processing all tests
// //     checkForShutdown();
// //   }

// //   // Remove and return the last item from the queue
// //   pop():
// //     | { testName: string; runtime: IRunTime; addableFiles?: string[] }
// //     | undefined {
// //     return this.queue.pop();
// //   }

// //   // Check if a test is in the queue
// //   includes(testName: string, runtime?: IRunTime): boolean {
// //     if (runtime !== undefined) {
// //       return this.queue.some(
// //         (item) => item.testName === testName && item.runtime === runtime
// //       );
// //     }
// //     return this.queue.some((item) => item.testName === testName);
// //   }

// //   // Get the current queue length
// //   get queueLength(): number {
// //     return this.queue.length;
// //   }

// //   // Clear the entire queue
// //   clearQueue(): void {
// //     this.queue = [];
// //   }

// //   // Get all items in the queue
// //   getAllQueueItems(): Array<{
// //     testName: string;
// //     runtime: IRunTime;
// //     addableFiles: string[];
// //   }> {
// //     return [...this.queue];
// //   }
// // }

// // // Add a test to the queue
// // addToQueue(
// //   src: string,
// //   runtime: IRunTime,
// //   configs: any,
// //   projectName: string,
// //   cleanupTestProcesses: (testName: string) => void,
// //   checkQueue: () => void,
// //   addableFiles: string[]
// // ) {
// //   console.log("addToQueue", addableFiles);
// //   process.exit();

// //   // Store the original src for logging
// //   const originalSrc = src;

// //   // Ensure we're using the original test source path, not a bundle path
// //   // The src parameter might be a bundle path from metafile changes
// //   // We need to find the corresponding test source path

// //   // First, check if this looks like a bundle path (contains 'testeranto/bundles')
// //   if (src.includes("testeranto/bundles")) {
// //     // Use utility function to extract test name
// //     const { extracted, testName: extractedName } =
// //       extractTestNameFromBundlePath(src, runtime, projectName);

// //     if (extracted) {
// //       // Verify this test name exists in the entry points
// //       const runnables = getRunnables(configs, projectName);
// //       const allEntryPoints = [
// //         ...Object.entries(runnables.nodeEntryPoints),
// //         ...Object.entries(runnables.webEntryPoints),
// //         ...Object.entries(runnables.pythonEntryPoints),
// //         ...Object.entries(runnables.golangEntryPoints),
// //       ];

// //       for (const [testName, bundlePath] of allEntryPoints) {
// //         if (testName === extractedName) {
// //           src = testName;
// //           console.log(
// //             "Mapped bundle path to test name:",
// //             originalSrc,
// //             "->",
// //             src
// //           );
// //           break;
// //         }
// //       }

// //       // If we still haven't found a match, try the original approach
// //       if (src === originalSrc) {
// //         for (const [testName, bundlePath] of allEntryPoints) {
// //           const normalizedBundlePath = (bundlePath as string).replace(
// //             /\\/g,
// //             "/"
// //           );
// //           const normalizedSrc = src.replace(/\\/g, "/");
// //           // Check if the source path ends with the bundle path
// //           if (normalizedSrc.endsWith(normalizedBundlePath)) {
// //             src = testName;
// //             console.log("Fallback mapping:", originalSrc, "->", src);
// //             break;
// //           }
// //         }
// //       }
// //     }
// //   }

// //   // First, clean up any existing processes for this test
// //   // Note: We'll call the provided cleanup function
// //   cleanupTestProcesses(src);

// //   // Add the test to the queue (using the original test source path and runtime)
// //   // Make sure we don't add duplicates (consider both name and runtime)
// //   if (shouldAddToQueue(this.queue, src, runtime)) {
// //     this.queue.push({ testName: src, runtime, addableFiles });
// //     console.log(
// //       ansiC.green(
// //         ansiC.inverse(`Added ${src} (${runtime}) to the processing queue`)
// //       )
// //     );
// //     // Try to process the queue
// //     checkQueue();
// //   } else {
// //     console.log(
// //       ansiC.yellow(
// //         ansiC.inverse(
// //           `Test ${src} (${runtime}) is already in the queue, skipping`
// //         )
// //       )
// //     );
// //   }
// // }
