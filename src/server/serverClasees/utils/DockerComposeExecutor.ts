export interface IDockerComposeResult {
  exitCode: number;
  out: string;
  err: string;
  data: any;
}

export interface DockerComposeOptions {
  cwd: string;
  config: string;
  log: boolean;
  commandOptions?: string[];
  env?: Record<string, string>;
}

export type ExecFunction = (command: string, options: { cwd: string }) => Promise<{ stdout: string; stderr: string }>;

export class DockerComposeExecutor {
  constructor(private exec: ExecFunction) {}

  async upAll(
    composeFile: string,
    cwd: string
  ): Promise<IDockerComposeResult> {
    try {
      const cmd = `docker compose -f "${composeFile}" up -d`;
      const { stdout, stderr } = await this.exec(cmd, { cwd });

      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null,
      };
    } catch (error: any) {
      return {
        exitCode: 1,
        out: "",
        err: `Error starting services: ${error.message}`,
        data: null,
      };
    }
  }

  async down(
    composeFile: string,
    cwd: string
  ): Promise<IDockerComposeResult> {
    try {
      const cmd = `docker compose -f "${composeFile}" down`;
      const { stdout, stderr } = await this.exec(cmd, { cwd });

      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null,
      };
    } catch (error: any) {
      return {
        exitCode: 1,
        out: "",
        err: `Error stopping services: ${error.message}`,
        data: null,
      };
    }
  }

  async upOne(
    serviceName: string,
    composeFile: string,
    cwd: string
  ): Promise<IDockerComposeResult> {
    try {
      const cmd = `docker compose -f "${composeFile}" up -d ${serviceName}`;
      const { stdout, stderr } = await this.exec(cmd, { cwd });

      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null,
      };
    } catch (error: any) {
      return {
        exitCode: 1,
        out: "",
        err: `Error starting service ${serviceName}: ${error.message}`,
        data: null,
      };
    }
  }

  async ps(
    composeFile: string,
    cwd: string
  ): Promise<IDockerComposeResult> {
    try {
      const cmd = `docker compose -f "${composeFile}" ps`;
      const { stdout, stderr } = await this.exec(cmd, { cwd });

      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null,
      };
    } catch (error: any) {
      return {
        exitCode: 1,
        out: "",
        err: `Error getting service status: ${error.message}`,
        data: null,
      };
    }
  }

  async logs(
    serviceName: string,
    composeFile: string,
    cwd: string,
    tail: number = 100,
    options?: any // Accept options parameter for compatibility
  ): Promise<IDockerComposeResult> {
    try {
      const composeCmd = `docker compose -f "${composeFile}" logs --no-color --tail=${tail}`;
      const fullCmd = serviceName ? `${composeCmd} ${serviceName}` : composeCmd;
      
      const { stdout, stderr } = await this.exec(fullCmd, { cwd });

      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null,
      };
    } catch (error: any) {
      return {
        exitCode: 1,
        out: "",
        err: `Error getting logs for ${serviceName}: ${error.message}`,
        data: null,
      };
    }
  }

  async configServices(
    composeFile: string,
    cwd: string
  ): Promise<IDockerComposeResult> {
    try {
      const cmd = `docker compose -f "${composeFile}" config --services`;
      const { stdout, stderr } = await this.exec(cmd, { cwd });

      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null,
      };
    } catch (error: any) {
      return {
        exitCode: 1,
        out: "",
        err: `Error getting services from config: ${error.message}`,
        data: null,
      };
    }
  }

  async build(
    composeFile: string,
    cwd: string
  ): Promise<IDockerComposeResult> {
    try {
      const cmd = `docker compose -f "${composeFile}" build`;
      const { stdout, stderr } = await this.exec(cmd, { cwd });

      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null,
      };
    } catch (error: any) {
      return {
        exitCode: 1,
        out: "",
        err: `Error building services: ${error.message}`,
        data: null,
      };
    }
  }
}
