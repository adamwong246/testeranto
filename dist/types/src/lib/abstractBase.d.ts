import { IT, OT } from "../Types.js";
import { ITTestResourceConfiguration, ITestArtifactory, ITLog } from ".";
import { IPM } from "./types.js";
export type IGivens<I extends IT> = Record<string, BaseGiven<I>>;
export declare abstract class BaseSuite<I extends IT = IT, O extends OT = OT> {
    name: string;
    givens: IGivens<I>;
    checks: BaseCheck<I>[];
    store: I["istore"];
    testResourceConfiguration: ITTestResourceConfiguration;
    index: number;
    failed: boolean;
    fails: number;
    constructor(name: string, index: number, givens?: IGivens<I>, checks?: BaseCheck<I>[]);
    features(): string[];
    toObj(): {
        name: string;
        givens: {
            key: string;
            name: string;
            whens: {
                name: string;
                error: boolean;
            }[];
            thens: {
                name: string;
                error: boolean;
            }[];
            error: (string | Error | undefined)[] | null;
            failed: boolean;
            features: string[];
        }[];
        checks: any[];
        fails: number;
        failed: boolean;
        features: string[];
    };
    setup(s: I["iinput"], artifactory: ITestArtifactory, tr: ITTestResourceConfiguration, pm: IPM): Promise<I["isubject"]>;
    assertThat(t: Awaited<I["then"]> | undefined): boolean;
    afterAll(store: I["istore"], artifactory: ITestArtifactory, pm: IPM): I["istore"];
    run(input: I["iinput"], testResourceConfiguration: ITTestResourceConfiguration, artifactory: (fPath: string, value: unknown) => void, tLog: (...string: any[]) => void, pm: IPM): Promise<BaseSuite<I, O>>;
}
export declare abstract class BaseGiven<I extends IT = IT> {
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
    constructor(name: string, features: string[], whens: BaseWhen<I>[], thens: BaseThen<I>[], givenCB: I["given"], initialValues: any);
    beforeAll(store: I["istore"]): I["istore"];
    toObj(): {
        key: string;
        name: string;
        whens: {
            name: string;
            error: boolean;
        }[];
        thens: {
            name: string;
            error: boolean;
        }[];
        error: (string | Error | undefined)[] | null;
        failed: boolean;
        features: string[];
    };
    abstract givenThat(subject: I["isubject"], testResourceConfiguration: any, artifactory: ITestArtifactory, givenCB: I["given"], initialValues: any, pm: IPM): Promise<I["istore"]>;
    afterEach(store: I["istore"], key: string, artifactory: ITestArtifactory, pm: IPM): Promise<unknown>;
    abstract uberCatcher(e: any): any;
    give(subject: I["isubject"], key: string, testResourceConfiguration: ITTestResourceConfiguration, tester: (t: Awaited<I["then"]> | undefined) => boolean, artifactory: ITestArtifactory, tLog: ITLog, pm: IPM, suiteNdx: number): Promise<boolean | I["istore"]>;
}
export declare abstract class BaseWhen<I extends IT> {
    name: string;
    whenCB: (x: I["iselection"]) => I["then"];
    error: boolean;
    constructor(name: string, whenCB: (xyz: I["iselection"]) => I["then"]);
    abstract andWhen(store: I["istore"], whenCB: (x: I["iselection"]) => I["then"], testResource: any, pm: IPM): Promise<any>;
    toObj(): {
        name: string;
        error: boolean;
    };
    test(store: I["istore"], testResourceConfiguration: any, tLog: ITLog, pm: IPM, filepath: string): Promise<any>;
}
export declare abstract class BaseThen<I extends IT> {
    name: string;
    thenCB: (storeState: I["iselection"]) => Promise<I["then"]>;
    error: boolean;
    constructor(name: string, thenCB: (val: I["iselection"]) => I["then"]);
    toObj(): {
        name: string;
        error: boolean;
    };
    abstract butThen(store: I["istore"], thenCB: (s: I["iselection"]) => I["isubject"], testResourceConfiguration: ITTestResourceConfiguration, pm: IPM, ...args: any[]): Promise<I["iselection"]>;
    test(store: I["istore"], testResourceConfiguration: any, tLog: ITLog, pm: IPM, filepath: string): Promise<I["then"] | undefined>;
    check(): void;
}
export declare abstract class BaseCheck<I extends IT = IT> {
    key: string;
    name: string;
    features: string[];
    checkCB: (store: I["istore"], pm: IPM) => any;
    initialValues: any;
    store: I["istore"];
    checker: any;
    constructor(name: string, features: string[], checker: (store: I["istore"], pm: IPM) => any, x: any, checkCB: any);
    abstract checkThat(subject: I["isubject"], testResourceConfiguration: any, artifactory: ITestArtifactory, initializer: any, initialValues: any, pm: IPM): Promise<I["istore"]>;
    toObj(): {
        key: string;
        name: string;
        features: string[];
    };
    afterEach(store: I["istore"], key: string, artifactory: ITestArtifactory, pm: IPM): Promise<unknown>;
    beforeAll(store: I["istore"]): I["istore"];
    check(subject: I["isubject"], key: string, testResourceConfiguration: any, tester: any, artifactory: ITestArtifactory, tLog: ITLog, pm: IPM): Promise<void>;
}
