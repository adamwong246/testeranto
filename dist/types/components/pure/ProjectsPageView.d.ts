type Project = {
    name: string;
    nodeStatus: string;
    webStatus: string;
    pureStatus: string;
};
type TestSummary = {
    [testName: string]: {
        testsExist?: boolean;
        runTimeErrors?: number;
        typeErrors?: number;
        staticErrors?: number;
    };
};
type ProjectConfig = {
    [projectName: string]: {
        tests: [string, string][];
    };
};
type ProjectsPageViewProps = {
    projects: Project[];
    summaries: TestSummary;
    configs: ProjectConfig;
    loading: boolean;
    error: string | null;
    navigate: (path: string) => void;
};
export declare const ProjectsPageView: ({ projects, summaries, configs, loading, error, navigate }: ProjectsPageViewProps) => JSX.Element;
export {};
