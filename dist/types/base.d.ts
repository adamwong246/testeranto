import { ITTestShape, ITTestResourceConfiguration, ITestArtifactory, ITLog } from "./lib";
export declare type IGivens<ISubject, IStore, ISelection, IThenShape> = Record<string, BaseGiven<ISubject, IStore, ISelection, IThenShape>>;
export declare abstract class BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape extends ITTestShape> {
    name: string;
    givens: IGivens<ISubject, IStore, ISelection, IThenShape>;
    checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>[];
    store: IStore;
    fails: BaseGiven<ISubject, IStore, ISelection, IThenShape>[];
    testResourceConfiguration: ITTestResourceConfiguration;
    index: number;
    constructor(name: string, index: number, givens?: IGivens<ISubject, IStore, ISelection, IThenShape>, checks?: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>[]);
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
    run(input: any, testResourceConfiguration: ITTestResourceConfiguration, artifactory: (fPath: string, value: unknown) => void, tLog: (...string: any[]) => void): Promise<BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape>>;
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
