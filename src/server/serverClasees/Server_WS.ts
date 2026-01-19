// Gives the server websocket capabilities

import { WebSocket, WebSocketServer } from "ws";
import { WsManager } from "../serverManagers/WsManager";
import { IMode } from "../types";
import { Server_HTTP } from "./Server_HTTP";

export class Server_WS extends Server_HTTP {
  protected ws: WebSocketServer;
  protected wsClients: Set<WebSocket> = new Set();
  wsManager: WsManager

  constructor(configs: any, name: string, mode: IMode) {
    super(configs, name, mode);

    this.ws = new WebSocketServer({
      noServer: true,
    });

    this.wsManager = new WsManager()

    this.setupWebSocketHandlers();
  }

  async start(): Promise<void> {
    console.log(`[Server_WS] start()`)
    await super.start();
    this.attachWebSocketToHttpServer(this.httpServer);
  }

  async stop() {
    console.log(`[Server_WS] stop()`)

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


  escapeXml(unsafe: string): string {
    return this.wsManager.escapeXml(unsafe)
  }

  public attachWebSocketToHttpServer(httpServer: any): void {

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

  }

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

      // Immediately send current processes
      // Note: handleGetProcesses needs to be implemented or handled differently
      // For now, we'll send a placeholder
      ws.send(JSON.stringify({
        type: "processes",
        data: this.getProcessSummary ? this.getProcessSummary() : { processes: [] },
        timestamp: new Date().toISOString()
      }));

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
      console.log("[WebSocket] Server closing...");
      this.wsClients.clear();
    });
  }



  private handleWebSocketMessage(ws: WebSocket, message: any): void {
    console.log("[WebSocket] Received message:", message.type);

    // Use WsManager to process the message
    const response = this.wsManager.processMessage(
      message.type,
      message.data,
      () => this.getProcessSummary(),
      (processId: string) => {
        const processManager = this as any;
        if (typeof processManager.getProcessLogs === "function") {
          return processManager.getProcessLogs(processId);
        }
        return [];
      }
    );

    // Send the response
    ws.send(JSON.stringify(response));

    // For certain message types, we need to perform additional server-side actions
    // These are side effects that can't be handled by WsManager alone
    switch (message.type) {
      case "sourceFilesUpdated":
        this.handleSourceFilesUpdatedSideEffects(ws, message.data, response);
        break;
      case "getBuildListenerState":
        this.handleGetBuildListenerStateSideEffects(ws);
        break;
      case "getBuildEvents":
        this.handleGetBuildEventsSideEffects(ws);
        break;
    }
  }

  private handleSourceFilesUpdatedSideEffects(ws: WebSocket, data: any, response: any): void {
    const { testName, hash, files, runtime } = data || {};

    if (!testName || !hash || !files || !runtime) {
      return;
    }

    console.log(`[WebSocket] Forwarding source files update to build listener for test: ${testName} (runtime: ${runtime})`);

    // Check if this instance has sourceFilesUpdated method (inherited from Server_BuildListener)
    if (typeof (this as any).sourceFilesUpdated === 'function') {
      console.log(`[WebSocket] sourceFilesUpdated method found, calling it`);
      try {
        (this as any).sourceFilesUpdated(testName, hash, files, runtime);
        console.log(`[WebSocket] sourceFilesUpdated called successfully`);

        // Broadcast to all clients
        this.broadcast({
          type: "sourceFilesUpdated",
          testName,
          hash,
          files,
          runtime,
          status: "processed",
          timestamp: new Date().toISOString(),
          message: "Source files update processed successfully"
        });

        // Update the response if successful
        if (response.status === "success") {
          // Response is already sent, but we can send an additional update
          ws.send(JSON.stringify({
            type: "sourceFilesUpdated",
            status: "processed",
            testName,
            runtime,
            message: "Build update processed and broadcasted successfully",
            timestamp: new Date().toISOString()
          }));
        }
      } catch (error) {
        console.error("[WebSocket] Error processing source files update:", error);
        // Send error update
        ws.send(JSON.stringify({
          type: "sourceFilesUpdated",
          status: "error",
          testName,
          runtime,
          message: `Error processing build update: ${error}`,
          timestamp: new Date().toISOString()
        }));
      }
    } else {
      console.warn("[WebSocket] sourceFilesUpdated method not available on this instance");
    }
  }

  private handleGetBuildListenerStateSideEffects(ws: WebSocket): void {
    console.log("[WebSocket] Handling getBuildListenerState request");

    if (typeof (this as any).getBuildListenerState === 'function') {
      try {
        const state = (this as any).getBuildListenerState();
        ws.send(JSON.stringify({
          type: "buildListenerState",
          data: state,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        console.error("[WebSocket] Error getting build listener state:", error);
        ws.send(JSON.stringify({
          type: "buildListenerState",
          status: "error",
          message: `Error getting build listener state: ${error}`,
          timestamp: new Date().toISOString()
        }));
      }
    }
  }

  private handleGetBuildEventsSideEffects(ws: WebSocket): void {
    console.log("[WebSocket] Handling getBuildEvents request");

    if (typeof (this as any).getBuildEvents === 'function') {
      try {
        const events = (this as any).getBuildEvents();
        ws.send(JSON.stringify({
          type: "buildEvents",
          events: events,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        console.error("[WebSocket] Error getting build events:", error);
        ws.send(JSON.stringify({
          type: "buildEvents",
          status: "error",
          message: `Error getting build events: ${error}`,
          timestamp: new Date().toISOString()
        }));
      }
    }
  }

  private handleGetProcesses(ws: WebSocket): void {
    if (typeof (this as any).getProcessSummary === 'function') {
      const summary = (this as any).getProcessSummary();
      ws.send(JSON.stringify({
        type: "processes",
        data: summary,
        timestamp: new Date().toISOString()
      }));
    } else {
      ws.send(JSON.stringify({
        type: "processes",
        data: { processes: [], message: "getProcessSummary not available" },
        timestamp: new Date().toISOString()
      }));
    }
  }

  // Broadcast a message to all connected WebSocket clients

  protected getProcessSummary?(): any;
}
