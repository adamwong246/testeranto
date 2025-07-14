/* eslint-disable @typescript-eslint/no-unused-vars */
import { ITTestResourceConfiguration } from "./lib";
import { Sidecar } from "./lib/Sidecar";
import { PM_Pure_Sidecar } from "./PM/pureSidecar";

export class PureSideCar extends Sidecar {
  pm: PM_Pure_Sidecar;

  start(t: ITTestResourceConfiguration) {
    throw new Error("Method not implemented.");
  }
  stop() {
    throw new Error("Method not implemented.");
  }
}
