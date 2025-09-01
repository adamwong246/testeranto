import { ITTestResourceConfiguration } from "./lib";
import { Sidecar } from "./lib/Sidecar";
import { PM_Web_Sidecar } from "./PM/webSidecar";
export declare class WebSideCar extends Sidecar {
    start(t: ITTestResourceConfiguration): void;
    stop(): void;
    pm: PM_Web_Sidecar;
}
