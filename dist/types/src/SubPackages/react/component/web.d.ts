import React from "react";
import { Ibdd_in, Ibdd_out, ITestImplementation, ITestSpecification } from "../../../Types";
type IInput = typeof React.Component;
export type IImpl<I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> = ITestImplementation<I, O>;
export type ISpec<I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> = ITestSpecification<I, O>;
declare const _default: <I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>>(testImplementations: ITestImplementation<I, O>, testSpecifications: ISpec<I, O>, testInput: IInput) => Promise<import("../../../lib/core.js").default<I, O>>;
export default _default;
