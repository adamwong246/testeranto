import {
  down,
  IDockerComposeResult,
  logs,
  ps,
  upAll,
  upOne,
} from "docker-compose";
import fs from "fs";
import path from "path";
import { IBuiltConfig } from "../../Types";
import { DockerComposeOptions, IMode } from "../types";
import { Server_TCP_Commands } from "./Server_TCP_Commands";

export class Server_DockerCompose extends Server_TCP_Commands {
  private cwd: string;
  private config: string;
  private composeDir: string;
  private composeFile: string;

  constructor(cwd: string, configs: IBuiltConfig, name: string, mode: IMode) {
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
    // Import setupDockerCompose here to avoid circular dependencies
    const { setupDockerCompose } = await import(
      "../docker/dockerComposeGenerator"
    );

    // Wait for docker-compose file to be generated
    await setupDockerCompose(this.configs, this.projectName, {
      logger: {
        log: (...args) => console.log(...args),
        error: (...args) => console.error(...args),
      },
    });

    // Check if compose file was created
    // if (!fs.existsSync(this.composeFile)) {
    //   console.error(
    //     `Docker-compose file not found after generation: ${this.composeFile}`
    //   );
    //   // Try to list the directory to see what's there
    //   const dir = path.dirname(this.composeFile);
    //   if (fs.existsSync(dir)) {
    //     console.error(`Contents of ${dir}:`);
    //     try {
    //       const files = fs.readdirSync(dir);
    //       console.error(files);
    //     } catch (e) {
    //       console.error(`Error reading directory: ${e}`);
    //     }
    //   }
    //   return;
    // }

    await this.startServices();
  }

  private async startServices(): Promise<void> {
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

    try {
      const result = await this.DC_upAll();
      console.log(
        `docker-compose up completed with exit code: ${result.exitCode}`
      );
      if (result.exitCode !== 0) {
        console.error(
          `docker-compose up failed with exit code ${result.exitCode}:`
        );
        console.error(`Error: ${result.err}`);
        console.error(`Output: ${result.out}`);
      } else {
        console.log(`Waiting for services to become healthy (15 seconds)...`);
        await new Promise((resolve) => setTimeout(resolve, 15000));

        const psResult2 = await this.DC_ps();
        console.log(`Service status after startup:`, psResult2.out);
      }
    } catch (error) {
      console.error(
        `Error starting docker-compose services:`,
        error,
        this.composeFile
      );
      console.error(`Full error:`, error);
    }
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
      config: this.config, // Path to the docker-compose.yml file
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
