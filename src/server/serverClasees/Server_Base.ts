import { Browser } from "puppeteer-core";
import { IBuiltConfig } from "../../Types";
import { IMode } from "../types";

export abstract class Server_Base {
  mode: IMode;
  browser: Browser;
  configs: IBuiltConfig;
  projectName: string;

  constructor(configs: IBuiltConfig, projectName: string, mode: IMode) {
    this.configs = configs;
    this.mode = mode;
    this.projectName = projectName;
  }
}
