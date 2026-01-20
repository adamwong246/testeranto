import ansiColors from "ansi-colors";
import { exec, execSync, spawn } from "child_process";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { promisify } from "util";
import { RUN_TIMES } from "../../runtimes";
import { golangBddCommand, golangBuildCommand, golangDockerComposeFile } from "../runtimes/golang/docker";
import { javaBddCommand, javaBuildCommand, javaDockerComposeFile } from "../runtimes/java/docker";
import { nodeBddCommand, nodeBuildCommand, nodeDockerComposeFile } from "../runtimes/node/docker";
import { pythonBddCommand, pythonBuildCommand, pythonDockerComposeFile } from "../runtimes/python/docker";
import { rubyBddCommand, rubyBuildCommand, rubyDockerComposeFile } from "../runtimes/ruby/docker";
import { rustBddCommand, rustBuildCommand, rustDockerComposeFile } from "../runtimes/rust/docker";
import { webBddCommand, webBuildCommand, webDockerComposeFile } from "../runtimes/web/docker";
import { Server_WS } from "./Server_WS";
export class Server_Docker extends Server_WS {
    constructor(configs, mode) {
        super(configs, mode);
        this.logProcesses = new Map();
    }
    BaseCompose(services) {
        return {
            services,
            volumes: {
                node_modules: {
                    driver: "local",
                },
            },
            networks: {
                allTests_network: {
                    driver: "bridge",
                },
            },
        };
    }
    staticTestDockerComposeFile(runtime, container_name, command) {
        // Find the dockerfile path from configs
        let dockerfilePath = '';
        for (const [key, value] of Object.entries(this.configs.runtimes)) {
            if (value.runtime === runtime) {
                dockerfilePath = value.dockerfile;
                break;
            }
        }
        // If no dockerfile found, use a default based on runtime
        if (!dockerfilePath) {
            throw (`[Docker] [staticTestDockerComposeFile] no dockerfile found for ${dockerfilePath}, ${Object.entries(this.configs)}`);
        }
        return {
            build: {
                context: process.cwd(),
                dockerfile: dockerfilePath,
            },
            container_name,
            environment: {
            // NODE_ENV: "production",
            // ...config.env,
            },
            working_dir: "/workspace",
            command: command,
            networks: ["allTests_network"],
        };
    }
    ;
    bddTestDockerComposeFile(runtime, container_name, command) {
        // Find the dockerfile path from configs
        let dockerfilePath = '';
        for (const [key, value] of Object.entries(this.configs.runtimes)) {
            if (value.runtime === runtime) {
                dockerfilePath = value.dockerfile;
                break;
            }
        }
        // If no dockerfile found, use a default based on runtime
        if (!dockerfilePath) {
            throw (`[Docker] [bddTestDockerComposeFile] no dockerfile found for ${dockerfilePath}, ${Object.entries(this.configs)}`);
        }
        const service = {
            build: {
                context: process.cwd(),
                dockerfile: dockerfilePath,
            },
            container_name,
            environment: {
            // NODE_ENV: "production",
            // ...config.env,
            },
            working_dir: "/workspace",
            volumes: [
                `${process.cwd()}/src:/workspace/src`,
                `${process.cwd()}/example:/workspace/example`,
                `${process.cwd()}/dist:/workspace/dist`,
                `${process.cwd()}/testeranto:/workspace/testeranto`,
            ],
            command: command,
            networks: ["allTests_network"],
        };
        return service;
    }
    ;
    aiderDockerComposeFile(container_name) {
        return {
            build: {
                context: process.cwd(),
                dockerfile: 'aider.Dockerfile',
            },
            container_name,
            environment: {
            // NODE_ENV: "production",
            // ...config.env,
            },
            working_dir: "/workspace",
            command: "aider",
            networks: ["allTests_network"],
        };
    }
    ;
    generateServices(
    // config: IBuiltConfig,
    ) {
        const services = {};
        console.log("mark1");
        // // Add browser service
        // services['browser'] = {
        //   build:
        //   {
        //     context: `/Users/adam/Code/testeranto`,
        //     dockerfile: `src/server/runtimes/web/web.Dockerfile`
        //   },
        //   // image: 'browserless/chrome:latest',
        //   shm_size: '2gb',
        //   // environment: [ "DEFAULT_ARGS=--disable-dev-shm-usage"],
        //   container_name: 'browser-allTests',
        //   // environment: {
        //   //   CONNECTION_TIMEOUT: '60000',
        //   //   MAX_CONCURRENT_SESSIONS: '10',
        //   //   ENABLE_CORS: 'true',
        //   //   TOKEN: '',
        //   //   DEFAULT_ARGS: '--disable-dev-shm-usage'
        //   // },
        //   ports: [
        //     '3000:3000',
        //     '9222:9222'
        //   ],
        //   networks: ["default"],
        // };
        const runTimeToCompose = {
            'node': [nodeDockerComposeFile, nodeBuildCommand, nodeBddCommand],
            'web': [webDockerComposeFile, webBuildCommand, webBddCommand],
            'python': [pythonDockerComposeFile, pythonBuildCommand, pythonBddCommand],
            'golang': [golangDockerComposeFile, golangBuildCommand, golangBddCommand],
            'ruby': [rubyDockerComposeFile, rubyBuildCommand, rubyBddCommand],
            'rust': [rustDockerComposeFile, rustBuildCommand, rustBddCommand],
            "java": [javaDockerComposeFile, javaBuildCommand, javaBddCommand]
        };
        // Iterate through each entry in the config Map
        for (const [runtimeTestsName, runtimeTests] of Object.entries(this.configs.runtimes)) {
            const runtime = runtimeTests.runtime;
            const dockerfile = runtimeTests.dockerfile;
            const buildOptions = runtimeTests.buildOptions;
            const testsObj = runtimeTests.tests;
            // loop over all suites which are of the right runtime
            for (const [t, c] of Object.entries(this.configs.runtimes)) {
                if (c.runtime === runtime) {
                    if (RUN_TIMES.includes(runtime)) {
                        const buildCommand = runTimeToCompose[runtime][1](buildOptions, c.buildOptions, runtimeTestsName);
                        console.log(`[Server_Docker] [generateServices] ${runtimeTestsName} build command: "${buildCommand}"`);
                        // Add builder service for this runtime
                        const builderServiceName = `${runtime}-builder`;
                        // Ensure dockerfile path is valid and exists
                        let dockerfilePath = dockerfile;
                        const fullDockerfilePath = path.join(process.cwd(), dockerfilePath);
                        if (!fs.existsSync(fullDockerfilePath)) {
                            throw (`[Server_Docker] Dockerfile not found at ${fullDockerfilePath}`);
                        }
                        services[builderServiceName] = {
                            build: {
                                context: process.cwd(),
                                dockerfile: dockerfilePath,
                            },
                            container_name: builderServiceName,
                            environment: {},
                            working_dir: "/workspace",
                            volumes: [
                                `${process.cwd()}/src:/workspace/src`,
                                `${process.cwd()}/example:/workspace/example`,
                                `${process.cwd()}/dist:/workspace/dist`,
                                `${process.cwd()}/testeranto:/workspace/testeranto`,
                            ],
                            command: buildCommand,
                            networks: ["allTests_network"],
                        };
                        for (const tName of testsObj) {
                            // Clean the test name for use in container names
                            // Handle numeric test names (like '0') by converting to string
                            // const testNameStr = String(testName);
                            const cleanTestName = tName.toLowerCase()
                                .replaceAll("/", "_")
                                .replaceAll(".", "-")
                                .replace(/[^a-z0-9_-]/g, '');
                            // Generate UID using the runtimeTestsName (e.g., 'nodeTests') and clean test name
                            const uid = `${runtimeTestsName.toLowerCase()}-${cleanTestName}`;
                            // Add BDD service for this test
                            const bddCommandFunc = runTimeToCompose[runtime][2];
                            // TODO find filepath
                            // const filePath = "testeranto/bundles/allTests/ruby/example/Calculator.test.rb"
                            const filePath = `testeranto/bundles/allTests/${runtime}/${tName}`;
                            const bddCommand = bddCommandFunc(filePath, this.configs.runtimes[runtimeTestsName].buildOptions);
                            console.log(`[Server_Docker] [generateServices] ${runtimeTestsName} BDD command: "${bddCommand}"`);
                            services[`${uid}-bdd`] = this.bddTestDockerComposeFile(runtime, `${uid}-bdd`, bddCommand);
                            services[`${uid}-aider`] = this.aiderDockerComposeFile(`${uid}-aider`);
                        }
                    }
                    else {
                        throw `unknown runtime ${runtime}`;
                    }
                }
            }
        }
        // Ensure all services use the same network configuration
        for (const serviceName in services) {
            if (!services[serviceName].networks) {
                services[serviceName].networks = ["allTests_network"];
            }
        }
        return services;
    }
    autogenerateStamp(x) {
        return `# This file is autogenerated. Do not edit it directly
${x}
    `;
    }
    getUpCommand() {
        return `docker compose up -d`;
    }
    getDownCommand() {
        return `docker compose down -v --remove-orphans`;
    }
    getPsCommand() {
        return `docker compose ps`;
    }
    getLogsCommand(serviceName, tail = 100) {
        const base = `docker compose logs --no-color --tail=${tail}`;
        return serviceName ? `${base} ${serviceName}` : base;
    }
    getConfigServicesCommand() {
        return `docker compose config --services`;
    }
    getBuildCommand() {
        return `docker compose build`;
    }
    getStartCommand() {
        return `docker compose start`;
    }
    // private async waitForContainerExists(serviceName: string, maxAttempts: number = 30, delayMs: number = 1000): Promise<boolean> {
    //   for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    //     try {
    //       const cmd = `docker compose -f "testeranto/docker-compose.yml" ps -q ${serviceName}`;
    //       const { execSync } = require('child_process');
    //       const containerId = execSync(cmd, {
    //         // cwd:this.dockerManager.cwd
    //       }).toString().trim();
    //       if (containerId && containerId.length > 0) {
    //         console.log(`[Server_Docker] Container for ${serviceName} exists with ID: ${containerId.substring(0, 12)}`);
    //         return true;
    //       }
    //     } catch (error) {
    //       // Container doesn't exist yet or command failed
    //     }
    //     if (attempt < maxAttempts) {
    //       await new Promise(resolve => setTimeout(resolve, delayMs));
    //     }
    //   }
    //   console.warn(`[Server_Docker] Container for ${serviceName} did not appear after ${maxAttempts} attempts`);
    //   return false;
    // }
    async startServiceLogging(serviceName, runtime) {
        var _a, _b;
        // Create report directory
        const reportDir = path.join(process.cwd(), "testeranto", "reports", "allTests", "example", runtime);
        try {
            fs.mkdirSync(reportDir, { recursive: true });
        }
        catch (error) {
            console.error(`[Server_Docker] Failed to create report directory ${reportDir}: ${error.message}`);
            return;
        }
        const logFilePath = path.join(reportDir, `${serviceName}.log`);
        const exitCodeFilePath = path.join(reportDir, `${serviceName}.exitcode`);
        // Start a process to capture logs - use a more robust approach
        // We'll use a shell script that handles waiting for the container
        const logScript = `
      # Wait for container to exist
      for i in {1..30}; do
        if docker compose -f "testeranto/docker-compose.yml" ps -q ${serviceName} > /dev/null 2>&1; then
          break
        fi
        sleep 1
      done
      # Capture logs from the beginning
      docker compose -f "testeranto/docker-compose.yml" logs --no-color -f ${serviceName}
    `;
        console.log(`[Server_Docker] Starting log capture for ${serviceName} to ${logFilePath}`);
        const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
        const timestamp = new Date().toISOString();
        logStream.write(`=== Log started at ${timestamp} for service ${serviceName} ===\n\n`);
        const child = spawn('bash', ['-c', logScript], {
            stdio: ['ignore', 'pipe', 'pipe'],
            // cwd: this.dockerManager.cwd
        });
        // Get container ID for tracking
        let containerId = null;
        try {
            // Try to get container ID, but don't fail if we can't
            const containerIdCmd = `docker compose -f "testeranto/docker-compose.yml" ps -q ${serviceName}`;
            containerId = execSync(containerIdCmd, {
            // cwd: this.dockerManager.cwd
            }).toString().trim();
        }
        catch (error) {
            console.warn(`[Server_Docker] Could not get container ID for ${serviceName}, will track by service name`);
        }
        (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (data) => {
            logStream.write(data);
        });
        (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.on('data', (data) => {
            logStream.write(data);
        });
        child.on('error', (error) => {
            console.error(`[Server_Docker] Log process error for ${serviceName}:`, error);
            logStream.write(`\n=== Log process error: ${error.message} ===\n`);
            logStream.end();
            // Write error exit code
            fs.writeFileSync(exitCodeFilePath, '-1');
        });
        child.on('close', (code) => {
            const endTimestamp = new Date().toISOString();
            logStream.write(`\n=== Log ended at ${endTimestamp}, process exited with code ${code} ===\n`);
            logStream.end();
            console.log(`[Server_Docker] Log process for ${serviceName} exited with code ${code}`);
            // Write exit code to file
            fs.writeFileSync(exitCodeFilePath, (code === null || code === void 0 ? void 0 : code.toString()) || '0');
            // Also capture the actual container exit code
            this.captureContainerExitCode(serviceName, reportDir);
            if (containerId) {
                this.logProcesses.delete(containerId);
            }
            else {
                // Remove by service name if we couldn't get container ID
                for (const [id, proc] of this.logProcesses.entries()) {
                    if (proc.serviceName === serviceName) {
                        this.logProcesses.delete(id);
                        break;
                    }
                }
            }
        });
        // Track the process
        const trackingKey = containerId || serviceName;
        this.logProcesses.set(trackingKey, { process: child, serviceName });
    }
    async captureContainerExitCode(serviceName, reportDir) {
        try {
            // Get container ID including stopped containers
            const containerIdCmd = `docker compose -f "testeranto/docker-compose.yml" ps -a -q ${serviceName}`;
            const containerId = execSync(containerIdCmd, {
            // cwd: this.dockerManager.cwd
            }).toString().trim();
            if (containerId) {
                // Check if container exists and get its exit code
                const inspectCmd = `docker inspect --format='{{.State.ExitCode}}' ${containerId}`;
                const exitCode = execSync(inspectCmd, {
                // cwd: this.dockerManager.cwd
                }).toString().trim();
                // Write container exit code to a separate file
                const containerExitCodeFilePath = path.join(reportDir, `${serviceName}.container.exitcode`);
                fs.writeFileSync(containerExitCodeFilePath, exitCode);
                console.log(`[Server_Docker] Container ${serviceName} (${containerId.substring(0, 12)}) exited with code ${exitCode}`);
                // Also capture the container's status
                const statusCmd = `docker inspect --format='{{.State.Status}}' ${containerId}`;
                const status = execSync(statusCmd, {
                // cwd: this.dockerManager.cwd
                }).toString().trim();
                const statusFilePath = path.join(reportDir, `${serviceName}.container.status`);
                fs.writeFileSync(statusFilePath, status);
            }
            else {
                console.debug(`[Server_Docker] No container found for service ${serviceName}`);
            }
        }
        catch (error) {
            // Container might not exist anymore, which is fine
            console.debug(`[Server_Docker] Could not capture container exit code for ${serviceName}: ${error.message}`);
        }
    }
    async start() {
        console.log(`[Server_Docker] start()`);
        super.start();
        await this.setupDockerCompose();
        // Ensure base reports directory exists
        const baseReportsDir = path.join(process.cwd(), "testeranto", "reports");
        try {
            fs.mkdirSync(baseReportsDir, { recursive: true });
            console.log(`[Server_Docker] Created base reports directory: ${baseReportsDir}`);
        }
        catch (error) {
            console.error(`[Server_Docker] Failed to create base reports directory ${baseReportsDir}: ${error.message}`);
        }
        console.log(`[Server_Docker] Dropping everything...`);
        try {
            const downCmd = `docker compose -f "testeranto/docker-compose.yml" down -v --remove-orphans`;
            console.log(`[Server_Docker] Running: ${downCmd}`);
            await this.spawnPromise(downCmd);
            console.log(`[Server_Docker] Docker compose down completed`);
        }
        catch (error) {
            console.log(`[Server_Docker] Docker compose down noted: ${error.message}`);
        }
        // Start builder services
        for (const runtime of RUN_TIMES) {
            const serviceName = `${runtime}-builder`;
            console.log(`[Server_Docker] Starting builder service: ${serviceName}`);
            try {
                await this.spawnPromise(`docker compose -f "testeranto/docker-compose.yml" up -d ${serviceName}`);
                this.startServiceLogging(serviceName, runtime)
                    .catch(error => console.error(`[Server_Docker] Failed to start logging for ${serviceName}:`, error));
                this.captureExistingLogs(serviceName, runtime);
            }
            catch (error) {
                console.error(`[Server_Docker] Failed to start ${serviceName}: ${error.message}`);
            }
        }
        // Start browser service
        console.log(`[Server_Docker] Starting browser service...`);
        try {
            await this.spawnPromise(`docker compose -f "testeranto/docker-compose.yml" up -d browser`);
        }
        catch (error) {
            console.error(`[Server_Docker] Failed to start browser service: ${error.message}`);
        }
        // Wait for browser service to be healthy before starting web BDD services
        console.log(`[Server_Docker] Waiting for browser container to be healthy...`);
        await this.waitForContainerHealthy('browser-allTests', 60000); // 60 seconds max
        // Start aider services
        for (const [configKey, configValue] of Object.entries(this.configs.runtimes)) {
            const runtime = configValue.runtime;
            // const testsObj = configValue[3];
            const tests = configValue.tests;
            console.log(`[Server_Docker] Found tests for ${runtime}:`, (JSON.stringify(tests)));
            for (const testName of tests) {
                // Generate the UID exactly as DockerManager does
                const uid = `${configKey}-${testName.toLowerCase().replaceAll("/", "_").replaceAll(".", "-")}`;
                const aiderServiceName = `${uid}-aider`;
                console.log(`[Server_Docker] Starting aider service: ${aiderServiceName} for test ${testName}`);
                try {
                    await this.spawnPromise(`docker compose -f "testeranto/docker-compose.yml" up -d ${aiderServiceName}`);
                    // Start logging for aider services
                    this.startServiceLogging(aiderServiceName, runtime)
                        .catch(error => console.error(`[Server_Docker] Failed to start logging for ${aiderServiceName}:`, error));
                    this.captureExistingLogs(aiderServiceName, runtime)
                        .catch(error => console.error(`[Server_Docker] Failed to capture existing logs for ${aiderServiceName}:`, error));
                }
                catch (error) {
                    console.error(`[Server_Docker] Failed to start ${aiderServiceName}: ${error.message}`);
                }
            }
        }
        // Start BDD test services
        // TODO these logs  from these services should be saved into reports
        for (const [configKey, configValue] of Object.entries(this.configs.runtimes)) {
            const runtime = configValue.runtime;
            // const testsObj = configValue[3];
            const tests = configValue.tests;
            console.log(`[Server_Docker] Found tests for ${runtime}:`, (JSON.stringify(tests)));
            // const runtime = configValue[0];
            // const testsObj = configValue[3];
            // const tests = testsObj?.tests || {};
            for (const testName of tests) {
                const uid = `${configKey}-${testName.toLowerCase().replaceAll("/", "_").replaceAll(".", "-")}`;
                const bddServiceName = `${uid}-bdd`;
                console.log(`[Server_Docker] Starting BDD service: ${bddServiceName}, ${configKey}, ${configValue}`);
                try {
                    // Start the service
                    await this.spawnPromise(`docker compose -f "testeranto/docker-compose.yml" up -d ${bddServiceName}`);
                    // Immediately start logging in the background
                    // Don't wait for it to complete
                    this.startServiceLogging(bddServiceName, runtime)
                        .catch(error => console.error(`[Server_Docker] Failed to start logging for ${bddServiceName}:`, error));
                    // Also capture any existing logs from the container (in case it already produced output)
                    this.captureExistingLogs(bddServiceName, runtime)
                        .catch(error => console.error(`[Server_Docker] Failed to capture existing logs for ${bddServiceName}:`, error));
                }
                catch (error) {
                    console.error(`[Server_Docker] Failed to start ${bddServiceName}: ${error.message}`);
                    // Even if starting failed, try to capture any logs that might exist
                    this.captureExistingLogs(bddServiceName, runtime)
                        .catch(err => console.error(`[Server_Docker] Also failed to capture logs:`, err));
                }
            }
        }
        // Start static test services
        // TODO these logs  from these services should be saved into reports
        for (const [configKey, configValue] of Object.entries(this.configs)) {
            const runtime = configValue[0];
            const testsObj = configValue[3];
            const tests = (testsObj === null || testsObj === void 0 ? void 0 : testsObj.tests) || {};
            for (const testName in tests) {
                const uid = `${configKey}-${testName.toLowerCase().replaceAll("/", "_").replaceAll(".", "-")}`;
                const checks = (testsObj === null || testsObj === void 0 ? void 0 : testsObj.checks) || [];
                for (let i = 0; i < checks.length; i++) {
                    const staticServiceName = `${uid}-static-${i}`;
                    console.log(`[Server_Docker] Starting static test service: ${staticServiceName}`);
                    try {
                        await this.spawnPromise(`docker compose -f "testeranto/docker-compose.yml" up -d ${staticServiceName}`);
                        // Start logging for this service
                        this.startServiceLogging(staticServiceName, runtime)
                            .catch(error => console.error(`[Server_Docker] Failed to start logging for ${staticServiceName}:`, error));
                        // Also capture any existing logs
                        this.captureExistingLogs(staticServiceName, runtime)
                            .catch(error => console.error(`[Server_Docker] Failed to capture existing logs for ${staticServiceName}:`, error));
                    }
                    catch (error) {
                        console.error(`[Server_Docker] Failed to start ${staticServiceName}: ${error.message}`);
                        // Try to capture logs even if starting failed
                        this.captureExistingLogs(staticServiceName, runtime)
                            .catch(err => console.error(`[Server_Docker] Also failed to capture logs:`, err));
                    }
                }
            }
        }
    }
    async captureExistingLogs(serviceName, runtime) {
        // Create report directory
        const reportDir = path.join(process.cwd(), "testeranto", "reports", "allTests", "example", runtime);
        try {
            fs.mkdirSync(reportDir, { recursive: true });
        }
        catch (error) {
            console.error(`[Server_Docker] Failed to create report directory ${reportDir}: ${error.message}`);
            return;
        }
        const logFilePath = path.join(reportDir, `${serviceName}.log`);
        try {
            // First, check if the container exists (including stopped ones)
            const checkCmd = `docker compose -f "testeranto/docker-compose.yml" ps -a -q ${serviceName}`;
            const containerId = execSync(checkCmd, {
                // cwd: this.dockerManager.cwd,
                encoding: 'utf-8'
            }).toString().trim();
            if (!containerId) {
                console.debug(`[Server_Docker] No container found for service ${serviceName}`);
                return;
            }
            // Get existing logs from the container
            const cmd = `docker compose -f "testeranto/docker-compose.yml" logs --no-color ${serviceName} 2>/dev/null || true`;
            const existingLogs = execSync(cmd, {
                // cwd: this.dockerManager.cwd,
                encoding: 'utf-8',
                maxBuffer: 10 * 1024 * 1024 // 10MB
            });
            if (existingLogs && existingLogs.trim().length > 0) {
                // Append to the log file
                fs.appendFileSync(logFilePath, existingLogs);
                console.log(`[Server_Docker] Captured ${existingLogs.length} bytes of existing logs for ${serviceName}`);
            }
            // Also try to capture the container exit code if it has exited
            this.captureContainerExitCode(serviceName, reportDir);
        }
        catch (error) {
            // It's okay if this fails - the container might not exist yet
            console.debug(`[Server_Docker] No existing logs for ${serviceName}: ${error.message}`);
        }
    }
    async waitForContainerHealthy(containerName, timeoutMs) {
        const startTime = Date.now();
        const checkInterval = 2000; // Check every 2 seconds
        // while (Date.now() - startTime < timeoutMs) {
        //   try {
        //     // Use docker inspect to check container health status
        //     const cmd = `docker inspect --format="{{.State.Health.Status}}" ${containerName}`;
        //     const { exec } = require('child_process');
        //     const { promisify } = require('util');
        //     const execAsync = promisify(exec);
        //     const { stdout, stderr } = await execAsync(cmd);
        //     const healthStatus = stdout.trim();
        //     if (healthStatus === 'healthy') {
        //       console.log(`[Server_Docker] Container ${containerName} is healthy`);
        //       return;
        //     } else if (healthStatus === 'unhealthy') {
        //       throw new Error(`Container ${containerName} is unhealthy`);
        //     } else {
        //       console.log(`[Server_Docker] Container ${containerName} health status: ${healthStatus}`);
        //     }
        //   } catch (error: any) {
        //     // Container might not exist yet or command failed
        //     console.log(`[Server_Docker] Waiting for container ${containerName} to be healthy...`);
        //   }
        //   // Wait before checking again
        //   await new Promise(resolve => setTimeout(resolve, checkInterval));
        // }
        // throw new Error(`Timeout waiting for container ${containerName} to become healthy`);
    }
    async stop() {
        console.log(`[Server_Docker] stop()`);
        // Stop all log processes first
        for (const [containerId, logProcess] of this.logProcesses.entries()) {
            try {
                logProcess.process.kill('SIGTERM');
                console.log(`[Server_Docker] Stopped log process for container ${containerId} (${logProcess.serviceName})`);
            }
            catch (error) {
                console.error(`[Server_Docker] Error stopping log process for ${containerId}:`, error);
            }
        }
        this.logProcesses.clear();
        const result = await this.DC_down();
        if (result.exitCode !== 0) {
            console.error(`Docker Compose down failed: ${result.err}`);
        }
        super.stop();
    }
    async setupDockerCompose() {
        // First, ensure all necessary directories exist
        const composeDir = path.join(process.cwd(), "testeranto", "bundles");
        try {
            // Setup directories
            fs.mkdirSync(composeDir, { recursive: true });
            // Generate Dockerfiles for each runtime
            // Note: runtimes needs to be defined - we'll get it from config
            // const runtimes: IRunTime[] = ["node", "web", "golang", "python", "ruby"];
            // deprecated 
            // this.generateRuntimeDockerfiles(config, runtimes, composeDir, log, error);
            const services = this.generateServices(
            // config,
            );
            this.writeComposeFile(services);
        }
        catch (err) {
            console.error(`Error in setupDockerCompose:`, err);
            throw err;
        }
    }
    writeComposeFile(services) {
        const dockerComposeFileContents = this.BaseCompose(services);
        fs.writeFileSync('testeranto/docker-compose.yml', yaml.dump(dockerComposeFileContents, {
            lineWidth: -1,
            noRefs: true,
        }));
    }
    async exec(cmd, options) {
        const execAsync = promisify(exec);
        return execAsync(cmd, { cwd: options.cwd });
    }
    spawnPromise(command) {
        return new Promise((resolve, reject) => {
            console.log(`[spawnPromise] Executing: ${command}`);
            // Use shell: true to let the shell handle command parsing (including quotes)
            const child = spawn(command, {
                stdio: 'inherit',
                shell: true,
                // cwd: this.dockerManager.cwd
            });
            child.on('error', (error) => {
                console.error(`[spawnPromise] Failed to start process: ${error.message}`);
                reject(error);
            });
            child.on('close', (code) => {
                if (code === 0) {
                    console.log(`[spawnPromise] Process completed successfully`);
                    resolve(code);
                }
                else {
                    console.error(`[spawnPromise] Process exited with code ${code}`);
                    reject(new Error(`Process exited with code ${code}`));
                }
            });
        });
    }
    async DC_upAll() {
        try {
            const cmd = this.getUpCommand();
            await this.spawnPromise(cmd);
            return {
                exitCode: 0,
                out: '',
                err: '',
                data: null,
            };
        }
        catch (error) {
            console.error(`[Docker] docker compose up ❌ ${ansiColors.bgBlue(error.message.replaceAll('\\n', '\n'))}`);
            return {
                exitCode: 1,
                out: '',
                err: `Error starting services: ${error.message}`,
                data: null,
            };
        }
    }
    async DC_down() {
        try {
            const cmd = this.getDownCommand();
            await this.spawnPromise(cmd);
            return {
                exitCode: 0,
                out: "",
                err: "",
                data: null,
            };
        }
        catch (error) {
            console.log(`[DC_down] Error during down: ${error.message}`);
            return {
                exitCode: 1,
                out: "",
                err: `Error stopping services: ${error.message}`,
                data: null,
            };
        }
    }
    async DC_ps() {
        try {
            const cmd = this.getPsCommand();
            const { stdout, stderr } = await this.exec(cmd, {
            // cwd: this.dockerManager.cwd
            });
            return {
                exitCode: 0,
                out: stdout,
                err: stderr,
                data: null,
            };
        }
        catch (error) {
            return {
                exitCode: 1,
                out: "",
                err: `Error getting service status: ${error.message}`,
                data: null,
            };
        }
    }
    async DC_logs(serviceName, options) {
        var _a;
        const tail = (_a = options === null || options === void 0 ? void 0 : options.tail) !== null && _a !== void 0 ? _a : 100;
        try {
            const cmd = this.getLogsCommand(serviceName, tail);
            const { stdout, stderr } = await this.exec(cmd, {
            // cwd: this.dockerManager.cwd
            });
            return {
                exitCode: 0,
                out: stdout,
                err: stderr,
                data: null,
            };
        }
        catch (error) {
            return {
                exitCode: 1,
                out: "",
                err: `Error getting logs for ${serviceName}: ${error.message}`,
                data: null,
            };
        }
    }
    async DC_configServices() {
        try {
            const cmd = this.getConfigServicesCommand();
            const { stdout, stderr } = await this.exec(cmd, {
            // cwd: this.dockerManager.cwd
            });
            return {
                exitCode: 0,
                out: stdout,
                err: stderr,
                data: null,
            };
        }
        catch (error) {
            return {
                exitCode: 1,
                out: "",
                err: `Error getting services from config: ${error.message}`,
                data: null,
            };
        }
    }
    async DC_start() {
        try {
            const startCommand = this.getStartCommand();
            await this.spawnPromise(startCommand);
            return {
                exitCode: 0,
                data: null,
            };
        }
        catch (error) {
            console.error(`[Docker] docker compose start ❌ ${ansiColors.bgBlue(error.message.replaceAll('\\n', '\n'))}`);
            return {
                exitCode: 1,
                data: null,
            };
        }
    }
    async DC_build() {
        try {
            const buildCommand = this.getBuildCommand();
            await this.spawnPromise(buildCommand);
            console.log(`[DC_build] Build completed successfully`);
            return {
                exitCode: 0,
                out: '',
                err: '',
                data: null,
            };
        }
        catch (error) {
            console.error(`[Docker] docker-compose build ❌ ${ansiColors.bgBlue(error.message.replaceAll('\\n', '\n'))}`);
            return {
                exitCode: 1,
                out: '',
                err: `Error building services: ${error.message}`,
                data: null,
            };
        }
    }
    getProcessSummary() {
        console.log(`[Server_Docker] getProcessSummary called`);
        try {
            // Get running containers
            const output = execSync('docker ps --format "{{.Names}}|{{.Image}}|{{.Status}}|{{.Ports}}|{{.State}}|{{.Command}}"').toString();
            const processes = output.trim().split('\n').filter(line => line.trim()).map(line => {
                const parts = line.split('|');
                const [name, image, status, ports, state, command] = parts;
                // Try to get exit code for stopped containers
                let exitCode = null;
                try {
                    // Check if container exists (including stopped ones)
                    const inspectCmd = `docker inspect --format='{{.State.ExitCode}}' ${name} 2>/dev/null || echo ""`;
                    const exitCodeStr = execSync(inspectCmd).toString().trim();
                    if (exitCodeStr !== '') {
                        exitCode = parseInt(exitCodeStr, 10);
                        // Only include exit code if container is not running
                        if (state === 'running') {
                            exitCode = null;
                        }
                    }
                }
                catch (error) {
                    // Container might not exist, which is fine
                }
                return {
                    processId: name,
                    command: command || image,
                    image: image,
                    timestamp: new Date().toISOString(),
                    status: status,
                    state: state,
                    ports: ports,
                    exitCode: exitCode,
                    // Add additional fields that might be useful for the frontend
                    runtime: this.getRuntimeFromName(name),
                    health: 'unknown' // We could add health check status here
                };
            });
            return {
                processes: processes,
                total: processes.length,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            console.error(`[Server_Docker] Error getting docker processes: ${error.message}`);
            return {
                processes: [],
                total: 0,
                timestamp: new Date().toISOString(),
                error: error.message
            };
        }
    }
    getRuntimeFromName(name) {
        if (name.includes('node'))
            return 'node';
        if (name.includes('web'))
            return 'web';
        if (name.includes('golang'))
            return 'golang';
        if (name.includes('python'))
            return 'python';
        if (name.includes('ruby'))
            return 'ruby';
        if (name.includes('browser'))
            return 'browser';
        return 'unknown';
    }
}
