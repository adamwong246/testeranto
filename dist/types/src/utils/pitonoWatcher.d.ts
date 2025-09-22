export declare class PitonoWatcher {
    private watcher;
    private testName;
    private entryPoints;
    private onChangeCallback;
    constructor(testName: string, entryPoints: string[]);
    start(): Promise<void>;
    private handleFileChange;
    private readAndCheckSignature;
    regenerateMetafile(): Promise<void>;
    onMetafileChange(callback: () => void): void;
    stop(): void;
}
