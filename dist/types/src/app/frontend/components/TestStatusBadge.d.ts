type TestStatusBadgeProps = {
    testName: string;
    testsExist?: boolean;
    runTimeErrors: number;
    typeErrors: number;
    staticErrors: number;
    variant?: 'compact' | 'full';
    testData?: {
        fails?: number;
        features?: any[];
        artifacts?: any[];
    };
};
export declare const TestStatusBadge: (props: TestStatusBadgeProps) => JSX.Element;
export {};
