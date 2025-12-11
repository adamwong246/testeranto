// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */

// import ansiColors from "ansi-colors";
// import { spawn, spawnSync } from "child_process";
// import fs from "fs";
// import path from "path";
// import { createLogStreams, LogStreams } from "../../clients/utils";
// import { IRunTime } from "../../lib";
// import { generatePromptFiles } from "../aider/generatePromptFiles";

// export class NodeLauncher {
//   constructor(
//     private httpPort: number,
//     private setupTestEnvironment: (
//       src: string,
//       runtime: IRunTime
//     ) => Promise<any>,
//     private cleanupPorts: (portsToUse: string[]) => void,
//     private handleChildProcess: (
//       child: any,
//       logs: LogStreams,
//       reportDest: string,
//       src: string,
//       runtime: IRunTime
//     ) => Promise<void>,
//     private bddTestIsRunning: (src: string) => void,
//     private bddTestIsNowDone: (src: string, failures: number) => void,
//     private addPromiseProcess: (
//       processId: string,
//       promise: Promise<any>,
//       command: string,
//       category: "aider" | "bdd-test" | "build-time" | "other",
//       entrypoint: string,
//       platform: IRunTime,
//       onResolve?: () => void,
//       onReject?: () => void
//     ) => void,
//     private checkQueue: () => void
//   ) {}

//   async launchNode(src: string, dest: string): Promise<void> {
//     console.log(ansiColors.green(ansiColors.inverse(`node < ${src}`)));

//     // Log strategy alignment
//     console.log(
//       ansiColors.green(
//         `[STRATEGY] Node.js uses "combined-build-test-process-pools" strategy`
//       )
//     );
//     console.log(
//       ansiColors.green(
//         `[STRATEGY] Tests will run inside node-build container via docker exec (aligned with architecture)`
//       )
//     );

//     // Use httpPort with fallback to 3456
//     const portToUse = this.httpPort || 3456;
//     console.log(`NodeLauncher: Using httpPort ${portToUse} for test execution`);

//     const processId = `node-${src}-${Date.now()}`;
//     const command = `node test: ${src}`;

//     const nodePromise = (async () => {
//       try {
//         this.bddTestIsRunning(src);

//         // Ensure setupTestEnvironment is callable
//         if (typeof this.setupTestEnvironment !== "function") {
//           throw new Error(
//             `NodeLauncher: setupTestEnvironment is not a function. It is ${typeof this
//               .setupTestEnvironment}. Check ServerTestExecutor setup.`
//           );
//         }
//         const setupResult = await this.setupTestEnvironment(src, "node");
//         const { reportDest, testResources, portsToUse } = setupResult;
//         console.log("setupResult portsToUse:", portsToUse);

//         const builtfile = dest;
//         const logs = createLogStreams(reportDest, "node");

//         // Log the path we're waiting for
//         console.log(`NodeLauncher: Waiting for bundle at ${builtfile}`);
//         console.log(`Current working directory: ${process.cwd()}`);

//         // Check if file exists immediately
//         if (fs.existsSync(builtfile)) {
//           console.log(`Bundle file exists immediately at ${builtfile}`);
//         } else {
//           console.log(`Bundle file does not exist yet at ${builtfile}`);
//           // List the directory to see what's there
//           const dir = path.dirname(builtfile);
//           if (fs.existsSync(dir)) {
//             console.log(`Directory ${dir} exists, contents:`);
//             try {
//               const files = fs.readdirSync(dir);
//               files.forEach((file) => {
//                 console.log(`  ${file}`);
//               });
//             } catch (e) {
//               console.log(`Could not read directory ${dir}: ${e.message}`);
//             }
//           } else {
//             console.log(`Directory ${dir} does not exist`);
//           }
//         }

//         // Wait for the bundle file to exist, similar to nodeScript.ts
//         const maxBundleRetries = 30; // Reduced from 60 to fail faster
//         let bundleRetryCount = 0;
//         while (
//           !fs.existsSync(builtfile) &&
//           bundleRetryCount < maxBundleRetries
//         ) {
//           console.log(
//             `Bundle not ready yet (attempt ${
//               bundleRetryCount + 1
//             }/${maxBundleRetries}) at path: ${builtfile}`
//           );
//           bundleRetryCount++;
//           await new Promise((resolve) => setTimeout(resolve, 1000)); // Reduced to 1 second
//         }

//         if (!fs.existsSync(builtfile)) {
//           // Try to find any .mjs file in the directory
//           const dir = path.dirname(builtfile);
//           if (fs.existsSync(dir)) {
//             const files = fs.readdirSync(dir);
//             const mjsFiles = files.filter((f) => f.endsWith(".mjs"));
//             console.log(`Found .mjs files in ${dir}:`, mjsFiles);
//             if (mjsFiles.length > 0) {
//               // Use the first .mjs file
//               const alternativePath = path.join(dir, mjsFiles[0]);
//               console.log(`Trying alternative path: ${alternativePath}`);
//               if (fs.existsSync(alternativePath)) {
//                 console.log(
//                   `Using alternative bundle file: ${alternativePath}`
//                 );
//                 // Update builtfile to the alternative path
//                 // Note: We need to pass this to spawn, so we'll adjust
//                 // For now, let's throw an error with more information
//                 throw new Error(
//                   `Expected bundle file ${builtfile} does not exist, but found ${alternativePath}. ` +
//                     `This suggests a path mismatch between build and launch configurations.`
//                 );
//               }
//             }
//           }
//           throw new Error(
//             `Bundle file ${builtfile} does not exist after waiting. ` +
//               `Current directory: ${process.cwd()}. ` +
//               `Make sure the build process is creating the correct bundle.`
//           );
//         }

//         console.log(`Build is ready at ${builtfile}. Proceeding with test...`);

//         // Prepare test resources as a JSON string using shared utility
//         const { prepareTestResources, escapeForShell } = await import(
//           "./TestResourceUtils"
//         );
//         const testResourcesJson = prepareTestResources(
//           testResources,
//           portsToUse,
//           src,
//           reportDest
//         );

//         // Use httpPort with fallback to 3456
//         const portToUse = this.httpPort || 3456;
//         console.log("launchNode", [
//           builtfile,
//           portToUse.toString(),
//           testResourcesJson,
//         ]);
//         console.log(
//           `Full command: node ${builtfile} ${portToUse} ${testResourcesJson.substring(
//             0,
//             100
//           )}...`
//         );
//         // Parse testResourcesJson to log ports
//         try {
//           const parsedTestResources = JSON.parse(testResourcesJson);
//           console.log("Test resources ports:", parsedTestResources.ports);
//         } catch (e) {
//           console.log("Could not parse testResourcesJson:", e.message);
//         }

//         // Verify the bundle file is readable
//         try {
//           const stats = fs.statSync(builtfile);
//           console.log(`Bundle file size: ${stats.size} bytes`);
//         } catch (e) {
//           console.error(`Cannot access bundle file ${builtfile}:`, e.message);
//           throw new Error(
//             `Bundle file ${builtfile} is not accessible: ${e.message}`
//           );
//         }

//         // According to the architecture, Node.js uses "combined-build-test-process-pools" strategy
//         // Tests should run inside the build container via docker exec
//         console.log(
//           "NodeLauncher: Node.js uses 'combined-build-test-process-pools' strategy"
//         );
//         console.log(
//           "NodeLauncher: Running tests via docker exec into node-build container"
//         );

//         // First, check if any node build container is running
//         // Look for containers with "node" and "build" in their names
//         const containerCheck = spawnSync("docker", [
//           "ps",
//           "--format",
//           "{{.Names}}",
//         ]);
//         const allContainers = containerCheck.stdout
//           .toString()
//           .trim()
//           .split("\n");
//         const nodeBuildContainers = allContainers.filter(
//           (name) => name.includes("node") && name.includes("build")
//         );

//         if (nodeBuildContainers.length === 0) {
//           console.error("NodeLauncher: No node-build container found!");
//           console.error(
//             "NodeLauncher: Docker ps output:",
//             containerCheck.stdout.toString()
//           );
//           console.error(
//             "NodeLauncher: Docker ps error:",
//             containerCheck.stderr.toString()
//           );

//           // NO FALLBACK - This is a critical error according to the architecture
//           throw new Error(
//             `NodeLauncher: No node-build container found. ` +
//               `Node.js uses "combined-build-test-process-pools" strategy which requires tests to run in the build container. ` +
//               `Make sure docker-compose services are running. ` +
//               `Check with: docker-compose -f testeranto/bundles/*-docker-compose.yml ps`
//           );
//         }

//         // Use the first node-build container we found
//         const containerName = nodeBuildContainers[0];
//         console.log(`NodeLauncher: Found container: ${containerName}`);

//         // Convert host path to container path
//         // Assuming the workspace is mounted at /workspace
//         const containerBuiltfile = builtfile.replace(
//           process.cwd(),
//           "/workspace"
//         );

//         // Escape the test resources JSON for shell
//         const escapedTestResources = testResourcesJson.replace(/'/g, "'\"'\"'");

//         // Run the test inside the node-build container using docker exec
//         const dockerCommand = [
//           "docker",
//           "exec",
//           "-i",
//           "-e",
//           `WS_HOST=host.docker.internal`,
//           "-e",
//           `WS_PORT=${portToUse}`,
//           containerName,
//           "sh",
//           "-c",
//           `cd /workspace && node ${containerBuiltfile} ${portToUse} '${escapedTestResources}'`,
//         ];

//         console.log("NodeLauncher: Running command:", dockerCommand.join(" "));

//         const child = spawn(dockerCommand[0], dockerCommand.slice(1), {
//           stdio: ["pipe", "pipe", "pipe"],
//         });

//         // Capture and log the output
//         child.stdout.on("data", (data) => {
//           const output = data.toString();
//           console.log(`NodeLauncher [docker exec stdout]: ${output}`);
//           logs.stdout?.write(data);
//         });

//         child.stderr.on("data", (data) => {
//           const output = data.toString();
//           console.log(`NodeLauncher [docker exec stderr]: ${output}`);
//           logs.stderr?.write(data);
//         });

//         try {
//           // Handle the actual child process (docker exec)
//           await this.handleChildProcess(child, logs, reportDest, src, "node");

//           // Generate prompt files for Node tests
//           generatePromptFiles(reportDest, src);
//         } finally {
//           this.cleanupPorts(portsToUse);
//         }
//       } catch (error: any) {
//         if (error.message !== "No ports available") {
//           console.error(`Error in launchNode for ${src}:`, error);
//         }
//         // Re-throw to be caught by the promise handlers
//         throw error;
//       }
//     })();

//     console.log(`NodeLauncher: Adding node test process for ${src}`);
//     this.addPromiseProcess(
//       processId,
//       nodePromise,
//       command,
//       "bdd-test",
//       src,
//       "node",
//       () => {
//         console.log(`NodeLauncher: Node test completed successfully: ${src}`);
//         setTimeout(() => this.checkQueue(), 100);
//       },
//       () => {
//         console.error(`NodeLauncher: Node test failed or rejected: ${src}`);
//         setTimeout(() => this.checkQueue(), 100);
//       }
//     );
//   }
// }
