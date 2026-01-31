import { IBuiltConfig, IConfig } from "../../Types";
import { IMode } from "../types";

export abstract class Server_Base {
  mode: IMode;
  configs: IConfig;


  constructor(configs: IConfig, mode: IMode) {
    this.configs = configs;
    this.mode = mode;

  }

  async start() {
    console.log(`[Server_Base] start()`)

  }

  async stop() {
    console.log(`[Server_Base] stop()`)
    process.exit()

  }


}
