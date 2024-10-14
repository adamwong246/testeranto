import React from "react";
import { IBaseTest, ITestImplementation, ITestSpecification } from "../../../Types";
declare type Input = React.MemoExoticComponent<() => JSX.Element>;
declare const _default: <ITestShape extends IBaseTest, PropShape>(testImplementations: ITestImplementation<ITestShape, object>, testSpecifications: ITestSpecification<ITestShape>, testInput: Input) => Promise<import("../../../lib/core").default<ITestShape>>;
export default _default;
