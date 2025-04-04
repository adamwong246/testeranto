import React from "react";
import { IBaseTest, ITestImplementation, ITestSpecification } from "../../../Types";
type IInput = React.MemoExoticComponent<() => JSX.Element>;
declare const _default: <ITestShape extends IBaseTest, PropShape>(testImplementations: ITestImplementation<ITestShape>, testSpecifications: ITestSpecification<ITestShape>, testInput: IInput) => Promise<import("../../../lib/core").default<ITestShape>>;
export default _default;
