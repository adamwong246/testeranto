import { ITestImplementation, ITestSpecification } from "./Types";
import { BaseWhen, BaseThen, BaseCheck, BaseSuite, BaseGiven, IGivens } from "./base";
import { ILogWriter, ITTestResourceConfiguration, ITTestResourceRequest, ITTestShape, ITestArtificer, ITestCheckCallback, ITestJob } from "./lib";
declare abstract class ClassBuilder<ITestShape extends ITTestShape, IInitialState, ISelection, IStore, ISubject, IWhenShape, IThenShape, IInput, IGivenShape> {
    artifacts: Promise<unknown>[];
    testJobs: ITestJob[];
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
export default class Testeranto<TestShape extends ITTestShape, IState, ISelection, IStore, ISubject, IWhenShape, IThenShape, IInput, IGivenShape> extends ClassBuilder<TestShape, IState, ISelection, IStore, ISubject, IWhenShape, IThenShape, IInput, IGivenShape> {
    constructor(input: IInput, testSpecification: ITestSpecification<TestShape, ISubject, IStore, ISelection, IThenShape, IGivenShape>, testImplementation: any, testResourceRequirement: ITTestResourceRequest | undefined, logWriter: ILogWriter, beforeAll: (input: IInput, artificer: ITestArtificer, testResource: ITTestResourceConfiguration) => Promise<ISubject>, beforeEach: (subject: ISubject, initialValues: any, testResource: ITTestResourceConfiguration, artificer: ITestArtificer) => Promise<IStore>, afterEach: (store: IStore, key: string, artificer: ITestArtificer) => Promise<unknown>, afterAll: (store: IStore, artificer: ITestArtificer) => any, butThen: (s: IStore, thenCB: (storeState: ISelection) => IThenShape, testResource: ITTestResourceConfiguration) => any, andWhen: (store: IStore, whenCB: any, testResource: ITTestResourceConfiguration) => Promise<ISelection>);
}
export {};
