type TestData = {
    name: string;
    givens: {
        name: string;
        whens: {
            name: string;
            error?: string;
            features?: string[];
            artifacts?: string[];
        }[];
        thens: {
            name: string;
            error?: string;
            features?: string[];
            artifacts?: string[];
        }[];
        features?: string[];
        artifacts?: string[];
    }[];
};
export declare const getLanguage: (path: string) => "json" | "typescript" | "javascript" | "markdown" | "plaintext";
export declare const renderTestResults: (testData: TestData, buildErrors: any, projectName: any, testName: any, runtime: any) => JSX.Element;
export {};
