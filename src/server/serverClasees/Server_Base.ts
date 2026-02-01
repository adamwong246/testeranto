
import { ITestconfigV2 } from "../../Types";
import { IMode } from "../types";

export abstract class Server_Base {
  mode: IMode;
  configs: ITestconfigV2;


  constructor(configs: ITestconfigV2, mode: IMode) {
    this.configs = configs;
    this.mode = mode;

    console.log(`[Base] ${this.configs}`)

  }

  async start() {
    // console.log(`[Server_Base] start()`)
  }

  async stop() {
    console.log(`[Server_Base] stop()`)
    process.exit()
  }


}
