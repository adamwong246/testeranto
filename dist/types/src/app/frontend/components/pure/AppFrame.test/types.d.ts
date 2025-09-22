import * as React from "react";
import * as ReactDom from "react-dom/client";
import { Ibdd_in, Ibdd_out } from "../../../CoreTypes";
export type IInput = {
    children: React.ReactNode;
};
export type ISelection = {
    htmlElement: HTMLElement;
    reactElement: React.ReactElement;
    domRoot: HTMLElement | null;
    container?: HTMLElement;
    testId?: string;
};
export type IStore = ISelection;
export type ISubject = {
    htmlElement: HTMLElement;
    domRoot: ReactDom.Root;
};
export type O = Ibdd_out<{
    Default: [string];
    Layout: [string];
}, {
    Default: [];
    WithChildren: [React.ReactNode];
}, {}, {
    RendersContainer: [];
    HasMainContent: [];
    HasFooter: [];
    HasSettingsButton: [];
    HasTesterantoLink: [];
    takeScreenshot: [string];
}>;
export type I = Ibdd_in<IInput, ISubject, ISelection, IStore, (s: IStore) => IStore, (s: IStore) => IStore, {}>;
