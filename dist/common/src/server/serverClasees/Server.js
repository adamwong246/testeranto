"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const fs_1 = __importDefault(require("fs"));
const readline_1 = __importDefault(require("readline"));
const Server_Docker_1 = require("./Server_Docker");
readline_1.default.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);
class Server extends Server_Docker_1.Server_Docker {
    constructor(configs, mode) {
        super(configs, mode);
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
    async start() {
        console.log(`[Server] start()`);
        const runtimesDir = `testeranto/runtimes/`;
        fs_1.default.mkdirSync(runtimesDir, { recursive: true });
        await super.start();
    }
    async stop() {
        console.log(`[Server] stop()`);
        await super.stop();
    }
}
exports.Server = Server;
