import { Sidecar } from "./lib/Sidecar";
export class PureSideCar extends Sidecar {
    start(t) {
        throw new Error("Method not implemented.");
    }
    stop() {
        throw new Error("Method not implemented.");
    }
}
