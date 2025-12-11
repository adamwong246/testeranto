import { AiderPoolClient } from './AiderPoolClient';
import fs from 'fs';
import path from 'path';

export class AiderIntegration {
  private aiderPoolClient: AiderPoolClient;
  private aiderWatchers: Map<string, fs.FSWatcher> = new Map();

  constructor(wsUrl: string = 'ws://localhost:8765') {
    this.aiderPoolClient = new AiderPoolClient(wsUrl);
  }

  async initialize(): Promise<void> {
    try {
      await this.aiderPoolClient.connect();
      console.log('Aider pool client connected');
      
      // Listen for instance creation
      this.aiderPoolClient.on('instance_created', (instanceInfo) => {
        console.log(`Aider instance created: ${instanceInfo.instance_id} for ${instanceInfo.test_name}`);
        
        // Start watching metafile for changes
        this.watchMetafileForInstance(instanceInfo);
      });
    } catch (err) {
      console.warn('Could not connect to aider pool:', (err as Error).message);
    }
  }

  async createAiderForTest(
    testName: string,
    runtime: string,
    metafilePath?: string
  ): Promise<void> {
    let initialFiles: string[] = [];
    
    if (metafilePath) {
      initialFiles = this.aiderPoolClient.extractFilesFromMetafile(metafilePath);
    }
    
    try {
      const instanceInfo = await this.aiderPoolClient.createAiderInstance(
        testName,
        runtime,
        initialFiles
      );
      
      console.log(`Aider instance ready. Connect with:`);
      console.log(`  nc localhost ${instanceInfo.terminal_port}`);
      console.log(`Or use the terminal bridge`);
      
    } catch (error) {
      console.error(`Failed to create aider instance:`, error);
    }
  }

  private watchMetafileForInstance(instanceInfo: any): void {
    const metafilePath = path.join(
      process.cwd(),
      'testeranto',
      'metafiles',
      instanceInfo.runtime,
      'allTests.json'
    );
    
    if (!fs.existsSync(metafilePath)) {
      return;
    }
    
    const watcher = fs.watch(metafilePath, async (eventType) => {
      if (eventType === 'change') {
        console.log(`Metafile changed for ${instanceInfo.test_name}, updating aider context...`);
        await this.aiderPoolClient.updateFilesFromMetafile(
          instanceInfo.instance_id,
          metafilePath
        );
      }
    });
    
    // Store watcher for cleanup
    this.aiderWatchers.set(instanceInfo.instance_id, watcher);
  }

  cleanup(): void {
    // Clean up all watchers
    for (const [instanceId, watcher] of this.aiderWatchers) {
      watcher.close();
    }
    this.aiderWatchers.clear();
    
    // Disconnect from aider pool
    this.aiderPoolClient.disconnect();
  }
}
