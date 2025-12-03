export type ITestPageViewProps = {
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
