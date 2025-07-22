import ReactDom from "react-dom/client";
import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Table, Alert, Badge } from 'react-bootstrap';
import { ISummary } from './Types';
import { Container } from 'react-bootstrap';

type ProjectSummary = {
  name: string;
  testCount: number;
  nodeStatus: 'success' | 'failed' | 'unknown';
  webStatus: 'success' | 'failed' | 'unknown';
  pureStatus: 'success' | 'failed' | 'unknown';
};

export const ProjectsPage = () => {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [summaries, setSummaries] = useState<Record<string, ISummary>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [configs, setConfigs] = useState<Record<string, object>>({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsRes = await fetch(`testeranto/projects.json`);
        const projectNames = await projectsRes.json();

        // const projectNames = Object.keys(config.projects);
        const projectsData = await Promise.all(
          projectNames.map(async (name) => {
            const [summaryRes, nodeRes, webRes, pureRes, configRes] = await Promise.all([
              fetch(`testeranto/reports/${name}/summary.json`),
              fetch(`testeranto/bundles/node/${name}/metafile.json`),
              fetch(`testeranto/bundles/web/${name}/metafile.json`),
              fetch(`testeranto/bundles/pure/${name}/metafile.json`),
              fetch(`testeranto/reports/${name}/config.json`),

            ]);

            const [summary, nodeData, webData, pureData, configData] = await Promise.all([
              summaryRes.json(),
              nodeRes.ok ? nodeRes.json() : { errors: ["Failed to load node build logs"] },
              webRes.ok ? webRes.json() : { errors: ["Failed to load web build logs"] },
              pureRes.ok ? pureRes.json() : { errors: ["Failed to load pure build logs"] },
              configRes.json(),
            ]);

            setSummaries(prev => ({ ...prev, [name]: summary }));
            setConfigs(prev => ({ ...prev, [name]: configData }));

            return {
              name,
              testCount: Object.keys(summary).length,
              nodeStatus: nodeData.errors?.length ? 'failed' : 'success',
              webStatus: webData.errors?.length ? 'failed' : 'success',
              pureStatus: pureData.errors?.length ? 'failed' : 'success',
              config: Object.keys(configData).length,
            };
          })
        );

        setProjects(projectsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'failed': return '❌';
      default: return '❓';
    }
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <Alert variant="danger">Error: {error}</Alert>;

  console.log(configs);

  return (
    <div>
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container fluid={true} >
          <Navbar.Brand>Testeranto Projects</Navbar.Brand>
        </Container>
      </Navbar>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Project</th>
            <th>Tests</th>
            <th>Node</th>
            <th>Web</th>
            <th>Pure</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.name}>
              <td>
                <a href={`testeranto/reports/${project.name}.html`}>{project.name}</a>
              </td>
              <td>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {summaries[project.name] ? (
                    Object.keys(summaries[project.name]).map(testName => {
                      const runTime = configs[project.name].tests.find((t) => t[0] === testName)[1];

                      return (
                        <div key={testName}>
                          <a href={`testeranto/reports/${project.name}/${testName.split('.').slice(0, -1).join('.')}/${runTime}/index.html`}>
                            {testName.split('/').pop()}
                          </a>
                        </div>
                      )
                    })
                  ) : (
                    <div>Loading tests...</div>
                  )}
                </div>
              </td>
              <td>
                <a href={`testeranto/reports/${project.name}.html#node`}>
                  {getStatusIcon(project.nodeStatus)} Node
                  {project.nodeStatus === 'failed' && (
                    <Badge bg="danger" className="ms-2">Failed</Badge>
                  )}
                </a>
              </td>
              <td>
                <a href={`testeranto/reports/${project.name}.html#web`}>
                  {getStatusIcon(project.webStatus)} Web
                  {project.webStatus === 'failed' && (
                    <Badge bg="danger" className="ms-2">Failed</Badge>
                  )}
                </a>
              </td>
              <td>
                <a href={`testeranto/reports/${project.name}.html#pure`}>
                  {getStatusIcon(project.pureStatus)} Pure
                  {project.pureStatus === 'failed' && (
                    <Badge bg="danger" className="ms-2">Failed</Badge>
                  )}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};


document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("root");
  if (elem) {
    ReactDom.createRoot(elem).render(React.createElement(ProjectsPage, {}));
  }
});
