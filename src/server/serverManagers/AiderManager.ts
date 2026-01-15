import { IRunTime, IBuiltConfig } from "../../Types";
import { IMode } from "../types";
import { ChildProcess } from "child_process";
import * as fs from "fs";
import * as path from "path";

export interface AiderProcessInfo {
  processId: string;
  containerName?: string;
  process?: ChildProcess;
  status: "running" | "stopped" | "error";
  command: string;
  timestamp: string;
  type: "docker" | "local";
  category: "aider";
  testName: string;
  platform: IRunTime;
}

export class AiderManager {
  private processes: Map<string, AiderProcessInfo>;
  private configs: IBuiltConfig;
  private testName: string;
  private mode: IMode;

  constructor(configs: IBuiltConfig, testName: string, mode: IMode) {
    this.processes = new Map();
    this.configs = configs;
    this.testName = testName;
    this.mode = mode;
  }

  // Add a new aider process
  addProcess(processInfo: AiderProcessInfo): void {
    this.processes.set(processInfo.processId, processInfo);
  }

  // Get all processes
  get entries(): IterableIterator<[string, AiderProcessInfo]> {
    return this.processes.entries();
  }

  // Get a specific process
  getProcess(processId: string): AiderProcessInfo | undefined {
    return this.processes.get(processId);
  }

  // Remove a process
  removeProcess(processId: string): boolean {
    return this.processes.delete(processId);
  }

  // Stop all processes
  async stopAll(): Promise<void> {
    for (const [processId, processInfo] of this.processes) {
      await this.stopProcess(processId);
    }
  }

  // Stop a specific process
  async stopProcess(processId: string): Promise<boolean> {
    const processInfo = this.processes.get(processId);
    if (!processInfo) {
      return false;
    }

    try {
      if (processInfo.type === "docker" && processInfo.containerName) {
        // Stop Docker container
        const { exec } = require("child_process");
        const util = require("util");
        const execPromise = util.promisify(exec);
        
        await execPromise(`docker stop ${processInfo.containerName}`);
        await execPromise(`docker rm -f ${processInfo.containerName}`);
      } else if (processInfo.process) {
        // Stop local process
        processInfo.process.kill('SIGTERM');
        setTimeout(() => {
          if (!processInfo.process?.killed) {
            processInfo.process?.kill('SIGKILL');
          }
        }, 2000);
      }
      
      processInfo.status = "stopped";
      return true;
    } catch (error) {
      console.error(`Failed to stop aider process ${processId}:`, error);
      processInfo.status = "error";
      return false;
    }
  }

  // Load API keys from .aider.conf.yml
  loadAiderApiKeys(): Record<string, string> {
    try {
      const configPath = path.join(process.cwd(), '.aider.conf.yml');
      if (!fs.existsSync(configPath)) {
        console.log('[AiderManager] No .aider.conf.yml file found');
        return {};
      }

      const yaml = require('js-yaml');
      const config = yaml.load(fs.readFileSync(configPath, 'utf8'));

      const apiKeys: Record<string, string> = {};

      // Extract API keys from config
      if (config['openai-api-key']) {
        apiKeys['OPENAI_API_KEY'] = config['openai-api-key'];
      }
      if (config['anthropic-api-key']) {
        apiKeys['ANTHROPIC_API_KEY'] = config['anthropic-api-key'];
      }
      if (config['api-key']) {
        // Handle both string and array
        if (Array.isArray(config['api-key'])) {
          config['api-key'].forEach((key: string, index: number) => {
            apiKeys[`API_KEY_${index}`] = key;
          });
        } else {
          apiKeys['API_KEY'] = config['api-key'];
        }
      }

      console.log('[AiderManager] Loaded API keys from .aider.conf.yml');
      return apiKeys;
    } catch (error) {
      console.error('[AiderManager] Failed to load API keys from .aider.conf.yml:', error);
      return {};
    }
  }

  // Build the aider base image if not already built
  async ensureAiderImage(): Promise<boolean> {
    const imageName = 'testeranto-aider:latest';
    const { exec } = require("child_process");
    const util = require("util");
    const execPromise = util.promisify(exec);

    try {
      // Check if image exists
      const checkResult = await execPromise(`docker images -q ${imageName}`);
      if (checkResult.stdout && checkResult.stdout.trim() !== '') {
        console.log('[AiderManager] Aider base image already exists');
        return true;
      }

      console.log('[AiderManager] Building aider base image...');

      // Create a temporary Dockerfile
      const dockerfileContent = [
        'FROM python:3.11-slim',
        'WORKDIR /workspace',
        'RUN pip install --no-cache-dir aider-chat',
        '# Create a non-root user for security',
        'RUN useradd -m -u 1000 aider && chown -R aider:aider /workspace',
        'USER aider',
        '# Default command starts aider in interactive mode',
        'CMD ["aider", "--yes", "--dark-mode"]'
      ].join('\n');

      const tempDir = path.join(process.cwd(), 'testeranto', 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const dockerfilePath = path.join(tempDir, 'Dockerfile.aider');
      fs.writeFileSync(dockerfilePath, dockerfileContent);

      // Build the image
      await execPromise(`docker build -t ${imageName} -f ${dockerfilePath} ${tempDir}`);
      console.log('[AiderManager] Aider base image built successfully');
      return true;
    } catch (error) {
      console.error('[AiderManager] Failed to build aider base image:', error);
      return false;
    }
  }
}
