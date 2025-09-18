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
exports.TestPageLeftContent = void 0;
const react_1 = __importStar(require("react"));
// import {
//   STANDARD_LOGS,
//   RUNTIME_SPECIFIC_LOGS,
//   RuntimeName,
// } from "../../utils/logFiles";
// import { FileTree } from "../../components/pure/FileTree";
// import { FileTreeItem } from "../../components/pure/FileTreeItem";
// import { getLanguage } from "./TestPageView_utils";
const ProjectsTree_1 = require("./ProjectsTree");
const useFileSystemSync_1 = require("../../hooks/useFileSystemSync");
// Current test details component (renamed from the original TestPageLeftContent)
// const CurrentTestDetails = ({
//   setExpandedSections,
//   expandedSections,
//   logs,
//   setActiveTab,
//   setSelectedFile,
//   runtime,
//   selectedSourcePath,
//   activeTab,
//   setSelectedSourcePath,
// }) => {
//   return (
//     <>
//       <div className="p-2">
//         <div
//           className="d-flex align-items-center text-muted mb-1"
//           style={{ cursor: "pointer", fontSize: "0.875rem" }}
//           onClick={() =>
//             setExpandedSections((prev) => ({
//               ...prev,
//               standardLogs: !prev.standardLogs,
//             }))
//           }
//         >
//           <i
//             className={`bi bi-chevron-${expandedSections.standardLogs ? "down" : "right"
//               } me-1`}
//           ></i>
//           <span>Standard Logs</span>
//         </div>
//         {expandedSections.standardLogs && (
//           <div>
//             {Object.values(STANDARD_LOGS).map((logName) => {
//               const logContent = logs ? logs[logName] : undefined;
//               const exists =
//                 logContent !== undefined &&
//                 ((typeof logContent === "string" && logContent.trim() !== "") ||
//                   (typeof logContent === "object" &&
//                     logContent !== null &&
//                     Object.keys(logContent).length > 0));
//               return (
//                 <FileTreeItem
//                   key={logName}
//                   name={logName}
//                   isFile={true}
//                   level={1}
//                   isSelected={activeTab === logName}
//                   exists={exists}
//                   onClick={() => {
//                     if (exists) {
//                       setActiveTab(logName);
//                       setSelectedFile({
//                         path: logName,
//                         content:
//                           typeof logContent === "string"
//                             ? logContent
//                             : JSON.stringify(logContent, null, 2),
//                         language: logName.endsWith(".json")
//                           ? "json"
//                           : "plaintext",
//                       });
//                     } else {
//                       setActiveTab(logName);
//                       setSelectedFile({
//                         path: logName,
//                         content: `// ${logName} not found or empty\nThis file was not generated during the test run.`,
//                         language: "plaintext",
//                       });
//                     }
//                   }}
//                 />
//               );
//             })}
//           </div>
//         )}
//       </div>
//       {/* Runtime Logs Section */}
//       {runtime &&
//         RUNTIME_SPECIFIC_LOGS[runtime as RuntimeName] &&
//         Object.values(RUNTIME_SPECIFIC_LOGS[runtime as RuntimeName]).length >
//         0 && (
//           <div className="p-2">
//             <div
//               className="d-flex align-items-center text-muted mb-1"
//               style={{ cursor: "pointer", fontSize: "0.875rem" }}
//               onClick={() =>
//                 setExpandedSections((prev) => ({
//                   ...prev,
//                   runtimeLogs: !prev.runtimeLogs,
//                 }))
//               }
//             >
//               <i
//                 className={`bi bi-chevron-${expandedSections.runtimeLogs ? "down" : "right"
//                   } me-1`}
//               ></i>
//               <span>Runtime Logs</span>
//             </div>
//             {expandedSections.runtimeLogs && (
//               <div>
//                 {Object.values(
//                   RUNTIME_SPECIFIC_LOGS[runtime as RuntimeName]
//                 ).map((logName) => {
//                   const logContent = logs ? logs[logName] : undefined;
//                   const exists =
//                     logContent !== undefined &&
//                     ((typeof logContent === "string" &&
//                       logContent.trim() !== "") ||
//                       (typeof logContent === "object" &&
//                         logContent !== null &&
//                         Object.keys(logContent).length > 0));
//                   return (
//                     <FileTreeItem
//                       key={logName}
//                       name={logName}
//                       isFile={true}
//                       level={1}
//                       isSelected={activeTab === logName}
//                       exists={exists}
//                       onClick={() => {
//                         if (exists) {
//                           setActiveTab(logName);
//                           setSelectedFile({
//                             path: logName,
//                             content:
//                               typeof logContent === "string"
//                                 ? logContent
//                                 : JSON.stringify(logContent, null, 2),
//                             language: logName.endsWith(".json")
//                               ? "json"
//                               : "plaintext",
//                           });
//                         } else {
//                           setActiveTab(logName);
//                           setSelectedFile({
//                             path: logName,
//                             content: `// ${logName} not found or empty\nThis file was not generated during the test run.`,
//                             language: "plaintext",
//                           });
//                         }
//                       }}
//                     />
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         )}
//       {/* Source Files Section */}
//       {logs && logs.source_files && (
//         <div className="p-2">
//           <div
//             className="d-flex align-items-center text-muted mb-1"
//             style={{ cursor: "pointer", fontSize: "0.875rem" }}
//             onClick={() =>
//               setExpandedSections((prev) => ({
//                 ...prev,
//                 sourceFiles: !prev.sourceFiles,
//               }))
//             }
//           >
//             <i
//               className={`bi bi-chevron-${expandedSections.sourceFiles ? "down" : "right"
//                 } me-1`}
//             ></i>
//             <span>Source Files</span>
//           </div>
//           {expandedSections.sourceFiles && (
//             <div>
//               <FileTree
//                 data={logs.source_files}
//                 onSelect={(path, content) => {
//                   setActiveTab("source_file");
//                   setSelectedSourcePath(path);
//                   setSelectedFile({
//                     path,
//                     content,
//                     language: getLanguage(path),
//                   });
//                 }}
//                 level={1}
//                 selectedSourcePath={selectedSourcePath}
//               />
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   );
// };
// import React, { useEffect, useState } from 'react';
// import { useFileSystemSync } from '../../hooks/useFileSystemSync';
// import { ProjectsTree } from "./ProjectsTree";
const TestPageLeftContent = ({ projects, setExpandedSections, expandedSections, logs, setActiveTab, setSelectedFile, runtime, selectedSourcePath, activeTab, setSelectedSourcePath, projectName, testName, }) => {
    const [syncEnabled, setSyncEnabled] = (0, react_1.useState)(true);
    const { fileSystem, listDirectory, readFile, refresh, loading, error } = (0, useFileSystemSync_1.useFileSystemSync)('.');
    // Load initial directory when component mounts
    (0, react_1.useEffect)(() => {
        const loadDirectory = async () => {
            if (projectName && syncEnabled) {
                try {
                    // Use the project tree endpoint with test parameter if available
                    let url = `/api/projects/tree?project=${encodeURIComponent(projectName)}`;
                    if (testName) {
                        url += `&test=${encodeURIComponent(testName)}`;
                    }
                    const response = await fetch(url);
                    if (response.ok) {
                        const data = await response.json();
                        // The response may contain sourceFiles and testFiles
                        // For now, we'll use sourceFiles which should be the main file tree
                        const items = data.sourceFiles || data;
                        setFileSystem((prev) => (Object.assign(Object.assign({}, prev), { files: Object.assign(Object.assign({}, prev.files), { [projectName]: items }) })));
                    }
                    else {
                        throw new Error(`Failed to load directory: ${response.status}`);
                    }
                }
                catch (error) {
                    console.error('Failed to load directory:', error);
                    // Error is already set in the hook state, no need to handle here
                }
            }
        };
        loadDirectory();
    }, [projectName, testName, syncEnabled]);
    // Handle file selection with real-time content
    const handleFileSelect = async (path) => {
        var _a, _b;
        if (!syncEnabled) {
            // Fallback to logs if sync is disabled
            const logContent = (_a = logs === null || logs === void 0 ? void 0 : logs.source_files) === null || _a === void 0 ? void 0 : _a[path];
            if (logContent !== undefined) {
                setSelectedFile({
                    path,
                    content: typeof logContent === "string"
                        ? logContent
                        : JSON.stringify(logContent, null, 2),
                    language: path.endsWith(".json") ? "json" : "plaintext",
                });
            }
            return;
        }
        // Try to get content from real-time file system
        try {
            let content = fileSystem.fileContents[path];
            if (content === undefined) {
                content = await readFile(path);
            }
            setSelectedFile({
                path,
                content,
                language: path.endsWith(".json")
                    ? "json"
                    : path.endsWith(".ts") || path.endsWith(".tsx")
                        ? "typescript"
                        : path.endsWith(".js") || path.endsWith(".jsx")
                            ? "javascript"
                            : path.endsWith(".css")
                                ? "css"
                                : path.endsWith(".html")
                                    ? "html"
                                    : "plaintext",
            });
        }
        catch (error) {
            console.error("Error reading file:", error);
            // Fallback to logs
            const logContent = (_b = logs === null || logs === void 0 ? void 0 : logs.source_files) === null || _b === void 0 ? void 0 : _b[path];
            if (logContent !== undefined) {
                setSelectedFile({
                    path,
                    content: typeof logContent === "string"
                        ? logContent
                        : JSON.stringify(logContent, null, 2),
                    language: "plaintext",
                });
            }
        }
    };
    return (react_1.default.createElement("div", { className: "p-2" },
        react_1.default.createElement("div", { className: "d-flex align-items-center mb-2" },
            react_1.default.createElement("div", { className: "form-check form-switch" },
                react_1.default.createElement("input", { className: "form-check-input", type: "checkbox", checked: syncEnabled, onChange: (e) => setSyncEnabled(e.target.checked), id: "fileSyncToggle" }),
                react_1.default.createElement("label", { className: "form-check-label small", htmlFor: "fileSyncToggle" }, "Live File Sync")),
            syncEnabled && (react_1.default.createElement("button", { className: "btn btn-sm btn-outline-secondary ms-2", onClick: refresh, title: "Refresh file list" },
                react_1.default.createElement("i", { className: "bi bi-arrow-clockwise" })))),
        react_1.default.createElement(ProjectsTree_1.ProjectsTree, { projects: projects, currentProjectName: projectName, currentTestName: testName, setExpandedSections: setExpandedSections, expandedSections: expandedSections, logs: logs, setActiveTab: setActiveTab, setSelectedFile: syncEnabled ? handleFileSelect : setSelectedFile, runtime: runtime, selectedSourcePath: selectedSourcePath, activeTab: activeTab, setSelectedSourcePath: setSelectedSourcePath }),
        syncEnabled && (react_1.default.createElement("div", { className: "mt-3" },
            react_1.default.createElement("div", { className: "text-muted small mb-1" }, "Live Files"),
            loading && react_1.default.createElement("div", { className: "text-muted small" }, "Loading..."),
            error && react_1.default.createElement("div", { className: "text-danger small" },
                "Error: ",
                error),
            !loading && !error && fileSystem.files[projectName] && (react_1.default.createElement(react_1.default.Fragment, null, fileSystem.files[projectName].map((item) => (react_1.default.createElement("div", { key: item.path, className: "ps-2 small", style: { cursor: "pointer" }, onClick: () => item.type === "file" && handleFileSelect(item.path) },
                react_1.default.createElement("i", { className: `bi bi-${item.type === "folder" ? "folder" : "file"} me-1` }),
                item.name)))))))));
};
exports.TestPageLeftContent = TestPageLeftContent;
