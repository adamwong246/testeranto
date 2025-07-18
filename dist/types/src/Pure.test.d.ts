import { Ibdd_in, Ibdd_out } from "./CoreTypes";
import { IPM } from "./lib/types";
type PureI = Ibdd_in<null, // No initial input needed
IPM, // Test subject is IPM
{
    pm: IPM;
}, // Store contains PM instance
{
    pm: IPM;
}, // Selection is same as store
() => IPM, // Given returns IPM
(store: {
    pm: IPM;
}) => {
    pm: IPM;
}, // When modifies store
(store: {
    pm: IPM;
}) => {
    pm: IPM;
}>;
type PureO = Ibdd_out<{
    Default: [string];
}, {
    Default: [];
}, {
    applyProxy: [string];
    verifyCall: [string, any];
}, {
    verifyProxy: [string];
    verifyNoProxy: [];
}, {
    Default: [];
}>;
declare const _default: Promise<number | import("./lib/core").default<PureI, PureO, {}>>;
export default _default;
