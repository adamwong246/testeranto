import { IBuiltConfig } from "../Types";
export declare class PitonoBuild {
    private config;
    private testName;
    private watcher;
    constructor(config: IBuiltConfig, testName: string);
    build(): Promise<string[]>;
    rebuild(): Promise<void>;
    stop(): void;
    onBundleChange(callback: () => void): void;
}
