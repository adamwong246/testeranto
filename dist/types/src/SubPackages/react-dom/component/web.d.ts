import React from "react";
import ReactDom from "react-dom/client";
import { IBaseTest, IPartialWebInterface, ITestImplementation, ITestSpecification } from "../../../Types";
type IInput = typeof React.Component;
export type IStore = {
    htmlElement: HTMLElement;
    reactElement: any;
    domRoot: ReactDom.Root;
};
declare const _default: <ITestShape extends IBaseTest, IWhen, IGiven>(testInput: IInput, testSpecifications: ITestSpecification<ITestShape>, testImplementations: ITestImplementation<ITestShape, any>, testInterface?: IPartialWebInterface<any>) => Promise<import("../../../lib/core.js").default<ITestShape>>;
export default _default;
