/// <reference types="node" />
declare const DirectedGraph: any, UndirectedGraph: any;
export declare class BaseFeature {
    name: string;
    constructor(name: string);
}
declare abstract class TesterantoGraph {
    name: string;
    abstract graph: any;
    constructor(name: string);
}
export declare class TesterantoGraphUndirected implements TesterantoGraph {
    name: string;
    graph: typeof UndirectedGraph;
    constructor(name: string);
    connect(a: any, b: any, relation?: string): void;
}
export declare class TesterantoGraphDirected implements TesterantoGraph {
    name: string;
    graph: typeof DirectedGraph;
    constructor(name: string);
    connect(to: any, from: any, relation?: string): void;
}
export declare class TesterantoGraphDirectedAcyclic implements TesterantoGraph {
    name: string;
    graph: typeof DirectedGraph;
    constructor(name: string);
    connect(to: any, from: any, relation?: string): void;
}
export declare class TesterantoFeatures {
    features: Record<string, BaseFeature>;
    graphs: {
        undirected: TesterantoGraphUndirected[];
        directed: TesterantoGraphDirected[];
        dags: TesterantoGraphDirectedAcyclic[];
    };
    constructor(features: Record<string, BaseFeature>, graphs: {
        undirected: TesterantoGraphUndirected[];
        directed: TesterantoGraphDirected[];
        dags: TesterantoGraphDirectedAcyclic[];
    });
    networks(): (TesterantoGraphUndirected | TesterantoGraphDirected | TesterantoGraphDirectedAcyclic)[];
    toObj(): {
        features: {
            inNetworks: {
                network: string;
                neighbors: any;
            }[];
            name: string;
        }[];
        networks: ({
            name: string;
            graph: any;
        } | {
            name: string;
            graph: any;
        } | {
            name: string;
            graph: any;
        })[];
    };
}
export declare type ITTestResourceRequirement = {
    "ports": number;
};
declare type ITTestResource = {
    "ports": number[];
};
export declare type IT_FeatureNetwork = {
    name: string;
};
export declare type IT = {
    toObj(): object;
    aborter: () => any;
    name: string;
    givens: BaseGiven<unknown, unknown, unknown, unknown, unknown>[];
    checks: BaseCheck<unknown, unknown, unknown, unknown, ITTestShape, unknown>[];
};
export declare type ITestJob = {
    toObj(): object;
    test: IT;
    runner: (testResource: any) => Promise<boolean>;
    testResource: ITTestResourceRequirement;
};
export declare type ITestResults = Promise<{
    test: IT;
}>[];
export declare type Modify<T, R> = Omit<T, keyof R> & R;
export declare type ITTestShape = {
    suites: any;
    givens: any;
    whens: any;
    thens: any;
    checks: any;
};
export declare type ITestSpecification<ITestShape extends ITTestShape, IFeatureShape> = (Suite: {
    [K in keyof ITestShape["suites"]]: (name: string, givens: BaseGiven<unknown, unknown, unknown, unknown, unknown>[], checks: BaseCheck<unknown, unknown, unknown, unknown, ITestShape, IFeatureShape>[]) => BaseSuite<unknown, unknown, unknown, unknown, unknown, ITestShape, IFeatureShape>;
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
export declare type ITestImplementation<IState, ISelection, IWhenShape, IThenShape, ITestShape extends ITTestShape> = {
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
declare class TestArtifact {
    binary: Buffer | string;
    constructor(binary: any);
}
export declare abstract class BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape extends ITTestShape, IFeatureShape> {
    name: string;
    givens: BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>[];
    checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape>[];
    store: IStore;
    aborted: boolean;
    fails: BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>[];
    testResourceConfiguration: ITTestResource;
    constructor(name: string, givens?: BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>[], checks?: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape>[]);
    aborter(): Promise<void>;
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
            testArtifacts: Record<string, any[]>;
        }[];
        fails: BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>[];
    };
    setup(s: IInput): Promise<ISubject>;
    test(t: IThenShape): unknown;
    run(input: any, testResourceConfiguration: ITTestResource): Promise<boolean>;
}
export declare abstract class BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape> {
    name: string;
    features: (keyof IFeatureShape)[];
    whens: BaseWhen<IStore, ISelection, IThenShape>[];
    thens: BaseThen<ISelection, IStore, IThenShape>[];
    error: Error;
    abort: boolean;
    store: IStore;
    testArtifacts: Record<string, any[]>;
    constructor(name: string, features: (keyof IFeatureShape)[], whens: BaseWhen<IStore, ISelection, IThenShape>[], thens: BaseThen<ISelection, IStore, IThenShape>[]);
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
        testArtifacts: Record<string, any[]>;
    };
    abstract givenThat(subject: ISubject, testResourceConfiguration?: any): Promise<IStore>;
    saveTestArtifact(k: string, testArtifact: TestArtifact): void;
    artifactSaver: {
        png: (testArtifact: any) => void;
    };
    aborter(ndx: number): Promise<unknown>;
    afterEach(store: IStore, ndx: number, cb: any): Promise<unknown>;
    give(subject: ISubject, index: number, testResourceConfiguration: any, tester: any): Promise<IStore>;
}
export declare abstract class BaseWhen<IStore, ISelection, IThenShape> {
    name: string;
    actioner: (x: ISelection) => IThenShape;
    error: boolean;
    abort: boolean;
    constructor(name: string, actioner: (xyz: ISelection) => IThenShape);
    abstract andWhen(store: IStore, actioner: (x: ISelection) => IThenShape, testResource: any): any;
    toObj(): {
        name: string;
        error: boolean;
    };
    aborter(): boolean;
    test(store: IStore, testResourceConfiguration?: any): Promise<any>;
}
export declare abstract class BaseThen<ISelection, IStore, IThenShape> {
    name: string;
    thenCB: (storeState: ISelection) => IThenShape;
    error: boolean;
    abort: boolean;
    constructor(name: string, thenCB: (val: ISelection) => IThenShape);
    toObj(): {
        name: string;
        error: boolean;
    };
    abstract butThen(store: any, testResourceConfiguration?: any): Promise<ISelection>;
    aborter(): boolean;
    test(store: IStore, testResourceConfiguration: any): Promise<IThenShape | undefined>;
}
export declare abstract class BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape extends ITTestShape, IFeatureShape> {
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
    abstract checkThat(subject: ISubject, testResourceConfiguration?: any): Promise<IStore>;
    afterEach(store: IStore, ndx: number, cb?: any): Promise<unknown>;
    check(subject: ISubject, ndx: number, testResourceConfiguration: any, tester: any): Promise<void>;
}
export declare abstract class TesterantoLevelZero<IInput, ISubject, IStore, ISelection, SuiteExtensions, GivenExtensions, WhenExtensions, ThenExtensions, CheckExtensions, IThenShape, IFeatureShape> {
    readonly cc: IStore;
    constructorator: IStore;
    suitesOverrides: Record<keyof SuiteExtensions, (name: string, givens: BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>[], checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape, IFeatureShape>[]) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITTestShape, IFeatureShape>>;
    givenOverides: Record<keyof GivenExtensions, (name: string, features: (keyof IFeatureShape)[], whens: BaseWhen<IStore, ISelection, IThenShape>[], thens: BaseThen<ISelection, IStore, IThenShape>[], ...xtraArgs: any[]) => BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>>;
    whenOverides: Record<keyof WhenExtensions, (any: any) => BaseWhen<IStore, ISelection, IThenShape>>;
    thenOverides: Record<keyof ThenExtensions, (selection: ISelection, expectation: any) => BaseThen<ISelection, IStore, IThenShape>>;
    checkOverides: Record<keyof CheckExtensions, (feature: string, callback: (whens: any, thens: any) => any, ...xtraArgs: any[]) => BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape, IFeatureShape>>;
    constructor(cc: IStore, suitesOverrides: Record<keyof SuiteExtensions, (name: string, givens: BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>[], checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape, IFeatureShape>[]) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITTestShape, IFeatureShape>>, givenOverides: Record<keyof GivenExtensions, (name: string, features: (keyof IFeatureShape)[], whens: BaseWhen<IStore, ISelection, IThenShape>[], thens: BaseThen<ISelection, IStore, IThenShape>[], ...xtraArgs: any[]) => BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>>, whenOverides: Record<keyof WhenExtensions, (c: any) => BaseWhen<IStore, ISelection, IThenShape>>, thenOverides: Record<keyof ThenExtensions, (selection: ISelection, expectation: any) => BaseThen<ISelection, IStore, IThenShape>>, checkOverides: Record<keyof CheckExtensions, (feature: string, callback: (whens: any, thens: any) => any, ...xtraArgs: any[]) => BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape, IFeatureShape>>);
    Suites(): Record<keyof SuiteExtensions, (name: string, givens: BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>[], checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape, IFeatureShape>[]) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITTestShape, IFeatureShape>>;
    Given(): Record<keyof GivenExtensions, (name: string, features: (keyof IFeatureShape)[], whens: BaseWhen<IStore, ISelection, IThenShape>[], thens: BaseThen<ISelection, IStore, IThenShape>[], ...xtraArgs: any[]) => BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>>;
    When(): Record<keyof WhenExtensions, (arg0: IStore, ...arg1: any) => BaseWhen<IStore, ISelection, IThenShape>>;
    Then(): Record<keyof ThenExtensions, (selection: ISelection, expectation: any) => BaseThen<ISelection, IStore, IThenShape>>;
    Check(): Record<keyof CheckExtensions, (feature: string, callback: (whens: any, thens: any) => any, whens: any, thens: any) => BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape, IFeatureShape>>;
}
export declare abstract class TesterantoLevelOne<ITestShape extends ITTestShape, IInitialState, ISelection, IStore, ISubject, IWhenShape, IThenShape, IInput, IFeatureShape> {
    constructor(testImplementation: ITestImplementation<IInitialState, ISelection, IWhenShape, IThenShape, ITestShape>, testSpecification: (Suite: {
        [K in keyof ITestShape["suites"]]: (feature: string, givens: BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>[], checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape>[]) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape>;
    }, Given: {
        [K in keyof ITestShape["givens"]]: (name: string, features: (keyof IFeatureShape)[], whens: BaseWhen<IStore, ISelection, IThenShape>[], thens: BaseThen<ISelection, IStore, IThenShape>[], ...a: ITestShape["givens"][K]) => BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>;
    }, When: {
        [K in keyof ITestShape["whens"]]: (...a: ITestShape["whens"][K]) => BaseWhen<IStore, ISelection, IThenShape>;
    }, Then: {
        [K in keyof ITestShape["thens"]]: (...a: ITestShape["thens"][K]) => BaseThen<ISelection, IStore, IThenShape>;
    }, Check: {
        [K in keyof ITestShape["checks"]]: (name: string, features: (keyof IFeatureShape)[], cbz: (...any: any[]) => Promise<void>) => any;
    }) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape>[], input: IInput, suiteKlasser: (name: string, givens: BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>[], checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape>[]) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape>, givenKlasser: (n: any, f: any, w: any, t: any, z?: any) => BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>, whenKlasser: (s: any, o: any) => BaseWhen<IStore, ISelection, IThenShape>, thenKlasser: (s: any, o: any) => BaseThen<IStore, ISelection, IThenShape>, checkKlasser: (n: any, f: any, cb: any, w: any, t: any) => BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape>, testResource: any);
}
export declare const Testeranto: <TestShape extends ITTestShape, Input, Subject, Store, Selection_1, WhenShape, ThenShape, InitialStateShape, IFeatureShape>(input: Input, testSpecification: ITestSpecification<TestShape, IFeatureShape>, testImplementation: any, testResource: ITTestResourceRequirement, testInterface: {
    actionHandler?: ((b: (...any: any[]) => any) => any) | undefined;
    afterEach?: ((store: Store, ndx: number, cb: any) => unknown) | undefined;
    andWhen: (store: Store, actioner: any, testResource: ITTestResource) => Promise<Selection_1>;
    assertioner?: ((t: ThenShape) => any) | undefined;
    beforeAll?: ((input: Input) => Promise<Subject>) | undefined;
    beforeEach?: ((subject: Subject, initialValues: any, testResource: ITTestResource) => Promise<Store>) | undefined;
    butThen?: ((store: Store, callback: any, testResource: ITTestResource) => Promise<Selection_1>) | undefined;
}) => Promise<void>;
export {};