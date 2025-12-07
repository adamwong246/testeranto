import { ChildProcess } from "child_process";
import { IRunTime } from "../Types.js";

export type ProcessCategory = "aider" | "bdd-test" | "build-time" | "other";
export type ProcessType = "process" | "promise";
export type ProcessStatus = "running" | "exited" | "error" | "completed";

export interface ProcessInfo {
  child?: ChildProcess;
  promise?: Promise<any>;
  status: ProcessStatus;
  exitCode?: number;
  error?: string;
  command: string;
  pid?: number;
  timestamp: string;
  type: ProcessType;
  category: ProcessCategory;
  testName?: string;
  platform: IRunTime;
}

export class ProcessManager {
  runningProcesses: Map<string, ChildProcess | Promise<any>> = new Map();
  allProcesses: Map<string, ProcessInfo> = new Map();
  processLogs: Map<string, string[]> = new Map();

  addPromiseProcess(
    processId: string,
    promise: Promise<any>,
    command: string,
    category: ProcessCategory,
    testName: string,
    platform: IRunTime,
    onResolve?: (result: any) => void,
    onReject?: (error: any) => void
  ): string {
    this.runningProcesses.set(processId, promise);
    this.allProcesses.set(processId, {
      promise,
      status: "running",
      command,
      timestamp: new Date().toISOString(),
      type: "promise",
      category,
      testName,
      platform,
    });

    // Initialize logs for this process
    this.processLogs.set(processId, []);

    const startMessage = `Starting: ${command}`;
    const logs = this.processLogs.get(processId) || [];
    logs.push(startMessage);
    this.processLogs.set(processId, logs);

    promise
      .then((result) => {
        this.runningProcesses.delete(processId);
        const processInfo = this.allProcesses.get(processId);
        if (processInfo) {
          this.allProcesses.set(processId, {
            ...processInfo,
            status: "completed",
            exitCode: 0,
          });
        }

        // Add log entry for process completion
        const successMessage = `Completed successfully with result: ${JSON.stringify(
          result
        )}`;
        const currentLogs = this.processLogs.get(processId) || [];
        currentLogs.push(successMessage);
        this.processLogs.set(processId, currentLogs);

        if (onResolve) onResolve(result);
      })
      .catch((error) => {
        this.runningProcesses.delete(processId);

        const processInfo = this.allProcesses.get(processId);
        if (processInfo) {
          this.allProcesses.set(processId, {
            ...processInfo,
            status: "error",
            error: error.message,
          });
        }

        const errorMessage = `Failed with error: ${error.message}`;
        const currentLogs = this.processLogs.get(processId) || [];
        currentLogs.push(errorMessage);
        this.processLogs.set(processId, currentLogs);

        if (onReject) onReject(error);
      });

    return processId;
  }

  getProcessesByCategory(category: ProcessCategory) {
    return Array.from(this.allProcesses.entries())
      .filter(([id, procInfo]) => procInfo.category === category)
      .map(([id, procInfo]) => ({
        processId: id,
        command: procInfo.command,
        pid: procInfo.pid,
        status: procInfo.status,
        exitCode: procInfo.exitCode,
        error: procInfo.error,
        timestamp: procInfo.timestamp,
        category: procInfo.category,
        testName: procInfo.testName,
        platform: procInfo.platform,
        logs: this.processLogs.get(id) || [],
      }));
  }

  getProcessesByTestName(testName: string) {
    return Array.from(this.allProcesses.entries())
      .filter(([id, procInfo]) => procInfo.testName === testName)
      .map(([id, procInfo]) => ({
        processId: id,
        command: procInfo.command,
        pid: procInfo.pid,
        status: procInfo.status,
        exitCode: procInfo.exitCode,
        error: procInfo.error,
        timestamp: procInfo.timestamp,
        category: procInfo.category,
        testName: procInfo.testName,
        platform: procInfo.platform,
        logs: this.processLogs.get(id) || [],
      }));
  }

  getProcessesByPlatform(platform: IRunTime) {
    return Array.from(this.allProcesses.entries())
      .filter(([id, procInfo]) => procInfo.platform === platform)
      .map(([id, procInfo]) => ({
        processId: id,
        command: procInfo.command,
        pid: procInfo.pid,
        status: procInfo.status,
        exitCode: procInfo.exitCode,
        error: procInfo.error,
        timestamp: procInfo.timestamp,
        category: procInfo.category,
        testName: procInfo.testName,
        platform: procInfo.platform,
        logs: this.processLogs.get(id) || [],
      }));
  }

  getProcessInfo(processId: string) {
    return this.allProcesses.get(processId);
  }

  getProcessLogs(processId: string) {
    return this.processLogs.get(processId) || [];
  }

  cleanupTestProcesses(testName: string): string[] {
    const processesToCleanup: string[] = [];

    // Find all process IDs that match this test name
    for (const [processId, processInfo] of this.allProcesses.entries()) {
      if (
        processInfo.testName === testName &&
        processInfo.status === "running"
      ) {
        processesToCleanup.push(processId);
      }
    }

    // Clean up each process
    processesToCleanup.forEach((processId) => {
      const processInfo = this.allProcesses.get(processId);
      if (processInfo) {
        // Kill child process if it exists
        if (processInfo.child) {
          try {
            processInfo.child.kill();
          } catch (error) {
            console.error(`Error killing process ${processId}:`, error);
          }
        }

        // Update process status
        this.allProcesses.set(processId, {
          ...processInfo,
          status: "exited",
          exitCode: -1,
          error: "Killed due to source file change",
        });

        // Remove from running processes
        this.runningProcesses.delete(processId);
      }
    });

    return processesToCleanup;
  }

  isTestRunning(testName: string): boolean {
    for (const processInfo of this.allProcesses.values()) {
      if (processInfo.testName === testName && processInfo.status === "running") {
        return true;
      }
    }
    return false;
  }
}
