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
const react_router_dom_1 = require("react-router-dom");
const App_1 = require("../../App");
const logFiles_1 = require("../../utils/logFiles");
const react_bootstrap_1 = require("react-bootstrap");
const react_2 = require("@monaco-editor/react");
const NavBar_1 = require("./NavBar");
const FileTreeItem_1 = require("./FileTreeItem");
const FileTree_1 = require("./FileTree");
const ToastNotification_1 = require("./ToastNotification");
const TestPageView_utils_1 = require("./TestPageView_utils");
const TestPageView = ({ projectName, testName, decodedTestPath, runtime, testsExist, errorCounts, logs, isWebSocketConnected, }) => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [showAiderModal, setShowAiderModal] = (0, react_1.useState)(false);
    const [messageOption, setMessageOption] = (0, react_1.useState)("default");
    const [customMessage, setCustomMessage] = (0, react_1.useState)(typeof logs["message.txt"] === "string"
        ? logs["message.txt"]
        : "make a script that prints hello");
    const [showToast, setShowToast] = (0, react_1.useState)(false);
    const [toastMessage, setToastMessage] = (0, react_1.useState)("");
    const [toastVariant, setToastVariant] = (0, react_1.useState)("success");
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
    (0, react_1.useEffect)(() => {
        if (typeof logs["message.txt"] === "string" && logs["message.txt"].trim()) {
            setCustomMessage(logs["message.txt"]);
        }
    }, [logs]);
    // Use the centralized WebSocket from App context
    const wsContext = (0, App_1.useWebSocket)();
    const ws = wsContext === null || wsContext === void 0 ? void 0 : wsContext.ws;
    const [activeTab, setActiveTab] = react_1.default.useState("tests.json");
    const [selectedFile, setSelectedFile] = (0, react_1.useState)(null);
    const [selectedSourcePath, setSelectedSourcePath] = (0, react_1.useState)(null);
    const [editorTheme, setEditorTheme] = (0, react_1.useState)("vs-dark");
    return (react_1.default.createElement(react_bootstrap_1.Container, { fluid: true, className: "px-0" },
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
            ], rightContent: react_1.default.createElement(react_bootstrap_1.Button, { variant: "info", onClick: () => setShowAiderModal(true), className: "ms-2 position-relative", title: isWebSocketConnected
                    ? "AI Assistant"
                    : "AI Assistant (WebSocket not connected)", disabled: !isWebSocketConnected },
                "\uD83E\uDD16",
                !isWebSocketConnected && (react_1.default.createElement("span", { className: "position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle", title: "WebSocket disconnected" },
                    react_1.default.createElement("span", { className: "visually-hidden" }, "WebSocket disconnected")))) }),
        react_1.default.createElement(react_bootstrap_1.Modal, { show: showAiderModal, onHide: () => setShowAiderModal(false), size: "lg", onShow: () => setMessageOption("default") },
            react_1.default.createElement(react_bootstrap_1.Modal.Header, { closeButton: true },
                react_1.default.createElement(react_bootstrap_1.Modal.Title, null, "Aider")),
            react_1.default.createElement(react_bootstrap_1.Modal.Body, null,
                react_1.default.createElement("div", { className: "mb-3" },
                    react_1.default.createElement("div", { className: "form-check" },
                        react_1.default.createElement("input", { className: "form-check-input", type: "radio", name: "messageOption", id: "defaultMessage", value: "default", checked: messageOption === "default", onChange: () => setMessageOption("default") }),
                        react_1.default.createElement("label", { className: "form-check-label", htmlFor: "defaultMessage" }, "Use default message.txt")),
                    react_1.default.createElement("div", { className: "form-check" },
                        react_1.default.createElement("input", { className: "form-check-input", type: "radio", name: "messageOption", id: "customMessage", value: "custom", checked: messageOption === "custom", onChange: () => setMessageOption("custom") }),
                        react_1.default.createElement("label", { className: "form-check-label", htmlFor: "customMessage" }, "Use custom message")),
                    messageOption === "custom" && (react_1.default.createElement("div", { className: "mt-2" },
                        react_1.default.createElement("textarea", { className: "form-control", rows: 8, placeholder: "Enter your custom message", value: customMessage, onChange: (e) => setCustomMessage(e.target.value), style: { minHeight: "500px" } }))))),
            react_1.default.createElement(react_bootstrap_1.Modal.Footer, null,
                react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: async () => {
                        try {
                            const promptPath = `testeranto/reports/${projectName}/${testName
                                .split(".")
                                .slice(0, -1)
                                .join(".")}/${runtime}/prompt.txt`;
                            let command = `aider --load ${promptPath}`;
                            if (messageOption === "default") {
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
                            if (isWebSocketConnected && ws) {
                                ws.send(JSON.stringify({
                                    type: "executeCommand",
                                    command: command,
                                }));
                                setToastMessage("Command sent to server");
                                setToastVariant("success");
                                setShowToast(true);
                                setShowAiderModal(false);
                                // Navigate to process manager page
                                setTimeout(() => {
                                    navigate("/processes");
                                }, 1000);
                            }
                            else {
                                setToastMessage("WebSocket connection not ready");
                                setToastVariant("danger");
                                setShowToast(true);
                            }
                        }
                        catch (err) {
                            console.error("WebSocket error:", err);
                            setToastMessage("Error preparing command");
                            setToastVariant("danger");
                            setShowToast(true);
                        }
                    } }, "Run Aider Command"))),
        react_1.default.createElement(react_bootstrap_1.Row, { className: "g-0" },
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 3, className: "border-end", style: {
                    height: "calc(100vh - 56px)",
                    overflow: "auto",
                    backgroundColor: "#f8f9fa",
                } },
                react_1.default.createElement("div", { className: "p-2 border-bottom" },
                    react_1.default.createElement("small", { className: "fw-bold text-muted" }, "EXPLORER")),
                react_1.default.createElement("div", { className: "p-2" },
                    react_1.default.createElement("div", { className: "d-flex align-items-center text-muted mb-1", style: { cursor: "pointer", fontSize: "0.875rem" }, onClick: () => setExpandedSections((prev) => (Object.assign(Object.assign({}, prev), { standardLogs: !prev.standardLogs }))) },
                        react_1.default.createElement("i", { className: `bi bi-chevron-${expandedSections.standardLogs ? "down" : "right"} me-1` }),
                        react_1.default.createElement("span", null, "Standard Logs")),
                    expandedSections.standardLogs && (react_1.default.createElement("div", null, Object.values(logFiles_1.STANDARD_LOGS).map((logName) => {
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
                    })))),
                runtime &&
                    logFiles_1.RUNTIME_SPECIFIC_LOGS[runtime] &&
                    Object.values(logFiles_1.RUNTIME_SPECIFIC_LOGS[runtime])
                        .length > 0 && (react_1.default.createElement("div", { className: "p-2" },
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
                            }, level: 1, selectedSourcePath: selectedSourcePath })))))),
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 6, className: "border-end p-0", style: { height: "calc(100vh - 56px)", overflow: "hidden" } },
                react_1.default.createElement(react_2.Editor, { height: "100%", path: (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path) || "empty", defaultLanguage: (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.language) || "plaintext", value: (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.content) || "// Select a file to view its contents", theme: editorTheme, options: {
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: "on",
                        automaticLayout: true,
                        readOnly: !(selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.includes("source_files")),
                    } })),
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 3, className: "p-0 border-start", style: { height: "calc(100vh - 56px)", overflow: "auto" } },
                react_1.default.createElement("div", { className: "p-3" },
                    (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.endsWith("tests.json")) && (react_1.default.createElement("div", { className: "test-results-preview" }, typeof selectedFile.content === "string"
                        ? (0, TestPageView_utils_1.renderTestResults)(JSON.parse(selectedFile.content), buildErrors, projectName, testName, runtime)
                        : (0, TestPageView_utils_1.renderTestResults)(selectedFile.content, buildErrors, projectName, testName, runtime))),
                    (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.match(/\.(png|jpg|jpeg|gif|svg)$/i)) && (react_1.default.createElement("div", { className: "text-center" },
                        react_1.default.createElement("img", { src: selectedFile.content, alt: selectedFile.path, className: "img-fluid", style: { maxHeight: "300px" } }),
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
                                        react_1.default.createElement("ul", { className: "list-unstyled" }, buildData.errors.map((error, index) => (react_1.default.createElement("li", { key: index, className: "mb-2 p-2  rounded" },
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
                                        react_1.default.createElement("ul", { className: "list-unstyled" }, buildData.warnings.map((warning, index) => (react_1.default.createElement("li", { key: index, className: "mb-2 p-2  rounded" },
                                            react_1.default.createElement("div", { className: "text-warning fw-bold" }, warning.text),
                                            warning.location && (react_1.default.createElement("div", { className: "small text-muted" },
                                                "File: ",
                                                warning.location.file,
                                                "Line: ",
                                                warning.location.line,
                                                "Column: ",
                                                warning.location.column)),
                                            warning.notes &&
                                                warning.notes.length > 0 && (react_1.default.createElement("div", { className: "small" },
                                                "Notes:",
                                                react_1.default.createElement("ul", null, warning.notes.map((note, noteIndex) => (react_1.default.createElement("li", { key: noteIndex }, note.text)))))))))))),
                                    (!buildData.errors || buildData.errors.length === 0) &&
                                        (!buildData.warnings ||
                                            buildData.warnings.length === 0) && (react_1.default.createElement("div", { className: "alert alert-success" }, "No build errors or warnings"))));
                            }
                            catch (e) {
                                return (react_1.default.createElement("div", { className: "alert alert-danger" },
                                    "Error parsing build.json: ",
                                    e.message));
                            }
                        })())),
                    (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.endsWith(".json")) &&
                        !selectedFile.path.endsWith("tests.json") &&
                        !selectedFile.path.endsWith("build.json") && (react_1.default.createElement("pre", { className: " p-2 small" },
                        react_1.default.createElement("code", null, selectedFile.content))),
                    (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.includes("source_files")) && (react_1.default.createElement("div", null,
                        react_1.default.createElement("div", { className: "mb-2 small text-muted" },
                            react_1.default.createElement("i", { className: "bi bi-file-earmark-text me-1" }),
                            selectedFile.path.split("/").pop()),
                        react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-primary", size: "sm", className: "mb-2", onClick: () => {
                                // TODO: Add save functionality
                                alert("Save functionality will be implemented here");
                            } }, "Save Changes")))))),
        react_1.default.createElement(ToastNotification_1.ToastNotification, { showToast: showToast, setShowToast: setShowToast, toastVariant: toastVariant, toastMessage: toastMessage })));
};
exports.TestPageView = TestPageView;
