import { IMode } from "../types";
import { Server_Docker } from "./Server_Docker";
import { ITestconfigV2 } from "../../Types";
export declare class Server extends Server_Docker {
    constructor(configs: ITestconfigV2, mode: IMode);
    start(): Promise<void>;
    stop(): Promise<void>;
}
