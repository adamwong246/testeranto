import { ITTestResourceRequest } from "./index.js";
import { ITestSpecification, ITestImplementation, ITestAdapter, Ibdd_in_any, Ibdd_out_any, Ibdd_out } from "../CoreTypes.js";
import Tiposkripto from "./Tiposkripto.js";
export declare class NodeTiposkripto<I extends Ibdd_in_any, O extends Ibdd_out_any, M> extends Tiposkripto<I, O, M> {
    constructor(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M>, testResourceRequirement: ITTestResourceRequest, testAdapter: Partial<ITestAdapter<I>>);
    receiveTestResourceConfig(partialTestResource: string): Promise<import("./index.js").IFinalResults>;
}
declare const tiposkripto: <I extends Ibdd_in_any, O extends Ibdd_out, M>(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M>, testAdapter: Partial<ITestAdapter<I>>, testResourceRequirement?: ITTestResourceRequest) => Promise<Tiposkripto<I, O, M>>;
export default tiposkripto;
