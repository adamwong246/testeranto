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
        this.client = {};
    }
    start(stopper) {
        return new Promise((res) => {
            process.on("message", async (message) => {
                if (message === "stop") {
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
    stop() {
        return new Promise((resolve) => {
            if (this.client) {
                this.client.end(() => resolve());
            }
            else {
                resolve();
            }
        });
    }
    testArtiFactoryfileWriter(tLog, callback) {
        return (fPath, value) => {
            tLog(`Pure runtime skipping file write to ${fPath}`);
            callback(Promise.resolve());
        };
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
