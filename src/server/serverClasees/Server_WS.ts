import { WebSocket } from "ws";
import { IMode } from "../types";
import {
  ERROR_MESSAGES,
  SERVER_CONSTANTS,
  WEBSOCKET_MESSAGE_TYPES,
} from "./utils/Server_TCP_constants";
import { Server_HTTP } from "./Server_HTTP";
import {
  handlePromiseResult,
  prepareCommandArgs,
  sendErrorResponse,
} from "./utils/Server_TCP_utils";
import { WebSocketMessage } from "./utils/types";

export class Server_WS extends Server_HTTP {
  clients: Set<any> = new Set();

  constructor(configs: any, name: string, mode: IMode) {
    super(configs, name, mode);

    if (!this.clients) {
      this.clients = new Set();
    }

    this.setupWebSocketHandlers();
  }

  protected setupWebSocketHandlers(): void {
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
  }

  protected handleWebSocketMessage(data: any, ws: WebSocket): void {
    try {
      const rawData = data.toString();

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
      // console.log(`[WebSocket] Parsed message type: ${wsm.type}`);

      // // Check if it's a FileService method
      // let handled = false;
      // FileService_methods.forEach((fsm) => {
      //   if (wsm.type === fsm) {
      //     console.log("[WebSocket] Handling as FileService method:", fsm);
      //     (this as any)[fsm](wsm, ws);
      //     handled = true;
      //   }
      // });
      // if (handled) return;

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
    console.log(`[WebSocket] handling type: ${wsm.type}`);

    if (wsm.type === WEBSOCKET_MESSAGE_TYPES.GET_RUNNING_PROCESSES) {
      // Treat each WebSocket connection as a "test process"
      const tests = Array.from(this.clients).map((client, index) => {
        return {
          processId: `test-${index}`,
          command: "Test via WebSocket",
          status: "connected",
          timestamp: new Date().toISOString(),
        };
      });
      ws.send(
        JSON.stringify({
          type: WEBSOCKET_MESSAGE_TYPES.RUNNING_PROCESSES,
          processes: tests,
        })
      );
      console.log(`[WebSocket] -> RUNNING_PROCESSES (${tests.length} tests)`);
    } else if (wsm.type === WEBSOCKET_MESSAGE_TYPES.GET_PROCESS) {
      const processId = wsm.data.processId;
      // Since we don't have actual processes, return a simple response
      ws.send(
        JSON.stringify({
          type: WEBSOCKET_MESSAGE_TYPES.PROCESS_DATA,
          processId,
          command: "Test via WebSocket",
          status: "connected",
          timestamp: new Date().toISOString(),
        })
      );
      console.log(`[WebSocket] -> PROCESS_DATA for ${processId}`);
    } else if (wsm.type === WEBSOCKET_MESSAGE_TYPES.STDIN) {
      console.log("[WebSocket] STDIN not supported - no child processes");
    } else if (wsm.type === WEBSOCKET_MESSAGE_TYPES.KILL_PROCESS) {
      console.log(
        "[WebSocket] KILL_PROCESS not supported - no child processes"
      );
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
            console.log(`[WebSocket] -> CHAT_HISTORY`);
          })
          .catch((error: any) => {
            console.error("[WebSocket] error getting chat history:", error);
            ws.send(
              JSON.stringify({
                type: WEBSOCKET_MESSAGE_TYPES.ERROR,
                message: ERROR_MESSAGES.FAILED_TO_GET_CHAT_HISTORY,
              })
            );
          });
      }
    } else {
      console.warn("[WebSocket] unhandled message type:", wsm.type);
    }
  }

  async stop() {
    // Safely close WebSocket server if it exists
    if (this.wss) {
      this.wss.close(() => {
        console.log("WebSocket server closed");
      });
    }

    this.clients.forEach((client) => {
      // Check if client has a terminate method
      if (client.terminate) {
        client.terminate();
      }
    });
    this.clients.clear();
    await super.stop();
  }
}
