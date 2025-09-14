"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTerminalWebSocket = void 0;
const react_1 = require("react");
const useTerminalWebSocket = (ws, selectedProcess) => {
    const [processLogs, setProcessLogs] = (0, react_1.useState)([]);
    // Handle WebSocket messages for the selected process
    const handleMessage = (0, react_1.useCallback)((event) => {
        try {
            const data = JSON.parse(event.data);
            // Handle process data response
            if (data.type === "processData" &&
                selectedProcess &&
                data.processId === selectedProcess.processId) {
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
    }, [selectedProcess]);
    // Reset logs when selected process changes
    (0, react_1.useEffect)(() => {
        setProcessLogs((selectedProcess === null || selectedProcess === void 0 ? void 0 : selectedProcess.logs) || []);
    }, [selectedProcess]);
    (0, react_1.useEffect)(() => {
        if (!ws)
            return;
        ws.addEventListener('message', handleMessage);
        return () => {
            ws.removeEventListener('message', handleMessage);
        };
    }, [ws, handleMessage]);
    return {
        processLogs,
    };
};
exports.useTerminalWebSocket = useTerminalWebSocket;
