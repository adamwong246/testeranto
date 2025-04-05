import React from "react";
import renderer from "react-test-renderer";
import { Ibdd_in, Ibdd_out, ITestImplementation, ITestSpecification } from "../../../Types";
type IInput = React.MemoExoticComponent<() => JSX.Element>;
declare const _default: <I extends Ibdd_in<IInput, renderer.ReactTestRenderer, renderer.ReactTestRenderer, renderer.ReactTestRenderer, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>>(testImplementations: ITestImplementation<I, O>, testSpecifications: ITestSpecification<I, O>, testInput: IInput) => Promise<import("../../../lib/core").default<I, O>>;
export default _default;
