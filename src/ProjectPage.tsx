/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';

import { Card, ListGroup, Nav, Tab, Container, Alert, Badge, Table, Button } from 'react-bootstrap';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';

import { ISummary } from './Types';

// import "./TestReport.scss";
import { NavBar } from './NavBar';
import { TestStatusBadge } from './components/TestStatusBadge';

const BuildLogViewer = ({ logs, runtime }: { logs: any, runtime: string }) => {
  if (!logs) return <Alert variant="info">Loading {runtime.toLowerCase()} build logs...</Alert>;

  const hasErrors = logs.errors?.length > 0;
  const hasWarnings = logs.warnings?.length > 0;
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <div>
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'summary')}>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="summary">
              Build Summary
            </Nav.Link>
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
                    <div className="d-flex align-items-center gap-2">
                      <Badge bg="success">Build Successful</Badge>
                      {logs.testsExist && (
                        <Badge bg="info">tests.json ✓</Badge>
                      )}
                    </div>
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



export const ProjectPage = () => {
  const [summary, setSummary] = useState<ISummary | null>(null);
  const [nodeLogs, setNodeLogs] = useState<any>(null);
  const [webLogs, setWebLogs] = useState<any>(null);
  const [pureLogs, setPureLogs] = useState<any>(null);
  const [config, setConfig] = useState<object>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [route, setRoute] = useState('tests');

  // Sync route with hash changes
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['tests', 'node', 'web', 'pure'].includes(hash)) {
      setRoute(hash);
    } else {
      setRoute('tests');
    }
  }, [location.hash]);

  const { projectName: name } = useParams();

  useEffect(() => {
    if (!name) return;
    setProjectName(name);

    // Set initial tab from hash
    const hash = window.location.hash.replace('#', '');
    if (hash && ['tests', 'node', 'web', 'pure'].includes(hash)) {
      setRoute(hash);
    }

    const fetchData = async () => {
      try {
        const [summaryRes, nodeRes, webRes, pureRes, configRes] = await Promise.all([
          fetch(`reports/${name}/summary.json`),
          fetch(`bundles/node/${name}/metafile.json`),
          fetch(`bundles/web/${name}/metafile.json`),
          fetch(`bundles/pure/${name}/metafile.json`),
          fetch(`reports/${name}/config.json`)
        ]);

        if (!summaryRes.ok) throw new Error('Failed to fetch summary');

        const [summaryData, nodeData, webData, pureData, configData] = await Promise.all([
          summaryRes.json(),
          nodeRes.ok ? nodeRes.json() : { errors: ["Failed to load node build logs"] },
          webRes.ok ? webRes.json() : { errors: ["Failed to load web build logs"] },
          pureRes.ok ? pureRes.json() : { errors: ["Failed to load pure build logs"] },
          configRes.ok ? configRes.json() : { tests: [] }
        ]);

        // Get runtime from first test in config
        // const runtime = configData.tests.length > 0 ? configData.tests[0][1] : 'node';
        // setRuntime(runtime);
        // ]);


        setSummary(summaryData);
        setNodeLogs(nodeData);
        setWebLogs(webData);
        setPureLogs(pureData);
        setConfig(configData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading project data...</div>;
  if (error) return <Alert variant="danger">Error: {error}</Alert>;
  if (!summary) return <Alert variant="warning">No data found for project</Alert>;

  const testStatuses = Object.entries(summary).map(([testName, testData]) => {
    console.groupCollapsed(`[ProjectPage] Processing test: ${testName}`);
    console.log('Raw test data from summary.json:', testData);

    // Check if tests.json exists by making a HEAD request
    const checkTestsJson = async () => {
      try {
        // Get runtime from config or fall back to test name pattern
        let runtimeType = 'node'; // default fallback
        const testConfig = config.tests?.find((t) => t[0] === testName);
        if (testConfig) {
          runtimeType = testConfig[1] || runtimeType;
        } else if (testName.includes('.web.')) {
          runtimeType = 'web';
        } else if (testName.includes('.pure.')) {
          runtimeType = 'pure';
        }

        const jsonPath = `reports/${projectName}/${testName.split('.').slice(0, -1).join('.')}/${runtimeType}/tests.json`;

        const res = await fetch(jsonPath, {
          method: 'HEAD'
        });
        return res.ok;
      } catch {
        return false;
      }
    };

    const testsJsonExists = checkTestsJson();

    const status = {
      testName,
      testsExist: testsJsonExists && testData.testsExist !== false, // Ensure boolean
      runTimeErrors: Number(testData.runTimeErrors) || 0, // Ensure number
      typeErrors: Number(testData.typeErrors) || 0,
      staticErrors: Number(testData.staticErrors) || 0
    };

    console.log('Normalized status:', status);
    console.log('tests.json exists:', testsJsonExists);

    // Validate status consistency
    if (status.runTimeErrors === -1 && status.testsExist) {
      console.warn('Inconsistent state: runTimeErrors=-1 but testsExist=true');
    }
    if (!status.testsExist && status.runTimeErrors > 0) {
      console.warn('Inconsistent state: testsExist=false but runTimeErrors>0');
    }

    console.groupEnd();
    return status;
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
                  <th>BDD Errors</th>
                  <th>Type Errors</th>
                  <th>Lint Errors</th>
                </tr>
              </thead>
              <tbody>
                {testStatuses.map((test) => {
                  const testConfig = config.tests?.find((t) => t[0] === test.testName);
                  const runTime = testConfig?.[1] || 'node'; // Default to 'node' if not found
                  const hasRuntimeErrors = test.runTimeErrors > 0;
                  const hasTypeErrors = test.typeErrors > 0;
                  const hasLintErrors = test.staticErrors > 0;

                  return (
                    <tr key={test.testName}>
                      <td>
                        <a href={`#/projects/${projectName}/tests/${encodeURIComponent(test.testName)}/${runTime}`}>
                          {test.testName}

                        </a>
                      </td>
                      <td>
                        <Badge bg="secondary" className="ms-2">
                          {runTime}
                        </Badge>
                      </td>
                      <td>
                        <TestStatusBadge
                          testName={test.testName}
                          testsExist={test.testsExist}
                          runTimeErrors={test.runTimeErrors}
                          typeErrors={test.typeErrors}
                          staticErrors={test.staticErrors}
                        />
                      </td>
                      <td>
                        <a href={`#/projects/${projectName}/tests/${encodeURIComponent(test.testName)}/${runTime}#types`}>
                          {test.typeErrors > 0
                            ? `tsc (❌ * ${test.typeErrors})`
                            : 'tsc ✅'}
                        </a>
                      </td>
                      <td>
                        <a href={`#/projects/${projectName}/tests/${encodeURIComponent(test.testName)}/${runTime}#lint`}>
                          {test.staticErrors > 0
                            ? `eslint (❌ *${test.staticErrors})`
                            : 'eslint ✅'}
                        </a>
                      </td>
                    </tr>
                  );
                })}
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

