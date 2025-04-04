import React from "react";
import { IBaseTest, ITestImplementation, ITestSpecification } from "../../../Types";
type IInput = typeof React.Component;
export type IImpl<ISpec extends IBaseTest, IState> = ITestImplementation<ISpec, object>;
export type ISpec<T extends IBaseTest> = ITestSpecification<T>;
declare const _default: <ITestShape extends IBaseTest>(testImplementations: ITestImplementation<ITestShape>, testSpecifications: ISpec<ITestShape>, testInput: IInput) => Promise<import("../../../lib/core.js").default<ITestShape>>;
export default _default;
