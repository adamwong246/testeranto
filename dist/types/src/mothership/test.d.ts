import { Ibdd_out, Ibdd_in } from "../Types";
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
}, {
    AnEmptyState: any;
}>;
declare const _default: Promise<import("../lib/core").default<IT, O, {
    whens: import("../Types").TestWhenImplementation<I, O>;
}>>;
export default _default;
