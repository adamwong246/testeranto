/* eslint-disable @typescript-eslint/no-explicit-any */

export interface GolingvuMetafile {
  errors: any[];
  warnings: any[];
  metafile: {
    inputs: Record<
      string,
      {
        bytes: number;
        imports: {
          path: string;
          kind: string;
          external?: boolean;
        }[];
        format?: string;
      }
    >;
    outputs: Record<
      string,
      {
        imports: any[];
        exports: any[];
        entryPoint: string;
        inputs: Record<
          string,
          {
            bytesInOutput: number;
          }
        >;
        bytes: number;
        signature: string;
      }
    >;
  };
}

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
