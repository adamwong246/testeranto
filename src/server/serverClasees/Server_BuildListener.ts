// // This allows the server to listen for "sourceFilesUpdated" events vs WS.
// // These events will have a payload with 
// // 1) a super-hash of all files
// // 2) a list of input files
// // The Build listener should maintain a Map of tests to internal hashes. If this hash changes, we can schedule that test.
// import { IRunTime } from "../../Types";
// import { generateReactAppHtml } from "../htmlTemplate";
// import { Server_Scheduler } from "./Server_Scheduler";

// type BuildEvent = {
//   id: string;
//   testName: string;
//   hash: string;
//   files: string[];
//   timestamp: string;
//   status: 'pending' | 'processing' | 'scheduled' | 'completed' | 'error';
//   message?: string;
//   runtime?: string;
// };

// export class Server_BuildListener extends Server_Scheduler {
//   // Map test name to IHashes
//   hashes: Map<string, { hash: string; files: string[] }> = new Map();
//   // Store build events for UI
//   buildEvents: BuildEvent[] = [];
//   // Maximum number of events to keep
//   private maxEvents = 100;

//   constructor(configs: any, name: string, mode: any) {
//     super(configs, name, mode, {
//       build_listener: (req, res) => {
//         res.writeHead(200, { "Content-Type": "text/html" });
//         res.end(generateReactAppHtml("Build Listener",
//           "BuildListenerReactApp",
//           "Build Listener"));
//       },
//     });
//   }

//   sourceFilesUpdated(testName: string, hash: string, files: string[], runtime: IRunTime): void {
//     // Create a unique key that combines runtime and testName
//     // If runtime is not provided, we can't properly track the test
//     if (!runtime) {
//       console.error(`[BuildListener] No runtime provided for test: ${testName}. Cannot track or schedule tests.`);
//       return;
//     }

//     const testKey = `${runtime}:${testName}`;
//     console.log(`[BuildListener] Source files updated for test: ${testKey}, hash: ${hash}`);

//     // Check if we have a previous hash for this test
//     const previousHash = this.hashes.has(testKey) ?
//       this.hashes.get(testKey)?.hash : null;

//     // Store the hash and files
//     this.hashes.set(testKey, { hash, files });

//     // Create a new build event
//     const event: BuildEvent = {
//       id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//       testName,
//       hash,
//       files,
//       timestamp: new Date().toISOString(),
//       status: 'pending',
//       message: `Build update received for ${testKey}`,
//       runtime
//     };

//     this.addBuildEvent(event);

//     // If hash has changed, schedule tests
//     if (previousHash !== hash) {
//       console.log(`[BuildListener] Hash changed for ${testKey}. Scheduling tests...`);

//       // Update event status
//       event.status = 'processing';
//       event.message = `Hash changed for ${testKey}. Scheduling tests...`;
//       this.updateBuildEvent(event);

//       this.scheduleBddTest(testName, runtime, files)
//       this.scheduleStaticTests(testName, runtime, files)

//       // Update event status
//       event.status = 'scheduled';
//       event.message = `Test ${testKey} scheduled for execution`;
//       this.updateBuildEvent(event);

//       // Broadcast to WebSocket clients
//       this.broadcastBuildUpdate(testName, hash, files, runtime);
//     } else {
//       console.log(`[BuildListener] Hash unchanged for ${testKey}. No action needed.`);
//       event.status = 'completed';
//       event.message = `Hash unchanged for ${testKey}. No action needed.`;
//       this.updateBuildEvent(event);
//     }
//   }


//   private addBuildEvent(event: BuildEvent): void {
//     this.buildEvents.unshift(event); // Add to beginning for chronological order (newest first)
//     if (this.buildEvents.length > this.maxEvents) {
//       this.buildEvents.pop(); // Remove oldest event
//     }
//     this.broadcastBuildEvents();
//   }

//   private updateBuildEvent(updatedEvent: BuildEvent): void {
//     const index = this.buildEvents.findIndex(e => e.id === updatedEvent.id);
//     if (index !== -1) {
//       this.buildEvents[index] = updatedEvent;
//       this.broadcastBuildEvents();
//     }
//   }

//   private broadcastBuildUpdate(testName: string, hash: string, files: string[], runtime?: string): void {
//     // Check if we have a broadcast method (from Server_WS)
//     if (typeof (this as any).broadcast === 'function') {
//       const testKey = runtime ? `${runtime}:${testName}` : testName;
//       (this as any).broadcast({
//         type: 'buildUpdate',
//         testKey,
//         testName,
//         hash,
//         files,
//         runtime,
//         timestamp: new Date().toISOString()
//       });
//     }
//   }

//   private broadcastBuildEvents(): void {
//     if (typeof (this as any).broadcast === 'function') {
//       (this as any).broadcast({
//         type: 'buildEvents',
//         events: this.buildEvents,
//         timestamp: new Date().toISOString()
//       });
//     }
//   }

//   public getBuildEvents(): BuildEvent[] {
//     return this.buildEvents;
//   }

//   public getBuildListenerState(): any {
//     return {
//       hashes: Array.from(this.hashes.entries()).map(([testKey, data]) => {
//         // Split the key back into runtime and testName
//         const [runtime, testName] = testKey.split(':', 2);
//         return {
//           testKey,
//           runtime,
//           testName,
//           hash: data.hash,
//           fileCount: data.files.length
//         };
//       }),
//       recentEvents: this.buildEvents.slice(0, 10), // Last 10 events
//       totalEvents: this.buildEvents.length,
//       timestamp: new Date().toISOString()
//     };
//   }

//   async start() {
//     console.log(`[Server_BuildListener] start()`)
//     super.start()
//   }

//   async stop() {
//     console.log(`[Server_BuildListener] stop()`)
//     super.stop()
//   }
// }
