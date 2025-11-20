"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessDetails = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const getStatusBadge = (process) => {
    switch (process.status) {
        case "running":
            return react_1.default.createElement(react_bootstrap_1.Badge, { bg: "success" }, "Running");
        case "exited":
            return react_1.default.createElement(react_bootstrap_1.Badge, { bg: "secondary" },
                "Exited (",
                process.exitCode,
                ")");
        case "error":
            return react_1.default.createElement(react_bootstrap_1.Badge, { bg: "danger" }, "Error");
        default:
            return react_1.default.createElement(react_bootstrap_1.Badge, { bg: "warning" }, "Unknown");
    }
};
const ProcessDetails = ({ selectedProcess, onKillProcess, }) => {
    if (!selectedProcess) {
        return (react_1.default.createElement("div", { className: "text-center text-muted mt-5" },
            react_1.default.createElement("i", null, "Select a process to view details")));
    }
    return (react_1.default.createElement("div", { className: "flex-grow-1 d-flex flex-column" },
        react_1.default.createElement("div", { className: "d-flex align-items-center gap-2 mb-3 flex-wrap" },
            react_1.default.createElement("div", null, getStatusBadge(selectedProcess)),
            react_1.default.createElement("div", { className: "text-muted" }, selectedProcess.pid || "N/A"),
            react_1.default.createElement("div", { className: "text-muted" }, new Date(selectedProcess.timestamp).toLocaleString()),
            selectedProcess.status === "running" && onKillProcess && (react_1.default.createElement(react_bootstrap_1.Button, { variant: "danger", size: "sm", onClick: () => onKillProcess(selectedProcess.processId), className: "flex-grow-0 ms-auto" }, "\u23F9\uFE0F Stop")),
            selectedProcess.exitCode !== undefined && (react_1.default.createElement("div", { className: "text-muted" }, selectedProcess.exitCode))),
        selectedProcess.error && (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "danger", className: "py-2 mb-3" }, selectedProcess.error)),
        react_1.default.createElement("div", null,
            react_1.default.createElement("div", { className: "mb-1 small text-muted" }, "Command:"),
            react_1.default.createElement("div", { className: "bg-dark text-light p-2 rounded", style: {
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    fontSize: "14px",
                    lineHeight: "1.4",
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    maxHeight: "200px"
                } }, selectedProcess.command))));
};
exports.ProcessDetails = ProcessDetails;
