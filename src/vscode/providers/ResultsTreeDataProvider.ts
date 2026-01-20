import * as vscode from 'vscode';
import { TestTreeItem } from '../TestTreeItem';
import { TreeItemType, TreeItemData } from '../types';

export class ResultsTreeDataProvider implements vscode.TreeDataProvider<TestTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<TestTreeItem | undefined | null | void> = new
    vscode.EventEmitter<TestTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<TestTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TestTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: TestTreeItem): Thenable<TestTreeItem[]> {
    if (!element) {
      return Promise.resolve(this.getResultItems());
    }
    return Promise.resolve([]);
  }

  private getResultItems(): TestTreeItem[] {
    const results = [
      {
        label: "Calculator.test.ts - ✓ Passed",
        test: "Calculator.test.ts",
        status: "passed",
        icon: new vscode.ThemeIcon("check", new vscode.ThemeColor("testing.iconPassed"))
      },
      {
        label: "Calculator.pitono.test.py - ⏳ Running",
        test: "Calculator.pitono.test.py",
        status: "running",
        icon: new vscode.ThemeIcon("sync", new vscode.ThemeColor("testing.iconQueued"))
      },
      {
        label: "Calculator.golingvu.test.go - ✗ Failed",
        test: "Calculator.golingvu.test.go",
        status: "failed",
        icon: new vscode.ThemeIcon("error", new vscode.ThemeColor("testing.iconFailed"))
      },
      {
        label: "Calculator.test.ts (web) - ✓ Passed",
        test: "Calculator.test.ts (web)",
        status: "passed",
        icon: new vscode.ThemeIcon("check", new vscode.ThemeColor("testing.iconPassed"))
      }
    ];

    return results.map(result =>
      new TestTreeItem(
        result.label,
        TreeItemType.Test,
        vscode.TreeItemCollapsibleState.None,
        { test: result.test, status: result.status },
        undefined,
        result.icon
      )
    );
  }
}