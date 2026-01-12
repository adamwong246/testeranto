// /**
//  * Pure utility functions for queue management that don't depend on external packages
//  */

// import { IRunTime } from "../../../Types";

// /**
//  * Generate a unique test ID
//  */
// export function generateTestId(tName: string, runtime: IRunTime): string {
//   return `${tName}-${runtime}-${Math.random()}`;
// }

// /**
//  * Sanitize a command string for use in filenames
//  */
// export function sanitizeCommandForFilename(
//   command: string,
//   maxLength: number = 50
// ): string {
//   return command.replace(/[^a-zA-Z0-9]/g, "_").substring(0, maxLength);
// }

// /**
//  * Format static analysis output content
//  */
// export function formatStaticAnalysisOutput(
//   command: string,
//   processId: string,
//   testName: string,
//   runtime: IRunTime,
//   stdout: string,
//   stderr: string
// ): string {
//   return [
//     `Command: ${command}`,
//     `Timestamp: ${new Date().toISOString()}`,
//     `Process ID: ${processId}`,
//     `Test: ${testName}`,
//     `Runtime: ${runtime}`,
//     "\n=== STDOUT ===\n",
//     stdout,
//     "\n=== STDERR ===\n",
//     stderr,
//     "\n=== END ===\n",
//   ].join("\n");
// }

// /**
//  * Check if a test should be added to queue based on duplicates
//  */
// export function shouldAddToQueue(
//   queueItems: Array<{ testName: string; runtime: IRunTime }>,
//   testName: string,
//   runtime: IRunTime
// ): boolean {
//   return !queueItems.some(
//     (item) => item.testName === testName && item.runtime === runtime
//   );
// }

// /**
//  * Extract test name from bundle path (pure logic)
//  */
// export function extractTestNameFromBundlePath(
//   src: string,
//   runtime: IRunTime,
//   projectName: string
// ): { extracted: boolean; testName: string } {
//   const originalSrc = src;

//   if (!src.includes("testeranto/bundles")) {
//     return { extracted: false, testName: src };
//   }

//   // Normalize the source path for comparison
//   const normalizedSrc = src.replace(/\\/g, "/");

//   // Pattern: .../testeranto/bundles/{runtime}/{projectName}/{testPath}.mjs
//   const bundlePattern = new RegExp(
//     `testeranto/bundles/${runtime}/${projectName}/(.+\\.)mjs$`
//   );
//   const match = normalizedSrc.match(bundlePattern);

//   if (match) {
//     // Reconstruct the test name by replacing .mjs with .ts
//     const testNameWithoutExt = match[1].slice(0, -1); // Remove trailing dot
//     const potentialTestName = testNameWithoutExt + ".ts";
//     return { extracted: true, testName: potentialTestName };
//   }

//   return { extracted: false, testName: src };
// }

// export function generateDockerCommand(
//   runtime: IRunTime,
//   processId: string,
//   command: string,
//   cwd: string
// ): string {
//   // Determine the Docker image based on runtime
//   let dockerImage: string;
//   switch (runtime) {
//     case "node":
//       dockerImage = "bundles-node-build:latest";
//       break;
//     case "web":
//       dockerImage = "bundles-web-build:latest";
//       break;
//     case "python":
//       dockerImage = "bundles-python-build:latest";
//       break;
//     case "golang":
//       dockerImage = "bundles-golang-build:latest";
//       break;
//     default:
//       dockerImage = "bundles-node-build:latest";
//   }

//   // const containerName = `static-${processId}`;

//   let dockerCommand = `docker run --rm --name ${processId} `;
//   dockerCommand += `-v "${cwd}:/workspace" `;
//   dockerCommand += `-w /workspace `;
//   dockerCommand += `--network allTests_network `;
//   dockerCommand += `${dockerImage} `;
//   dockerCommand += `sh -c "${command}"`;

//   return dockerCommand;
// }

// /**
//  * Check if we should shut down based on summary and queue
//  */
// // export function shouldShutdown(
// //   summary: Record<string, any>,
// //   queueLength: number,
// //   hasRunningProcesses: boolean,
// //   mode: string
// // ): boolean {
// //   if (mode === "dev") return false;

// //   // Check for inflight operations
// //   const inflight = Object.keys(summary).some(
// //     (k) =>
// //       summary[k].prompt === "?" ||
// //       summary[k].runTimeErrors === "?" ||
// //       summary[k].staticErrors === "?" ||
// //       summary[k].typeErrors === "?"
// //   );

// //   return !inflight && !hasRunningProcesses && queueLength === 0;
// // }
