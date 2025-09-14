/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../../App";
import { STANDARD_LOGS, RUNTIME_SPECIFIC_LOGS, } from "../../utils/logFiles";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Editor } from "@monaco-editor/react";
import { NavBar } from "./NavBar";
import { FileTreeItem } from "./FileTreeItem";
import { FileTree } from "./FileTree";
import { ToastNotification } from "./ToastNotification";
import { getLanguage, renderTestResults } from "./TestPageView_utils";
import { MagicRobotModal } from "./MagicRobotModal";
export const TestPageView = ({ projectName, testName, decodedTestPath, runtime, testsExist, errorCounts, logs, isWebSocketConnected, }) => {
    const navigate = useNavigate();
    const [showAiderModal, setShowAiderModal] = useState(false);
    const [messageOption, setMessageOption] = useState("default");
    const [customMessage, setCustomMessage] = useState(typeof logs["message.txt"] === "string"
        ? logs["message.txt"]
        : "make a script that prints hello");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [expandedSections, setExpandedSections] = useState({
        standardLogs: true,
        runtimeLogs: true,
        sourceFiles: true,
        buildErrors: true,
    });
    const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
    // Extract build errors and warnings relevant to this test
    const [buildErrors, setBuildErrors] = useState({ errors: [], warnings: [] });
    useEffect(() => {
        var _a, _b, _c;
        const metafile = (_a = logs.build_logs) === null || _a === void 0 ? void 0 : _a.metafile;
        if (!metafile) {
            setBuildErrors({ errors: [], warnings: [] });
            return;
        }
        const sourceFilesSet = new Set();
        // Collect all input files from metafile outputs related to this test
        Object.entries(metafile.outputs || {}).forEach(([outputPath, output]) => {
            // Normalize paths for comparison
            const normalizedTestName = testName.replace(/\\/g, "/");
            const normalizedEntryPoint = output.entryPoint
                ? output.entryPoint.replace(/\\/g, "/")
                : "";
            if (normalizedEntryPoint.includes(normalizedTestName)) {
                Object.keys(output.inputs || {}).forEach((inputPath) => {
                    sourceFilesSet.add(inputPath.replace(/\\/g, "/"));
                });
            }
        });
        // Filter errors and warnings to those originating from source files of this test
        const filteredErrors = (((_b = logs.build_logs) === null || _b === void 0 ? void 0 : _b.errors) || []).filter((err) => {
            if (!err.location || !err.location.file)
                return false;
            return sourceFilesSet.has(err.location.file.replace(/\\/g, "/"));
        });
        const filteredWarnings = (((_c = logs.build_logs) === null || _c === void 0 ? void 0 : _c.warnings) || []).filter((warn) => {
            if (!warn.location || !warn.location.file)
                return false;
            return sourceFilesSet.has(warn.location.file.replace(/\\/g, "/"));
        });
        setBuildErrors({ errors: filteredErrors, warnings: filteredWarnings });
    }, [logs, testName]);
    // Update customMessage when logs change
    useEffect(() => {
        if (typeof logs["message.txt"] === "string" && logs["message.txt"].trim()) {
            setCustomMessage(logs["message.txt"]);
        }
    }, [logs]);
    // Use the centralized WebSocket from App context
    const wsContext = useWebSocket();
    const ws = wsContext === null || wsContext === void 0 ? void 0 : wsContext.ws;
    const [activeTab, setActiveTab] = React.useState("tests.json");
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedSourcePath, setSelectedSourcePath] = useState(null);
    const [editorTheme, setEditorTheme] = useState("vs-dark");
    return (React.createElement(Container, { fluid: true, className: "px-0" },
        React.createElement(NavBar, { title: decodedTestPath, backLink: `/projects/${projectName}`, navItems: [
                {
                    label: "",
                    badge: {
                        variant: runtime === "node"
                            ? "primary"
                            : runtime === "web"
                                ? "success"
                                : runtime === "golang"
                                    ? "warning"
                                    : "info",
                        text: runtime,
                    },
                    className: "pe-none d-flex align-items-center gap-2",
                },
            ], rightContent: React.createElement(Button, { variant: "info", onClick: () => setShowAiderModal(true), className: "ms-2 position-relative", title: isWebSocketConnected
                    ? "AI Assistant"
                    : "AI Assistant (WebSocket not connected)", disabled: !isWebSocketConnected },
                "\uD83E\uDD16",
                !isWebSocketConnected && (React.createElement("span", { className: "position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle", title: "WebSocket disconnected" },
                    React.createElement("span", { className: "visually-hidden" }, "WebSocket disconnected")))) }),
        React.createElement(MagicRobotModal, { customMessage: customMessage, isWebSocketConnected: isWebSocketConnected, messageOption: messageOption, navigate: navigate, projectName: projectName, runtime: runtime, setCustomMessage: setCustomMessage, setMessageOption: setMessageOption, setShowAiderModal: setShowAiderModal, setShowToast: setShowToast, setToastMessage: setToastMessage, setToastVariant: setToastVariant, showAiderModal: showAiderModal, testName: testName, ws: ws }),
        React.createElement(Row, { className: "g-0" },
            React.createElement(Col, { sm: 3, className: "border-end", style: {
                    height: "calc(100vh - 56px)",
                    overflow: "auto",
                    backgroundColor: "#f8f9fa",
                } },
                React.createElement("div", { className: "p-2 border-bottom" },
                    React.createElement("small", { className: "fw-bold text-muted" }, "EXPLORER")),
                React.createElement("div", { className: "p-2" },
                    React.createElement("div", { className: "d-flex align-items-center text-muted mb-1", style: { cursor: "pointer", fontSize: "0.875rem" }, onClick: () => setExpandedSections((prev) => (Object.assign(Object.assign({}, prev), { standardLogs: !prev.standardLogs }))) },
                        React.createElement("i", { className: `bi bi-chevron-${expandedSections.standardLogs ? "down" : "right"} me-1` }),
                        React.createElement("span", null, "Standard Logs")),
                    expandedSections.standardLogs && (React.createElement("div", null, Object.values(STANDARD_LOGS).map((logName) => {
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
                    })))),
                runtime &&
                    RUNTIME_SPECIFIC_LOGS[runtime] &&
                    Object.values(RUNTIME_SPECIFIC_LOGS[runtime])
                        .length > 0 && (React.createElement("div", { className: "p-2" },
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
                            }, level: 1, selectedSourcePath: selectedSourcePath })))))),
            React.createElement(Col, { sm: 6, className: "border-end p-0", style: { height: "calc(100vh - 56px)", overflow: "hidden" } },
                React.createElement(Editor, { height: "100%", path: (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path) || "empty", defaultLanguage: (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.language) || "plaintext", value: (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.content) || "// Select a file to view its contents", theme: editorTheme, options: {
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: "on",
                        automaticLayout: true,
                        readOnly: !(selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.includes("source_files")),
                    } })),
            React.createElement(Col, { sm: 3, className: "p-0 border-start", style: { height: "calc(100vh - 56px)", overflow: "auto" } },
                React.createElement("div", { className: "p-3" },
                    (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.endsWith("tests.json")) && (React.createElement("div", { className: "test-results-preview" }, typeof selectedFile.content === "string"
                        ? renderTestResults(JSON.parse(selectedFile.content), buildErrors, projectName, testName, runtime)
                        : renderTestResults(selectedFile.content, buildErrors, projectName, testName, runtime))),
                    (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.match(/\.(png|jpg|jpeg|gif|svg)$/i)) && (React.createElement("div", { className: "text-center" },
                        React.createElement("img", { src: selectedFile.content, alt: selectedFile.path, className: "img-fluid", style: { maxHeight: "300px" } }),
                        React.createElement("div", { className: "mt-2" },
                            React.createElement("a", { href: selectedFile.content, target: "_blank", rel: "noopener noreferrer", className: "btn btn-sm btn-outline-primary" }, "Open Full Size")))),
                    (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.endsWith("build.json")) && (React.createElement("div", null,
                        React.createElement("h5", null, "Build Information"),
                        (() => {
                            var _a, _b;
                            try {
                                const buildData = JSON.parse(selectedFile.content);
                                return (React.createElement(React.Fragment, null,
                                    ((_a = buildData.errors) === null || _a === void 0 ? void 0 : _a.length) > 0 && (React.createElement("div", { className: "mb-3" },
                                        React.createElement("h6", { className: "text-danger" },
                                            "Errors (",
                                            buildData.errors.length,
                                            ")"),
                                        React.createElement("ul", { className: "list-unstyled" }, buildData.errors.map((error, index) => (React.createElement("li", { key: index, className: "mb-2 p-2  rounded" },
                                            React.createElement("div", { className: "text-danger fw-bold" }, error.text),
                                            error.location && (React.createElement("div", { className: "small text-muted" },
                                                "File: ",
                                                error.location.file,
                                                "Line: ",
                                                error.location.line,
                                                "Column: ",
                                                error.location.column)),
                                            error.notes && error.notes.length > 0 && (React.createElement("div", { className: "small" },
                                                "Notes:",
                                                React.createElement("ul", null, error.notes.map((note, noteIndex) => (React.createElement("li", { key: noteIndex }, note.text)))))))))))),
                                    ((_b = buildData.warnings) === null || _b === void 0 ? void 0 : _b.length) > 0 && (React.createElement("div", { className: "mb-3" },
                                        React.createElement("h6", { className: "text-warning" },
                                            "Warnings (",
                                            buildData.warnings.length,
                                            ")"),
                                        React.createElement("ul", { className: "list-unstyled" }, buildData.warnings.map((warning, index) => (React.createElement("li", { key: index, className: "mb-2 p-2  rounded" },
                                            React.createElement("div", { className: "text-warning fw-bold" }, warning.text),
                                            warning.location && (React.createElement("div", { className: "small text-muted" },
                                                "File: ",
                                                warning.location.file,
                                                "Line: ",
                                                warning.location.line,
                                                "Column: ",
                                                warning.location.column)),
                                            warning.notes &&
                                                warning.notes.length > 0 && (React.createElement("div", { className: "small" },
                                                "Notes:",
                                                React.createElement("ul", null, warning.notes.map((note, noteIndex) => (React.createElement("li", { key: noteIndex }, note.text)))))))))))),
                                    (!buildData.errors || buildData.errors.length === 0) &&
                                        (!buildData.warnings ||
                                            buildData.warnings.length === 0) && (React.createElement("div", { className: "alert alert-success" }, "No build errors or warnings"))));
                            }
                            catch (e) {
                                return (React.createElement("div", { className: "alert alert-danger" },
                                    "Error parsing build.json: ",
                                    e.message));
                            }
                        })())),
                    (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.endsWith(".json")) &&
                        !selectedFile.path.endsWith("tests.json") &&
                        !selectedFile.path.endsWith("build.json") && (React.createElement("pre", { className: " p-2 small" },
                        React.createElement("code", null, selectedFile.content))),
                    (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.includes("source_files")) && (React.createElement("div", null,
                        React.createElement("div", { className: "mb-2 small text-muted" },
                            React.createElement("i", { className: "bi bi-file-earmark-text me-1" }),
                            selectedFile.path.split("/").pop()),
                        React.createElement(Button, { variant: "outline-primary", size: "sm", className: "mb-2", onClick: () => {
                                // TODO: Add save functionality
                                alert("Save functionality will be implemented here");
                            } }, "Save Changes")))))),
        React.createElement(ToastNotification, { showToast: showToast, setShowToast: setShowToast, toastVariant: toastVariant, toastMessage: toastMessage })));
};
