export type IBaseConfig = {
  clearScreen: boolean;
  devMode: boolean;
  features: string;
  plugins: any[];
  minify: boolean;
  outbase: string;
  outdir: string;
  ports: string[];
  tests: string;
};

export type IRunTime = `node` | `web`;

export type ITestTypes = [
  string,
  IRunTime,
  ITestTypes[]
];
