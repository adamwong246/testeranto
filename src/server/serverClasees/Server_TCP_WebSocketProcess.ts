/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebSocket } from "ws";
import { WebSocketMessage } from "../../clients/types";
import { Server_TCP_WebSocketBase } from "./Server_TCP_WebSocketBase";
import { IMode } from "../types";

export class Server_TCP_WebSocketProcess extends Server_TCP_WebSocketBase {
  constructor(configs: any, name: string, mode: IMode) {
    console.log(`[WebSocketProcess] Creating Server_TCP_WebSocketProcess`);
    super(configs, name, mode);
    console.log(`[WebSocketProcess] Super constructor completed`);

    // Log WebSocket server status
    console.log(`[WebSocketProcess] wss exists: ${!!this.wss}`);
    console.log(`[WebSocketProcess] httpServer exists: ${!!this.httpServer}`);
    if (this.wss) {
      console.log(`[WebSocketProcess] WebSocket server event listeners:`, this.wss.eventNames());
    }

    // Override runningProcesses.set to capture logs for new processes
    console.log(`[WebSocketProcess] Overriding runningProcesses.set`);
    this.overrideRunningProcessesSet();

    // Attach log capture to existing processes (after parent may have added some)
    setTimeout(() => {
      console.log(`[WebSocketProcess] Attaching log capture to existing processes`);
      this.attachLogCaptureToExistingProcesses();
    }, 100);

    // Override launch methods to capture errors
    console.log(`[WebSocketProcess] Overriding launch methods`);
    this.overrideLaunchMethods();
    
    console.log(`[WebSocketProcess] Constructor completed`);
  }

  protected handleWebSocketMessageTypes(
    wsm: WebSocketMessage,
    ws: WebSocket
  ): void {
    console.log(`[WebSocketProcess] Handling WebSocket message type: ${wsm.type}`);
    console.log(`[WebSocketProcess] Message data:`, JSON.stringify(wsm.data).substring(0, 200));
    
    // First, let the base class handle its message types
    super.handleWebSocketMessageTypes(wsm, ws);

    // Then handle process-specific message types
    if (wsm.type === "getProcesses") {
      console.log(`[WebSocketProcess] Handling getProcesses request`);
      // Handle monitoring request for processes
      ws.send(
        JSON.stringify({
          type: "processes",
          data: this.getProcessSummary(),
          timestamp: new Date().toISOString(),
        })
      );
      console.log(`[WebSocketProcess] Sent processes data`);
    } else if (wsm.type === "getLogs") {
      // Handle monitoring request for logs
      const processId = wsm.data?.processId;
      console.log(`[WebSocketProcess] Handling getLogs request for process: ${processId}`);
      if (processId) {
        ws.send(
          JSON.stringify({
            type: "logs",
            processId,
            logs: this.getProcessLogs(processId),
            timestamp: new Date().toISOString(),
          })
        );
        console.log(`[WebSocketProcess] Sent logs for process ${processId}`);
      }
    } else if (wsm.type === "subscribeToLogs") {
      // Handle subscription to log updates
      const processId = wsm.data?.processId;
      console.log(`[WebSocketProcess] Handling subscribeToLogs for process: ${processId}`);
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
        console.log(`[WebSocketProcess] Subscribed to logs for process ${processId}`);
      }
    } else if (wsm.type === "greeting") {
      // Handle test greeting - test is ready to be scheduled
      const testName = wsm.data?.testName;
      const runtime = wsm.data?.runtime;
      const testId = wsm.data?.testId;
      
      console.log(`[WebSocketProcess] Received greeting from test: ${testName} (${runtime}), testId: ${testId}`);
      console.log(`[WebSocketProcess] Full greeting data:`, wsm.data);
      
      // Store WebSocket connection for this test
      if (!(this as any).testConnections) {
        (this as any).testConnections = new Map();
      }
      (this as any).testConnections.set(testId, ws);
      console.log(`[WebSocketProcess] Stored WebSocket connection for test ${testId}. Total connections: ${(this as any).testConnections.size}`);
      
      // Add test to scheduling queue
      // We need to access the ServerTaskCoordinator's queue
      // Since this class likely has access to it through inheritance or composition
      // For now, let's assume we can call a method to add to queue
      console.log(`[WebSocketProcess] Looking for addTestToSchedulingQueue method...`);
      if ((this as any).addTestToSchedulingQueue) {
        console.log(`[WebSocketProcess] Found addTestToSchedulingQueue, calling for test ${testId}`);
        (this as any).addTestToSchedulingQueue(testId, testName, runtime, ws);
      } else {
        console.warn("[WebSocketProcess] No addTestToSchedulingQueue method found directly");
        // Try to find it in the prototype chain
        let found = false;
        let obj = this;
        while (obj && !found) {
          const methods = Object.getOwnPropertyNames(obj).filter(
            prop => typeof (obj as any)[prop] === 'function'
          );
          for (const method of methods) {
            if (method === 'addTestToSchedulingQueue') {
              console.log(`[WebSocketProcess] Found ${method} in prototype chain`);
              (this as any)[method](testId, testName, runtime, ws);
              found = true;
              break;
            }
          }
          obj = Object.getPrototypeOf(obj);
        }
        if (!found) {
          console.error("[WebSocketProcess] Could not find addTestToSchedulingQueue anywhere");
          // Send an immediate test resource to prevent hanging
          const immediateTestResource = {
            testId,
            testName,
            runtime,
            allocatedAt: new Date().toISOString(),
            ports: [3000],
          };
          const message = {
            type: "testResource",
            data: immediateTestResource,
            timestamp: new Date().toISOString(),
          };
          console.log(`[WebSocketProcess] Sending immediate test resource to prevent hanging:`, message);
          ws.send(JSON.stringify(message));
        }
      }
      
      // Acknowledge greeting
      const ackMessage = {
        type: "greetingAck",
        testId,
        timestamp: new Date().toISOString(),
      };
      console.log(`[WebSocketProcess] Sending greeting acknowledgment for test ${testId}:`, ackMessage);
      try {
        ws.send(JSON.stringify(ackMessage));
        console.log(`[WebSocketProcess] Greeting acknowledgment sent successfully for test ${testId}`);
      } catch (error) {
        console.error(`[WebSocketProcess] Failed to send greeting acknowledgment for test ${testId}:`, error);
      }
    } else {
      console.log(`[WebSocketProcess] Unhandled WebSocket message type: ${wsm.type}`);
    }
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
