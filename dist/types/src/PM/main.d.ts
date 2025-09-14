import { PM_WithHelpo } from "./PM_WithHelpo.js";
export declare class PM_Main extends PM_WithHelpo {
    private setupTestEnvironment;
    private cleanupPorts;
    private createIpcServer;
    private handleChildProcess;
    launchPure: (src: string, dest: string) => Promise<void>;
    launchNode: (src: string, dest: string) => Promise<void>;
    launchWeb: (src: string, dest: string) => Promise<void>;
    launchPython: (src: string, dest: string) => Promise<void>;
    launchGolang: (src: string, dest: string) => Promise<void>;
    private processGoTestOutput;
    private generatePromptFiles;
    private getGolangSourceFiles;
}
