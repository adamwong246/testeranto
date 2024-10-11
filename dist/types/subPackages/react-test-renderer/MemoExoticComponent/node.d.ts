import React from "react";
import { IBaseTest, ITestImplementation, ITestSpecification } from "../../../Types";
declare type Input = React.MemoExoticComponent<() => JSX.Element>;
declare const _default: <ITestShape extends IBaseTest, PropShape>(testImplementations: ITestImplementation<ITestShape, object>, testSpecifications: ITestSpecification<ITestShape>, testInput: Input) => Promise<void>;
export default _default;
