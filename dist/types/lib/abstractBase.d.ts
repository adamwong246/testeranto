import { PM } from "../PM/index.js";
import { Ibdd_in, Ibdd_out } from "../Types.js";
import { ITTestResourceConfiguration, ITestArtifactory, ITLog } from ".";
export type IGivens<I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>> = Record<string, BaseGiven<I>>;
export declare abstract class BaseSuite<I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> {
    name: string;
    givens: IGivens<I>;
    checks: BaseCheck<I, O>[];
    store: I["istore"];
    fails: BaseGiven<I>[];
    testResourceConfiguration: ITTestResourceConfiguration;
    index: number;
    constructor(name: string, index: number, givens?: IGivens<I>, checks?: BaseCheck<I, O>[]);
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
            features: string[];
        }[];
        checks: any[];
        fails: BaseGiven<I>[];
        features: string[];
    };
    setup(s: I["iinput"], artifactory: ITestArtifactory, tr: ITTestResourceConfiguration, pm: PM): Promise<I["isubject"]>;
    assertThat(t: I["then"]): unknown;
    afterAll(store: I["istore"], artifactory: ITestArtifactory, pm: PM): I["istore"];
    run(input: I["iinput"], testResourceConfiguration: ITTestResourceConfiguration, artifactory: (fPath: string, value: unknown) => void, tLog: (...string: any[]) => void, pm: PM): Promise<BaseSuite<I, O>>;
}
export declare abstract class BaseGiven<I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>> {
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
    constructor(name: string, features: string[], whens: BaseWhen<I>[], thens: BaseThen<I>[], givenCB: I["given"], initialValues: any);
    beforeAll(store: I["istore"], initializer: any, artifactory: any, testResource: any, initialValues: any, pm: any): I["istore"];
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
        features: string[];
    };
    abstract givenThat(subject: I["isubject"], testResourceConfiguration: any, artifactory: ITestArtifactory, givenCB: I["given"], initialValues: any, pm: PM): Promise<I["istore"]>;
    afterEach(store: I["istore"], key: string, artifactory: ITestArtifactory, pm: PM): Promise<unknown>;
    abstract uberCatcher(e: any): any;
    give(subject: I["isubject"], key: string, testResourceConfiguration: ITTestResourceConfiguration, tester: (t: Awaited<I["then"]> | undefined) => boolean, artifactory: ITestArtifactory, tLog: ITLog, pm: PM, suiteNdx: number): Promise<I["istore"]>;
}
export declare abstract class BaseWhen<I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>> {
    name: string;
    whenCB: (x: I["iselection"]) => I["then"];
    error: boolean;
    constructor(name: string, whenCB: (xyz: I["iselection"]) => I["then"]);
    abstract andWhen(store: I["istore"], whenCB: (x: I["iselection"]) => I["then"], testResource: any, pm: PM): Promise<any>;
    toObj(): {
        name: string;
        error: boolean;
    };
    test(store: I["istore"], testResourceConfiguration: any, tLog: ITLog, pm: PM, filepath: string): Promise<any>;
}
export declare abstract class BaseThen<I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>> {
    name: string;
    thenCB: (storeState: I["iselection"], tLog: any) => I["then"];
    go: (storeState: I["iselection"]) => I["then"];
    error: boolean;
    constructor(name: string, thenCB: (val: I["iselection"]) => I["then"]);
    toObj(): {
        name: string;
        error: boolean;
    };
    abstract butThen(store: I["istore"], thenCB: (s: I["iselection"], tLog: any) => I["isubject"], testResourceConfiguration: ITTestResourceConfiguration, pm: PM): Promise<I["iselection"]>;
    test(store: I["istore"], testResourceConfiguration: any, tLog: ITLog, pm: PM, filepath: string): Promise<I["then"] | undefined>;
    check(): void;
}
export declare abstract class BaseCheck<I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> {
    key: string;
    name: string;
    features: string[];
    checkCB: (store: I["istore"], pm: PM) => any;
    initialValues: any;
    store: I["istore"];
    checker: any;
    constructor(name: string, features: string[], checker: (store: I["istore"], pm: PM) => any, x: any, checkCB: any);
    abstract checkThat(subject: I["isubject"], testResourceConfiguration: any, artifactory: ITestArtifactory, initializer: any, initialValues: any, pm: PM): Promise<I["istore"]>;
    toObj(): {
        key: string;
        name: string;
        functionAsString: string;
        features: string[];
    };
    afterEach(store: I["istore"], key: string, artifactory: ITestArtifactory, pm: PM): Promise<unknown>;
    beforeAll(store: I["istore"], initializer: any, artifactory: any, testResource: any, initialValues: any, pm: any): I["istore"];
    check(subject: I["isubject"], key: string, testResourceConfiguration: any, tester: any, artifactory: ITestArtifactory, tLog: ITLog, pm: PM): Promise<void>;
}
