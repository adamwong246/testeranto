import type { Ibdd_in_any } from "../CoreTypes";
import { ITestArtifactory, ITLog, ITTestResourceConfiguration } from ".";
import { IPM } from "./types.js";
/**
 * Represents a collection of Given conditions keyed by their names.
 * Givens are typically organized as named collections because:
 * - They set up different initial states for tests
 * - Tests often need to reference specific Given conditions by name
 * - This allows for better organization and reuse of setup logic
 * - The BDD pattern often involves multiple named Given scenarios
 */
export type IGivens<I extends Ibdd_in_any> = Record<string, BaseGiven<I>>;
export declare abstract class BaseGiven<I extends Ibdd_in_any> {
    name: string;
    features: string[];
    whens: any[];
    thens: any[];
    error: Error;
    fail: any;
    store: I["istore"];
    recommendedFsPath: string;
    givenCB: I["given"];
    initialValues: any;
    key: string;
    failed: boolean;
    artifacts: string[];
    addArtifact(path: string): void;
    constructor(name: string, features: string[], whens: any[], thens: any[], givenCB: I["given"], initialValues: any);
    beforeAll(store: I["istore"]): I["istore"];
    toObj(): {
        key: string;
        name: string;
        whens: any[];
        thens: any[];
        error: (string | Error | undefined)[] | null;
        failed: boolean;
        features: string[];
        artifacts: string[];
    };
    abstract givenThat(subject: I["isubject"], testResourceConfiguration: any, artifactory: ITestArtifactory, givenCB: I["given"], initialValues: any, pm: IPM): Promise<I["istore"]>;
    afterEach(store: I["istore"], key: string, artifactory: ITestArtifactory, pm: IPM): Promise<I["istore"]>;
    abstract uberCatcher(e: any): any;
    give(subject: I["isubject"], key: string, testResourceConfiguration: ITTestResourceConfiguration, tester: (t: Awaited<I["then"]> | undefined) => boolean, artifactory: ITestArtifactory, tLog: ITLog, pm: IPM, suiteNdx: number): Promise<I["istore"]>;
}
