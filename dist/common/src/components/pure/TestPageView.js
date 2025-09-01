"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPageView = void 0;
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const react_router_dom_1 = require("react-router-dom");
const App_1 = require("../../App");
const logFiles_1 = require("../../utils/logFiles");
const react_bootstrap_2 = require("react-bootstrap");
const react_2 = require("@monaco-editor/react");
const NavBar_1 = require("./NavBar");
const TestStatusBadge_1 = require("../TestStatusBadge");
const FileTree = ({ data, onSelect, level = 0, selectedSourcePath }) => {
    const [expanded, setExpanded] = (0, react_1.useState)({});
    const toggleExpand = (path) => {
        setExpanded((prev) => (Object.assign(Object.assign({}, prev), { [path]: !prev[path] })));
    };
    return (react_1.default.createElement("div", null, Object.entries(data).map(([name, node]) => {
        const path = Object.keys(expanded).find((k) => k.endsWith(name)) || name;
        const isExpanded = expanded[path];
        if (node.__isFile) {
            return (react_1.default.createElement(FileTreeItem, { key: name, name: name, isFile: true, level: level, isSelected: selectedSourcePath === path, onClick: () => onSelect(path, node.content) }));
        }
        else {
            return (react_1.default.createElement("div", { key: name },
                react_1.default.createElement("div", { className: "d-flex align-items-center py-1 text-dark", style: {
                        paddingLeft: `${level * 16}px`,
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                    }, onClick: () => toggleExpand(path) },
                    react_1.default.createElement("i", { className: `bi ${isExpanded ? 'bi-folder2-open' : 'bi-folder'} me-1` }),
                    react_1.default.createElement("span", null, name)),
                isExpanded && (react_1.default.createElement(FileTree, { data: node, onSelect: onSelect, level: level + 1, selectedSourcePath: selectedSourcePath }))));
        }
    })));
};
const TestPageView = ({ projectName, testName, decodedTestPath, runtime, testsExist, errorCounts, logs, isWebSocketConnected, }) => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [showAiderModal, setShowAiderModal] = (0, react_1.useState)(false);
    const [messageOption, setMessageOption] = (0, react_1.useState)('default');
    const [customMessage, setCustomMessage] = (0, react_1.useState)(typeof logs['message.txt'] === 'string' ? logs['message.txt'] : 'make a script that prints hello');
    const [showToast, setShowToast] = (0, react_1.useState)(false);
    const [toastMessage, setToastMessage] = (0, react_1.useState)('');
    const [toastVariant, setToastVariant] = (0, react_1.useState)('success');
    const [expandedSections, setExpandedSections] = (0, react_1.useState)({
        standardLogs: true,
        runtimeLogs: true,
        sourceFiles: true,
        buildErrors: true,
    });
    const [isNavbarCollapsed, setIsNavbarCollapsed] = (0, react_1.useState)(false);
    // Extract build errors and warnings relevant to this test
    const [buildErrors, setBuildErrors] = (0, react_1.useState)({ errors: [], warnings: [] });
    (0, react_1.useEffect)(() => {
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
            const normalizedTestName = testName.replace(/\\/g, '/');
            const normalizedEntryPoint = output.entryPoint ? output.entryPoint.replace(/\\/g, '/') : '';
            if (normalizedEntryPoint.includes(normalizedTestName)) {
                Object.keys(output.inputs || {}).forEach((inputPath) => {
                    sourceFilesSet.add(inputPath.replace(/\\/g, '/'));
                });
            }
        });
        // Filter errors and warnings to those originating from source files of this test
        const filteredErrors = (((_b = logs.build_logs) === null || _b === void 0 ? void 0 : _b.errors) || []).filter((err) => {
            if (!err.location || !err.location.file)
                return false;
            return sourceFilesSet.has(err.location.file.replace(/\\/g, '/'));
        });
        const filteredWarnings = (((_c = logs.build_logs) === null || _c === void 0 ? void 0 : _c.warnings) || []).filter((warn) => {
            if (!warn.location || !warn.location.file)
                return false;
            return sourceFilesSet.has(warn.location.file.replace(/\\/g, '/'));
        });
        setBuildErrors({ errors: filteredErrors, warnings: filteredWarnings });
    }, [logs, testName]);
    // Update customMessage when logs change
    (0, react_1.useEffect)(() => {
        if (typeof logs['message.txt'] === 'string' && logs['message.txt'].trim()) {
            setCustomMessage(logs['message.txt']);
        }
    }, [logs]);
    // Use the centralized WebSocket from App context
    const ws = (0, App_1.useWebSocket)();
    const [activeTab, setActiveTab] = react_1.default.useState("tests.json");
    const [selectedFile, setSelectedFile] = (0, react_1.useState)(null);
    const [selectedSourcePath, setSelectedSourcePath] = (0, react_1.useState)(null);
    const [editorTheme, setEditorTheme] = (0, react_1.useState)("vs-dark");
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
        return (react_1.default.createElement("div", { className: "test-results" },
            testData.givens.map((given, i) => (react_1.default.createElement("div", { key: i, className: "mb-4 card" },
                react_1.default.createElement("div", { className: "card-header bg-primary text-white" },
                    react_1.default.createElement("div", { className: "d-flex justify-content-between align-items-center" },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("h4", null,
                                "Given: ",
                                given.name),
                            given.features && given.features.length > 0 && (react_1.default.createElement("div", { className: "mt-1" },
                                react_1.default.createElement("small", null, "Features:"),
                                react_1.default.createElement("ul", { className: "list-unstyled" }, given.features.map((feature, fi) => (react_1.default.createElement("li", { key: fi }, feature.startsWith("http") ? (react_1.default.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer", className: "text-white" }, new URL(feature).hostname)) : (react_1.default.createElement("span", { className: "text-white" }, feature))))))))),
                        given.artifacts && given.artifacts.length > 0 && (react_1.default.createElement("div", { className: "dropdown" },
                            react_1.default.createElement("button", { className: "btn btn-sm btn-light dropdown-toggle", type: "button", "data-bs-toggle": "dropdown" },
                                "Artifacts (",
                                given.artifacts.length,
                                ")"),
                            react_1.default.createElement("ul", { className: "dropdown-menu dropdown-menu-end" }, given.artifacts.map((artifact, ai) => (react_1.default.createElement("li", { key: ai },
                                react_1.default.createElement("a", { className: "dropdown-item", href: `reports/${projectName}/${testName
                                        .split(".")
                                        .slice(0, -1)
                                        .join(".")}/${runtime}/${artifact}`, target: "_blank", rel: "noopener noreferrer" }, artifact.split("/").pop()))))))))),
                react_1.default.createElement("div", { className: "card-body" },
                    given.whens.map((when, j) => (react_1.default.createElement("div", { key: `w-${j}`, className: `p-3 mb-2 ${when.error
                            ? "bg-danger text-white"
                            : "bg-success text-white"}` },
                        react_1.default.createElement("div", { className: "d-flex justify-content-between align-items-start" },
                            react_1.default.createElement("div", null,
                                react_1.default.createElement("div", null,
                                    react_1.default.createElement("strong", null, "When:"),
                                    " ",
                                    when.name,
                                    when.features && when.features.length > 0 && (react_1.default.createElement("div", { className: "mt-2" },
                                        react_1.default.createElement("small", null, "Features:"),
                                        react_1.default.createElement("ul", { className: "list-unstyled" }, when.features.map((feature, fi) => (react_1.default.createElement("li", { key: fi }, feature.startsWith("http") ? (react_1.default.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer" }, new URL(feature).hostname)) : (feature))))))),
                                    when.error && react_1.default.createElement("pre", { className: "mt-2" }, when.error))),
                            when.artifacts && when.artifacts.length > 0 && (react_1.default.createElement("div", { className: "ms-3" },
                                react_1.default.createElement("strong", null, "Artifacts:"),
                                react_1.default.createElement("ul", { className: "list-unstyled" }, when.artifacts.map((artifact, ai) => (react_1.default.createElement("li", { key: ai },
                                    react_1.default.createElement("a", { href: `reports/${projectName}/${testName
                                            .split(".")
                                            .slice(0, -1)
                                            .join(".")}/${runtime}/${artifact}`, target: "_blank", className: "text-white", rel: "noopener noreferrer" }, artifact.split("/").pop()))))))))))),
                    given.thens.map((then, k) => (react_1.default.createElement("div", { key: `t-${k}`, className: `p-3 mb-2 ${then.error
                            ? "bg-danger text-white"
                            : "bg-success text-white"}` },
                        react_1.default.createElement("div", { className: "d-flex justify-content-between align-items-start" },
                            react_1.default.createElement("div", null,
                                react_1.default.createElement("div", null,
                                    react_1.default.createElement("strong", null, "Then:"),
                                    " ",
                                    then.name,
                                    then.features && then.features.length > 0 && (react_1.default.createElement("div", { className: "mt-2" },
                                        react_1.default.createElement("small", null, "Features:"),
                                        react_1.default.createElement("ul", { className: "list-unstyled" }, then.features.map((feature, fi) => (react_1.default.createElement("li", { key: fi }, feature.startsWith("http") ? (react_1.default.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer" }, new URL(feature).hostname)) : (feature))))))),
                                    then.error && react_1.default.createElement("pre", { className: "mt-2" }, then.error))),
                            then.artifacts && then.artifacts.length > 0 && (react_1.default.createElement("div", { className: "ms-3" },
                                react_1.default.createElement("strong", null, "Artifacts:"),
                                react_1.default.createElement("ul", { className: "list-unstyled" }, then.artifacts.map((artifact, ai) => (react_1.default.createElement("li", { key: ai },
                                    react_1.default.createElement("a", { href: `reports/${projectName}/${testName
                                            .split(".")
                                            .slice(0, -1)
                                            .join(".")}/${runtime}/${artifact}`, target: "_blank", className: "text-white", rel: "noopener noreferrer" }, artifact.split("/").pop()))))))))))))))),
            (buildErrors.errors.length > 0 || buildErrors.warnings.length > 0) && (react_1.default.createElement("div", { className: "mb-4 card border-danger" },
                react_1.default.createElement("div", { className: "card-header bg-danger text-white" },
                    react_1.default.createElement("h4", null, "Build Errors and Warnings")),
                react_1.default.createElement("div", { className: "card-body" },
                    buildErrors.errors.length > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement("h5", null, "Errors"),
                        react_1.default.createElement("ul", null, buildErrors.errors.map((error, idx) => (react_1.default.createElement("li", { key: `build-error-${idx}` },
                            react_1.default.createElement("strong", null, error.text),
                            error.location && (react_1.default.createElement("div", null,
                                "File: ",
                                error.location.file,
                                " Line: ",
                                error.location.line,
                                " Column: ",
                                error.location.column)))))))),
                    buildErrors.warnings.length > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement("h5", null, "Warnings"),
                        react_1.default.createElement("ul", null, buildErrors.warnings.map((warning, idx) => (react_1.default.createElement("li", { key: `build-warning-${idx}` },
                            react_1.default.createElement("strong", null, warning.text),
                            warning.location && (react_1.default.createElement("div", null,
                                "File: ",
                                warning.location.file,
                                " Line: ",
                                warning.location.line,
                                " Column: ",
                                warning.location.column)))))))))))));
    };
    console.log("Rendering TestPageView with logs:", {
        logKeys: Object.keys(logs),
        sourceFiles: logs.source_files ? Object.keys(logs.source_files) : null,
        selectedFile,
        activeTab,
    });
    return (react_1.default.createElement(react_bootstrap_2.Container, { fluid: true, className: "px-0" },
        react_1.default.createElement(NavBar_1.NavBar, { title: decodedTestPath, backLink: `/projects/${projectName}`, navItems: [
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
            ], rightContent: react_1.default.createElement(react_bootstrap_2.Button, { variant: "info", onClick: () => setShowAiderModal(true), className: "ms-2", title: isWebSocketConnected ? "AI Assistant" : "AI Assistant (WebSocket not connected)", disabled: !isWebSocketConnected },
                "\uD83E\uDD16",
                !isWebSocketConnected && (react_1.default.createElement("span", { className: "ms-1" }, "\uD83D\uDD34"))) }),
        react_1.default.createElement(react_bootstrap_2.Modal, { show: showAiderModal, onHide: () => setShowAiderModal(false), size: "lg", onShow: () => setMessageOption('default') },
            react_1.default.createElement(react_bootstrap_2.Modal.Header, { closeButton: true },
                react_1.default.createElement(react_bootstrap_2.Modal.Title, null, "Aider")),
            react_1.default.createElement(react_bootstrap_2.Modal.Body, null,
                react_1.default.createElement("div", { className: "mb-3" },
                    react_1.default.createElement("div", { className: "form-check" },
                        react_1.default.createElement("input", { className: "form-check-input", type: "radio", name: "messageOption", id: "defaultMessage", value: "default", checked: messageOption === 'default', onChange: () => setMessageOption('default') }),
                        react_1.default.createElement("label", { className: "form-check-label", htmlFor: "defaultMessage" }, "Use default message.txt")),
                    react_1.default.createElement("div", { className: "form-check" },
                        react_1.default.createElement("input", { className: "form-check-input", type: "radio", name: "messageOption", id: "customMessage", value: "custom", checked: messageOption === 'custom', onChange: () => setMessageOption('custom') }),
                        react_1.default.createElement("label", { className: "form-check-label", htmlFor: "customMessage" }, "Use custom message")),
                    messageOption === 'custom' && (react_1.default.createElement("div", { className: "mt-2" },
                        react_1.default.createElement("textarea", { className: "form-control", rows: 8, placeholder: "Enter your custom message", value: customMessage, onChange: (e) => setCustomMessage(e.target.value), style: { minHeight: '500px' } }))))),
            react_1.default.createElement(react_bootstrap_2.Modal.Footer, null,
                react_1.default.createElement(react_bootstrap_2.Button, { variant: "primary", onClick: async () => {
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
                            // Send command to server via the centralized WebSocket
                            if (ws && ws.readyState === WebSocket.OPEN) {
                                ws.send(JSON.stringify({
                                    type: 'executeCommand',
                                    command: command
                                }));
                                setToastMessage('Command sent to server');
                                setToastVariant('success');
                                setShowToast(true);
                                setShowAiderModal(false);
                                // Navigate to process manager page
                                setTimeout(() => {
                                    navigate('/processes');
                                }, 1000);
                            }
                            else {
                                setToastMessage('WebSocket connection not ready');
                                setToastVariant('danger');
                                setShowToast(true);
                            }
                        }
                        catch (err) {
                            console.error("WebSocket error:", err);
                            setToastMessage('Error preparing command');
                            setToastVariant('danger');
                            setShowToast(true);
                        }
                    } }, "Run Aider Command"))),
        react_1.default.createElement(react_bootstrap_2.Row, { className: "g-0" },
            react_1.default.createElement(react_bootstrap_2.Col, { sm: 3, className: "border-end", style: {
                    height: "calc(100vh - 56px)",
                    overflow: "auto",
                    backgroundColor: '#f8f9fa'
                } },
                react_1.default.createElement("div", { className: "p-2 border-bottom" },
                    react_1.default.createElement("small", { className: "fw-bold text-muted" }, "EXPLORER")),
                react_1.default.createElement("div", { className: "p-2" },
                    react_1.default.createElement("div", { className: "d-flex align-items-center text-muted mb-1", style: { cursor: 'pointer', fontSize: '0.875rem' }, onClick: () => setExpandedSections(prev => (Object.assign(Object.assign({}, prev), { standardLogs: !prev.standardLogs }))) },
                        react_1.default.createElement("i", { className: `bi bi-chevron-${expandedSections.standardLogs ? 'down' : 'right'} me-1` }),
                        react_1.default.createElement("span", null, "Standard Logs")),
                    expandedSections.standardLogs && (react_1.default.createElement("div", null, Object.values(logFiles_1.STANDARD_LOGS).map((logName) => {
                        const logContent = logs ? logs[logName] : undefined;
                        const exists = logContent !== undefined &&
                            ((typeof logContent === "string" && logContent.trim() !== "") ||
                                (typeof logContent === "object" && logContent !== null && Object.keys(logContent).length > 0));
                        return (react_1.default.createElement(FileTreeItem, { key: logName, name: logName, isFile: true, level: 1, isSelected: activeTab === logName, exists: exists, onClick: () => {
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
                runtime && logFiles_1.RUNTIME_SPECIFIC_LOGS[runtime] &&
                    Object.values(logFiles_1.RUNTIME_SPECIFIC_LOGS[runtime]).length > 0 && (react_1.default.createElement("div", { className: "p-2" },
                    react_1.default.createElement("div", { className: "d-flex align-items-center text-muted mb-1", style: { cursor: 'pointer', fontSize: '0.875rem' }, onClick: () => setExpandedSections(prev => (Object.assign(Object.assign({}, prev), { runtimeLogs: !prev.runtimeLogs }))) },
                        react_1.default.createElement("i", { className: `bi bi-chevron-${expandedSections.runtimeLogs ? 'down' : 'right'} me-1` }),
                        react_1.default.createElement("span", null, "Runtime Logs")),
                    expandedSections.runtimeLogs && (react_1.default.createElement("div", null, Object.values(logFiles_1.RUNTIME_SPECIFIC_LOGS[runtime]).map((logName) => {
                        const logContent = logs ? logs[logName] : undefined;
                        const exists = logContent !== undefined &&
                            ((typeof logContent === "string" && logContent.trim() !== "") ||
                                (typeof logContent === "object" && logContent !== null && Object.keys(logContent).length > 0));
                        return (react_1.default.createElement(FileTreeItem, { key: logName, name: logName, isFile: true, level: 1, isSelected: activeTab === logName, exists: exists, onClick: () => {
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
                logs && logs.source_files && (react_1.default.createElement("div", { className: "p-2" },
                    react_1.default.createElement("div", { className: "d-flex align-items-center text-muted mb-1", style: { cursor: 'pointer', fontSize: '0.875rem' }, onClick: () => setExpandedSections(prev => (Object.assign(Object.assign({}, prev), { sourceFiles: !prev.sourceFiles }))) },
                        react_1.default.createElement("i", { className: `bi bi-chevron-${expandedSections.sourceFiles ? 'down' : 'right'} me-1` }),
                        react_1.default.createElement("span", null, "Source Files")),
                    expandedSections.sourceFiles && (react_1.default.createElement("div", null,
                        react_1.default.createElement(FileTree, { data: logs.source_files, onSelect: (path, content) => {
                                setActiveTab("source_file");
                                setSelectedSourcePath(path);
                                setSelectedFile({
                                    path,
                                    content,
                                    language: getLanguage(path),
                                });
                            }, level: 1, selectedSourcePath: selectedSourcePath })))))),
            react_1.default.createElement(react_bootstrap_2.Col, { sm: 6, className: "border-end p-0", style: { height: "calc(100vh - 56px)", overflow: "hidden" } },
                react_1.default.createElement(react_2.Editor, { height: "100%", path: (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path) || "empty", defaultLanguage: (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.language) || "plaintext", value: (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.content) || "// Select a file to view its contents", theme: editorTheme, options: {
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: "on",
                        automaticLayout: true,
                        readOnly: !(selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.includes("source_files")),
                    } })),
            react_1.default.createElement(react_bootstrap_2.Col, { sm: 3, className: "p-0 border-start", style: { height: "calc(100vh - 56px)", overflow: "auto" } },
                react_1.default.createElement("div", { className: "p-3" },
                    (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.endsWith("tests.json")) && (react_1.default.createElement("div", { className: "test-results-preview" }, typeof selectedFile.content === "string"
                        ? renderTestResults(JSON.parse(selectedFile.content))
                        : renderTestResults(selectedFile.content))),
                    (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.match(/\.(png|jpg|jpeg|gif|svg)$/i)) && (react_1.default.createElement("div", { className: "text-center" },
                        react_1.default.createElement("img", { src: selectedFile.content, alt: selectedFile.path, className: "img-fluid", style: { maxHeight: '300px' } }),
                        react_1.default.createElement("div", { className: "mt-2" },
                            react_1.default.createElement("a", { href: selectedFile.content, target: "_blank", rel: "noopener noreferrer", className: "btn btn-sm btn-outline-primary" }, "Open Full Size")))),
                    (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.endsWith("build.json")) && (react_1.default.createElement("div", null,
                        react_1.default.createElement("h5", null, "Build Information"),
                        (() => {
                            var _a, _b;
                            try {
                                const buildData = JSON.parse(selectedFile.content);
                                return (react_1.default.createElement(react_1.default.Fragment, null,
                                    ((_a = buildData.errors) === null || _a === void 0 ? void 0 : _a.length) > 0 && (react_1.default.createElement("div", { className: "mb-3" },
                                        react_1.default.createElement("h6", { className: "text-danger" },
                                            "Errors (",
                                            buildData.errors.length,
                                            ")"),
                                        react_1.default.createElement("ul", { className: "list-unstyled" }, buildData.errors.map((error, index) => (react_1.default.createElement("li", { key: index, className: "mb-2 p-2 bg-light rounded" },
                                            react_1.default.createElement("div", { className: "text-danger fw-bold" }, error.text),
                                            error.location && (react_1.default.createElement("div", { className: "small text-muted" },
                                                "File: ",
                                                error.location.file,
                                                "Line: ",
                                                error.location.line,
                                                "Column: ",
                                                error.location.column)),
                                            error.notes && error.notes.length > 0 && (react_1.default.createElement("div", { className: "small" },
                                                "Notes:",
                                                react_1.default.createElement("ul", null, error.notes.map((note, noteIndex) => (react_1.default.createElement("li", { key: noteIndex }, note.text)))))))))))),
                                    ((_b = buildData.warnings) === null || _b === void 0 ? void 0 : _b.length) > 0 && (react_1.default.createElement("div", { className: "mb-3" },
                                        react_1.default.createElement("h6", { className: "text-warning" },
                                            "Warnings (",
                                            buildData.warnings.length,
                                            ")"),
                                        react_1.default.createElement("ul", { className: "list-unstyled" }, buildData.warnings.map((warning, index) => (react_1.default.createElement("li", { key: index, className: "mb-2 p-2 bg-light rounded" },
                                            react_1.default.createElement("div", { className: "text-warning fw-bold" }, warning.text),
                                            warning.location && (react_1.default.createElement("div", { className: "small text-muted" },
                                                "File: ",
                                                warning.location.file,
                                                "Line: ",
                                                warning.location.line,
                                                "Column: ",
                                                warning.location.column)),
                                            warning.notes && warning.notes.length > 0 && (react_1.default.createElement("div", { className: "small" },
                                                "Notes:",
                                                react_1.default.createElement("ul", null, warning.notes.map((note, noteIndex) => (react_1.default.createElement("li", { key: noteIndex }, note.text)))))))))))),
                                    (!buildData.errors || buildData.errors.length === 0) &&
                                        (!buildData.warnings || buildData.warnings.length === 0) && (react_1.default.createElement("div", { className: "alert alert-success" }, "No build errors or warnings"))));
                            }
                            catch (e) {
                                return (react_1.default.createElement("div", { className: "alert alert-danger" },
                                    "Error parsing build.json: ",
                                    e.message));
                            }
                        })())),
                    (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.endsWith(".json")) &&
                        !selectedFile.path.endsWith("tests.json") &&
                        !selectedFile.path.endsWith("build.json") && (react_1.default.createElement("pre", { className: "bg-light p-2 small" },
                        react_1.default.createElement("code", null, selectedFile.content))),
                    (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.includes("source_files")) && (react_1.default.createElement("div", null,
                        react_1.default.createElement("div", { className: "mb-2 small text-muted" },
                            react_1.default.createElement("i", { className: "bi bi-file-earmark-text me-1" }),
                            selectedFile.path.split('/').pop()),
                        react_1.default.createElement(react_bootstrap_2.Button, { variant: "outline-primary", size: "sm", className: "mb-2", onClick: () => {
                                // TODO: Add save functionality
                                alert("Save functionality will be implemented here");
                            } }, "Save Changes")))))),
        react_1.default.createElement(react_bootstrap_1.ToastContainer, { position: "top-end", className: "p-3" },
            react_1.default.createElement(react_bootstrap_1.Toast, { show: showToast, onClose: () => setShowToast(false), delay: 3000, autohide: true, bg: toastVariant },
                react_1.default.createElement(react_bootstrap_1.Toast.Header, null,
                    react_1.default.createElement("strong", { className: "me-auto" }, "Command Status")),
                react_1.default.createElement(react_bootstrap_1.Toast.Body, { className: "text-white" }, toastMessage)))));
};
exports.TestPageView = TestPageView;
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
    return (react_1.default.createElement("div", { className: `d-flex align-items-center py-1 ${isSelected ? 'text-primary fw-bold' : exists ? 'text-dark' : 'text-muted'}`, style: {
            paddingLeft: `${level * 16}px`,
            cursor: exists ? 'pointer' : 'not-allowed',
            fontSize: '0.875rem',
            opacity: exists ? 1 : 0.6
        }, onClick: exists ? onClick : undefined, title: exists ? undefined : "File not found or empty" },
        react_1.default.createElement("i", { className: `bi ${isFile ? (exists ? 'bi-file-earmark-text' : 'bi-file-earmark') : 'bi-folder'} me-1` }),
        react_1.default.createElement("span", null, displayName),
        !exists && (react_1.default.createElement("i", { className: "bi bi-question-circle ms-1", title: "File not found or empty" }))));
};
const ArtifactTree = ({ treeData, projectName, testName, runtime, onSelect, level = 0, basePath = '' }) => {
    const [expanded, setExpanded] = (0, react_1.useState)({});
    const toggleExpand = (path) => {
        setExpanded(prev => (Object.assign(Object.assign({}, prev), { [path]: !prev[path] })));
    };
    return (react_1.default.createElement("ul", { className: "list-unstyled", style: { paddingLeft: `${level * 16}px` } }, Object.entries(treeData).map(([name, node]) => {
        const fullPath = basePath ? `${basePath}/${name}` : name;
        const isExpanded = expanded[fullPath];
        if (node.__isFile) {
            return (react_1.default.createElement("li", { key: fullPath, className: "py-1" },
                react_1.default.createElement("a", { href: `reports/${projectName}/${testName
                        .split('.')
                        .slice(0, -1)
                        .join('.')}/${runtime}/${node.path}`, target: "_blank", rel: "noopener noreferrer", className: "text-decoration-none", onClick: (e) => {
                        e.preventDefault();
                        onSelect(node.path);
                    } },
                    react_1.default.createElement("i", { className: "bi bi-file-earmark-text me-2" }),
                    name)));
        }
        else {
            return (react_1.default.createElement("li", { key: fullPath, className: "py-1" },
                react_1.default.createElement("div", { className: "d-flex align-items-center" },
                    react_1.default.createElement("button", { className: "btn btn-link text-start p-0 text-decoration-none me-1", onClick: () => toggleExpand(fullPath) },
                        react_1.default.createElement("i", { className: `bi ${isExpanded ? 'bi-folder2-open' : 'bi-folder'} me-2` }),
                        name)),
                isExpanded && (react_1.default.createElement(ArtifactTree, { treeData: node, projectName: projectName, testName: testName, runtime: runtime, onSelect: onSelect, level: level + 1, basePath: fullPath }))));
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
    if (logName === logFiles_1.STANDARD_LOGS.TYPE_ERRORS &&
        (errorCounts.typeErrors > 0 || (logValue && logValue !== "0"))) {
        statusIndicator = (react_1.default.createElement("span", { className: "ms-1" },
            "\u274C ",
            errorCounts.typeErrors || (logValue ? 1 : 0)));
    }
    else if (logName === logFiles_1.STANDARD_LOGS.LINT_ERRORS &&
        (errorCounts.staticErrors > 0 || (logValue && logValue !== "0"))) {
        statusIndicator = (react_1.default.createElement("span", { className: "ms-1" },
            "\u274C ",
            errorCounts.staticErrors || (logValue ? 1 : 0)));
    }
    else if (logName === logFiles_1.RUNTIME_SPECIFIC_LOGS.node.STDERR &&
        (errorCounts.runTimeErrors > 0 || (logValue && logValue !== "0"))) {
        statusIndicator = (react_1.default.createElement("span", { className: "ms-1" },
            "\u274C ",
            errorCounts.runTimeErrors || (logValue ? 1 : 0)));
    }
    else if (logName === logFiles_1.STANDARD_LOGS.EXIT && logValue !== "0") {
        statusIndicator = react_1.default.createElement("span", { className: "ms-1" },
            "\u26A0\uFE0F ",
            logValue);
    }
    else if (logName === logFiles_1.STANDARD_LOGS.TESTS && logValue) {
        statusIndicator = (react_1.default.createElement("div", { className: "ms-1" },
            react_1.default.createElement(TestStatusBadge_1.TestStatusBadge, { testName: decodedTestPath, testsExist: testsExist, runTimeErrors: errorCounts.runTimeErrors, typeErrors: errorCounts.typeErrors, staticErrors: errorCounts.staticErrors, variant: "compact", className: "mt-1" })));
    }
    return (react_1.default.createElement(react_bootstrap_2.Nav.Item, { key: logName },
        react_1.default.createElement(react_bootstrap_2.Nav.Link, { eventKey: logName, active: activeTab === logName, onClick: () => {
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
            react_1.default.createElement("div", { className: "d-flex justify-content-between w-100" },
                react_1.default.createElement("span", { className: "text-capitalize" }, displayName),
                statusIndicator))));
};
