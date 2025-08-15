import React from 'react';
import { FileType } from './TextEditorPage';

type FileTreeProps = {
  files: FileType[];
  onSelect: (path: string) => void;
  activeFile: string | null;
};

export const FileTree = ({ files, onSelect, activeFile }: FileTreeProps) => {
  // Group files by directory
  const fileGroups = files.reduce((acc, file) => {
    const dir = file.path.split('/').slice(0, -1).join('/');
    if (!acc[dir]) {
      acc[dir] = [];
    }
    acc[dir].push(file);
    return acc;
  }, {} as Record<string, FileType[]>);

  const fileTreeStyle = {
    padding: '8px',
    fontFamily: 'monospace'
  };

  const directoryStyle = {
    marginBottom: '8px'
  };

  const directoryNameStyle = {
    fontWeight: 'bold',
    padding: '4px 0',
    color: '#555'
  };

  const fileStyle = {
    padding: '4px 8px',
    cursor: 'pointer',
    borderRadius: '4px'
  };

  const activeFileStyle = {
    ...fileStyle,
    backgroundColor: '#e0e0e0',
    fontWeight: 'bold'
  };

  return (
    <div style={fileTreeStyle}>
      {Object.entries(fileGroups).map(([dir, dirFiles]) => (
        <div key={dir} style={directoryStyle}>
          <div style={directoryNameStyle}>{dir || '/'}</div>
          {dirFiles.map(file => (
            <div 
              key={file.path}
              style={activeFile === file.path ? activeFileStyle : fileStyle}
              onClick={() => onSelect(file.path)}
            >
              {file.path.split('/').pop()}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
