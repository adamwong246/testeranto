"use strict";
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
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const react_1 = __importStar(require("react"));
const logFiles_1 = require("../../utils/logFiles");
const react_bootstrap_1 = require("react-bootstrap");
const react_2 = require("@monaco-editor/react");
const NavBar_1 = require("./NavBar");
const TestStatusBadge_1 = require("../TestStatusBadge");
const FileTree = ({ data, onSelect, level = 0, selectedSourcePath }) => {
    const [expanded, setExpanded] = (0, react_1.useState)({});
    const toggleExpand = (path) => {
        setExpanded((prev) => (Object.assign(Object.assign({}, prev), { [path]: !prev[path] })));
    };
    return (react_1.default.createElement("ul", { className: "list-unstyled", style: { paddingLeft: `${level * 16}px` } }, Object.entries(data).map(([name, node]) => {
        const path = Object.keys(expanded).find((k) => k.endsWith(name)) || name;
        const isExpanded = expanded[path];
        if (node.__isFile) {
            return (react_1.default.createElement("li", { key: name, className: "py-1" },
                react_1.default.createElement("button", { className: `btn btn-link text-start p-0 text-decoration-none ${selectedSourcePath === path ? "text-primary fw-bold" : ""}`, onClick: () => onSelect(path, node.content) },
                    react_1.default.createElement("i", { className: `bi bi-file-earmark-text me-2 ${selectedSourcePath === path ? "text-primary" : ""}` }),
                    name)));
        }
        else {
            return (react_1.default.createElement("li", { key: name, className: "py-1" },
                react_1.default.createElement("div", { className: "d-flex align-items-center" },
                    react_1.default.createElement("button", { className: "btn btn-link text-start p-0 text-decoration-none me-1", onClick: () => toggleExpand(path) },
                        react_1.default.createElement("i", { className: `bi ${isExpanded ? "bi-folder2-open" : "bi-folder"} me-2` }),
                        name)),
                isExpanded && (react_1.default.createElement(FileTree, { data: node, onSelect: onSelect, level: level + 1 }))));
        }
    })));
};
const TestPageView = ({ projectName, testName, decodedTestPath, runtime, testsExist, errorCounts, logs, }) => {
    const [showAiderModal, setShowAiderModal] = (0, react_1.useState)(false);
    const [messageOption, setMessageOption] = (0, react_1.useState)('default');
    const [customMessage, setCustomMessage] = (0, react_1.useState)(typeof logs['message.txt'] === 'string' ? logs['message.txt'] : 'make a script that prints hello');
    // Update customMessage when logs change
    (0, react_1.useEffect)(() => {
        if (typeof logs['message.txt'] === 'string' && logs['message.txt'].trim()) {
            setCustomMessage(logs['message.txt']);
        }
    }, [logs]);
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
        return (react_1.default.createElement("div", { className: "test-results" }, testData.givens.map((given, i) => (react_1.default.createElement("div", { key: i, className: "mb-4 card" },
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
                                        .join(".")}/${runtime}/${artifact}`, target: "_blank", className: "text-white", rel: "noopener noreferrer" }, artifact.split("/").pop())))))))))))))))));
    };
    console.log("Rendering TestPageView with logs:", {
        logKeys: Object.keys(logs),
        sourceFiles: logs.source_files ? Object.keys(logs.source_files) : null,
        selectedFile,
        activeTab,
    });
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
            ], rightContent: react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(react_bootstrap_1.Button, { variant: "info", onClick: () => setShowAiderModal(true), className: "ms-2" }, "\uD83E\uDD16"),
                react_1.default.createElement(react_bootstrap_1.Modal, { show: showAiderModal, onHide: () => setShowAiderModal(false), size: "lg", onShow: () => setMessageOption('default') },
                    react_1.default.createElement(react_bootstrap_1.Modal.Header, { closeButton: true },
                        react_1.default.createElement(react_bootstrap_1.Modal.Title, null, "Aider")),
                    react_1.default.createElement(react_bootstrap_1.Modal.Body, null,
                        react_1.default.createElement("div", { className: "mb-3" },
                            react_1.default.createElement("div", { className: "form-check" },
                                react_1.default.createElement("input", { className: "form-check-input", type: "radio", name: "messageOption", id: "defaultMessage", value: "default", checked: messageOption === 'default', onChange: () => setMessageOption('default') }),
                                react_1.default.createElement("label", { className: "form-check-label", htmlFor: "defaultMessage" }, "Use default message.txt")),
                            react_1.default.createElement("div", { className: "form-check" },
                                react_1.default.createElement("input", { className: "form-check-input", type: "radio", name: "messageOption", id: "customMessage", value: "custom", checked: messageOption === 'custom', onChange: () => setMessageOption('custom') }),
                                react_1.default.createElement("label", { className: "form-check-label", htmlFor: "customMessage" }, "Use custom message")),
                            messageOption === 'custom' && (react_1.default.createElement("div", { className: "mt-2" },
                                react_1.default.createElement("textarea", { className: "form-control", rows: 8, placeholder: "Enter your custom message", value: customMessage, onChange: (e) => setCustomMessage(e.target.value), style: { minHeight: '500px' } }))))),
                    react_1.default.createElement(react_bootstrap_1.Modal.Footer, null,
                        react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: async () => {
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
                                    await navigator.clipboard.writeText(command);
                                    setShowAiderModal(false);
                                }
                                catch (err) {
                                    console.error("Copy failed:", err);
                                }
                            } }, "Copy Aider Command")))) }),
        react_1.default.createElement(react_bootstrap_1.Row, { className: "g-0" },
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 3, className: "border-end" },
                react_1.default.createElement(react_bootstrap_1.Nav, { variant: "pills", className: "flex-column" },
                    react_1.default.createElement("div", { className: "px-3 py-1 small text-muted" }, "Standard Logs"),
                    Object.entries(logs)
                        .filter(([logName]) => Object.values(logFiles_1.STANDARD_LOGS).includes(logName))
                        .filter(([, logContent]) => (typeof logContent === "string" && logContent.trim()) ||
                        (typeof logContent === "object" &&
                            Object.keys(logContent).length > 0))
                        .map(([logName, logContent]) => (react_1.default.createElement(LogNavItem, { key: logName, logName: logName, logContent: logContent, activeTab: activeTab, setActiveTab: setActiveTab, setSelectedFile: setSelectedFile, errorCounts: errorCounts, decodedTestPath: decodedTestPath, testsExist: testsExist }))),
                    Object.values(logFiles_1.RUNTIME_SPECIFIC_LOGS[runtime])
                        .length > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement("div", { className: "px-3 py-1 small text-muted" }, "Runtime Logs"),
                        Object.entries(logs)
                            .filter(([logName]) => Object.values(logFiles_1.RUNTIME_SPECIFIC_LOGS[runtime]).includes(logName))
                            .filter(([, logContent]) => {
                            return (typeof logContent === "string" && logContent.trim()) ||
                                (typeof logContent === "object" && Object.keys(logContent).length > 0);
                        })
                            .map(([logName, logContent]) => (react_1.default.createElement(LogNavItem, { key: logName, logName: logName, logContent: logContent, activeTab: activeTab, setActiveTab: setActiveTab, setSelectedFile: setSelectedFile, errorCounts: errorCounts, decodedTestPath: decodedTestPath, testsExist: testsExist }))))),
                    logs.source_files && (react_1.default.createElement("div", { className: "mt-2" },
                        react_1.default.createElement("div", { className: "px-3 py-1 small text-muted" }, "Source Files"),
                        react_1.default.createElement(FileTree, { data: logs.source_files, onSelect: (path, content) => {
                                setActiveTab("source_file");
                                setSelectedSourcePath(path);
                                setSelectedFile({
                                    path,
                                    content,
                                    language: getLanguage(path),
                                });
                            }, level: 0, selectedSourcePath: selectedSourcePath }))),
                    logs[logFiles_1.STANDARD_LOGS.TESTS] && (react_1.default.createElement("div", { className: "mt-2" },
                        react_1.default.createElement("div", { className: "px-3 py-1 small text-muted" }, "Artifacts"),
                        react_1.default.createElement(ArtifactTree, { treeData: buildArtifactTree(typeof logs[logFiles_1.STANDARD_LOGS.TESTS] === 'string'
                                ? JSON.parse(logs[logFiles_1.STANDARD_LOGS.TESTS])
                                : logs[logFiles_1.STANDARD_LOGS.TESTS]), projectName: projectName, testName: testName, runtime: runtime, onSelect: async (path) => {
                                setActiveTab("artifact_viewer");
                                try {
                                    const response = await fetch(`reports/${projectName}/${testName
                                        .split('.')
                                        .slice(0, -1)
                                        .join('.')}/${runtime}/${path}`);
                                    const content = await (path.match(/\.(png|jpg|jpeg|gif|svg)$/i)
                                        ? URL.createObjectURL(await response.blob())
                                        : await response.text());
                                    setSelectedFile({
                                        path,
                                        content,
                                        language: getLanguage(path),
                                    });
                                }
                                catch (err) {
                                    setSelectedFile({
                                        path,
                                        content: `Failed to load artifact: ${err}`,
                                        language: 'plaintext',
                                    });
                                }
                            }, level: 0 }))))),
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 6, className: "border-end p-0", style: { height: "calc(100vh - 56px)", overflow: "hidden" } },
                react_1.default.createElement(react_2.Editor, { height: "100%", path: (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path) || "empty", defaultLanguage: (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.language) || "plaintext", value: (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.content) || "// Select a file to view its contents", theme: editorTheme, options: {
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: "on",
                        automaticLayout: true,
                        readOnly: !(selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.includes("source_files")),
                    } })),
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 3, className: "p-0", style: { height: "calc(100vh - 56px)", overflow: "auto" } },
                react_1.default.createElement("div", { className: "p-3" }, (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.endsWith("tests.json"))
                    ? typeof selectedFile.content === "string"
                        ? renderTestResults(JSON.parse(selectedFile.content))
                        : renderTestResults(selectedFile.content)
                    : (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.includes("source_files")) ? (react_1.default.createElement("div", { className: "d-flex flex-column h-100" },
                        react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", className: "mb-2", onClick: () => {
                                // TODO: Add save functionality
                                alert("Save functionality will be implemented here");
                            } }, "Save Changes"),
                        react_1.default.createElement("div", { className: "flex-grow-1 overflow-auto" }, selectedFile && (react_1.default.createElement("pre", { className: "bg-light p-3" },
                            react_1.default.createElement("code", null, selectedFile.content)))))) : activeTab === "artifact_viewer" && selectedFile && (react_1.default.createElement("div", { className: "d-flex flex-column h-100" },
                        react_1.default.createElement("div", { className: "mb-3" },
                            react_1.default.createElement("h5", null, selectedFile.path),
                            react_1.default.createElement("a", { href: `reports/${projectName}/${testName
                                    .split('.')
                                    .slice(0, -1)
                                    .join('.')}/${runtime}/${selectedFile.path}`, target: "_blank", rel: "noopener noreferrer", className: "btn btn-primary mb-2" }, "Open Full Artifact")),
                        react_1.default.createElement("div", { className: "flex-grow-1 overflow-auto" }, selectedFile.path.match(/\.(png|jpg|jpeg|gif|svg)$/i) ? (react_1.default.createElement("img", { src: `reports/${projectName}/${testName
                                .split('.')
                                .slice(0, -1)
                                .join('.')}/${runtime}/${selectedFile.path}`, alt: selectedFile.path, className: "img-fluid", style: { maxHeight: '100%' } })) : (react_1.default.createElement("pre", { className: "bg-light p-3" },
                            react_1.default.createElement("code", null, selectedFile.content)))))))))));
};
exports.TestPageView = TestPageView;
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
    return (react_1.default.createElement(react_bootstrap_1.Nav.Item, { key: logName },
        react_1.default.createElement(react_bootstrap_1.Nav.Link, { eventKey: logName, active: activeTab === logName, onClick: () => {
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
