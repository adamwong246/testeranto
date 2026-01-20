import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class AiderIntegration {
  private aiderProcesses: Map<string, any> = new Map();

  constructor() {
    // No WebSocket client needed
  }

  async initialize(): Promise<void> {
    console.log('Aider integration initialized (direct command mode)');
  }

  async createAiderForTest(
    testName: string,
    runtime: string,
    metafilePath?: string
  ): Promise<void> {
    console.log(`Aider integration: createAiderForTest called for ${testName} (${runtime})`);
    // Note: Aider processes are now managed by Server_ProcessManager
    // This method is kept for compatibility but does nothing
    console.log(`Aider processes are now managed by the ProcessManager`);
  }

  private extractFilesFromMetafile(metafilePath: string): string[] {
    try {
      const metafileContent = fs.readFileSync(metafilePath, 'utf-8');
      const metafile = JSON.parse(metafileContent);

      // Extract source files
      return Object.keys(metafile.inputs || {})
        .filter(
          (file) =>
            file.endsWith('.ts') ||
            file.endsWith('.js') ||
            file.endsWith('.py') ||
            file.endsWith('.go')
        )
        .map((file) =>
          path.relative(process.cwd(), path.join(process.cwd(), file))
        );
    } catch (error) {
      console.error(`Error extracting files from metafile:`, error);
      return [];
    }
  }

  cleanup(): void {
    // Clean up all aider processes
    for (const [processId, process] of this.aiderProcesses) {
      try {
        process.kill();
        console.log(`Stopped aider process: ${processId}`);
      } catch (error) {
        console.error(`Failed to stop aider process ${processId}:`, error);
      }
    }
    this.aiderProcesses.clear();
  }
}
