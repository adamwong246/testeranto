import React from 'react';
import { Badge, Button, Alert } from 'react-bootstrap';
const getStatusBadge = (process) => {
    switch (process.status) {
        case "running":
            return React.createElement(Badge, { bg: "success" }, "Running");
        case "exited":
            return React.createElement(Badge, { bg: "secondary" },
                "Exited (",
                process.exitCode,
                ")");
        case "error":
            return React.createElement(Badge, { bg: "danger" }, "Error");
        default:
            return React.createElement(Badge, { bg: "warning" }, "Unknown");
    }
};
export const ProcessDetails = ({ selectedProcess, onKillProcess, }) => {
    if (!selectedProcess) {
        return (React.createElement("div", { className: "text-center text-muted mt-5" },
            React.createElement("i", null, "Select a process to view details")));
    }
    return (React.createElement("div", { className: "flex-grow-1 d-flex flex-column" },
        React.createElement("div", { className: "d-flex align-items-center gap-2 mb-3 flex-wrap" },
            React.createElement("div", null, getStatusBadge(selectedProcess)),
            React.createElement("div", { className: "text-muted" }, selectedProcess.pid || "N/A"),
            React.createElement("div", { className: "text-muted" }, new Date(selectedProcess.timestamp).toLocaleString()),
            selectedProcess.status === "running" && onKillProcess && (React.createElement(Button, { variant: "danger", size: "sm", onClick: () => onKillProcess(selectedProcess.processId), className: "flex-grow-0 ms-auto" }, "\u23F9\uFE0F Stop")),
            selectedProcess.exitCode !== undefined && (React.createElement("div", { className: "text-muted" }, selectedProcess.exitCode))),
        selectedProcess.error && (React.createElement(Alert, { variant: "danger", className: "py-2 mb-3" }, selectedProcess.error)),
        React.createElement("div", null,
            React.createElement("div", { className: "mb-1 small text-muted" }, "Command:"),
            React.createElement("div", { className: "bg-dark text-light p-2 rounded", style: {
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    fontSize: "14px",
                    lineHeight: "1.4",
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    maxHeight: "200px"
                } }, selectedProcess.command))));
};
