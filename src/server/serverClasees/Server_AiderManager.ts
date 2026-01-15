// This Server manages processes-as-docker-commands. Processes are scheduled in queue.
// It should also leverage Server_HTTP and SERVER_WS

import { IRunTime, IBuiltConfig } from "../../Types";
import { Server_TestManager } from "./Server_TestManager";
import { AiderManager, AiderProcessInfo } from "../serverManagers/AiderManager";
import { IMode } from "../types";

export class Server_AiderManager extends Server_TestManager {
  aider: AiderManager;

  constructor(configs: IBuiltConfig, name: string, mode: IMode, routes) {
    super(configs, name, mode, routes);
    this.aider = new AiderManager(configs, name, mode);
  }

  async start() {
    console.log(`[Server_AiderManager] start()`)
    super.start()
  }

  async stop() {
    console.log(`[Server_AiderManager] stop()`)
    this.aider.stopAll();
    super.stop()
  }

  // Create aider process for a specific test as a background command
  async createAiderProcess(
    runtime: IRunTime,
    testPath: string,
    sourceFiles: string[]
  ): Promise<void> {
    const processId = `allTests-${runtime}-${testPath}-aider`;
    console.log(`[Server_AiderManager] Creating aider Docker container: ${processId}`);

    // Ensure aider base image exists using the manager
    const imageReady = await this.aider.ensureAiderImage();
    if (!imageReady) {
      console.error('[Server_AiderManager] Cannot create aider container: base image not available');
      this.addLogEntry(processId, "error", "Failed to build aider base image", new Date(), "error");
      return;
    }

    const containerName = `aider-${runtime}-${testPath.replace(/[^a-zA-Z0-9]/g, '-')}`;

    // Check if container is already running
    const checkRunningCmd = `docker ps --filter "name=${containerName}" --filter "status=running" --format "{{.Names}}"`;
    const checkRunningResult = await this.executeCommand(
      `${processId}-check-running`,
      checkRunningCmd,
      "aider",
      testPath,
      runtime
    );

    // If container is already running, don't create a new one
    if (checkRunningResult.success && checkRunningResult.stdout && checkRunningResult.stdout.trim() === containerName) {
      console.log(`[Server_AiderManager] Aider container ${containerName} is already running, skipping creation`);
      this.addLogEntry(processId, "stdout", `Aider Docker container already running: ${containerName}`, new Date(), "info");

      // Add to manager
      const processInfo: AiderProcessInfo = {
        processId,
        containerName,
        status: "running",
        command: "docker container already running",
        timestamp: new Date().toISOString(),
        type: "docker",
        category: "aider",
        testName: testPath,
        platform: runtime,
      };
      this.aider.addProcess(processInfo);
      return;
    }

    // Check if container exists but is not running
    const checkAllCmd = `docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`;
    const checkAllResult = await this.executeCommand(
      `${processId}-check-all`,
      checkAllCmd,
      "aider",
      testPath,
      runtime
    );

    // If container exists but is not running, remove it
    if (checkAllResult.success && checkAllResult.stdout && checkAllResult.stdout.trim() === containerName) {
      console.log(`[Server_AiderManager] Container ${containerName} exists but is not running, removing...`);
      const removeResult = await this.executeCommand(
        `${processId}-remove`,
        `docker rm -f ${containerName}`,
        "aider",
        testPath,
        runtime
      );
      if (!removeResult.success) {
        console.error(`[Server_AiderManager] Failed to remove existing container ${containerName}:`, removeResult.error);
      } else {
        console.log(`[Server_AiderManager] Removed existing container ${containerName}`);
      }
    }

    // Load API keys using the manager
    const apiKeys = this.aider.loadAiderApiKeys();
    const envVars = Object.entries(apiKeys).map(([key, value]) => `-e ${key}=${value}`);

    // Build the Docker run command
    const dockerArgs = [
      'docker', 'run',
      '-d',
      '--name', containerName,
      '-v', `${process.cwd()}:/workspace`,
      '-w', '/workspace',
      '--network', 'allTests_network',
      ...envVars,
      'testeranto-aider:latest',
      ...sourceFiles
    ];

    const command = dockerArgs.join(' ');

    // Execute the Docker command
    const result = await this.executeCommand(
      processId,
      command,
      "aider",
      testPath,
      runtime
    );

    // Create process info
    const processInfo: AiderProcessInfo = {
      processId,
      containerName,
      status: result.success ? "running" : "error",
      command,
      timestamp: new Date().toISOString(),
      type: "docker",
      category: "aider",
      testName: testPath,
      platform: runtime,
    };

    // Add to manager
    this.aider.addProcess(processInfo);

    // Handle result
    if (result.success) {
      this.addLogEntry(processId, "stdout", `Aider Docker container started: ${containerName}`, new Date(), "info");
      console.log(`[Server_AiderManager] Aider Docker container ${containerName} started`);

      // Get container logs after a delay
      setTimeout(async () => {
        await this.executeCommand(
          `${processId}-logs`,
          `docker logs ${containerName}`,
          "aider",
          testPath,
          runtime
        );
      }, 2000);
    } else {
      this.addLogEntry(processId, "error", `Failed to start aider Docker container: ${result.error}`, new Date(), "error");
      console.error(`[Server_AiderManager] Failed to start aider Docker container:`, result.error);
    }

    // Provide connection instructions
    const connectionInfo = `To connect to this aider session, use: docker exec -it ${containerName} /bin/bash`;
    this.addLogEntry(processId, "stdout", connectionInfo, new Date(), "info");

    // Also provide VS Code terminal command
    const vscodeCommand = `docker exec -it ${containerName} bash -c "aider --yes --dark-mode ${sourceFiles.join(' ')}"`;
    this.addLogEntry(processId, "stdout", `VS Code terminal command: ${vscodeCommand}`, new Date(), "info");
  }
}
