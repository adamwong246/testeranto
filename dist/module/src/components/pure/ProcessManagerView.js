/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Badge, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
export const ProcessManagerView = ({ processes, onRefresh, onBack, loading, onKillProcess, }) => {
    const navigate = useNavigate();
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [ws, setWs] = useState(null);
    const [processLogs, setProcessLogs] = useState([]);
    const [autoScroll, setAutoScroll] = useState(true);
    const logsContainerRef = useRef(null);
    const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
    // Set up WebSocket connection
    useEffect(() => {
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
    useEffect(() => {
        if (selectedProcess && ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: "getProcess",
                processId: selectedProcess.processId,
            }));
        }
    }, [selectedProcess, ws]);
    // Auto-scroll to bottom when new logs arrive and autoScroll is enabled
    useEffect(() => {
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
    return (React.createElement(Container, { fluid: true, className: "px-0 h-100" },
        React.createElement(Row, { className: "g-0", style: { height: "calc(100vh - 56px)" } },
            React.createElement(Col, { sm: 2, className: "border-end", style: {
                    height: "100%",
                    overflow: "auto",
                    backgroundColor: "#f8f9fa",
                } },
                React.createElement("div", { className: "p-1" },
                    processes.map((process) => (React.createElement("div", { key: process.processId, className: `p-2 mb-1 rounded ${(selectedProcess === null || selectedProcess === void 0 ? void 0 : selectedProcess.processId) === process.processId
                            ? "bg-primary text-white"
                            : "bg-white border"}`, style: { cursor: "pointer" }, onClick: () => handleSelectProcess(process), title: process.command },
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
                            React.createElement("span", { className: "visually-hidden" }, "Loading...")))))),
            React.createElement(Col, { sm: 5, className: "border-end p-3 d-flex flex-column", style: { height: "100%", overflow: "hidden" } }, selectedProcess ? (React.createElement("div", { className: "flex-grow-1 d-flex flex-column" },
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
                            maxHeight: "200px" // Prevent it from expanding too much
                        } }, selectedProcess.command)))) : (React.createElement("div", { className: "text-center text-muted mt-5" },
                React.createElement("i", null, "Select a process to view details")))),
            React.createElement(Col, { sm: 5, className: "p-3 d-flex flex-column", style: { height: "100%", overflow: "hidden" } }, selectedProcess ? (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "flex-grow-1 d-flex flex-column", style: { minHeight: 0 } },
                    React.createElement("div", { ref: logsContainerRef, className: "bg-dark text-light flex-grow-1", style: {
                            overflowY: "auto",
                            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                            fontSize: "14px",
                            lineHeight: "1.4",
                            padding: "0.5rem"
                        }, onScroll: handleLogsScroll },
                        processLogs.length > 0 ? (React.createElement("pre", { className: "mb-0", style: {
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                                backgroundColor: "transparent",
                                border: "none",
                                color: "inherit",
                            } }, processLogs.join(""))) : (React.createElement("div", { className: "text-muted text-center py-4" },
                            React.createElement("i", null, "No output yet"))),
                        !autoScroll && (React.createElement("div", { className: "position-sticky bottom-0 d-flex justify-content-center mb-2" },
                            React.createElement(Button, { variant: "primary", size: "sm", onClick: () => {
                                    setAutoScroll(true);
                                    if (logsContainerRef.current) {
                                        logsContainerRef.current.scrollTop =
                                            logsContainerRef.current.scrollHeight;
                                    }
                                } }, "Scroll to Bottom")))),
                    selectedProcess.status === "running" && (React.createElement("div", { className: "border-top bg-white p-2 mt-2", style: { flexShrink: 0 } },
                        React.createElement("div", { className: "input-group" },
                            React.createElement("input", { type: "text", className: "form-control", placeholder: "Type input and press Enter...", onKeyPress: (e) => {
                                    if (e.key === "Enter") {
                                        const target = e.target;
                                        const inputValue = target.value;
                                        if (inputValue.trim()) {
                                            handleInput(inputValue + "\n");
                                            target.value = "";
                                        }
                                    }
                                }, autoFocus: true }),
                            React.createElement("button", { className: "btn btn-primary", type: "button", onClick: () => {
                                    const input = document.querySelector("input");
                                    const inputValue = input.value;
                                    if (inputValue.trim()) {
                                        handleInput(inputValue + "\n");
                                        input.value = "";
                                    }
                                } }, "Send"))))))) : (React.createElement("div", { className: "text-center text-muted mt-5" },
                React.createElement("i", null, "Terminal will appear here when a process is selected")))))));
};
