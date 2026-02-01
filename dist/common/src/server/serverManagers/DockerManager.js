"use strict";
// // Do not allow imports from outside the project (fs, exec, ws, etc)
// import { RUN_TIMES } from "../../runtimes";
// import { IBuiltConfig, IRunTime } from "../../Types";
// import { golangBddCommand, golangDockerComposeFile } from "../runtimes/golang/docker";
// import { javaBddCommand, javaDockerComposeFile } from "../runtimes/java/docker";
// import { nodeDockerComposeFile, nodeBddCommand } from "../runtimes/node/docker";
// import { pythonBDDCommand, pythonDockerComposeFile } from "../runtimes/python/docker";
// import { rubyBddCommand, rubyDockerComposeFile } from "../runtimes/ruby/docker";
// import { rustBddCommand, rustDockerComposeFile } from "../runtimes/rust/docker";
// import { webBddCommand, webDockerComposeFile } from "../runtimes/web/docker";
// export type IService = any;
// export interface IDockerComposeResult {
//   exitCode: number;
//   out: string;
//   err: string;
//   data: any;
// }
// export class DockerManager {
//   cwd: string;
//   composeFile: string;
//   projectName: string
//   constructor(composeFile: string, projectName: string) {
//     this.cwd = process.cwd();
//     this.composeFile = composeFile
//     this.projectName = projectName
//   }
// }
