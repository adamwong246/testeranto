import React, { useState } from "react";
import { ProjectsTree } from "./ProjectsTree";

export const TestPageLeftContent = ({
  projects,
  setExpandedSections,
  expandedSections,
  logs,
  setActiveTab,
  setSelectedFile,
  runtime,
  selectedSourcePath,
  activeTab,
  setSelectedSourcePath,
  projectName,
  testName,
}) => {
  const [syncEnabled, setSyncEnabled] = useState(false);

  return (
    <div className="p-2">
      <div className="d-flex align-items-center mb-2">
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            checked={syncEnabled}
            onChange={(e) => setSyncEnabled(e.target.checked)}
            id="fileSyncToggle"
            disabled
          />
          <label className="form-check-label small" htmlFor="fileSyncToggle">
            Live File Sync (Unavailable)
          </label>
        </div>
      </div>

      <ProjectsTree
        projects={projects}
        currentProjectName={projectName}
        currentTestName={testName}
        setExpandedSections={setExpandedSections}
        expandedSections={expandedSections}
        logs={logs}
        setActiveTab={setActiveTab}
        setSelectedFile={setSelectedFile}
        runtime={runtime}
        selectedSourcePath={selectedSourcePath}
        activeTab={activeTab}
        setSelectedSourcePath={setSelectedSourcePath}
      />
    </div>
  );
};
