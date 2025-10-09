import { ChildProcess } from "child_process";
import http from "http";
import { RawData, WebSocketServer } from "ws";
import { IBuiltConfig } from "../../Types.js";
import { FileService } from "../FileService.js";
import { PM_Base } from "./PM_0.js";
export declare abstract class PM_WithTCP extends PM_Base implements FileService {
    wss: WebSocketServer;
    httpServer: http.Server;
    clients: Set<any>;
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
        category: "aider" | "bdd-test" | "build-time" | "other";
        testName?: string;
        platform?: "node" | "web" | "pure" | "python" | "golang";
    }>;
    processLogs: Map<string, string[]>;
    constructor(configs: IBuiltConfig, name: any, mode: any);
    websocket(data: RawData, ws: any): void;
    webSocketBroadcastMessage(message: any): void;
    handleHttpRequest(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage> & {
        req: http.IncomingMessage;
    }): void;
    writeFile(path: string, content: string): Promise<void>;
    readFile(path: string): Promise<string>;
    createDirectory(path: string): Promise<void>;
    deleteFile(path: string): Promise<void>;
    files(path: string): Promise<object>;
    projects(project: string): Promise<string[]>;
    tests(project: string): Promise<string[]>;
    report(project: string, test: string): Promise<object>;
}
