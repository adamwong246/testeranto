import { IBaseTest } from "../Types";
import { ITTestResourceConfiguration, ITestArtifactory, ITLog } from ".";
import { IUtils } from "./types";
export declare type IGivens<ITestShape extends IBaseTest> = Record<string, BaseGiven<ITestShape>>;
export declare abstract class BaseSuite<ITestShape extends IBaseTest> {
    name: string;
    givens: IGivens<ITestShape>;
    checks: BaseCheck<ITestShape>[];
    store: ITestShape["istore"];
    fails: BaseGiven<ITestShape>[];
    testResourceConfiguration: ITTestResourceConfiguration;
    index: number;
    constructor(name: string, index: number, givens?: IGivens<ITestShape>, checks?: BaseCheck<ITestShape>[]);
    toObj(): {
        name: string;
        givens: {
            name: string;
            whens: {
                name: string;
                error: boolean;
            }[];
            thens: {
                name: string;
                error: boolean;
            }[];
            error: (string | Error | undefined)[] | null;
            features: string[];
        }[];
        fails: BaseGiven<ITestShape>[];
    };
    setup(s: ITestShape["iinput"], artifactory: ITestArtifactory, tr: ITTestResourceConfiguration, utils: IUtils): Promise<ITestShape["isubject"]>;
    assertThat(t: ITestShape["then"]): unknown;
    run(input: ITestShape["iinput"], testResourceConfiguration: ITTestResourceConfiguration, artifactory: (fPath: string, value: unknown) => void, tLog: (...string: any[]) => void, utils: IUtils): Promise<BaseSuite<ITestShape>>;
}
export declare abstract class BaseGiven<ITestShape extends IBaseTest> {
    name: string;
    features: string[];
    whens: BaseWhen<ITestShape>[];
    thens: BaseThen<ITestShape>[];
    error: Error;
    store: ITestShape["istore"];
    recommendedFsPath: string;
    givenCB: ITestShape["given"];
    initialValues: any;
    constructor(name: string, features: string[], whens: BaseWhen<ITestShape>[], thens: BaseThen<ITestShape>[], givenCB: ITestShape["given"], initialValues: any);
    beforeAll(store: ITestShape["istore"], artifactory: ITestArtifactory): ITestShape["istore"];
    afterAll(store: ITestShape["istore"], artifactory: ITestArtifactory, utils: IUtils): ITestShape["istore"];
    toObj(): {
        name: string;
        whens: {
            name: string;
            error: boolean;
        }[];
        thens: {
            name: string;
            error: boolean;
        }[];
        error: (string | Error | undefined)[] | null;
        features: string[];
    };
    abstract givenThat(subject: ITestShape["isubject"], testResourceConfiguration: any, artifactory: ITestArtifactory, givenCB: ITestShape["given"]): Promise<ITestShape["istore"]>;
    afterEach(store: ITestShape["istore"], key: string, artifactory: ITestArtifactory): Promise<unknown>;
    give(subject: ITestShape["isubject"], key: string, testResourceConfiguration: any, tester: any, artifactory: ITestArtifactory, tLog: ITLog, utils: IUtils): Promise<ITestShape["istore"]>;
}
export declare abstract class BaseWhen<ITestShape extends IBaseTest> {
    name: string;
    whenCB: (x: ITestShape["iselection"]) => ITestShape["then"];
    error: boolean;
    constructor(name: string, whenCB: (xyz: ITestShape["iselection"]) => ITestShape["then"]);
    abstract andWhen(store: ITestShape["istore"], whenCB: (x: ITestShape["iselection"]) => ITestShape["then"], testResource: any): any;
    toObj(): {
        name: string;
        error: boolean;
    };
    test(store: ITestShape["istore"], testResourceConfiguration: any, tLog: ITLog, utils: IUtils): Promise<any>;
}
export declare abstract class BaseThen<ITestShape extends IBaseTest> {
    name: string;
    thenCB: (storeState: ITestShape["iselection"]) => ITestShape["then"];
    error: boolean;
    constructor(name: string, thenCB: (val: ITestShape["iselection"]) => ITestShape["then"]);
    toObj(): {
        name: string;
        error: boolean;
    };
    abstract butThen(store: ITestShape["istore"], thenCB: any, testResourceConfiguration?: any): Promise<ITestShape["iselection"]>;
    test(store: ITestShape["istore"], testResourceConfiguration: any, tLog: ITLog, utils: IUtils): Promise<ITestShape["then"] | undefined>;
}
export declare abstract class BaseCheck<ITestShape extends IBaseTest> {
    name: string;
    features: string[];
    checkCB: (whens: any, thens: any) => any;
    whens: {
        [K in keyof ITestShape["whens"]]: (p: any, tc: any) => BaseWhen<ITestShape>;
    };
    thens: {
        [K in keyof ITestShape["thens"]]: (p: any, tc: any) => BaseThen<ITestShape>;
    };
    constructor(name: string, features: string[], checkCB: (whens: any, thens: any) => any, whens: any, thens: any);
    abstract checkThat(subject: ITestShape["isubject"], testResourceConfiguration: any, artifactory: ITestArtifactory): Promise<ITestShape["istore"]>;
    afterEach(store: ITestShape["istore"], key: string, cb?: any): Promise<unknown>;
    check(subject: ITestShape["isubject"], key: string, testResourceConfiguration: any, tester: any, artifactory: ITestArtifactory, tLog: ITLog, utils: IUtils): Promise<void>;
}
