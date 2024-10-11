import { ITTestResourceConfiguration, ITestArtifactory, ITLog, ITestJob, ILogWriter, ITestCheckCallback, ITTestResourceRequest } from "./lib.js";
import { IBaseTest, ITestImplementation } from "./Types";
export declare type IGivens<ITestShape extends IBaseTest> = Record<string, BaseGiven<ITestShape>>;
export declare abstract class BaseSuite<ITestShape extends IBaseTest> {
    name: string;
    givens: IGivens<ITestShape>;
    checks: BaseCheck<ITestShape>[];
    store: ITestShape['istore'];
    fails: BaseGiven<ITestShape>[];
    testResourceConfiguration: ITTestResourceConfiguration;
    index: number;
    constructor(name: string, index: number, givens?: IGivens<ITestShape>, checks?: BaseCheck<ITestShape>[]);
    toObj(): {
        name: string;
        givens: {
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
    };
    setup(s: ITestShape['iinput'], artifactory: ITestArtifactory): Promise<ITestShape['isubject']>;
    assertThat(t: ITestShape['then']): unknown;
    run(input: ITestShape['iinput'], testResourceConfiguration: ITTestResourceConfiguration, artifactory: (fPath: string, value: unknown) => void, tLog: (...string: any[]) => void): Promise<BaseSuite<ITestShape>>;
}
export declare abstract class BaseGiven<ITestShape extends IBaseTest> {
    name: string;
    features: string[];
    whens: BaseWhen<ITestShape>[];
    thens: BaseThen<ITestShape>[];
    error: Error;
    store: ITestShape['istore'];
    recommendedFsPath: string;
    givenCB: ITestShape['given'];
    initialValues: any;
    constructor(name: string, features: string[], whens: BaseWhen<ITestShape>[], thens: BaseThen<ITestShape>[], givenCB: ITestShape['given'], initialValues: any);
    beforeAll(store: ITestShape['istore'], artifactory: ITestArtifactory): ITestShape["istore"];
    afterAll(store: ITestShape['istore'], artifactory: ITestArtifactory): ITestShape["istore"];
    toObj(): {
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
    abstract givenThat(subject: ITestShape['isubject'], testResourceConfiguration: any, artifactory: ITestArtifactory, givenCB: ITestShape['given']): Promise<ITestShape['istore']>;
    afterEach(store: ITestShape['istore'], key: string, artifactory: ITestArtifactory): Promise<unknown>;
    give(subject: ITestShape['isubject'], key: string, testResourceConfiguration: any, tester: any, artifactory: ITestArtifactory, tLog: ITLog): Promise<ITestShape["istore"]>;
}
export declare abstract class BaseWhen<ITestShape extends IBaseTest> {
    name: string;
    whenCB: (x: ITestShape['iselection']) => ITestShape['then'];
    error: boolean;
    constructor(name: string, whenCB: (xyz: ITestShape['iselection']) => ITestShape['then']);
    abstract andWhen(store: ITestShape['istore'], whenCB: (x: ITestShape['iselection']) => ITestShape['then'], testResource: any): any;
    toObj(): {
        name: string;
        error: boolean;
    };
    test(store: ITestShape['istore'], testResourceConfiguration: any, tLog: ITLog): Promise<any>;
}
export declare abstract class BaseThen<ITestShape extends IBaseTest> {
    name: string;
    thenCB: (storeState: ITestShape['iselection']) => ITestShape['then'];
    error: boolean;
    constructor(name: string, thenCB: (val: ITestShape['iselection']) => ITestShape['then']);
    toObj(): {
        name: string;
        error: boolean;
    };
    abstract butThen(store: ITestShape['istore'], thenCB: any, testResourceConfiguration?: any): Promise<ITestShape['iselection']>;
    test(store: ITestShape['istore'], testResourceConfiguration: any, tLog: ITLog): Promise<ITestShape['then'] | undefined>;
}
export declare abstract class BaseCheck<ITestShape extends IBaseTest> {
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
    abstract checkThat(subject: ITestShape['isubject'], testResourceConfiguration: any, artifactory: ITestArtifactory): Promise<ITestShape['istore']>;
    afterEach(store: ITestShape['istore'], key: string, cb?: any): Promise<unknown>;
    check(subject: ITestShape['isubject'], key: string, testResourceConfiguration: any, tester: any, artifactory: ITestArtifactory, tLog: ITLog): Promise<void>;
}
export declare abstract class BaseBuilder<ITestShape extends IBaseTest, SuiteExtensions, GivenExtensions, WhenExtensions, ThenExtensions, CheckExtensions> {
    readonly input: ITestShape['iinput'];
    testResourceRequirement: ITTestResourceRequest;
    artifacts: Promise<unknown>[];
    testJobs: ITestJob[];
    suitesOverrides: Record<keyof SuiteExtensions, (name: string, index: number, givens: IGivens<ITestShape>, checks: BaseCheck<ITestShape>[]) => BaseSuite<ITestShape>>;
    givenOverides: Record<keyof GivenExtensions, (name: string, features: string[], whens: BaseWhen<ITestShape>[], thens: BaseThen<ITestShape>[], gcb: any) => BaseGiven<ITestShape>>;
    whenOverides: Record<keyof WhenExtensions, (any: any) => BaseWhen<ITestShape>>;
    thenOverides: Record<keyof ThenExtensions, (selection: ITestShape['iselection'], expectation: any) => BaseThen<ITestShape>>;
    checkOverides: Record<keyof CheckExtensions, (feature: string, callback: (whens: any, thens: any) => any, ...xtraArgs: any[]) => BaseCheck<ITestShape>>;
    constructor(input: ITestShape['iinput'], suitesOverrides: Record<keyof SuiteExtensions, (name: string, index: number, givens: IGivens<ITestShape>, checks: BaseCheck<ITestShape>[]) => BaseSuite<ITestShape>>, givenOverides: Record<keyof GivenExtensions, (name: string, features: string[], whens: BaseWhen<ITestShape>[], thens: BaseThen<ITestShape>[], gcb: any) => BaseGiven<ITestShape>>, whenOverides: Record<keyof WhenExtensions, (c: any) => BaseWhen<ITestShape>>, thenOverides: Record<keyof ThenExtensions, (selection: ITestShape['iselection'], expectation: any) => BaseThen<ITestShape>>, checkOverides: Record<keyof CheckExtensions, (feature: string, callback: (whens: any, thens: any) => any, ...xtraArgs: any[]) => BaseCheck<ITestShape>>, logWriter: any, testResourceRequirement: any, testSpecification: any);
    Suites(): Record<keyof SuiteExtensions, (name: string, index: number, givens: IGivens<ITestShape>, checks: BaseCheck<ITestShape>[]) => BaseSuite<ITestShape>>;
    Given(): Record<keyof GivenExtensions, (name: string, features: string[], whens: BaseWhen<ITestShape>[], thens: BaseThen<ITestShape>[], gcb: any) => BaseGiven<ITestShape>>;
    When(): Record<keyof WhenExtensions, (arg0: ITestShape['istore'], ...arg1: any) => BaseWhen<ITestShape>>;
    Then(): Record<keyof ThenExtensions, (selection: ITestShape['iselection'], expectation: any) => BaseThen<ITestShape>>;
    Check(): Record<keyof CheckExtensions, (feature: string, callback: (whens: any, thens: any) => any, whens: any, thens: any) => BaseCheck<ITestShape>>;
}
export declare abstract class ClassBuilder<ITestShape extends IBaseTest> extends BaseBuilder<ITestShape, any, any, any, any, any> {
    constructor(testImplementation: ITestImplementation<ITestShape, any>, testSpecification: (Suite: {
        [K in keyof ITestShape["suites"]]: (feature: string, givens: IGivens<ITestShape>, checks: BaseCheck<ITestShape>[]) => BaseSuite<ITestShape>;
    }, Given: {
        [K in keyof ITestShape["givens"]]: (features: string[], whens: BaseWhen<ITestShape>[], thens: BaseThen<ITestShape>[], ...a: ITestShape["givens"][K]) => BaseGiven<ITestShape>;
    }, When: {
        [K in keyof ITestShape["whens"]]: (...a: ITestShape["whens"][K]) => BaseWhen<ITestShape>;
    }, Then: {
        [K in keyof ITestShape["thens"]]: (...a: ITestShape["thens"][K]) => BaseThen<ITestShape>;
    }, Check: ITestCheckCallback<ITestShape>, logWriter: ILogWriter) => BaseSuite<ITestShape>[], input: ITestShape['iinput'], suiteKlasser: (name: string, index: number, givens: IGivens<ITestShape>, checks: BaseCheck<ITestShape>[]) => BaseSuite<ITestShape>, givenKlasser: (name: any, features: any, whens: any, thens: any, givenCB: any) => BaseGiven<ITestShape>, whenKlasser: (s: any, o: any) => BaseWhen<ITestShape>, thenKlasser: (s: any, o: any) => BaseThen<ITestShape>, checkKlasser: (n: any, f: any, cb: any, w: any, t: any) => BaseCheck<ITestShape>, testResourceRequirement: any, logWriter: ILogWriter);
}
