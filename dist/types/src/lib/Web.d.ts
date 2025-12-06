import { ITestAdapter, ITestImplementation, ITestSpecification, Ibdd_in_any, Ibdd_out } from "../CoreTypes";
import Tiposkripto from "./Tiposkripto";
import { ITTestResourceRequest } from "./index.js";
export declare class WebTesteranto<I extends Ibdd_in_any, O extends Ibdd_out, M> extends Tiposkripto<I, O, M> {
    constructor(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M>, testResourceRequirement: ITTestResourceRequest, testAdapter: Partial<ITestAdapter<I>>);
    receiveTestResourceConfig(partialTestResource: any): Promise<import("./index.js").IFinalResults>;
}
declare const _default: <I extends Ibdd_in_any, O extends Ibdd_out, M>(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M>, testAdapter: Partial<ITestAdapter<I>>, testResourceRequirement?: ITTestResourceRequest) => Promise<WebTesteranto<I, O, M>>;
export default _default;
