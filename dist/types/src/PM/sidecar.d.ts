import { ITTestResourceConfiguration } from "../lib";
import { ITLog } from "../lib";
export declare abstract class PM_sidecar {
    testResourceConfiguration: ITTestResourceConfiguration;
    abstract start(stopper: () => any): Promise<void>;
    abstract stop(): Promise<void>;
    testArtiFactoryfileWriter(tLog: ITLog, callback: (p: Promise<void>) => void): (fPath: string, value: unknown) => void;
}
