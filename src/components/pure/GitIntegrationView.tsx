/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Editor } from "@monaco-editor/react";
import { getFileService, FileChange, RemoteStatus } from "../../services/FileService";

export const GitIntegrationView = ({
  mode,
  setMode,
  fileService,
  setChanges,
  remoteStatus,
  changes,
  currentBranch,
  setIsLoading,
  isLoading,
  setCurrentBranch,
  setRemoteStatus,
  setError,
  loadChanges,
  loadGitStatus,
  error,
  getStatusBadgeVariant,
  commitSummary,
  setCommitSummary,
  commitDescription,
  setCommitDescription,
  handleSaveChanges,
  isCommitting,
  handleShareChanges,
  getSyncStatusVariant,
  handleGetUpdates,
  isPulling,
  isPushing,
  setIsPushing,
  getSyncStatusText,
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [originalContent, setOriginalContent] = useState<string>("");
  const [modifiedContent, setModifiedContent] = useState<string>("");
  const [isDiffLoading, setIsDiffLoading] = useState(false);

  // Load diff when a file is selected
  const loadFileDiff = useCallback(
    async (filePath: string) => {
      console.log("loadFileDiff - filePath:", filePath);
      if (mode === "static") return;

      setIsDiffLoading(true);
      try {
        setSelectedFile(filePath);
        try {
          const currentContent = await fileService.readFile(filePath);
          setModifiedContent(currentContent);
        } catch (error) {
          console.error("Error reading file:", error);
          setModifiedContent("");
          setError(
            `Cannot read file: ${filePath}. The development server may not be running or the file API endpoints may not be implemented. Check that the server is running and has the /api/files/read endpoint.`
          );
        }
        setOriginalContent("");
      } catch (error) {
        console.error("Failed to load file diff:", error);
        setError("Failed to load file content for diff");
      } finally {
        setIsDiffLoading(false);
      }
    },
    [fileService, mode, setError]
  );

  // Auto-select first file when changes load
  useEffect(() => {
    if (changes.length > 0 && !selectedFile) {
      console.log("First change path:", changes[0].path);
      loadFileDiff(changes[0].path);
    }
  }, [changes, selectedFile, loadFileDiff]);

  // const loadChanges = async (event?: React.MouseEvent) => {
  //   // Prevent default behavior if event exists
  //   if (event) {
  //     event.preventDefault();
  //   }

  //   try {
  //     setIsLoading(true);
  //     setError(null);
  //     const changes = await fileService.getChanges();
  //     setChanges(changes);
  //   } catch (err) {
  //     const errorMessage =
  //       err instanceof Error ? err.message : "Failed to load changes";
  //     console.error("Failed to load changes:", err);
  //     setError(errorMessage);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const loadGitStatus = async (event?: React.MouseEvent) => {
  //   // Prevent default behavior if event exists
  //   if (event) {
  //     event.preventDefault();
  //   }

  //   try {
  //     setError(null);
  //     const branch = await fileService.getCurrentBranch();
  //     const status = await fileService.getRemoteStatus();
  //     setCurrentBranch(branch);
  //     setRemoteStatus(status);
  //   } catch (err) {
  //     const errorMessage =
  //       err instanceof Error ? err.message : "Failed to load git status";
  //     console.error("Failed to load git status:", err);
  //     setError(errorMessage);
  //   }
  // };

  // const handleSaveChanges = async () => {
  //   if (!commitSummary.trim()) {
  //     setError("Please provide a commit summary");
  //     return;
  //   }

  //   try {
  //     setIsCommitting(true);
  //     setError(null);
  //     await fileService.commitChanges(commitSummary, commitDescription);
  //     setCommitSummary("");
  //     setCommitDescription("");
  //     await loadChanges();
  //     await loadGitStatus();
  //   } catch (err) {
  //     const errorMessage =
  //       err instanceof Error ? err.message : "Failed to commit changes";
  //     console.error("Failed to commit changes:", err);
  //     setError(errorMessage);
  //   } finally {
  //     setIsCommitting(false);
  //   }
  // };

  // const handleShareChanges = async () => {
  //   if (!commitSummary.trim()) {
  //     setError("Please provide a commit summary");
  //     return;
  //   }

  //   try {
  //     setIsCommitting(true);
  //     setIsPushing(true);
  //     setError(null);
  //     await fileService.commitChanges(commitSummary, commitDescription);
  //     await fileService.pushChanges();
  //     setCommitSummary("");
  //     setCommitDescription("");
  //     await loadChanges();
  //     await loadGitStatus();
  //   } catch (err) {
  //     const errorMessage =
  //       err instanceof Error ? err.message : "Failed to share changes";
  //     console.error("Failed to share changes:", err);
  //     setError(errorMessage);
  //   } finally {
  //     setIsCommitting(false);
  //     setIsPushing(false);
  //   }
  // };

  // const handleGetUpdates = async () => {
  //   try {
  //     setIsPulling(true);
  //     setError(null);
  //     await fileService.pullChanges();
  //     await loadChanges();
  //     await loadGitStatus();
  //   } catch (err) {
  //     const errorMessage =
  //       err instanceof Error ? err.message : "Failed to get updates";
  //     console.error("Failed to get updates:", err);
  //     setError(errorMessage);
  //   } finally {
  //     setIsPulling(false);
  //   }
  // };

  // const getStatusBadgeVariant = (status: string) => {
  //   switch (status) {
  //     case "modified":
  //       return "warning";
  //     case "added":
  //       return "success";
  //     case "deleted":
  //       return "danger";
  //     case "conflicted":
  //       return "danger";
  //     default:
  //       return "secondary";
  //   }
  // };

  // const getSyncStatusText = () => {
  //   if (remoteStatus.ahead > 0 && remoteStatus.behind > 0) {
  //     return `${remoteStatus.ahead} ahead, ${remoteStatus.behind} behind`;
  //   } else if (remoteStatus.ahead > 0) {
  //     return `${remoteStatus.ahead} ahead`;
  //   } else if (remoteStatus.behind > 0) {
  //     return `${remoteStatus.behind} behind`;
  //   } else {
  //     return "Up to date";
  //   }
  // };

  // const getSyncStatusVariant = () => {
  //   if (remoteStatus.behind > 0) return "warning";
  //   if (remoteStatus.ahead > 0) return "info";
  //   return "success";
  // };

  // if (error) console.error(error);

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center gap-2">
            <Badge
              bg={
                mode === "static"
                  ? "secondary"
                  : mode === "dev"
                    ? "success"
                    : "primary"
              }
            >
              {mode.toUpperCase()} MODE
            </Badge>
            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={mode}
              onChange={(e) =>
                setMode(e.target.value as "static" | "dev" | "git")
              }
            >
              <option value="static">Static (Read-only)</option>
              <option value="dev">Development (Read-write)</option>
              <option value="git">Git Remote</option>
            </select>
          </div>
          {mode === "static" && (
            <Alert variant="info" className="mt-2">
              <small>
                Static mode: Read-only access. Git operations are not available
                in this mode.
              </small>
            </Alert>
          )}
          {mode === "git" && (
            <Alert variant="warning" className="mt-2">
              <small>
                Git Remote mode: Git-based collaboration. Some features may be
                limited.
              </small>
            </Alert>
          )}
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          <div>{error}</div>
          <small className="text-muted">
            Check the browser console for more details
          </small>
        </Alert>
      )}

      {mode !== "static" && (
        <Row>
          {/* Left Column - 1/3 width */}
          <Col md={4}>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Changes</h5>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={loadChanges}
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner animation="border" size="sm" /> : "↻"}
                </Button>
              </Card.Header>
              <Card.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
                {isLoading ? (
                  <div className="text-center">
                    <Spinner animation="border" />
                    <div>Loading changes...</div>
                  </div>
                ) : changes.length === 0 ? (
                  <div className="text-center text-muted">
                    No changes detected
                  </div>
                ) : (
                  <div>
                    {changes.map((change, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center mb-2"
                      >
                        <Badge
                          bg={getStatusBadgeVariant(change.status)}
                          className="me-2"
                        >
                          {change.status.charAt(0).toUpperCase() +
                            change.status.slice(1)}
                        </Badge>
                        <span className="small text-truncate">
                          {change.path}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Header>
                <h5>Commit Changes</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <label htmlFor="summary" className="form-label">
                    Summary *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="summary"
                    placeholder="What did you change?"
                    value={commitSummary}
                    onChange={(e) => setCommitSummary(e.target.value)}
                    disabled={mode === "static"}
                  />
                  <div className="form-text">
                    {commitSummary.length}/72 characters
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows={3}
                    placeholder="Why did you change it?"
                    value={commitDescription}
                    onChange={(e) => setCommitDescription(e.target.value)}
                    disabled={mode === "static"}
                  />
                </div>
                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    onClick={handleSaveChanges}
                    disabled={
                      mode === "static" ||
                      isCommitting ||
                      changes.length === 0 ||
                      !commitSummary.trim()
                    }
                  >
                    {isCommitting ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Saving...
                      </>
                    ) : (
                      "Save to Computer"
                    )}
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleShareChanges}
                    disabled={
                      mode === "static" ||
                      isCommitting ||
                      isPushing ||
                      changes.length === 0 ||
                      !commitSummary.trim()
                    }
                  >
                    {isPushing ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Sharing...
                      </>
                    ) : (
                      "Save & Share"
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Sync with Remote</h5>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={(e) => loadGitStatus(e)}
                >
                  ↻
                </Button>
              </Card.Header>
              <Card.Body>
                <div className="text-center mb-3">
                  <Badge bg={getSyncStatusVariant()}>
                    {getSyncStatusText()}
                  </Badge>
                  <div className="small text-muted mt-1">
                    Branch: {currentBranch}
                  </div>
                </div>
                <div className="d-grid gap-2">
                  <Button
                    variant="outline-primary"
                    onClick={handleGetUpdates}
                    disabled={mode === "static" || isPulling}
                  >
                    {isPulling ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Updating...
                      </>
                    ) : (
                      "Get Updates"
                    )}
                  </Button>
                  <Button
                    variant="outline-success"
                    disabled={mode === "static" || remoteStatus.ahead === 0}
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        setIsPushing(true);
                        setError(null);
                        await fileService.pushChanges();
                        await loadGitStatus();
                      } catch (err) {
                        const errorMessage =
                          err instanceof Error
                            ? err.message
                            : "Failed to push changes";
                        console.error("Failed to push changes:", err);
                        setError(errorMessage);
                      } finally {
                        setIsPushing(false);
                      }
                    }}
                  >
                    {isPushing ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Sharing...
                      </>
                    ) : (
                      `Share Changes (${remoteStatus.ahead})`
                    )}
                  </Button>
                </div>
                <div className="mt-3">
                  <small className="text-muted">
                    Connected to: origin/{currentBranch}
                  </small>
                </div>
              </Card.Body>
            </Card>

            {/* Changes below Sync with Remote */}
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Changes</h5>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={loadChanges}
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner animation="border" size="sm" /> : "↻"}
                </Button>
              </Card.Header>
              <Card.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
                {isLoading ? (
                  <div className="text-center">
                    <Spinner animation="border" />
                    <div>Loading changes...</div>
                  </div>
                ) : changes.length === 0 ? (
                  <div className="text-center text-muted">
                    No changes detected
                  </div>
                ) : (
                  <div>
                    {changes.map((change, index) => (
                      <div
                        key={index}
                        className={`d-flex align-items-center mb-2 ${selectedFile === change.path
                          ? "bg-light rounded p-1"
                          : ""
                          }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => loadFileDiff(change.path)}
                      >
                        <Badge
                          bg={getStatusBadgeVariant(change.status)}
                          className="me-2"
                        >
                          {change.status.charAt(0).toUpperCase() +
                            change.status.slice(1)}
                        </Badge>
                        <span className="small text-truncate">
                          {change.path}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column - 2/3 width */}
          <Col md={8}>
            {/* Changes Preview at the top */}
            <Card className="mb-3">
              <Card.Header>
                <h5>Changes Preview</h5>
              </Card.Header>
              <Card.Body style={{ height: "400px" }}>
                {isDiffLoading ? (
                  <div className="text-center">
                    <Spinner animation="border" />
                    <div>Loading diff...</div>
                  </div>
                ) : selectedFile ? (
                  modifiedContent ? (
                    <Editor
                      height="100%"
                      language="typescript"
                      original={originalContent}
                      modified={modifiedContent}
                      options={{
                        readOnly: true,
                        renderSideBySide: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 12,
                        lineNumbers: "on",
                        folding: true,
                        glyphMargin: false,
                        lineDecorationsWidth: 10,
                        lineNumbersMinChars: 3,
                        scrollbar: {
                          vertical: "auto",
                          horizontal: "auto",
                        },
                        renderLineHighlight: "all",
                      }}
                    />
                  ) : (
                    <div className="text-center text-muted">
                      <p>Could not load file content.</p>
                      <small>
                        Check that the development server is running and has
                        file API endpoints implemented.
                      </small>
                    </div>
                  )
                ) : (
                  <div className="text-center text-muted">
                    Select a file to view changes
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Commit Changes below Changes Preview */}
            <Card>
              <Card.Header>
                <h5>Commit Changes</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <label htmlFor="summary" className="form-label">
                    Summary *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="summary"
                    placeholder="What did you change?"
                    value={commitSummary}
                    onChange={(e) => setCommitSummary(e.target.value)}
                    disabled={mode === "static"}
                  />
                  <div className="form-text">
                    {commitSummary.length}/72 characters
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows={3}
                    placeholder="Why did you change it?"
                    value={commitDescription}
                    onChange={(e) => setCommitDescription(e.target.value)}
                    disabled={mode === "static"}
                  />
                </div>
                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    onClick={handleSaveChanges}
                    disabled={
                      mode === "static" ||
                      isCommitting ||
                      changes.length === 0 ||
                      !commitSummary.trim()
                    }
                  >
                    {isCommitting ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Saving...
                      </>
                    ) : (
                      "Save to Computer"
                    )}
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleShareChanges}
                    disabled={
                      mode === "static" ||
                      isCommitting ||
                      isPushing ||
                      changes.length === 0 ||
                      !commitSummary.trim()
                    }
                  >
                    {isPushing ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Sharing...
                      </>
                    ) : (
                      "Save & Share"
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {mode === "static" && (
        <Row>
          <Col>
            <Alert variant="info" className="text-center">
              <h5>Git Operations Not Available</h5>
              <p>
                Git functionality is disabled in Static Mode. Switch to
                Development or Git Remote mode to access version control
                features.
              </p>
            </Alert>
          </Col>
        </Row>
      )}
    </Container>
  );
};
