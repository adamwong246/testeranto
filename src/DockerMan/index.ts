import { IRunTime } from "../Types";

export default class DockerMan {
  constructor() {
    console.log("DockerMan initialized.");
  }

  onBundleChange(entryPoint: string, lang: IRunTime) {
    console.log(`Bundle changed for ${lang}: ${entryPoint}`);
  }

  stop() {
    console.log("DockerMan stopping all containers...");
  }
}
