import { ITTestShape, ITestImplementation, ITestSpecification } from "./Types";
import { BaseWhen, BaseThen, BaseCheck, BaseSuite, BaseGiven, IGivens } from "./base";
import { ILogWriter, ITTestResourceConfiguration, ITTestResourceRequest, ITestArtificer, ITestCheckCallback, ITestJob } from "./lib";
declare abstract class ClassBuilder<ITestShape extends ITTestShape, IInitialState, ISelection, IStore, ISubject, IWhenShape, IThenShape, IInput> {
    artifacts: Promise<unknown>[];
    testJobs: ITestJob[];
    constructor(testImplementation: ITestImplementation<IInput, IInitialState, ISelection, IWhenShape, IThenShape, ITestShape>, testSpecification: (Suite: {
        [K in keyof ITestShape["suites"]]: (feature: string, givens: IGivens<ISubject, IStore, ISelection, IThenShape>, checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>[]) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape>;
    }, Given: {
        [K in keyof ITestShape["givens"]]: (features: string[], whens: BaseWhen<IStore, ISelection, IThenShape>[], thens: BaseThen<ISelection, IStore, IThenShape>[], ...a: ITestShape["givens"][K]) => BaseGiven<ISubject, IStore, ISelection, IThenShape>;
    }, When: {
        [K in keyof ITestShape["whens"]]: (...a: ITestShape["whens"][K]) => BaseWhen<IStore, ISelection, IThenShape>;
    }, Then: {
        [K in keyof ITestShape["thens"]]: (...a: ITestShape["thens"][K]) => BaseThen<ISelection, IStore, IThenShape>;
    }, Check: ITestCheckCallback<ITestShape>, logWriter: ILogWriter) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape>[], input: IInput, suiteKlasser: (name: string, index: number, givens: IGivens<ISubject, IStore, ISelection, IThenShape>, checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>[]) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape>, givenKlasser: (n: any, f: any, w: any, t: any, z?: any) => BaseGiven<ISubject, IStore, ISelection, IThenShape>, whenKlasser: (s: any, o: any) => BaseWhen<IStore, ISelection, IThenShape>, thenKlasser: (s: any, o: any) => BaseThen<IStore, ISelection, IThenShape>, checkKlasser: (n: any, f: any, cb: any, w: any, t: any) => BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>, testResourceRequirement: any, logWriter: ILogWriter);
}
export default class Testeranto<TestShape extends ITTestShape, IState, ISelection, IStore, ISubject, WhenShape, ThenShape, IInput> extends ClassBuilder<TestShape, IState, ISelection, IStore, ISubject, WhenShape, ThenShape, IInput> {
    constructor(input: IInput, testSpecification: ITestSpecification<TestShape, ISubject, IStore, ISelection, ThenShape>, testImplementation: any, testInterface: {
        actionHandler?: (b: (...any: any[]) => any) => any;
        andWhen: (store: IStore, actioner: any, testResource: ITTestResourceConfiguration) => Promise<ISelection>;
        butThen?: (store: IStore, callback: any, testResource: ITTestResourceConfiguration) => Promise<ISelection>;
        assertioner?: (t: ThenShape) => any;
        afterAll?: (store: IStore, artificer: ITestArtificer) => any;
        afterEach?: (store: IStore, key: string, artificer: ITestArtificer) => Promise<unknown>;
        beforeAll?: (input: IInput, artificer: ITestArtificer, testResource: ITTestResourceConfiguration) => Promise<ISubject>;
        beforeEach?: (subject: ISubject, initialValues: any, testResource: ITTestResourceConfiguration, artificer: ITestArtificer) => Promise<IStore>;
    }, testResourceRequirement: ITTestResourceRequest | undefined, assertioner: (t: ThenShape) => any, beforeEach: (subject: ISubject, initialValues: any, testResource: ITTestResourceConfiguration, artificer: ITestArtificer) => Promise<IStore>, afterEach: (store: IStore, key: string, artificer: ITestArtificer) => Promise<unknown>, afterAll: (store: IStore, artificer: ITestArtificer) => any, butThen: (s: IStore, bt: (storeState: ISelection) => ThenShape, testResource: ITTestResourceConfiguration) => any, andWhen: (store: IStore, actioner: any, testResource: ITTestResourceConfiguration) => Promise<ISelection>, actionHandler: (b: (...any: any[]) => any) => any, logWriter: ILogWriter);
}
export {};
