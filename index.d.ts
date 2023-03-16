declare module "Features" {
    const DirectedGraph: any, UndirectedGraph: any;
    abstract class TesterantoGraph {
        name: string;
        abstract graph: any;
        constructor(name: string);
    }
    export class BaseFeature {
        name: string;
        constructor(name: string);
    }
    export class TesterantoGraphUndirected implements TesterantoGraph {
        name: string;
        graph: typeof UndirectedGraph;
        constructor(name: string);
        connect(a: any, b: any, relation?: string): void;
    }
    export class TesterantoGraphDirected implements TesterantoGraph {
        name: string;
        graph: typeof DirectedGraph;
        constructor(name: string);
        connect(to: any, from: any, relation?: string): void;
    }
    export class TesterantoGraphDirectedAcyclic implements TesterantoGraph {
        name: string;
        graph: typeof DirectedGraph;
        constructor(name: string);
        connect(to: any, from: any, relation?: string): void;
    }
    export class TesterantoFeatures {
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
    export type IT_FeatureNetwork = {
        name: string;
    };
}
declare module "IBaseConfig" {
    import { TesterantoFeatures } from "Features";
    export type ICollateMode = 'on' | 'off' | 'watch' | `serve` | `watch+serve` | `dev`;
    export type IBaseConfig = {
        clearScreen: boolean;
        collateMode: ICollateMode;
        features: TesterantoFeatures;
        loaders: any[];
        minify: boolean;
        outbase: string;
        outdir: string;
        ports: string[];
        collateEntry: string;
        runMode: boolean;
        tests: string[];
        buildMode: 'on' | 'off' | 'watch';
    };
}
declare module "index" {
    import { BaseFeature } from "Features";
    import { IBaseConfig } from "IBaseConfig";
    export type { IBaseConfig };
    type ITTestResourceConfiguration = {
        "fs": string;
        "ports": number[];
    };
    export type ITTestResourceRequirement = {
        "ports": number;
        "fs": string;
    };
    type IRunner = (x: ITTestResourceConfiguration, t: ITLog) => Promise<boolean>;
    export type IT = {
        toObj(): object;
        name: string;
        givens: BaseGiven<unknown, unknown, unknown, unknown, Record<string, BaseFeature>>[];
        checks: BaseCheck<unknown, unknown, unknown, unknown, ITTestShape, unknown>[];
        testResourceConfiguration: ITTestResourceConfiguration;
    };
    export type ITestJob = {
        toObj(): object;
        test: IT;
        runner: IRunner;
        testResourceRequirement: ITTestResourceRequirement;
        receiveTestResourceConfig: (testResource?: any) => boolean;
    };
    export type ITestResults = Promise<{
        test: IT;
    }>[];
    export type ITTestShape = {
        suites: any;
        givens: any;
        whens: any;
        thens: any;
        checks: any;
    };
    export type ITestSpecification<ITestShape extends ITTestShape, IFeatureShape> = (Suite: {
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
    export type ITestImplementation<IState, ISelection, IWhenShape, IThenShape, ITestShape extends ITTestShape> = {
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
    type ITestArtifactory = (key: string, value: string) => unknown;
    type ITLog = (...string: any[]) => void;
    export abstract class BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape extends ITTestShape, IFeatureShape> {
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
    export abstract class BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape> {
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
    export abstract class BaseWhen<IStore, ISelection, IThenShape> {
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
    export abstract class BaseThen<ISelection, IStore, IThenShape> {
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
    export abstract class BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape extends ITTestShape, IFeatureShape> {
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
    export abstract class TesterantoLevelZero<IInput, ISubject, IStore, ISelection, SuiteExtensions, GivenExtensions, WhenExtensions, ThenExtensions, CheckExtensions, IThenShape, IFeatureShape> {
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
    export abstract class TesterantoLevelOne<ITestShape extends ITTestShape, IInitialState, ISelection, IStore, ISubject, IWhenShape, IThenShape, IInput, IFeatureShape extends Record<string, BaseFeature>> {
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
        }) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape>[], input: IInput, suiteKlasser: (name: string, givens: BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>[], checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape>[]) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape>, givenKlasser: (n: any, f: any, w: any, t: any, z?: any) => BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>, whenKlasser: (s: any, o: any) => BaseWhen<IStore, ISelection, IThenShape>, thenKlasser: (s: any, o: any) => BaseThen<IStore, ISelection, IThenShape>, checkKlasser: (n: any, f: any, cb: any, w: any, t: any) => BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape>, testResourceRequirement: any, nameKey: string);
    }
    type ITestArtificer = (key: string, data: any) => void;
    const _default: <TestShape extends ITTestShape, Input, Subject, Store, Selection_1, WhenShape, ThenShape, InitialStateShape, IFeatureShape extends Record<string, BaseFeature>>(input: Input, testSpecification: ITestSpecification<TestShape, IFeatureShape>, testImplementation: any, testInterface: {
        actionHandler?: ((b: (...any: any[]) => any) => any) | undefined;
        andWhen: (store: Store, actioner: any, testResource: ITTestResourceConfiguration) => Promise<Selection_1>;
        butThen?: ((store: Store, callback: any, testResource: ITTestResourceConfiguration) => Promise<Selection_1>) | undefined;
        assertioner?: ((t: ThenShape) => any) | undefined;
        afterAll?: ((store: Store, artificer: ITestArtificer) => any) | undefined;
        afterEach?: ((store: Store, ndx: number, artificer: ITestArtificer) => Promise<unknown>) | undefined;
        beforeAll?: ((input: Input, artificer: ITestArtificer) => Promise<Subject>) | undefined;
        beforeEach?: ((subject: Subject, initialValues: any, testResource: ITTestResourceConfiguration, artificer: ITestArtificer) => Promise<Store>) | undefined;
    }, nameKey: string, testResourceRequirement?: ITTestResourceRequirement) => Promise<void>;
    export default _default;
}
declare module "Project" {
    import pm2 from 'pm2';
    import { TesterantoFeatures } from "Features";
    import { ICollateMode } from "IBaseConfig";
    import { IBaseConfig } from "index";
    type IPm2Process = {
        process: {
            namespace: string;
            versioning: object;
            name: string;
            pm_id: number;
        };
        data: {
            testResourceRequirement: {
                ports: number;
            };
        };
        at: string;
    };
    export default class Scheduler {
        project: ITProject;
        ports: Record<string, string>;
        jobs: Record<string, {
            aborter: () => any;
            cancellablePromise: string;
        }>;
        queue: IPm2Process[];
        spinCycle: number;
        spinAnimation: string;
        pm2: typeof pm2;
        summary: Record<string, boolean | undefined>;
        mode: `up` | `down`;
        constructor(project: ITProject);
        private checkForShutDown;
        abort(pm2Proc: IPm2Process): Promise<void>;
        private spinner;
        private push;
        private pop;
        private releaseTestResources;
        shutdown(): void;
    }
    export class ITProject {
        buildMode: 'on' | 'off' | 'watch';
        clearScreen: boolean;
        collateEntry: string;
        collateMode: ICollateMode;
        features: TesterantoFeatures;
        loaders: any[];
        minify: boolean;
        outbase: string;
        outdir: string;
        ports: string[];
        runMode: boolean;
        tests: string[];
        getEntryPoints(): string[];
        constructor(config: IBaseConfig);
    }
}
