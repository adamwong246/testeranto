export interface GolingvuMetafile {
    errors: any[];
    warnings: any[];
    metafile: {
        inputs: Record<string, {
            bytes: number;
            imports: {
                path: string;
                kind: string;
                external?: boolean;
            }[];
            format?: string;
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
export declare function generateGolingvuMetafile(testName: string, entryPoints: string[]): Promise<GolingvuMetafile>;
export declare function writeGolingvuMetafile(testName: string, metafile: GolingvuMetafile): void;
