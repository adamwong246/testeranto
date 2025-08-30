/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Badge } from 'react-bootstrap';

interface Process {
  processId: string;
  command: string;
  pid?: number;
  status?: 'running' | 'exited' | 'error';
  exitCode?: number;
  error?: string;
  timestamp: string;
}

interface ProcessManagerProps {
  show: boolean;
  onHide: () => void;
  ws: WebSocket | null;
}

export const ProcessManager: React.FC<ProcessManagerProps> = ({ show, onHide, ws }) => {
  const [processes, setProcesses] = useState<Process[]>([]);

  useEffect(() => {
    if (show && ws) {
      // Request current processes when modal is shown
      ws.send(JSON.stringify({ type: 'getRunningProcesses' }));
    }
  }, [show, ws]);

  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'runningProcesses') {
          setProcesses(data.processes.map((p: any) => ({
            ...p,
            status: 'running'
          })));
        } else if (data.type === 'processStarted') {
          setProcesses(prev => [...prev, {
            ...data,
            status: 'running'
          }]);
        } else if (data.type === 'processExited') {
          setProcesses(prev => prev.map(p =>
            p.processId === data.processId
              ? { ...p, status: 'exited', exitCode: data.exitCode }
              : p
          ));
        } else if (data.type === 'processError') {
          setProcesses(prev => prev.map(p =>
            p.processId === data.processId
              ? { ...p, status: 'error', error: data.error }
              : p
          ));
        }
      } catch (error) {
        console.error('Error parsing process message:', error);
      }
    };

    ws.addEventListener('message', handleMessage);
    return () => ws.removeEventListener('message', handleMessage);
  }, [ws]);

  const getStatusBadge = (process: Process) => {
    switch (process.status) {
      case 'running':
        return <Badge bg="success">Running</Badge>;
      case 'exited':
        return <Badge bg="secondary">Exited ({process.exitCode})</Badge>;
      case 'error':
        return <Badge bg="danger">Error</Badge>;
      default:
        return <Badge bg="warning">Unknown</Badge>;
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Running Aider Processes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {processes.map(process => (
            <ListGroup.Item key={process.processId} className="d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <div className="fw-bold">{process.command}</div>
                <small className="text-muted">
                  PID: {process.pid || 'N/A'} |
                  Started: {new Date(process.timestamp).toLocaleString()}
                </small>
                {process.error && (
                  <div className="text-danger mt-1">
                    <small>Error: {process.error}</small>
                  </div>
                )}
              </div>
              {getStatusBadge(process)}
            </ListGroup.Item>
          ))}
          {processes.length === 0 && (
            <ListGroup.Item>No active processes</ListGroup.Item>
          )}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
