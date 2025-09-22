import React from 'react';
import { Badge } from 'react-bootstrap';
import { Process } from './ProcessManagerViewTypes';

interface ProcessListProps {
  processes: Process[];
  selectedProcess: Process | null;
  onSelectProcess: (process: Process) => void;
  loading: boolean;
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

export const ProcessList: React.FC<ProcessListProps> = ({
  processes,
  selectedProcess,
  onSelectProcess,
  loading,
}) => {
  return (
    <div className="p-1">
      {[...processes].reverse().map((process) => (
        <div
          key={process.processId}
          className={`p-2 mb-1 rounded ${selectedProcess?.processId === process.processId
            ? "bg-primary text-white"
            : "bg-white border"
            }`}
          style={{ cursor: "pointer" }}
          onClick={() => onSelectProcess(process)}
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
  );
};
