import React from "react";
import { ITestSpecification, ITestImplementation, Ibdd_in, Ibdd_out } from "../../../Types";
export type IInput = React.FC;
export type IWhenShape = unknown;
export type IThenShape = unknown;
export type ISpec<I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> = ITestSpecification<I, O>;
declare const _default: <I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>>(testImplementations: ITestImplementation<I, O>, testSpecifications: ISpec<I, O>, testInput: IInput) => Promise<import("../../../lib/core").default<I, O>>;
export default _default;
