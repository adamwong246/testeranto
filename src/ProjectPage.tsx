import ReactDom from "react-dom/client";
import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Tab, Container, Alert, Badge, Table } from 'react-bootstrap';

import { ISummary } from './Types';

import style from "./ReportApp.scss";

const useRouter = () => {
  const [route, setRoute] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'tests';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setRoute(hash || 'tests');
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

export const ProjectPage = () => {
  const [summary, setSummary] = useState<ISummary | null>(null);
  const [nodeLogs, setNodeLogs] = useState<any>(null);
  const [webLogs, setWebLogs] = useState<any>(null);
  const [pureLogs, setPureLogs] = useState<any>(null);
  const [config, setConfig] = useState<object>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');
  const { route, navigate } = useRouter();

  // Set initial tab based on hash
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['tests', 'node', 'web', 'pure'].includes(hash)) {
      navigate(hash);
    }
  }, [navigate]);

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const name = pathParts[3]; //[pathParts.length - 1].replace('.html', '');

    setProjectName(name);

    const fetchData = async () => {
      try {
        const [summaryRes, nodeRes, webRes, pureRes, configRes] = await Promise.all([
          fetch(`testeranto/reports/${name}/summary.json`),
          fetch(`testeranto/bundles/node/${name}/metafile.json`),
          fetch(`testeranto/bundles/web/${name}/metafile.json`),
          fetch(`testeranto/bundles/pure/${name}/metafile.json`),
          fetch(`testeranto/reports/${name}/config.json`)
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

  return (
    <Container fluid>
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container fluid>
          <Navbar.Brand>Project: {projectName}</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav variant="tabs" activeKey={route} onSelect={(k) => navigate(k || 'tests')} className="me-auto">
              <Nav.Item>
                <Nav.Link eventKey="tests">Tests</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="node">Node Build</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="web">Web Build</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="pure">Pure Build</Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Tab.Container activeKey={route} onSelect={(k) => navigate(k || 'tests')}>
        <Tab.Content>
          <Tab.Pane eventKey="tests">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Test</th>
                  <th>Status</th>
                  <th>Type Errors</th>
                  <th>Lint Errors</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(summary).map(([testName, testData]) => {

                  const runTime = config.tests.find((t) => t[0] === testName)[1];

                  return (
                    <tr key={testName}>
                      <td>
                        <a href={`/testeranto/reports/${projectName}/${testName.split('.').slice(0, -1).join('.')}/${runTime}/index.html`}>
                          {testName}
                        </a>
                      </td>
                      <td>
                        {testData.runTimeErrors === 0 ? '✅ Passed' :
                          testData.runTimeErrors > 0 ? `⚠️ ${testData.runTimeErrors} errors` :
                            '❌ Failed'}
                      </td>
                      <td>{testData.typeErrors}</td>
                      <td>{testData.staticErrors}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </Tab.Pane>
          <Tab.Pane eventKey="node">
            {nodeLogs && (
              <div className={`alert ${nodeLogs.errors?.length ? 'alert-danger' : 'alert-success'} mb-3`}>
                {nodeLogs.errors?.length ? (
                  <>
                    <h5>❌ Node Build Failed</h5>
                    <ul>
                      {nodeLogs.errors.map((err, i) => (
                        <li key={i}>{err.text || err.message || JSON.stringify(err)}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <h5>✅ Node Build Succeeded</h5>
                )}
              </div>
            )}
            <pre className="bg-dark text-white p-3">
              {nodeLogs ? JSON.stringify(nodeLogs, null, 2) : 'Loading node build logs...'}
            </pre>
          </Tab.Pane>
          <Tab.Pane eventKey="web">
            {webLogs && (
              <div className={`alert ${!webLogs.errors || webLogs.errors.length === 0
                ? 'alert-success'
                : 'alert-danger'} mb-3`}>
                {!webLogs.errors || webLogs.errors.length === 0
                  ? '✅ Web build succeeded'
                  : `❌ Web build failed with ${webLogs.errors.length} errors`}
              </div>
            )}
            <pre className="bg-dark text-white p-3">
              {webLogs ? JSON.stringify(webLogs, null, 2) : 'Loading web build logs...'}
            </pre>
          </Tab.Pane>
          <Tab.Pane eventKey="pure">
            {pureLogs && (
              <div className={`alert ${!pureLogs.errors || pureLogs.errors.length === 0
                ? 'alert-success'
                : 'alert-danger'} mb-3`}>
                {!pureLogs.errors || pureLogs.errors.length === 0
                  ? '✅ Pure build succeeded'
                  : `❌ Pure build failed with ${pureLogs.errors.length} errors`}
              </div>
            )}
            <pre className="bg-dark text-white p-3">
              {pureLogs ? JSON.stringify(pureLogs, null, 2) : 'Loading pure build logs...'}
            </pre>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("root");
  if (elem) {
    ReactDom.createRoot(elem).render(React.createElement(ProjectPage, {}));
  }
});
