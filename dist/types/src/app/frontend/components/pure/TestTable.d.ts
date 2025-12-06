import React from "react";
interface TestStatus {
    testName: string;
    testsExist: boolean;
    runTimeErrors: number;
    typeErrors: number;
    staticErrors: number;
    runTime: string;
    runTimeTests: number;
}
interface TestTableProps {
    testStatuses: TestStatus[];
    projectName: string;
}
export declare const TestTable: React.FC<TestTableProps>;
export {};
