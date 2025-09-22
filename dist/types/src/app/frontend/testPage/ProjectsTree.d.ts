import React from "react";
interface ProjectsTreeProps {
    projects: string[];
    currentProjectName: string;
    currentTestName: string;
    setExpandedSections: any;
    expandedSections: any;
    logs: any;
    setActiveTab: any;
    setSelectedFile: any;
    runtime: any;
    selectedSourcePath: any;
    activeTab: any;
    setSelectedSourcePath: any;
}
export declare const ProjectsTree: React.FC<ProjectsTreeProps>;
export {};
