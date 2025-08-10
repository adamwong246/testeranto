/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactElement } from 'react';
import { Container, Row, Col, Nav, Alert, Button } from 'react-bootstrap';
import { NavBar } from './NavBar';
import { TestStatusBadge } from '../TestStatusBadge';

type TestData = {
  name: string;
  givens: {
    name: string;
    whens: {
      name: string;
      error?: string;
      features?: string[];
      artifacts?: string[];
    }[];
    thens: {
      name: string;
      error?: string;
      features?: string[];
      artifacts?: string[];
    }[];
    features?: string[];
    artifacts?: string[];
  }[];
};

type TestPageViewProps = {
  projectName: string;
  testName: string;
  decodedTestPath: string;
  runtime: string;
  logs: Record<string, string>;
  testsExist: boolean;
  errorCounts: {
    runTimeErrors: number;
    typeErrors: number;
    staticErrors: number;
  };
};

export const TestPageView = ({
  projectName,
  testName,
  decodedTestPath,
  runtime,
  testsExist,
  errorCounts,
  logs,
}: TestPageViewProps) => {
  const [activeTab, setActiveTab] = React.useState('tests.json');

  const renderTestResults = (testData: TestData) => {
    return (
      <div className="test-results">
        {testData.givens.map((given, i) => (
          <div key={i} className="mb-4 card">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4>Given: {given.name}</h4>
                  {given.features && given.features.length > 0 && (
                    <div className="mt-1">
                      <small>Features:</small>
                      <ul className="list-unstyled">
                        {given.features.map((feature, fi) => (
                          <li key={fi}>
                            {feature.startsWith('http') ? (
                              <a href={feature} target="_blank" rel="noopener noreferrer" className="text-white">
                                {new URL(feature).hostname}
                              </a>
                            ) : (
                              <span className="text-white">{feature}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {given.artifacts && given.artifacts.length > 0 && (
                  <div className="dropdown">
                    <button
                      className="btn btn-sm btn-light dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      Artifacts ({given.artifacts.length})
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      {given.artifacts.map((artifact, ai) => (
                        <li key={ai}>
                          <a
                            className="dropdown-item"
                            href={`reports/${projectName}/${testName.split('.').slice(0, -1).join('.')}/${runtime}/${artifact}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {artifact.split('/').pop()}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="card-body">
              {given.whens.map((when, j) => (
                <div key={`w-${j}`} className={`p-3 mb-2 ${when.error ? 'bg-danger text-white' : 'bg-success text-white'}`}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div>
                        <strong>When:</strong> {when.name}
                        {when.features && when.features.length > 0 && (
                          <div className="mt-2">
                            <small>Features:</small>
                            <ul className="list-unstyled">
                              {when.features.map((feature, fi) => (
                                <li key={fi}>
                                  {feature.startsWith('http') ? (
                                    <a href={feature} target="_blank" rel="noopener noreferrer">
                                      {new URL(feature).hostname}
                                    </a>
                                  ) : (
                                    feature
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {when.error && <pre className="mt-2">{when.error}</pre>}
                      </div>
                    </div>
                    {when.artifacts && when.artifacts.length > 0 && (
                      <div className="ms-3">
                        <strong>Artifacts:</strong>
                        <ul className="list-unstyled">
                          {when.artifacts.map((artifact, ai) => (
                            <li key={ai}>
                              <a
                                href={`reports/${projectName}/${testName.split('.').slice(0, -1).join('.')}/${runtime}/${artifact}`}
                                target="_blank"
                                className="text-white"
                                rel="noopener noreferrer"
                              >
                                {artifact.split('/').pop()}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {given.thens.map((then, k) => (
                <div key={`t-${k}`} className={`p-3 mb-2 ${then.error ? 'bg-danger text-white' : 'bg-success text-white'}`}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div>
                        <strong>Then:</strong> {then.name}
                        {then.features && then.features.length > 0 && (
                          <div className="mt-2">
                            <small>Features:</small>
                            <ul className="list-unstyled">
                              {then.features.map((feature, fi) => (
                                <li key={fi}>
                                  {feature.startsWith('http') ? (
                                    <a href={feature} target="_blank" rel="noopener noreferrer">
                                      {new URL(feature).hostname}
                                    </a>
                                  ) : (
                                    feature
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {then.error && <pre className="mt-2">{then.error}</pre>}
                      </div>
                    </div>
                    {then.artifacts && then.artifacts.length > 0 && (
                      <div className="ms-3">
                        <strong>Artifacts:</strong>
                        <ul className="list-unstyled">
                          {then.artifacts.map((artifact, ai) => (
                            <li key={ai}>
                              <a
                                href={`reports/${projectName}/${testName.split('.').slice(0, -1).join('.')}/${runtime}/${artifact}`}
                                target="_blank"
                                className="text-white"
                                rel="noopener noreferrer"
                              >
                                {artifact.split('/').pop()}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Container fluid className="px-0">
      <NavBar
        title={decodedTestPath}
        backLink={`/projects/${projectName}`}
        navItems={[
          {
            label: '',
            badge: {
              variant: runtime === 'node' ? 'primary' :
                runtime === 'web' ? 'success' :
                  'info',
              text: runtime
            },
            className: 'pe-none d-flex align-items-center gap-2'
          }
        ]}
        rightContent={
          <Button
            variant="info"
            onClick={async () => {
              try {
                const promptPath = `testeranto/reports/${projectName}/${testName.split('.').slice(0, -1).join('.')}/${runtime}/prompt.txt`;
                const messagePath = `testeranto/reports/${projectName}/${testName.split('.').slice(0, -1).join('.')}/${runtime}/message.txt`;
                const command = `aider --load ${promptPath} --message-file ${messagePath}`;
                await navigator.clipboard.writeText(command);
                alert("Copied aider command to clipboard!");
              } catch (err) {
                alert("Failed to copy command to clipboard");
                console.error("Copy failed:", err);
              }
            }}
            className="ms-2"
          >
            🤖
          </Button>
        }
      />

      <Row className="g-0">
        <Col sm={3} className="border-end">
          <Nav variant="pills" className="flex-column">
            {Object.keys(logs).map((logName) => {
              const displayName = logName.replace('.json', '').replace(/_/g, ' ');
              let statusIndicator: ReactElement<any, any> | null = null;

              // Add error indicators for specific log types
              if (logName === 'type_errors.txt' && errorCounts.typeErrors > 0) {
                statusIndicator = <span className="ms-1">❌ {errorCounts.typeErrors}</span>;
              } else if (logName === 'lint_errors.txt' && errorCounts.staticErrors > 0) {
                statusIndicator = <span className="ms-1">❌ {errorCounts.staticErrors}</span>;
              } else if (logName === 'stderr.log' && errorCounts.runTimeErrors > 0) {
                statusIndicator = <span className="ms-1">❌ {errorCounts.runTimeErrors}</span>;
              } else if (logName === 'exit.log' && logs['exit.log']?.trim() !== '0') {
                statusIndicator = <span className="ms-1">⚠️</span>;
              } else if (logName === 'tests.json' && logs['tests.json']) {
                statusIndicator = <div className="ms-1">
                  <TestStatusBadge
                    testName={decodedTestPath}
                    testsExist={testsExist}
                    runTimeErrors={errorCounts.runTimeErrors}
                    typeErrors={errorCounts.typeErrors}
                    staticErrors={errorCounts.staticErrors}
                    variant="compact"
                    className="mt-1"
                  />
                </div>;
              }

              return (
                <Nav.Item key={logName}>
                  <Nav.Link
                    eventKey={logName}
                    active={activeTab === logName}
                    onClick={() => setActiveTab(logName)}
                    className="d-flex flex-column align-items-start"
                  >
                    <div className="d-flex justify-content-between w-100">
                      <span className="text-capitalize">{displayName}</span>
                      {statusIndicator}
                    </div>
                  </Nav.Link>
                </Nav.Item>
              );
            })}
          </Nav>
        </Col>
        <Col sm={9}>
          <div className="p-3">
            {!testsExist && activeTab === 'tests.json' ? (
              <Alert variant="danger">
                <h4>Tests did not run to completion</h4>
                <p>The test results file (tests.json) was not found or could not be loaded.</p>
              </Alert>
            ) : activeTab === 'tests.json' && logs['tests.json'] ? (
              typeof logs['tests.json'] === 'string'
                ? renderTestResults(JSON.parse(logs['tests.json']))
                : renderTestResults(logs['tests.json'])
            ) : logs[activeTab] ? (
              <pre className="bg-dark text-white p-3">
                <code>{typeof logs[activeTab] === 'string'
                  ? logs[activeTab]
                  : JSON.stringify(logs[activeTab], null, 2)}
                </code>
              </pre>
            ) : (
              <Alert variant="info">No content available for this log</Alert>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};
