import Testeranto from "./lib/core.js";
import { ITTestResourceRequest } from "./lib/index.js";
import { ITestSpecification, ITestImplementation, ITestAdapter, Ibdd_in_any, Ibdd_out_any, Ibdd_out } from "./CoreTypes.js";
export declare class NodeTesteranto<I extends Ibdd_in_any, O extends Ibdd_out_any, M> extends Testeranto<I, O, M> {
    constructor(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M>, testResourceRequirement: ITTestResourceRequest, testAdapter: Partial<ITestAdapter<I>>);
    receiveTestResourceConfig(partialTestResource: string): Promise<import("./lib/index.js").IFinalResults>;
}
declare const testeranto: <I extends Ibdd_in_any, O extends Ibdd_out, M>(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M>, testAdapter: Partial<INodeAdapter<I>>, testResourceRequirement?: ITTestResourceRequest) => Promise<Testeranto<I, O, M>>;
export default testeranto;
