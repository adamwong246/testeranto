declare class TesterantoProject {
    tests: [keyName: string, fileName: string, className: string][];
    features: string;
    ports: string[];
    constructor(tests: any, features: any, ports: any);
    builder(): void;
}
export declare class Scheduler {
    project: TesterantoProject;
    ports: Record<string, string>;
    jobs: Record<string, {
        aborter: () => any;
        cancellablePromise: string;
    }>;
    queue: {
        key: string;
        aborter: () => any;
        getCancellablePromise: (testResource: any) => string;
    }[];
    spinCycle: number;
    spinAnimation: string;
    constructor(project: TesterantoProject);
    abort(key: any): Promise<void>;
    private spinner;
    private pop;
}
export {};
//# sourceMappingURL=run.d.ts.map