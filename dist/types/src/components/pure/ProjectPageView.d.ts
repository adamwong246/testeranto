import "./../../App.scss";
export type IProjectPageViewProps = {
    summary: any;
    nodeLogs: any;
    webLogs: any;
    pureLogs: any;
    config: any;
    loading: any;
    error: any;
    projectName: any;
    route: any;
    setRoute: any;
    navigate: any;
};
export declare const ProjectPageView: ({ summary, nodeLogs, webLogs, pureLogs, config, loading, error, projectName, route, setRoute, navigate }: IProjectPageViewProps) => JSX.Element;
