/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
  Button,
  Form,
  Alert,
  Spinner,
  Tab,
  Tabs,
  InputGroup,
  FormControl,
} from "react-bootstrap";

import "../style.scss";

interface Process {
  processId: string;
  command: string;
  pid?: number;
  timestamp: string;
  status?: string;
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  source?: string;
}

export const ProcessManger = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const [logs, setLogs] = useState<Record<string, LogEntry[]>>({});
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Connect to WebSocket
  useEffect(() => {
    const connectWebSocket = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws`;
      
      const websocket = new WebSocket(wsUrl);
      wsRef.current = websocket;

      websocket.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        websocket.send(JSON.stringify({ type: 'getProcesses' }));
      };

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      websocket.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      setWs(websocket);
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // Scroll to bottom of logs when new logs arrive
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Handle WebSocket messages
  const handleWebSocketMessage = (data: any) => {
    console.log('Received WebSocket message:', data);
    
    if (data.type === 'processes') {
      let processList: any[] = [];
      // The server sends data.data with processes array and other fields
      if (data.data && data.data.processes && Array.isArray(data.data.processes)) {
        processList = data.data.processes;
      } else if (Array.isArray(data.data)) {
        processList = data.data;
      }
      // Add system process
      const systemProcess = {
        processId: 'system',
        command: 'System Logs',
        timestamp: new Date().toISOString(),
        status: 'running'
      };
      processList = [systemProcess, ...processList];
      setProcesses(processList);
      
      // Extract logs from each process
      const newLogs: Record<string, LogEntry[]> = {};
      processList.forEach((process: any) => {
        if (process.logs && Array.isArray(process.logs)) {
          newLogs[process.processId] = process.logs;
        }
      });
      setLogs(prev => ({ ...prev, ...newLogs }));
      
      if (autoRefresh && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const processIds = processList.map((p: any) => p.processId);
        processIds.forEach((processId: string) => {
          wsRef.current?.send(JSON.stringify({
            type: 'subscribeToLogs',
            data: { processId }
          }));
        });
      }
    } else if (data.type === 'logs') {
      const { processId, logs: newLogs } = data;
      if (processId && Array.isArray(newLogs)) {
        setLogs(prev => ({
          ...prev,
          [processId]: [...(prev[processId] || []), ...newLogs]
        }));
      }
    } else if (data.type === 'logSubscription') {
      console.log('Log subscription status:', data.status, 'for process:', data.processId);
    } else if (data.type === 'runningProcesses') {
      if (Array.isArray(data.processes)) {
        // Add system process
        const systemProcess = {
          processId: 'system',
          command: 'System Logs',
          timestamp: new Date().toISOString(),
          status: 'running'
        };
        const processList = [systemProcess, ...data.processes];
        setProcesses(processList);
        // Extract logs from each process
        const newLogs: Record<string, LogEntry[]> = {};
        processList.forEach((process: any) => {
          if (process.logs && Array.isArray(process.logs)) {
            newLogs[process.processId] = process.logs;
          }
        });
        setLogs(prev => ({ ...prev, ...newLogs }));
      }
    }
  };

  const requestLogs = (processId: string) => {
    console.log(`Requesting logs for ${processId}`);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'getLogs',
        data: { processId }
      }));
    }
  };

  const handleSelectProcess = (processId: string) => {
    setSelectedProcessId(processId);
    if (!logs[processId] || logs[processId].length === 0) {
      requestLogs(processId);
    }
  };

  const refreshProcesses = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'getProcesses' }));
    }
  };

  const clearLogs = (processId: string) => {
    setLogs(prev => ({
      ...prev,
      [processId]: []
    }));
  };

  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString();
    } catch {
      return timestamp;
    }
  };

  const getLevelBadgeVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error': return 'danger';
      case 'warn': return 'warning';
      case 'info': return 'info';
      case 'debug': return 'secondary';
      default: return 'light';
    }
  };

  const selectedProcess = processes.find(p => p.processId === selectedProcessId);
  const selectedLogs = selectedProcessId ? logs[selectedProcessId] || [] : [];
  
  // Filter logs based on level and search term
  const filteredLogs = selectedLogs.filter(log => {
    const matchesLevel = filterLevel === 'all' || log.level.toLowerCase() === filterLevel.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.source && log.source.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  return (
    <Container fluid className="mt-3">
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-0">Process Manager</h4>
                <Badge bg={isConnected ? "success" : "danger"} className="mt-1">
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Form.Check
                  type="switch"
                  id="auto-refresh-switch"
                  label="Auto-refresh logs"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
                <Button
                  variant="primary"
                  onClick={refreshProcesses}
                  disabled={!isConnected}
                  size="sm"
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Refresh Processes
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Tabs defaultActiveKey="processes" className="mb-3">
                <Tab eventKey="processes" title="Processes">
                  <Row>
                    <Col md={6}>
                      <h5>Running Processes ({processes.length})</h5>
                      {processes.length === 0 ? (
                        <Alert variant="info">No processes running</Alert>
                      ) : (
                        <ListGroup>
                          {processes.map(process => (
                            <ListGroup.Item
                              key={process.processId}
                              action
                              active={selectedProcessId === process.processId}
                              onClick={() => handleSelectProcess(process.processId)}
                              className="d-flex justify-content-between align-items-start"
                            >
                              <div className="ms-2 me-auto">
                                <div className="fw-bold">{process.command}</div>
                                <small className="text-muted">
                                  ID: {process.processId} | 
                                  PID: {process.pid || 'N/A'} | 
                                  Started: {formatTime(process.timestamp)}
                                  {process.status && ` | Status: ${process.status}`}
                                </small>
                              </div>
                              <div className="d-flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline-secondary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    requestLogs(process.processId);
                                  }}
                                >
                                  <i className="bi bi-journal-text"></i>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    clearLogs(process.processId);
                                  }}
                                >
                                  <i className="bi bi-trash"></i>
                                </Button>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      )}
                    </Col>
                    <Col md={6}>
                      <h5>
                        {selectedProcess ? `Process: ${selectedProcess.command}` : 'Select a Process'}
                      </h5>
                      {selectedProcess ? (
                        <Card>
                          <Card.Body>
                            <p><strong>ID:</strong> {selectedProcess.processId}</p>
                            <p><strong>Command:</strong> {selectedProcess.command}</p>
                            <p><strong>PID:</strong> {selectedProcess.pid || 'N/A'}</p>
                            <p><strong>Started:</strong> {formatTime(selectedProcess.timestamp)}</p>
                            {selectedProcess.status && (
                              <p><strong>Status:</strong> {selectedProcess.status}</p>
                            )}
                            <div className="d-flex gap-2 mt-3">
                              <Button
                                variant="info"
                                size="sm"
                                onClick={() => requestLogs(selectedProcessId!)}
                              >
                                <i className="bi bi-download me-1"></i>
                                Fetch Logs
                              </Button>
                              <Button
                                variant="warning"
                                size="sm"
                                onClick={() => clearLogs(selectedProcessId!)}
                              >
                                <i className="bi bi-eraser me-1"></i>
                                Clear Logs
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      ) : (
                        <Alert variant="secondary">
                          Select a process from the list to view details and logs.
                        </Alert>
                      )}
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey="logs" title="Logs" disabled={!selectedProcessId}>
                  <Row>
                    <Col>
                      <h5>
                        Logs for {selectedProcess?.command || selectedProcessId}
                        <Badge bg="secondary" className="ms-2">
                          {filteredLogs.length} entries
                        </Badge>
                      </h5>
                      <div className="mb-3 d-flex gap-3">
                        <Form.Select
                          style={{ width: 'auto' }}
                          value={filterLevel}
                          onChange={(e) => setFilterLevel(e.target.value)}
                        >
                          <option value="all">All Levels</option>
                          <option value="error">Error</option>
                          <option value="warn">Warning</option>
                          <option value="info">Info</option>
                          <option value="debug">Debug</option>
                        </Form.Select>
                        <InputGroup style={{ width: '300px' }}>
                          <FormControl
                            placeholder="Search logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <Button
                            variant="outline-secondary"
                            onClick={() => setSearchTerm('')}
                          >
                            Clear
                          </Button>
                        </InputGroup>
                      </div>
                      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {filteredLogs.length === 0 ? (
                          <Alert variant="info">
                            No logs available for this process.
                          </Alert>
                        ) : (
                          <ListGroup>
                            {filteredLogs.map((log, index) => (
                              <ListGroup.Item
                                key={index}
                                className={`border-start-5 border-${getLevelBadgeVariant(log.level)}`}
                              >
                                <div className="d-flex justify-content-between">
                                  <div>
                                    <Badge bg={getLevelBadgeVariant(log.level)} className="me-2">
                                      {log.level.toUpperCase()}
                                    </Badge>
                                    <small className="text-muted me-3">
                                      {formatTime(log.timestamp)}
                                    </small>
                                    {log.source && (
                                      <Badge bg="light" text="dark" className="me-2">
                                        {log.source}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="mt-2 font-monospace">
                                  {log.message}
                                </div>
                              </ListGroup.Item>
                            ))}
                            <div ref={logEndRef} />
                          </ListGroup>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Tab>
              </Tabs>
            </Card.Body>
            <Card.Footer className="text-muted">
              <small>
                {isConnected ? (
                  <span>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Receiving real-time updates
                  </span>
                ) : (
                  <span>
                    <Spinner animation="border" size="sm" variant="danger" className="me-2" />
                    Attempting to reconnect...
                  </span>
                )}
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Export App to global scope
function initApp() {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(React.createElement(ProcessManger));
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
