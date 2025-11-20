import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { FileTree } from './FileTree';
export const TextEditorPage = () => {
    const [files, setFiles] = useState([]);
    const [activeFile, setActiveFile] = useState(null);
    const [editorTheme, setEditorTheme] = useState('vs-dark');
    // Initialize with sample files
    useEffect(() => {
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
    const [widths, setWidths] = useState({
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
    const [isResizing, setIsResizing] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startWidth, setStartWidth] = useState(0);
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
    useEffect(() => {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [isResizing, startX, startWidth]);
    return (React.createElement("div", { style: containerStyle },
        React.createElement("div", { style: Object.assign(Object.assign({}, panelStyle), { width: widths.fileTree }) },
            React.createElement(FileTree, { files: files, onSelect: handleFileSelect, activeFile: activeFile === null || activeFile === void 0 ? void 0 : activeFile.path }),
            React.createElement("div", { style: {
                    width: '4px',
                    height: '100%',
                    cursor: 'col-resize',
                    backgroundColor: isResizing ? '#aaa' : '#ddd',
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    zIndex: 1
                }, onMouseDown: (e) => startResizing(e, 'fileTree') })),
        React.createElement("div", { style: Object.assign(Object.assign({}, panelStyle), { width: widths.editor }) }, activeFile && (React.createElement(Editor, { height: "100%", path: activeFile.path, defaultLanguage: activeFile.language, defaultValue: activeFile.content, onChange: handleEditorChange, theme: editorTheme, options: {
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true
            } }))),
        React.createElement("div", { style: Object.assign(Object.assign({}, panelStyle), { width: widths.preview }) },
            React.createElement("div", { style: {
                    width: '4px',
                    height: '100%',
                    cursor: 'col-resize',
                    backgroundColor: isResizing ? '#aaa' : '#ddd',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    zIndex: 1
                }, onMouseDown: (e) => startResizing(e, 'editor') }),
            activeFile && (React.createElement("div", null)
            // <FilePreview 
            //   content={activeFile.content}
            //   language={activeFile.language}
            // />
            ))));
};
