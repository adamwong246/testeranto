import type { Ibdd_in, Ibdd_out, ITestImplementation, ITestInterface, ITestSpecification, IWebTestInterface } from "./Types";
import Testeranto from "./lib/core.js";
import { IFinalResults, ITTestResourceRequest } from "./lib/index.js";
export declare class WebTesteranto<I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> extends Testeranto<I, O> {
    constructor(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O>, testResourceRequirement: ITTestResourceRequest, testInterface: Partial<ITestInterface<I>>);
    receiveTestResourceConfig(partialTestResource: any): Promise<IFinalResults>;
}
declare const _default: <I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>>(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O>, testInterface: Partial<IWebTestInterface<I>>, testResourceRequirement?: ITTestResourceRequest) => Promise<Testeranto<I, O>>;
export default _default;
