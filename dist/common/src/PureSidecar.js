"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PureSideCar = void 0;
const Sidecar_1 = require("./lib/Sidecar");
class PureSideCar extends Sidecar_1.Sidecar {
    start(t) {
        throw new Error("Method not implemented.");
    }
    stop() {
        throw new Error("Method not implemented.");
    }
}
exports.PureSideCar = PureSideCar;
