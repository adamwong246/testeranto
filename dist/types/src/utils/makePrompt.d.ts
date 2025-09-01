import { IRunTime, ISummary } from "../Types";
export declare const makePromptInternal: (summary: ISummary, name: string, entryPoint: string, addableFiles: string[], runTime: IRunTime) => Promise<void> | undefined;
