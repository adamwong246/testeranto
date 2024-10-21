import React from "react";
import { IBaseTest, ITestImplementation, ITestSpecification } from "../../../Types";
declare type IInput = typeof React.Component;
declare const _default: <ITestShape extends IBaseTest<any, any>, IWhen, IGiven>(testInput: IInput, testSpecifications: ITestSpecification<ITestShape>, testImplementations: any) => void;
export default _default;
