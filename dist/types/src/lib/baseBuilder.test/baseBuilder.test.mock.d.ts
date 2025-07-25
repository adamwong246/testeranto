import { Ibdd_in_any, Ibdd_out_any, ITestSpecification } from "../../CoreTypes";
import { BaseBuilder } from "../basebuilder";
import { ISuiteKlasser, IGivenKlasser, IWhenKlasser, IThenKlasser } from "../types";
import { ITTestResourceRequest } from "..";
/**
 * Concrete implementation of BaseBuilder for testing purposes only
 */
export declare class MockBaseBuilder<I extends Ibdd_in_any, O extends Ibdd_out_any, SuiteExtensions = {}, GivenExtensions = {}, WhenExtensions = {}, ThenExtensions = {}> extends BaseBuilder<I, O, SuiteExtensions, GivenExtensions, WhenExtensions, ThenExtensions> {
    summary: Record<string, any>;
    constructor(input: I["iinput"], suitesOverrides?: Record<keyof SuiteExtensions, ISuiteKlasser<I, O>>, givenOverrides?: Record<keyof GivenExtensions, IGivenKlasser<I>>, whenOverrides?: Record<keyof WhenExtensions, IWhenKlasser<I>>, thenOverrides?: Record<keyof ThenExtensions, IThenKlasser<I>>, testResourceRequirement?: ITTestResourceRequest, testSpecification?: ITestSpecification<I, O>);
    /**
     * Simplified version for testing that doesn't actually run tests
     */
    testRun(puppetMaster: any): Promise<any>;
}
