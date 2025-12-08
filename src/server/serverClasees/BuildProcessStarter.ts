import { IBuiltConfig } from "../../Types";
import { BuildProcessManager } from "./BuildProcessManager";
import nodeEsbuildConfiger from "./../../esbuildConfigs/node";
import webEsbuildConfiger from "./../../esbuildConfigs/web";
import { getRunnables } from "../utils";

export class BuildProcessStarter {
  constructor(
    private projectName: string,
    private configs: IBuiltConfig,
    private buildProcessManager: BuildProcessManager
  ) {}

  async startBuildProcesses(): Promise<void> {
    const { nodeEntryPoints, webEntryPoints } = getRunnables(
      this.configs,
      this.projectName
    );

    // Start all build processes (only node, web, pure)
    await Promise.all([
      this.buildProcessManager.startBuildProcess(
        nodeEsbuildConfiger,
        nodeEntryPoints,
        "node"
      ),
      this.buildProcessManager.startBuildProcess(
        webEsbuildConfiger,
        webEntryPoints,
        "web"
      ),
      // this.buildProcessManager.startBuildProcess(esbuildImportConfiger, pureEntryPoints, "pure"),
    ]);
  }
}
