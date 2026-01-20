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

    // Create a status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(beaker) Testeranto";
    statusBarItem.tooltip = "Testeranto: Dockerized, AI powered BDD test framework";
    statusBarItem.command = "testeranto.showTests";
    statusBarItem.show();

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

                let processedTestName = testName;
                processedTestName = processedTestName?.replace(/\.[^/.]+$/, "") || "";
                processedTestName = processedTestName.replace(/^example\//, "");
                const sanitizedTestName = processedTestName.replace(/[^a-zA-Z0-9]/g, '-');
                const containerName = `aider-${runtime}-${sanitizedTestName}`;

                aiderTerminal.sendText("clear");
                setTimeout(() => {
                    aiderTerminal.sendText(`echo "Connecting to aider process in container: ${containerName}"`);
                    aiderTerminal.sendText(`docker ps --filter "name=${containerName}" --format "{{.Names}}"`);
                    aiderTerminal.sendText(`docker exec -it ${containerName} /bin/bash`);
                    aiderTerminal.sendText(`echo "Once inside the container, you can run: aider --yes --dark-mode"`);
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
    context.subscriptions.push(
        showTestsCommand,
        runTestCommand,
        aiderCommand,
        openFileCommand,
        openConfigCommand,
        refreshCommand,
        retryConnectionCommand,
        testTreeView,
        fileTreeView,
        processesTreeView,
        featuresTreeView,
        statusBarItem
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
