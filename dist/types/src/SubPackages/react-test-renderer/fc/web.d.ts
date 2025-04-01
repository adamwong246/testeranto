import React from "react";
import { ITestSpecification, IBaseTest } from "../../../Types";
export declare type IInput = React.FC;
export declare type IWhenShape = unknown;
export declare type IThenShape = unknown;
export declare type ISpec<ITestShape extends IBaseTest> = ITestSpecification<ITestShape>;
declare const _default: <ITestShape extends any, IPropShape>(testImplementations: any, testSpecifications: ISpec<ITestShape>, testInput: IInput) => Promise<import("../../../lib/core").default<ITestShape>>;
export default _default;
