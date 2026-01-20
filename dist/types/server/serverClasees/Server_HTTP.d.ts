import http from "http";
import { IMode } from "../types";
import { HttpManager } from "../serverManagers/HttpManager";
import { Server_Base } from "./Server_Base";
import { ITestconfigV2 } from "../../Types";
export declare abstract class Server_HTTP extends Server_Base {
    http: HttpManager;
    protected httpServer: http.Server;
    routes: any;
    constructor(configs: ITestconfigV2, mode: IMode);
    start(): Promise<void>;
    stop(): Promise<void>;
    protected handleHttpRequest(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage> & {
        req: http.IncomingMessage;
    }): void;
    private handleRouteRequest;
    private serveStaticFile;
    private serveFile;
    router(a: any): any;
}
