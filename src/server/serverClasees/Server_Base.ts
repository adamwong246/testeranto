import { IBuiltConfig } from "../../Types";
import { IMode } from "../types";

export abstract class Server_Base {
  mode: IMode;
  configs: IBuiltConfig;
  projectName: string;

  constructor(configs: IBuiltConfig, projectName: string, mode: IMode) {
    this.configs = configs;
    this.mode = mode;
    this.projectName = projectName;
  }

  async start() {
    console.log(`[Server_Base] start()`)

  }

  async stop() {
    console.log(`[Server_Base] stop()`)
    process.exit()

  }


}
