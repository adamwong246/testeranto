import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

interface Process {
  processId: string;
  command: string;
  pid?: number;
  timestamp: string;
  status?: string;
}

interface ProcessDetailsProps {
  selectedProcess: Process | undefined;
  selectedProcessId: string | null;
  formatTime: (timestamp: string) => string;
  onRequestLogs: () => void;
  onClearLogs: () => void;
}

export const ProcessDetails: React.FC<ProcessDetailsProps> = ({
  selectedProcess,
  selectedProcessId,
  formatTime,
  onRequestLogs,
  onClearLogs
}) => {
  if (!selectedProcess) {
    return (
      <Card className="h-100 d-flex flex-column">
        <Card.Header className="py-1">Process Details</Card.Header>
        <Card.Body className="d-flex align-items-center justify-content-center flex-grow-1">
          <div className="text-center text-muted">
            <div className="mb-2">Select a process from the list</div>
            <small>to view details and logs</small>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="h-100">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>Process Details</span>
        <Badge bg="info">{selectedProcess.status || 'running'}</Badge>
      </Card.Header>
      <Card.Body>
        <dl className="row mb-0">
          <dt className="col-sm-3">ID</dt>
          <dd className="col-sm-9">
            <code className="small">{selectedProcess.processId}</code>
          </dd>
          
          <dt className="col-sm-3">Command</dt>
          <dd className="col-sm-9">
            <span className="font-monospace">{selectedProcess.command}</span>
          </dd>
          
          <dt className="col-sm-3">Started</dt>
          <dd className="col-sm-9">{formatTime(selectedProcess.timestamp)}</dd>
          
          {selectedProcess.pid && (
            <>
              <dt className="col-sm-3">PID</dt>
              <dd className="col-sm-9">{selectedProcess.pid}</dd>
            </>
          )}
        </dl>
        <div className="d-flex gap-2 mt-3">
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={onRequestLogs}
          >
            Fetch Logs
          </Button>
          <Button 
            variant="outline-warning" 
            size="sm"
            onClick={onClearLogs}
          >
            Clear Logs
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
