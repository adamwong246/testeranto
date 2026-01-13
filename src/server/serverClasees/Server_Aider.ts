// This Server manages processes-as-docker-commands. Processes are scheduled in queue.
// It should also leverage Server_HTTP and SERVER_WS

import { IRunTime } from "../../Types";
import { IMetaFile } from "./utils/types";
import { Server_ProcessManager } from "./Server_ProcessManager";

export class Server_Aider extends Server_ProcessManager {
  private aiderProcessManager: any;
  private aiderProcesses: Map<string, any> = new Map(); // Store actual aider processes

  async stop() {
    // Stop all aider processes
    for (const [processId, aiderProcess] of this.aiderProcesses.entries()) {
      try {
        this.addLogEntry(processId, "stdout", `Stopping aider process ${processId}`, new Date(), "info");
        aiderProcess.kill('SIGTERM');
        // Wait a bit then force kill if needed
        setTimeout(() => {
          if (!aiderProcess.killed) {
            aiderProcess.kill('SIGKILL');
          }
        }, 2000);
      } catch (error: any) {
        console.error(`[ProcessManager] Failed to stop aider process ${processId}:`, error);
      }
    }
    this.aiderProcesses.clear();

    await super.stop();
  }

  // Create aider process for a specific test as a background command
  createAiderProcess = async (
    runtime: IRunTime,
    testPath: string,
    metafile: IMetaFile
  ): Promise<void> => {
    if (!this.aiderProcessManager) {
      const { AiderProcessManager } = await import("./utils/AiderProcessManager");
      this.aiderProcessManager = new AiderProcessManager(
        this.executeCommand,
        this.addLogEntry,
        this.allProcesses,
        this.aiderProcesses
      );
    }

    return this.aiderProcessManager.createAiderProcess(runtime, testPath, metafile);
  };
}