import { Ibdd_in_any, Ibdd_out, ITestSpecification, ITestImplementation, ITestAdapter } from "./CoreTypes";
import { ITTestResourceRequest } from "./lib";
import type Tiposkripto from "./lib/Tiposkripto.js";
declare const _default: <I extends Ibdd_in_any, O extends Ibdd_out, M>(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M>, testAdapter: Partial<ITestAdapter<I>>, testResourceRequirement?: ITTestResourceRequest) => Promise<Tiposkripto<I, O, M>>;
export default _default;
