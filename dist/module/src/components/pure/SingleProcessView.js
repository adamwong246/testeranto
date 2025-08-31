import React, { useEffect, useRef, useState } from 'react';
import { Badge, Alert } from 'react-bootstrap';
import { useWebSocket } from '../../App';
export const SingleProcessView = ({ process, onBack, loading, onKillProcess, }) => {
    var _a;
    const terminalRef = useRef(null);
    const [inputEnabled, setInputEnabled] = useState(false);
    const ws = useWebSocket();
    // Update input enabled status
    useEffect(() => {
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
    if (loading) {
        return React.createElement("div", null, "Initializing terminal...");
    }
    if (!process) {
        return (React.createElement(Alert, { variant: "warning" }, "Process not found or not running. The process may have completed."));
    }
    return (React.createElement("div", { style: { height: '100%', display: 'flex', flexDirection: 'column' } },
        React.createElement("div", { style: { flex: 1, display: 'flex', overflow: 'hidden' } },
            React.createElement("div", { className: "bg-light border-end", style: {
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
                        React.createElement("div", { className: "text-danger small mt-1" }, process.error))))),
            React.createElement("div", { style: { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 } },
                React.createElement("div", { className: "d-flex justify-content-between align-items-center p-3 border-bottom bg-white", style: { flexShrink: 0 } },
                    React.createElement("small", { className: "text-muted" },
                        ((_a = process.logs) === null || _a === void 0 ? void 0 : _a.length) || 0,
                        " lines")),
                React.createElement("div", { className: "bg-dark text-light flex-grow-1", style: {
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
                    } }, process.logs && process.logs.length > 0 ? (React.createElement("pre", { className: "mb-0", style: {
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'inherit'
                    } }, process.logs.join(''))) : (React.createElement("div", { className: "text-muted text-center py-4" },
                    React.createElement("i", null, "No output yet")))))),
        inputEnabled && (React.createElement("div", { className: "border-top bg-white p-3", style: { flexShrink: 0 } },
            React.createElement("div", { className: "input-group" },
                React.createElement("input", { type: "text", className: "form-control", placeholder: "Type input and press Enter...", onKeyPress: (e) => {
                        if (e.key === 'Enter') {
                            const target = e.target;
                            const inputValue = target.value;
                            if (inputValue.trim()) {
                                handleInput(inputValue + '\n');
                                target.value = '';
                            }
                        }
                    }, autoFocus: true }),
                React.createElement("button", { className: "btn btn-primary", type: "button", onClick: () => {
                        const input = document.querySelector('input');
                        const inputValue = input.value;
                        if (inputValue.trim()) {
                            handleInput(inputValue + '\n');
                            input.value = '';
                        }
                    } }, "Send")),
            React.createElement("small", { className: "text-muted" }, "\uD83D\uDCA1 Press Enter to send input to the process"))),
        !inputEnabled && process.status === 'running' && (React.createElement(Alert, { variant: "info", className: "m-3", style: { flexShrink: 0 } },
            React.createElement(Alert.Heading, { className: "h6" }, "Input Disabled"),
            React.createElement("small", null, "Terminal input is temporarily unavailable. Try refreshing the page."))),
        process.status !== 'running' && (React.createElement(Alert, { variant: "secondary", className: "m-3", style: { flexShrink: 0 } },
            React.createElement(Alert.Heading, { className: "h6" }, "Read-only Mode"),
            React.createElement("small", null, "This process is no longer running. You can view the output logs but cannot send input.")))));
};
