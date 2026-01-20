import * as vscode from 'vscode';
import { TreeItemType, TreeItemData } from './types';

export class TestTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly type: TreeItemType,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly data?: TreeItemData,
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