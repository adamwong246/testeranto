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
const App_1 = require("../../App");
const GitIntegrationView = () => {
    const { isConnected } = (0, App_1.useWebSocket)();
    const [mode, setMode] = (0, react_1.useState)(isConnected ? 'dev' : 'static');
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
    const fileService = (0, FileService_1.getFileService)(mode);
    (0, react_1.useEffect)(() => {
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
    return (react_1.default.createElement(react_bootstrap_1.Container, { fluid: true },
        react_1.default.createElement(react_bootstrap_1.Row, { className: "mb-4" },
            react_1.default.createElement(react_bootstrap_1.Col, null,
                react_1.default.createElement("h2", null, "Git Integration"),
                react_1.default.createElement(react_bootstrap_1.Badge, { bg: mode === 'static' ? 'secondary' : mode === 'dev' ? 'success' : 'primary' },
                    mode.toUpperCase(),
                    " MODE"),
                mode === 'static' && (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "info", className: "mt-2" },
                    react_1.default.createElement("small", null, "Static mode: Read-only access. Switch to Development mode for full Git functionality."))))),
        error && (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "danger", onClose: () => setError(null), dismissible: true }, error)),
        react_1.default.createElement(react_bootstrap_1.Row, null,
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
                    react_1.default.createElement(react_bootstrap_1.Card.Header, null,
                        react_1.default.createElement("h5", null, "Sync with Remote")),
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
                            react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-success", disabled: mode === 'static' || remoteStatus.ahead === 0, onClick: () => fileService.pushChanges() },
                                "Share Changes (",
                                remoteStatus.ahead,
                                ")")),
                        react_1.default.createElement("div", { className: "mt-3" },
                            react_1.default.createElement("small", { className: "text-muted" },
                                "Connected to: origin/",
                                currentBranch))))))));
};
exports.GitIntegrationView = GitIntegrationView;
