import { Ibdd_in, Ibdd_out, IPartialWebInterface } from "../../../Types";
import { ITestImpl, ITestSpec, IInput } from "./index.js";
declare const _default: <I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>>(testImplementations: ITestImpl<I, O>, testSpecifications: ITestSpec<I, O>, testInput: IInput, testInterface: IPartialWebInterface<I>) => Promise<import("../../../lib/core").default<I, O>>;
export default _default;
