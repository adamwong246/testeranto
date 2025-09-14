import { ITTestResourceConfiguration } from "./lib";
import { Sidecar } from "./lib/Sidecar";
import { PM_Pure_Sidecar } from "./PM/pureSidecar";
export declare class PureSideCar extends Sidecar {
    pm: PM_Pure_Sidecar;
    start(t: ITTestResourceConfiguration): void;
    stop(): void;
}
