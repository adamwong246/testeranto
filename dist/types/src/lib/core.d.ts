import { ITestSpecification, ITestImplementation, ITestInterface, IT, OT } from "../Types.js";
import { IFinalResults, ITTestResourceRequest } from "./index.js";
import { ClassBuilder } from "./classBuilder.js";
export default abstract class Testeranto<I extends IT, O extends OT, M> extends ClassBuilder<I, O, M> {
    constructor(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M> & {
        suites: Record<string, any>;
        givens: Record<string, any>;
        whens: Record<string, any>;
        thens: Record<string, any>;
        checks: Record<string, any>;
    }, testResourceRequirement: ITTestResourceRequest | undefined, testInterface: Partial<ITestInterface<I>>, uberCatcher: (cb: () => void) => void);
    abstract receiveTestResourceConfig(partialTestResource: string): Promise<IFinalResults>;
}
