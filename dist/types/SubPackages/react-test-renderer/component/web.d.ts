import { Ibdd_in, Ibdd_out } from "../../../Types.js";
import { IImpl, ISpec, IInput } from "./index.js";
declare const _default: <I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>>(testImplementations: IImpl<I, O>, testSpecifications: ISpec<I, O>, testInput: IInput<any, any>) => Promise<import("../../../lib/core.js").default<I, O>>;
export default _default;
