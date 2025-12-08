/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebSocket } from "ws";
import { WebSocketMessage } from "../../clients/types";
import { FileService_methods } from "../../app/FileService";
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
import { IMode } from "../../app/types";

export class Server_TCP_WebSocket extends Server_TCP_Http {
  constructor(configs: any, name: string, mode: IMode) {
    super(configs, name, mode);
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
        console.error("Failed to parse WebSocket message as JSON:", rawData);
        return;
      }

      // IPC format is no longer supported
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
    } else {
      console.warn("Unhandled WebSocket message type:", wsm.type);
    }
  }
}
