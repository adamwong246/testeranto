import net from "net";
import { ITLog, ITTestResourceConfiguration } from "../lib";
import { PM_sidecar } from "./sidecar";
import { PassThrough } from "stream";
export declare class PM_Node_Sidecar extends PM_sidecar {
    testResourceConfiguration: ITTestResourceConfiguration;
    client: net.Socket;
    constructor(t: ITTestResourceConfiguration);
    start(stopper: () => any): Promise<void>;
    stop(): Promise<void>;
    testArtiFactoryfileWriter(tLog: ITLog, callback: (p: Promise<void>) => void): (fPath: string, value: string | Buffer | PassThrough) => void;
    send<I>(command: string, ...argz: any[]): Promise<I>;
}
