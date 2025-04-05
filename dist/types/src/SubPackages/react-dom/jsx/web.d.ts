import { Ibdd_in, Ibdd_out, ITestImplementation, ITestSpecification } from "../../../Types";
import type { IInput } from "./index";
export type ISubject = HTMLElement;
declare const _default: <I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>>(testImplementations: ITestImplementation<I, O>, testSpecifications: ITestSpecification<I, O>, testInput: IInput) => Promise<import("../../../lib/core.js").default<I, O>>;
export default _default;
