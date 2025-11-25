import fs from "fs";
import path from "path";
import { IRunTime } from "../Types";
import { upAll } from "docker-compose";

export default class DockerMan {
  testName: string;
  constructor(testName) {
    console.log("DockerMan initialized.");
    this.testName = testName;
  }

  onBundleChange(entryPoint: string, lang: IRunTime) {
    console.log(`Bundle changed for ${lang}: ${entryPoint}`);
  }

  stop() {
    console.log("DockerMan stopping all containers...");
  }

  start() {
    console.log("DockerMan starting all containers...");
    const composeDir = process.cwd();
    const composeFile = path.join("testeranto", "bundles", `${this.testName}-docker-compose.yml`);
    
    console.log(`Using compose file: ${composeFile}`);
    console.log(`In directory: ${composeDir}`);
    console.log(`Full compose file path: ${path.join(composeDir, composeFile)}`);
    
    // Check if the compose file exists
    if (!fs.existsSync(path.join(composeDir, composeFile))) {
      console.error(`Docker Compose file not found: ${path.join(composeDir, composeFile)}`);
      return;
    }
    
    upAll({
      cwd: composeDir,
      config: composeFile,
      log: true,
    }).then(
      (result) => {
        console.log("Docker Compose started successfully:", result);
      },
      (err) => {
        console.log("Something went wrong:", err.message);
        console.log(err);
      }
    );
  }
}
