import { Ibdd_in, Ibdd_out, Ibdd_in_any } from "../CoreTypes";
import type { Express } from "express";
type I = Ibdd_in<(port: number) => Express, (port: number) => Express, any, any, any, any, any>;
type O = Ibdd_out<{
    TheMothership: [null];
}, {
    ItIsRunning: [];
}, {
    IClaimTheResource: [string];
    IReleaseTheResource: [string];
    IResetTheResource: [string];
}, {
    TheResourceIsClaimed: [string];
    TheResourceIsUnClaimed: [string];
}>;
declare const _default: Promise<import("../lib/core").default<Ibdd_in_any, O, {
    whens: import("../Types").TestWhenImplementation<I, O>;
}>>;
export default _default;
