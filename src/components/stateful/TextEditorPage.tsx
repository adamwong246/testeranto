import React, { useState, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import { Editor } from '@monaco-editor/react';
import { FileTree } from './FileTree';
// import { FilePreview } from './FilePreview';

type FileType = {
  path: string;
  content: string;
  language: string;
};

export const TextEditorPage = () => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [activeFile, setActiveFile] = useState<FileType | null>(null);
  const [editorTheme, setEditorTheme] = useState<'light' | 'vs-dark'>('vs-dark');

  // Initialize with sample files
  useEffect(() => {
    const sampleFiles: FileType[] = [
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

  const handleFileSelect = (filePath: string) => {
    const selectedFile = files.find(f => f.path === filePath);
    if (selectedFile) {
      setActiveFile(selectedFile);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (activeFile && value !== undefined) {
      setFiles(files.map(f =>
        f.path === activeFile.path ? { ...f, content: value } : f
      ));
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
    overflowY: 'auto' as const
  };

  const editorStyle = {
    flex: 1,
    minWidth: 0
  };

  const previewStyle = {
    width: '300px',
    borderLeft: '1px solid #ddd',
    overflowY: 'auto' as const,
    padding: '10px',
    backgroundColor: '#f5f5f5'
  };

  return (
    <div style={containerStyle}>
      <div style={fileTreeStyle}>
        <FileTree
          files={files}
          onSelect={handleFileSelect}
          activeFile={activeFile?.path}
        />
      </div>
      <div style={editorStyle}>
        {activeFile && (
          <Editor
            height="100%"
            path={activeFile.path}
            defaultLanguage={activeFile.language}
            defaultValue={activeFile.content}
            onChange={handleEditorChange}
            theme={editorTheme}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              automaticLayout: true
            }}
          />
        )}
      </div>
      <div style={previewStyle}>
        {activeFile && (
          <div></div>
          // <FilePreview 
          //   content={activeFile.content}
          //   language={activeFile.language}
          // />
        )}
      </div>
    </div>
  );
};
