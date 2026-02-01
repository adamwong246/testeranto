import { ITestResourceConfiguration } from "./types";
import { Ibdd_in_any, ITestAdapter, Ibdd_out, ITestImplementation, ITestSpecification } from "./CoreTypes";
import type BaseTiposkripto from "./BaseTiposkripto.js";
import { ITTestResourceRequest } from "./types";
declare const _default: <I extends Ibdd_in_any, O extends Ibdd_out, M>(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M>, testAdapter: Partial<ITestAdapter<I>>, testResourceRequirement?: ITTestResourceRequest, testResourceConfiguration?: ITestResourceConfiguration) => Promise<BaseTiposkripto<I, O, M>>;
export default _default;
export declare const BaseAdapter: <T extends Ibdd_in_any>() => ITestAdapter<T>;
export declare const DefaultAdapter: <T extends Ibdd_in_any>(p: Partial<ITestAdapter<T>>) => ITestAdapter<T>;
