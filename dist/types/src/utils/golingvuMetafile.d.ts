export interface GolingvuBuildResult {
    errors: any[];
    warnings: any[];
    metafile?: {
        inputs: Record<string, {
            bytes: number;
            imports: any[];
        }>;
        outputs: Record<string, {
            bytes: number;
            inputs: Record<string, {
                bytesInOutput: number;
            }>;
            entryPoint: string;
        }>;
    };
}
export declare function generateGolangMetafile(testName: string, entryPoints: string[]): Promise<GolingvuBuildResult>;
export declare function writeGolangMetafile(testName: string, metafile: GolingvuBuildResult): void;
