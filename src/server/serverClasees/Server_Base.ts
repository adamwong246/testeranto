import { IBuiltConfig } from "../../Types";
import { IMode } from "../types";

export abstract class Server_Base {
  mode: IMode;
  configs: IBuiltConfig;
  projectName: string;
  configsV2: string[];

  constructor(configs: IBuiltConfig, projectName: string, mode: IMode) {
    this.configs = configs;
    this.mode = mode;
    this.projectName = projectName;

    this.configsV2 = ['node.js', 'web.js', 'golang.go', 'python.py'];
  }

  async start() {
    console.log(`[Server_Base] start()`)

  }

  async stop() {
    console.log(`[Server_Base] stop()`)
    process.exit()

  }


}
