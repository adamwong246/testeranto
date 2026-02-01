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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const TerminalManager_1 = require("./TerminalManager");
const TestTreeDataProvider_1 = require("./providers/TestTreeDataProvider");
const FileTreeDataProvider_1 = require("./providers/FileTreeDataProvider");
const ProcessesTreeDataProvider_1 = require("./providers/ProcessesTreeDataProvider");
const FeaturesTreeDataProvider_1 = require("./providers/FeaturesTreeDataProvider");
const types_1 = require("./types");
function activate(context) {
    console.log("[Testeranto] Extension activating...");
    // Create terminal manager
    const terminalManager = new TerminalManager_1.TerminalManager();
    terminalManager.createAllTerminals();
    console.log("[Testeranto] Created terminals for all tests");
    // Create a status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(beaker) Testeranto";
    statusBarItem.tooltip = "Testeranto: Dockerized, AI powered BDD test framework";
    statusBarItem.command = "testeranto.showTests";
    statusBarItem.show();
    // Create tree data providers
    const testTreeDataProvider = new TestTreeDataProvider_1.TestTreeDataProvider();
    const fileTreeDataProvider = new FileTreeDataProvider_1.FileTreeDataProvider();
    const processesTreeDataProvider = new ProcessesTreeDataProvider_1.ProcessesTreeDataProvider();
    const featuresTreeDataProvider = new FeaturesTreeDataProvider_1.FeaturesTreeDataProvider();
    // Register commands
    const showTestsCommand = vscode.commands.registerCommand("testeranto.showTests", () => {
        vscode.window.showInformationMessage("Showing Testeranto tests");
        vscode.commands.executeCommand("testerantoTestsView.focus");
    });
    const runTestCommand = vscode.commands.registerCommand("testeranto.runTest", async (item) => {
        if (item.type === types_1.TreeItemType.Test) {
            const { runtime, testName } = item.data || {};
            vscode.window.showInformationMessage(`Running ${testName} for ${runtime}...`);
            const terminal = terminalManager.showTerminal(runtime, testName);
            if (terminal) {
                vscode.window.showInformationMessage(`Terminal for ${testName} is ready`, { modal: false });
            }
            else {
                vscode.window.showWarningMessage(`Terminal for ${testName} not found`);
            }
        }
    });
    const aiderCommand = vscode.commands.registerCommand("testeranto.aider", async (item) => {
        if (item.type === types_1.TreeItemType.Test) {
            const { runtime, testName } = item.data || {};
            vscode.window.showInformationMessage(`Connecting to aider process for ${testName} (${runtime})...`);
            const aiderTerminal = terminalManager.createAiderTerminal(runtime, testName);
            aiderTerminal.show();
            // Process test name to match Docker container naming convention
            let processedTestName = testName;
            // Remove file extension
            processedTestName = (processedTestName === null || processedTestName === void 0 ? void 0 : processedTestName.replace(/\.[^/.]+$/, "")) || "";
            // Remove 'example/' prefix if present
            processedTestName = processedTestName.replace(/^example\//, "");
            // Replace special characters with underscores (matching DockerManager)
            const sanitizedTestName = processedTestName.toLowerCase().replaceAll("/", "_").replaceAll(".", "-");
            // Construct container name matching DockerManager's convention
            const containerName = `${runtime}-${sanitizedTestName}-aider`;
            aiderTerminal.sendText("clear");
            setTimeout(() => {
                aiderTerminal.sendText(`echo "Connecting to aider container: ${containerName}"`);
                aiderTerminal.sendText(`docker exec -it ${containerName} /bin/bash`);
            }, 500);
        }
    });
    const openConfigCommand = vscode.commands.registerCommand("testeranto.openConfig", async () => {
        try {
            const uri = vscode.Uri.file("allTests.ts");
            const doc = await vscode.workspace.openTextDocument(uri);
            await vscode.window.showTextDocument(doc);
        }
        catch (err) {
            vscode.window.showWarningMessage("Could not open allTests.ts configuration file");
        }
    });
    const openFileCommand = vscode.commands.registerCommand("testeranto.openFile", async (item) => {
        var _a;
        if (item.type === types_1.TreeItemType.File) {
            const fileName = ((_a = item.data) === null || _a === void 0 ? void 0 : _a.fileName) || item.label;
            const uri = vscode.Uri.file(fileName);
            try {
                const doc = await vscode.workspace.openTextDocument(uri);
                await vscode.window.showTextDocument(doc);
            }
            catch (err) {
                const files = await vscode.workspace.findFiles(`**/${fileName}`, null, 1);
                if (files.length > 0) {
                    const doc = await vscode.workspace.openTextDocument(files[0]);
                    await vscode.window.showTextDocument(doc);
                }
                else {
                    vscode.window.showWarningMessage(`Could not open file: ${fileName}`);
                }
            }
        }
    });
    const refreshCommand = vscode.commands.registerCommand("testeranto.refresh", () => {
        vscode.window.showInformationMessage("Refreshing all Testeranto views...");
        testTreeDataProvider.refresh();
        fileTreeDataProvider.refresh();
        processesTreeDataProvider.refresh();
        featuresTreeDataProvider.refresh();
    });
    const retryConnectionCommand = vscode.commands.registerCommand("testeranto.retryConnection", (provider) => {
        vscode.window.showInformationMessage("Retrying connection to Docker process server...");
        // Reset connection attempts and try to reconnect
        provider.connectionAttempts = 0;
        provider.isConnected = false;
        provider.connectWebSocket();
        provider.refresh();
    });
    // Register tree views
    const testTreeView = vscode.window.createTreeView("testerantoTestsView", {
        treeDataProvider: testTreeDataProvider,
        showCollapseAll: true
    });
    const fileTreeView = vscode.window.createTreeView("testerantoFilesView", {
        treeDataProvider: fileTreeDataProvider,
        showCollapseAll: true
    });
    const processesTreeView = vscode.window.createTreeView("testerantoResultsView", {
        treeDataProvider: processesTreeDataProvider,
        showCollapseAll: true
    });
    const featuresTreeView = vscode.window.createTreeView("testerantoFeaturesView", {
        treeDataProvider: featuresTreeDataProvider,
        showCollapseAll: true
    });
    // Clean up on deactivation
    context.subscriptions.push({
        dispose: () => {
            terminalManager.disposeAll();
            processesTreeDataProvider.dispose();
        }
    });
    // Register all commands and views
    context.subscriptions.push(showTestsCommand, runTestCommand, aiderCommand, openFileCommand, openConfigCommand, refreshCommand, retryConnectionCommand, testTreeView, fileTreeView, processesTreeView, featuresTreeView, statusBarItem);
    console.log("[Testeranto] Commands registered");
    console.log("[Testeranto] Four tree views registered");
    vscode.commands.getCommands().then((commands) => {
        const hasCommand = commands.includes("testeranto.showTests");
        console.log(`[Testeranto] Command available in palette: ${hasCommand}`);
    });
    console.log("[Testeranto] Extension activated successfully");
}
function deactivate() {
    console.log("[Testeranto] Extension deactivated");
}
