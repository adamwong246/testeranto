"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSideCar = void 0;
const Sidecar_1 = require("./lib/Sidecar");
// import { PM_Node_Sidecar } from "./PM/nodeSidecar";
class WebSideCar extends Sidecar_1.Sidecar {
    start(t) {
        throw new Error("Method not implemented.");
    }
    stop() {
        throw new Error("Method not implemented.");
    }
}
exports.WebSideCar = WebSideCar;
