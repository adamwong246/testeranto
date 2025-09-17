import React from "react";
import {
  STANDARD_LOGS,
  RUNTIME_SPECIFIC_LOGS,
  RuntimeName,
} from "../../utils/logFiles";
import { FileTree } from "./FileTree";
import { FileTreeItem } from "./FileTreeItem";
import { getLanguage } from "./TestPageView_utils";

export const TestPageLeftContent = ({
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
  return (
    <>
      <div className="p-2">
        <div
          className="d-flex align-items-center text-muted mb-1"
          style={{ cursor: "pointer", fontSize: "0.875rem" }}
          onClick={() =>
            setExpandedSections((prev) => ({
              ...prev,
              standardLogs: !prev.standardLogs,
            }))
          }
        >
          <i
            className={`bi bi-chevron-${expandedSections.standardLogs ? "down" : "right"
              } me-1`}
          ></i>
          <span>Standard Logs</span>
        </div>
        {expandedSections.standardLogs && (
          <div>
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
                  level={1}
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
        Object.values(RUNTIME_SPECIFIC_LOGS[runtime as RuntimeName]).length >
        0 && (
          <div className="p-2">
            <div
              className="d-flex align-items-center text-muted mb-1"
              style={{ cursor: "pointer", fontSize: "0.875rem" }}
              onClick={() =>
                setExpandedSections((prev) => ({
                  ...prev,
                  runtimeLogs: !prev.runtimeLogs,
                }))
              }
            >
              <i
                className={`bi bi-chevron-${expandedSections.runtimeLogs ? "down" : "right"
                  } me-1`}
              ></i>
              <span>Runtime Logs</span>
            </div>
            {expandedSections.runtimeLogs && (
              <div>
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
                      level={1}
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
        <div className="p-2">
          <div
            className="d-flex align-items-center text-muted mb-1"
            style={{ cursor: "pointer", fontSize: "0.875rem" }}
            onClick={() =>
              setExpandedSections((prev) => ({
                ...prev,
                sourceFiles: !prev.sourceFiles,
              }))
            }
          >
            <i
              className={`bi bi-chevron-${expandedSections.sourceFiles ? "down" : "right"
                } me-1`}
            ></i>
            <span>Source Files</span>
          </div>
          {expandedSections.sourceFiles && (
            <div>
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
                level={1}
                selectedSourcePath={selectedSourcePath}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};
