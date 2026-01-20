import { ITestconfigV2 } from "../../Types";
import { IMode } from "../types";
export declare abstract class Server_Base {
    mode: IMode;
    configs: ITestconfigV2;
    constructor(configs: ITestconfigV2, mode: IMode);
    start(): Promise<void>;
    stop(): Promise<void>;
}
