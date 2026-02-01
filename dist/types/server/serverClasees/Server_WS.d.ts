import { WebSocket, WebSocketServer } from "ws";
import { WsManager } from "../serverManagers/WsManager";
import { IMode } from "../types";
import { Server_HTTP } from "./Server_HTTP";
import { ITestconfigV2 } from "../../Types";
export declare class Server_WS extends Server_HTTP {
    protected ws: WebSocketServer;
    protected wsClients: Set<WebSocket>;
    wsManager: WsManager;
    constructor(configs: ITestconfigV2, mode: IMode);
    start(): Promise<void>;
    stop(): Promise<void>;
    escapeXml(unsafe: string): string;
    attachWebSocketToHttpServer(httpServer: any): void;
    broadcast(message: any): void;
    private setupWebSocketHandlers;
    private handleWebSocketMessage;
    private handleSourceFilesUpdatedSideEffects;
    private handleGetBuildListenerStateSideEffects;
    private handleGetBuildEventsSideEffects;
    private handleGetProcesses;
    protected getProcessSummary?(): any;
}
