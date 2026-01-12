// This allows the server to manage a queue of tests that.

import { default as ansiC } from "ansi-colors";
import { IBuiltConfig, IRunTime } from "../../Types";
import { IMode } from "../types";
import { Server_Writer } from "./Server_Writer";

export class Server_Queue extends Server_Writer {
  private queue: Array<{
    testName: string;
    runtime: IRunTime;
    addableFiles: string[];
    status: string;
  }> = [];

  private processingQueue: boolean = false;

  constructor(configs: IBuiltConfig, testName: string, mode: IMode) {
    super(configs, testName, mode);
  }

  shouldShutdown(
    summary: Record<string, any>,
    queueLength: number,
    hasRunningProcesses: boolean,
    mode: string
  ): boolean {
    if (mode === "dev") return false;

    // Check for inflight operations
    const inflight = Object.keys(summary).some(
      (k) =>
        summary[k].prompt === "?" ||
        summary[k].runTimeErrors === "?" ||
        summary[k].staticErrors === "?" ||
        summary[k].typeErrors === "?"
    );

    return !inflight && !hasRunningProcesses && queueLength === 0;
  }

  checkForShutdown = async () => {
    console.log(
      ansiC.inverse(
        `The following jobs are awaiting resources: ${JSON.stringify(
          this.getAllQueueItems()
        )}`
      )
    );

    this.writeBigBoard();

    const summary = this.getSummary();
    const hasRunningProcesses = Array.from(this.queue.values()).some(
      (process) => process.status === "running"
    );
    const isQueueEmpty = this.queue.length === 0;

    if (
      this.shouldShutdown(
        summary,
        isQueueEmpty ? 0 : this.queue.length,
        hasRunningProcesses,
        this.mode
      )
    ) {
      console.log(
        ansiC.inverse(`${this.projectName} has been tested. Goodbye.`)
      );
    }
  };

  addLogEntry(
    processId: string,
    source: "stdout" | "stderr" | "console" | "network" | "error",
    message: string
  ): void {
    if ((this as any).addLogEntry) {
      (this as any).addLogEntry(processId, source, message);
    } else {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${source}] ${message}`);
    }
  }

  async enqueue(runtime: IRunTime, command: string) {
    throw "not yet implemented";
  }

  async checkQueue(
    processQueueItem: (
      testName: string,
      runtime: IRunTime,
      addableFiles: string[]
    ) => Promise<void>,
    writeBigBoard: () => void,
    checkForShutdown: () => void
  ) {
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
          await processQueueItem(testName, runtime, addableFiles);
        } catch (error) {
          console.error(
            ansiC.red(`Error executing test ${testName} (${runtime}): ${error}`)
          );
        }

        // Update the queue after processing
        writeBigBoard();
      }
    } finally {
      this.processingQueue = false;
    }

    // Check if we should shut down after processing all tests
    checkForShutdown();
  }

  // Remove and return the last item from the queue
  pop():
    | { testName: string; runtime: IRunTime; addableFiles?: string[] }
    | undefined {
    return this.queue.pop();
  }

  // Check if a test is in the queue
  includes(testName: string, runtime?: IRunTime): boolean {
    if (runtime !== undefined) {
      return this.queue.some(
        (item) => item.testName === testName && item.runtime === runtime
      );
    }
    return this.queue.some((item) => item.testName === testName);
  }

  // Get the current queue length
  get queueLength(): number {
    return this.queue.length;
  }

  // Clear the entire queue
  clearQueue(): void {
    this.queue = [];
  }

  // Get all items in the queue
  getAllQueueItems(): Array<{
    testName: string;
    runtime: IRunTime;
    addableFiles: string[];
  }> {
    return [...this.queue];
  }
}

////////////////////////////////////////////////////////////////
// DEPRECATED
////////////////////////////////////////////////////////////////

// protected async processQueueItem(
//   testName: string,
//   runtime: IRunTime,
//   addableFiles: string[]
// ): Promise<void> {
//   const testId = generateTestId(testName, runtime);
//   await this.runStaticAnalysisSteps(testId, testName, runtime, addableFiles);
//   await this.scheduleBddTest(testId, testName, runtime);
// }

// checkQueue = async () => {
//   await this.queueManager.checkQueue(
//     this.processQueueItem.bind(this),
//     this.writeBigBoard.bind(this),
//     this.checkForShutdown.bind(this)
//   );
// };

// enqueue(runtime: IRunTime, command: string) {
//   this.queueManager.enqueue(runtime, command);
// }

// pop():
//   | { testName: string; runtime: IRunTime; addableFiles?: string[] }
//   | undefined {
//   return this.queueManager.pop();
// }

// includes(testName: string, runtime?: IRunTime): boolean {
//   return this.queueManager.includes(testName, runtime);
// }

// get queueLength(): number {
//   return this.queueManager.queueLength;
// }

// clearQueue(): void {
//   this.queueManager.clearQueue();
// }

// getAllQueueItems(): Array<{
//   testName: string;
//   runtime: IRunTime;
//   addableFiles?: string[];
// }> {
//   return this.queueManager.getAllQueueItems();
// }

// private async runStaticAnalysisSteps(
//   processId: string,
//   projectName: string,
//   runtime: IRunTime,
//   addableFiles: string[]
// ): Promise<void> {
//   for (const command of this.getStaticAnalysisCommands(
//     projectName,
//     runtime,
//     addableFiles
//   )) {
//     await this.executeStaticAnalysisInDocker(
//       processId,
//       projectName,
//       runtime,
//       command
//     );
//   }
// }

// private async executeStaticAnalysisInDocker(
//   processId: string,
//   testName: string,
//   runtime: IRunTime,
//   command: string
// ): Promise<void> {
//   const execAsync = promisify(exec);
//   const cwd = process.cwd();
//   const dockerCommand = generateDockerCommand(
//     runtime,
//     processId,
//     command,
//     cwd
//   );

//   // Create a unique process ID for this command
//   const fullProcessId = `${processId}-${command.replace(/\s+/g, "_")}`;

//   // Log the command being executed
//   this.addLogEntry(
//     fullProcessId,
//     "stdout",
//     `Executing docker command: ${dockerCommand}`
//   );

//   // Create a promise that captures stdout and stderr
//   const promise = execAsync(dockerCommand, {
//     maxBuffer: 10 * 1024 * 1024,
//   })
//     .then(async ({ stdout, stderr }) => {
//       // Log stdout and stderr
//       if (stdout) {
//         this.addLogEntry(fullProcessId, "stdout", stdout);
//       }
//       if (stderr) {
//         this.addLogEntry(fullProcessId, "stderr", stderr);
//       }

//       await this.writeStaticAnalysisOutput(
//         processId,
//         testName,
//         runtime,
//         command,
//         stdout,
//         stderr
//       );
//       return { stdout, stderr };
//     })
//     .catch(async (error: any) => {
//       // Capture stdout and stderr from the error object
//       const stdout = error.stdout || "";
//       const stderr = error.stderr || error.message || "";

//       // Log the error output
//       if (stdout) {
//         this.addLogEntry(fullProcessId, "stdout", stdout);
//       }
//       if (stderr) {
//         this.addLogEntry(fullProcessId, "stderr", stderr);
//       }

//       await this.writeStaticAnalysisOutput(
//         processId,
//         testName,
//         runtime,
//         command,
//         stdout,
//         stderr
//       );

//       // Re-throw the error with captured output
//       const enhancedError = new Error(
//         `Command failed: ${dockerCommand}\nstdout: ${stdout}\nstderr: ${stderr}`
//       );
//       (enhancedError as any).stdout = stdout;
//       (enhancedError as any).stderr = stderr;
//       throw enhancedError;
//     });

//   // Add the promise to process manager for tracking
//   if ((this as any).addPromiseProcess) {
//     (this as any).addPromiseProcess(
//       fullProcessId,
//       promise,
//       `Static analysis for ${testName}: ${command}`,
//       "build-time",
//       testName,
//       runtime
//     );
//   }

//   try {
//     await promise;
//   } catch (error) {
//     // The error has already been logged, so we don't need to re-throw it
//     // Just mark the process as completed with error
//     throw error;
//   }
// }

// private async writeStaticAnalysisOutput(
//   processId: string,
//   testName: string,
//   runtime: IRunTime,
//   command: string,
//   stdout: string,
//   stderr: string
// ): Promise<void> {
//   const reportDest = `testeranto/reports/${
//     this.projectName || "default"
//   }/${testName}/${runtime}/static-analysis`;

//   if (!fs.existsSync(reportDest)) {
//     fs.mkdirSync(reportDest, { recursive: true });
//   }

//   const sanitizedCommand = sanitizeCommandForFilename(command, 50);
//   const timestamp = Date.now();
//   const outputFile = path.join(
//     reportDest,
//     `${sanitizedCommand}_${timestamp}.log`
//   );

//   const outputContent = formatStaticAnalysisOutput(
//     command,
//     processId,
//     testName,
//     runtime,
//     stdout,
//     stderr
//   );

//   fs.writeFileSync(outputFile, outputContent);

//   this.addLogEntry(
//     processId,
//     "stdout",
//     `Static analysis completed: ${command}. Output written to ${outputFile}`
//   );
// }

// private getStaticAnalysisCommands(
//   projectName: string,
//   runtime: IRunTime,
//   addableFiles: string[]
// ): string[] {
//   switch (runtime) {
//     case "node":
//       return this.configs.node?.checks.map((c) => {
//         return c(addableFiles);
//       });
//     case "web":
//       return this.configs.web?.checks.map((c) => {
//         return c(addableFiles);
//       });
//     case "python":
//       return this.configs.python?.checks.map((c) => {
//         return c(addableFiles);
//       });
//     case "golang":
//       return this.configs.golang?.checks.map((c) => {
//         return c(addableFiles);
//       });
//     default:
//       throw "unknown runtime";
//   }
// }

// async scheduleBddTest(
//   metafile: IMetaFile,
//   runtime: IRunTime,
//   entrypoint: string
// ): Promise<void> {
//   console.log(`[BDD] Scheduling BDD test for ${testName} (${runtime})`);
//   // const bddCommands = this.getBddTestCommand(testName, runtime);
//   // console.log(`[BDD] Commands retrieved:`, bddCommands);
//   // if (!bddCommands || bddCommands.length === 0) {
//   //   console.log(
//   //     `[BDD] No BDD test commands found for ${testName} (${runtime})`
//   //   );
//   //   // Try to get default commands

//   //   console.log(`[BDD] Default commands:`, defaultCommands);
//   //   if (defaultCommands && defaultCommands.length > 0) {
//   //     console.log(`[BDD] Using default commands`);

//   //   }
//   //   return;
//   // }

//   // const defaultCommand = this.getDefaultBddTestCommand(testName, runtime);
//   await this.runBddCommandsWithDefaults(
//     testId,
//     testName,
//     runtime,
//     this.getDefaultBddTestCommand(testName, runtime)
//   );

//   const processId = `bdd-${testId}`;
//   console.log(`[BDD] Process ID: ${processId}`);

//   // await this.executeBddTestInDocker(processId, testName, runtime, command);
// }

// private async scheduleStaticTest(
//   metafile: IMetaFile,
//   runtime: IRunTime,
//   entrypoint: string
// ): Promise<void> {
//   console.log(`[BDD] Scheduling BDD test for ${testName} (${runtime})`);
//   await this.runBddCommandsWithDefaults(
//     testId,
//     testName,
//     runtime,
//     this.getDefaultBddTestCommand(testName, runtime)
//   );

//   const processId = `bdd-${testId}`;
//   console.log(`[BDD] Process ID: ${processId}`);

//   // await this.executeBddTestInDocker(processId, testName, runtime, command);
// }

// private async runBddCommandsWithDefaults(
//   testId: string,
//   testName: string,
//   runtime: IRunTime,
//   command: string
// ): Promise<void> {
//   const processId = `bdd-${testId}`;
//   console.log(`[BDD] Executing default command: ${command}`);
//   await this.executeBddTestInDocker(processId, testName, runtime, command);
// }

// private async executeBddTestInDocker(
//   processId: string,
//   testName: string,
//   runtime: IRunTime,
//   command: string
// ): Promise<void> {
//   const execAsync = promisify(exec);
//   const cwd = process.cwd();
//   const dockerCommand = generateDockerCommand(
//     runtime,
//     processId,
//     command,
//     cwd
//   );

//   console.log(`[BDD] Generated docker command: ${dockerCommand}`);

//   // Create a unique process ID for this command
//   const fullProcessId = `${processId}-${command
//     .substring(0, 20)
//     .replace(/\s+/g, "_")}`;

//   // Log the command being executed
//   this.addLogEntry(
//     fullProcessId,
//     "stdout",
//     `Executing BDD test docker command: ${dockerCommand}`
//   );
//   console.log(`[BDD] Full process ID: ${fullProcessId}`);

//   // Create a promise that captures stdout and stderr
//   const promise = execAsync(dockerCommand, {
//     maxBuffer: 10 * 1024 * 1024,
//   })
//     .then(async ({ stdout, stderr }) => {
//       // Log stdout and stderr
//       if (stdout) {
//         this.addLogEntry(fullProcessId, "stdout", stdout);
//       }
//       if (stderr) {
//         this.addLogEntry(fullProcessId, "stderr", stderr);
//       }

//       await this.writeBddTestOutput(
//         processId,
//         testName,
//         runtime,
//         command,
//         stdout,
//         stderr
//       );
//       return { stdout, stderr };
//     })
//     .catch(async (error: any) => {
//       // Capture stdout and stderr from the error object
//       const stdout = error.stdout || "";
//       const stderr = error.stderr || error.message || "";

//       // Log the error output
//       if (stdout) {
//         this.addLogEntry(fullProcessId, "stdout", stdout);
//       }
//       if (stderr) {
//         this.addLogEntry(fullProcessId, "stderr", stderr);
//       }

//       await this.writeBddTestOutput(
//         processId,
//         testName,
//         runtime,
//         command,
//         stdout,
//         stderr
//       );

//       // Re-throw the error with captured output
//       const enhancedError = new Error(
//         `BDD test command failed: ${dockerCommand}\nstdout: ${stdout}\nstderr: ${stderr}`
//       );
//       (enhancedError as any).stdout = stdout;
//       (enhancedError as any).stderr = stderr;
//       throw enhancedError;
//     });

//   // Add the promise to process manager for tracking
//   if ((this as any).addPromiseProcess) {
//     (this as any).addPromiseProcess(
//       fullProcessId,
//       promise,
//       `BDD test for ${testName}: ${command}`,
//       "bdd-test",
//       testName,
//       runtime
//     );
//   }

//   try {
//     await promise;
//   } catch (error) {
//     // The error has already been logged, so we don't need to re-throw it
//     // Just mark the process as completed with error
//     throw error;
//   }
// }

//   private async writeBddTestOutput(
//     processId: string,
//     testName: string,
//     runtime: IRunTime,
//     command: string,
//     stdout: string,
//     stderr: string
//   ): Promise<void> {
//     const reportDest = `testeranto/reports/${
//       this.projectName || "default"
//     }/${testName}/${runtime}/bdd-test`;

//     if (!fs.existsSync(reportDest)) {
//       fs.mkdirSync(reportDest, { recursive: true });
//     }

//     const sanitizedCommand = sanitizeCommandForFilename(command, 50);
//     const timestamp = Date.now();
//     const outputFile = path.join(
//       reportDest,
//       `${sanitizedCommand}_${timestamp}.log`
//     );

//     const outputContent = this.formatBddTestOutput(
//       command,
//       processId,
//       testName,
//       runtime,
//       stdout,
//       stderr
//     );

//     fs.writeFileSync(outputFile, outputContent);

//     this.addLogEntry(
//       processId,
//       "stdout",
//       `BDD test completed: ${command}. Output written to ${outputFile}`
//     );
//   }

//   private formatBddTestOutput(
//     command: string,
//     processId: string,
//     testName: string,
//     runtime: IRunTime,
//     stdout: string,
//     stderr: string
//   ): string {
//     return `BDD Test Execution Report
// ============================
// Test Name: ${testName}
// Runtime: ${runtime}
// Process ID: ${processId}
// Command: ${command}
// Timestamp: ${new Date().toISOString()}

// STDOUT:
// ${stdout}

// STDERR:
// ${stderr}

// End of Report
// `;
//   }

// private getBddTestCommand(testName: string, runtime: IRunTime): string {
//   let runItem: any;

//   switch (runtime) {
//     case "node":
//       runItem = this.configs.node?.run;
//       console.log(`[BDD]  :`, runItem);
//       break;
//     case "web":
//       runItem = config.web?.run;
//       console.log(`[BDD] Web run item:`, runItem);
//       break;
//     case "python":
//       runItem = config.python?.run;
//       console.log(`[BDD] Python run item:`, runItem);
//       break;
//     case "golang":
//       runItem = config.golang?.run;
//       console.log(`[BDD] Golang run item:`, runItem);
//       break;
//     default:
//       console.log(`[BDD] Unknown runtime: ${runtime}`);
//       return null;
//   }

//   const commands: string[] = [];

//   if (Array.isArray(runItem)) {
//     console.log(`[BDD] Run item is an array`);
//     for (const item of runItem) {
//       if (typeof item === "function") {
//         try {
//           const command = item(testName);
//           console.log(`[BDD] Function returned command:`, command);
//           if (command && typeof command === "string") {
//             commands.push(command);
//           }
//         } catch (error) {
//           console.error(`[BDD] Error executing function:`, error);
//         }
//       } else if (typeof item === "string") {
//         const command = item
//           .replace("${x}", testName)
//           .replace("$x", testName);
//         console.log(`[BDD] String command:`, command);
//         commands.push(command);
//       }
//     }
//   } else if (typeof runItem === "string") {
//     const command = runItem.replace("${x}", testName).replace("$x", testName);
//     console.log(`[BDD] Single string command:`, command);
//     commands.push(command);
//   } else if (typeof runItem === "function") {
//     try {
//       const command = runItem(testName);
//       console.log(`[BDD] Function command:`, command);
//       if (command && typeof command === "string") {
//         commands.push(command);
//       }
//     } catch (error) {
//       console.error(`[BDD] Error executing function:`, error);
//     }
//   } else if (runItem === undefined) {
//     console.log(`[BDD] Run item is undefined for ${runtime}`);
//   } else {
//     console.log(`[BDD] Run item is of type: ${typeof runItem}`, runItem);
//   }

//   console.log(`[BDD] Final commands for ${testName} (${runtime}):`, commands);
//   return commands.length > 0 ? commands : null;
// }

// private getDefaultBddTestCommand(
//   testName: string,
//   runtime: IRunTime
// ): string {
//   // Extract the base test name from the path
//   // testName could be a full path like "testeranto/metafiles/node/allTests.json"
//   // or just a name like "Calculator"
//   let baseTestName = testName;

//   // If it contains a path, extract the last part without extension
//   if (testName.includes("/") || testName.includes("\\")) {
//     const parts = testName.split(/[/\\]/);
//     const lastPart = parts[parts.length - 1];
//     // Remove extension
//     baseTestName = lastPart.replace(/\.[^/.]+$/, "");
//   }

//   // Also, if it's something like "allTests", we might want to look for specific test files
//   // But for now, we'll use the base name

//   console.log(
//     `[BDD] Extracted base test name: ${baseTestName} from ${testName}`
//   );

//   // Default commands for each runtime
//   // These should match the bundle structure
//   switch (runtime) {
//     case "node":
//       return `node testeranto/bundles/allTests/node/example/${baseTestName}.test.mjs`;
//     case "web":
//       return `node testeranto/bundles/allTests/web/example/${baseTestName}.test.mjs`;
//     case "python":
//       return `python testeranto/bundles/allTests/python/Calculator.pitono.test.bundled.py`;
//     case "golang":
//       return `go run testeranto/bundles/allTests/golang/example/Calculator.test`;
//     default:
//       throw "unknown runtime";
//   }
// }

// public addTestToSchedulingQueue(
//   testId: string,
//   testName: string,
//   runtime: IRunTime,
//   ws: any
// ): void {
//   // const alreadyInQueue = this.testSchedulingQueue.some(
//   //   (item) => item.testId === testId
//   // );
//   // if (!alreadyInQueue) {
//   //   this.testSchedulingQueue.push({
//   //     testId,
//   //     testName,
//   //     runtime,
//   //     ws,
//   //     timestamp: new Date(),
//   //   });
//   //   this.processSchedulingQueue();
//   // }
// }

// private async processSchedulingQueue(): Promise<void> {
//   if (
//     this.processingSchedulingQueue ||
//     this.testSchedulingQueue.length === 0
//   ) {
//     return;
//   }

//   this.processingSchedulingQueue = true;

//   try {
//     while (this.testSchedulingQueue.length > 0) {
//       const item = this.testSchedulingQueue.shift();
//       if (!item) continue;

//       const { testId, testName, runtime, ws } = item;

//       let allocatedPorts: number[] | null = null;
//       const testResourceConfiguration: any = {
//         name: testName,
//         fs: process.cwd(),
//         ports: [],
//         timeout: 30000,
//         retries: 3,
//         environment: {},
//       };

//       switch (runtime) {
//         case "web":
//           // allocatedPorts = this.allocatePorts(2, testName);
//           testResourceConfiguration.ports = allocatedPorts || [3000, 3001];
//           testResourceConfiguration.browserWSEndpoint =
//             process.env.BROWSER_WS_ENDPOINT || "";
//           break;
//         default:
//           // allocatedPorts = this.allocatePorts(1, testName);
//           testResourceConfiguration.ports = allocatedPorts || [3000];
//       }

//       // if (ws.readyState === WebSocket.OPEN) {
//       //   const testResourceConfig: ITestResourceConfiguration = {
//       //     name: testName,
//       //     fs: process.cwd(),
//       //     ports: testResourceConfiguration.ports,
//       //     timeout: testResourceConfiguration.timeout,
//       //     retries: testResourceConfiguration.retries,
//       //     environment: testResourceConfiguration.environment,
//       //   };
//       //   if (
//       //     runtime === "web" &&
//       //     testResourceConfiguration.browserWSEndpoint
//       //   ) {
//       //     testResourceConfig.browserWSEndpoint =
//       //       testResourceConfiguration.browserWSEndpoint;
//       //   }

//       //   const message = {
//       //     type: "testResource",
//       //     data: {
//       //       testId,
//       //       testName,
//       //       runtime,
//       //       allocatedAt: new Date().toISOString(),
//       //       testResourceConfiguration: testResourceConfig,
//       //     },
//       //     timestamp: new Date().toISOString(),
//       //   };

//       //   try {
//       //     ws.send(JSON.stringify(message));
//       //   } catch (error) {
//       //     this.testSchedulingQueue.unshift(item);
//       //   }
//       // } else {
//       //   this.testSchedulingQueue.unshift(item);
//       // }
//     }
//   } finally {
//     this.processingSchedulingQueue = false;
//   }
// }

// getSchedulingQueueMethod() {
//   return this.addTestToSchedulingQueue.bind(this);
// }

// protected scheduleTestForExecution(
//   testId: string,
//   testName: string,
//   runtime: any,
//   ws: any
// ): void {
//   if (!(this as any).testInfoMap) {
//     (this as any).testInfoMap = new Map();
//   }
//   (this as any).testInfoMap.set(testId, { testName, runtime });

//   this.addTestToSchedulingQueue(testId, testName, runtime, ws);
// }

// private testSchedulingQueue: Array<{
//   testId: string;
//   testName: string;
//   runtime: IRunTime;
//   ws: any;
//   timestamp: Date;
// }> = [];
// private processingSchedulingQueue: boolean = false;
