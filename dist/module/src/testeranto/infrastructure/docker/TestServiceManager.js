import { EventEmitter } from "events";
export class TestServiceManager extends EventEmitter {
    constructor(testName, dockerCompose) {
        super();
        this.runningTests = new Map();
        this.testName = testName;
        this.dockerCompose = dockerCompose;
    }
    async startTestService(config) {
        const { serviceName, testResource, env = {}, runtime, entryPoint } = config;
        console.log(`🚀 Starting test service: ${serviceName}`);
        console.log(`   Runtime: ${runtime}, Entry point: ${entryPoint}`);
        this.emit('testServiceStarting', { serviceName, config });
        const serviceEnv = Object.assign({}, env);
        if (testResource) {
            serviceEnv.TEST_RESOURCES = JSON.stringify(testResource);
            console.log(`📋 Test resources provided for ${serviceName}`);
        }
        else {
            console.log(`📋 No test resources provided for ${serviceName}`);
            const defaultTestResource = {
                name: serviceName,
                ports: [],
                fs: `/testeranto/reports/${this.testName}/${entryPoint.split('.').slice(0, -1).join('.')}/${runtime}`,
                browserWSEndpoint: runtime === 'web' ? 'ws://localhost:9222/devtools/browser' : undefined
            };
            serviceEnv.TEST_RESOURCES = JSON.stringify(defaultTestResource);
        }
        serviceEnv.TESTERANTO_RUNTIME = runtime;
        console.log(`⚙️ Environment variables set for ${serviceName}:`, Object.keys(serviceEnv));
        try {
            console.log(`🎬 Executing docker-compose up for ${serviceName}...`);
            const result = await this.dockerCompose.upOne(serviceName, {
                log: true,
                commandOptions: ['--no-deps'],
                env: serviceEnv,
            });
            console.log(`✅ Test service ${serviceName} started successfully`);
            if (result.out && result.out.length > 0) {
                const preview = result.out.substring(0, Math.min(200, result.out.length));
                console.log(`   Command output: ${preview}${result.out.length > 200 ? '...' : ''}`);
            }
            this.runningTests.set(serviceName, {
                config,
                startTime: Date.now(),
                status: 'running'
            });
            this.emit('testStarted', { serviceName, config, result });
            return true;
        }
        catch (err) {
            const errorMessage = err.message;
            console.log(`❌ Error starting test service ${serviceName}:`, errorMessage);
            this.emit('testServiceError', { serviceName, config, error: errorMessage });
            return false;
        }
    }
    async stopTestService(serviceName) {
        console.log(`Stopping test service: ${serviceName}`);
        try {
            await this.dockerCompose.down({
                log: true,
                commandOptions: [serviceName],
            });
            this.runningTests.delete(serviceName);
            this.emit('testStopped', { serviceName });
            return true;
        }
        catch (err) {
            console.log(`Error stopping test service ${serviceName}:`, err.message);
            return false;
        }
    }
    async getTestLogs(serviceName, tail = 100) {
        try {
            const result = await this.dockerCompose.logs(serviceName, {
                log: false,
                follow: false,
                tail: tail,
            });
            return result.out || result.err || '';
        }
        catch (err) {
            console.log(`Error getting logs for ${serviceName}:`, err.message);
            return '';
        }
    }
    getRunningTests() {
        return new Map(this.runningTests);
    }
    getTestStatuses() {
        return Array.from(this.runningTests.entries()).map(([serviceName, info]) => (Object.assign({ serviceName }, info)));
    }
    static generateTestServiceName(entryPoint, runtime) {
        const withoutExt = entryPoint.replace(/\.[^/.]+$/, "");
        const normalized = withoutExt.replace(/\//g, '-').replace(/\./g, '-');
        // Ensure the entire service name is lowercase to comply with Docker Compose naming rules
        return `${runtime}-${normalized}`.toLowerCase();
    }
    static parseTestServiceName(serviceName) {
        let nameWithoutNumber = serviceName.replace(/-[0-9]+$/, '');
        if (nameWithoutNumber.startsWith('bundles-')) {
            nameWithoutNumber = nameWithoutNumber.substring('bundles-'.length);
        }
        const parts = nameWithoutNumber.split('-');
        if (parts.length < 2)
            return { runtime: null, entryPoint: null };
        // The runtime part should be lowercase, but we need to ensure it's valid
        const runtime = parts[0];
        const entryPoint = parts.slice(1).join('-');
        const validRuntimes = ['node', 'web', 'pure', 'golang', 'python'];
        if (!validRuntimes.includes(runtime)) {
            return { runtime: null, entryPoint: null };
        }
        return { runtime, entryPoint };
    }
    // Helper method to validate runtime
    static isValidRuntime(runtime) {
        const validRuntimes = ['node', 'web', 'pure', 'golang', 'python'];
        return validRuntimes.includes(runtime);
    }
}
