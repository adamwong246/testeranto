import { Ibdd_in_any, Ibdd_out, ITestImplementation, ITestInterface, ITestSpecification } from "./CoreTypes.js";
import Testeranto from "./lib/core.js";
import { ITTestResourceRequest } from "./lib/index.js";
export declare class PureTesteranto<I extends Ibdd_in_any, O extends Ibdd_out, M> extends Testeranto<I, O, M> {
    constructor(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M>, testResourceRequirement: ITTestResourceRequest, testInterface: Partial<ITestInterface<I>>);
    receiveTestResourceConfig(partialTestResource: string): Promise<import("./lib/index.js").IFinalResults | -2>;
}
declare const _default: <I extends Ibdd_in_any, O extends Ibdd_out, M>(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M>, testInterface: Partial<ITestInterface<I>>, testResourceRequirement?: ITTestResourceRequest) => Promise<number | Testeranto<I, O, M>>;
export default _default;
