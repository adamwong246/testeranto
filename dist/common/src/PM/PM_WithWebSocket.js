"use strict";
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PM_WithWebSocket = void 0;
const node_child_process_1 = require("node:child_process");
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const url_1 = __importDefault(require("url"));
const mime_types_1 = __importDefault(require("mime-types"));
const ws_1 = require("ws");
const PM_WithEslintAndTsc_js_1 = require("./PM_WithEslintAndTsc.js");
class PM_WithWebSocket extends PM_WithEslintAndTsc_js_1.PM_WithEslintAndTsc {
    constructor(configs, name, mode) {
        super(configs, name, mode);
        this.clients = new Set();
        this.runningProcesses = new Map();
        this.allProcesses = new Map();
        this.processLogs = new Map();
        // Create HTTP server
        this.httpServer = http_1.default.createServer(this.requestHandler.bind(this));
        // Start WebSocket server attached to the HTTP server
        this.wss = new ws_1.WebSocketServer({ server: this.httpServer });
        this.wss.on("connection", (ws) => {
            this.clients.add(ws);
            console.log("Client connected");
            ws.on("message", (data) => {
                var _a, _b;
                try {
                    const message = JSON.parse(data.toString());
                    if (message.type === "executeCommand") {
                        // Validate the command starts with 'aider'
                        if (message.command && message.command.trim().startsWith("aider")) {
                            console.log(`Executing command: ${message.command}`);
                            // Execute the command
                            const processId = Date.now().toString();
                            const child = (0, node_child_process_1.spawn)(message.command, {
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
                            (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
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
                            (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.on("data", (data) => {
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
                                    this.allProcesses.set(processId, Object.assign(Object.assign({}, processInfo), { status: "error", error: error.message }));
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
                                    this.allProcesses.set(processId, Object.assign(Object.assign({}, processInfo), { status: "exited", exitCode: code }));
                                }
                                this.broadcast({
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
        // Start HTTP server
        const httpPort = Number(process.env.HTTP_PORT) || 3000;
        this.httpServer.listen(httpPort, () => {
            console.log(`HTTP server running on http://localhost:${httpPort}`);
        });
    }
    requestHandler(req, res) {
        // Parse the URL
        const parsedUrl = url_1.default.parse(req.url || "/");
        let pathname = parsedUrl.pathname || "/";
        // Handle root path
        if (pathname === "/") {
            pathname = "/index.html";
        }
        // Remove leading slash
        let filePath = pathname.substring(1);
        // Determine which directory to serve from
        if (filePath.startsWith("reports/")) {
            // Serve from reports directory
            filePath = `testeranto/${filePath}`;
        }
        else if (filePath.startsWith("metafiles/")) {
            // Serve from metafiles directory
            filePath = `testeranto/${filePath}`;
        }
        else if (filePath === "projects.json") {
            // Serve projects.json
            filePath = `testeranto/${filePath}`;
        }
        else {
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
                if (fs_1.default.existsSync(possiblePath)) {
                    foundPath = possiblePath;
                    break;
                }
            }
            if (foundPath) {
                filePath = foundPath;
            }
            else {
                // If no file found, serve index.html for SPA routing
                const indexPath = this.findIndexHtml();
                if (indexPath) {
                    fs_1.default.readFile(indexPath, (err, data) => {
                        if (err) {
                            res.writeHead(404, { "Content-Type": "text/plain" });
                            res.end("404 Not Found");
                            return;
                        }
                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.end(data);
                    });
                    return;
                }
                else {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end("404 Not Found");
                    return;
                }
            }
        }
        // Check if file exists
        fs_1.default.exists(filePath, (exists) => {
            if (!exists) {
                // For SPA routing, serve index.html if the path looks like a route
                if (!pathname.includes(".") && pathname !== "/") {
                    const indexPath = this.findIndexHtml();
                    if (indexPath) {
                        fs_1.default.readFile(indexPath, (err, data) => {
                            if (err) {
                                res.writeHead(404, { "Content-Type": "text/plain" });
                                res.end("404 Not Found");
                                return;
                            }
                            res.writeHead(200, { "Content-Type": "text/html" });
                            res.end(data);
                        });
                        return;
                    }
                    else {
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
            fs_1.default.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("500 Internal Server Error");
                    return;
                }
                // Get MIME type
                const mimeType = mime_types_1.default.lookup(filePath) || "application/octet-stream";
                res.writeHead(200, { "Content-Type": mimeType });
                res.end(data);
            });
        });
    }
    findIndexHtml() {
        const possiblePaths = [
            "dist/index.html",
            "testeranto/dist/index.html",
            "../dist/index.html",
            "./index.html",
        ];
        for (const path of possiblePaths) {
            if (fs_1.default.existsSync(path)) {
                return path;
            }
        }
        return null;
    }
    // Add a method to track promise-based processes
    addPromiseProcess(processId, promise, command, onResolve, onReject) {
        // Track the promise in both maps
        this.runningProcesses.set(processId, promise);
        this.allProcesses.set(processId, {
            promise,
            status: "running",
            command,
            timestamp: new Date().toISOString(),
            type: "promise",
        });
        // Initialize logs for this process
        this.processLogs.set(processId, []);
        // Broadcast process started
        this.broadcast({
            type: "processStarted",
            processId,
            command,
            timestamp: new Date().toISOString(),
            logs: [],
        });
        // Handle promise resolution
        promise
            .then((result) => {
            this.runningProcesses.delete(processId);
            // Update the process status to completed
            const processInfo = this.allProcesses.get(processId);
            if (processInfo) {
                this.allProcesses.set(processId, Object.assign(Object.assign({}, processInfo), { status: "completed", exitCode: 0 }));
            }
            this.broadcast({
                type: "processExited",
                processId,
                exitCode: 0,
                timestamp: new Date().toISOString(),
            });
            if (onResolve)
                onResolve(result);
        })
            .catch((error) => {
            this.runningProcesses.delete(processId);
            // Update the process status to error
            const processInfo = this.allProcesses.get(processId);
            if (processInfo) {
                this.allProcesses.set(processId, Object.assign(Object.assign({}, processInfo), { status: "error", error: error.message }));
            }
            this.broadcast({
                type: "processError",
                processId,
                error: error.message,
                timestamp: new Date().toISOString(),
            });
            if (onReject)
                onReject(error);
        });
        return processId;
    }
    broadcast(message) {
        const data = typeof message === "string" ? message : JSON.stringify(message);
        this.clients.forEach((client) => {
            if (client.readyState === 1) {
                // WebSocket.OPEN
                client.send(data);
            }
        });
    }
}
exports.PM_WithWebSocket = PM_WithWebSocket;
