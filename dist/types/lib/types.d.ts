import { IBaseTest } from "../Types";
import { IGivens, BaseCheck, BaseSuite, BaseGiven, BaseWhen, BaseThen } from "./abstractBase";
import { ITTestResourceConfiguration, ITestArtificer } from ".";
import { PM } from "../PM/index";
export declare type IRunTime = `node` | `web`;
export declare type ITestTypes = [string, IRunTime, {
    ports: number;
}, ITestTypes[]];
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
export declare type IWebTestInterface<ITestShape extends IBaseTest> = {
    assertThis: (x: ITestShape["then"]) => void;
    andWhen: (store: ITestShape["istore"], whenCB: ITestShape["when"], testResource: ITTestResourceConfiguration, utils: PM) => Promise<ITestShape["istore"]>;
    butThen: (store: ITestShape["istore"], thenCB: any, testResource: ITTestResourceConfiguration) => Promise<ITestShape["iselection"]>;
    afterAll: (store: ITestShape["istore"], artificer: ITestArtificer, utils: PM) => any;
    afterEach: (store: ITestShape["istore"], key: string, artificer: ITestArtificer, utils: PM) => Promise<unknown>;
    beforeAll: (input: ITestShape["iinput"], testResource: ITTestResourceConfiguration, artificer: ITestArtificer, utils: PM) => Promise<ITestShape["isubject"]>;
    beforeEach: (subject: ITestShape["isubject"], initializer: (c?: any) => ITestShape["given"], artificer: ITestArtificer, testResource: ITTestResourceConfiguration, initialValues: any, utils: PM) => Promise<ITestShape["istore"]>;
};
export declare type INodeTestInterface<ITestShape extends IBaseTest> = {
    assertThis: (x: ITestShape["then"]) => void;
    andWhen: (store: ITestShape["istore"], whenCB: ITestShape["when"], testResource: ITTestResourceConfiguration, utils: PM) => Promise<ITestShape["istore"]>;
    butThen: (store: ITestShape["istore"], thenCB: any, testResource: ITTestResourceConfiguration, utils: PM) => Promise<ITestShape["iselection"]>;
    afterAll: (store: ITestShape["istore"], artificer: ITestArtificer, pm: PM) => any;
    afterEach: (store: ITestShape["istore"], key: string, artificer: ITestArtificer, pm: PM) => Promise<unknown>;
    beforeAll: (input: ITestShape["iinput"], testResource: ITTestResourceConfiguration, artificer: ITestArtificer, pm: PM) => Promise<ITestShape["isubject"]>;
    beforeEach: (subject: ITestShape["isubject"], initializer: (c?: any) => ITestShape["given"], artificer: ITestArtificer, testResource: ITTestResourceConfiguration, initialValues: any, pm: PM) => Promise<ITestShape["istore"]>;
};
export declare type ITestInterface<ITestShape extends IBaseTest> = {
    assertThis: (x: ITestShape["then"]) => void;
    andWhen: (store: ITestShape["istore"], whenCB: ITestShape["when"], testResource: ITTestResourceConfiguration, pm: PM) => Promise<ITestShape["istore"]>;
    butThen: (store: ITestShape["istore"], thenCB: any, testResource: ITTestResourceConfiguration, pm: PM) => Promise<ITestShape["iselection"]>;
    afterAll: (store: ITestShape["istore"], artificer: ITestArtificer, pm: PM) => any;
    afterEach: (store: ITestShape["istore"], key: string, artificer: ITestArtificer, pm: PM) => Promise<unknown>;
    beforeAll: (input: ITestShape["iinput"], testResource: ITTestResourceConfiguration, artificer: ITestArtificer, pm: PM) => Promise<ITestShape["isubject"]>;
    beforeEach: (subject: ITestShape["isubject"], initializer: (c?: any) => ITestShape["given"], artificer: ITestArtificer, testResource: ITTestResourceConfiguration, initialValues: any, pm: PM) => Promise<ITestShape["istore"]>;
};
export declare type ISuiteKlasser<ITestShape extends IBaseTest> = (name: string, index: number, givens: IGivens<ITestShape>, checks: BaseCheck<ITestShape>[]) => BaseSuite<ITestShape>;
export declare type IGivenKlasser<ITestShape extends IBaseTest> = (name: any, features: any, whens: any, thens: any, givenCB: any) => BaseGiven<ITestShape>;
export declare type IWhenKlasser<ITestShape extends IBaseTest> = (s: any, o: any) => BaseWhen<ITestShape>;
export declare type IThenKlasser<ITestShape extends IBaseTest> = (s: any, o: any) => BaseThen<ITestShape>;
export declare type ICheckKlasser<ITestShape extends IBaseTest> = (n: any, f: any, cb: any, w: any, t: any) => BaseCheck<ITestShape>;
