import { ISummary, IBuiltConfig } from "../Types";
export declare const fetchProjectData: (projectName: string) => Promise<{
    summary: ISummary;
    config: IBuiltConfig;
}>;
export declare const fetchTestData: (projectName: string, filepath: string, runTime: string) => Promise<{
    logs: Record<string, string>;
    error: string | null;
}>;
