// This component shows a tree
// It first breaksdown matching the file structure.
// tests.json are further broken done via given-when-then
// features are also spread into the tree
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
                // Check if this is a file or directory
                // If it's a file (test result JSON), show test results
                // If it's a directory, show its children
                if (data.isFile === true) {
                    // This is a test file, show test results
                    return Promise.resolve(this.getTestResults(data.testFile));
                } else {
                    // This is a directory, show its children
                    return Promise.resolve(this.getSourceChildren(data.sourcePath));
                }
            } else if (data?.testFile && data.testResultIndex === undefined) {
                // This handles the case when we're showing test results
                // But we already handle this above
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
        const treeRoot: any = { name: '', children: new Map(), fullPath: '', isFile: false };

        for (const file of files) {
            // Create a path-like structure: runtime/testName.json
            // Extract runtime from filename (e.g., "node.Calculator.test.ts.json" -> "node")
            const match = file.match(/^(\w+)\.(.+)\.json$/);
            if (match) {
                const runtime = match[1];
                const testName = match[2];

                // Build path: runtime/testName
                const parts = [runtime, testName];
                let currentNode = treeRoot;

                for (let i = 0; i < parts.length; i++) {
                    const part = parts[i];
                    const isLast = i === parts.length - 1;

                    if (!currentNode.children.has(part)) {
                        currentNode.children.set(part, {
                            name: part,
                            children: new Map(),
                            fullPath: parts.slice(0, i + 1).join('/'),
                            isFile: isLast,
                            // Store the actual filename for leaf nodes
                            fileName: isLast ? file : undefined
                        });
                    }
                    currentNode = currentNode.children.get(part);
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
        
        // If we're at the root level, show runtimes
        if (parts.length === 0) {
            // This shouldn't happen, but handle it
            return [];
        }
        
        // If we're at the runtime level (e.g., "node"), show test files for that runtime
        if (parts.length === 1) {
            const runtime = parts[0];
            // Filter files for this runtime
            const runtimeFiles = files.filter(file => {
                const match = file.match(/^(\w+)\.(.+)\.json$/);
                return match && match[1] === runtime;
            });
            
            return runtimeFiles.map(file => {
                const match = file.match(/^(\w+)\.(.+)\.json$/);
                const testName = match ? match[2] : file;
                
                return new TestTreeItem(
                    testName,
                    TreeItemType.File,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    {
                        sourcePath: `${runtime}/${testName}`,
                        testFile: file,
                        fileName: file
                    },
                    undefined,
                    new vscode.ThemeIcon("file-code")
                );
            });
        }
        
        // If we're at the test file level (e.g., "node/Calculator.test.ts"), show test results
        if (parts.length === 2) {
            const runtime = parts[0];
            const testName = parts[1];
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
