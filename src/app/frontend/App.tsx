/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export const App = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");

  useEffect(() => {
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//${window.location.host}`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      setWs(websocket);
      setConnectionStatus("Connected");
      addMessage({ type: "system", message: "WebSocket connected" });
    };

    websocket.onclose = () => {
      console.log("WebSocket disconnected");
      setWs(null);
      setIsConnected(false);
      setConnectionStatus("Disconnected");
      addMessage({ type: "system", message: "WebSocket disconnected" });
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
      setConnectionStatus("Error");
      addMessage({ type: "error", message: "WebSocket error occurred" });
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);

        // Handle different message types
        if (data.type === "allProcesses") {
          console.log(`Received ${data.count} processes`);
          // Add each process as a separate message for display
          data.processes.forEach((process: any) => {
            addMessage({
              type: "processLoaded",
              processId: process.processId,
              command: process.command,
              status: process.status,
              timestamp: process.timestamp,
              logs: process.logs,
              message: `Loaded process: ${process.command} (${process.status})`,
            });
          });
          // Also add a summary message
          addMessage({
            type: "system",
            message: `Loaded ${data.count} existing processes from server`,
          });
        } else if (data.type === "processSummary") {
          addMessage({
            type: "system",
            message: `Process summary: ${data.running} running, ${data.completed} completed, ${data.error} errors (total: ${data.total})`,
          });
        } else {
          // For all other messages, add them normally
          addMessage(data);
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
        addMessage({
          type: "error",
          message: `Raw message: ${event.data.substring(0, 100)}`,
        });
      }
    };

    return () => {
      websocket.close();
    };
  }, []);

  const addMessage = (message: WebSocketMessage) => {
    setMessages((prev) => {
      const newMessages = [
        ...prev,
        { ...message, timestamp: new Date().toISOString() },
      ];
      // Keep only the last 50 messages
      if (newMessages.length > 50) {
        return newMessages.slice(-50);
      }
      return newMessages;
    });
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const sendTestMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const testMessage = {
        type: "test",
        message: "Hello from frontend",
        timestamp: new Date().toISOString(),
      };
      ws.send(JSON.stringify(testMessage));
      addMessage({ type: "sent", ...testMessage });
    }
  };

  const requestRunningProcesses = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const request = { type: "getRunningProcesses" };
      ws.send(JSON.stringify(request));
      addMessage({ type: "sent", ...request });
    }
  };

  const triggerTestProcess = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const testMessage = {
        type: "triggerTest",
        message: "Trigger a test process",
        timestamp: new Date().toISOString(),
      };
      ws.send(JSON.stringify(testMessage));
      addMessage({ type: "sent", ...testMessage });
    }
  };

  const refreshProcesses = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const request = {
        type: "getRunningProcesses",
        timestamp: new Date().toISOString(),
      };
      ws.send(JSON.stringify(request));
      addMessage({ type: "sent", ...request });
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>WebSocket Monitor</h1>

      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "inline-block",
            padding: "5px 10px",
            backgroundColor: isConnected ? "#4CAF50" : "#f44336",
            color: "white",
            borderRadius: "4px",
            marginRight: "10px",
          }}
        >
          Status: {connectionStatus}
        </div>

        <button
          onClick={sendTestMessage}
          disabled={!isConnected}
          style={{
            marginRight: "10px",
            padding: "8px 16px",
            backgroundColor: isConnected ? "#2196F3" : "#cccccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isConnected ? "pointer" : "not-allowed",
          }}
        >
          Send Test Message
        </button>

        <button
          onClick={requestRunningProcesses}
          disabled={!isConnected}
          style={{
            marginRight: "10px",
            padding: "8px 16px",
            backgroundColor: isConnected ? "#9C27B0" : "#cccccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isConnected ? "pointer" : "not-allowed",
          }}
        >
          Get Running Processes
        </button>

        <button
          onClick={triggerTestProcess}
          disabled={!isConnected}
          style={{
            marginRight: "10px",
            padding: "8px 16px",
            backgroundColor: isConnected ? "#FF5722" : "#cccccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isConnected ? "pointer" : "not-allowed",
          }}
        >
          Trigger Test Process
        </button>

        <button
          onClick={refreshProcesses}
          disabled={!isConnected}
          style={{
            marginRight: "10px",
            padding: "8px 16px",
            backgroundColor: isConnected ? "#607D8B" : "#cccccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isConnected ? "pointer" : "not-allowed",
          }}
        >
          Refresh Processes
        </button>

        <button
          onClick={clearMessages}
          style={{
            padding: "8px 16px",
            backgroundColor: "#FF9800",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Clear Messages
        </button>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "4px",
          padding: "10px",
          maxHeight: "500px",
          overflowY: "auto",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3>Messages ({messages.length})</h3>
        {messages.length === 0 ? (
          <p style={{ color: "#666", fontStyle: "italic" }}>
            No messages yet. WebSocket messages will appear here.
          </p>
        ) : (
          <div>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  padding: "8px",
                  marginBottom: "8px",
                  borderLeft: "4px solid",
                  borderLeftColor:
                    msg.type === "system"
                      ? "#2196F3"
                      : msg.type === "error"
                        ? "#f44336"
                        : msg.type === "sent"
                          ? "#4CAF50"
                          : "#9E9E9E",
                  backgroundColor: "white",
                  borderRadius: "0 4px 4px 0",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong style={{ color: "#333" }}>{msg.type}</strong>
                  <small style={{ color: "#666" }}>
                    {new Date(msg.timestamp || Date.now()).toLocaleTimeString()}
                  </small>
                </div>
                <div>
                  {msg.message && (
                    <div style={{ marginBottom: "8px" }}>{msg.message}</div>
                  )}
                  {msg.logs && msg.logs.length > 0 && (
                    <div
                      style={{
                        marginTop: "8px",
                        padding: "8px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "4px",
                        fontSize: "11px",
                        maxHeight: "200px",
                        overflowY: "auto",
                      }}
                    >
                      <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                        Logs ({msg.logs.length}):
                      </div>
                      {msg.logs.map((log: string, index: number) => (
                        <div
                          key={index}
                          style={{
                            padding: "2px 0",
                            borderBottom:
                              index < msg.logs.length - 1
                                ? "1px solid #ddd"
                                : "none",
                            fontFamily: "monospace",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-all",
                          }}
                        >
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                  <pre
                    style={{
                      margin: "8px 0 0 0",
                      padding: "8px",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "4px",
                      fontSize: "12px",
                      overflowX: "auto",
                    }}
                  >
                    {JSON.stringify(msg, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        <p>
          This is a simple WebSocket monitor to verify WebSocket connectivity.
        </p>
        <p>
          Messages are displayed in real-time as they arrive from the server.
        </p>
      </div>
    </div>
  );
};

function initApp() {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(React.createElement(App));
    } catch (err) {
      console.error("Error rendering app:", err);
      setTimeout(initApp, 100);
    }
  } else {
    setTimeout(initApp, 100);
  }
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
}
