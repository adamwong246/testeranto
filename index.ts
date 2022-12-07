import fs from "fs";
import { mapValues } from "lodash";

export abstract class BaseFeature {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

export abstract class BaseSuite<
  IInput,
  ISubject extends any,
  IStore,
  ISelection
> {
  name: string;
  givens: BaseGiven<ISubject, IStore, ISelection>[];
  checks: BaseCheck<ISubject, IStore, ISelection>[];

  constructor(
    name: string,
    givens: BaseGiven<ISubject, IStore, ISelection>[] = [],
    checks: BaseCheck<ISubject, IStore, ISelection>[] = []
  ) {
    this.name = name;
    this.givens = givens;
    this.checks = checks;
  }

  // abstract setup(s: IInput): Promise<ISubject>;
  setup(s: IInput): Promise<ISubject> {
    return new Promise((res, rej) => res(s as unknown as ISubject));
  }

  async run(input, testResourceConfiguration?) {
    const subject = await this.setup(input);

    console.log("\nSuite:", this.name, testResourceConfiguration);

    for (const [ndx, giver] of this.givens.entries()) {
      await giver.give(subject, ndx, testResourceConfiguration);
    }

    for (const [ndx, thater] of this.checks.entries()) {
      await thater.check(subject, ndx, testResourceConfiguration);
    }
  }
}

export abstract class BaseGiven<ISubject, IStore, ISelection> {
  name: string;
  whens: BaseWhen<IStore>[];
  thens: BaseThen<ISelection, IStore>[];
  // features: BaseFeature[];

  constructor(
    name: string,
    whens: BaseWhen<IStore>[],
    thens: BaseThen<ISelection, IStore>[]
    // features: BaseFeature[]
  ) {
    this.name = name;
    this.whens = whens;
    this.thens = thens;
    // this.features = features;
  }

  abstract givenThat(subject: ISubject, testResourceConfiguration?): IStore;
  // givenThat(subject: ISubject, testResourceConfiguration?): IStore {
  //   return subject as unknown as IStore;
  // }

  async teardown(subject: IStore, ndx: number) {
    return subject;
  }

  async give(subject: ISubject, index: number, testResourceConfiguration?) {
    console.log(`\n Given: ${this.name}`);
    const store = await this.givenThat(subject, testResourceConfiguration);

    for (const whenStep of this.whens) {
      await whenStep.test(store, testResourceConfiguration);
    }

    for (const thenStep of this.thens) {
      await thenStep.test(store, testResourceConfiguration);
    }

    await this.teardown(store, index);
    return;
  }
}

export abstract class BaseWhen<IStore> {
  name: string;
  actioner: (x: any) => any;

  constructor(name: string, actioner: (x) => any) {
    this.name = name;
    this.actioner = actioner;
  }

  abstract andWhen(store: IStore, actioner: (x) => any, testResource): any;

  async test(store: IStore, testResourceConfiguration?) {
    console.log(" When:", this.name);
    return await this.andWhen(store, this.actioner, testResourceConfiguration);
  }
}

export abstract class BaseThen<ISelection, IStore> {
  name: string;
  callback: (storeState: ISelection) => any;

  constructor(name: string, callback: (val: ISelection) => any) {
    this.name = name;
    this.callback = callback;
  }

  abstract butThen(store: any, testResourceConfiguration?): ISelection;

  async test(store: IStore, testResourceConfiguration) {
    console.log(" Then:", this.name);
    return this.callback(await this.butThen(store, testResourceConfiguration));
  }
}

export abstract class BaseCheck<ISubject, IStore, ISelection> {
  feature: string;
  callback: (whens, thens) => any;
  whens: any; //Record<string, BaseWhen<any>>;
  thens: any; //Record<string, BaseThen<any>>;

  constructor(feature: string, callback: (whens, thens) => any, whens, thens) {
    this.feature = feature;
    this.callback = callback;
    this.whens = whens;
    this.thens = thens;
  }

  abstract checkThat(subject: ISubject, testResourceConfiguration?): IStore;

  async teardown(subject: IStore, ndx: number) {
    return subject;
  }

  async check(subject: ISubject, ndx: number, testResourceConfiguration) {
    console.log(`\n - \nCheck: ${this.feature}`);
    const store = await this.checkThat(subject, testResourceConfiguration);
    await this.callback(
      mapValues(this.whens, (when) => {
        return async (payload) => {
          return await when(payload, testResourceConfiguration).test(
            store,
            testResourceConfiguration
          );
        };
      }),
      mapValues(this.thens, (then) => {
        return async (payload) => {
          return await then(payload, testResourceConfiguration).test(
            store,
            testResourceConfiguration
          );
        };
      })
    );

    await this.teardown(store, ndx);
    return;
  }
}
//////////////////////////////////////////////////////////////////////////////////
abstract class TesterantoBasic<
  IInput,
  ISubject,
  IStore,
  ISelection,
  SuiteExtensions,
  GivenExtensions,
  WhenExtensions,
  ThenExtensions,
  CheckExtensions
> {
  constructorator: IStore;

  suitesOverrides: Record<
    keyof SuiteExtensions,
    (
      name: string,
      givens: BaseGiven<ISubject, IStore, ISelection>[],
      checks: BaseCheck<ISubject, IStore, ISelection>[]
    ) => BaseSuite<IInput, ISubject, IStore, ISelection>
  >;

  givenOverides: Record<
    keyof GivenExtensions,
    (
      feature: string,
      whens: BaseWhen<IStore>[],
      thens: BaseThen<ISelection, IStore>[],
      ...xtraArgs
    ) => BaseGiven<ISubject, IStore, ISelection>
  >;

  whenOverides: Record<keyof WhenExtensions, (any) => BaseWhen<IStore>>;

  thenOverides: Record<
    keyof ThenExtensions,
    (selection: ISelection, expectation: any) => BaseThen<ISelection, IStore>
  >;

  checkOverides: Record<
    keyof CheckExtensions,
    (
      feature: string,
      callback: (whens, thens) => any,
      ...xtraArgs
    ) => BaseCheck<ISubject, IStore, ISelection>
  >;

  constructor(
    public readonly cc: IStore,
    suitesOverrides: Record<
      keyof SuiteExtensions,
      (
        name: string,
        givens: BaseGiven<ISubject, IStore, ISelection>[],
        checks: BaseCheck<ISubject, IStore, ISelection>[]
      ) => BaseSuite<IInput, ISubject, IStore, ISelection>
    >,

    givenOverides: Record<
      keyof GivenExtensions,
      (
        feature: string,
        whens: BaseWhen<IStore>[],
        thens: BaseThen<ISelection, IStore>[],
        ...xtraArgs
      ) => BaseGiven<ISubject, IStore, ISelection>
    >,

    whenOverides: Record<keyof WhenExtensions, (c: any) => BaseWhen<IStore>>,

    thenOverides: Record<
      keyof ThenExtensions,
      (selection: ISelection, expectation: any) => BaseThen<ISelection, IStore>
    >,

    checkOverides: Record<
      keyof CheckExtensions,
      (
        feature: string,
        callback: (whens, thens) => any,
        ...xtraArgs
      ) => BaseCheck<ISubject, IStore, ISelection>
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
      feature: string,
      whens: BaseWhen<IStore>[],
      thens: BaseThen<ISelection, IStore>[],
      ...xtraArgs
    ) => BaseGiven<ISubject, IStore, ISelection>
  > {
    return this.givenOverides;
  }

  When(): Record<
    keyof WhenExtensions,
    (arg0: IStore, ...arg1: any) => BaseWhen<IStore>
  > {
    return this.whenOverides;
  }

  Then(): Record<
    keyof ThenExtensions,
    (selection: ISelection, expectation: any) => BaseThen<ISelection, IStore>
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
    ) => BaseCheck<ISubject, IStore, ISelection>
  > {
    return this.checkOverides;
  }
}

export class ClassySuite<Klass> extends BaseSuite<Klass, Klass, Klass, Klass> {
  setup(s: Klass): Promise<Klass> {
    return new Promise((res, rej) => res(s));
  }
}

export class ClassyGiven<Klass> extends BaseGiven<Klass, Klass, Klass> {
  thing: Klass;

  constructor(
    name: string,
    whens: ClassyWhen<Klass>[],
    thens: ClassyThen<Klass>[],
    thing: Klass
    // features: BaseFeature[]
  ) {
    super(
      name,
      whens,
      thens
      // features
    );
    this.thing = thing;
  }

  givenThat() {
    return this.thing;
  }
}

export class ClassyWhen<Klass> extends BaseWhen<Klass> {
  andWhen(thing: Klass): Klass {
    return this.actioner(thing);
  }
}

export class ClassyThen<Klass> extends BaseThen<Klass, Klass> {
  butThen(thing: Klass): Klass {
    return thing;
  }
}

export class ClassyCheck<Klass> extends BaseCheck<Klass, Klass, Klass> {
  thing: Klass;

  constructor(
    feature: string,
    callback: (whens, thens) => any,
    whens,
    thens,
    thing: Klass
  ) {
    super(feature, callback, whens, thens);
    this.thing = thing;
  }

  checkThat() {
    return this.thing;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////
export abstract class TesterantoInterface<
  IInput,
  ISubject,
  IStore,
  ISelection
> {
  abstract suiteKlasser: (
    s,
    g,
    c
  ) => BaseSuite<IInput, ISubject, IStore, ISelection>;
  abstract givenKlasser: (
    f,
    w,
    t,
    z?
  ) => BaseGiven<ISubject, IStore, ISelection>;
  abstract whenKlasser: (a, b) => BaseWhen<IStore>;
  abstract thenKlasser: (a, b) => BaseThen<ISelection, IStore>;
  abstract checkKlasser: (
    f,
    w,
    t,
    z?
  ) => BaseCheck<ISubject, IStore, ISelection>;
  abstract whenshape: any;
}

export type ITestImplementation<IState, ISelection, IWhenShape> = {
  Suites: {
    /* @ts-ignore:next-line */
    [K in keyof ITestShape["suites"]]: string;
  };
  Givens: {
    /* @ts-ignore:next-line */
    [K in keyof ITestShape["givens"]]: (
      /* @ts-ignore:next-line */
      ...a: ITestShape["givens"][K]
    ) => IState;
  };
  Whens: {
    /* @ts-ignore:next-line */
    [K in keyof ITestShape["whens"]]: (
      /* @ts-ignore:next-line */
      ...a: ITestShape["whens"][K]
    ) => (zel: ISelection) => IWhenShape; //TesterantoInterface<any, any, any>["whenKlass"];
  };
  Thens: {
    /* @ts-ignore:next-line */
    [K in keyof ITestShape["thens"]]: (
      /* @ts-ignore:next-line */
      ...a: ITestShape["thens"][K]
    ) => (sel: ISelection) => any;
  };
  Checks: {
    /* @ts-ignore:next-line */
    [K in keyof ITestShape["checks"]]: (
      /* @ts-ignore:next-line */
      ...a: ITestShape["checks"][K]
    ) => IState;
  };
};

export abstract class Testeranto<
  ITestShape,
  IState,
  ISelection,
  IStore,
  ISubject,
  IWhenShape,
  ITestResource,
  IInput
> {
  constructor(
    testImplementation: ITestImplementation<IState, ISelection, IWhenShape>,

    testSpecification: (
      Suite: {
        /* @ts-ignore:next-line */
        [K in keyof ITestShape["suites"]]: (
          feature: string,
          givens: BaseGiven<any, any, any>[],
          checks: BaseCheck<any, any, any>[]
        ) => any;
      },
      Given: {
        /* @ts-ignore:next-line */
        [K in keyof ITestShape["givens"]]: (
          name: string,
          whens: BaseWhen<any>[],
          thens: BaseThen<ISelection, IStore>[],
          // features: BaseFeature[],

          /* @ts-ignore:next-line */
          ...a: ITestShape["givens"][K]
        ) => any;
      },
      When: {
        /* @ts-ignore:next-line */
        [K in keyof ITestShape["whens"]]: (
          /* @ts-ignore:next-line */
          ...a: ITestShape["whens"][K]
        ) => any;
      },
      Then: {
        /* @ts-ignore:next-line */
        [K in keyof ITestShape["thens"]]: (
          /* @ts-ignore:next-line */
          ...a: ITestShape["thens"][K]
        ) => any;
      },
      Check: {
        /* @ts-ignore:next-line */
        [K in keyof ITestShape["checks"]]: (
          feature: string,
          x: (
            { TheEmailIsSetTo }: { TheEmailIsSetTo: any },
            { TheEmailIs }: { TheEmailIs: any }
          ) => Promise<void>
        ) => any;
      }
    ) => BaseSuite<any, any, any, any>[],

    store,

    suiteKlasser,
    givenKlasser,
    whenKlasser,
    thenKlasser,
    checkKlasser,

    testResource?: ITestResource
  ) {
    const classySuites = mapValues(
      testImplementation.Suites as any,
      (suite) => {
        return (somestring, givens, checks) => {
          return suiteKlasser(somestring, givens, checks);
        };
      }
    );

    const classyGivens = mapValues(testImplementation.Givens as any, (z) => {
      return (feature, whens, thens, ...xtrasW) => {
        return givenKlasser(feature, whens, thens, z(...xtrasW));
      };
    });

    const classyWhens = mapValues(
      testImplementation.Whens as any,
      (whEn: (thing, payload?: any) => any) => {
        return (payload?: any) => {
          return whenKlasser(
            `${whEn.name}: ${payload && payload.toString()}`,
            whEn(payload)
          );
        };
      }
    );

    const classyThens = mapValues(
      testImplementation.Thens as any,
      (thEn: (klass, ...xtrasE) => void) => {
        return (expected: any, x) => {
          return thenKlasser(
            `${thEn.name}: ${expected && expected.toString()}`,
            thEn(expected)
          );
        };
      }
    );

    const classyChecks = mapValues(testImplementation.Checks as any, (z) => {
      return (somestring, callback) => {
        return checkKlasser(somestring, callback, classyWhens, classyThens);
      };
    });

    class MetaTesteranto<
      IInput,
      ISubject,
      IState,
      ISelection,
      SuiteExtensions,
      GivenExtensions,
      WhenExtensions,
      ThenExtensions,
      ICheckExtensions
    > extends TesterantoBasic<
      IInput,
      ISubject,
      IState,
      ISelection,
      SuiteExtensions,
      GivenExtensions,
      WhenExtensions,
      ThenExtensions,
      ICheckExtensions
    > {}

    const classyTesteranto = new MetaTesteranto<
      IInput,
      ISubject,
      IStore,
      IState,
      any,
      any,
      any,
      any,
      any
    >(
      store,
      classySuites,
      classyGivens,
      classyWhens,
      classyThens,
      classyChecks
    );

    const t = testSpecification(
      /* @ts-ignore:next-line */
      classyTesteranto.Suites(),
      classyTesteranto.Given(),
      classyTesteranto.When(),
      classyTesteranto.Then(),
      classyTesteranto.Check()
    );

    return t.map((tt) => {
      return {
        test: tt,
        testResource,
        runner: async (testResourceConfiguration?) => {
          await tt.run(store, testResourceConfiguration[testResource]);
        },
      };
    });
  }
}

type IT = {
  name: string;
  givens: BaseGiven<any, any, any>[];
  checks: BaseCheck<any, any, any>[];
};

type ITest = {
  test: IT;
  runner: (testResurce?) => any;
  testResource: any;
};

type ITestResults = Promise<{
  test: IT;
  status: any;
}>[];

// this function is awesome
const processTestsWithPorts = async (
  tests: ITest[],
  ports: number[]
): Promise<ITestResults> => {
  let testsStack = tests;
  return (
    await Promise.all(
      ports.map(async (port: number) => {
        return new Promise<ITestResults>((res, rej) => {
          const popper = async (payload) => {
            if (testsStack.length === 0) {
              res(payload);
            } else {
              const suite = testsStack.pop();
              try {
                suite?.runner({ port });
                popper([
                  ...payload,
                  {
                    test: suite?.test,
                    status: "pass",
                  },
                ]);
              } catch (e) {
                console.error(e);
                popper([
                  ...payload,
                  {
                    test: suite?.test,
                    status: e,
                  },
                ]);
              }
            }
          };
          popper([]);
        });
      })
    )
  ).flat();
};

export const reporter = async (
  tests: Promise<ITest>[],

  testResources: {
    ports: number[];
  }
) => {
  Promise.all(tests).then(async (x) => {
    const suites = x.flat();

    const testsWithoutResources: ITestResults = suites
      .filter((s) => !s.testResource)
      .map(async (suite) => {
        let status;
        try {
          await suite.runner({});
          status = "pass";
        } catch (e) {
          console.error(e);
          status = e;
        }

        return {
          test: suite.test,
          status,
        };
      });

    const portTestresults = await processTestsWithPorts(
      suites.filter((s) => s.testResource === "port"),
      testResources.ports
    );

    Promise.all([...testsWithoutResources, ...portTestresults]).then(
      (result) => {
        fs.writeFile(
          "./dist/testerantoResults.txt",
          JSON.stringify(result, null, 2),
          (err) => {
            if (err) {
              console.error(err);
            }

            const failures = result.filter((r) => r.status != "pass");

            if (failures.length) {
              console.warn(
                `❌ You have failing tests: ${JSON.stringify(
                  failures.map((f) => f.test.name)
                )}`
              );
              process.exit(-1);
            } else {
              console.log("✅ All tests passed ");
              process.exit(0);
            }
          }
        );
      }
    );
  });
};
