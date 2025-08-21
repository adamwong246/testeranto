import React, { useState, useEffect, useCallback } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { SingleProcessView } from "../pure/SingleProcessView";
import { Process } from "../pure/ProcessManagerView";

export const SingleProcessPage: React.FC = () => {
  const [process, setProcess] = useState<Process | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { processId } = useParams<{ processId: string }>();

  // Connect to WebSocket
  useEffect(() => {
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//${window.location.host}`;
    const websocket = new WebSocket(wsUrl);
    setWs(websocket);

    // Set a timeout to handle cases where we don't get a response
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        // If we're still loading after 3 seconds, show an error
        setProcess(null);
      }
    }, 3000);

    // Request specific process when connected
    websocket.onopen = () => {
      setLoading(true);
      if (processId) {
        websocket.send(
          JSON.stringify({
            type: "getProcess",
            processId,
          })
        );
      }
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setLoading(false);
      setProcess(null);
      clearTimeout(timeoutId);
    };

    const handleMessage = (event: MessageEvent) => {
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
        else if (
          (data.type === "processStdout" || data.type === "processStderr") &&
          data.processId === processId
        ) {
          setProcess((prev) =>
            prev
              ? {
                ...prev,
                logs: [...(prev.logs || []), data.data],
              }
              : null
          );
        }
        // Handle process completion
        else if (
          (data.type === "processExited" || data.type === "processError") &&
          data.processId === processId
        ) {
          setProcess((prev) =>
            prev
              ? {
                ...prev,
                status: data.type === "processExited" ? "exited" : "error",
                exitCode: data.exitCode,
                error: data.error,
              }
              : null
          );
        }
      } catch (error) {
        console.error("Error parsing process message:", error);
        setLoading(false);
        setProcess(null);
        clearTimeout(timeoutId);
      }
    };

    websocket.addEventListener("message", handleMessage);

    return () => {
      websocket.removeEventListener("message", handleMessage);
      websocket.close();
      clearTimeout(timeoutId);
    };
  }, [processId]);

  // Try to find the process in the global state if WebSocket doesn't respond
  useEffect(() => {
    // This is a fallback - in a real implementation, you'd want to get this from a global state
    // or through some other means
  }, []);

  const handleBack = useCallback(() => {
    navigate("/processes");
  }, [navigate]);

  const handleKillProcess = useCallback(
    (processId: string) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        console.log("Sending killProcess for:", processId);
        ws.send(
          JSON.stringify({
            type: "killProcess",
            processId,
          })
        );
      } else {
        console.log("Cannot send killProcess - WebSocket not ready:", {
          wsExists: !!ws,
          wsReady: ws?.readyState,
        });
      }
    },
    [ws]
  );

  return (
    <SingleProcessView
      process={process}
      onBack={handleBack}
      loading={loading}
      onKillProcess={handleKillProcess}
      ws={ws}
    />
  );
};
