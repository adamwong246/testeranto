import type { Plugin } from "esbuild";
import { IGivens, BaseCheck, BaseSuite, BaseGiven, BaseWhen, BaseThen } from "./abstractBase";
import { IBaseTest } from "../Types";
export declare type IFinalResults = {
    features: string[];
    failed: number;
};
export declare type IRunTime = `node` | `web`;
export declare type ITestTypes = [string, IRunTime, {
    ports: number;
}, ITestTypes[]];
export declare type IJsonConfig = {
    outdir: string;
    tests: ITestTypes[];
    botEmail: string;
};
export declare type IPlugin = (register: (entrypoint: any, sources: any) => any, entrypoints: any) => Plugin;
export declare type IBaseConfig = {
    src: string;
    clearScreen: boolean;
    debugger: boolean;
    devMode: boolean;
    externals: string[];
    minify: boolean;
    outbase: string;
    outdir: string;
    ports: string[];
    tests: ITestTypes[];
    nodePlugins: IPlugin[];
    webPlugins: IPlugin[];
    featureIngestor: (s: string) => Promise<string>;
};
export declare type IBuiltConfig = {
    buildDir: string;
} & IBaseConfig;
export declare type ISuiteKlasser<ITestShape extends IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> = (name: string, index: number, givens: IGivens<ITestShape>, checks: BaseCheck<ITestShape>[]) => BaseSuite<ITestShape>;
export declare type IGivenKlasser<ITestShape extends IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> = (name: any, features: any, whens: any, thens: any, givenCB: any) => BaseGiven<ITestShape>;
export declare type IWhenKlasser<ITestShape extends IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> = (s: any, o: any) => BaseWhen<ITestShape>;
export declare type IThenKlasser<ITestShape extends IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> = (s: any, o: any) => BaseThen<ITestShape>;
export declare type ICheckKlasser<ITestShape extends IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> = (n: any, f: any, cb: any, w: any, t: any) => BaseCheck<ITestShape>;
