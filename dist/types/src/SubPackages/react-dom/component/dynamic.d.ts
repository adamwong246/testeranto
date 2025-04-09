import React from "react";
import ReactDom from "react-dom/client";
import { Ibdd_in, IPartialInterface } from "../../../Types";
export type IInput = typeof React.Component;
export type ISelection = {
    htmlElement: HTMLElement;
    reactElement: any;
    domRoot: ReactDom.Root;
};
export type IStore = {
    htmlElement: HTMLElement;
    reactElement: any;
    domRoot: ReactDom.Root;
};
export type ISubject = {
    htmlElement: HTMLElement;
    domRoot: ReactDom.Root;
};
export type I = Ibdd_in<IInput, ISubject, ISelection, IStore, (s: IStore) => IStore, (s: IStore) => IStore, (s: IStore) => IStore>;
export declare const testInterfacer: (testInput: IInput) => IPartialInterface<I>;
