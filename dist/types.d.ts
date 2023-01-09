import { DirectedGraph } from 'graphology';
import { BaseGiven, BaseCheck, BaseSuite, BaseFeature, BaseWhen, BaseThen } from "./BaseClasses";
export declare type ITTestResourceRequirement = {
    "ports": number;
};
export declare type ITTestResource = {
    "ports": number[];
};
export declare type IT_FeatureNetwork = {
    name: string;
    graph: DirectedGraph;
};
export declare type IT = {
    toObj(): object;
    aborter: () => any;
    name: string;
    givens: BaseGiven<unknown, unknown, unknown, unknown>[];
    checks: BaseCheck<unknown, unknown, unknown, unknown>[];
};
export declare type ITestJob = {
    toObj(): object;
    test: IT;
    runner: (testResurce?: any) => unknown;
    testResource: ITTestResourceRequirement;
};
export declare type ITestResults = Promise<{
    test: IT;
}>[];
export declare type Modify<T, R> = Omit<T, keyof R> & R;
export declare type ITTestShape = {
    suites: any;
    givens: any;
    whens: any;
    thens: any;
    checks: any;
};
export declare type ITestSpecification<ITestShape extends ITTestShape> = (Suite: {
    [K in keyof ITestShape["suites"]]: (name: string, givens: BaseGiven<unknown, unknown, unknown, unknown>[], checks: BaseCheck<unknown, unknown, unknown, unknown>[]) => BaseSuite<unknown, unknown, unknown, unknown, unknown>;
}, Given: {
    [K in keyof ITestShape["givens"]]: (features: BaseFeature[], whens: BaseWhen<unknown, unknown, unknown>[], thens: BaseThen<unknown, unknown, unknown>[], ...xtras: ITestShape["givens"][K]) => BaseGiven<unknown, unknown, unknown, unknown>;
}, When: {
    [K in keyof ITestShape["whens"]]: (...xtras: ITestShape["whens"][K]) => BaseWhen<unknown, unknown, unknown>;
}, Then: {
    [K in keyof ITestShape["thens"]]: (...xtras: ITestShape["thens"][K]) => BaseThen<unknown, unknown, unknown>;
}, Check: {
    [K in keyof ITestShape["checks"]]: (name: string, features: BaseFeature[], callbackA: (whens: {
        [K in keyof ITestShape["whens"]]: (...unknown: any[]) => BaseWhen<unknown, unknown, unknown>;
    }, thens: {
        [K in keyof ITestShape["thens"]]: (...unknown: any[]) => BaseThen<unknown, unknown, unknown>;
    }) => unknown, ...xtras: ITestShape["checks"][K]) => BaseCheck<unknown, unknown, unknown, unknown>;
}) => any[];
export declare type ITestImplementation<IState, ISelection, IWhenShape, IThenShape, ITestShape extends ITTestShape> = {
    Suites: {
        [K in keyof ITestShape["suites"]]: string;
    };
    Givens: {
        [K in keyof ITestShape["givens"]]: (...Ig: ITestShape["givens"][K]) => IState;
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
