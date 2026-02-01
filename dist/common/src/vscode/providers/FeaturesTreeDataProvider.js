"use strict";
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
exports.FeaturesTreeDataProvider = void 0;
const vscode = __importStar(require("vscode"));
const TestTreeItem_1 = require("../TestTreeItem");
const types_1 = require("../types");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class FeaturesTreeDataProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        // Determine the workspace root
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
            this.resultsDir = path.join(workspaceFolders[0].uri.fsPath, 'testeranto', 'reports', 'allTests', 'example');
        }
        else {
            this.resultsDir = path.join(process.cwd(), 'testeranto', 'reports', 'allTests', 'example');
        }
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            return Promise.resolve(this.getSourceStructure());
        }
        else {
            const data = element.data;
            if (data === null || data === void 0 ? void 0 : data.sourcePath) {
                // Always get children for the source path
                return Promise.resolve(this.getSourceChildren(data.sourcePath));
            }
            else if ((data === null || data === void 0 ? void 0 : data.testFile) && data.testResultIndex === undefined) {
                // This handles the case when we're showing test results
                return Promise.resolve(this.getTestResults(data.testFile));
            }
            else if ((data === null || data === void 0 ? void 0 : data.testResultIndex) !== undefined) {
                return Promise.resolve(this.getTestDetails(data.testFile, data.testResultIndex));
            }
        }
        return Promise.resolve([]);
    }
    getSourceStructure() {
        // Check if results directory exists
        if (!fs.existsSync(this.resultsDir)) {
            return [
                new TestTreeItem_1.TestTreeItem('No test results found', types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.None, {
                    description: 'Run tests to generate results in testeranto/reports/allTests/example/'
                }, undefined, new vscode.ThemeIcon('info'))
            ];
        }
        // Get all JSON files in the results directory
        const files = fs.readdirSync(this.resultsDir).filter(file => file.endsWith('.json'));
        if (files.length === 0) {
            return [
                new TestTreeItem_1.TestTreeItem('No test results found', types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.None, {
                    description: 'Run tests to generate results'
                }, undefined, new vscode.ThemeIcon('info'))
            ];
        }
        // Build a tree structure based on file paths
        // First level: 'example' directory
        const treeRoot = { name: '', children: new Map(), fullPath: '', isFile: false };
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
    buildSourceTreeItems(node) {
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
            // Set collapsible state based on whether it's a file or directory
            // Directories can be expanded, files can be expanded to show test results
            const collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
            const treeItem = new TestTreeItem_1.TestTreeItem(child.name, types_1.TreeItemType.File, collapsibleState, {
                sourcePath: child.fullPath,
                testFile: child.fileName,
                fileName: child.fileName,
                // Add a flag to indicate if it's a file or directory
                isFile: child.isFile
            }, undefined, child.isFile ? new vscode.ThemeIcon("file-code") : new vscode.ThemeIcon("folder"));
            items.push(treeItem);
        }
        return items;
    }
    getSourceChildren(sourcePath) {
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
                new TestTreeItem_1.TestTreeItem('example', types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.Collapsed, {
                    sourcePath: 'example',
                    isFile: false
                }, undefined, new vscode.ThemeIcon('folder'))
            ];
        }
        // If we're at the 'example' level, show test files
        if (parts.length === 1 && parts[0] === 'example') {
            // Group files by test name (without runtime prefix)
            const testFiles = new Map(); // testName -> list of runtime files
            for (const file of files) {
                const match = file.match(/^(\w+)\.(.+)\.json$/);
                if (match) {
                    const runtime = match[1];
                    const testName = match[2];
                    if (!testFiles.has(testName)) {
                        testFiles.set(testName, []);
                    }
                    testFiles.get(testName).push(file);
                }
            }
            // Create test file items
            const items = [];
            for (const [testName, runtimeFiles] of testFiles) {
                // Count passed/failed for this test across all runtimes
                let passedCount = 0;
                let failedCount = 0;
                for (const file of runtimeFiles) {
                    try {
                        const filePath = path.join(this.resultsDir, file);
                        const content = fs.readFileSync(filePath, 'utf-8');
                        const result = JSON.parse(content);
                        if (result.status === true || result.failed === false) {
                            passedCount++;
                        }
                        else {
                            failedCount++;
                        }
                    }
                    catch (_a) {
                        // Skip if can't parse
                    }
                }
                const total = runtimeFiles.length;
                const description = `${passedCount} passed, ${failedCount} failed`;
                items.push(new TestTreeItem_1.TestTreeItem(testName, types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.Collapsed, {
                    sourcePath: `example/${testName}`,
                    testName: testName,
                    isFile: true,
                    description: description
                }, undefined, failedCount === 0 ?
                    new vscode.ThemeIcon('file-code', new vscode.ThemeColor('testing.iconPassed')) :
                    new vscode.ThemeIcon('file-code', new vscode.ThemeColor('testing.iconFailed'))));
            }
            return items.sort((a, b) => a.label.localeCompare(b.label));
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
                    const result = JSON.parse(content);
                    if (result.status === true || result.failed === false) {
                        icon = new vscode.ThemeIcon('check', new vscode.ThemeColor('testing.iconPassed'));
                        description = 'PASSED';
                    }
                    else {
                        icon = new vscode.ThemeIcon('error', new vscode.ThemeColor('testing.iconFailed'));
                        description = `FAILED: ${result.fails || 0} failures`;
                    }
                }
                catch (_a) {
                    description = 'Error reading file';
                    icon = new vscode.ThemeIcon('warning');
                }
                return new TestTreeItem_1.TestTreeItem(runtime, types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.Collapsed, {
                    sourcePath: `example/${testName}/${runtime}`,
                    testFile: file,
                    fileName: file,
                    isFile: true,
                    description: description
                }, undefined, icon);
            }).sort((a, b) => a.label.localeCompare(b.label));
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
    getTestFilesForRuntime(runtime) {
        const files = fs.readdirSync(this.resultsDir).filter(file => file.startsWith(runtime + '.') && file.endsWith('.json'));
        return files.map(file => {
            const filePath = path.join(this.resultsDir, file);
            try {
                const content = fs.readFileSync(filePath, 'utf-8');
                const result = JSON.parse(content);
                let icon;
                let description = '';
                if (result.status === true || result.failed === false) {
                    icon = new vscode.ThemeIcon('check', new vscode.ThemeColor('testing.iconPassed'));
                    description = 'All tests passed';
                }
                else {
                    icon = new vscode.ThemeIcon('error', new vscode.ThemeColor('testing.iconFailed'));
                    description = `${result.fails || 0} tests failed`;
                }
                return new TestTreeItem_1.TestTreeItem(file, types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.Collapsed, {
                    testFile: file,
                    description: description
                }, undefined, icon);
            }
            catch (error) {
                return new TestTreeItem_1.TestTreeItem(file, types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.None, {
                    testFile: file,
                    description: 'Error reading file'
                }, undefined, new vscode.ThemeIcon('warning'));
            }
        });
    }
    getTestResults(testFile) {
        var _a;
        const filePath = path.join(this.resultsDir, testFile);
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const result = JSON.parse(content);
            const items = [];
            // Add overall status
            const overallPassed = result.status === true || result.failed === false;
            items.push(new TestTreeItem_1.TestTreeItem(`Overall: ${overallPassed ? 'PASSED' : 'FAILED'}`, types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.None, {
                description: `Fails: ${result.fails || 0} | Features: ${((_a = result.features) === null || _a === void 0 ? void 0 : _a.length) || 0}`
            }, undefined, overallPassed ?
                new vscode.ThemeIcon('check', new vscode.ThemeColor('testing.iconPassed')) :
                new vscode.ThemeIcon('error', new vscode.ThemeColor('testing.iconFailed'))));
            // Add features section
            if (result.features && result.features.length > 0) {
                const featuresItem = new TestTreeItem_1.TestTreeItem(`Features (${result.features.length})`, types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.Collapsed, {
                    description: 'All test features'
                }, undefined, new vscode.ThemeIcon('symbol-array'));
                items.push(featuresItem);
            }
            // Add Givens section (test scenarios)
            if (result.givens && result.givens.length > 0) {
                const givensItem = new TestTreeItem_1.TestTreeItem(`Test Scenarios (${result.givens.length})`, types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.Collapsed, {
                    description: 'Given-When-Then test cases'
                }, undefined, new vscode.ThemeIcon('list-tree'));
                items.push(givensItem);
                // Add each given as a child
                for (let i = 0; i < result.givens.length; i++) {
                    const given = result.givens[i];
                    const givenPassed = given.status === true || given.failed === false;
                    const givenItem = new TestTreeItem_1.TestTreeItem(`Scenario ${i + 1}: ${given.key || 'Unnamed'}`, types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.Collapsed, {
                        testFile: testFile,
                        testResultIndex: i,
                        description: givenPassed ? 'PASSED' : 'FAILED'
                    }, undefined, givenPassed ?
                        new vscode.ThemeIcon('check', new vscode.ThemeColor('testing.iconPassed')) :
                        new vscode.ThemeIcon('error', new vscode.ThemeColor('testing.iconFailed')));
                    items.push(givenItem);
                }
            }
            return items;
        }
        catch (error) {
            return [
                new TestTreeItem_1.TestTreeItem('Error reading test results', types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.None, {
                    description: String(error)
                }, undefined, new vscode.ThemeIcon('error'))
            ];
        }
    }
    getTestDetails(testFile, index) {
        const filePath = path.join(this.resultsDir, testFile);
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const result = JSON.parse(content);
            if (!result.givens || index >= result.givens.length) {
                return [
                    new TestTreeItem_1.TestTreeItem('Test scenario not found', types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.None, { description: 'Invalid test scenario index' }, undefined, new vscode.ThemeIcon('warning'))
                ];
            }
            const given = result.givens[index];
            const items = [];
            // Add GIVEN section
            const givenPassed = given.status === true || given.failed === false;
            items.push(new TestTreeItem_1.TestTreeItem(`GIVEN: ${given.key || 'Test Scenario'}`, types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.None, { description: givenPassed ? 'PASSED' : 'FAILED' }, undefined, givenPassed ?
                new vscode.ThemeIcon('check') :
                new vscode.ThemeIcon('error')));
            // Add features for this given
            if (given.features && given.features.length > 0) {
                const featuresItem = new TestTreeItem_1.TestTreeItem(`Features (${given.features.length})`, types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.Collapsed, { description: 'Features tested in this scenario' }, undefined, new vscode.ThemeIcon('symbol-array'));
                items.push(featuresItem);
                for (const feature of given.features) {
                    items.push(new TestTreeItem_1.TestTreeItem(feature, types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.None, { description: 'Feature' }, undefined, new vscode.ThemeIcon('symbol-string')));
                }
            }
            // Add WHEN steps
            if (given.whens && given.whens.length > 0) {
                const whensItem = new TestTreeItem_1.TestTreeItem(`WHEN Steps (${given.whens.length})`, types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.Collapsed, { description: 'Actions performed' }, undefined, new vscode.ThemeIcon('list-ordered'));
                items.push(whensItem);
                for (let i = 0; i < given.whens.length; i++) {
                    const when = given.whens[i];
                    items.push(new TestTreeItem_1.TestTreeItem(`Step ${i + 1}: ${when.name || 'Action'}`, types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.None, {
                        description: when.status || 'No status',
                        tooltip: when.error ? `Error: ${when.error}` : undefined
                    }, undefined, when.error ?
                        new vscode.ThemeIcon('error') :
                        new vscode.ThemeIcon('circle')));
                }
            }
            // Add THEN assertions
            if (given.thens && given.thens.length > 0) {
                const thensItem = new TestTreeItem_1.TestTreeItem(`THEN Assertions (${given.thens.length})`, types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.Collapsed, { description: 'Expected outcomes' }, undefined, new vscode.ThemeIcon('checklist'));
                items.push(thensItem);
                for (let i = 0; i < given.thens.length; i++) {
                    const then = given.thens[i];
                    const assertionPassed = !then.error;
                    items.push(new TestTreeItem_1.TestTreeItem(`Assertion ${i + 1}: ${then.name || 'Check'}`, types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.None, {
                        description: assertionPassed ? 'PASSED' : 'FAILED',
                        tooltip: then.error ? `Error: ${then.error}` : undefined
                    }, undefined, assertionPassed ?
                        new vscode.ThemeIcon('check') :
                        new vscode.ThemeIcon('error')));
                }
            }
            // Add error if present
            if (given.error) {
                items.push(new TestTreeItem_1.TestTreeItem('Error Details', types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.None, { description: given.error }, undefined, new vscode.ThemeIcon('warning')));
            }
            return items;
        }
        catch (error) {
            return [
                new TestTreeItem_1.TestTreeItem('Error reading test details', types_1.TreeItemType.File, vscode.TreeItemCollapsibleState.None, { description: String(error) }, undefined, new vscode.ThemeIcon('error'))
            ];
        }
    }
}
exports.FeaturesTreeDataProvider = FeaturesTreeDataProvider;
