import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileTreeItem } from "../../components/pure/FileTreeItem";
import { STANDARD_LOGS, RUNTIME_SPECIFIC_LOGS, } from "../../utils/logFiles";
import { FileTree } from "../../components/pure/FileTree";
import { getLanguage } from "./TestPageView_utils";
export const ProjectsTree = ({ projects, currentProjectName, currentTestName, setExpandedSections, expandedSections, logs, setActiveTab, setSelectedFile, runtime, selectedSourcePath, activeTab, setSelectedSourcePath, }) => {
    const navigate = useNavigate();
    // Always expand the first project by default
    const [expandedProjects, setExpandedProjects] = useState(() => {
        const initial = {};
        if (projects && projects.length > 0) {
            initial[projects[0]] = true;
        }
        return initial;
    });
    const [projectTests, setProjectTests] = useState({});
    const [loadingProjects, setLoadingProjects] = useState({});
    const toggleProject = async (projectName) => {
        // Toggle expansion state
        const isExpanding = !expandedProjects[projectName];
        setExpandedProjects(prev => (Object.assign(Object.assign({}, prev), { [projectName]: isExpanding })));
        // If expanding and we haven't loaded tests yet, fetch them
        if (isExpanding && !projectTests[projectName]) {
            setLoadingProjects(prev => (Object.assign(Object.assign({}, prev), { [projectName]: true })));
            try {
                const response = await fetch(`/api/projects/tests?project=${encodeURIComponent(projectName)}`);
                if (response.ok) {
                    const tests = await response.json();
                    setProjectTests(prev => (Object.assign(Object.assign({}, prev), { [projectName]: tests })));
                }
                else {
                    console.error(`Failed to fetch tests for ${projectName}`);
                    setProjectTests(prev => (Object.assign(Object.assign({}, prev), { [projectName]: [] })));
                }
            }
            catch (error) {
                console.error(`Error fetching tests for ${projectName}:`, error);
                setProjectTests(prev => (Object.assign(Object.assign({}, prev), { [projectName]: [] })));
            }
            finally {
                setLoadingProjects(prev => (Object.assign(Object.assign({}, prev), { [projectName]: false })));
            }
        }
    };
    return (React.createElement("div", null,
        React.createElement("div", { className: "d-flex align-items-center text-muted mb-1", style: { fontSize: "0.875rem", fontWeight: "bold" } },
            React.createElement("i", { className: "bi bi-folder me-1" }),
            React.createElement("span", null, "Projects")),
        !projects ? (React.createElement("div", { className: "ms-3 text-muted" }, "Loading projects...")) : projects.length === 0 ? (React.createElement("div", { className: "ms-3 text-muted" }, "No projects available. Please check if projects.json exists.")) : (React.createElement("div", null, projects.map((project, index) => (React.createElement("div", { key: project },
            React.createElement(FileTreeItem, { name: project, isFile: false, level: 1, isSelected: false, exists: true, isExpanded: expandedProjects[project], onClick: () => toggleProject(project) }),
            expandedProjects[project] && (React.createElement("div", { className: "ms-4" },
                "  // Increased indentation for tests",
                loadingProjects[project] ? (React.createElement("div", { className: "text-muted small" }, "Loading tests...")) : (React.createElement(React.Fragment, null,
                    index === 0 && (React.createElement(React.Fragment, null,
                        React.createElement("div", null,
                            React.createElement(FileTreeItem, { name: "Standard Logs", isFile: false, level: 2, isSelected: false, exists: true, isExpanded: expandedSections.standardLogs, onClick: () => setExpandedSections((prev) => (Object.assign(Object.assign({}, prev), { standardLogs: !prev.standardLogs }))) }),
                            expandedSections.standardLogs && (React.createElement("div", { className: "ms-4" }, Object.values(STANDARD_LOGS).map((logName) => {
                                const logContent = logs ? logs[logName] : undefined;
                                const exists = logContent !== undefined &&
                                    ((typeof logContent === "string" && logContent.trim() !== "") ||
                                        (typeof logContent === "object" &&
                                            logContent !== null &&
                                            Object.keys(logContent).length > 0));
                                return (React.createElement(FileTreeItem, { key: logName, name: logName, isFile: true, level: 3, isSelected: activeTab === logName, exists: exists, onClick: () => {
                                        if (exists) {
                                            setActiveTab(logName);
                                            if (typeof setSelectedFile === 'function') {
                                                setSelectedFile({
                                                    path: logName,
                                                    content: typeof logContent === "string"
                                                        ? logContent
                                                        : JSON.stringify(logContent, null, 2),
                                                    language: logName.endsWith(".json")
                                                        ? "json"
                                                        : "plaintext",
                                                });
                                            }
                                        }
                                        else {
                                            setActiveTab(logName);
                                            setSelectedFile({
                                                path: logName,
                                                content: `// ${logName} not found or empty\nThis file was not generated during the test run.`,
                                                language: "plaintext",
                                            });
                                        }
                                    } }));
                            })))),
                        runtime &&
                            RUNTIME_SPECIFIC_LOGS[runtime] &&
                            Object.values(RUNTIME_SPECIFIC_LOGS[runtime]).length > 0 && (React.createElement("div", null,
                            React.createElement(FileTreeItem, { name: "Runtime Logs", isFile: false, level: 2, isSelected: false, exists: true, isExpanded: expandedSections.runtimeLogs, onClick: () => setExpandedSections((prev) => (Object.assign(Object.assign({}, prev), { runtimeLogs: !prev.runtimeLogs }))) }),
                            expandedSections.runtimeLogs && (React.createElement("div", { className: "ms-4" }, Object.values(RUNTIME_SPECIFIC_LOGS[runtime]).map((logName) => {
                                const logContent = logs ? logs[logName] : undefined;
                                const exists = logContent !== undefined &&
                                    ((typeof logContent === "string" &&
                                        logContent.trim() !== "") ||
                                        (typeof logContent === "object" &&
                                            logContent !== null &&
                                            Object.keys(logContent).length > 0));
                                return (React.createElement(FileTreeItem, { key: logName, name: logName, isFile: true, level: 3, isSelected: activeTab === logName, exists: exists, onClick: () => {
                                        if (exists) {
                                            setActiveTab(logName);
                                            setSelectedFile({
                                                path: logName,
                                                content: typeof logContent === "string"
                                                    ? logContent
                                                    : JSON.stringify(logContent, null, 2),
                                                language: logName.endsWith(".json")
                                                    ? "json"
                                                    : "plaintext",
                                            });
                                        }
                                        else {
                                            setActiveTab(logName);
                                            setSelectedFile({
                                                path: logName,
                                                content: `// ${logName} not found or empty\nThis file was not generated during the test run.`,
                                                language: "plaintext",
                                            });
                                        }
                                    } }));
                            }))))),
                        logs && logs.source_files && (React.createElement("div", null,
                            React.createElement(FileTreeItem, { name: "Source Files", isFile: false, level: 2, isSelected: false, exists: true, isExpanded: expandedSections.sourceFiles, onClick: () => setExpandedSections((prev) => (Object.assign(Object.assign({}, prev), { sourceFiles: !prev.sourceFiles }))) }),
                            expandedSections.sourceFiles && (React.createElement("div", { className: "ms-4" },
                                React.createElement(FileTree, { data: logs.source_files, onSelect: (path, content) => {
                                        setActiveTab("source_file");
                                        setSelectedSourcePath(path);
                                        setSelectedFile({
                                            path,
                                            content,
                                            language: getLanguage(path),
                                        });
                                    }, level: 3, selectedSourcePath: selectedSourcePath }))))))),
                    (projectTests[project] || []).map(test => (React.createElement(FileTreeItem, { key: `${project}-${test}`, name: test, isFile: true, level: 2, isSelected: currentProjectName === project && currentTestName === test, exists: true, onClick: () => {
                            // Navigate to the test page
                            navigate(`/projects/${project}/tests/${encodeURIComponent(test)}`);
                        } }))))))))))))));
};
