/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebSocket } from "ws";
import { WebSocketMessage } from "../../clients/types";
import { FileService_methods } from "../../app/frontend/FileService";
import {
  WEBSOCKET_MESSAGE_TYPES,
  ERROR_MESSAGES,
  OTHER_CONSTANTS,
} from "./Server_TCP_constants";
import {
  serializeProcessInfo,
  prepareCommandArgs,
  handlePromiseResult,
  sendErrorResponse,
} from "./Server_TCP_utils";
import { Server_TCP_Http } from "./Server_TCP_Http";
import { IMode } from "../../app/frontend/types";

export class Server_TCP_WebSocket extends Server_TCP_Http {
  processLogs: any;
  clients: any;
  allProcesses: any;
  runningProcesses: any;

  constructor(configs: any, name: string, mode: IMode) {
    super(configs, name, mode);
    
    // Ensure Maps exist (they may be initialized by parent)
    if (!this.processLogs) {
      this.processLogs = new Map();
    }
    if (!this.clients) {
      this.clients = new Set();
    }
    if (!this.allProcesses) {
      this.allProcesses = new Map();
    }
    if (!this.runningProcesses) {
      this.runningProcesses = new Map();
    } else {
      // Convert to Map if it's a plain object (from parent)
      if (!(this.runningProcesses instanceof Map)) {
        const entries = Object.entries(this.runningProcesses);
        this.runningProcesses = new Map(entries);
      }
    }
    
    // Ensure logSubscriptions exists
    (this as any).logSubscriptions = new Map();

    // Override runningProcesses.set to capture logs for new processes
    this.overrideRunningProcessesSet();

    // Attach log capture to existing processes (after parent may have added some)
    setTimeout(() => {
      this.attachLogCaptureToExistingProcesses();
    }, 100);

    this.setupWebSocketHandlers();
  }

  private setupWebSocketHandlers(): void {
    this.wss.on("connection", (ws, req) => {
      this.clients.add(ws);
      console.log("Client connected from:", req.socket.remoteAddress, req.url);

      ws.on("message", (data) => {
        try {
          this.handleWebSocketMessage(data, ws);
        } catch (error) {
          console.error("Error handling WebSocket message:", error);
        }
      });

      ws.on("close", () => {
        this.clients.delete(ws);
        console.log("Client disconnected");
      });

      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
        this.clients.delete(ws);
      });
    });
  }

  protected handleWebSocketMessage(data: any, ws: WebSocket): void {
    try {
      const rawData = data.toString();
      let parsed;
      try {
        parsed = JSON.parse(rawData);
      } catch (parseError) {
        console.error(
          "Failed to parse WebSocket message as JSON:",
          rawData,
          parseError
        );
        return;
      }

      if (Array.isArray(parsed)) {
        console.error(ERROR_MESSAGES.IPC_FORMAT_NO_LONGER_SUPPORTED);
        console.error("Received array message:", parsed);
        ws.send(
          JSON.stringify({
            error: ERROR_MESSAGES.IPC_FORMAT_NO_LONGER_SUPPORTED,
            received: parsed,
          })
        );
        return;
      }

      const wsm: WebSocketMessage = parsed;

      // Check if it's a FileService method
      let handled = false;
      FileService_methods.forEach((fsm) => {
        if (wsm.type === fsm) {
          console.log("Handling as FileService method:", fsm);
          (this as any)[fsm](wsm, ws);
          handled = true;
        }
      });
      if (handled) return;

      // Handle commands from PM_Node and PM_Web
      if (wsm.type && typeof (this as any)[wsm.type] === "function") {
        const { data: commandData, key } = wsm;
        const args = prepareCommandArgs(commandData);

        try {
          const result = (this as any)[wsm.type](...args);
          console.log(`Command ${wsm.type} returned:`, result);
          if (result instanceof Promise) {
            handlePromiseResult(result, wsm.type, key, ws);
          } else {
            ws.send(
              JSON.stringify({
                key: key,
                payload: result,
              })
            );
          }
        } catch (error) {
          console.error(`Error executing command ${wsm.type}:`, error);
          sendErrorResponse(ws, key, error);
        }
        return;
      }

      // Handle other message types
      this.handleWebSocketMessageTypes(wsm, ws);
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
    }
  }

  private handleWebSocketMessageTypes(
    wsm: WebSocketMessage,
    ws: WebSocket
  ): void {
    if (wsm.type === WEBSOCKET_MESSAGE_TYPES.GET_RUNNING_PROCESSES) {
      const processes = Array.from(this.allProcesses.entries()).map(
        ([id, procInfo]) =>
          serializeProcessInfo(id, procInfo, this.processLogs.get(id) || [])
      );
      ws.send(
        JSON.stringify({
          type: WEBSOCKET_MESSAGE_TYPES.RUNNING_PROCESSES,
          processes,
        })
      );
    } else if (wsm.type === WEBSOCKET_MESSAGE_TYPES.GET_PROCESS) {
      const processId = wsm.data.processId;
      const procInfo = this.allProcesses.get(processId);
      if (procInfo) {
        ws.send(
          JSON.stringify({
            type: WEBSOCKET_MESSAGE_TYPES.PROCESS_DATA,
            ...serializeProcessInfo(
              processId,
              procInfo,
              this.processLogs.get(processId) || []
            ),
          })
        );
      }
    } else if (wsm.type === WEBSOCKET_MESSAGE_TYPES.STDIN) {
      const processId = wsm.data.processId;
      const data = wsm.data.data;
      const childProcess = this.runningProcesses.get(processId) as any;

      if (childProcess && childProcess.stdin) {
        childProcess.stdin.write(data);
      } else {
        console.log("Cannot write to stdin - process not found or no stdin:", {
          processExists: !!childProcess,
          stdinExists: childProcess?.stdin ? true : false,
        });
      }
    } else if (wsm.type === WEBSOCKET_MESSAGE_TYPES.KILL_PROCESS) {
      const processId = wsm.processId;
      console.log("Received killProcess for process", processId);
      const childProcess = this.runningProcesses.get(processId) as any;

      if (childProcess) {
        console.log("Killing process");
        childProcess.kill(OTHER_CONSTANTS.SIGTERM);
      } else {
        console.log("Cannot kill process - process not found:", {
          processExists: !!childProcess,
        });
      }
    } else if (wsm.type === WEBSOCKET_MESSAGE_TYPES.GET_CHAT_HISTORY) {
      if ((this as any).getChatHistory) {
        (this as any)
          .getChatHistory()
          .then((history: any) => {
            ws.send(
              JSON.stringify({
                type: WEBSOCKET_MESSAGE_TYPES.CHAT_HISTORY,
                messages: history,
              })
            );
          })
          .catch((error: any) => {
            console.error("Error getting chat history:", error);
            ws.send(
              JSON.stringify({
                type: WEBSOCKET_MESSAGE_TYPES.ERROR,
                message: ERROR_MESSAGES.FAILED_TO_GET_CHAT_HISTORY,
              })
            );
          });
      }
    } else if (wsm.type === "getProcesses") {
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
    } else {
      console.warn("Unhandled WebSocket message type:", wsm.type);
    }
  }

  private getProcessSummary(): { processes: any[] } {
    const processes = Array.from(this.allProcesses.entries()).map(
      ([id, procInfo]) =>
        serializeProcessInfo(id, procInfo, this.processLogs.get(id) || [])
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
  }

  // Attach log capture to existing processes
  private attachLogCaptureToExistingProcesses(): void {
    if (!this.runningProcesses || !(this.runningProcesses instanceof Map)) {
      console.warn('runningProcesses is not available or not a Map');
      return;
    }
    for (const [processId, proc] of this.runningProcesses.entries()) {
      this.attachLogCapture(processId, proc);
    }
  }

  // Override runningProcesses.set to capture logs for new processes
  private overrideRunningProcessesSet(): void {
    console.log('Attempting to override runningProcesses.set', this.runningProcesses);
    if (!(this.runningProcesses instanceof Map)) {
      console.warn('runningProcesses is not a Map, cannot override set');
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
    console.log(`Attaching log capture to process ${processId}`, childProcess ? 'has childProcess' : 'no childProcess');
    if (!childProcess) {
      console.warn(`No childProcess for ${processId}`);
      return;
    }

    // Capture stdout
    if (childProcess.stdout && typeof childProcess.stdout.on === 'function') {
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
    if (childProcess.stderr && typeof childProcess.stderr.on === 'function') {
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
}
