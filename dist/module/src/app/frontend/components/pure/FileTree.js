import React from "react";
import { useState } from "react";
import { FileTreeItem } from "./FileTreeItem";
export const FileTree = ({ data, onSelect, level = 0, selectedSourcePath }) => {
    const [expanded, setExpanded] = useState({});
    const toggleExpand = (path) => {
        setExpanded((prev) => (Object.assign(Object.assign({}, prev), { [path]: !prev[path] })));
    };
    return (React.createElement("div", null, Object.entries(data).map(([name, node]) => {
        const path = Object.keys(expanded).find((k) => k.endsWith(name)) || name;
        const isExpanded = expanded[path];
        if (node.__isFile) {
            return (React.createElement(FileTreeItem, { key: name, name: name, isFile: true, level: level, isSelected: selectedSourcePath === path, onClick: () => onSelect(path, node.content) }));
        }
        else {
            return (React.createElement("div", { key: name },
                React.createElement("div", { className: "d-flex align-items-center py-1 text-dark", style: {
                        paddingLeft: `${level * 16}px`,
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                    }, onClick: () => toggleExpand(path) },
                    React.createElement("i", { className: `bi ${isExpanded ? 'bi-folder2-open' : 'bi-folder'} me-1` }),
                    React.createElement("span", null, name)),
                isExpanded && (React.createElement(FileTree, { data: node, onSelect: onSelect, level: level + 1, selectedSourcePath: selectedSourcePath }))));
        }
    })));
};
