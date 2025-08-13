import type { Ibdd_in_any, Ibdd_out_any, ITestSpecification } from "../CoreTypes";
import { ITestJob, ITTestResourceRequest } from ".";
import { ISuiteKlasser, IGivenKlasser, IWhenKlasser, IThenKlasser, IPM } from "./types.js";
import { BaseWhen, BaseThen, BaseGiven } from "./abstractBase.js";
export declare abstract class BaseBuilder<I extends Ibdd_in_any, O extends Ibdd_out_any, SuiteExtensions, GivenExtensions, WhenExtensions, ThenExtensions> {
    specs: any;
    assertThis: (t: I["then"]) => {};
    testResourceRequirement: ITTestResourceRequest;
    artifacts: Promise<unknown>[];
    testJobs: ITestJob[];
    testSpecification: ITestSpecification<I, O>;
    suitesOverrides: Record<keyof SuiteExtensions, ISuiteKlasser<I, O>>;
    givenOverides: Record<keyof GivenExtensions, IGivenKlasser<I>>;
    whenOverides: Record<keyof WhenExtensions, IWhenKlasser<I>>;
    thenOverides: Record<keyof ThenExtensions, IThenKlasser<I>>;
    puppetMaster: IPM;
    constructor(input: I["iinput"], suitesOverrides: Record<keyof SuiteExtensions, ISuiteKlasser<I, O>>, givenOverides: Record<keyof GivenExtensions, IGivenKlasser<I>>, whenOverides: Record<keyof WhenExtensions, IWhenKlasser<I>>, thenOverides: Record<keyof ThenExtensions, IThenKlasser<I>>, testResourceRequirement: ITTestResourceRequest, testSpecification: any);
    Specs(): any;
    Suites(): Record<keyof SuiteExtensions, ISuiteKlasser<I, O>>;
    Given(): Record<keyof GivenExtensions, (name: string, features: string[], whens: BaseWhen<I>[], thens: BaseThen<I>[], gcb: any) => BaseGiven<I>>;
    When(): Record<keyof WhenExtensions, (arg0: I["istore"], ...arg1: any) => BaseWhen<I>>;
    Then(): Record<keyof ThenExtensions, (selection: I["iselection"], expectation: any) => BaseThen<I>>;
}
