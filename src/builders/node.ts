const fs = await import("fs");

import { IBuiltConfig } from "../Types.js";
import nodeEsbuildConfig from "../esbuildConfigs/node.js";
import esbuild from "esbuild";
import path from "path";

console.error("NODE.ts");

async function runNodeBuild() {
  console.error("runNodeBuild");

  try {
    const configPath = process.argv[2];
    if (!configPath) {
      throw new Error("Configuration path not provided");
    }

    const absoluteConfigPath = path.resolve(process.cwd(), configPath);
    if (!fs.existsSync(absoluteConfigPath)) {
      throw new Error(`Config file does not exist: ${absoluteConfigPath}`);
    }

    const configModule = await import(absoluteConfigPath);
    const config: IBuiltConfig = configModule.default;

    const entryPoints = Object.keys(config.node.tests);

    const bundlesDir = process.env.BUNDLES_DIR as string;

    const buildOptions = nodeEsbuildConfig(
      config,
      entryPoints,
      configPath,
      bundlesDir
    );

    const result = await esbuild.build(buildOptions);
    const metafileDir =
      process.env.METAFILES_DIR || "/workspace/testeranto/metafiles/node";
    const metafilePath = path.join(
      metafileDir,
      `${path.basename(configPath, path.extname(configPath))}.json`
    );
    fs.writeFileSync(metafilePath, JSON.stringify(result.metafile, null, 2));
  } catch (error) {
    console.error("NODE BUILDER: Build failed:", error);
    // process.exit(1);
  }
}

runNodeBuild();
