import { IGivens, BaseCheck, BaseSuite, BaseWhen, BaseThen, BaseGiven } from "./base.js";
import { ITTestResourceConfiguration, ITTestShape, ITestArtificer, ITestCheckCallback } from "./lib.js";
export declare type IBaseConfig = {
    clearScreen: boolean;
    devMode: boolean;
    features: string;
    webPlugins: any[];
    nodePlugins: any[];
    minify: boolean;
    outbase: string;
    outdir: string;
    ports: string[];
    tests: string;
};
export declare type IRunTime = `node` | `web`;
export declare type ITestTypes = [
    string,
    IRunTime,
    ITestTypes[]
];
export declare type ITestSpecification<ITestShape extends ITTestShape, ISubject, IStore, ISelection, IThenShape, IGivenShape> = (Suite: {
    [K in keyof ITestShape["suites"]]: (name: string, givens: IGivens<ISubject, IStore, ISelection, IThenShape, IGivenShape>, checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>[]) => BaseSuite<unknown, ISubject, IStore, ISelection, IThenShape, ITestShape, IGivenShape>;
}, Given: {
    [K in keyof ITestShape["givens"]]: (features: string[], whens: BaseWhen<IStore, ISelection, IThenShape>[], thens: BaseThen<ISelection, IStore, IThenShape>[], ...xtrasB: ITestShape["givens"][K]) => BaseGiven<ISubject, IStore, ISelection, IThenShape, IGivenShape>;
}, When: {
    [K in keyof ITestShape["whens"]]: (...xtrasC: ITestShape["whens"][K]) => BaseWhen<IStore, ISelection, IThenShape>;
}, Then: {
    [K in keyof ITestShape["thens"]]: (...xtrasD: ITestShape["thens"][K]) => BaseThen<ISelection, IStore, IThenShape>;
}, Check: ITestCheckCallback<ITestShape>) => any[];
export declare type ITestImplementation<IState, ISelection, IWhenShape, IThenShape, ITestShape extends ITTestShape, IGivenShape> = {
    Suites: {
        [K in keyof ITestShape["suites"]]: string;
    };
    Givens: {
        [K in keyof ITestShape["givens"]]: (...Ig: ITestShape["givens"][K]) => (s: IState) => IGivenShape;
    };
    Whens: {
        [K in keyof ITestShape["whens"]]: (...Iw: ITestShape["whens"][K]) => (zel: ISelection) => IWhenShape;
    };
    Thens: {
        [K in keyof ITestShape["thens"]]: (...It: ITestShape["thens"][K]) => (ssel: ISelection) => IThenShape;
    };
    Checks: {
        [K in keyof ITestShape["checks"]]: (...Ic: ITestShape["checks"][K]) => IState;
    };
};
export declare type ITestInterface<IStore, ISelection, ISubject, IThenShape, IInput> = {
    assertThis?: (x: any) => void;
    andWhen: (store: IStore, whenCB: any, testResource: ITTestResourceConfiguration) => Promise<ISelection>;
    butThen?: (store: IStore, thenCB: any, testResource: ITTestResourceConfiguration) => Promise<ISelection>;
    afterAll?: (store: IStore, artificer: ITestArtificer) => any;
    afterEach?: (store: IStore, key: string, artificer: ITestArtificer) => Promise<unknown>;
    beforeAll?: (input: IInput, artificer: ITestArtificer) => Promise<ISubject>;
    beforeEach?: (subject: ISubject, initializer: any, artificer: ITestArtificer, testResource: ITTestResourceConfiguration, initialValues: any) => Promise<IStore>;
};
