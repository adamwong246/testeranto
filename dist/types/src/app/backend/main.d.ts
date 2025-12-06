import { PM_WithHelpo } from "./PM_WithHelpo.js";
export declare class PM_Main extends PM_WithHelpo {
    constructor(configs: any, name: string, mode: string);
    startBuildProcesses(): Promise<void>;
    private setupTestEnvironment;
    private cleanupPorts;
    private createIpcServer;
    private handleChildProcess;
    launchNode: (src: string, dest: string) => Promise<void>;
    launchWeb: (src: string, dest: string) => Promise<void>;
    launchPython: (src: string, dest: string) => Promise<void>;
    launchGolang: (src: string, dest: string) => Promise<void>;
    private processGoTestOutput;
    private generatePromptFiles;
}
