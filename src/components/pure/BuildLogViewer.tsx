import React from 'react';
import { Tab, Alert, Badge, Nav, Card, ListGroup } from 'react-bootstrap';

interface BuildLogViewerProps {
  logs: any;
  runtime: string;
}

export const BuildLogViewer: React.FC<BuildLogViewerProps> = ({ logs, runtime }) => {
  if (!logs) return <Alert variant="info">Loading {runtime.toLowerCase()} build logs...</Alert>;

  const hasErrors = logs.errors?.length > 0;
  const hasWarnings = logs.warnings?.length > 0;
  const [activeTab, setActiveTab] = React.useState('summary');

  return (
    <div>
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'summary')}>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="summary">Build Summary</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="warnings">
              {hasWarnings ? `⚠️ Warnings (${logs.warnings.length})` : 'Warnings'}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="errors">
              {hasErrors ? `❌ Errors (${logs.errors.length})` : 'Errors'}
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="summary">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5>Build Summary</h5>
                <div>
                  {hasErrors && (
                    <Badge bg="danger" className="me-2">
                      {logs.errors.length} Error{logs.errors.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                  {hasWarnings && (
                    <Badge bg="warning" text="dark">
                      {logs.warnings.length} Warning{logs.warnings.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                  {!hasErrors && !hasWarnings && (
                    <Badge bg="success">Build Successful</Badge>
                  )}
                </div>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <h6>Input Files ({Object.keys(logs.metafile?.inputs || {}).length})</h6>
                  <ListGroup className="max-h-200 overflow-auto">
                    {Object.keys(logs.metafile?.inputs || {}).map((file) => (
                      <ListGroup.Item key={file} className="py-2">
                        <code>{file}</code>
                        <div className="text-muted small">
                          {logs.metafile.inputs[file].bytes} bytes
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
                <div>
                  <h6>Output Files ({Object.keys(logs.metafile?.outputs || {}).length})</h6>
                  <ListGroup className="max-h-200 overflow-auto">
                    {Object.keys(logs.metafile?.outputs || {}).map((file) => (
                      <ListGroup.Item key={file} className="py-2">
                        <code>{file}</code>
                        <div className="text-muted small">
                          {logs.metafile.outputs[file].bytes} bytes
                          {logs.metafile.outputs[file].entryPoint && (
                            <span className="ms-2 badge bg-info">Entry Point</span>
                          )}
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              </Card.Body>
            </Card>
          </Tab.Pane>
          <Tab.Pane eventKey="warnings">
            {hasWarnings ? (
              <Card className="border-warning">
                <Card.Header className="bg-warning text-white d-flex justify-content-between align-items-center">
                  <span>Build Warnings ({logs.warnings.length})</span>
                  <Badge bg="light" text="dark">
                    {new Date().toLocaleString()}
                  </Badge>
                </Card.Header>
                <Card.Body className="p-0">
                  <ListGroup variant="flush">
                    {logs.warnings.map((warn: any, i: number) => (
                      <ListGroup.Item key={i} className="text-warning">
                        <div className="d-flex justify-content-between">
                          <strong>
                            {warn.location?.file || 'Unknown file'}
                            {warn.location?.line && `:${warn.location.line}`}
                          </strong>
                          <small className="text-muted">
                            {warn.pluginName ? `[${warn.pluginName}]` : ''}
                          </small>
                        </div>
                        <div className="mt-1">
                          <pre className="mb-0 p-2 bg-light rounded">
                            {JSON.stringify(warn)}
                          </pre>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            ) : (
              <Alert variant="info">No warnings found</Alert>
            )}
          </Tab.Pane>
          <Tab.Pane eventKey="errors">
            {hasErrors ? (
              <Card className="border-danger">
                <Card.Header className="bg-danger text-white d-flex justify-content-between align-items-center">
                  <span>Build Errors ({logs.errors.length})</span>
                  <Badge bg="light" text="dark">
                    {new Date().toLocaleString()}
                  </Badge>
                </Card.Header>
                <Card.Body className="p-0">
                  <ListGroup variant="flush">
                    {logs.errors.map((err: any, i: number) => (
                      <ListGroup.Item key={i} className="text-danger">
                        <div className="d-flex justify-content-between">
                          <strong>
                            {err.location?.file || 'Unknown file'}
                            {err.location?.line && `:${err.location.line}`}
                          </strong>
                          <small className="text-muted">
                            {err.pluginName ? `[${err.pluginName}]` : ''}
                          </small>
                        </div>
                        <div className="mt-1">
                          <pre className="mb-0 p-2 bg-light rounded">
                            {JSON.stringify(err)}
                          </pre>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            ) : (
              <Alert variant="success">
                <h5>No Errors Found</h5>
                <p className="mb-0">The build completed without any errors.</p>
              </Alert>
            )}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};
