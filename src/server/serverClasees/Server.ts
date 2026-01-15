import readline from "readline";
import { IMode } from "../types";
import { IBuiltConfig } from "../../Types";
import { Server_BuildListener } from "./Server_BuildListener";

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

export class Server extends Server_BuildListener {
  constructor(configs: IBuiltConfig, testName: string, mode: IMode) {
    super(configs, testName, mode);
    console.log(("[Server] Press 'q' to initiate a graceful shutdown."));
    console.log(("[Server] Press 'CTRL + c' to quit forcefully."));

    process.stdin.on("keypress", async (str, key) => {
      if (key.name === "q") {
        console.log("Testeranto is shutting down gracefully...");

        await this.stop();

        process.exit(0);
      }
      // Handle Ctrl+C through keypress when in raw mode
      if (key.ctrl && key.name === "c") {
        console.log("\nForce quitting...");
        process.exit(1);
      }
    });

    process.on("SIGINT", async () => {
      console.log("\nForce quitting...");
      process.exit(1);
    });
  }

  async start(): Promise<void> {
    console.log(`[Server] start()`)
    await super.start();
  }

  async stop(): Promise<void> {
    console.log(`[Server] stop()`)
    await super.stop();
  }
}
