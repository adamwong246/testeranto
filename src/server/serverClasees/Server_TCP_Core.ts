/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import { Server_Base } from "./Server_Base";
import { IMode } from "../../app/types";
import {
  DEFAULT_HTTP_PORT,
  SERVER_CONSTANTS,
} from "./Server_TCP_constants";

export class Server_TCP_Core extends Server_Base {
  protected wss: WebSocketServer;
  protected httpServer: http.Server;

  constructor(configs: any, name: string, mode: IMode) {
    super(configs, name, mode);

    this.httpServer = http.createServer();
    this.wss = new WebSocketServer({ server: this.httpServer });

    const httpPort = Number(process.env.HTTP_PORT) || DEFAULT_HTTP_PORT;
    this.httpServer.listen(httpPort, SERVER_CONSTANTS.HOST, () => {
      console.log(`HTTP server running on http://localhost:${httpPort}`);
    });
  }

  // Basic getters
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
