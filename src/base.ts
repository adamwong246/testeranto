import {
  ITTestShape, ITTestResourceConfiguration, ITestArtifactory, ITLog,
  ITestJob,
  ILogWriter,
  ITestCheckCallback,
  ITTestResourceRequest
} from "./lib.js";
import { ITestImplementation } from "./Types";

export type IGivens<
  ISubject,
  IStore,
  ISelection,
  IThenShape,
  IGivenShape
> = Record<
  string,
  BaseGiven<
    ISubject,
    IStore,
    ISelection,
    IThenShape,
    IGivenShape
  >
>;

export abstract class BaseSuite<
  IInput,
  ISubject,
  IStore,
  ISelection,
  IThenShape,
  ITestShape extends ITTestShape,
  IGivenShape
> {
  name: string;
  givens: IGivens<ISubject, IStore, ISelection, IThenShape, IGivenShape>;
  checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>[];
  store: IStore;
  fails: BaseGiven<ISubject, IStore, ISelection, IThenShape, IGivenShape>[];
  testResourceConfiguration: ITTestResourceConfiguration;
  index: number;

  constructor(
    name: string,
    index: number,
    givens: IGivens<ISubject, IStore, ISelection, IThenShape, IGivenShape> = {},
    checks: BaseCheck<
      ISubject,
      IStore,
      ISelection,
      IThenShape,
      ITestShape
    >[] = []
  ) {
    this.name = name;
    this.index = index;
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
    artifactory: (
      fPath: string,
      value: unknown
    ) => void,
    tLog: (...string) => void
  ): Promise<
    BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape, IGivenShape>
  > {
    this.testResourceConfiguration = testResourceConfiguration;

    const suiteArtifactory = (fPath: string, value: unknown) =>
      artifactory(`suite-${this.index}-${this.name}/${fPath}`, value)
    const subject = await this.setup(input, suiteArtifactory);

    tLog("\nSuite:", this.index, this.name);
    for (const k of Object.keys(this.givens)) {
      const giver = this.givens[k];
      try {
        this.store = await giver.give(
          subject,
          k,
          testResourceConfiguration,
          this.test,
          suiteArtifactory,
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
        suiteArtifactory,
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

export abstract class BaseGiven<
  ISubject,
  IStore,
  ISelection,
  IThenShape,
  IGivenShape
> {
  name: string;
  features: string[];
  whens: BaseWhen<IStore, ISelection, IThenShape>[];
  thens: BaseThen<ISelection, IStore, IThenShape>[];
  error: Error;
  store: IStore;
  recommendedFsPath: string;
  givenCB: IGivenShape;
  initialValues: any;

  constructor(
    name: string,
    features: string[],
    whens: BaseWhen<IStore, ISelection, IThenShape>[],
    thens: BaseThen<ISelection, IStore, IThenShape>[],
    givenCB: IGivenShape,
    initialValues: any
  ) {
    this.name = name;
    this.features = features;
    this.whens = whens;
    this.thens = thens;
    this.givenCB = givenCB;
    this.initialValues = initialValues;
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
      error: this.error ? [this.error, this.error.stack] : null,
      features: this.features,
    };
  }

  abstract givenThat(
    subject: ISubject,
    testResourceConfiguration,
    artifactory: ITestArtifactory,
    givenCB: IGivenShape
  ): Promise<IStore>;

  async afterEach(
    store: IStore,
    key: string,
    artifactory: ITestArtifactory
  ): Promise<unknown> {
    return store;
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

    const givenArtifactory = (fPath: string, value: unknown) =>
      artifactory(`given-${key}/${fPath}`, value)
    try {
      this.store = await this.givenThat(
        subject,
        testResourceConfiguration,
        givenArtifactory,
        this.givenCB
      );

      // tLog(`\n Given this.store`, this.store);
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
      tLog(e);
      tLog("\u0007"); // bell
      // throw e;
    } finally {
      try {
        await this.afterEach(this.store, key, givenArtifactory);
      } catch (e) {
        console.error("afterEach failed! no error will be recorded!", e);
      }
    }
    return this.store;
  }
}

export abstract class BaseWhen<IStore, ISelection, IThenShape> {
  public name: string;
  whenCB: (x: ISelection) => IThenShape;
  error: boolean;

  constructor(
    name: string,
    whenCB: (xyz: ISelection) => IThenShape) {
    this.name = name;
    this.whenCB = whenCB;
  }

  abstract andWhen(
    store: IStore,
    whenCB: (x: ISelection) => IThenShape,
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
        this.whenCB,
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
      const x = this.thenCB(await this.butThen(store, testResourceConfiguration));
      return x;
    } catch (e) {
      console.log("test failed", e);
      this.error = true;
      throw e;
    }
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

export abstract class BaseBuilder<
  IInput,
  ISubject,
  IStore,
  ISelection,
  SuiteExtensions,
  GivenExtensions,
  WhenExtensions,
  ThenExtensions,
  CheckExtensions,
  IThenShape,
  IGivenShape,
  ITestShape extends ITTestShape,
> {

  testResourceRequirement: ITTestResourceRequest;
  artifacts: Promise<unknown>[] = [];
  testJobs: ITestJob[];

  constructorator: IStore;

  suitesOverrides: Record<
    keyof SuiteExtensions,
    (
      name: string,
      index: number,
      givens: IGivens<ISubject, IStore, ISelection, IThenShape, IGivenShape>,
      checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape>[]
    ) => BaseSuite<
      IInput,
      ISubject,
      IStore,
      ISelection,
      IThenShape,
      ITTestShape,
      IGivenShape
    >
  >;

  givenOverides: Record<
    keyof GivenExtensions,
    (
      name: string,
      features: string[],
      whens: BaseWhen<IStore, ISelection, IThenShape>[],
      thens: BaseThen<ISelection, IStore, IThenShape>[],
      gcb,
    ) => BaseGiven<ISubject, IStore, ISelection, IThenShape, IGivenShape>
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
        index: number,
        givens: IGivens<ISubject, IStore, ISelection, IThenShape, IGivenShape>,
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
        ITTestShape,
        IGivenShape
      >
    >,

    givenOverides: Record<
      keyof GivenExtensions,
      (
        name: string,
        features: string[],
        whens: BaseWhen<IStore, ISelection, IThenShape>[],
        thens: BaseThen<ISelection, IStore, IThenShape>[],
        gcb,
      ) => BaseGiven<ISubject, IStore, ISelection, IThenShape, IGivenShape>
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
    >,
    logWriter,
    testResourceRequirement,
    testSpecification,
  ) {
    this.testResourceRequirement = testResourceRequirement;
    this.constructorator = cc;
    this.suitesOverrides = suitesOverrides;
    this.givenOverides = givenOverides;
    this.whenOverides = whenOverides;
    this.thenOverides = thenOverides;
    this.checkOverides = checkOverides;

    const suites = testSpecification(
      this.Suites(),
      this.Given(),
      this.When(),
      this.Then(),
      this.Check(),
      logWriter
    );

    const suiteRunner =
      (suite: BaseSuite<
        IInput,
        ISubject,
        IStore,
        ISelection,
        IThenShape,
        ITestShape,
        IGivenShape
      >) =>
        async (
          testResourceConfiguration: ITTestResourceConfiguration,
          tLog: ITLog
        ): Promise<BaseSuite<
          IInput, ISubject, IStore, ISelection, IThenShape, ITestShape, IGivenShape
        >> => {
          return await suite.run(
            cc,
            testResourceConfiguration,
            (
              fPath: string,
              value: unknown
            ) =>
              logWriter.testArtiFactoryfileWriter(tLog, (p: Promise<void>) => {
                artifacts.push(p);
              })(
                testResourceConfiguration.fs + "/" + fPath,
                value
              ),
            tLog
          );
        };

    const artifacts = this.artifacts;

    this.testJobs = suites.map((suite) => {
      const runner = suiteRunner(suite);

      return {
        test: suite,
        testResourceRequirement,

        toObj: () => {
          return suite.toObj();
        },

        runner,

        receiveTestResourceConfig: async function (
          testResourceConfiguration = {
            name: "",
            fs: ".",
            ports: [],
            scheduled: false
          }
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
            ITestShape,
            IGivenShape
          > = await runner(testResourceConfiguration, tLog);
          const resultsFilePath = (
            `${testResourceConfiguration.fs}/results.json`
          );

          logWriter.writeFileSync(
            resultsFilePath,
            JSON.stringify(suiteDone.toObj(), null, 2)
          );

          const logPromise = new Promise((res, rej) => {
            access.on("finish", () => { res(true); });
          })
          access.end();

          const numberOfFailures = Object.keys(suiteDone.givens).filter(
            (k) => {
              // console.log(`suiteDone.givens[k].error`, suiteDone.givens[k].error);
              return suiteDone.givens[k].error
            }
          ).length;
          console.log(`exiting gracefully with ${numberOfFailures} failures.`);
          return {
            failed: numberOfFailures,
            artifacts,
            logPromise
          };
        },
      };
    });
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
      gcb,
    ) => BaseGiven<ISubject, IStore, ISelection, IThenShape, IGivenShape>
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

export abstract class ClassBuilder<
  ITestShape extends ITTestShape,
  IInitialState,
  ISelection,
  IStore,
  ISubject,
  IWhenShape,
  IThenShape,
  IInput,
  IGivenShape
> extends BaseBuilder<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any

> {

  constructor(
    testImplementation: ITestImplementation<
      IInitialState,
      ISelection,
      IWhenShape,
      IThenShape,
      ITestShape,
      IGivenShape
    >,

    testSpecification: (
      Suite: {
        [K in keyof ITestShape["suites"]]: (
          feature: string,
          givens: IGivens<ISubject, IStore, ISelection, IThenShape, IGivenShape>,
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
          ITestShape,
          IGivenShape
        >;
      },
      Given: {
        [K in keyof ITestShape["givens"]]: (
          features: string[],
          whens: BaseWhen<IStore, ISelection, IThenShape>[],
          thens: BaseThen<ISelection, IStore, IThenShape>[],
          ...a: ITestShape["givens"][K]
        ) => BaseGiven<ISubject, IStore, ISelection, IThenShape, IGivenShape>;
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
      ITestShape,
      IGivenShape
    >[],

    input: IInput,

    suiteKlasser: (
      name: string,
      index: number,
      givens: IGivens<ISubject, IStore, ISelection, IThenShape, IGivenShape>,
      checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>[]
    ) => BaseSuite<
      IInput,
      ISubject,
      IStore,
      ISelection,
      IThenShape,
      ITestShape,
      IGivenShape
    >,
    givenKlasser: (
      name,
      features,
      whens,
      thens,
      givenCB
    ) => BaseGiven<ISubject, IStore, ISelection, IThenShape, IGivenShape>,
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
      (a, [key], index) => {
        a[key] = (somestring, givens, checks) => {
          return new suiteKlasser.prototype.constructor(
            somestring,
            index,
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
        (a, [key, givEn]) => {
          a[key] = (
            features,
            whens,
            thens,
            givEn,
          ) => {
            return new (givenKlasser.prototype).constructor(
              key,
              features,
              whens,
              thens,
              testImplementation.Givens[key],
              givEn
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
    super(
      input,
      classySuites,
      classyGivens,
      classyWhens,
      classyThens,
      classyChecks,
      logWriter,
      testResourceRequirement,
      testSpecification
    );
  }

}