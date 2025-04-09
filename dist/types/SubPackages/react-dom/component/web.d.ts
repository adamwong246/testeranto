import React from "react";
import ReactDom from "react-dom/client";
import { Ibdd_in, IPartialWebInterface, ITestImplementation, ITestSpecification, MT, OT } from "../../../Types";
type IInput = typeof React.Component;
type ISelection = {
    htmlElement: HTMLElement;
    reactElement: any;
    domRoot: ReactDom.Root;
};
export type IStore = {
    htmlElement: HTMLElement;
    reactElement: any;
    domRoot: ReactDom.Root;
};
type ISubject = {
    htmlElement: HTMLElement;
    domRoot: ReactDom.Root;
};
export type I = Ibdd_in<IInput, ISubject, ISelection, IStore, (s: IStore) => IStore, (s: IStore) => IStore, (s: IStore) => IStore>;
declare const _default: <O extends OT, M extends MT<O>>(testInput: IInput, testSpecifications: ITestSpecification<I, O>, testImplementations: ITestImplementation<I, O, M>, testInterface?: IPartialWebInterface<I>) => Promise<import("../../../lib/core.js").default<I, O, M>>;
export default _default;
