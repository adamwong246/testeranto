// This allows the server to listen for "sourceFilesUpdated" events vs WS.
// These events will have a payload with 
// 1) a super-hash of all files
// 2) a list of input files
// The Build listener should maintain a Map of tests to internal hashes. If this hash changes, we can schedule that test.
import { Server_Scheduler } from "./Server_Scheduler";

type BuildEvent = {
  id: string;
  testName: string;
  hash: string;
  files: string[];
  timestamp: string;
  status: 'pending' | 'processing' | 'scheduled' | 'completed' | 'error';
  message?: string;
};

export class Server_BuildListener extends Server_Scheduler {
  // Map test name to IHashes
  hashes: Map<string, { hash: string; files: string[] }> = new Map();
  // Store build events for UI
  buildEvents: BuildEvent[] = [];
  // Maximum number of events to keep
  private maxEvents = 100;

  constructor(configs: any, name: string, mode: any) {
    super(configs, name, mode);
  }

  sourceFilesUpdated(testName: string, hash: string, files: string[]): void {
    console.log(`[BuildListener] Source files updated for test: ${testName}, hash: ${hash}`);

    // Check if we have a previous hash for this test
    const previousHash = this.hashes.has(testName) ?
      this.hashes.get(testName)?.hash : null;

    // Store the hash and files
    this.hashes.set(testName, { hash, files });

    // Create a new build event
    const event: BuildEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      testName,
      hash,
      files,
      timestamp: new Date().toISOString(),
      status: 'pending',
      message: `Build update received for ${testName}`
    };
    
    this.addBuildEvent(event);

    // If hash has changed, schedule tests
    if (previousHash !== hash) {
      console.log(`[BuildListener] Hash changed for ${testName}. Scheduling tests...`);
      
      // Update event status
      event.status = 'processing';
      event.message = `Hash changed for ${testName}. Scheduling tests...`;
      this.updateBuildEvent(event);

      // Extract test runtime from testName or files
      // For now, we'll assume all tests need to be scheduled
      this.scheduleTest(testName, files);

      // Update event status
      event.status = 'scheduled';
      event.message = `Test ${testName} scheduled for execution`;
      this.updateBuildEvent(event);

      // Broadcast to WebSocket clients
      this.broadcastBuildUpdate(testName, hash, files);
    } else {
      console.log(`[BuildListener] Hash unchanged for ${testName}. No action needed.`);
      event.status = 'completed';
      event.message = `Hash unchanged for ${testName}. No action needed.`;
      this.updateBuildEvent(event);
    }
  }

  private addBuildEvent(event: BuildEvent): void {
    this.buildEvents.unshift(event); // Add to beginning for chronological order (newest first)
    if (this.buildEvents.length > this.maxEvents) {
      this.buildEvents.pop(); // Remove oldest event
    }
    this.broadcastBuildEvents();
  }

  private updateBuildEvent(updatedEvent: BuildEvent): void {
    const index = this.buildEvents.findIndex(e => e.id === updatedEvent.id);
    if (index !== -1) {
      this.buildEvents[index] = updatedEvent;
      this.broadcastBuildEvents();
    }
  }

  private scheduleTest(testName: string, files: string[]): void {
    console.log(`[BuildListener] Scheduling test: ${testName}`);
    // Here we would implement the actual scheduling logic
    // For now, just log
    // In a real implementation, this would queue the test for execution
  }

  private broadcastBuildUpdate(testName: string, hash: string, files: string[]): void {
    // Check if we have a broadcast method (from Server_WS)
    if (typeof (this as any).broadcast === 'function') {
      (this as any).broadcast({
        type: 'buildUpdate',
        testName,
        hash,
        files,
        timestamp: new Date().toISOString()
      });
    }
  }

  private broadcastBuildEvents(): void {
    if (typeof (this as any).broadcast === 'function') {
      (this as any).broadcast({
        type: 'buildEvents',
        events: this.buildEvents,
        timestamp: new Date().toISOString()
      });
    }
  }

  public getBuildEvents(): BuildEvent[] {
    return this.buildEvents;
  }

  public getBuildListenerState(): any {
    return {
      hashes: Array.from(this.hashes.entries()).map(([testName, data]) => ({
        testName,
        hash: data.hash,
        fileCount: data.files.length
      })),
      recentEvents: this.buildEvents.slice(0, 10), // Last 10 events
      totalEvents: this.buildEvents.length,
      timestamp: new Date().toISOString()
    };
  }

  routes(
    routes: Record<string, React.ComponentType<any> | React.ReactElement>
  ) {
    super.routes({
      build_listener: {} as React.ComponentType<any>,
      ...routes,
    });
  }
}
