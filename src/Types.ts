import { ITTestResourceRequest, ITestCheckCallback } from "./lib/index.js";
import {
  IGivens,
  BaseCheck,
  BaseSuite,
  BaseWhen,
  BaseThen,
  BaseGiven,
} from "./lib/abstractBase.js";
import Testeranto from "./lib/core.js";
import {
  INodeTestInterface,
  ITestInterface,
  IWebTestInterface,
} from "./lib/types.js";

export type IPartialInterface<I extends IBaseTest> = Partial<ITestInterface<I>>;

export type ITTestShape = {
  suites;
  givens;
  whens;
  thens;
  checks;
};

export type IPartialNodeInterface<I extends IBaseTest> = Partial<
  INodeTestInterface<I>
>;
export type IPartialWebInterface<I extends IBaseTest> = Partial<
  IWebTestInterface<I>
>;

export type IEntry<ITestShape extends IBaseTest> = (
  input: ITestShape["iinput"],
  testSpecification: ITestSpecification<ITestShape>,
  testImplementation: ITestImplementation<ITestShape, object>,
  testInterface: IPartialInterface<ITestShape>,
  testResourceRequirement: ITTestResourceRequest
) => Promise<Testeranto<ITestShape>>;

export type ITestSpecification<ITestShape extends IBaseTest> = (
  Suite: {
    [K in keyof ITestShape["suites"]]: (
      name: string,
      givens: IGivens<ITestShape>,
      checks: BaseCheck<ITestShape>[]
    ) => BaseSuite<ITestShape>;
  },
  Given: {
    [K in keyof ITestShape["givens"]]: (
      features: string[],
      whens: BaseWhen<ITestShape>[],
      thens: BaseThen<ITestShape>[],
      ...xtrasB: ITestShape["givens"][K]
    ) => BaseGiven<ITestShape>;
  },
  When: {
    [K in keyof ITestShape["whens"]]: (
      ...xtrasC: ITestShape["whens"][K]
    ) => BaseWhen<ITestShape>;
  },
  Then: {
    [K in keyof ITestShape["thens"]]: (
      ...xtrasD: ITestShape["thens"][K]
    ) => BaseThen<ITestShape>;
  },
  Check: ITestCheckCallback<ITestShape>
) => any[];

export type ITestImplementation<ITestShape extends IBaseTest, IMod> = Modify<
  {
    suites: {
      [K in keyof ITestShape["suites"]]: string;
    };
    givens: {
      [K in keyof ITestShape["givens"]]: (
        ...Ig: ITestShape["givens"][K]
      ) => ITestShape["given"];
    };
    whens: {
      [K in keyof ITestShape["whens"]]: (
        ...Iw: ITestShape["whens"][K]
      ) => (zel: ITestShape["iselection"]) => ITestShape["when"];
    };
    thens: {
      [K in keyof ITestShape["thens"]]: (
        ...It: ITestShape["thens"][K]
      ) => (ssel: ITestShape["iselection"]) => ITestShape["then"];
    };
    checks: {
      [K in keyof ITestShape["checks"]]: (
        ...Ic: ITestShape["checks"][K]
      ) => ITestShape["given"];
    };
  },
  IMod
>;

type Modify<T, R> = Omit<T, keyof R> & R;

export type IBaseTest = {
  iinput; // input
  isubject; // subject
  istore; // store
  iselection;
  // iinitial;

  given;
  when;
  then;
  suites: Record<string, any[]>;
  givens: Record<string, any[]>;
  whens: Record<string, any[]>;
  thens: Record<string, any[]>;
  checks: Record<string, any[]>;
};
