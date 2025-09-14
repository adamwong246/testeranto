/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
export const FileTreeItem = ({ name, isFile, level, isSelected, exists = true, onClick }) => {
    const displayName = name
        .replace(".json", "")
        .replace(".txt", "")
        .replace(".log", "")
        .replace(/_/g, " ")
        .replace(/^std/, "Standard ")
        .replace(/^exit/, "Exit Code")
        .split('/').pop();
    return (React.createElement("div", { className: `d-flex align-items-center py-1 ${isSelected ? 'text-primary fw-bold' : exists ? 'text-dark' : 'text-muted'}`, style: {
            paddingLeft: `${level * 16}px`,
            cursor: exists ? 'pointer' : 'not-allowed',
            fontSize: '0.875rem',
            opacity: exists ? 1 : 0.6
        }, onClick: exists ? onClick : undefined, title: exists ? undefined : "File not found or empty" },
        React.createElement("i", { className: `bi ${isFile ? (exists ? 'bi-file-earmark-text' : 'bi-file-earmark') : 'bi-folder'} me-1` }),
        React.createElement("span", null, displayName),
        !exists && (React.createElement("i", { className: "bi bi-question-circle ms-1", title: "File not found or empty" }))));
};
