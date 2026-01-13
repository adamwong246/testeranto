import { exec } from "child_process";
import { promisify } from "util";
import { IRunTime } from "../../../Types";
import { ProcessCategory } from "./Server_ProcessManager";

export interface ExecuteCommandOptions {
  maxBuffer?: number;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  timeout?: number;
}

export interface ExecuteCommandResult {
  success: boolean;
  error?: any;
  stdout?: string;
  stderr?: string;
}

export class ProcessExecution {
  private addLogEntry: (
    processId: string,
    source: "stdout" | "stderr" | "console" | "network" | "error",
    message: string,
    timestamp?: Date,
    level?: string
  ) => void;
  
  private allProcesses: Map<string, any>;
  private runningProcesses: Map<string, Promise<any>>;

  constructor(
    addLogEntry: (
      processId: string,
      source: "stdout" | "stderr" | "console" | "network" | "error",
      message: string,
      timestamp?: Date,
      level?: string
    ) => void,
    allProcesses: Map<string, any>,
    runningProcesses: Map<string, Promise<any>>
  ) {
    this.addLogEntry = addLogEntry;
    this.allProcesses = allProcesses;
    this.runningProcesses = runningProcesses;
  }

  // Execute a command and track it as a process
  async executeCommand(
    processId: string,
    command: string,
    category: ProcessCategory,
    testName?: string,
    platform?: IRunTime,
    options?: ExecuteCommandOptions
  ): Promise<ExecuteCommandResult> {
    console.log(`[ProcessExecution] executeCommand( ${processId}, ${command} )`);
    
    // Validate processId
    if (!processId || typeof processId !== 'string') {
      console.error(`[ProcessExecution] Invalid processId: ${processId}. Generating fallback ID.`);
      processId = `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    const execAsync = promisify(exec);

    this.addLogEntry(processId, "stdout", `Starting command: ${command}`, new Date(), "info");

    // Create the original promise
    const originalPromise = execAsync(command, {
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

    // Add as a promise process which will capture logs and handle errors safely
    const safePromise = this.addPromiseProcessAndGetSafePromise(
      processId,
      originalPromise,
      command,
      category,
      testName,
      platform
    );

    // Return the safe promise that never rejects
    return safePromise;
  }

  // Helper method to add promise process and get the safe promise
  addPromiseProcessAndGetSafePromise(
    processId: string,
    promise: Promise<any>,
    command: string,
    category: ProcessCategory,
    testName?: string,
    platform?: IRunTime
  ): Promise<ExecuteCommandResult> {
    // Validate processId
    if (!processId || typeof processId !== 'string') {
      console.error(`[ProcessExecution] Invalid processId in addPromiseProcessAndGetSafePromise: ${processId}`);
      processId = `invalid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Create a wrapper promise that never rejects to prevent system crashes
    const safePromise = new Promise<ExecuteCommandResult>(async (resolve) => {
      try {
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
    const processInfo = {
      promise: safePromise,
      status: "running" as const,
      command,
      timestamp: new Date().toISOString(),
      type: "promise" as const,
      category,
      testName,
      platform: platform || "node" as IRunTime,
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
          this.addLogEntry(processId, "stdout", stdout, new Date(), "info");
        }
        if (stderr) {
          this.addLogEntry(processId, "stderr", stderr, new Date(), "error");
        }

        const message = success
          ? `Process ${processId} completed successfully`
          : `Process ${processId} completed with non-critical error`;
        this.addLogEntry(processId, success ? "stdout" : "stderr", message, new Date(), success ? "info" : "warn");
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
          }`,
          new Date(),
          "error"
        );
      });

    return safePromise;
  }
}
