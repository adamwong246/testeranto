import { EventEmitter } from "events";
import { IRunTime } from "../../../Types";
import { TestServiceConfig, TestResource, TestServiceInfo } from "./types";
import { DockerCompose } from "./DockerCompose";

export class TestServiceManager extends EventEmitter {
  private runningTests: Map<string, TestServiceInfo> = new Map();
  private dockerCompose: DockerCompose;
  private testName: string;
  private logger: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn?: (...args: any[]) => void;
    info?: (...args: any[]) => void;
  };

  constructor(testName: string, dockerCompose: DockerCompose, logger?: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn?: (...args: any[]) => void;
    info?: (...args: any[]) => void;
  }) {
    super();
    this.testName = testName;
    this.dockerCompose = dockerCompose;
    this.logger = {
      log: logger?.log || console.log,
      error: logger?.error || console.error,
      warn: logger?.warn || console.warn,
      info: logger?.info || console.info,
    };
  }

  public async startTestService(config: TestServiceConfig): Promise<boolean> {
    const { serviceName, testResource, env = {}, runtime, entryPoint } = config;
    
    this.logger.log(`🚀 Starting test service: ${serviceName}`);
    this.logger.log(`   Runtime: ${runtime}, Entry point: ${entryPoint}`);
    this.emit('testServiceStarting', { serviceName, config });
    
    const serviceEnv: Record<string, string> = { ...env };
    
    if (testResource) {
      serviceEnv.TEST_RESOURCES = JSON.stringify(testResource);
      this.logger.log(`📋 Test resources provided for ${serviceName}`);
    } else {
      this.logger.log(`📋 No test resources provided for ${serviceName}`);
      const defaultTestResource: TestResource = {
        name: serviceName,
        ports: [],
        fs: `/testeranto/reports/${this.testName}/${entryPoint.split('.').slice(0, -1).join('.')}/${runtime}`,
        browserWSEndpoint: runtime === 'web' ? 'ws://localhost:9222/devtools/browser' : undefined
      };
      serviceEnv.TEST_RESOURCES = JSON.stringify(defaultTestResource);
    }
    
    serviceEnv.TESTERANTO_RUNTIME = runtime;
    
    this.logger.log(`⚙️ Environment variables set for ${serviceName}:`, Object.keys(serviceEnv));
    
    try {
      this.logger.log(`🎬 Executing docker-compose up for ${serviceName}...`);
      const result = await this.dockerCompose.upOne(serviceName, {
        log: true,
        commandOptions: ['--no-deps'],
        env: serviceEnv,
      });
      
      this.logger.log(`✅ Test service ${serviceName} started successfully`);
      if (result.out && result.out.length > 0) {
        const preview = result.out.substring(0, Math.min(200, result.out.length));
        this.logger.log(`   Command output: ${preview}${result.out.length > 200 ? '...' : ''}`);
      }
      
      this.runningTests.set(serviceName, {
        config,
        startTime: Date.now(),
        status: 'running'
      });
      
      this.emit('testStarted', { serviceName, config, result });
      return true;
    } catch (err) {
      const errorMessage = (err as Error).message;
      this.logger.log(`❌ Error starting test service ${serviceName}:`, errorMessage);
      this.emit('testServiceError', { serviceName, config, error: errorMessage });
      return false;
    }
  }

  public async stopTestService(serviceName: string): Promise<boolean> {
    this.logger.log(`Stopping test service: ${serviceName}`);
    
    try {
      await this.dockerCompose.down({
        log: true,
        commandOptions: [serviceName],
      });
      
      this.runningTests.delete(serviceName);
      this.emit('testStopped', { serviceName });
      return true;
    } catch (err) {
      this.logger.log(`Error stopping test service ${serviceName}:`, (err as Error).message);
      return false;
    }
  }

  public async getTestLogs(serviceName: string, tail: number = 100): Promise<string> {
    try {
      const result = await this.dockerCompose.logs(serviceName, {
        log: false,
        follow: false,
        tail: tail,
      });
      
      return result.out || result.err || '';
    } catch (err) {
      this.logger.log(`Error getting logs for ${serviceName}:`, (err as Error).message);
      return '';
    }
  }

  public getRunningTests(): Map<string, TestServiceInfo> {
    return new Map(this.runningTests);
  }

  public getTestStatuses(): Array<{
    serviceName: string;
    config: TestServiceConfig;
    startTime: number;
    status: string;
  }> {
    return Array.from(this.runningTests.entries()).map(([serviceName, info]) => ({
      serviceName,
      ...info
    }));
  }

  public static generateTestServiceName(entryPoint: string, runtime: IRunTime): string {
    const withoutExt = entryPoint.replace(/\.[^/.]+$/, "");
    const normalized = withoutExt.replace(/\//g, '-').replace(/\./g, '-');
    // Ensure the entire service name is lowercase to comply with Docker Compose naming rules
    return `${runtime}-${normalized}`.toLowerCase();
  }

  public static parseTestServiceName(serviceName: string): { runtime: IRunTime | null, entryPoint: string | null } {
    let nameWithoutNumber = serviceName.replace(/-[0-9]+$/, '');
    
    if (nameWithoutNumber.startsWith('bundles-')) {
      nameWithoutNumber = nameWithoutNumber.substring('bundles-'.length);
    }
    
    const parts = nameWithoutNumber.split('-');
    if (parts.length < 2) return { runtime: null, entryPoint: null };
    
    // The runtime part should be lowercase, but we need to ensure it's valid
    const runtime = parts[0] as IRunTime;
    const entryPoint = parts.slice(1).join('-');
    
    const validRuntimes: IRunTime[] = ['node', 'web', 'pure', 'golang', 'python'];
    if (!validRuntimes.includes(runtime)) {
      return { runtime: null, entryPoint: null };
    }
    
    return { runtime, entryPoint };
  }

  // Helper method to validate runtime
  public static isValidRuntime(runtime: string): runtime is IRunTime {
    const validRuntimes: IRunTime[] = ['node', 'web', 'pure', 'golang', 'python'];
    return validRuntimes.includes(runtime as IRunTime);
  }
}
