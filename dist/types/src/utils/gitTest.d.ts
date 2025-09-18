export declare const testGitIntegration: () => Promise<{
    success: boolean;
    changes: any;
    branch: any;
    error?: undefined;
} | {
    success: boolean;
    error: string;
    changes?: undefined;
    branch?: undefined;
}>;
