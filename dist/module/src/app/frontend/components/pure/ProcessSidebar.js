import React from 'react';
import { Badge } from 'react-bootstrap';
const getStatusBadge = (process) => {
    switch (process.status) {
        case 'running':
            return React.createElement(Badge, { bg: "success" }, "Running");
        case 'exited':
            return React.createElement(Badge, { bg: "secondary" },
                "Exited (",
                process.exitCode,
                ")");
        case 'error':
            return React.createElement(Badge, { bg: "danger" }, "Error");
        default:
            return React.createElement(Badge, { bg: "warning" }, "Unknown");
    }
};
export const ProcessSidebar = ({ process, webSocketStatus, }) => {
    return (React.createElement("div", { className: "border-end", style: {
            width: '300px',
            minWidth: '300px',
            flexShrink: 0,
            overflowY: 'auto'
        } },
        React.createElement("div", { className: "p-3" },
            React.createElement("div", { className: "mb-3" },
                React.createElement("strong", null, "Command:"),
                React.createElement("code", { className: "bg-white p-2 rounded d-block mt-1", style: { fontSize: '0.8rem' } }, process.command)),
            React.createElement("div", { className: "mb-2" },
                React.createElement("strong", null, "Status:"),
                React.createElement("div", { className: "mt-1" }, getStatusBadge(process))),
            React.createElement("div", { className: "mb-2" },
                React.createElement("strong", null, "WebSocket:"),
                React.createElement("div", { className: "mt-1" },
                    React.createElement(Badge, { bg: webSocketStatus === 'connected' ? 'success' :
                            webSocketStatus === 'connecting' ? 'warning' : 'danger' }, webSocketStatus))),
            React.createElement("div", { className: "mb-2" },
                React.createElement("strong", null, "PID:"),
                React.createElement("div", { className: "text-muted" }, process.pid || 'N/A')),
            React.createElement("div", { className: "mb-2" },
                React.createElement("strong", null, "Started:"),
                React.createElement("div", { className: "text-muted" }, new Date(process.timestamp).toLocaleString())),
            process.exitCode !== undefined && (React.createElement("div", { className: "mb-2" },
                React.createElement("strong", null, "Exit Code:"),
                React.createElement("div", { className: "text-muted" }, process.exitCode))),
            process.error && (React.createElement("div", { className: "mt-3" },
                React.createElement("strong", { className: "text-danger" }, "Error:"),
                React.createElement("div", { className: "text-danger small mt-1" }, process.error))))));
};
