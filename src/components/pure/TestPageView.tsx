/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactElement, useState, useMemo, useEffect } from "react";
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
    <ul className="list-unstyled" style={{ paddingLeft: `${level * 16}px` }}>
      {Object.entries(data).map(([name, node]) => {
        const path =
          Object.keys(expanded).find((k) => k.endsWith(name)) || name;
        const isExpanded = expanded[path];

        if (node.__isFile) {
          return (
            <li key={name} className="py-1">
              <button
                className={`btn btn-link text-start p-0 text-decoration-none ${selectedSourcePath === path ? "text-primary fw-bold" : ""
                  }`}
                onClick={() => onSelect(path, node.content)}
              >
                <i
                  className={`bi bi-file-earmark-text me-2 ${selectedSourcePath === path ? "text-primary" : ""
                    }`}
                ></i>
                {name}
              </button>
            </li>
          );
        } else {
          return (
            <li key={name} className="py-1">
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-link text-start p-0 text-decoration-none me-1"
                  onClick={() => toggleExpand(path)}
                >
                  <i
                    className={`bi ${isExpanded ? "bi-folder2-open" : "bi-folder"
                      } me-2`}
                  ></i>
                  {name}
                </button>
              </div>
              {isExpanded && (
                <FileTree data={node} onSelect={onSelect} level={level + 1} />
              )}
            </li>
          );
        }
      })}
    </ul>
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
  const [showAiderModal, setShowAiderModal] = useState(false);
  const [messageOption, setMessageOption] = useState<'default' | 'custom'>('default');
  const [customMessage, setCustomMessage] = useState(
    typeof logs['message.txt'] === 'string' ? logs['message.txt'] : 'make a script that prints hello'
  );

  // Update customMessage when logs change
  useEffect(() => {
    if (typeof logs['message.txt'] === 'string' && logs['message.txt'].trim()) {
      setCustomMessage(logs['message.txt']);
    }
  }, [logs]);
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
          <>
            <Button
              variant="info"
              onClick={() => setShowAiderModal(true)}
              className="ms-2"
            >
              🤖
            </Button>

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

                      await navigator.clipboard.writeText(command);
                      setShowAiderModal(false);
                    } catch (err) {
                      console.error("Copy failed:", err);
                    }
                  }}
                >
                  Copy Aider Command
                </Button>
              </Modal.Footer>
            </Modal>

          </>
        }
      />

      <Row className="g-0">
        <Col sm={3} className="border-end">
          <Nav variant="pills" className="flex-column">
            {/* Standard Logs Section */}
            <div className="px-3 py-1 small text-muted">Standard Logs</div>
            {Object.entries(logs)
              .filter(([logName]) =>
                Object.values(STANDARD_LOGS).includes(logName as any)
              )
              .filter(
                ([, logContent]) =>
                  (typeof logContent === "string" && logContent.trim()) ||
                  (typeof logContent === "object" &&
                    Object.keys(logContent).length > 0)
              )
              .map(([logName, logContent]) => (
                <LogNavItem
                  key={logName}
                  logName={logName}
                  logContent={logContent}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  setSelectedFile={setSelectedFile}
                  errorCounts={errorCounts}
                  decodedTestPath={decodedTestPath}
                  testsExist={testsExist}
                />
              ))}

            {/* Runtime Specific Logs Section */}
            {Object.values(RUNTIME_SPECIFIC_LOGS[runtime as RuntimeName])
              .length > 0 && (
                <>
                  <div className="px-3 py-1 small text-muted">Runtime Logs</div>
                  {Object.entries(logs)
                    .filter(([logName]) =>
                      Object.values(
                        RUNTIME_SPECIFIC_LOGS[runtime as RuntimeName]
                      ).includes(logName as any)
                    )
                    .filter(([, logContent]) => {
                      return (typeof logContent === "string" && logContent.trim()) ||
                        (typeof logContent === "object" && Object.keys(logContent).length > 0);
                    })
                    .map(([logName, logContent]) => (
                      <LogNavItem
                        key={logName}
                        logName={logName}
                        logContent={logContent}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setSelectedFile={setSelectedFile}
                        errorCounts={errorCounts}
                        decodedTestPath={decodedTestPath}
                        testsExist={testsExist}
                      />
                    ))}

                </>
              )}
            {logs.source_files && (
              <div className="mt-2">
                <div className="px-3 py-1 small text-muted">Source Files</div>
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
                  level={0}
                  selectedSourcePath={selectedSourcePath}
                />
              </div>
            )}

            {/* Artifacts Section */}
            {logs[STANDARD_LOGS.TESTS] && (
              <div className="mt-2">
                <div className="px-3 py-1 small text-muted">Artifacts</div>
                <ArtifactTree
                  treeData={buildArtifactTree(
                    typeof logs[STANDARD_LOGS.TESTS] === 'string'
                      ? JSON.parse(logs[STANDARD_LOGS.TESTS])
                      : logs[STANDARD_LOGS.TESTS]
                  )}
                  projectName={projectName}
                  testName={testName}
                  runtime={runtime}
                  onSelect={async (path) => {
                    setActiveTab("artifact_viewer");
                    try {
                      const response = await fetch(
                        `reports/${projectName}/${testName
                          .split('.')
                          .slice(0, -1)
                          .join('.')}/${runtime}/${path}`
                      );
                      const content = await (path.match(/\.(png|jpg|jpeg|gif|svg)$/i)
                        ? URL.createObjectURL(await response.blob())
                        : await response.text());

                      setSelectedFile({
                        path,
                        content,
                        language: getLanguage(path),
                      });
                    } catch (err) {
                      setSelectedFile({
                        path,
                        content: `Failed to load artifact: ${err}`,
                        language: 'plaintext',
                      });
                    }
                  }}
                  level={0}
                />
              </div>
            )}
          </Nav>
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
          className="p-0"
          style={{ height: "calc(100vh - 56px)", overflow: "auto" }}
        >
          <div className="p-3">
            {selectedFile?.path.endsWith("tests.json")
              ? typeof selectedFile.content === "string"
                ? renderTestResults(JSON.parse(selectedFile.content))
                : renderTestResults(selectedFile.content)
              : selectedFile?.path.includes("source_files") ? (
                <div className="d-flex flex-column h-100">
                  <Button
                    variant="primary"
                    className="mb-2"
                    onClick={() => {
                      // TODO: Add save functionality
                      alert("Save functionality will be implemented here");
                    }}
                  >
                    Save Changes
                  </Button>
                  <div className="flex-grow-1 overflow-auto">
                    {selectedFile && (
                      <pre className="bg-light p-3">
                        <code>{selectedFile.content}</code>
                      </pre>
                    )}
                  </div>
                </div>
              ) : activeTab === "artifact_viewer" && selectedFile && (
                <div className="d-flex flex-column h-100">
                  <div className="mb-3">
                    <h5>{selectedFile.path}</h5>
                    <a
                      href={`reports/${projectName}/${testName
                        .split('.')
                        .slice(0, -1)
                        .join('.')}/${runtime}/${selectedFile.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary mb-2"
                    >
                      Open Full Artifact
                    </a>
                  </div>
                  <div className="flex-grow-1 overflow-auto">
                    {selectedFile.path.match(/\.(png|jpg|jpeg|gif|svg)$/i) ? (
                      <img
                        src={`reports/${projectName}/${testName
                          .split('.')
                          .slice(0, -1)
                          .join('.')}/${runtime}/${selectedFile.path}`}
                        alt={selectedFile.path}
                        className="img-fluid"
                        style={{ maxHeight: '100%' }}
                      />
                    ) : (
                      <pre className="bg-light p-3">
                        <code>{selectedFile.content}</code>
                      </pre>
                    )}
                  </div>
                </div>
              )}
          </div>
        </Col>
      </Row>
    </Container>
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
