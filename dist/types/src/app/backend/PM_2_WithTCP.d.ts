import { WebSocketMessage } from "../../PM/types.js";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import { PM_1_WithProcesses } from "./PM_1_WithProcesses.js";
export declare abstract class PM_2_WithTCP extends PM_1_WithProcesses {
    protected wss: WebSocketServer;
    protected httpServer: http.Server;
    constructor(configs: any, name: string, mode: string);
    protected websocket(data: any, ws: WebSocket): void;
    handleHttpRequest(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage> & {
        req: http.IncomingMessage;
    }): void;
    writeFile_send(wsm: WebSocketMessage, ws: WebSocket): void;
    writeFile_receive(wsm: WebSocketMessage, ws: WebSocket): void;
    readFile_receive(wsm: WebSocketMessage, ws: WebSocket): void;
    readFile_send(wsm: WebSocketMessage, ws: WebSocket, content: string): void;
    createDirectory_receive(wsm: WebSocketMessage, ws: WebSocket): void;
    createDirectory_send(wsm: WebSocketMessage, ws: WebSocket): void;
    deleteFile_receive(wsm: WebSocketMessage, ws: WebSocket): void;
    deleteFile_send(wsm: WebSocketMessage, ws: WebSocket): void;
    files_receive(wsm: WebSocketMessage, ws: WebSocket): Promise<void>;
    files_send(wsm: WebSocketMessage, ws: WebSocket, files: string[]): void;
    projects_receive(wsm: WebSocketMessage, ws: WebSocket): void;
    projects_send(wsm: WebSocketMessage, ws: WebSocket, projects: object): void;
    report_receive(wsm: WebSocketMessage, ws: WebSocket): void;
    report_send(wsm: WebSocketMessage, ws: WebSocket): Promise<void>;
    test_receive(wsm: WebSocketMessage, ws: WebSocket): Promise<void>;
    test_send(wsm: WebSocketMessage, ws: WebSocket, project: string[]): void;
}
