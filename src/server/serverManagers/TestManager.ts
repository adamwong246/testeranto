// Do not allow imports from outside the project

import { IRunTime, IBuiltConfig } from "../../Types";
import { createLogStreams, ProcessCategory } from "./ProcessManager";

export interface QueueItem {
  testName: string;
  runtime: IRunTime;
  addableFiles: string[];
  command: string;
  category: ProcessCategory;
}

export class TestManager {
  ports: Record<number, string> = {};
  processLogs: Map<string, string[]> = new Map();

  jobQueue: QueueItem[];
  jobSet: Map<string, Promise<string>>

  constructor() {
    this.jobQueue = [];
  }


  add(pid: string, executor: (resolve: (value: unknown) => void, reject: (reason?: any) => void) => void) {
    this.jobSet[pid] = new Promise(executor)
  }

  get entries() {
    return this.jobSet.entries()
  }

  async enqueue(
    runtime: IRunTime,
    command: string,
    addableFiles: string[] = [],
    normalizedTestName: string,
    category: ProcessCategory
  ): Promise<void> {
    console.log(`[Queue] enqueue called: runtime=${runtime}, command=${command}, category=${category}`);

    // Create a queue item
    const item: QueueItem = {
      testName: normalizedTestName,
      runtime,
      addableFiles,
      command,
      category
    };

    this.jobQueue.push(item);

  }

  async dequeue(
  ): Promise<void> {
    console.log(`[Queue] dequeue()`);

    this.jobQueue.shift();

  }

  includes(testName: string, runtime?: IRunTime): boolean {
    if (runtime) {
      return this.jobQueue.some(item =>
        item.testName === testName && item.runtime === runtime
      );
    } else {
      return this.jobQueue.some(item => item.testName === testName);
    }
  }

  get queueLength(): number {
    return this.jobQueue.length;
  }

  clearQueue(): void {
    this.jobQueue = [];
  }

  getAllQueueItems(): Array<{
    testName: string;
    runtime: IRunTime;
    addableFiles: string[];
  }> {
    return this.jobQueue.map(item => ({
      testName: item.testName,
      runtime: item.runtime,
      addableFiles: item.addableFiles
    }));
  }


}