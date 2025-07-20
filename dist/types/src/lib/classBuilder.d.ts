import { NonEmptyObject } from "type-fest";
import type { Ibdd_in_any, Ibdd_out_any, ITestImplementation, ITestSpecification } from "../CoreTypes";
import { BaseBuilder } from "./basebuilder.js";
import { ISuiteKlasser, IGivenKlasser, IWhenKlasser, IThenKlasser } from "./types.js";
import { ITTestResourceRequest } from "./index.js";
type IExtenstions = Record<string, unknown>;
export declare abstract class ClassBuilder<I extends Ibdd_in_any = Ibdd_in_any, O extends Ibdd_out_any = Ibdd_out_any, M = unknown> extends BaseBuilder<I, O, IExtenstions, IExtenstions, IExtenstions, IExtenstions> {
    constructor(testImplementation: ITestImplementation<I, O, M> & {
        suites: Record<string, NonEmptyObject<object>>;
        givens: Record<string, any>;
        whens: Record<string, any>;
        thens: Record<string, any>;
    }, testSpecification: ITestSpecification<I, O>, input: I["iinput"], suiteKlasser: ISuiteKlasser<I, O>, givenKlasser: IGivenKlasser<I>, whenKlasser: IWhenKlasser<I>, thenKlasser: IThenKlasser<I>, testResourceRequirement: ITTestResourceRequest);
}
export {};
