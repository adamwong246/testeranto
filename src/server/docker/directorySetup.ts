import fs from "fs";
import path from "path";
import { IBuiltConfig, IRunTime } from "../../Types";
import { nodeDocker } from "../node/nodeDocker";
import { golangDocker } from "../golang/golangDocker";
import { pythonDocker } from "../python/pythonDocker";

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
        const runtimeDir = path.join(composeDir, "allTests", runtime);
        fs.mkdirSync(runtimeDir, { recursive: true });

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

                if (dockerfileContent) {
                  fs.writeFileSync(dockerfilePath, dockerfileContent);
                  log(`Created Dockerfile at: ${dockerfilePath}`);
                }
              }
            }
          }
        }
      }
    }
  } catch (err) {
    error(`Error creating directories:`, err);
    throw err;
  }
}
