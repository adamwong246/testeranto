import { ChildProcess } from "node:child_process";
import http from "http";
import { WebSocketServer } from "ws";
import { PM_Base } from "./base.js";
export declare abstract class PM_WithWebSocket extends PM_Base {
    wss: WebSocketServer;
    clients: Set<any>;
    httpServer: http.Server;
    runningProcesses: Map<string, ChildProcess | Promise<any>>;
    allProcesses: Map<string, {
        child?: ChildProcess;
        promise?: Promise<any>;
        status: "running" | "exited" | "error" | "completed";
        exitCode?: number;
        error?: string;
        command: string;
        pid?: number;
        timestamp: string;
        type: "process" | "promise";
    }>;
    processLogs: Map<string, string[]>;
    constructor(configs: any);
    requestHandler(req: http.IncomingMessage, res: http.ServerResponse): void;
    findIndexHtml(): string | null;
    addPromiseProcess(processId: string, promise: Promise<any>, command: string, onResolve?: (result: any) => void, onReject?: (error: any) => void): string;
    broadcast(message: any): void;
}
