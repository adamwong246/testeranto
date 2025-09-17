import React from "react";
import { STANDARD_LOGS, RUNTIME_SPECIFIC_LOGS, } from "../../utils/logFiles";
import { FileTree } from "./FileTree";
import { FileTreeItem } from "./FileTreeItem";
import { getLanguage } from "./TestPageView_utils";
export const TestPageLeftContent = ({ setExpandedSections, expandedSections, logs, setActiveTab, setSelectedFile, runtime, selectedSourcePath, activeTab, setSelectedSourcePath, }) => {
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "p-2" },
            React.createElement("div", { className: "d-flex align-items-center text-muted mb-1", style: { cursor: "pointer", fontSize: "0.875rem" }, onClick: () => setExpandedSections((prev) => (Object.assign(Object.assign({}, prev), { standardLogs: !prev.standardLogs }))) },
                React.createElement("i", { className: `bi bi-chevron-${expandedSections.standardLogs ? "down" : "right"} me-1` }),
                React.createElement("span", null, "Standard Logs")),
            expandedSections.standardLogs && (React.createElement("div", null, Object.values(STANDARD_LOGS).map((logName) => {
                const logContent = logs ? logs[logName] : undefined;
                const exists = logContent !== undefined &&
                    ((typeof logContent === "string" && logContent.trim() !== "") ||
                        (typeof logContent === "object" &&
                            logContent !== null &&
                            Object.keys(logContent).length > 0));
                return (React.createElement(FileTreeItem, { key: logName, name: logName, isFile: true, level: 1, isSelected: activeTab === logName, exists: exists, onClick: () => {
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
            })))),
        runtime &&
            RUNTIME_SPECIFIC_LOGS[runtime] &&
            Object.values(RUNTIME_SPECIFIC_LOGS[runtime]).length >
                0 && (React.createElement("div", { className: "p-2" },
            React.createElement("div", { className: "d-flex align-items-center text-muted mb-1", style: { cursor: "pointer", fontSize: "0.875rem" }, onClick: () => setExpandedSections((prev) => (Object.assign(Object.assign({}, prev), { runtimeLogs: !prev.runtimeLogs }))) },
                React.createElement("i", { className: `bi bi-chevron-${expandedSections.runtimeLogs ? "down" : "right"} me-1` }),
                React.createElement("span", null, "Runtime Logs")),
            expandedSections.runtimeLogs && (React.createElement("div", null, Object.values(RUNTIME_SPECIFIC_LOGS[runtime]).map((logName) => {
                const logContent = logs ? logs[logName] : undefined;
                const exists = logContent !== undefined &&
                    ((typeof logContent === "string" &&
                        logContent.trim() !== "") ||
                        (typeof logContent === "object" &&
                            logContent !== null &&
                            Object.keys(logContent).length > 0));
                return (React.createElement(FileTreeItem, { key: logName, name: logName, isFile: true, level: 1, isSelected: activeTab === logName, exists: exists, onClick: () => {
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
        logs && logs.source_files && (React.createElement("div", { className: "p-2" },
            React.createElement("div", { className: "d-flex align-items-center text-muted mb-1", style: { cursor: "pointer", fontSize: "0.875rem" }, onClick: () => setExpandedSections((prev) => (Object.assign(Object.assign({}, prev), { sourceFiles: !prev.sourceFiles }))) },
                React.createElement("i", { className: `bi bi-chevron-${expandedSections.sourceFiles ? "down" : "right"} me-1` }),
                React.createElement("span", null, "Source Files")),
            expandedSections.sourceFiles && (React.createElement("div", null,
                React.createElement(FileTree, { data: logs.source_files, onSelect: (path, content) => {
                        setActiveTab("source_file");
                        setSelectedSourcePath(path);
                        setSelectedFile({
                            path,
                            content,
                            language: getLanguage(path),
                        });
                    }, level: 1, selectedSourcePath: selectedSourcePath })))))));
};
