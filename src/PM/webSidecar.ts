/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-rest-params */
import net from "net";

import { ITTestResourceConfiguration } from "../lib";

import { PM_sidecar } from "./sidecar";

type IFPaths = string[];
const fPaths: IFPaths = [];

export class PM_Web_Sidecar extends PM_sidecar {
  testResourceConfiguration: ITTestResourceConfiguration;
  client: net.Socket;

  constructor(t: ITTestResourceConfiguration) {
    super();
    this.testResourceConfiguration = t;
  }

  start(): Promise<void> {
    return new Promise((res) => {
      process.on("message", (message: { path?: string }) => {
        if (message.path) {
          this.client = net.createConnection(message.path, () => {
            res();
          });
        }
      });
    });
  }

  stop(): Promise<void> {
    throw new Error("stop not implemented.");
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
