import { ChildProcess } from "node:child_process";
import http from "http";
import { WebSocketServer } from "ws";
import { PM_WithEslintAndTsc } from "./PM_WithEslintAndTsc.js";
export declare abstract class PM_WithWebSocket extends PM_WithEslintAndTsc {
    wss: WebSocketServer;
    clients: Set<any>;
    httpServer: http.Server;
    runningProcesses: Map<string, ChildProcess>;
    allProcesses: Map<string, {
        child?: ChildProcess;
        status: "running" | "exited" | "error";
        exitCode?: number;
        error?: string;
        command: string;
        pid?: number;
        timestamp: string;
    }>;
    processLogs: Map<string, string[]>;
    constructor(configs: any, name: string, mode: "once" | "dev");
    requestHandler(req: http.IncomingMessage, res: http.ServerResponse): void;
    findIndexHtml(): string | null;
    broadcast(message: any): void;
}
