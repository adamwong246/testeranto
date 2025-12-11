/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import { IBuiltConfig, IRunTime } from "../../Types";
import { nodeDocker } from "../node/nodeDocker";
import { golangDocker } from "../golang/golangDocker";
import { pythonDocker } from "../python/pythonDocker";
import { getStrategyForRuntime } from "../strategies";

export async function setupDirectories(
  config: IBuiltConfig,
  runtimes: IRunTime[],
  composeDir: string,
  log: (...args: any[]) => void,
  error: (...args: any[]) => void
) {
  try {
    fs.mkdirSync(composeDir, { recursive: true });

    // Also create runtime-specific directories for all runtimes that have tests
    for (const runtime of runtimes) {
      const hasTests =
        config[runtime]?.tests && Object.keys(config[runtime].tests).length > 0;
      if (hasTests) {
        const strategy = getStrategyForRuntime(runtime);
        const runtimeDir = path.join(composeDir, "allTests", runtime);
        fs.mkdirSync(runtimeDir, { recursive: true });

        // Create a strategy info file
        const strategyInfoPath = path.join(runtimeDir, "strategy.info");
        const strategyInfo = `runtime: ${runtime}\nstrategy: ${strategy}\ngenerated: ${new Date().toISOString()}\n`;
        fs.writeFileSync(strategyInfoPath, strategyInfo);

        // Also create test-specific directories for each test
        // But skip creating Dockerfiles for web tests since they won't have services
        const tests = config[runtime]?.tests;
        if (tests) {
          for (const testPath of Object.keys(tests)) {
            // Create directory for the test's Dockerfile
            // testPath is a file path like "src/example/Calculator.golingvu.test.go"
            // We need to extract the directory part
            const testDirPath = path.dirname(testPath);
            const testDir = path.join(runtimeDir, testDirPath);
            fs.mkdirSync(testDir, { recursive: true });

            // Only create Dockerfiles for non-web runtimes
            // Web tests don't need individual Dockerfiles since they won't have services
            // Also, for compiled languages, we might want different Dockerfiles
            if (runtime !== "web") {
              const dockerfilePath = path.join(testDir, "Dockerfile");

              // Create a simple Dockerfile for the test service
              if (!fs.existsSync(dockerfilePath)) {
                // Create a minimal Dockerfile
                let dockerfileContent = "";
                if (runtime === "node") {
                  dockerfileContent = nodeDocker;
                } else if (runtime === "golang") {
                  dockerfileContent = golangDocker;
                } else if (runtime === "python") {
                  dockerfileContent = pythonDocker;
                }

                // Add strategy comment
                if (dockerfileContent) {
                  dockerfileContent =
                    `# Strategy: ${strategy}\n# Runtime: ${runtime}\n\n` +
                    dockerfileContent;
                  fs.writeFileSync(dockerfilePath, dockerfileContent);
                }
              }
            }
          }
        }

        // Create strategy-specific directories
        if (strategy === "separate-build-combined-test") {
          // Compiled languages need build cache directory
          const buildCacheDir = path.join(composeDir, "build-cache", runtime);
          fs.mkdirSync(buildCacheDir, { recursive: true });
        }
      }
    }
  } catch (err) {
    error(`Error creating directories:`, err);
    throw err;
  }
}
