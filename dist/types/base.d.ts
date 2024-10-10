import { ITTestShape, ITTestResourceConfiguration, ITestArtifactory, ITLog, ITestJob, ILogWriter, ITestCheckCallback, ITTestResourceRequest } from "./lib.js";
import { ITestImplementation } from "./Types";
export declare type IGivens<ISubject, IStore, ISelection, IThenShape, IGivenShape> = Record<string, BaseGiven<ISubject, IStore, ISelection, IThenShape, IGivenShape>>;
export declare abstract class BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape extends ITTestShape, IGivenShape> {
    name: string;
    givens: IGivens<ISubject, IStore, ISelection, IThenShape, IGivenShape>;
    checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>[];
    store: IStore;
    fails: BaseGiven<ISubject, IStore, ISelection, IThenShape, IGivenShape>[];
    testResourceConfiguration: ITTestResourceConfiguration;
    index: number;
    constructor(name: string, index: number, givens?: IGivens<ISubject, IStore, ISelection, IThenShape, IGivenShape>, checks?: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>[]);
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
        fails: BaseGiven<ISubject, IStore, ISelection, IThenShape, IGivenShape>[];
    };
    setup(s: IInput, artifactory: ITestArtifactory): Promise<ISubject>;
    assertThat(t: IThenShape): unknown;
    run(input: IInput, testResourceConfiguration: ITTestResourceConfiguration, artifactory: (fPath: string, value: unknown) => void, tLog: (...string: any[]) => void): Promise<BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape, IGivenShape>>;
}
export declare abstract class BaseGiven<ISubject, IStore, ISelection, IThenShape, IGivenShape> {
    name: string;
    features: string[];
    whens: BaseWhen<IStore, ISelection, IThenShape>[];
    thens: BaseThen<ISelection, IStore, IThenShape>[];
    error: Error;
    store: IStore;
    recommendedFsPath: string;
    givenCB: IGivenShape;
    initialValues: any;
    constructor(name: string, features: string[], whens: BaseWhen<IStore, ISelection, IThenShape>[], thens: BaseThen<ISelection, IStore, IThenShape>[], givenCB: IGivenShape, initialValues: any);
    beforeAll(store: IStore, artifactory: ITestArtifactory): IStore;
    afterAll(store: IStore, artifactory: ITestArtifactory): IStore;
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
    abstract givenThat(subject: ISubject, testResourceConfiguration: any, artifactory: ITestArtifactory, givenCB: IGivenShape): Promise<IStore>;
    afterEach(store: IStore, key: string, artifactory: ITestArtifactory): Promise<unknown>;
    give(subject: ISubject, key: string, testResourceConfiguration: any, tester: any, artifactory: ITestArtifactory, tLog: ITLog): Promise<IStore>;
}
export declare abstract class BaseWhen<IStore, ISelection, IThenShape> {
    name: string;
    whenCB: (x: ISelection) => IThenShape;
    error: boolean;
    constructor(name: string, whenCB: (xyz: ISelection) => IThenShape);
    abstract andWhen(store: IStore, whenCB: (x: ISelection) => IThenShape, testResource: any): any;
    toObj(): {
        name: string;
        error: boolean;
    };
    test(store: IStore, testResourceConfiguration: any, tLog: ITLog): Promise<any>;
}
export declare abstract class BaseThen<ISelection, IStore, IThenShape> {
    name: string;
    thenCB: (storeState: ISelection) => IThenShape;
    error: boolean;
    constructor(name: string, thenCB: (val: ISelection) => IThenShape);
    toObj(): {
        name: string;
        error: boolean;
    };
    abstract butThen(store: any, testResourceConfiguration?: any): Promise<ISelection>;
    test(store: IStore, testResourceConfiguration: any, tLog: ITLog): Promise<IThenShape | undefined>;
}
export declare abstract class BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape extends ITTestShape> {
    name: string;
    features: string[];
    checkCB: (whens: any, thens: any) => any;
    whens: {
        [K in keyof ITestShape["whens"]]: (p: any, tc: any) => BaseWhen<IStore, ISelection, IThenShape>;
    };
    thens: {
        [K in keyof ITestShape["thens"]]: (p: any, tc: any) => BaseThen<ISelection, IStore, IThenShape>;
    };
    constructor(name: string, features: string[], checkCB: (whens: any, thens: any) => any, whens: any, thens: any);
    abstract checkThat(subject: ISubject, testResourceConfiguration: any, artifactory: ITestArtifactory): Promise<IStore>;
    afterEach(store: IStore, key: string, cb?: any): Promise<unknown>;
    check(subject: ISubject, key: string, testResourceConfiguration: any, tester: any, artifactory: ITestArtifactory, tLog: ITLog): Promise<void>;
}
export declare abstract class BaseBuilder<IInput, ISubject, IStore, ISelection, SuiteExtensions, GivenExtensions, WhenExtensions, ThenExtensions, CheckExtensions, IThenShape, IGivenShape, ITestShape extends ITTestShape> {
    readonly input: IInput;
    testResourceRequirement: ITTestResourceRequest;
    artifacts: Promise<unknown>[];
    testJobs: ITestJob[];
    suitesOverrides: Record<keyof SuiteExtensions, (name: string, index: number, givens: IGivens<ISubject, IStore, ISelection, IThenShape, IGivenShape>, checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape>[]) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITTestShape, IGivenShape>>;
    givenOverides: Record<keyof GivenExtensions, (name: string, features: string[], whens: BaseWhen<IStore, ISelection, IThenShape>[], thens: BaseThen<ISelection, IStore, IThenShape>[], gcb: any) => BaseGiven<ISubject, IStore, ISelection, IThenShape, IGivenShape>>;
    whenOverides: Record<keyof WhenExtensions, (any: any) => BaseWhen<IStore, ISelection, IThenShape>>;
    thenOverides: Record<keyof ThenExtensions, (selection: ISelection, expectation: any) => BaseThen<ISelection, IStore, IThenShape>>;
    checkOverides: Record<keyof CheckExtensions, (feature: string, callback: (whens: any, thens: any) => any, ...xtraArgs: any[]) => BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape>>;
    constructor(input: IInput, suitesOverrides: Record<keyof SuiteExtensions, (name: string, index: number, givens: IGivens<ISubject, IStore, ISelection, IThenShape, IGivenShape>, checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape>[]) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITTestShape, IGivenShape>>, givenOverides: Record<keyof GivenExtensions, (name: string, features: string[], whens: BaseWhen<IStore, ISelection, IThenShape>[], thens: BaseThen<ISelection, IStore, IThenShape>[], gcb: any) => BaseGiven<ISubject, IStore, ISelection, IThenShape, IGivenShape>>, whenOverides: Record<keyof WhenExtensions, (c: any) => BaseWhen<IStore, ISelection, IThenShape>>, thenOverides: Record<keyof ThenExtensions, (selection: ISelection, expectation: any) => BaseThen<ISelection, IStore, IThenShape>>, checkOverides: Record<keyof CheckExtensions, (feature: string, callback: (whens: any, thens: any) => any, ...xtraArgs: any[]) => BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape>>, logWriter: any, testResourceRequirement: any, testSpecification: any);
    Suites(): Record<keyof SuiteExtensions, (name: string, index: number, givens: IGivens<ISubject, IStore, ISelection, IThenShape, IGivenShape>, checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape>[]) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITTestShape, IGivenShape>>;
    Given(): Record<keyof GivenExtensions, (name: string, features: string[], whens: BaseWhen<IStore, ISelection, IThenShape>[], thens: BaseThen<ISelection, IStore, IThenShape>[], gcb: any) => BaseGiven<ISubject, IStore, ISelection, IThenShape, IGivenShape>>;
    When(): Record<keyof WhenExtensions, (arg0: IStore, ...arg1: any) => BaseWhen<IStore, ISelection, IThenShape>>;
    Then(): Record<keyof ThenExtensions, (selection: ISelection, expectation: any) => BaseThen<ISelection, IStore, IThenShape>>;
    Check(): Record<keyof CheckExtensions, (feature: string, callback: (whens: any, thens: any) => any, whens: any, thens: any) => BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape>>;
}
export declare abstract class ClassBuilder<ITestShape extends ITTestShape, IInitialState, ISelection, IStore, ISubject, IWhenShape, IThenShape, IInput, IGivenShape> extends BaseBuilder<any, any, any, any, any, any, any, any, any, any, any, any> {
    constructor(testImplementation: ITestImplementation<IInitialState, ISelection, IWhenShape, IThenShape, ITestShape, IGivenShape>, testSpecification: (Suite: {
        [K in keyof ITestShape["suites"]]: (feature: string, givens: IGivens<ISubject, IStore, ISelection, IThenShape, IGivenShape>, checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>[]) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape, IGivenShape>;
    }, Given: {
        [K in keyof ITestShape["givens"]]: (features: string[], whens: BaseWhen<IStore, ISelection, IThenShape>[], thens: BaseThen<ISelection, IStore, IThenShape>[], ...a: ITestShape["givens"][K]) => BaseGiven<ISubject, IStore, ISelection, IThenShape, IGivenShape>;
    }, When: {
        [K in keyof ITestShape["whens"]]: (...a: ITestShape["whens"][K]) => BaseWhen<IStore, ISelection, IThenShape>;
    }, Then: {
        [K in keyof ITestShape["thens"]]: (...a: ITestShape["thens"][K]) => BaseThen<ISelection, IStore, IThenShape>;
    }, Check: ITestCheckCallback<ITestShape>, logWriter: ILogWriter) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape, IGivenShape>[], input: IInput, suiteKlasser: (name: string, index: number, givens: IGivens<ISubject, IStore, ISelection, IThenShape, IGivenShape>, checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>[]) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape, IGivenShape>, givenKlasser: (name: any, features: any, whens: any, thens: any, givenCB: any) => BaseGiven<ISubject, IStore, ISelection, IThenShape, IGivenShape>, whenKlasser: (s: any, o: any) => BaseWhen<IStore, ISelection, IThenShape>, thenKlasser: (s: any, o: any) => BaseThen<IStore, ISelection, IThenShape>, checkKlasser: (n: any, f: any, cb: any, w: any, t: any) => BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>, testResourceRequirement: any, logWriter: ILogWriter);
}
