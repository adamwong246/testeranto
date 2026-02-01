export {};
// export type ITestconfig = {
//   httpPort: number;
//   featureIngestor: (s: string) => Promise<string>;
//   importPlugins: IPluginFactory[];
//   ports: string[];
//   src: string;
//   check: string;
//   java: {
//     plugins: any[];
//     tests: Record<string, { ports: number }>;
//     loaders: Record<string, string>;
//     checks: IChecks;
//     dockerfile: string;
//   };
//   rust: {
//     plugins: any[];
//     tests: Record<string, { ports: number }>;
//     loaders: Record<string, string>;
//     checks: IChecks;
//     dockerfile: string;
//   };
//   ruby: {
//     plugins: any[];
//     tests: Record<string, { ports: number }>;
//     loaders: Record<string, string>;
//     checks: IChecks;
//     dockerfile: string;
//   };
//   golang: {
//     plugins: any[];
//     tests: Record<string, { ports: number }>;
//     loaders: Record<string, string>;
//     checks: IChecks;
//     dockerfile: string;
//   };
//   python: {
//     plugins: any[];
//     tests: Record<string, { ports: number }>;
//     loaders: Record<string, string>;
//     checks: IChecks;
//     dockerfile: string;
//   };
//   node: {
//     plugins: any[];
//     tests: Record<string, { ports: number }>;
//     loaders: Record<string, string>;
//     externals: string[];
//     checks: IChecks;
//     dockerfile: string;
//   };
//   web: {
//     plugins: any[];
//     tests: Record<string, { ports: number }>;
//     loaders: Record<string, string>;
//     externals: string[];
//     checks: IChecks;
//     dockerfile: string;
//   };
// };
// export type IBuiltConfig = { buildDir: string } & ITestconfig;
// export type IConfig = Map<string, [IRunTime, string, string, { tests: string[] }]>
