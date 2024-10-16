import React from "react";
import { IBaseTest, ITestImplementation, ITestSpecification } from "../../../Types";
declare type IInput = typeof React.Component;
export declare type IImpl<ISpec extends IBaseTest, IState> = ITestImplementation<ISpec, object>;
export declare type ISpec<T extends IBaseTest> = ITestSpecification<T>;
declare const _default: <ITestShape extends IBaseTest>(testImplementations: ITestImplementation<ITestShape, object>, testSpecifications: ISpec<ITestShape>, testInput: IInput) => Promise<import("../../../lib/core.js").default<ITestShape>>;
export default _default;
