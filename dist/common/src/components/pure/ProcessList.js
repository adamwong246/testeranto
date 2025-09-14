"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessList = void 0;
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
const ProcessList = ({ processes, selectedProcess, onSelectProcess, loading, }) => {
    return (react_1.default.createElement("div", { className: "p-1" },
        [...processes].reverse().map((process) => (react_1.default.createElement("div", { key: process.processId, className: `p-2 mb-1 rounded ${(selectedProcess === null || selectedProcess === void 0 ? void 0 : selectedProcess.processId) === process.processId
                ? "bg-primary text-white"
                : "bg-white border"}`, style: { cursor: "pointer" }, onClick: () => onSelectProcess(process), title: process.command },
            react_1.default.createElement("div", { className: "d-flex justify-content-between align-items-start" },
                react_1.default.createElement("div", { className: "flex-grow-1", style: { minWidth: 0 } },
                    react_1.default.createElement("div", { className: "fw-bold text-truncate small" }, process.command.split(" ")[0]),
                    react_1.default.createElement("div", { className: `text-truncate ${(selectedProcess === null || selectedProcess === void 0 ? void 0 : selectedProcess.processId) === process.processId
                            ? "text-white-50"
                            : "text-muted"}`, style: { fontSize: "0.7rem" } },
                        "PID: ",
                        process.pid || "N/A",
                        " |",
                        " ",
                        new Date(process.timestamp).toLocaleTimeString())),
                react_1.default.createElement("div", { className: "ms-2" }, getStatusBadge(process))),
            process.error && (react_1.default.createElement("div", { className: `mt-1 ${(selectedProcess === null || selectedProcess === void 0 ? void 0 : selectedProcess.processId) === process.processId
                    ? "text-warning"
                    : "text-danger"}`, style: { fontSize: "0.7rem" } },
                react_1.default.createElement("div", { className: "text-truncate" },
                    "Error: ",
                    process.error)))))),
        processes.length === 0 && !loading && (react_1.default.createElement("div", { className: "p-2 text-center text-muted small" }, "No active processes")),
        loading && processes.length === 0 && (react_1.default.createElement("div", { className: "p-2 text-center small" },
            react_1.default.createElement("div", { className: "spinner-border spinner-border-sm", role: "status" },
                react_1.default.createElement("span", { className: "visually-hidden" }, "Loading..."))))));
};
exports.ProcessList = ProcessList;
