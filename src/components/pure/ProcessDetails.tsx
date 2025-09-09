import React from 'react';
import { Badge, Button, Alert } from 'react-bootstrap';
import { Process } from './ProcessManagerViewTypes';

interface ProcessDetailsProps {
  selectedProcess: Process | null;
  onKillProcess?: (processId: string) => void;
}

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

export const ProcessDetails: React.FC<ProcessDetailsProps> = ({
  selectedProcess,
  onKillProcess,
}) => {
  if (!selectedProcess) {
    return (
      <div className="text-center text-muted mt-5">
        <i>Select a process to view details</i>
      </div>
    );
  }

  return (
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
            maxHeight: "200px"
          }}
        >
          {selectedProcess.command}
        </div>
      </div>
    </div>
  );
};
