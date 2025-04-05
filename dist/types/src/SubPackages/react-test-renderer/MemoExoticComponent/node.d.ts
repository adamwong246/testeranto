import React from "react";
import { Ibdd_in, Ibdd_out, ITestImplementation, ITestSpecification } from "../../../Types";
type IInput = React.MemoExoticComponent<() => JSX.Element>;
declare const _default: <I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>, PropShape>(testImplementations: ITestImplementation<I, O>, testSpecifications: ITestSpecification<I, O>, testInput: IInput) => Promise<import("../../../lib/core").default<I, O>>;
export default _default;
