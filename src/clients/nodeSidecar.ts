/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-rest-params */
import net from "net";

import { ITLog, ITTestResourceConfiguration } from "../lib";

import { PM_sidecar } from "./sidecar";
import { PassThrough } from "stream";

type IFPaths = string[];
const fPaths: IFPaths = [];

export class PM_Node_Sidecar extends PM_sidecar {
  testResourceConfiguration: ITTestResourceConfiguration;
  client: net.Socket;

  constructor(t: ITTestResourceConfiguration) {
    super();
    this.testResourceConfiguration = t;
    this.client = {} as net.Socket;
  }

  start(stopper: () => any): Promise<void> {
    return new Promise((res) => {
      process.on("message", async (message: { path: string } | "stop") => {
        if (message === "stop") {
          await stopper();
          process.exit();
        } else if (message.path) {
          this.client = net.createConnection(message.path, () => {
            res();
          });
        }
      });
    });
  }

  stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.client) {
        this.client.end(() => resolve());
      } else {
        resolve();
      }
    });
  }

  testArtiFactoryfileWriter(tLog: ITLog, callback: (p: Promise<void>) => void) {
    return (fPath: string, value: string | Buffer | PassThrough) => {
      tLog(`Pure runtime skipping file write to ${fPath}`);
      callback(Promise.resolve());
    };
  }

  send<I>(command: string, ...argz): Promise<I> {
    return new Promise<I>((res) => {
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
