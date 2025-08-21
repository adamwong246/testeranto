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
exports.ProcessManagerView = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const react_router_dom_1 = require("react-router-dom");
const ProcessManagerView = ({ processes, onRefresh, onBack, loading, onKillProcess, }) => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [selectedProcess, setSelectedProcess] = (0, react_1.useState)(null);
    const [ws, setWs] = (0, react_1.useState)(null);
    const [processLogs, setProcessLogs] = (0, react_1.useState)([]);
    const [autoScroll, setAutoScroll] = (0, react_1.useState)(true);
    const logsContainerRef = (0, react_1.useRef)(null);
    const [isNavbarCollapsed, setIsNavbarCollapsed] = (0, react_1.useState)(false);
    // Set up WebSocket connection
    (0, react_1.useEffect)(() => {
        const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${wsProtocol}//${window.location.host}`;
        const websocket = new WebSocket(wsUrl);
        setWs(websocket);
        websocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // Handle process data response
                if (data.type === "processData" &&
                    selectedProcess &&
                    data.processId === selectedProcess.processId) {
                    setSelectedProcess((prev) => prev
                        ? Object.assign(Object.assign({}, prev), { logs: data.logs || [] }) : null);
                    setProcessLogs(data.logs || []);
                }
                // Handle new log messages
                else if ((data.type === "processStdout" || data.type === "processStderr") &&
                    selectedProcess &&
                    data.processId === selectedProcess.processId) {
                    setProcessLogs((prev) => [...prev, data.data]);
                }
            }
            catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };
        return () => {
            websocket.close();
        };
    }, [selectedProcess]);
    // Request process data when selected
    (0, react_1.useEffect)(() => {
        if (selectedProcess && ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: "getProcess",
                processId: selectedProcess.processId,
            }));
        }
    }, [selectedProcess, ws]);
    // Auto-scroll to bottom when new logs arrive and autoScroll is enabled
    (0, react_1.useEffect)(() => {
        if (autoScroll && logsContainerRef.current) {
            logsContainerRef.current.scrollTop =
                logsContainerRef.current.scrollHeight;
        }
    }, [processLogs, autoScroll]);
    // Handle scroll events to determine if we should auto-scroll
    const handleLogsScroll = () => {
        if (logsContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = logsContainerRef.current;
            const isAtBottom = scrollHeight - scrollTop <= clientHeight + 10; // 10px threshold
            setAutoScroll(isAtBottom);
        }
    };
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
    const handleSelectProcess = (process) => {
        setSelectedProcess(process);
        setProcessLogs(process.logs || []);
    };
    const handleInput = (data) => {
        if (ws &&
            ws.readyState === WebSocket.OPEN &&
            (selectedProcess === null || selectedProcess === void 0 ? void 0 : selectedProcess.status) === "running") {
            ws.send(JSON.stringify({
                type: "stdin",
                processId: selectedProcess.processId,
                data: data,
            }));
        }
    };
    return (react_1.default.createElement(react_bootstrap_1.Container, { fluid: true, className: "px-0 h-100" },
        react_1.default.createElement(react_bootstrap_1.Row, { className: "g-0", style: { height: "calc(100vh - 56px)" } },
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 3, className: "border-end", style: {
                    height: "100%",
                    overflow: "auto",
                    backgroundColor: "#f8f9fa",
                } },
                react_1.default.createElement("div", { className: "p-1" },
                    processes.map((process) => (react_1.default.createElement("div", { key: process.processId, className: `p-2 mb-1 rounded ${(selectedProcess === null || selectedProcess === void 0 ? void 0 : selectedProcess.processId) === process.processId
                            ? "bg-primary text-white"
                            : "bg-white border"}`, style: { cursor: "pointer" }, onClick: () => handleSelectProcess(process), title: process.command },
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
                            react_1.default.createElement("span", { className: "visually-hidden" }, "Loading...")))))),
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 5, className: "border-end p-3", style: { height: "100%", overflow: "auto" } }, selectedProcess ? (react_1.default.createElement("div", null,
                react_1.default.createElement("div", { className: "mb-3" },
                    react_1.default.createElement("strong", null, "Command:"),
                    react_1.default.createElement("code", { className: "bg-light p-2 rounded d-block mt-1", style: { fontSize: "0.8rem" } }, selectedProcess.command)),
                react_1.default.createElement("div", { className: "mb-2" },
                    react_1.default.createElement("strong", null, "Status:"),
                    react_1.default.createElement("div", { className: "mt-1" }, getStatusBadge(selectedProcess))),
                react_1.default.createElement("div", { className: "mb-2" },
                    react_1.default.createElement("strong", null, "PID:"),
                    react_1.default.createElement("div", { className: "text-muted" }, selectedProcess.pid || "N/A")),
                react_1.default.createElement("div", { className: "mb-2" },
                    react_1.default.createElement("strong", null, "Started:"),
                    react_1.default.createElement("div", { className: "text-muted" }, new Date(selectedProcess.timestamp).toLocaleString())),
                selectedProcess.exitCode !== undefined && (react_1.default.createElement("div", { className: "mb-2" },
                    react_1.default.createElement("strong", null, "Exit Code:"),
                    react_1.default.createElement("div", { className: "text-muted" }, selectedProcess.exitCode))),
                selectedProcess.error && (react_1.default.createElement("div", { className: "mt-3" },
                    react_1.default.createElement("strong", { className: "text-danger" }, "Error:"),
                    react_1.default.createElement("div", { className: "text-danger small mt-1" }, selectedProcess.error))))) : (react_1.default.createElement("div", { className: "text-center text-muted mt-5" },
                react_1.default.createElement("i", null, "Select a process to view details")))),
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 4, className: "p-0", style: { height: "100%", overflow: "hidden" } }, selectedProcess ? (react_1.default.createElement("div", { className: "d-flex flex-column h-100" },
                react_1.default.createElement("div", { ref: logsContainerRef, className: "bg-dark text-light flex-grow-1", style: {
                        overflowY: "auto",
                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                        fontSize: "14px",
                        lineHeight: "1.4",
                        // padding: '1rem'
                    }, onScroll: handleLogsScroll },
                    processLogs.length > 0 ? (react_1.default.createElement("pre", { className: "mb-0", style: {
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            backgroundColor: "transparent",
                            border: "none",
                            color: "inherit",
                        } }, processLogs.join(""))) : (react_1.default.createElement("div", { className: "text-muted text-center py-4" },
                        react_1.default.createElement("i", null, "No output yet"))),
                    !autoScroll && (react_1.default.createElement("div", { className: "position-sticky bottom-0 d-flex justify-content-center mb-2" },
                        react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", size: "sm", onClick: () => {
                                setAutoScroll(true);
                                if (logsContainerRef.current) {
                                    logsContainerRef.current.scrollTop =
                                        logsContainerRef.current.scrollHeight;
                                }
                            } }, "Scroll to Bottom")))),
                selectedProcess.status === "running" && (react_1.default.createElement("div", { className: "border-top bg-white p-3", style: { flexShrink: 0 } },
                    onKillProcess && (react_1.default.createElement("div", { className: "mb-3" },
                        react_1.default.createElement(react_bootstrap_1.Button, { variant: "danger", size: "sm", onClick: () => onKillProcess(selectedProcess.processId), className: "w-100" }, "\u23F9\uFE0F Stop Process"))),
                    react_1.default.createElement("div", { className: "input-group" },
                        react_1.default.createElement("input", { type: "text", className: "form-control", placeholder: "Type input and press Enter...", onKeyPress: (e) => {
                                if (e.key === "Enter") {
                                    const target = e.target;
                                    const inputValue = target.value;
                                    if (inputValue.trim()) {
                                        handleInput(inputValue + "\n");
                                        target.value = "";
                                    }
                                }
                            }, autoFocus: true }),
                        react_1.default.createElement("button", { className: "btn btn-primary", type: "button", onClick: () => {
                                const input = document.querySelector("input");
                                const inputValue = input.value;
                                if (inputValue.trim()) {
                                    handleInput(inputValue + "\n");
                                    input.value = "";
                                }
                            } }, "Send")),
                    react_1.default.createElement("small", { className: "text-muted" }, "\uD83D\uDCA1 Press Enter to send input to the process"))))) : (react_1.default.createElement("div", { className: "p-3 text-center text-muted mt-5" },
                react_1.default.createElement("i", null, "Live logs will appear here when a process is selected")))))));
};
exports.ProcessManagerView = ProcessManagerView;
