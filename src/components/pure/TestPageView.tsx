/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { ReactElement, useState, useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from '../../App';
import {
  RuntimeName,
  STANDARD_LOGS,
  RUNTIME_SPECIFIC_LOGS
} from "../../utils/logFiles";
import { Container, Row, Col, Nav, Button, Modal } from "react-bootstrap";
import { Editor } from "@monaco-editor/react";
import { NavBar } from "./NavBar";
import { TestStatusBadge } from "../TestStatusBadge";

type TestData = {
  name: string;
  givens: {
    name: string;
    whens: {
      name: string;
      error?: string;
      features?: string[];
      artifacts?: string[];
    }[];
    thens: {
      name: string;
      error?: string;
      features?: string[];
      artifacts?: string[];
    }[];
    features?: string[];
    artifacts?: string[];
  }[];
};

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
};

const FileTree = ({ data, onSelect, level = 0, selectedSourcePath }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <div>
      {Object.entries(data).map(([name, node]) => {
        const path = Object.keys(expanded).find((k) => k.endsWith(name)) || name;
        const isExpanded = expanded[path];

        if (node.__isFile) {
          return (
            <FileTreeItem
              key={name}
              name={name}
              isFile={true}
              level={level}
              isSelected={selectedSourcePath === path}
              onClick={() => onSelect(path, node.content)}
            />
          );
        } else {
          return (
            <div key={name}>
              <div
                className="d-flex align-items-center py-1 text-dark"
                style={{
                  paddingLeft: `${level * 16}px`,
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
                onClick={() => toggleExpand(path)}
              >
                <i className={`bi ${isExpanded ? 'bi-folder2-open' : 'bi-folder'} me-1`}></i>
                <span>{name}</span>
              </div>
              {isExpanded && (
                <FileTree
                  data={node}
                  onSelect={onSelect}
                  level={level + 1}
                  selectedSourcePath={selectedSourcePath}
                />
              )}
            </div>
          );
        }
      })}
    </div>
  );
};

export const TestPageView = ({
  projectName,
  testName,
  decodedTestPath,
  runtime,
  testsExist,
  errorCounts,
  logs,
}: TestPageViewProps) => {
  const navigate = useNavigate();
  const [showAiderModal, setShowAiderModal] = useState(false);
  const [messageOption, setMessageOption] = useState<'default' | 'custom'>('default');
  const [customMessage, setCustomMessage] = useState(
    typeof logs['message.txt'] === 'string' ? logs['message.txt'] : 'make a script that prints hello'
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'danger'>('success');
  const [expandedSections, setExpandedSections] = useState({
    standardLogs: true,
    runtimeLogs: true,
    sourceFiles: true,
    buildErrors: true,
  });
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

  // Extract build errors and warnings relevant to this test
  const [buildErrors, setBuildErrors] = useState<{ errors: any[]; warnings: any[] }>({ errors: [], warnings: [] });

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
      const normalizedTestName = testName.replace(/\\/g, '/');
      const normalizedEntryPoint = output.entryPoint ? output.entryPoint.replace(/\\/g, '/') : '';
      if (normalizedEntryPoint.includes(normalizedTestName)) {
        Object.keys(output.inputs || {}).forEach((inputPath) => {
          sourceFilesSet.add(inputPath.replace(/\\/g, '/'));
        });
      }
    });

    // Filter errors and warnings to those originating from source files of this test
    const filteredErrors = (logs.build_logs?.errors || []).filter((err: any) => {
      if (!err.location || !err.location.file) return false;
      return sourceFilesSet.has(err.location.file.replace(/\\/g, '/'));
    });
    const filteredWarnings = (logs.build_logs?.warnings || []).filter((warn: any) => {
      if (!warn.location || !warn.location.file) return false;
      return sourceFilesSet.has(warn.location.file.replace(/\\/g, '/'));
    });

    setBuildErrors({ errors: filteredErrors, warnings: filteredWarnings });
  }, [logs, testName]);

  // Update customMessage when logs change
  useEffect(() => {
    if (typeof logs['message.txt'] === 'string' && logs['message.txt'].trim()) {
      setCustomMessage(logs['message.txt']);
    }
  }, [logs]);

  // Use the centralized WebSocket from App context
  const ws = useWebSocket();
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

  // Determine language from file extension
  const getLanguage = (path: string) => {
    const ext = path.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "ts":
        return "typescript";
      case "tsx":
        return "typescript";
      case "js":
        return "javascript";
      case "json":
        return "json";
      case "md":
        return "markdown";
      default:
        return "plaintext";
    }
  };

  const renderTestResults = (testData: TestData) => {
    return (
      <div className="test-results">
        {testData.givens.map((given, i) => (
          <div key={i} className="mb-4 card">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4>Given: {given.name}</h4>
                  {given.features && given.features.length > 0 && (
                    <div className="mt-1">
                      <small>Features:</small>
                      <ul className="list-unstyled">
                        {given.features.map((feature, fi) => (
                          <li key={fi}>
                            {feature.startsWith("http") ? (
                              <a
                                href={feature}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white"
                              >
                                {new URL(feature).hostname}
                              </a>
                            ) : (
                              <span className="text-white">{feature}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {given.artifacts && given.artifacts.length > 0 && (
                  <div className="dropdown">
                    <button
                      className="btn btn-sm btn-light dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      Artifacts ({given.artifacts.length})
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      {given.artifacts.map((artifact, ai) => (
                        <li key={ai}>
                          <a
                            className="dropdown-item"
                            href={`reports/${projectName}/${testName
                              .split(".")
                              .slice(0, -1)
                              .join(".")}/${runtime}/${artifact}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {artifact.split("/").pop()}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="card-body">
              {given.whens.map((when, j) => (
                <div
                  key={`w-${j}`}
                  className={`p-3 mb-2 ${when.error
                    ? "bg-danger text-white"
                    : "bg-success text-white"
                    }`}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div>
                        <strong>When:</strong> {when.name}
                        {when.features && when.features.length > 0 && (
                          <div className="mt-2">
                            <small>Features:</small>
                            <ul className="list-unstyled">
                              {when.features.map((feature, fi) => (
                                <li key={fi}>
                                  {feature.startsWith("http") ? (
                                    <a
                                      href={feature}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {new URL(feature).hostname}
                                    </a>
                                  ) : (
                                    feature
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {when.error && <pre className="mt-2">{when.error}</pre>}
                      </div>
                    </div>
                    {when.artifacts && when.artifacts.length > 0 && (
                      <div className="ms-3">
                        <strong>Artifacts:</strong>
                        <ul className="list-unstyled">
                          {when.artifacts.map((artifact, ai) => (
                            <li key={ai}>
                              <a
                                href={`reports/${projectName}/${testName
                                  .split(".")
                                  .slice(0, -1)
                                  .join(".")}/${runtime}/${artifact}`}
                                target="_blank"
                                className="text-white"
                                rel="noopener noreferrer"
                              >
                                {artifact.split("/").pop()}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {given.thens.map((then, k) => (
                <div
                  key={`t-${k}`}
                  className={`p-3 mb-2 ${then.error
                    ? "bg-danger text-white"
                    : "bg-success text-white"
                    }`}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div>
                        <strong>Then:</strong> {then.name}
                        {then.features && then.features.length > 0 && (
                          <div className="mt-2">
                            <small>Features:</small>
                            <ul className="list-unstyled">
                              {then.features.map((feature, fi) => (
                                <li key={fi}>
                                  {feature.startsWith("http") ? (
                                    <a
                                      href={feature}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {new URL(feature).hostname}
                                    </a>
                                  ) : (
                                    feature
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {then.error && <pre className="mt-2">{then.error}</pre>}
                      </div>
                    </div>
                    {then.artifacts && then.artifacts.length > 0 && (
                      <div className="ms-3">
                        <strong>Artifacts:</strong>
                        <ul className="list-unstyled">
                          {then.artifacts.map((artifact, ai) => (
                            <li key={ai}>
                              <a
                                href={`reports/${projectName}/${testName
                                  .split(".")
                                  .slice(0, -1)
                                  .join(".")}/${runtime}/${artifact}`}
                                target="_blank"
                                className="text-white"
                                rel="noopener noreferrer"
                              >
                                {artifact.split("/").pop()}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {/* Render build errors and warnings */}
        {(buildErrors.errors.length > 0 || buildErrors.warnings.length > 0) && (
          <div className="mb-4 card border-danger">
            <div className="card-header bg-danger text-white">
              <h4>Build Errors and Warnings</h4>
            </div>
            <div className="card-body">
              {buildErrors.errors.length > 0 && (
                <>
                  <h5>Errors</h5>
                  <ul>
                    {buildErrors.errors.map((error, idx) => (
                      <li key={`build-error-${idx}`}>
                        <strong>{error.text}</strong>
                        {error.location && (
                          <div>
                            File: {error.location.file} Line: {error.location.line} Column: {error.location.column}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {buildErrors.warnings.length > 0 && (
                <>
                  <h5>Warnings</h5>
                  <ul>
                    {buildErrors.warnings.map((warning, idx) => (
                      <li key={`build-warning-${idx}`}>
                        <strong>{warning.text}</strong>
                        {warning.location && (
                          <div>
                            File: {warning.location.file} Line: {warning.location.line} Column: {warning.location.column}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  console.log("Rendering TestPageView with logs:", {
    logKeys: Object.keys(logs),
    sourceFiles: logs.source_files ? Object.keys(logs.source_files) : null,
    selectedFile,
    activeTab,
  });

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
            className="ms-2"
            title="AI Assistant"
          >
            🤖
          </Button>
        }
      />

      <Modal show={showAiderModal} onHide={() => setShowAiderModal(false)} size="lg" onShow={() => setMessageOption('default')}>
        <Modal.Header closeButton>
          <Modal.Title>Aider</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <div className="mb-3">

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="messageOption"
                id="defaultMessage"
                value="default"
                checked={messageOption === 'default'}
                onChange={() => setMessageOption('default')}
              />
              <label className="form-check-label" htmlFor="defaultMessage">
                Use default message.txt
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="messageOption"
                id="customMessage"
                value="custom"
                checked={messageOption === 'custom'}
                onChange={() => setMessageOption('custom')}
              />
              <label className="form-check-label" htmlFor="customMessage">
                Use custom message
              </label>
            </div>
            {messageOption === 'custom' && (
              <div className="mt-2">
                <textarea
                  className="form-control"
                  rows={8}
                  placeholder="Enter your custom message"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  style={{ minHeight: '500px' }}
                />
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button
                  variant="secondary"
                  onClick={() => setShowAiderModal(false)}
                >
                  Close
                </Button> */}
          <Button
            variant="primary"
            onClick={async () => {
              try {
                const promptPath = `testeranto/reports/${projectName}/${testName
                  .split(".")
                  .slice(0, -1)
                  .join(".")}/${runtime}/prompt.txt`;

                let command = `aider --load ${promptPath}`;

                if (messageOption === 'default') {
                  const messagePath = `testeranto/reports/${projectName}/${testName
                    .split(".")
                    .slice(0, -1)
                    .join(".")}/${runtime}/message.txt`;
                  command += ` --message-file ${messagePath}`;
                } else {
                  command += ` --message "${customMessage}"`;
                }

                // Send command to server via the centralized WebSocket
                if (ws && ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify({
                    type: 'executeCommand',
                    command: command
                  }));
                  setToastMessage('Command sent to server');
                  setToastVariant('success');
                  setShowToast(true);
                  setShowAiderModal(false);

                  // Navigate to process manager page
                  setTimeout(() => {
                    navigate('/processes');
                  }, 1000);
                } else {
                  setToastMessage('WebSocket connection not ready');
                  setToastVariant('danger');
                  setShowToast(true);
                }
              } catch (err) {
                console.error("WebSocket error:", err);
                setToastMessage('Error preparing command');
                setToastVariant('danger');
                setShowToast(true);
              }
            }}
          >
            Run Aider Command
          </Button>
        </Modal.Footer>
      </Modal>

      <Row className="g-0">
        <Col sm={3} className="border-end" style={{
          height: "calc(100vh - 56px)",
          overflow: "auto",
          backgroundColor: '#f8f9fa'
        }}>
          {/* File Tree Header */}
          <div className="p-2 border-bottom">
            <small className="fw-bold text-muted">EXPLORER</small>
          </div>

          {/* Standard Logs Section */}
          <div className="p-2">
            <div
              className="d-flex align-items-center text-muted mb-1"
              style={{ cursor: 'pointer', fontSize: '0.875rem' }}
              onClick={() => setExpandedSections(prev => ({ ...prev, standardLogs: !prev.standardLogs }))}
            >
              <i className={`bi bi-chevron-${expandedSections.standardLogs ? 'down' : 'right'} me-1`}></i>
              <span>Standard Logs</span>
            </div>
            {expandedSections.standardLogs && (
              <div>
                {Object.values(STANDARD_LOGS).map((logName) => {
                  const logContent = logs ? logs[logName] : undefined;
                  const exists = logContent !== undefined &&
                    ((typeof logContent === "string" && logContent.trim() !== "") ||
                      (typeof logContent === "object" && logContent !== null && Object.keys(logContent).length > 0));

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
                            content: typeof logContent === "string" ? logContent : JSON.stringify(logContent, null, 2),
                            language: logName.endsWith(".json") ? "json" : "plaintext",
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
          {runtime && RUNTIME_SPECIFIC_LOGS[runtime as RuntimeName] &&
            Object.values(RUNTIME_SPECIFIC_LOGS[runtime as RuntimeName]).length > 0 && (
              <div className="p-2">
                <div
                  className="d-flex align-items-center text-muted mb-1"
                  style={{ cursor: 'pointer', fontSize: '0.875rem' }}
                  onClick={() => setExpandedSections(prev => ({ ...prev, runtimeLogs: !prev.runtimeLogs }))}
                >
                  <i className={`bi bi-chevron-${expandedSections.runtimeLogs ? 'down' : 'right'} me-1`}></i>
                  <span>Runtime Logs</span>
                </div>
                {expandedSections.runtimeLogs && (
                  <div>
                    {Object.values(RUNTIME_SPECIFIC_LOGS[runtime as RuntimeName]).map((logName) => {
                      const logContent = logs ? logs[logName] : undefined;
                      const exists = logContent !== undefined &&
                        ((typeof logContent === "string" && logContent.trim() !== "") ||
                          (typeof logContent === "object" && logContent !== null && Object.keys(logContent).length > 0));

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
                                content: typeof logContent === "string" ? logContent : JSON.stringify(logContent, null, 2),
                                language: logName.endsWith(".json") ? "json" : "plaintext",
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
                style={{ cursor: 'pointer', fontSize: '0.875rem' }}
                onClick={() => setExpandedSections(prev => ({ ...prev, sourceFiles: !prev.sourceFiles }))}
              >
                <i className={`bi bi-chevron-${expandedSections.sourceFiles ? 'down' : 'right'} me-1`}></i>
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
        <Col sm={3} className="p-0 border-start" style={{ height: "calc(100vh - 56px)", overflow: "auto" }}>
          <div className="p-3">
            {selectedFile?.path.endsWith("tests.json") && (
              <div className="test-results-preview">
                {typeof selectedFile.content === "string"
                  ? renderTestResults(JSON.parse(selectedFile.content))
                  : renderTestResults(selectedFile.content)
                }
              </div>
            )}
            {selectedFile?.path.match(/\.(png|jpg|jpeg|gif|svg)$/i) && (
              <div className="text-center">
                <img
                  src={selectedFile.content}
                  alt={selectedFile.path}
                  className="img-fluid"
                  style={{ maxHeight: '300px' }}
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
                            <h6 className="text-danger">Errors ({buildData.errors.length})</h6>
                            <ul className="list-unstyled">
                              {buildData.errors.map((error: any, index: number) => (
                                <li key={index} className="mb-2 p-2 bg-light rounded">
                                  <div className="text-danger fw-bold">{error.text}</div>
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
                                        {error.notes.map((note: any, noteIndex: number) => (
                                          <li key={noteIndex}>{note.text}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {buildData.warnings?.length > 0 && (
                          <div className="mb-3">
                            <h6 className="text-warning">Warnings ({buildData.warnings.length})</h6>
                            <ul className="list-unstyled">
                              {buildData.warnings.map((warning: any, index: number) => (
                                <li key={index} className="mb-2 p-2 bg-light rounded">
                                  <div className="text-warning fw-bold">{warning.text}</div>
                                  {warning.location && (
                                    <div className="small text-muted">
                                      File: {warning.location.file}
                                      Line: {warning.location.line}
                                      Column: {warning.location.column}
                                    </div>
                                  )}
                                  {warning.notes && warning.notes.length > 0 && (
                                    <div className="small">
                                      Notes:
                                      <ul>
                                        {warning.notes.map((note: any, noteIndex: number) => (
                                          <li key={noteIndex}>{note.text}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {(!buildData.errors || buildData.errors.length === 0) &&
                          (!buildData.warnings || buildData.warnings.length === 0) && (
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
                <pre className="bg-light p-2 small">
                  <code>{selectedFile.content}</code>
                </pre>
              )}
            {selectedFile?.path.includes("source_files") && (
              <div>
                <div className="mb-2 small text-muted">
                  <i className="bi bi-file-earmark-text me-1"></i>
                  {selectedFile.path.split('/').pop()}
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

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">Command Status</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

    </Container>
  );
};
// Simple file tree item component
const FileTreeItem = ({
  name,
  isFile,
  level,
  isSelected,
  exists = true,
  onClick
}: {
  name: string;
  isFile: boolean;
  level: number;
  isSelected: boolean;
  exists?: boolean;
  onClick: () => void;
}) => {
  const displayName = name
    .replace(".json", "")
    .replace(".txt", "")
    .replace(".log", "")
    .replace(/_/g, " ")
    .replace(/^std/, "Standard ")
    .replace(/^exit/, "Exit Code")
    .split('/').pop();

  return (
    <div
      className={`d-flex align-items-center py-1 ${isSelected ? 'text-primary fw-bold' : exists ? 'text-dark' : 'text-muted'}`}
      style={{
        paddingLeft: `${level * 16}px`,
        cursor: exists ? 'pointer' : 'not-allowed',
        fontSize: '0.875rem',
        opacity: exists ? 1 : 0.6
      }}
      onClick={exists ? onClick : undefined}
      title={exists ? undefined : "File not found or empty"}
    >
      <i className={`bi ${isFile ? (exists ? 'bi-file-earmark-text' : 'bi-file-earmark') : 'bi-folder'} me-1`}></i>
      <span>{displayName}</span>
      {!exists && (
        <i className="bi bi-question-circle ms-1" title="File not found or empty"></i>
      )}
    </div>
  );
};

const ArtifactTree = ({
  treeData,
  projectName,
  testName,
  runtime,
  onSelect,
  level = 0,
  basePath = ''
}: {
  treeData: Record<string, any>;
  projectName: string;
  testName: string;
  runtime: string;
  onSelect: (path: string) => void;
  level?: number;
  basePath?: string;
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (path: string) => {
    setExpanded(prev => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <ul className="list-unstyled" style={{ paddingLeft: `${level * 16}px` }}>
      {Object.entries(treeData).map(([name, node]) => {
        const fullPath = basePath ? `${basePath}/${name}` : name;
        const isExpanded = expanded[fullPath];

        if (node.__isFile) {
          return (
            <li key={fullPath} className="py-1">
              <a
                href={`reports/${projectName}/${testName
                  .split('.')
                  .slice(0, -1)
                  .join('.')}/${runtime}/${node.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
                onClick={(e) => {
                  e.preventDefault();
                  onSelect(node.path);
                }}
              >
                <i className="bi bi-file-earmark-text me-2"></i>
                {name}
              </a>
            </li>
          );
        } else {
          return (
            <li key={fullPath} className="py-1">
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-link text-start p-0 text-decoration-none me-1"
                  onClick={() => toggleExpand(fullPath)}
                >
                  <i
                    className={`bi ${isExpanded ? 'bi-folder2-open' : 'bi-folder'} me-2`}
                  ></i>
                  {name}
                </button>
              </div>
              {isExpanded && (
                <ArtifactTree
                  treeData={node}
                  projectName={projectName}
                  testName={testName}
                  runtime={runtime}
                  onSelect={onSelect}
                  level={level + 1}
                  basePath={fullPath}
                />
              )}
            </li>
          );
        }
      })}
    </ul>
  );
};

const buildArtifactTree = (testData: any) => {
  const artifactPaths = new Set<string>();
  testData.givens?.forEach((given: any) => {
    given.artifacts?.forEach((artifact: string) => artifactPaths.add(artifact));
    given.whens?.forEach((when: any) =>
      when.artifacts?.forEach((artifact: string) => artifactPaths.add(artifact)));
    given.thens?.forEach((then: any) =>
      then.artifacts?.forEach((artifact: string) => artifactPaths.add(artifact)));
  });

  const sortedArtifacts = Array.from(artifactPaths).sort();

  return sortedArtifacts.reduce((tree, artifactPath) => {
    const parts = artifactPath.split('/');
    let currentLevel = tree;

    parts.forEach((part, i) => {
      if (!currentLevel[part]) {
        currentLevel[part] = i === parts.length - 1
          ? { __isFile: true, path: artifactPath }
          : {};
      }
      currentLevel = currentLevel[part];
    });

    return tree;
  }, {} as Record<string, any>);
};

const LogNavItem = ({
  logName,
  logContent,
  activeTab,
  setActiveTab,
  setSelectedFile,
  errorCounts,
  decodedTestPath,
  testsExist,
}: {
  logName: string;
  logContent: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSelectedFile: (file: {
    path: string;
    content: string;
    language?: string;
  }) => void;
  errorCounts: {
    runTimeErrors: number;
    typeErrors: number;
    staticErrors: number;
  };
  decodedTestPath: string;
  testsExist: boolean;
}) => {
  const displayName = logName
    .replace(".json", "")
    .replace(".txt", "")
    .replace(".log", "")
    .replace(/_/g, " ")
    .replace(/^std/, "Standard ")
    .replace(/^exit/, "Exit Code");

  const logValue = typeof logContent === "string" ? logContent.trim() : "";
  let statusIndicator: ReactElement<any, any> | null = null;

  if (
    logName === STANDARD_LOGS.TYPE_ERRORS &&
    (errorCounts.typeErrors > 0 || (logValue && logValue !== "0"))
  ) {
    statusIndicator = (
      <span className="ms-1">
        ❌ {errorCounts.typeErrors || (logValue ? 1 : 0)}
      </span>
    );
  } else if (
    logName === STANDARD_LOGS.LINT_ERRORS &&
    (errorCounts.staticErrors > 0 || (logValue && logValue !== "0"))
  ) {
    statusIndicator = (
      <span className="ms-1">
        ❌ {errorCounts.staticErrors || (logValue ? 1 : 0)}
      </span>
    );
  } else if (
    logName === RUNTIME_SPECIFIC_LOGS.node.STDERR &&
    (errorCounts.runTimeErrors > 0 || (logValue && logValue !== "0"))
  ) {
    statusIndicator = (
      <span className="ms-1">
        ❌ {errorCounts.runTimeErrors || (logValue ? 1 : 0)}
      </span>
    );
  } else if (logName === STANDARD_LOGS.EXIT && logValue !== "0") {
    statusIndicator = <span className="ms-1">⚠️ {logValue}</span>;
  } else if (logName === STANDARD_LOGS.TESTS && logValue) {
    statusIndicator = (
      <div className="ms-1">
        <TestStatusBadge
          testName={decodedTestPath}
          testsExist={testsExist}
          runTimeErrors={errorCounts.runTimeErrors}
          typeErrors={errorCounts.typeErrors}
          staticErrors={errorCounts.staticErrors}
          variant="compact"
          className="mt-1"
        />
      </div>
    );
  }

  return (
    <Nav.Item key={logName}>
      <Nav.Link
        eventKey={logName}
        active={activeTab === logName}
        onClick={() => {
          setActiveTab(logName);
          setSelectedFile({
            path: logName,
            content:
              typeof logContent === "string"
                ? logContent
                : JSON.stringify(logContent, null, 2),
            language: logName.endsWith(".json")
              ? "json"
              : logName.endsWith(".txt")
                ? "plaintext"
                : logName.endsWith(".log")
                  ? "log"
                  : "plaintext",
          });
        }}
        className="d-flex flex-column align-items-start"
      >
        <div className="d-flex justify-content-between w-100">
          <span className="text-capitalize">{displayName}</span>
          {statusIndicator}
        </div>
      </Nav.Link>
    </Nav.Item>
  );
};
