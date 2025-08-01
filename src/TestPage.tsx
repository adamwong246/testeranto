/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';
import { Tab, Container, Alert, Button } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchTestData } from './utils/api';
import { NavBar } from "./NavBar";
import { TestStatusBadge } from "./components/TestStatusBadge";

type TestData = {
  name: string;
  givens: {
    name: string;
    whens: {
      name: string;
      error?: string;
    }[];
    thens: {
      name: string;
      error?: string;
    }[];
  }[];
};

export const TestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [route, setRoute] = useState('results');

  // Sync route with hash changes
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['results', 'logs', 'types', 'lint', 'coverage'].includes(hash)) {
      setRoute(hash);
    } else {
      setRoute('results');
    }
  }, [location.hash]);
  const [testName, setTestName] = useState('');
  // const [projectName, setProjectName] = useState('');
  const [testData, setTestData] = useState<TestData | null>(null);
  const [logs, setLogs] = useState<string>('');
  const [typeErrors, setTypeErrors] = useState<string>('');
  const [lintErrors, setLintErrors] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testsExist, setTestsExist] = useState<boolean>(true);
  const [errorCounts, setErrorCounts] = useState({
    typeErrors: 0,
    staticErrors: 0,
    runTimeErrors: 0
  });
  const [summary, setSummary] = useState<any>(null);

  const { projectName, '*': splat } = useParams();
  const pathParts = splat ? splat.split('/') : [];
  const runtime = pathParts.pop() || '';
  const testPath = pathParts.join('/');
  const decodedTestPath = testPath ? decodeURIComponent(testPath) : '';

  useEffect(() => {
    if (!projectName || !testPath || !runtime) return;
    setTestName(testPath);
    // setProjectName(projectName);

    const fetchData = async () => {
      try {
        // First fetch test data
        const testResponse = await fetchTestData(projectName, testPath, runtime);
        setTestData(testResponse.testData);
        setTestsExist(!!testResponse.testData);
        setLogs(testResponse.logs === null ? undefined : testResponse.logs);
        setTypeErrors(testResponse.typeErrors);
        setLintErrors(testResponse.lintErrors);

        // Then fetch summary.json
        try {
          const summaryResponse = await fetch(`reports/${projectName}/summary.json`);
          if (!summaryResponse.ok) throw new Error('Failed to fetch summary');
          const allSummaries = await summaryResponse.json();
          const testSummary = allSummaries[testPath];

          console.log("testSummary", testSummary)
          if (testSummary) {
            console.groupCollapsed(`[TestPage] Processing test summary for ${testPath}`);
            console.log('Raw test summary:', testSummary);

            const counts = {
              typeErrors: Number(testSummary.typeErrors) || 0,
              staticErrors: Number(testSummary.staticErrors) || 0,
              runTimeErrors: Number(testSummary.runTimeErrors) || 0
            };

            console.log('Normalized counts:', counts);

            // Validate counts
            if (counts.runTimeErrors === -1 && testSummary.testsExist) {
              console.warn('Inconsistent state: runTimeErrors=-1 but testsExist=true');
            }
            if (!testSummary.testsExist && counts.runTimeErrors > 0) {
              console.warn('Inconsistent state: testsExist=false but runTimeErrors>0');
            }

            setSummary(testSummary);
            setErrorCounts(counts);
            setTestsExist(testSummary.testsExist !== false);

            console.groupEnd();
          }
        } catch (err) {
          console.error('Failed to load summary:', err);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setTestsExist(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading test data...</div>;
  if (error) return <Alert variant="danger">Error: {error}</Alert>;

  console.log('Test status debug:', {
    testName,
    testsExist,
    testData,
    fails: testData?.fails,
    runTimeErrors: errorCounts.runTimeErrors,
    typeErrors: errorCounts.typeErrors,
    staticErrors: errorCounts.staticErrors
  });

  console.log('Test data:', {
    testData,
    testsExist,
    errorCounts,
    summary
  });

  return (
    <Container fluid={true}>
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
          },
          {
            to: `#results`,
            label: (
              <TestStatusBadge
                testName={decodedTestPath}
                testsExist={testsExist}
                runTimeErrors={errorCounts.runTimeErrors}
                variant="compact"
              />
            ),
            className: !testsExist || errorCounts.runTimeErrors > 0
              ? 'text-danger fw-bold'
              : '',
            active: route === 'results'
          },
          {
            to: `#logs`,
            label: `Runtime logs`,
            active: route === 'logs'
          },
          {
            to: `#types`,
            label: errorCounts.typeErrors > 0
              ? `tsc (❌ * ${errorCounts.typeErrors})`
              : 'tsc ✅ ',
            active: route === 'types'
          },
          {
            to: `#lint`,
            label: errorCounts.staticErrors > 0
              ? `eslint (❌ *${errorCounts.staticErrors}) `
              : 'eslint ✅',
            active: route === 'lint'
          },

        ]}
        rightContent={
          <Button
            variant="info"
            onClick={async () => {
              try {
                const promptPath = `testeranto/reports/${projectName}/${testPath.split('.').slice(0, -1).join('.')}/${runtime}/prompt.txt`;
                const messagePath = `testeranto/reports/${projectName}/${testPath.split('.').slice(0, -1).join('.')}/${runtime}/message.txt`;
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


      <Tab.Container activeKey={route} onSelect={(k) => {
        if (k) {
          setRoute(k);
          navigate(`#${k}`, { replace: true });
        }
      }}>

        <Tab.Content className="mt-3">
          <Tab.Pane eventKey="results">
            {!testsExist ? (
              <Alert variant="danger" className="mt-3">
                <h4>Tests did not run to completion</h4>
                <p>The test results file (tests.json) was not found or could not be loaded.</p>
                <div className="mt-3">
                  <Button
                    variant="outline-light"
                    onClick={() => setRoute('logs')}
                    className="me-2"
                  >
                    View Runtime Logs
                  </Button>
                  <Button
                    variant="outline-light"
                    onClick={() => navigate(`/projects/${projectName}#${runtime}`)}
                  >
                    View Build Logs
                  </Button>
                </div>
              </Alert>
            ) : testData ? (
              <div className="test-results">
                <div className="mb-3">

                </div>
                {testData.givens.map((given, i) => (
                  <div key={i} className="mb-4 card">
                    <div className="card-header bg-primary text-white">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h4>Given: {given.name}</h4>
                          {given.features?.length > 0 && (
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
                        {given.artifacts?.length > 0 && (
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
                                    href={`/testeranto/reports/${projectName}/${testName.split('.').slice(0, -1).join('.')}/${runtime}/${artifact}`}
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
                                {when.features?.length > 0 && (
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
                            {when.artifacts?.length > 0 && (
                              <div className="ms-3">
                                <strong>Artifacts:</strong>
                                <ul className="list-unstyled">
                                  {when.artifacts.map((artifact, ai) => (
                                    <li key={ai}>
                                      <a
                                        href={`/testeranto/reports/${projectName}/${testName.split('.').slice(0, -1).join('.')}/${runtime}/${artifact}`}
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
                                {then.features?.length > 0 && (
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
                            {then.artifacts?.length > 0 && (
                              <div className="ms-3">
                                <strong>Artifacts:</strong>
                                <ul className="list-unstyled">
                                  {then.artifacts.map((artifact, ai) => (
                                    <li key={ai}>
                                      <a
                                        href={`/testeranto/reports/${projectName}/${testName.split('.').slice(0, -1).join('.')}/${runtime}/${artifact}`}
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
            ) : (
              <Alert variant="warning">No test results found</Alert>
            )}
          </Tab.Pane>
          <Tab.Pane eventKey="logs">
            {logs === undefined ? (
              <Alert variant="danger">
                <h4>Logs file missing</h4>
                <p>The runtime logs file (logs.txt) was not found.</p>
                <p>This suggests the test may not have executed properly.</p>
              </Alert>
            ) : logs === '' ? (
              <Alert variant="success">
                <h4>No runtime logs</h4>
                <p>The test executed successfully with no log output.</p>
              </Alert>
            ) : (
              <pre className="bg-dark text-white p-3">{logs}</pre>
            )}
          </Tab.Pane>
          <Tab.Pane eventKey="types">
            {typeErrors ? (
              <pre className="bg-dark text-white p-3">{typeErrors}</pre>
            ) : (
              <Alert variant="warning">No type errors found</Alert>
            )}
          </Tab.Pane>
          <Tab.Pane eventKey="lint">
            {lintErrors ? (
              <pre className="bg-dark text-white p-3">{lintErrors}</pre>
            ) : (
              <Alert variant="warning">No lint errors found</Alert>
            )}
          </Tab.Pane>
          <Tab.Pane eventKey="coverage">
            <div className="coverage-report">
              <Alert variant="info">
                Coverage reports coming soon!
              </Alert>
              <div className="coverage-stats">
                <div className="stat-card bg-success text-white">
                  <h4>85%</h4>
                  <p>Lines Covered</p>
                </div>
                <div className="stat-card bg-warning text-dark">
                  <h4>72%</h4>
                  <p>Branches Covered</p>
                </div>
                <div className="stat-card bg-info text-white">
                  <h4>91%</h4>
                  <p>Functions Covered</p>
                </div>
              </div>
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};



// document.addEventListener("DOMContentLoaded", function () {
//   const elem = document.getElementById("root");
//   if (elem) {
//     ReactDom.createRoot(elem).render(React.createElement(TestPage, {}));
//   }
// });
