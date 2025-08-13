import "./../../App.scss";
export type IProjectPageViewProps = {
    summary: any;
    nodeLogs: any;
    webLogs: any;
    pureLogs: any;
    config: any;
    loading: boolean;
    error: string | null;
    projectName: string;
    activeTab: string;
    setActiveTab: (tab: string) => void;
};
export declare const ProjectPageView: ({ summary, nodeLogs, webLogs, pureLogs, config, loading, error, projectName, activeTab, setActiveTab }: IProjectPageViewProps) => JSX.Element;
