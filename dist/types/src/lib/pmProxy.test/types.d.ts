import { ITestProxies } from ".";
import { Ibdd_in, Ibdd_out } from "../../CoreTypes";
import { IProxiedFunctions, IProxy } from "../pmProxy";
import { IPM } from "../types";
export type I = Ibdd_in<{
    butThenProxy: IProxy;
}, {
    proxies: ITestProxies;
    filepath: string;
    mockPm: IPM;
}, {
    butThenProxy: IProxy;
}, {
    proxies: ITestProxies;
    filepath: string;
    mockPm: IPM;
}, [
    string,
    string
], (...args: any[]) => (proxies: {
    butThenProxy: IProxy;
}) => {
    butThenProxy: IProxy;
}, [
    IPM,
    "string"
]>;
export type O = Ibdd_out<{
    Default: [string];
}, {
    SomeBaseString: [string];
}, {}, // No Whens for pure functions
{
    theButTheProxyReturns: [IProxiedFunctions, string];
}, {
    Default: [];
}>;
export type M = {
    givens: {
        [K in keyof O["givens"]]: (...Iw: O["givens"][K]) => string;
    };
};
