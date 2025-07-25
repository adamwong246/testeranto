import type { Ibdd_in_any, Ibdd_out_any, ITestImplementation, ITestAdapter, ITestSpecification } from "../CoreTypes";
import { IFinalResults, ITTestResourceRequest } from "./index.js";
import { ClassBuilder } from "./classBuilder.js";
export default abstract class TesterantoCore<I extends Ibdd_in_any, O extends Ibdd_out_any, M> extends ClassBuilder<I, O, M> {
    constructor(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M> & {
        suites: Record<string, any>;
        givens: Record<string, any>;
        whens: Record<string, any>;
        thens: Record<string, any>;
    }, testResourceRequirement: ITTestResourceRequest | undefined, testAdapter: Partial<ITestAdapter<I>>, uberCatcher: (cb: () => void) => void);
    abstract receiveTestResourceConfig(partialTestResource: string): Promise<IFinalResults>;
}
