// // This Server manages processes-as-docker-commands. Processes are scheduled in queue.
// // It should also leverage Server_HTTP and SERVER_WS

// import { IRunTime } from "../../Types";
// import { Server_AiderManager } from "./Server_AiderManager";
// import { golangBddCommand } from "../runtimes/golang/docker";
// import { nodeBddCommand } from "../runtimes/node/docker";
// import { pythonBDDCommand } from "../runtimes/python/docker";
// import { webBddCommand } from "../runtimes/web/docker";

// export class Server_Scheduler extends Server_AiderManager {

//   constructor(configs: any, name: string, mode: any, routes) {
//     super(configs, name, mode, routes);
//   }

//   async start() {
//     console.log(`[Server_Scheduler] start()`)
//     super.start()
//   }

//   async stop() {
//     console.log(`[Server_Scheduler] stop()`)
//     super.stop()
//   }

//   async scheduleBddTest(
//     entrypoint: string,
//     runtime: IRunTime,
//     sourceFiles: string[]
//   ): Promise<void> {
//     console.log(
//       `[Scheduler] scheduleBddTest called for ${entrypoint} (${runtime})`
//     );

//     try {
//       await this.createAiderProcess(runtime, entrypoint, sourceFiles);
//     } catch (error) {
//       console.error(`[Scheduler] Error creating aider process:`, error);
//     }

//     const processId = `allTests-${runtime}-${entrypoint}-bdd`;

//     if (runtime === "node") {
//       super.runTestInDocker(processId, entrypoint, runtime, nodeBddCommand(this.configs.httpPort));
//     } else if (runtime === "web") {
//       super.runTestInDocker(processId, entrypoint, runtime, webBddCommand(this.configs.httpPort));
//     } else if (runtime === "python") {
//       super.runTestInDocker(processId, entrypoint, runtime, pythonBDDCommand(this.configs.httpPort));
//     } else if (runtime === "golang") {
//       super.runTestInDocker(processId, entrypoint, runtime, golangBddCommand(this.configs.httpPort));
//     } else {
//       throw 'unknown runtime'
//     }

//   }

//   async scheduleStaticTests(
//     entrypoint: string,
//     runtime: IRunTime,
//     sourceFiles: string[]
//   ): Promise<void> {

//     console.log(`[Scheduler] scheduleStaticTests( ${runtime}, ${entrypoint}, ${sourceFiles})`);

//     this.configs[runtime][entrypoint].checks.forEach((c, ndx) => {
//       const processId = `allTests-${runtime}-${entrypoint}-static-${ndx}`;
//       super.runTestInDocker(processId, entrypoint, runtime, c(sourceFiles));
//     })

//   }

// }
