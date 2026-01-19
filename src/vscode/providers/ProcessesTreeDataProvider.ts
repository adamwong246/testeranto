import * as vscode from 'vscode';
import { TestTreeItem } from '../TestTreeItem';
import { TreeItemType, TreeItemData } from '../types';

export class ProcessesTreeDataProvider implements vscode.TreeDataProvider<TestTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<TestTreeItem | undefined | null | void> = new
    vscode.EventEmitter<TestTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<TestTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  private processes: any[] = [];
  private refreshInterval: NodeJS.Timeout | null = null;
  private ws: any = null;
  private isConnected: boolean = false;
  private connectionAttempts: number = 0;
  private maxConnectionAttempts: number = 5;

  constructor() {
    // Start WebSocket connection
    this.connectWebSocket();
    // Start periodic refresh
    this.startRefreshing();
  }

  refresh(): void {
    // Trigger a fresh fetch from the WebSocket server
    this.fetchProcesses();
    // Also fire the event to update the view
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TestTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: TestTreeItem): Thenable<TestTreeItem[]> {
    if (!element) {
      return Promise.resolve(this.getProcessItems());
    }
    return Promise.resolve([]);
  }

  private getProcessItems(): TestTreeItem[] {
    // If not connected, show connection status with retry option
    if (!this.isConnected) {
      const items: TestTreeItem[] = [];
      
      // Check if we've exceeded max connection attempts
      if (this.connectionAttempts >= this.maxConnectionAttempts) {
        items.push(
          new TestTreeItem(
            "❌ Failed to connect to Docker process server",
            TreeItemType.File,
            vscode.TreeItemCollapsibleState.None,
            { 
              description: "Make sure the Testeranto server is running on port 3456",
              connectionFailed: true
            },
            {
              command: "testeranto.retryConnection",
              title: "Retry Connection",
              arguments: [this]
            },
            new vscode.ThemeIcon("error", new vscode.ThemeColor("testing.iconFailed"))
          )
        );
        
        // Add a retry button
        items.push(
          new TestTreeItem(
            "Click to retry connection",
            TreeItemType.File,
            vscode.TreeItemCollapsibleState.None,
            { 
              description: "Or run the Testeranto server first",
              retry: true
            },
            {
              command: "testeranto.retryConnection",
              title: "Retry Connection",
              arguments: [this]
            },
            new vscode.ThemeIcon("refresh", new vscode.ThemeColor("testing.iconQueued"))
          )
        );
        
        // Show how to start the server
        items.push(
          new TestTreeItem(
            "To start the server, run:",
            TreeItemType.File,
            vscode.TreeItemCollapsibleState.None,
            { 
              description: "npm start in the project root",
              info: true
            },
            undefined,
            new vscode.ThemeIcon("info", new vscode.ThemeColor("testing.iconUnset"))
          )
        );
      } else {
        items.push(
          new TestTreeItem(
            "Connecting to Docker process server...",
            TreeItemType.File,
            vscode.TreeItemCollapsibleState.None,
            { 
              description: `Attempt ${this.connectionAttempts + 1}/${this.maxConnectionAttempts} to WebSocket server on port 3456`,
              connecting: true
            },
            undefined,
            new vscode.ThemeIcon("sync", new vscode.ThemeColor("testing.iconQueued"))
          )
        );
        
        // Add a manual refresh option
        items.push(
          new TestTreeItem(
            "Click to manually refresh",
            TreeItemType.File,
            vscode.TreeItemCollapsibleState.None,
            { 
              description: "Try to reconnect immediately",
              manualRefresh: true
            },
            {
              command: "testeranto.refresh",
              title: "Refresh",
              arguments: []
            },
            new vscode.ThemeIcon("refresh", new vscode.ThemeColor("testing.iconQueued"))
          )
        );
      }
      return items;
    }

    // Connected but no processes
    if (this.processes.length === 0) {
      return [
        new TestTreeItem(
          "No Docker processes found",
          TreeItemType.File,
          vscode.TreeItemCollapsibleState.None,
          { 
            description: "Waiting for Docker containers to start",
            noProcesses: true
          },
          undefined,
          new vscode.ThemeIcon("info", new vscode.ThemeColor("testing.iconUnset"))
        ),
        new TestTreeItem(
          "Click to refresh",
          TreeItemType.File,
          vscode.TreeItemCollapsibleState.None,
          { 
            description: "Check for new Docker containers",
            refresh: true
          },
          {
            command: "testeranto.refresh",
            title: "Refresh",
            arguments: []
          },
          new vscode.ThemeIcon("refresh", new vscode.ThemeColor("testing.iconQueued"))
        )
      ];
    }

    // Show connected status and processes
    const items: TestTreeItem[] = [
      new TestTreeItem(
        `✅ Connected to Docker process server`,
        TreeItemType.File,
        vscode.TreeItemCollapsibleState.None,
        { 
          description: `Found ${this.processes.length} container(s)`,
          connected: true
        },
        undefined,
        new vscode.ThemeIcon("check", new vscode.ThemeColor("testing.iconPassed"))
      ),
      new TestTreeItem(
        "Click to refresh",
        TreeItemType.File,
        vscode.TreeItemCollapsibleState.None,
        { 
          description: "Update Docker container list",
          refresh: true
        },
        {
          command: "testeranto.refresh",
          title: "Refresh",
          arguments: []
        },
        new vscode.ThemeIcon("refresh", new vscode.ThemeColor("testing.iconQueued"))
      )
    ];

    // Add all processes
    items.push(...this.processes.map(process => {
      let icon: vscode.ThemeIcon;
      
      const status = process.status || '';
      if (status.toLowerCase().includes('up') || status.toLowerCase().includes('running')) {
        icon = new vscode.ThemeIcon("check", new vscode.ThemeColor("testing.iconPassed"));
      } else if (status.toLowerCase().includes('exited') || status.toLowerCase().includes('stopped')) {
        icon = new vscode.ThemeIcon("error", new vscode.ThemeColor("testing.iconFailed"));
      } else {
        icon = new vscode.ThemeIcon("circle-outline", new vscode.ThemeColor("testing.iconUnset"));
      }

      const label = `${process.processId || process.name || 'Unknown'} - ${status || 'unknown'}`;
      const description = process.command || process.image || 'No command';
      
      return new TestTreeItem(
        label,
        TreeItemType.File,
        vscode.TreeItemCollapsibleState.None,
        { 
          description: description,
          status: status,
          processId: process.processId,
          runtime: process.runtime,
          ports: process.ports
        },
        undefined,
        icon
      );
    }));

    return items;
  }

  public connectWebSocket(): void {
    if (this.connectionAttempts >= this.maxConnectionAttempts) {
      console.error('Max WebSocket connection attempts reached');
      return;
    }

    this.connectionAttempts++;
    
    try {
      // Use the ws library for Node.js environment
      const WS = require('ws');
      // The WebSocket server runs on port 3456
      this.ws = new WS('ws://localhost:3456/ws');
      
      this.ws.on('open', () => {
        console.log('WebSocket connected to process server');
        this.isConnected = true;
        this.connectionAttempts = 0;
        // Request initial processes
        this.requestProcesses();
      });
      
      this.ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleWebSocketMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });
      
      this.ws.on('error', (error: any) => {
        console.error('WebSocket error:', error);
        this.isConnected = false;
      });
      
      this.ws.on('close', () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          this.connectWebSocket();
        }, 5000);
      });
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.isConnected = false;
    }
  }

  private handleWebSocketMessage(message: any): void {
    if (message.type === 'processes') {
      if (message.data && message.data.processes) {
        this.processes = message.data.processes;
        this._onDidChangeTreeData.fire();
      }
    } else if (message.type === 'connected') {
      console.log('Connected to process server:', message.message);
      this.isConnected = true;
      // Request processes after connection
      this.requestProcesses();
    }
  }

  private requestProcesses(): void {
    if (this.ws && this.ws.readyState === 1) { // 1 = OPEN
      this.ws.send(JSON.stringify({
        type: 'getProcesses'
      }));
    } else {
      console.warn('WebSocket not ready, cannot request processes');
    }
  }

  private async fetchProcesses(): Promise<void> {
    if (this.isConnected) {
      this.requestProcesses();
    } else {
      // Try to reconnect if not connected
      this.connectWebSocket();
    }
  }

  private startRefreshing(): void {
    // Fetch immediately
    this.fetchProcesses();
    
    // Set up periodic refresh every 10 seconds
    this.refreshInterval = setInterval(() => {
      this.fetchProcesses();
    }, 10000);
  }

  public dispose(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
