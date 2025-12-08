// /* eslint-disable @typescript-eslint/no-explicit-any */

// import fs from "fs";
// import { getRunnables, tscPather } from "../../utils";
// import { IRunTime } from "../../../lib";

// export interface TestExecutorConfig {
//   projectName: string;
//   configs: any;
//   summary: any;
//   summaryManager: any;
//   processManager: any;
//   portManager: any;
//   browser: any;
//   webSocketBroadcastMessage: (message: any) => void;
//   // Methods from Server that we need
//   typeCheckIsRunning: (src: string) => void;
//   typeCheckIsNowDone: (src: string, failures: number) => void;
//   lintIsRunning: (src: string) => void;
//   lintIsNowDone: (src: string, failures: number) => void;
//   bddTestIsRunning: (src: string) => void;
//   bddTestIsNowDone: (src: string, failures: number) => void;
//   launchNode: (src: string, dest: string) => Promise<void>;
//   launchWeb: (src: string, dest: string) => Promise<void>;
//   launchPython: (src: string, dest: string) => Promise<void>;
//   launchGolang: (src: string, dest: string) => Promise<void>;
//   addPromiseProcess: (
//     processId: string,
//     promise: Promise<any>,
//     command: string,
//     category: "aider" | "bdd-test" | "build-time" | "other",
//     testName: string,
//     platform: IRunTime,
//     onResolve?: (result: any) => void,
//     onReject?: (error: any) => void
//   ) => string;
//   // Python check methods
//   pythonLintCheck: (entrypoint: string, addableFiles: string[]) => Promise<any>;
//   pythonTypeCheck: (entrypoint: string, addableFiles: string[]) => Promise<any>;
// }

// export class TestExecutor {
//   private config: TestExecutorConfig;

//   constructor(config: TestExecutorConfig) {
//     this.config = config;
//   }

// }
