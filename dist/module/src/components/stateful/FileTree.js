import React from 'react';
export const FileTree = ({ files, onSelect, activeFile }) => {
    // Group files by directory
    const fileGroups = files.reduce((acc, file) => {
        const dir = file.path.split('/').slice(0, -1).join('/');
        if (!acc[dir]) {
            acc[dir] = [];
        }
        acc[dir].push(file);
        return acc;
    }, {});
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
    const activeFileStyle = Object.assign(Object.assign({}, fileStyle), { backgroundColor: '#e0e0e0', fontWeight: 'bold' });
    return (React.createElement("div", { style: fileTreeStyle }, Object.entries(fileGroups).map(([dir, dirFiles]) => (React.createElement("div", { key: dir, style: directoryStyle },
        React.createElement("div", { style: directoryNameStyle }, dir || '/'),
        dirFiles.map(file => (React.createElement("div", { key: file.path, style: activeFile === file.path ? activeFileStyle : fileStyle, onClick: () => onSelect(file.path) }, file.path.split('/').pop()))))))));
};
