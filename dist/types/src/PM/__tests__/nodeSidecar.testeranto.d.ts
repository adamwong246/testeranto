import { Ibdd_in_any, Ibdd_out } from "../../CoreTypes";
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
}>;
declare const _default: Promise<import("../../lib/Tiposkripto").default<Ibdd_in_any, O, {
    whens: import("../../Types").TestWhenImplementation<Ibdd_in_any, O>;
}>>;
export default _default;
