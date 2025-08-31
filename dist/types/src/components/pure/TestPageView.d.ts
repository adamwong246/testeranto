type TestPageViewProps = {
    projectName: string;
    testName: string;
    decodedTestPath: string;
    runtime: string;
    logs: Record<string, string>;
    testsExist: boolean;
    errorCounts: {
        runTimeErrors: number;
        typeErrors: number;
        staticErrors: number;
    };
    isWebSocketConnected: boolean;
};
export declare const TestPageView: ({ projectName, testName, decodedTestPath, runtime, testsExist, errorCounts, logs, isWebSocketConnected, }: TestPageViewProps) => JSX.Element;
export {};
