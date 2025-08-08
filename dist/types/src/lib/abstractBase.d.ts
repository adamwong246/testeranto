import type { Ibdd_in_any } from "../CoreTypes";
import { ITestArtifactory, ITLog, ITTestResourceConfiguration } from ".";
import { IPM } from "./types.js";
export type IGivens<I extends Ibdd_in_any> = Record<string, BaseGiven<I>>;
export declare abstract class BaseGiven<I extends Ibdd_in_any> {
    name: string;
    features: string[];
    whens: BaseWhen<I>[];
    thens: BaseThen<I>[];
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
    constructor(name: string, features: string[], whens: BaseWhen<I>[], thens: BaseThen<I>[], givenCB: I["given"], initialValues: any);
    beforeAll(store: I["istore"]): I["istore"];
    toObj(): {
        key: string;
        name: string;
        whens: {}[];
        thens: {
            name: string;
            error: boolean;
            artifacts: string[];
        }[];
        error: (string | Error | undefined)[] | null;
        failed: boolean;
        features: string[];
        artifacts: string[];
    };
    abstract givenThat(subject: I["isubject"], testResourceConfiguration: any, artifactory: ITestArtifactory, givenCB: I["given"], initialValues: any, pm: IPM): Promise<I["istore"]>;
    afterEach(store: I["istore"], key: string, artifactory: ITestArtifactory, pm: IPM): Promise<unknown>;
    abstract uberCatcher(e: any): any;
    give(subject: I["isubject"], key: string, testResourceConfiguration: ITTestResourceConfiguration, tester: (t: Awaited<I["then"]> | undefined) => boolean, artifactory: ITestArtifactory, tLog: ITLog, pm: IPM, suiteNdx: number): Promise<I["istore"]>;
}
export declare abstract class BaseWhen<I extends Ibdd_in_any> {
    name: string;
    whenCB: (x: I["iselection"]) => I["then"];
    error: Error;
    artifacts: string[];
    addArtifact(path: string): void;
    constructor(name: string, whenCB: (xyz: I["iselection"]) => I["then"]);
    abstract andWhen(store: I["istore"], whenCB: (x: I["iselection"]) => I["then"], testResource: any, pm: IPM): Promise<any>;
    toObj(): {
        name: string;
        error: string | null;
        artifacts: string[];
    };
    test(store: I["istore"], testResourceConfiguration: any, tLog: ITLog, pm: IPM, filepath: string): Promise<any>;
}
export declare abstract class BaseThen<I extends Ibdd_in_any> {
    name: string;
    thenCB: (storeState: I["iselection"], pm: IPM) => Promise<I["then"]>;
    error: boolean;
    artifacts: string[];
    constructor(name: string, thenCB: (val: I["iselection"]) => Promise<I["then"]>);
    addArtifact(path: string): void;
    toObj(): {
        name: string;
        error: boolean;
        artifacts: string[];
    };
    abstract butThen(store: I["istore"], thenCB: (s: I["iselection"]) => Promise<I["isubject"]>, testResourceConfiguration: ITTestResourceConfiguration, pm: IPM, ...args: any[]): Promise<I["iselection"]>;
    test(store: I["istore"], testResourceConfiguration: any, tLog: ITLog, pm: IPM, filepath: string): Promise<I["then"] | undefined>;
}
