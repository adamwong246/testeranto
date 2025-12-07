/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { WebSocketMessage } from "../clients/types.js";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import fs from "fs";
import path from "path";
import { getAllFilesRecursively } from "./getAllFilesRecursively.js";

import { PM_1_WithProcesses } from "./PM_1_WithProcesses.js";
import { ApiEndpoint, ApiFilename } from "../app/api.js";
import { FileService_methods } from "../app/FileService.js";

export class PM_2_WithTCP extends PM_1_WithProcesses {
  protected wss: WebSocketServer;
  protected httpServer: http.Server;

  constructor(configs: any, name: string, mode: string) {
    super(configs, name, mode);

    this.httpServer = http.createServer(this.handleHttpRequest.bind(this));
    this.wss = new WebSocketServer({ server: this.httpServer });

    this.wss.on("connection", (ws, req) => {
      this.clients.add(ws);
      console.log("Client connected from:", req.socket.remoteAddress, req.url);

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

  protected websocket(data: any, ws: WebSocket) {
    try {
      const rawData = data.toString();
      console.log("WebSocket received raw data:", rawData);
      const parsed = JSON.parse(rawData);

      // Check if it's an array (old IPC format)
      if (Array.isArray(parsed)) {
        const [command, ...args] = parsed;
        const key = args.pop(); // Last element is the key
        console.log("Old IPC format - command:", command, "key:", key);

        // Handle the command
        // For now, just echo back with the key for testing
        // In a real implementation, we would process the command
        ws.send(
          JSON.stringify({
            key: key,
            payload: `Processed command: ${command}`,
          })
        );
        return;
      }

      // Otherwise, treat as WebSocketMessage with type field
      const wsm: WebSocketMessage = parsed;
      console.log("WebSocket message type:", wsm.type, "key:", wsm.key);

      // Check if it's a FileService method
      let handled = false;
      FileService_methods.forEach((fsm) => {
        if (wsm.type === fsm) {
          console.log("Handling as FileService method:", fsm);
          this[fsm](wsm, ws);
          handled = true;
        }
      });
      if (handled) return;

      // Handle commands from PM_Node
      // These have a type field that matches method names
      // They also have a key field for responses
      if (wsm.type && typeof this[wsm.type] === "function") {
        console.log(`Executing command ${wsm.type} with data:`, wsm.data);
        // Extract data and key
        const { data: commandData, key } = wsm;
        const args = Array.isArray(commandData) ? commandData : [commandData];
        console.log(`Command ${wsm.type} args:`, args);

        try {
          // Call the method
          const result = this[wsm.type](...args);
          console.log(`Command ${wsm.type} returned:`, result);
          // Handle promise if needed
          if (result instanceof Promise) {
            result
              .then((resolvedResult) => {
                console.log(`Command ${wsm.type} resolved:`, resolvedResult);
                ws.send(
                  JSON.stringify({
                    key: key,
                    payload: resolvedResult,
                  })
                );
              })
              .catch((error) => {
                console.error(`Error executing command ${wsm.type}:`, error);
                ws.send(
                  JSON.stringify({
                    key: key,
                    payload: null,
                    error: error?.toString(),
                  })
                );
              });
          } else {
            ws.send(
              JSON.stringify({
                key: key,
                payload: result,
              })
            );
          }
        } catch (error) {
          console.error(`Error executing command ${wsm.type}:`, error);
          ws.send(
            JSON.stringify({
              key: key,
              payload: null,
              error: error?.toString(),
            })
          );
        }
        return;
      }

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
      } else {
        // If we get here, the message wasn't handled
        console.warn("Unhandled WebSocket message type:", wsm.type);
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

    // Serve bundled web test files
    if (req.url?.startsWith("/bundles/web/")) {
      // Remove the leading /bundles/web/ to get the relative path
      const relativePath = req.url.replace(/^\/bundles\/web\//, "");
      // The files are in testeranto/bundles/web/ relative to cwd
      const filePath = path.join(
        process.cwd(),
        "testeranto",
        "bundles",
        "web",
        relativePath
      );
      fs.readFile(filePath, (err, data) => {
        if (err) {
          console.error(`Error serving ${req.url}:`, err.message);
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end(`404 Not Found: ${req.url}`);
          return;
        }
        // Determine content type
        let contentType = "text/plain";
        if (req.url?.endsWith(".html")) contentType = "text/html";
        else if (req.url?.endsWith(".js") || req.url?.endsWith(".mjs"))
          contentType = "application/javascript";
        else if (req.url?.endsWith(".css")) contentType = "text/css";
        else if (req.url?.endsWith(".json")) contentType = "application/json";

        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
      });
      return;
    }

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

  // Command handlers for PM_Node
  writeFileSync(
    filepath: string,
    contents: string,
    testName?: string
  ): boolean {
    console.log("PM_2_WithTCP.writeFileSync called:", {
      filepath,
      testName,
      contentsLength: contents.length,
      filepathExists: fs.existsSync(filepath),
      dir: path.dirname(filepath),
    });
    // The filepath already includes the full path from the client (with testResourceConfiguration.fs prepended)
    // Ensure the directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      console.log("Creating directory:", dir);
      fs.mkdirSync(dir, { recursive: true });
    }
    console.log("Writing file:", filepath);
    fs.writeFileSync(filepath, contents);
    console.log("File written successfully");
    return true;
  }

  existsSync(filepath: string): boolean {
    // The filepath already includes the full path from the client
    return fs.existsSync(filepath);
  }

  mkdirSync(filepath: string): void {
    // The filepath already includes the full path from the client
    fs.mkdirSync(filepath, { recursive: true });
  }

  readFile(filepath: string): string {
    const fullPath = path.join(process.cwd(), filepath);
    return fs.readFileSync(fullPath, "utf-8");
  }

  createWriteStream(filepath: string, testName?: string): string {
    // The filepath already includes the full path from the client
    // Ensure the directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const stream = fs.createWriteStream(filepath);
    // For now, we don't track the stream, so return a dummy ID
    return "stream_" + Math.random().toString(36).substr(2, 9);
  }

  end(uid: string): boolean {
    // For now, just return true
    return true;
  }

  customclose(fsPath?: string, testName?: string): any {
    // For now, just return true
    return true;
  }
}
