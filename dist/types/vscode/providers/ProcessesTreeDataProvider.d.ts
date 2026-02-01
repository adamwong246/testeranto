import * as vscode from 'vscode';
import { TestTreeItem } from '../TestTreeItem';
export declare class ProcessesTreeDataProvider implements vscode.TreeDataProvider<TestTreeItem> {
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<TestTreeItem | undefined | null | void>;
    private processes;
    private refreshInterval;
    private ws;
    private isConnected;
    private connectionAttempts;
    private maxConnectionAttempts;
    constructor();
    refresh(): void;
    getTreeItem(element: TestTreeItem): vscode.TreeItem;
    getChildren(element?: TestTreeItem): Thenable<TestTreeItem[]>;
    private getProcessItems;
    connectWebSocket(): void;
    private handleWebSocketMessage;
    private requestProcesses;
    private fetchProcesses;
    private startRefreshing;
    dispose(): void;
}
