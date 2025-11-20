import { ITestSpecification, ITestImplementation, ITestAdapter, Ibdd_in_any, Ibdd_out } from "./CoreTypes";
import Tiposkripto from "./lib/Tiposkripto";
import { ITTestResourceRequest } from "./lib/index.js";
export declare class WebTesteranto<I extends Ibdd_in_any, O extends Ibdd_out, M> extends Tiposkripto<I, O, M> {
    constructor(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M>, testResourceRequirement: ITTestResourceRequest, testAdapter: Partial<ITestAdapter<I>>);
    receiveTestResourceConfig(partialTestResource: any): Promise<import("./lib/index.js").IFinalResults>;
}
declare const _default: <I extends Ibdd_in_any, O extends Ibdd_out, M>(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M>, testAdapter: Partial<ITestAdapter<I>>, testResourceRequirement?: ITTestResourceRequest) => Promise<WebTesteranto<I, O, M>>;
export default _default;
