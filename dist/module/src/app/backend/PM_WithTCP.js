"use strict";
// // DEPRECATED
// //
// /* eslint-disable @typescript-eslint/ban-ts-comment */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { ChildProcess, spawn } from "child_process";
// import http from "http";
// import { RawData, WebSocketServer } from "ws";
// import fs from "fs";
// import { IBuiltConfig } from "../../Types.js";
// import { WebSocketMessage } from "../../PM/types.js";
// import { FileService } from "../FileService.js";
// import { PM_Base } from "./PM_0.js";
// export abstract class PM_WithTCP extends PM_Base implements FileService {
//   wss: WebSocketServer;
//   httpServer: http.Server;
//   clients: Set<any> = new Set();
//   runningProcesses: Map<string, ChildProcess | Promise<any>> = new Map();
//   allProcesses: Map<
//     string,
//     {
//       child?: ChildProcess;
//       promise?: Promise<any>;
//       status: "running" | "exited" | "error" | "completed";
//       exitCode?: number;
//       error?: string;
//       command: string;
//       pid?: number;
//       timestamp: string;
//       type: "process" | "promise";
//       category: "aider" | "bdd-test" | "build-time" | "other";
//       testName?: string;
//       platform?: "node" | "web" | "pure" | "python" | "golang";
//     }
//   > = new Map();
//   processLogs: Map<string, string[]> = new Map();
//   constructor(configs: IBuiltConfig, name, mode) {
//     super(configs, name, mode);
//     this.httpServer = http.createServer(this.handleHttpRequest.bind(this));
//     this.wss = new WebSocketServer({ server: this.httpServer });
//     this.wss.on("connection", (ws) => {
//       this.clients.add(ws);
//       console.log("Client connected");
//       ws.on("message", (data) => {
//         try {
//           this.websocket(data, ws);
//         } catch (error) {
//           console.error("Error handling WebSocket message:", error);
//         }
//       });
//       ws.on("close", () => {
//         this.clients.delete(ws);
//         console.log("Client disconnected");
//       });
//       ws.on("error", (error) => {
//         console.error("WebSocket error:", error);
//         this.clients.delete(ws);
//       });
//     });
//     const httpPort = Number(process.env.HTTP_PORT) || 3000;
//     this.httpServer.on("error", (error) => {
//       console.error("HTTP server error:", error);
//       if ((error as any).code === "EADDRINUSE") {
//         console.error(
//           `Port ${httpPort} is already in use. Please use a different port.`
//         );
//       }
//       process.exit(-1);
//     });
//     this.httpServer.listen(httpPort, "0.0.0.0", () => {
//       console.log(`HTTP server running on http://localhost:${httpPort}`);
//     });
//   }
//   websocket(data: RawData, ws: any) {
//     try {
//       const message: WebSocketMessage = JSON.parse(data.toString());
//       if (message.type === "chatMessage") {
//         // Always record the message, even if aider is not available
//         console.log(`Received chat message: ${message.content}`);
//         // Pass to PM_WithHelpo if available
//         if ((this as any).handleChatMessage) {
//           (this as any).handleChatMessage(message.content);
//         } else {
//           console.log("PM_WithHelpo not available - message not processed");
//         }
//         return;
//       }
//       // Handle file operations via WebSocket
//       if (message.type === "listDirectory") {
//         // this.handleListDirectory(ws, message);
//       } else if (message.type === "readFile") {
//         // this.handleReadFile(ws, message);
//       } else if (message.type === "writeFile") {
//         // this.handleWriteFile(ws, message);
//       } else if (message.type === "createDirectory") {
//         // this.handleCreateDirectory(ws, message);
//       } else if (message.type === "deleteFile") {
//         // this.handleDeleteFile(ws, message);
//       } else if (message.type === "executeCommand") {
//         // const executeMessage = message as ExecuteCommandMessage;
//         if (message.command && message.command.trim().startsWith("aider")) {
//           console.log(`Executing command: ${message.command}`);
//           const processId = Date.now().toString();
//           const child = spawn(message.command, {
//             shell: true,
//             cwd: process.cwd(),
//           });
//           this.runningProcesses.set(processId, child);
//           this.allProcesses.set(processId, {
//             child,
//             status: "running",
//             command: message.command,
//             pid: child.pid,
//             timestamp: new Date().toISOString(),
//             type: "process",
//             category: "aider",
//           });
//           this.processLogs.set(processId, []);
//           this.webSocketBroadcastMessage({
//             type: "processStarted",
//             processId,
//             command: message.command,
//             timestamp: new Date().toISOString(),
//             logs: [],
//           });
//           // Capture stdout and stderr
//           child.stdout?.on("data", (data) => {
//             const logData = data.toString();
//             const logs = this.processLogs.get(processId) || [];
//             logs.push(logData);
//             this.processLogs.set(processId, logs);
//             this.webSocketBroadcastMessage({
//               type: "processStdout",
//               processId,
//               data: logData,
//               timestamp: new Date().toISOString(),
//             });
//           });
//           child.stderr?.on("data", (data) => {
//             const logData = data.toString();
//             const logs = this.processLogs.get(processId) || [];
//             logs.push(logData);
//             this.processLogs.set(processId, logs);
//             this.webSocketBroadcastMessage({
//               type: "processStderr",
//               processId,
//               data: logData,
//               timestamp: new Date().toISOString(),
//             });
//           });
//           child.on("error", (error) => {
//             console.error(`Failed to execute command: ${error}`);
//             this.runningProcesses.delete(processId);
//             const processInfo = this.allProcesses.get(processId);
//             if (processInfo) {
//               this.allProcesses.set(processId, {
//                 ...processInfo,
//                 status: "error",
//                 error: error.message,
//               });
//             }
//             this.webSocketBroadcastMessage({
//               type: "processError",
//               processId,
//               error: error.message,
//               timestamp: new Date().toISOString(),
//             });
//           });
//           child.on("exit", (code) => {
//             console.log(`Command exited with code ${code}`);
//             this.runningProcesses.delete(processId);
//             const processInfo = this.allProcesses.get(processId);
//             if (processInfo) {
//               this.allProcesses.set(processId, {
//                 ...processInfo,
//                 status: "exited",
//                 // @ts-ignore
//                 exitCode: code,
//               });
//             }
//             this.webSocketBroadcastMessage({
//               type: "processExited",
//               processId,
//               exitCode: code,
//               timestamp: new Date().toISOString(),
//             });
//           });
//         } else {
//           console.error('Invalid command: must start with "aider"');
//         }
//       } else if (message.type === "getRunningProcesses") {
//         const processes = Array.from(this.allProcesses.entries()).map(
//           ([id, procInfo]) => ({
//             processId: id,
//             command: procInfo.command,
//             pid: procInfo.pid,
//             status: procInfo.status,
//             exitCode: procInfo.exitCode,
//             error: procInfo.error,
//             timestamp: procInfo.timestamp,
//             category: procInfo.category,
//             testName: procInfo.testName,
//             platform: procInfo.platform,
//             logs: this.processLogs.get(id) || [],
//           })
//         );
//         ws.send(
//           JSON.stringify({
//             type: "runningProcesses",
//             processes,
//           })
//         );
//       } else if (message.type === "getProcess") {
//         const processId = message.processId;
//         const procInfo = this.allProcesses.get(processId);
//         if (procInfo) {
//           ws.send(
//             JSON.stringify({
//               type: "processData",
//               processId,
//               command: procInfo.command,
//               pid: procInfo.pid,
//               status: procInfo.status,
//               exitCode: procInfo.exitCode,
//               error: procInfo.error,
//               timestamp: procInfo.timestamp,
//               category: procInfo.category,
//               testName: procInfo.testName,
//               platform: procInfo.platform,
//               logs: this.processLogs.get(processId) || [],
//             })
//           );
//         }
//       } else if (message.type === "stdin") {
//         const processId = message.processId;
//         const data = message.data;
//         console.log("Received stdin for process", processId, ":", data);
//         const childProcess = this.runningProcesses.get(
//           processId
//         ) as ChildProcess;
//         if (childProcess && childProcess.stdin) {
//           console.log("Writing to process stdin");
//           childProcess.stdin.write(data);
//         } else {
//           console.log(
//             "Cannot write to stdin - process not found or no stdin:",
//             {
//               processExists: !!childProcess,
//               stdinExists: childProcess?.stdin ? true : false,
//             }
//           );
//         }
//       } else if (message.type === "killProcess") {
//         const processId = message.processId;
//         console.log("Received killProcess for process", processId);
//         const childProcess = this.runningProcesses.get(
//           processId
//         ) as ChildProcess;
//         if (childProcess) {
//           console.log("Killing process");
//           childProcess.kill("SIGTERM");
//           // The process exit handler will update the status and broadcast the change
//         } else {
//           console.log("Cannot kill process - process not found:", {
//             processExists: !!childProcess,
//           });
//         }
//       } else if (message.type === "getChatHistory") {
//         if ((this as any).getChatHistory) {
//           (this as any)
//             .getChatHistory()
//             .then((history: any) => {
//               ws.send(
//                 JSON.stringify({
//                   type: "chatHistory",
//                   messages: history,
//                 })
//               );
//             })
//             .catch((error: any) => {
//               console.error("Error getting chat history:", error);
//               ws.send(
//                 JSON.stringify({
//                   type: "error",
//                   message: "Failed to get chat history",
//                 })
//               );
//             });
//         }
//       }
//     } catch (error) {
//       console.error("Error handling WebSocket message:", error);
//     }
//   }
//   webSocketBroadcastMessage(message: any) {
//     const data =
//       typeof message === "string" ? message : JSON.stringify(message);
//     this.clients.forEach((client) => {
//       if (client.readyState === 1) {
//         client.send(data);
//       }
//     });
//   }
//   handleHttpRequest(
//     req: http.IncomingMessage,
//     res: http.ServerResponse<http.IncomingMessage> & {
//       req: http.IncomingMessage;
//     }
//   ) {
//     console.log(req, res);
//     res.writeHead(200, {
//       "Content-Type": "application/json",
//     });
//     res.end(JSON.stringify({ wtf: "idk" }));
//   }
//   writeFile(path: string, content: string): Promise<void> {
//     throw new Error("Method not implemented.");
//   }
//   readFile(path: string): Promise<string> {
//     throw new Error("Method not implemented.");
//   }
//   createDirectory(path: string): Promise<void> {
//     throw new Error("Method not implemented.");
//   }
//   deleteFile(path: string): Promise<void> {
//     throw new Error("Method not implemented.");
//   }
//   files(path: string): Promise<object> {
//     throw new Error("Method not implemented.");
//   }
//   projects(project: string): Promise<string[]> {
//     throw new Error("Method not implemented.");
//   }
//   tests(project: string): Promise<string[]> {
//     throw new Error("Method not implemented.");
//   }
//   report(project: string, test: string): Promise<object> {
//     throw new Error("Method not implemented.");
//   }
//   // Add connection listener to see if connections are being made
//   // this.httpServer.on("connection", (socket) => {
//   //   // console.log(
//   //   //   "New TCP connection from:",
//   //   //   socket.remoteAddress,
//   //   //   socket.remotePort
//   //   // );
//   //   // Track when the connection is closed
//   //   // socket.on("close", () => {
//   //   //   console.log(
//   //   //     "TCP connection closed:",
//   //   //     socket.remoteAddress,
//   //   //     socket.remotePort
//   //   //   );
//   //   // });
//   //   // Track errors on the socket
//   //   // socket.on("error", (error) => {
//   //   //   console.log(
//   //   //     "TCP connection error from:",
//   //   //     socket.remoteAddress,
//   //   //     socket.remotePort,
//   //   //     error
//   //   //   );
//   //   // });
//   // });
//   // Add request listener to see HTTP requests
//   // this.httpServer.on("request", (req, res) => {
//   //   // console.log(
//   //   //   "HTTP request received:",
//   //   //   req.method,
//   //   //   req.url,
//   //   //   "from",
//   //   //   req.socket.remoteAddress,
//   //   //   req.socket.remotePort
//   //   // );
//   //   // // Track when the response is finished
//   //   // res.on("finish", () => {
//   //   //   console.log("HTTP response sent:", res.statusCode, req.method, req.url);
//   //   // });
//   // });
//   // httpRequest(req: http.IncomingMessage, res: http.ServerResponse) {
//   //   console.log(`httpRequest method called for ${req.method} ${req.url}`);
//   //   res.writeHead(200, {
//   //     "Content-Type": "application/json",
//   //   });
//   //   // Convert object to JSON string and send
//   //   res.end(JSON.stringify({ wtf: "idk" }));
//   //   // // Ensure response is always completed
//   //   // // const completeResponse = () => {
//   //   // //   if (!res.writableEnded && !res.headersSent) {
//   //   // //     res.writeHead(200, { "Content-Type": "text/plain" });
//   //   // //     res.end("Default response");
//   //   // //     console.log("Complete response sent");
//   //   // //   } else {
//   //   // //     console.log("Response already completed, not sending default");
//   //   // //   }
//   //   // // };
//   //   // // Handle CORS headers for all responses
//   //   // res.setHeader("Access-Control-Allow-Origin", "*");
//   //   // res.setHeader(
//   //   //   "Access-Control-Allow-Methods",
//   //   //   "GET, POST, OPTIONS, PUT, DELETE"
//   //   // );
//   //   // res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   //   // // Handle preflight requests
//   //   // if (req.method === "OPTIONS") {
//   //   //   res.writeHead(200);
//   //   //   res.end();
//   //   //   return;
//   //   // }
//   //   // // Ensure response is always sent
//   //   // const sendResponse = (
//   //   //   status: number,
//   //   //   contentType: string,
//   //   //   body: string | Buffer
//   //   // ) => {
//   //   //   res.writeHead(200, {
//   //   //     "Content-Type": "application/json",
//   //   //   });
//   //   //   // Convert object to JSON string and send
//   //   //   res.end(JSON.stringify({ wtf: "idk" }));
//   //   //   // res.json("Hello from Express!");
//   //   //   // console.log('sendResponse called with:', { status, contentType, body: body.toString().substring(0, 50) });
//   //   //   // if (!res.headersSent) {
//   //   //   //   try {
//   //   //   //     console.log('About to write headers and end response');
//   //   //   //     res.writeHead(status, { "Content-Type": contentType });
//   //   //   //     res.end(body);
//   //   //   //     console.log('Response sent via sendResponse');
//   //   //   //   } catch (error) {
//   //   //   //     console.error('Error sending response:', error);
//   //   //   //   }
//   //   //   // } else {
//   //   //   //   console.warn('Headers already sent, cannot send response');
//   //   //   // }
//   //   // };
//   //   // try {
//   //   //   console.log(`Processing ${req.method} request for: ${req.url}`);
//   //   //   console.log("Response writable state:", {
//   //   //     writable: res.writable,
//   //   //     destroyed: res.destroyed,
//   //   //     writableEnded: res.writableEnded,
//   //   //     writableFinished: res.writableFinished,
//   //   //     headersSent: res.headersSent,
//   //   //   });
//   //   //   // Handle root path
//   //   //   if (req.url === "/") {
//   //   //     sendResponse(
//   //   //       200,
//   //   //       "text/plain",
//   //   //       "HTTP Server is working! Try /test endpoint"
//   //   //     );
//   //   //     return;
//   //   //   }
//   //   //   // Handle test endpoint
//   //   //   if (req.url === "/test") {
//   //   //     sendResponse(200, "text/plain", "Test endpoint is working!");
//   //   //     return;
//   //   //   }
//   //   //   // Handle specific requests
//   //   //   if (req.url === "/testeranto/projects.html") {
//   //   //     console.log("Handling projects.html request - before sendResponse");
//   //   //     sendResponse(
//   //   //       200,
//   //   //       "text/html",
//   //   //       "<html><body><h1>Projects</h1></body></html>"
//   //   //     );
//   //   //     console.log("Handling projects.html request - after sendResponse");
//   //   //     return;
//   //   //   }
//   //   //   // Send a simple response for all other requests
//   //   //   console.log("Handling other request");
//   //   //   sendResponse(
//   //   //     200,
//   //   //     "text/plain",
//   //   //     `Server is working! Request received for: ${req.url}`
//   //   //   );
//   //   //   return;
//   //   //   // The rest of the original code is commented out for now
//   //   //   /*
//   //   //   const parsedUrl = url.parse(req.url || "/", true);
//   //   //   const pathname = parsedUrl.pathname || "/";
//   //   //   // Handle API requests
//   //   //   if (pathname?.startsWith("/api/")) {
//   //   //     console.log("API request received:", pathname);
//   //   //     // If there's an API handler, use it
//   //   //     if ((this as any).apiRequest) {
//   //   //       (this as any).apiRequest(req, res);
//   //   //     } else {
//   //   //       sendResponse(404, "application/json", JSON.stringify({ error: "API endpoint not found" }));
//   //   //     }
//   //   //     return;
//   //   //   }
//   //   //   // Handle root path with a simple response for testing
//   //   //   if (pathname === "/") {
//   //   //     sendResponse(200, "text/plain", "HTTP Server is working!");
//   //   //     return;
//   //   //   }
//   //   //   // Handle static file serving
//   //   //   console.log("Handling static file serving for path:", pathname);
//   //   //   const processedPathname = pathname;
//   //   //   // Remove leading slash to get file path
//   //   //   let filePath = processedPathname.substring(1);
//   //   //   console.log("Looking for file:", filePath);
//   //   //   // Handle special cases
//   //   //   if (filePath.startsWith("reports/")) {
//   //   //     filePath = `testeranto/${filePath}`;
//   //   //   } else if (filePath.startsWith("metafiles/")) {
//   //   //     filePath = `testeranto/${filePath}`;
//   //   //   } else if (filePath === "projects.json") {
//   //   //     // Keep as is
//   //   //   } else {
//   //   //     // For frontend assets, try to find the file
//   //   //     const possiblePaths = [
//   //   //       `dist/${filePath}`,
//   //   //       `testeranto/dist/${filePath}`,
//   //   //       `../dist/${filePath}`,
//   //   //       `./${filePath}`,
//   //   //     ];
//   //   //     console.log("Checking possible paths:", possiblePaths);
//   //   //     // Find the first existing file
//   //   //     let foundPath = null;
//   //   //     for (const possiblePath of possiblePaths) {
//   //   //       try {
//   //   //         if (fs.existsSync(possiblePath)) {
//   //   //           foundPath = possiblePath;
//   //   //           console.log("Found file at:", foundPath);
//   //   //           break;
//   //   //         }
//   //   //       } catch (error) {
//   //   //         // Continue to next path
//   //   //       }
//   //   //     }
//   //   //     if (foundPath) {
//   //   //       filePath = foundPath;
//   //   //     } else {
//   //   //       console.log("File not found, serving index.html or fallback");
//   //   //       // Serve index.html for SPA routing
//   //   //       const indexPath = this.findIndexHtml();
//   //   //       if (indexPath) {
//   //   //         this.serveFileSync(indexPath, res, true);
//   //   //       } else {
//   //   //         sendResponse(200, "text/html", `
//   //   //           <html>
//   //   //             <body>
//   //   //               <h1>Testeranto is running</h1>
//   //   //               <p>Frontend files are not built yet. Run 'npm run build' to build the frontend.</p>
//   //   //             </body>
//   //   //           </html>
//   //   //         `);
//   //   //       }
//   //   //       return;
//   //   //     }
//   //   //   }
//   //   //   // Check if file exists and serve it using synchronous check
//   //   //   try {
//   //   //     console.log("Final file path to serve:", filePath);
//   //   //     if (!fs.existsSync(filePath)) {
//   //   //       console.log("File does not exist:", filePath);
//   //   //       // For SPA routing, serve index.html
//   //   //       const indexPath = this.findIndexHtml();
//   //   //       if (indexPath) {
//   //   //         this.serveFileSync(indexPath, res, true);
//   //   //       } else {
//   //   //         sendResponse(404, "text/plain", "404 Not Found");
//   //   //       }
//   //   //       return;
//   //   //     }
//   //   //     console.log("Serving file:", filePath);
//   //   //     this.serveFileSync(filePath, res, false);
//   //   //   } catch (error) {
//   //   //     console.error(`Error checking file existence for ${filePath}:`, error);
//   //   //     sendResponse(500, "text/plain", "500 Internal Server Error");
//   //   //   }
//   //   //   */
//   //   // } catch (error) {
//   //   //   console.error("Unexpected error handling request:", error);
//   //   //   try {
//   //   //     if (!res.headersSent) {
//   //   //       sendResponse(500, "text/plain", "Internal Server Error");
//   //   //     } else {
//   //   //       console.log("Headers already sent, cannot send error response");
//   //   //     }
//   //   //   } catch (sendError) {
//   //   //     console.error("Failed to send error response:", sendError);
//   //   //     // Try to end the response directly
//   //   //     if (!res.writableEnded) {
//   //   //       res.destroy();
//   //   //     }
//   //   //   }
//   //   // } finally {
//   //   //   // Only complete the response if nothing was sent
//   //   //   console.log("Finally block - response state:", {
//   //   //     headersSent: res.headersSent,
//   //   //     writableEnded: res.writableEnded,
//   //   //     writableFinished: res.writableFinished,
//   //   //   });
//   //   //   if (!res.headersSent && !res.writableEnded) {
//   //   //     console.log("No response sent, calling completeResponse");
//   //   //     completeResponse();
//   //   //   } else {
//   //   //     console.log("Response already handled, skipping completeResponse");
//   //   //   }
//   //   // }
//   // }
//   // findIndexHtml(): string | null {
//   //   const possiblePaths = [
//   //     "dist/index.html",
//   //     "testeranto/dist/index.html",
//   //     "../dist/index.html",
//   //     "./index.html",
//   //   ];
//   //   for (const path of possiblePaths) {
//   //     try {
//   //       if (fs.existsSync(path)) {
//   //         return path;
//   //       }
//   //     } catch (error) {
//   //       // Continue to next path
//   //     }
//   //   }
//   //   return null;
//   // }
// }
// // private serveFile(
// //     filePath: string,
// //     res: http.ServerResponse,
// //     isSpaFallback: boolean
// //   ) {
// //     // Use the synchronous version
// //     this.serveFileSync(filePath, res, isSpaFallback);
// //   }
// // private serveFileSync(
// //     filePath: string,
// //     res: http.ServerResponse,
// //     isSpaFallback: boolean
// //   ) {
// //     // Ensure response is always sent
// //     const sendResponse = (
// //       status: number,
// //       contentType: string,
// //       body: string | Buffer
// //     ) => {
// //       if (!res.headersSent) {
// //         res.writeHead(status, { "Content-Type": contentType });
// //         res.end(body);
// //       }
// //     };
// //     // Check if the file exists using synchronous check
// //     try {
// //       if (!fs.existsSync(filePath) && !isSpaFallback) {
// //         // Try to serve index.html as fallback for SPA routing
// //         const indexPath = this.findIndexHtml();
// //         if (indexPath) {
// //           this.serveFileSync(indexPath, res, true);
// //           return;
// //         } else {
// //           sendResponse(404, "text/plain", "404 Not Found");
// //           return;
// //         }
// //       } else if (!fs.existsSync(filePath) && isSpaFallback) {
// //         sendResponse(404, "text/plain", "404 Not Found");
// //         return;
// //       }
// //       // File exists, read and serve it
// //       try {
// //         const data = fs.readFileSync(filePath);
// //         // For HTML files, inject the configuration
// //         if (filePath.endsWith(".html")) {
// //           let content = data.toString();
// //           // Inject the configuration script before the closing </body> tag
// //           if (content.includes("</body>")) {
// //             const configScript = `
// //                   <script>
// //                     window.testerantoConfig = ${JSON.stringify({
// //                       githubOAuth: {
// //                         clientId: process.env.GITHUB_CLIENT_ID || "",
// //                       },
// //                       serverOrigin:
// //                         process.env.SERVER_ORIGIN || "http://localhost:3000",
// //                     })};
// //                   </script>
// //                 `;
// //             content = content.replace("</body>", `${configScript}</body>`);
// //           }
// //           sendResponse(200, "text/html", content);
// //         } else {
// //           // Get MIME type for other files
// //           const mimeType = mime.lookup(filePath) || "application/octet-stream";
// //           sendResponse(200, mimeType, data);
// //         }
// //       } catch (error) {
// //         console.error(`Error reading file ${filePath}:`, error);
// //         sendResponse(500, "text/plain", "500 Internal Server Error");
// //         return;
// //       }
// //     } catch (error) {
// //       console.error(`Error checking file existence for ${filePath}:`, error);
// //       sendResponse(500, "text/plain", "500 Internal Server Error");
// //       return;
// //     }
// //   }
