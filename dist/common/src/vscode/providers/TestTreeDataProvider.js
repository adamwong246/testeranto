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
exports.TestTreeDataProvider = void 0;
const vscode = __importStar(require("vscode"));
const TestTreeItem_1 = require("../TestTreeItem");
const types_1 = require("../types");
class TestTreeDataProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        var _a, _b, _c;
        if (!element) {
            return Promise.resolve(this.getRuntimeItems());
        }
        else if (element.type === types_1.TreeItemType.Runtime) {
            const runtime = (_a = element.data) === null || _a === void 0 ? void 0 : _a.runtime;
            return Promise.resolve(this.getTestItems(runtime));
        }
        else if (element.type === types_1.TreeItemType.Test) {
            const { runtime, testName } = element.data || {};
            return this.getFileTreeItems(runtime, testName);
        }
        else if (element.type === types_1.TreeItemType.File) {
            // Handle expanding directories
            const { runtime, testName, path } = element.data || {};
            if (path && !((_c = (_b = element.data) === null || _b === void 0 ? void 0 : _b.fileName) === null || _c === void 0 ? void 0 : _c.endsWith('.'))) { // Check if it's a directory
                return this.getDirectoryItems(runtime, testName, path);
            }
        }
        return Promise.resolve([]);
    }
    getRuntimeItems() {
        const runtimes = [
            { label: "Node", runtime: "node" },
            { label: "Web", runtime: "web" },
            { label: "Python", runtime: "python" },
            { label: "Golang", runtime: "golang" }
        ];
        return runtimes.map(({ label, runtime }) => new TestTreeItem_1.TestTreeItem(label, types_1.TreeItemType.Runtime, vscode.TreeItemCollapsibleState.Collapsed, { runtime }));
    }
    getTestItems(runtime) {
        if (!runtime) {
            return [];
        }
        let testNames = [];
        switch (runtime) {
            case "node":
            case "web":
                testNames = ["Calculator.test.ts"];
                break;
            case "python":
                testNames = ["Calculator.pitono.test.py"];
                break;
            case "golang":
                testNames = ["Calculator.golingvu.test.go"];
                break;
            default:
                testNames = [];
        }
        return testNames.map(testName => new TestTreeItem_1.TestTreeItem(testName, types_1.TreeItemType.Test, vscode.TreeItemCollapsibleState.Collapsed, { runtime, testName }));
    }
    async getFileItems(runtime, testName) {
        console.log("getFileItems");
        if (!runtime || !testName) {
            return [];
        }
        // Determine which JSON file to read based on runtime and testName
        let jsonFilePath;
        switch (runtime) {
            case "golang":
                jsonFilePath = "testeranto/bundles/allTests/golang/example/Calculator.test.go-inputFiles.json";
                break;
            case "python":
                jsonFilePath = "testeranto/bundles/allTests/python/example/Calculator.test.py-inputFiles.json";
                break;
            case "node":
                jsonFilePath = "testeranto/bundles/allTests/node/example/Calculator.test.mjs-inputFiles.json";
                break;
            case "web":
                jsonFilePath = "testeranto/bundles/allTests/web/example/Calculator.test.mjs-inputFiles.json";
                break;
            case "ruby":
                jsonFilePath = "testeranto/bundles/allTests/ruby/example/Calculator.test.rb-inputFiles.json";
                break;
            default:
                return [];
        }
        try {
            // Get the workspace root
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                throw new Error("No workspace folder open");
            }
            const workspaceRoot = workspaceFolders[0].uri;
            // Build the full URI to the JSON file
            const jsonFileUri = vscode.Uri.joinPath(workspaceRoot, jsonFilePath);
            console.log(`Reading JSON from: ${jsonFileUri.fsPath}`);
            // Read the JSON file
            const fileContent = await vscode.workspace.fs.readFile(jsonFileUri);
            const files = JSON.parse(Buffer.from(fileContent).toString('utf-8'));
            console.log(`Found ${files.length} files in JSON`);
            // Build a tree structure
            const treeRoot = { name: '', children: new Map(), fullPath: '', isFile: false };
            for (const rawFileName of files) {
                // Remove leading '/' if present to make paths relative to workspace root
                const fileName = rawFileName.startsWith('/') ? rawFileName.substring(1) : rawFileName;
                const parts = fileName.split('/');
                let currentNode = treeRoot;
                for (let i = 0; i < parts.length; i++) {
                    const part = parts[i];
                    const isLast = i === parts.length - 1;
                    if (!currentNode.children.has(part)) {
                        currentNode.children.set(part, {
                            name: part,
                            children: new Map(),
                            fullPath: parts.slice(0, i + 1).join('/'),
                            isFile: isLast
                        });
                    }
                    currentNode = currentNode.children.get(part);
                }
            }
            // Convert tree to TestTreeItems
            return this.buildTreeItems(treeRoot, runtime, testName, workspaceRoot);
        }
        catch (error) {
            console.error(`Failed to read file list from ${jsonFilePath}:`, error);
            vscode.window.showErrorMessage(`Could not load file list for ${testName}: ${error}`);
            // Return empty array to prevent tree view from crashing
            return [];
        }
    }
    async getFileTreeItems(runtime, testName) {
        const tree = await this.buildFileTree(runtime, testName);
        if (!tree) {
            return [];
        }
        return this.buildTreeItems(tree, runtime, testName);
    }
    async buildFileTree(runtime, testName) {
        // Determine which JSON file to read based on runtime and testName
        let jsonFilePath;
        switch (runtime) {
            case "golang":
                jsonFilePath = "testeranto/bundles/allTests/golang/example/Calculator.test.go-inputFiles.json";
                break;
            case "python":
                jsonFilePath = "testeranto/bundles/allTests/python/example/Calculator.test.py-inputFiles.json";
                break;
            case "node":
                jsonFilePath = "testeranto/bundles/allTests/node/example/Calculator.test.mjs-inputFiles.json";
                break;
            case "web":
                jsonFilePath = "testeranto/bundles/allTests/web/example/Calculator.test.mjs-inputFiles.json";
                break;
            default:
                return null;
        }
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                throw new Error("No workspace folder open");
            }
            const workspaceRoot = workspaceFolders[0].uri;
            // Read files from JSON input file
            const jsonFileUri = vscode.Uri.joinPath(workspaceRoot, jsonFilePath);
            const fileContent = await vscode.workspace.fs.readFile(jsonFileUri);
            const files = JSON.parse(Buffer.from(fileContent).toString('utf-8'));
            const allFiles = new Set(files);
            // Add report files for this runtime
            try {
                const reportsDir = vscode.Uri.joinPath(workspaceRoot, "testeranto/reports/allTests/example");
                // Check if directory exists
                try {
                    await vscode.workspace.fs.stat(reportsDir);
                    // Read directory contents
                    const entries = await vscode.workspace.fs.readDirectory(reportsDir);
                    for (const [name, type] of entries) {
                        if (type === vscode.FileType.File && name.endsWith('.json')) {
                            // Check if this report file matches the current runtime
                            // For example: python.Calculator.test.ts.json starts with "python"
                            if (name.startsWith(runtime + '.')) {
                                const reportFilePath = `testeranto/reports/allTests/example/${name}`;
                                allFiles.add(reportFilePath);
                            }
                        }
                    }
                }
                catch (error) {
                    console.log(`Reports directory doesn't exist or can't be read: ${reportsDir.fsPath}`);
                }
            }
            catch (error) {
                console.error(`Failed to scan reports directory:`, error);
            }
            const treeRoot = { name: '', children: new Map(), fullPath: '', isFile: false };
            for (const rawFileName of Array.from(allFiles)) {
                const fileName = rawFileName.startsWith('/') ? rawFileName.substring(1) : rawFileName;
                const parts = fileName.split('/');
                let currentNode = treeRoot;
                for (let i = 0; i < parts.length; i++) {
                    const part = parts[i];
                    const isLast = i === parts.length - 1;
                    if (!currentNode.children.has(part)) {
                        currentNode.children.set(part, {
                            name: part,
                            children: new Map(),
                            fullPath: parts.slice(0, i + 1).join('/'),
                            isFile: isLast
                        });
                    }
                    currentNode = currentNode.children.get(part);
                }
            }
            return treeRoot;
        }
        catch (error) {
            console.error(`Failed to build file tree:`, error);
            return null;
        }
    }
    buildTreeItems(node, runtime, testName) {
        const items = [];
        const sortedChildren = Array.from(node.children.values()).sort((a, b) => {
            if (a.isFile && !b.isFile)
                return 1;
            if (!a.isFile && b.isFile)
                return -1;
            return a.name.localeCompare(b.name);
        });
        for (const child of sortedChildren) {
            const collapsibleState = child.isFile
                ? vscode.TreeItemCollapsibleState.None
                : vscode.TreeItemCollapsibleState.Collapsed;
            const treeItem = new TestTreeItem_1.TestTreeItem(child.name, types_1.TreeItemType.File, collapsibleState, {
                runtime,
                testName,
                fileName: child.fullPath,
                path: child.fullPath
            }, child.isFile ? {
                command: "vscode.open",
                title: "Open File",
                arguments: [vscode.Uri.file(child.fullPath)]
            } : undefined, child.isFile ? new vscode.ThemeIcon("file") : new vscode.ThemeIcon("folder"));
            items.push(treeItem);
        }
        return items;
    }
    async getDirectoryItems(runtime, testName, path) {
        const tree = await this.buildFileTree(runtime, testName);
        if (!tree) {
            return [];
        }
        // Find the node corresponding to the path
        const parts = path.split('/').filter(p => p.length > 0);
        let currentNode = tree;
        for (const part of parts) {
            if (currentNode.children.has(part)) {
                currentNode = currentNode.children.get(part);
            }
            else {
                return [];
            }
        }
        return this.buildTreeItems(currentNode, runtime, testName);
    }
}
exports.TestTreeDataProvider = TestTreeDataProvider;
