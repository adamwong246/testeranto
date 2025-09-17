import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileTreeItem } from "../../components/pure/FileTreeItem";
import {
  STANDARD_LOGS,
  RUNTIME_SPECIFIC_LOGS,
  RuntimeName,
} from "../../utils/logFiles";
import { FileTree } from "../../components/pure/FileTree";
import { getLanguage } from "./TestPageView_utils";

interface ProjectsTreeProps {
  projects: string[];
  currentProjectName: string;
  currentTestName: string;
  // Add all props needed to render the original content
  setExpandedSections: any;
  expandedSections: any;
  logs: any;
  setActiveTab: any;
  setSelectedFile: any;
  runtime: any;
  selectedSourcePath: any;
  activeTab: any;
  setSelectedSourcePath: any;
}

export const ProjectsTree: React.FC<ProjectsTreeProps> = ({
  projects,
  currentProjectName,
  currentTestName,
  setExpandedSections,
  expandedSections,
  logs,
  setActiveTab,
  setSelectedFile,
  runtime,
  selectedSourcePath,
  activeTab,
  setSelectedSourcePath,
}) => {
  const navigate = useNavigate();
  // Always expand the first project by default
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (projects && projects.length > 0) {
      initial[projects[0]] = true;
    }
    return initial;
  });
  const [projectTests, setProjectTests] = useState<Record<string, string[]>>({});
  const [loadingProjects, setLoadingProjects] = useState<Record<string, boolean>>({});

  const toggleProject = async (projectName: string) => {
    // Toggle expansion state
    const isExpanding = !expandedProjects[projectName];
    setExpandedProjects(prev => ({
      ...prev,
      [projectName]: isExpanding
    }));

    // If expanding and we haven't loaded tests yet, fetch them
    if (isExpanding && !projectTests[projectName]) {
      setLoadingProjects(prev => ({ ...prev, [projectName]: true }));
      try {
        const response = await fetch(`/projects/${projectName}/tests.json`);
        if (response.ok) {
          const tests = await response.json();
          setProjectTests(prev => ({
            ...prev,
            [projectName]: tests
          }));
        } else {
          console.error(`Failed to fetch tests for ${projectName}`);
          setProjectTests(prev => ({
            ...prev,
            [projectName]: []
          }));
        }
      } catch (error) {
        console.error(`Error fetching tests for ${projectName}:`, error);
        setProjectTests(prev => ({
          ...prev,
          [projectName]: []
        }));
      } finally {
        setLoadingProjects(prev => ({ ...prev, [projectName]: false }));
      }
    }
  };

  return (
    <div>
      {/* Always show the Projects header */}
      <div className="d-flex align-items-center text-muted mb-1"
           style={{ fontSize: "0.875rem", fontWeight: "bold" }}>
        <i className="bi bi-folder me-1"></i>
        <span>Projects</span>
      </div>
      
      {/* Show projects list or "No projects available" */}
      {(!projects || projects.length === 0) ? (
        <div className="ms-3 text-muted">No projects available</div>
      ) : (
        <div>
          {projects.map((project, index) => (
            <div key={project}>
              <FileTreeItem
                name={project}
                isFile={false}
                level={1}  // Indent projects under the Projects header
                isSelected={false}
                exists={true}
                isExpanded={expandedProjects[project]}
                onClick={() => toggleProject(project)}
              />
              {expandedProjects[project] && (
                <div className="ms-4">  // Increased indentation for tests
                  {loadingProjects[project] ? (
                    <div className="text-muted small">Loading tests...</div>
                  ) : (
                    <>
                      {/* For the first project, always show Standard Logs, Runtime Logs, and Source Files */}
                      {index === 0 && (
                        <>
                          {/* Standard Logs Section */}
                          <div>
                            <FileTreeItem
                              name="Standard Logs"
                              isFile={false}
                              level={2}
                              isSelected={false}
                              exists={true}
                              isExpanded={expandedSections.standardLogs}
                              onClick={() =>
                                setExpandedSections((prev: any) => ({
                                  ...prev,
                                  standardLogs: !prev.standardLogs,
                                }))
                              }
                            />
                            {expandedSections.standardLogs && (
                              <div className="ms-4">
                                {Object.values(STANDARD_LOGS).map((logName) => {
                                  const logContent = logs ? logs[logName] : undefined;
                                  const exists =
                                    logContent !== undefined &&
                                    ((typeof logContent === "string" && logContent.trim() !== "") ||
                                      (typeof logContent === "object" &&
                                        logContent !== null &&
                                        Object.keys(logContent).length > 0));

                                  return (
                                    <FileTreeItem
                                      key={logName}
                                      name={logName}
                                      isFile={true}
                                      level={3}
                                      isSelected={activeTab === logName}
                                      exists={exists}
                                      onClick={() => {
                                        if (exists) {
                                          setActiveTab(logName);
                                          setSelectedFile({
                                            path: logName,
                                            content:
                                              typeof logContent === "string"
                                                ? logContent
                                                : JSON.stringify(logContent, null, 2),
                                            language: logName.endsWith(".json")
                                              ? "json"
                                              : "plaintext",
                                          });
                                        } else {
                                          setActiveTab(logName);
                                          setSelectedFile({
                                            path: logName,
                                            content: `// ${logName} not found or empty\nThis file was not generated during the test run.`,
                                            language: "plaintext",
                                          });
                                        }
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Runtime Logs Section */}
                          {runtime &&
                            RUNTIME_SPECIFIC_LOGS[runtime as RuntimeName] &&
                            Object.values(RUNTIME_SPECIFIC_LOGS[runtime as RuntimeName]).length > 0 && (
                              <div>
                                <FileTreeItem
                                  name="Runtime Logs"
                                  isFile={false}
                                  level={2}
                                  isSelected={false}
                                  exists={true}
                                  isExpanded={expandedSections.runtimeLogs}
                                  onClick={() =>
                                    setExpandedSections((prev: any) => ({
                                      ...prev,
                                      runtimeLogs: !prev.runtimeLogs,
                                    }))
                                  }
                                />
                                {expandedSections.runtimeLogs && (
                                  <div className="ms-4">
                                    {Object.values(
                                      RUNTIME_SPECIFIC_LOGS[runtime as RuntimeName]
                                    ).map((logName) => {
                                      const logContent = logs ? logs[logName] : undefined;
                                      const exists =
                                        logContent !== undefined &&
                                        ((typeof logContent === "string" &&
                                          logContent.trim() !== "") ||
                                          (typeof logContent === "object" &&
                                            logContent !== null &&
                                            Object.keys(logContent).length > 0));

                                      return (
                                        <FileTreeItem
                                          key={logName}
                                          name={logName}
                                          isFile={true}
                                          level={3}
                                          isSelected={activeTab === logName}
                                          exists={exists}
                                          onClick={() => {
                                            if (exists) {
                                              setActiveTab(logName);
                                              setSelectedFile({
                                                path: logName,
                                                content:
                                                  typeof logContent === "string"
                                                    ? logContent
                                                    : JSON.stringify(logContent, null, 2),
                                                language: logName.endsWith(".json")
                                                  ? "json"
                                                  : "plaintext",
                                              });
                                            } else {
                                              setActiveTab(logName);
                                              setSelectedFile({
                                                path: logName,
                                                content: `// ${logName} not found or empty\nThis file was not generated during the test run.`,
                                                language: "plaintext",
                                              });
                                            }
                                          }}
                                        />
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}

                          {/* Source Files Section */}
                          {logs && logs.source_files && (
                            <div>
                              <FileTreeItem
                                name="Source Files"
                                isFile={false}
                                level={2}
                                isSelected={false}
                                exists={true}
                                isExpanded={expandedSections.sourceFiles}
                                onClick={() =>
                                  setExpandedSections((prev: any) => ({
                                    ...prev,
                                    sourceFiles: !prev.sourceFiles,
                                  }))
                                }
                              />
                              {expandedSections.sourceFiles && (
                                <div className="ms-4">
                                  <FileTree
                                    data={logs.source_files}
                                    onSelect={(path, content) => {
                                      setActiveTab("source_file");
                                      setSelectedSourcePath(path);
                                      setSelectedFile({
                                        path,
                                        content,
                                        language: getLanguage(path),
                                      });
                                    }}
                                    level={3}
                                    selectedSourcePath={selectedSourcePath}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                      {/* Show actual tests */}
                      {(projectTests[project] || []).map(test => (
                        <FileTreeItem
                          key={`${project}-${test}`}
                          name={test}
                          isFile={true}
                          level={2}  // Tests are at level 2
                          isSelected={currentProjectName === project && currentTestName === test}
                          exists={true}
                          onClick={() => {
                            // Navigate to the test page
                            navigate(`/projects/${project}/tests/${encodeURIComponent(test)}`);
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
