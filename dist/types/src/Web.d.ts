import type { ITestImplementation, ITestInterface, ITestSpecification } from "./Types";
import Testeranto from "./lib/core.js";
import { ITTestResourceRequest } from "./lib/index.js";
export declare class WebTesteranto<I extends IT, O extends OT, M> extends Testeranto<I, O, M> {
    constructor(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M>, testResourceRequirement: ITTestResourceRequest, testInterface: Partial<ITestInterface<I>>);
    receiveTestResourceConfig(partialTestResource: any): Promise<import("./lib/index.js").IFinalResults>;
}
declare const _default: <I extends IT, O extends OT, M>(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M>, testInterface: Partial<IWebTestInterface<I>>, testResourceRequirement?: ITTestResourceRequest) => Promise<Testeranto<I, O, M>>;
export default _default;
