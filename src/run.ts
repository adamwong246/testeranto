import ansiC from "ansi-colors";
import readline from "readline";

import { PM_Main } from "./PM/main";
import { ITestconfig, IBuiltConfig, IProject } from "./Types";

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

console.log(ansiC.inverse("Press 'q' to initiate a graceful shutdown."));
console.log(ansiC.inverse("Press 'x' to quit forcefully."));

process.stdin.on("keypress", (str, key) => {
  if (key.name === "x") {
    console.log(ansiC.inverse("Shutting down forcefully..."));
    process.exit(-1);
  }
});

const projectName = process.argv[2];

const mode = process.argv[3] as "once" | "dev";
if (mode !== "once" && mode !== "dev") {
  console.error("the 2nd argument should be 'dev' or 'once' ");
  process.exit(-1);
}

import(process.cwd() + "/" + "testeranto.config.ts").then(async (module) => {
  const bigConfig: IProject = module.default;

  const rawConfig: ITestconfig = bigConfig.projects[projectName];

  const config: IBuiltConfig = {
    ...rawConfig,
    buildDir: process.cwd() + "/" + `testeranto/${projectName}.json`,
  };

  const pm = new PM_Main(config, projectName, mode);
  pm.start();

  process.stdin.on("keypress", (str, key) => {
    if (key.name === "q") {
      pm.stop();
    }
  });
});
