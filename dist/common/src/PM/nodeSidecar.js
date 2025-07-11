"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PM_Node_Sidecar = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-rest-params */
const net_1 = __importDefault(require("net"));
const sidecar_1 = require("./sidecar");
const fPaths = [];
class PM_Node_Sidecar extends sidecar_1.PM_sidecar {
    constructor(t) {
        super();
        this.testResourceConfiguration = t;
        this.client = {};
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
                    this.client = net_1.default.createConnection(message.path, () => {
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
exports.PM_Node_Sidecar = PM_Node_Sidecar;
