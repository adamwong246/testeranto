import { IBuiltConfig } from "../../lib";
// import { getRunnables } from "../utils";
// import nodeEsbuildConfiger from "./../../esbuildConfigs/node";
// import webEsbuildConfiger from "./../../esbuildConfigs/web";
// import { BuildProcessManager } from "./BuildProcessManager";

export class BuildProcessStarter {
  constructor(
    private projectName: string,
    private configs: IBuiltConfig // private buildProcessManager: BuildProcessManager
  ) {}

  async startBuildProcesses(): Promise<void> {
    // const { nodeEntryPoints, webEntryPoints } = getRunnables(
    //   this.configs,
    //   this.projectName
    // );
    // Start all build processes (only node, web)
    // golang and python are elsewhere?
    // await Promise.all([
    //   this.buildProcessManager.startBuildProcess(
    //     nodeEsbuildConfiger,
    //     nodeEntryPoints,
    //     "node"
    //   ),
    //   this.buildProcessManager.startBuildProcess(
    //     webEsbuildConfiger,
    //     webEntryPoints,
    //     "web"
    //   ),
    //   // this.buildProcessManager.startBuildProcess(esbuildImportConfiger, pureEntryPoints, "pure"),
    // ]);
  }
}
