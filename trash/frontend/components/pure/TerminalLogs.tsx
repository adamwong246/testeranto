import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from 'react-bootstrap';

interface TerminalLogsProps {
  logs: string[];
}

export const TerminalLogs: React.FC<TerminalLogsProps> = ({ logs }) => {
  const [autoScroll, setAutoScroll] = useState(true);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive and autoScroll is enabled
  useEffect(() => {
    if (autoScroll && logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Handle scroll events to determine if we should auto-scroll
  const handleLogsScroll = useCallback(() => {
    if (logsContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = logsContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 10;
      setAutoScroll(isAtBottom);
    }
  }, []);

  const handleScrollToBottom = useCallback(() => {
    setAutoScroll(true);
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, []);

  return (
    <div
      ref={logsContainerRef}
      className="bg-dark text-light flex-grow-1"
      style={{
        overflowY: "auto",
        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
        fontSize: "14px",
        lineHeight: "1.4",
        padding: "0.5rem"
      }}
      onScroll={handleLogsScroll}
    >
      {logs.length > 0 ? (
        <pre
          className="mb-0"
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            backgroundColor: "transparent",
            border: "none",
            color: "inherit",
          }}
        >
          {logs.join("")}
        </pre>
      ) : (
        <div className="text-muted text-center py-4">
          <i>No output yet</i>
        </div>
      )}
      {/* Auto-scroll indicator */}
      {!autoScroll && (
        <div className="position-sticky bottom-0 d-flex justify-content-center mb-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleScrollToBottom}
          >
            Scroll to Bottom
          </Button>
        </div>
      )}
    </div>
  );
};
