import ReactDom from "react-dom/client";
import { Ibdd_in, Ibdd_out } from "../../../CoreTypes";
import { TreeNode } from "../../../types/features";
export type IInput = {
    treeData: TreeNode[];
};
export type ISelection = {
    htmlElement: HTMLElement;
    reactElement: React.ReactElement;
    domRoot: ReactDom.Root;
};
export type IStore = ISelection;
export type ISubject = {
    htmlElement: HTMLElement;
    domRoot: ReactDom.Root;
};
export type I = Ibdd_in<IInput, ISubject, ISelection, IStore, (s: IStore) => IStore, (s: IStore) => IStore, {
    hasProjectNames: () => (s: IStore) => IStore;
    hasFilePaths: () => (s: IStore) => IStore;
    hasTestNames: () => (s: IStore) => IStore;
    hasStatusBadges: () => (s: IStore) => IStore;
    showsEmptyMessage: () => (s: IStore) => IStore;
    takeScreenshot: (name: string) => (s: IStore, pm: any) => Promise<IStore>;
}>;
export type O = Ibdd_out<{
    Default: [string];
}, {
    Default: [];
    WithEmptyData: [];
}, {}, {
    hasProjectNames: [];
    hasFilePaths: [];
    hasTestNames: [];
    hasStatusBadges: [];
    showsEmptyMessage: [];
    takeScreenshot: [string];
}>;
export type M = {
    givens: {
        [K in keyof O["givens"]]: (...args: any[]) => IInput;
    };
    whens: {
        [K in keyof O["whens"]]: (...args: any[]) => (props: IInput, utils: any) => IInput & {
            container?: HTMLElement;
        };
    };
    thens: {
        [K in keyof O["thens"]]: (...args: any[]) => (state: IInput & {
            container?: HTMLElement;
        }) => IInput & {
            container?: HTMLElement;
        };
    };
};
