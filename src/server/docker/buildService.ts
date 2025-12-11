import { IRunTime } from "../../Types";
import { golangDockerFile } from "../runtimes/golang/golangDocker";
import { nodeDockerFile } from "../runtimes/node/nodeDocker";
import { pythonDockerFile } from "../runtimes/python/pythonDocker";
import { webDockerFile } from "../runtimes/web/webDocker";

export default (runtime: IRunTime) => {
  if (runtime === "node") {
    nodeDockerFile(runtime);
  } else if (runtime === "web") {
    webDockerFile(runtime);
  } else if (runtime === "golang") {
    golangDockerFile(runtime);
  } else if (runtime === "python") {
    pythonDockerFile(runtime);
  } else {
    throw `unknown runtime ${runtime}`;
  }
};
