/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { getFileService } from '../../services/FileService';
import { useWebSocket } from '../../App';
export const GitIntegrationView = () => {
    const { isConnected } = useWebSocket();
    const [mode, setMode] = useState(isConnected ? 'dev' : 'static');
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
    const fileService = getFileService(mode);
    useEffect(() => {
        loadChanges();
        loadGitStatus();
    }, [mode]);
    const loadChanges = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const changes = await fileService.getChanges();
            setChanges(changes);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load changes');
        }
        finally {
            setIsLoading(false);
        }
    };
    const loadGitStatus = async () => {
        try {
            const branch = await fileService.getCurrentBranch();
            const status = await fileService.getRemoteStatus();
            setCurrentBranch(branch);
            setRemoteStatus(status);
        }
        catch (err) {
            console.warn('Failed to load git status:', err);
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
            setError(err instanceof Error ? err.message : 'Failed to commit changes');
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
            setError(err instanceof Error ? err.message : 'Failed to share changes');
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
            setError(err instanceof Error ? err.message : 'Failed to get updates');
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
    return (React.createElement(Container, { fluid: true },
        React.createElement(Row, { className: "mb-4" },
            React.createElement(Col, null,
                React.createElement("h2", null, "Git Integration"),
                React.createElement(Badge, { bg: mode === 'static' ? 'secondary' : mode === 'dev' ? 'success' : 'primary' },
                    mode.toUpperCase(),
                    " MODE"),
                mode === 'static' && (React.createElement(Alert, { variant: "info", className: "mt-2" },
                    React.createElement("small", null, "Static mode: Read-only access. Switch to Development mode for full Git functionality."))))),
        error && (React.createElement(Alert, { variant: "danger", onClose: () => setError(null), dismissible: true }, error)),
        React.createElement(Row, null,
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
                    React.createElement(Card.Header, null,
                        React.createElement("h5", null, "Sync with Remote")),
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
                            React.createElement(Button, { variant: "outline-success", disabled: mode === 'static' || remoteStatus.ahead === 0, onClick: () => fileService.pushChanges() },
                                "Share Changes (",
                                remoteStatus.ahead,
                                ")")),
                        React.createElement("div", { className: "mt-3" },
                            React.createElement("small", { className: "text-muted" },
                                "Connected to: origin/",
                                currentBranch))))))));
};
