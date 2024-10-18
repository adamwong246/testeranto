import { BrowserWindow } from "electron";
import { Browser, Page } from "puppeteer-core";
import { ITTestResourceConfiguration, ITestArtificer } from ".";
import { IBaseTest } from "../Types";
import { IGivens, BaseCheck, BaseSuite, BaseGiven, BaseWhen, BaseThen } from "./abstractBase";
export declare type IRunTime = `node` | `web`;
export declare type ITestTypes = [
    string,
    IRunTime,
    ITestTypes[]
];
export declare type IJsonConfig = {
    outdir: string;
    tests: ITestTypes[];
    features: string;
};
export declare type IBaseConfig = {
    clearScreen: boolean;
    debugger: boolean;
    devMode: boolean;
    externals: string[];
    features: string;
    minify: boolean;
    nodePlugins: any[];
    outbase: string;
    outdir: string;
    ports: string[];
    tests: ITestTypes[];
    webPlugins: any[];
};
export declare type IBuiltConfig = {
    buildDir: string;
} & IBaseConfig;
export declare type INodeUtils = TBrowser;
export declare type IWebUtils = BrowserWindow;
export declare type IUtils = INodeUtils | IWebUtils;
export declare class TBrowser {
    browser: Browser;
    constructor(browser: Browser);
    pages(): Promise<Page[]>;
}
export declare type IWebTestInterface<ITestShape extends IBaseTest> = {
    assertThis: (x: ITestShape['then']) => void;
    andWhen: (store: ITestShape['istore'], whenCB: ITestShape['when'], testResource: ITTestResourceConfiguration) => Promise<ITestShape['istore']>;
    butThen: (store: ITestShape['istore'], thenCB: any, testResource: ITTestResourceConfiguration) => Promise<ITestShape['iselection']>;
    afterAll: (store: ITestShape['istore'], artificer: ITestArtificer, browser: IWebUtils) => any;
    afterEach: (store: ITestShape['istore'], key: string, artificer: ITestArtificer) => Promise<unknown>;
    beforeAll: (input: ITestShape['iinput'], testResource: ITTestResourceConfiguration, artificer: ITestArtificer) => Promise<ITestShape['isubject']>;
    beforeEach: (subject: ITestShape['isubject'], initializer: (c?: any) => ITestShape['given'], artificer: ITestArtificer, testResource: ITTestResourceConfiguration, initialValues: any) => Promise<ITestShape['istore']>;
} & ITestInterface<ITestShape>;
export declare type INodeTestInterface<ITestShape extends IBaseTest> = {
    assertThis: (x: ITestShape['then']) => void;
    andWhen: (store: ITestShape['istore'], whenCB: ITestShape['when'], testResource: ITTestResourceConfiguration) => Promise<ITestShape['istore']>;
    butThen: (store: ITestShape['istore'], thenCB: any, testResource: ITTestResourceConfiguration) => Promise<ITestShape['iselection']>;
    afterAll: (store: ITestShape['istore'], artificer: ITestArtificer, browser: INodeUtils) => any;
    afterEach: (store: ITestShape['istore'], key: string, artificer: ITestArtificer) => Promise<unknown>;
    beforeAll: (input: ITestShape['iinput'], testResource: ITTestResourceConfiguration, artificer: ITestArtificer) => Promise<ITestShape['isubject']>;
    beforeEach: (subject: ITestShape['isubject'], initializer: (c?: any) => ITestShape['given'], artificer: ITestArtificer, testResource: ITTestResourceConfiguration, initialValues: any) => Promise<ITestShape['istore']>;
} & ITestInterface<ITestShape>;
export declare type ITestInterface<ITestShape extends IBaseTest> = {
    assertThis: (x: ITestShape['then']) => void;
    andWhen: (store: ITestShape['istore'], whenCB: ITestShape['when'], testResource: ITTestResourceConfiguration) => Promise<ITestShape['istore']>;
    butThen: (store: ITestShape['istore'], thenCB: any, testResource: ITTestResourceConfiguration) => Promise<ITestShape['iselection']>;
    afterAll: (store: ITestShape['istore'], artificer: ITestArtificer, utils: IUtils) => any;
    afterEach: (store: ITestShape['istore'], key: string, artificer: ITestArtificer) => Promise<unknown>;
    beforeAll: (input: ITestShape['iinput'], testResource: ITTestResourceConfiguration, artificer: ITestArtificer) => Promise<ITestShape['isubject']>;
    beforeEach: (subject: ITestShape['isubject'], initializer: (c?: any) => ITestShape['given'], artificer: ITestArtificer, testResource: ITTestResourceConfiguration, initialValues: any) => Promise<ITestShape['istore']>;
};
export declare type ISuiteKlasser<ITestShape extends IBaseTest> = (name: string, index: number, givens: IGivens<ITestShape>, checks: BaseCheck<ITestShape>[]) => BaseSuite<ITestShape>;
export declare type IGivenKlasser<ITestShape extends IBaseTest> = (name: any, features: any, whens: any, thens: any, givenCB: any) => BaseGiven<ITestShape>;
export declare type IWhenKlasser<ITestShape extends IBaseTest> = (s: any, o: any) => BaseWhen<ITestShape>;
export declare type IThenKlasser<ITestShape extends IBaseTest> = (s: any, o: any) => BaseThen<ITestShape>;
export declare type ICheckKlasser<ITestShape extends IBaseTest> = (n: any, f: any, cb: any, w: any, t: any) => BaseCheck<ITestShape>;
