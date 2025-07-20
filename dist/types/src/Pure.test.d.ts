import { Ibdd_in } from "./CoreTypes";
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
declare const _default: Promise<number | import("./lib/core").default<PureI, any, {}>>;
export default _default;
