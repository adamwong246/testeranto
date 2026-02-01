import * as vscode from 'vscode';
import { TestTreeItem } from '../TestTreeItem';
export declare class FeaturesTreeDataProvider implements vscode.TreeDataProvider<TestTreeItem> {
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<TestTreeItem | undefined | null | void>;
    private resultsDir;
    constructor();
    refresh(): void;
    getTreeItem(element: TestTreeItem): vscode.TreeItem;
    getChildren(element?: TestTreeItem): Thenable<TestTreeItem[]>;
    private getSourceStructure;
    private buildSourceTreeItems;
    private getSourceChildren;
    private getTestFilesForRuntime;
    private getTestResults;
    private getTestDetails;
}
