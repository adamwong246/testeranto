import { Ibdd_in, Ibdd_out, IPartialNodeInterface, ITestImplementation, ITestSpecification } from "../Types";
type IInput = string;
export type IImpl<I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> = ITestImplementation<I, O>;
export type ISpec<I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> = ITestSpecification<I, O>;
declare const _default: <I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>>(testInput: IInput, testSpecifications: ISpec<I, O>, testImplementations: ITestImplementation<I, O>, testInterface?: IPartialNodeInterface<I>) => Promise<import("../lib/core.js").default<I, O>>;
export default _default;
