import path from "path";
import { IBuiltConfig, ITestconfig } from "../Types";

export async function loadConfig(configFilepath: string): Promise<{ config: IBuiltConfig; testsName: string }> {
  const testsName = path
    .basename(configFilepath)
    .split(".")
    .slice(0, -1)
    .join(".");

  const module = await import(`${process.cwd()}/${configFilepath}`);
  const bigConfig: ITestconfig = module.default;

  const config: IBuiltConfig = {
    ...bigConfig,
    buildDir: process.cwd() + "/testeranto/bundles/" + testsName,
  };

  return { config, testsName };
}
