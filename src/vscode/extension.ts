import * as vscode from "vscode";
import { TerminalManager } from "./TerminalManager";
import { TestTreeDataProvider } from "./providers/TestTreeDataProvider";
import { FileTreeDataProvider } from "./providers/FileTreeDataProvider";
import { ProcessesTreeDataProvider } from "./providers/ProcessesTreeDataProvider";
import { FeaturesTreeDataProvider } from "./providers/FeaturesTreeDataProvider";
import { TestTreeItem } from "./TestTreeItem";
import { TreeItemType } from "./types";

export function activate(context: vscode.ExtensionContext): void {
    console.log("[Testeranto] Extension activating...");

    // Create terminal manager
    const terminalManager = new TerminalManager();
    terminalManager.createAllTerminals();
    console.log("[Testeranto] Created terminals for all tests");

    // Create status bar items
    const mainStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    mainStatusBarItem.text = "$(beaker) Testeranto";
    mainStatusBarItem.tooltip = "Testeranto: Dockerized, AI powered BDD test framework";
    mainStatusBarItem.command = "testeranto.showTests";
    mainStatusBarItem.show();
    
    const serverStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
    serverStatusBarItem.text = "$(circle-slash) Server";
    serverStatusBarItem.tooltip = "Testeranto server not running. Click to start.";
    serverStatusBarItem.command = "testeranto.startServer";
    serverStatusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    serverStatusBarItem.show();
    
    // Function to update server status
    const updateServerStatus = async () => {
        try {
            // Check if extension-config.json exists
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (workspaceFolders && workspaceFolders.length > 0) {
                const workspaceRoot = workspaceFolders[0].uri;
                const configUri = vscode.Uri.joinPath(workspaceRoot, 'testeranto', 'extension-config.json');
                
                try {
                    await vscode.workspace.fs.stat(configUri);
                    // File exists - server is likely running
                    serverStatusBarItem.text = "$(check) Server";
                    serverStatusBarItem.tooltip = "Testeranto server is running. Click to restart.";
                    serverStatusBarItem.backgroundColor = undefined;
                } catch {
                    // File doesn't exist - server not running
                    serverStatusBarItem.text = "$(circle-slash) Server";
                    serverStatusBarItem.tooltip = "Testeranto server not running. Click to start.";
                    serverStatusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
                }
            }
        } catch (error) {
            console.error('[Testeranto] Error checking server status:', error);
        }
    };
    
    // Initial status check
    updateServerStatus();
    
    // Watch for changes to the config file
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
        const workspaceRoot = workspaceFolders[0].uri;
        const configPattern = new vscode.RelativePattern(workspaceRoot, 'testeranto/extension-config.json');
        const configWatcher = vscode.workspace.createFileSystemWatcher(configPattern);
        
        configWatcher.onDidChange(updateServerStatus);
        configWatcher.onDidCreate(updateServerStatus);
        configWatcher.onDidDelete(updateServerStatus);
        
        context.subscriptions.push(configWatcher);
    }

    // Create tree data providers
    const testTreeDataProvider = new TestTreeDataProvider();
    const fileTreeDataProvider = new FileTreeDataProvider();
    const processesTreeDataProvider = new ProcessesTreeDataProvider();
    const featuresTreeDataProvider = new FeaturesTreeDataProvider();

    // Register commands
    const showTestsCommand = vscode.commands.registerCommand(
        "testeranto.showTests",
        () => {
            vscode.window.showInformationMessage("Showing Testeranto tests");
            vscode.commands.executeCommand("testerantoTestsView.focus");
        }
    );

    const runTestCommand = vscode.commands.registerCommand(
        "testeranto.runTest",
        async (item: TestTreeItem) => {
            if (item.type === TreeItemType.Test) {
                const { runtime, testName } = item.data || {};
                vscode.window.showInformationMessage(`Running ${testName} for ${runtime}...`);
                const terminal = terminalManager.showTerminal(runtime, testName);
                if (terminal) {
                    vscode.window.showInformationMessage(`Terminal for ${testName} is ready`, { modal: false });
                } else {
                    vscode.window.showWarningMessage(`Terminal for ${testName} not found`);
                }
            }
        }
    );

    const aiderCommand = vscode.commands.registerCommand(
        "testeranto.aider",
        async (item: TestTreeItem) => {
            if (item.type === TreeItemType.Test) {
                const { runtime, testName } = item.data || {};
                vscode.window.showInformationMessage(`Connecting to aider process for ${testName} (${runtime})...`);
                const aiderTerminal = terminalManager.createAiderTerminal(runtime, testName);
                aiderTerminal.show();

                // Process test name to match Docker container naming convention
                let processedTestName = testName;
                // Remove file extension
                processedTestName = processedTestName?.replace(/\.[^/.]+$/, "") || "";
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
        }
    );

    const openConfigCommand = vscode.commands.registerCommand(
        "testeranto.openConfig",
        async () => {
            try {
                const uri = vscode.Uri.file("allTests.ts");
                const doc = await vscode.workspace.openTextDocument(uri);
                await vscode.window.showTextDocument(doc);
            } catch (err) {
                vscode.window.showWarningMessage("Could not open allTests.ts configuration file");
            }
        }
    );

    const openFileCommand = vscode.commands.registerCommand(
        "testeranto.openFile",
        async (item: TestTreeItem) => {
            if (item.type === TreeItemType.File) {
                const fileName = item.data?.fileName || item.label;
                const uri = vscode.Uri.file(fileName);
                try {
                    const doc = await vscode.workspace.openTextDocument(uri);
                    await vscode.window.showTextDocument(doc);
                } catch (err) {
                    const files = await vscode.workspace.findFiles(`**/${fileName}`, null, 1);
                    if (files.length > 0) {
                        const doc = await vscode.workspace.openTextDocument(files[0]);
                        await vscode.window.showTextDocument(doc);
                    } else {
                        vscode.window.showWarningMessage(`Could not open file: ${fileName}`);
                    }
                }
            }
        }
    );

    const refreshCommand = vscode.commands.registerCommand("testeranto.refresh", () => {
        vscode.window.showInformationMessage("Refreshing all Testeranto views...");
        testTreeDataProvider.refresh();
        fileTreeDataProvider.refresh();
        processesTreeDataProvider.refresh();
        featuresTreeDataProvider.refresh();
    });

    const retryConnectionCommand = vscode.commands.registerCommand("testeranto.retryConnection", (provider: ProcessesTreeDataProvider) => {
        vscode.window.showInformationMessage("Retrying connection to Docker process server...");
        // Reset connection attempts and try to reconnect
        (provider as any).connectionAttempts = 0;
        (provider as any).isConnected = false;
        (provider as any).connectWebSocket();
        provider.refresh();
    });

    const startServerCommand = vscode.commands.registerCommand("testeranto.startServer", async () => {
        vscode.window.showInformationMessage("Starting Testeranto server...");
        
        // Import and start the server
        try {
            // Dynamically import the server module
            const serverModule = await import('../../server/serverClasees/Server_Docker');
            const configModule = await import('../../../testeranto/testeranto');
            
            // Create server instance
            const server = new serverModule.Server_Docker(configModule.default, 'development');
            
            // Start the server
            await server.start();
            
            vscode.window.showInformationMessage("Testeranto server started successfully!");
            
            // Refresh the tree views
            testTreeDataProvider.refresh();
            processesTreeDataProvider.refresh();
            
        } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to start server: ${error.message}`);
            console.error('[Testeranto] Server start error:', error);
        }
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
            testTreeDataProvider.dispose();
            fileTreeDataProvider.dispose();
            featuresTreeDataProvider.dispose();
        }
    });

    // Register all commands and views
    context.subscriptions.push(
        showTestsCommand,
        runTestCommand,
        aiderCommand,
        openFileCommand,
        openConfigCommand,
        refreshCommand,
        retryConnectionCommand,
        startServerCommand,
        testTreeView,
        fileTreeView,
        processesTreeView,
        featuresTreeView,
        mainStatusBarItem,
        serverStatusBarItem
    );

    console.log("[Testeranto] Commands registered");
    console.log("[Testeranto] Four tree views registered");

    vscode.commands.getCommands().then((commands) => {
        const hasCommand = commands.includes("testeranto.showTests");
        console.log(`[Testeranto] Command available in palette: ${hasCommand}`);
    });

    console.log("[Testeranto] Extension activated successfully");
}

export function deactivate(): void {
    console.log("[Testeranto] Extension deactivated");
}
