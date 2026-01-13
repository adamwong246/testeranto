import * as vscode from 'vscode';
import { TestTreeItem } from '../TestTreeItem';
import { TreeItemType, TreeItemData } from '../types';

export class TestTreeDataProvider implements vscode.TreeDataProvider<TestTreeItem> {
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
      return Promise.resolve(this.getRuntimeItems());
    } else if (element.type === TreeItemType.Runtime) {
      const runtime = element.data?.runtime;
      return Promise.resolve(this.getTestItems(runtime));
    } else if (element.type === TreeItemType.Test) {
      const { runtime, testName } = element.data || {};
      return Promise.resolve(this.getFileItems(runtime, testName));
    }
    return Promise.resolve([]);
  }

  private getRuntimeItems(): TestTreeItem[] {
    const runtimes = [
      { label: "Node", runtime: "node" },
      { label: "Web", runtime: "web" },
      { label: "Python", runtime: "python" },
      { label: "Golang", runtime: "golang" }
    ];

    return runtimes.map(({ label, runtime }) =>
      new TestTreeItem(
        label,
        TreeItemType.Runtime,
        vscode.TreeItemCollapsibleState.Collapsed,
        { runtime }
      )
    );
  }

  private getTestItems(runtime?: string): TestTreeItem[] {
    if (!runtime) {
      return [];
    }

    let testNames: string[] = [];
    switch (runtime) {
      case "node":
      case "web":
        testNames = ["Calculator.test.ts"];
        break;
      case "python":
        testNames = ["Calculator.pitono.test.py"];
        break;
      case "golang":
        testNames = ["Calculator.golingvu.test.go"];
        break;
      default:
        testNames = [];
    }

    return testNames.map(testName =>
      new TestTreeItem(
        testName,
        TreeItemType.Test,
        vscode.TreeItemCollapsibleState.Collapsed,
        { runtime, testName }
      )
    );
  }

  private getFileItems(runtime?: string, testName?: string): TestTreeItem[] {
    if (!runtime || !testName) {
      return [];
    }

    let files: string[] = [];
    switch (runtime) {
      case "node":
      case "web":
        files = [
          "example/Calculator.ts",
          `example/${testName}`,
          "example/tsconfig.json"
        ];
        break;
      case "python":
        files = [
          "example/Calculator.py",
          `example/${testName}`,
          "example/requirements.txt"
        ];
        break;
      case "golang":
        files = [
          "example/Calculator.go",
          `example/${testName}`,
          "example/go.mod"
        ];
        break;
    }

    return files.map(fileName =>
      new TestTreeItem(
        fileName,
        TreeItemType.File,
        vscode.TreeItemCollapsibleState.None,
        { runtime, testName, fileName },
        {
          command: "vscode.open",
          title: "Open File",
          arguments: [vscode.Uri.file(fileName)]
        }
      )
    );
  }
}