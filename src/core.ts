import { ITTestShape, ITestImplementation, ITestSpecification } from "./Types";
import {
  BaseWhen, BaseThen, BaseCheck, BaseSuite, BaseGiven, IGivens
} from "./base";
import {
  ILogWriter, ITLog, ITTestResourceConfiguration, ITTestResourceRequest, ITestArtificer, ITestCheckCallback, ITestJob, defaultTestResourceRequirement
} from "./lib";

abstract class BaseBuilder<
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
      index: number,
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
        index: number,
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

abstract class ClassBuilder<
  ITestShape extends ITTestShape,
  IInitialState,
  ISelection,
  IStore,
  ISubject,
  IWhenShape,
  IThenShape,
  IInput
> {

  artifacts: Promise<unknown>[] = [];
  testJobs: ITestJob[];

  constructor(
    testImplementation: ITestImplementation<
      IInput,
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
      index: number,
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

    const classyGivens = Object.keys(testImplementation.Givens)
      .reduce(
        (a, key: string) => {
          a[key] = (
            features,
            whens,
            thens,
            ...xtrasW
          ) => {
            // const f = testImplementation.Givens[key](...xtrasW);
            return new givenKlasser.prototype.constructor(
              key,
              features,
              whens,
              thens,
              ((phunkshun) => {

              })(testImplementation.Givens[key])
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
    > extends BaseBuilder<
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
      (suite: BaseSuite<
        IInput,
        ISubject,
        IStore,
        ISelection,
        IThenShape,
        ITestShape
      >) =>
        async (
          testResourceConfiguration: ITTestResourceConfiguration,
          tLog: ITLog
        ): Promise<BaseSuite<
          IInput, ISubject, IStore, ISelection, IThenShape, ITestShape
        >> => {
          return await suite.run(
            input,
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
            ITestShape
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

}

export default class Testeranto<TestShape extends ITTestShape,
  IState,
  ISelection,
  IStore,
  ISubject,
  WhenShape,
  ThenShape,
  IInput
> extends ClassBuilder<
  TestShape,
  IState,
  ISelection,
  IStore,
  ISubject,
  WhenShape,
  ThenShape,
  IInput
> {
  constructor(
    input: IInput,
    testSpecification: ITestSpecification<
      TestShape,
      ISubject,
      IStore,
      ISelection,
      ThenShape
    >,
    testImplementation,
    testInterface: {
      actionHandler?: (b: (...any) => any) => any;
      andWhen: (
        store: IStore,
        actioner,
        testResource: ITTestResourceConfiguration
      ) => Promise<ISelection>;
      butThen?: (
        store: IStore,
        callback,
        testResource: ITTestResourceConfiguration
      ) => Promise<ISelection>;
      assertioner?: (t: ThenShape) => any;

      afterAll?: (store: IStore, artificer: ITestArtificer) => any;
      afterEach?: (
        store: IStore,
        key: string,
        artificer: ITestArtificer
      ) => Promise<unknown>;

      beforeAll?: (
        input: IInput,
        artificer: ITestArtificer,
        testResource: ITTestResourceConfiguration
      ) => Promise<ISubject>;

      beforeEach?: (
        subject: ISubject,
        initialValues,
        testResource: ITTestResourceConfiguration,
        artificer: ITestArtificer
      ) => Promise<IStore>;
    },
    testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
    assertioner: (t: ThenShape) => any,
    beforeEach: (
      subject: ISubject,
      initialValues,
      testResource: ITTestResourceConfiguration,
      artificer: ITestArtificer
    ) => Promise<IStore>,
    afterEach: (
      store: IStore,
      key: string,
      artificer: ITestArtificer
    ) => Promise<unknown>,
    afterAll: (store: IStore, artificer: ITestArtificer) => any,
    butThen: (
      s: IStore,
      bt: (storeState: ISelection) => ThenShape,
      testResource: ITTestResourceConfiguration,
    ) => any,
    andWhen: (
      store: IStore,
      actioner,
      testResource: ITTestResourceConfiguration
    ) => Promise<ISelection>,
    actionHandler: (b: (...any) => any) => any,
    logWriter: ILogWriter
  ) {
    super(
      testImplementation,
      testSpecification,
      input,

      class extends BaseSuite<
        IInput,
        ISubject,
        IStore,
        ISelection,
        ThenShape,
        TestShape
      > {
        async setup(s: IInput, artifactory): Promise<ISubject> {
          return (testInterface.beforeAll || (async (
            input: IInput,
            artificer: ITestArtificer,
          ) => input as any))(
            s,
            artifactory,
            this.testResourceConfiguration
          );
        }
        test(t: ThenShape): unknown {
          return assertioner(t);
        }
      } as any,

      class Given extends BaseGiven<ISubject, IStore, ISelection, ThenShape> {
        initialValues: any;
        constructor(
          name: string,
          features: string[],
          whens: BaseWhen<IStore, ISelection, ThenShape>[],
          thens: BaseThen<ISelection, IStore, ThenShape>[],
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
            (fPath: string, value: unknown) =>
              // TODO does not work?
              artifactory(`beforeEach/${fPath}`, value)
          );
        }
        afterEach(
          store: IStore,
          key: string,
          artifactory
        ): Promise<unknown> {
          return new Promise((res) =>
            res(afterEach(store, key, (fPath: string, value: unknown) =>
              artifactory(`after/${fPath}`, value)))
          );
        }
        afterAll(store, artifactory) {
          return afterAll(store, (fPath: string, value: unknown) =>
            // TODO does not work?
            artifactory(`afterAll4-${this.name}/${fPath}`, value));
        }
      } as any,

      class When extends BaseWhen<IStore, ISelection, WhenShape> {
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

      class Then extends BaseThen<ISelection, IStore, ThenShape> {
        constructor(name: string, callback: (val: ISelection) => ThenShape) {
          super(name, callback);
        }

        async butThen(
          store: any,
          testResourceConfiguration?: any
        ): Promise<ISelection> {
          return await butThen(store, this.thenCB, testResourceConfiguration);
        }
      } as any,

      class Check extends BaseCheck<
        ISubject,
        IStore,
        ISelection,
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
            (fPath: string, value: unknown) => artifactory(`before/${fPath}`, value)
          );
        }

        afterEach(
          store: IStore,
          key: string,
          artifactory
        ): Promise<unknown> {
          return new Promise((res) =>
            res(afterEach(store, key, (fPath: string, value: unknown) =>
              // TODO does not work?
              artifactory(`afterEach2-${this.name}/${fPath}`, value)))
          );
        }
      } as any,

      testResourceRequirement,
      logWriter
    );
  }
}
