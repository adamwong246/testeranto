import { IBuiltConfig, IRunTime, ISummary } from "../../Types";
import { IMode } from "../types";
import { Server_Queue } from "./Server_Queue";

import {
  createLogStreams,
  ProcessCategory,
  ProcessInfo,
} from "./utils/Server_ProcessManager";

export class Server_ProcessManager extends Server_Queue {
  ports: Record<number, string> = {};
  logStreams: Record<string, ReturnType<typeof createLogStreams>> = {};
  launchers: Record<string, () => void>;
  allProcesses: Map<string, ProcessInfo> = new Map();
  processLogs: Map<string, string[]> = new Map();
  webProcesses: Map<
    string,
    {
      contextId: string;
      testName: string;
      startTime: Date;
      logs: string[];
      status: "running" | "completed" | "error";
    }
  > = new Map();

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

    this.launchers = {};

    // Start monitoring broadcast if configured
    // if (configs.monitoring) {
    //   // Use setTimeout to ensure the server is fully initialized
    //   setTimeout(() => {
    //     this.startMonitoringBroadcast();
    //   }, 1000);
    // }
  }

  // Start monitoring broadcast using existing WebSocket server
  // startMonitoringBroadcast = () => {
  //   console.log("Starting monitoring broadcast via existing WebSocket server");

  //   // Broadcast status updates at regular intervals
  //   if (this.webSocketBroadcastMessage) {
  //     setInterval(() => {
  //       this.webSocketBroadcastMessage({
  //         type: "statusUpdate",
  //         data: this.getProcessSummary(),
  //         timestamp: new Date().toISOString(),
  //       });
  //     }, this.configs.monitoring?.updateInterval || 1000);
  //   }
  // };

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

    // // Broadcast log via WebSocket
    // if (this.webSocketBroadcastMessage) {
    //   this.webSocketBroadcastMessage({
    //     type: "logUpdate",
    //     processId,
    //     source,
    //     message,
    //     timestamp: timestamp.toISOString(),
    //   });
    // }

    // // Also broadcast to monitoring channel
    // if (this.webSocketBroadcastMessage) {
    //   this.webSocketBroadcastMessage({
    //     type: "monitoringLog",
    //     processId,
    //     source,
    //     message,
    //     timestamp: timestamp.toISOString(),
    //   });
    // }

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

  // Add promise process tracking
  addPromiseProcess = (
    processId: string,
    promise: Promise<any> | undefined,
    command: string,
    category: ProcessCategory,
    testName?: string,
    platform?: IRunTime
  ) => {
    // If promise is undefined, create a resolved promise
    const actualPromise = promise || Promise.resolve();

    // Store the process info
    const processInfo: ProcessInfo = {
      promise: actualPromise,
      status: "running",
      command,
      timestamp: new Date().toISOString(),
      type: "promise",
      category,
      testName,
      platform: platform || "node",
    };

    this.allProcesses.set(processId, processInfo);
    this.runningProcesses.set(processId, actualPromise);

    // Set up promise completion handlers
    actualPromise
      .then(() => {
        const info = this.allProcesses.get(processId);
        if (info) {
          info.status = "completed";
          info.exitCode = 0;
        }
        this.runningProcesses.delete(processId);
      })
      .catch((error) => {
        const info = this.allProcesses.get(processId);
        if (info) {
          info.status = "error";
          info.exitCode = -1;
          info.error = error.message;
        }
        this.runningProcesses.delete(processId);
      });

    // Broadcast process update if WebSocket is available
    // if (this.webSocketBroadcastMessage) {
    //   this.webSocketBroadcastMessage({
    //     type: "processUpdate",
    //     processId,
    //     process: processInfo,
    //   });
    // }
  };

  // Add web process (browser context)
  addWebProcess = (
    processId: string,
    contextId: string,
    testName: string,
    url: string
  ) => {
    this.webProcesses.set(processId, {
      contextId,
      testName,
      startTime: new Date(),
      logs: [],
      status: "running",
    });

    // Create a virtual process for tracking
    const processInfo: ProcessInfo = {
      status: "running",
      command: `Web test: ${testName} (${url})`,
      timestamp: new Date().toISOString(),
      type: "process",
      category: "bdd-test",
      testName,
      platform: "web",
    };

    this.allProcesses.set(processId, processInfo);

    // Broadcast process update
    // if (this.webSocketBroadcastMessage) {
    //   this.webSocketBroadcastMessage({
    //     type: "processUpdate",
    //     processId,
    //     process: processInfo,
    //   });
    // }

    this.addLogEntry(
      processId,
      "console",
      `Started web test: ${testName} at ${url}`
    );
  };

  // Update web process status
  updateWebProcessStatus = (
    processId: string,
    status: "completed" | "error",
    exitCode?: number,
    error?: string
  ) => {
    const webProcess = this.webProcesses.get(processId);
    if (webProcess) {
      webProcess.status = status;
    }

    const processInfo = this.allProcesses.get(processId);
    if (processInfo) {
      processInfo.status = status;
      if (exitCode !== undefined) processInfo.exitCode = exitCode;
      if (error) processInfo.error = error;
    }

    // Broadcast update
    // if (this.webSocketBroadcastMessage) {
    //   this.webSocketBroadcastMessage({
    //     type: "processUpdate",
    //     processId,
    //     process: processInfo,
    //   });
    // }

    const message =
      status === "completed"
        ? `Web test completed: ${webProcess?.testName || processId}`
        : `Web test failed: ${webProcess?.testName || processId} - ${
            error || "Unknown error"
          }`;

    this.addLogEntry(
      processId,
      status === "completed" ? "stdout" : "stderr",
      message
    );
  };

  // Check for shutdown (to be overridden or used by derived classes)
  // checkForShutdown = async () => {
  //   // Base implementation can be empty or provide common logic
  // };

  // WebSocket broadcast method - to be implemented by derived classes or parent
  // webSocketBroadcastMessage(message: any): void {
  //   // Default implementation that can be overridden
  //   const data =
  //     typeof message === "string" ? message : JSON.stringify(message);
  //   this.clients.forEach((client) => {
  //     if (client.readyState === 1) {
  //       client.send(data);
  //     }
  //   });
  // }

  async stop() {
    Object.values(this.logStreams || {}).forEach((logs) => logs.closeAll());
    await super.stop();
  }
}
