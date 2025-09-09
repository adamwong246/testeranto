import React, { useEffect, useRef } from 'react';

interface ProcessLogsProps {
  logs?: string[];
}

export const ProcessLogs: React.FC<ProcessLogsProps> = ({ logs }) => {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when logs update
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Log header */}
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white" style={{ flexShrink: 0 }}>
        <small className="text-muted">
          {logs?.length || 0} lines
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
      >
        {logs && logs.length > 0 ? (
          <pre className="mb-0" style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'inherit'
          }}>
            {logs.join('')}
          </pre>
        ) : (
          <div className="text-muted text-center py-4">
            <i>No output yet</i>
          </div>
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
};
