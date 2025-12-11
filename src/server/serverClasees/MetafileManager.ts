/* eslint-disable @typescript-eslint/no-explicit-any */
import ansiC from "ansi-colors";
import fs from "fs";
import path from "path";
import { filesHash } from "../../clients/utils";
import { IRunTime } from "../../lib";

export class MetafileManager {
  private changes: Record<string, string> = {};

  constructor() {}

  async processMetafile(
    platform: IRunTime,
    projectName: string,
    configTests: () => [string, IRunTime, { ports: number }, object][],
    tscCheck: (params: any) => void,
    eslintCheck: (params: any) => void,
    pythonLintCheck: (entrypoint: string, addableFiles: string[]) => void,
    pythonTypeCheck: (entrypoint: string, addableFiles: string[]) => void,
    makePrompt: (
      summary: any,
      projectName: string,
      entrypoint: string,
      addableFiles: string[],
      platform: IRunTime
    ) => void,
    findTestNameByEntrypoint: (
      entrypoint: string,
      platform: IRunTime
    ) => string | null,
    addToQueue: (
      testName: string,
      platform: IRunTime,
      addableFiles?: string[]
    ) => void
  ) {
    let metafilePath: string;
    if (platform === "python") {
      metafilePath = `./testeranto/metafiles/python/core.json`;
    } else {
      metafilePath = `./testeranto/metafiles/${platform}/${projectName}.json`;
    }

    // Ensure the metafile exists
    if (!fs.existsSync(metafilePath)) {
      console.log(
        ansiC.yellow(`Metafile not found at ${metafilePath}, skipping`)
      );
      return;
    }

    let metafile: any;
    try {
      const fileContent = fs.readFileSync(metafilePath).toString();
      const parsedData = JSON.parse(fileContent);
      // Handle different metafile structures
      if (platform === "python") {
        // Pitono metafile might be the entire content or have a different structure
        metafile = parsedData.metafile || parsedData;
      } else {
        metafile = parsedData.metafile;
      }
      if (!metafile) {
        console.log(
          ansiC.yellow(ansiC.inverse(`No metafile found in ${metafilePath}`))
        );
        return;
      }
    } catch (error) {
      console.error(`Error reading metafile at ${metafilePath}:`, error);
      return;
    }

    const outputs = metafile.outputs as Record<string, any>;
    if (!outputs) {
      return;
    }

    for (const builtOutput of Object.keys(outputs)) {
      const entrypoint = configTests().find(
        ([testEntryPoint, testPlatform]) => {
          if (
            testEntryPoint ===
              builtOutput
                .replace(`testeranto/bundles/${platform}/${projectName}/`, ``)
                .replace(`.mjs`, `.ts`) &&
            testPlatform === platform
          ) {
            return true;
          }
          return false;
        }
      );

      if (entrypoint) {
        const metafileOutput = outputs[builtOutput];
        if (!metafileOutput || !metafileOutput.inputs) {
          continue;
        }

        const addableFiles = Object.keys(metafileOutput.inputs).filter((i) => {
          if (!fs.existsSync(i)) return false;
          if (i.startsWith("node_modules")) return false;
          if (i.startsWith("./node_modules")) return false;
          return true;
        });

        const f = `${builtOutput.split(".").slice(0, -1).join(".")}/`;
        if (!fs.existsSync(f)) {
          fs.mkdirSync(f, { recursive: true });
        }

        let entryPointPath = metafileOutput.entryPoint;
        if (entryPointPath) {
          // Normalize the entrypoint path to ensure consistent comparison
          entryPointPath = path.normalize(entryPointPath);

          const changeDigest = await filesHash(addableFiles);

          if (changeDigest === this.changes[entryPointPath]) {
            // skip
          } else {
            this.changes[entryPointPath] = changeDigest;

            // Skip static analysis checks here - they will be run as part of test execution
            // Just add the test to the queue
            const testName = findTestNameByEntrypoint(entryPointPath, platform);
            if (testName) {
              console.log(
                ansiC.green(
                  ansiC.inverse(
                    `Source files changed, re-queueing test: ${testName}`
                  )
                )
              );
              // Still call makePrompt to ensure prompt files are generated
              makePrompt(
                {} as any, // This will be replaced by the actual summary
                projectName,
                entryPointPath,
                addableFiles,
                platform
              );
              addToQueue(testName, platform, addableFiles);
            } else {
              console.error(
                `Could not find test for entrypoint: ${entryPointPath} (${platform})`
              );
              throw new Error(
                `Could not find test for entrypoint: ${entryPointPath} (${platform})`
              );
            }
          }
        }
      }
    }
  }
}
