export interface PitonoMetafile {
    errors: any[];
    warnings: any[];
    metafile: {
        inputs: Record<string, {
            bytes: number;
            imports: any[];
        }>;
        outputs: Record<string, {
            imports: any[];
            exports: any[];
            entryPoint: string;
            inputs: Record<string, {
                bytesInOutput: number;
            }>;
            bytes: number;
            signature: string;
        }>;
    };
}
export declare function generatePitonoMetafile(testName: string, entryPoints: string[]): Promise<PitonoMetafile>;
export declare function writePitonoMetafile(testName: string, metafile: PitonoMetafile): void;
