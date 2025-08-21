/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { STANDARD_LOGS, RUNTIME_SPECIFIC_LOGS } from "../../utils/logFiles";
import { Container, Row, Col, Nav, Button, Modal } from "react-bootstrap";
import { Editor } from "@monaco-editor/react";
import { NavBar } from "./NavBar";
import { TestStatusBadge } from "../TestStatusBadge";
const FileTree = ({ data, onSelect, level = 0, selectedSourcePath }) => {
    const [expanded, setExpanded] = useState({});
    const toggleExpand = (path) => {
        setExpanded((prev) => (Object.assign(Object.assign({}, prev), { [path]: !prev[path] })));
    };
    return (React.createElement("div", null, Object.entries(data).map(([name, node]) => {
        const path = Object.keys(expanded).find((k) => k.endsWith(name)) || name;
        const isExpanded = expanded[path];
        if (node.__isFile) {
            return (React.createElement(FileTreeItem, { key: name, name: name, isFile: true, level: level, isSelected: selectedSourcePath === path, onClick: () => onSelect(path, node.content) }));
        }
        else {
            return (React.createElement("div", { key: name },
                React.createElement("div", { className: "d-flex align-items-center py-1 text-dark", style: {
                        paddingLeft: `${level * 16}px`,
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                    }, onClick: () => toggleExpand(path) },
                    React.createElement("i", { className: `bi ${isExpanded ? 'bi-folder2-open' : 'bi-folder'} me-1` }),
                    React.createElement("span", null, name)),
                isExpanded && (React.createElement(FileTree, { data: node, onSelect: onSelect, level: level + 1, selectedSourcePath: selectedSourcePath }))));
        }
    })));
};
export const TestPageView = ({ projectName, testName, decodedTestPath, runtime, testsExist, errorCounts, logs, }) => {
    const navigate = useNavigate();
    const [showAiderModal, setShowAiderModal] = useState(false);
    const [messageOption, setMessageOption] = useState('default');
    const [customMessage, setCustomMessage] = useState(typeof logs['message.txt'] === 'string' ? logs['message.txt'] : 'make a script that prints hello');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('success');
    const [ws, setWs] = useState(null);
    const [expandedSections, setExpandedSections] = useState({
        standardLogs: true,
        runtimeLogs: true,
        sourceFiles: true
    });
    const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
    // Update customMessage when logs change
    useEffect(() => {
        if (typeof logs['message.txt'] === 'string' && logs['message.txt'].trim()) {
            setCustomMessage(logs['message.txt']);
        }
    }, [logs]);
    // Set up WebSocket connection
    useEffect(() => {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.host}`;
        const websocket = new WebSocket(wsUrl);
        setWs(websocket);
        return () => {
            websocket.close();
        };
    }, []);
    const [activeTab, setActiveTab] = React.useState("tests.json");
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedSourcePath, setSelectedSourcePath] = useState(null);
    const [editorTheme, setEditorTheme] = useState("vs-dark");
    // Determine language from file extension
    const getLanguage = (path) => {
        var _a;
        const ext = (_a = path.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        switch (ext) {
            case "ts":
                return "typescript";
            case "tsx":
                return "typescript";
            case "js":
                return "javascript";
            case "json":
                return "json";
            case "md":
                return "markdown";
            default:
                return "plaintext";
        }
    };
    const renderTestResults = (testData) => {
        return (React.createElement("div", { className: "test-results" }, testData.givens.map((given, i) => (React.createElement("div", { key: i, className: "mb-4 card" },
            React.createElement("div", { className: "card-header bg-primary text-white" },
                React.createElement("div", { className: "d-flex justify-content-between align-items-center" },
                    React.createElement("div", null,
                        React.createElement("h4", null,
                            "Given: ",
                            given.name),
                        given.features && given.features.length > 0 && (React.createElement("div", { className: "mt-1" },
                            React.createElement("small", null, "Features:"),
                            React.createElement("ul", { className: "list-unstyled" }, given.features.map((feature, fi) => (React.createElement("li", { key: fi }, feature.startsWith("http") ? (React.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer", className: "text-white" }, new URL(feature).hostname)) : (React.createElement("span", { className: "text-white" }, feature))))))))),
                    given.artifacts && given.artifacts.length > 0 && (React.createElement("div", { className: "dropdown" },
                        React.createElement("button", { className: "btn btn-sm btn-light dropdown-toggle", type: "button", "data-bs-toggle": "dropdown" },
                            "Artifacts (",
                            given.artifacts.length,
                            ")"),
                        React.createElement("ul", { className: "dropdown-menu dropdown-menu-end" }, given.artifacts.map((artifact, ai) => (React.createElement("li", { key: ai },
                            React.createElement("a", { className: "dropdown-item", href: `reports/${projectName}/${testName
                                    .split(".")
                                    .slice(0, -1)
                                    .join(".")}/${runtime}/${artifact}`, target: "_blank", rel: "noopener noreferrer" }, artifact.split("/").pop()))))))))),
            React.createElement("div", { className: "card-body" },
                given.whens.map((when, j) => (React.createElement("div", { key: `w-${j}`, className: `p-3 mb-2 ${when.error
                        ? "bg-danger text-white"
                        : "bg-success text-white"}` },
                    React.createElement("div", { className: "d-flex justify-content-between align-items-start" },
                        React.createElement("div", null,
                            React.createElement("div", null,
                                React.createElement("strong", null, "When:"),
                                " ",
                                when.name,
                                when.features && when.features.length > 0 && (React.createElement("div", { className: "mt-2" },
                                    React.createElement("small", null, "Features:"),
                                    React.createElement("ul", { className: "list-unstyled" }, when.features.map((feature, fi) => (React.createElement("li", { key: fi }, feature.startsWith("http") ? (React.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer" }, new URL(feature).hostname)) : (feature))))))),
                                when.error && React.createElement("pre", { className: "mt-2" }, when.error))),
                        when.artifacts && when.artifacts.length > 0 && (React.createElement("div", { className: "ms-3" },
                            React.createElement("strong", null, "Artifacts:"),
                            React.createElement("ul", { className: "list-unstyled" }, when.artifacts.map((artifact, ai) => (React.createElement("li", { key: ai },
                                React.createElement("a", { href: `reports/${projectName}/${testName
                                        .split(".")
                                        .slice(0, -1)
                                        .join(".")}/${runtime}/${artifact}`, target: "_blank", className: "text-white", rel: "noopener noreferrer" }, artifact.split("/").pop()))))))))))),
                given.thens.map((then, k) => (React.createElement("div", { key: `t-${k}`, className: `p-3 mb-2 ${then.error
                        ? "bg-danger text-white"
                        : "bg-success text-white"}` },
                    React.createElement("div", { className: "d-flex justify-content-between align-items-start" },
                        React.createElement("div", null,
                            React.createElement("div", null,
                                React.createElement("strong", null, "Then:"),
                                " ",
                                then.name,
                                then.features && then.features.length > 0 && (React.createElement("div", { className: "mt-2" },
                                    React.createElement("small", null, "Features:"),
                                    React.createElement("ul", { className: "list-unstyled" }, then.features.map((feature, fi) => (React.createElement("li", { key: fi }, feature.startsWith("http") ? (React.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer" }, new URL(feature).hostname)) : (feature))))))),
                                then.error && React.createElement("pre", { className: "mt-2" }, then.error))),
                        then.artifacts && then.artifacts.length > 0 && (React.createElement("div", { className: "ms-3" },
                            React.createElement("strong", null, "Artifacts:"),
                            React.createElement("ul", { className: "list-unstyled" }, then.artifacts.map((artifact, ai) => (React.createElement("li", { key: ai },
                                React.createElement("a", { href: `reports/${projectName}/${testName
                                        .split(".")
                                        .slice(0, -1)
                                        .join(".")}/${runtime}/${artifact}`, target: "_blank", className: "text-white", rel: "noopener noreferrer" }, artifact.split("/").pop())))))))))))))))));
    };
    console.log("Rendering TestPageView with logs:", {
        logKeys: Object.keys(logs),
        sourceFiles: logs.source_files ? Object.keys(logs.source_files) : null,
        selectedFile,
        activeTab,
    });
    return (React.createElement(Container, { fluid: true, className: "px-0" },
        React.createElement(NavBar, { title: decodedTestPath, backLink: `/projects/${projectName}`, navItems: [
                {
                    label: "",
                    badge: {
                        variant: runtime === "node"
                            ? "primary"
                            : runtime === "web"
                                ? "success"
                                : "info",
                        text: runtime,
                    },
                    className: "pe-none d-flex align-items-center gap-2",
                },
            ], rightContent: React.createElement(Button, { variant: "info", onClick: () => setShowAiderModal(true), className: "ms-2", title: "AI Assistant" }, "\uD83E\uDD16") }),
        React.createElement(Modal, { show: showAiderModal, onHide: () => setShowAiderModal(false), size: "lg", onShow: () => setMessageOption('default') },
            React.createElement(Modal.Header, { closeButton: true },
                React.createElement(Modal.Title, null, "Aider")),
            React.createElement(Modal.Body, null,
                React.createElement("div", { className: "mb-3" },
                    React.createElement("div", { className: "form-check" },
                        React.createElement("input", { className: "form-check-input", type: "radio", name: "messageOption", id: "defaultMessage", value: "default", checked: messageOption === 'default', onChange: () => setMessageOption('default') }),
                        React.createElement("label", { className: "form-check-label", htmlFor: "defaultMessage" }, "Use default message.txt")),
                    React.createElement("div", { className: "form-check" },
                        React.createElement("input", { className: "form-check-input", type: "radio", name: "messageOption", id: "customMessage", value: "custom", checked: messageOption === 'custom', onChange: () => setMessageOption('custom') }),
                        React.createElement("label", { className: "form-check-label", htmlFor: "customMessage" }, "Use custom message")),
                    messageOption === 'custom' && (React.createElement("div", { className: "mt-2" },
                        React.createElement("textarea", { className: "form-control", rows: 8, placeholder: "Enter your custom message", value: customMessage, onChange: (e) => setCustomMessage(e.target.value), style: { minHeight: '500px' } }))))),
            React.createElement(Modal.Footer, null,
                React.createElement(Button, { variant: "primary", onClick: async () => {
                        try {
                            const promptPath = `testeranto/reports/${projectName}/${testName
                                .split(".")
                                .slice(0, -1)
                                .join(".")}/${runtime}/prompt.txt`;
                            let command = `aider --load ${promptPath}`;
                            if (messageOption === 'default') {
                                const messagePath = `testeranto/reports/${projectName}/${testName
                                    .split(".")
                                    .slice(0, -1)
                                    .join(".")}/${runtime}/message.txt`;
                                command += ` --message-file ${messagePath}`;
                            }
                            else {
                                command += ` --message "${customMessage}"`;
                            }
                            // Send command to server via WebSocket
                            const ws = new WebSocket(`ws://${window.location.host}`);
                            ws.onopen = () => {
                                ws.send(JSON.stringify({
                                    type: 'executeCommand',
                                    command: command
                                }));
                                setToastMessage('Command sent to server');
                                setToastVariant('success');
                                setShowToast(true);
                                setShowAiderModal(false);
                                ws.close();
                                // Navigate to process manager page
                                setTimeout(() => {
                                    navigate('/processes');
                                }, 1000);
                            };
                            ws.onerror = (error) => {
                                setToastMessage('Failed to connect to server');
                                setToastVariant('danger');
                                setShowToast(true);
                            };
                        }
                        catch (err) {
                            console.error("WebSocket error:", err);
                            setToastMessage('Error preparing command');
                            setToastVariant('danger');
                            setShowToast(true);
                        }
                    } }, "Run Aider Command"))),
        React.createElement(Row, { className: "g-0" },
            React.createElement(Col, { sm: 3, className: "border-end", style: {
                    height: "calc(100vh - 56px)",
                    overflow: "auto",
                    backgroundColor: '#f8f9fa'
                } },
                React.createElement("div", { className: "p-2 border-bottom" },
                    React.createElement("small", { className: "fw-bold text-muted" }, "EXPLORER")),
                React.createElement("div", { className: "p-2" },
                    React.createElement("div", { className: "d-flex align-items-center text-muted mb-1", style: { cursor: 'pointer', fontSize: '0.875rem' }, onClick: () => setExpandedSections(prev => (Object.assign(Object.assign({}, prev), { standardLogs: !prev.standardLogs }))) },
                        React.createElement("i", { className: `bi bi-chevron-${expandedSections.standardLogs ? 'down' : 'right'} me-1` }),
                        React.createElement("span", null, "Standard Logs")),
                    expandedSections.standardLogs && (React.createElement("div", null, Object.values(STANDARD_LOGS).map((logName) => {
                        const logContent = logs[logName];
                        const exists = logContent !== undefined &&
                            ((typeof logContent === "string" && logContent.trim() !== "") ||
                                (typeof logContent === "object" && Object.keys(logContent).length > 0));
                        return (React.createElement(FileTreeItem, { key: logName, name: logName, isFile: true, level: 1, isSelected: activeTab === logName, exists: exists, onClick: () => {
                                if (exists) {
                                    setActiveTab(logName);
                                    setSelectedFile({
                                        path: logName,
                                        content: typeof logContent === "string" ? logContent : JSON.stringify(logContent, null, 2),
                                        language: logName.endsWith(".json") ? "json" : "plaintext",
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
                Object.values(RUNTIME_SPECIFIC_LOGS[runtime]).length > 0 && (React.createElement("div", { className: "p-2" },
                    React.createElement("div", { className: "d-flex align-items-center text-muted mb-1", style: { cursor: 'pointer', fontSize: '0.875rem' }, onClick: () => setExpandedSections(prev => (Object.assign(Object.assign({}, prev), { runtimeLogs: !prev.runtimeLogs }))) },
                        React.createElement("i", { className: `bi bi-chevron-${expandedSections.runtimeLogs ? 'down' : 'right'} me-1` }),
                        React.createElement("span", null, "Runtime Logs")),
                    expandedSections.runtimeLogs && (React.createElement("div", null, Object.values(RUNTIME_SPECIFIC_LOGS[runtime]).map((logName) => {
                        const logContent = logs[logName];
                        const exists = logContent !== undefined &&
                            ((typeof logContent === "string" && logContent.trim() !== "") ||
                                (typeof logContent === "object" && Object.keys(logContent).length > 0));
                        return (React.createElement(FileTreeItem, { key: logName, name: logName, isFile: true, level: 1, isSelected: activeTab === logName, exists: exists, onClick: () => {
                                if (exists) {
                                    setActiveTab(logName);
                                    setSelectedFile({
                                        path: logName,
                                        content: typeof logContent === "string" ? logContent : JSON.stringify(logContent, null, 2),
                                        language: logName.endsWith(".json") ? "json" : "plaintext",
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
                logs.source_files && (React.createElement("div", { className: "p-2" },
                    React.createElement("div", { className: "d-flex align-items-center text-muted mb-1", style: { cursor: 'pointer', fontSize: '0.875rem' }, onClick: () => setExpandedSections(prev => (Object.assign(Object.assign({}, prev), { sourceFiles: !prev.sourceFiles }))) },
                        React.createElement("i", { className: `bi bi-chevron-${expandedSections.sourceFiles ? 'down' : 'right'} me-1` }),
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
                        ? renderTestResults(JSON.parse(selectedFile.content))
                        : renderTestResults(selectedFile.content))),
                    (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.match(/\.(png|jpg|jpeg|gif|svg)$/i)) && (React.createElement("div", { className: "text-center" },
                        React.createElement("img", { src: selectedFile.content, alt: selectedFile.path, className: "img-fluid", style: { maxHeight: '300px' } }),
                        React.createElement("div", { className: "mt-2" },
                            React.createElement("a", { href: selectedFile.content, target: "_blank", rel: "noopener noreferrer", className: "btn btn-sm btn-outline-primary" }, "Open Full Size")))),
                    (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.endsWith(".json")) && !selectedFile.path.endsWith("tests.json") && (React.createElement("pre", { className: "bg-light p-2 small" },
                        React.createElement("code", null, selectedFile.content))),
                    (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.includes("source_files")) && (React.createElement("div", null,
                        React.createElement("div", { className: "mb-2 small text-muted" },
                            React.createElement("i", { className: "bi bi-file-earmark-text me-1" }),
                            selectedFile.path.split('/').pop()),
                        React.createElement(Button, { variant: "outline-primary", size: "sm", className: "mb-2", onClick: () => {
                                // TODO: Add save functionality
                                alert("Save functionality will be implemented here");
                            } }, "Save Changes")))))),
        React.createElement(ToastContainer, { position: "top-end", className: "p-3" },
            React.createElement(Toast, { show: showToast, onClose: () => setShowToast(false), delay: 3000, autohide: true, bg: toastVariant },
                React.createElement(Toast.Header, null,
                    React.createElement("strong", { className: "me-auto" }, "Command Status")),
                React.createElement(Toast.Body, { className: "text-white" }, toastMessage)))));
};
// Simple file tree item component
const FileTreeItem = ({ name, isFile, level, isSelected, exists = true, onClick }) => {
    const displayName = name
        .replace(".json", "")
        .replace(".txt", "")
        .replace(".log", "")
        .replace(/_/g, " ")
        .replace(/^std/, "Standard ")
        .replace(/^exit/, "Exit Code")
        .split('/').pop();
    return (React.createElement("div", { className: `d-flex align-items-center py-1 ${isSelected ? 'text-primary fw-bold' : exists ? 'text-dark' : 'text-muted'}`, style: {
            paddingLeft: `${level * 16}px`,
            cursor: exists ? 'pointer' : 'not-allowed',
            fontSize: '0.875rem',
            opacity: exists ? 1 : 0.6
        }, onClick: exists ? onClick : undefined, title: exists ? undefined : "File not found or empty" },
        React.createElement("i", { className: `bi ${isFile ? (exists ? 'bi-file-earmark-text' : 'bi-file-earmark') : 'bi-folder'} me-1` }),
        React.createElement("span", null, displayName),
        !exists && (React.createElement("i", { className: "bi bi-question-circle ms-1", title: "File not found or empty" }))));
};
const ArtifactTree = ({ treeData, projectName, testName, runtime, onSelect, level = 0, basePath = '' }) => {
    const [expanded, setExpanded] = useState({});
    const toggleExpand = (path) => {
        setExpanded(prev => (Object.assign(Object.assign({}, prev), { [path]: !prev[path] })));
    };
    return (React.createElement("ul", { className: "list-unstyled", style: { paddingLeft: `${level * 16}px` } }, Object.entries(treeData).map(([name, node]) => {
        const fullPath = basePath ? `${basePath}/${name}` : name;
        const isExpanded = expanded[fullPath];
        if (node.__isFile) {
            return (React.createElement("li", { key: fullPath, className: "py-1" },
                React.createElement("a", { href: `reports/${projectName}/${testName
                        .split('.')
                        .slice(0, -1)
                        .join('.')}/${runtime}/${node.path}`, target: "_blank", rel: "noopener noreferrer", className: "text-decoration-none", onClick: (e) => {
                        e.preventDefault();
                        onSelect(node.path);
                    } },
                    React.createElement("i", { className: "bi bi-file-earmark-text me-2" }),
                    name)));
        }
        else {
            return (React.createElement("li", { key: fullPath, className: "py-1" },
                React.createElement("div", { className: "d-flex align-items-center" },
                    React.createElement("button", { className: "btn btn-link text-start p-0 text-decoration-none me-1", onClick: () => toggleExpand(fullPath) },
                        React.createElement("i", { className: `bi ${isExpanded ? 'bi-folder2-open' : 'bi-folder'} me-2` }),
                        name)),
                isExpanded && (React.createElement(ArtifactTree, { treeData: node, projectName: projectName, testName: testName, runtime: runtime, onSelect: onSelect, level: level + 1, basePath: fullPath }))));
        }
    })));
};
const buildArtifactTree = (testData) => {
    var _a;
    const artifactPaths = new Set();
    (_a = testData.givens) === null || _a === void 0 ? void 0 : _a.forEach((given) => {
        var _a, _b, _c;
        (_a = given.artifacts) === null || _a === void 0 ? void 0 : _a.forEach((artifact) => artifactPaths.add(artifact));
        (_b = given.whens) === null || _b === void 0 ? void 0 : _b.forEach((when) => { var _a; return (_a = when.artifacts) === null || _a === void 0 ? void 0 : _a.forEach((artifact) => artifactPaths.add(artifact)); });
        (_c = given.thens) === null || _c === void 0 ? void 0 : _c.forEach((then) => { var _a; return (_a = then.artifacts) === null || _a === void 0 ? void 0 : _a.forEach((artifact) => artifactPaths.add(artifact)); });
    });
    const sortedArtifacts = Array.from(artifactPaths).sort();
    return sortedArtifacts.reduce((tree, artifactPath) => {
        const parts = artifactPath.split('/');
        let currentLevel = tree;
        parts.forEach((part, i) => {
            if (!currentLevel[part]) {
                currentLevel[part] = i === parts.length - 1
                    ? { __isFile: true, path: artifactPath }
                    : {};
            }
            currentLevel = currentLevel[part];
        });
        return tree;
    }, {});
};
const LogNavItem = ({ logName, logContent, activeTab, setActiveTab, setSelectedFile, errorCounts, decodedTestPath, testsExist, }) => {
    const displayName = logName
        .replace(".json", "")
        .replace(".txt", "")
        .replace(".log", "")
        .replace(/_/g, " ")
        .replace(/^std/, "Standard ")
        .replace(/^exit/, "Exit Code");
    const logValue = typeof logContent === "string" ? logContent.trim() : "";
    let statusIndicator = null;
    if (logName === STANDARD_LOGS.TYPE_ERRORS &&
        (errorCounts.typeErrors > 0 || (logValue && logValue !== "0"))) {
        statusIndicator = (React.createElement("span", { className: "ms-1" },
            "\u274C ",
            errorCounts.typeErrors || (logValue ? 1 : 0)));
    }
    else if (logName === STANDARD_LOGS.LINT_ERRORS &&
        (errorCounts.staticErrors > 0 || (logValue && logValue !== "0"))) {
        statusIndicator = (React.createElement("span", { className: "ms-1" },
            "\u274C ",
            errorCounts.staticErrors || (logValue ? 1 : 0)));
    }
    else if (logName === RUNTIME_SPECIFIC_LOGS.node.STDERR &&
        (errorCounts.runTimeErrors > 0 || (logValue && logValue !== "0"))) {
        statusIndicator = (React.createElement("span", { className: "ms-1" },
            "\u274C ",
            errorCounts.runTimeErrors || (logValue ? 1 : 0)));
    }
    else if (logName === STANDARD_LOGS.EXIT && logValue !== "0") {
        statusIndicator = React.createElement("span", { className: "ms-1" },
            "\u26A0\uFE0F ",
            logValue);
    }
    else if (logName === STANDARD_LOGS.TESTS && logValue) {
        statusIndicator = (React.createElement("div", { className: "ms-1" },
            React.createElement(TestStatusBadge, { testName: decodedTestPath, testsExist: testsExist, runTimeErrors: errorCounts.runTimeErrors, typeErrors: errorCounts.typeErrors, staticErrors: errorCounts.staticErrors, variant: "compact", className: "mt-1" })));
    }
    return (React.createElement(Nav.Item, { key: logName },
        React.createElement(Nav.Link, { eventKey: logName, active: activeTab === logName, onClick: () => {
                setActiveTab(logName);
                setSelectedFile({
                    path: logName,
                    content: typeof logContent === "string"
                        ? logContent
                        : JSON.stringify(logContent, null, 2),
                    language: logName.endsWith(".json")
                        ? "json"
                        : logName.endsWith(".txt")
                            ? "plaintext"
                            : logName.endsWith(".log")
                                ? "log"
                                : "plaintext",
                });
            }, className: "d-flex flex-column align-items-start" },
            React.createElement("div", { className: "d-flex justify-content-between w-100" },
                React.createElement("span", { className: "text-capitalize" }, displayName),
                statusIndicator))));
};
