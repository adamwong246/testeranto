"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessSidebar = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const getStatusBadge = (process) => {
    switch (process.status) {
        case 'running':
            return react_1.default.createElement(react_bootstrap_1.Badge, { bg: "success" }, "Running");
        case 'exited':
            return react_1.default.createElement(react_bootstrap_1.Badge, { bg: "secondary" },
                "Exited (",
                process.exitCode,
                ")");
        case 'error':
            return react_1.default.createElement(react_bootstrap_1.Badge, { bg: "danger" }, "Error");
        default:
            return react_1.default.createElement(react_bootstrap_1.Badge, { bg: "warning" }, "Unknown");
    }
};
const ProcessSidebar = ({ process, webSocketStatus, }) => {
    return (react_1.default.createElement("div", { className: "border-end", style: {
            width: '300px',
            minWidth: '300px',
            flexShrink: 0,
            overflowY: 'auto'
        } },
        react_1.default.createElement("div", { className: "p-3" },
            react_1.default.createElement("div", { className: "mb-3" },
                react_1.default.createElement("strong", null, "Command:"),
                react_1.default.createElement("code", { className: "bg-white p-2 rounded d-block mt-1", style: { fontSize: '0.8rem' } }, process.command)),
            react_1.default.createElement("div", { className: "mb-2" },
                react_1.default.createElement("strong", null, "Status:"),
                react_1.default.createElement("div", { className: "mt-1" }, getStatusBadge(process))),
            react_1.default.createElement("div", { className: "mb-2" },
                react_1.default.createElement("strong", null, "WebSocket:"),
                react_1.default.createElement("div", { className: "mt-1" },
                    react_1.default.createElement(react_bootstrap_1.Badge, { bg: webSocketStatus === 'connected' ? 'success' :
                            webSocketStatus === 'connecting' ? 'warning' : 'danger' }, webSocketStatus))),
            react_1.default.createElement("div", { className: "mb-2" },
                react_1.default.createElement("strong", null, "PID:"),
                react_1.default.createElement("div", { className: "text-muted" }, process.pid || 'N/A')),
            react_1.default.createElement("div", { className: "mb-2" },
                react_1.default.createElement("strong", null, "Started:"),
                react_1.default.createElement("div", { className: "text-muted" }, new Date(process.timestamp).toLocaleString())),
            process.exitCode !== undefined && (react_1.default.createElement("div", { className: "mb-2" },
                react_1.default.createElement("strong", null, "Exit Code:"),
                react_1.default.createElement("div", { className: "text-muted" }, process.exitCode))),
            process.error && (react_1.default.createElement("div", { className: "mt-3" },
                react_1.default.createElement("strong", { className: "text-danger" }, "Error:"),
                react_1.default.createElement("div", { className: "text-danger small mt-1" }, process.error))))));
};
exports.ProcessSidebar = ProcessSidebar;
