export declare type IImplementer<IImplementation> = {
    name: string;
    fs: string;
    ports: number[];
};
export declare type ITTestResourceConfiguration = {
    name: string;
    fs: string;
    ports: number[];
};
export declare type ITTestResourceRequirement = {
    name: string;
    ports: number;
    fs: string;
};
export declare type ITTestResourceRequest = {
    ports: number;
};
export declare type Modify<Type, Replace> = Omit<Type, keyof Replace> & Replace;
export declare type ITTestShape = {
    suites: any;
    givens: any;
    whens: any;
    thens: any;
    checks: any;
};
export declare type ILogWriter = {
    createWriteStream: (line: string) => any | any;
    writeFileSync: (fp: string, contents: string) => any;
    mkdirSync: (fp: string) => any;
    testArtiFactoryfileWriter: (tLog: ITLog) => (fp: any) => (givenNdx: any) => (key: any, value: any) => void;
    startup: (testResource: string, t: ITestJob, testResourceRequirement: ITTestResourceRequirement) => Promise<any>;
};
declare type IGivens<ISubject, IStore, ISelection, IThenShape> = Record<string, BaseGiven<ISubject, IStore, ISelection, IThenShape>>;
declare type ITestCheckCallback<ITestShape extends ITTestShape> = {
    [K in keyof ITestShape["checks"]]: (name: string, features: string[], callbackA: (whens: {
        [K in keyof ITestShape["whens"]]: (...unknown: any[]) => BaseWhen<unknown, unknown, unknown>;
    }, thens: {
        [K in keyof ITestShape["thens"]]: (...unknown: any[]) => BaseThen<unknown, unknown, unknown>;
    }) => Promise<any>, ...xtrasA: ITestShape["checks"][K]) => BaseCheck<unknown, unknown, unknown, unknown, ITestShape>;
};
export declare type ITestSpecification<ITestShape extends ITTestShape> = (Suite: {
    [K in keyof ITestShape["suites"]]: (name: string, givens: IGivens<unknown, unknown, unknown, unknown>, checks: BaseCheck<unknown, unknown, unknown, unknown, ITestShape>[]) => BaseSuite<unknown, unknown, unknown, unknown, unknown, ITestShape>;
}, Given: {
    [K in keyof ITestShape["givens"]]: (features: string[], whens: BaseWhen<unknown, unknown, unknown>[], thens: BaseThen<unknown, unknown, unknown>[], ...xtrasB: ITestShape["givens"][K]) => BaseGiven<unknown, unknown, unknown, unknown>;
}, When: {
    [K in keyof ITestShape["whens"]]: (...xtrasC: ITestShape["whens"][K]) => BaseWhen<unknown, unknown, unknown>;
}, Then: {
    [K in keyof ITestShape["thens"]]: (...xtrasD: ITestShape["thens"][K]) => BaseThen<unknown, unknown, unknown>;
}, Check: ITestCheckCallback<ITestShape>) => any[];
export declare type ITestArtificer = (key: string, data: any) => void;
export declare type IRunTimeAndSubject = {
    runtime: "just node" | "just web" | "both web and node";
    entrypoint: string;
};
declare type IRunner = (x: ITTestResourceConfiguration, t: ITLog) => Promise<boolean>;
export declare type IT = {
    toObj(): object;
    name: string;
    givens: IGivens<unknown, unknown, unknown, unknown>;
    checks: BaseCheck<unknown, unknown, unknown, unknown, ITTestShape>[];
    testResourceConfiguration: ITTestResourceConfiguration;
};
export declare type ITestJob = {
    toObj(): object;
    test: IT;
    runner: IRunner;
    testResourceRequirement: ITTestResourceRequirement;
    receiveTestResourceConfig: (testResource?: any) => boolean;
};
export declare type ITestResults = Promise<{
    test: IT;
}>[];
export declare const defaultTestResourceRequirement: ITTestResourceRequest;
export declare type ITestArtifactory = (key: string, value: string) => unknown;
export declare type ITLog = (...string: any[]) => void;
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
export declare abstract class BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape extends ITTestShape> {
    name: string;
    givens: IGivens<ISubject, IStore, ISelection, IThenShape>;
    checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>[];
    store: IStore;
    fails: BaseGiven<ISubject, IStore, ISelection, IThenShape>[];
    testResourceConfiguration: ITTestResourceConfiguration;
    constructor(name: string, givens?: IGivens<ISubject, IStore, ISelection, IThenShape>, checks?: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>[]);
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
        fails: BaseGiven<ISubject, IStore, ISelection, IThenShape>[];
    };
    setup(s: IInput, artifactory: ITestArtifactory): Promise<ISubject>;
    test(t: IThenShape): unknown;
    run(input: any, testResourceConfiguration: ITTestResourceConfiguration, artifactory: (gndex: string) => (a: string, b: string) => void, tLog: (...string: any[]) => void): Promise<BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape>>;
}
export declare abstract class BaseGiven<ISubject, IStore, ISelection, IThenShape> {
    name: string;
    features: string[];
    whens: BaseWhen<IStore, ISelection, IThenShape>[];
    thens: BaseThen<ISelection, IStore, IThenShape>[];
    error: Error;
    store: IStore;
    recommendedFsPath: string;
    constructor(name: string, features: string[], whens: BaseWhen<IStore, ISelection, IThenShape>[], thens: BaseThen<ISelection, IStore, IThenShape>[]);
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
    abstract givenThat(subject: ISubject, testResourceConfiguration: any, artifactory: ITestArtifactory): Promise<IStore>;
    afterEach(store: IStore, key: string, artifactory: ITestArtifactory): Promise<unknown>;
    give(subject: ISubject, key: string, testResourceConfiguration: any, tester: any, artifactory: ITestArtifactory, tLog: ITLog): Promise<IStore>;
}
export declare abstract class BaseWhen<IStore, ISelection, IThenShape> {
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
declare abstract class TesterantoLevelOne<ITestShape extends ITTestShape, IInitialState, ISelection, IStore, ISubject, IWhenShape, IThenShape, IInput> {
    constructor(testImplementation: ITestImplementation<IInitialState, ISelection, IWhenShape, IThenShape, ITestShape>, testSpecification: (Suite: {
        [K in keyof ITestShape["suites"]]: (feature: string, givens: IGivens<ISubject, IStore, ISelection, IThenShape>, checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>[]) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape>;
    }, Given: {
        [K in keyof ITestShape["givens"]]: (features: string[], whens: BaseWhen<IStore, ISelection, IThenShape>[], thens: BaseThen<ISelection, IStore, IThenShape>[], ...a: ITestShape["givens"][K]) => BaseGiven<ISubject, IStore, ISelection, IThenShape>;
    }, When: {
        [K in keyof ITestShape["whens"]]: (...a: ITestShape["whens"][K]) => BaseWhen<IStore, ISelection, IThenShape>;
    }, Then: {
        [K in keyof ITestShape["thens"]]: (...a: ITestShape["thens"][K]) => BaseThen<ISelection, IStore, IThenShape>;
    }, Check: ITestCheckCallback<ITestShape>, logWriter: ILogWriter) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape>[], input: IInput, suiteKlasser: (name: string, givens: IGivens<ISubject, IStore, ISelection, IThenShape>, checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>[]) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape>, givenKlasser: (n: any, f: any, w: any, t: any, z?: any) => BaseGiven<ISubject, IStore, ISelection, IThenShape>, whenKlasser: (s: any, o: any) => BaseWhen<IStore, ISelection, IThenShape>, thenKlasser: (s: any, o: any) => BaseThen<IStore, ISelection, IThenShape>, checkKlasser: (n: any, f: any, cb: any, w: any, t: any) => BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>, testResourceRequirement: any, logWriter: ILogWriter);
}
export default class TesterantoLevelTwo<TestShape extends ITTestShape, InitialStateShape, Selection, Store, Subject, WhenShape, ThenShape, Input> extends TesterantoLevelOne<TestShape, InitialStateShape, Selection, Store, Subject, WhenShape, ThenShape, Input> {
    constructor(input: Input, testSpecification: ITestSpecification<TestShape>, testImplementation: any, testInterface: {
        actionHandler?: (b: (...any: any[]) => any) => any;
        andWhen: (store: Store, actioner: any, testResource: ITTestResourceConfiguration) => Promise<Selection>;
        butThen?: (store: Store, callback: any, testResource: ITTestResourceConfiguration) => Promise<Selection>;
        assertioner?: (t: ThenShape) => any;
        afterAll?: (store: Store, artificer: ITestArtificer) => any;
        afterEach?: (store: Store, key: string, artificer: ITestArtificer) => Promise<unknown>;
        beforeAll?: (input: Input, artificer: ITestArtificer, testResource: ITTestResourceConfiguration) => Promise<Subject>;
        beforeEach?: (subject: Subject, initialValues: any, testResource: ITTestResourceConfiguration, artificer: ITestArtificer) => Promise<Store>;
    }, testResourceRequirement: ITTestResourceRequest | undefined, assertioner: (t: ThenShape) => any, beforeEach: (subject: Subject, initialValues: any, testResource: ITTestResourceConfiguration, artificer: ITestArtificer) => Promise<Store>, afterEach: (store: Store, key: string, artificer: ITestArtificer) => Promise<unknown>, afterAll: (store: Store, artificer: ITestArtificer) => any, butThen: (s: Store, bt: (storeState: Selection) => ThenShape, testResource: ITTestResourceConfiguration) => any, andWhen: (store: Store, actioner: any, testResource: ITTestResourceConfiguration) => Promise<Selection>, actionHandler: (b: (...any: any[]) => any) => any, logWriter: ILogWriter);
}
export {};
