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
exports.ProjectsTree = void 0;
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const FileTreeItem_1 = require("../../components/pure/FileTreeItem");
const logFiles_1 = require("../../utils/logFiles");
const FileTree_1 = require("../../components/pure/FileTree");
const TestPageView_utils_1 = require("./TestPageView_utils");
const ProjectsTree = ({ projects, currentProjectName, currentTestName, setExpandedSections, expandedSections, logs, setActiveTab, setSelectedFile, runtime, selectedSourcePath, activeTab, setSelectedSourcePath, }) => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    // Always expand the first project by default
    const [expandedProjects, setExpandedProjects] = (0, react_1.useState)(() => {
        const initial = {};
        if (projects && projects.length > 0) {
            initial[projects[0]] = true;
        }
        return initial;
    });
    const [projectTests, setProjectTests] = (0, react_1.useState)({});
    const [loadingProjects, setLoadingProjects] = (0, react_1.useState)({});
    const toggleProject = async (projectName) => {
        // Toggle expansion state
        const isExpanding = !expandedProjects[projectName];
        setExpandedProjects(prev => (Object.assign(Object.assign({}, prev), { [projectName]: isExpanding })));
        // If expanding and we haven't loaded tests yet, fetch them
        if (isExpanding && !projectTests[projectName]) {
            setLoadingProjects(prev => (Object.assign(Object.assign({}, prev), { [projectName]: true })));
            try {
                const response = await fetch(`/projects/${projectName}/tests.json`);
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
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("div", { className: "d-flex align-items-center text-muted mb-1", style: { fontSize: "0.875rem", fontWeight: "bold" } },
            react_1.default.createElement("i", { className: "bi bi-folder me-1" }),
            react_1.default.createElement("span", null, "Projects")),
        (!projects || projects.length === 0) ? (react_1.default.createElement("div", { className: "ms-3 text-muted" }, "No projects available")) : (react_1.default.createElement("div", null, projects.map((project, index) => (react_1.default.createElement("div", { key: project },
            react_1.default.createElement(FileTreeItem_1.FileTreeItem, { name: project, isFile: false, level: 1, isSelected: false, exists: true, isExpanded: expandedProjects[project], onClick: () => toggleProject(project) }),
            expandedProjects[project] && (react_1.default.createElement("div", { className: "ms-4" },
                "  // Increased indentation for tests",
                loadingProjects[project] ? (react_1.default.createElement("div", { className: "text-muted small" }, "Loading tests...")) : (react_1.default.createElement(react_1.default.Fragment, null,
                    index === 0 && (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(FileTreeItem_1.FileTreeItem, { name: "Standard Logs", isFile: false, level: 2, isSelected: false, exists: true, isExpanded: expandedSections.standardLogs, onClick: () => setExpandedSections((prev) => (Object.assign(Object.assign({}, prev), { standardLogs: !prev.standardLogs }))) }),
                            expandedSections.standardLogs && (react_1.default.createElement("div", { className: "ms-4" }, Object.values(logFiles_1.STANDARD_LOGS).map((logName) => {
                                const logContent = logs ? logs[logName] : undefined;
                                const exists = logContent !== undefined &&
                                    ((typeof logContent === "string" && logContent.trim() !== "") ||
                                        (typeof logContent === "object" &&
                                            logContent !== null &&
                                            Object.keys(logContent).length > 0));
                                return (react_1.default.createElement(FileTreeItem_1.FileTreeItem, { key: logName, name: logName, isFile: true, level: 3, isSelected: activeTab === logName, exists: exists, onClick: () => {
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
                            Object.values(logFiles_1.RUNTIME_SPECIFIC_LOGS[runtime]).length > 0 && (react_1.default.createElement("div", null,
                            react_1.default.createElement(FileTreeItem_1.FileTreeItem, { name: "Runtime Logs", isFile: false, level: 2, isSelected: false, exists: true, isExpanded: expandedSections.runtimeLogs, onClick: () => setExpandedSections((prev) => (Object.assign(Object.assign({}, prev), { runtimeLogs: !prev.runtimeLogs }))) }),
                            expandedSections.runtimeLogs && (react_1.default.createElement("div", { className: "ms-4" }, Object.values(logFiles_1.RUNTIME_SPECIFIC_LOGS[runtime]).map((logName) => {
                                const logContent = logs ? logs[logName] : undefined;
                                const exists = logContent !== undefined &&
                                    ((typeof logContent === "string" &&
                                        logContent.trim() !== "") ||
                                        (typeof logContent === "object" &&
                                            logContent !== null &&
                                            Object.keys(logContent).length > 0));
                                return (react_1.default.createElement(FileTreeItem_1.FileTreeItem, { key: logName, name: logName, isFile: true, level: 3, isSelected: activeTab === logName, exists: exists, onClick: () => {
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
                        logs && logs.source_files && (react_1.default.createElement("div", null,
                            react_1.default.createElement(FileTreeItem_1.FileTreeItem, { name: "Source Files", isFile: false, level: 2, isSelected: false, exists: true, isExpanded: expandedSections.sourceFiles, onClick: () => setExpandedSections((prev) => (Object.assign(Object.assign({}, prev), { sourceFiles: !prev.sourceFiles }))) }),
                            expandedSections.sourceFiles && (react_1.default.createElement("div", { className: "ms-4" },
                                react_1.default.createElement(FileTree_1.FileTree, { data: logs.source_files, onSelect: (path, content) => {
                                        setActiveTab("source_file");
                                        setSelectedSourcePath(path);
                                        setSelectedFile({
                                            path,
                                            content,
                                            language: (0, TestPageView_utils_1.getLanguage)(path),
                                        });
                                    }, level: 3, selectedSourcePath: selectedSourcePath }))))))),
                    (projectTests[project] || []).map(test => (react_1.default.createElement(FileTreeItem_1.FileTreeItem, { key: `${project}-${test}`, name: test, isFile: true, level: 2, isSelected: currentProjectName === project && currentTestName === test, exists: true, onClick: () => {
                            // Navigate to the test page
                            navigate(`/projects/${project}/tests/${encodeURIComponent(test)}`);
                        } }))))))))))))));
};
exports.ProjectsTree = ProjectsTree;
