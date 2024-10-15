import { BrowserWindow } from "electron";
import { ITestCheckCallback, ILogWriter, ITTestResourceRequest } from ".";
import { IBaseTest, ITestImplementation, TBrowser } from "../Types";
import { IGivens, BaseCheck, BaseSuite, BaseWhen, BaseThen, BaseGiven } from "./abstractBase";
import { BaseBuilder } from "./basebuilder";
export declare abstract class ClassBuilder<ITestShape extends IBaseTest> extends BaseBuilder<ITestShape, any, any, any, any, any> {
    constructor(testImplementation: ITestImplementation<ITestShape, any>, testSpecification: (Suite: {
        [K in keyof ITestShape["suites"]]: (feature: string, givens: IGivens<ITestShape>, checks: BaseCheck<ITestShape>[]) => BaseSuite<ITestShape>;
    }, Given: {
        [K in keyof ITestShape["givens"]]: (features: string[], whens: BaseWhen<ITestShape>[], thens: BaseThen<ITestShape>[], ...a: ITestShape["givens"][K]) => BaseGiven<ITestShape>;
    }, When: {
        [K in keyof ITestShape["whens"]]: (...a: ITestShape["whens"][K]) => BaseWhen<ITestShape>;
    }, Then: {
        [K in keyof ITestShape["thens"]]: (...a: ITestShape["thens"][K]) => BaseThen<ITestShape>;
    }, Check: ITestCheckCallback<ITestShape>, logWriter: ILogWriter) => BaseSuite<ITestShape>[], input: ITestShape['iinput'], suiteKlasser: (name: string, index: number, givens: IGivens<ITestShape>, checks: BaseCheck<ITestShape>[]) => BaseSuite<ITestShape>, givenKlasser: (name: any, features: any, whens: any, thens: any, givenCB: any) => BaseGiven<ITestShape>, whenKlasser: (s: any, o: any) => BaseWhen<ITestShape>, thenKlasser: (s: any, o: any) => BaseThen<ITestShape>, checkKlasser: (n: any, f: any, cb: any, w: any, t: any) => BaseCheck<ITestShape>, testResourceRequirement: ITTestResourceRequest, logWriter: ILogWriter, utils: TBrowser | BrowserWindow);
}
