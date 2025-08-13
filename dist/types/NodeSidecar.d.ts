import { Sidecar } from "./lib/Sidecar";
import { PM_Node_Sidecar } from "./PM/nodeSidecar";
export declare abstract class NodeSidecar extends Sidecar {
    pm: PM_Node_Sidecar;
    constructor(t: any);
}
