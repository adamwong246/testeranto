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
const ProjectsTree_1 = require("./ProjectsTree");
const TestPageLeftContent = ({ projects, setExpandedSections, expandedSections, logs, setActiveTab, setSelectedFile, runtime, selectedSourcePath, activeTab, setSelectedSourcePath, projectName, testName, }) => {
    const [syncEnabled, setSyncEnabled] = (0, react_1.useState)(false);
    return (react_1.default.createElement("div", { className: "p-2" },
        react_1.default.createElement("div", { className: "d-flex align-items-center mb-2" },
            react_1.default.createElement("div", { className: "form-check form-switch" },
                react_1.default.createElement("input", { className: "form-check-input", type: "checkbox", checked: syncEnabled, onChange: (e) => setSyncEnabled(e.target.checked), id: "fileSyncToggle", disabled: true }),
                react_1.default.createElement("label", { className: "form-check-label small", htmlFor: "fileSyncToggle" }, "Live File Sync (Unavailable)"))),
        react_1.default.createElement(ProjectsTree_1.ProjectsTree, { projects: projects, currentProjectName: projectName, currentTestName: testName, setExpandedSections: setExpandedSections, expandedSections: expandedSections, logs: logs, setActiveTab: setActiveTab, setSelectedFile: setSelectedFile, runtime: runtime, selectedSourcePath: selectedSourcePath, activeTab: activeTab, setSelectedSourcePath: setSelectedSourcePath })));
};
exports.TestPageLeftContent = TestPageLeftContent;
