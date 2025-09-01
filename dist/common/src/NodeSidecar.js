"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeSidecar = void 0;
const Sidecar_1 = require("./lib/Sidecar");
const nodeSidecar_1 = require("./PM/nodeSidecar");
class NodeSidecar extends Sidecar_1.Sidecar {
    constructor(t) {
        super();
        this.pm = new nodeSidecar_1.PM_Node_Sidecar(t);
        this.pm.start(this.stop).then(() => {
            this.start(JSON.parse(process.argv[2]));
        });
    }
}
exports.NodeSidecar = NodeSidecar;
