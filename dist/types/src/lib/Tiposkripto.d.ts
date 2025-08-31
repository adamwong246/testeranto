import { NonEmptyObject } from "type-fest";
import type { Ibdd_in_any, Ibdd_out_any, ITestImplementation, ITestSpecification, ITestAdapter } from "../CoreTypes";
import { ITestJob, IFinalResults, ITTestResourceRequest } from "./index.js";
import { BaseGiven } from "./BaseGiven";
import { BaseWhen } from "./BaseWhen.js";
import { BaseThen } from "./BaseThen.js";
import { IPM } from "./types.js";
type IExtenstions = Record<string, unknown>;
export default abstract class Tiposkripto<I extends Ibdd_in_any = Ibdd_in_any, O extends Ibdd_out_any = Ibdd_out_any, M = unknown> {
    abstract receiveTestResourceConfig(partialTestResource: string): Promise<IFinalResults>;
    specs: any;
    assertThis: (t: I["then"]) => any;
    testResourceRequirement: ITTestResourceRequest;
    artifacts: Promise<unknown>[];
    testJobs: ITestJob[];
    private totalTests;
    testSpecification: ITestSpecification<I, O>;
    suitesOverrides: Record<keyof IExtenstions, any>;
    givenOverides: Record<keyof IExtenstions, any>;
    whenOverides: Record<keyof IExtenstions, any>;
    thenOverides: Record<keyof IExtenstions, any>;
    puppetMaster: IPM;
    constructor(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M> & {
        suites: Record<string, NonEmptyObject<object>>;
        givens: Record<string, any>;
        whens: Record<string, any>;
        thens: Record<string, any>;
    }, testResourceRequirement?: ITTestResourceRequest, testAdapter?: Partial<ITestAdapter<I>>, uberCatcher?: (cb: () => void) => void);
    Specs(): any;
    Suites(): Record<string, any>;
    Given(): Record<keyof IExtenstions, (name: string, features: string[], whens: BaseWhen<I>[], thens: BaseThen<I>[], gcb: I["given"]) => BaseGiven<I>>;
    When(): Record<keyof IExtenstions, (arg0: I["istore"], ...arg1: any) => BaseWhen<I>>;
    Then(): Record<keyof IExtenstions, (selection: I["iselection"], expectation: any) => BaseThen<I>>;
    getTestJobs(): ITestJob[];
    private calculateTotalTests;
}
export {};
