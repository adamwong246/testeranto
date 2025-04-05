import React from "react";
import ReactDom from "react-dom/client";
import { Ibdd_in, Ibdd_out, IPartialWebInterface, ITestImplementation, ITestSpecification } from "../../../Types";
type IInput = typeof React.Component;
export type IStore = {
    htmlElement: HTMLElement;
    reactElement: any;
    domRoot: ReactDom.Root;
};
declare const _default: <I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>>(testInput: IInput, testSpecifications: ITestSpecification<I, O>, testImplementations: ITestImplementation<I, O>, testInterface?: IPartialWebInterface<any>) => Promise<import("../../../lib/core.js").default<I, O>>;
export default _default;
