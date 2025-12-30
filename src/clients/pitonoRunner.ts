import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import { ITestconfig } from "../Types";

export class PitonoRunner {
  constructor(private config: ITestconfig, private testName: string) {}

  async run(): Promise<void> {
    const coreJsonPath = path.join(
      process.cwd(),
      "testeranto",
      "pitono",
      this.testName,
      "core.json"
    );

    // Wait for the core.json file to be created with a timeout
    const maxWaitTime = 10000; // 10 seconds
    const startTime = Date.now();
    while (
      !fs.existsSync(coreJsonPath) &&
      Date.now() - startTime < maxWaitTime
    ) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (!fs.existsSync(coreJsonPath)) {
      console.error(
        `Pitono core.json not found at: ${coreJsonPath} after waiting ${maxWaitTime}ms`
      );
      return;
    }

    try {
      const coreData = JSON.parse(fs.readFileSync(coreJsonPath, "utf-8"));
      const entryPoints = coreData.entryPoints;

      for (const entryPoint of entryPoints) {
        try {
          console.log(`Running pitono test: ${entryPoint}`);
          // Use python to execute the test file
          const absolutePath = path.resolve(entryPoint);
          // Check if the file exists
          if (!fs.existsSync(absolutePath)) {
            console.error(`Pitono test file not found: ${absolutePath}`);
            continue;
          }
          execSync(`python "${absolutePath}"`, { stdio: "inherit" });
          console.log(`Pitono test completed: ${entryPoint}`);
        } catch (error) {
          console.error(`Pitono test failed: ${entryPoint}`, error);
          throw error;
        }
      }
    } catch (error) {
      console.error(`Error reading or parsing core.json: ${error}`);
    }
  }
}
