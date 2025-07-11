import { PM_Web_Sidecar } from "../webSidecar";
import { Ibdd_out, Ibdd_in } from "../../Types";
type I = Ibdd_in<PM_Web_Sidecar, PM_Web_Sidecar, unknown, unknown, unknown, unknown, unknown>;
type O = Ibdd_out<{
    SidecarInitialized: [null];
}, {
    SidecarReady: [];
}, {
    SendTestMessage: [string];
    VerifyCleanup: [];
}, {
    MessageReceived: [string];
    ListenersCleaned: [];
}, {
    SidecarState: unknown;
}>;
declare const _default: Promise<import("../../lib/core").default<IT, O, {
    whens: import("../../Types").TestWhenImplementation<I, O>;
}>>;
export default _default;
