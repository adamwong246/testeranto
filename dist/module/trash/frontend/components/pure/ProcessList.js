import React from 'react';
import { Badge } from 'react-bootstrap';
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
export const ProcessList = ({ processes, selectedProcess, onSelectProcess, loading, }) => {
    return (React.createElement("div", { className: "p-1" },
        [...processes].reverse().map((process) => (React.createElement("div", { key: process.processId, className: `p-2 mb-1 rounded ${(selectedProcess === null || selectedProcess === void 0 ? void 0 : selectedProcess.processId) === process.processId
                ? "bg-primary text-white"
                : "bg-white border"}`, style: { cursor: "pointer" }, onClick: () => onSelectProcess(process), title: process.command },
            React.createElement("div", { className: "d-flex justify-content-between align-items-start" },
                React.createElement("div", { className: "flex-grow-1", style: { minWidth: 0 } },
                    React.createElement("div", { className: "fw-bold text-truncate small" }, process.command.split(" ")[0]),
                    React.createElement("div", { className: `text-truncate ${(selectedProcess === null || selectedProcess === void 0 ? void 0 : selectedProcess.processId) === process.processId
                            ? "text-white-50"
                            : "text-muted"}`, style: { fontSize: "0.7rem" } },
                        "PID: ",
                        process.pid || "N/A",
                        " |",
                        " ",
                        new Date(process.timestamp).toLocaleTimeString())),
                React.createElement("div", { className: "ms-2" }, getStatusBadge(process))),
            process.error && (React.createElement("div", { className: `mt-1 ${(selectedProcess === null || selectedProcess === void 0 ? void 0 : selectedProcess.processId) === process.processId
                    ? "text-warning"
                    : "text-danger"}`, style: { fontSize: "0.7rem" } },
                React.createElement("div", { className: "text-truncate" },
                    "Error: ",
                    process.error)))))),
        processes.length === 0 && !loading && (React.createElement("div", { className: "p-2 text-center text-muted small" }, "No active processes")),
        loading && processes.length === 0 && (React.createElement("div", { className: "p-2 text-center small" },
            React.createElement("div", { className: "spinner-border spinner-border-sm", role: "status" },
                React.createElement("span", { className: "visually-hidden" }, "Loading..."))))));
};
