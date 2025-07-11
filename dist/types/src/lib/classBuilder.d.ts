import { IT, ITestImplementation, ITestSpecification, OT } from "../Types.js";
import { BaseBuilder } from "./basebuilder.js";
import { ISuiteKlasser, IGivenKlasser, IWhenKlasser, IThenKlasser, ICheckKlasser } from "./types.js";
import { ITTestResourceRequest } from "./index.js";
type IExtenstions = Record<string, unknown>;
export declare abstract class ClassBuilder<I extends IT = IT, O extends OT = OT, M = unknown> extends BaseBuilder<I, O, IExtenstions, IExtenstions, IExtenstions, IExtenstions, IExtenstions> {
    constructor(testImplementation: ITestImplementation<I, O, M> & {
        suites: Record<string, any>;
        givens: Record<string, any>;
        whens: Record<string, any>;
        thens: Record<string, any>;
        checks: Record<string, any>;
    }, testSpecification: ITestSpecification<I, O>, input: I["iinput"], suiteKlasser: ISuiteKlasser<I, O>, givenKlasser: IGivenKlasser<I>, whenKlasser: IWhenKlasser<I>, thenKlasser: IThenKlasser<I>, checkKlasser: ICheckKlasser<I>, testResourceRequirement: ITTestResourceRequest);
}
export {};
