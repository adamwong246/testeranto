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
exports.FileTreeDataProvider = void 0;
const vscode = __importStar(require("vscode"));
const TestTreeItem_1 = require("../TestTreeItem");
const types_1 = require("../types");
class FileTreeDataProvider {
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
        var _a;
        if (!element) {
            return this.getRootItems();
        }
        else {
            const path = (_a = element.data) === null || _a === void 0 ? void 0 : _a.path;
            return this.getDirectoryItems(path);
        }
    }
    async getRootItems() {
        const tree = await this.buildFileTree();
        if (!tree) {
            return [];
        }
        return this.buildTreeItems(tree);
    }
    async getDirectoryItems(path) {
        if (!path) {
            return [];
        }
        const tree = await this.buildFileTree();
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
        return this.buildTreeItems(currentNode);
    }
    async buildFileTree() {
        const jsonFilePaths = [
            "testeranto/bundles/allTests/golang/example/Calculator.test.go-inputFiles.json",
            "testeranto/bundles/allTests/node/example/Calculator.test.mjs-inputFiles.json",
            "testeranto/bundles/allTests/web/example/Calculator.test.mjs-inputFiles.json",
            "testeranto/bundles/allTests/python/example/Calculator.test.py-inputFiles.json",
            "testeranto/bundles/allTests/ruby/example/Calculator.test.rb-inputFiles.json"
        ];
        const allFiles = new Set();
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            console.error("No workspace folder open");
            return null;
        }
        const workspaceRoot = workspaceFolders[0].uri;
        // Add files from JSON input files
        for (const jsonFilePath of jsonFilePaths) {
            try {
                const jsonFileUri = vscode.Uri.joinPath(workspaceRoot, jsonFilePath);
                const fileContent = await vscode.workspace.fs.readFile(jsonFileUri);
                const files = JSON.parse(Buffer.from(fileContent).toString('utf-8'));
                files.forEach(file => allFiles.add(file));
            }
            catch (error) {
                console.error(`Failed to read JSON file ${jsonFilePath}:`, error);
                // Continue with other files
            }
        }
        // Add report files from testeranto/reports/allTests/example/
        try {
            const reportsDir = vscode.Uri.joinPath(workspaceRoot, "testeranto/reports/allTests/example");
            // Check if directory exists
            try {
                await vscode.workspace.fs.stat(reportsDir);
                // Read directory contents
                const entries = await vscode.workspace.fs.readDirectory(reportsDir);
                for (const [name, type] of entries) {
                    if (type === vscode.FileType.File && name.endsWith('.json')) {
                        // Add the report file path
                        const reportFilePath = `testeranto/reports/allTests/example/${name}`;
                        allFiles.add(reportFilePath);
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
        // Build tree structure
        const treeRoot = { name: '', children: new Map(), fullPath: '', isFile: false };
        for (const rawFileName of Array.from(allFiles)) {
            // Remove leading '/' if present
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
    buildTreeItems(node) {
        const items = [];
        // Sort children: directories first, then files, alphabetically
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
                path: child.fullPath,
                fileName: child.fullPath
            }, child.isFile ? {
                command: "vscode.open",
                title: "Open File",
                arguments: [vscode.Uri.file(child.fullPath)]
            } : undefined, child.isFile ? new vscode.ThemeIcon("file") : new vscode.ThemeIcon("folder"));
            items.push(treeItem);
        }
        return items;
    }
}
exports.FileTreeDataProvider = FileTreeDataProvider;
