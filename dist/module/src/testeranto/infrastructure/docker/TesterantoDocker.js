import { EventEmitter } from "events";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { BrowserManager } from "./BrowserManager";
import { BuildServiceMonitor } from "./BuildServiceMonitor";
import { DockerCompose } from "./DockerCompose";
import { FileSystem } from "./FileSystem";
import { TcpServer } from "./TcpServer";
import { TestServiceManager } from "./TestServiceManager";
export default class TesterantoDocker extends EventEmitter {
    constructor(testName) {
        super();
        this.tcpPort = 0;
        console.log("TesterantoDocker initialized.");
        this.testName = testName;
        this.composeDir = process.cwd();
        this.composeFile = path.join(this.composeDir, "testeranto", "bundles", `${this.testName}-docker-compose.yml`);
        // Initialize components
        this.tcpServer = new TcpServer();
        this.fileSystem = new FileSystem();
        this.dockerCompose = new DockerCompose(this.composeDir, this.composeFile);
        this.browserManager = new BrowserManager();
        this.testServiceManager = new TestServiceManager(this.testName, this.dockerCompose);
        this.buildServiceMonitor = new BuildServiceMonitor(this.dockerCompose);
        // Set up event forwarding
        this.setupEventForwarding();
    }
    async initialize() {
        // Initialize services
        await this.initializeServices();
    }
    setupEventForwarding() {
        // Forward events from components using a helper function
        const forwardEvents = (component, eventNames) => {
            eventNames.forEach(eventName => {
                component.on(eventName, (data) => this.emit(eventName, data));
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
    async initializeServices() {
        try {
            const port = await this.tcpServer.start();
            console.log(`🔌 TCP server started on port ${port}`);
            this.tcpPort = port;
        }
        catch (error) {
            console.error(`❌ Failed to start TCP server:`, error);
            throw error;
        }
        await this.browserManager.initialize();
    }
    // Public methods that delegate to components
    getTcpPort() {
        const port = this.tcpServer.getPort();
        if (port === 0) {
            console.warn(`⚠️ TCP port is 0, server may not be ready`);
        }
        return port;
    }
    async createWebPage(testId) {
        return this.browserManager.createPage(testId);
    }
    async closeWebPage(testId) {
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
        }
        catch (err) {
            // It's okay if down fails (e.g., no services are running)
            console.log("ℹ️ Docker Compose down may have failed (possibly no running services):", err.message);
            this.emit("stopError", { error: err.message });
        }
    }
    onBundleChange(entryPoint, lang) {
        console.log(`Bundle changed for ${lang}: ${entryPoint}`);
        this.emit("bundleChange", { entryPoint, lang });
    }
    async start() {
        console.log("🔄 Attempting to stop any existing Docker Compose services...");
        try {
            await this.stop();
        }
        catch (err) {
            // It's okay if stop fails (e.g., no containers are running)
            console.log("ℹ️ Stop may have failed (possibly no running containers):", err.message);
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
        }
        catch (dockerErr) {
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
        }
        catch (composeErr) {
            console.log("⚠️ docker-compose command not found, trying docker compose...");
            try {
                execSync('docker compose version', { stdio: 'pipe' });
                composeCommand = 'docker compose';
                console.log("✅ docker compose (v2) is available");
            }
            catch (dockerComposeErr) {
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
        }
        catch (validateErr) {
            console.error("❌ Docker Compose file validation failed:", validateErr.message);
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
        }
        catch (listErr) {
            console.log("⚠️ Could not list services:", listErr.message);
        }
        try {
            console.log("🎬 Running docker-compose up...");
            const result = await this.dockerCompose.upAll({
                log: true,
                commandOptions: ["--build", "--force-recreate", "--remove-orphans", "-d"],
                detach: true,
            });
            console.log("✅ Docker Compose started successfully with fresh containers");
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
            }
            catch (psErr) {
                console.log("⚠️ Could not check running services:", psErr.message);
            }
            // Wait a bit more for services to initialize
            console.log("⏳ Waiting for services to initialize...");
            await new Promise(resolve => setTimeout(resolve, 5000));
            await this.buildServiceMonitor.identifyBuildServices();
        }
        catch (err) {
            console.log("❌ Error starting Docker Compose:", err.message);
            console.log("Stack trace:", err.stack);
            // Try to get more details
            try {
                const errorOutput = execSync(`${composeCommand} -f "${this.composeFile}" up --build --force-recreate --remove-orphans -d 2>&1`, {
                    encoding: 'utf8',
                    cwd: this.composeDir
                });
                console.log("📋 Docker Compose output:", errorOutput);
            }
            catch (execErr) {
                console.log("⚠️ Could not get detailed error output:", execErr.message);
            }
            throw err; // Re-throw to let caller know
        }
    }
    async rebuild(noCache = false) {
        await this.stop();
        const commandOptions = ["--build", "--force-recreate", "--remove-orphans"];
        if (noCache) {
            commandOptions.push("--no-cache");
        }
        console.log(`Rebuilding Docker Compose ${noCache ? "without cache" : "with cache"}...`);
        try {
            const result = await this.dockerCompose.upAll({
                log: true,
                commandOptions: commandOptions,
            });
            console.log(`Docker Compose rebuilt successfully ${noCache ? "without cache" : "with cache"}:`, result);
            await this.buildServiceMonitor.identifyBuildServices();
        }
        catch (err) {
            console.log("Something went wrong:", err.message);
            console.log(err);
        }
    }
    async identifyBuildServices() {
        await this.buildServiceMonitor.identifyBuildServices();
    }
    async waitForBuildService(serviceName, timeoutMs = 10000) {
        return this.buildServiceMonitor.waitForBuildService(serviceName, timeoutMs);
    }
    async startTestService(config) {
        return this.testServiceManager.startTestService(config);
    }
    async stopTestService(serviceName) {
        return this.testServiceManager.stopTestService(serviceName);
    }
    async getTestLogs(serviceName, tail = 100) {
        return this.testServiceManager.getTestLogs(serviceName, tail);
    }
    getRunningTests() {
        return this.testServiceManager.getRunningTests();
    }
    getBuildServices() {
        return this.buildServiceMonitor.getBuildServices();
    }
    async getBuildServiceStatuses() {
        return this.buildServiceMonitor.getBuildServiceStatuses();
    }
    async monitorBuildServices(callback) {
        this.buildServiceMonitor.startMonitoring(callback);
    }
    static generateTestServiceName(entryPoint, runtime) {
        return TestServiceManager.generateTestServiceName(entryPoint, runtime);
    }
    static parseTestServiceName(serviceName) {
        return TestServiceManager.parseTestServiceName(serviceName);
    }
    async startTestByEntryPoint(entryPoint, runtime, testResource, additionalEnv) {
        const serviceName = TesterantoDocker.generateTestServiceName(entryPoint, runtime);
        const env = Object.assign(Object.assign({}, additionalEnv), { TESTERANTO_RUNTIME: runtime });
        const config = {
            serviceName,
            runtime,
            entryPoint,
            testResource,
            env,
        };
        return this.startTestService(config);
    }
    async startTestServicesForBuildService(buildServiceName) {
        console.log(`🚀 Looking for test services for build service: ${buildServiceName}`);
        // Extract runtime from build service name using a helper
        const runtime = this.extractRuntimeFromBuildService(buildServiceName);
        if (!runtime) {
            console.log(`⚠️ Could not determine runtime for build service: ${buildServiceName}`);
            return;
        }
        console.log(`🔍 Starting test services for runtime: ${runtime}`);
        try {
            const result = await this.dockerCompose.ps({
                log: false,
            });
            if (result.data && result.data.services) {
                const testServices = result.data.services.filter((s) => s.name.includes(runtime) &&
                    !s.name.includes("build") &&
                    s.name !== buildServiceName);
                console.log(`🔍 Found ${testServices.length} test services for ${runtime}`);
                for (const testService of testServices) {
                    await this.startTestServiceFromServiceInfo(testService, runtime);
                }
            }
        }
        catch (err) {
            console.log(`❌ Error starting test services for ${buildServiceName}:`, err.message);
        }
    }
    extractRuntimeFromBuildService(buildServiceName) {
        if (buildServiceName.includes("node-build"))
            return "node";
        if (buildServiceName.includes("web-build"))
            return "web";
        if (buildServiceName.includes("python-build"))
            return "python";
        if (buildServiceName.includes("golang-build"))
            return "golang";
        return null;
    }
    async startTestServiceFromServiceInfo(serviceInfo, runtime) {
        const fullServiceName = serviceInfo.name;
        const baseServiceName = this.normalizeServiceName(fullServiceName);
        if (this.testServiceManager.getRunningTests().has(baseServiceName)) {
            console.log(`⏭️ Test service ${baseServiceName} is already running, skipping`);
            return;
        }
        console.log(`🚀 Starting test service: ${baseServiceName} (from ${fullServiceName})`);
        const parsed = TestServiceManager.parseTestServiceName(fullServiceName);
        if (!parsed.runtime || !parsed.entryPoint) {
            console.log(`⚠️ Could not parse test service name: ${fullServiceName}`);
            return;
        }
        const testResource = {
            name: parsed.entryPoint,
            ports: [],
            fs: `/testeranto/reports/${this.testName}/${parsed.entryPoint
                .split(".")
                .slice(0, -1)
                .join(".")}/${parsed.runtime}`,
        };
        const config = {
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
    normalizeServiceName(serviceName) {
        let normalized = serviceName.replace(/-[0-9]+$/, "");
        if (normalized.startsWith('bundles-')) {
            normalized = normalized.substring('bundles-'.length);
        }
        // Ensure the normalized name is lowercase for consistency
        return normalized.toLowerCase();
    }
    getTestStatuses() {
        return this.testServiceManager.getTestStatuses();
    }
}
