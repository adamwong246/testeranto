/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ChildProcess, spawn } from "node:child_process";
import fs from "fs";
import http from "http";
import url from "url";
import mime from "mime-types";
import { WebSocketServer } from "ws";

import { PM_Base } from "./base.js";
import {
  WebSocketMessage,
  ExecuteCommandMessage,
  GetRunningProcessesMessage,
  GetProcessMessage,
  StdinMessage,
  KillProcessMessage,
} from "./types.js";

export abstract class PM_WithWebSocket extends PM_Base {
  wss: WebSocketServer;
  clients: Set<any> = new Set();
  httpServer: http.Server;
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
      platform?: "node" | "web" | "pure" | "pitono" | "golang";
    }
  > = new Map();
  processLogs: Map<string, string[]> = new Map();

  constructor(configs: any) {
    super(configs);

    // Create HTTP server
    this.httpServer = http.createServer(this.requestHandler.bind(this));

    // Start WebSocket server attached to the HTTP server
    this.wss = new WebSocketServer({ server: this.httpServer });

    this.wss.on("connection", (ws) => {
      this.clients.add(ws);
      console.log("Client connected");

      ws.on("message", (data) => {
        try {
          const message: WebSocketMessage = JSON.parse(data.toString());
          if (message.type === "executeCommand") {
            const executeMessage = message as ExecuteCommandMessage;
            // Validate the command starts with 'aider'
            if (message.command && message.command.trim().startsWith("aider")) {
              console.log(`Executing command: ${message.command}`);
              // Execute the command
              const processId = Date.now().toString();
              const child = spawn(message.command, {
                shell: true,
                cwd: process.cwd(),
              });

              // Track the process in both maps
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

              // Initialize logs for this process
              this.processLogs.set(processId, []);

              // Broadcast process started
              this.broadcast({
                type: "processStarted",
                processId,
                command: message.command,
                timestamp: new Date().toISOString(),
                logs: [],
              });

              // Capture stdout and stderr
              child.stdout?.on("data", (data) => {
                const logData = data.toString();
                // Add to stored logs
                const logs = this.processLogs.get(processId) || [];
                logs.push(logData);
                this.processLogs.set(processId, logs);

                this.broadcast({
                  type: "processStdout",
                  processId,
                  data: logData,
                  timestamp: new Date().toISOString(),
                });
              });

              child.stderr?.on("data", (data) => {
                const logData = data.toString();
                // Add to stored logs
                const logs = this.processLogs.get(processId) || [];
                logs.push(logData);
                this.processLogs.set(processId, logs);

                this.broadcast({
                  type: "processStderr",
                  processId,
                  data: logData,
                  timestamp: new Date().toISOString(),
                });
              });

              child.on("error", (error) => {
                console.error(`Failed to execute command: ${error}`);
                this.runningProcesses.delete(processId);
                // Update the process status to error
                const processInfo = this.allProcesses.get(processId);
                if (processInfo) {
                  this.allProcesses.set(processId, {
                    ...processInfo,
                    status: "error",
                    error: error.message,
                  });
                }
                this.broadcast({
                  type: "processError",
                  processId,
                  error: error.message,
                  timestamp: new Date().toISOString(),
                });
              });

              child.on("exit", (code) => {
                console.log(`Command exited with code ${code}`);
                // Remove from running processes but keep in allProcesses
                this.runningProcesses.delete(processId);
                // Update the process status to exited
                const processInfo = this.allProcesses.get(processId);
                if (processInfo) {
                  this.allProcesses.set(processId, {
                    ...processInfo,
                    status: "exited",
                    exitCode: code,
                  });
                }
                this.broadcast({
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
            const getRunningMessage = message as GetRunningProcessesMessage;
            // Send list of all processes (both running and completed) with their full logs
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
            const getProcessMessage = message as GetProcessMessage;
            // Send specific process with full logs
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
            const stdinMessage = message as StdinMessage;
            // Handle stdin input for a process
            const processId = message.processId;
            const data = message.data;
            console.log("Received stdin for process", processId, ":", data);
            const childProcess = this.runningProcesses.get(processId);

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
            const killProcessMessage = message as KillProcessMessage;
            // Handle killing a process
            const processId = message.processId;
            console.log("Received killProcess for process", processId);
            const childProcess = this.runningProcesses.get(processId);

            if (childProcess) {
              console.log("Killing process");
              childProcess.kill("SIGTERM");
              // The process exit handler will update the status and broadcast the change
            } else {
              console.log("Cannot kill process - process not found:", {
                processExists: !!childProcess,
              });
            }
          }
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

    // Start HTTP server
    const httpPort = Number(process.env.HTTP_PORT) || 3000;
    this.httpServer.listen(httpPort, () => {
      console.log(`HTTP server running on http://localhost:${httpPort}`);
    });
  }

  requestHandler(req: http.IncomingMessage, res: http.ServerResponse) {
    // Parse the URL
    const parsedUrl = url.parse(req.url || "/");
    const pathname = parsedUrl.pathname || "/";

    // Handle health check endpoint
    if (pathname === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ status: "ok", timestamp: new Date().toISOString() })
      );
      return;
    }

    // Handle root path
    let processedPathname = pathname;
    if (processedPathname === "/") {
      processedPathname = "/index.html";
    }

    // Remove leading slash
    let filePath = processedPathname.substring(1);

    // Determine which directory to serve from
    if (filePath.startsWith("reports/")) {
      // Serve from reports directory
      filePath = `testeranto/${filePath}`;
    } else if (filePath.startsWith("metafiles/")) {
      // Serve from metafiles directory
      filePath = `testeranto/${filePath}`;
    } else if (filePath === "projects.json") {
      // Serve projects.json
      filePath = `testeranto/${filePath}`;
    } else {
      // For frontend assets, try multiple possible locations
      // First, try the dist directory
      const possiblePaths = [
        `dist/${filePath}`,
        `testeranto/dist/${filePath}`,
        `../dist/${filePath}`,
        `./${filePath}`,
      ];

      // Find the first existing file
      let foundPath = null;
      for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
          foundPath = possiblePath;
          break;
        }
      }

      if (foundPath) {
        filePath = foundPath;
      } else {
        // If no file found, serve index.html for SPA routing
        const indexPath = this.findIndexHtml();
        if (indexPath) {
          fs.readFile(indexPath, (err, data) => {
            if (err) {
              res.writeHead(404, { "Content-Type": "text/plain" });
              res.end("404 Not Found");
              return;
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
          });
          return;
        } else {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("404 Not Found");
          return;
        }
      }
    }

    // Check if file exists
    fs.exists(filePath, (exists) => {
      if (!exists) {
        // For SPA routing, serve index.html if the path looks like a route
        if (!processedPathname.includes(".") && processedPathname !== "/") {
          const indexPath = this.findIndexHtml();
          if (indexPath) {
            fs.readFile(indexPath, (err, data) => {
              if (err) {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("404 Not Found");
                return;
              }
              res.writeHead(200, { "Content-Type": "text/html" });
              res.end(data);
            });
            return;
          } else {
            // Serve a simple message if index.html is not found
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`
              <html>
                <body>
                  <h1>Testeranto is running</h1>
                  <p>Frontend files are not built yet. Run 'npm run build' to build the frontend.</p>
                </body>
              </html>
            `);
            return;
          }
        }
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
        return;
      }

      // Read and serve the file
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("500 Internal Server Error");
          return;
        }

        // For HTML files, inject the configuration
        if (filePath.endsWith(".html")) {
          let content = data.toString();
          // Inject the configuration script before the closing </body> tag
          if (content.includes("</body>")) {
            const configScript = `
              <script>
                window.testerantoConfig = ${JSON.stringify({
                  githubOAuth: {
                    clientId: process.env.GITHUB_CLIENT_ID || "",
                  },
                  serverOrigin:
                    process.env.SERVER_ORIGIN || "http://localhost:3000",
                })};
              </script>
            `;
            content = content.replace("</body>", `${configScript}</body>`);
          }
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(content);
        } else {
          // Get MIME type for other files
          const mimeType = mime.lookup(filePath) || "application/octet-stream";
          res.writeHead(200, { "Content-Type": mimeType });
          res.end(data);
        }
      });
    });
  }

  findIndexHtml(): string | null {
    const possiblePaths = [
      "dist/index.html",
      "testeranto/dist/index.html",
      "../dist/index.html",
      "./index.html",
    ];

    for (const path of possiblePaths) {
      if (fs.existsSync(path)) {
        return path;
      }
    }
    return null;
  }

  // Add a method to track promise-based processes
  addPromiseProcess(
    processId: string,
    promise: Promise<any>,
    command: string,
    category: "aider" | "bdd-test" | "build-time" | "other" = "other",
    testName?: string,
    platform?: "node" | "web" | "pure" | "pitono" | "golang",
    onResolve?: (result: any) => void,
    onReject?: (error: any) => void
  ) {
    // Track the promise in both maps
    this.runningProcesses.set(processId, promise);
    this.allProcesses.set(processId, {
      promise,
      status: "running",
      command,
      timestamp: new Date().toISOString(),
      type: "promise",
      category,
      testName,
      platform,
    });

    // Initialize logs for this process
    this.processLogs.set(processId, []);

    // Add log entry for process start
    const startMessage = `Starting: ${command}`;
    const logs = this.processLogs.get(processId) || [];
    logs.push(startMessage);
    this.processLogs.set(processId, logs);

    // Broadcast process started
    this.broadcast({
      type: "processStarted",
      processId,
      command,
      timestamp: new Date().toISOString(),
      logs: [startMessage],
    });

    // Handle promise resolution
    promise
      .then((result) => {
        this.runningProcesses.delete(processId);
        // Update the process status to completed
        const processInfo = this.allProcesses.get(processId);
        if (processInfo) {
          this.allProcesses.set(processId, {
            ...processInfo,
            status: "completed",
            exitCode: 0,
          });
        }

        // Add log entry for process completion
        const successMessage = `Completed successfully with result: ${JSON.stringify(
          result
        )}`;
        const currentLogs = this.processLogs.get(processId) || [];
        currentLogs.push(successMessage);
        this.processLogs.set(processId, currentLogs);

        this.broadcast({
          type: "processExited",
          processId,
          exitCode: 0,
          timestamp: new Date().toISOString(),
          logs: [successMessage],
        });
        if (onResolve) onResolve(result);
      })
      .catch((error) => {
        this.runningProcesses.delete(processId);
        // Update the process status to error
        const processInfo = this.allProcesses.get(processId);
        if (processInfo) {
          this.allProcesses.set(processId, {
            ...processInfo,
            status: "error",
            error: error.message,
          });
        }

        // Add log entry for process error
        const errorMessage = `Failed with error: ${error.message}`;
        const currentLogs = this.processLogs.get(processId) || [];
        currentLogs.push(errorMessage);
        this.processLogs.set(processId, currentLogs);

        this.broadcast({
          type: "processError",
          processId,
          error: error.message,
          timestamp: new Date().toISOString(),
          logs: [errorMessage],
        });
        if (onReject) onReject(error);
      });

    return processId;
  }

  broadcast(message: any) {
    const data =
      typeof message === "string" ? message : JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === 1) {
        // WebSocket.OPEN
        client.send(data);
      }
    });
  }

  // Helper methods to get processes by category
  getProcessesByCategory(
    category: "aider" | "bdd-test" | "build-time" | "other"
  ) {
    return Array.from(this.allProcesses.entries())
      .filter(([id, procInfo]) => procInfo.category === category)
      .map(([id, procInfo]) => ({
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
      }));
  }

  getBDDTestProcesses() {
    return this.getProcessesByCategory("bdd-test");
  }

  getBuildTimeProcesses() {
    return this.getProcessesByCategory("build-time");
  }

  getAiderProcesses() {
    return this.getProcessesByCategory("aider");
  }

  getProcessesByTestName(testName: string) {
    return Array.from(this.allProcesses.entries())
      .filter(([id, procInfo]) => procInfo.testName === testName)
      .map(([id, procInfo]) => ({
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
      }));
  }

  getProcessesByPlatform(
    platform: "node" | "web" | "pure" | "pitono" | "golang"
  ) {
    return Array.from(this.allProcesses.entries())
      .filter(([id, procInfo]) => procInfo.platform === platform)
      .map(([id, procInfo]) => ({
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
      }));
  }
}
