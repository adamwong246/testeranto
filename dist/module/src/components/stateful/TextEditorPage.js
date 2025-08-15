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
    const containerStyle = {
        display: 'flex',
        height: '100vh',
        width: '100%'
    };
    const fileTreeStyle = {
        width: '250px',
        borderRight: '1px solid #ddd',
        overflowY: 'auto'
    };
    const editorStyle = {
        flex: 1,
        minWidth: 0
    };
    const previewStyle = {
        width: '300px',
        borderLeft: '1px solid #ddd',
        overflowY: 'auto',
        padding: '10px',
        backgroundColor: '#f5f5f5'
    };
    return (React.createElement("div", { style: containerStyle },
        React.createElement("div", { style: fileTreeStyle },
            React.createElement(FileTree, { files: files, onSelect: handleFileSelect, activeFile: activeFile === null || activeFile === void 0 ? void 0 : activeFile.path })),
        React.createElement("div", { style: editorStyle }, activeFile && (React.createElement(Editor, { height: "100%", path: activeFile.path, defaultLanguage: activeFile.language, defaultValue: activeFile.content, onChange: handleEditorChange, theme: editorTheme, options: {
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true
            } }))),
        React.createElement("div", { style: previewStyle }, activeFile && (React.createElement("div", null)
        // <FilePreview 
        //   content={activeFile.content}
        //   language={activeFile.language}
        // />
        ))));
};
