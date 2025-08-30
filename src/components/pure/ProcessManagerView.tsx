/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Badge, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from '../../App';

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
  // Use the centralized WebSocket from App context
  const { ws } = useWebSocket();
  const [processLogs, setProcessLogs] = useState<string[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

  // Handle WebSocket messages for the selected process
  useEffect(() => {
    if (!ws) return;
    
    const handleMessage = (event: MessageEvent) => {
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

    ws.addEventListener('message', handleMessage);
    
    return () => {
      ws.removeEventListener('message', handleMessage);
    };
  }, [ws, selectedProcess]);

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
          sm={2}
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

        {/* Middle Column - Process Details (5 units) */}
        <Col
          sm={5}
          className="border-end p-3 d-flex flex-column"
          style={{ height: "100%", overflow: "hidden" }}
        >
          {selectedProcess ? (
            <div className="flex-grow-1 d-flex flex-column">
              {/* Horizontal controls row */}
              <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                {/* Status */}
                <div>{getStatusBadge(selectedProcess)}</div>
                
                {/* PID */}
                <div className="text-muted">
                  {selectedProcess.pid || "N/A"}
                </div>
                
                {/* Started time */}
                <div className="text-muted">
                  {new Date(selectedProcess.timestamp).toLocaleString()}
                </div>
                
                {/* Stop button */}
                {selectedProcess.status === "running" && onKillProcess && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onKillProcess(selectedProcess.processId)}
                    className="flex-grow-0 ms-auto"
                  >
                    ⏹️ Stop
                  </Button>
                )}
                
                {/* Exit code if applicable */}
                {selectedProcess.exitCode !== undefined && (
                  <div className="text-muted">
                    {selectedProcess.exitCode}
                  </div>
                )}
              </div>
              
              {/* Error message if present */}
              {selectedProcess.error && (
                <Alert variant="danger" className="py-2 mb-3">
                  {selectedProcess.error}
                </Alert>
              )}
              
              {/* Command styled like terminal */}
              <div>
                <div className="mb-1 small text-muted">Command:</div>
                <div
                  className="bg-dark text-light p-2 rounded"
                  style={{
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    fontSize: "14px",
                    lineHeight: "1.4",
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    maxHeight: "200px" // Prevent it from expanding too much
                  }}
                >
                  {selectedProcess.command}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted mt-5">
              <i>Select a process to view details</i>
            </div>
          )}
        </Col>
        
        {/* Right Column - Terminal (5 units) */}
        <Col
          sm={5}
          className="p-3 d-flex flex-column"
          style={{ height: "100%", overflow: "hidden" }}
        >
          {selectedProcess ? (
            <>
              {/* Terminal area - fills space and scrolls internally */}
              <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: 0 }}>
                {/* Scrollable terminal content */}
                <div
                  ref={logsContainerRef}
                  className="bg-dark text-light flex-grow-1"
                  style={{
                    overflowY: "auto",
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    fontSize: "14px",
                    lineHeight: "1.4",
                    padding: "0.5rem"
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
                
                {/* Input area - fixed at the bottom */}
                {selectedProcess.status === "running" && (
                  <div className="border-top bg-white p-2 mt-2" style={{ flexShrink: 0 }}>
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
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center text-muted mt-5">
              <i>Terminal will appear here when a process is selected</i>
            </div>
          )}
        </Col>


      </Row>
    </Container>
  );
};
