"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitIntegrationView = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const FileService_1 = require("../../services/FileService");
const useGitMode_1 = require("../../hooks/useGitMode");
const GitIntegrationView = () => {
    const { mode, setMode, isStatic, isDev, isGit } = (0, useGitMode_1.useGitMode)();
    const [changes, setChanges] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [commitSummary, setCommitSummary] = (0, react_1.useState)('');
    const [commitDescription, setCommitDescription] = (0, react_1.useState)('');
    const [remoteStatus, setRemoteStatus] = (0, react_1.useState)({ ahead: 0, behind: 0 });
    const [currentBranch, setCurrentBranch] = (0, react_1.useState)('main');
    const [isCommitting, setIsCommitting] = (0, react_1.useState)(false);
    const [isPushing, setIsPushing] = (0, react_1.useState)(false);
    const [isPulling, setIsPulling] = (0, react_1.useState)(false);
    const [fileService, setFileService] = (0, react_1.useState)(() => (0, FileService_1.getFileService)(mode));
    (0, react_1.useEffect)(() => {
        const newFileService = (0, FileService_1.getFileService)(mode);
        setFileService(newFileService);
        // We can't call loadChanges and loadGitStatus here directly because they use fileService state
        // Instead, we'll set up a separate effect to trigger when fileService changes
    }, [mode]);
    // Add a new effect to load data when fileService changes
    (0, react_1.useEffect)(() => {
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
    return (react_1.default.createElement(react_bootstrap_1.Container, { fluid: true },
        react_1.default.createElement(react_bootstrap_1.Row, { className: "mb-4" },
            react_1.default.createElement(react_bootstrap_1.Col, null,
                react_1.default.createElement("h2", null, "Git Integration"),
                react_1.default.createElement("div", { className: "d-flex align-items-center gap-2" },
                    react_1.default.createElement(react_bootstrap_1.Badge, { bg: mode === 'static' ? 'secondary' : mode === 'dev' ? 'success' : 'primary' },
                        mode.toUpperCase(),
                        " MODE"),
                    react_1.default.createElement("select", { className: "form-select form-select-sm", style: { width: 'auto' }, value: mode, onChange: (e) => setMode(e.target.value) },
                        react_1.default.createElement("option", { value: "static" }, "Static (Read-only)"),
                        react_1.default.createElement("option", { value: "dev" }, "Development (Read-write)"),
                        react_1.default.createElement("option", { value: "git" }, "Git Remote"))),
                mode === 'static' && (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "info", className: "mt-2" },
                    react_1.default.createElement("small", null, "Static mode: Read-only access. Git operations are not available in this mode."))),
                mode === 'git' && (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "warning", className: "mt-2" },
                    react_1.default.createElement("small", null, "Git Remote mode: Git-based collaboration. Some features may be limited."))))),
        error && (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "danger", onClose: () => setError(null), dismissible: true }, error)),
        mode !== 'static' && (react_1.default.createElement(react_bootstrap_1.Row, null,
            react_1.default.createElement(react_bootstrap_1.Col, { md: 4 },
                react_1.default.createElement(react_bootstrap_1.Card, null,
                    react_1.default.createElement(react_bootstrap_1.Card.Header, { className: "d-flex justify-content-between align-items-center" },
                        react_1.default.createElement("h5", { className: "mb-0" }, "Changes"),
                        react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-secondary", size: "sm", onClick: loadChanges, disabled: isLoading }, isLoading ? react_1.default.createElement(react_bootstrap_1.Spinner, { animation: "border", size: "sm" }) : '↻')),
                    react_1.default.createElement(react_bootstrap_1.Card.Body, { style: { maxHeight: '400px', overflowY: 'auto' } }, isLoading ? (react_1.default.createElement("div", { className: "text-center" },
                        react_1.default.createElement(react_bootstrap_1.Spinner, { animation: "border" }),
                        react_1.default.createElement("div", null, "Loading changes..."))) : changes.length === 0 ? (react_1.default.createElement("div", { className: "text-center text-muted" }, "No changes detected")) : (react_1.default.createElement("div", null, changes.map((change, index) => (react_1.default.createElement("div", { key: index, className: "d-flex align-items-center mb-2" },
                        react_1.default.createElement(react_bootstrap_1.Badge, { bg: getStatusBadgeVariant(change.status), className: "me-2" }, change.status.charAt(0).toUpperCase() + change.status.slice(1)),
                        react_1.default.createElement("span", { className: "small text-truncate" }, change.path))))))))),
            react_1.default.createElement(react_bootstrap_1.Col, { md: 4 },
                react_1.default.createElement(react_bootstrap_1.Card, null,
                    react_1.default.createElement(react_bootstrap_1.Card.Header, null,
                        react_1.default.createElement("h5", null, "Commit Changes")),
                    react_1.default.createElement(react_bootstrap_1.Card.Body, null,
                        react_1.default.createElement("div", { className: "mb-3" },
                            react_1.default.createElement("label", { htmlFor: "summary", className: "form-label" }, "Summary *"),
                            react_1.default.createElement("input", { type: "text", className: "form-control", id: "summary", placeholder: "What did you change?", value: commitSummary, onChange: (e) => setCommitSummary(e.target.value), disabled: mode === 'static' }),
                            react_1.default.createElement("div", { className: "form-text" },
                                commitSummary.length,
                                "/72 characters")),
                        react_1.default.createElement("div", { className: "mb-3" },
                            react_1.default.createElement("label", { htmlFor: "description", className: "form-label" }, "Description"),
                            react_1.default.createElement("textarea", { className: "form-control", id: "description", rows: 3, placeholder: "Why did you change it?", value: commitDescription, onChange: (e) => setCommitDescription(e.target.value), disabled: mode === 'static' })),
                        react_1.default.createElement("div", { className: "d-grid gap-2" },
                            react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: handleSaveChanges, disabled: mode === 'static' || isCommitting || changes.length === 0 || !commitSummary.trim() }, isCommitting ? (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement(react_bootstrap_1.Spinner, { animation: "border", size: "sm", className: "me-2" }),
                                "Saving...")) : ('Save to Computer')),
                            react_1.default.createElement(react_bootstrap_1.Button, { variant: "success", onClick: handleShareChanges, disabled: mode === 'static' || isCommitting || isPushing || changes.length === 0 || !commitSummary.trim() }, isPushing ? (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement(react_bootstrap_1.Spinner, { animation: "border", size: "sm", className: "me-2" }),
                                "Sharing...")) : ('Save & Share')))))),
            react_1.default.createElement(react_bootstrap_1.Col, { md: 4 },
                react_1.default.createElement(react_bootstrap_1.Card, null,
                    react_1.default.createElement(react_bootstrap_1.Card.Header, { className: "d-flex justify-content-between align-items-center" },
                        react_1.default.createElement("h5", { className: "mb-0" }, "Sync with Remote"),
                        react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-secondary", size: "sm", onClick: (e) => loadGitStatus(e) }, "\u21BB")),
                    react_1.default.createElement(react_bootstrap_1.Card.Body, null,
                        react_1.default.createElement("div", { className: "text-center mb-3" },
                            react_1.default.createElement(react_bootstrap_1.Badge, { bg: getSyncStatusVariant() }, getSyncStatusText()),
                            react_1.default.createElement("div", { className: "small text-muted mt-1" },
                                "Branch: ",
                                currentBranch)),
                        react_1.default.createElement("div", { className: "d-grid gap-2" },
                            react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-primary", onClick: handleGetUpdates, disabled: mode === 'static' || isPulling }, isPulling ? (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement(react_bootstrap_1.Spinner, { animation: "border", size: "sm", className: "me-2" }),
                                "Updating...")) : ('Get Updates')),
                            react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-success", disabled: mode === 'static' || remoteStatus.ahead === 0, onClick: async (e) => {
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
                                } }, isPushing ? (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement(react_bootstrap_1.Spinner, { animation: "border", size: "sm", className: "me-2" }),
                                "Sharing...")) : (`Share Changes (${remoteStatus.ahead})`))),
                        react_1.default.createElement("div", { className: "mt-3" },
                            react_1.default.createElement("small", { className: "text-muted" },
                                "Connected to: origin/",
                                currentBranch))))))),
        mode === 'static' && (react_1.default.createElement(react_bootstrap_1.Row, null,
            react_1.default.createElement(react_bootstrap_1.Col, null,
                react_1.default.createElement(react_bootstrap_1.Alert, { variant: "info", className: "text-center" },
                    react_1.default.createElement("h5", null, "Git Operations Not Available"),
                    react_1.default.createElement("p", null, "Git functionality is disabled in Static Mode. Switch to Development or Git Remote mode to access version control features.")))))));
};
exports.GitIntegrationView = GitIntegrationView;
