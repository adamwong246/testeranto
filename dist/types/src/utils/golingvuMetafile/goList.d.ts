export interface GoListOutput {
    Dir: string;
    ImportPath: string;
    ImportComment?: string;
    Name: string;
    Target?: string;
    Stale?: boolean;
    StaleReason?: string;
    Root?: string;
    GoFiles?: string[];
    CgoFiles?: string[];
    IgnoredGoFiles?: string[];
    CFiles?: string[];
    CXXFiles?: string[];
    MFiles?: string[];
    HFiles?: string[];
    FFiles?: string[];
    SFiles?: string[];
    SwigFiles?: string[];
    SwigCXXFiles?: string[];
    SysoFiles?: string[];
    Imports?: string[];
    Deps?: string[];
    TestImports?: string[];
    XTestImports?: string[];
    Module?: {
        Path: string;
        Version: string;
        Replace?: {
            Path: string;
            Version: string;
        };
        Main: boolean;
        Dir: string;
        GoMod: string;
        GoVersion: string;
    };
    Match?: string[];
    DepOnly?: boolean;
    Standard?: boolean;
}
export declare function runGoList(pattern: string): GoListOutput[];
