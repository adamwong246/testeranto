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

  public async upAll(
    options?: Partial<DockerComposeOptions>
  ): Promise<IDockerComposeResult> {
    const opts = this.mergeOptions(options);
    return await upAll(opts);
  }

  public async down(
    options?: Partial<DockerComposeOptions>
  ): Promise<IDockerComposeResult> {
    const opts = this.mergeOptions(options);
    return await down(opts);
  }

  public async upOne(
    serviceName: string,
    options?: Partial<DockerComposeOptions>
  ): Promise<IDockerComposeResult> {
    const opts = this.mergeOptions(options);
    return await upOne(serviceName, opts);
  }

  public async ps(
    options?: Partial<DockerComposeOptions>
  ): Promise<IDockerComposeResult> {
    const opts = this.mergeOptions(options);
    return await ps(opts);
  }

  public async logs(
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
}
