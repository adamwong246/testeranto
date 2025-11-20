import { Ibdd_in_any, Ibdd_out, ITestImplementation, ITestAdapter, ITestSpecification } from "./CoreTypes.js";
import { ITTestResourceRequest } from "./lib/index.js";
import Tiposkripto from "./lib/Tiposkripto.js";
export declare class PureTesteranto<I extends Ibdd_in_any, O extends Ibdd_out, M> extends Tiposkripto<I, O, M> {
    constructor(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M>, testResourceRequirement: ITTestResourceRequest, testAdapter: Partial<ITestAdapter<I>>);
    receiveTestResourceConfig(partialTestResource: string): Promise<import("./lib/index.js").IFinalResults | {
        failed: boolean;
        fails: number;
        artifacts: never[];
        features: never[];
    }>;
}
declare const _default: <I extends Ibdd_in_any, O extends Ibdd_out, M>(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M>, testAdapter: Partial<ITestAdapter<I>>, testResourceRequirement?: ITTestResourceRequest) => Promise<PureTesteranto<I, O, M>>;
export default _default;
