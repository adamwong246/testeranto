import { ITTestResourceRequest, ITestJob, ILogWriter } from ".";
import { IBaseTest, IUtils } from "../Types";
import { IGivens, BaseCheck, BaseSuite, BaseWhen, BaseThen, BaseGiven } from "./abstractBase";
export declare abstract class BaseBuilder<ITestShape extends IBaseTest, SuiteExtensions, GivenExtensions, WhenExtensions, ThenExtensions, CheckExtensions> {
    readonly input: ITestShape['iinput'];
    assertThis: (t: any) => {};
    testResourceRequirement: ITTestResourceRequest;
    artifacts: Promise<unknown>[];
    testJobs: ITestJob[];
    suitesOverrides: Record<keyof SuiteExtensions, (name: string, index: number, givens: IGivens<ITestShape>, checks: BaseCheck<ITestShape>[]) => BaseSuite<ITestShape>>;
    givenOverides: Record<keyof GivenExtensions, (name: string, features: string[], whens: BaseWhen<ITestShape>[], thens: BaseThen<ITestShape>[], gcb: any) => BaseGiven<ITestShape>>;
    whenOverides: Record<keyof WhenExtensions, (any: any) => BaseWhen<ITestShape>>;
    thenOverides: Record<keyof ThenExtensions, (selection: ITestShape['iselection'], expectation: any) => BaseThen<ITestShape>>;
    checkOverides: Record<keyof CheckExtensions, (feature: string, callback: (whens: any, thens: any) => any, ...xtraArgs: any[]) => BaseCheck<ITestShape>>;
    constructor(input: ITestShape['iinput'], suitesOverrides: Record<keyof SuiteExtensions, (name: string, index: number, givens: IGivens<ITestShape>, checks: BaseCheck<ITestShape>[]) => BaseSuite<ITestShape>>, givenOverides: Record<keyof GivenExtensions, (name: string, features: string[], whens: BaseWhen<ITestShape>[], thens: BaseThen<ITestShape>[], gcb: any) => BaseGiven<ITestShape>>, whenOverides: Record<keyof WhenExtensions, (c: any) => BaseWhen<ITestShape>>, thenOverides: Record<keyof ThenExtensions, (selection: ITestShape['iselection'], expectation: any) => BaseThen<ITestShape>>, checkOverides: Record<keyof CheckExtensions, (feature: string, callback: (whens: any, thens: any) => any, ...xtraArgs: any[]) => BaseCheck<ITestShape>>, logWriter: ILogWriter, testResourceRequirement: ITTestResourceRequest, testSpecification: any, utils: IUtils);
    Suites(): Record<keyof SuiteExtensions, (name: string, index: number, givens: IGivens<ITestShape>, checks: BaseCheck<ITestShape>[]) => BaseSuite<ITestShape>>;
    Given(): Record<keyof GivenExtensions, (name: string, features: string[], whens: BaseWhen<ITestShape>[], thens: BaseThen<ITestShape>[], gcb: any) => BaseGiven<ITestShape>>;
    When(): Record<keyof WhenExtensions, (arg0: ITestShape['istore'], ...arg1: any) => BaseWhen<ITestShape>>;
    Then(): Record<keyof ThenExtensions, (selection: ITestShape['iselection'], expectation: any) => BaseThen<ITestShape>>;
    Check(): Record<keyof CheckExtensions, (feature: string, callback: (whens: any, thens: any) => any, whens: any, thens: any) => BaseCheck<ITestShape>>;
}
