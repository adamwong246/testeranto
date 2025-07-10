/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-rest-params */
import net from "net";
import { PM_sidecar } from "./sidecar";
const fPaths = [];
export class PM_Node_Sidecar extends PM_sidecar {
    constructor(t) {
        super();
        this.testResourceConfiguration = t;
    }
    start(stopper) {
        return new Promise((res) => {
            process.on("message", async (message) => {
                if (message === "stop") {
                    console.log("STOP!", stopper.toString());
                    await stopper();
                    process.exit();
                }
                else if (message.path) {
                    this.client = net.createConnection(message.path, () => {
                        res();
                    });
                }
            });
        });
    }
    // stop(): Promise<void> {
    //   throw new Error("Method not implemented.");
    // }
    send(command, ...argz) {
        return new Promise((res) => {
            const key = Math.random().toString();
            const myListener = (event) => {
                const x = JSON.parse(event);
                if (x.key === key) {
                    process.removeListener("message", myListener);
                    res(x.payload);
                }
            };
            process.addListener("message", myListener);
            this.client.write(JSON.stringify([command, ...argz, key]));
        });
    }
}
