import { IBuiltConfig } from "../../Types.js";
import { PM_WithEslintAndTsc } from "./PM_WithEslintAndTsc.js";
export declare abstract class PM_WithGit extends PM_WithEslintAndTsc {
    gitWatchTimeout: NodeJS.Timeout | null;
    gitWatcher: any;
    constructor(configs: IBuiltConfig, name: any, mode: any);
    private handleGitChanges;
    private handleGitFileStatus;
    private handleGitCommit;
    private handleGitPush;
    private handleGitPull;
    private handleGitBranch;
    private handleGitHubTokenExchange;
    private handleGitRemoteStatus;
    private getGitFileStatus;
    private executeGitCommit;
    private executeGitPush;
    private executeGitPull;
    onBuildDone(): void;
    startGitWatcher(): Promise<void>;
    private getGitChanges;
    private getGitRemoteStatus;
    private getCurrentGitBranch;
}
