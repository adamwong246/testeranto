import * as vscode from 'vscode';
import { TestTreeItem } from '../TestTreeItem';
export declare class FileTreeDataProvider implements vscode.TreeDataProvider<TestTreeItem> {
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<TestTreeItem | undefined | null | void>;
    refresh(): void;
    getTreeItem(element: TestTreeItem): vscode.TreeItem;
    getChildren(element?: TestTreeItem): Thenable<TestTreeItem[]>;
    private getRootItems;
    private getDirectoryItems;
    private buildFileTree;
    private buildTreeItems;
}
