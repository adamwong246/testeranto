import * as vscode from 'vscode';
import { TreeItemType } from './types';
export class TestTreeItem extends vscode.TreeItem {
    constructor(label, type, collapsibleState, data, command, iconPath) {
        super(label, collapsibleState);
        this.label = label;
        this.type = type;
        this.collapsibleState = collapsibleState;
        this.data = data;
        this.command = command;
        this.iconPath = iconPath;
        this.tooltip = `${this.label}`;
        this.iconPath = iconPath || this.getDefaultIcon();
        this.contextValue = this.getContextValue();
    }
    getDefaultIcon() {
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
    getContextValue() {
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
