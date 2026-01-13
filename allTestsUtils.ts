import { IChecks, IDockerSteps } from "./src/Types";

export const createLangConfig = (
  testFile: string,
  checks: IChecks,
  options?: {
    plugins?: any[];
    loaders?: Record<string, string>;
    externals?: string[];
    testBlocks?: [IDockerSteps, string][][];
    prodBlocks?: [IDockerSteps, string][][];
    volumes: string[]
  }
) => {
  return {
    plugins: options?.plugins || [],
    loaders: options?.loaders || {},
    tests: { [testFile]: { ports: 0 } },
    externals: options?.externals || [],
    test: options?.testBlocks,
    prod: options?.prodBlocks,
    checks,
    volumes: options?.volumes
  };
};
