import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Tab, Container, Alert, Badge, Table, Button } from 'react-bootstrap';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';

import { ISummary } from './Types';

import "./TestReport.scss";
import { NavBar } from './NavBar';


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

  return (
    <Container fluid>
      <NavBar
        title={projectName}
        backLink="/"
        navItems={[
          { to: `#tests`, label: 'Tests', active: route === 'tests' },
          {
            to: `#node`,
            label: nodeLogs?.errors?.length ? '❌ Node Build' : '✅ Node Build',
            active: route === 'node',
            className: nodeLogs?.errors?.length ? 'text-danger fw-bold' : 'text-success fw-bold'
          },
          {
            to: `#web`,
            label: webLogs?.errors?.length ? '❌ Web Build' : '✅ Web Build',
            active: route === 'web',
            className: webLogs?.errors?.length ? 'text-danger fw-bold' : 'text-success fw-bold'
          },
          {
            to: `#pure`,
            label: pureLogs?.errors?.length ? '❌ Pure Build' : '✅ Pure Build',
            active: route === 'pure',
            className: pureLogs?.errors?.length ? 'text-danger fw-bold' : 'text-success fw-bold'
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
                  <th>Build logs</th>
                  <th>BDD Errors</th>
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
                        <a href={`#/projects/${projectName}/tests/${encodeURIComponent(testName)}/${runTime}`}>
                          {testName}
                        </a>
                      </td>
                      <td>
                        <a href={`#/projects/${projectName}#${runTime}`}>
                          {runTime} {testData.runTimeErrors === 0 ? '✅' : '❌'}
                        </a>
                      </td>
                      <td>
                        <a href={`#/projects/${projectName}/tests/${encodeURIComponent(testName)}/${runTime}#results`}>
                          {testData.runTimeErrors === 0 ? '✅ Passed' :
                            testData.runTimeErrors > 0 ? `⚠️ ${testData.runTimeErrors} errors` :
                              '❌ Failed'}
                        </a>
                      </td>
                      <td>
                        <a href={`#/projects/${projectName}/tests/${encodeURIComponent(testName)}/${runTime}#types`}>
                          {testData.typeErrors}
                        </a>
                      </td>
                      <td>
                        <a href={`#/projects/${projectName}/tests/${encodeURIComponent(testName)}/${runTime}#lint`}>
                          {testData.staticErrors}
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </Tab.Pane>
          <Tab.Pane eventKey="node">
            <ul>
              {nodeLogs.errors.map((err, i) => (
                <li key={i}>{err.text || err.message || JSON.stringify(err)}</li>
              ))}
            </ul>
            <pre className="bg-dark text-white p-3">
              {nodeLogs ? JSON.stringify(nodeLogs, null, 2) : 'Loading node build logs...'}
            </pre>
          </Tab.Pane>
          <Tab.Pane eventKey="web">
            <ul>
              {webLogs.errors.map((err, i) => (
                <li key={i}>{err.text || err.message || JSON.stringify(err)}</li>
              ))}
            </ul>
            <pre className="bg-dark text-white p-3">
              {webLogs ? JSON.stringify(webLogs, null, 2) : 'Loading web build logs...'}
            </pre>
          </Tab.Pane>
          <Tab.Pane eventKey="pure">
            <ul>
              {pureLogs.errors.map((err, i) => (
                <li key={i}>{err.text || err.message || JSON.stringify(err)}</li>
              ))}
            </ul>
            <pre className="bg-dark text-white p-3">
              {pureLogs ? JSON.stringify(pureLogs, null, 2) : 'Loading pure build logs...'}
            </pre>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

