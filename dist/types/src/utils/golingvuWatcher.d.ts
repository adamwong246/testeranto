export declare class GolingvuWatcher {
    private watcher;
    private testName;
    private entryPoints;
    private onChangeCallback;
    private debounceTimer;
    constructor(testName: string, entryPoints: string[]);
    start(): Promise<void>;
    private handleFileChange;
    private readAndCheckSignature;
    private regenerateMetafile;
    onMetafileChange(callback: () => void): void;
    stop(): void;
}
