"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessManager = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const ProcessManager = ({ show, onHide, ws }) => {
    const [processes, setProcesses] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        if (show && ws) {
            // Request current processes when modal is shown
            ws.send(JSON.stringify({ type: 'getRunningProcesses' }));
        }
    }, [show, ws]);
    (0, react_1.useEffect)(() => {
        if (!ws)
            return;
        const handleMessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'runningProcesses') {
                    setProcesses(data.processes.map((p) => (Object.assign(Object.assign({}, p), { status: 'running' }))));
                }
                else if (data.type === 'processStarted') {
                    setProcesses(prev => [...prev, Object.assign(Object.assign({}, data), { status: 'running' })]);
                }
                else if (data.type === 'processExited') {
                    setProcesses(prev => prev.map(p => p.processId === data.processId
                        ? Object.assign(Object.assign({}, p), { status: 'exited', exitCode: data.exitCode }) : p));
                }
                else if (data.type === 'processError') {
                    setProcesses(prev => prev.map(p => p.processId === data.processId
                        ? Object.assign(Object.assign({}, p), { status: 'error', error: data.error }) : p));
                }
            }
            catch (error) {
                console.error('Error parsing process message:', error);
            }
        };
        ws.addEventListener('message', handleMessage);
        return () => ws.removeEventListener('message', handleMessage);
    }, [ws]);
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
    return (react_1.default.createElement(react_bootstrap_1.Modal, { show: show, onHide: onHide, size: "lg" },
        react_1.default.createElement(react_bootstrap_1.Modal.Header, { closeButton: true },
            react_1.default.createElement(react_bootstrap_1.Modal.Title, null, "Running Aider Processes")),
        react_1.default.createElement(react_bootstrap_1.Modal.Body, null,
            react_1.default.createElement(react_bootstrap_1.ListGroup, null,
                processes.map(process => (react_1.default.createElement(react_bootstrap_1.ListGroup.Item, { key: process.processId, className: "d-flex justify-content-between align-items-start" },
                    react_1.default.createElement("div", { className: "ms-2 me-auto" },
                        react_1.default.createElement("div", { className: "fw-bold" }, process.command),
                        react_1.default.createElement("small", { className: "text-muted" },
                            "PID: ",
                            process.pid || 'N/A',
                            " | Started: ",
                            new Date(process.timestamp).toLocaleString()),
                        process.error && (react_1.default.createElement("div", { className: "text-danger mt-1" },
                            react_1.default.createElement("small", null,
                                "Error: ",
                                process.error)))),
                    getStatusBadge(process)))),
                processes.length === 0 && (react_1.default.createElement(react_bootstrap_1.ListGroup.Item, null, "No active processes")))),
        react_1.default.createElement(react_bootstrap_1.Modal.Footer, null,
            react_1.default.createElement(react_bootstrap_1.Button, { variant: "secondary", onClick: onHide }, "Close"))));
};
exports.ProcessManager = ProcessManager;
