import fs from "fs";
import ansiColors from "ansi-colors";
import { IRunTime } from "../../../Types";

export class TestEnvironmentSetup {
  constructor(
    private ports: Record<number, string>,
    private projectName: string,
    private browser: any,
    private queue: string[]
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
    const reportDest = `testeranto/reports/${this.projectName}/${src
      .split(".")
      .slice(0, -1)
      .join(".")}/${runtime}`;

    if (!fs.existsSync(reportDest)) {
      fs.mkdirSync(reportDest, { recursive: true });
    }

    // Note: testConfig needs to be provided by the caller
    // For now, we'll return placeholders
    const testConfig = null;
    const testConfigResource = { ports: 0 };

    const portsToUse: string[] = [];
    let testResources = "";

    // Log the browser WebSocket endpoint for debugging
    const browserWsEndpoint = this.browser
      ? this.browser.wsEndpoint()
      : "no-browser";
    console.log(
      `TestEnvironmentSetup: browser WebSocket endpoint for ${src}: ${browserWsEndpoint}`
    );

    if (testConfigResource.ports === 0) {
      testResources = JSON.stringify({
        name: src,
        ports: [],
        fs: reportDest,
        browserWSEndpoint: browserWsEndpoint,
      });
    } else if (testConfigResource.ports > 0) {
      const openPorts = Object.entries(this.ports).filter(
        ([, status]) => status === ""
      );

      if (openPorts.length >= testConfigResource.ports) {
        for (let i = 0; i < testConfigResource.ports; i++) {
          portsToUse.push(openPorts[i][0]);
          this.ports[openPorts[i][0]] = src;
        }

        testResources = JSON.stringify({
          scheduled: true,
          name: src,
          ports: portsToUse,
          fs: reportDest,
          browserWSEndpoint: browserWsEndpoint,
        });
      } else {
        console.log(
          ansiColors.red(
            `${runtime}: cannot run ${src} because there are no open ports ATM. This job will be enqueued and run again when a port is available`
          )
        );
        this.queue.push(src);
        throw new Error("No ports available");
      }
    } else {
      console.error("negative port makes no sense", src);
      process.exit(-1);
    }

    return {
      reportDest,
      testConfig,
      testConfigResource,
      portsToUse,
      testResources,
    };
  }

  cleanupPorts(portsToUse: string[]) {
    portsToUse.forEach((port) => {
      this.ports[port] = "";
    });
  }
}
