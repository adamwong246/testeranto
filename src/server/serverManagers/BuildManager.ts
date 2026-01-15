// Do not allow imports from outside the project

import { IBuiltConfig } from "../../Types"
import { IMode } from "../types"

export class BuildManager {
  buildSet: Set<string>

  constructor(configs: IBuiltConfig, testName: string, mode: IMode) {
    this.buildSet = new Set()
  }

  add(pid: string, executor: (resolve: (value: unknown) => void, reject: (reason?: any) => void) => void) {
    this.buildSet[pid] = new Promise(executor)
  }

  get entries() {
    return this.buildSet.entries()
  }

  dockerRunCmd(category, containerName, runtime): string {

    const baseImage = getRuntimeImage(runtime);

    const runOptions = (category === 'aider' || category === 'build-time') ? '-d' : '--rm';

    return `docker run ${runOptions} \
      --name ${containerName} \
      --network allTests_network \
      -v ${process.cwd()}:/workspace \
      -w /workspace \
      ${baseImage} \
      sh -c "${command}"`;
  }
}