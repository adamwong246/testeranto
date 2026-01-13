// This Server manages processes-as-docker-commands. Processes are scheduled in queue.
// It should also leverage Server_HTTP and SERVER_WS

import { IRunTime } from "../../Types";
import { IMetaFile } from "./utils/types";
import { Server_Aider } from "./Server_Aider";
import { golangBddCommand } from "../runtimes/golang/docker";
import { nodeBddCommand } from "../runtimes/node/docker";
import { pythonBDDCommand } from "../runtimes/python/docker";
import { webBddCommand } from "../runtimes/web/docker";

export class Server_Scheduler extends Server_Aider {

  async scheduleBddTest(
    metafile: IMetaFile,
    runtime: IRunTime,
    entrypoint: string
  ): Promise<void> {
    console.log(
      `[ProcessManager] Scheduling BDD test for ${entrypoint} (${runtime})`
    );

    // Validate entrypoint
    if (!entrypoint || typeof entrypoint !== 'string') {
      console.error(`[ProcessManager] Invalid entrypoint: ${entrypoint}`);
      return;
    }

    // Extract test path from entrypoint
    const testPath = entrypoint.replace(/\.[^/.]+$/, "").replace(/^example\//, "");

    // Ensure testPath is valid
    if (!testPath || testPath.trim() === '') {
      console.error(`[ProcessManager] Invalid testPath derived from entrypoint: ${entrypoint}`);
      return;
    }


    await this.createAiderProcess(runtime, testPath, metafile);


    const processId = `allTests-${runtime}-${testPath}-bdd`;

    // Get the appropriate BDD command for the runtime
    let bddCommand = "";
    if (runtime === "node") {
      bddCommand = nodeBddCommand(this.configs.httpPort);
    } else if (runtime === "web") {
      bddCommand = webBddCommand(this.configs.httpPort);
    } else if (runtime === "python") {
      bddCommand = pythonBDDCommand(this.configs.httpPort);
    } else if (runtime === "golang") {
      bddCommand = golangBddCommand(this.configs.httpPort);
    } else {
      bddCommand = `echo 'not yet implemented'`;
    }

    await this.runBddTestInDocker(processId, testPath, runtime, bddCommand);
  }


  async scheduleStaticTests(
    metafile: IMetaFile,
    runtime: IRunTime,
    entrypoint: string,
    addableFiles: string[]
  ): Promise<void> {

    // Validate entrypoint
    if (!entrypoint || typeof entrypoint !== 'string') {
      console.error(`[ProcessManager] Invalid entrypoint: ${entrypoint}`);
      return;
    }

    // Extract test path from entrypoint
    const testPath = entrypoint.replace(/\.[^/.]+$/, "").replace(/^example\//, "");

    // Ensure testPath is valid
    if (!testPath || testPath.trim() === '') {
      console.error(`[ProcessManager] Invalid testPath derived from entrypoint: ${entrypoint}`);
      return;
    }

    // Check if configs[runtime] exists
    if (!this.configs[runtime] || !Array.isArray(this.configs[runtime].checks)) {
      console.error(`[ProcessManager] No checks configured for runtime: ${runtime}`);
      return;
    }

    let checkIndex = 0;
    for (const check of this.configs[runtime].checks) {
      const processId = `allTests-${runtime}-${testPath}-static-${checkIndex}`;

      const checkCommand = check(addableFiles);

      const containerName = `static-${runtime}-${testPath.replace(/[^a-zA-Z0-9]/g, '-')}-${checkIndex}`;

      const checkCmd = `docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`;
      const checkResult = await this.executeCommand(
        `${processId}-check`,
        checkCmd,
        "build-time",
        testPath,
        runtime
      );

      if (checkResult.success && checkResult.stdout && checkResult.stdout.trim() === containerName) {
        // Container exists, remove it
        await this.executeCommand(
          `${processId}-remove`,
          `docker rm -f ${containerName}`,
          "build-time",
          testPath,
          runtime
        );
      }

      // Determine the base image to use
      const baseImage = this.getRuntimeImage(runtime);

      // Run the static test in a new container
      // Mount the workspace to access source files and built artifacts
      const dockerRunCmd = `docker run --rm \
          --name ${containerName} \
          --network allTests_network \
          -v ${process.cwd()}:/workspace \
          -w /workspace \
          ${baseImage} \
          sh -c "${checkCommand}"`;

      const result = await this.executeCommand(
        processId,
        dockerRunCmd,
        "build-time",
        testPath,
        runtime
      );

      if (!result.success) {
        console.log(`[ProcessManager] Static test ${processId} failed:`, result.error?.message);
      } else {
        console.log(`[ProcessManager] Static test ${processId} completed successfully`);
      }

      checkIndex++;
    }
  }


}
