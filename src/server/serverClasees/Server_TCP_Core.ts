import http from "http";
import { WebSocket, WebSocketServer } from "ws";
import { IMode } from "../types";
import { Server_Base } from "./Server_Base";
import { SERVER_CONSTANTS } from "./Server_TCP_constants";

export class Server_TCP_Core extends Server_Base {
  protected wss: WebSocketServer;
  protected httpServer: http.Server;

  constructor(configs: any, name: string, mode: IMode) {
    super(configs, name, mode);

    this.httpServer = http.createServer();
    this.wss = new WebSocketServer({ server: this.httpServer });

    // Use the configured httpPort from configs, fallback to environment variables or default
    const httpPort =
      configs.httpPort ||
      Number(process.env.HTTP_PORT) ||
      Number(process.env.WS_PORT) ||
      3456;
    console.log(
      `[Server_TCP_Core] Starting HTTP server on port ${httpPort}, host ${SERVER_CONSTANTS.HOST}`
    );
    this.httpServer.listen(httpPort, SERVER_CONSTANTS.HOST, () => {
      const addr = this.httpServer.address();
      console.log(
        `[Server_TCP_Core] HTTP server running on http://localhost:${httpPort}`
      );
    });
  }

  getWebSocketServer(): WebSocketServer {
    return this.wss;
  }

  getHttpServer(): http.Server {
    return this.httpServer;
  }

  getClients(): Set<WebSocket> {
    return this.clients;
  }
}
