const fs = await import("fs");
import { PitonoBuild } from "../PM/pitonoBuild.js";
import { IBuiltConfig } from "../Types.js";
import path from "path";

async function runPythonBuild() {
  try {
    const configPath = process.argv[2];

    if (!configPath) {
      throw new Error("Configuration path not provided");
    }

    const absoluteConfigPath = path.resolve(process.cwd(), configPath);

    const configModule = await import(absoluteConfigPath);
    const config: IBuiltConfig = configModule.default;
    const pitonoBuild = new PitonoBuild(config, configPath);
    const entryPoints = await pitonoBuild.build();

    const metafileDir = "/workspace/testeranto/metafiles/python";
    const metafilePath = path.join(
      metafileDir,
      `${path.basename(configPath, path.extname(configPath))}.json`
    );

    if (!fs.existsSync(metafileDir)) {
      fs.mkdirSync(metafileDir, { recursive: true });
    }

    const metafile = {
      entryPoints: entryPoints,
      buildTime: new Date().toISOString(),
      runtime: "python",
    };
    fs.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
  } catch (error) {
    console.error("Python build failed:", error);
    process.exit(1);
  }
}

runPythonBuild();
