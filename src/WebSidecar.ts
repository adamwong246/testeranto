/* eslint-disable @typescript-eslint/no-unused-vars */
import { ITTestResourceConfiguration } from "./lib";
import { Sidecar } from "./lib/Sidecar";
import { PM_Web_Sidecar } from "./clients/webSidecar";

export class WebSideCar extends Sidecar {
  start(t: ITTestResourceConfiguration) {
    throw new Error("Method not implemented.");
  }
  stop() {
    throw new Error("Method not implemented.");
  }
  pm: PM_Web_Sidecar;
}
