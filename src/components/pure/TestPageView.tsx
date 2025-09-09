/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../../App";
import {
  RuntimeName,
  STANDARD_LOGS,
  RUNTIME_SPECIFIC_LOGS,
} from "../../utils/logFiles";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { Editor } from "@monaco-editor/react";
import { NavBar } from "./NavBar";
import { FileTreeItem } from "./FileTreeItem";
import { FileTree } from "./FileTree";
import { ToastNotification } from "./ToastNotification";
import { getLanguage, renderTestResults } from "./TestPageView_utils";
import { MagicRobotModal } from "./MagicRobotModal";

type TestPageViewProps = {
  projectName: string;
  testName: string;
  decodedTestPath: string;
  runtime: string;
  logs: Record<string, string>;
  testsExist: boolean;
  errorCounts: {
    runTimeErrors: number;
    typeErrors: number;
    staticErrors: number;
  };
  isWebSocketConnected: boolean;
};

export const TestPageView = ({
  projectName,
  testName,
  decodedTestPath,
  runtime,
  testsExist,
  errorCounts,
  logs,
  isWebSocketConnected,
}: TestPageViewProps) => {
  const navigate = useNavigate();
  const [showAiderModal, setShowAiderModal] = useState(false);
  const [messageOption, setMessageOption] = useState<"default" | "custom">(
    "default"
  );
  const [customMessage, setCustomMessage] = useState(
    typeof logs["message.txt"] === "string"
      ? logs["message.txt"]
      : "make a script that prints hello"
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );
  const [expandedSections, setExpandedSections] = useState({
    standardLogs: true,
    runtimeLogs: true,
    sourceFiles: true,
    buildErrors: true,
  });
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

  // Extract build errors and warnings relevant to this test
  const [buildErrors, setBuildErrors] = useState<{
    errors: any[];
    warnings: any[];
  }>({ errors: [], warnings: [] });

  useEffect(() => {
    const metafile = logs.build_logs?.metafile;
    if (!metafile) {
      setBuildErrors({ errors: [], warnings: [] });
      return;
    }
    const sourceFilesSet = new Set<string>();
    // Collect all input files from metafile outputs related to this test
    Object.entries(metafile.outputs || {}).forEach(([outputPath, output]) => {
      // Normalize paths for comparison
      const normalizedTestName = testName.replace(/\\/g, "/");
      const normalizedEntryPoint = output.entryPoint
        ? output.entryPoint.replace(/\\/g, "/")
        : "";
      if (normalizedEntryPoint.includes(normalizedTestName)) {
        Object.keys(output.inputs || {}).forEach((inputPath) => {
          sourceFilesSet.add(inputPath.replace(/\\/g, "/"));
        });
      }
    });

    // Filter errors and warnings to those originating from source files of this test
    const filteredErrors = (logs.build_logs?.errors || []).filter(
      (err: any) => {
        if (!err.location || !err.location.file) return false;
        return sourceFilesSet.has(err.location.file.replace(/\\/g, "/"));
      }
    );
    const filteredWarnings = (logs.build_logs?.warnings || []).filter(
      (warn: any) => {
        if (!warn.location || !warn.location.file) return false;
        return sourceFilesSet.has(warn.location.file.replace(/\\/g, "/"));
      }
    );

    setBuildErrors({ errors: filteredErrors, warnings: filteredWarnings });
  }, [logs, testName]);

  // Update customMessage when logs change
  useEffect(() => {
    if (typeof logs["message.txt"] === "string" && logs["message.txt"].trim()) {
      setCustomMessage(logs["message.txt"]);
    }
  }, [logs]);

  // Use the centralized WebSocket from App context
  const wsContext = useWebSocket();
  const ws = wsContext?.ws;
  const [activeTab, setActiveTab] = React.useState("tests.json");
  const [selectedFile, setSelectedFile] = useState<{
    path: string;
    content: string;
    language?: string;
  } | null>(null);
  const [selectedSourcePath, setSelectedSourcePath] = useState<string | null>(
    null
  );
  const [editorTheme, setEditorTheme] = useState<"light" | "vs-dark">(
    "vs-dark"
  );

  return (
    <Container fluid className="px-0">
      <NavBar
        title={decodedTestPath}
        backLink={`/projects/${projectName}`}
        navItems={[
          {
            label: "",
            badge: {
              variant:
                runtime === "node"
                  ? "primary"
                  : runtime === "web"
                    ? "success"
                    : runtime === "golang"
                      ? "warning"
                      : "info",
              text: runtime,
            },
            className: "pe-none d-flex align-items-center gap-2",
          },
        ]}
        rightContent={
          <Button
            variant="info"
            onClick={() => setShowAiderModal(true)}
            className="ms-2 position-relative"
            title={
              isWebSocketConnected
                ? "AI Assistant"
                : "AI Assistant (WebSocket not connected)"
            }
            disabled={!isWebSocketConnected}
          >
            🤖
            {!isWebSocketConnected && (
              <span
                className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                title="WebSocket disconnected"
              >
                <span className="visually-hidden">WebSocket disconnected</span>
              </span>
            )}
          </Button>
        }
      />

      <MagicRobotModal
        customMessage={customMessage}
        isWebSocketConnected={isWebSocketConnected}
        messageOption={messageOption}
        navigate={navigate}
        projectName={projectName}
        runtime={runtime}
        setCustomMessage={setCustomMessage}
        setMessageOption={setMessageOption}
        setShowAiderModal={setShowAiderModal}
        setShowToast={setShowToast}
        setToastMessage={setToastMessage}
        setToastVariant={setToastVariant}
        showAiderModal={showAiderModal}
        testName={testName}
        ws={ws}
      />

      <Row className="g-0">
        <Col
          sm={3}
          className="border-end"
          style={{
            height: "calc(100vh - 56px)",
            overflow: "auto",
            backgroundColor: "#f8f9fa",
          }}
        >
          {/* File Tree Header */}
          <div className="p-2 border-bottom">
            <small className="fw-bold text-muted">EXPLORER</small>
          </div>

          {/* Standard Logs Section */}
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

          {/* Runtime Logs Section */}
          {runtime &&
            RUNTIME_SPECIFIC_LOGS[runtime as RuntimeName] &&
            Object.values(RUNTIME_SPECIFIC_LOGS[runtime as RuntimeName])
              .length > 0 && (
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
        </Col>
        <Col
          sm={6}
          className="border-end p-0"
          style={{ height: "calc(100vh - 56px)", overflow: "hidden" }}
        >
          <Editor
            height="100%"
            path={selectedFile?.path || "empty"}
            defaultLanguage={selectedFile?.language || "plaintext"}
            value={
              selectedFile?.content || "// Select a file to view its contents"
            }
            theme={editorTheme}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              automaticLayout: true,
              readOnly: !selectedFile?.path.includes("source_files"),
            }}
          />
        </Col>
        <Col
          sm={3}
          className="p-0 border-start"
          style={{ height: "calc(100vh - 56px)", overflow: "auto" }}
        >
          <div className="p-3">
            {selectedFile?.path.endsWith("tests.json") && (
              <div className="test-results-preview">
                {typeof selectedFile.content === "string"
                  ? renderTestResults(
                    JSON.parse(selectedFile.content),
                    buildErrors,
                    projectName,
                    testName,
                    runtime
                  )
                  : renderTestResults(
                    selectedFile.content,
                    buildErrors,
                    projectName,
                    testName,
                    runtime
                  )}
              </div>
            )}
            {selectedFile?.path.match(/\.(png|jpg|jpeg|gif|svg)$/i) && (
              <div className="text-center">
                <img
                  src={selectedFile.content}
                  alt={selectedFile.path}
                  className="img-fluid"
                  style={{ maxHeight: "300px" }}
                />
                <div className="mt-2">
                  <a
                    href={selectedFile.content}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary"
                  >
                    Open Full Size
                  </a>
                </div>
              </div>
            )}
            {selectedFile?.path.endsWith("build.json") && (
              <div>
                <h5>Build Information</h5>
                {(() => {
                  try {
                    const buildData = JSON.parse(selectedFile.content);
                    return (
                      <>
                        {buildData.errors?.length > 0 && (
                          <div className="mb-3">
                            <h6 className="text-danger">
                              Errors ({buildData.errors.length})
                            </h6>
                            <ul className="list-unstyled">
                              {buildData.errors.map(
                                (error: any, index: number) => (
                                  <li key={index} className="mb-2 p-2  rounded">
                                    <div className="text-danger fw-bold">
                                      {error.text}
                                    </div>
                                    {error.location && (
                                      <div className="small text-muted">
                                        File: {error.location.file}
                                        Line: {error.location.line}
                                        Column: {error.location.column}
                                      </div>
                                    )}
                                    {error.notes && error.notes.length > 0 && (
                                      <div className="small">
                                        Notes:
                                        <ul>
                                          {error.notes.map(
                                            (note: any, noteIndex: number) => (
                                              <li key={noteIndex}>
                                                {note.text}
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </div>
                                    )}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                        {buildData.warnings?.length > 0 && (
                          <div className="mb-3">
                            <h6 className="text-warning">
                              Warnings ({buildData.warnings.length})
                            </h6>
                            <ul className="list-unstyled">
                              {buildData.warnings.map(
                                (warning: any, index: number) => (
                                  <li key={index} className="mb-2 p-2  rounded">
                                    <div className="text-warning fw-bold">
                                      {warning.text}
                                    </div>
                                    {warning.location && (
                                      <div className="small text-muted">
                                        File: {warning.location.file}
                                        Line: {warning.location.line}
                                        Column: {warning.location.column}
                                      </div>
                                    )}
                                    {warning.notes &&
                                      warning.notes.length > 0 && (
                                        <div className="small">
                                          Notes:
                                          <ul>
                                            {warning.notes.map(
                                              (
                                                note: any,
                                                noteIndex: number
                                              ) => (
                                                <li key={noteIndex}>
                                                  {note.text}
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        </div>
                                      )}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                        {(!buildData.errors || buildData.errors.length === 0) &&
                          (!buildData.warnings ||
                            buildData.warnings.length === 0) && (
                            <div className="alert alert-success">
                              No build errors or warnings
                            </div>
                          )}
                      </>
                    );
                  } catch (e) {
                    return (
                      <div className="alert alert-danger">
                        Error parsing build.json: {e.message}
                      </div>
                    );
                  }
                })()}
              </div>
            )}
            {selectedFile?.path.endsWith(".json") &&
              !selectedFile.path.endsWith("tests.json") &&
              !selectedFile.path.endsWith("build.json") && (
                <pre className=" p-2 small">
                  <code>{selectedFile.content}</code>
                </pre>
              )}
            {selectedFile?.path.includes("source_files") && (
              <div>
                <div className="mb-2 small text-muted">
                  <i className="bi bi-file-earmark-text me-1"></i>
                  {selectedFile.path.split("/").pop()}
                </div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="mb-2"
                  onClick={() => {
                    // TODO: Add save functionality
                    alert("Save functionality will be implemented here");
                  }}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </Col>
      </Row>

      <ToastNotification
        showToast={showToast}
        setShowToast={setShowToast}
        toastVariant={toastVariant}
        toastMessage={toastMessage}
      />
    </Container>
  );
};
