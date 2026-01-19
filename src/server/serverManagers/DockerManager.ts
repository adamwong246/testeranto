// Do not allow imports from outside the project (fs, exec, ws, etc)

import { IBuiltConfig, IRunTime } from "../../Types";
import { golangBddCommand, golangDockerComposeFile } from "../runtimes/golang/docker";
import { nodeDockerComposeFile, nodeBddCommand } from "../runtimes/node/docker";
import { pythonBDDCommand, pythonDockerComposeFile } from "../runtimes/python/docker";
import { rubyBddCommand, rubyDockerComposeFile } from "../runtimes/ruby/docker";
import { webBddCommand, webDockerComposeFile } from "../runtimes/web/docker";

export type IService = any;


export interface IDockerComposeResult {
  exitCode: number;
  out: string;
  err: string;
  data: any;
}

export class DockerManager {

  cwd: string;
  composeFile: string;
  projectName: string

  constructor(composeFile: string, projectName: string) {
    this.cwd = process.cwd();
    this.composeFile = composeFile
    this.projectName = projectName
  }

  buildLogsHeader() {
    let header = `=== Docker Compose Build Logs ===\n`;
    header += `Started at: ${new Date().toISOString()}\n`;
    header += `Project: ${this.projectName}\n`;
    header += `Compose file: ${this.composeFile}\n`;
    header += "=".repeat(50) + "\n\n";
    return header;
  }

  BaseCompose(services: any) {
    return {
      services,
      volumes: {
        node_modules: {
          driver: "local",
        },
      },
      networks: {
        default: {
          name: "allTests_network",
        },
      },
    };
  }

  staticTestDockerComposeFile(config: IBuiltConfig, runtime: IRunTime, container_name: string, command: string) {
    return {
      build: {
        context: process.cwd(),
        dockerfile: `${config[runtime].dockerfile}`,
      },
      container_name,
      environment: {
        NODE_ENV: "production",
        ...config.env,
      },
      working_dir: "/workspace",
      command: command,
    }

  };

  bddTestDockerComposeFile(config: IBuiltConfig, runtime: IRunTime, container_name: string, command: string) {
    const service: any = {
      build: {
        context: process.cwd(),
        dockerfile: `${config[runtime].dockerfile}`,
      },
      container_name,
      environment: {
        NODE_ENV: "production",
        ...config.env,
      },
      working_dir: "/workspace",

      volumes: [
        `${process.cwd()}/src:/workspace/src`,
        `${process.cwd()}/example:/workspace/example`,
        `${process.cwd()}/dist:/workspace/dist`,
        `${process.cwd()}/testeranto:/workspace/testeranto`,
      ],

      // ports: [
      //   "9222:9222"
      // ],

      command: command,
    };

    return service;
  };

  aiderDockerComposeFile(config: IBuiltConfig, runtime: IRunTime, container_name: string) {
    return {
      build: {
        context: process.cwd(),
        dockerfile: 'aider.Dockerfile',
      },
      container_name,
      environment: {
        NODE_ENV: "production",
        ...config.env,
      },
      working_dir: "/workspace",
      command: "aider"
    }

  };

  generateServices(
    config: IBuiltConfig,
    runtimes: IRunTime[],
  ): Record<string, any> {
    const services: IService = {};

    // Add browser service
    services['browser'] = {
      image: 'browserless/chrome:latest',
      container_name: 'browser-allTests',
      environment: {
        CONNECTION_TIMEOUT: '60000',
        MAX_CONCURRENT_SESSIONS: '10',
        ENABLE_CORS: 'true',
        TOKEN: '',
      },
      ports: [
        '3000:3000',
        '9222:9222'
      ],
      networks: ["default"],
      // healthcheck: {
      //   test: ["CMD", "curl", "-f", "http://localhost:3000h"],
      //   interval: "30s",
      //   timeout: "10s",
      //   retries: 3,
      //   start_period: "40s"
      // }
    };

    for (const runtime of runtimes) {
      if (runtime === "node") {
        services[`${runtime}-builder`] = nodeDockerComposeFile(config, 'allTests');
      } else if (runtime === "web") {
        services[`${runtime}-builder`] = webDockerComposeFile(config, 'allTests');
      } else if (runtime === "golang") {
        services[`${runtime}-builder`] = golangDockerComposeFile(config, 'allTests');
      } else if (runtime === "python") {
        services[`${runtime}-builder`] = pythonDockerComposeFile(config, 'allTests');
      } else if (runtime === "ruby") {
        services[`${runtime}-builder`] = rubyDockerComposeFile(config, 'allTests');
      } else {
        throw `unknown runtime ${runtime}`;
      }
      for (const test in config[runtime].tests) {
        const uid =
          `${runtime}-${test.toLowerCase().replaceAll("/", "_").replaceAll(".", "-")}`

        // Static tests
        for (const [index, check] of config[runtime].checks.entries()) {
          const tuid = `${uid}-static-${index}`
          // Convert check function to command string
          // The check function takes a test name and returns a command
          const checkCommand = typeof check === 'function' ? check(test) : check;
          services[tuid] =
            this.staticTestDockerComposeFile(config, runtime, tuid, checkCommand);
        }

        // BDD test
        let bddCommand = '';
        if (runtime === 'node') {
          bddCommand = nodeBddCommand(config.httpPort || 3456);
        } else if (runtime === 'web') {
          bddCommand = webBddCommand();
        } else if (runtime === 'golang') {
          bddCommand = golangBddCommand();
        } else if (runtime === 'python') {
          bddCommand = pythonBDDCommand(0);
        } else if (runtime === 'ruby') {
          bddCommand = rubyBddCommand();
        }
        services[`${uid}-bdd`] = this.bddTestDockerComposeFile(config, runtime, `${uid}-bdd`, bddCommand);

        // Aider service (keep without command to use Dockerfile's CMD)
        services[`${uid}-aider`] = this.aiderDockerComposeFile(config, runtime, `${uid}-aider`);
      }
    }

    // Ensure all services use the same network configuration
    for (const serviceName in services) {
      if (!services[serviceName].networks) {
        services[serviceName].networks = ["default"];
      }
    }

    console.log(JSON.stringify(services, null, 2))
    return services;
  }

  autogenerateStamp(x: string) {
    return `# This file is autogenerated. Do not edit it directly
${x}
    `
  }

  public getUpCommand(): string {
    return `docker compose -f "${this.composeFile}" up -d`;
  }

  public getDownCommand(): string {
    return `docker compose -f "${this.composeFile}" down -v --remove-orphans`;
  }

  public getPsCommand(): string {
    return `docker compose -f "${this.composeFile}" ps`;
  }

  public getLogsCommand(serviceName?: string, tail: number = 100): string {
    const base = `docker compose -f "${this.composeFile}" logs --no-color --tail=${tail}`;
    return serviceName ? `${base} ${serviceName}` : base;
  }

  public getConfigServicesCommand(): string {
    return `docker compose -f "${this.composeFile}" config --services`;
  }

  public getBuildCommand(): string {
    return `docker compose -f "${this.composeFile}" build`;
  }

  public getStartCommand(): string {
    return `docker compose -f "${this.composeFile}" start`;
  }
}
