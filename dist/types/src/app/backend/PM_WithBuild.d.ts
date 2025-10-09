import { IBuiltConfig } from "../../Types.js";
import { PM_2_WithTCP } from "./PM_2_WithTCP.js";
export declare abstract class PM_WithBuild extends PM_2_WithTCP {
    configs: IBuiltConfig;
    currentBuildResolve: (() => void) | null;
    currentBuildReject: ((error: any) => void) | null;
    startBuildProcess(configer: (config: IBuiltConfig, entryPoints: string[], testName: string) => any, entryPoints: Record<string, string>, runtime: string): Promise<void>;
}
