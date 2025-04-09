import { Ibdd_out, ITestImplementation, ITestSpecification } from "../../../Types.js";
import { I, IInput } from "./index.js";
declare const _default: <II extends I, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>>(testImplementations: ITestImplementation<II, O>, testSpecifications: ITestSpecification<II, O>, testInput: IInput, testInterface2?: Partial<import("../../../Types.js").ITestInterface<I>>) => Promise<import("../../../lib/core.js").default<I, O, unknown>>;
export default _default;
