"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPageLeftContent = void 0;
const react_1 = __importDefault(require("react"));
const logFiles_1 = require("../../utils/logFiles");
const FileTree_1 = require("./FileTree");
const FileTreeItem_1 = require("./FileTreeItem");
const TestPageView_utils_1 = require("./TestPageView_utils");
const TestPageLeftContent = ({ setExpandedSections, expandedSections, logs, setActiveTab, setSelectedFile, runtime, selectedSourcePath, activeTab, setSelectedSourcePath, }) => {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: "p-2" },
            react_1.default.createElement("div", { className: "d-flex align-items-center text-muted mb-1", style: { cursor: "pointer", fontSize: "0.875rem" }, onClick: () => setExpandedSections((prev) => (Object.assign(Object.assign({}, prev), { standardLogs: !prev.standardLogs }))) },
                react_1.default.createElement("i", { className: `bi bi-chevron-${expandedSections.standardLogs ? "down" : "right"} me-1` }),
                react_1.default.createElement("span", null, "Standard Logs")),
            expandedSections.standardLogs && (react_1.default.createElement("div", null, Object.values(logFiles_1.STANDARD_LOGS).map((logName) => {
                const logContent = logs ? logs[logName] : undefined;
                const exists = logContent !== undefined &&
                    ((typeof logContent === "string" && logContent.trim() !== "") ||
                        (typeof logContent === "object" &&
                            logContent !== null &&
                            Object.keys(logContent).length > 0));
                return (react_1.default.createElement(FileTreeItem_1.FileTreeItem, { key: logName, name: logName, isFile: true, level: 1, isSelected: activeTab === logName, exists: exists, onClick: () => {
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
            logFiles_1.RUNTIME_SPECIFIC_LOGS[runtime] &&
            Object.values(logFiles_1.RUNTIME_SPECIFIC_LOGS[runtime]).length >
                0 && (react_1.default.createElement("div", { className: "p-2" },
            react_1.default.createElement("div", { className: "d-flex align-items-center text-muted mb-1", style: { cursor: "pointer", fontSize: "0.875rem" }, onClick: () => setExpandedSections((prev) => (Object.assign(Object.assign({}, prev), { runtimeLogs: !prev.runtimeLogs }))) },
                react_1.default.createElement("i", { className: `bi bi-chevron-${expandedSections.runtimeLogs ? "down" : "right"} me-1` }),
                react_1.default.createElement("span", null, "Runtime Logs")),
            expandedSections.runtimeLogs && (react_1.default.createElement("div", null, Object.values(logFiles_1.RUNTIME_SPECIFIC_LOGS[runtime]).map((logName) => {
                const logContent = logs ? logs[logName] : undefined;
                const exists = logContent !== undefined &&
                    ((typeof logContent === "string" &&
                        logContent.trim() !== "") ||
                        (typeof logContent === "object" &&
                            logContent !== null &&
                            Object.keys(logContent).length > 0));
                return (react_1.default.createElement(FileTreeItem_1.FileTreeItem, { key: logName, name: logName, isFile: true, level: 1, isSelected: activeTab === logName, exists: exists, onClick: () => {
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
        logs && logs.source_files && (react_1.default.createElement("div", { className: "p-2" },
            react_1.default.createElement("div", { className: "d-flex align-items-center text-muted mb-1", style: { cursor: "pointer", fontSize: "0.875rem" }, onClick: () => setExpandedSections((prev) => (Object.assign(Object.assign({}, prev), { sourceFiles: !prev.sourceFiles }))) },
                react_1.default.createElement("i", { className: `bi bi-chevron-${expandedSections.sourceFiles ? "down" : "right"} me-1` }),
                react_1.default.createElement("span", null, "Source Files")),
            expandedSections.sourceFiles && (react_1.default.createElement("div", null,
                react_1.default.createElement(FileTree_1.FileTree, { data: logs.source_files, onSelect: (path, content) => {
                        setActiveTab("source_file");
                        setSelectedSourcePath(path);
                        setSelectedFile({
                            path,
                            content,
                            language: (0, TestPageView_utils_1.getLanguage)(path),
                        });
                    }, level: 1, selectedSourcePath: selectedSourcePath })))))));
};
exports.TestPageLeftContent = TestPageLeftContent;
