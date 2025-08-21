/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Badge, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export interface Process {
  processId: string;
  command: string;
  pid?: number;
  status?: "running" | "exited" | "error";
  exitCode?: number;
  error?: string;
  timestamp: string;
  logs?: string[];
}

interface ProcessManagerViewProps {
  processes: Process[];
  onRefresh: () => void;
  onBack: () => void;
  loading: boolean;
  onKillProcess?: (processId: string) => void;
}

export const ProcessManagerView: React.FC<ProcessManagerViewProps> = ({
  processes,
  onRefresh,
  onBack,
  loading,
  onKillProcess,
}) => {
  const navigate = useNavigate();
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [processLogs, setProcessLogs] = useState<string[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const logsContainerRef = useRef<HTMLDivElement>(null);
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
        if (
          data.type === "processData" &&
          selectedProcess &&
          data.processId === selectedProcess.processId
        ) {
          setSelectedProcess((prev) =>
            prev
              ? {
                ...prev,
                logs: data.logs || [],
              }
              : null
          );
          setProcessLogs(data.logs || []);
        }
        // Handle new log messages
        else if (
          (data.type === "processStdout" || data.type === "processStderr") &&
          selectedProcess &&
          data.processId === selectedProcess.processId
        ) {
          setProcessLogs((prev) => [...prev, data.data]);
        }
      } catch (error) {
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
      ws.send(
        JSON.stringify({
          type: "getProcess",
          processId: selectedProcess.processId,
        })
      );
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
      const { scrollTop, scrollHeight, clientHeight } =
        logsContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 10; // 10px threshold
      setAutoScroll(isAtBottom);
    }
  };

  const getStatusBadge = (process: Process) => {
    switch (process.status) {
      case "running":
        return <Badge bg="success">Running</Badge>;
      case "exited":
        return <Badge bg="secondary">Exited ({process.exitCode})</Badge>;
      case "error":
        return <Badge bg="danger">Error</Badge>;
      default:
        return <Badge bg="warning">Unknown</Badge>;
    }
  };

  const handleSelectProcess = (process: Process) => {
    setSelectedProcess(process);
    setProcessLogs(process.logs || []);
  };

  const handleInput = (data: string) => {
    if (
      ws &&
      ws.readyState === WebSocket.OPEN &&
      selectedProcess?.status === "running"
    ) {
      ws.send(
        JSON.stringify({
          type: "stdin",
          processId: selectedProcess.processId,
          data: data,
        })
      );
    }
  };

  return (
    <Container fluid className="px-0 h-100">
      <Row className="g-0" style={{ height: "calc(100vh - 56px)" }}>
        {/* Left Column - Process List (Compact) */}
        <Col
          sm={3}
          className="border-end"
          style={{
            height: "100%",
            overflow: "auto",
            backgroundColor: "#f8f9fa",
          }}
        >

          <div className="p-1">
            {processes.map((process) => (
              <div
                key={process.processId}
                className={`p-2 mb-1 rounded ${selectedProcess?.processId === process.processId
                  ? "bg-primary text-white"
                  : "bg-white border"
                  }`}
                style={{ cursor: "pointer" }}
                onClick={() => handleSelectProcess(process)}
                title={process.command}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <div className="fw-bold text-truncate small">
                      {process.command.split(" ")[0]}
                    </div>
                    <div
                      className={`text-truncate ${selectedProcess?.processId === process.processId
                        ? "text-white-50"
                        : "text-muted"
                        }`}
                      style={{ fontSize: "0.7rem" }}
                    >
                      PID: {process.pid || "N/A"} |{" "}
                      {new Date(process.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="ms-2">{getStatusBadge(process)}</div>
                </div>
                {process.error && (
                  <div
                    className={`mt-1 ${selectedProcess?.processId === process.processId
                      ? "text-warning"
                      : "text-danger"
                      }`}
                    style={{ fontSize: "0.7rem" }}
                  >
                    <div className="text-truncate">Error: {process.error}</div>
                  </div>
                )}
              </div>
            ))}
            {processes.length === 0 && !loading && (
              <div className="p-2 text-center text-muted small">
                No active processes
              </div>
            )}
            {loading && processes.length === 0 && (
              <div className="p-2 text-center small">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
          </div>
        </Col>

        {/* Middle Column - Selected process details */}
        <Col
          sm={5}
          className="border-end p-3"
          style={{ height: "100%", overflow: "auto" }}
        >
          {selectedProcess ? (
            <div>
              <div className="mb-3">
                <strong>Command:</strong>
                <code
                  className="bg-light p-2 rounded d-block mt-1"
                  style={{ fontSize: "0.8rem" }}
                >
                  {selectedProcess.command}
                </code>
              </div>

              <div className="mb-2">
                <strong>Status:</strong>
                <div className="mt-1">{getStatusBadge(selectedProcess)}</div>
              </div>

              <div className="mb-2">
                <strong>PID:</strong>
                <div className="text-muted">{selectedProcess.pid || "N/A"}</div>
              </div>

              <div className="mb-2">
                <strong>Started:</strong>
                <div className="text-muted">
                  {new Date(selectedProcess.timestamp).toLocaleString()}
                </div>
              </div>

              {selectedProcess.exitCode !== undefined && (
                <div className="mb-2">
                  <strong>Exit Code:</strong>
                  <div className="text-muted">{selectedProcess.exitCode}</div>
                </div>
              )}

              {selectedProcess.error && (
                <div className="mt-3">
                  <strong className="text-danger">Error:</strong>
                  <div className="text-danger small mt-1">
                    {selectedProcess.error}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted mt-5">
              <i>Select a process to view details</i>
            </div>
          )}
        </Col>

        {/* Right Column - Live logs with input */}
        <Col
          sm={4}
          className="p-0"
          style={{ height: "100%", overflow: "hidden" }}
        >
          {selectedProcess ? (
            <div className="d-flex flex-column h-100">
              {/* <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white">

                <small className="text-muted">
                  {processLogs.length} lines
                </small>
              </div> */}

              {/* Scrollable log content */}
              <div
                ref={logsContainerRef}
                className="bg-dark text-light flex-grow-1"
                style={{
                  overflowY: "auto",
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  fontSize: "14px",
                  lineHeight: "1.4",
                  // padding: '1rem'
                }}
                onScroll={handleLogsScroll}
              >
                {processLogs.length > 0 ? (
                  <pre
                    className="mb-0"
                    style={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      backgroundColor: "transparent",
                      border: "none",
                      color: "inherit",
                    }}
                  >
                    {processLogs.join("")}
                  </pre>
                ) : (
                  <div className="text-muted text-center py-4">
                    <i>No output yet</i>
                  </div>
                )}
                {/* Auto-scroll indicator */}
                {!autoScroll && (
                  <div className="position-sticky bottom-0 d-flex justify-content-center mb-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setAutoScroll(true);
                        if (logsContainerRef.current) {
                          logsContainerRef.current.scrollTop =
                            logsContainerRef.current.scrollHeight;
                        }
                      }}
                    >
                      Scroll to Bottom
                    </Button>
                  </div>
                )}
              </div>

              {/* Input area and stop button for running processes */}
              {selectedProcess.status === "running" && (
                <div
                  className="border-top bg-white p-3"
                  style={{ flexShrink: 0 }}
                >
                  {/* Stop button */}
                  {onKillProcess && (
                    <div className="mb-3">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onKillProcess(selectedProcess.processId)}
                        className="w-100"
                      >
                        ⏹️ Stop Process
                      </Button>
                    </div>
                  )}

                  {/* Input area */}
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type input and press Enter..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          const target = e.target as HTMLInputElement;
                          const inputValue = target.value;
                          if (inputValue.trim()) {
                            handleInput(inputValue + "\n");
                            target.value = "";
                          }
                        }
                      }}
                      autoFocus
                    />
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => {
                        const input = document.querySelector(
                          "input"
                        ) as HTMLInputElement;
                        const inputValue = input.value;
                        if (inputValue.trim()) {
                          handleInput(inputValue + "\n");
                          input.value = "";
                        }
                      }}
                    >
                      Send
                    </button>
                  </div>
                  <small className="text-muted">
                    💡 Press Enter to send input to the process
                  </small>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 text-center text-muted mt-5">
              <i>Live logs will appear here when a process is selected</i>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};
