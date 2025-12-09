// DEPRECATED
//
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ChildProcess, spawn } from "child_process";
import http from "http";
import { RawData, WebSocketServer } from "ws";
import { WebSocketMessage } from "../clients/types.js";
import { IBuiltConfig } from "../Types.js";
import { FileService } from "../app/frontend/FileService.js";

export abstract class PM_WithTCP extends PM_Base implements FileService {
  wss: WebSocketServer;
  httpServer: http.Server;
  clients: Set<any> = new Set();

  runningProcesses: Map<string, ChildProcess | Promise<any>> = new Map();

  allProcesses: Map<
    string,
    {
      child?: ChildProcess;
      promise?: Promise<any>;
      status: "running" | "exited" | "error" | "completed";
      exitCode?: number;
      error?: string;
      command: string;
      pid?: number;
      timestamp: string;
      type: "process" | "promise";
      category: "aider" | "bdd-test" | "build-time" | "other";
      testName?: string;
      platform?: "node" | "web" | "pure" | "python" | "golang";
    }
  > = new Map();
  processLogs: Map<string, string[]> = new Map();

  constructor(configs: IBuiltConfig, name, mode) {
    super(configs, name, mode);

    this.httpServer = http.createServer(this.handleHttpRequest.bind(this));

    this.wss = new WebSocketServer({ server: this.httpServer });

    this.wss.on("connection", (ws) => {
      this.clients.add(ws);
      console.log("Client connected");

      ws.on("message", (data) => {
        try {
          this.websocket(data, ws);
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

    const httpPort = Number(process.env.HTTP_PORT);

    this.httpServer.on("error", (error) => {
      console.error("HTTP server error:", error);
      if ((error as any).code === "EADDRINUSE") {
        console.error(
          `Port ${httpPort} is already in use. Please use a different port.`
        );
      }
      process.exit(-1);
    });

    this.httpServer.listen(httpPort, "0.0.0.0", () => {
      console.log(`HTTP server running on http://localhost:${httpPort}`);
    });
  }

  websocket(data: RawData, ws: any) {
    try {
      const message: WebSocketMessage = JSON.parse(data.toString());

      if (message.type === "chatMessage") {
        // Always record the message, even if aider is not available
        console.log(`Received chat message: ${message.content}`);

        // Pass to PM_WithHelpo if available
        if ((this as any).handleChatMessage) {
          (this as any).handleChatMessage(message.content);
        } else {
          console.log("PM_WithHelpo not available - message not processed");
        }
        return;
      }

      // Handle file operations via WebSocket
      if (message.type === "listDirectory") {
        // this.handleListDirectory(ws, message);
      } else if (message.type === "readFile") {
        // this.handleReadFile(ws, message);
      } else if (message.type === "writeFile") {
        // this.handleWriteFile(ws, message);
      } else if (message.type === "createDirectory") {
        // this.handleCreateDirectory(ws, message);
      } else if (message.type === "deleteFile") {
        // this.handleDeleteFile(ws, message);
      } else if (message.type === "executeCommand") {
        // const executeMessage = message as ExecuteCommandMessage;

        if (message.command && message.command.trim().startsWith("aider")) {
          console.log(`Executing command: ${message.command}`);

          const processId = Date.now().toString();
          const child = spawn(message.command, {
            shell: true,
            cwd: process.cwd(),
          });

          this.runningProcesses.set(processId, child);
          this.allProcesses.set(processId, {
            child,
            status: "running",
            command: message.command,
            pid: child.pid,
            timestamp: new Date().toISOString(),
            type: "process",
            category: "aider",
          });

          this.processLogs.set(processId, []);

          this.webSocketBroadcastMessage({
            type: "processStarted",
            processId,
            command: message.command,
            timestamp: new Date().toISOString(),
            logs: [],
          });

          // Capture stdout and stderr
          child.stdout?.on("data", (data) => {
            const logData = data.toString();
            const logs = this.processLogs.get(processId) || [];
            logs.push(logData);
            this.processLogs.set(processId, logs);

            this.webSocketBroadcastMessage({
              type: "processStdout",
              processId,
              data: logData,
              timestamp: new Date().toISOString(),
            });
          });

          child.stderr?.on("data", (data) => {
            const logData = data.toString();
            const logs = this.processLogs.get(processId) || [];
            logs.push(logData);
            this.processLogs.set(processId, logs);

            this.webSocketBroadcastMessage({
              type: "processStderr",
              processId,
              data: logData,
              timestamp: new Date().toISOString(),
            });
          });

          child.on("error", (error) => {
            console.error(`Failed to execute command: ${error}`);
            this.runningProcesses.delete(processId);
            const processInfo = this.allProcesses.get(processId);
            if (processInfo) {
              this.allProcesses.set(processId, {
                ...processInfo,
                status: "error",
                error: error.message,
              });
            }
            this.webSocketBroadcastMessage({
              type: "processError",
              processId,
              error: error.message,
              timestamp: new Date().toISOString(),
            });
          });

          child.on("exit", (code) => {
            console.log(`Command exited with code ${code}`);
            this.runningProcesses.delete(processId);
            const processInfo = this.allProcesses.get(processId);
            if (processInfo) {
              this.allProcesses.set(processId, {
                ...processInfo,
                status: "exited",
                // @ts-ignore
                exitCode: code,
              });
            }
            this.webSocketBroadcastMessage({
              type: "processExited",
              processId,
              exitCode: code,
              timestamp: new Date().toISOString(),
            });
          });
        } else {
          console.error('Invalid command: must start with "aider"');
        }
      } else if (message.type === "getRunningProcesses") {
        const processes = Array.from(this.allProcesses.entries()).map(
          ([id, procInfo]) => ({
            processId: id,
            command: procInfo.command,
            pid: procInfo.pid,
            status: procInfo.status,
            exitCode: procInfo.exitCode,
            error: procInfo.error,
            timestamp: procInfo.timestamp,
            category: procInfo.category,
            testName: procInfo.testName,
            platform: procInfo.platform,
            logs: this.processLogs.get(id) || [],
          })
        );
        ws.send(
          JSON.stringify({
            type: "runningProcesses",
            processes,
          })
        );
      } else if (message.type === "getProcess") {
        const processId = message.processId;
        const procInfo = this.allProcesses.get(processId);
        if (procInfo) {
          ws.send(
            JSON.stringify({
              type: "processData",
              processId,
              command: procInfo.command,
              pid: procInfo.pid,
              status: procInfo.status,
              exitCode: procInfo.exitCode,
              error: procInfo.error,
              timestamp: procInfo.timestamp,
              category: procInfo.category,
              testName: procInfo.testName,
              platform: procInfo.platform,
              logs: this.processLogs.get(processId) || [],
            })
          );
        }
      } else if (message.type === "stdin") {
        const processId = message.processId;
        const data = message.data;
        console.log("Received stdin for process", processId, ":", data);
        const childProcess = this.runningProcesses.get(
          processId
        ) as ChildProcess;

        if (childProcess && childProcess.stdin) {
          console.log("Writing to process stdin");
          childProcess.stdin.write(data);
        } else {
          console.log(
            "Cannot write to stdin - process not found or no stdin:",
            {
              processExists: !!childProcess,
              stdinExists: childProcess?.stdin ? true : false,
            }
          );
        }
      } else if (message.type === "killProcess") {
        const processId = message.processId;
        console.log("Received killProcess for process", processId);
        const childProcess = this.runningProcesses.get(
          processId
        ) as ChildProcess;

        if (childProcess) {
          console.log("Killing process");
          childProcess.kill("SIGTERM");
          // The process exit handler will update the status and broadcast the change
        } else {
          console.log("Cannot kill process - process not found:", {
            processExists: !!childProcess,
          });
        }
      } else if (message.type === "getChatHistory") {
        if ((this as any).getChatHistory) {
          (this as any)
            .getChatHistory()
            .then((history: any) => {
              ws.send(
                JSON.stringify({
                  type: "chatHistory",
                  messages: history,
                })
              );
            })
            .catch((error: any) => {
              console.error("Error getting chat history:", error);
              ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Failed to get chat history",
                })
              );
            });
        }
      }
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
    }
  }

  webSocketBroadcastMessage(message: any) {
    const data =
      typeof message === "string" ? message : JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(data);
      }
    });
  }

  handleHttpRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage> & {
      req: http.IncomingMessage;
    }
  ) {
    console.log(req, res);

    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify({ wtf: "idk" }));
  }

  writeFile(path: string, content: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  readFile(path: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  createDirectory(path: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteFile(path: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  files(path: string): Promise<object> {
    throw new Error("Method not implemented.");
  }
  projects(project: string): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
  tests(project: string): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
  report(project: string, test: string): Promise<object> {
    throw new Error("Method not implemented.");
  }
}
