import { ISummary, IBuiltConfig } from "../Types";
export declare const fetchProjectData: (projectName: string) => Promise<{
    summary: ISummary;
    config: IBuiltConfig;
}>;
export declare const fetchTestData: (projectName: string, filepath: string, runTime: string) => Promise<{
    testData: {
        name: string;
        givens: {
            key: string;
            name: string;
            whens: {
                name: string;
                error: boolean;
            }[];
            thens: {
                name: string;
                error: boolean;
            }[];
            error: null;
            features: string[];
        }[];
        checks: never[];
        fails: number;
        features: string[];
    };
    logs: string;
    typeErrors: string;
    lintErrors: string;
}>;
export declare const fetchBuildLogs: (projectName: string, runtime: string) => Promise<any>;
