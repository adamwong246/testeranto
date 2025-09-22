/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { spawn } from "child_process";
import mime from "mime-types";
import http from "http";
import { WebSocketServer } from "ws";
import fs from "fs";
import { PM_Base } from "./base.js";
export class PM_WithTCP extends PM_Base {
    constructor(configs, name, mode) {
        super(configs, name, mode);
        this.clients = new Set();
        this.runningProcesses = new Map();
        this.allProcesses = new Map();
        this.processLogs = new Map();
        this.httpServer = http.createServer(this.httpRequest.bind(this));
        this.wss = new WebSocketServer({ server: this.httpServer });
        this.wss.on("connection", (ws) => {
            this.clients.add(ws);
            console.log("Client connected");
            ws.on("message", (data) => {
                try {
                    this.websocket(data, ws);
                }
                catch (error) {
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
        // Add error listener before starting the server
        this.httpServer.on("error", (error) => {
            console.error("HTTP server error:", error);
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${httpPort} is already in use. Please use a different port.`);
            }
        });
        // Add connection listener to see if connections are being made
        this.httpServer.on('connection', (socket) => {
            console.log('New connection from:', socket.remoteAddress, socket.remotePort);
        });
        // Add request listener to see if requests are being received
        this.httpServer.on('request', (req, res) => {
            console.log('Request received:', req.method, req.url);
        });
        // Start the server
        try {
            this.httpServer.listen(httpPort, '0.0.0.0', () => {
                const address = this.httpServer.address();
                console.log(`HTTP server running on`, address);
                console.log(`Testing server with curl -v http://localhost:${httpPort}`);
                // Test the server immediately after it starts
                try {
                    const testReq = http.get(`http://localhost:${httpPort}`, (testRes) => {
                        let data = '';
                        testRes.on('data', (chunk) => {
                            data += chunk;
                        });
                        testRes.on('end', () => {
                            console.log(`Test request response: ${testRes.statusCode} - ${data}`);
                        });
                    });
                    testReq.on('error', (error) => {
                        console.error('Test request failed:', error);
                    });
                    // Set a timeout for the test request
                    testReq.setTimeout(3000, () => {
                        console.error('Test request timeout');
                        testReq.destroy();
                    });
                }
                catch (testError) {
                    console.error('Error making test request:', testError);
                }
            });
        }
        catch (error) {
            console.error('Failed to start HTTP server:', error);
        }
    }
    writeFile(path, content) {
        throw new Error("Method not implemented.");
    }
    readFile(path) {
        throw new Error("Method not implemented.");
    }
    createDirectory(path) {
        throw new Error("Method not implemented.");
    }
    deleteFile(path) {
        throw new Error("Method not implemented.");
    }
    files(path) {
        throw new Error("Method not implemented.");
    }
    projects(project) {
        throw new Error("Method not implemented.");
    }
    tests(project) {
        throw new Error("Method not implemented.");
    }
    report(project, test) {
        throw new Error("Method not implemented.");
    }
    webSocketBroadcastMessage(message) {
        const data = typeof message === "string" ? message : JSON.stringify(message);
        this.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(data);
            }
        });
    }
    httpRequest(req, res) {
        console.log(`HTTP ${req.method} request received for: ${req.url}`);
        // Set a timeout to prevent hanging requests
        res.setTimeout(5000, () => {
            console.error('Request timeout:', req.url);
            if (!res.headersSent) {
                res.writeHead(408, { 'Content-Type': 'text/plain' });
                res.end('Request Timeout');
            }
        });
        // Handle CORS headers for all responses
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        // Handle preflight requests
        if (req.method === "OPTIONS") {
            res.writeHead(200);
            res.end();
            return;
        }
        // Ensure response is always sent
        const sendResponse = (status, contentType, body) => {
            if (!res.headersSent) {
                res.writeHead(status, { 'Content-Type': contentType });
                res.end(body);
            }
        };
        try {
            // Send a response immediately for testing
            if (req.url === "/test") {
                sendResponse(200, "text/plain", "Test response");
                return;
            }
            // For now, just respond to all requests with a simple message
            console.log("URL:", req.url);
            sendResponse(200, "text/plain", `Handling request for: ${req.url}`);
            return;
            // The rest of the original code is commented out for now
            /*
            const parsedUrl = url.parse(req.url || "/", true);
            const pathname = parsedUrl.pathname || "/";
      
            // Handle API requests
            if (pathname?.startsWith("/api/")) {
              console.log("API request received:", pathname);
              // If there's an API handler, use it
              if ((this as any).apiRequest) {
                (this as any).apiRequest(req, res);
              } else {
                sendResponse(404, "application/json", JSON.stringify({ error: "API endpoint not found" }));
              }
              return;
            }
      
            // Handle root path with a simple response for testing
            if (pathname === "/") {
              sendResponse(200, "text/plain", "HTTP Server is working!");
              return;
            }
      
            // Handle static file serving
            console.log("Handling static file serving for path:", pathname);
            const processedPathname = pathname;
      
            // Remove leading slash to get file path
            let filePath = processedPathname.substring(1);
            console.log("Looking for file:", filePath);
      
            // Handle special cases
            if (filePath.startsWith("reports/")) {
              filePath = `testeranto/${filePath}`;
            } else if (filePath.startsWith("metafiles/")) {
              filePath = `testeranto/${filePath}`;
            } else if (filePath === "projects.json") {
              // Keep as is
            } else {
              // For frontend assets, try to find the file
              const possiblePaths = [
                `dist/${filePath}`,
                `testeranto/dist/${filePath}`,
                `../dist/${filePath}`,
                `./${filePath}`,
              ];
              console.log("Checking possible paths:", possiblePaths);
      
              // Find the first existing file
              let foundPath = null;
              for (const possiblePath of possiblePaths) {
                try {
                  if (fs.existsSync(possiblePath)) {
                    foundPath = possiblePath;
                    console.log("Found file at:", foundPath);
                    break;
                  }
                } catch (error) {
                  // Continue to next path
                }
              }
      
              if (foundPath) {
                filePath = foundPath;
              } else {
                console.log("File not found, serving index.html or fallback");
                // Serve index.html for SPA routing
                const indexPath = this.findIndexHtml();
                if (indexPath) {
                  this.serveFileSync(indexPath, res, true);
                } else {
                  sendResponse(200, "text/html", `
                    <html>
                      <body>
                        <h1>Testeranto is running</h1>
                        <p>Frontend files are not built yet. Run 'npm run build' to build the frontend.</p>
                      </body>
                    </html>
                  `);
                }
                return;
              }
            }
      
            // Check if file exists and serve it using synchronous check
            try {
              console.log("Final file path to serve:", filePath);
              if (!fs.existsSync(filePath)) {
                console.log("File does not exist:", filePath);
                // For SPA routing, serve index.html
                const indexPath = this.findIndexHtml();
                if (indexPath) {
                  this.serveFileSync(indexPath, res, true);
                } else {
                  sendResponse(404, "text/plain", "404 Not Found");
                }
                return;
              }
      
              console.log("Serving file:", filePath);
              this.serveFileSync(filePath, res, false);
            } catch (error) {
              console.error(`Error checking file existence for ${filePath}:`, error);
              sendResponse(500, "text/plain", "500 Internal Server Error");
            }
            */
        }
        catch (error) {
            console.error('Unexpected error handling request:', error);
            sendResponse(500, 'text/plain', 'Internal Server Error');
        }
    }
    serveFile(filePath, res, isSpaFallback) {
        // Use the synchronous version
        this.serveFileSync(filePath, res, isSpaFallback);
    }
    serveFileSync(filePath, res, isSpaFallback) {
        // Ensure response is always sent
        const sendResponse = (status, contentType, body) => {
            if (!res.headersSent) {
                res.writeHead(status, { 'Content-Type': contentType });
                res.end(body);
            }
        };
        // Check if the file exists using synchronous check
        try {
            if (!fs.existsSync(filePath) && !isSpaFallback) {
                // Try to serve index.html as fallback for SPA routing
                const indexPath = this.findIndexHtml();
                if (indexPath) {
                    this.serveFileSync(indexPath, res, true);
                    return;
                }
                else {
                    sendResponse(404, "text/plain", "404 Not Found");
                    return;
                }
            }
            else if (!fs.existsSync(filePath) && isSpaFallback) {
                sendResponse(404, "text/plain", "404 Not Found");
                return;
            }
            // File exists, read and serve it
            try {
                const data = fs.readFileSync(filePath);
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
                            serverOrigin: process.env.SERVER_ORIGIN || "http://localhost:3000",
                        })};
                  </script>
                `;
                        content = content.replace("</body>", `${configScript}</body>`);
                    }
                    sendResponse(200, "text/html", content);
                }
                else {
                    // Get MIME type for other files
                    const mimeType = mime.lookup(filePath) || "application/octet-stream";
                    sendResponse(200, mimeType, data);
                }
            }
            catch (error) {
                console.error(`Error reading file ${filePath}:`, error);
                sendResponse(500, "text/plain", "500 Internal Server Error");
                return;
            }
        }
        catch (error) {
            console.error(`Error checking file existence for ${filePath}:`, error);
            sendResponse(500, "text/plain", "500 Internal Server Error");
            return;
        }
    }
    findIndexHtml() {
        const possiblePaths = [
            "dist/index.html",
            "testeranto/dist/index.html",
            "../dist/index.html",
            "./index.html",
        ];
        for (const path of possiblePaths) {
            try {
                if (fs.existsSync(path)) {
                    return path;
                }
            }
            catch (error) {
                // Continue to next path
            }
        }
        return null;
    }
    websocket(data, ws) {
        var _a, _b;
        try {
            const message = JSON.parse(data.toString());
            if (message.type === "chatMessage") {
                // Always record the message, even if aider is not available
                console.log(`Received chat message: ${message.content}`);
                // Pass to PM_WithHelpo if available
                if (this.handleChatMessage) {
                    this.handleChatMessage(message.content);
                }
                else {
                    console.log("PM_WithHelpo not available - message not processed");
                }
                return;
            }
            // Handle file operations via WebSocket
            if (message.type === "listDirectory") {
                // this.handleListDirectory(ws, message);
            }
            else if (message.type === "readFile") {
                // this.handleReadFile(ws, message);
            }
            else if (message.type === "writeFile") {
                // this.handleWriteFile(ws, message);
            }
            else if (message.type === "createDirectory") {
                // this.handleCreateDirectory(ws, message);
            }
            else if (message.type === "deleteFile") {
                // this.handleDeleteFile(ws, message);
            }
            else if (message.type === "executeCommand") {
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
                    (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
                        const logData = data.toString();
                        // Add to stored logs
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
                    (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.on("data", (data) => {
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
                            this.allProcesses.set(processId, Object.assign(Object.assign({}, processInfo), { status: "error", error: error.message }));
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
                            this.allProcesses.set(processId, Object.assign(Object.assign({}, processInfo), { status: "exited", 
                                // @ts-ignore
                                exitCode: code }));
                        }
                        this.webSocketBroadcastMessage({
                            type: "processExited",
                            processId,
                            exitCode: code,
                            timestamp: new Date().toISOString(),
                        });
                    });
                }
                else {
                    console.error('Invalid command: must start with "aider"');
                }
            }
            else if (message.type === "getRunningProcesses") {
                // Send list of all processes (both running and completed) with their full logs
                const processes = Array.from(this.allProcesses.entries()).map(([id, procInfo]) => ({
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
                ws.send(JSON.stringify({
                    type: "runningProcesses",
                    processes,
                }));
            }
            else if (message.type === "getProcess") {
                // Send specific process with full logs
                const processId = message.processId;
                const procInfo = this.allProcesses.get(processId);
                if (procInfo) {
                    ws.send(JSON.stringify({
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
                    }));
                }
            }
            else if (message.type === "stdin") {
                // Handle stdin input for a process
                const processId = message.processId;
                const data = message.data;
                console.log("Received stdin for process", processId, ":", data);
                const childProcess = this.runningProcesses.get(processId);
                if (childProcess && childProcess.stdin) {
                    console.log("Writing to process stdin");
                    childProcess.stdin.write(data);
                }
                else {
                    console.log("Cannot write to stdin - process not found or no stdin:", {
                        processExists: !!childProcess,
                        stdinExists: (childProcess === null || childProcess === void 0 ? void 0 : childProcess.stdin) ? true : false,
                    });
                }
            }
            else if (message.type === "killProcess") {
                // Handle killing a process
                const processId = message.processId;
                console.log("Received killProcess for process", processId);
                const childProcess = this.runningProcesses.get(processId);
                if (childProcess) {
                    console.log("Killing process");
                    childProcess.kill("SIGTERM");
                    // The process exit handler will update the status and broadcast the change
                }
                else {
                    console.log("Cannot kill process - process not found:", {
                        processExists: !!childProcess,
                    });
                }
            }
            else if (message.type === "getChatHistory") {
                // Handle request for chat history
                // Pass to PM_WithHelpo if available
                if (this.getChatHistory) {
                    this
                        .getChatHistory()
                        .then((history) => {
                        ws.send(JSON.stringify({
                            type: "chatHistory",
                            messages: history,
                        }));
                    })
                        .catch((error) => {
                        console.error("Error getting chat history:", error);
                        ws.send(JSON.stringify({
                            type: "error",
                            message: "Failed to get chat history",
                        }));
                    });
                }
            }
        }
        catch (error) {
            console.error("Error handling WebSocket message:", error);
        }
    }
}
