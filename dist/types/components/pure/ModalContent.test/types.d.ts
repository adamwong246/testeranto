import ReactDom from "react-dom/client";
import { Ibdd_in, Ibdd_out } from "../../../CoreTypes";
import { IModalContentProps } from "../ModalContent";
export type IInput = IModalContentProps;
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
    hasModalHeader: () => (s: IStore) => IStore;
    hasThemeCards: () => (s: IStore) => IStore;
    takeScreenshot: (name: string) => (s: IStore, pm: any) => Promise<IStore>;
}>;
export type O = Ibdd_out<{
    Default: [string];
}, {
    Default: [];
}, {}, {
    hasModalHeader: [];
    hasThemeCards: [];
    takeScreenshot: [string];
}>;
export type M = {
    givens: {
        [K in keyof O["givens"]]: (...args: any[]) => IModalContentProps;
    };
    whens: {
        [K in keyof O["whens"]]: (...args: any[]) => (props: IModalContentProps, utils: any) => IModalContentProps & {
            container?: HTMLElement;
        };
    };
    thens: {
        [K in keyof O["thens"]]: (...args: any[]) => (state: IModalContentProps & {
            container?: HTMLElement;
        }) => IModalContentProps & {
            container?: HTMLElement;
        };
    };
};
