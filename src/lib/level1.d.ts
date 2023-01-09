import { BaseGiven, BaseCheck, BaseSuite, BaseFeature, BaseWhen, BaseThen } from "../BaseClasses";
import { ITTestShape, ITestImplementation } from "../types";
export declare abstract class TesterantoLevelOne<ITestShape extends ITTestShape, IInitialState, ISelection, IStore, ISubject, IWhenShape, IThenShape, IInput> {
    constructor(testImplementation: ITestImplementation<IInitialState, ISelection, IWhenShape, IThenShape, ITestShape>, testSpecification: (Suite: {
        [K in keyof ITestShape["suites"]]: (feature: string, givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[], checks: BaseCheck<ISubject, IStore, ISelection, IThenShape>[]) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape>;
    }, Given: {
        [K in keyof ITestShape["givens"]]: (name: string, features: BaseFeature[], whens: BaseWhen<IStore, ISelection, IThenShape>[], thens: BaseThen<ISelection, IStore, IThenShape>[], ...a: ITestShape["givens"][K]) => BaseGiven<ISubject, IStore, ISelection, IThenShape>;
    }, When: {
        [K in keyof ITestShape["whens"]]: (...a: ITestShape["whens"][K]) => BaseWhen<IStore, ISelection, IThenShape>;
    }, Then: {
        [K in keyof ITestShape["thens"]]: (...a: ITestShape["thens"][K]) => BaseThen<ISelection, IStore, IThenShape>;
    }, Check: {
        [K in keyof ITestShape["checks"]]: (name: string, features: BaseFeature[], cbz: (...any: any[]) => Promise<void>) => any;
    }) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape>[], input: IInput, suiteKlasser: (name: string, givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[], checks: BaseCheck<ISubject, IStore, ISelection, IThenShape>[]) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape>, givenKlasser: (n: any, f: any, w: any, t: any, z?: any) => BaseGiven<ISubject, IStore, ISelection, IThenShape>, whenKlasser: (s: any, o: any) => BaseWhen<IStore, ISelection, IThenShape>, thenKlasser: (s: any, o: any) => BaseThen<IStore, ISelection, IThenShape>, checkKlasser: (n: any, f: any, cb: any, w: any, t: any) => BaseCheck<ISubject, IStore, ISelection, IThenShape>, testResource: any);
}
