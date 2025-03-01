import React from "react";
import { ITestImplementation, ITestSpecification } from "../../../Types";
declare type IInput = React.MemoExoticComponent<() => JSX.Element>;
declare const _default: <ITestShape extends any, PropShape>(testImplementations: ITestImplementation<ITestShape, object>, testSpecifications: ITestSpecification<ITestShape>, testInput: IInput) => Promise<import("../../../lib/core").default<ITestShape>>;
export default _default;
