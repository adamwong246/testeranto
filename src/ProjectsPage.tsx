import ReactDom from "react-dom/client";
import React, { useEffect, useState } from 'react';
import { Table, Alert, Badge, Container, Navbar } from 'react-bootstrap';
import { ISummary } from './Types';
import { useNavigate } from 'react-router-dom';
import { NavBar } from "./NavBar";

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

  const navigate = useNavigate();
  const [configs, setConfigs] = useState<Record<string, object>>({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsRes = await fetch(`projects.json`);
        const projectNames = await projectsRes.json();

        // const projectNames = Object.keys(config.projects);
        const projectsData = await Promise.all(
          projectNames.map(async (name) => {
            const [summaryRes, nodeRes, webRes, pureRes, configRes] = await Promise.all([
              fetch(`reports/${name}/summary.json`),
              fetch(`bundles/node/${name}/metafile.json`),
              fetch(`bundles/web/${name}/metafile.json`),
              fetch(`bundles/pure/${name}/metafile.json`),
              fetch(`reports/${name}/config.json`),

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
    <div className="p-3">
      <NavBar title="Testeranto" backLink={null} />
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
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  navigate(`/projects/${project.name}`);
                }}>{project.name}</a>
              </td>
              <td>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {summaries[project.name] ? (
                    Object.keys(summaries[project.name]).map(testName => {
                      const runTime = configs[project.name].tests.find((t) => t[0] === testName)[1];

                      return (
                        <div key={testName}>
                          <a href={`#/projects/${project.name}/tests/${encodeURIComponent(testName)}/${runTime}`}>
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
                <a href={`#/projects/${project.name}#node`}>
                  {getStatusIcon(project.nodeStatus)}
                  {project.nodeStatus === 'failed' && (
                    <Badge bg="danger" className="ms-2">Failed</Badge>
                  )}
                </a>
              </td>
              <td>
                <a href={`#/projects/${project.name}#web`}>
                  {getStatusIcon(project.webStatus)}
                  {project.webStatus === 'failed' && (
                    <Badge bg="danger" className="ms-2">Failed</Badge>
                  )}
                </a>
              </td>
              <td>
                <a href={`#/projects/${project.name}#pure`}>
                  {getStatusIcon(project.pureStatus)}
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
