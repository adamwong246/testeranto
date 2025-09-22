import React, { useEffect, useRef } from 'react';
export const ProcessLogs = ({ logs }) => {
    const logsEndRef = useRef(null);
    useEffect(() => {
        var _a;
        // Auto-scroll to bottom when logs update
        (_a = logsEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);
    return (React.createElement("div", { style: { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 } },
        React.createElement("div", { className: "d-flex justify-content-between align-items-center p-3 border-bottom bg-white", style: { flexShrink: 0 } },
            React.createElement("small", { className: "text-muted" },
                (logs === null || logs === void 0 ? void 0 : logs.length) || 0,
                " lines")),
        React.createElement("div", { className: "bg-dark text-light flex-grow-1", style: {
                overflowY: 'auto',
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                fontSize: '14px',
                lineHeight: '1.4',
                padding: '1rem'
            } },
            logs && logs.length > 0 ? (React.createElement("pre", { className: "mb-0", style: {
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'inherit'
                } }, logs.join(''))) : (React.createElement("div", { className: "text-muted text-center py-4" },
                React.createElement("i", null, "No output yet"))),
            React.createElement("div", { ref: logsEndRef }))));
};
