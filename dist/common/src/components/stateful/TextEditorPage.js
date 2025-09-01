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
exports.TextEditorPage = void 0;
const react_1 = __importStar(require("react"));
const react_2 = require("@monaco-editor/react");
const FileTree_1 = require("./FileTree");
const TextEditorPage = () => {
    const [files, setFiles] = (0, react_1.useState)([]);
    const [activeFile, setActiveFile] = (0, react_1.useState)(null);
    const [editorTheme, setEditorTheme] = (0, react_1.useState)('vs-dark');
    // Initialize with sample files
    (0, react_1.useEffect)(() => {
        const sampleFiles = [
            {
                path: 'src/index.ts',
                content: '// TypeScript code here\nconst message = "Hello World";\nconsole.log(message);',
                language: 'typescript'
            },
            {
                path: 'package.json',
                content: '{\n  "name": "my-project",\n  "version": "1.0.0"\n}',
                language: 'json'
            }
        ];
        setFiles(sampleFiles);
        setActiveFile(sampleFiles[0]);
    }, []);
    const handleFileSelect = (filePath) => {
        const selectedFile = files.find(f => f.path === filePath);
        if (selectedFile) {
            setActiveFile(selectedFile);
        }
    };
    const handleEditorChange = (value) => {
        if (activeFile && value !== undefined) {
            setFiles(files.map(f => f.path === activeFile.path ? Object.assign(Object.assign({}, f), { content: value }) : f));
        }
    };
    const [widths, setWidths] = (0, react_1.useState)({
        fileTree: 250,
        editor: window.innerWidth - 550, // Initial editor width (total width minus side panels)
        preview: 300
    });
    const containerStyle = {
        display: 'flex',
        height: '100vh',
        width: '100%'
    };
    const panelStyle = {
        height: '100%',
        overflow: 'hidden',
        position: 'relative'
    };
    const [isResizing, setIsResizing] = (0, react_1.useState)(false);
    const [startX, setStartX] = (0, react_1.useState)(0);
    const [startWidth, setStartWidth] = (0, react_1.useState)(0);
    const startResizing = (e, panel) => {
        setIsResizing(true);
        setStartX(e.clientX);
        setStartWidth(widths[panel]);
    };
    const resize = (e) => {
        if (isResizing) {
            const dx = e.clientX - startX;
            const newFileTreeWidth = Math.max(200, Math.min(400, startWidth + dx));
            setWidths({
                fileTree: newFileTreeWidth,
                editor: window.innerWidth - newFileTreeWidth - widths.preview,
                preview: widths.preview
            });
        }
    };
    const stopResizing = () => {
        setIsResizing(false);
    };
    (0, react_1.useEffect)(() => {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [isResizing, startX, startWidth]);
    return (react_1.default.createElement("div", { style: containerStyle },
        react_1.default.createElement("div", { style: Object.assign(Object.assign({}, panelStyle), { width: widths.fileTree }) },
            react_1.default.createElement(FileTree_1.FileTree, { files: files, onSelect: handleFileSelect, activeFile: activeFile === null || activeFile === void 0 ? void 0 : activeFile.path }),
            react_1.default.createElement("div", { style: {
                    width: '4px',
                    height: '100%',
                    cursor: 'col-resize',
                    backgroundColor: isResizing ? '#aaa' : '#ddd',
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    zIndex: 1
                }, onMouseDown: (e) => startResizing(e, 'fileTree') })),
        react_1.default.createElement("div", { style: Object.assign(Object.assign({}, panelStyle), { width: widths.editor }) }, activeFile && (react_1.default.createElement(react_2.Editor, { height: "100%", path: activeFile.path, defaultLanguage: activeFile.language, defaultValue: activeFile.content, onChange: handleEditorChange, theme: editorTheme, options: {
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true
            } }))),
        react_1.default.createElement("div", { style: Object.assign(Object.assign({}, panelStyle), { width: widths.preview }) },
            react_1.default.createElement("div", { style: {
                    width: '4px',
                    height: '100%',
                    cursor: 'col-resize',
                    backgroundColor: isResizing ? '#aaa' : '#ddd',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    zIndex: 1
                }, onMouseDown: (e) => startResizing(e, 'editor') }),
            activeFile && (react_1.default.createElement("div", null)
            // <FilePreview 
            //   content={activeFile.content}
            //   language={activeFile.language}
            // />
            ))));
};
exports.TextEditorPage = TextEditorPage;
