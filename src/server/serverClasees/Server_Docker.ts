import { exec, spawn } from "child_process";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { promisify } from "util";
import { IBuiltConfig, IRunTime } from "../../Types";
import { DockerManager, IDockerComposeResult, IService } from "../serverManagers/DockerManager";
import { IMode } from "../types";
import { Server_Base } from "./Server_Base";
import ansiColors from "ansi-colors";
import { Server_WS } from "./Server_WS";


// [x] v0 - bring up all containers
// [ ] v1 - coordinate containers
// We need to first bring up the builders, as they produce the inputFiles and artifacts
// When inputFiles change, we run the static analysis
// When artifacts change, we run the bdd tests

export class Server_Docker extends Server_WS {

  dockerManager: DockerManager;

  constructor(configs: IBuiltConfig, projectName: string, mode: IMode) {
    super(configs, projectName, mode);

    this.dockerManager = new DockerManager(path.join(
      process.cwd(),
      "testeranto",
      "bundles",
      `${this.projectName}-docker-compose.yml`
    ), projectName);
  }

  async start() {
    console.log(`[Server_Docker] start()`)
    super.start();
    await this.setupDockerCompose(this.configs, this.projectName);

    // Aggressively clean up everything before starting
    console.log(`[Server_Docker] Dropping everything...`);

    // 1. Stop and remove all containers, networks, and volumes defined in the compose file
    try {
      const downCmd = `docker compose -f "${this.dockerManager.composeFile}" down -v --remove-orphans`;
      console.log(`[Server_Docker] Running: ${downCmd}`);
      await this.spawnPromise(downCmd);
      console.log(`[Server_Docker] Docker compose down completed`);
    } catch (error: any) {
      console.log(`[Server_Docker] Docker compose down noted: ${error.message}`);
    }

    // 2. Remove any container that might have been created outside docker compose
    // but has a name matching our project pattern
    try {
      // Get all container names
      const listCmd = `docker ps -a --format "{{.Names}}"`;
      const execAsync = promisify(exec);
      const { stdout } = await execAsync(listCmd, { cwd: this.dockerManager.cwd });
      const containerNames = stdout.trim().split('\n').filter(name => name.trim());

      // Remove containers that contain our project name or test patterns
      for (const name of containerNames) {
        if (name.includes(this.projectName) || name.includes('example/Calculator')) {
          console.log(`[Server_Docker] Removing stray container: ${name}`);
          try {
            await this.spawnPromise(`docker rm -f ${name}`);
          } catch (rmError) {
            console.log(`[Server_Docker] Could not remove container ${name}: ${rmError.message}`);
          }
        }
      }
    } catch (error: any) {
      console.log(`[Server_Docker] Stray container cleanup noted: ${error.message}`);
    }

    // 3. Remove any network that might be left over
    try {
      const networkName = "allTests_network";
      await this.spawnPromise(`docker network rm ${networkName} 2>/dev/null || true`);
    } catch (error: any) {
      // Ignore errors
    }

    // v0
    // await this.DC_build();

    // // v1 implemented
    // Runtime files from testeranto/runtimes/ are copied into builder images via Dockerfile
    // This includes node.js, web.js, golang.go, and python.py configuration files

    const runtimes: IRunTime[] = ["node", "web", "golang", "python"];

    // Start builder services
    for (const runtime of runtimes) {
      const serviceName = `${runtime}-builder`;
      console.log(`[Server_Docker] Starting builder service: ${serviceName}`);
      try {
        await this.spawnPromise(`docker compose -f "${this.dockerManager.composeFile}" up -d ${serviceName}`);
      } catch (error: any) {
        console.error(`[Server_Docker] Failed to start ${serviceName}: ${error.message}`);
      }
    }

    // Start aider services
    for (const runtime of runtimes) {
      const aiderServiceName = `${runtime}-aider`;
      console.log(`[Server_Docker] Starting aider service: ${aiderServiceName}`);
      try {
        await this.spawnPromise(`docker compose -f "${this.dockerManager.composeFile}" up -d ${aiderServiceName}`);
      } catch (error: any) {
        console.error(`[Server_Docker] Failed to start ${aiderServiceName}: ${error.message}`);
      }
    }



    // Start BDD test services
    for (const runtime of runtimes) {
      const tests = this.configs[runtime]?.tests;
      if (!tests) continue;

      for (const testName in tests) {
        const uid = `${runtime}-${testName.toLowerCase().replaceAll("/", "_").replaceAll(".", "-")}`;
        const bddServiceName = `${uid}-bdd`;
        console.log(`[Server_Docker] Starting BDD service: ${bddServiceName}`);
        try {
          await this.spawnPromise(`docker compose -f "${this.dockerManager.composeFile}" up -d ${bddServiceName}`);
        } catch (error: any) {
          console.error(`[Server_Docker] Failed to start ${bddServiceName}: ${error.message}`);
        }
      }
    }

    // Start static test services
    for (const runtime of runtimes) {
      const tests = this.configs[runtime]?.tests;
      if (!tests) continue;

      for (const testName in tests) {
        const uid = `${runtime}-${testName.toLowerCase().replaceAll("/", "_").replaceAll(".", "-")}`;
        const checks = this.configs[runtime]?.checks || [];
        for (let i = 0; i < checks.length; i++) {
          const staticServiceName = `${uid}-static-${i}`;
          console.log(`[Server_Docker] Starting static test service: ${staticServiceName}`);
          try {
            await this.spawnPromise(`docker compose -f "${this.dockerManager.composeFile}" up -d ${staticServiceName}`);
          } catch (error: any) {
            console.error(`[Server_Docker] Failed to start ${staticServiceName}: ${error.message}`);
          }
        }
      }
    }
  }


  public async stop(): Promise<void> {
    console.log(`[Server_Docker] stop()`)
    const result = await this.DC_down();
    if (result.exitCode !== 0) {
      console.error(`Docker Compose down failed: ${result.err}`);
    }
    super.stop();
  }

  async setupDockerCompose(
    config: IBuiltConfig,
    testsName: string,

  ) {
    // First, ensure all necessary directories exist
    const composeDir = path.join(process.cwd(), "testeranto", "bundles");

    try {
      // Setup directories
      fs.mkdirSync(composeDir, { recursive: true });

      // Generate Dockerfiles for each runtime
      // Note: runtimes needs to be defined - we'll get it from config
      const runtimes: IRunTime[] = ["node", "web", "golang", "python"];
      // deprecated 
      // this.generateRuntimeDockerfiles(config, runtimes, composeDir, log, error);

      const services = this.dockerManager.generateServices(
        config,
        runtimes,
      );

      this.writeComposeFile(services, testsName, composeDir);
    } catch (err) {
      console.error(`Error in setupDockerCompose:`, err);
      throw err;
    }
  }

  writeComposeFile(
    services: Record<string, IService>,
    testsName: string,
    composeDir: string,
  ) {

    const composeFilePath = path.join(
      composeDir,
      `${testsName}-docker-compose.yml`
    );

    const dockerComposeFileContents = this.dockerManager.BaseCompose(services);

    try {
      fs.writeFileSync(
        composeFilePath,
        yaml.dump(dockerComposeFileContents, {
          lineWidth: -1,
          noRefs: true,
        })
      );
    } catch (err) {
      console.error(JSON.stringify(dockerComposeFileContents))
      throw err;
    }
  }

  private async exec(cmd: string, options: { cwd: string }): Promise<{ stdout: string; stderr: string }> {
    const execAsync = promisify(exec);
    return execAsync(cmd, { cwd: options.cwd });
  }

  spawnPromise(command: string) {
    return new Promise<number>((resolve, reject) => {
      console.log(`[spawnPromise] Executing: ${command}`);

      // Use shell: true to let the shell handle command parsing (including quotes)
      const child = spawn(command, {
        stdio: 'inherit',
        shell: true,
        cwd: this.dockerManager.cwd
      });

      child.on('error', (error) => {
        console.error(`[spawnPromise] Failed to start process: ${error.message}`);
        reject(error);
      });

      child.on('close', (code) => {
        if (code === 0) {
          console.log(`[spawnPromise] Process completed successfully`);
          resolve(code);
        } else {
          console.error(`[spawnPromise] Process exited with code ${code}`);
          reject(new Error(`Process exited with code ${code}`));
        }
      });
    });
  }

  public async DC_upAll(): Promise<IDockerComposeResult> {
    try {
      const cmd = this.dockerManager.getUpCommand();
      await this.spawnPromise(cmd);

      return {
        exitCode: 0,
        out: '',
        err: '',
        data: null,
      };
    } catch (error: any) {
      console.error(
        `[Docker] docker compose up ❌ ${ansiColors.bgBlue(error.message.replaceAll('\\n', '\n'))}`
      );
      return {
        exitCode: 1,
        out: '',
        err: `Error starting services: ${error.message}`,
        data: null,
      };
    }
  }

  public async DC_down(): Promise<IDockerComposeResult> {

    try {
      const cmd = this.dockerManager.getDownCommand();

      await this.spawnPromise(cmd);
      return {
        exitCode: 0,
        out: "",
        err: "",
        data: null,
      };
    } catch (error: any) {
      console.log(`[DC_down] Error during down: ${error.message}`);
      return {
        exitCode: 1,
        out: "",
        err: `Error stopping services: ${error.message}`,
        data: null,
      };
    }
  }

  public async DC_ps(): Promise<IDockerComposeResult> {
    try {
      const cmd = this.dockerManager.getPsCommand();
      const { stdout, stderr } = await this.exec(cmd, { cwd: this.dockerManager.cwd });

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

  public async DC_logs(
    serviceName: string,
    options?: { follow?: boolean; tail?: number }
  ): Promise<IDockerComposeResult> {
    const tail = options?.tail ?? 100;
    try {
      const cmd = this.dockerManager.getLogsCommand(serviceName, tail);
      const { stdout, stderr } = await this.exec(cmd, { cwd: this.dockerManager.cwd });

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

  public async DC_configServices(): Promise<IDockerComposeResult> {
    try {
      const cmd = this.dockerManager.getConfigServicesCommand();
      const { stdout, stderr } = await this.exec(cmd, { cwd: this.dockerManager.cwd });

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

  public async DC_start(): Promise<any> {
    try {
      const startCommand = this.dockerManager.getStartCommand();
      await this.spawnPromise(startCommand);

      return {
        exitCode: 0,
        data: null,
      };
    } catch (error: any) {
      console.error(
        `[Docker] docker compose start ❌ ${ansiColors.bgBlue(error.message.replaceAll('\\n', '\n'))}`
      );
      return {
        exitCode: 1,
        data: null,
      };
    }
  }

  public async DC_build(): Promise<any> {
    try {
      const buildCommand = this.dockerManager.getBuildCommand();
      await this.spawnPromise(buildCommand);

      console.log(`[DC_build] Build completed successfully`);
      return {
        exitCode: 0,
        out: '',
        err: '',
        data: null,
      };
    } catch (error: any) {
      console.error(
        `[Docker] docker-compose build ❌ ${ansiColors.bgBlue(error.message.replaceAll('\\n', '\n'))}`
      );

      return {
        exitCode: 1,
        out: '',
        err: `Error building services: ${error.message}`,
        data: null,
      };
    }
  }

}
