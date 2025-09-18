"use strict";
// api endpoints
//
// /api/files/tree?path                = get tree of file names in a dir
//                                       This tree precisely matches the filesystem
// /api/projects/list                  = get list of projects via project.json
// /api/projects/tests?project         = get list of tests associated with a project
// /api/projects/tree?project=X&test=Y = get tree of files associated with test within a project.
//                                       This tree will be composed dynamically from
//                                          - source files in the metafile
//                                          - the reports for the project and test
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileService = void 0;
// Static Mode Service (Read-only)
class StaticFileService {
    async readFile(path) {
        const response = await fetch(path);
        if (!response.ok)
            throw new Error(`Failed to read file: ${path}`);
        return await response.text();
    }
    async readDirectory(path) {
        // In static mode, we can't list directories from the client
        // This would need to be provided by a server endpoint
        return [];
    }
    async exists(path) {
        try {
            const response = await fetch(path, { method: "HEAD" });
            return response.ok;
        }
        catch (_a) {
            return false;
        }
    }
    // Write operations are no-ops in static mode
    async writeFile() {
        /* no-op */
    }
    async createDirectory() {
        /* no-op */
    }
    async deleteFile() {
        /* no-op */
    }
    // Git operations are not available in static mode
    async getFileStatus() {
        return { status: "unchanged" };
    }
    async getChanges() {
        return [];
    }
    async commitChanges() {
        throw new Error("Commit not available in static mode");
    }
    async pushChanges() {
        throw new Error("Push not available in static mode");
    }
    async pullChanges() {
        throw new Error("Pull not available in static mode");
    }
    async getCurrentBranch() {
        return "main";
    }
    async getRemoteStatus() {
        return { ahead: 0, behind: 0 };
    }
}
// Development Mode Service (Full filesystem access via server)
class DevelopmentFileService {
    constructor() {
        this.ws = null;
        this.changeCallbacks = [];
        this.statusCallbacks = [];
        this.branchCallbacks = [];
        // WebSocket connection should not be established here
        // This is a server-side service that handles HTTP requests
        // WebSocket connections should be managed separately
    }
    connectWebSocket() {
        try {
            const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
            const wsUrl = `${protocol}//${window.location.host}/api/git-ws`;
            this.ws = new WebSocket(wsUrl);
            this.ws.onopen = () => {
                var _a;
                console.log("Git WebSocket connected");
                // Request initial state
                (_a = this.ws) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({ type: "get-initial-state" }));
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
                        case "error":
                            console.error("Git WebSocket error:", data.message);
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
    async readFile(path) {
        // This should be implemented to read from the file system directly
        // Since this is server-side code, we can use Node.js fs module
        // However, this method should not be called on the client side
        // For now, throw an error to indicate this needs proper implementation
        throw new Error("FileService.readFile should be implemented server-side");
    }
    async readDirectory(path) {
        // This should be implemented to read from the file system directly
        // Since this is server-side code, we can use Node.js fs module
        // However, this method should not be called on the client side
        // For now, throw an error to indicate this needs proper implementation
        throw new Error("FileService.readDirectory should be implemented server-side");
    }
    async readDirectoryViaWebSocket(path) {
        // This should not be used - WebSocket communication should be handled separately
        throw new Error("WebSocket directory listing not implemented");
    }
    async exists(path) {
        // This should be implemented to check file existence directly
        // Since this is server-side code, we can use Node.js fs module
        // However, this method should not be called on the client side
        // For now, throw an error to indicate this needs proper implementation
        throw new Error("FileService.exists should be implemented server-side");
    }
    async writeFile(path, content) {
        // This should be implemented to write to the file system directly
        // Since this is server-side code, we can use Node.js fs module
        // However, this method should not be called on the client side
        // For now, throw an error to indicate this needs proper implementation
        throw new Error("FileService.writeFile should be implemented server-side");
    }
    async createDirectory(path) {
        // This should be implemented to create directories directly
        // Since this is server-side code, we can use Node.js fs module
        // However, this method should not be called on the client side
        // For now, throw an error to indicate this needs proper implementation
        throw new Error("FileService.createDirectory should be implemented server-side");
    }
    async deleteFile(path) {
        // This should be implemented to delete files directly
        // Since this is server-side code, we can use Node.js fs module
        // However, this method should not be called on the client side
        // For now, throw an error to indicate this needs proper implementation
        throw new Error("FileService.deleteFile should be implemented server-side");
    }
    async getFileStatus(path) {
        const response = await fetch(`/api/git/status?path=${encodeURIComponent(path)}`);
        if (!response.ok)
            return { status: "unchanged" };
        return await response.json();
    }
    async getChanges() {
        const response = await fetch("/api/git/changes");
        if (!response.ok)
            return [];
        const changes = await response.json();
        console.log("Raw changes from server:", JSON.stringify(changes, null, 2));
        return changes;
    }
    async commitChanges(message, description) {
        var _a;
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
        const response = await fetch("/api/git/branch");
        if (!response.ok)
            return "main";
        return await response.text();
    }
    async getRemoteStatus() {
        const response = await fetch("/api/git/remote-status");
        if (!response.ok)
            return { ahead: 0, behind: 0 };
        return await response.json();
    }
}
// Git Mode Service (isomorphic-git based)
class GitFileService {
    constructor() {
        this.git = null;
        this.fs = null;
        this.dir = "/testeranto-git";
    }
    async ensureGit() {
        if (!this.git) {
            this.git = await Promise.resolve().then(() => __importStar(require("isomorphic-git")));
            this.fs = await Promise.resolve().then(() => __importStar(require("isomorphic-git/http/web")));
        }
    }
    async ensureBufferPolyfill() {
        if (typeof window !== "undefined" && !window.Buffer) {
            const buffer = await Promise.resolve().then(() => __importStar(require("buffer")));
            window.Buffer = buffer.Buffer;
        }
    }
    async readFile(path) {
        await this.ensureBufferPolyfill();
        await this.ensureGit();
        try {
            const content = await this.git.readBlob({
                fs: window.fs,
                dir: this.dir,
                oid: await this.git.resolveRef({
                    fs: window.fs,
                    dir: this.dir,
                    ref: "HEAD",
                }),
                filepath: path,
            });
            return new TextDecoder().decode(content.blob);
        }
        catch (error) {
            throw new Error(`Failed to read file: ${path}`);
        }
    }
    async readDirectory(path) {
        await this.ensureBufferPolyfill();
        await this.ensureGit();
        try {
            const files = await this.git.listFiles({
                fs: window.fs,
                dir: this.dir,
                ref: "HEAD",
            });
            return files.map((name) => ({
                name,
                path: name,
                type: name.includes(".") ? "file" : "directory",
            }));
        }
        catch (error) {
            return [];
        }
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
        await this.ensureBufferPolyfill();
        await this.ensureGit();
        // In Git mode, files are written to the virtual file system
        // This would need proper implementation with IndexedDB or similar
        console.log("Git mode write:", path);
    }
    async createDirectory(path) {
        // Directories are created automatically when writing files
        console.log("Git mode create directory:", path);
    }
    async deleteFile(path) {
        await this.ensureBufferPolyfill();
        await this.ensureGit();
        // Mark file for deletion in next commit
        console.log("Git mode delete:", path);
    }
    async getFileStatus(path) {
        await this.ensureBufferPolyfill();
        await this.ensureGit();
        try {
            const status = await this.git.status({
                fs: window.fs,
                dir: this.dir,
                filepath: path,
            });
            return { status: status };
        }
        catch (_a) {
            return { status: "unchanged" };
        }
    }
    async getChanges() {
        await this.ensureBufferPolyfill();
        await this.ensureGit();
        try {
            const statusMatrix = await this.git.statusMatrix({
                fs: window.fs,
                dir: this.dir,
            });
            return statusMatrix
                .map(([file, head, workdir, stage]) => {
                let status = "unchanged";
                if (head === 0 && workdir === 2)
                    status = "added";
                else if (head === 1 && workdir === 0)
                    status = "deleted";
                else if (workdir === 2)
                    status = "modified";
                else if (head !== workdir)
                    status = "modified";
                return { path: file, status };
            })
                .filter((change) => change.status !== "unchanged");
        }
        catch (error) {
            console.warn("Failed to get changes:", error);
            return [];
        }
    }
    async commitChanges(message, description) {
        await this.ensureBufferPolyfill();
        await this.ensureGit();
        try {
            // Stage all changes
            const changes = await this.getChanges();
            for (const change of changes) {
                if (change.status === "deleted") {
                    await this.git.remove({
                        fs: window.fs,
                        dir: this.dir,
                        filepath: change.path,
                    });
                }
                else {
                    await this.git.add({
                        fs: window.fs,
                        dir: this.dir,
                        filepath: change.path,
                    });
                }
            }
            // Commit
            await this.git.commit({
                fs: window.fs,
                dir: this.dir,
                author: { name: "Testeranto User", email: "user@testeranto" },
                message: description ? `${message}\n\n${description}` : message,
            });
        }
        catch (error) {
            throw new Error(`Failed to commit changes: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    async pushChanges() {
        await this.ensureBufferPolyfill();
        await this.ensureGit();
        try {
            await this.git.push({
                fs: window.fs,
                http: this.fs,
                dir: this.dir,
                remote: "origin",
                ref: "main",
                onAuth: () => ({ username: "token" }),
            });
        }
        catch (error) {
            throw new Error(`Failed to push changes: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    async pullChanges() {
        await this.ensureBufferPolyfill();
        await this.ensureGit();
        try {
            await this.git.pull({
                fs: window.fs,
                http: this.fs,
                dir: this.dir,
                remote: "origin",
                ref: "main",
                singleBranch: true,
                onAuth: () => ({ username: "token" }),
            });
        }
        catch (error) {
            throw new Error(`Failed to pull changes: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    async getCurrentBranch() {
        await this.ensureBufferPolyfill();
        await this.ensureGit();
        try {
            return ((await this.git.currentBranch({
                fs: window.fs,
                dir: this.dir,
            })) || "main");
        }
        catch (_a) {
            return "main";
        }
    }
    async getRemoteStatus() {
        await this.ensureBufferPolyfill();
        await this.ensureGit();
        try {
            // For now, return mock data
            // In a real implementation, we'd compare local and remote branches
            return { ahead: 0, behind: 0 };
        }
        catch (_a) {
            return { ahead: 0, behind: 0 };
        }
    }
}
// Factory function to get the appropriate FileService based on mode
const getFileService = (mode) => {
    switch (mode) {
        case "static":
            return new StaticFileService();
        case "dev":
            return new DevelopmentFileService();
        case "git":
            return new GitFileService();
        default:
            return new StaticFileService();
    }
};
exports.getFileService = getFileService;
