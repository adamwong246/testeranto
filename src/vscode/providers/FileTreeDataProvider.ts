import * as vscode from 'vscode';
import { TestTreeItem } from '../TestTreeItem';
import { TreeItemType, TreeItemData } from '../types';

interface TreeNode {
  name: string;
  children: Map<string, TreeNode>;
  fullPath: string;
  isFile: boolean;
}

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
      return this.getRootItems();
    } else {
      const path = element.data?.path;
      return this.getDirectoryItems(path);
    }
  }

  private async getRootItems(): Promise<TestTreeItem[]> {
    const tree = await this.buildFileTree();
    if (!tree) {
      return [];
    }
    return this.buildTreeItems(tree);
  }

  private async getDirectoryItems(path?: string): Promise<TestTreeItem[]> {
    if (!path) {
      return [];
    }
    const tree = await this.buildFileTree();
    if (!tree) {
      return [];
    }

    // Find the node corresponding to the path
    const parts = path.split('/').filter(p => p.length > 0);
    let currentNode = tree;
    for (const part of parts) {
      if (currentNode.children.has(part)) {
        currentNode = currentNode.children.get(part)!;
      } else {
        return [];
      }
    }

    return this.buildTreeItems(currentNode);
  }

  private async buildFileTree(): Promise<TreeNode | null> {
    const jsonFilePaths = [
      "testeranto/bundles/allTests/golang/example/Calculator.test.go-inputFiles.json",
      "testeranto/bundles/allTests/node/example/Calculator.test.mjs-inputFiles.json",
      "testeranto/bundles/allTests/web/example/Calculator.test.mjs-inputFiles.json",
      "testeranto/bundles/allTests/python/example/Calculator.test.py-inputFiles.json",
      "testeranto/bundles/allTests/ruby/example/Calculator.test.rb-inputFiles.json"
    ];

    const allFiles: Set<string> = new Set();
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      console.error("No workspace folder open");
      return null;
    }
    const workspaceRoot = workspaceFolders[0].uri;

    // Add files from JSON input files
    for (const jsonFilePath of jsonFilePaths) {
      try {
        const jsonFileUri = vscode.Uri.joinPath(workspaceRoot, jsonFilePath);
        const fileContent = await vscode.workspace.fs.readFile(jsonFileUri);
        const files: string[] = JSON.parse(Buffer.from(fileContent).toString('utf-8'));
        files.forEach(file => allFiles.add(file));
      } catch (error) {
        console.error(`Failed to read JSON file ${jsonFilePath}:`, error);
        // Continue with other files
      }
    }

    // Add report files from testeranto/reports/allTests/example/
    try {
      const reportsDir = vscode.Uri.joinPath(workspaceRoot, "testeranto/reports/allTests/example");
      // Check if directory exists
      try {
        await vscode.workspace.fs.stat(reportsDir);

        // Read directory contents
        const entries = await vscode.workspace.fs.readDirectory(reportsDir);

        for (const [name, type] of entries) {
          if (type === vscode.FileType.File && name.endsWith('.json')) {
            // Add the report file path
            const reportFilePath = `testeranto/reports/allTests/example/${name}`;
            allFiles.add(reportFilePath);
          }
        }
      } catch (error) {
        console.log(`Reports directory doesn't exist or can't be read: ${reportsDir.fsPath}`);
      }
    } catch (error) {
      console.error(`Failed to scan reports directory:`, error);
    }

    // Build tree structure
    const treeRoot: TreeNode = { name: '', children: new Map(), fullPath: '', isFile: false };

    for (const rawFileName of Array.from(allFiles)) {
      // Remove leading '/' if present
      const fileName = rawFileName.startsWith('/') ? rawFileName.substring(1) : rawFileName;
      const parts = fileName.split('/');
      let currentNode = treeRoot;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLast = i === parts.length - 1;

        if (!currentNode.children.has(part)) {
          currentNode.children.set(part, {
            name: part,
            children: new Map(),
            fullPath: parts.slice(0, i + 1).join('/'),
            isFile: isLast
          });
        }
        currentNode = currentNode.children.get(part)!;
      }
    }

    return treeRoot;
  }

  private buildTreeItems(node: TreeNode): TestTreeItem[] {
    const items: TestTreeItem[] = [];

    // Sort children: directories first, then files, alphabetically
    const sortedChildren = Array.from(node.children.values()).sort((a, b) => {
      if (a.isFile && !b.isFile) return 1;
      if (!a.isFile && b.isFile) return -1;
      return a.name.localeCompare(b.name);
    });

    for (const child of sortedChildren) {
      const collapsibleState = child.isFile
        ? vscode.TreeItemCollapsibleState.None
        : vscode.TreeItemCollapsibleState.Collapsed;

      const treeItem = new TestTreeItem(
        child.name,
        TreeItemType.File,
        collapsibleState,
        {
          path: child.fullPath,
          fileName: child.fullPath
        },
        child.isFile ? {
          command: "vscode.open",
          title: "Open File",
          arguments: [vscode.Uri.file(child.fullPath)]
        } : undefined,
        child.isFile ? new vscode.ThemeIcon("file") : new vscode.ThemeIcon("folder")
      );

      items.push(treeItem);
    }

    return items;
  }
}
