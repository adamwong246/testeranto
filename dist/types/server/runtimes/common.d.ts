import { IBuiltConfig } from "../../Types";
export interface BuildOptions {
    config: IBuiltConfig;
    entryPoints: string[];
    configPath: string;
    bundlesDir: string;
    metafileSubdir: string;
}
export declare function computeFilesHash(files: string[]): Promise<string>;
export declare function sendSourceFilesUpdated(config: IBuiltConfig, hash: string, files: string[], testName: string, runtime: 'node' | 'web'): Promise<void>;
export declare function extractInputFilesFromMetafile(metafile: any): string[];
export declare function processMetafile(config: IBuiltConfig, metafile: any, runtime: 'node' | 'web'): Promise<void>;
