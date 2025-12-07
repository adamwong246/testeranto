/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  down,
  IDockerComposeResult,
  logs,
  ps,
  upAll,
  upOne,
} from "docker-compose";
import path from "path";
import fs from "fs";
import { IBuiltConfig, IRunTime } from "../../Types";
import { setupDockerCompose } from "../docker/dockerComposeGenerator";
import { Server_TCP } from "./Server_TCP";
import { setupDockerfileForBuildGolang } from "../golang/setupDockerfileForBuildGolang";
import { setupDockerfileForBuildNode } from "../node/setupDockerfileForBuildNode";
import { setupDockerfileForBuildPython } from "../python/setupDockerfileForBuildPython";
import { DockerComposeOptions } from "../types";
import { setupDockerfileForBuildWeb } from "../web/setupDockerfileForBuildWeb";

export class Server_DockerCompose extends Server_TCP {
  private cwd: string;
  private config: string;
  private composeDir: string;
  private composeFile: string;

  constructor(cwd: string, configs: IBuiltConfig, name: string, mode: string) {
    super(configs, name, mode);
    this.cwd = cwd;
    this.composeDir = process.cwd();
    this.composeFile = path.join(
      this.composeDir,
      "testeranto",
      "bundles",
      `${this.projectName}-docker-compose.yml`
    );

    setupDockerCompose(configs, name);
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
      dockerfileContent = `FROM ${
        runtime === "node"
          ? "node:18-alpine"
          : runtime === "python"
          ? "node:18-alpine"
          : runtime === "golang"
          ? "node:18-alpine"
          : "alpine:latest"
      }\nWORKDIR /app\nRUN mkdir -p /workspace/testeranto/metafiles\nCOPY . .\nRUN echo 'Build phase completed'\n`;
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
      cwd: this.cwd,
      config: this.config,
      log: true,
    };
    // Merge options
    const merged = { ...base, ...options };
    // Keep detach in options - the docker-compose library needs it
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
