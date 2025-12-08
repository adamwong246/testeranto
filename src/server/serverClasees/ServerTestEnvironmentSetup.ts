/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRunTime } from "../../Types";
import { TestEnvironmentSetup } from "./TestEnvironmentSetup";
import configTests from "../configTests";
import ansiC from "ansi-colors";

export class ServerTestEnvironmentSetup {
  constructor(
    private ports: Record<number, string>,
    private projectName: string,
    private browser: any,
    private queue: string[],
    private configs: any,
    private bddTestIsRunning: (src: string) => void
  ) {}

  async setupTestEnvironment(
    src: string,
    runtime: IRunTime
  ): Promise<{
    reportDest: string;
    testConfig: any;
    testConfigResource: any;
    portsToUse: string[];
    testResources: string;
  }> {
    this.bddTestIsRunning(src);

    // First, get the test config
    const testConfig = configTests(this.configs).find((t) => t[0] === src);
    if (!testConfig) {
      console.log(
        ansiC.inverse(`missing test config! Exiting ungracefully for '${src}'`)
      );
      process.exit(-1);
    }

    // Update the testEnvironmentSetup instance with current properties
    // Since ports, browser, and queue may have changed since construction
    const testEnvironmentSetup = new TestEnvironmentSetup(
      this.ports,
      this.projectName,
      this.browser,
      this.queue
    );

    // Call the extracted method
    const result = await testEnvironmentSetup.setupTestEnvironment(
      src,
      runtime
    );

    // The extracted method doesn't include testConfig, so we need to add it
    return {
      ...result,
      testConfig,
      testConfigResource: testConfig[2],
    };
  }
}
