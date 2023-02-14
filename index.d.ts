/// <reference types="node" />
import { DirectedGraph, UndirectedGraph } from 'graphology';
declare abstract class TesterantoGraph {
    name: string;
    abstract graph: any;
    constructor(name: string);
}
export declare class TesterantoGraphUndirected implements TesterantoGraph {
    name: string;
    graph: UndirectedGraph;
    constructor(name: string);
    connect(a: any, b: any, relation?: string): void;
}
export declare class TesterantoGraphDirected implements TesterantoGraph {
    name: string;
    graph: DirectedGraph;
    constructor(name: string);
    connect(to: any, from: any, relation?: string): void;
}
export declare class TesterantoGraphDirectedAcyclic implements TesterantoGraph {
    name: string;
    graph: DirectedGraph;
    constructor(name: string);
    connect(to: any, from: any, relation?: string): void;
}
export declare class TesterantoFeatures {
    features: any;
    graphs: {
        undirected: TesterantoGraphUndirected[];
        directed: TesterantoGraphDirected[];
        dags: TesterantoGraphDirectedAcyclic[];
    };
    constructor(features: any, graphs: {
        undirected: TesterantoGraphUndirected[];
        directed: TesterantoGraphDirected[];
        dags: TesterantoGraphDirectedAcyclic[];
    });
    networks(): (TesterantoGraphUndirected | TesterantoGraphDirected | TesterantoGraphDirectedAcyclic)[];
    toObj(): {
        features: any;
        networks: ({
            name: string;
            graph: UndirectedGraph<import("graphology-types").Attributes, import("graphology-types").Attributes, import("graphology-types").Attributes>;
        } | {
            name: string;
            graph: DirectedGraph<import("graphology-types").Attributes, import("graphology-types").Attributes, import("graphology-types").Attributes>;
        } | {
            name: string;
            graph: DirectedGraph<import("graphology-types").Attributes, import("graphology-types").Attributes, import("graphology-types").Attributes>;
        })[];
    };
}
export declare class BaseFeature {
    name: string;
    constructor(name: string);
}
declare abstract class BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape extends ITTestShape> {
    name: string;
    givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[];
    checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>[];
    store: IStore;
    aborted: boolean;
    fails: BaseGiven<ISubject, IStore, ISelection, IThenShape>[];
    constructor(name: string, givens?: BaseGiven<ISubject, IStore, ISelection, IThenShape>[], checks?: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>[]);
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
        }[];
        fails: BaseGiven<ISubject, IStore, ISelection, IThenShape>[];
    };
    setup(s: IInput): Promise<ISubject>;
    test(t: IThenShape): unknown;
    run(input: any, testResourceConfiguration: ITTestResource): Promise<boolean>;
}
declare class TestArtifact {
    binary: Buffer | string;
    constructor(binary: any);
}
declare abstract class BaseGiven<ISubject, IStore, ISelection, IThenShape> {
    name: string;
    features: BaseFeature[];
    whens: BaseWhen<IStore, ISelection, IThenShape>[];
    thens: BaseThen<ISelection, IStore, IThenShape>[];
    error: Error;
    abort: boolean;
    store: IStore;
    testArtifacts: Record<string, any[]>;
    constructor(name: string, features: BaseFeature[], whens: BaseWhen<IStore, ISelection, IThenShape>[], thens: BaseThen<ISelection, IStore, IThenShape>[]);
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
declare abstract class BaseWhen<IStore, ISelection, IThenShape> {
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
declare abstract class BaseThen<ISelection, IStore, IThenShape> {
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
declare abstract class BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape extends ITTestShape> {
    name: string;
    features: BaseFeature[];
    checkCB: (whens: any, thens: any) => any;
    whens: {
        [K in keyof ITestShape["whens"]]: (p: any, tc: any) => BaseWhen<IStore, ISelection, IThenShape>;
    };
    thens: {
        [K in keyof ITestShape["thens"]]: (p: any, tc: any) => BaseThen<ISelection, IStore, IThenShape>;
    };
    constructor(name: string, features: BaseFeature[], checkCB: (whens: any, thens: any) => any, whens: any, thens: any);
    abstract checkThat(subject: ISubject, testResourceConfiguration?: any): Promise<IStore>;
    afterEach(store: IStore, ndx: number, cb?: any): Promise<unknown>;
    check(subject: ISubject, ndx: number, testResourceConfiguration: any, tester: any): Promise<void>;
}
declare type ITTestResourceRequirement = {
    "ports": number;
};
declare type ITTestResource = {
    "ports": number[];
};
declare type ITTestShape = {
    suites: any;
    givens: any;
    whens: any;
    thens: any;
    checks: any;
};
declare type ITestSpecification<ITestShape extends ITTestShape> = (Suite: {
    [K in keyof ITestShape["suites"]]: (name: string, givens: BaseGiven<unknown, unknown, unknown, unknown>[], checks: BaseCheck<unknown, unknown, unknown, unknown, ITestShape>[]) => BaseSuite<unknown, unknown, unknown, unknown, unknown, ITestShape>;
}, Given: {
    [K in keyof ITestShape["givens"]]: (features: BaseFeature[], whens: BaseWhen<unknown, unknown, unknown>[], thens: BaseThen<unknown, unknown, unknown>[], ...xtras: ITestShape["givens"][K]) => BaseGiven<unknown, unknown, unknown, unknown>;
}, When: {
    [K in keyof ITestShape["whens"]]: (...xtras: ITestShape["whens"][K]) => BaseWhen<unknown, unknown, unknown>;
}, Then: {
    [K in keyof ITestShape["thens"]]: (...xtras: ITestShape["thens"][K]) => BaseThen<unknown, unknown, unknown>;
}, Check: {
    [K in keyof ITestShape["checks"]]: (name: string, features: BaseFeature[], callbackA: (whens: {
        [K in keyof ITestShape["whens"]]: (...unknown: any[]) => BaseWhen<unknown, unknown, unknown>;
    }, thens: {
        [K in keyof ITestShape["thens"]]: (...unknown: any[]) => BaseThen<unknown, unknown, unknown>;
    }) => unknown, ...xtras: ITestShape["checks"][K]) => BaseCheck<unknown, unknown, unknown, unknown, ITestShape>;
}) => any[];
declare const _default: {
    Testeranto: <TestShape extends ITTestShape, Input, Subject, Store, Selection_1, WhenShape, ThenShape, InitialStateShape>(input: Input, testSpecification: ITestSpecification<TestShape>, testImplementation: any, testResource: ITTestResourceRequirement, testInterface: {
        actionHandler?: ((b: (...any: any[]) => any) => any) | undefined;
        afterEach?: ((store: Store, ndx: number, cb: any) => unknown) | undefined;
        andWhen: (store: Store, actioner: any, testResource: ITTestResource) => Promise<Selection_1>;
        assertioner?: ((t: ThenShape) => any) | undefined;
        beforeAll?: ((input: Input) => Promise<Subject>) | undefined;
        beforeEach?: ((subject: Subject, initialValues: any, testResource: ITTestResource) => Promise<Store>) | undefined;
        butThen?: ((store: Store, callback: any, testResource: ITTestResource) => Promise<Selection_1>) | undefined;
    }) => {
        new (): {};
    };
    BaseFeature: typeof BaseFeature;
    TesterantoFeatures: typeof TesterantoFeatures;
    TesterantoGraphDirected: typeof TesterantoGraphDirected;
    TesterantoGraphDirectedAcyclic: typeof TesterantoGraphDirectedAcyclic;
    TesterantoGraphUndirected: typeof TesterantoGraphUndirected;
};
export default _default;
//# sourceMappingURL=index.d.ts.map