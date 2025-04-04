import {
  ITTestResourceConfiguration,
  ITestArtificer,
  ITestCheckCallback,
} from "./lib/index.js";
import {
  IGivens,
  BaseCheck,
  BaseSuite,
  BaseWhen,
  BaseThen,
  BaseGiven,
} from "./lib/abstractBase.js";
import { PM } from "./PM/index.js";

export type IWebTestInterface<
  ITestShape extends IBaseTest<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> = {
  assertThis: (x: ITestShape["then"]) => void;
  andWhen: (
    store: ITestShape["istore"],
    whenCB: ITestShape["when"],
    testResource: ITTestResourceConfiguration,
    utils: PM
  ) => Promise<ITestShape["istore"]>;
  butThen: (
    store: ITestShape["istore"],
    thenCB,
    testResource: ITTestResourceConfiguration,
    utils: PM
  ) => Promise<ITestShape["iselection"]>;
  afterAll: (
    store: ITestShape["istore"],
    artificer: ITestArtificer,
    utils: PM
  ) => any;
  afterEach: (
    store: ITestShape["istore"],
    key: string,
    artificer: ITestArtificer,
    utils: PM
  ) => Promise<unknown>;
  beforeAll: (
    input: ITestShape["iinput"],
    testResource: ITTestResourceConfiguration,
    artificer: ITestArtificer,
    utils: PM
  ) => Promise<ITestShape["isubject"]>;
  beforeEach: (
    subject: ITestShape["isubject"],
    initializer: (c?) => ITestShape["given"],
    artificer: ITestArtificer,
    testResource: ITTestResourceConfiguration,
    initialValues,
    utils: PM
  ) => Promise<ITestShape["istore"]>;
};

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
> = {
  assertThis: (x: I["then"]) => void;
  andWhen: (
    store: I["istore"],
    whenCB: I["when"],
    testResource: ITTestResourceConfiguration,
    utils: PM
  ) => Promise<I["istore"]>;
  butThen: (
    store: I["istore"],
    thenCB,
    testResource: ITTestResourceConfiguration,
    utils: PM
  ) => Promise<I["iselection"]>;
  afterAll: (store: I["istore"], artificer: ITestArtificer, pm: PM) => any;
  afterEach: (
    store: I["istore"],
    key: string,
    artificer: ITestArtificer,
    pm: PM
  ) => Promise<unknown>;
  beforeAll: (
    input: I["iinput"],
    testResource: ITTestResourceConfiguration,
    artificer: ITestArtificer,
    pm: PM
  ) => Promise<I["isubject"]>;
  beforeEach: (
    subject: I["isubject"],
    initializer: (c?) => I["given"],
    artificer: ITestArtificer,
    testResource: ITTestResourceConfiguration,
    initialValues,
    pm: PM
  ) => Promise<I["istore"]>;
};

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
  afterAll: (store: I["istore"], artificer: ITestArtificer, pm: PM) => any;
  afterEach: (
    store: I["istore"],
    key: string,
    artificer: ITestArtificer,
    pm: PM
  ) => Promise<unknown>;
  beforeAll: (
    input: I["iinput"],
    testResource: ITTestResourceConfiguration,
    artificer: ITestArtificer,
    pm: PM
  ) => Promise<I["isubject"]>;
  beforeEach: (
    subject: I["isubject"],
    initializer: (c?) => I["given"],
    artificer: ITestArtificer,
    testResource: ITTestResourceConfiguration,
    initialValues,
    pm: PM
  ) => Promise<I["istore"]>;
};

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
  I extends IBaseTest<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> = Partial<IWebTestInterface<I>>;

export type ITestSpecification<
  I extends Ibdd_out<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> = (
  Suite: {
    [K in keyof I["suites"]]: (
      name: string,
      givens: IGivens<
        IBaseTest<
          unknown,
          unknown,
          unknown,
          unknown,
          unknown,
          unknown,
          unknown,
          Record<string, any>,
          Record<string, any>,
          Record<string, any>,
          Record<string, any>,
          Record<string, any>
        >
      >,
      checks: BaseCheck<
        IBaseTest<
          unknown,
          unknown,
          unknown,
          unknown,
          unknown,
          unknown,
          unknown,
          Record<string, any>,
          Record<string, any>,
          Record<string, any>,
          Record<string, any>,
          Record<string, any>
        >
      >[]
    ) => BaseSuite<
      IBaseTest<
        unknown,
        unknown,
        unknown,
        unknown,
        unknown,
        unknown,
        unknown,
        Record<string, any>,
        Record<string, any>,
        Record<string, any>,
        Record<string, any>,
        Record<string, any>
      >
    >;
  },
  Given: {
    [K in keyof I["givens"]]: (
      features: string[],
      whens: BaseWhen<
        IBaseTest<
          unknown,
          unknown,
          unknown,
          unknown,
          unknown,
          unknown,
          unknown,
          Record<string, any>,
          Record<string, any>,
          Record<string, any>,
          Record<string, any>,
          Record<string, any>
        >
      >[],
      thens: BaseThen<
        IBaseTest<
          unknown,
          unknown,
          unknown,
          unknown,
          unknown,
          unknown,
          unknown,
          Record<string, any>,
          Record<string, any>,
          Record<string, any>,
          Record<string, any>,
          Record<string, any>
        >
      >[],
      ...xtrasB: I["givens"][K]
    ) => BaseGiven<
      IBaseTest<
        unknown,
        unknown,
        unknown,
        unknown,
        unknown,
        unknown,
        unknown,
        Record<string, any>,
        Record<string, any>,
        Record<string, any>,
        Record<string, any>,
        Record<string, any>
      >
    >;
  },
  When: {
    [K in keyof I["whens"]]: (
      ...xtrasC: I["whens"][K]
    ) => BaseWhen<
      IBaseTest<
        unknown,
        unknown,
        unknown,
        unknown,
        unknown,
        unknown,
        unknown,
        Record<string, any>,
        Record<string, any>,
        Record<string, any>,
        Record<string, any>,
        Record<string, any>
      >
    >;
  },
  Then: {
    [K in keyof I["thens"]]: (
      ...xtrasD: I["thens"][K]
    ) => BaseThen<
      IBaseTest<
        unknown,
        unknown,
        unknown,
        unknown,
        unknown,
        unknown,
        unknown,
        Record<string, any>,
        Record<string, any>,
        Record<string, any>,
        Record<string, any>,
        Record<string, any>
      >
    >;
  },
  Check: ITestCheckCallback<
    IBaseTest<
      unknown,
      unknown,
      unknown,
      unknown,
      unknown,
      unknown,
      unknown,
      Record<string, any>,
      Record<string, any>,
      Record<string, any>,
      Record<string, any>,
      Record<string, any>
    >
  >
) => any[];

export type ITestImplementation<
  IN extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
  OUT extends Ibdd_out<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> = {
  suites: {
    [K in keyof OUT["suites"]]: string;
  };
  givens: {
    [K in keyof OUT["givens"]]: (...Ig: OUT["givens"][K]) => IN["given"];
  };
  whens: {
    [K in keyof OUT["whens"]]: (
      ...Iw: OUT["whens"][K]
    ) => (zel: IN["iselection"], utils: PM) => Promise<IN["when"]>;
  };
  thens: {
    [K in keyof OUT["thens"]]: (
      ...It: OUT["thens"][K]
    ) => (ssel: IN["iselection"], utils: PM) => IN["then"];
  };
  checks: {
    [K in keyof OUT["checks"]]: (...Ic: OUT["checks"][K]) => IN["given"];
  };
};

export type Modify<T, R> = Omit<T, keyof R> & R;

export type IBaseTest<
  IInput,
  ISubject,
  IStore,
  ISelection,
  IGiven,
  IWhen,
  IThen,
  ISuites extends Record<string, any>,
  IGivens extends Record<string, any>,
  IWhens extends Record<string, any>,
  IThens extends Record<string, any>,
  IChecks extends Record<string, any>
> = {
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
