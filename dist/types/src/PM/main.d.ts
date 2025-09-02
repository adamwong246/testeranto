import { PM_WithProcesses } from "./PM_WithProcesses.js";
export declare class PM_Main extends PM_WithProcesses {
    launchPure: (src: string, dest: string) => Promise<void>;
    launchNode: (src: string, dest: string) => Promise<void>;
    launchWeb: (src: string, dest: string) => Promise<void>;
    launchPython: (src: string, dest: string) => Promise<void>;
    launchGolang: (src: string, dest: string) => Promise<void>;
}
