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

}
