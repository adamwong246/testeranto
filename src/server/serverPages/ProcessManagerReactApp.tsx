import React from 'react';
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { EventLog } from '../components/EventLog';
import { LogViewer } from '../components/LogViewer';
import { ProcessDetails } from '../components/ProcessDetails';
import { ProcessList } from '../components/ProcessList';
import { ResizableColumns } from '../components/ResizableColumns';

export const ProcessManagerReactApp: React.FC = () => {
  return (
    <Container fluid className="py-3">
      <h1 className="h3 mb-3">Process Manager</h1>
      <ProcessManger />
    </Container>
  );
};

interface Process {
  processId: string;
  command: string;
  pid?: number;
  timestamp: string;
  status?: string;
}

interface LogEntry {
  timestamp: string;
  level?: string;
  message: string;
  source?: string;
}

const ProcessManger = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const [logs, setLogs] = useState<Record<string, LogEntry[]>>({});
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [eventFilterType, setEventFilterType] = useState<'all' | 'enqueue' | 'dequeue'>('all');
  const [urlParams, setUrlParams] = useState<{ runtime?: string; test?: string }>({});

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Parse URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const runtime = params.get('runtime');
    // Support both 'test' and 'name' parameters for compatibility
    const test = params.get('test') || params.get('name');

    // If no query parameters, try to parse from path
    if (!runtime && !test) {
      const path = window.location.pathname;
      // Check if path matches /~/process_manager/<runtime>/<test>
      const match = path.match(/\/~\/process_manager\/([^\/]+)\/(.+)/);
      if (match) {
        const pathRuntime = match[1];
        const pathTest = match[2];
        setUrlParams({
          runtime: pathRuntime,
          test: pathTest
        });
        console.log('URL path parameters:', { runtime: pathRuntime, test: pathTest });
        return;
      }
    }

    if (runtime || test) {
      setUrlParams({
        runtime: runtime || undefined,
        test: test || undefined
      });
      console.log('URL parameters:', { runtime, test });
    }
  }, []);

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
        // Request all processes, not just running ones
        websocket.send(JSON.stringify({ type: 'getProcesses', all: true }));
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

  // Add event to event log
  const addEvent = (type: 'enqueue' | 'dequeue', processId: string, command: string, details?: string) => {
    const newEvent: Event = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      processId,
      command,
      timestamp: new Date().toISOString(),
      details
    };
    setEvents(prev => [newEvent, ...prev.slice(0, 99)]); // Keep last 100 events
  };



  // Clear all events
  const clearEvents = () => {
    setEvents([]);
  };

  // Handle WebSocket messages
  const handleWebSocketMessage = (data: any) => {
    console.log('Received WebSocket message:', data);

    // Handle connection message
    if (data.type === 'connected') {
      console.log('WebSocket connected successfully');
      return;
    }

    // Check for enqueue/dequeue events from server
    if (data.type === 'enqueue' || data.type === 'dequeue') {
      console.log(`Processing ${data.type} event for process ${data.processId}`);
      addEvent(
        data.type,
        data.processId || 'unknown',
        data.command || 'Unknown command',
        data.details || `Runtime: ${data.runtime || 'unknown'} | Test: ${data.testName || 'unknown'}`
      );
      // Don't return early, continue processing other message types
    }

    // Handle all types of process lists: 'processes', 'runningProcesses', or any other type that contains processes
    if (data.type === 'processes' || data.type === 'runningProcesses' ||
      (data.processes && Array.isArray(data.processes)) ||
      (data.data && Array.isArray(data.data))) {

      let processList: any[] = [];

      // Extract process list from various possible structures
      if (data.processes && Array.isArray(data.processes)) {
        processList = data.processes;
      } else if (data.data && data.data.processes && Array.isArray(data.data.processes)) {
        processList = data.data.processes;
      } else if (data.data && Array.isArray(data.data)) {
        processList = data.data;
      } else if (Array.isArray(data)) {
        processList = data;
      }

      console.log('Extracted process list:', processList);

      // Map server's 'id' field to 'processId' and ensure all required fields
      const mappedProcesses = processList.map(proc => {
        // The server sends 'id' field, but our frontend expects 'processId'
        const processId = proc.id || proc.processId;
        // Log if we're mapping from id to processId
        if (proc.id && !proc.processId) {
          console.log(`Mapping server id '${proc.id}' to processId`);
        }
        return {
          ...proc,
          processId: processId,
          // Ensure all required fields exist
          command: proc.command || 'Unknown command',
          timestamp: proc.timestamp || new Date().toISOString(),
          status: proc.status || 'unknown'
        };
      });

      // Log process IDs for debugging
      console.log('Mapped process IDs:', mappedProcesses.map(p => p.processId));

      // Filter out processes with undefined or empty IDs and log an error
      const validProcesses = mappedProcesses.filter(process => {
        const hasValidId = process.processId && process.processId.trim() !== '';
        if (!hasValidId) {
          console.error('Server sent process with invalid ID:', process);
        }
        return hasValidId;
      });

      // Log if any processes were filtered out
      if (validProcesses.length !== mappedProcesses.length) {
        console.error(`Filtered out ${mappedProcesses.length - validProcesses.length} processes with invalid IDs`);
      }

      // Add system process
      const systemProcess = {
        processId: 'system',
        command: 'System Logs',
        timestamp: new Date().toISOString(),
        status: 'running'
      };

      const finalProcessList = [systemProcess, ...validProcesses];
      console.log('Final process list IDs:', finalProcessList.map(p => p.processId));
      setProcesses(finalProcessList);

      // Extract logs from each process
      const newLogs: Record<string, LogEntry[]> = {};
      finalProcessList.forEach((process: any) => {
        if (process.logs && Array.isArray(process.logs)) {
          // Ensure each log entry has a valid level
          newLogs[process.processId] = process.logs.map((log: any) => ({
            ...log,
            level: log.level || 'info',
            message: log.message || '',
            timestamp: log.timestamp || new Date().toISOString(),
            source: log.source || 'unknown'
          }));
        }
      });
      setLogs(prev => ({ ...prev, ...newLogs }));

      if (autoRefresh && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const processIds = finalProcessList.map((p: any) => p.processId);
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
        // Ensure each log entry has a valid level
        const processedLogs = newLogs.map(log => ({
          ...log,
          level: log.level || 'info',
          message: log.message || '',
          timestamp: log.timestamp || new Date().toISOString(),
          source: log.source || 'unknown'
        }));
        setLogs(prev => ({
          ...prev,
          [processId]: [...(prev[processId] || []), ...processedLogs]
        }));
      }
    } else if (data.type === 'logSubscription') {
      console.log('Log subscription status:', data.status, 'for process:', data.processId);
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
      // Request all processes
      wsRef.current.send(JSON.stringify({ type: 'getProcesses', all: true }));
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

  const getLevelBadgeVariant = (level: string | undefined) => {
    if (!level) return 'light';
    switch (level.toLowerCase()) {
      case 'error': return 'danger';
      case 'warn': return 'warning';
      case 'info': return 'info';
      case 'debug': return 'secondary';
      default: return 'light';
    }
  };

  // Filter processes based on URL parameters
  const filteredProcesses = processes.filter(process => {
    if (!urlParams.runtime && !urlParams.test) return true;

    const processId = process.processId.toLowerCase();
    const runtime = urlParams.runtime?.toLowerCase();
    const test = urlParams.test?.toLowerCase();

    let matches = true;
    if (runtime) {
      matches = matches && processId.includes(runtime);
    }
    if (test) {
      // Try multiple ways to match the test name
      // 1. Direct inclusion
      // 2. Remove extension
      // 3. Replace path separators
      const testName1 = test.toLowerCase();
      const testName2 = test.replace(/\.[^/.]+$/, '').toLowerCase();
      const testName3 = test.replace(/[\/\\]/g, '-').toLowerCase();
      const testName4 = test.replace(/\.[^/.]+$/, '').replace(/[\/\\]/g, '-').toLowerCase();

      matches = matches && (
        processId.includes(testName1) ||
        processId.includes(testName2) ||
        processId.includes(testName3) ||
        processId.includes(testName4)
      );
    }
    return matches;
  });

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
    <>
      <Card className="mb-3">
        <Card.Body className="py-2">
          <Row className="align-items-center">
            <Col>
              <div className="d-flex align-items-center">
                <h2 className="h5 mb-0 me-2">Process Manager</h2>
                <ConnectionStatus isConnected={isConnected} />
                {urlParams.runtime || urlParams.test ? (
                  <div className="ms-3">
                    <Badge bg="info" className="me-1">
                      Filtered
                    </Badge>
                    {urlParams.runtime && (
                      <Badge bg="secondary" className="me-1">
                        runtime={urlParams.runtime}
                      </Badge>
                    )}
                    {urlParams.test && (
                      <Badge bg="secondary" className="me-1">
                        test={urlParams.test}
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      className="ms-2"
                      onClick={() => {
                        // Clear filters by navigating to the base URL
                        window.history.pushState({}, '', '/~/process_manager');
                        setUrlParams({});
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                ) : null}
              </div>
            </Col>
            <Col xs="auto">
              <div className="d-flex align-items-center gap-2">
                <Form.Check
                  type="switch"
                  id="auto-refresh"
                  label="Auto-refresh logs"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="small"
                />
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={refreshProcesses}
                  disabled={!isConnected}
                >
                  Refresh Processes
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div style={{ height: 'calc(100vh - 120px)' }}>
        <ResizableColumns initialWidths={[25, 25, 25, 25]}>
          {/* Column 1: Event Log */}
          <div className="h-100 d-flex flex-column">
            <EventLog
              events={events}
              filterType={eventFilterType}
              onFilterTypeChange={setEventFilterType}
              formatTime={formatTime}
              onClearEvents={clearEvents}
            />
          </div>

          {/* Column 2: Process List */}
          <div className="h-100 d-flex flex-column">
            <ProcessList
              processes={filteredProcesses}
              selectedProcessId={selectedProcessId}
              onSelectProcess={handleSelectProcess}
              formatTime={formatTime}
            />
          </div>

          {/* Column 3: Process Details */}
          <div className="h-100 d-flex flex-column">
            <ProcessDetails
              selectedProcess={selectedProcess}
              selectedProcessId={selectedProcessId}
              formatTime={formatTime}
              onRequestLogs={() => selectedProcessId && requestLogs(selectedProcessId)}
              onClearLogs={() => selectedProcessId && clearLogs(selectedProcessId)}
            />
          </div>

          {/* Column 4: Log Viewer */}
          <div className="h-100 d-flex flex-column">
            {selectedProcessId ? (
              <LogViewer
                selectedProcessId={selectedProcessId}
                selectedProcessCommand={selectedProcess?.command}
                filteredLogs={filteredLogs}
                filterLevel={filterLevel}
                searchTerm={searchTerm}
                onFilterLevelChange={setFilterLevel}
                onSearchTermChange={setSearchTerm}
                onClearSearch={() => setSearchTerm('')}
                formatTime={formatTime}
                getLevelBadgeVariant={getLevelBadgeVariant}
                logEndRef={logEndRef}
              />
            ) : (
              <Card className="h-100">
                <Card.Header>Log Viewer</Card.Header>
                <Card.Body className="d-flex align-items-center justify-content-center">
                  <div className="text-center text-muted">
                    <div className="mb-2">Select a process</div>
                    <small>to view its logs</small>
                  </div>
                </Card.Body>
              </Card>
            )}
          </div>
        </ResizableColumns>
      </div>

      <div className="mt-2 pt-1 border-top small text-muted">
        {isConnected ? (
          <span>● Receiving real-time updates</span>
        ) : (
          <span>● Attempting to reconnect...</span>
        )}
      </div>
    </>
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
