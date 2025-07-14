import { Ibdd_out } from "../../CoreTypes";
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
declare const _default: Promise<import("../../lib/core").default<I, O, {
    whens: import("../../Types").TestWhenImplementation<I, O>;
}>>;
export default _default;
