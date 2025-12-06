/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { WebSocketMessage } from "../../PM/types.js";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import fs from "fs";
import { getAllFilesRecursively } from "./getAllFilesRecursively.js";
import { FileService_methods } from "../FileService.js";
import { ApiEndpoint, ApiFilename } from "../api.js";
import { PM_1_WithProcesses } from "./PM_1_WithProcesses.js";

export abstract class PM_2_WithTCP extends PM_1_WithProcesses {
  protected wss: WebSocketServer;
  protected httpServer: http.Server;

  constructor(configs: any, name: string, mode: string) {
    super(configs, name, mode);

    this.httpServer = http.createServer(this.handleHttpRequest.bind(this));
    this.wss = new WebSocketServer({ server: this.httpServer });

    this.wss.on("connection", (ws) => {
      this.clients.add(ws);
      console.log("Client connected");

      // Send welcome message
      ws.send(JSON.stringify({
        type: "system",
        message: "Connected to Testeranto WebSocket server",
        timestamp: new Date().toISOString(),
        serverInfo: {
          projectName: this.projectName,
          mode: this.mode
        }
      }));

      // Send all existing processes to the newly connected client
      this.sendAllProcessesToClient(ws);

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

    const httpPort = Number(process.env.HTTP_PORT) || 3000;
    this.httpServer.listen(httpPort, "0.0.0.0", () => {
      console.log(`HTTP server running on http://localhost:${httpPort}`);
    });
  }

  protected sendAllProcessesToClient(ws: WebSocket): void {
    // Send all existing processes to the client
    const allProcesses = Array.from(this.allProcesses.entries()).map(
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

    ws.send(JSON.stringify({
      type: "allProcesses",
      processes: allProcesses,
      timestamp: new Date().toISOString(),
      count: allProcesses.length
    }));

    // Also send a summary of the current state
    const runningCount = allProcesses.filter(p => p.status === "running").length;
    const completedCount = allProcesses.filter(p => p.status === "completed").length;
    const errorCount = allProcesses.filter(p => p.status === "error").length;
    
    ws.send(JSON.stringify({
      type: "processSummary",
      total: allProcesses.length,
      running: runningCount,
      completed: completedCount,
      error: errorCount,
      timestamp: new Date().toISOString()
    }));
  }

  protected websocket(data: any, ws: WebSocket) {
    try {
      const wsm: WebSocketMessage = JSON.parse(data.toString());

      FileService_methods.forEach((fsm) => {
        if (wsm.type === fsm) {
          this[fsm](wsm, ws);
        }
      });

      // Handle other message types
      if (wsm.type === "getRunningProcesses") {
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
      } else if (wsm.type === "getProcess") {
        const processId = wsm.data.processId;
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
      } else if (wsm.type === "stdin") {
        const processId = wsm.data.processId;
        const data = wsm.data.data;
        const childProcess = this.runningProcesses.get(processId) as any;

        if (childProcess && childProcess.stdin) {
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
      } else if (wsm.type === "killProcess") {
        const processId = wsm.processId;
        console.log("Received killProcess for process", processId);
        const childProcess = this.runningProcesses.get(processId) as any;

        if (childProcess) {
          console.log("Killing process");
          childProcess.kill("SIGTERM");
        } else {
          console.log("Cannot kill process - process not found:", {
            processExists: !!childProcess,
          });
        }
      } else if (wsm.type === "getChatHistory") {
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
      } else if (wsm.type === "test") {
        // Echo back test messages for verification
        ws.send(JSON.stringify({
          type: "testResponse",
          message: "Test received",
          original: wsm
        }));
      } else if (wsm.type === "triggerTest") {
        // Send back a confirmation and broadcast a test process
        ws.send(JSON.stringify({
          type: "triggerTestResponse",
          message: "Test trigger received",
          timestamp: new Date().toISOString()
        }));
        
        // Broadcast a test process event
        this.webSocketBroadcastMessage({
          type: "testProcessEvent",
          message: "Test process triggered from frontend",
          timestamp: new Date().toISOString(),
          data: {
            triggeredBy: "frontend",
            randomId: Math.random().toString(36).substring(2, 15)
          }
        });
      }
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
    }
  }

  handleHttpRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage> & {
      req: http.IncomingMessage;
    }
  ) {
    console.log(req.method, req.url);

    if (req.url === ApiEndpoint.root) {
      fs.readFile(ApiFilename.root, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end(`500 ${err.toString()}`);
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      });
      return;
    } else if (req.url === ApiEndpoint.style) {
      fs.readFile(ApiFilename.style, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end(`500 ${err.toString()}`);
          return;
        }
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(data);
      });
      return;
    } else if (req.url === ApiEndpoint.script) {
      fs.readFile(ApiFilename.script, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end(`500 ${err.toString()}`);
          return;
        }
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(data);
        return;
      });
      return;
    } else {
      res.writeHead(404);
      res.end(`404 Not Found. ${req.url}`);
      return;
    }
  }

  // FileService methods
  writeFile_send(wsm: WebSocketMessage, ws: WebSocket) {
    ws.send(JSON.stringify(["writeFile", wsm.data.path]));
  }

  writeFile_receive(wsm: WebSocketMessage, ws: WebSocket) {
    fs.writeFileSync(wsm.data.path, wsm.data.content);
  }

  readFile_receive(wsm: WebSocketMessage, ws: WebSocket) {
    this.readFile_send(wsm, ws, fs.readFileSync(wsm.data.path).toString());
  }

  readFile_send(wsm: WebSocketMessage, ws: WebSocket, content: string) {
    ws.send(JSON.stringify(["readFile", wsm.data.path, content]));
  }

  createDirectory_receive(wsm: WebSocketMessage, ws: WebSocket) {
    fs.mkdirSync(wsm.data.path);
    this.createDirectory_send(wsm, ws);
  }

  createDirectory_send(wsm: WebSocketMessage, ws: WebSocket) {
    ws.send(JSON.stringify(["createDirectory", wsm.data.path]));
  }

  deleteFile_receive(wsm: WebSocketMessage, ws: WebSocket) {
    fs.unlinkSync(wsm.data.path);
    this.deleteFile_send(wsm, ws);
  }

  deleteFile_send(wsm: WebSocketMessage, ws: WebSocket) {
    ws.send(JSON.stringify(["deleteFile", wsm.data.path]));
  }

  async files_receive(wsm: WebSocketMessage, ws: WebSocket) {
    this.files_send(wsm, ws, await getAllFilesRecursively("."));
  }

  files_send(wsm: WebSocketMessage, ws: WebSocket, files: string[]) {
    ws.send(JSON.stringify(["files", files]));
  }

  projects_receive(wsm: WebSocketMessage, ws: WebSocket) {
    this.projects_send(
      wsm,
      ws,
      JSON.parse(fs.readFileSync("./testeranto/projects.json", "utf-8"))
    );
  }

  projects_send(wsm: WebSocketMessage, ws: WebSocket, projects: object) {
    ws.send(JSON.stringify(["projects", projects]));
  }

  report_receive(wsm: WebSocketMessage, ws: WebSocket) {
    this.report_send(wsm, ws);
  }

  async report_send(wsm: WebSocketMessage, ws: WebSocket) {
    // Implementation remains the same
  }

  async test_receive(wsm: WebSocketMessage, ws: WebSocket) {
    // Implementation remains the same
  }

  test_send(wsm: WebSocketMessage, ws: WebSocket, project: string[]) {
    ws.send(JSON.stringify(["tests", project]));
  }
}
