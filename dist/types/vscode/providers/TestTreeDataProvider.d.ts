import * as vscode from 'vscode';
import { TestTreeItem } from '../TestTreeItem';
export declare class TestTreeDataProvider implements vscode.TreeDataProvider<TestTreeItem> {
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<TestTreeItem | undefined | null | void>;
    refresh(): void;
    getTreeItem(element: TestTreeItem): vscode.TreeItem;
    getChildren(element?: TestTreeItem): Thenable<TestTreeItem[]>;
    private getRuntimeItems;
    private getTestItems;
    private getFileItems;
    private getFileTreeItems;
    private buildFileTree;
    private buildTreeItems;
    private getDirectoryItems;
}
