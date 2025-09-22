import { Ibdd_in, Ibdd_out } from "./CoreTypes";
import { IPM } from "./lib/types";
type I = Ibdd_in<null, // No initial input needed
IPM, // Test subject is IPM
{
    pm: IPM;
    artifacts?: any[];
    testJobs?: any[];
    specs?: any[];
    largePayload?: boolean;
}, // Store contains PM instance
{
    artifacts: never[];
    specs: never[];
    pm: IPM;
}, // Selection is same as store
() => {
    pm: IPM;
    config: {};
    proxies: any;
}, // Given returns initial state
(store: {
    pm: IPM;
    [key: string]: any;
}) => {
    pm: IPM;
    [key: string]: any;
}, // When modifies store
(store: {
    pm: IPM;
    [key: string]: any;
}) => {
    pm: IPM;
    [key: string]: any;
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
declare const _default: Promise<import("./Pure").PureTesteranto<I, O, {}>>;
export default _default;
