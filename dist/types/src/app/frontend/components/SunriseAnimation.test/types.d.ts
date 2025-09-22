import * as React from "react";
import * as ReactDom from "react-dom/client";
import { Ibdd_out } from "../../../../CoreTypes";
export type IInput = {
    active: boolean;
    duration?: number;
    color?: string;
};
export type ISelection = {
    container: HTMLDivElement;
    reactElement: React.ReactElement;
    domRoot: ReactDom.Root;
    animationElement: HTMLElement | null;
};
export type IStore = ISelection;
export type ISubject = {
    container: HTMLDivElement;
    domRoot: ReactDom.Root;
};
export type O = Ibdd_out<{
    Default: [string];
    AnimationBehavior: [string];
    Customization: [string];
}, {
    Default: [];
    Active: [];
    Inactive: [];
    WithCustomDuration: [number];
    WithCustomColor: [string];
}, {
    ToggleActive: [];
}, {
    RendersContainer: [];
    ShowsWhenActive: [];
    HidesWhenInactive: [];
    HasAnimation: [];
    HasDuration: [number];
    HasColor: [string];
}>;
