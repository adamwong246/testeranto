import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SingleProcessView } from "../pure/SingleProcessView";
import { useWebSocket } from '../../App';
export const SingleProcessPage = () => {
    const [process, setProcess] = useState(null);
    const ws = useWebSocket();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { processId } = useParams();
    // Handle WebSocket messages
    useEffect(() => {
        if (!ws)
            return;
        // Set a timeout to handle cases where we don't get a response
        const timeoutId = setTimeout(() => {
            if (loading) {
                setLoading(false);
                // If we're still loading after 3 seconds, show an error
                setProcess(null);
            }
        }, 3000);
        const handleMessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // Handle process data response - this should include all captured logs
                if (data.type === "processData" && data.processId === processId) {
                    setProcess({
                        processId: data.processId,
                        command: data.command,
                        pid: data.pid,
                        timestamp: data.timestamp,
                        status: data.status || "running",
                        exitCode: data.exitCode,
                        error: data.error,
                        // Use the logs sent from the server, which should include all captured logs
                        logs: data.logs || [],
                    });
                    setLoading(false);
                    clearTimeout(timeoutId);
                }
                // Handle new log messages that come after the initial data
                else if ((data.type === "processStdout" || data.type === "processStderr") &&
                    data.processId === processId) {
                    setProcess((prev) => prev
                        ? Object.assign(Object.assign({}, prev), { logs: [...(prev.logs || []), data.data] }) : null);
                }
                // Handle process completion
                else if ((data.type === "processExited" || data.type === "processError") &&
                    data.processId === processId) {
                    setProcess((prev) => prev
                        ? Object.assign(Object.assign({}, prev), { status: data.type === "processExited" ? "exited" : "error", exitCode: data.exitCode, error: data.error }) : null);
                }
            }
            catch (error) {
                console.error("Error parsing process message:", error);
                setLoading(false);
                setProcess(null);
                clearTimeout(timeoutId);
            }
        };
        ws.addEventListener("message", handleMessage);
        // Request specific process when connected
        if (ws.readyState === WebSocket.OPEN && processId) {
            setLoading(true);
            ws.send(JSON.stringify({
                type: "getProcess",
                processId,
            }));
        }
        return () => {
            ws.removeEventListener("message", handleMessage);
            clearTimeout(timeoutId);
        };
    }, [ws, processId]);
    // Try to find the process in the global state if WebSocket doesn't respond
    useEffect(() => {
        // This is a fallback - in a real implementation, you'd want to get this from a global state
        // or through some other means
    }, []);
    const handleBack = useCallback(() => {
        navigate("/processes");
    }, [navigate]);
    const handleKillProcess = useCallback((processId) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            console.log("Sending killProcess for:", processId);
            ws.send(JSON.stringify({
                type: "killProcess",
                processId,
            }));
        }
        else {
            console.log("Cannot send killProcess - WebSocket not ready:", {
                wsExists: !!ws,
                wsReady: ws === null || ws === void 0 ? void 0 : ws.readyState,
            });
        }
    }, [ws]);
    return (React.createElement(SingleProcessView, { process: process, onBack: handleBack, loading: loading, onKillProcess: handleKillProcess, ws: ws }));
};
