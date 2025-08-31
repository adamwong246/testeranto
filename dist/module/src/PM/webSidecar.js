/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-rest-params */
import net from "net";
import { PM_sidecar } from "./sidecar";
const fPaths = [];
export class PM_Web_Sidecar extends PM_sidecar {
    constructor(t) {
        super();
        this.testResourceConfiguration = t;
    }
    start() {
        return new Promise((res) => {
            process.on("message", (message) => {
                if (message.path) {
                    this.client = net.createConnection(message.path, () => {
                        res();
                    });
                }
            });
        });
    }
    stop() {
        throw new Error("stop not implemented.");
    }
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
