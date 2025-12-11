import {
  PitonoBuild
} from "../../chunk-W2DJ422C.mjs";
import "../../chunk-3X2YHN6Q.mjs";

// src/server/builders/python.ts
import fs from "fs";
import path from "path";
async function runPythonBuild() {
  try {
    const configPath = process.argv[2];
    if (!configPath) {
      throw new Error("Configuration path not provided");
    }
    const absoluteConfigPath = path.resolve(process.cwd(), configPath);
    const configModule = await import(absoluteConfigPath);
    const config = configModule.default;
    const pitonoBuild = new PitonoBuild(config, configPath);
    const entryPoints = await pitonoBuild.build();
    const metafileDir = process.env.METAFILES_DIR || "/workspace/testeranto/metafiles/python";
    const bundlesDir = process.env.BUNDLES_DIR || "/workspace/testeranto/bundles/allTests/python";
    console.log("PYTHON BUILDER: Using metafiles directory:", metafileDir);
    console.log("PYTHON BUILDER: Using bundles directory:", bundlesDir);
    const metafilePath = path.join(
      metafileDir,
      `${path.basename(configPath, path.extname(configPath))}.json`
    );
    if (!fs.existsSync(metafileDir)) {
      fs.mkdirSync(metafileDir, { recursive: true });
    }
    const metafile = {
      entryPoints,
      buildTime: (/* @__PURE__ */ new Date()).toISOString(),
      runtime: "python"
    };
    fs.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
    console.log("PYTHON BUILDER: Metafile written to:", metafilePath);
    if (!fs.existsSync(bundlesDir)) {
      fs.mkdirSync(bundlesDir, { recursive: true });
      console.log("PYTHON BUILDER: Created bundles directory:", bundlesDir);
    }
  } catch (error) {
    console.error("Python build failed:", error);
    process.exit(1);
  }
}
runPythonBuild();
