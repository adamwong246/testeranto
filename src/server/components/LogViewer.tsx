import React from 'react';
import { Card, Form, InputGroup, Badge, Button } from 'react-bootstrap';

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  source?: string;
}

interface LogViewerProps {
  selectedProcessId: string | null;
  selectedProcessCommand?: string;
  filteredLogs: LogEntry[];
  filterLevel: string;
  searchTerm: string;
  onFilterLevelChange: (level: string) => void;
  onSearchTermChange: (term: string) => void;
  onClearSearch: () => void;
  formatTime: (timestamp: string) => string;
  getLevelBadgeVariant: (level: string) => string;
  logEndRef: React.RefObject<HTMLDivElement>;
}

export const LogViewer: React.FC<LogViewerProps> = ({
  selectedProcessId,
  selectedProcessCommand,
  filteredLogs,
  filterLevel,
  searchTerm,
  onFilterLevelChange,
  onSearchTermChange,
  onClearSearch,
  formatTime,
  getLevelBadgeVariant,
  logEndRef
}) => {
  if (!selectedProcessId) {
    return null;
  }

  const getBadgeVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error': return 'danger';
      case 'warn': return 'warning';
      case 'info': return 'info';
      case 'debug': return 'secondary';
      default: return 'light';
    }
  };

  return (
    <Card className="h-100 d-flex flex-column">
      <Card.Header className="d-flex justify-content-between align-items-center py-1">
        <div>
          <span>Logs</span>
          <Badge bg="secondary" className="ms-1">{filteredLogs.length}</Badge>
        </div>
        <div className="d-flex gap-1 align-items-center">
          <Form.Select
            size="sm"
            style={{ width: 'auto', fontSize: '0.625rem' }}
            value={filterLevel}
            onChange={(e) => onFilterLevelChange(e.target.value)}
          >
            <option value="all">All</option>
            <option value="error">Error</option>
            <option value="warn">Warn</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </Form.Select>
          <InputGroup size="sm" style={{ width: '150px' }}>
            <Form.Control
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              size="sm"
              className="py-0"
            />
            {searchTerm && (
              <Button
                variant="outline-secondary"
                onClick={onClearSearch}
                size="sm"
                className="py-0 px-1"
              >
                &times;
              </Button>
            )}
          </InputGroup>
        </div>
      </Card.Header>
      <Card.Body className="p-0 flex-grow-1" style={{ overflowY: 'auto' }}>
        {filteredLogs.length === 0 ? (
          <div className="p-4 text-center text-muted">
            No logs available for this process.
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {filteredLogs.map((log, index) => (
              <div
                key={index}
                className="list-group-item border-start-0 border-end-0 py-2 px-3"
                style={{
                  borderLeftWidth: '4px',
                  borderLeftStyle: 'solid',
                  borderLeftColor: getBadgeVariant(log.level) === 'danger' ? '#dc3545' :
                    getBadgeVariant(log.level) === 'warning' ? '#ffc107' :
                      getBadgeVariant(log.level) === 'info' ? '#17a2b8' : '#6c757d'
                }}
              >
                <div className="d-flex align-items-center mb-1">
                  <Badge bg={getBadgeVariant(log.level)} className="me-2">
                    {log.level.toUpperCase()}
                  </Badge>
                  <small className="text-muted me-3">{formatTime(log.timestamp)}</small>
                  {log.source && (
                    <Badge bg="light" text="dark" className="border">
                      {log.source}
                    </Badge>
                  )}
                </div>
                <div className="font-monospace small">
                  {log.message}
                </div>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
