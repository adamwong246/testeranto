/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Tab, Container, Alert, Table, Badge, Nav, Card, ListGroup } from 'react-bootstrap';
import { NavBar } from '../../NavBar';
import { TestStatusBadge } from '../TestStatusBadge';

const BuildLogViewer = ({ logs, runtime }: { logs: any, runtime: string }) => {
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
                            {warn.text || warn.message || JSON.stringify(warn)}
                          </pre>
                        </div>
                        {warn.detail && (
                          <div className="mt-1 small text-muted">
                            <pre className="mb-0 p-2 bg-light rounded">
                              {warn.detail}
                            </pre>
                          </div>
                        )}
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
                            {err.text || err.message || JSON.stringify(err)}
                          </pre>
                        </div>
                        {err.detail && (
                          <div className="mt-1 small text-muted">
                            <pre className="mb-0 p-2 bg-light rounded">
                              {err.detail}
                            </pre>
                          </div>
                        )}
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

export const ProjectPageView = ({
  summary,
  nodeLogs,
  webLogs,
  pureLogs,
  config,
  loading,
  error,
  projectName,
  route,
  setRoute,
  navigate
}) => {
  if (loading) return <div>Loading project data...</div>;
  if (error) return <Alert variant="danger">Error: {error}</Alert>;
  if (!summary) return <Alert variant="warning">No data found for project</Alert>;

  const testStatuses = Object.entries(summary).map(([testName, testData]) => {
    const runTime = config.tests?.find((t) => t[0] === testName)?.[1] || 'node';
    return {
      testName,
      testsExist: testData.testsExist !== false,
      runTimeErrors: Number(testData.runTimeErrors) || 0,
      typeErrors: Number(testData.typeErrors) || 0,
      staticErrors: Number(testData.staticErrors) || 0,
      runTime
    };
  });

  return (
    <Container fluid>
      <NavBar
        title={projectName}
        backLink="/"
        navItems={[
          {
            to: `#tests`,
            label: testStatuses.some(t => t.runTimeErrors > 0) ? '❌ Tests' :
              testStatuses.some(t => t.typeErrors > 0 || t.staticErrors > 0) ? '⚠️ Tests' : '✅ Tests',
            active: route === 'tests',
            className: testStatuses.some(t => t.runTimeErrors > 0) ? 'text-danger fw-bold' :
              testStatuses.some(t => t.typeErrors > 0 || t.staticErrors > 0) ? 'text-warning fw-bold' : ''
          },
          {
            to: `#node`,
            label: nodeLogs?.errors?.length ? '❌ Node Build' :
              nodeLogs?.warnings?.length ? '⚠️ Node Build' : 'Node Build',
            active: route === 'node',
            className: nodeLogs?.errors?.length ? 'text-danger fw-bold' :
              nodeLogs?.warnings?.length ? 'text-warning fw-bold' : ''
          },
          {
            to: `#web`,
            label: webLogs?.errors?.length ? '❌ Web Build' :
              webLogs?.warnings?.length ? '⚠️ Web Build' : 'Web Build',
            active: route === 'web',
            className: webLogs?.errors?.length ? 'text-danger fw-bold' :
              webLogs?.warnings?.length ? 'text-warning fw-bold' : ''
          },
          {
            to: `#pure`,
            label: pureLogs?.errors?.length ? '❌ Pure Build' :
              pureLogs?.warnings?.length ? '⚠️ Pure Build' : 'Pure Build',
            active: route === 'pure',
            className: pureLogs?.errors?.length ? 'text-danger fw-bold' :
              pureLogs?.warnings?.length ? 'text-warning fw-bold' : ''
          },
        ]}
      />

      <Tab.Container activeKey={route} onSelect={(k) => {
        if (k) {
          setRoute(k);
          navigate(`#${k}`, { replace: true });
        }
      }}>
        <Tab.Content>
          <Tab.Pane eventKey="tests">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Test</th>
                  <th>Runtime</th>
                  <th>Status</th>
                  <th>Type Errors</th>
                  <th>Lint Errors</th>
                </tr>
              </thead>
              <tbody>
                {testStatuses.map((test) => (
                  <tr key={test.testName}>
                    <td>
                      <a href={`#/projects/${projectName}/tests/${encodeURIComponent(test.testName)}/${test.runTime}`}>
                        {test.testName}
                      </a>
                    </td>
                    <td>
                      <Badge bg="secondary" className="ms-2">
                        {test.runTime}
                      </Badge>
                    </td>
                    <td>
                      <TestStatusBadge
                        testName={test.testName}
                        testsExist={test.testsExist}
                        runTimeErrors={test.runTimeErrors}
                      />
                    </td>
                    <td>
                      <a href={`#/projects/${projectName}/tests/${encodeURIComponent(test.testName)}/${test.runTime}#types`}>
                        {test.typeErrors > 0 ? `❌ ${test.typeErrors}` : '✅'}
                      </a>
                    </td>
                    <td>
                      <a href={`#/projects/${projectName}/tests/${encodeURIComponent(test.testName)}/${test.runTime}#lint`}>
                        {test.staticErrors > 0 ? `❌ ${test.staticErrors}` : '✅'}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab.Pane>
          <Tab.Pane eventKey="node">
            <BuildLogViewer logs={nodeLogs} runtime="Node" />
          </Tab.Pane>
          <Tab.Pane eventKey="web">
            <BuildLogViewer logs={webLogs} runtime="Web" />
          </Tab.Pane>
          <Tab.Pane eventKey="pure">
            <BuildLogViewer logs={pureLogs} runtime="Pure" />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};
