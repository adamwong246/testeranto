import { Ibdd_in, Ibdd_out } from "../../../CoreTypes";
import { IProjectPageViewProps } from "../ProjectPageView";
export type I = Ibdd_in<null, IProjectPageViewProps, IProjectPageViewProps & {
    container?: HTMLElement;
}, IProjectPageViewProps & {
    container?: HTMLElement;
}, (...args: any[]) => IProjectPageViewProps, () => (props: IProjectPageViewProps, utils: any) => IProjectPageViewProps & {
    container?: HTMLElement;
}, () => (state: IProjectPageViewProps & {
    container?: HTMLElement;
}) => IProjectPageViewProps & {
    container?: HTMLElement;
}>;
export type O = Ibdd_out<{
    Default: [string];
}, {
    Default: [];
    WithError: [];
}, {}, {
    happyPath: [];
    unhappyPath: [];
}>;
export type M = {
    givens: {
        [K in keyof O["givens"]]: (...args: any[]) => IProjectPageViewProps;
    };
    whens: {
        [K in keyof O["whens"]]: (...args: any[]) => (props: IProjectPageViewProps, utils: any) => IProjectPageViewProps & {
            container?: HTMLElement;
        };
    };
    thens: {
        [K in keyof O["thens"]]: (...args: any[]) => (state: IProjectPageViewProps & {
            container?: HTMLElement;
        }) => IProjectPageViewProps & {
            container?: HTMLElement;
        };
    };
};
