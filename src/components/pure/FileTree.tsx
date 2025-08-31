import React from "react";
import { useState } from "react";
import { FileTreeItem } from "./FileTreeItem";

export const FileTree = ({ data, onSelect, level = 0, selectedSourcePath }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <div>
      {Object.entries(data).map(([name, node]) => {
        const path = Object.keys(expanded).find((k) => k.endsWith(name)) || name;
        const isExpanded = expanded[path];

        if (node.__isFile) {
          return (
            <FileTreeItem
              key={name}
              name={name}
              isFile={true}
              level={level}
              isSelected={selectedSourcePath === path}
              onClick={() => onSelect(path, node.content)}
            />
          );
        } else {
          return (
            <div key={name}>
              <div
                className="d-flex align-items-center py-1 text-dark"
                style={{
                  paddingLeft: `${level * 16}px`,
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
                onClick={() => toggleExpand(path)}
              >
                <i className={`bi ${isExpanded ? 'bi-folder2-open' : 'bi-folder'} me-1`}></i>
                <span>{name}</span>
              </div>
              {isExpanded && (
                <FileTree
                  data={node}
                  onSelect={onSelect}
                  level={level + 1}
                  selectedSourcePath={selectedSourcePath}
                />
              )}
            </div>
          );
        }
      })}
    </div>
  );
};