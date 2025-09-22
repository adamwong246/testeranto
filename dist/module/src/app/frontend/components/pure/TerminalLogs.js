import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from 'react-bootstrap';
export const TerminalLogs = ({ logs }) => {
    const [autoScroll, setAutoScroll] = useState(true);
    const logsContainerRef = useRef(null);
    // Auto-scroll to bottom when new logs arrive and autoScroll is enabled
    useEffect(() => {
        if (autoScroll && logsContainerRef.current) {
            logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
        }
    }, [logs, autoScroll]);
    // Handle scroll events to determine if we should auto-scroll
    const handleLogsScroll = useCallback(() => {
        if (logsContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = logsContainerRef.current;
            const isAtBottom = scrollHeight - scrollTop <= clientHeight + 10;
            setAutoScroll(isAtBottom);
        }
    }, []);
    const handleScrollToBottom = useCallback(() => {
        setAutoScroll(true);
        if (logsContainerRef.current) {
            logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
        }
    }, []);
    return (React.createElement("div", { ref: logsContainerRef, className: "bg-dark text-light flex-grow-1", style: {
            overflowY: "auto",
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            fontSize: "14px",
            lineHeight: "1.4",
            padding: "0.5rem"
        }, onScroll: handleLogsScroll },
        logs.length > 0 ? (React.createElement("pre", { className: "mb-0", style: {
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                backgroundColor: "transparent",
                border: "none",
                color: "inherit",
            } }, logs.join(""))) : (React.createElement("div", { className: "text-muted text-center py-4" },
            React.createElement("i", null, "No output yet"))),
        !autoScroll && (React.createElement("div", { className: "position-sticky bottom-0 d-flex justify-content-center mb-2" },
            React.createElement(Button, { variant: "primary", size: "sm", onClick: handleScrollToBottom }, "Scroll to Bottom")))));
};
