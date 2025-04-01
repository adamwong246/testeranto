import React from "react";
import { ITestSpecification } from "../../../Types";
declare type IInput = React.MemoExoticComponent<() => JSX.Element>;
declare const _default: <ITestShape extends any, PropShape>(testImplementations: any, testSpecifications: ITestSpecification<ITestShape>, testInput: IInput) => Promise<import("../../../lib/core").default<ITestShape>>;
export default _default;
