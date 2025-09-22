import { useState, useEffect, useCallback } from "react";
export const useTerminalWebSocket = (ws, selectedProcess) => {
    const [processLogs, setProcessLogs] = useState([]);
    // Handle WebSocket messages for the selected process
    const handleMessage = useCallback((event) => {
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
    useEffect(() => {
        setProcessLogs((selectedProcess === null || selectedProcess === void 0 ? void 0 : selectedProcess.logs) || []);
    }, [selectedProcess]);
    useEffect(() => {
        if (!ws)
            return;
        ws.addEventListener("message", handleMessage);
        return () => {
            ws.removeEventListener("message", handleMessage);
        };
    }, [ws, handleMessage]);
    return {
        processLogs,
    };
};
