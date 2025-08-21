import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Badge } from 'react-bootstrap';
export const ProcessManager = ({ show, onHide, ws }) => {
    const [processes, setProcesses] = useState([]);
    useEffect(() => {
        if (show && ws) {
            // Request current processes when modal is shown
            ws.send(JSON.stringify({ type: 'getRunningProcesses' }));
        }
    }, [show, ws]);
    useEffect(() => {
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
    return (React.createElement(Modal, { show: show, onHide: onHide, size: "lg" },
        React.createElement(Modal.Header, { closeButton: true },
            React.createElement(Modal.Title, null, "Running Aider Processes")),
        React.createElement(Modal.Body, null,
            React.createElement(ListGroup, null,
                processes.map(process => (React.createElement(ListGroup.Item, { key: process.processId, className: "d-flex justify-content-between align-items-start" },
                    React.createElement("div", { className: "ms-2 me-auto" },
                        React.createElement("div", { className: "fw-bold" }, process.command),
                        React.createElement("small", { className: "text-muted" },
                            "PID: ",
                            process.pid || 'N/A',
                            " | Started: ",
                            new Date(process.timestamp).toLocaleString()),
                        process.error && (React.createElement("div", { className: "text-danger mt-1" },
                            React.createElement("small", null,
                                "Error: ",
                                process.error)))),
                    getStatusBadge(process)))),
                processes.length === 0 && (React.createElement(ListGroup.Item, null, "No active processes")))),
        React.createElement(Modal.Footer, null,
            React.createElement(Button, { variant: "secondary", onClick: onHide }, "Close"))));
};
