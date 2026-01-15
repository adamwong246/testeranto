import React from 'react';
import { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import ReactDOM from 'react-dom/client';
import { ConnectionStatus } from '../components/ConnectionStatus';

type BuildEvent = {
  id: string;
  testName: string;
  hash: string;
  files: string[];
  timestamp: string;
  status: 'pending' | 'processing' | 'scheduled' | 'completed' | 'error';
  message?: string;
  runtime?: string;
};

export const BuildListenerReactApp: React.FC = () => {
  return (
    <Container fluid className="py-3" >
      <h1 className="h3 mb-3" > Build Listener </h1>
      < BuildListener />
    </Container>
  );
};

const BuildListener = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [buildEvents, setBuildEvents] = useState<BuildEvent[]>([]);
  const [buildListenerState, setBuildListenerState] = useState<any>(null);
  const [autoRefreshBuild, setAutoRefreshBuild] = useState(true);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Connect to WebSocket
  useEffect(() => {
    const connectWebSocket = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws`;

      const websocket = new WebSocket(wsUrl);
      wsRef.current = websocket;

      websocket.onopen = () => {
        console.log('WebSocket connected for Build Listener');
        setIsConnected(true);
        // Request build listener data
        websocket.send(JSON.stringify({ type: 'getBuildListenerState' }));
        websocket.send(JSON.stringify({ type: 'getBuildEvents' }));
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

  // Handle WebSocket messages
  const handleWebSocketMessage = (data: any) => {
    console.log('Received WebSocket message:', data);

    // Handle build listener messages
    if (data.type === 'buildListenerState') {
      console.log('Received build listener state:', data.data);
      setBuildListenerState(data.data);
      return;
    }

    if (data.type === 'buildEvents') {
      console.log('Received build events:', data.events);
      setBuildEvents(data.events || []);
      return;
    }

    if (data.type === 'buildUpdate') {
      console.log('Received build update:', data);
      // Refresh build events when we get a build update
      if (wsRef.current && autoRefreshBuild) {
        wsRef.current.send(JSON.stringify({ type: 'getBuildEvents' }));
      }
      return;
    }

    // Handle sourceFilesUpdated messages
    if (data.type === 'sourceFilesUpdated') {
      console.log('Received sourceFilesUpdated:', data);
      // Add to build events
      const newEvent: BuildEvent = {
        id: `source-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        testName: data.testName,
        hash: data.hash,
        files: data.files,
        timestamp: data.timestamp || new Date().toISOString(),
        status: data.status === 'processed' ? 'completed' : 'pending',
        message: `Source files updated for ${data.testName} (${data.runtime}) - ${data.files?.length || 0} files`,
        runtime: data.runtime
      };
      setBuildEvents(prev => [newEvent, ...prev.slice(0, 49)]); // Keep last 50 events
      return;
    }

    // Handle connection message
    if (data.type === 'connected') {
      console.log('WebSocket connected successfully');
      return;
    }
  };

  // Refresh build data periodically
  useEffect(() => {
    if (!autoRefreshBuild || !isConnected || !wsRef.current) return;

    const interval = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'getBuildListenerState' }));
        wsRef.current.send(JSON.stringify({ type: 'getBuildEvents' }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefreshBuild, isConnected]);

  const refreshBuildData = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'getBuildListenerState' }));
      wsRef.current.send(JSON.stringify({ type: 'getBuildEvents' }));
    }
  };

  return (
    <>
      <Card className="mb-3">
        <Card.Body className="py-2">
          <Row className="align-items-center">
            <Col>
              <div className="d-flex align-items-center">
                <h2 className="h5 mb-0 me-2">Build Listener</h2>
                <ConnectionStatus isConnected={isConnected} />
              </div>
            </Col>
            <Col xs="auto">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={refreshBuildData}
                className="me-2"
              >
                Refresh
              </Button>
              <Form.Check
                type="switch"
                id="auto-refresh-build"
                label="Auto-refresh"
                checked={autoRefreshBuild}
                onChange={(e) => setAutoRefreshBuild(e.target.checked)}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Header>
              <h5 className="mb-0">Build Listener State</h5>
            </Card.Header>
            <Card.Body>
              {buildListenerState ? (
                <div>
                  <p><strong>Total Events:</strong> {buildListenerState.totalEvents}</p>
                  <p><strong>Timestamp:</strong> {new Date(buildListenerState.timestamp).toLocaleString()}</p>
                  <h6>Tracked Tests:</h6>
                  <ul className="list-unstyled">
                    {buildListenerState.hashes && buildListenerState.hashes.map((item: any, index: number) => (
                      <li key={index} className="mb-1">

                        <div className="mb-1">
                          <Badge bg="info" className="me-2">{item.fileCount} files</Badge>
                          <span className="me-2">{item.testName}:</span>
                          <a
                            href={`/~/process_manager/${item.runtime}/${item.testName}.xml`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none fw-bold me-3"
                            style={{ color: '#0d6efd' }}
                            title={`XML data: /~/process_manager/${item.runtime}/${item.testName}.xml`}
                          >
                            XML
                          </a>
                          <a
                            href={`/~/process_manager/${item.runtime}/${item.testName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none fw-bold me-3"
                            style={{ color: '#6f42c1' }}
                            title={`React app route: /~/process_manager/${item.runtime}/${item.testName}`}
                          >
                            Route
                          </a>
                          <a
                            href={`/~/process_manager?runtime=${item.runtime}&test=${item.testName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none fw-bold"
                            style={{ color: '#28a745' }}
                            title={`Query params: runtime=${item.runtime}&test=${item.testName}`}
                          >
                            Query
                          </a>
                          <span className="ms-2 text-muted">Hash: {item.hash.substring(0, 8)}...</span>
                        </div>

                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No build listener state available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Header>
              <h5 className="mb-0">Recent Build Events</h5>
            </Card.Header>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {buildEvents.length > 0 ? (
                buildEvents.map((event) => (
                  <div key={event.id} className="mb-3 p-2 border rounded">
                    <div className="d-flex justify-content-between">
                      <div>
                        <strong>{event.testName}</strong>
                        {event.runtime && (
                          <Badge bg="info" className="ms-2">{event.runtime}</Badge>
                        )}
                      </div>
                      <Badge bg={
                        event.status === 'pending' ? 'secondary' :
                          event.status === 'processing' ? 'warning' :
                            event.status === 'scheduled' ? 'info' :
                              event.status === 'completed' ? 'success' : 'danger'
                      }>
                        {event.status}
                      </Badge>
                    </div>
                    <small className="text-muted">
                      {new Date(event.timestamp).toLocaleString()}
                    </small>
                    <p className="mb-1">{event.message}</p>
                    <small>Hash: {event.hash ? event.hash.substring(0, 12) + '...' : 'N/A'}</small>
                    <div className="mt-1">
                      <small className="text-muted">
                        {event.files?.length || 0} files
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <p>No build events yet</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

// Export App to global scope
function initApp() {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(React.createElement(BuildListenerReactApp));
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
