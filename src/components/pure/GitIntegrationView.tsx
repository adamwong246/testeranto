/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { getFileService, type FileChange, type RemoteStatus } from '../../services/FileService';
import { useGitMode } from '../../hooks/useGitMode';

export const GitIntegrationView = () => {
  const { mode, setMode, isStatic, isDev, isGit } = useGitMode();
  const [changes, setChanges] = useState<FileChange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commitSummary, setCommitSummary] = useState('');
  const [commitDescription, setCommitDescription] = useState('');
  const [remoteStatus, setRemoteStatus] = useState<RemoteStatus>({ ahead: 0, behind: 0 });
  const [currentBranch, setCurrentBranch] = useState('main');
  const [isCommitting, setIsCommitting] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  const [fileService, setFileService] = useState(() => getFileService(mode));

  useEffect(() => {
    const newFileService = getFileService(mode);
    setFileService(newFileService);
    // We can't call loadChanges and loadGitStatus here directly because they use fileService state
    // Instead, we'll set up a separate effect to trigger when fileService changes
  }, [mode]);

  // Add a new effect to load data when fileService changes
  useEffect(() => {
    if (fileService && mode === 'dev') {
      const devFileService = fileService as any;

      // Set up real-time updates for dev mode
      const unsubscribeChanges = devFileService.onChanges?.((newChanges: FileChange[]) => {
        setChanges(newChanges);
      });

      const unsubscribeStatus = devFileService.onStatusUpdate?.((newStatus: RemoteStatus) => {
        setRemoteStatus(newStatus);
      });

      const unsubscribeBranch = devFileService.onBranchUpdate?.((newBranch: string) => {
        setCurrentBranch(newBranch);
      });

      const loadData = async () => {
        try {
          setIsLoading(true);
          await loadChanges();
          await loadGitStatus();
        } catch (err) {
          console.warn('Failed to load data:', err);
        } finally {
          setIsLoading(false);
        }
      };

      loadData();

      return () => {
        unsubscribeChanges?.();
        unsubscribeStatus?.();
        unsubscribeBranch?.();
      };
    } else if (fileService) {
      // For non-dev modes, just load data once
      const loadData = async () => {
        try {
          setIsLoading(true);
          await loadChanges();
          await loadGitStatus();
        } catch (err) {
          console.warn('Failed to load data:', err);
        } finally {
          setIsLoading(false);
        }
      };

      loadData();
    }
  }, [fileService, mode]);

  const loadChanges = async (event?: React.MouseEvent) => {
    // Prevent default behavior if event exists
    if (event) {
      event.preventDefault();
    }

    try {
      setIsLoading(true);
      setError(null);
      const changes = await fileService.getChanges();
      setChanges(changes);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load changes';
      console.error('Failed to load changes:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loadGitStatus = async (event?: React.MouseEvent) => {
    // Prevent default behavior if event exists
    if (event) {
      event.preventDefault();
    }

    try {
      setError(null);
      const branch = await fileService.getCurrentBranch();
      const status = await fileService.getRemoteStatus();
      setCurrentBranch(branch);
      setRemoteStatus(status);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load git status';
      console.error('Failed to load git status:', err);
      setError(errorMessage);
    }
  };


  const handleSaveChanges = async () => {
    if (!commitSummary.trim()) {
      setError('Please provide a commit summary');
      return;
    }

    try {
      setIsCommitting(true);
      setError(null);
      await fileService.commitChanges(commitSummary, commitDescription);
      setCommitSummary('');
      setCommitDescription('');
      await loadChanges();
      await loadGitStatus();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to commit changes';
      console.error('Failed to commit changes:', err);
      setError(errorMessage);
    } finally {
      setIsCommitting(false);
    }
  };

  const handleShareChanges = async () => {
    if (!commitSummary.trim()) {
      setError('Please provide a commit summary');
      return;
    }

    try {
      setIsCommitting(true);
      setIsPushing(true);
      setError(null);
      await fileService.commitChanges(commitSummary, commitDescription);
      await fileService.pushChanges();
      setCommitSummary('');
      setCommitDescription('');
      await loadChanges();
      await loadGitStatus();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to share changes';
      console.error('Failed to share changes:', err);
      setError(errorMessage);
    } finally {
      setIsCommitting(false);
      setIsPushing(false);
    }
  };

  const handleGetUpdates = async () => {
    try {
      setIsPulling(true);
      setError(null);
      await fileService.pullChanges();
      await loadChanges();
      await loadGitStatus();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get updates';
      console.error('Failed to get updates:', err);
      setError(errorMessage);
    } finally {
      setIsPulling(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'modified': return 'warning';
      case 'added': return 'success';
      case 'deleted': return 'danger';
      case 'conflicted': return 'danger';
      default: return 'secondary';
    }
  };

  const getSyncStatusText = () => {
    if (remoteStatus.ahead > 0 && remoteStatus.behind > 0) {
      return `${remoteStatus.ahead} ahead, ${remoteStatus.behind} behind`;
    } else if (remoteStatus.ahead > 0) {
      return `${remoteStatus.ahead} ahead`;
    } else if (remoteStatus.behind > 0) {
      return `${remoteStatus.behind} behind`;
    } else {
      return 'Up to date';
    }
  };

  const getSyncStatusVariant = () => {
    if (remoteStatus.behind > 0) return 'warning';
    if (remoteStatus.ahead > 0) return 'info';
    return 'success';
  };

  // if (error) console.error(error);

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center gap-2">
            <Badge bg={mode === 'static' ? 'secondary' : mode === 'dev' ? 'success' : 'primary'}>
              {mode.toUpperCase()} MODE
            </Badge>
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={mode}
              onChange={(e) => setMode(e.target.value as 'static' | 'dev' | 'git')}
            >
              <option value="static">Static (Read-only)</option>
              <option value="dev">Development (Read-write)</option>
              <option value="git">Git Remote</option>
            </select>
          </div>
          {mode === 'static' && (
            <Alert variant="info" className="mt-2">
              <small>Static mode: Read-only access. Git operations are not available in this mode.</small>
            </Alert>
          )}
          {mode === 'git' && (
            <Alert variant="warning" className="mt-2">
              <small>Git Remote mode: Git-based collaboration. Some features may be limited.</small>
            </Alert>
          )}
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {mode !== 'static' && (
        <Row>
          <Col md={4}>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Changes</h5>
                <Button variant="outline-secondary" size="sm" onClick={loadChanges} disabled={isLoading}>
                  {isLoading ? <Spinner animation="border" size="sm" /> : '↻'}
                </Button>
              </Card.Header>
              <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {isLoading ? (
                  <div className="text-center">
                    <Spinner animation="border" />
                    <div>Loading changes...</div>
                  </div>
                ) : changes.length === 0 ? (
                  <div className="text-center text-muted">No changes detected</div>
                ) : (
                  <div>
                    {changes.map((change, index) => (
                      <div key={index} className="d-flex align-items-center mb-2">
                        <Badge
                          bg={getStatusBadgeVariant(change.status)}
                          className="me-2"
                        >
                          {change.status.charAt(0).toUpperCase() + change.status.slice(1)}
                        </Badge>
                        <span className="small text-truncate">{change.path}</span>
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
                  <label htmlFor="summary" className="form-label">Summary *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="summary"
                    placeholder="What did you change?"
                    value={commitSummary}
                    onChange={(e) => setCommitSummary(e.target.value)}
                    disabled={mode === 'static'}
                  />
                  <div className="form-text">{commitSummary.length}/72 characters</div>
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows={3}
                    placeholder="Why did you change it?"
                    value={commitDescription}
                    onChange={(e) => setCommitDescription(e.target.value)}
                    disabled={mode === 'static'}
                  />
                </div>
                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    onClick={handleSaveChanges}
                    disabled={mode === 'static' || isCommitting || changes.length === 0 || !commitSummary.trim()}
                  >
                    {isCommitting ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Saving...
                      </>
                    ) : (
                      'Save to Computer'
                    )}
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleShareChanges}
                    disabled={mode === 'static' || isCommitting || isPushing || changes.length === 0 || !commitSummary.trim()}
                  >
                    {isPushing ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Sharing...
                      </>
                    ) : (
                      'Save & Share'
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
                <Button variant="outline-secondary" size="sm" onClick={(e) => loadGitStatus(e)}>
                  ↻
                </Button>
              </Card.Header>
              <Card.Body>
                <div className="text-center mb-3">
                  <Badge bg={getSyncStatusVariant()}>{getSyncStatusText()}</Badge>
                  <div className="small text-muted mt-1">Branch: {currentBranch}</div>
                </div>
                <div className="d-grid gap-2">
                  <Button
                    variant="outline-primary"
                    onClick={handleGetUpdates}
                    disabled={mode === 'static' || isPulling}
                  >
                    {isPulling ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Updating...
                      </>
                    ) : (
                      'Get Updates'
                    )}
                  </Button>
                  <Button
                    variant="outline-success"
                    disabled={mode === 'static' || remoteStatus.ahead === 0}
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        setIsPushing(true);
                        setError(null);
                        await fileService.pushChanges();
                        await loadGitStatus();
                      } catch (err) {
                        const errorMessage = err instanceof Error ? err.message : 'Failed to push changes';
                        console.error('Failed to push changes:', err);
                        setError(errorMessage);
                      } finally {
                        setIsPushing(false);
                      }
                    }}
                  >
                    {isPushing ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
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
          </Col>
        </Row>
      )}

      {mode === 'static' && (
        <Row>
          <Col>
            <Alert variant="info" className="text-center">
              <h5>Git Operations Not Available</h5>
              <p>
                Git functionality is disabled in Static Mode. Switch to Development or Git Remote mode
                to access version control features.
              </p>
            </Alert>
          </Col>
        </Row>
      )}
    </Container>
  );
};
