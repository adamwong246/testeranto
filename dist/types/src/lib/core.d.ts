import { ITestSpecification, ITestImplementation, ITestInterface, Ibdd_in, Ibdd_out } from "../Types.js";
import { IFinalResults, ITTestResourceRequest } from "./index.js";
import { ClassBuilder } from "./classBuilder.js";
export default abstract class Testeranto<I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> extends ClassBuilder<I, O> {
    constructor(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O>, testResourceRequirement: ITTestResourceRequest | undefined, testInterface: Partial<ITestInterface<I>>, uberCatcher: (cb: any) => void);
    abstract receiveTestResourceConfig(partialTestResource: string): Promise<IFinalResults>;
}
