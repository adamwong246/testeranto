import { AnyKindOfDictionary, mapValues } from "lodash";

export abstract class BaseSuite<ISubject, IStore, ISelection> {
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

  async run(subject) {
    console.log("\nSuite:", this.name);

    for (const [ndx, givenThat] of this.givens.entries()) {
      await givenThat.give(subject, ndx);
    }

    for (const [ndx, checkThat] of this.checks.entries()) {
      await checkThat.check(subject, ndx);
    }
  }
}

export abstract class BaseGiven<ISubject, IStore, ISelection> {
  name: string;
  whens: BaseWhen<IStore>[];
  thens: BaseThen<ISelection>[];

  constructor(
    name: string,
    whens: BaseWhen<IStore>[],
    thens: BaseThen<ISelection>[]
  ) {
    this.name = name;
    this.whens = whens;
    this.thens = thens;
  }

  abstract givenThat(subject: ISubject): IStore;

  async teardown(subject: any, ndx: number) {
    return subject;
  }

  async give(subject: ISubject, index: number) {
    console.log(`\n Given: ${this.name}`);
    const store = await this.givenThat(subject);

    for (const whenStep of this.whens) {
      await whenStep.test(store);
    }

    for (const thenStep of this.thens) {
      await thenStep.test(store);
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

  abstract andWhen(store: IStore, actioner: (x) => any): any;

  async test(store: IStore) {
    console.log(" When:", this.name);
    return await this.andWhen(store, this.actioner);
  }
}

export abstract class BaseThen<ISelection> {
  name: string;
  callback: (storeState: ISelection) => any;

  constructor(name: string, callback: (val: ISelection) => any) {
    this.name = name;
    this.callback = callback;
  }

  abstract butThen(store: any): ISelection;

  async test(store: any) {
    console.log(" Then:", this.name);
    return this.callback(await this.butThen(store));
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

  abstract checkThat(subject: ISubject): IStore;

  async teardown(subject: any) {
    return subject;
  }

  async check(subject: ISubject, ndx: number) {
    console.log(`\n - \nCheck: ${this.feature}`);
    const store = await this.checkThat(subject);
    await this.callback(
      mapValues(this.whens, (when) => {
        return async (payload) => {
          return await when(payload).test(store);
        };
      }),
      mapValues(this.thens, (then) => {
        return async (payload) => {
          return await then(payload).test(store);
        };
      })
    );

    await this.teardown(store);
    return;
  }
}
//////////////////////////////////////////////////////////////////////////////////
abstract class TesterantoBasic<
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
    ) => BaseSuite<ISubject, IStore, ISelection>
  >;

  givenOverides: Record<
    keyof GivenExtensions,
    (
      feature: string,
      whens: BaseWhen<IStore>[],
      thens: BaseThen<ISelection>[],
      ...xtraArgs
    ) => BaseGiven<ISubject, IStore, ISelection>
  >;

  whenOverides: Record<keyof WhenExtensions, (any) => BaseWhen<IStore>>;

  thenOverides: Record<
    keyof ThenExtensions,
    (selection: ISelection, expectation: any) => BaseThen<ISelection>
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
      ) => BaseSuite<ISubject, IStore, ISelection>
    >,

    givenOverides: Record<
      keyof GivenExtensions,
      (
        feature: string,
        whens: BaseWhen<IStore>[],
        thens: BaseThen<ISelection>[],
        ...xtraArgs
      ) => BaseGiven<ISubject, IStore, ISelection>
    >,

    whenOverides: Record<keyof WhenExtensions, (c: any) => BaseWhen<IStore>>,

    thenOverides: Record<
      keyof ThenExtensions,
      (selection: ISelection, expectation: any) => BaseThen<ISelection>
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
      thens: BaseThen<ISelection>[],
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
    (selection: ISelection, expectation: any) => BaseThen<ISelection>
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

//////////////////////////////////////////////////////////////////////////////////////////////
export abstract class TesterantoInterface<ISubject, IStore, ISelection> {
  abstract suiteKlasser: (s, g, c) => BaseSuite<ISubject, IStore, ISelection>;
  abstract givenKlasser: (
    f,
    w,
    t,
    z?
  ) => BaseGiven<ISubject, IStore, ISelection>;
  abstract whenKlasser: (a, b) => BaseWhen<IStore>;
  abstract thenKlasser: (a, b) => BaseThen<ISelection>;
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
    ) => (sel: ISelection) => IWhenShape; //TesterantoInterface<any, any, any>["whenKlass"];
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

export abstract class TesterantoV2<
  ITestShape,
  IState,
  ISelection,
  IStore,
  ISubject,
  IWhenShape
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
          feature: string,
          whens: BaseWhen<any>[],
          thens: BaseThen<any>[],

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
    ) => BaseSuite<any, any, any>[],

    store,

    suiteKlasser,
    givenKlasser,
    whenKlasser,
    thenKlasser,
    checkKlasser
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
      ISubject,
      IState,
      ISelection,
      SuiteExtensions,
      GivenExtensions,
      WhenExtensions,
      ThenExtensions,
      ICheckExtensions
    > extends TesterantoBasic<
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
        runner: async () => {
          await tt.run(store);
        },
      };
    });
  }
}
