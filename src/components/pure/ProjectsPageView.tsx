import React from "react";
import { Table, Alert } from "react-bootstrap";

type Project = {
  name: string;
  nodeStatus: string;
  webStatus: string;
  pureStatus: string;
};

type TestSummary = {
  [testName: string]: {
    testsExist?: boolean;
    runTimeErrors?: number;
    typeErrors?: number;
    staticErrors?: number;
  };
};

type ProjectConfig = {
  [projectName: string]: {
    tests: [string, string][]; // [testName, runtime]
  };
};

type ProjectsPageViewProps = {
  projects: Project[];
  summaries: TestSummary;
  configs: ProjectConfig;
  loading: boolean;
  error: string | null;
  navigate: (path: string) => void;
};

export const ProjectsPageView = ({
  projects,
  summaries,
  configs,
  loading,
  error,
  navigate,
}: ProjectsPageViewProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return "✅";
      case "failed":
        return "❌";
      case "warning":
        return "⚠️";
      default:
        return "❓";
    }
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <Alert variant="danger">Error: {error}</Alert>;

  return (
    <div className="">
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
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/projects/${project.name}`);
                  }}
                >
                  {project.name}
                </a>
              </td>
              <td>
                <div>
                  {summaries[project.name] ? (
                    Object.keys(summaries[project.name]).map((testName) => {
                      const testData = summaries[project.name][testName];
                      const runTime =
                        configs[project.name]?.tests?.find(
                          (t) => t[0] === testName
                        )?.[1] || "node";
                      const hasRuntimeErrors = testData.runTimeErrors > 0;
                      const hasStaticErrors =
                        testData.typeErrors > 0 || testData.staticErrors > 0;

                      return (
                        <div key={testName}>
                          <a
                            href={`#/projects/${project.name
                              }/tests/${encodeURIComponent(testName)}/${runTime}`}
                          >
                            {hasRuntimeErrors
                              ? "❌ "
                              : hasStaticErrors
                                ? "⚠️ "
                                : ""}
                            {testName.split("/").pop() || testName}
                          </a>
                        </div>
                      );
                    })
                  ) : (
                    <div>Loading tests...</div>
                  )}
                </div>
              </td>
              <td>
                <a href={`#/projects/${project.name}#node`}>
                  {getStatusIcon(project.nodeStatus)} Node build logs
                </a>
              </td>
              <td>
                <a href={`#/projects/${project.name}#web`}>
                  {getStatusIcon(project.webStatus)} Web build logs
                </a>
              </td>
              <td>
                <a href={`#/projects/${project.name}#pure`}>
                  {getStatusIcon(project.pureStatus)} Pure build logs
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
