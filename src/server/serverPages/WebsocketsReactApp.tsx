import React from 'react';
import { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Form, Button, Badge, Table, Alert } from 'react-bootstrap';
import ReactDOM from 'react-dom/client';

export const WebsocketsReactApp: React.FC = () => {
  return (
    <Container fluid className="py-3" >
      <h1 className="h3 mb-3" > WebSocket Message Viewer </h1>
      <Websockets />
    </Container>
  );
};

interface WebSocketMessage {
  id: number;
  timestamp: string;
  type: string;
  data: any;
  raw: string;
}

const Websockets = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [filteredTypes, setFilteredTypes] = useState<string[]>([
    'buildListenerState',
    'buildEvents',
    'connected',
    'pong',
    'buildUpdate'
  ]);
  const [showFiltered, setShowFiltered] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nextId = useRef(1);

  // Connect to WebSocket
  useEffect(() => {
    const connectWebSocket = () => {
      // Get the current host and protocol
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws`;
      
      console.log(`Attempting to connect to WebSocket at: ${wsUrl}`);
      
      const websocket = new WebSocket(wsUrl);
      wsRef.current = websocket;

      websocket.onopen = () => {
        console.log('WebSocket connected for Message Viewer');
        setIsConnected(true);
        // Don't request build listener data to avoid cluttering messages
        // Just send a ping to verify connection
        websocket.send(JSON.stringify({ type: 'ping' }));
      };

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data, event.data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          // Add error message to the list
          addMessage({
            id: nextId.current++,
            timestamp: new Date().toISOString(),
            type: 'parse_error',
            data: { error: String(error) },
            raw: event.data
          });
        }
      };

      websocket.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        // Try to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect WebSocket...');
          connectWebSocket();
        }, 3000);
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        // Add error message to the list
        addMessage({
          id: nextId.current++,
          timestamp: new Date().toISOString(),
          type: 'websocket_error',
          data: { 
            error: 'WebSocket connection error',
            details: error,
            url: wsUrl
          },
          raw: 'Connection failed'
        });
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

  const addMessage = (message: WebSocketMessage) => {
    setMessages(prev => [message, ...prev.slice(0, 199)]); // Keep last 200 messages
  };

  // Handle WebSocket messages
  const handleWebSocketMessage = (data: any, raw: string) => {
    const message: WebSocketMessage = {
      id: nextId.current++,
      timestamp: new Date().toISOString(),
      type: data.type || 'unknown',
      data: data,
      raw: raw
    };

    // Always add to messages
    addMessage(message);

    // Handle specific message types if needed
    if (data.type === 'connected') {
      console.log('WebSocket connected successfully');
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const toggleFilterType = (type: string) => {
    setFilteredTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const filteredMessages = messages.filter(msg =>
    showFiltered ? true : !filteredTypes.includes(msg.type)
  );

  const getMessageCountByType = () => {
    const counts: Record<string, number> = {};
    messages.forEach(msg => {
      counts[msg.type] = (counts[msg.type] || 0) + 1;
    });
    return counts;
  };

  const typeCounts = getMessageCountByType();

  return (
    <>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">WebSocket Connection</h5>
            </Card.Header>
            <Card.Body>
              <Alert variant={isConnected ? 'success' : 'danger'}>
                Status: {isConnected ? 'Connected' : 'Disconnected'}
              </Alert>
              <div className="mb-3">
                <small className="text-muted">
                  WebSocket URL: {window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//{window.location.host}/ws
                </small>
              </div>
              <div className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                      wsRef.current.send(JSON.stringify({ type: 'ping' }));
                    }
                  }}
                  disabled={!isConnected}
                >
                  Send Ping
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => {
                    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                      wsRef.current.send(JSON.stringify({ type: 'getProcesses' }));
                    }
                  }}
                  disabled={!isConnected}
                >
                  Request Processes
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={clearMessages}
                >
                  Clear Messages
                </Button>
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => {
                    // Force reconnect
                    if (wsRef.current) {
                      wsRef.current.close();
                    }
                  }}
                >
                  Force Reconnect
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Message Filters</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Check
                  type="switch"
                  id="show-filtered-switch"
                  label="Show filtered messages"
                  checked={showFiltered}
                  onChange={(e) => setShowFiltered(e.target.checked)}
                  className="mb-3"
                />
                <div className="mb-2">
                  <small className="text-muted">Toggle message types to filter:</small>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {Object.keys(typeCounts).map(type => (
                    <Badge
                      key={type}
                      pill
                      bg={filteredTypes.includes(type) ? 'secondary' : 'info'}
                      style={{ cursor: 'pointer' }}
                      onClick={() => toggleFilterType(type)}
                    >
                      {type} ({typeCounts[type]})
                    </Badge>
                  ))}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">WebSocket Messages ({filteredMessages.length} shown, {messages.length} total)</h5>
            </Card.Header>
            <Card.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {filteredMessages.length === 0 ? (
                <Alert variant="info">
                  No messages to display. {messages.length > 0 ? 'All messages are filtered out.' : 'Waiting for WebSocket messages...'}
                </Alert>
              ) : (
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Type</th>
                      <th>Data Preview</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMessages.map(msg => (
                      <tr key={msg.id}>
                        <td>
                          <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                        </td>
                        <td>
                          <Badge bg={
                            msg.type === 'error' ? 'danger' :
                              msg.type === 'ping' || msg.type === 'pong' ? 'warning' :
                                'primary'
                          }>
                            {msg.type}
                          </Badge>
                        </td>
                        <td>
                          <pre className="mb-0" style={{ fontSize: '0.8rem', maxHeight: '100px', overflow: 'auto' }}>
                            {JSON.stringify(msg.data, null, 2)}
                          </pre>
                        </td>
                        <td>
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => {
                              console.log('Full message:', msg);
                              alert(`Full message:\n${msg.raw}`);
                            }}
                          >
                            View Raw
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">
                Filtered types: {filteredTypes.join(', ')}. Click on badges above to toggle filtering.
              </small>
            </Card.Footer>
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
      root.render(React.createElement(WebsocketsReactApp));
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
