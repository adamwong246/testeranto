"use strict";
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevelopmentFileService = void 0;
const FileService_1 = require("../FileService");
class DevelopmentFileService extends FileService_1.FileService {
    constructor() {
        super();
        this.ws = null;
        this.changeCallbacks = [];
        this.statusCallbacks = [];
        this.branchCallbacks = [];
        this.fileCallbacks = new Map();
        this.directoryCallbacks = new Map();
        // Connect to WebSocket when in browser environment
        if (typeof window !== "undefined") {
            this.connectWebSocket();
        }
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
    fsTree(path) {
        throw new Error("Method not implemented.");
    }
    projectTree(project) {
        throw new Error("Method not implemented.");
    }
    connectWebSocket() {
        // Ensure we're in a browser environment
        if (typeof window === "undefined")
            return;
        try {
            const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
            const wsUrl = `${protocol}//${window.location.host}/api/git-ws`;
            this.ws = new WebSocket(wsUrl);
            this.ws.onopen = () => {
                console.log("Git WebSocket connected");
                // Request initial state
                if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                    this.ws.send(JSON.stringify({ type: "get-initial-state" }));
                }
            };
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    switch (data.type) {
                        case "changes":
                            this.changeCallbacks.forEach((callback) => callback(data.changes));
                            break;
                        case "status":
                            this.statusCallbacks.forEach((callback) => callback(data.status));
                            break;
                        case "branch":
                            this.branchCallbacks.forEach((callback) => callback(data.branch));
                            break;
                        case "fileContent": {
                            // Handle file content responses
                            const fileCallbacks = this.fileCallbacks.get(data.path) || [];
                            fileCallbacks.forEach((callback) => callback(data.content));
                            this.fileCallbacks.delete(data.path);
                            break;
                        }
                        case "directoryListing": {
                            // Handle directory listing responses
                            const dirCallbacks = this.directoryCallbacks.get(data.path) || [];
                            dirCallbacks.forEach((callback) => callback(data.items));
                            this.directoryCallbacks.delete(data.path);
                            break;
                        }
                        case "error":
                            console.error("Git WebSocket error:", data.message);
                            // Reject pending callbacks
                            if (data.path) {
                                const fileCallbacks = this.fileCallbacks.get(data.path) || [];
                                fileCallbacks.forEach((callback) => callback(""));
                                this.fileCallbacks.delete(data.path);
                                const dirCallbacks = this.directoryCallbacks.get(data.path) || [];
                                dirCallbacks.forEach((callback) => callback([]));
                                this.directoryCallbacks.delete(data.path);
                            }
                            break;
                    }
                }
                catch (error) {
                    console.error("Error parsing WebSocket message:", error);
                }
            };
            this.ws.onclose = () => {
                console.log("Git WebSocket disconnected, attempting to reconnect...");
                setTimeout(() => this.connectWebSocket(), 3000);
            };
            this.ws.onerror = (error) => {
                console.error("Git WebSocket error:", error);
            };
        }
        catch (error) {
            console.error("Failed to connect Git WebSocket:", error);
        }
    }
    // Subscribe to real-time changes
    onChanges(callback) {
        this.changeCallbacks.push(callback);
        return () => {
            this.changeCallbacks = this.changeCallbacks.filter((cb) => cb !== callback);
        };
    }
    onStatusUpdate(callback) {
        this.statusCallbacks.push(callback);
        return () => {
            this.statusCallbacks = this.statusCallbacks.filter((cb) => cb !== callback);
        };
    }
    onBranchUpdate(callback) {
        this.branchCallbacks.push(callback);
        return () => {
            this.branchCallbacks = this.branchCallbacks.filter((cb) => cb !== callback);
        };
    }
    ensureWebSocketConnected() {
        return new Promise((resolve, reject) => {
            // If already connected, resolve immediately
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                resolve();
                return;
            }
            // If connecting in progress, wait for it
            if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
                const onOpen = () => {
                    var _a;
                    (_a = this.ws) === null || _a === void 0 ? void 0 : _a.removeEventListener("open", onOpen);
                    resolve();
                };
                this.ws.addEventListener("open", onOpen);
                return;
            }
            // Connect if not connected
            this.connectWebSocket();
            // Wait for connection
            if (this.ws) {
                const onOpen = () => {
                    var _a;
                    (_a = this.ws) === null || _a === void 0 ? void 0 : _a.removeEventListener("open", onOpen);
                    resolve();
                };
                const onError = (error) => {
                    var _a;
                    (_a = this.ws) === null || _a === void 0 ? void 0 : _a.removeEventListener("error", onError);
                    reject(new Error("Failed to connect WebSocket"));
                };
                this.ws.addEventListener("open", onOpen);
                this.ws.addEventListener("error", onError);
            }
            else {
                reject(new Error("Failed to create WebSocket"));
            }
        });
    }
    async readFile(path) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.ensureWebSocketConnected();
                if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                    reject(new Error("WebSocket is not connected"));
                    return;
                }
                // Add callback
                if (!this.fileCallbacks.has(path)) {
                    this.fileCallbacks.set(path, []);
                }
                const callbacks = this.fileCallbacks.get(path);
                callbacks.push(resolve);
                // Send request
                this.ws.send(JSON.stringify({
                    type: "readFile",
                    path,
                }));
                // Set timeout for error handling
                setTimeout(() => {
                    const remainingCallbacks = this.fileCallbacks.get(path);
                    if (remainingCallbacks && remainingCallbacks.length > 0) {
                        remainingCallbacks.forEach((cb) => cb(""));
                        this.fileCallbacks.delete(path);
                        reject(new Error("Timeout reading file"));
                    }
                }, 5000);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async readDirectory(path) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.ensureWebSocketConnected();
                if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                    reject(new Error("WebSocket is not connected"));
                    return;
                }
                // Add callback
                if (!this.directoryCallbacks.has(path)) {
                    this.directoryCallbacks.set(path, []);
                }
                const callbacks = this.directoryCallbacks.get(path);
                callbacks.push(resolve);
                // Send request
                this.ws.send(JSON.stringify({
                    type: "listDirectory",
                    path,
                }));
                // Set timeout for error handling
                setTimeout(() => {
                    const remainingCallbacks = this.directoryCallbacks.get(path);
                    if (remainingCallbacks && remainingCallbacks.length > 0) {
                        remainingCallbacks.forEach((cb) => cb([]));
                        this.directoryCallbacks.delete(path);
                        reject(new Error("Timeout reading directory"));
                    }
                }, 5000);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async readDirectoryViaWebSocket(path) {
        // This should not be used - WebSocket communication should be handled separately
        throw new Error("WebSocket directory listing not implemented");
    }
    async exists(path) {
        try {
            await this.readFile(path);
            return true;
        }
        catch (_a) {
            return false;
        }
    }
    async writeFile(path, content) {
        await this.ensureWebSocketConnected();
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error("WebSocket is not connected");
        }
        this.ws.send(JSON.stringify({
            type: "writeFile",
            path,
            content,
        }));
        // For now, we'll assume it always succeeds
        // In a real implementation, we'd want to wait for a confirmation
    }
    async createDirectory(path) {
        await this.ensureWebSocketConnected();
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error("WebSocket is not connected");
        }
        this.ws.send(JSON.stringify({
            type: "createDirectory",
            path,
        }));
        // For now, we'll assume it always succeeds
    }
    async deleteFile(path) {
        await this.ensureWebSocketConnected();
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error("WebSocket is not connected");
        }
        this.ws.send(JSON.stringify({
            type: "deleteFile",
            path,
        }));
        // For now, we'll assume it always succeeds
    }
    async getFileStatus(path) {
        await this.ensureWebSocketConnected();
        const response = await fetch(`/api/git/status?path=${encodeURIComponent(path)}`);
        if (!response.ok)
            return { status: "unchanged" };
        return await response.json();
    }
    async getChanges() {
        try {
            await this.ensureWebSocketConnected();
            const response = await fetch("/api/git/changes");
            if (!response.ok)
                return [];
            const changes = await response.json();
            console.log("Raw changes from server:", JSON.stringify(changes, null, 2));
            return changes;
        }
        catch (error) {
            console.error("Error fetching changes:", error);
            return [];
        }
    }
    async commitChanges(message, description) {
        var _a;
        await this.ensureWebSocketConnected();
        const response = await fetch("/api/git/commit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, description }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to commit changes: ${error}`);
        }
        // Request updated status after commit
        (_a = this.ws) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({ type: "refresh-status" }));
    }
    async pushChanges() {
        var _a;
        await this.ensureWebSocketConnected();
        const response = await fetch("/api/git/push", {
            method: "POST",
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to push changes: ${error}`);
        }
        (_a = this.ws) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({ type: "refresh-status" }));
    }
    async pullChanges() {
        var _a;
        await this.ensureWebSocketConnected();
        const response = await fetch("/api/git/pull", {
            method: "POST",
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to pull changes: ${error}`);
        }
        (_a = this.ws) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({ type: "refresh-status" }));
    }
    async getCurrentBranch() {
        await this.ensureWebSocketConnected();
        const response = await fetch("/api/git/branch");
        if (!response.ok)
            return "main";
        return await response.text();
    }
    async getRemoteStatus() {
        await this.ensureWebSocketConnected();
        const response = await fetch("/api/git/remote-status");
        if (!response.ok)
            return { ahead: 0, behind: 0 };
        return await response.json();
    }
}
exports.DevelopmentFileService = DevelopmentFileService;
