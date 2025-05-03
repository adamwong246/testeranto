import { ITTestResourceConfiguration } from "./lib";
import { Sidecar } from "./lib/Sidecar";
import { PM_Web_Sidecar } from "./PM/webSidecar";
// import { PM_Node_Sidecar } from "./PM/nodeSidecar";

export class WebSideCar extends Sidecar {
  start(t: ITTestResourceConfiguration) {
    throw new Error("Method not implemented.");
  }
  stop() {
    throw new Error("Method not implemented.");
  }
  pm: PM_Web_Sidecar;
}
