export declare const testGitIntegration: () => Promise<{
    success: boolean;
    changes: import("../services/FileService").FileChange[];
    branch: string;
    error?: undefined;
} | {
    success: boolean;
    error: string;
    changes?: undefined;
    branch?: undefined;
}>;
