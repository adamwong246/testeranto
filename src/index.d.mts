import { BaseFeature } from './Features';
import { IBaseConfig } from "./IBaseConfig";
declare type ITTestResourceConfiguration = {
    "fs": string;
    "ports": number[];
};
declare type ITTestResourceRequirement = {
    "ports": number;
    "fs": string;
};
declare type IRunner = (x: ITTestResourceConfiguration, t: ITLog) => Promise<boolean>;
declare type IT = {
    toObj(): object;
    name: string;
    givens: BaseGiven<unknown, unknown, unknown, unknown, Record<string, BaseFeature>>[];
    checks: BaseCheck<unknown, unknown, unknown, unknown, ITTestShape, unknown>[];
    testResourceConfiguration: ITTestResourceConfiguration;
};
declare type ITestJob = {
    toObj(): object;
    test: IT;
    runner: IRunner;
    testResourceRequirement: ITTestResourceRequirement;
    receiveTestResourceConfig: (testResource?: any) => boolean;
};
declare type ITestResults = Promise<{
    test: IT;
}>[];
declare type ITTestShape = {
    suites: any;
    givens: any;
    whens: any;
    thens: any;
    checks: any;
};
declare type ITestSpecification<ITestShape extends ITTestShape, IFeatureShape> = (Suite: {
    [K in keyof ITestShape["suites"]]: (name: string, givens: BaseGiven<unknown, unknown, unknown, unknown, Record<string, BaseFeature>>[], checks: BaseCheck<unknown, unknown, unknown, unknown, ITestShape, IFeatureShape>[]) => BaseSuite<unknown, unknown, unknown, unknown, unknown, ITestShape, IFeatureShape>;
}, Given: {
    [K in keyof ITestShape["givens"]]: (features: (keyof IFeatureShape)[], whens: BaseWhen<unknown, unknown, unknown>[], thens: BaseThen<unknown, unknown, unknown>[], ...xtras: ITestShape["givens"][K]) => BaseGiven<unknown, unknown, unknown, unknown, unknown>;
}, When: {
    [K in keyof ITestShape["whens"]]: (...xtras: ITestShape["whens"][K]) => BaseWhen<unknown, unknown, unknown>;
}, Then: {
    [K in keyof ITestShape["thens"]]: (...xtras: ITestShape["thens"][K]) => BaseThen<unknown, unknown, unknown>;
}, Check: {
    [K in keyof ITestShape["checks"]]: (name: string, features: (keyof IFeatureShape)[], callbackA: (whens: {
        [K in keyof ITestShape["whens"]]: (...unknown: any[]) => BaseWhen<unknown, unknown, unknown>;
    }, thens: {
        [K in keyof ITestShape["thens"]]: (...unknown: any[]) => BaseThen<unknown, unknown, unknown>;
    }) => unknown, ...xtras: ITestShape["checks"][K]) => BaseCheck<unknown, unknown, unknown, unknown, ITestShape, IFeatureShape>;
}) => any[];
declare type ITestImplementation<IState, ISelection, IWhenShape, IThenShape, ITestShape extends ITTestShape> = {
    Suites: {
        [K in keyof ITestShape["suites"]]: string;
    };
    Givens: {
        [K in keyof ITestShape["givens"]]: (...Ig: ITestShape["givens"][K]) => IState;
    };
    Whens: {
        [K in keyof ITestShape["whens"]]: (...Iw: ITestShape["whens"][K]) => (zel: ISelection) => IWhenShape;
    };
    Thens: {
        [K in keyof ITestShape["thens"]]: (...It: ITestShape["thens"][K]) => (ssel: ISelection) => IThenShape;
    };
    Checks: {
        [K in keyof ITestShape["checks"]]: (...Ic: ITestShape["checks"][K]) => IState;
    };
};
declare type ITestArtifactory = (key: string, value: string) => unknown;
declare type ITLog = (...string: any[]) => void;
declare abstract class BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape extends ITTestShape, IFeatureShape> {
    name: string;
    givens: BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>[];
    checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape>[];
    store: IStore;
    fails: BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>[];
    testResourceConfiguration: ITTestResourceConfiguration;
    constructor(name: string, givens?: BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>[], checks?: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape>[]);
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
            errors: Error;
            features: (keyof IFeatureShape)[];
        }[];
        fails: BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>[];
    };
    setup(s: IInput, artifactory: ITestArtifactory): Promise<ISubject>;
    test(t: IThenShape): unknown;
    run(input: any, testResourceConfiguration: ITTestResourceConfiguration, artifactory: (gndex: string) => (a: string, b: string) => void, tLog: (...string: any[]) => void): Promise<BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape>>;
}
declare abstract class BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape> {
    name: string;
    features: (keyof IFeatureShape)[];
    whens: BaseWhen<IStore, ISelection, IThenShape>[];
    thens: BaseThen<ISelection, IStore, IThenShape>[];
    error: Error;
    store: IStore;
    recommendedFsPath: string;
    constructor(name: string, features: (keyof IFeatureShape)[], whens: BaseWhen<IStore, ISelection, IThenShape>[], thens: BaseThen<ISelection, IStore, IThenShape>[]);
    afterAll(store: IStore, artifactory: ITestArtifactory): void;
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
        errors: Error;
        features: (keyof IFeatureShape)[];
    };
    abstract givenThat(subject: ISubject, testResourceConfiguration: any, artifactory: ITestArtifactory): Promise<IStore>;
    afterEach(store: IStore, ndx: number, artifactory: ITestArtifactory): Promise<unknown>;
    give(subject: ISubject, index: number, testResourceConfiguration: any, tester: any, artifactory: ITestArtifactory, tLog: ITLog): Promise<IStore>;
}
declare abstract class BaseWhen<IStore, ISelection, IThenShape> {
    name: string;
    actioner: (x: ISelection) => IThenShape;
    error: boolean;
    constructor(name: string, actioner: (xyz: ISelection) => IThenShape);
    abstract andWhen(store: IStore, actioner: (x: ISelection) => IThenShape, testResource: any): any;
    toObj(): {
        name: string;
        error: boolean;
    };
    test(store: IStore, testResourceConfiguration: any, tLog: ITLog): Promise<any>;
}
declare abstract class BaseThen<ISelection, IStore, IThenShape> {
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
declare abstract class BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape extends ITTestShape, IFeatureShape> {
    name: string;
    features: (keyof IFeatureShape)[];
    checkCB: (whens: any, thens: any) => any;
    whens: {
        [K in keyof ITestShape["whens"]]: (p: any, tc: any) => BaseWhen<IStore, ISelection, IThenShape>;
    };
    thens: {
        [K in keyof ITestShape["thens"]]: (p: any, tc: any) => BaseThen<ISelection, IStore, IThenShape>;
    };
    constructor(name: string, features: (keyof IFeatureShape)[], checkCB: (whens: any, thens: any) => any, whens: any, thens: any);
    abstract checkThat(subject: ISubject, testResourceConfiguration: any, artifactory: ITestArtifactory): Promise<IStore>;
    afterEach(store: IStore, ndx: number, cb?: any): Promise<unknown>;
    check(subject: ISubject, ndx: number, testResourceConfiguration: any, tester: any, artifactory: ITestArtifactory, tLog: ITLog): Promise<void>;
}
declare type ITestArtificer = (key: string, data: any) => void;
declare const Testeranto: <TestShape extends ITTestShape, Input, Subject, Store, Selection_1, WhenShape, ThenShape, InitialStateShape, IFeatureShape extends Record<string, BaseFeature>>(input: Input, testSpecification: ITestSpecification<TestShape, IFeatureShape>, testImplementation: any, testInterface: {
    actionHandler?: ((b: (...any: any[]) => any) => any) | undefined;
    andWhen: (store: Store, actioner: any, testResource: ITTestResourceConfiguration) => Promise<Selection_1>;
    butThen?: ((store: Store, callback: any, testResource: ITTestResourceConfiguration) => Promise<Selection_1>) | undefined;
    assertioner?: ((t: ThenShape) => any) | undefined;
    afterAll?: ((store: Store, artificer: ITestArtificer) => any) | undefined;
    afterEach?: ((store: Store, ndx: number, artificer: ITestArtificer) => Promise<unknown>) | undefined;
    beforeAll?: ((input: Input, artificer: ITestArtificer) => Promise<Subject>) | undefined;
    beforeEach?: ((subject: Subject, initialValues: any, testResource: ITTestResourceConfiguration, artificer: ITestArtificer) => Promise<Store>) | undefined;
}, nameKey: string, testResourceRequirement?: ITTestResourceRequirement) => Promise<void>;
export type { IBaseConfig, Testeranto, BaseWhen, BaseThen, BaseCheck, BaseSuite, BaseGiven, ITestImplementation, ITestSpecification, ITTestShape, ITestResults, ITestJob, IT, ITTestResourceRequirement };
declare const _default: {
    Testeranto: <TestShape extends ITTestShape, Input, Subject, Store, Selection_1, WhenShape, ThenShape, InitialStateShape, IFeatureShape extends Record<string, BaseFeature>>(input: Input, testSpecification: ITestSpecification<TestShape, IFeatureShape>, testImplementation: any, testInterface: {
        actionHandler?: ((b: (...any: any[]) => any) => any) | undefined;
        andWhen: (store: Store, actioner: any, testResource: ITTestResourceConfiguration) => Promise<Selection_1>;
        butThen?: ((store: Store, callback: any, testResource: ITTestResourceConfiguration) => Promise<Selection_1>) | undefined;
        assertioner?: ((t: ThenShape) => any) | undefined;
        afterAll?: ((store: Store, artificer: ITestArtificer) => any) | undefined;
        afterEach?: ((store: Store, ndx: number, artificer: ITestArtificer) => Promise<unknown>) | undefined;
        beforeAll?: ((input: Input, artificer: ITestArtificer) => Promise<Subject>) | undefined;
        beforeEach?: ((subject: Subject, initialValues: any, testResource: ITTestResourceConfiguration, artificer: ITestArtificer) => Promise<Store>) | undefined;
    }, nameKey: string, testResourceRequirement?: ITTestResourceRequirement) => Promise<void>;
    BaseWhen: typeof BaseWhen;
    BaseThen: typeof BaseThen;
    BaseCheck: typeof BaseCheck;
    BaseSuite: typeof BaseSuite;
    BaseGiven: typeof BaseGiven;
};
export default _default;
