// src/server/builders/common.ts
import esbuild from "esbuild";
import path from "path";
async function runBuild(getEsbuildConfig, getEntryPoints, builderName) {
  console.error(`${builderName}.ts`);
  try {
    const configPath = process.argv[2];
    if (!configPath) {
      throw new Error("Configuration path not provided");
    }
    const fs = await import("fs");
    const absoluteConfigPath = path.resolve(process.cwd(), configPath);
    if (!fs.existsSync(absoluteConfigPath)) {
      throw new Error(`Config file does not exist: ${absoluteConfigPath}`);
    }
    const configModule = await import(absoluteConfigPath);
    const config = configModule.default;
    const entryPoints = getEntryPoints(config);
    const bundlesDir = process.env.BUNDLES_DIR;
    const buildOptions = getEsbuildConfig(
      config,
      entryPoints,
      configPath,
      bundlesDir
    );
    const result = await esbuild.build(buildOptions);
    const metafileDir = process.env.METAFILES_DIR || `/workspace/testeranto/metafiles/${builderName.toLowerCase()}`;
    const metafilePath = path.join(
      metafileDir,
      `${path.basename(configPath, path.extname(configPath))}.json`
    );
    fs.writeFileSync(metafilePath, JSON.stringify(result.metafile, null, 2));
  } catch (error) {
    console.error(`${builderName.toUpperCase()} BUILDER: Build failed:`, error);
  }
}

export {
  runBuild
};
