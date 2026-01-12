import React from 'react';
import { Card, Badge, Form, Button, ButtonGroup } from 'react-bootstrap';

export interface Event {
  id: string;
  type: 'enqueue' | 'dequeue';
  processId: string;
  command: string;
  timestamp: string;
  details?: string;
}

interface EventLogProps {
  events: Event[];
  filterType: 'all' | 'enqueue' | 'dequeue';
  onFilterTypeChange: (type: 'all' | 'enqueue' | 'dequeue') => void;
  formatTime: (timestamp: string) => string;
  onAddTestEvent?: (type: 'enqueue' | 'dequeue') => void;
  onClearEvents?: () => void;
}

export const EventLog: React.FC<EventLogProps> = ({
  events,
  filterType,
  onFilterTypeChange,
  formatTime,
  onAddTestEvent,
  onClearEvents
}) => {
  const filteredEvents = events.filter(event =>
    filterType === 'all' || event.type === filterType
  );

  const getEventBadgeVariant = (type: string) => {
    switch (type) {
      case 'enqueue': return 'success';
      case 'dequeue': return 'danger';
      default: return 'secondary';
    }
  };

  const handleAddTestEvent = (type: 'enqueue' | 'dequeue') => {
    if (onAddTestEvent) {
      onAddTestEvent(type);
    }
  };

  const handleClearEvents = () => {
    if (onClearEvents) {
      onClearEvents();
    }
  };

  return (
    <Card className="h-100 d-flex flex-column">
      <Card.Header className="d-flex justify-content-between align-items-center py-1">
        <div>
          <span>Event Log</span>
          <Badge bg="secondary" className="ms-1">{filteredEvents.length}</Badge>
        </div>
        <div className="d-flex align-items-center gap-1">
          <Form.Select
            size="sm"
            style={{ width: 'auto', fontSize: '0.625rem' }}
            value={filterType}
            onChange={(e) => onFilterTypeChange(e.target.value as 'all' | 'enqueue' | 'dequeue')}
          >
            <option value="all">All</option>
            <option value="enqueue">Enqueue</option>
            <option value="dequeue">Dequeue</option>
          </Form.Select>
          {onAddTestEvent && (
            <ButtonGroup size="sm">
              <Button
                variant="outline-success"
                onClick={() => handleAddTestEvent('enqueue')}
                title="Add test enqueue event"
                className="px-1"
              >
                +E
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => handleAddTestEvent('dequeue')}
                title="Add test dequeue event"
                className="px-1"
              >
                +D
              </Button>
            </ButtonGroup>
          )}
          {onClearEvents && (
            <Button
              size="sm"
              variant="outline-warning"
              onClick={handleClearEvents}
              title="Clear all events"
              className="px-1"
            >
              C
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Body className="p-0 flex-grow-1" style={{ overflowY: 'auto' }}>
        {filteredEvents.length === 0 ? (
          <div className="p-2 text-center text-muted">
            <small>No events recorded. Use buttons above to add test events.</small>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`list-group-item border-start-0 border-end-0 py-1 px-2 event-log-entry event-${event.type}`}
              >
                <div className="d-flex align-items-center mb-0">
                  <Badge
                    bg={getEventBadgeVariant(event.type)}
                    className="me-1 event-log-badge"
                  >
                    {event.type.toUpperCase()}
                  </Badge>
                  <small className="text-muted me-2">{formatTime(event.timestamp)}</small>
                  <Badge bg="light" text="dark" className="border me-2 event-log-badge">
                    {event.processId}
                  </Badge>
                  <div className="small text-truncate flex-grow-1">
                    {event.command}
                  </div>
                </div>
                {event.details && (
                  <div className="small text-muted mt-0">
                    <small>{event.details}</small>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
