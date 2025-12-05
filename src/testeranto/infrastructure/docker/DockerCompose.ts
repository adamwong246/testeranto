import {
  upAll,
  down,
  upOne,
  ps,
  logs,
  IDockerComposeResult,
} from "docker-compose";
import { DockerComposeOptions } from "./types";

export class DockerCompose {
  private cwd: string;
  private config: string;

  constructor(cwd: string, config: string) {
    this.cwd = cwd;
    this.config = config;
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
