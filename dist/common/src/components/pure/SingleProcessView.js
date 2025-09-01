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
exports.SingleProcessView = void 0;
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const App_1 = require("../../App");
const SingleProcessView = ({ process, onBack, loading, onKillProcess, }) => {
    var _a;
    const terminalRef = (0, react_1.useRef)(null);
    const [inputEnabled, setInputEnabled] = (0, react_1.useState)(false);
    const ws = (0, App_1.useWebSocket)();
    // Update input enabled status
    (0, react_1.useEffect)(() => {
        setInputEnabled((process === null || process === void 0 ? void 0 : process.status) === 'running');
    }, [process === null || process === void 0 ? void 0 : process.status]);
    // Handle user input
    const handleInput = (data) => {
        if (ws && ws.readyState === WebSocket.OPEN && (process === null || process === void 0 ? void 0 : process.status) === 'running') {
            console.log('Sending stdin:', data);
            ws.send(JSON.stringify({
                type: 'stdin',
                processId: process.processId,
                data: data
            }));
        }
        else {
            console.log('Cannot send stdin - conditions not met:', {
                wsExists: !!ws,
                wsReady: ws === null || ws === void 0 ? void 0 : ws.readyState,
                processStatus: process === null || process === void 0 ? void 0 : process.status
            });
        }
    };
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
    if (loading) {
        return react_1.default.createElement("div", null, "Initializing terminal...");
    }
    if (!process) {
        return (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "warning" }, "Process not found or not running. The process may have completed."));
    }
    return (react_1.default.createElement("div", { style: { height: '100%', display: 'flex', flexDirection: 'column' } },
        react_1.default.createElement("div", { style: { flex: 1, display: 'flex', overflow: 'hidden' } },
            react_1.default.createElement("div", { className: "bg-light border-end", style: {
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
                        react_1.default.createElement("div", { className: "text-danger small mt-1" }, process.error))))),
            react_1.default.createElement("div", { style: { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 } },
                react_1.default.createElement("div", { className: "d-flex justify-content-between align-items-center p-3 border-bottom bg-white", style: { flexShrink: 0 } },
                    react_1.default.createElement("small", { className: "text-muted" },
                        ((_a = process.logs) === null || _a === void 0 ? void 0 : _a.length) || 0,
                        " lines")),
                react_1.default.createElement("div", { className: "bg-dark text-light flex-grow-1", style: {
                        overflowY: 'auto',
                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                        fontSize: '14px',
                        lineHeight: '1.4',
                        padding: '1rem'
                    }, ref: (el) => {
                        // Auto-scroll to bottom when logs update
                        if (el) {
                            el.scrollTop = el.scrollHeight;
                        }
                    } }, process.logs && process.logs.length > 0 ? (react_1.default.createElement("pre", { className: "mb-0", style: {
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'inherit'
                    } }, process.logs.join(''))) : (react_1.default.createElement("div", { className: "text-muted text-center py-4" },
                    react_1.default.createElement("i", null, "No output yet")))))),
        inputEnabled && (react_1.default.createElement("div", { className: "border-top bg-white p-3", style: { flexShrink: 0 } },
            react_1.default.createElement("div", { className: "input-group" },
                react_1.default.createElement("input", { type: "text", className: "form-control", placeholder: "Type input and press Enter...", onKeyPress: (e) => {
                        if (e.key === 'Enter') {
                            const target = e.target;
                            const inputValue = target.value;
                            if (inputValue.trim()) {
                                handleInput(inputValue + '\n');
                                target.value = '';
                            }
                        }
                    }, autoFocus: true }),
                react_1.default.createElement("button", { className: "btn btn-primary", type: "button", onClick: () => {
                        const input = document.querySelector('input');
                        const inputValue = input.value;
                        if (inputValue.trim()) {
                            handleInput(inputValue + '\n');
                            input.value = '';
                        }
                    } }, "Send")),
            react_1.default.createElement("small", { className: "text-muted" }, "\uD83D\uDCA1 Press Enter to send input to the process"))),
        !inputEnabled && process.status === 'running' && (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "info", className: "m-3", style: { flexShrink: 0 } },
            react_1.default.createElement(react_bootstrap_1.Alert.Heading, { className: "h6" }, "Input Disabled"),
            react_1.default.createElement("small", null, "Terminal input is temporarily unavailable. Try refreshing the page."))),
        process.status !== 'running' && (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "secondary", className: "m-3", style: { flexShrink: 0 } },
            react_1.default.createElement(react_bootstrap_1.Alert.Heading, { className: "h6" }, "Read-only Mode"),
            react_1.default.createElement("small", null, "This process is no longer running. You can view the output logs but cannot send input.")))));
};
exports.SingleProcessView = SingleProcessView;
