const defaultTestResource: ITTestResourceConfiguration = { name: "", fs: ".", ports: [] };

export type ITTestResourceConfiguration = {
  name: string;
  fs: string;
  ports: number[];
};

export type ITTestResourceRequirement = {
  name: string;
  ports: number;
  fs: string;
};

export type ITTestResourceRequest = {
  ports: number;
};

export type Modify<Type, Replace> = Omit<Type, keyof Replace> & Replace;

export type ITTestShape = {
  suites;
  givens;
  whens;
  thens;
  checks;
};

export type ILogWriter = {
  createWriteStream: (line: string) => any | any,
  writeFileSync: (fp: string, contents: string) => any
  mkdirSync: (fp: string) => any
  testArtiFactoryfileWriter: (tLog: ITLog) => (fp: any) => (givenNdx: any) => (key: any, value: any) => void
  startup: (testResource: string, t: ITestJob, testResourceRequirement: ITTestResourceRequirement) => Promise<any>
}

type IGivens<ISubject, IStore, ISelection, IThenShape> = Record<string, BaseGiven<ISubject, IStore, ISelection, IThenShape>>;

type ITestCheckCallback<ITestShape extends ITTestShape> = {
  [K in keyof ITestShape["checks"]]: (
    name: string,
    features: string[],
    callbackA: (
      whens: {
        [K in keyof ITestShape["whens"]]: (
          ...unknown
        ) => BaseWhen<unknown, unknown, unknown>;
      },
      thens: {
        [K in keyof ITestShape["thens"]]: (
          ...unknown
        ) => BaseThen<unknown, unknown, unknown>;
      }
    ) => Promise<any>,
    ...xtrasA: ITestShape["checks"][K]
  ) => BaseCheck<unknown, unknown, unknown, unknown, ITestShape>;
};

export type ITestSpecification<ITestShape extends ITTestShape> = (
  Suite: {
    [K in keyof ITestShape["suites"]]: (
      name: string,
      givens: IGivens<unknown, unknown, unknown, unknown>,
      checks: BaseCheck<unknown, unknown, unknown, unknown, ITestShape>[]
    ) => BaseSuite<unknown, unknown, unknown, unknown, unknown, ITestShape>;
  },
  Given: {
    [K in keyof ITestShape["givens"]]: (
      // name: string,
      features: string[],
      whens: BaseWhen<unknown, unknown, unknown>[],
      thens: BaseThen<unknown, unknown, unknown>[],
      ...xtrasB: ITestShape["givens"][K]
    ) => BaseGiven<unknown, unknown, unknown, unknown>;
  },
  When: {
    [K in keyof ITestShape["whens"]]: (
      ...xtrasC: ITestShape["whens"][K]
    ) => BaseWhen<unknown, unknown, unknown>;
  },
  Then: {
    [K in keyof ITestShape["thens"]]: (
      ...xtrasD: ITestShape["thens"][K]
    ) => BaseThen<unknown, unknown, unknown>;
  },
  Check: ITestCheckCallback<ITestShape>
) => any[];

export type ITestArtificer = (key: string, data: any) => void;
export type IRunTimeAndSubject = {
  runtime: "just node" | "just web" | "both web and node";
  entrypoint: string;
};

type IRunner = (x: ITTestResourceConfiguration, t: ITLog) => Promise<boolean>;

export type IT = {
  toObj(): object;
  name: string;
  givens: IGivens<unknown, unknown, unknown, unknown>;
  checks: BaseCheck<unknown, unknown, unknown, unknown, ITTestShape>[];
  testResourceConfiguration: ITTestResourceConfiguration;
};

export type ITestJob = {
  toObj(): object;
  test: IT;
  runner: IRunner;
  testResourceRequirement: ITTestResourceRequirement;
  receiveTestResourceConfig: (testResource?) => boolean;
};

export type ITestResults = Promise<{ test: IT }>[];

export const defaultTestResourceRequirement: ITTestResourceRequest = {
  ports: 0
};

export type ITestArtifactory = (key: string, value: string) => unknown;
export type ITLog = (...string) => void;

export type ITestImplementation<
  IState,
  ISelection,
  IWhenShape,
  IThenShape,
  ITestShape extends ITTestShape
> = {
  Suites: {
    [K in keyof ITestShape["suites"]]: string;
  };
  Givens: {
    [K in keyof ITestShape["givens"]]: (
      ...Ig: ITestShape["givens"][K]
    ) => IState;
  };
  Whens: {
    [K in keyof ITestShape["whens"]]: (
      ...Iw: ITestShape["whens"][K]
    ) => (zel: ISelection) => IWhenShape;
  };
  Thens: {
    [K in keyof ITestShape["thens"]]: (
      ...It: ITestShape["thens"][K]
    ) => (ssel: ISelection) => IThenShape;
  };
  Checks: {
    [K in keyof ITestShape["checks"]]: (
      ...Ic: ITestShape["checks"][K]
    ) => IState;
  };
};

export abstract class BaseSuite<
  IInput,
  ISubject,
  IStore,
  ISelection,
  IThenShape,
  ITestShape extends ITTestShape
> {
  name: string;
  givens: IGivens<ISubject, IStore, ISelection, IThenShape>;
  checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>[];
  store: IStore;
  fails: BaseGiven<ISubject, IStore, ISelection, IThenShape>[];
  testResourceConfiguration: ITTestResourceConfiguration;

  constructor(
    name: string,
    givens: IGivens<ISubject, IStore, ISelection, IThenShape> = {},
    checks: BaseCheck<
      ISubject,
      IStore,
      ISelection,
      IThenShape,
      ITestShape
    >[] = []
  ) {
    this.name = name;
    this.givens = givens;
    this.checks = checks;
    this.fails = [];
  }

  public toObj() {
    return {
      name: this.name,
      givens: Object.keys(this.givens).map((k) => this.givens[k].toObj()),
      fails: this.fails,
    };
  }

  setup(s: IInput, artifactory: ITestArtifactory): Promise<ISubject> {
    return new Promise((res) => res(s as unknown as ISubject));
  }

  test(t: IThenShape): unknown {
    return t;
  }

  async run(
    input,
    testResourceConfiguration: ITTestResourceConfiguration,
    artifactory: (gndex: string) => (a: string, b: string) => void,
    tLog: (...string) => void
  ): Promise<
    BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape>
  > {
    this.testResourceConfiguration = testResourceConfiguration;

    const subject = await this.setup(input, artifactory("-1"));

    tLog("\nSuite:", this.name, testResourceConfiguration);
    tLog("subject:", subject);

    for (const k of Object.keys(this.givens)) {
      const giver = this.givens[k];
      try {
        this.store = await giver.give(
          subject,
          k,
          testResourceConfiguration,
          this.test,
          artifactory(k),
          tLog
        );
      } catch (e) {
        console.error(e);
        this.fails.push(giver);
        return this;
      }
    }
    for (const [ndx, thater] of this.checks.entries()) {
      await thater.check(
        subject,
        thater.name,
        testResourceConfiguration,
        this.test,
        artifactory,
        tLog
      );
    }

    // @TODO fix me
    for (const k of Object.keys(this.givens)) {
      const giver = this.givens[k];
      giver.afterAll(this.store, artifactory);
    }
    ////////////////

    return this;
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

export abstract class BaseGiven<ISubject, IStore, ISelection, IThenShape> {
  name: string;
  features: string[];
  whens: BaseWhen<IStore, ISelection, IThenShape>[];
  thens: BaseThen<ISelection, IStore, IThenShape>[];
  error: Error;
  store: IStore;
  recommendedFsPath: string;

  constructor(
    name: string,
    features: string[],
    whens: BaseWhen<IStore, ISelection, IThenShape>[],
    thens: BaseThen<ISelection, IStore, IThenShape>[]
  ) {
    this.name = name;
    this.features = features;
    this.whens = whens;
    this.thens = thens;
  }

  beforeAll(store: IStore, artifactory: ITestArtifactory) {
    return store;
  }

  afterAll(store: IStore, artifactory: ITestArtifactory) {
    return store;
  }

  toObj() {
    return {
      name: this.name,
      whens: this.whens.map((w) => w.toObj()),
      thens: this.thens.map((t) => t.toObj()),
      errors: this.error,
      features: this.features,
    };
  }

  abstract givenThat(
    subject: ISubject,
    testResourceConfiguration,
    artifactory: ITestArtifactory
  ): Promise<IStore>;

  async afterEach(
    store: IStore,
    key: string,
    artifactory: ITestArtifactory
  ): Promise<unknown> {
    return;
  }

  async give(
    subject: ISubject,
    key: string,
    testResourceConfiguration,
    tester,
    artifactory: ITestArtifactory,
    tLog: ITLog
  ) {
    tLog(`\n Given: ${this.name}`);

    try {
      this.store = await this.givenThat(
        subject,
        testResourceConfiguration,
        artifactory
      );

      tLog(`\n Given this.store`);
      for (const whenStep of this.whens) {

        await whenStep.test(this.store, testResourceConfiguration, tLog);
      }
      for (const thenStep of this.thens) {
        const t = await thenStep.test(
          this.store,
          testResourceConfiguration,
          tLog
        );
        tester(t);
      }
    } catch (e) {
      this.error = e;
      tLog("\u0007"); // bell
      // throw e;
    } finally {
      try {
        await this.afterEach(this.store, key, artifactory);
      } catch (e) {
        console.error("afterEach failed! no error will be recorded!", e);
      }
    }
    return this.store;
  }
}

export abstract class BaseWhen<IStore, ISelection, IThenShape> {
  public name: string;
  actioner: (x: ISelection) => IThenShape;
  error: boolean;

  constructor(
    name: string,
    actioner: (xyz: ISelection) => IThenShape) {
    this.name = name;
    this.actioner = actioner;
  }

  abstract andWhen(
    store: IStore,
    actioner: (x: ISelection) => IThenShape,
    testResource
  );

  toObj() {
    return {
      name: this.name,
      error: this.error,
    };
  }

  async test(store: IStore, testResourceConfiguration, tLog: ITLog) {
    tLog(" When:", this.name);
    try {
      return await this.andWhen(
        store,
        this.actioner,
        testResourceConfiguration
      );
    } catch (e) {
      this.error = true;
      throw e;
    }
  }
}

export abstract class BaseThen<ISelection, IStore, IThenShape> {
  public name: string;
  thenCB: (storeState: ISelection) => IThenShape;
  error: boolean;

  constructor(name: string, thenCB: (val: ISelection) => IThenShape) {
    this.name = name;
    this.thenCB = thenCB;
  }

  toObj() {
    return {
      name: this.name,
      error: this.error,
    };
  }

  abstract butThen(store: any, testResourceConfiguration?): Promise<ISelection>;

  async test(
    store: IStore,
    testResourceConfiguration,
    tLog: ITLog
  ): Promise<IThenShape | undefined> {
    tLog(" Then:", this.name);
    try {
      return this.thenCB(await this.butThen(store, testResourceConfiguration));
    } catch (e) {
      console.log("test failed", e);
      this.error = true;
      throw e;
    }

    // try {
    //   return await (this.thenCB(
    //     await (async () => {
    //       try {
    //         return await (
    //           (() => {
    //             try {
    //               return this.butThen(store, testResourceConfiguration)
    //             } catch (e) {
    //               this.error = true;
    //               throw e
    //             }
    //           })()
    //         );
    //       } catch (e) {
    //         this.error = true;
    //         throw e
    //       }
    //     })()
    //   ));
    // } catch (e) {
    //   this.error = true;
    //   throw e
    // }
  }
}

export abstract class BaseCheck<
  ISubject,
  IStore,
  ISelection,
  IThenShape,
  ITestShape extends ITTestShape
> {
  name: string;
  features: string[];
  checkCB: (whens, thens) => any;
  whens: {
    [K in keyof ITestShape["whens"]]: (
      p,
      tc
    ) => BaseWhen<IStore, ISelection, IThenShape>;
  };
  thens: {
    [K in keyof ITestShape["thens"]]: (
      p,
      tc
    ) => BaseThen<ISelection, IStore, IThenShape>;
  };

  constructor(
    name: string,
    features: string[],
    checkCB: (whens, thens) => any,
    whens,
    thens
  ) {
    this.name = name;
    this.features = features;
    this.checkCB = checkCB;
    this.whens = whens;
    this.thens = thens;
  }

  abstract checkThat(
    subject: ISubject,
    testResourceConfiguration,
    artifactory: ITestArtifactory
  ): Promise<IStore>;

  async afterEach(store: IStore, key: string, cb?): Promise<unknown> {
    return;
  }

  async check(
    subject: ISubject,
    key: string,
    testResourceConfiguration,
    tester,
    artifactory: ITestArtifactory,
    tLog: ITLog
  ) {
    tLog(`\n Check: ${this.name}`);
    const store = await this.checkThat(
      subject,
      testResourceConfiguration,
      artifactory
    );
    await this.checkCB(
      Object.entries(this.whens).reduce((a, [key, when]) => {
        a[key] = async (payload) => {
          return await when(payload, testResourceConfiguration).test(
            store,
            testResourceConfiguration,
            tLog
          );
        };
        return a;
      }, {}),
      Object.entries(this.thens).reduce((a, [key, then]) => {
        a[key] = async (payload) => {
          const t = await then(payload, testResourceConfiguration).test(
            store,
            testResourceConfiguration,
            tLog
          );
          tester(t);
        };
        return a;
      }, {})
    );

    await this.afterEach(store, key);
    return;
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

abstract class TesterantoLevelZero<
  IInput,
  ISubject,
  IStore,
  ISelection,
  SuiteExtensions,
  GivenExtensions,
  WhenExtensions,
  ThenExtensions,
  CheckExtensions,
  IThenShape
> {
  constructorator: IStore;

  suitesOverrides: Record<
    keyof SuiteExtensions,
    (
      name: string,
      givens: IGivens<ISubject, IStore, ISelection, IThenShape>,
      checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape>[]
    ) => BaseSuite<
      IInput,
      ISubject,
      IStore,
      ISelection,
      IThenShape,
      ITTestShape
    >
  >;

  givenOverides: Record<
    keyof GivenExtensions,
    (
      name: string,
      features: string[],
      whens: BaseWhen<IStore, ISelection, IThenShape>[],
      thens: BaseThen<ISelection, IStore, IThenShape>[],
      ...xtraArgs
    ) => BaseGiven<ISubject, IStore, ISelection, IThenShape>
  >;

  whenOverides: Record<
    keyof WhenExtensions,
    (any) => BaseWhen<IStore, ISelection, IThenShape>
  >;

  thenOverides: Record<
    keyof ThenExtensions,
    (
      selection: ISelection,
      expectation: any
    ) => BaseThen<ISelection, IStore, IThenShape>
  >;

  checkOverides: Record<
    keyof CheckExtensions,
    (
      feature: string,
      callback: (whens, thens) => any,
      ...xtraArgs
    ) => BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape>
  >;

  constructor(
    public readonly cc: IStore,
    suitesOverrides: Record<
      keyof SuiteExtensions,
      (
        name: string,
        givens: IGivens<ISubject, IStore, ISelection, IThenShape>,
        checks: BaseCheck<
          ISubject,
          IStore,
          ISelection,
          IThenShape,
          ITTestShape
        >[]
      ) => BaseSuite<
        IInput,
        ISubject,
        IStore,
        ISelection,
        IThenShape,
        ITTestShape
      >
    >,

    givenOverides: Record<
      keyof GivenExtensions,
      (
        name: string,
        features: string[],
        whens: BaseWhen<IStore, ISelection, IThenShape>[],
        thens: BaseThen<ISelection, IStore, IThenShape>[],
        ...xtraArgs
      ) => BaseGiven<ISubject, IStore, ISelection, IThenShape>
    >,

    whenOverides: Record<
      keyof WhenExtensions,
      (c: any) => BaseWhen<IStore, ISelection, IThenShape>
    >,

    thenOverides: Record<
      keyof ThenExtensions,
      (
        selection: ISelection,
        expectation: any
      ) => BaseThen<ISelection, IStore, IThenShape>
    >,

    checkOverides: Record<
      keyof CheckExtensions,
      (
        feature: string,
        callback: (whens, thens) => any,
        ...xtraArgs
      ) => BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape>
    >
  ) {
    this.constructorator = cc;
    this.suitesOverrides = suitesOverrides;
    this.givenOverides = givenOverides;
    this.whenOverides = whenOverides;
    this.thenOverides = thenOverides;
    this.checkOverides = checkOverides;
  }

  Suites() {
    return this.suitesOverrides;
  }

  Given(): Record<
    keyof GivenExtensions,
    (
      name: string,
      features: string[],
      whens: BaseWhen<IStore, ISelection, IThenShape>[],
      thens: BaseThen<ISelection, IStore, IThenShape>[],
      ...xtraArgs
    ) => BaseGiven<ISubject, IStore, ISelection, IThenShape>
  > {
    return this.givenOverides;
  }

  When(): Record<
    keyof WhenExtensions,
    (arg0: IStore, ...arg1: any) => BaseWhen<IStore, ISelection, IThenShape>
  > {
    return this.whenOverides;
  }

  Then(): Record<
    keyof ThenExtensions,
    (
      selection: ISelection,
      expectation: any
    ) => BaseThen<ISelection, IStore, IThenShape>
  > {
    return this.thenOverides;
  }

  Check(): Record<
    keyof CheckExtensions,
    (
      feature: string,
      callback: (whens, thens) => any,
      whens,
      thens
    ) => BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape>
  > {
    return this.checkOverides;
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

abstract class TesterantoLevelOne<
  ITestShape extends ITTestShape,
  IInitialState,
  ISelection,
  IStore,
  ISubject,
  IWhenShape,
  IThenShape,
  IInput
> {
  constructor(
    testImplementation: ITestImplementation<
      IInitialState,
      ISelection,
      IWhenShape,
      IThenShape,
      ITestShape
    >,

    testSpecification: (
      Suite: {
        [K in keyof ITestShape["suites"]]: (
          feature: string,
          givens: IGivens<ISubject, IStore, ISelection, IThenShape>,
          checks: BaseCheck<
            ISubject,
            IStore,
            ISelection,
            IThenShape,
            ITestShape
          >[]
        ) => BaseSuite<
          IInput,
          ISubject,
          IStore,
          ISelection,
          IThenShape,
          ITestShape
        >;
      },
      Given: {
        [K in keyof ITestShape["givens"]]: (
          features: string[],
          whens: BaseWhen<IStore, ISelection, IThenShape>[],
          thens: BaseThen<ISelection, IStore, IThenShape>[],
          ...a: ITestShape["givens"][K]
        ) => BaseGiven<ISubject, IStore, ISelection, IThenShape>;
      },
      When: {
        [K in keyof ITestShape["whens"]]: (
          ...a: ITestShape["whens"][K]
        ) => BaseWhen<IStore, ISelection, IThenShape>;
      },
      Then: {
        [K in keyof ITestShape["thens"]]: (
          ...a: ITestShape["thens"][K]
        ) => BaseThen<ISelection, IStore, IThenShape>;
      },
      Check: ITestCheckCallback<ITestShape>,
      logWriter: ILogWriter
    ) => BaseSuite<
      IInput,
      ISubject,
      IStore,
      ISelection,
      IThenShape,
      ITestShape
    >[],

    input: IInput,

    suiteKlasser: (
      name: string,
      givens: IGivens<ISubject, IStore, ISelection, IThenShape>,
      checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>[]
    ) => BaseSuite<
      IInput,
      ISubject,
      IStore,
      ISelection,
      IThenShape,
      ITestShape
    >,
    givenKlasser: (
      n,
      f,
      w,
      t,
      z?
    ) => BaseGiven<ISubject, IStore, ISelection, IThenShape>,
    whenKlasser: (s, o) => BaseWhen<IStore, ISelection, IThenShape>,
    thenKlasser: (s, o) => BaseThen<IStore, ISelection, IThenShape>,
    checkKlasser: (
      n,
      f,
      cb,
      w,
      t
    ) => BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>,

    testResourceRequirement,
    logWriter: ILogWriter
  ) {
    const classySuites = Object.entries(testImplementation.Suites).reduce(
      (a, [key]) => {
        a[key] = (somestring, givens, checks) => {
          return new suiteKlasser.prototype.constructor(
            somestring,
            givens,
            checks
          );
        };
        return a;
      },
      {}
    );

    const classyGivens = Object.entries(testImplementation.Givens)
      .reduce(
        (a, [key, z]: [string, any]) => {
          a[key] = (
            features,
            whens,
            thens,
            ...xtrasW
          ) => {
            return new givenKlasser.prototype.constructor(
              key,
              features,
              whens,
              thens,
              z(...xtrasW)
            );
          };
          return a;
        },
        {}
      );

    const classyWhens = Object.entries(testImplementation.Whens).reduce(
      (a, [key, whEn]) => {
        a[key] = (payload?: any) => {
          return new whenKlasser.prototype.constructor(
            `${whEn.name}: ${payload && payload.toString()}`,
            whEn(payload)
          );
        };
        return a;
      },
      {}
    );

    const classyThens = Object.entries(testImplementation.Thens).reduce(
      (a, [key, thEn]) => {
        a[key] = (expected: any, x) => {
          return new thenKlasser.prototype.constructor(
            `${thEn.name}: ${expected && expected.toString()}`,
            thEn(expected)
          );
        };
        return a;
      },
      {}
    );

    const classyChecks = Object.entries(testImplementation.Checks).reduce(
      (a, [key, z]) => {
        a[key] = (somestring, features, callback) => {
          return new checkKlasser.prototype.constructor(
            somestring,
            features,
            callback,
            classyWhens,
            classyThens
          );
        };
        return a;
      },
      {}
    );

    const classyTesteranto = new (class <
      IInput,
      ISubject,
      IStore,
      ISelection,
      SuiteExtensions,
      GivenExtensions,
      WhenExtensions,
      ThenExtensions,
      ICheckExtensions,
      IThenShape
    > extends TesterantoLevelZero<
      IInput,
      ISubject,
      IStore,
      ISelection,
      SuiteExtensions,
      GivenExtensions,
      WhenExtensions,
      ThenExtensions,
      ICheckExtensions,
      IThenShape
    > { })(
      input,
      classySuites,
      classyGivens,
      classyWhens,
      classyThens,
      classyChecks
    );

    const suites = testSpecification(
      /* @ts-ignore:next-line */
      classyTesteranto.Suites(),
      classyTesteranto.Given(),
      classyTesteranto.When(),
      classyTesteranto.Then(),
      classyTesteranto.Check(),
      logWriter
    );

    const suiteRunner =
      (suite) =>
        async (
          testResourceConfiguration: ITTestResourceConfiguration,
          tLog: ITLog
        ): Promise<BaseSuite<
          IInput, ISubject, IStore, ISelection, IThenShape, ITestShape
        >> => {
          return await suite.run(
            input,
            testResourceConfiguration,
            logWriter.testArtiFactoryfileWriter(tLog)(testResourceConfiguration.fs + "/"),
            tLog
          );
        };

    /* @ts-ignore:next-line */
    const toReturn: ITestJob[] = suites.map((suite) => {
      const runner = suiteRunner(suite);

      return {
        test: suite,
        testResourceRequirement,

        toObj: () => {
          return suite.toObj();
        },

        runner,

        receiveTestResourceConfig: async function (
          testResourceConfiguration = defaultTestResource
        ) {
          console.log(
            `testResourceConfiguration ${JSON.stringify(
              testResourceConfiguration,
              null,
              2
            )}`
          );

          await logWriter.mkdirSync(testResourceConfiguration.fs);

          const logFilePath = (
            `${testResourceConfiguration.fs}/log.txt`
          );

          const access = await logWriter.createWriteStream(logFilePath);

          const tLog = (...l: string[]) => {
            console.log(...l);
            access.write(`${l.toString()}\n`);
          };
          const suiteDone: BaseSuite<
            IInput,
            ISubject,
            IStore,
            ISelection,
            IThenShape,
            ITestShape
          > = await runner(testResourceConfiguration, tLog);
          const resultsFilePath = (
            `${testResourceConfiguration.fs}/results.json`
          );

          logWriter.writeFileSync(
            resultsFilePath,
            JSON.stringify(suiteDone.toObj(), null, 2)
          );
          access.close();

          const numberOfFailures = Object.keys(suiteDone.givens).filter(
            (k) => suiteDone.givens[k].error
          ).length;
          console.log(`suiteDone.givens`, suiteDone.givens);
          console.log(`exiting gracefully with ${numberOfFailures} failures.`);
        },
      };
    });

    return toReturn;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////

export default class TesterantoLevelTwo<TestShape extends ITTestShape,
  InitialStateShape,
  Selection,
  Store,
  Subject,
  WhenShape,
  ThenShape,
  Input> extends TesterantoLevelOne<
    TestShape,
    InitialStateShape,
    Selection,
    Store,
    Subject,
    WhenShape,
    ThenShape,
    Input
  > {
  constructor(
    input: Input,
    testSpecification: ITestSpecification<TestShape>,
    testImplementation,
    testInterface: {
      actionHandler?: (b: (...any) => any) => any;
      andWhen: (
        store: Store,
        actioner,
        testResource: ITTestResourceConfiguration
      ) => Promise<Selection>;
      butThen?: (
        store: Store,
        callback,
        testResource: ITTestResourceConfiguration
      ) => Promise<Selection>;
      assertioner?: (t: ThenShape) => any;

      afterAll?: (store: Store, artificer: ITestArtificer) => any;
      afterEach?: (
        store: Store,
        key: string,
        artificer: ITestArtificer
      ) => Promise<unknown>;
      beforeAll?: (input: Input, artificer: ITestArtificer) => Promise<Subject>;
      beforeEach?: (
        subject: Subject,
        initialValues,
        testResource: ITTestResourceConfiguration,
        artificer: ITestArtificer
      ) => Promise<Store>;
    },
    testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
    assertioner: (t: ThenShape) => any,
    beforeEach: (
      subject: Subject,
      initialValues,
      testResource: ITTestResourceConfiguration,
      artificer: ITestArtificer
    ) => Promise<Store>,
    afterEach: (
      store: Store,
      key: string,
      artificer: ITestArtificer
    ) => Promise<unknown>,
    afterAll: (store: Store, artificer: ITestArtificer) => any,
    butThen: (
      s: Store,
      bt: (storeState: Selection) => ThenShape,
      testResource: ITTestResourceConfiguration,
    ) => any,
    andWhen: (
      store: Store,
      actioner,
      testResource: ITTestResourceConfiguration
    ) => Promise<Selection>,
    actionHandler: (b: (...any) => any) => any,
    logWriter: ILogWriter
  ) {
    super(
      testImplementation,
      testSpecification,
      input,

      class extends BaseSuite<
        Input,
        Subject,
        Store,
        Selection,
        ThenShape,
        TestShape
      > {
        async setup(s: Input, artifactory): Promise<Subject> {
          return (testInterface.beforeAll || (async (input: Input, artificer: ITestArtificer) => input as any))(s, artifactory);
        }
        test(t: ThenShape): unknown {
          return assertioner(t);
        }
      } as any,

      class Given extends BaseGiven<Subject, Store, Selection, ThenShape> {
        initialValues: any;
        constructor(
          name: string,
          features: string[],
          whens: BaseWhen<Store, Selection, ThenShape>[],
          thens: BaseThen<Selection, Store, ThenShape>[],
          initialValues: any
        ) {
          super(
            name,
            features,
            whens,
            thens
          );
          this.initialValues = initialValues;
        }
        async givenThat(subject, testResource, artifactory) {
          return beforeEach(
            subject,
            this.initialValues,
            testResource,
            artifactory
          );
        }
        afterEach(
          store: Store,
          key: string,
          artifactory
        ): Promise<unknown> {
          return new Promise((res) =>
            res(afterEach(store, key, artifactory))
          );
        }
        afterAll(store, artifactory) {
          return afterAll(store, artifactory);
        }
      } as any,

      class When extends BaseWhen<Store, Selection, WhenShape> {
        payload?: any;

        constructor(
          name: string,
          actioner: (...any) => any, payload?: any) {
          super(
            name,
            (store) => {
              return actionHandler(actioner);
            });
          this.payload = payload;
        }

        async andWhen(store, actioner, testResource) {
          return await andWhen(store, actioner, testResource);
        }
      } as any,

      class Then extends BaseThen<Selection, Store, ThenShape> {
        constructor(name: string, callback: (val: Selection) => ThenShape) {
          super(name, callback);
        }

        async butThen(
          store: any,
          testResourceConfiguration?: any
        ): Promise<Selection> {
          return await butThen(store, this.thenCB, testResourceConfiguration);
        }
      } as any,

      class Check extends BaseCheck<
        Subject,
        Store,
        Selection,
        ThenShape,
        TestShape
      > {
        initialValues: any;

        constructor(
          name: string,
          features: string[],
          checkCallback: (a, b) => any,
          whens,
          thens,
          initialValues: any
        ) {
          super(name, features, checkCallback, whens, thens);
          this.initialValues = initialValues;
        }

        async checkThat(subject, testResourceConfiguration, artifactory) {
          return beforeEach(
            subject,
            this.initialValues,
            testResourceConfiguration,
            artifactory
          );
        }

        afterEach(
          store: Store,
          key: string,
          artifactory
        ): Promise<unknown> {
          return new Promise((res) =>
            res(afterEach(store, key, artifactory))
          );
        }
      } as any,

      testResourceRequirement,
      // nameKey,
      logWriter
    );
  }
}
