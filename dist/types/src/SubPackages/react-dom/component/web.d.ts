import React from "react";
import ReactDom from "react-dom/client";
import { IPartialWebInterface, ITestImplementation, ITestSpecification } from "../../../Types";
declare type IInput = typeof React.Component;
export declare type IStore = {
    htmlElement: HTMLElement;
    reactElement: any;
    domRoot: ReactDom.Root;
};
declare const _default: <ITestShape extends any, IWhen, IGiven>(testInput: IInput, testSpecifications: ITestSpecification<ITestShape>, testImplementations: ITestImplementation<ITestShape, any>, testInterface?: IPartialWebInterface<any>) => Promise<import("../../../lib/core.js").default<ITestShape>>;
export default _default;
