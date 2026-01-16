// // This Server manages processes-as-docker-commands. Processes are scheduled in queue.
// // It should also leverage BuildSet, TestsQueue and TestsMap

// import { default as ansiC } from "ansi-colors";
// import fs from "fs";
// import path from "path";
// import { IBuiltConfig, IRunTime } from "../../Types";
// import { ProcessCategory, getRuntimeImage } from "../serverManagers/ProcessManager";
// import { TestManager } from "../serverManagers/TestManager";
// import { IMode } from "../types";
// import { Server_BuildManager } from "./Server_BuildManager";

// export class Server_TestManager extends Server_BuildManager {

//   testManger: TestManager;

//   constructor(configs: IBuiltConfig, testName: string, mode: IMode, routes) {
//     super(configs, testName, mode, routes);
//     this.testManger = new TestManager()
//   }

//   async start() {
//     console.log(`[Server_TestManager] start()`)
//     super.start()
//   }

//   async stop() {
//     console.log(`[Server_TestManager] stop()`)
//     super.stop()
//   }

//   executeCommand = async (
//     processId: string,
//     command: string,
//     category: ProcessCategory,
//     testName?: string,
//     platform?: IRunTime,
//     options?: any
//   ) => {
//     console.log(`[ProcessManager] executeCommand called: ${processId}, ${category}, ${testName}, ${platform}`);
//     console.log(`[ProcessManager] Command: ${command}`);


//     // Validate and format processId according to the specification
//     let formattedProcessId = processId;
//     if (testName && platform) {
//       // Check if the processId follows the expected format
//       if (!processId.startsWith('allTests-')) {
//         // Generate proper ID based on category
//         const baseId = `allTests-${platform}-${testName}`;
//         switch (category) {
//           case 'bdd-test':
//             formattedProcessId = `${baseId}-bdd`;
//             break;
//           case 'aider':
//             formattedProcessId = `${baseId}-aider`;
//             break;
//           case 'build-time':
//             formattedProcessId = `${baseId}-builder`;
//             break;
//           default:
//             // For static tests, we need to handle them differently
//             if (category === 'static' && processId.includes('-static-')) {
//               // Keep the static test ID as is
//               formattedProcessId = processId;
//             } else {
//               formattedProcessId = baseId;
//             }
//         }
//         console.log(`[ProcessManager] Formatted process ID: ${formattedProcessId} (was: ${processId})`);
//       }
//     }

//     const result = await this.executeCommand(
//       formattedProcessId,
//       command,
//       category,
//       testName,
//       platform,
//       options
//     );

//     console.log(`[ProcessManager] executeCommand result for ${formattedProcessId}:`, result.success ? 'success' : 'error');


//     return result;
//   };

//   // each process is a docker command
//   // processes should stay alive until the same identical processes supercedes it, 
//   // where "identical processes" are processes with matching processId
//   async runTestInDocker(
//     processId: string,
//     testPath: string,
//     runtime: IRunTime,
//     command: string,
//     category: ProcessCategory = "bdd-test"
//   ): Promise<void> {
//     console.log(`[ProcessManager] runTestInDocker: ${processId}, ${testPath}, ${runtime}, ${category}`);

//     // Ensure processId follows the correct format
//     let formattedProcessId = processId;
//     if (!processId.startsWith('allTests-')) {
//       formattedProcessId = `allTests-${runtime}-${testPath}-${category}`;
//     }

//     // Use container name based on processId
//     const containerName = formattedProcessId.replace(/[^a-zA-Z0-9_-]/g, '-');

//     // Check if container is already running and remove it
//     const checkCmd = `docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`;
//     const checkResult = await this.executeCommand(
//       `${formattedProcessId}-check`,
//       checkCmd,
//       category,
//       testPath,
//       runtime
//     );

//     if (checkResult.success && checkResult.stdout && checkResult.stdout.trim() === containerName) {
//       console.log(`[ProcessManager] Stopping existing container ${containerName} before starting new one`);
//       await this.executeCommand(
//         `${formattedProcessId}-remove`,
//         `docker rm -f ${containerName}`,
//         category,
//         testPath,
//         runtime
//       );
//     }

//     const baseImage = getRuntimeImage(runtime);

//     // Determine if the process should run indefinitely or once
//     const runOptions = (category === 'aider' || category === 'build-time') ? '-d' : '--rm';

//     const dockerRunCmd = `docker run ${runOptions} \
//       --name ${containerName} \
//       --network allTests_network \
//       -v ${process.cwd()}:/workspace \
//       -w /workspace \
//       ${baseImage} \
//       sh -c "${command}"`;

//     console.log(`[ProcessManager] Running docker command: ${dockerRunCmd}`);
//     await this.executeCommand(
//       formattedProcessId,
//       dockerRunCmd,
//       category,
//       testPath,
//       runtime
//     );
//   }

//   async enqueue(
//     runtime: IRunTime,
//     command: string,
//     addableFiles: string[] = [],
//     normalizedTestName?: string,
//     category: ProcessCategory = "bdd-test"
//   ): Promise<void> {
//     console.log(`[ProcessManager] enqueue called: runtime=${runtime}, command=${command}, category=${category}`);

//     // Extract test name from command if possible
//     let testName = `test-${Date.now()}-${Math.random()
//       .toString(36)
//       .substr(2, 9)}`;

//     // Try to extract a better test name from the command
//     const match = command.match(/example\/([^.\s]+)/);
//     if (match) {
//       testName = match[1];
//     }

//     // Use normalized test name if provided (from BuildListener)
//     if (normalizedTestName) {
//       testName = normalizedTestName;
//       console.log(`[ProcessManager] Using normalized test name: ${testName}`);
//     }

//     const testPath = testName;
//     // Generate process ID according to the specification
//     let processId: string;
//     switch (category) {
//       case 'bdd-test':
//         processId = `allTests-${runtime}-${testPath}-bdd`;
//         break;
//       case 'aider':
//         processId = `allTests-${runtime}-${testPath}-aider`;
//         break;
//       case 'build-time':
//         processId = `allTests-${runtime}-${testPath}-builder`;
//         break;
//       default:
//         // For static tests, we need a unique number
//         if (category === 'static') {
//           // Count existing static tests for this test
//           const staticCount = Array.from(this.testManger.jobSet.keys()).filter(id =>
//             id.startsWith(`allTests-${runtime}-${testPath}-static-`)
//           ).length;
//           processId = `allTests-${runtime}-${testPath}-static-${staticCount}`;
//         } else {
//           processId = `allTests-${runtime}-${testPath}-job`;
//         }
//     }

//     console.log(`[ProcessManager] Created processId: ${processId} for category: ${category}`);

//     // Check if we have broadcast method (from Server_WS)
//     if (typeof (this as any).broadcast === 'function') {
//       this.broadcast({
//         type: 'enqueue',
//         processId,
//         runtime,
//         command,
//         testName,
//         testPath,
//         addableFiles,
//         timestamp: new Date().toISOString(),
//         queueLength: this.testManger.jobQueue.length + 1, // +1 because we're about to add this job
//       });
//     } else {
//       console.log(`[ProcessManager] broadcast method not available`);
//     }

//     // Create a job function for the queue
//     // const job = async () => {
//     //   console.log(
//     //     ansiC.blue(
//     //       ansiC.inverse(`Processing ${processId} (${runtime}, ${category}) from queue`)
//     //     )
//     //   );

//     //   if (typeof (this as any).broadcast === 'function') {
//     //     this.broadcast({
//     //       type: 'dequeue',
//     //       processId,
//     //       runtime,
//     //       command,
//     //       testName,
//     //       testPath,
//     //       category,
//     //       timestamp: new Date().toISOString(),
//     //       details: 'Started processing job from queue'
//     //     });
//     //   }

//     //   try {
//     //     // Run in a Docker container
//     //     // Use processId as container name to ensure uniqueness
//     //     const containerName = processId.replace(/[^a-zA-Z0-9_-]/g, '-');

//     //     // First, check if container is already running and remove it
//     //     // This ensures processes are superseded by identical IDs
//     //     const checkCmd = `docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`;
//     //     const checkResult = await this.executeCommand(
//     //       `${processId}-check`,
//     //       checkCmd,
//     //       category,
//     //       testName,
//     //       runtime
//     //     );

//     //     if (checkResult.success && checkResult.stdout && checkResult.stdout.trim() === containerName) {
//     //       console.log(`[ProcessManager] Stopping existing container ${containerName} before starting new one`);
//     //       await this.executeCommand(
//     //         `${processId}-remove`,
//     //         `docker rm -f ${containerName}`,
//     //         category,
//     //         testName,
//     //         runtime
//     //       );
//     //     }

//     //     const baseImage = getRuntimeImage(runtime);

//     //     // For aider and builder processes, they should run indefinitely
//     //     // For bdd and static tests, they should run once
//     //     const dockerRunCmd = `docker run --rm \
//     //       --name ${containerName} \
//     //       --network allTests_network \
//     //       -v ${process.cwd()}:/workspace \
//     //       -w /workspace \
//     //       ${baseImage} \
//     //       sh -c "${command}"`;

//     //     console.log(`[ProcessManager] Executing command for ${processId}: ${dockerRunCmd}`);
//     //     await this.executeCommand(
//     //       processId,
//     //       dockerRunCmd,
//     //       category,
//     //       testName,
//     //       runtime
//     //     );
//     //     console.log(`[ProcessManager] Command executed for ${processId}`);
//     //   } catch (error) {
//     //     console.error(
//     //       ansiC.red(`Error executing ${category} ${processId} (${runtime}): ${error}`)
//     //     );
//     //   }

//     //   // Remove from queued items after processing
//     //   this.jobQueue = this.jobQueue.filter(
//     //     (item) => !(item.testName === testName && item.runtime === runtime)
//     //   );

//     //   // Update the board and check for shutdown
//     //   this.writeBigBoard();
//     //   this.checkForShutdown();
//     // };

//     // Add the job to the queue
//     // TODO this is broken
//     // this.jobQueue.push(job);
//     // console.log(`[ProcessManager] Job added to queue, queue length: ${this.jobQueue.length}`);

//     // // Track the queued item
//     // this.queuedItems.push({
//     //   testName,
//     //   runtime,
//     //   addableFiles,
//     //   command,
//     // });

//     // Broadcast process update
//     if (typeof (this as any).broadcast === 'function') {
//       // Request a process update to be sent to all clients
//       setTimeout(() => {
//         this.broadcast({
//           type: 'processes',
//           data: this.getProcessSummary(),
//           timestamp: new Date().toISOString()
//         });
//       }, 100);
//     }
//   }

//   getProcessSummary = () => {
//     console.log('[ProcessManager] getProcessSummary called');

//     const processes = [];

//     for (const [id, info] of this.testManger.jobQueue.entries()) {
//       console.log(`[ProcessManager] Processing process ${id}:`, info);

//       if (!id) {
//         console.error(`[ProcessManager] Found process with undefined ID, info: ${info}`);
//         throw `[ProcessManager] Found process with undefined ID, info: ${info}`;
//       }

//       processes.push({
//         id,
//         command: info.command,
//         status: info.status,
//         type: info.type,
//         category: info.category,
//         testName: info.testName,
//         platform: info.platform,
//         timestamp: info.timestamp,
//         exitCode: info.exitCode,
//         error: info.error,
//         logs: this.getProcessLogs(id).slice(-10), // Last 10 logs
//       });
//     }

//     const summary = {
//       // totalProcesses: this.allProcesses.size,
//       // running: Array.from(this.allProcesses.values()).filter(
//       //   (p) => p.status === "running"
//       // ).length,
//       // completed: Array.from(this.allProcesses.values()).filter(
//       //   (p) => p.status === "completed"
//       // ).length,
//       // errors: Array.from(this.allProcesses.values()).filter(
//       //   (p) => p.status === "error"
//       // ).length,
//       // processes,
//       // queueLength: this.jobQueue ? this.jobQueue.length : 0,
//       // queuedItems: this.queuedItems,
//     };

//     return summary;
//   };

//   getProcessLogs = (processId: string): string[] => {
//     return this.testManger.processLogs.get(processId) || [];
//   };

//   addLogEntry = (
//     processId: string,
//     source: "stdout" | "stderr" | "console" | "network" | "error",
//     message: string,
//     timestamp: Date = new Date(),
//     level?: string
//   ) => {
//     if (!this.testManger.processLogs.has(processId)) {
//       this.testManger.processLogs.set(processId, []);
//     }

//     let logLevel = level;
//     if (!logLevel) {
//       switch (source) {
//         case "stderr":
//         case "error":
//           logLevel = "error";
//           break;
//         case "stdout":
//           logLevel = "info";
//           break;
//         default:
//           logLevel = "info";
//       }
//     }

//     const logEntry = `[${timestamp.toISOString()}] [${source}] ${message}`;
//     this.testManger.processLogs.get(processId)!.push(logEntry);

//     this.writeToProcessLogFile(processId, source, message, timestamp);

//     // Send to log subscribers if they exist
//     if ((this as any).logSubscriptions) {
//       const subscriptions = (this as any).logSubscriptions.get(processId);
//       if (subscriptions) {
//         const logMessage = {
//           type: "logEntry",
//           processId,
//           source,
//           level: logLevel,
//           message,
//           timestamp: timestamp.toISOString(),
//         };
//         subscriptions.forEach((client: any) => {
//           if (client.readyState === 1) {
//             client.send(JSON.stringify(logMessage));
//           }
//         });
//       }
//     }
//   };

//   private writeToProcessLogFile(
//     processId: string,
//     source: "stdout" | "stderr" | "console" | "network" | "error",
//     message: string,
//     timestamp: Date
//   ) {
//     // Parse runtime from processId
//     // Process IDs follow pattern: allTests-{runtime}-{testName}-{index}
//     // Example: allTests-node-Calculator.test-0
//     let runtime = "unknown";
//     if (processId.startsWith('allTests-')) {
//       const parts = processId.split('-');
//       if (parts.length >= 2) {
//         runtime = parts[1];
//       }
//     }

//     const logDir = path.join(
//       process.cwd(),
//       "testeranto",
//       "reports",
//       this.projectName,
//       runtime,
//       "example"
//     );

//     // Ensure the directory exists
//     try {
//       fs.mkdirSync(logDir, { recursive: true });
//     } catch (err: any) {
//       // If we can't create the directory, log to console and skip file writing
//       console.error(`[ProcessManager] Failed to create log directory ${logDir}:`, err.message);
//       return;
//     }

//     // Extract the filename from processId
//     // allTests-node-Calculator.test-0 -> Calculator.test-0.log
//     let logFileName = processId;
//     if (processId.startsWith('allTests-')) {
//       // Remove 'allTests-'
//       const withoutPrefix = processId.substring('allTests-'.length);
//       // Find the first dash after runtime
//       const firstDashIndex = withoutPrefix.indexOf('-');
//       if (firstDashIndex !== -1) {
//         // Take everything after 'allTests-{runtime}-'
//         logFileName = withoutPrefix.substring(firstDashIndex + 1);
//       }
//     }

//     const logFile = path.join(logDir, `${logFileName}.log`);
//     // Ensure parent directory exists (in case logFileName contains subdirectories)
//     const logFileDir = path.dirname(logFile);
//     try {
//       fs.mkdirSync(logFileDir, { recursive: true });
//     } catch (err: any) {
//       console.error(`[ProcessManager] Failed to create log file directory ${logFileDir}:`, err.message);
//       return;
//     }

//     const logEntry = `[${timestamp.toISOString()}] [${source}] ${message}\n`;

//     try {
//       fs.appendFileSync(logFile, logEntry);
//     } catch (err: any) {
//       console.error(`[ProcessManager] Failed to write log to ${logFile}:`, err.message);
//     }
//   }

//   allocatePorts(numPorts: number, testName: string): number[] | null {
//     const openPorts = Object.entries(this.testManger.ports)
//       .filter(([, status]) => status === "")
//       .map(([port]) => parseInt(port));

//     if (openPorts.length >= numPorts) {
//       const allocatedPorts = openPorts.slice(0, numPorts);
//       allocatedPorts.forEach((port) => {
//         this.testManger.ports[port] = testName;
//       });
//       return allocatedPorts;
//     }
//     return null;
//   }

//   releasePorts(ports: number[]) {
//     ports.forEach((port) => {
//       this.testManger.ports[port] = "";
//     });
//   }

//   getPortStatus() {
//     return { ...this.testManger.ports };
//   }

//   isPortAvailable(port: number): boolean {
//     return this.testManger.ports[port] === "";
//   }

//   getPortOwner(port: number): string | null {
//     return this.testManger.ports[port] || null;
//   }

//   shouldShutdown(
//     summary: Record<string, any>,
//     queueLength: number,
//     hasRunningProcesses: boolean,
//     mode: string
//   ): boolean {
//     if (mode === "dev") return false;

//     // Check for inflight operations
//     const inflight = Object.keys(summary).some(
//       (k) =>
//         summary[k].prompt === "?" ||
//         summary[k].runTimeErrors === "?" ||
//         summary[k].staticErrors === "?" ||
//         summary[k].typeErrors === "?"
//     );

//     return !inflight && !hasRunningProcesses && queueLength === 0;
//   }

//   checkForShutdown = async () => {
//     console.log(
//       ansiC.inverse(
//         `The following jobs are awaiting resources: ${JSON.stringify(
//           this.testManger.getAllQueueItems()
//         )}`
//       )
//     );

//     this.writeBigBoard();

//     const summary = this.getSummary();
//     const hasRunningProcesses = this.jobQueue.length > 0;
//     const queueLength = this.jobQueue.length;

//     if (
//       this.shouldShutdown(summary, queueLength, hasRunningProcesses, this.mode)
//     ) {
//       console.log(
//         ansiC.inverse(`${this.projectName} has been tested. Goodbye.`)
//       );
//     }
//   };





//   async startAiderProcess(
//     testPath: string,
//     runtime: IRunTime,
//     command: string
//   ): Promise<void> {
//     const processId = `allTests-${runtime}-${testPath}-aider`;
//     console.log(`[ProcessManager] Starting aider process: ${processId}`);

//     await this.runTestInDocker(
//       processId,
//       testPath,
//       runtime,
//       command,
//       "aider"
//     );
//   }

//   async startBuilderProcess(
//     runtime: IRunTime,
//     command: string
//   ): Promise<void> {
//     const testPath = "builder"; // Builder is per runtime, not per test
//     const processId = `allTests-${runtime}-${testPath}-builder`;
//     console.log(`[ProcessManager] Starting builder process: ${processId}`);

//     await this.runTestInDocker(
//       processId,
//       testPath,
//       runtime,
//       command,
//       "build-time"
//     );
//   }

//   async startBddTestProcess(
//     testPath: string,
//     runtime: IRunTime,
//     command: string
//   ): Promise<void> {
//     const processId = `allTests-${runtime}-${testPath}-bdd`;
//     console.log(`[ProcessManager] Starting BDD test process: ${processId}`);

//     await this.runTestInDocker(
//       processId,
//       testPath,
//       runtime,
//       command,
//       "bdd-test"
//     );
//   }

//   async startStaticTestProcess(
//     testPath: string,
//     runtime: IRunTime,
//     command: string,
//     index: number
//   ): Promise<void> {
//     const processId = `allTests-${runtime}-${testPath}-static-${index}`;
//     console.log(`[ProcessManager] Starting static test process: ${processId}`);

//     await this.runTestInDocker(
//       processId,
//       testPath,
//       runtime,
//       command,
//       "static"
//     );
//   }


// }
