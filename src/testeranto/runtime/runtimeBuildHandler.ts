import fs from "fs";
import { getRunnables } from "../../app/backend/utils";
import TesterantoDocker from "../infrastructure/docker/TesterantoDocker";
// import { GolingvuBuild } from "../PM/golingvuBuild";
// import { PitonoBuild } from "../PM/pitonoBuild";
import { setupWebHtmlFiles } from "./webHtmlGenerator";
import { IBuiltConfig, IRunTime } from "../../../Types";

export async function handleRuntimeBuilds(
  config: IBuiltConfig,
  testsName: string,
  dockerMan: TesterantoDocker
) {
  const {
    nodeEntryPoints,
    webEntryPoints,
    pythonEntryPoints,
    golangEntryPoints,
  } = getRunnables(config, testsName);

  // Setup web HTML files
  await setupWebHtmlFiles(config, testsName);

  // // Handle golingvu (Golang) tests
  // const hasGolangTests = Object.keys(config.golang).length > 0;
  // if (hasGolangTests) {
  //   const golingvuBuild = new GolingvuBuild(config, testsName);
  //   const golangEntryPoints = await golingvuBuild.build();
  //   golingvuBuild.onBundleChange(() => {
  //     Object.keys(golangEntryPoints).forEach((entryPoint) => {
  //       dockerMan.onBundleChange(entryPoint, "golang");
  //     });
  //   });
  // }

  // // Handle pitono (Python) tests
  // const hasPitonoTests = Object.keys(config.python).length > 0;
  // if (hasPitonoTests) {
  //   const pitonoBuild = new PitonoBuild(config, testsName);
  //   const pitonoEntryPoints = await pitonoBuild.build();
  //   pitonoBuild.onBundleChange(() => {
  //     Object.keys(pitonoEntryPoints).forEach((entryPoint) => {
  //       dockerMan.onBundleChange(entryPoint, "python");
  //   });
  // });
  // }

  // Create report directories for all tests
  [
    ["node", Object.keys(nodeEntryPoints)],
    ["web", Object.keys(webEntryPoints)],
    ["python", Object.keys(pythonEntryPoints)],
    ["golang", Object.keys(golangEntryPoints)],
  ].forEach(([runtime, keys]: [IRunTime, string[]]) => {
    keys.forEach((k) => {
      fs.mkdirSync(
        `testeranto/reports/${testsName}/${k
          .split(".")
          .slice(0, -1)
          .join(".")}/${runtime}`,
        { recursive: true }
      );
    });
  });

  console.log("🚀 Starting Docker Compose services via DockerMan...");
  try {
    await dockerMan.start();
    console.log("✅ DockerMan.start() completed");
  } catch (error) {
    console.error("❌ DockerMan.start() failed:", error);
    console.error("Full error details:", JSON.stringify(error, null, 2));
    throw error;
  }
}
