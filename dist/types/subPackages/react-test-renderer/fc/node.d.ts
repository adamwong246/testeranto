import React from "react";
import { ITestSpecification, ITestImplementation, IBaseTest } from "../../../Types";
export declare type IInput = React.FC;
export declare type IWhenShape = unknown;
export declare type IThenShape = unknown;
export declare type ISpec<ITestShape extends IBaseTest> = ITestSpecification<ITestShape>;
declare const _default: <ITestShape extends IBaseTest>(testImplementations: ITestImplementation<ITestShape, object>, testSpecifications: ISpec<ITestShape>, testInput: IInput) => Promise<void>;
export default _default;
