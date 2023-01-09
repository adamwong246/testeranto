/// <reference types="node" />
import { ITTestResource } from "./types";
export declare class BaseFeature {
    name: string;
    constructor(name: string);
}
export declare abstract class BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape> {
    name: string;
    givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[];
    checks: BaseCheck<ISubject, IStore, ISelection, IThenShape>[];
    store: IStore;
    aborted: boolean;
    fails: BaseGiven<ISubject, IStore, ISelection, IThenShape>[];
    constructor(name: string, givens?: BaseGiven<ISubject, IStore, ISelection, IThenShape>[], checks?: BaseCheck<ISubject, IStore, ISelection, IThenShape>[]);
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
export declare abstract class BaseGiven<ISubject, IStore, ISelection, IThenShape> {
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
export declare abstract class BaseCheck<ISubject, IStore, ISelection, IThenShape> {
    name: string;
    features: BaseFeature[];
    checkCB: (whens: any, thens: any) => any;
    whens: BaseWhen<IStore, ISelection, IThenShape>[];
    thens: BaseThen<ISelection, IStore, IThenShape>[];
    constructor(name: string, features: BaseFeature[], checkCB: (whens: BaseWhen<IStore, ISelection, IThenShape>[], thens: BaseThen<ISelection, IStore, IThenShape>[]) => any, whens: BaseWhen<IStore, ISelection, IThenShape>[], thens: BaseThen<ISelection, IStore, IThenShape>[]);
    abstract checkThat(subject: ISubject, testResourceConfiguration?: any): Promise<IStore>;
    afterEach(store: IStore, ndx: number, cb?: any): Promise<unknown>;
    check(subject: ISubject, ndx: number, testResourceConfiguration: any, tester: any): Promise<void>;
}
export {};
