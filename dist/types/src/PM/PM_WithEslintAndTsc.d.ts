import { IBuiltConfig, IRunTime, ISummary } from "../Types.js";
import { PM_Base } from "./base.js";
export declare abstract class PM_WithEslintAndTsc extends PM_Base {
    name: string;
    mode: "once" | "dev";
    summary: ISummary;
    constructor(configs: IBuiltConfig, name: string, mode: "once" | "dev");
    tscCheck: ({ entrypoint, addableFiles, platform, }: {
        platform: IRunTime;
        entrypoint: string;
        addableFiles: string[];
    }) => Promise<void>;
    eslintCheck: (entrypoint: string, platform: IRunTime, addableFiles: string[]) => Promise<void>;
    makePrompt: (entryPoint: string, addableFiles: string[], platform: IRunTime) => Promise<void>;
    typeCheckIsRunning: (src: string) => void;
    typeCheckIsNowDone: (src: string, failures: number) => void;
    lintIsRunning: (src: string) => void;
    lintIsNowDone: (src: string, failures: number) => void;
    bddTestIsRunning: (src: string) => void;
    bddTestIsNowDone: (src: string, failures: number) => void;
    writeBigBoard: () => void;
    checkForShutdown: () => void;
}
