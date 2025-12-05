import net from "net";
import { EventEmitter } from "events";
import { TcpConnection } from "./types";

export class TcpServer extends EventEmitter {
  private server: net.Server;
  private port: number = 0;
  private connections: Map<string, TcpConnection> = new Map();
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
    this.server = this.createServer();
  }

  private createServer(): net.Server {
    const server = net.createServer((socket) => {
      const clientId = `${socket.remoteAddress}:${socket.remotePort}`;
      this.logger.log(`🔌 TCP connection from ${clientId}`);

      this.connections.set(clientId, { socket, testInfo: {} });

      let buffer = "";
      socket.on("data", (data) => {
        buffer += data.toString();
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.trim()) {
            try {
              const message = JSON.parse(line);
              this.handleMessage(clientId, message, socket);
            } catch (e) {
              this.logger.error(`❌ Failed to parse message: ${line}`, e);
            }
          }
        }
      });

      socket.on("end", () => {
        this.logger.log(`🔌 TCP connection closed: ${clientId}`);
        this.connections.delete(clientId);
      });

      socket.on("error", (err) => {
        this.logger.error(`❌ TCP socket error for ${clientId}:`, err.message);
        this.connections.delete(clientId);
      });
    });

    return server;
  }

  public async start(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.server.listen(0, "0.0.0.0", () => {
        const address = this.server.address();
        if (address && typeof address === "object") {
          this.port = address.port;
          this.logger.log(`🔌 TCP server listening on port ${this.port}`);
          resolve(this.port);
        } else {
          this.logger.error(`❌ TCP server failed to get address`);
          reject(new Error("TCP server failed to get address"));
        }
      });
      
      this.server.on('error', (err) => {
        this.logger.error(`❌ TCP server error: ${err.message}`);
        reject(err);
      });
    });
  }

  public getPort(): number {
    return this.port;
  }

  public getConnections(): Map<string, TcpConnection> {
    return this.connections;
  }

  public sendToClient(clientId: string, data: any): void {
    const connection = this.connections.get(clientId);
    if (connection) {
      connection.socket.write(JSON.stringify(data) + "\n");
    }
  }

  public broadcast(data: any): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [clientId, connection] of this.connections) {
      this.sendToClient(clientId, data);
    }
  }

  public close(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [clientId, connection] of this.connections) {
      connection.socket.end();
    }
    this.connections.clear();
    this.server.close();
  }

  private handleMessage(
    clientId: string,
    message: string[],

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket: net.Socket
  ): void {
    if (!Array.isArray(message) || message.length < 1) {
      this.logger.error(`Invalid message format:`, message);
      return;
    }

    const command = message[0];

    if (command === "register" && message.length >= 2) {
      const serviceName = message[1];
      this.logger.log(
        `📝 Service ${serviceName} registered via TCP connection ${clientId}`
      );
      const connection = this.connections.get(clientId);
      if (connection) {
        connection.testInfo = { serviceName };
      }
      this.emit("serviceRegistered", { clientId, serviceName });
      return;
    }

    if (message.length < 2) {
      this.logger.error(`Invalid message format (missing callbackId):`, message);
      return;
    }

    const callbackId = message[message.length - 1];
    const args = message.slice(1, -1);

    let serviceName = "unknown";
    const connection = this.connections.get(clientId);
    if (connection?.testInfo?.serviceName) {
      serviceName = connection.testInfo.serviceName;
    }

    this.logger.log(`📤 [${serviceName}] ${command} ${JSON.stringify(args)}`);
    this.emit("commandReceived", {
      clientId,
      serviceName,
      command,
      args,
      callbackId,
    });
  }
}
