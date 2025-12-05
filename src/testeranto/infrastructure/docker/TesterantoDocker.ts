/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import { execSync } from "child_process";
import { EventEmitter } from "events";
import fs from "fs";
import path from "path";
import { Page } from "puppeteer-core/lib/esm/puppeteer";
import { IRunTime } from "../../../Types";
import { BrowserManager } from "./BrowserManager";
import { BuildServiceMonitor } from "./BuildServiceMonitor";
import { DockerCompose } from "./DockerCompose";
import { DockerValidator } from "./DockerValidator";
import { FileSystem } from "./FileSystem";
import { TcpServer } from "./TcpServer";
import { WebSocketServerManager } from "./WebSocketServer";
import { TestServiceManager } from "./TestServiceManager";
import { TestResource, TestServiceConfig, TestServiceInfo } from "./types";

export default class TesterantoDocker extends EventEmitter {
  testName: string;
  private composeDir: string;
  private composeFile: string;
  private logger: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    info: (...args: any[]) => void;
  };

  private tcpServer: TcpServer;
  private webSocketServer: WebSocketServerManager;
  private fileSystem: FileSystem;
  private dockerCompose: DockerCompose;
  private browserManager: BrowserManager;
  private testServiceManager: TestServiceManager;
  private buildServiceMonitor: BuildServiceMonitor;
  private tcpPort: number = 0;
  private webSocketPort: number = 0;

  constructor(
    testName: string,
    logger?: {
      log: (...args: any[]) => void;
      error: (...args: any[]) => void;
      warn?: (...args: any[]) => void;
      info?: (...args: any[]) => void;
    }
  ) {
    super();
    // Set up logger - use provided logger or default to console
    this.logger = {
      log: logger?.log || console.log,
      error: logger?.error || console.error,
      warn: logger?.warn || console.warn,
      info: logger?.info || console.info,
    };

    this.logger.log("TesterantoDocker initialized.");
    this.testName = testName;
    this.composeDir = process.cwd();
    this.composeFile = path.join(
      this.composeDir,
      "testeranto",
      "bundles",
      `${this.testName}-docker-compose.yml`
    );

    // Initialize components
    this.tcpServer = new TcpServer(this.logger);
    this.webSocketServer = new WebSocketServerManager(this.logger);
    this.fileSystem = new FileSystem();
    this.dockerCompose = new DockerCompose(this.composeDir, this.composeFile);
    this.browserManager = new BrowserManager(this.logger);
    this.testServiceManager = new TestServiceManager(
      this.testName,
      this.dockerCompose,
      this.logger
    );
    this.buildServiceMonitor = new BuildServiceMonitor(
      this.dockerCompose,
      this.logger
    );

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
      eventNames.forEach((eventName) => {
        component.on(eventName, (data: any) => this.emit(eventName, data));
      });
    };

    // Forward events from testServiceManager
    forwardEvents(this.testServiceManager, [
      "testServiceStarting",
      "testStarted",
      "testServiceError",
      "testStopped",
    ]);

    // Forward events from buildServiceMonitor
    forwardEvents(this.buildServiceMonitor, [
      "buildServiceWaiting",
      "buildServiceHealthy",
      "buildServiceError",
      "buildServiceTimeout",
      "buildServiceStatus",
      "monitoringStarted",
      "monitoringError",
    ]);

    // Forward events from tcpServer
    forwardEvents(this.tcpServer, ["serviceRegistered", "commandReceived"]);

    // Forward events from webSocketServer
    forwardEvents(this.webSocketServer, [
      "clientConnected",
      "clientDisconnected",
      "clientError",
      "message",
    ]);
  }

  private setupWebSocketHandling(): void {
    // Handle WebSocket messages by processing them like TCP commands
    this.webSocketServer.on('message', async ({ connectionId, message }) => {
      // The message format should be the same as TCP: ["command", ...args, callbackId]
      if (Array.isArray(message) && message.length > 0) {
        const callbackId = message[message.length - 1];
        const command = message[0];
        const args = message.slice(1, -1);
        
        this.logger.log(`📨 WebSocket command: ${command} from ${connectionId} (callbackId: ${callbackId})`);
        
        try {
          // Handle the command
          const result = await this.handleWebSocketCommand(command, args, connectionId);
          
          // Send success response
          this.webSocketServer.send(connectionId, {
            id: callbackId,
            result,
            error: null
          });
        } catch (error: any) {
          this.logger.error(`❌ Error handling command ${command}:`, error);
          
          // Send error response
          this.webSocketServer.send(connectionId, {
            id: callbackId,
            result: null,
            error: error.message || 'Unknown error'
          });
        }
      }
    });
  }
  
  private async handleWebSocketCommand(command: string, args: any[], connectionId: string): Promise<any> {
    // Get service name for context
    const serviceName = this.webSocketServer.getServiceName(connectionId) || 'unknown';
    
    // Handle different commands
    switch (command) {
      case 'register':
        // Already handled in WebSocketServer
        return { registered: true, serviceName };
      
      case 'page':
        // Return current page info
        // For now, return a placeholder
        return { pageId: 'default-page' };
      
      case 'newPage':
        // Create a new page in browser manager
        try {
          const testId = `web-test-${Date.now()}`;
          await this.browserManager.createPage(testId);
          return { pageId: testId };
        } catch (error) {
          this.logger.warn(`Browser not available for newPage, returning placeholder`);
          return { pageId: 'placeholder-page-id' };
        }
      
      case 'closePage':
        // Close a page
        if (args.length > 0) {
          try {
            await this.browserManager.closePage(args[0]);
            return { closed: true };
          } catch (error) {
            this.logger.warn(`Browser not available for closePage, returning success anyway`);
            return { closed: true };
          }
        } else {
          throw new Error('Missing page ID');
        }
      
      case 'screencast':
        // Start screencast - placeholder implementation
        this.logger.log(`Screencast command: ${JSON.stringify(args)}`);
        return { screencastId: `screencast-${Date.now()}` };
      
      case 'screencastStop':
        // Stop screencast
        return { stopped: true };
      
      // File system commands
      case 'existsSync':
        if (args.length > 0) {
          const path = args[0];
          // existsSync is synchronous
          const exists = this.fileSystem.existsSync(path);
          return exists;
        }
        throw new Error('Missing path for existsSync');
      
      case 'mkdirSync':
        if (args.length > 0) {
          const path = args[0];
          await this.fileSystem.mkdir(path, { recursive: true });
          return { created: true };
        }
        throw new Error('Missing path for mkdirSync');
      
      case 'writeFileSync':
        if (args.length >= 2) {
          const [filePath, content] = args;
          await this.fileSystem.writeFile(filePath, content);
          return { written: true };
        }
        throw new Error('Missing arguments for writeFileSync');
      
      // Browser interaction commands - placeholder implementations
      case 'click':
      case 'goto':
      case '$':
      case 'getAttribute':
      case 'getInnerHtml':
      case 'isDisabled':
      case 'waitForSelector':
      case 'focusOn':
      case 'typeInto':
      case 'getValue':
      case 'write':
      case 'createWriteStream':
      case 'end':
      case 'customclose':
      case 'customScreenShot':
      case 'pages':
        // For now, return a placeholder
        this.logger.log(`Command ${command} received with args: ${JSON.stringify(args)}`);
        return { 
          command, 
          status: 'handled', 
          note: 'This is a placeholder implementation. Actual functionality needs to be implemented.',
          args 
        };
      
      default:
        throw new Error(`Unknown command: ${command}`);
    }
  }

  private async initializeServices(): Promise<void> {
    try {
      // Start TCP server
      const tcpPort = await this.tcpServer.start();
      this.logger.log(`🔌 TCP server started on port ${tcpPort}`);
      this.tcpPort = tcpPort;
      
      // Start WebSocket server on a different port
      const wsPort = await this.webSocketServer.start(0);
      this.logger.log(`🔌 WebSocket server started on port ${wsPort}`);
      this.webSocketPort = wsPort;
      
      // Set up WebSocket message handling
      this.setupWebSocketHandling();
    } catch (error) {
      this.logger.error(`❌ Failed to start servers:`, error);
      throw error;
    }
    await this.browserManager.initialize();
  }

  // Public methods that delegate to components
  public getTcpPort(): number {
    const port = this.tcpServer.getPort();
    if (port === 0) {
      this.logger.warn(`⚠️ TCP port is 0, server may not be ready`);
    }
    return port;
  }

  public getWebSocketPort(): number {
    const port = this.webSocketServer.getPort();
    if (port === 0) {
      this.logger.warn(`⚠️ WebSocket port is 0, server may not be ready`);
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
    this.logger.log("🛑 DockerMan stopping...");

    this.tcpServer.close();
    this.webSocketServer.close();
    this.buildServiceMonitor.stopMonitoring();
    await this.browserManager.closeAll();

    try {
      await this.dockerCompose.DC_down({
        log: true,
        commandOptions: ["-v", "--remove-orphans"],
      });
      this.logger.log("✅ Docker Compose stopped successfully.");
      this.emit("stopped", {});
    } catch (err) {
      // It's okay if down fails (e.g., no services are running)
      this.logger.log(
        "ℹ️ Docker Compose down may have failed (possibly no running services):",
        (err as Error).message
      );
      this.emit("stopError", { error: (err as Error).message });
    }
  }

  onBundleChange(entryPoint: string, lang: IRunTime) {
    // console.log(`Bundle changed for ${lang}: ${entryPoint}`);
    this.emit("bundleChange", { entryPoint, lang });
  }

  async start() {
    this.logger.log(
      "🔄 Attempting to stop any existing Docker Compose services..."
    );
    try {
      await this.stop();
    } catch (err) {
      // It's okay if stop fails (e.g., no containers are running)
      this.logger.log(
        "ℹ️ Stop may have failed (possibly no running containers):",
        (err as Error).message
      );
    }

    // this.logger.log("🚀 Starting Docker Compose with fresh containers...");
    // this.logger.log(`📁 Docker Compose file: ${this.composeFile}`);
    // this.logger.log(`📁 Current directory: ${this.composeDir}`);

    // Check if docker-compose file exists
    if (!fs.existsSync(this.composeFile)) {
      this.logger.error(
        `❌ Docker Compose file not found: ${this.composeFile}`
      );
      throw new Error(`Docker Compose file not found: ${this.composeFile}`);
    }

    // Use shared validation utility
    const { composeCommand } = await DockerValidator.validateDockerEnvironment(
      this.logger
    );
    await DockerValidator.validateComposeFile(
      this.composeFile,
      this.composeDir,
      composeCommand,
      this.logger
    );

    try {
      this.logger.log("🎬 Running docker-compose up...");
      const result = await this.dockerCompose.DC_upAll({
        log: true,
        commandOptions: [
          "--build",
          "--force-recreate",
          "--remove-orphans",
          "-d",
        ],
        detach: true,
      });
      // this.logger.log(
      //   "✅ Docker Compose started successfully with fresh containers"
      // );

      // Check if containers are actually running
      this.logger.log("🔍 Checking if containers are running...");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      // Wait a bit more for services to initialize
      this.logger.log("⏳ Waiting for services to initialize...");
      await new Promise((resolve) => setTimeout(resolve, 5000));

      await this.buildServiceMonitor.identifyBuildServices();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.log("❌ Error starting Docker Compose:", error.message);
      this.logger.log("Stack trace:", error.stack);

      throw error; // Re-throw to let caller know
    }
  }

  async rebuild(noCache: boolean = false) {
    await this.stop();

    const commandOptions = ["--build", "--force-recreate", "--remove-orphans"];
    if (noCache) {
      commandOptions.push("--no-cache");
    }

    this.logger.log(
      `Rebuilding Docker Compose ${noCache ? "without cache" : "with cache"}...`
    );
    try {
      const result = await this.dockerCompose.DC_upAll({
        log: true,
        commandOptions: commandOptions,
      });
      this.logger.log(
        `Docker Compose rebuilt successfully ${
          noCache ? "without cache" : "with cache"
        }:`,
        result
      );

      await this.buildServiceMonitor.identifyBuildServices();
    } catch (err) {
      this.logger.log("Something went wrong:", (err as Error).message);
      this.logger.log(err);
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

  async getBuildServiceLogs(
    serviceName: string,
    tail: number = 100
  ): Promise<string> {
    try {
      const result = await this.dockerCompose.DC_logs(serviceName, {
        log: false,
        follow: false,
        tail: tail,
      });
      return result.out || result.err || "";
    } catch (err) {
      // this.logger.log(
      //   `Error getting build service logs for ${serviceName}:`,
      //   (err as Error).message
      // );
      return "";
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
    const serviceName = TesterantoDocker.generateTestServiceName(
      entryPoint,
      runtime
    );

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
    this.logger.log(
      `🚀 Looking for test services for build service: ${buildServiceName}`
    );

    // Extract runtime from build service name using a helper
    const runtime = this.extractRuntimeFromBuildService(buildServiceName);
    if (!runtime) {
      this.logger.log(
        `⚠️ Could not determine runtime for build service: ${buildServiceName}`
      );
      return;
    }

    this.logger.log(`🔍 Starting test services for runtime: ${runtime}`);

    try {
      const result = await this.dockerCompose.DC_ps({
        log: false,
      });

      if (result.data && result.data.services) {
        const testServices = result.data.services.filter(
          (s: { name: string }) =>
            s.name.includes(runtime!) &&
            !s.name.includes("build") &&
            s.name !== buildServiceName
        );

        this.logger.log(
          `🔍 Found ${testServices.length} test services for ${runtime}`
        );

        for (const testService of testServices) {
          await this.startTestServiceFromServiceInfo(testService, runtime);
        }
      }
    } catch (err) {
      this.logger.log(
        `❌ Error starting test services for ${buildServiceName}:`,
        (err as Error).message
      );
    }
  }

  private extractRuntimeFromBuildService(
    buildServiceName: string
  ): IRunTime | null {
    if (buildServiceName.includes("node-build")) return "node";
    if (buildServiceName.includes("web-build")) return "web";
    if (buildServiceName.includes("python-build")) return "python";
    if (buildServiceName.includes("golang-build")) return "golang";
    return null;
  }

  private async startTestServiceFromServiceInfo(
    serviceInfo: any,
    runtime: IRunTime
  ): Promise<void> {
    const fullServiceName = serviceInfo.name;
    const baseServiceName = this.normalizeServiceName(fullServiceName);

    if (this.testServiceManager.getRunningTests().has(baseServiceName)) {
      this.logger.log(
        `⏭️ Test service ${baseServiceName} is already running, skipping`
      );
      return;
    }

    this.logger.log(
      `🚀 Starting test service: ${baseServiceName} (from ${fullServiceName})`
    );

    const parsed = TestServiceManager.parseTestServiceName(fullServiceName);
    if (!parsed.runtime || !parsed.entryPoint) {
      this.logger.log(
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
    if (normalized.startsWith("bundles-")) {
      normalized = normalized.substring("bundles-".length);
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
