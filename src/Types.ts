import { ITTestResourceConfiguration, ITestArtificer } from "./lib/index.js";
import {
  IGivens,
  BaseCheck,
  BaseSuite,
  BaseWhen,
  BaseThen,
  BaseGiven,
} from "./lib/abstractBase.js";
import { PM } from "./PM/index.js";
import { ITestCheckCallback } from "./lib/types.js";

export type ITestInterface<
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >
> = {
  assertThis: (x: I["then"]) => void;
  andWhen: (
    store: I["istore"],
    whenCB: I["when"],
    testResource: ITTestResourceConfiguration,
    pm: PM
  ) => Promise<I["istore"]>;
  butThen: (
    store: I["istore"],
    thenCB: I["then"],
    testResource: ITTestResourceConfiguration,
    pm: PM
  ) => Promise<I["iselection"]>;
  afterAll: (store: I["istore"], pm: PM) => any;
  afterEach: (store: I["istore"], key: string, pm: PM) => Promise<unknown>;
  beforeAll: (
    input: I["iinput"],
    testResource: ITTestResourceConfiguration,
    pm: PM
  ) => Promise<I["isubject"]>;
  beforeEach: (
    subject: I["isubject"],
    initializer: (c?) => I["given"],
    testResource: ITTestResourceConfiguration,
    initialValues,
    pm: PM
  ) => Promise<I["istore"]>;
};

export type IWebTestInterface<
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >
> = ITestInterface<I>;

export type INodeTestInterface<
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >
> = ITestInterface<I>;

export type IPartialInterface<
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >
> = Partial<ITestInterface<I>>;

export type IPartialNodeInterface<
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >
> = Partial<INodeTestInterface<I>>;
export type IPartialWebInterface<
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >
> = Partial<IWebTestInterface<I>>;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

type IT = Ibdd_in<
  unknown,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown
>;

type OT = Ibdd_out<
  Record<string, any>,
  Record<string, any>,
  Record<string, any>,
  Record<string, any>,
  Record<string, any>
>;

export type ITestSpecification<I extends IT, O extends OT> = (
  Suite: {
    [K in keyof O["suites"]]: (
      name: string,
      givens: IGivens<I>,
      checks: BaseCheck<I, O>[]
    ) => BaseSuite<I, O>;
  },
  Given: {
    [K in keyof O["givens"]]: (
      features: string[],
      whens: BaseWhen<I>[],
      thens: BaseThen<I>[],
      ...xtrasB: O["givens"][K]
    ) => BaseGiven<I>;
  },
  When: {
    [K in keyof O["whens"]]: (...xtrasC: O["whens"][K]) => BaseWhen<I>;
  },
  Then: {
    [K in keyof O["thens"]]: (...xtrasD: O["thens"][K]) => BaseThen<I>;
  },
  Check: ITestCheckCallback<I, O>
) => any[];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type ITestImplementation<
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
  O extends Ibdd_out<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> = {
  suites: {
    [K in keyof O["suites"]]: string;
  };
  givens: {
    [K in keyof O["givens"]]: (...Ig: O["givens"][K]) => I["given"];
  };
  whens: {
    [K in keyof O["whens"]]: (
      ...Iw: O["whens"][K]
    ) => (zel: I["iselection"], utils: PM) => Promise<I["when"]>;
  };
  thens: {
    [K in keyof O["thens"]]: (
      ...It: O["thens"][K]
    ) => (ssel: I["iselection"], utils: PM) => I["then"];
  };
  checks: {
    [K in keyof O["checks"]]: (...Ic: O["checks"][K]) => I["given"];
  };
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type Modify<T, R> = Omit<T, keyof R> & R;

export type Ibdd_out<
  ISuites extends Record<string, any>,
  IGivens extends Record<string, any>,
  IWhens extends Record<string, any>,
  IThens extends Record<string, any>,
  IChecks extends Record<string, any>
> = {
  suites: ISuites;
  givens: IGivens;
  whens: IWhens;
  thens: IThens;
  checks: IChecks;
};

export type Ibdd_in<
  IInput,
  ISubject,
  IStore,
  ISelection,
  IGiven,
  IWhen,
  IThen
> = {
  iinput: IInput;
  isubject: ISubject;
  istore: IStore;
  iselection: ISelection;
  given: IGiven;
  when: IWhen;
  then: IThen;
};
