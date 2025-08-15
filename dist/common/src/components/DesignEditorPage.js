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
exports.DesignEditorPage = void 0;
const react_1 = __importStar(require("react"));
const DesignEditor_1 = require("../../design-editor/DesignEditor");
const react_bootstrap_1 = require("react-bootstrap");
const file_saver_1 = require("file-saver");
const DesignEditorPage = () => {
    const [projectId, setProjectId] = (0, react_1.useState)('default-project');
    const [fileHandle, setFileHandle] = (0, react_1.useState)(null);
    const handleSave = async () => {
        try {
            if (!designEditorRef.current) {
                console.warn('Design editor ref not available');
                return;
            }
            // Get and save current design state
            const designData = designEditorRef.current.saveDesign();
            if (!designData) {
                console.warn('No design data to save');
                return;
            }
            // Include projectId in the saved data
            const fullDesign = Object.assign(Object.assign({}, designData), { projectId });
            // Force immediate render after save
            if (designEditorRef.current) {
                designEditorRef.current.loadDesign(fullDesign);
            }
            // @ts-ignore - File System Access API
            const newHandle = await window.showSaveFilePicker({
                types: [{
                        description: 'Design Files',
                        accept: {
                            'application/json': ['.json'],
                        },
                    }],
                suggestedName: `${projectId}.json`
            });
            const jsonData = JSON.stringify(fullDesign, null, 2);
            const writable = await newHandle.createWritable();
            await writable.write(jsonData);
            await writable.close();
            setFileHandle(newHandle);
            console.log('Design saved successfully:', fullDesign);
        }
        catch (err) {
            console.error('Error saving file:', err);
            if (err instanceof Error) {
                console.error('Error details:', {
                    name: err.name,
                    message: err.message,
                    stack: err.stack
                });
            }
        }
    };
    const [design, setDesign] = (0, react_1.useState)(null);
    const designEditorRef = (0, react_1.useRef)(null);
    const handleOpen = async () => {
        console.log('handleOpen triggered');
        try {
            if (!window.showOpenFilePicker) {
                throw new Error('File System Access API not supported in this browser');
            }
            console.log('Attempting to show file picker...');
            const [handle] = await window.showOpenFilePicker({
                types: [{
                        description: 'Design Files',
                        accept: {
                            'application/json': ['.json'],
                        },
                    }],
                multiple: false
            });
            if (!handle) {
                throw new Error('No file selected');
            }
            console.log('File handle obtained:', handle);
            const file = await handle.getFile();
            console.log('File object obtained:', file);
            const contents = await file.text();
            console.log('File contents loaded, length:', contents.length);
            let loadedDesign = JSON.parse(contents);
            console.log('Design parsed successfully:', loadedDesign);
            // Ensure design has proper structure
            if (!loadedDesign.objects || !loadedDesign.version) {
                loadedDesign = Object.assign({ version: '1.0', background: '#ffffff', objects: [] }, loadedDesign);
            }
            // Validate objects array exists
            if (!Array.isArray(loadedDesign.objects)) {
                loadedDesign.objects = [];
            }
            const newProjectId = loadedDesign.projectId || 'default-project';
            console.log('Setting projectId to:', newProjectId);
            setProjectId(newProjectId);
            console.log('Setting design state...');
            setDesign(loadedDesign);
            setFileHandle(handle);
            // Load the design into the editor
            if (designEditorRef.current) {
                console.log('Calling loadDesign on editor ref with:', loadedDesign);
                designEditorRef.current.loadDesign(loadedDesign);
            }
            else {
                console.warn('designEditorRef.current is null');
            }
        }
        catch (err) {
            console.error('Error opening file:', err);
            if (err instanceof Error) {
                console.error('Error details:', {
                    name: err.name,
                    message: err.message,
                    stack: err.stack
                });
            }
        }
    };
    const handleExport = () => {
        const designData = JSON.stringify({ projectId }, null, 2);
        const blob = new Blob([designData], { type: 'application/json' });
        (0, file_saver_1.saveAs)(blob, `${projectId}.json`);
    };
    return (react_1.default.createElement(react_bootstrap_1.Container, { fluid: true },
        react_1.default.createElement(react_bootstrap_1.Row, { className: "mb-3" },
            react_1.default.createElement(react_bootstrap_1.Col, null,
                react_1.default.createElement("h1", null, "Design Editor"),
                react_1.default.createElement("div", { className: "d-flex gap-2" },
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: handleOpen }, "Open"),
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "success", onClick: handleSave }, "Save"),
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "secondary", onClick: handleExport }, "Export")))),
        react_1.default.createElement(react_bootstrap_1.Row, null,
            react_1.default.createElement(react_bootstrap_1.Col, null,
                react_1.default.createElement(DesignEditor_1.DesignEditor, { projectId: projectId, ref: designEditorRef })))));
};
exports.DesignEditorPage = DesignEditorPage;
