/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from "events";
import { WebSocketServer, WebSocket } from "ws";
// import net from 'net';

export class WebSocketServerManager extends EventEmitter {
  private wss: WebSocketServer | null = null;
  private port: number = 0;
  private connections: Map<string, { ws: WebSocket; serviceName?: string }> =
    new Map();
  private logger: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn?: (...args: any[]) => void;
    info?: (...args: any[]) => void;
  };

  constructor(logger?: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn?: (...args: any[]) => void;
    info?: (...args: any[]) => void;
  }) {
    super();
    this.logger = {
      log: logger?.log || console.log,
      error: logger?.error || console.error,
      warn: logger?.warn || console.warn,
      info: logger?.info || console.info,
    };
  }

  public async start(port: number = 0): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        this.wss = new WebSocketServer({ port });

        this.wss.on("listening", () => {
          const address = this.wss?.address();
          if (address && typeof address === "object") {
            this.port = address.port;
          } else if (typeof address === "number") {
            this.port = address;
          }
          this.logger.log(`🔌 WebSocket server started on port ${this.port}`);
          resolve(this.port);
        });

        this.wss.on("connection", (ws: WebSocket, request: any) => {
          const connectionId = `${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;
          this.connections.set(connectionId, { ws });

          this.logger.log(`🔗 WebSocket client connected: ${connectionId}`);
          this.emit("clientConnected", { connectionId, request });

          ws.on("message", (data: Buffer) => {
            try {
              const message = JSON.parse(data.toString());
              this.logger.log(
                `📨 WebSocket message from ${connectionId}:`,
                message
              );

              // Handle registration messages to track service name
              if (
                Array.isArray(message) &&
                message[0] === "register" &&
                message.length >= 2
              ) {
                const serviceName = message[1];
                const conn = this.connections.get(connectionId);
                if (conn) {
                  conn.serviceName = serviceName;
                  this.connections.set(connectionId, conn);
                  this.logger.log(
                    `📝 WebSocket client ${connectionId} registered as ${serviceName}`
                  );
                }
              }

              this.emit("message", { connectionId, message });
            } catch (error) {
              this.logger.error(`❌ Failed to parse WebSocket message:`, error);
            }
          });

          ws.on("close", () => {
            this.logger.log(
              `🔌 WebSocket client disconnected: ${connectionId}`
            );
            this.connections.delete(connectionId);
            this.emit("clientDisconnected", { connectionId });
          });

          ws.on("error", (error) => {
            this.logger.error(`❌ WebSocket error for ${connectionId}:`, error);
            this.emit("clientError", { connectionId, error });
          });
        });

        this.wss.on("error", (error) => {
          this.logger.error(`❌ WebSocket server error:`, error);
          reject(error);
        });
      } catch (error) {
        this.logger.error(`❌ Failed to start WebSocket server:`, error);
        reject(error);
      }
    });
  }

  public getPort(): number {
    return this.port;
  }

  public send(connectionId: string, message: any): boolean {
    const conn = this.connections.get(connectionId);
    if (conn && conn.ws.readyState === WebSocket.OPEN) {
      try {
        conn.ws.send(JSON.stringify(message));
        return true;
      } catch (error) {
        this.logger.error(
          `❌ Failed to send WebSocket message to ${connectionId}:`,
          error
        );
        return false;
      }
    }
    return false;
  }

  public broadcast(message: any): number {
    let count = 0;
    for (const [connectionId, conn] of this.connections) {
      if (conn.ws.readyState === WebSocket.OPEN) {
        if (this.send(connectionId, message)) {
          count++;
        }
      }
    }
    return count;
  }

  public close(): void {
    if (this.wss) {
      // Close all connections
      for (const [connectionId, conn] of this.connections) {
        conn.ws.close();
      }
      this.connections.clear();

      // Close the server
      this.wss.close();
      this.wss = null;
      this.port = 0;
      this.logger.log(`🔌 WebSocket server closed`);
    }
  }

  public getConnectionCount(): number {
    return this.connections.size;
  }

  public getServiceName(connectionId: string): string | undefined {
    const conn = this.connections.get(connectionId);
    return conn?.serviceName;
  }

  public setServiceName(connectionId: string, serviceName: string): void {
    const conn = this.connections.get(connectionId);
    if (conn) {
      conn.serviceName = serviceName;
      this.connections.set(connectionId, conn);
    }
  }
}
