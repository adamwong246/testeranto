import { ITTestResourceRequest, ITestCheckCallback } from "./lib/index.js";
import { IGivens, BaseCheck, BaseSuite, BaseWhen, BaseThen, BaseGiven } from "./lib/abstractBase.js";
import Testeranto from "./lib/core.js";
import { INodeTestInterface, ITestInterface, IWebTestInterface } from "./lib/types.js";
import { PM } from "./PM/index.js";
export declare type IPartialInterface<I extends IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> = Partial<ITestInterface<I>>;
export declare type IPartialNodeInterface<I extends IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> = Partial<INodeTestInterface<I>>;
export declare type IPartialWebInterface<I extends IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> = Partial<IWebTestInterface<I>>;
export declare type IEntry<ITestShape extends IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> = (input: ITestShape["iinput"], testSpecification: ITestSpecification<ITestShape>, testImplementation: ITestImplementation<ITestShape, object>, testInterface: IPartialInterface<ITestShape>, testResourceRequirement: ITTestResourceRequest) => Promise<Testeranto<ITestShape>>;
export declare type ITestSpecification<ITestShape extends IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> = (Suite: {
    [K in keyof ITestShape["suites"]]: (name: string, givens: IGivens<ITestShape>, checks: BaseCheck<ITestShape>[]) => BaseSuite<ITestShape>;
}, Given: {
    [K in keyof ITestShape["givens"]]: (features: string[], whens: BaseWhen<ITestShape>[], thens: BaseThen<ITestShape>[], ...xtrasB: ITestShape["givens"][K]) => BaseGiven<ITestShape>;
}, When: {
    [K in keyof ITestShape["whens"]]: (...xtrasC: ITestShape["whens"][K]) => BaseWhen<ITestShape>;
}, Then: {
    [K in keyof ITestShape["thens"]]: (...xtrasD: ITestShape["thens"][K]) => BaseThen<ITestShape>;
}, Check: ITestCheckCallback<ITestShape>) => any[];
export declare type ITestImplementation<ITestShape extends IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>, IMod = object> = Modify<{
    suites: {
        [K in keyof ITestShape["suites"]]: string;
    };
    givens: {
        [K in keyof ITestShape["givens"]]: (...Ig: ITestShape["givens"][K]) => ITestShape["given"];
    };
    whens: {
        [K in keyof ITestShape["whens"]]: (...Iw: ITestShape["whens"][K]) => (zel: ITestShape["iselection"], utils: PM) => Promise<ITestShape["when"]>;
    };
    thens: {
        [K in keyof ITestShape["thens"]]: (...It: ITestShape["thens"][K]) => (ssel: ITestShape["iselection"], utils: PM) => ITestShape["then"];
    };
    checks: {
        [K in keyof ITestShape["checks"]]: (...Ic: ITestShape["checks"][K]) => ITestShape["given"];
    };
}, IMod>;
declare type Modify<T, R> = Omit<T, keyof R> & R;
export declare type IBaseTest<IInput, ISubject, IStore, ISelection, IGiven, IWhen, IThen, ISuites extends Record<string, any>, IGivens extends Record<string, any>, IWhens extends Record<string, any>, IThens extends Record<string, any>, IChecks extends Record<string, any>> = {
    iinput: IInput;
    isubject: ISubject;
    istore: IStore;
    iselection: ISelection;
    given: IGiven;
    when: IWhen;
    then: IThen;
    suites: ISuites;
    givens: IGivens;
    whens: IWhens;
    thens: IThens;
    checks: IChecks;
};
export {};
