/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebSocket } from "ws";
import { WebSocketMessage } from "../../clients/types";
import { Server_TCP_WebSocketBase } from "./Server_TCP_WebSocketBase";
import { IMode } from "../types";

export class Server_TCP_WebSocketProcess extends Server_TCP_WebSocketBase {
  constructor(configs: any, name: string, mode: IMode) {
    super(configs, name, mode);

    // Override runningProcesses.set to capture logs for new processes
    this.overrideRunningProcessesSet();

    // Attach log capture to existing processes (after parent may have added some)
    setTimeout(() => {
      this.attachLogCaptureToExistingProcesses();
    }, 100);

    // Override launch methods to capture errors
    this.overrideLaunchMethods();
  }

  protected handleWebSocketMessageTypes(
    wsm: WebSocketMessage,
    ws: WebSocket
  ): void {
    // First, let the base class handle its message types
    super.handleWebSocketMessageTypes(wsm, ws);

    // Then handle process-specific message types
    if (wsm.type === "getProcesses") {
      // Handle monitoring request for processes
      ws.send(
        JSON.stringify({
          type: "processes",
          data: this.getProcessSummary(),
          timestamp: new Date().toISOString(),
        })
      );
    } else if (wsm.type === "getLogs") {
      // Handle monitoring request for logs
      const processId = wsm.data?.processId;
      if (processId) {
        ws.send(
          JSON.stringify({
            type: "logs",
            processId,
            logs: this.getProcessLogs(processId),
            timestamp: new Date().toISOString(),
          })
        );
      }
    } else if (wsm.type === "subscribeToLogs") {
      // Handle subscription to log updates
      const processId = wsm.data?.processId;
      if (processId) {
        // Store subscription info
        if (!(this as any).logSubscriptions) {
          (this as any).logSubscriptions = new Map();
        }
        const subscriptions =
          (this as any).logSubscriptions.get(processId) || new Set();
        subscriptions.add(ws);
        (this as any).logSubscriptions.set(processId, subscriptions);

        ws.send(
          JSON.stringify({
            type: "logSubscription",
            processId,
            status: "subscribed",
            timestamp: new Date().toISOString(),
          })
        );
      }
    }
    // Note: Unhandled message types are already logged in the base class
  }

  private getProcessSummary(): { processes: any[] } {
    const processes = Array.from(this.allProcesses.entries()).map(
      ([id, procInfo]) =>
        this.serializeProcessInfo(id, procInfo, this.processLogs.get(id) || [])
    );
    return { processes };
  }

  private getProcessLogs(processId: string): any[] {
    return this.processLogs.get(processId) || [];
  }

  // Method to broadcast logs to subscribed clients
  public broadcastLogs(processId: string, logEntry: any): void {
    if (!(this as any).logSubscriptions) {
      (this as any).logSubscriptions = new Map();
    }
    const subscriptions = (this as any).logSubscriptions.get(processId);
    if (subscriptions) {
      const message = JSON.stringify({
        type: "logs",
        processId,
        logs: [logEntry],
        timestamp: new Date().toISOString(),
      });
      subscriptions.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
    // Also broadcast to a general log channel for all clients
    const generalMessage = JSON.stringify({
      type: "logs",
      processId: "system",
      logs: [logEntry],
      timestamp: new Date().toISOString(),
    });
    this.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(generalMessage);
      }
    });
  }

  // Attach log capture to existing processes
  private attachLogCaptureToExistingProcesses(): void {
    if (!this.runningProcesses || !(this.runningProcesses instanceof Map)) {
      console.warn("runningProcesses is not available or not a Map");
      return;
    }
    for (const [processId, proc] of this.runningProcesses.entries()) {
      this.attachLogCapture(processId, proc);
    }
  }

  // Override runningProcesses.set to capture logs for new processes
  private overrideRunningProcessesSet(): void {
    console.log(
      "Attempting to override runningProcesses.set",
      this.runningProcesses
    );
    if (!(this.runningProcesses instanceof Map)) {
      console.warn("runningProcesses is not a Map, cannot override set");
      return;
    }
    const originalSet = this.runningProcesses.set.bind(this.runningProcesses);
    this.runningProcesses.set = (key: string, value: any) => {
      console.log(`runningProcesses.set called for ${key}`);
      const result = originalSet(key, value);
      this.attachLogCapture(key, value);
      return result;
    };
  }

  // Attach log capture to a single process
  private attachLogCapture(processId: string, childProcess: any): void {
    console.log(
      `Attaching log capture to process ${processId}`,
      childProcess ? "has childProcess" : "no childProcess"
    );
    if (!childProcess) {
      console.warn(`No childProcess for ${processId}`);
      return;
    }

    // Capture stdout
    if (childProcess.stdout && typeof childProcess.stdout.on === "function") {
      console.log(`Process ${processId} has stdout`);
      childProcess.stdout.on("data", (data: Buffer) => {
        const message = data.toString().trim();
        if (message) {
          this.addProcessLog(processId, "info", message, "stdout");
        }
      });
    } else {
      console.warn(`Child process ${processId} has no stdout or stdout.on`);
    }

    // Capture stderr
    if (childProcess.stderr && typeof childProcess.stderr.on === "function") {
      console.log(`Process ${processId} has stderr`);
      childProcess.stderr.on("data", (data: Buffer) => {
        const message = data.toString().trim();
        if (message) {
          this.addProcessLog(processId, "error", message, "stderr");
        }
      });
    } else {
      console.warn(`Child process ${processId} has no stderr or stderr.on`);
    }
  }

  // Override launch methods to capture errors
  private overrideLaunchMethods(): void {
    const methods = ["launchNode", "launchWeb", "launchPython", "launchGolang"];
    methods.forEach((methodName) => {
      if (
        (this as any)[methodName] &&
        typeof (this as any)[methodName] === "function"
      ) {
        const originalMethod = (this as any)[methodName];
        (this as any)[methodName] = async (...args: any[]) => {
          try {
            const result = await originalMethod.apply(this, args);
            return result;
          } catch (error: any) {
            // Generate a processId for this failed launch
            const processId = `failed_${methodName}_${Date.now()}`;
            this.addProcessLog(
              processId,
              "error",
              `Failed to launch via ${methodName}: ${error?.message || error}`,
              "launch"
            );
            throw error;
          }
        };
      }
    });
  }

  // Call this method when a process outputs data
  public addProcessLog(
    processId: string,
    level: string,
    message: string,
    source?: string
  ): void {
    // Ensure processLogs exists (inherited from parent)
    if (!this.processLogs) {
      console.error("processLogs not initialized");
      return;
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      source: source || "process",
    };

    console.log(`[LOG] ${processId} ${level}: ${message} (${source})`);

    // Add to processLogs
    const logs = this.processLogs.get(processId) || [];
    logs.push(logEntry);
    this.processLogs.set(processId, logs);

    // Broadcast to subscribed clients
    this.broadcastLogs(processId, logEntry);
  }

  // Helper method to serialize process info
  private serializeProcessInfo(id: string, procInfo: any, logs: any[]): any {
    return {
      processId: id,
      command: procInfo.command || "unknown",
      pid: procInfo.pid,
      timestamp: procInfo.timestamp || new Date().toISOString(),
      status: procInfo.status || "unknown",
      logs: logs.slice(-50), // Last 50 logs
    };
  }
}
