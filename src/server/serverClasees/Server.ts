import readline from "readline";
import { default as ansiC } from "ansi-colors";
import { IMode } from "../types";
import { IBuiltConfig } from "../../Types";
import { Server_FS } from "./Server_FS";

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

export class Server extends Server_FS {
  constructor(configs: IBuiltConfig, testName: string, mode: IMode) {
    super(configs, testName, mode);

    console.log(ansiC.inverse("Press 'q' to initiate a graceful shutdown."));
    console.log(ansiC.inverse("Press 'CTRL + c' to quit forcefully."));
    console.log(
      ansiC.inverse("Note: In raw mode, use 'CTRL + c' to force quit.")
    );

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
}
