import Testeranto from "./lib/core.js";
import { ITTestResourceRequest } from "./lib/index.js";
import type { Ibdd_in, Ibdd_out, INodeTestInterface, ITestImplementation, ITestInterface, ITestSpecification } from "./Types.js";
export declare class NodeTesteranto<I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> extends Testeranto<I, O> {
    constructor(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O>, testResourceRequirement: ITTestResourceRequest, testInterface: Partial<ITestInterface<I>>);
    receiveTestResourceConfig(partialTestResource: string): Promise<{
        features: string[];
        failed: number;
    }>;
}
declare const _default: <I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>>(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O>, testInterface: Partial<INodeTestInterface<I>>, testResourceRequirement?: ITTestResourceRequest) => Promise<Testeranto<I, O>>;
export default _default;
