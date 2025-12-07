import { Sidecar } from "./lib/Sidecar";
import { PM_Node_Sidecar } from "./clients/nodeSidecar";

export abstract class NodeSidecar extends Sidecar {
  pm: PM_Node_Sidecar;

  constructor(t) {
    super();
    this.pm = new PM_Node_Sidecar(t);
    this.pm.start(this.stop).then(() => {
      this.start(JSON.parse(process.argv[2]));
    });
  }
}
