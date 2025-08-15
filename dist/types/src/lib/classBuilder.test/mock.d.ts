import { Ibdd_in_any, Ibdd_out_any, ITestImplementation, ITestSpecification } from "../../CoreTypes";
import { ClassBuilder } from "../classBuilder";
import { ISuiteKlasser, IGivenKlasser, IWhenKlasser, IThenKlasser } from "../types";
import { ITTestResourceRequest } from "..";
/**
 * Concrete testable implementation of ClassBuilder for testing
 */
export default class TestClassBuilderMock<I extends Ibdd_in_any, O extends Ibdd_out_any, M = unknown> extends ClassBuilder<I, O, M> {
    testJobs: any[];
    specs: any[];
    artifacts: any[];
    summary: Record<string, any>;
    constructor(testImplementation: ITestImplementation<I, O, M>, testSpecification: ITestSpecification<I, O>, input: I["iinput"], suiteKlasser: ISuiteKlasser<I, O>, givenKlasser: IGivenKlasser<I>, whenKlasser: IWhenKlasser<I>, thenKlasser: IThenKlasser<I>, testResourceRequirement: ITTestResourceRequest);
}
