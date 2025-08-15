import { Ibdd_in, Ibdd_out } from "./CoreTypes";
import { IPM } from "./lib/types";
type I = Ibdd_in<null, // No initial input needed
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
type O = Ibdd_out<{
    Default: [string];
}, {
    Default: [];
}, {
    applyProxy: [string];
    verifyCall: [string, any];
    addArtifact: [Promise<string>];
    setTestJobs: [any[]];
    modifySpecs: [(specs: any) => any[]];
}, {
    verifyProxy: [string];
    verifyNoProxy: [];
    verifyResourceConfig: [];
    verifyError: [string];
    verifyLargePayload: [];
    verifyTypeSafety: [];
    initializedProperly: [];
    specsGenerated: [];
    jobsCreated: [];
    artifactsTracked: [];
    testRunSuccessful: [];
    specsModified: [number];
}>;
declare const _default: Promise<number | import("./lib/core").default<I, O, {}>>;
export default _default;
