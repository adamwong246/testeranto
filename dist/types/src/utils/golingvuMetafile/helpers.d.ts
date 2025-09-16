export declare function findProjectRoot(): string;
export declare function findAndParseGoMod(startDir: string): {
    root: string;
    modulePath: string;
} | null;
export declare function calculateImportPath(filePath: string): string | null;
export declare function normalizeImportPath(importPath: string): string;
