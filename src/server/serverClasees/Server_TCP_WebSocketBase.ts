import { WebSocket } from "ws";
import { WebSocketMessage } from "../../clients/types";

import {
  WEBSOCKET_MESSAGE_TYPES,
  ERROR_MESSAGES,
  OTHER_CONSTANTS,
  SERVER_CONSTANTS,
} from "./Server_TCP_constants";
import {
  serializeProcessInfo,
  prepareCommandArgs,
  handlePromiseResult,
  sendErrorResponse,
} from "./utils/Server_TCP_utils";
import { Server_TCP_Http } from "./Server_TCP_Http";
import { IMode } from "../types";

export const FileService_methods = [
  "writeFile_send",
  "writeFile_receive",
  "readFile_receive",
  "readFile_send",
  "createDirectory_receive",
  "createDirectory_send",
  "deleteFile_receive",
  "deleteFile_send",
  "files_send",
  "files_receive",
  "projects_send",
  "projects_receive",
  "tests_send",
  "tests_receive",
  "report_send",
  "report_receive",
];

export abstract class FileService {
  abstract writeFile_send(...x);
  abstract writeFile_receive(...x);

  abstract readFile_receive(...x);
  abstract readFile_send(...x);

  abstract createDirectory_receive(...x);
  abstract createDirectory_send(...x);

  abstract deleteFile_receive(...x);
  abstract deleteFile_send(...x);

  // returns a tree of filenames from the root of the project, disregarding any that match the ignore patterns
  abstract files_send(...x);
  abstract files_receive(...x);

  // return the list of all projects via `testeranto/projects.json`
  abstract projects_send(...x);
  abstract projects_receive(...x);

  // returns a list of tests for a project
  abstract tests_send(...x);
  abstract tests_receive(...x);

  abstract report_send(...x);
  abstract report_receive(...x);
}

export interface FileEntry {
  name: string;
  path: string;
  type: "file" | "directory";
  size?: number;
  modified?: Date;
}

export interface FileStatus {
  status: "unchanged" | "modified" | "added" | "deleted" | "conflicted";
}

export interface FileChange extends FileStatus {
  path: string;
  diff?: string;
}

export interface RemoteStatus {
  ahead: number;
  behind: number;
}

export class Server_TCP_WebSocketBase extends Server_TCP_Http {
  processLogs: any;
  clients: any;
  allProcesses: any;
  runningProcesses: any;

  constructor(configs: any, name: string, mode: IMode) {
    console.log(`[WebSocket] Creating Server_TCP_WebSocketBase with configs:`, {
      httpPort: configs.httpPort,
      name,
      mode,
    });

    // Ensure configs has httpPort, using environment variable WS_PORT or HTTP_PORT as fallback
    const httpPort =
      configs.httpPort ||
      Number(process.env.WS_PORT) ||
      Number(process.env.HTTP_PORT) ||
      3000;
    const updatedConfigs = {
      ...configs,
      httpPort,
    };
    console.log(
      `[WebSocket] Server_TCP_WebSocketBase constructor: using httpPort=${httpPort}`
    );
    super(updatedConfigs, name, mode);

    console.log(`[WebSocket] After super() call`);
    console.log(`[WebSocket] wss exists: ${!!this.wss}`);
    console.log(`[WebSocket] httpServer exists: ${!!this.httpServer}`);

    // Log WebSocket server details
    if (this.wss) {
      console.log(`[WebSocket] WebSocket server address:`, this.wss.address());
      console.log(
        `[WebSocket] WebSocket server event names:`,
        this.wss.eventNames()
      );
    }

    // Log HTTP server details
    if (this.httpServer) {
      const address = this.httpServer.address();
      console.log(`[WebSocket] HTTP server address:`, address);
      if (address && typeof address === "object") {
        console.log(
          `[WebSocket] HTTP server listening on port ${address.port}`
        );
      }
    }

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

    console.log(`[WebSocket] Setting up WebSocket handlers`);
    this.setupWebSocketHandlers();
    console.log(`[WebSocket] Server_TCP_WebSocketBase constructor completed`);
  }

  protected setupWebSocketHandlers(): void {
    console.log(`[WebSocket] Setting up WebSocket handlers on server`);
    if (!this.wss) {
      console.error(
        `[WebSocket] ERROR: WebSocket server (wss) is not initialized!`
      );
      return;
    }
    const address = this.httpServer.address();
    const host = SERVER_CONSTANTS.HOST;
    let port = 3456;
    if (address && typeof address === "object") {
      port = address.port;
    }
    console.log(
      `[WebSocket] WebSocket server is available on ws://${host}:${port}/ws, attaching connection handler`
    );

    this.wss.on("connection", (ws, req) => {
      console.log(
        `[WebSocket] Client connected from: ${req.socket.remoteAddress}, URL: ${req.url}`
      );
      this.clients.add(ws);
      console.log(`[WebSocket] Total clients: ${this.clients.size}`);

      // For debugging: send a test greeting if no message is received within 2 seconds
      const timeoutId = setTimeout(() => {
        console.log(
          `[WebSocket] No greeting received after 2 seconds, sending test greeting`
        );
        const testGreeting = {
          type: "greeting",
          data: {
            testId: `test-${Date.now()}`,
            testName: "DebugTest",
            runtime: "node",
          },
        };
        console.log(`[WebSocket] Simulating greeting:`, testGreeting);
        // Simulate receiving the greeting message
        this.handleWebSocketMessage(JSON.stringify(testGreeting), ws);
      }, 2000);

      ws.on("message", (data) => {
        // Clear the timeout since we received a message
        clearTimeout(timeoutId);
        console.log(
          `[WebSocket] Received message from client: ${data
            .toString()
            .substring(0, 100)}...`
        );
        try {
          this.handleWebSocketMessage(data, ws);
        } catch (error) {
          console.error("[WebSocket] Error handling WebSocket message:", error);
        }
      });

      ws.on("close", () => {
        console.log(`[WebSocket] Client disconnected`);
        this.clients.delete(ws);
        clearTimeout(timeoutId);
        console.log(`[WebSocket] Total clients: ${this.clients.size}`);
      });

      ws.on("error", (error) => {
        console.error(`[WebSocket] WebSocket error:`, error);
        this.clients.delete(ws);
        clearTimeout(timeoutId);
        console.log(`[WebSocket] Total clients: ${this.clients.size}`);
      });
    });

    console.log(`[WebSocket] WebSocket handlers setup complete`);
  }

  protected handleWebSocketMessage(data: any, ws: WebSocket): void {
    try {
      const rawData = data.toString();
      console.log(
        `[WebSocket] Received raw message: ${rawData.substring(0, 200)}...`
      );
      let parsed;
      try {
        parsed = JSON.parse(rawData);
      } catch (parseError) {
        console.error(
          "[WebSocket] Failed to parse WebSocket message as JSON:",
          rawData.substring(0, 200),
          parseError
        );
        return;
      }

      if (Array.isArray(parsed)) {
        console.error(ERROR_MESSAGES.IPC_FORMAT_NO_LONGER_SUPPORTED);
        console.error("[WebSocket] Received array message:", parsed);
        ws.send(
          JSON.stringify({
            error: ERROR_MESSAGES.IPC_FORMAT_NO_LONGER_SUPPORTED,
            received: parsed,
          })
        );
        return;
      }

      const wsm: WebSocketMessage = parsed;
      console.log(`[WebSocket] Parsed message type: ${wsm.type}`);

      // Check if it's a FileService method
      let handled = false;
      FileService_methods.forEach((fsm) => {
        if (wsm.type === fsm) {
          console.log("[WebSocket] Handling as FileService method:", fsm);
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
          console.log(`[WebSocket] Command ${wsm.type} returned:`, result);
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
          console.error(
            `[WebSocket] Error executing command ${wsm.type}:`,
            error
          );
          sendErrorResponse(ws, key, error);
        }
        return;
      }

      // Handle other message types
      this.handleWebSocketMessageTypes(wsm, ws);
    } catch (error) {
      console.error("[WebSocket] Error handling WebSocket message:", error);
    }
  }

  protected handleWebSocketMessageTypes(
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
    } else {
      console.warn("Unhandled WebSocket message type:", wsm.type);
    }
  }
}
