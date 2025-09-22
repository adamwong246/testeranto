/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useContext, useEffect, useState } from "react";
import { useGitMode } from "../../useGitMode";
import { GitIntegrationView } from "../pure/GitIntegrationView";
// import { useFileService } from "../../useFileService";
import { FileChange, RemoteStatus } from "../../../FileService";

export const GitIntegrationPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { mode, setMode, isStatic, isDev, isGit } = useGitMode();
  // const [fileService, setFileService] = useState(() => getFileService(mode));
  // const fileService = useFileService()
  const [changes, setChanges] = useState<FileChange[]>([]);
  const [remoteStatus, setRemoteStatus] = useState<RemoteStatus>({
    ahead: 0,
    behind: 0,
  });
  const [currentBranch, setCurrentBranch] = useState("main");
  const [error, setError] = useState<string | null>(null);

  const [commitSummary, setCommitSummary] = useState("");
  const [commitDescription, setCommitDescription] = useState("");

  const [isCommitting, setIsCommitting] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  const handleSaveChanges = async () => {
    if (!commitSummary.trim()) {
      setError("Please provide a commit summary");
      return;
    }

    try {
      setIsCommitting(true);
      setError(null);
      // await fileService.commitChanges(commitSummary, commitDescription);
      setCommitSummary("");
      setCommitDescription("");
      await loadChanges();
      await loadGitStatus();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to commit changes";
      console.error("Failed to commit changes:", err);
      setError(errorMessage);
    } finally {
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
      // await fileService.commitChanges(commitSummary, commitDescription);
      // await fileService.pushChanges();
      // setCommitSummary("");
      setCommitDescription("");
      await loadChanges();
      await loadGitStatus();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to share changes";
      console.error("Failed to share changes:", err);
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
      // await fileService.pullChanges();
      await loadChanges();
      await loadGitStatus();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get updates";
      console.error("Failed to get updates:", err);
      setError(errorMessage);
    } finally {
      setIsPulling(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
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
    } else if (remoteStatus.ahead > 0) {
      return `${remoteStatus.ahead} ahead`;
    } else if (remoteStatus.behind > 0) {
      return `${remoteStatus.behind} behind`;
    } else {
      return "Up to date";
    }
  };

  const getSyncStatusVariant = () => {
    if (remoteStatus.behind > 0) return "warning";
    if (remoteStatus.ahead > 0) return "info";
    return "success";
  };

  const loadGitStatus = async (event?: React.MouseEvent) => {
    // Prevent default behavior if event exists
    if (event) {
      event.preventDefault();
    }

    try {
      setError(null);
      // const branch = await fileService.getCurrentBranch();
      // const status = await fileService.getRemoteStatus();
      setCurrentBranch(branch);
      setRemoteStatus(status);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load git status";
      console.error("Failed to load git status:", err);
      setError(errorMessage);
    }
  };

  const loadChanges = async (event?: React.MouseEvent) => {
    // Prevent default behavior if event exists
    if (event) {
      event.preventDefault();
    }

    try {
      setIsLoading(true);
      setError(null);
      // const changes = await fileService.getChanges();
      setChanges(changes);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load changes";
      console.error("Failed to load changes:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // const changes = await fileService.getChanges();
        setChanges(changes);

        // const branch = await fileService.getCurrentBranch();
        // const status = await fileService.getRemoteStatus();
        // setCurrentBranch(branch);
        // setRemoteStatus(status);
      } catch (err) {
        console.warn("Failed to load data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Set up real-time updates for dev mode
    if (mode === "dev") {
      // const devFileService = fileService as any;

      // const unsubscribeChanges = devFileService.onChanges?.(
      //   (newChanges: FileChange[]) => {
      //     setChanges(newChanges);
      //   }
      // );

      // const unsubscribeStatus = devFileService.onStatusUpdate?.(
      //   (newStatus: RemoteStatus) => {
      //     setRemoteStatus(newStatus);
      //   }
      // );

      // const unsubscribeBranch = devFileService.onBranchUpdate?.(
      //   (newBranch: string) => {
      //     setCurrentBranch(newBranch);
      //   }
      // );

      return () => {
        // unsubscribeChanges?.();
        // unsubscribeStatus?.();
        // unsubscribeBranch?.();
      };
    }
  }, [mode]);

  return (
    <GitIntegrationView
      mode={mode}
      setMode={setMode}
      // fileService={fileService}
      // setChanges={setChanges}
      remoteStatus={remoteStatus}
      changes={changes}
      currentBranch={currentBranch}
      // setIsLoading={setIsLoading}
      isLoading={isLoading}
      // setCurrentBranch={setCurrentBranch}
      // setRemoteStatus={setRemoteStatus}
      setError={setError}
      loadChanges={loadChanges}
      loadGitStatus={loadGitStatus}
      error={error}
      getStatusBadgeVariant={getStatusBadgeVariant}
      commitSummary={commitSummary}
      setCommitSummary={setCommitSummary}
      commitDescription={commitDescription}
      setCommitDescription={setCommitDescription}
      handleSaveChanges={handleSaveChanges}
      isCommitting={isCommitting}
      handleShareChanges={handleShareChanges}
      getSyncStatusVariant={getSyncStatusVariant}
      handleGetUpdates={handleGetUpdates}
      isPulling={isPulling}
      isPushing={isPushing}
      setIsPushing={setIsPushing}
      getSyncStatusText={getSyncStatusText}
      fileService={undefined}
    />
  );
};
