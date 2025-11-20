import React, { useCallback } from "react";
import { useTerminalWebSocket } from "../../useTerminalWebSocket";
import { TerminalLogs } from "./TerminalLogs";
import { TerminalInput } from "./TerminalInput";
export const ProcessTerminal = ({ selectedProcess, ws, }) => {
    const { processLogs } = useTerminalWebSocket(ws, selectedProcess);
    const handleInput = useCallback((data) => {
        if (ws &&
            ws.readyState === WebSocket.OPEN &&
            (selectedProcess === null || selectedProcess === void 0 ? void 0 : selectedProcess.status) === "running") {
            ws.send(JSON.stringify({
                type: "stdin",
                processId: selectedProcess.processId,
                data: data,
            }));
        }
    }, [ws, selectedProcess]);
    if (!selectedProcess) {
        return (React.createElement("div", { className: "text-center text-muted mt-5" },
            React.createElement("i", null, "Terminal will appear here when a process is selected")));
    }
    return (React.createElement("div", { className: "flex-grow-1 d-flex flex-column", style: { minHeight: 0 } },
        React.createElement(TerminalLogs, { logs: processLogs }),
        selectedProcess.status === "running" && (React.createElement(TerminalInput, { onInput: handleInput }))));
};
