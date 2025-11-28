import { upAll } from "docker-compose";
import path from "path";
import { IRunTime } from "../Types";

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
    const composeDir = process.cwd();
    const composeFile = path.join(
      composeDir,
      "testeranto",
      "bundles",
      `${this.testName}-docker-compose.yml`
    );
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
