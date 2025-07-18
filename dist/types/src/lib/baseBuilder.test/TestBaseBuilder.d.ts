import { BaseBuilder } from "../basebuilder";
import { Ibdd_in_any, Ibdd_out_any, ITestSpecification } from "../../CoreTypes";
import { ISuiteKlasser, IGivenKlasser, IWhenKlasser, IThenKlasser, ICheckKlasser } from "../types";
import { ITTestResourceRequest } from "..";
/**
 * Concrete implementation of BaseBuilder for testing purposes only
 */
export declare class TestBaseBuilder<I extends Ibdd_in_any, O extends Ibdd_out_any, SuiteExtensions = {}, GivenExtensions = {}, WhenExtensions = {}, ThenExtensions = {}, CheckExtensions = {}> extends BaseBuilder<I, O, SuiteExtensions, GivenExtensions, WhenExtensions, ThenExtensions, CheckExtensions> {
    summary: Record<string, any>;
    constructor(input: I["iinput"], suitesOverrides?: Record<keyof SuiteExtensions, ISuiteKlasser<I, O>>, givenOverrides?: Record<keyof GivenExtensions, IGivenKlasser<I>>, whenOverrides?: Record<keyof WhenExtensions, IWhenKlasser<I>>, thenOverrides?: Record<keyof ThenExtensions, IThenKlasser<I>>, checkOverrides?: Record<keyof CheckExtensions, ICheckKlasser<I>>, testResourceRequirement?: ITTestResourceRequest, testSpecification?: ITestSpecification<I, O>);
    /**
     * Simplified version for testing that doesn't actually run tests
     */
    testRun(puppetMaster: any): Promise<any>;
}
