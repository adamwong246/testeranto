import { IBuiltConfig, IRunTime } from "../../Types.js";
import { PM_WithBuild } from "./PM_WithBuild";
import { IMode } from "../types";
export declare abstract class PM_WithEslintAndTsc extends PM_WithBuild {
    constructor(configs: IBuiltConfig, name: string, mode: IMode);
    tscCheck: ({ entrypoint, addableFiles, platform, }: {
        entrypoint: string;
        addableFiles: string[];
        platform: IRunTime;
    }) => Promise<any>;
    eslintCheck: ({ entrypoint, addableFiles, platform, }: {
        entrypoint: string;
        addableFiles: string[];
        platform: IRunTime;
    }) => Promise<void>;
    typeCheckIsRunning: (src: string) => void;
    typeCheckIsNowDone: (src: string, failures: number) => void;
    lintIsRunning: (src: string) => void;
    lintIsNowDone: (src: string, failures: number) => void;
    bddTestIsRunning: (src: string) => void;
    bddTestIsNowDone: (src: string, failures: number) => void;
}
