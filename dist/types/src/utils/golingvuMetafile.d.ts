import { GolingvuMetafile } from "./golingvuMetafile/types";
export declare function generateGolingvuMetafile(testName: string, entryPoints: string[]): Promise<GolingvuMetafile>;
export declare function writeGolingvuMetafile(testName: string, metafile: GolingvuMetafile): void;
