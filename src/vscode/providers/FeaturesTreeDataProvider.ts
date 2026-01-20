// This component shows a tree
// It first breaksdown matching the file structure.
// tests.json are further broken done via given-when-then
// features are also spread into the tree
// example: "testeranto/reports/allTests/example/node.Calculator.test.ts.json"
// the tree should spread to "example/Calculator.test.ts"
// then the json file is spread from there
//  • example(folder)
//     • Calculator.test.ts(file)
//        • node(runtime - specific results)
//           • Overall status
//           • Features
//           • Test Scenarios
//              • Scenario 1: ...
//                 • GIVEN: ...
//                 • Features
//                 • WHEN Steps
//                 • THEN Assertions
//        • python(runtime - specific results)
//           • ...

import * as vscode from 'vscode';
import { TestTreeItem } from '../TestTreeItem';
import { TreeItemType, TreeItemData } from '../types';
import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
    name: string;
    status: boolean;
    features: string[];
    fails?: number;
    givens?: any[];
    error?: string;
}

export class FeaturesTreeDataProvider implements vscode.TreeDataProvider<TestTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TestTreeItem | undefined | null | void> = new vscode.EventEmitter<TestTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TestTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private resultsDir: string;

    constructor() {
        // Determine the workspace root
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
            this.resultsDir = path.join(workspaceFolders[0].uri.fsPath, 'testeranto', 'reports', 'allTests', 'example');
        } else {
            this.resultsDir = path.join(process.cwd(), 'testeranto', 'reports', 'allTests', 'example');
        }
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TestTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: TestTreeItem): Thenable<TestTreeItem[]> {
        if (!element) {
            return Promise.resolve(this.getSourceStructure());
        } else {
            const data = element.data;
            if (data?.sourcePath) {
                // Always get children for the source path
                return Promise.resolve(this.getSourceChildren(data.sourcePath));
            } else if (data?.testFile && data.testResultIndex === undefined) {
                // This handles the case when we're showing test results
                return Promise.resolve(this.getTestResults(data.testFile));
            } else if (data?.testResultIndex !== undefined) {
                return Promise.resolve(this.getTestDetails(data.testFile, data.testResultIndex));
            }
        }
        return Promise.resolve([]);
    }

    private getSourceStructure(): TestTreeItem[] {
        // Check if results directory exists
        if (!fs.existsSync(this.resultsDir)) {
            return [
                new TestTreeItem(
                    'No test results found',
                    TreeItemType.File,
                    vscode.TreeItemCollapsibleState.None,
                    {
                        description: 'Run tests to generate results in testeranto/reports/allTests/example/'
                    },
                    undefined,
                    new vscode.ThemeIcon('info')
                )
            ];
        }

        // Get all JSON files in the results directory
        const files = fs.readdirSync(this.resultsDir).filter(file => file.endsWith('.json'));

        if (files.length === 0) {
            return [
                new TestTreeItem(
                    'No test results found',
                    TreeItemType.File,
                    vscode.TreeItemCollapsibleState.None,
                    {
                        description: 'Run tests to generate results'
                    },
                    undefined,
                    new vscode.ThemeIcon('info')
                )
            ];
        }

        // Build a tree structure based on file paths
        // First level: 'example' directory
        const treeRoot: any = { name: '', children: new Map(), fullPath: '', isFile: false };

        // Add 'example' node
        const exampleNode = {
            name: 'example',
            children: new Map(),
            fullPath: 'example',
            isFile: false
        };
        treeRoot.children.set('example', exampleNode);

        for (const file of files) {
            // Extract test name from filename (e.g., "node.Calculator.test.ts.json" -> "Calculator.test.ts")
            // Remove runtime prefix and .json extension
            const match = file.match(/^\w+\.(.+)\.json$/);
            if (match) {
                const testFileName = match[1]; // e.g., "Calculator.test.ts"

                // Add test file under 'example'
                if (!exampleNode.children.has(testFileName)) {
                    exampleNode.children.set(testFileName, {
                        name: testFileName,
                        children: new Map(),
                        fullPath: `example/${testFileName}`,
                        isFile: true,
                        fileName: file
                    });
                }
            }
        }

        // Convert tree to TestTreeItems
        return this.buildSourceTreeItems(treeRoot);
    }

    private buildSourceTreeItems(node: any): TestTreeItem[] {
        const items: TestTreeItem[] = [];

        // Sort children: directories first, then files, alphabetically
        const sortedChildren = Array.from(node.children.values()).sort((a: any, b: any) => {
            if (a.isFile && !b.isFile) return 1;
            if (!a.isFile && b.isFile) return -1;
            return a.name.localeCompare(b.name);
        });

        for (const child of sortedChildren) {
            // Set collapsible state based on whether it's a file or directory
            // Directories can be expanded, files can be expanded to show test results
            const collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;

            const treeItem = new TestTreeItem(
                child.name,
                TreeItemType.File,
                collapsibleState,
                {
                    sourcePath: child.fullPath,
                    testFile: child.fileName,
                    fileName: child.fileName,
                    // Add a flag to indicate if it's a file or directory
                    isFile: child.isFile
                },
                undefined,
                child.isFile ? new vscode.ThemeIcon("file-code") : new vscode.ThemeIcon("folder")
            );

            items.push(treeItem);
        }

        return items;
    }

    private getSourceChildren(sourcePath: string): TestTreeItem[] {
        // Check if results directory exists
        if (!fs.existsSync(this.resultsDir)) {
            return [];
        }

        // Get all JSON files in the results directory
        const files = fs.readdirSync(this.resultsDir).filter(file => file.endsWith('.json'));

        // Split sourcePath into parts
        const parts = sourcePath.split('/').filter(p => p.length > 0);

        // If we're at the root level, show 'example' directory
        if (parts.length === 0) {
            return [
                new TestTreeItem(
                    'example',
                    TreeItemType.File,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    {
                        sourcePath: 'example',
                        isFile: false
                    },
                    undefined,
                    new vscode.ThemeIcon('folder')
                )
            ];
        }

        // If we're at the 'example' level, show test files
        if (parts.length === 1 && parts[0] === 'example') {
            // Group files by test name (without runtime prefix)
            const testFiles = new Map<string, string[]>(); // testName -> list of runtime files

            for (const file of files) {
                const match = file.match(/^(\w+)\.(.+)\.json$/);
                if (match) {
                    const runtime = match[1];
                    const testName = match[2];

                    if (!testFiles.has(testName)) {
                        testFiles.set(testName, []);
                    }
                    testFiles.get(testName)!.push(file);
                }
            }

            // Create test file items
            const items: TestTreeItem[] = [];
            for (const [testName, runtimeFiles] of testFiles) {
                // Count passed/failed for this test across all runtimes
                let passedCount = 0;
                let failedCount = 0;

                for (const file of runtimeFiles) {
                    try {
                        const filePath = path.join(this.resultsDir, file);
                        const content = fs.readFileSync(filePath, 'utf-8');
                        const result = JSON.parse(content) as TestResult;
                        if (result.status === true || result.failed === false) {
                            passedCount++;
                        } else {
                            failedCount++;
                        }
                    } catch {
                        // Skip if can't parse
                    }
                }

                const total = runtimeFiles.length;
                const description = `${passedCount} passed, ${failedCount} failed`;

                items.push(
                    new TestTreeItem(
                        testName,
                        TreeItemType.File,
                        vscode.TreeItemCollapsibleState.Collapsed,
                        {
                            sourcePath: `example/${testName}`,
                            testName: testName,
                            isFile: true,
                            description: description
                        },
                        undefined,
                        failedCount === 0 ?
                            new vscode.ThemeIcon('file-code', new vscode.ThemeColor('testing.iconPassed')) :
                            new vscode.ThemeIcon('file-code', new vscode.ThemeColor('testing.iconFailed'))
                    )
                );
            }

            return items.sort((a, b) => a.label!.localeCompare(b.label!));
        }

        // If we're at the test file level (e.g., "example/Calculator.test.ts"), show runtime-specific results
        if (parts.length === 2 && parts[0] === 'example') {
            const testName = parts[1];

            // Find all runtime files for this test
            const runtimeFiles = files.filter(file => {
                const match = file.match(/^(\w+)\.(.+)\.json$/);
                return match && match[2] === testName;
            });

            return runtimeFiles.map(file => {
                const match = file.match(/^(\w+)\.(.+)\.json$/);
                const runtime = match ? match[1] : 'unknown';

                // Read the file to get status
                let icon = new vscode.ThemeIcon('file-code');
                let description = '';

                try {
                    const filePath = path.join(this.resultsDir, file);
                    const content = fs.readFileSync(filePath, 'utf-8');
                    const result = JSON.parse(content) as TestResult;

                    if (result.status === true || result.failed === false) {
                        icon = new vscode.ThemeIcon('check', new vscode.ThemeColor('testing.iconPassed'));
                        description = 'PASSED';
                    } else {
                        icon = new vscode.ThemeIcon('error', new vscode.ThemeColor('testing.iconFailed'));
                        description = `FAILED: ${result.fails || 0} failures`;
                    }
                } catch {
                    description = 'Error reading file';
                    icon = new vscode.ThemeIcon('warning');
                }

                return new TestTreeItem(
                    runtime,
                    TreeItemType.File,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    {
                        sourcePath: `example/${testName}/${runtime}`,
                        testFile: file,
                        fileName: file,
                        isFile: true,
                        description: description
                    },
                    undefined,
                    icon
                );
            }).sort((a, b) => a.label!.localeCompare(b.label!));
        }

        // If we're at the runtime level under a test file (e.g., "example/Calculator.test.ts/node"), show test results
        if (parts.length === 3 && parts[0] === 'example') {
            const testName = parts[1];
            const runtime = parts[2];

            // Find the actual file
            const fileName = `${runtime}.${testName}.json`;
            if (files.includes(fileName)) {
                // Return the test results for this file
                return this.getTestResults(fileName);
            }
        }

        return [];
    }

    private getTestFilesForRuntime(runtime: string): TestTreeItem[] {
        const files = fs.readdirSync(this.resultsDir).filter(file =>
            file.startsWith(runtime + '.') && file.endsWith('.json')
        );

        return files.map(file => {
            const filePath = path.join(this.resultsDir, file);
            try {
                const content = fs.readFileSync(filePath, 'utf-8');
                const result = JSON.parse(content) as TestResult;

                let icon: vscode.ThemeIcon;
                let description = '';

                if (result.status === true || result.failed === false) {
                    icon = new vscode.ThemeIcon('check', new vscode.ThemeColor('testing.iconPassed'));
                    description = 'All tests passed';
                } else {
                    icon = new vscode.ThemeIcon('error', new vscode.ThemeColor('testing.iconFailed'));
                    description = `${result.fails || 0} tests failed`;
                }

                return new TestTreeItem(
                    file,
                    TreeItemType.File,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    {
                        testFile: file,
                        description: description
                    },
                    undefined,
                    icon
                );
            } catch (error) {
                return new TestTreeItem(
                    file,
                    TreeItemType.File,
                    vscode.TreeItemCollapsibleState.None,
                    {
                        testFile: file,
                        description: 'Error reading file'
                    },
                    undefined,
                    new vscode.ThemeIcon('warning')
                );
            }
        });
    }

    private getTestResults(testFile: string): TestTreeItem[] {
        const filePath = path.join(this.resultsDir, testFile);

        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const result = JSON.parse(content) as TestResult;

            const items: TestTreeItem[] = [];

            // Add overall status
            const overallPassed = result.status === true || result.failed === false;
            items.push(
                new TestTreeItem(
                    `Overall: ${overallPassed ? 'PASSED' : 'FAILED'}`,
                    TreeItemType.File,
                    vscode.TreeItemCollapsibleState.None,
                    {
                        description: `Fails: ${result.fails || 0} | Features: ${result.features?.length || 0}`
                    },
                    undefined,
                    overallPassed ?
                        new vscode.ThemeIcon('check', new vscode.ThemeColor('testing.iconPassed')) :
                        new vscode.ThemeIcon('error', new vscode.ThemeColor('testing.iconFailed'))
                )
            );

            // Add features section
            if (result.features && result.features.length > 0) {
                const featuresItem = new TestTreeItem(
                    `Features (${result.features.length})`,
                    TreeItemType.File,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    {
                        description: 'All test features'
                    },
                    undefined,
                    new vscode.ThemeIcon('symbol-array')
                );
                items.push(featuresItem);
            }

            // Add Givens section (test scenarios)
            if (result.givens && result.givens.length > 0) {
                const givensItem = new TestTreeItem(
                    `Test Scenarios (${result.givens.length})`,
                    TreeItemType.File,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    {
                        description: 'Given-When-Then test cases'
                    },
                    undefined,
                    new vscode.ThemeIcon('list-tree')
                );
                items.push(givensItem);

                // Add each given as a child
                for (let i = 0; i < result.givens.length; i++) {
                    const given = result.givens[i];
                    const givenPassed = given.status === true || given.failed === false;

                    const givenItem = new TestTreeItem(
                        `Scenario ${i + 1}: ${given.key || 'Unnamed'}`,
                        TreeItemType.File,
                        vscode.TreeItemCollapsibleState.Collapsed,
                        {
                            testFile: testFile,
                            testResultIndex: i,
                            description: givenPassed ? 'PASSED' : 'FAILED'
                        },
                        undefined,
                        givenPassed ?
                            new vscode.ThemeIcon('check', new vscode.ThemeColor('testing.iconPassed')) :
                            new vscode.ThemeIcon('error', new vscode.ThemeColor('testing.iconFailed'))
                    );
                    items.push(givenItem);
                }
            }

            return items;
        } catch (error) {
            return [
                new TestTreeItem(
                    'Error reading test results',
                    TreeItemType.File,
                    vscode.TreeItemCollapsibleState.None,
                    {
                        description: String(error)
                    },
                    undefined,
                    new vscode.ThemeIcon('error')
                )
            ];
        }
    }

    private getTestDetails(testFile: string, index: number): TestTreeItem[] {
        const filePath = path.join(this.resultsDir, testFile);

        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const result = JSON.parse(content) as TestResult;

            if (!result.givens || index >= result.givens.length) {
                return [
                    new TestTreeItem(
                        'Test scenario not found',
                        TreeItemType.File,
                        vscode.TreeItemCollapsibleState.None,
                        { description: 'Invalid test scenario index' },
                        undefined,
                        new vscode.ThemeIcon('warning')
                    )
                ];
            }

            const given = result.givens[index];
            const items: TestTreeItem[] = [];

            // Add GIVEN section
            const givenPassed = given.status === true || given.failed === false;
            items.push(
                new TestTreeItem(
                    `GIVEN: ${given.key || 'Test Scenario'}`,
                    TreeItemType.File,
                    vscode.TreeItemCollapsibleState.None,
                    { description: givenPassed ? 'PASSED' : 'FAILED' },
                    undefined,
                    givenPassed ?
                        new vscode.ThemeIcon('check') :
                        new vscode.ThemeIcon('error')
                )
            );

            // Add features for this given
            if (given.features && given.features.length > 0) {
                const featuresItem = new TestTreeItem(
                    `Features (${given.features.length})`,
                    TreeItemType.File,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    { description: 'Features tested in this scenario' },
                    undefined,
                    new vscode.ThemeIcon('symbol-array')
                );
                items.push(featuresItem);

                for (const feature of given.features) {
                    items.push(
                        new TestTreeItem(
                            feature,
                            TreeItemType.File,
                            vscode.TreeItemCollapsibleState.None,
                            { description: 'Feature' },
                            undefined,
                            new vscode.ThemeIcon('symbol-string')
                        )
                    );
                }
            }

            // Add WHEN steps
            if (given.whens && given.whens.length > 0) {
                const whensItem = new TestTreeItem(
                    `WHEN Steps (${given.whens.length})`,
                    TreeItemType.File,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    { description: 'Actions performed' },
                    undefined,
                    new vscode.ThemeIcon('list-ordered')
                );
                items.push(whensItem);

                for (let i = 0; i < given.whens.length; i++) {
                    const when = given.whens[i];
                    items.push(
                        new TestTreeItem(
                            `Step ${i + 1}: ${when.name || 'Action'}`,
                            TreeItemType.File,
                            vscode.TreeItemCollapsibleState.None,
                            {
                                description: when.status || 'No status',
                                tooltip: when.error ? `Error: ${when.error}` : undefined
                            },
                            undefined,
                            when.error ?
                                new vscode.ThemeIcon('error') :
                                new vscode.ThemeIcon('circle')
                        )
                    );
                }
            }

            // Add THEN assertions
            if (given.thens && given.thens.length > 0) {
                const thensItem = new TestTreeItem(
                    `THEN Assertions (${given.thens.length})`,
                    TreeItemType.File,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    { description: 'Expected outcomes' },
                    undefined,
                    new vscode.ThemeIcon('checklist')
                );
                items.push(thensItem);

                for (let i = 0; i < given.thens.length; i++) {
                    const then = given.thens[i];
                    const assertionPassed = !then.error;
                    items.push(
                        new TestTreeItem(
                            `Assertion ${i + 1}: ${then.name || 'Check'}`,
                            TreeItemType.File,
                            vscode.TreeItemCollapsibleState.None,
                            {
                                description: assertionPassed ? 'PASSED' : 'FAILED',
                                tooltip: then.error ? `Error: ${then.error}` : undefined
                            },
                            undefined,
                            assertionPassed ?
                                new vscode.ThemeIcon('check') :
                                new vscode.ThemeIcon('error')
                        )
                    );
                }
            }

            // Add error if present
            if (given.error) {
                items.push(
                    new TestTreeItem(
                        'Error Details',
                        TreeItemType.File,
                        vscode.TreeItemCollapsibleState.None,
                        { description: given.error },
                        undefined,
                        new vscode.ThemeIcon('warning')
                    )
                );
            }

            return items;
        } catch (error) {
            return [
                new TestTreeItem(
                    'Error reading test details',
                    TreeItemType.File,
                    vscode.TreeItemCollapsibleState.None,
                    { description: String(error) },
                    undefined,
                    new vscode.ThemeIcon('error')
                )
            ];
        }
    }
}
