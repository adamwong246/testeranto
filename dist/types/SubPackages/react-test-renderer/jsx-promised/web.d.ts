import { Ibdd_in, Ibdd_out } from "../../../Types";
import { ITestImpl, ITestSpec } from "../../react/jsx";
import { IInput } from "./index";
declare const _default: <I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>>(testImplementations: ITestImpl<I, O>, testSpecifications: ITestSpec<I, O>, testInput: IInput) => Promise<import("../../../lib/core").default<I, O, unknown>>;
export default _default;
