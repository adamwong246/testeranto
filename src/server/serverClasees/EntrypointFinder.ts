import { IBuiltConfig, IRunTime } from "../../Types";
import { getRunnables } from "../utils";

export class EntrypointFinder {
  constructor(
    private configs: IBuiltConfig,
    private projectName: string
  ) {}

  findTestNameByEntrypoint(
    entrypoint: string,
    platform: IRunTime
  ): string | null {
    const runnables = getRunnables(this.configs, this.projectName);

    let entryPointsMap: Record<string, string>;

    switch (platform) {
      case "node":
        entryPointsMap = runnables.nodeEntryPoints;
        break;
      case "web":
        entryPointsMap = runnables.webEntryPoints;
        break;
      // case "pure":
      //   entryPointsMap = runnables.pureEntryPoints;
      //   break;
      case "python":
        entryPointsMap = runnables.pythonEntryPoints;
        break;
      case "golang":
        entryPointsMap = runnables.golangEntryPoints;
        break;
      default:
        throw "wtf";
    }

    if (!entryPointsMap) {
      console.error("idk");
    }

    if (!entryPointsMap[entrypoint]) {
      console.error(`${entrypoint} not found 1`, entryPointsMap);
      console.trace();
      throw `${entrypoint} not found`;
    }

    return entryPointsMap[entrypoint];
  }
}
