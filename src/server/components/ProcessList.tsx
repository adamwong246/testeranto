import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';

interface Process {
  processId: string;
  command: string;
  pid?: number;
  timestamp: string;
  status?: string;
}

interface ProcessListProps {
  processes: Process[];
  selectedProcessId: string | null;
  onSelectProcess: (processId: string) => void;
  formatTime: (timestamp: string) => string;
}

export const ProcessList: React.FC<ProcessListProps> = ({
  processes,
  selectedProcessId,
  onSelectProcess,
  formatTime
}) => {
  return (
    <Card className="h-100 d-flex flex-column">
      <Card.Header className="d-flex justify-content-between align-items-center py-1">
        <span>Processes</span>
        <Badge bg="secondary" pill>{processes.length}</Badge>
      </Card.Header>
      <Card.Body className="p-0 flex-grow-1" style={{ overflowY: 'auto' }}>
        {processes.length === 0 ? (
          <div className="p-2 text-center text-muted small">
            No processes
          </div>
        ) : (
          <ListGroup variant="flush" className="overflow-auto">
            {processes.map(process => (
              <ListGroup.Item
                key={process.processId}
                action
                active={selectedProcessId === process.processId}
                onClick={() => {
                  console.log('Selecting process:', process.processId, 'command:', process.command);
                  onSelectProcess(process.processId);
                }}
                className="py-2 px-3"
              >
                <div className="fw-bold text-truncate">{process.command}</div>
                <div className="small text-muted">
                  <span className="me-2">ID: {process.processId}</span>
                  <span>Started: {formatTime(process.timestamp)}</span>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};
