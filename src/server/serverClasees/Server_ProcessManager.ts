// This Server manages processes-as-docker-commands.

import fs from "fs";
import path from "path";
import { IBuiltConfig, IRunTime } from "../../Types";
import { IMode } from "../types";
import { Server_Queue } from "./Server_Queue";
import {
  createLogStreams,
  ProcessCategory,
  ProcessInfo,
} from "./utils/Server_ProcessManager";
import { IMetaFile } from "./utils/types";

export class Server_ProcessManager extends Server_Queue {
  ports: Record<number, string> = {};
  logStreams: Record<string, ReturnType<typeof createLogStreams>> = {};
  allProcesses: Map<string, ProcessInfo> = new Map();
  processLogs: Map<string, string[]> = new Map();
  runningProcesses: Map<string, Promise<any>> = new Map();

  constructor(configs: IBuiltConfig, testName: string, mode: IMode) {
    super(configs, testName, mode);
    this.configs = configs;
    this.projectName = testName;

    // Initialize ports if configs.ports exists
    if (configs.ports && Array.isArray(configs.ports)) {
      configs.ports.forEach((port) => {
        this.ports[port] = ""; // set ports as open
      });
    }
  }

  async stop() {
    Object.values(this.logStreams || {}).forEach((logs) => logs.closeAll());
    await super.stop();
  }

  // Get process summary for monitoring
  getProcessSummary = () => {
    const processes = [];

    // Docker/process-based tests
    for (const [id, info] of this.allProcesses.entries()) {
      processes.push({
        id,
        command: info.command,
        status: info.status,
        type: info.type,
        category: info.category,
        testName: info.testName,
        platform: info.platform,
        timestamp: info.timestamp,
        exitCode: info.exitCode,
        error: info.error,
        logs: this.getProcessLogs(id).slice(-10), // Last 10 logs
      });
    }

    return {
      totalProcesses: this.allProcesses.size,
      running: Array.from(this.allProcesses.values()).filter(
        (p) => p.status === "running"
      ).length,
      completed: Array.from(this.allProcesses.values()).filter(
        (p) => p.status === "completed"
      ).length,
      errors: Array.from(this.allProcesses.values()).filter(
        (p) => p.status === "error"
      ).length,
      processes,
    };
  };

  // Get logs for a process
  getProcessLogs = (processId: string): string[] => {
    return this.processLogs.get(processId) || [];
  };

  // Add log entry from any source
  addLogEntry = (
    processId: string,
    source: "stdout" | "stderr" | "console" | "network" | "error",
    message: string,
    timestamp: Date = new Date()
  ) => {
    if (!this.processLogs.has(processId)) {
      this.processLogs.set(processId, []);
    }

    const logEntry = `[${timestamp.toISOString()}] [${source}] ${message}`;
    this.processLogs.get(processId)!.push(logEntry);

    // Also write to a log file for docker processes
    this.writeToProcessLogFile(processId, source, message, timestamp);

    // Send to log subscribers if they exist
    if ((this as any).logSubscriptions) {
      const subscriptions = (this as any).logSubscriptions.get(processId);
      if (subscriptions) {
        const logMessage = {
          type: "logEntry",
          processId,
          source,
          message,
          timestamp: timestamp.toISOString(),
        };
        subscriptions.forEach((client: any) => {
          if (client.readyState === 1) {
            client.send(JSON.stringify(logMessage));
          }
        });
      }
    }
  };

  private writeToProcessLogFile(
    processId: string,
    source: "stdout" | "stderr" | "console" | "network" | "error",
    message: string,
    timestamp: Date
  ) {
    const logDir = path.join(
      process.cwd(),
      "testeranto",
      "reports",
      this.projectName,
      "docker-process-logs"
    );
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Create or append to log file
    const logFile = path.join(logDir, `${processId}.log`);
    const logEntry = `[${timestamp.toISOString()}] [${source}] ${message}\n`;

    fs.appendFileSync(logFile, logEntry);
  }

  // Port management methods
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

  // Execute a command and track it as a process
  executeCommand = async (
    processId: string,
    command: string,
    category: ProcessCategory,
    testName?: string,
    platform?: IRunTime,
    options?: any
  ) => {
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const execAsync = promisify(exec);

    this.addLogEntry(processId, "stdout", `Starting command: ${command}`);

    const promise = execAsync(command, {
      ...options,
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large outputs
    })
      .then(({ stdout, stderr }) => {
        // Return stdout and stderr for capture
        return { stdout, stderr };
      })
      .catch((error) => {
        // Ensure error has stdout and stderr
        error.stdout = error.stdout || "";
        error.stderr = error.stderr || "";
        throw error;
      });

    // Add as a promise process which will capture logs
    this.addPromiseProcess(
      processId,
      promise,
      command,
      category,
      testName,
      platform
    );

    return promise;
  };

  // Add promise process tracking
  addPromiseProcess = (
    processId: string,
    promise: Promise<any> | undefined,
    command: string,
    category: ProcessCategory,
    testName?: string,
    platform?: IRunTime
  ) => {
    // Create a wrapper promise that never rejects to prevent system crashes
    const safePromise = new Promise<{
      success: boolean;
      error?: any;
      stdout?: string;
      stderr?: string;
    }>(async (resolve) => {
      try {
        // If promise is undefined, just resolve with success
        if (!promise) {
          resolve({ success: true });
          return;
        }

        // Wait for the actual promise to settle
        const result = await promise;
        // If it resolves, we're good
        resolve({
          success: true,
          stdout: result?.stdout,
          stderr: result?.stderr,
        });
      } catch (error: any) {
        // If it rejects, capture stdout and stderr from the error if available
        console.log(
          `[Process ${processId}] Non-critical error:`,
          error.message
        );
        // Try to extract stdout and stderr from the error object
        const stdout = error.stdout || error.output?.[1] || error.message;
        const stderr = error.stderr || error.output?.[2] || error.stack;
        resolve({ success: false, error, stdout, stderr });
      }
    });

    // Store the process info
    const processInfo: ProcessInfo = {
      promise: safePromise,
      status: "running",
      command,
      timestamp: new Date().toISOString(),
      type: "promise",
      category,
      testName,
      platform: platform || "node",
    };

    this.allProcesses.set(processId, processInfo);
    this.runningProcesses.set(processId, safePromise);

    // Set up promise completion handlers
    safePromise
      .then(({ success, error, stdout, stderr }) => {
        const info = this.allProcesses.get(processId);
        if (info) {
          info.status = "completed";
          info.exitCode = success ? 0 : 1;
          // Build a comprehensive error message
          let errorMessage = "";
          if (error) {
            errorMessage = error.message || String(error);
          }
          // Include stdout and stderr in the error field for better debugging
          const details = [];
          if (stdout) details.push(`stdout: ${stdout}`);
          if (stderr) details.push(`stderr: ${stderr}`);
          if (details.length > 0) {
            info.error = `${errorMessage}\n${details.join("\n")}`;
          } else if (errorMessage) {
            info.error = errorMessage;
          }
        }
        this.runningProcesses.delete(processId);

        // Log stdout and stderr separately
        if (stdout) {
          this.addLogEntry(processId, "stdout", stdout);
        }
        if (stderr) {
          this.addLogEntry(processId, "stderr", stderr);
        }

        const message = success
          ? `Process ${processId} completed successfully`
          : `Process ${processId} completed with non-critical error`;
        this.addLogEntry(processId, success ? "stdout" : "stderr", message);
      })
      .catch((error) => {
        // This should never happen since safePromise never rejects, but just in case
        const info = this.allProcesses.get(processId);
        if (info) {
          info.status = "completed";
          info.exitCode = 1;
          info.error = error?.message || String(error);
        }
        this.runningProcesses.delete(processId);
        this.addLogEntry(
          processId,
          "stderr",
          `Process ${processId} completed with unexpected error: ${
            error?.message || String(error)
          }`
        );
      });
  };

  async scheduleBddTest(
    metafile: IMetaFile,
    runtime: IRunTime,
    entrypoint: string
  ): Promise<void> {
    console.log(
      `[ProcessManager] Scheduling BDD test for ${entrypoint} (${runtime})`
    );

    this.enqueue(runtime, `yarn tsx ${entrypoint}`);
  }

  async scheduleStaticTests(
    metafile: IMetaFile,
    runtime: IRunTime,
    entrypoint: string,
    addableFiles: string[]
  ): Promise<void> {
    console.log(
      `[ProcessManager] Scheduling Static test for ${entrypoint} (${runtime})`
    );

    for (const check of this.configs[runtime].checks) {
      this.enqueue(runtime, `${check(addableFiles)}`);
    }
  }
}

////////////////////////////////////////////////////////////////
// DEPRECATED
////////////////////////////////////////////////////////////////

// const bddCommands = this.getBddTestCommand(testName, runtime);
// console.log(`[BDD] Commands retrieved:`, bddCommands);
// if (!bddCommands || bddCommands.length === 0) {
//   console.log(
//     `[BDD] No BDD test commands found for ${testName} (${runtime})`
//   );
//   // Try to get default commands

//   console.log(`[BDD] Default commands:`, defaultCommands);
//   if (defaultCommands && defaultCommands.length > 0) {
//     console.log(`[BDD] Using default commands`);

//   }
//   return;
// }

// const defaultCommand = this.getDefaultBddTestCommand(testName, runtime);
// await this.runBddCommandsWithDefaults(
//   testId,
//   testName,
//   runtime,
//   this.getDefaultBddTestCommand(testName, runtime)
// );
// const processId = `bdd-${testId}`;
// console.log(`[BDD] Process ID: ${processId}`);
// await this.executeBddTestInDocker(processId, testName, runtime, command);

// DEPRECATED
// await this.runBddCommandsWithDefaults(
//   testId,
//   testName,
//   runtime,
//   this.getDefaultBddTestCommand(testName, runtime)
// );

// const processId = `bdd-${testId}`;
// console.log(`[BDD] Process ID: ${processId}`);

// await this.executeBddTestInDocker(processId, testName, runtime, command);
