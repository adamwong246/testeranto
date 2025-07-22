import ReactDom from "react-dom/client";
import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Tab, Container, Alert, Badge, Table, Button } from 'react-bootstrap';
import { fetchTestData } from './utils/api';

const useRouter = () => {
  const [route, setRoute] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'results';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setRoute(hash || 'results');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (newRoute: string) => {
    window.location.hash = newRoute;
    setRoute(newRoute);
  };

  return { route, navigate };
};

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
  const { route, navigate } = useRouter();
  const [testName, setTestName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [testData, setTestData] = useState<TestData | null>(null);
  const [logs, setLogs] = useState<string>('');
  const [typeErrors, setTypeErrors] = useState<string>('');
  const [lintErrors, setLintErrors] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');//.slice(0, -1)

    const projectName = pathParts[3];
    const testPath = pathParts.slice(4, -2).join("/");
    const runTime = pathParts.slice(-2, -1)[0]

    // const name = pathParts[pathParts.length - 1].replace('.html', '');
    // const project = pathParts[pathParts.length - 2];
    setTestName(testPath);
    setProjectName(projectName);

    const fetchData = async () => {
      try {
        const { testData, logs, typeErrors, lintErrors } = await fetchTestData(projectName, testPath, runTime);
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
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container fluid={true}>
          <Navbar.Brand>
            {projectName} / {testName.split('/').pop()}
            <Badge bg="secondary" className="ms-2">{projectName}</Badge>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav variant="tabs" activeKey={route} onSelect={(k) => navigate(k || 'results')} className="me-auto">
              <Nav.Item>
                <Nav.Link eventKey="results">BDD Results</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="logs">Runtime Logs</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="types">Type Errors</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="lint">Lint Errors</Nav.Link>
              </Nav.Item>
            </Nav>
            <Nav>

              <Button variant="info" onClick={() => alert("Magic robot activated!")} >🤖</Button>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Tab.Container activeKey={route} onSelect={(k) => navigate(k || 'results')}>

        <Tab.Content className="mt-3">
          <Tab.Pane eventKey="results">
            {testData ? (
              <div>
                {testData.givens.map((given, i) => (
                  <div key={i} className="mb-4">
                    <h4>Given: {given.name}</h4>
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
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};



document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("root");
  if (elem) {
    ReactDom.createRoot(elem).render(React.createElement(TestPage, {}));
  }
});
