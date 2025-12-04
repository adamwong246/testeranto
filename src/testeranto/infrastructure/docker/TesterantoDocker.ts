import { EventEmitter } from "events";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { IRunTime } from "../../../Types";
import { BrowserManager } from "./BrowserManager";
import { BuildServiceMonitor } from "./BuildServiceMonitor";
import { DockerCompose } from "./DockerCompose";
import { FileSystem } from "./FileSystem";
import { TcpServer } from "./TcpServer";
import { TestServiceManager } from "./TestServiceManager";
import { TestResource, TestServiceConfig, TestServiceInfo } from "./types";
import { Page } from "puppeteer-core/lib/esm/puppeteer";

export default class TesterantoDocker extends EventEmitter {
  testName: string;
  private composeDir: string;
  private composeFile: string;

  private tcpServer: TcpServer;
  private fileSystem: FileSystem;
  private dockerCompose: DockerCompose;
  private browserManager: BrowserManager;
  private testServiceManager: TestServiceManager;
  private buildServiceMonitor: BuildServiceMonitor;
  private tcpPort: number = 0;

  constructor(testName: string) {
    super();
    console.log("TesterantoDocker initialized.");
    this.testName = testName;
    this.composeDir = process.cwd();
    this.composeFile = path.join(
      this.composeDir,
      "testeranto",
      "bundles",
      `${this.testName}-docker-compose.yml`
    );

    // Initialize components
    this.tcpServer = new TcpServer();
    this.fileSystem = new FileSystem();
    this.dockerCompose = new DockerCompose(this.composeDir, this.composeFile);
    this.browserManager = new BrowserManager();
    this.testServiceManager = new TestServiceManager(
      this.testName,
      this.dockerCompose
    );
    this.buildServiceMonitor = new BuildServiceMonitor(this.dockerCompose);

    // Set up event forwarding
    this.setupEventForwarding();
  }

  public async initialize(): Promise<void> {
    // Initialize services
    await this.initializeServices();
  }

  private setupEventForwarding(): void {
    // Forward events from components using a helper function
    const forwardEvents = (component: any, eventNames: string[]) => {
      eventNames.forEach(eventName => {
        component.on(eventName, (data: any) => this.emit(eventName, data));
      });
    };

    // Forward events from testServiceManager
    forwardEvents(this.testServiceManager, [
      "testServiceStarting",
      "testStarted", 
      "testServiceError",
      "testStopped"
    ]);

    // Forward events from buildServiceMonitor
    forwardEvents(this.buildServiceMonitor, [
      "buildServiceWaiting",
      "buildServiceHealthy",
      "buildServiceError",
      "buildServiceTimeout",
      "buildServiceStatus",
      "monitoringStarted",
      "monitoringError"
    ]);

    // Forward events from tcpServer
    forwardEvents(this.tcpServer, [
      "serviceRegistered",
      "commandReceived"
    ]);
  }

  private async initializeServices(): Promise<void> {
    try {
      const port = await this.tcpServer.start();
      console.log(`🔌 TCP server started on port ${port}`);
      this.tcpPort = port;
    } catch (error) {
      console.error(`❌ Failed to start TCP server:`, error);
      throw error;
    }
    await this.browserManager.initialize();
  }

  // Public methods that delegate to components
  public getTcpPort(): number {
    const port = this.tcpServer.getPort();
    if (port === 0) {
      console.warn(`⚠️ TCP port is 0, server may not be ready`);
    }
    return port;
  }

  public async createWebPage(testId: string): Promise<Page> {
    return this.browserManager.createPage(testId);
  }

  public async closeWebPage(testId: string): Promise<void> {
    return this.browserManager.closePage(testId);
  }

  async stop() {
    console.log("🛑 DockerMan stopping...");

    this.tcpServer.close();
    this.buildServiceMonitor.stopMonitoring();
    await this.browserManager.closeAll();

    try {
      await this.dockerCompose.down({
        log: true,
        commandOptions: ["-v", "--remove-orphans"],
      });
      console.log("✅ Docker Compose stopped successfully.");
      this.emit("stopped", {});
    } catch (err) {
      // It's okay if down fails (e.g., no services are running)
      console.log("ℹ️ Docker Compose down may have failed (possibly no running services):", (err as Error).message);
      this.emit("stopError", { error: (err as Error).message });
    }
  }

  onBundleChange(entryPoint: string, lang: IRunTime) {
    console.log(`Bundle changed for ${lang}: ${entryPoint}`);
    this.emit("bundleChange", { entryPoint, lang });
  }

  async start() {
    console.log("🔄 Attempting to stop any existing Docker Compose services...");
    try {
      await this.stop();
    } catch (err) {
      // It's okay if stop fails (e.g., no containers are running)
      console.log("ℹ️ Stop may have failed (possibly no running containers):", (err as Error).message);
    }

    console.log("🚀 Starting Docker Compose with fresh containers...");
    console.log(`📁 Docker Compose file: ${this.composeFile}`);
    console.log(`📁 Current directory: ${this.composeDir}`);
    
    // Check if docker-compose file exists
    if (!fs.existsSync(this.composeFile)) {
      console.error(`❌ Docker Compose file not found: ${this.composeFile}`);
      throw new Error(`Docker Compose file not found: ${this.composeFile}`);
    }
    
    // Check if Docker is running
    console.log("🔍 Checking if Docker daemon is running...");
    try {
      execSync('docker info', { stdio: 'pipe' });
      console.log("✅ Docker daemon is running");
    } catch (dockerErr) {
      console.error("❌ Docker daemon is not running or not accessible");
      console.error("Please start Docker Desktop or the Docker service");
      throw new Error("Docker daemon is not running");
    }
    
    // Check if docker-compose is available
    console.log("🔍 Checking if docker-compose is available...");
    let composeCommand = 'docker-compose';
    try {
      execSync('docker-compose --version', { stdio: 'pipe' });
      console.log("✅ docker-compose is available");
    } catch (composeErr) {
      console.log("⚠️ docker-compose command not found, trying docker compose...");
      try {
        execSync('docker compose version', { stdio: 'pipe' });
        composeCommand = 'docker compose';
        console.log("✅ docker compose (v2) is available");
      } catch (dockerComposeErr) {
        console.error("❌ Neither docker-compose nor docker compose are available");
        console.error("Please install docker-compose or Docker Compose v2");
        throw new Error("docker-compose not available");
      }
    }
    
    // Validate docker-compose file
    console.log("🔍 Validating docker-compose file...");
    try {
      execSync(`${composeCommand} -f "${this.composeFile}" config`, { 
        stdio: 'pipe',
        cwd: this.composeDir 
      });
      console.log("✅ Docker Compose file is valid");
    } catch (validateErr) {
      console.error("❌ Docker Compose file validation failed:", (validateErr as Error).message);
      console.error("Please check the docker-compose file for errors");
      throw new Error("Docker Compose file validation failed");
    }
    
    // List services in the compose file
    console.log("🔍 Listing services in docker-compose file...");
    try {
      const servicesOutput = execSync(`${composeCommand} -f "${this.composeFile}" config --services`, { 
        encoding: 'utf8',
        cwd: this.composeDir 
      });
      console.log("📋 Services to start:", servicesOutput.trim().split('\n').join(', '));
    } catch (listErr) {
      console.log("⚠️ Could not list services:", (listErr as Error).message);
    }
    
    try {
      console.log("🎬 Running docker-compose up...");
      const result = await this.dockerCompose.upAll({
        log: true,
        commandOptions: ["--build", "--force-recreate", "--remove-orphans", "-d"],
        detach: true,
      });
      console.log(
        "✅ Docker Compose started successfully with fresh containers"
      );

      // Check if containers are actually running
      console.log("🔍 Checking if containers are running...");
      await new Promise(resolve => setTimeout(resolve, 3000));
      try {
        const psOutput = execSync(`${composeCommand} -f "${this.composeFile}" ps --services --filter "status=running"`, {
          encoding: 'utf8',
          cwd: this.composeDir
        });
        const runningServices = psOutput.trim().split('\n').filter(s => s.trim());
        console.log(`📊 ${runningServices.length} services are running:`, runningServices.join(', '));
        if (runningServices.length === 0) {
          console.log("⚠️ No services are running. Checking for errors...");
          const allPsOutput = execSync(`${composeCommand} -f "${this.composeFile}" ps`, {
            encoding: 'utf8',
            cwd: this.composeDir
          });
          console.log("📋 All services status:\n", allPsOutput);
        }
      } catch (psErr) {
        console.log("⚠️ Could not check running services:", (psErr as Error).message);
      }

      // Wait a bit more for services to initialize
      console.log("⏳ Waiting for services to initialize...");
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      await this.buildServiceMonitor.identifyBuildServices();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.log("❌ Error starting Docker Compose:", error.message);
      console.log("Stack trace:", error.stack);
      // Try to get more details
      try {
        const errorOutput = execSync(`${composeCommand} -f "${this.composeFile}" up --build --force-recreate --remove-orphans -d 2>&1`, {
          encoding: 'utf8',
          cwd: this.composeDir
        });
        console.log("📋 Docker Compose output:", errorOutput);
      } catch (execErr) {
        const execError = execErr instanceof Error ? execErr : new Error(String(execErr));
        console.log("⚠️ Could not get detailed error output:", execError.message);
      }
      throw error; // Re-throw to let caller know
    }
  }

  async rebuild(noCache: boolean = false) {
    await this.stop();

    const commandOptions = ["--build", "--force-recreate", "--remove-orphans"];
    if (noCache) {
      commandOptions.push("--no-cache");
    }

    console.log(
      `Rebuilding Docker Compose ${noCache ? "without cache" : "with cache"}...`
    );
    try {
      const result = await this.dockerCompose.upAll({
        log: true,
        commandOptions: commandOptions,
      });
      console.log(
        `Docker Compose rebuilt successfully ${
          noCache ? "without cache" : "with cache"
        }:`,
        result
      );

      await this.buildServiceMonitor.identifyBuildServices();
    } catch (err) {
      console.log("Something went wrong:", (err as Error).message);
      console.log(err);
    }
  }

  public async identifyBuildServices() {
    await this.buildServiceMonitor.identifyBuildServices();
  }

  async waitForBuildService(
    serviceName: string,
    timeoutMs: number = 10000
  ): Promise<boolean> {
    return this.buildServiceMonitor.waitForBuildService(serviceName, timeoutMs);
  }

  async startTestService(config: TestServiceConfig): Promise<boolean> {
    return this.testServiceManager.startTestService(config);
  }

  async stopTestService(serviceName: string): Promise<boolean> {
    return this.testServiceManager.stopTestService(serviceName);
  }

  async getTestLogs(serviceName: string, tail: number = 100): Promise<string> {
    return this.testServiceManager.getTestLogs(serviceName, tail);
  }

  async getBuildServiceLogs(serviceName: string, tail: number = 100): Promise<string> {
    try {
      const result = await this.dockerCompose.logs(serviceName, {
        log: false,
        follow: false,
        tail: tail,
      });
      return result.out || result.err || '';
    } catch (err) {
      console.log(`Error getting build service logs for ${serviceName}:`, (err as Error).message);
      return '';
    }
  }

  getRunningTests(): Map<string, TestServiceInfo> {
    return this.testServiceManager.getRunningTests();
  }

  getBuildServices(): string[] {
    return this.buildServiceMonitor.getBuildServices();
  }

  async getBuildServiceStatuses(): Promise<
    Array<{ name: string; status: string }>
  > {
    return this.buildServiceMonitor.getBuildServiceStatuses();
  }

  async monitorBuildServices(
    callback: (serviceName: string, status: string) => void
  ) {
    this.buildServiceMonitor.startMonitoring(callback);
  }

  static generateTestServiceName(
    entryPoint: string,
    runtime: IRunTime
  ): string {
    return TestServiceManager.generateTestServiceName(entryPoint, runtime);
  }

  static parseTestServiceName(serviceName: string): {
    runtime: IRunTime | null;
    entryPoint: string | null;
  } {
    return TestServiceManager.parseTestServiceName(serviceName);
  }

  async startTestByEntryPoint(
    entryPoint: string,
    runtime: IRunTime,
    testResource?: TestResource,
    additionalEnv?: Record<string, string>
  ): Promise<boolean> {
    const serviceName = TesterantoDocker.generateTestServiceName(entryPoint, runtime);

    const env = {
      ...additionalEnv,
      TESTERANTO_RUNTIME: runtime,
    };

    const config: TestServiceConfig = {
      serviceName,
      runtime,
      entryPoint,
      testResource,
      env,
    };

    return this.startTestService(config);
  }

  public async startTestServicesForBuildService(buildServiceName: string) {
    console.log(
      `🚀 Looking for test services for build service: ${buildServiceName}`
    );

    // Extract runtime from build service name using a helper
    const runtime = this.extractRuntimeFromBuildService(buildServiceName);
    if (!runtime) {
      console.log(
        `⚠️ Could not determine runtime for build service: ${buildServiceName}`
      );
      return;
    }

    console.log(`🔍 Starting test services for runtime: ${runtime}`);

    try {
      const result = await this.dockerCompose.ps({
        log: false,
      });

      if (result.data && result.data.services) {
        const testServices = result.data.services.filter(
          (s: { name: string }) =>
            s.name.includes(runtime!) &&
            !s.name.includes("build") &&
            s.name !== buildServiceName
        );

        console.log(
          `🔍 Found ${testServices.length} test services for ${runtime}`
        );

        for (const testService of testServices) {
          await this.startTestServiceFromServiceInfo(testService, runtime);
        }
      }
    } catch (err) {
      console.log(
        `❌ Error starting test services for ${buildServiceName}:`,
        (err as Error).message
      );
    }
  }

  private extractRuntimeFromBuildService(buildServiceName: string): IRunTime | null {
    if (buildServiceName.includes("node-build")) return "node";
    if (buildServiceName.includes("web-build")) return "web";
    if (buildServiceName.includes("python-build")) return "python";
    if (buildServiceName.includes("golang-build")) return "golang";
    return null;
  }

  private async startTestServiceFromServiceInfo(serviceInfo: any, runtime: IRunTime): Promise<void> {
    const fullServiceName = serviceInfo.name;
    const baseServiceName = this.normalizeServiceName(fullServiceName);

    if (this.testServiceManager.getRunningTests().has(baseServiceName)) {
      console.log(
        `⏭️ Test service ${baseServiceName} is already running, skipping`
      );
      return;
    }

    console.log(
      `🚀 Starting test service: ${baseServiceName} (from ${fullServiceName})`
    );

    const parsed = TestServiceManager.parseTestServiceName(fullServiceName);
    if (!parsed.runtime || !parsed.entryPoint) {
      console.log(
        `⚠️ Could not parse test service name: ${fullServiceName}`
      );
      return;
    }

    const testResource: TestResource = {
      name: parsed.entryPoint,
      ports: [],
      fs: `/testeranto/reports/${this.testName}/${parsed.entryPoint
        .split(".")
        .slice(0, -1)
        .join(".")}/${parsed.runtime}`,
    };

    const config: TestServiceConfig = {
      serviceName: baseServiceName,
      runtime: parsed.runtime,
      entryPoint: parsed.entryPoint,
      testResource,
      env: {
        BUNDLES_DIR: `/testeranto/bundles/${this.testName}/${parsed.runtime}`,
        METAFILES_DIR: `/testeranto/metafiles/${parsed.runtime}`,
        TESTERANTO_RUNTIME: parsed.runtime,
      },
    };

    await this.startTestService(config);
  }

  private normalizeServiceName(serviceName: string): string {
    let normalized = serviceName.replace(/-[0-9]+$/, "");
    if (normalized.startsWith('bundles-')) {
      normalized = normalized.substring('bundles-'.length);
    }
    // Ensure the normalized name is lowercase for consistency
    return normalized.toLowerCase();
  }

  getTestStatuses(): Array<{
    serviceName: string;
    config: TestServiceConfig;
    startTime: number;
    status: string;
  }> {
    return this.testServiceManager.getTestStatuses();
  }
}
