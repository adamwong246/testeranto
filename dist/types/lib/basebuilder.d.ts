import { ITTestResourceRequest, ITestJob } from ".";
import { Ibdd_in, Ibdd_out, ITestSpecification } from "../Types.js";
import { ISuiteKlasser, IGivenKlasser, IWhenKlasser, IThenKlasser, ICheckKlasser } from "./types.js";
import { BaseCheck, BaseWhen, BaseThen, BaseGiven } from "./abstractBase.js";
import { PM } from "../PM/index.js";
export declare abstract class BaseBuilder<I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>, SuiteExtensions, GivenExtensions, WhenExtensions, ThenExtensions, CheckExtensions> {
    readonly input: I["iinput"];
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
    checkOverides: Record<keyof CheckExtensions, ICheckKlasser<I, O>>;
    puppetMaster: PM;
    constructor(input: I["iinput"], suitesOverrides: Record<keyof SuiteExtensions, ISuiteKlasser<I, O>>, givenOverides: Record<keyof GivenExtensions, IGivenKlasser<I>>, whenOverides: Record<keyof WhenExtensions, IWhenKlasser<I>>, thenOverides: Record<keyof ThenExtensions, IThenKlasser<I>>, checkOverides: Record<keyof CheckExtensions, ICheckKlasser<I, O>>, testResourceRequirement: ITTestResourceRequest, testSpecification: any);
    Specs(): any;
    Suites(): Record<keyof SuiteExtensions, ISuiteKlasser<I, O>>;
    Given(): Record<keyof GivenExtensions, (name: string, features: string[], whens: BaseWhen<I>[], thens: BaseThen<I>[], gcb: any) => BaseGiven<I>>;
    When(): Record<keyof WhenExtensions, (arg0: I["istore"], ...arg1: any) => BaseWhen<I>>;
    Then(): Record<keyof ThenExtensions, (selection: I["iselection"], expectation: any) => BaseThen<I>>;
    Check(): Record<keyof CheckExtensions, (feature: string, callback: (whens: any, thens: any) => any, whens: any, thens: any, x: any) => BaseCheck<I, O>>;
}
