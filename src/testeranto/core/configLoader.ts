import path from "path";
import fs from "fs";
import { IBuiltConfig, ITestconfig } from "../../Types";
import { pathToFileURL } from "url";

export async function loadConfig(
  configFilepath: string
): Promise<{ config: IBuiltConfig; testsName: string }> {
  const testsName = path
    .basename(configFilepath)
    .split(".")
    .slice(0, -1)
    .join(".");

  // Remove the .ts extension to let tsx handle the resolution
  // This matches the old implementation which worked
  const configPathWithoutExt = configFilepath.replace(/\.ts$/, '');
  
  // Resolve to absolute path and convert to file URL
  const absolutePath = path.resolve(process.cwd(), configPathWithoutExt);
  
  // Try importing without extension first (let tsx resolve)
  try {
    const module = await import(absolutePath);
    const bigConfig: ITestconfig = module.default;

    const buildDir = path.join(process.cwd(), "testeranto", "bundles", testsName);
    
    // Ensure the build directory exists synchronously to prevent race conditions
    try {
      fs.mkdirSync(buildDir, { recursive: true });
    } catch (mkdirErr) {
      console.warn(`Could not create build directory ${buildDir}:`, mkdirErr);
    }

    const config: IBuiltConfig = {
      ...bigConfig,
      buildDir,
    };

    return { config, testsName };
  } catch (error) {
    // If that fails, try with .ts extension
    console.error(`First import attempt failed: ${error}`);
    const withTs = absolutePath + '.ts';
    const module = await import(withTs);
    const bigConfig: ITestconfig = module.default;

    const buildDir = path.join(process.cwd(), "testeranto", "bundles", testsName);
    
    // Ensure the build directory exists synchronously to prevent race conditions
    try {
      fs.mkdirSync(buildDir, { recursive: true });
    } catch (mkdirErr) {
      console.warn(`Could not create build directory ${buildDir}:`, mkdirErr);
    }

    const config: IBuiltConfig = {
      ...bigConfig,
      buildDir,
    };

    return { config, testsName };
  }
}
