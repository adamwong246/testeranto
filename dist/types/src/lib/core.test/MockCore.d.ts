import TesterantoCore from "../core";
import { Ibdd_in_any, Ibdd_out_any, ITestImplementation, ITestSpecification, ITestInterface } from "../../CoreTypes";
import { ITTestResourceRequest, IFinalResults } from "..";
/**
 * Concrete implementation of Testeranto for testing purposes
 */
export declare class MockCore<I extends Ibdd_in_any, O extends Ibdd_out_any, M = unknown> extends TesterantoCore<I, O, M> {
    constructor(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M>, testResourceRequirement?: ITTestResourceRequest, testInterface?: Partial<ITestInterface<I>>, uberCatcher?: (cb: () => void) => void);
    receiveTestResourceConfig(partialTestResource: string): Promise<IFinalResults>;
}
