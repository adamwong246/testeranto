import { IBaseTest, ICheckKlasser, IGivenKlasser, ISuiteKlasser, ITestSpecification, IThenKlasser, IWhenKlasser } from "../Types";
import { BaseCheck, BaseWhen, BaseThen, BaseGiven } from "./abstractBase.js";
import { ITTestResourceRequest, ITestJob, ILogWriter } from ".";
export declare abstract class BaseBuilder<ITestShape extends IBaseTest, SuiteExtensions, GivenExtensions, WhenExtensions, ThenExtensions, CheckExtensions> {
    readonly input: ITestShape['iinput'];
    specs: any;
    assertThis: (t: any) => {};
    testResourceRequirement: ITTestResourceRequest;
    artifacts: Promise<unknown>[];
    testJobs: ITestJob[];
    testSpecification: ITestSpecification<ITestShape>;
    suitesOverrides: Record<keyof SuiteExtensions, ISuiteKlasser<ITestShape>>;
    givenOverides: Record<keyof GivenExtensions, IGivenKlasser<ITestShape>>;
    whenOverides: Record<keyof WhenExtensions, IWhenKlasser<ITestShape>>;
    thenOverides: Record<keyof ThenExtensions, IThenKlasser<ITestShape>>;
    checkOverides: Record<keyof CheckExtensions, ICheckKlasser<ITestShape>>;
    constructor(input: ITestShape['iinput'], suitesOverrides: Record<keyof SuiteExtensions, ISuiteKlasser<ITestShape>>, givenOverides: Record<keyof GivenExtensions, IGivenKlasser<ITestShape>>, whenOverides: Record<keyof WhenExtensions, IWhenKlasser<ITestShape>>, thenOverides: Record<keyof ThenExtensions, IThenKlasser<ITestShape>>, checkOverides: Record<keyof CheckExtensions, ICheckKlasser<ITestShape>>, logWriter: ILogWriter, testResourceRequirement: ITTestResourceRequest, testSpecification: any);
    Specs(): any;
    Suites(): Record<keyof SuiteExtensions, ISuiteKlasser<ITestShape>>;
    Given(): Record<keyof GivenExtensions, (name: string, features: string[], whens: BaseWhen<ITestShape>[], thens: BaseThen<ITestShape>[], gcb: any) => BaseGiven<ITestShape>>;
    When(): Record<keyof WhenExtensions, (arg0: ITestShape['istore'], ...arg1: any) => BaseWhen<ITestShape>>;
    Then(): Record<keyof ThenExtensions, (selection: ITestShape['iselection'], expectation: any) => BaseThen<ITestShape>>;
    Check(): Record<keyof CheckExtensions, (feature: string, callback: (whens: any, thens: any) => any, whens: any, thens: any, x: any) => BaseCheck<ITestShape>>;
}
