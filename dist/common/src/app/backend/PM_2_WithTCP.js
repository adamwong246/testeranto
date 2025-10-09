"use strict";
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PM_2_WithTCP = void 0;
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const getAllFilesRecursively_js_1 = require("./getAllFilesRecursively.js");
const FileService_js_1 = require("../FileService.js");
const api_js_1 = require("../api.js");
const PM_1_WithProcesses_js_1 = require("./PM_1_WithProcesses.js");
class PM_2_WithTCP extends PM_1_WithProcesses_js_1.PM_1_WithProcesses {
    constructor(configs, name, mode) {
        super(configs, name, mode);
        this.httpServer = http_1.default.createServer(this.handleHttpRequest.bind(this));
        this.wss = new ws_1.WebSocketServer({ server: this.httpServer });
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
        this.httpServer.listen(httpPort, "0.0.0.0", () => {
            console.log(`HTTP server running on http://localhost:${httpPort}`);
        });
    }
    websocket(data, ws) {
        try {
            const wsm = JSON.parse(data.toString());
            FileService_js_1.FileService_methods.forEach((fsm) => {
                if (wsm.type === fsm) {
                    this[fsm](wsm, ws);
                }
            });
            // Handle other message types
            if (wsm.type === "getRunningProcesses") {
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
            else if (wsm.type === "getProcess") {
                const processId = wsm.data.processId;
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
            else if (wsm.type === "stdin") {
                const processId = wsm.data.processId;
                const data = wsm.data.data;
                const childProcess = this.runningProcesses.get(processId);
                if (childProcess && childProcess.stdin) {
                    childProcess.stdin.write(data);
                }
                else {
                    console.log("Cannot write to stdin - process not found or no stdin:", {
                        processExists: !!childProcess,
                        stdinExists: (childProcess === null || childProcess === void 0 ? void 0 : childProcess.stdin) ? true : false,
                    });
                }
            }
            else if (wsm.type === "killProcess") {
                const processId = wsm.processId;
                console.log("Received killProcess for process", processId);
                const childProcess = this.runningProcesses.get(processId);
                if (childProcess) {
                    console.log("Killing process");
                    childProcess.kill("SIGTERM");
                }
                else {
                    console.log("Cannot kill process - process not found:", {
                        processExists: !!childProcess,
                    });
                }
            }
            else if (wsm.type === "getChatHistory") {
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
    handleHttpRequest(req, res) {
        console.log(req.method, req.url);
        if (req.url === api_js_1.ApiEndpoint.root) {
            fs_1.default.readFile(api_js_1.ApiFilename.root, (err, data) => {
                if (err) {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end(`500 ${err.toString()}`);
                    return;
                }
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
            });
            return;
        }
        else if (req.url === api_js_1.ApiEndpoint.style) {
            fs_1.default.readFile(api_js_1.ApiFilename.style, (err, data) => {
                if (err) {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end(`500 ${err.toString()}`);
                    return;
                }
                res.writeHead(200, { "Content-Type": "text/css" });
                res.end(data);
            });
            return;
        }
        else if (req.url === api_js_1.ApiEndpoint.script) {
            fs_1.default.readFile(api_js_1.ApiFilename.script, (err, data) => {
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
        }
        else {
            res.writeHead(404);
            res.end(`404 Not Found. ${req.url}`);
            return;
        }
    }
    // FileService methods
    writeFile_send(wsm, ws) {
        ws.send(JSON.stringify(["writeFile", wsm.data.path]));
    }
    writeFile_receive(wsm, ws) {
        fs_1.default.writeFileSync(wsm.data.path, wsm.data.content);
    }
    readFile_receive(wsm, ws) {
        this.readFile_send(wsm, ws, fs_1.default.readFileSync(wsm.data.path).toString());
    }
    readFile_send(wsm, ws, content) {
        ws.send(JSON.stringify(["readFile", wsm.data.path, content]));
    }
    createDirectory_receive(wsm, ws) {
        fs_1.default.mkdirSync(wsm.data.path);
        this.createDirectory_send(wsm, ws);
    }
    createDirectory_send(wsm, ws) {
        ws.send(JSON.stringify(["createDirectory", wsm.data.path]));
    }
    deleteFile_receive(wsm, ws) {
        fs_1.default.unlinkSync(wsm.data.path);
        this.deleteFile_send(wsm, ws);
    }
    deleteFile_send(wsm, ws) {
        ws.send(JSON.stringify(["deleteFile", wsm.data.path]));
    }
    async files_receive(wsm, ws) {
        this.files_send(wsm, ws, await (0, getAllFilesRecursively_js_1.getAllFilesRecursively)("."));
    }
    files_send(wsm, ws, files) {
        ws.send(JSON.stringify(["files", files]));
    }
    projects_receive(wsm, ws) {
        this.projects_send(wsm, ws, JSON.parse(fs_1.default.readFileSync("./testeranto/projects.json", "utf-8")));
    }
    projects_send(wsm, ws, projects) {
        ws.send(JSON.stringify(["projects", projects]));
    }
    report_receive(wsm, ws) {
        this.report_send(wsm, ws);
    }
    async report_send(wsm, ws) {
        // Implementation remains the same
    }
    async test_receive(wsm, ws) {
        // Implementation remains the same
    }
    test_send(wsm, ws, project) {
        ws.send(JSON.stringify(["tests", project]));
    }
}
exports.PM_2_WithTCP = PM_2_WithTCP;
