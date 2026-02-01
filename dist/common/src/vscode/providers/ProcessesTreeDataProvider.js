"use strict";
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
exports.ProcessesTreeDataProvider = void 0;
const vscode = __importStar(require("vscode"));
const TestTreeItem_1 = require("../TestTreeItem");
const types_1 = require("../types");
class ProcessesTreeDataProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.processes = [];
        this.refreshInterval = null;
        this.ws = null;
        this.isConnected = false;
        this.connectionAttempts = 0;
        this.maxConnectionAttempts = 5;
        // Start WebSocket connection
        this.connectWebSocket();
        // Start periodic refresh
        this.startRefreshing();
    }
    refresh() {
        // Trigger a fresh fetch from the WebSocket server
        this.fetchProcesses();
        // Also fire the event to update the view
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            return Promise.resolve(this.getProcessItems());
        }
        return Promise.resolve([]);
    }
    getProcessItems() {
        // If not connected, show connection status with retry option
        if (!this.isConnected) {
            const items = [];
            // Check if we've exceeded max connection attempts
            if (this.connectionAttempts >= this.maxConnectionAttempts) {
                items.push(new TestTreeItem_1.TestTreeItem("❌ Failed to connect to Docker process server", types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.None, {
                    description: "Make sure the Testeranto server is running on port 3456",
                    connectionFailed: true
                }, {
                    command: "testeranto.retryConnection",
                    title: "Retry Connection",
                    arguments: [this]
                }, new vscode.ThemeIcon("error", new vscode.ThemeColor("testing.iconFailed"))));
                // Add a retry button
                items.push(new TestTreeItem_1.TestTreeItem("Click to retry connection", types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.None, {
                    description: "Or run the Testeranto server first",
                    retry: true
                }, {
                    command: "testeranto.retryConnection",
                    title: "Retry Connection",
                    arguments: [this]
                }, new vscode.ThemeIcon("refresh", new vscode.ThemeColor("testing.iconQueued"))));
                // Show how to start the server
                items.push(new TestTreeItem_1.TestTreeItem("To start the server, run:", types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.None, {
                    description: "npm start in the project root",
                    info: true
                }, undefined, new vscode.ThemeIcon("info", new vscode.ThemeColor("testing.iconUnset"))));
            }
            else {
                items.push(new TestTreeItem_1.TestTreeItem("Connecting to Docker process server...", types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.None, {
                    description: `Attempt ${this.connectionAttempts + 1}/${this.maxConnectionAttempts} to WebSocket server on port 3456`,
                    connecting: true
                }, undefined, new vscode.ThemeIcon("sync", new vscode.ThemeColor("testing.iconQueued"))));
                // Add a manual refresh option
                items.push(new TestTreeItem_1.TestTreeItem("Click to manually refresh", types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.None, {
                    description: "Try to reconnect immediately",
                    manualRefresh: true
                }, {
                    command: "testeranto.refresh",
                    title: "Refresh",
                    arguments: []
                }, new vscode.ThemeIcon("refresh", new vscode.ThemeColor("testing.iconQueued"))));
            }
            return items;
        }
        // Connected but no processes
        if (this.processes.length === 0) {
            return [
                new TestTreeItem_1.TestTreeItem("No Docker processes found", types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.None, {
                    description: "Waiting for Docker containers to start",
                    noProcesses: true
                }, undefined, new vscode.ThemeIcon("info", new vscode.ThemeColor("testing.iconUnset"))),
                new TestTreeItem_1.TestTreeItem("Click to refresh", types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.None, {
                    description: "Check for new Docker containers",
                    refresh: true
                }, {
                    command: "testeranto.refresh",
                    title: "Refresh",
                    arguments: []
                }, new vscode.ThemeIcon("refresh", new vscode.ThemeColor("testing.iconQueued")))
            ];
        }
        // Show connected status and processes
        const items = [
            new TestTreeItem_1.TestTreeItem(`✅ Connected to Docker process server`, types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.None, {
                description: `Found ${this.processes.length} container(s)`,
                connected: true
            }, undefined, new vscode.ThemeIcon("check", new vscode.ThemeColor("testing.iconPassed"))),
            new TestTreeItem_1.TestTreeItem("Click to refresh", types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.None, {
                description: "Update Docker container list",
                refresh: true
            }, {
                command: "testeranto.refresh",
                title: "Refresh",
                arguments: []
            }, new vscode.ThemeIcon("refresh", new vscode.ThemeColor("testing.iconQueued")))
        ];
        // Add all processes
        items.push(...this.processes.map(process => {
            let icon;
            const status = process.status || '';
            if (status.toLowerCase().includes('up') || status.toLowerCase().includes('running')) {
                icon = new vscode.ThemeIcon("check", new vscode.ThemeColor("testing.iconPassed"));
            }
            else if (status.toLowerCase().includes('exited') || status.toLowerCase().includes('stopped')) {
                icon = new vscode.ThemeIcon("error", new vscode.ThemeColor("testing.iconFailed"));
            }
            else {
                icon = new vscode.ThemeIcon("circle-outline", new vscode.ThemeColor("testing.iconUnset"));
            }
            const label = `${process.processId || process.name || 'Unknown'} - ${status || 'unknown'}`;
            const description = process.command || process.image || 'No command';
            return new TestTreeItem_1.TestTreeItem(label, types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.None, {
                description: description,
                status: status,
                processId: process.processId,
                runtime: process.runtime,
                ports: process.ports
            }, undefined, icon);
        }));
        return items;
    }
    connectWebSocket() {
        if (this.connectionAttempts >= this.maxConnectionAttempts) {
            console.error('Max WebSocket connection attempts reached');
            return;
        }
        this.connectionAttempts++;
        try {
            // Use the ws library for Node.js environment
            const WS = require('ws');
            // The WebSocket server runs on port 3456
            this.ws = new WS('ws://localhost:3456/ws');
            this.ws.on('open', () => {
                console.log('WebSocket connected to process server');
                this.isConnected = true;
                this.connectionAttempts = 0;
                // Request initial processes
                this.requestProcesses();
            });
            this.ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    this.handleWebSocketMessage(message);
                }
                catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            });
            this.ws.on('error', (error) => {
                console.error('WebSocket error:', error);
                this.isConnected = false;
            });
            this.ws.on('close', () => {
                console.log('WebSocket disconnected');
                this.isConnected = false;
                // Attempt to reconnect after 5 seconds
                setTimeout(() => {
                    this.connectWebSocket();
                }, 5000);
            });
        }
        catch (error) {
            console.error('Failed to create WebSocket:', error);
            this.isConnected = false;
        }
    }
    handleWebSocketMessage(message) {
        if (message.type === 'processes') {
            if (message.data && message.data.processes) {
                this.processes = message.data.processes;
                this._onDidChangeTreeData.fire();
            }
        }
        else if (message.type === 'connected') {
            console.log('Connected to process server:', message.message);
            this.isConnected = true;
            // Request processes after connection
            this.requestProcesses();
        }
    }
    requestProcesses() {
        if (this.ws && this.ws.readyState === 1) { // 1 = OPEN
            this.ws.send(JSON.stringify({
                type: 'getProcesses'
            }));
        }
        else {
            console.warn('WebSocket not ready, cannot request processes');
        }
    }
    async fetchProcesses() {
        if (this.isConnected) {
            this.requestProcesses();
        }
        else {
            // Try to reconnect if not connected
            this.connectWebSocket();
        }
    }
    startRefreshing() {
        // Fetch immediately
        this.fetchProcesses();
        // Set up periodic refresh every 10 seconds
        this.refreshInterval = setInterval(() => {
            this.fetchProcesses();
        }, 10000);
    }
    dispose() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}
exports.ProcessesTreeDataProvider = ProcessesTreeDataProvider;
