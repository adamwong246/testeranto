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
const react_bootstrap_1 = require("react-bootstrap");
const react_2 = require("@monaco-editor/react");
const ToastNotification_1 = require("../../components/pure/ToastNotification");
const MagicRobotModal_1 = require("../../components/pure/MagicRobotModal");
const TestPageNavbar_1 = require("./TestPageNavbar");
const TestPageMainContent_1 = require("./TestPageMainContent");
const TestPageLeftContent_1 = require("./TestPageLeftContent");
const TestPageView = ({ projectName, testName, decodedTestPath, runtime, testsExist, errorCounts, logs, isWebSocketConnected, }) => {
    var _a;
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
    // Fetch projects data
    (0, react_1.useEffect)(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('projects.json');
                if (response.ok) {
                    const projectsData = await response.json();
                    setProjects(projectsData);
                }
                else {
                    console.error('Failed to fetch projects');
                }
            }
            catch (error) {
                console.error('Error fetching projects:', error);
            }
        };
        fetchProjects();
    }, []);
    // Use the centralized WebSocket from App context
    const wsContext = (0, App_1.useWebSocket)();
    const ws = wsContext === null || wsContext === void 0 ? void 0 : wsContext.ws;
    const [activeTab, setActiveTab] = react_1.default.useState("tests.json");
    const [openFiles, setOpenFiles] = (0, react_1.useState)([]);
    const [activeFileIndex, setActiveFileIndex] = (0, react_1.useState)(-1);
    const [selectedSourcePath, setSelectedSourcePath] = (0, react_1.useState)(null);
    const [editorTheme, setEditorTheme] = (0, react_1.useState)("vs-dark");
    // Add state for projects
    const [projects, setProjects] = (0, react_1.useState)([]);
    // Reference to the editor instance and model
    const [editorRef, setEditorRef] = (0, react_1.useState)(null);
    const [modelRef, setModelRef] = (0, react_1.useState)(null);
    // Function to open a file in a new tab
    const openFile = (file) => {
        // Check if the file is already open
        const existingIndex = openFiles.findIndex(f => f.path === file.path);
        if (existingIndex !== -1) {
            setActiveFileIndex(existingIndex);
            return;
        }
        // Add the file to open files and set it as active
        setOpenFiles(prev => [...prev, file]);
        setActiveFileIndex(openFiles.length);
    };
    // Function to close a tab
    const closeFile = (index) => {
        setOpenFiles(prev => prev.filter((_, i) => i !== index));
        // Adjust active index if needed
        if (activeFileIndex === index) {
            // If closing the active tab, activate the next one or previous one
            if (openFiles.length > 1) {
                setActiveFileIndex(Math.min(index, openFiles.length - 2));
            }
            else {
                setActiveFileIndex(-1);
            }
        }
        else if (activeFileIndex > index) {
            setActiveFileIndex(activeFileIndex - 1);
        }
    };
    // Update selectedFile when activeFileIndex changes
    const selectedFile = activeFileIndex >= 0 ? openFiles[activeFileIndex] : null;
    // Debug: track selectedFile changes
    (0, react_1.useEffect)(() => {
        var _a;
        console.log('selectedFile changed:', {
            path: selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path,
            contentLength: (_a = selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.content) === null || _a === void 0 ? void 0 : _a.length,
            language: selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.language
        });
    }, [selectedFile]);
    // Update editor content when selectedFile changes
    (0, react_1.useEffect)(() => {
        console.log('selectedFile useEffect triggered', {
            selectedFile: selectedFile,
            editorRefExists: !!editorRef,
            modelRefExists: !!modelRef
        });
        if (selectedFile && editorRef) {
            console.log('Updating editor for selected file:', selectedFile.path);
            const monaco = window.monaco;
            if (monaco) {
                // Get current model or create a new one if needed
                let currentModel = editorRef.getModel();
                if (!currentModel) {
                    // Create a new model if none exists
                    currentModel = monaco.editor.createModel(selectedFile.content || "// No content", selectedFile.language || "plaintext");
                    editorRef.setModel(currentModel);
                    setModelRef(currentModel);
                    console.log('New model created and set');
                }
                else {
                    // Update existing model's value and language if needed
                    const currentValue = currentModel.getValue();
                    const newValue = selectedFile.content || "// No content";
                    // Only update if content has changed
                    if (currentValue !== newValue) {
                        currentModel.setValue(newValue);
                        console.log('Model value updated');
                    }
                    // Update language if needed
                    const currentLanguage = currentModel.getLanguageId();
                    const newLanguage = selectedFile.language || "plaintext";
                    if (currentLanguage !== newLanguage) {
                        monaco.editor.setModelLanguage(currentModel, newLanguage);
                        console.log('Model language updated to:', newLanguage);
                    }
                }
                // Always reveal the beginning of the file
                editorRef.revealPosition({ lineNumber: 1, column: 1 });
            }
        }
        else {
            console.log('No selectedFile or editorRef available');
        }
    }, [selectedFile, editorRef, modelRef]);
    return (react_1.default.createElement(react_bootstrap_1.Container, { fluid: true, className: "px-0" },
        react_1.default.createElement(TestPageNavbar_1.TestPageNavbar, { decodedTestPath: decodedTestPath, projectName: projectName, runtime: runtime, setShowAiderModal: setShowAiderModal, isWebSocketConnected: isWebSocketConnected }),
        react_1.default.createElement(MagicRobotModal_1.MagicRobotModal, { customMessage: customMessage, isWebSocketConnected: isWebSocketConnected, messageOption: messageOption, navigate: navigate, projectName: projectName, runtime: runtime, setCustomMessage: setCustomMessage, setMessageOption: setMessageOption, setShowAiderModal: setShowAiderModal, setShowToast: setShowToast, setToastMessage: setToastMessage, setToastVariant: setToastVariant, showAiderModal: showAiderModal, testName: testName, ws: ws }),
        react_1.default.createElement(react_bootstrap_1.Row, { className: "g-0 flex-nowrap overflow-x-auto" },
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 3, style: {
                    height: "calc(100vh - 56px)",
                    overflowY: "auto",
                } },
                react_1.default.createElement(TestPageLeftContent_1.TestPageLeftContent, { projects: projects, setExpandedSections: setExpandedSections, expandedSections: expandedSections, logs: logs, setActiveTab: setActiveTab, setSelectedFile: openFile, runtime: runtime, selectedSourcePath: selectedSourcePath, activeTab: activeTab, setSelectedSourcePath: setSelectedSourcePath, projectName: projectName, testName: testName })),
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 8, style: {
                    height: "calc(100vh - 56px)",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                } },
                openFiles.length > 0 && (react_1.default.createElement("div", { style: {
                        display: "flex",
                        backgroundColor: "#1e1e1e",
                        borderBottom: "1px solid #3c3c3c"
                    } }, openFiles.map((file, index) => (react_1.default.createElement("div", { key: file.path, style: {
                        padding: "8px 16px",
                        cursor: "pointer",
                        backgroundColor: index === activeFileIndex ? "#2d2d30" : "transparent",
                        color: index === activeFileIndex ? "#ffffff" : "#cccccc",
                        borderRight: "1px solid #3c3c3c",
                        display: "flex",
                        alignItems: "center",
                    }, onClick: () => setActiveFileIndex(index) },
                    react_1.default.createElement("span", { style: { marginRight: "8px" } }, file.path.split('/').pop()),
                    react_1.default.createElement("button", { onClick: (e) => {
                            e.stopPropagation();
                            closeFile(index);
                        }, style: {
                            background: "none",
                            border: "none",
                            color: "#cccccc",
                            cursor: "pointer",
                            padding: "0",
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }, onMouseOver: (e) => {
                            e.currentTarget.style.backgroundColor = '#e81123';
                            e.currentTarget.style.color = '#ffffff';
                        }, onMouseOut: (e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#cccccc';
                        } }, "\u00D7")))))),
                react_1.default.createElement("div", { style: { height: "100%", width: "100%", flexGrow: 1 }, id: "editor-wrapper" },
                    react_1.default.createElement(react_2.Editor, { height: "100%" // Fill the container
                        , path: (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path) || "empty", defaultLanguage: (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.language) || "plaintext", theme: editorTheme, options: {
                            minimap: { enabled: false },
                            fontSize: 14,
                            wordWrap: "on",
                            automaticLayout: true,
                            readOnly: !((_a = selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path) === null || _a === void 0 ? void 0 : _a.includes("source_files")),
                            // Configure scrollbars to allow horizontal scrolling to bubble up when appropriate
                            scrollbar: {
                                vertical: 'auto',
                                horizontal: 'auto',
                                verticalScrollbarSize: 8,
                                horizontalScrollbarSize: 8,
                                handleMouseWheel: true,
                                // This is the key option: don't always consume mouse wheel events
                                alwaysConsumeMouseWheel: false
                            },
                            mouseWheelScrollSensitivity: 1,
                            fastScrollSensitivity: 1,
                            scrollBeyondLastColumn: 0,
                            scrollBeyondLastLine: true,
                        }, onMount: (editor, monaco) => {
                            console.log('Editor mounted', {
                                selectedFileAtMount: selectedFile,
                                monacoAvailable: !!monaco
                            });
                            // Store editor reference
                            setEditorRef(editor);
                            // Create initial model if selectedFile is available
                            if (selectedFile) {
                                const model = monaco.editor.createModel(selectedFile.content || "// Select a file to view its contents", selectedFile.language || "plaintext");
                                editor.setModel(model);
                                setModelRef(model);
                                console.log('Initial model created and set');
                            }
                            console.log('Editor reference set');
                            // Clean up when editor is unmounted
                            return () => {
                                // Dispose of the model if it exists
                                const currentModel = editor.getModel();
                                if (currentModel) {
                                    currentModel.dispose();
                                }
                                // Clear the references
                                setEditorRef(null);
                                setModelRef(null);
                            };
                        } }))),
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 8, style: {
                    height: "calc(100vh - 56px)",
                    overflowY: "auto",
                } },
                react_1.default.createElement(TestPageMainContent_1.TestPageMainContent, { selectedFile: selectedFile, buildErrors: buildErrors, projectName: projectName, testName: testName, runtime: runtime })),
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 3, style: { height: "calc(100vh - 56px)", overflowY: "auto" } }, "atttibute editor here"),
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 3, style: { height: "calc(100vh - 56px)", overflowY: "auto" } }, "tree editor here")),
        react_1.default.createElement(ToastNotification_1.ToastNotification, { showToast: showToast, setShowToast: setShowToast, toastVariant: toastVariant, toastMessage: toastMessage })));
};
exports.TestPageView = TestPageView;
