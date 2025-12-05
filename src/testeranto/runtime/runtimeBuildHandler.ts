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
  const createReportDirs = (runtime: IRunTime, entryPoints: string[]) => {
    entryPoints.forEach((entryPoint) => {
      // Handle different path formats:
      // 1. src/example/Calculator.test.ts -> src/example/Calculator
      // 2. src/example/Calculator.test -> src/example/Calculator
      // 3. src/example/Calculator.ts -> src/example/Calculator
      // Remove file extension and any .test suffix
      let dirName = entryPoint;
      
      // Remove .ts, .js, .mjs, .cjs, .py, .go extensions
      const extensions = ['.ts', '.js', '.mjs', '.cjs', '.py', '.go', '.test.ts', '.test.js', '.test.mjs', '.test.py', '.test.go'];
      for (const ext of extensions) {
        if (dirName.endsWith(ext)) {
          dirName = dirName.slice(0, -ext.length);
          break;
        }
      }
      
      // Also remove any remaining .test suffix
      if (dirName.endsWith('.test')) {
        dirName = dirName.slice(0, -5);
      }
      
      // Ensure we don't have trailing slashes
      dirName = dirName.replace(/\/+$/, '');
      
      const reportDir = `testeranto/reports/${testsName}/${dirName}/${runtime}`;
      try {
        fs.mkdirSync(reportDir, { recursive: true });
      } catch (err: any) {
        // If directory already exists, that's fine
        if (err.code !== 'EEXIST') {
          console.warn(`Could not create report directory ${reportDir}:`, err.message);
        }
      }
    });
  };

  createReportDirs("node", Object.keys(nodeEntryPoints));
  createReportDirs("web", Object.keys(webEntryPoints));
  createReportDirs("python", Object.keys(pythonEntryPoints));
  createReportDirs("golang", Object.keys(golangEntryPoints));

  console.log("🚀 Starting Docker Compose services via DockerMan...");
  try {
    await dockerMan.start();
    console.log("✅ DockerMan.start() completed");
  } catch (error) {
    console.error("❌ DockerMan.start() failed:", error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error("Stack trace:", error.stack);
    }
    console.error("Full error details:", JSON.stringify(error, null, 2));
    throw error;
  }
}
