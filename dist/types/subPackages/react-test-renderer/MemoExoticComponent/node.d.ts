import React from "react";
import { IBaseTest, ITestImplementation, ITestSpecification } from "../../../Types";
declare type IInput = React.MemoExoticComponent<() => JSX.Element>;
declare const _default: <ITestShape extends IBaseTest<any, any>, PropShape>(testImplementations: ITestImplementation<ITestShape, object>, testSpecifications: ITestSpecification<ITestShape>, testInput: IInput) => Promise<import("../../../lib/core").default<ITestShape>>;
export default _default;
