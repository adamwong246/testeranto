import React from "react";
import { ITestSpecification, ITestImplementation, IBaseTest } from "../../../Types";
export type IInput = React.FC;
export type IWhenShape = unknown;
export type IThenShape = unknown;
export type ISpec<ITestShape extends IBaseTest> = ITestSpecification<ITestShape>;
declare const _default: <ITestShape extends IBaseTest, IPropShape>(testImplementations: ITestImplementation<ITestShape>, testSpecifications: ISpec<ITestShape>, testInput: IInput) => Promise<import("../../../lib/core").default<ITestShape>>;
export default _default;
