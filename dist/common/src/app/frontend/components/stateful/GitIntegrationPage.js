"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
exports.GitIntegrationPage = void 0;
const react_1 = __importStar(require("react"));
const useGitMode_1 = require("../../useGitMode");
const GitIntegrationView_1 = require("../pure/GitIntegrationView");
const FileServiceContext_1 = require("../../FileServiceContext");
// import { FileChange, RemoteStatus } from "../../../appCommon/FileService";
// import { useFileService } from "../../../appCommon/FileServiceContext";
const GitIntegrationPage = () => {
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const { mode, setMode, isStatic, isDev, isGit } = (0, useGitMode_1.useGitMode)();
    // const [fileService, setFileService] = useState(() => getFileService(mode));
    const fileService = (0, FileServiceContext_1.useFileService)();
    const [changes, setChanges] = (0, react_1.useState)([]);
    const [remoteStatus, setRemoteStatus] = (0, react_1.useState)({
        ahead: 0,
        behind: 0,
    });
    const [currentBranch, setCurrentBranch] = (0, react_1.useState)("main");
    const [error, setError] = (0, react_1.useState)(null);
    const [commitSummary, setCommitSummary] = (0, react_1.useState)("");
    const [commitDescription, setCommitDescription] = (0, react_1.useState)("");
    const [isCommitting, setIsCommitting] = (0, react_1.useState)(false);
    const [isPushing, setIsPushing] = (0, react_1.useState)(false);
    const [isPulling, setIsPulling] = (0, react_1.useState)(false);
    const handleSaveChanges = async () => {
        if (!commitSummary.trim()) {
            setError("Please provide a commit summary");
            return;
        }
        try {
            setIsCommitting(true);
            setError(null);
            await fileService.commitChanges(commitSummary, commitDescription);
            setCommitSummary("");
            setCommitDescription("");
            await loadChanges();
            await loadGitStatus();
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to commit changes";
            console.error("Failed to commit changes:", err);
            setError(errorMessage);
        }
        finally {
            setIsCommitting(false);
        }
    };
    const handleShareChanges = async () => {
        if (!commitSummary.trim()) {
            setError("Please provide a commit summary");
            return;
        }
        try {
            setIsCommitting(true);
            setIsPushing(true);
            setError(null);
            await fileService.commitChanges(commitSummary, commitDescription);
            await fileService.pushChanges();
            setCommitSummary("");
            setCommitDescription("");
            await loadChanges();
            await loadGitStatus();
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to share changes";
            console.error("Failed to share changes:", err);
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
            const errorMessage = err instanceof Error ? err.message : "Failed to get updates";
            console.error("Failed to get updates:", err);
            setError(errorMessage);
        }
        finally {
            setIsPulling(false);
        }
    };
    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "modified":
                return "warning";
            case "added":
                return "success";
            case "deleted":
                return "danger";
            case "conflicted":
                return "danger";
            default:
                return "secondary";
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
            return "Up to date";
        }
    };
    const getSyncStatusVariant = () => {
        if (remoteStatus.behind > 0)
            return "warning";
        if (remoteStatus.ahead > 0)
            return "info";
        return "success";
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
            const errorMessage = err instanceof Error ? err.message : "Failed to load git status";
            console.error("Failed to load git status:", err);
            setError(errorMessage);
        }
    };
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
            const errorMessage = err instanceof Error ? err.message : "Failed to load changes";
            console.error("Failed to load changes:", err);
            setError(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        var _a, _b, _c;
        const loadData = async () => {
            try {
                setIsLoading(true);
                const changes = await fileService.getChanges();
                setChanges(changes);
                const branch = await fileService.getCurrentBranch();
                const status = await fileService.getRemoteStatus();
                setCurrentBranch(branch);
                setRemoteStatus(status);
            }
            catch (err) {
                console.warn("Failed to load data:", err);
            }
            finally {
                setIsLoading(false);
            }
        };
        loadData();
        // Set up real-time updates for dev mode
        if (mode === "dev") {
            const devFileService = fileService;
            const unsubscribeChanges = (_a = devFileService.onChanges) === null || _a === void 0 ? void 0 : _a.call(devFileService, (newChanges) => {
                setChanges(newChanges);
            });
            const unsubscribeStatus = (_b = devFileService.onStatusUpdate) === null || _b === void 0 ? void 0 : _b.call(devFileService, (newStatus) => {
                setRemoteStatus(newStatus);
            });
            const unsubscribeBranch = (_c = devFileService.onBranchUpdate) === null || _c === void 0 ? void 0 : _c.call(devFileService, (newBranch) => {
                setCurrentBranch(newBranch);
            });
            return () => {
                unsubscribeChanges === null || unsubscribeChanges === void 0 ? void 0 : unsubscribeChanges();
                unsubscribeStatus === null || unsubscribeStatus === void 0 ? void 0 : unsubscribeStatus();
                unsubscribeBranch === null || unsubscribeBranch === void 0 ? void 0 : unsubscribeBranch();
            };
        }
    }, [mode]);
    return (react_1.default.createElement(GitIntegrationView_1.GitIntegrationView, { mode: mode, setMode: setMode, fileService: fileService, setChanges: setChanges, remoteStatus: remoteStatus, changes: changes, currentBranch: currentBranch, setIsLoading: setIsLoading, isLoading: isLoading, setCurrentBranch: setCurrentBranch, setRemoteStatus: setRemoteStatus, setError: setError, loadChanges: loadChanges, loadGitStatus: loadGitStatus, error: error, getStatusBadgeVariant: getStatusBadgeVariant, commitSummary: commitSummary, setCommitSummary: setCommitSummary, commitDescription: commitDescription, setCommitDescription: setCommitDescription, handleSaveChanges: handleSaveChanges, isCommitting: isCommitting, handleShareChanges: handleShareChanges, getSyncStatusVariant: getSyncStatusVariant, handleGetUpdates: handleGetUpdates, isPulling: isPulling, isPushing: isPushing, setIsPushing: setIsPushing, getSyncStatusText: getSyncStatusText }));
};
exports.GitIntegrationPage = GitIntegrationPage;
