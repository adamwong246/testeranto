import net from "net";
import { ITTestResourceConfiguration } from "../lib";
import { PM_sidecar } from "./sidecar";
export declare class PM_Node_Sidecar extends PM_sidecar {
    testResourceConfiguration: ITTestResourceConfiguration;
    client: net.Socket;
    mockListener?: jest.Mock;
    constructor(t: ITTestResourceConfiguration);
    start(stopper: () => any): Promise<void>;
    stop(): Promise<void>;
    testArtiFactoryfileWriter(tLog: ITLog, callback: (p: Promise<void>) => void): (fPath: string, value: string | Buffer | PassThrough) => void;
    send<I>(command: string, ...argz: any[]): Promise<I>;
}
