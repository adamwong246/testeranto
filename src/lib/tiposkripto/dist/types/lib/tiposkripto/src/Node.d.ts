import { Ibdd_in_any, Ibdd_out_any, ITestSpecification, ITestImplementation, ITestAdapter, Ibdd_out } from "./CoreTypes";
import BaseTiposkripto from "./BaseTiposkripto";
import { ITTestResourceRequest } from "./types";
export declare class NodeTiposkripto<I extends Ibdd_in_any, O extends Ibdd_out_any, M> extends BaseTiposkripto<I, O, M> {
    constructor(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M>, testResourceRequirement: ITTestResourceRequest, testAdapter: Partial<ITestAdapter<I>>);
    writeFileSync(filename: string, payload: string): void;
}
declare const tiposkripto: <I extends Ibdd_in_any, O extends Ibdd_out, M>(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M>, testAdapter: Partial<ITestAdapter<I>>, testResourceRequirement?: ITTestResourceRequest) => Promise<BaseTiposkripto<I, O, M>>;
export default tiposkripto;
