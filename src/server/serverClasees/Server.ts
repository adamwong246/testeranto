import fs from "fs";
import { default as ansiC } from "ansi-colors";
import path from "path";
import { IMode } from "../types";
import { IBuiltConfig } from "../../Types";
import { ServerTaskCoordinator } from "./ServerTaskCoordinator";
import { TestEnvironmentSetup } from "./utils/TestEnvironmentSetup";

export class Server extends ServerTaskCoordinator {
  testName: string;
  private composeDir: string;

  constructor(configs: IBuiltConfig, testName: string, mode: IMode) {
    super(configs, testName, mode);

    fs.writeFileSync(
      path.join(process.cwd(), "testeranto", `${testName}.json`),
      JSON.stringify(configs, null, 2)
    );

    configs.ports.forEach((port) => {
      this.ports[port] = ""; // set ports as open
    });

    this.launchers = {};

    this.testName = testName;
    this.composeDir = process.cwd();
    this.composeFile = path.join(
      this.composeDir,
      "testeranto",
      "bundles",
      `${this.testName}-docker-compose.yml`
    );

    // Initialize TestEnvironmentSetup
    // Note: ports, browser, and queue will be set later
    // We'll need to update them when they're available
    this.testEnvironmentSetup = new TestEnvironmentSetup(
      this.ports,
      this.projectName,
      this.browser,
      this.queue
    );
  }

  async start() {
    // Wait for build processes to complete first
    try {
    } catch (error) {
      console.error("Build processes failed:", error);
      return;
    }

    // Continue with the rest of the setup after builds are done
    this.mapping().forEach(async ([command, func]) => {
      globalThis[command] = func;
    });

    if (!fs.existsSync(`testeranto/reports/${this.projectName}`)) {
      fs.mkdirSync(`testeranto/reports/${this.projectName}`);
    }
  }

  async stop() {
    console.log(ansiC.inverse("Testeranto-Run is shutting down gracefully..."));
    this.mode = "once";
    super.stop();
  }
}
