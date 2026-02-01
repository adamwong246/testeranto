import * as vscode from 'vscode';
import { TestTreeItem } from '../TestTreeItem';
export declare class ResultsTreeDataProvider implements vscode.TreeDataProvider<TestTreeItem> {
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<TestTreeItem | undefined | null | void>;
    refresh(): void;
    getTreeItem(element: TestTreeItem): vscode.TreeItem;
    getChildren(element?: TestTreeItem): Thenable<TestTreeItem[]>;
    private getResultItems;
}
