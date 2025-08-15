import net from "net";
import { ITTestResourceConfiguration } from "../lib";
import { PM_sidecar } from "./sidecar";
export declare class PM_Pure_Sidecar extends PM_sidecar {
    testResourceConfiguration: ITTestResourceConfiguration;
    client: net.Socket;
    constructor(t: ITTestResourceConfiguration);
    start(): Promise<void>;
    stop(): Promise<void>;
    send<I>(command: string, ...argz: any[]): Promise<I>;
}
