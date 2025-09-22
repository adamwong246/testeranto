import { IRunTime, ISummary } from "../../Types";
export declare const makePrompt: (summary: ISummary, name: string, entryPoint: string, addableFiles: string[], runTime: IRunTime) => Promise<void>;
