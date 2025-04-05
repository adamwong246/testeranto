import { Ibdd_in, Ibdd_out, ITestImplementation, ITestSpecification } from "../Types.js";
import { BaseBuilder } from "./basebuilder.js";
import { ISuiteKlasser, IGivenKlasser, IWhenKlasser, IThenKlasser, ICheckKlasser } from "./types.js";
import { ITTestResourceRequest } from "./index.js";
export declare abstract class ClassBuilder<I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> extends BaseBuilder<I, O, any, any, any, any, any> {
    constructor(testImplementation: ITestImplementation<I, O>, testSpecification: ITestSpecification<I, O>, input: I["iinput"], suiteKlasser: ISuiteKlasser<I, O>, givenKlasser: IGivenKlasser<I>, whenKlasser: IWhenKlasser<I>, thenKlasser: IThenKlasser<I>, checkKlasser: ICheckKlasser<I, O>, testResourceRequirement: ITTestResourceRequest);
}
