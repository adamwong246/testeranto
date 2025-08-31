import { IBuiltConfig } from "../Types.js";
import { PM_WithWebSocket } from "./PM_WithWebSocket.js";
export declare abstract class PM_WithBuild extends PM_WithWebSocket {
    configs: IBuiltConfig;
    name: string;
    mode: "once" | "dev";
    currentBuildResolve: (() => void) | null;
    currentBuildReject: ((error: any) => void) | null;
    constructor(configs: IBuiltConfig, name: string, mode: "once" | "dev");
    startBuildProcesses(): Promise<void>;
    private startBuildProcess;
    abstract onBuildDone(): void;
}
