import * as vscode from 'vscode';
import { TestTreeItem } from '../TestTreeItem';
import { TreeItemType, TreeItemData } from '../types';
import { IRunTime } from '../../Types';

interface TreeNode {
  name: string;
  children: Map<string, TreeNode>;
  fullPath: string;
  isFile: boolean;
}

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
      return this.getFileTreeItems(runtime, testName);
    } else if (element.type === TreeItemType.File) {
      // Handle expanding directories
      const { runtime, testName, path } = element.data || {};
      if (path && !element.data?.fileName?.endsWith('.')) { // Check if it's a directory
        return this.getDirectoryItems(runtime, testName, path);
      }
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

  private async getFileItems(runtime: IRunTime, testName: string): Promise<TestTreeItem[]> {
    console.log("getFileItems");
    if (!runtime || !testName) {
      return [];
    }

    // Determine which JSON file to read based on runtime and testName
    let jsonFilePath: string;
    switch (runtime) {
      case "golang":
        jsonFilePath = "testeranto/bundles/allTests/golang/example/Calculator.test.go-inputFiles.json";
        break;
      case "python":
        jsonFilePath = "testeranto/bundles/allTests/python/example/Calculator.test.py-inputFiles.json";
        break;
      case "node":
        jsonFilePath = "testeranto/bundles/allTests/node/example/Calculator.test.mjs-inputFiles.json";
        break;
      case "web":
        jsonFilePath = "testeranto/bundles/allTests/web/example/Calculator.test.mjs-inputFiles.json";
        break;
      default:
        return [];
    }

    try {
      // Get the workspace root
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders || workspaceFolders.length === 0) {
        throw new Error("No workspace folder open");
      }
      const workspaceRoot = workspaceFolders[0].uri;
      
      // Build the full URI to the JSON file
      const jsonFileUri = vscode.Uri.joinPath(workspaceRoot, jsonFilePath);
      console.log(`Reading JSON from: ${jsonFileUri.fsPath}`);
      
      // Read the JSON file
      const fileContent = await vscode.workspace.fs.readFile(jsonFileUri);
      const files: string[] = JSON.parse(Buffer.from(fileContent).toString('utf-8'));
      console.log(`Found ${files.length} files in JSON`);

      // Build a tree structure
      const treeRoot: TreeNode = { name: '', children: new Map(), fullPath: '', isFile: false };
      
      for (const rawFileName of files) {
        // Remove leading '/' if present to make paths relative to workspace root
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

      // Convert tree to TestTreeItems
      return this.buildTreeItems(treeRoot, runtime, testName, workspaceRoot);
    } catch (error) {
      console.error(`Failed to read file list from ${jsonFilePath}:`, error);
      vscode.window.showErrorMessage(`Could not load file list for ${testName}: ${error}`);
      // Return empty array to prevent tree view from crashing
      return [];
    }
  }

  private async getFileTreeItems(runtime: IRunTime, testName: string): Promise<TestTreeItem[]> {
    const tree = await this.buildFileTree(runtime, testName);
    if (!tree) {
      return [];
    }
    return this.buildTreeItems(tree, runtime, testName);
  }

  private async buildFileTree(runtime: IRunTime, testName: string): Promise<TreeNode | null> {
    // Determine which JSON file to read based on runtime and testName
    let jsonFilePath: string;
    switch (runtime) {
      case "golang":
        jsonFilePath = "testeranto/bundles/allTests/golang/example/Calculator.test.go-inputFiles.json";
        break;
      case "python":
        jsonFilePath = "testeranto/bundles/allTests/python/example/Calculator.test.py-inputFiles.json";
        break;
      case "node":
        jsonFilePath = "testeranto/bundles/allTests/node/example/Calculator.test.mjs-inputFiles.json";
        break;
      case "web":
        jsonFilePath = "testeranto/bundles/allTests/web/example/Calculator.test.mjs-inputFiles.json";
        break;
      default:
        return null;
    }

    try {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders || workspaceFolders.length === 0) {
        throw new Error("No workspace folder open");
      }
      const workspaceRoot = workspaceFolders[0].uri;
      
      const jsonFileUri = vscode.Uri.joinPath(workspaceRoot, jsonFilePath);
      const fileContent = await vscode.workspace.fs.readFile(jsonFileUri);
      const files: string[] = JSON.parse(Buffer.from(fileContent).toString('utf-8'));

      const treeRoot: TreeNode = { name: '', children: new Map(), fullPath: '', isFile: false };
      
      for (const rawFileName of files) {
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
    } catch (error) {
      console.error(`Failed to build file tree:`, error);
      return null;
    }
  }

  private buildTreeItems(
    node: TreeNode, 
    runtime: IRunTime, 
    testName: string
  ): TestTreeItem[] {
    const items: TestTreeItem[] = [];
    
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
          runtime, 
          testName, 
          fileName: child.fullPath,
          path: child.fullPath 
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

  private async getDirectoryItems(runtime: IRunTime, testName: string, path: string): Promise<TestTreeItem[]> {
    const tree = await this.buildFileTree(runtime, testName);
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
    
    return this.buildTreeItems(currentNode, runtime, testName);
  }
}
