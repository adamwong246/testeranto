import fs from "fs";
import path from "path";
import { IRunTime } from "../../../Types";
import { IMetaFile } from "./types";

export class AiderProcessManager {
  private executeCommand: (
    processId: string,
    command: string,
    category: any,
    testName?: string,
    platform?: IRunTime,
    options?: any
  ) => Promise<any>;
  
  private addLogEntry: (
    processId: string,
    source: "stdout" | "stderr" | "console" | "network" | "error",
    message: string,
    timestamp?: Date,
    level?: string
  ) => void;
  
  private allProcesses: Map<string, any>;
  private aiderProcesses: Map<string, any>;

  constructor(
    executeCommand: (
      processId: string,
      command: string,
      category: any,
      testName?: string,
      platform?: IRunTime,
      options?: any
    ) => Promise<any>,
    addLogEntry: (
      processId: string,
      source: "stdout" | "stderr" | "console" | "network" | "error",
      message: string,
      timestamp?: Date,
      level?: string
    ) => void,
    allProcesses: Map<string, any>,
    aiderProcesses: Map<string, any>
  ) {
    this.executeCommand = executeCommand;
    this.addLogEntry = addLogEntry;
    this.allProcesses = allProcesses;
    this.aiderProcesses = aiderProcesses;
  }

  // Load aider API keys from .aider.conf.yml
  private loadAiderApiKeys(): Record<string, string> {
    try {
      const configPath = path.join(process.cwd(), '.aider.conf.yml');
      if (!fs.existsSync(configPath)) {
        console.log('[AiderProcessManager] No .aider.conf.yml file found');
        return {};
      }

      const yaml = require('js-yaml');
      const config = yaml.load(fs.readFileSync(configPath, 'utf8'));

      const apiKeys: Record<string, string> = {};

      // Extract API keys from config
      if (config['openai-api-key']) {
        apiKeys['OPENAI_API_KEY'] = config['openai-api-key'];
      }
      if (config['anthropic-api-key']) {
        apiKeys['ANTHROPIC_API_KEY'] = config['anthropic-api-key'];
      }
      if (config['api-key']) {
        // Handle both string and array
        if (Array.isArray(config['api-key'])) {
          config['api-key'].forEach((key: string, index: number) => {
            apiKeys[`API_KEY_${index}`] = key;
          });
        } else {
          apiKeys['API_KEY'] = config['api-key'];
        }
      }

      console.log('[AiderProcessManager] Loaded API keys from .aider.conf.yml');
      return apiKeys;
    } catch (error) {
      console.error('[AiderProcessManager] Failed to load API keys from .aider.conf.yml:', error);
      return {};
    }
  }

  // Build the aider base image if not already built
  private async ensureAiderImage(): Promise<boolean> {
    const imageName = 'testeranto-aider:latest';
    const checkImageCmd = `docker images -q ${imageName}`;

    const checkResult = await this.executeCommand(
      'aider-image-check',
      checkImageCmd,
      'aider',
      'image-check',
      'node'
    );

    if (checkResult.success && checkResult.stdout && checkResult.stdout.trim() !== '') {
      console.log('[AiderProcessManager] Aider base image already exists');
      return true;
    }

    console.log('[AiderProcessManager] Building aider base image...');

    // Create a temporary Dockerfile
    const dockerfileContent = [
      'FROM python:3.11-slim',
      'WORKDIR /workspace',
      'RUN pip install --no-cache-dir aider-chat',
      '# Create a non-root user for security',
      'RUN useradd -m -u 1000 aider && chown -R aider:aider /workspace',
      'USER aider',
      '# Default command starts aider in interactive mode',
      'CMD ["aider", "--yes", "--dark-mode"]'
    ].join('\n');

    const tempDir = path.join(process.cwd(), 'testeranto', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const dockerfilePath = path.join(tempDir, 'Dockerfile.aider');
    fs.writeFileSync(dockerfilePath, dockerfileContent);

    const buildCmd = `docker build -t ${imageName} -f ${dockerfilePath} ${tempDir}`;
    const buildResult = await this.executeCommand(
      'aider-image-build',
      buildCmd,
      'aider',
      'image-build',
      'node'
    );

    if (buildResult.success) {
      console.log('[AiderProcessManager] Aider base image built successfully');
      return true;
    } else {
      console.error('[AiderProcessManager] Failed to build aider base image:', buildResult.error);
      return false;
    }
  }

  // Create aider process for a specific test as a background command
  async createAiderProcess(
    runtime: IRunTime,
    testPath: string,
    metafile: IMetaFile
  ): Promise<void> {
    const processId = `allTests-${runtime}-${testPath}-aider`;
    console.log(`[AiderProcessManager] Creating aider Docker container: ${processId}`);

    // Ensure aider base image exists
    const imageReady = await this.ensureAiderImage();
    if (!imageReady) {
      console.error('[AiderProcessManager] Cannot create aider container: base image not available');
      this.addLogEntry(processId, "error", "Failed to build aider base image", new Date(), "error");
      return;
    }

    // Extract relevant files from metafile for aider context
    const contextFiles: string[] = [];
    if (metafile.metafile && metafile.metafile.inputs) {
      const inputs = metafile.metafile.inputs;
      if (inputs instanceof Map) {
        contextFiles.push(...Array.from(inputs.keys()));
      } else if (typeof inputs === 'object') {
        contextFiles.push(...Object.keys(inputs));
      }
    }

    // Filter to relevant source files
    const sourceFiles = contextFiles.filter(file =>
      file.endsWith('.ts') ||
      file.endsWith('.js') ||
      file.endsWith('.py') ||
      file.endsWith('.go')
    ).slice(0, 10); // Limit to first 10 files

    // Create a Docker container for aider
    const containerName = `aider-${runtime}-${testPath.replace(/[^a-zA-Z0-9]/g, '-')}`;

    // First, check if container is already running
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
      console.log(`[AiderProcessManager] Aider container ${containerName} is already running, skipping creation`);
      this.addLogEntry(processId, "stdout", `Aider Docker container already running: ${containerName}`, new Date(), "info");

      // Store container info for tracking
      const processInfo = {
        promise: Promise.resolve({ stdout: '', stderr: '' }),
        status: "running",
        command: "docker container already running",
        timestamp: new Date().toISOString(),
        type: "docker",
        category: "aider",
        testName: testPath,
        platform: runtime,
        containerName: containerName,
      } as any;

      this.allProcesses.set(processId, processInfo);
      this.aiderProcesses.set(processId, { containerName });
      return;
    }

    // Check if container exists but is not running (exited, stopped, etc.)
    const checkAllCmd = `docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`;
    const checkAllResult = await this.executeCommand(
      `${processId}-check-all`,
      checkAllCmd,
      "aider",
      testPath,
      runtime
    );

    // If container exists but is not running, remove it so we can create a fresh one
    if (checkAllResult.success && checkAllResult.stdout && checkAllResult.stdout.trim() === containerName) {
      console.log(`[AiderProcessManager] Container ${containerName} exists but is not running, removing...`);
      const removeResult = await this.executeCommand(
        `${processId}-remove`,
        `docker rm -f ${containerName}`,
        "aider",
        testPath,
        runtime
      );
      if (!removeResult.success) {
        console.error(`[AiderProcessManager] Failed to remove existing container ${containerName}:`, removeResult.error);
      } else {
        console.log(`[AiderProcessManager] Removed existing container ${containerName}`);
      }
    }

    // Load API keys from .aider.conf.yml
    const apiKeys = this.loadAiderApiKeys();

    // Build environment variables for API keys
    const envVars = Object.entries(apiKeys).map(([key, value]) => `-e ${key}=${value}`);

    // Build the Docker run command using the pre-built aider image
    // Start aider with the relevant source files
    const dockerArgs = [
      'docker', 'run',
      '-d', // Run in detached mode
      '--name', containerName,
      '-v', `${process.cwd()}:/workspace`, // Mount the current directory
      '-w', '/workspace', // Set working directory
      '--network', 'allTests_network', // Use the same network as other services
      ...envVars, // Add API key environment variables
      'testeranto-aider:latest',
      // Pass source files to aider
      ...sourceFiles.slice(0, 5) // Limit to first 5 files to avoid command line being too long
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

    // Store container info for later management
    const processInfo = {
      promise: Promise.resolve({ stdout: '', stderr: '' }),
      status: "running",
      command,
      timestamp: new Date().toISOString(),
      type: "docker",
      category: "aider",
      testName: testPath,
      platform: runtime,
      containerName: containerName,
    } as any;

    this.allProcesses.set(processId, processInfo);

    // Store container name for later reference
    this.aiderProcesses.set(processId, { containerName });

    // Check if container started successfully
    if (result.success) {
      this.addLogEntry(processId, "stdout", `Aider Docker container started: ${containerName}`, new Date(), "info");
      console.log(`[AiderProcessManager] Aider Docker container ${containerName} started`);

      // Get container logs
      setTimeout(async () => {
        const logResult = await this.executeCommand(
          `${processId}-logs`,
          `docker logs ${containerName}`,
          "aider",
          testPath,
          runtime
        );
      }, 2000);
    } else {
      this.addLogEntry(processId, "error", `Failed to start aider Docker container: ${result.error}`, new Date(), "error");
      console.error(`[AiderProcessManager] Failed to start aider Docker container:`, result.error);
    }

    // Provide connection instructions
    const connectionInfo = `To connect to this aider session, use: docker exec -it ${containerName} /bin/bash`;
    this.addLogEntry(processId, "stdout", connectionInfo, new Date(), "info");

    // Also provide VS Code terminal command
    const vscodeCommand = `docker exec -it ${containerName} bash -c "aider --yes --dark-mode ${sourceFiles.join(' ')}"`;
    this.addLogEntry(processId, "stdout", `VS Code terminal command: ${vscodeCommand}`, new Date(), "info");
  }
}
