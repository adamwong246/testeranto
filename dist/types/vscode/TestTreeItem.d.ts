import * as vscode from 'vscode';
import { TreeItemType, TreeItemData } from './types';
export declare class TestTreeItem extends vscode.TreeItem {
    readonly label: string;
    readonly type: TreeItemType;
    readonly collapsibleState: vscode.TreeItemCollapsibleState;
    readonly data?: TreeItemData | undefined;
    readonly command?: vscode.Command | undefined;
    readonly iconPath?: vscode.ThemeIcon | undefined;
    constructor(label: string, type: TreeItemType, collapsibleState: vscode.TreeItemCollapsibleState, data?: TreeItemData | undefined, command?: vscode.Command | undefined, iconPath?: vscode.ThemeIcon | undefined);
    private getDefaultIcon;
    private getContextValue;
}
