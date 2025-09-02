/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { getFileService } from '../../services/FileService';
import { useGitMode } from '../../hooks/useGitMode';
export const GitIntegrationView = () => {
    const { mode, setMode, isStatic, isDev, isGit } = useGitMode();
    const [changes, setChanges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commitSummary, setCommitSummary] = useState('');
    const [commitDescription, setCommitDescription] = useState('');
    const [remoteStatus, setRemoteStatus] = useState({ ahead: 0, behind: 0 });
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
        var _a, _b, _c;
        if (fileService && mode === 'dev') {
            const devFileService = fileService;
            // Set up real-time updates for dev mode
            const unsubscribeChanges = (_a = devFileService.onChanges) === null || _a === void 0 ? void 0 : _a.call(devFileService, (newChanges) => {
                setChanges(newChanges);
            });
            const unsubscribeStatus = (_b = devFileService.onStatusUpdate) === null || _b === void 0 ? void 0 : _b.call(devFileService, (newStatus) => {
                setRemoteStatus(newStatus);
            });
            const unsubscribeBranch = (_c = devFileService.onBranchUpdate) === null || _c === void 0 ? void 0 : _c.call(devFileService, (newBranch) => {
                setCurrentBranch(newBranch);
            });
            const loadData = async () => {
                try {
                    setIsLoading(true);
                    await loadChanges();
                    await loadGitStatus();
                }
                catch (err) {
                    console.warn('Failed to load data:', err);
                }
                finally {
                    setIsLoading(false);
                }
            };
            loadData();
            return () => {
                unsubscribeChanges === null || unsubscribeChanges === void 0 ? void 0 : unsubscribeChanges();
                unsubscribeStatus === null || unsubscribeStatus === void 0 ? void 0 : unsubscribeStatus();
                unsubscribeBranch === null || unsubscribeBranch === void 0 ? void 0 : unsubscribeBranch();
            };
        }
        else if (fileService) {
            // For non-dev modes, just load data once
            const loadData = async () => {
                try {
                    setIsLoading(true);
                    await loadChanges();
                    await loadGitStatus();
                }
                catch (err) {
                    console.warn('Failed to load data:', err);
                }
                finally {
                    setIsLoading(false);
                }
            };
            loadData();
        }
    }, [fileService, mode]);
    const loadChanges = async (event) => {
        // Prevent default behavior if event exists
        if (event) {
            event.preventDefault();
        }
        try {
            setIsLoading(true);
            setError(null);
            const changes = await fileService.getChanges();
            setChanges(changes);
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load changes';
            console.error('Failed to load changes:', err);
            setError(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
    };
    const loadGitStatus = async (event) => {
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
        }
        catch (err) {
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
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to commit changes';
            console.error('Failed to commit changes:', err);
            setError(errorMessage);
        }
        finally {
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
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to share changes';
            console.error('Failed to share changes:', err);
            setError(errorMessage);
        }
        finally {
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
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to get updates';
            console.error('Failed to get updates:', err);
            setError(errorMessage);
        }
        finally {
            setIsPulling(false);
        }
    };
    const getStatusBadgeVariant = (status) => {
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
        }
        else if (remoteStatus.ahead > 0) {
            return `${remoteStatus.ahead} ahead`;
        }
        else if (remoteStatus.behind > 0) {
            return `${remoteStatus.behind} behind`;
        }
        else {
            return 'Up to date';
        }
    };
    const getSyncStatusVariant = () => {
        if (remoteStatus.behind > 0)
            return 'warning';
        if (remoteStatus.ahead > 0)
            return 'info';
        return 'success';
    };
    // if (error) console.error(error);
    return (React.createElement(Container, { fluid: true },
        React.createElement(Row, { className: "mb-4" },
            React.createElement(Col, null,
                React.createElement("h2", null, "Git Integration"),
                React.createElement("div", { className: "d-flex align-items-center gap-2" },
                    React.createElement(Badge, { bg: mode === 'static' ? 'secondary' : mode === 'dev' ? 'success' : 'primary' },
                        mode.toUpperCase(),
                        " MODE"),
                    React.createElement("select", { className: "form-select form-select-sm", style: { width: 'auto' }, value: mode, onChange: (e) => setMode(e.target.value) },
                        React.createElement("option", { value: "static" }, "Static (Read-only)"),
                        React.createElement("option", { value: "dev" }, "Development (Read-write)"),
                        React.createElement("option", { value: "git" }, "Git Remote"))),
                mode === 'static' && (React.createElement(Alert, { variant: "info", className: "mt-2" },
                    React.createElement("small", null, "Static mode: Read-only access. Git operations are not available in this mode."))),
                mode === 'git' && (React.createElement(Alert, { variant: "warning", className: "mt-2" },
                    React.createElement("small", null, "Git Remote mode: Git-based collaboration. Some features may be limited."))))),
        error && (React.createElement(Alert, { variant: "danger", onClose: () => setError(null), dismissible: true }, error)),
        mode !== 'static' && (React.createElement(Row, null,
            React.createElement(Col, { md: 4 },
                React.createElement(Card, null,
                    React.createElement(Card.Header, { className: "d-flex justify-content-between align-items-center" },
                        React.createElement("h5", { className: "mb-0" }, "Changes"),
                        React.createElement(Button, { variant: "outline-secondary", size: "sm", onClick: loadChanges, disabled: isLoading }, isLoading ? React.createElement(Spinner, { animation: "border", size: "sm" }) : '↻')),
                    React.createElement(Card.Body, { style: { maxHeight: '400px', overflowY: 'auto' } }, isLoading ? (React.createElement("div", { className: "text-center" },
                        React.createElement(Spinner, { animation: "border" }),
                        React.createElement("div", null, "Loading changes..."))) : changes.length === 0 ? (React.createElement("div", { className: "text-center text-muted" }, "No changes detected")) : (React.createElement("div", null, changes.map((change, index) => (React.createElement("div", { key: index, className: "d-flex align-items-center mb-2" },
                        React.createElement(Badge, { bg: getStatusBadgeVariant(change.status), className: "me-2" }, change.status.charAt(0).toUpperCase() + change.status.slice(1)),
                        React.createElement("span", { className: "small text-truncate" }, change.path))))))))),
            React.createElement(Col, { md: 4 },
                React.createElement(Card, null,
                    React.createElement(Card.Header, null,
                        React.createElement("h5", null, "Commit Changes")),
                    React.createElement(Card.Body, null,
                        React.createElement("div", { className: "mb-3" },
                            React.createElement("label", { htmlFor: "summary", className: "form-label" }, "Summary *"),
                            React.createElement("input", { type: "text", className: "form-control", id: "summary", placeholder: "What did you change?", value: commitSummary, onChange: (e) => setCommitSummary(e.target.value), disabled: mode === 'static' }),
                            React.createElement("div", { className: "form-text" },
                                commitSummary.length,
                                "/72 characters")),
                        React.createElement("div", { className: "mb-3" },
                            React.createElement("label", { htmlFor: "description", className: "form-label" }, "Description"),
                            React.createElement("textarea", { className: "form-control", id: "description", rows: 3, placeholder: "Why did you change it?", value: commitDescription, onChange: (e) => setCommitDescription(e.target.value), disabled: mode === 'static' })),
                        React.createElement("div", { className: "d-grid gap-2" },
                            React.createElement(Button, { variant: "primary", onClick: handleSaveChanges, disabled: mode === 'static' || isCommitting || changes.length === 0 || !commitSummary.trim() }, isCommitting ? (React.createElement(React.Fragment, null,
                                React.createElement(Spinner, { animation: "border", size: "sm", className: "me-2" }),
                                "Saving...")) : ('Save to Computer')),
                            React.createElement(Button, { variant: "success", onClick: handleShareChanges, disabled: mode === 'static' || isCommitting || isPushing || changes.length === 0 || !commitSummary.trim() }, isPushing ? (React.createElement(React.Fragment, null,
                                React.createElement(Spinner, { animation: "border", size: "sm", className: "me-2" }),
                                "Sharing...")) : ('Save & Share')))))),
            React.createElement(Col, { md: 4 },
                React.createElement(Card, null,
                    React.createElement(Card.Header, { className: "d-flex justify-content-between align-items-center" },
                        React.createElement("h5", { className: "mb-0" }, "Sync with Remote"),
                        React.createElement(Button, { variant: "outline-secondary", size: "sm", onClick: (e) => loadGitStatus(e) }, "\u21BB")),
                    React.createElement(Card.Body, null,
                        React.createElement("div", { className: "text-center mb-3" },
                            React.createElement(Badge, { bg: getSyncStatusVariant() }, getSyncStatusText()),
                            React.createElement("div", { className: "small text-muted mt-1" },
                                "Branch: ",
                                currentBranch)),
                        React.createElement("div", { className: "d-grid gap-2" },
                            React.createElement(Button, { variant: "outline-primary", onClick: handleGetUpdates, disabled: mode === 'static' || isPulling }, isPulling ? (React.createElement(React.Fragment, null,
                                React.createElement(Spinner, { animation: "border", size: "sm", className: "me-2" }),
                                "Updating...")) : ('Get Updates')),
                            React.createElement(Button, { variant: "outline-success", disabled: mode === 'static' || remoteStatus.ahead === 0, onClick: async (e) => {
                                    e.preventDefault();
                                    try {
                                        setIsPushing(true);
                                        setError(null);
                                        await fileService.pushChanges();
                                        await loadGitStatus();
                                    }
                                    catch (err) {
                                        const errorMessage = err instanceof Error ? err.message : 'Failed to push changes';
                                        console.error('Failed to push changes:', err);
                                        setError(errorMessage);
                                    }
                                    finally {
                                        setIsPushing(false);
                                    }
                                } }, isPushing ? (React.createElement(React.Fragment, null,
                                React.createElement(Spinner, { animation: "border", size: "sm", className: "me-2" }),
                                "Sharing...")) : (`Share Changes (${remoteStatus.ahead})`))),
                        React.createElement("div", { className: "mt-3" },
                            React.createElement("small", { className: "text-muted" },
                                "Connected to: origin/",
                                currentBranch))))))),
        mode === 'static' && (React.createElement(Row, null,
            React.createElement(Col, null,
                React.createElement(Alert, { variant: "info", className: "text-center" },
                    React.createElement("h5", null, "Git Operations Not Available"),
                    React.createElement("p", null, "Git functionality is disabled in Static Mode. Switch to Development or Git Remote mode to access version control features.")))))));
};
