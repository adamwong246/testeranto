/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  buildMany,
  down,
  IDockerComposeResult,
  logs,
  ps,
  upAll,
  upOne,
} from "docker-compose";
import fs from "fs";
import path from "path";
import { IBuiltConfig, IRunTime } from "../../Types";
// Note: setupDockerCompose is imported dynamically to avoid circular dependencies
import { setupDockerfileForBuildGolang } from "../golang/setupDockerfileForBuildGolang";
import { setupDockerfileForBuildNode } from "../node/setupDockerfileForBuildNode";
import { setupDockerfileForBuildPython } from "../python/setupDockerfileForBuildPython";
import { DockerComposeOptions } from "../types";
import { setupDockerfileForBuildWeb } from "../web/setupDockerfileForBuildWeb";
import { Server_TCP } from "./Server_TCP";

export class Server_DockerCompose extends Server_TCP {
  private cwd: string;
  private config: string;
  private composeDir: string;
  private composeFile: string;

  constructor(cwd: string, configs: IBuiltConfig, name: string, mode: string) {
    super(configs, name, mode);
    this.cwd = cwd;
    this.config = path.join(
      "testeranto",
      "bundles",
      `${this.projectName}-docker-compose.yml`
    );
    this.composeDir = process.cwd();
    this.composeFile = path.join(
      this.composeDir,
      "testeranto",
      "bundles",
      `${this.projectName}-docker-compose.yml`
    );

    // Ensure the compose file is created before starting services
    this.initializeAndStart().catch((error) => {
      console.error("Failed to initialize docker-compose:", error);
    });
  }

  private async initializeAndStart(): Promise<void> {
    console.log(`Setting up docker-compose for ${this.projectName}...`);
    
    // Import setupDockerCompose here to avoid circular dependencies
    const { setupDockerCompose } = await import("../docker/dockerComposeGenerator");
    
    // Wait for docker-compose file to be generated
    await setupDockerCompose(this.configs, this.projectName, {
      logger: {
        log: (...args) => console.log(...args),
        error: (...args) => console.error(...args)
      }
    });

    // Check if compose file was created
    if (!fs.existsSync(this.composeFile)) {
      console.error(`Docker-compose file not found after generation: ${this.composeFile}`);
      // Try to list the directory to see what's there
      const dir = path.dirname(this.composeFile);
      if (fs.existsSync(dir)) {
        console.error(`Contents of ${dir}:`);
        try {
          const files = fs.readdirSync(dir);
          console.error(files);
        } catch (e) {
          console.error(`Error reading directory: ${e}`);
        }
      }
      return;
    }

    console.log(`Docker-compose file created at: ${this.composeFile}`);
    
    // Start docker-compose services
    await this.startServices();
  }

  private async startServices(): Promise<void> {
    console.log(`Starting docker-compose services for ${this.projectName}...`);
    console.log(`Compose file path: ${this.composeFile}`);
    console.log(`Working directory: ${this.composeDir}`);
    console.log(`Config path: ${this.config}`);

    // Check if compose file exists
    if (!fs.existsSync(this.composeFile)) {
      console.error(`Docker-compose file not found: ${this.composeFile}`);
      console.error(`Current directory: ${process.cwd()}`);
      // List directory contents
      const bundlesDir = path.join(process.cwd(), "testeranto", "bundles");
      if (fs.existsSync(bundlesDir)) {
        console.error(`Contents of ${bundlesDir}:`);
        try {
          const files = fs.readdirSync(bundlesDir);
          console.error(files);
        } catch (e) {
          console.error(`Error reading directory: ${e}`);
        }
      }
      return;
    }

    // Log the compose file content
    try {
      const composeContent = fs.readFileSync(this.composeFile, 'utf-8');
      console.log(`Docker-compose file content (first 3000 chars):`);
      console.log(composeContent.substring(0, 3000));
      console.log(`File size: ${composeContent.length} bytes`);
    } catch (error) {
      console.error(`Error reading compose file: ${error}`);
    }

    // First, check if services are already running
    try {
      console.log(`Checking current service status...`);
      const psResult = await this.DC_ps();
      console.log(`Current service status:`, psResult.out);
      console.log(`Exit code: ${psResult.exitCode}`);
      if (psResult.err) {
        console.error(`Error from ps:`, psResult.err);
      }
    } catch (error) {
      console.error(`Error checking service status:`, error);
    }

    try {
      // First, build the images
      console.log(`Building docker-compose images...`);
      const buildResult = await this.DC_buildAll();
      console.log(`docker-compose build completed with exit code: ${buildResult.exitCode}`);
      if (buildResult.exitCode !== 0) {
        console.error(
          `docker-compose build failed with exit code ${buildResult.exitCode}:`
        );
        console.error(`Error: ${buildResult.err}`);
        console.error(`Output: ${buildResult.out}`);
        return;
      } else {
        console.log(`docker-compose images built successfully`);
      }

      console.log(`Running docker-compose up...`);
      const result = await this.DC_upAll();
      console.log(`docker-compose up completed with exit code: ${result.exitCode}`);
      if (result.exitCode !== 0) {
        console.error(
          `docker-compose up failed with exit code ${result.exitCode}:`
        );
        console.error(`Error: ${result.err}`);
        console.error(`Output: ${result.out}`);
      } else {
        console.log(`docker-compose services started successfully`);
        console.log(`Output (first 3000 chars): ${result.out?.substring(0, 3000)}`);

        // Wait a bit for services to become healthy
        console.log(`Waiting for services to become healthy (15 seconds)...`);
        await new Promise((resolve) => setTimeout(resolve, 15000));

        // Check service status again
        console.log(`Checking service status after startup...`);
        const psResult2 = await this.DC_ps();
        console.log(`Service status after startup:`, psResult2.out);
        
        if (!psResult2.out || psResult2.out.trim() === '') {
          console.error(`No services found in docker-compose ps output!`);
          console.error(`This suggests the services weren't started properly.`);
          console.error(`Trying to get logs for all services...`);
          
          // Try to get logs for all services defined in the compose file
          const composeContent = fs.readFileSync(this.composeFile, 'utf-8');
          const yaml = await import('js-yaml');
          const composeObj = yaml.load(composeContent) as any;
          const serviceNames = Object.keys(composeObj?.services || {});
          
          console.log(`Services defined in compose file: ${serviceNames.join(', ')}`);
          
          for (const serviceName of serviceNames) {
            try {
              console.log(`Getting logs for ${serviceName}...`);
              const logsResult = await this.DC_logs(serviceName);
              console.log(`${serviceName} logs (first 1000 chars):`, logsResult.out?.substring(0, 1000));
            } catch (e) {
              console.error(`Error getting logs for ${serviceName}:`, e);
            }
          }
        } else {
          // Also get logs for build services if they exist
          console.log(`Getting logs for build services...`);
          
          // First, check which services are actually running
          const serviceOutput = psResult2.out || '';
          
          // Check for node-build service (using the new container name)
          if (serviceOutput.includes('bundles-node-build') || serviceOutput.includes('node-build')) {
            try {
              const nodeBuildLogs = await this.DC_logs('node-build');
              console.log(`node-build logs (first 2000 chars):`, nodeBuildLogs.out?.substring(0, 2000));
            } catch (e) {
              console.error(`Error getting node-build logs:`, e);
            }
          } else {
            console.log(`node-build service not found in running services`);
          }
          
          // Check for web-build service (using the new container name)
          if (serviceOutput.includes('bundles-web-build') || serviceOutput.includes('web-build')) {
            try {
              const webBuildLogs = await this.DC_logs('web-build');
              console.log(`web-build logs (first 2000 chars):`, webBuildLogs.out?.substring(0, 2000));
            } catch (e) {
              console.error(`Error getting web-build logs:`, e);
            }
          } else {
            console.log(`web-build service not found in running services`);
          }
        }
      }
    } catch (error) {
      console.error(`Error starting docker-compose services:`, error);
      console.error(`Full error:`, error);
    }
  }

  setupDockerfileForBuild(runtime: IRunTime, testsName: string): string {
    const configFilePath = process.argv[2];

    let dockerfileContent: string;

    if (runtime === "node") {
      dockerfileContent = setupDockerfileForBuildNode(configFilePath);
    } else if (runtime === "web") {
      dockerfileContent = setupDockerfileForBuildWeb(configFilePath);
    } else if (runtime === "python") {
      dockerfileContent = setupDockerfileForBuildPython(configFilePath);
    } else if (runtime === "golang") {
      dockerfileContent = setupDockerfileForBuildGolang(configFilePath);
    } else {
      throw new Error(
        `Unsupported runtime for build Dockerfile generation: ${runtime}`
      );
    }

    if (!dockerfileContent || dockerfileContent.trim().length === 0) {
      console.warn(
        `Generated empty Build Dockerfile for ${runtime}, using fallback`
      );
      const baseNodeImage = "node:20.19.4-alpine";
      dockerfileContent = `FROM ${
        runtime === "node"
          ? baseNodeImage
          : runtime === "python"
          ? "python:3.11-alpine"
          : runtime === "golang"
          ? "golang:1.21-alpine"
          : baseNodeImage
      }\nWORKDIR /app\nRUN mkdir -p /workspace/testeranto/metafiles\nCOPY . .\nRUN echo 'Build phase completed'\nCMD ["sh", "-c", "echo 'Build service started' && tail -f /dev/null"]\n`;
    }

    const dockerfileName = `${runtime}.Dockerfile`;
    const dockerfileDir = path.join(
      "testeranto",
      "bundles",
      testsName,
      runtime
    );
    const dockerfilePath = path.join(dockerfileDir, dockerfileName);

    // Ensure we're not writing outside of testeranto/bundles
    const normalizedDir = path.normalize(dockerfileDir);
    if (!normalizedDir.startsWith(path.join("testeranto", "bundles"))) {
      throw new Error(
        `Invalid Dockerfile directory: ${dockerfileDir}. Must be under testeranto/bundles/`
      );
    }

    // Create the directory and write the file
    const fullDockerfileDir = path.join(process.cwd(), dockerfileDir);
    fs.mkdirSync(fullDockerfileDir, { recursive: true });
    const fullDockerfilePath = path.join(process.cwd(), dockerfilePath);
    fs.writeFileSync(fullDockerfilePath, dockerfileContent);

    // Verify the file exists
    if (!fs.existsSync(fullDockerfilePath)) {
      throw new Error(
        `Failed to create build Dockerfile at ${fullDockerfilePath}`
      );
    }

    return dockerfileDir;
  }

  public generateBuildServiceForRuntime(
    c: IBuiltConfig,
    runtime: IRunTime,
    testsName: string,
    logger?: {
      log: (...args: any[]) => void;
    }
  ): Record<string, any> {
    const buildDockerfileDir = setupDockerfileForBuild(
      runtime,
      testsName,
      logger
    );
    return createBuildService(runtime, buildDockerfileDir, testsName);
  }

  public async DC_buildAll(
    options?: Partial<DockerComposeOptions>
  ): Promise<IDockerComposeResult> {
    const opts = this.mergeOptions(options);
    // Get all service names from the compose file
    const composeContent = fs.readFileSync(this.composeFile, 'utf-8');
    const yaml = await import('js-yaml');
    const composeObj = yaml.load(composeContent) as any;
    const serviceNames = Object.keys(composeObj?.services || {});
    
    if (serviceNames.length === 0) {
      return { exitCode: 0, out: 'No services to build', err: '' };
    }
    
    return await buildMany(serviceNames, opts);
  }

  public async DC_upAll(
    options?: Partial<DockerComposeOptions>
  ): Promise<IDockerComposeResult> {
    const opts = this.mergeOptions(options);
    return await upAll(opts);
  }

  public async DC_down(
    options?: Partial<DockerComposeOptions>
  ): Promise<IDockerComposeResult> {
    const opts = this.mergeOptions(options);
    return await down(opts);
  }

  public async DC_upOne(
    serviceName: string,
    options?: Partial<DockerComposeOptions>
  ): Promise<IDockerComposeResult> {
    const opts = this.mergeOptions(options);
    return await upOne(serviceName, opts);
  }

  public async DC_ps(
    options?: Partial<DockerComposeOptions>
  ): Promise<IDockerComposeResult> {
    const opts = this.mergeOptions(options);
    return await ps(opts);
  }

  public async DC_logs(
    serviceName: string,
    options?: Partial<DockerComposeOptions>
  ): Promise<IDockerComposeResult> {
    const opts = this.mergeOptions(options);
    return await logs(serviceName, opts);
  }

  private mergeOptions(
    options?: Partial<DockerComposeOptions>
  ): DockerComposeOptions {
    const base = {
      cwd: this.composeDir, // Use composeDir which is process.cwd()
      config: this.composeFile, // Use absolute path to docker-compose.yml file
      log: true,
    };
    // Merge options
    const merged = { ...base, ...options };
    return merged;
  }

  public getCwd(): string {
    return this.cwd;
  }

  public getConfig(): string {
    return this.config;
  }

  // Static methods for direct usage without creating an instance
  static async upAll(
    options: DockerComposeOptions
  ): Promise<IDockerComposeResult> {
    return await upAll(options);
  }

  static async down(
    options: DockerComposeOptions
  ): Promise<IDockerComposeResult> {
    return await down(options);
  }

  static async logs(
    serviceName: string,
    options: DockerComposeOptions
  ): Promise<IDockerComposeResult> {
    return await logs(serviceName, options);
  }
}
