import { IFinalResults, ITTestResourceRequest } from "./index.js";
import { ClassBuilder } from "./classBuilder.js";
import type { Ibdd_in_any, Ibdd_out_any, ITestImplementation, ITestInterface, ITestSpecification } from "../CoreTypes";
export default abstract class TesterantoCore<I extends Ibdd_in_any, O extends Ibdd_out_any, M> extends ClassBuilder<I, O, M> {
    constructor(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M> & {
        suites: Record<string, any>;
        givens: Record<string, any>;
        whens: Record<string, any>;
        thens: Record<string, any>;
        checks: Record<string, any>;
    }, testResourceRequirement: ITTestResourceRequest | undefined, testInterface: Partial<ITestInterface<I>>, uberCatcher: (cb: () => void) => void);
    abstract receiveTestResourceConfig(partialTestResource: string): Promise<IFinalResults>;
}
