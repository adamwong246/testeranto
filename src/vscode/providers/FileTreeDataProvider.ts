import * as vscode from 'vscode';
import { TestTreeItem } from '../TestTreeItem';
import { TreeItemType, TreeItemData } from '../types';

export class FileTreeDataProvider implements vscode.TreeDataProvider<TestTreeItem> {
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
      return Promise.resolve(this.getRootItems());
    } else {
      const path = element.data?.path;
      return Promise.resolve(this.getDirectoryItems(path));
    }
  }

  private getRootItems(): TestTreeItem[] {
    const directories = [
      { label: "example", path: "example" },
      { label: "src", path: "src" },
      { label: "testeranto", path: "testeranto" }
    ];

    return directories.map(({ label, path }) =>
      new TestTreeItem(
        label,
        TreeItemType.File,
        vscode.TreeItemCollapsibleState.Collapsed,
        { path }
      )
    );
  }

  private getDirectoryItems(path?: string): TestTreeItem[] {
    if (!path) {
      return [];
    }

    // Placeholder implementation
    return [
      new TestTreeItem(
        `${path}/file1.txt`,
        TreeItemType.File,
        vscode.TreeItemCollapsibleState.None,
        { path: `${path}/file1.txt` },
        {
          command: "vscode.open",
          title: "Open File",
          arguments: [vscode.Uri.file(`${path}/file1.txt`)]
        }
      ),
      new TestTreeItem(
        `${path}/file2.js`,
        TreeItemType.File,
        vscode.TreeItemCollapsibleState.None,
        { path: `${path}/file2.js` },
        {
          command: "vscode.open",
          title: "Open File",
          arguments: [vscode.Uri.file(`${path}/file2.js`)]
        }
      )
    ];
  }
}