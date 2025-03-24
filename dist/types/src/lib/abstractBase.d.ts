import { IBaseTest } from "../Types";
import { PM } from "../PM/index.js";
import { ITTestResourceConfiguration, ITestArtifactory, ITLog } from ".";
export declare type IGivens<ITestShape extends IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> = Record<string, BaseGiven<ITestShape>>;
export declare abstract class BaseSuite<ITestShape extends IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> {
    name: string;
    givens: IGivens<ITestShape>;
    checks: BaseCheck<ITestShape>[];
    store: ITestShape["istore"];
    fails: BaseGiven<ITestShape>[];
    testResourceConfiguration: ITTestResourceConfiguration;
    index: number;
    constructor(name: string, index: number, givens?: IGivens<ITestShape>, checks?: BaseCheck<ITestShape>[]);
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
        fails: BaseGiven<ITestShape>[];
        features: string[];
    };
    setup(s: ITestShape["iinput"], artifactory: ITestArtifactory, tr: ITTestResourceConfiguration, pm: PM): Promise<ITestShape["isubject"]>;
    assertThat(t: ITestShape["then"]): unknown;
    afterAll(store: ITestShape["istore"], artifactory: ITestArtifactory, pm: PM): ITestShape["istore"];
    run(input: ITestShape["iinput"], testResourceConfiguration: ITTestResourceConfiguration, artifactory: (fPath: string, value: unknown) => void, tLog: (...string: any[]) => void, pm: PM): Promise<BaseSuite<ITestShape>>;
}
export declare abstract class BaseGiven<ITestShape extends IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> {
    name: string;
    features: string[];
    whens: BaseWhen<ITestShape>[];
    thens: BaseThen<ITestShape>[];
    error: Error;
    fail: any;
    store: ITestShape["istore"];
    recommendedFsPath: string;
    givenCB: ITestShape["given"];
    initialValues: any;
    key: string;
    constructor(name: string, features: string[], whens: BaseWhen<ITestShape>[], thens: BaseThen<ITestShape>[], givenCB: ITestShape["given"], initialValues: any);
    beforeAll(store: ITestShape["istore"], artifactory: ITestArtifactory): ITestShape["istore"];
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
    abstract givenThat(subject: ITestShape["isubject"], testResourceConfiguration: any, artifactory: ITestArtifactory, givenCB: ITestShape["given"], initialValues: any, pm: PM): Promise<ITestShape["istore"]>;
    afterEach(store: ITestShape["istore"], key: string, artifactory: ITestArtifactory, pm: PM): Promise<unknown>;
    abstract uberCatcher(e: any): any;
    give(subject: ITestShape["isubject"], key: string, testResourceConfiguration: ITTestResourceConfiguration, tester: (t: Awaited<ITestShape["then"]> | undefined) => boolean, artifactory: ITestArtifactory, tLog: ITLog, pm: PM, suiteNdx: number): Promise<ITestShape["istore"]>;
}
export declare abstract class BaseWhen<ITestShape extends IBaseTest> {
    name: string;
    whenCB: (x: ITestShape["iselection"]) => ITestShape["then"];
    error: boolean;
    constructor(name: string, whenCB: (xyz: ITestShape["iselection"]) => ITestShape["then"]);
    abstract andWhen(store: ITestShape["istore"], whenCB: (x: ITestShape["iselection"]) => ITestShape["then"], testResource: any, pm: PM): Promise<any>;
    toObj(): {
        name: string;
        error: boolean;
    };
    test(store: ITestShape["istore"], testResourceConfiguration: any, tLog: ITLog, pm: PM, filepath: string): Promise<any>;
}
export declare abstract class BaseThen<ITestShape extends IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> {
    name: string;
    thenCB: (storeState: ITestShape["iselection"]) => ITestShape["then"];
    error: boolean;
    constructor(name: string, thenCB: (val: ITestShape["iselection"]) => ITestShape["then"]);
    toObj(): {
        name: string;
        error: boolean;
    };
    abstract butThen(store: ITestShape["istore"], thenCB: any, testResourceConfiguration: ITTestResourceConfiguration, pm: PM): Promise<ITestShape["iselection"]>;
    test(store: ITestShape["istore"], testResourceConfiguration: any, tLog: ITLog, pm: PM, filepath: string): Promise<ITestShape["then"] | undefined>;
}
export declare abstract class BaseCheck<ITestShape extends IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> {
    name: string;
    features: string[];
    checkCB: (whens: any, thens: any) => any;
    whens: {
        [K in keyof ITestShape["whens"]]: (p: any, tc: any) => BaseWhen<ITestShape>;
    };
    thens: {
        [K in keyof ITestShape["thens"]]: (p: any, tc: any) => BaseThen<ITestShape>;
    };
    constructor(name: string, features: string[], checkCB: (whens: any, thens: any) => any, whens: any, thens: any);
    abstract checkThat(subject: ITestShape["isubject"], testResourceConfiguration: any, artifactory: ITestArtifactory): Promise<ITestShape["istore"]>;
    afterEach(store: ITestShape["istore"], key: string, cb: any, pm: PM): Promise<unknown>;
    check(subject: ITestShape["isubject"], key: string, testResourceConfiguration: any, tester: any, artifactory: ITestArtifactory, tLog: ITLog, pm: PM): Promise<void>;
}
