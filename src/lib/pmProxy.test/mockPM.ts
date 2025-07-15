import { MockPMBase } from "./mockPMBase";

export class MockPM extends MockPMBase {
  server: any;

  constructor(configs?: any) {
    super(configs);
    this.server = {};
    this.testResourceConfiguration = {};
  }

  // PM-specific methods
  start(): Promise<void> {
    this.trackCall("start", {});
    return Promise.resolve();
  }

  stop(): Promise<void> {
    this.trackCall("stop", {});
    return Promise.resolve();
  }

  launchSideCar(n: number): Promise<[number, any]> {
    this.trackCall("launchSideCar", { n });
    return Promise.resolve([n, this.testResourceConfiguration]);
  }

  stopSideCar(n: number): Promise<any> {
    this.trackCall("stopSideCar", { n });
    return Promise.resolve();
  }

  // Override any methods that need different behavior from MockPMBase
  // For example:
  writeFileSync(path: string, content: string): Promise<boolean> {
    return super.writeFileSync(path, content, "default-test-name");
  }
}
