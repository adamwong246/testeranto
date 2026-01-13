// Gives the server websocket capabilities

import { WebSocketServer, WebSocket } from "ws";
import { IMode } from "../types";
import { Server_DockerCompose } from "./Server_DockerCompose";


export class Server_WS extends Server_DockerCompose {
  protected ws: WebSocketServer;
  protected wsClients: Set<WebSocket> = new Set();

  constructor(configs: any, name: string, mode: IMode) {
    super(configs, name, mode);

    // Create WebSocket server
    this.ws = new WebSocketServer({
      noServer: true,
    });

    // Set up WebSocket event handlers
    this.setupWebSocketHandlers();

    // Note: The upgrade handler will be attached by Server_HTTP
    // to avoid duplicate attachment
  }

  private setupWebSocketHandlers(): void {
    this.ws.on("connection", (ws: WebSocket, request: any) => {
      console.log(`[WebSocket] New connection from ${request.socket.remoteAddress}`);
      this.wsClients.add(ws);

      // Send initial connection message
      ws.send(JSON.stringify({
        type: "connected",
        message: "Connected to Process Manager WebSocket",
        timestamp: new Date().toISOString()
      }));

      // Send a test enqueue event to verify the connection
      setTimeout(() => {
        const testEvent = {
          type: 'enqueue',
          processId: 'test-process-123',
          runtime: 'node',
          command: 'yarn test example/Calculator.test.ts',
          testName: 'Calculator.test',
          testPath: 'Calculator.test',
          timestamp: new Date().toISOString(),
          details: 'Test event to verify WebSocket connection'
        };
        ws.send(JSON.stringify(testEvent));
        console.log('[WebSocket] Sent test enqueue event to new client');
      }, 1000);

      // Handle messages from clients
      ws.on("message", (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleWebSocketMessage(ws, message);
        } catch (error) {
          console.error("[WebSocket] Error parsing message:", error);
          ws.send(JSON.stringify({
            type: "error",
            message: "Invalid JSON message",
            timestamp: new Date().toISOString()
          }));
        }
      });

      // Handle client disconnection
      ws.on("close", () => {
        console.log("[WebSocket] Client disconnected");
        this.wsClients.delete(ws);
      });

      // Handle errors
      ws.on("error", (error) => {
        console.error("[WebSocket] Error:", error);
        this.wsClients.delete(ws);
      });
    });

    this.ws.on("error", (error) => {
      console.error("[WebSocket] Server error:", error);
    });

    this.ws.on("close", () => {
      console.log("[WebSocket] Server closed");
      this.wsClients.clear();
    });
  }

  // This method is called by Server_HTTP to attach the WebSocket upgrade handler
  public attachWebSocketToHttpServer(httpServer: any): void {
    if (!httpServer) {
      console.error("[WebSocket] HTTP server not available for WebSocket attachment");
      return;
    }

    httpServer.on("upgrade", (request: any, socket: any, head: any) => {
      const pathname = new URL(request.url || "", `http://${request.headers.host}`).pathname;

      // Handle WebSocket connections at /ws
      if (pathname === "/ws") {
        console.log("[WebSocket] Upgrade request for /ws");
        this.ws.handleUpgrade(request, socket, head, (ws) => {
          this.ws.emit("connection", ws, request);
        });
      } else {
        // Close connection for non-WebSocket paths
        socket.destroy();
      }
    });
    console.log("[HTTP] WebSocket upgrade handler attached");
  }

  private handleWebSocketMessage(ws: WebSocket, message: any): void {
    console.log("[WebSocket] Received message:", message.type);

    switch (message.type) {
      case "getProcesses":
        this.handleGetProcesses(ws);
        break;
      case "subscribeToLogs":
        this.handleSubscribeToLogs(ws, message.data);
        break;
      case "getLogs":
        this.handleGetLogs(ws, message.data);
        break;
      case "ping":
        ws.send(JSON.stringify({
          type: "pong",
          timestamp: new Date().toISOString()
        }));
        break;
      default:
        console.log("[WebSocket] Unknown message type:", message.type);
        ws.send(JSON.stringify({
          type: "error",
          message: `Unknown message type: ${message.type}`,
          timestamp: new Date().toISOString()
        }));
    }
  }

  private handleGetProcesses(ws: WebSocket): void {
    // Get process summary from ProcessManager
    const processManager = this as any;
    if (typeof processManager.getProcessSummary === "function") {
      const summary = processManager.getProcessSummary();
      ws.send(JSON.stringify({
        type: "processes",
        data: summary,
        timestamp: new Date().toISOString()
      }));
    } else {
      ws.send(JSON.stringify({
        type: "processes",
        data: { processes: [], totalProcesses: 0, running: 0 },
        timestamp: new Date().toISOString()
      }));
    }
  }

  private handleSubscribeToLogs(ws: WebSocket, data: any): void {
    const { processId } = data || {};
    if (!processId) {
      ws.send(JSON.stringify({
        type: "logSubscription",
        status: "error",
        message: "Missing processId",
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // In a real implementation, we would set up log streaming for this process
    // For now, just acknowledge the subscription
    ws.send(JSON.stringify({
      type: "logSubscription",
      status: "subscribed",
      processId,
      timestamp: new Date().toISOString()
    }));
  }

  private handleGetLogs(ws: WebSocket, data: any): void {
    const { processId } = data || {};
    if (!processId) {
      ws.send(JSON.stringify({
        type: "logs",
        status: "error",
        message: "Missing processId",
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // Get logs from ProcessManager
    const processManager = this as any;
    if (typeof processManager.getProcessLogs === "function") {
      const logs = processManager.getProcessLogs(processId);
      ws.send(JSON.stringify({
        type: "logs",
        processId,
        logs: logs.map((log: string) => {
          // Parse the log entry to extract level
          // Log format is: [timestamp] [source] message
          // We need to extract level from source or message
          let level = "info";
          let source = "process";
          let message = log;

          // Try to parse the log format
          const match = log.match(/\[(.*?)\] \[(.*?)\] (.*)/);
          if (match) {
            const timestamp = match[1];
            source = match[2];
            message = match[3];

            // Map source to level
            if (source === "stderr" || source === "error") {
              level = "error";
            } else if (source === "warn") {
              level = "warn";
            } else if (source === "debug") {
              level = "debug";
            } else {
              level = "info";
            }
          }

          return {
            timestamp: new Date().toISOString(),
            level: level,
            message: message,
            source: source
          };
        }),
        timestamp: new Date().toISOString()
      }));
    } else {
      ws.send(JSON.stringify({
        type: "logs",
        processId,
        logs: [],
        timestamp: new Date().toISOString()
      }));
    }
  }

  // Broadcast a message to all connected WebSocket clients
  public broadcast(message: any): void {
    const data = typeof message === "string" ? message : JSON.stringify(message);
    console.log(`[WebSocket] Broadcasting to ${this.wsClients.size} clients:`, message.type || message);

    let sentCount = 0;
    this.wsClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
        sentCount++;
      } else {
        console.log(`[WebSocket] Client not open, state: ${client.readyState}`);
      }
    });
    console.log(`[WebSocket] Sent to ${sentCount} clients`);
  }

  async stop() {
    // Close all client connections
    this.wsClients.forEach((client) => {
      client.close();
    });
    this.wsClients.clear();

    // Close the WebSocket server
    this.ws.close(() => {
      console.log("[WebSocket] Server closed");
    });

    await super.stop();
  }
}
