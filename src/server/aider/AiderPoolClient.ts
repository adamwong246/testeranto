import WebSocket from "ws";
import net from "net";
import { EventEmitter } from "events";

export interface AiderInstanceInfo {
  instance_id: string;
  test_name: string;
  runtime: string;
  terminal_port: number;
  terminal_host: string;
  contextFiles?: Set<string>;
}

export class AiderPoolClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private connected = false;
  private instances: Map<string, AiderInstanceInfo> = new Map();

  constructor(private wsUrl: string = "ws://localhost:8765") {
    super();
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.on("open", () => {
        this.connected = true;
        console.log(`Connected to aider pool at ${this.wsUrl}`);
        resolve();
      });

      this.ws.on("message", (data) => {
        this.handleMessage(data.toString());
      });

      this.ws.on("error", (error) => {
        console.error("Aider pool connection error:", error);
        if (!this.connected) {
          reject(error);
        }
      });

      this.ws.on("close", () => {
        this.connected = false;
        console.log("Disconnected from aider pool");
        this.emit("disconnected");
      });
    });
  }

  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data);

      if (message.status === "created") {
        const instanceInfo: AiderInstanceInfo = {
          instance_id: message.instance_id,
          test_name: message.test_name || "unknown",
          runtime: message.runtime || "node",
          terminal_port: message.terminal_port,
          terminal_host: message.terminal_host || "localhost",
          contextFiles: new Set<string>(),
        };

        this.instances.set(message.instance_id, instanceInfo);
        this.emit("instance_created", instanceInfo);
      } else if (message.status === "output") {
        this.emit("output", {
          instance_id: message.instance_id,
          outputs: message.outputs || [],
        });
      } else if (message.status === "command_sent") {
        this.emit("command_sent", message.instance_id);
      }
    } catch (error) {
      console.error("Error handling aider pool message:", error);
    }
  }

  async createAiderInstance(
    testName: string,
    runtime: string,
    initialFiles: string[] = []
  ): Promise<AiderInstanceInfo> {
    if (!this.connected || !this.ws) {
      throw new Error("Not connected to aider pool");
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout creating aider instance"));
      }, 10000);

      const handler = (data: string) => {
        try {
          const message = JSON.parse(data);
          if (message.status === "created") {
            clearTimeout(timeout);
            this.ws!.off("message", handler);

            const instanceInfo: AiderInstanceInfo = {
              instance_id: message.instance_id,
              test_name: testName,
              runtime: runtime,
              terminal_port: message.terminal_port,
              terminal_host: message.terminal_host || "localhost",
              contextFiles: new Set<string>(initialFiles),
            };

            this.instances.set(message.instance_id, instanceInfo);
            resolve(instanceInfo);
          } else if (message.status === "error") {
            clearTimeout(timeout);
            this.ws!.off("message", handler);
            reject(new Error(message.error));
          }
        } catch (error) {
          // Ignore parse errors
        }
      };

      // this.ws.on("message", handler);

      // this.ws.send(
      //   JSON.stringify({
      //     action: "create",
      //     test_name: testName,
      //     runtime: runtime,
      //     workspace: process.cwd(),
      //     initial_files: initialFiles,
      //   })
      // );
    });
  }

  async sendCommand(instanceId: string, command: any): Promise<void> {
    if (!this.connected || !this.ws) {
      throw new Error("Not connected to aider pool");
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout sending command"));
      }, 5000);

      const handler = (data: string) => {
        try {
          const message = JSON.parse(data);
          if (
            message.status === "command_sent" &&
            message.instance_id === instanceId
          ) {
            clearTimeout(timeout);
            this.ws!.off("message", handler);
            resolve();
          }
        } catch (error) {
          // Ignore parse errors
        }
      };

      // this.ws.on("message", handler);

      // this.ws.send(
      //   JSON.stringify({
      //     action: "command",
      //     instance_id: instanceId,
      //     command: command,
      //   })
      // );
    });
  }

  async sendMessage(instanceId: string, message: string): Promise<void> {
    if (!this.connected || !this.ws) {
      throw new Error("Not connected to aider pool");
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout sending message"));
      }, 10000);

      const handler = (data: string) => {
        try {
          const response = JSON.parse(data);
          if (
            response.status === "message_sent" &&
            response.instance_id === instanceId
          ) {
            clearTimeout(timeout);
            this.ws!.off("message", handler);
            resolve();
          }
        } catch (error) {
          // Ignore parse errors
        }
      };

      // this.ws.on("message", handler);

      // this.ws.send(
      //   JSON.stringify({
      //     action: "message",
      //     instance_id: instanceId,
      //     message: message,
      //   })
      // );
    });
  }

  async updateFilesFromMetafile(
    instanceId: string,
    metafilePath: string
  ): Promise<void> {
    const fs = await import("fs");
    const path = await import("path");

    try {
      const metafileContent = fs.readFileSync(metafilePath, "utf-8");
      const metafile = JSON.parse(metafileContent);

      // Extract source files
      const files = Object.keys(metafile.inputs || {})
        .filter(
          (file) =>
            file.endsWith(".ts") ||
            file.endsWith(".js") ||
            file.endsWith(".py") ||
            file.endsWith(".go")
        )
        .map((file) =>
          path.relative(process.cwd(), path.join(process.cwd(), file))
        );

      // Get current instance
      const instance = this.instances.get(instanceId);
      if (!instance) {
        throw new Error(`Instance ${instanceId} not found`);
      }

      // Get current files from instance
      const currentFiles = instance.contextFiles || new Set<string>();

      // Calculate added/removed files
      const added = files.filter((f) => !currentFiles.has(f));
      const removed = Array.from(currentFiles).filter(
        (f) => !files.includes(f)
      );

      // Send commands to aider
      if (added.length > 0) {
        await this.sendCommand(instanceId, {
          type: "add_files",
          files: added,
        });
      }

      if (removed.length > 0) {
        await this.sendCommand(instanceId, {
          type: "drop_files",
          files: removed,
        });
      }

      // Update tracking
      instance.contextFiles = new Set(files);
    } catch (error) {
      console.error(`Error updating files from metafile:`, error);
    }
  }

  extractFilesFromMetafile(metafilePath: string): string[] {
    const fs = require("fs");
    const path = require("path");

    try {
      const metafileContent = fs.readFileSync(metafilePath, "utf-8");
      const metafile = JSON.parse(metafileContent);

      // Extract source files
      return Object.keys(metafile.inputs || {})
        .filter(
          (file) =>
            file.endsWith(".ts") ||
            file.endsWith(".js") ||
            file.endsWith(".py") ||
            file.endsWith(".go")
        )
        .map((file) =>
          path.relative(process.cwd(), path.join(process.cwd(), file))
        );
    } catch (error) {
      console.error(`Error extracting files from metafile:`, error);
      return [];
    }
  }

  async connectTerminal(instanceId: string): Promise<net.Socket> {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      throw new Error(`Instance ${instanceId} not found`);
    }

    return new Promise((resolve, reject) => {
      const socket = net.createConnection(
        {
          host: instance.terminal_host,
          port: instance.terminal_port,
        },
        () => {
          console.log(`Connected to terminal for aider instance ${instanceId}`);
          resolve(socket);
        }
      );

      socket.on("error", (error) => {
        reject(error);
      });
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connected = false;
  }
}
