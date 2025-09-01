export interface PitonoMetafile {
    testName: string;
    entryPoints: string[];
    timestamp: number;
}
export declare function generatePitonoMetafile(testName: string, entryPoints: string[]): Promise<PitonoMetafile>;
export declare function writePitonoMetafile(testName: string, metafile: PitonoMetafile): void;
