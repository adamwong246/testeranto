// An extension to edit testeranto test files.

// # Activity Bar
// first broken down by runtimes (node, web, python, golang)
// Each runtime is then broken down into tests
// Each test is broken down into a tree of files
//// This tree should retain the structure of the monorepo but only contain the input files for that test

// TODO for each test, there is a corresponding aider process. These will take the form of terminal tabs. 
// For each test, there should be 1 terminal tab running "echo 'hello world'"
import * as vscode from "vscode";

// Tree item types
enum TreeItemType {
    Runtime,
    Test,
    File
}

// Tree item for tests
class TestTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly type: TreeItemType,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly data?: any,
        public readonly command?: vscode.Command,
        public readonly iconPath?: vscode.ThemeIcon
    ) {
        super(label, collapsibleState);
        this.tooltip = `${this.label}`;
        this.iconPath = iconPath || this.getDefaultIcon();
        this.contextValue = this.getContextValue();
    }

    private getDefaultIcon(): vscode.ThemeIcon | undefined {
        switch (this.type) {
            case TreeItemType.Runtime:
                return new vscode.ThemeIcon("symbol-namespace");
            case TreeItemType.Test:
                return new vscode.ThemeIcon("beaker");
            case TreeItemType.File:
                return new vscode.ThemeIcon("file");
            default:
                return undefined;
        }
    }

    private getContextValue(): string {
        switch (this.type) {
            case TreeItemType.Runtime:
                return 'runtimeItem';
            case TreeItemType.Test:
                return 'testItem';
            case TreeItemType.File:
                return 'fileItem';
            default:
                return 'unknown';
        }
    }
}

// Terminal manager to track terminals per test
class TerminalManager {
    private terminals: Map<string, vscode.Terminal> = new Map();

    getTerminalKey(runtime: string, testName: string): string {
        return `${runtime}:${testName}`;
    }

    createTerminal(runtime: string, testName: string): vscode.Terminal {
        const key = this.getTerminalKey(runtime, testName);
        // Always create a new terminal, don't check for existing ones
        const terminal = vscode.window.createTerminal(`Testeranto: ${testName} (${runtime})`);
        this.terminals.set(key, terminal);
        return terminal;
    }

    getTerminal(runtime: string, testName: string): vscode.Terminal | undefined {
        const key = this.getTerminalKey(runtime, testName);
        return this.terminals.get(key);
    }

    showTerminal(runtime: string, testName: string): vscode.Terminal | undefined {
        const terminal = this.getTerminal(runtime, testName);
        if (terminal) {
            terminal.show();
        }
        return terminal;
    }

    sendTextToTerminal(runtime: string, testName: string, text: string): void {
        const terminal = this.getTerminal(runtime, testName);
        if (terminal) {
            terminal.sendText(text);
        }
    }

    disposeTerminal(runtime: string, testName: string): void {
        const key = this.getTerminalKey(runtime, testName);
        const terminal = this.terminals.get(key);
        if (terminal) {
            terminal.dispose();
            this.terminals.delete(key);
        }
    }

    disposeAll(): void {
        for (const terminal of this.terminals.values()) {
            terminal.dispose();
        }
        this.terminals.clear();
    }

    // Get all test configurations
    getAllTestConfigs(): { runtime: string, testName: string }[] {
        const configs = [];
        const runtimes = ["node", "web", "python", "golang"];
        
        for (const runtime of runtimes) {
            let testNames: string[] = [];
            switch (runtime) {
                case "node":
                    testNames = ["Calculator.test.ts"];
                    break;
                case "web":
                    testNames = ["Calculator.test.ts"];
                    break;
                case "python":
                    testNames = ["Calculator.pitono.test.py"];
                    break;
                case "golang":
                    testNames = ["Calculator.golingvu.test.go"];
                    break;
            }
            for (const testName of testNames) {
                configs.push({ runtime, testName });
            }
        }
        return configs;
    }

    // Create terminals for all tests
    createAllTerminals(): void {
        const configs = this.getAllTestConfigs();
        for (const { runtime, testName } of configs) {
            const terminal = this.createTerminal(runtime, testName);
            // Send initial command
            terminal.sendText(`echo "hello world"`);
            // Show the terminal (optional)
            // terminal.show();
        }
    }
}

// Tree data provider
class TestTreeDataProvider implements vscode.TreeDataProvider<TestTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TestTreeItem | undefined | null | void> = new vscode.EventEmitter<TestTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TestTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TestTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: TestTreeItem): Thenable<TestTreeItem[]> {
        if (!element) {
            // Root level: show runtimes
            return Promise.resolve([
                new TestTreeItem(
                    "Node",
                    TreeItemType.Runtime,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    { runtime: "node" }
                ),
                new TestTreeItem(
                    "Web",
                    TreeItemType.Runtime,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    { runtime: "web" }
                ),
                new TestTreeItem(
                    "Python",
                    TreeItemType.Runtime,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    { runtime: "python" }
                ),
                new TestTreeItem(
                    "Golang",
                    TreeItemType.Runtime,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    { runtime: "golang" }
                )
            ]);
        } else if (element.type === TreeItemType.Runtime) {
            // For each runtime, show tests based on the runtime
            const runtime = element.data.runtime;
            let testNames: string[] = [];
            
            // Define tests per runtime based on example files
            switch (runtime) {
                case "node":
                    testNames = ["Calculator.test.ts"];
                    break;
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
            
            return Promise.resolve(
                testNames.map(testName => 
                    new TestTreeItem(
                        testName,
                        TreeItemType.Test,
                        vscode.TreeItemCollapsibleState.Collapsed,
                        { runtime, testName }
                    )
                )
            );
        } else if (element.type === TreeItemType.Test) {
            // For each test, show relevant files based on runtime and test
            const { runtime, testName } = element.data;
            let files: string[] = [];
            
            // Define files per test
            switch (runtime) {
                case "node":
                case "web":
                    files = [
                        "example/Calculator.ts",
                        `example/${testName}`,
                        "example/tsconfig.json"
                    ];
                    break;
                case "python":
                    files = [
                        "example/Calculator.py",
                        `example/${testName}`,
                        "example/requirements.txt"
                    ];
                    break;
                case "golang":
                    files = [
                        "example/Calculator.go",
                        `example/${testName}`,
                        "example/go.mod"
                    ];
                    break;
            }
            
            return Promise.resolve(
                files.map(fileName => 
                    new TestTreeItem(
                        fileName,
                        TreeItemType.File,
                        vscode.TreeItemCollapsibleState.None,
                        { ...element.data, fileName },
                        {
                            command: "vscode.open",
                            title: "Open File",
                            arguments: [vscode.Uri.file(fileName)]
                        }
                    )
                )
            );
        }
        return Promise.resolve([]);
    }
}

// Simple activation function
export function activate(context: vscode.ExtensionContext): void {
    console.log("[Testeranto] Extension activating...");
    
    // Create terminal manager
    const terminalManager = new TerminalManager();
    
    // Create terminals for all tests immediately
    terminalManager.createAllTerminals();
    console.log("[Testeranto] Created terminals for all tests");
    
    // Create a status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(beaker) Testeranto";
    statusBarItem.tooltip = "Testeranto: Dockerized, AI powered BDD test framework";
    statusBarItem.command = "testeranto.showTests";
    statusBarItem.show();
    
    // Register commands
    const showTestsCommand = vscode.commands.registerCommand(
        "testeranto.showTests",
        () => {
            vscode.window.showInformationMessage("Showing Testeranto tests");
            // Focus the tree view
            vscode.commands.executeCommand("testerantoView.focus");
        }
    );
    
    const runTestCommand = vscode.commands.registerCommand(
        "testeranto.runTest",
        async (item: TestTreeItem) => {
            if (item.type === TreeItemType.Test) {
                const { runtime, testName } = item.data;
                vscode.window.showInformationMessage(`Running ${testName} for ${runtime}...`);
                
                // Show the existing terminal for this test
                const terminal = terminalManager.showTerminal(runtime, testName);
                if (terminal) {
                    // Optionally, you can send additional commands here
                    // But the terminal is already running with "echo 'hello world'"
                    vscode.window.showInformationMessage(`Terminal for ${testName} is ready`, { modal: false });
                } else {
                    vscode.window.showWarningMessage(`Terminal for ${testName} not found`);
                }
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
                // Try to open the file
                const fileName = item.label;
                const uri = vscode.Uri.file(fileName);
                try {
                    const doc = await vscode.workspace.openTextDocument(uri);
                    await vscode.window.showTextDocument(doc);
                } catch (err) {
                    // Try to find the file in the workspace
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
    
    // Register refresh command
    const refreshCommand = vscode.commands.registerCommand("testeranto.refresh", () => {
        vscode.window.showInformationMessage("Refreshing Testeranto view...");
        treeDataProvider.refresh();
    });
    
    // Create tree data provider
    const treeDataProvider = new TestTreeDataProvider();
    
    // Register tree view
    const treeView = vscode.window.createTreeView("testerantoView", {
        treeDataProvider: treeDataProvider,
        showCollapseAll: true
    });
    
    // Clean up terminals when extension is deactivated
    context.subscriptions.push({
        dispose: () => {
            terminalManager.disposeAll();
        }
    });
    
    // Register context menu commands
    context.subscriptions.push(
        showTestsCommand,
        runTestCommand,
        openFileCommand,
        openConfigCommand,
        refreshCommand,
        treeView,
        statusBarItem
    );
    
    console.log("[Testeranto] Commands registered");
    console.log("[Testeranto] Tree view registered");
    
    // Verify command registration
    vscode.commands.getCommands().then((commands) => {
        const hasCommand = commands.includes("testeranto.showTests");
        console.log(`[Testeranto] Command available in palette: ${hasCommand}`);
    });
    
    console.log("[Testeranto] Extension activated successfully");
}

export function deactivate(): void {
    console.log("[Testeranto] Extension deactivated");
}
