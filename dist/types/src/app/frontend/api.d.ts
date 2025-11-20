import { ISummary, IBuiltConfig, IRunTime } from "../../Types";
export declare const fetchProjectData: (projectName: string) => Promise<{
    summary: ISummary;
    config: IBuiltConfig;
}>;
export declare const fetchTestData: (projectName: string, filepath: string, runTime: IRunTime) => Promise<{
    logs: Record<string, string>;
    error: string | null;
}>;
export declare const summaryDotJson: (name: string) => string;
