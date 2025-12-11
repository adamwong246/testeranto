import React from 'react';
import { Badge } from 'react-bootstrap';
import { Process } from './ProcessManagerView';

interface ProcessSidebarProps {
  process: Process;
  webSocketStatus: string;
}

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

export const ProcessSidebar: React.FC<ProcessSidebarProps> = ({
  process,
  webSocketStatus,
}) => {
  return (
    <div
      className="border-end"
      style={{
        width: '300px',
        minWidth: '300px',
        flexShrink: 0,
        overflowY: 'auto'
      }}
    >
      <div className="p-3">
        <div className="mb-3">
          <strong>Command:</strong>
          <code className="bg-white p-2 rounded d-block mt-1" style={{ fontSize: '0.8rem' }}>
            {process.command}
          </code>
        </div>

        <div className="mb-2">
          <strong>Status:</strong>
          <div className="mt-1">{getStatusBadge(process)}</div>
        </div>

        <div className="mb-2">
          <strong>WebSocket:</strong>
          <div className="mt-1">
            <Badge bg={
              webSocketStatus === 'connected' ? 'success' :
                webSocketStatus === 'connecting' ? 'warning' : 'danger'
            }>
              {webSocketStatus}
            </Badge>
          </div>
        </div>

        <div className="mb-2">
          <strong>PID:</strong>
          <div className="text-muted">{process.pid || 'N/A'}</div>
        </div>

        <div className="mb-2">
          <strong>Started:</strong>
          <div className="text-muted">{new Date(process.timestamp).toLocaleString()}</div>
        </div>

        {process.exitCode !== undefined && (
          <div className="mb-2">
            <strong>Exit Code:</strong>
            <div className="text-muted">{process.exitCode}</div>
          </div>
        )}

        {process.error && (
          <div className="mt-3">
            <strong className="text-danger">Error:</strong>
            <div className="text-danger small mt-1">{process.error}</div>
          </div>
        )}
      </div>
    </div>
  );
};
