import React, { useEffect, useRef, useState } from 'react';
import { Container, Badge, Button, Alert } from 'react-bootstrap';
import { Process } from './ProcessManagerView';
import { useWebSocket } from '../../App';

interface SingleProcessViewProps {
  process: Process | null;
  onBack: () => void;
  loading: boolean;
  onKillProcess?: (processId: string) => void;
}

export const SingleProcessView: React.FC<SingleProcessViewProps> = ({
  process,
  onBack,
  loading,
  onKillProcess,
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [inputEnabled, setInputEnabled] = useState(false);
  const ws = useWebSocket();

  // Update input enabled status
  useEffect(() => {
    setInputEnabled(process?.status === 'running');
  }, [process?.status]);

  // Handle user input
  const handleInput = (data: string) => {
    if (ws && ws.readyState === WebSocket.OPEN && process?.status === 'running') {
      console.log('Sending stdin:', data);
      ws.send(JSON.stringify({
        type: 'stdin',
        processId: process.processId,
        data: data
      }));
    } else {
      console.log('Cannot send stdin - conditions not met:', {
        wsExists: !!ws,
        wsReady: ws?.readyState,
        processStatus: process?.status
      });
    }
  };
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

  if (loading) {
    return <div>Initializing terminal...</div>;
  }

  if (!process) {
    return (
      <Alert variant="warning">
        Process not found or not running. The process may have completed.
      </Alert>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Fixed sidebar */}
        <div
          className=" border-end"
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

        {/* Scrollable logs area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* Log header */}
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white" style={{ flexShrink: 0 }}>

            <small className="text-muted">
              {process.logs?.length || 0} lines
            </small>
          </div>

          {/* Scrollable log content */}
          <div
            className="bg-dark text-light flex-grow-1"
            style={{
              overflowY: 'auto',
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: '14px',
              lineHeight: '1.4',
              padding: '1rem'
            }}
            ref={(el) => {
              // Auto-scroll to bottom when logs update
              if (el) {
                el.scrollTop = el.scrollHeight;
              }
            }}
          >
            {process.logs && process.logs.length > 0 ? (
              <pre className="mb-0" style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'inherit'
              }}>
                {process.logs.join('')}
              </pre>
            ) : (
              <div className="text-muted text-center py-4">
                <i>No output yet</i>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed input at the bottom */}
      {inputEnabled && (
        <div className="border-top bg-white p-3" style={{ flexShrink: 0 }}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type input and press Enter..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const target = e.target as HTMLInputElement;
                  const inputValue = target.value;
                  if (inputValue.trim()) {
                    handleInput(inputValue + '\n');
                    target.value = '';
                  }
                }
              }}
              autoFocus
            />
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                const input = document.querySelector('input') as HTMLInputElement;
                const inputValue = input.value;
                if (inputValue.trim()) {
                  handleInput(inputValue + '\n');
                  input.value = '';
                }
              }}
            >
              Send
            </button>
          </div>
          <small className="text-muted">
            💡 Press Enter to send input to the process
          </small>
        </div>
      )}

      {/* Status alerts - fixed positioning */}
      {!inputEnabled && process.status === 'running' && (
        <Alert variant="info" className="m-3" style={{ flexShrink: 0 }}>
          <Alert.Heading className="h6">Input Disabled</Alert.Heading>
          <small>Terminal input is temporarily unavailable. Try refreshing the page.</small>
        </Alert>
      )}

      {process.status !== 'running' && (
        <Alert variant="secondary" className="m-3" style={{ flexShrink: 0 }}>
          <Alert.Heading className="h6">Read-only Mode</Alert.Heading>
          <small>
            This process is no longer running. You can view the output logs but cannot send input.
          </small>
        </Alert>
      )}
    </div>
  );
};
