import ReactDom from "react-dom/client";
import React, { useEffect, useState } from 'react';
import { Tab, Container, Alert, Badge, Table, Button, Nav } from 'react-bootstrap';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchTestData } from './utils/api';
import { NavBar } from "./NavBar";


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
        const { testData, logs, typeErrors, lintErrors } = await fetchTestData(projectName, testPath, runtime);
        setTestData(testData);
        setLogs(logs);
        setTypeErrors(typeErrors);
        setLintErrors(lintErrors);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading test data...</div>;
  if (error) return <Alert variant="danger">Error: {error}</Alert>;

  return (
    <Container fluid={true}>
      <NavBar
        title={decodedTestPath}
        backLink={`/projects/${projectName}`}
        navItems={[
          {
            to: `#results`,
            label: testData?.givens.some(g => g.whens.some(w => w.error) || g.thens.some(t => t.error))
              ? '❌ BDD'
              : '✅ BDD',
            active: route === 'results'
          },
          {
            to: `#logs`,
            label: logs?.includes('error') || logs?.includes('fail')
              ? '❌ Logs'
              : '✅ Logs',
            active: route === 'logs'
          },
          {
            to: `#types`,
            label: typeErrors
              ? `❌ ${typeErrors.split('\n').filter(l => l.includes('error')).length} Type Errors`
              : '✅ Type check',
            active: route === 'types'
          },
          {
            to: `#lint`,
            label: lintErrors
              ? `❌ ${lintErrors.split('\n').filter(l => l.includes('error')).length} Lint Errors`
              : '✅ Lint',
            active: route === 'lint'
          },

        ]}
        rightContent={
          <Button
            variant="info"
            onClick={() => alert("Magic robot activated!")}
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
            {testData ? (
              <div className="test-results">
                <div className="mb-3">

                </div>
                {testData.givens.map((given, i) => (
                  <div key={i} className="mb-4 card">
                    <div className="card-header bg-primary text-white">
                      <h4>Given: {given.name}</h4>
                    </div>
                    <div className="card-body">
                      {given.whens.map((when, j) => (
                        <div key={`w-${j}`} className={`p-3 mb-2 ${when.error ? 'bg-danger text-white' : 'bg-success text-white'}`}>
                          <strong>When:</strong> {when.name}
                          {when.error && <pre className="mt-2">{when.error}</pre>}
                        </div>
                      ))}
                      {given.thens.map((then, k) => (
                        <div key={`t-${k}`} className={`p-3 mb-2 ${then.error ? 'bg-danger text-white' : 'bg-success text-white'}`}>
                          <strong>Then:</strong> {then.name}
                          {then.error && <pre className="mt-2">{then.error}</pre>}
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
            {logs ? (
              <pre className="bg-dark text-white p-3">{logs}</pre>
            ) : (
              <Alert variant="warning">No runtime logs found</Alert>
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
