import { IncomingMessage, Server, ServerResponse } from "http";
import { Ibdd_in, Ibdd_out } from "../CoreTypes";
import { PM_Node } from "../PM/node";
type O = Ibdd_out<{
    Default: [];
}, {
    "the http server which is used in development": [];
}, {}, {
    "the frontpage looks good": [];
    "the projects page looks good": [];
    "a project page looks good": [];
    "a test page looks good": [];
}>;
type I = Ibdd_in<(port: number) => Server<typeof IncomingMessage, typeof ServerResponse>, number, Server<typeof IncomingMessage, typeof ServerResponse>, number, Server<typeof IncomingMessage, typeof ServerResponse>, Server<typeof IncomingMessage, typeof ServerResponse>, Server<typeof IncomingMessage, typeof ServerResponse>>;
type M = {
    givens: {
        [K in keyof O["givens"]]: (...args: any[]) => IProjectPageViewProps;
    };
    whens: {
        [K in keyof O["whens"]]: (...args: any[]) => (props: IProjectPageViewProps, utils: any) => IProjectPageViewProps & {
            container?: HTMLElement;
        };
    };
    thens: {
        [K in keyof O["thens"]]: (port: number, pm: PM_Node) => void;
    };
};
declare const _default: Promise<import("../lib/core").default<I, O, M>>;
export default _default;
