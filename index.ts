import { mapValues } from "lodash";
import { ITestImplementation, ITestSpecification, ITTestShape } from "./src/testShapes"

export class BaseFeature {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

export abstract class BaseSuite<
  IInput,
  ISubject,
  IStore,
  ISelection,
  IThenShape
> {
  name: string;
  givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[];
  checks: BaseCheck<ISubject, IStore, ISelection, IThenShape>[];

  constructor(
    name: string,
    givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[] = [],
    checks: BaseCheck<ISubject, IStore, ISelection, IThenShape>[] = []
  ) {
    this.name = name;
    this.givens = givens;
    this.checks = checks;
  }

  setup(s: IInput): Promise<ISubject> {
    return new Promise((res) => res(s as unknown as ISubject));
  }

  test(t: IThenShape): unknown {
    return t;
  }

  async run(input, testResourceConfiguration?) {
    const subject = await this.setup(input);

    console.log("\nSuite:", this.name, testResourceConfiguration);

    for (const [ndx, giver] of this.givens.entries()) {
      await giver.give(subject, ndx, testResourceConfiguration, this.test);
    }

    for (const [ndx, thater] of this.checks.entries()) {
      await thater.check(subject, ndx, testResourceConfiguration, this.test);
    }
  }
}

export abstract class BaseGiven<ISubject, IStore, ISelection, IThenShape> {
  name: string;
  features: BaseFeature[];
  whens: BaseWhen<IStore, ISelection, IThenShape>[];
  thens: BaseThen<ISelection, IStore, IThenShape>[];

  constructor(
    name: string,
    features: BaseFeature[],
    whens: BaseWhen<IStore, ISelection, IThenShape>[],
    thens: BaseThen<ISelection, IStore, IThenShape>[]
  ) {
    this.name = name;
    this.features = features;
    this.whens = whens;
    this.thens = thens;
  }

  abstract givenThat(
    subject: ISubject,
    testResourceConfiguration?
  ): Promise<IStore>;

  async teardown(subject: IStore, ndx: number): Promise<unknown> {
    return;
  }

  async give(
    subject: ISubject,
    index: number,
    testResourceConfiguration,
    tester
  ) {
    console.log(`\n Given: ${this.name}`);
    const store = await this.givenThat(subject, testResourceConfiguration);

    for (const whenStep of this.whens) {
      await whenStep.test(store, testResourceConfiguration);
    }

    for (const thenStep of this.thens) {
      const t = await thenStep.test(store, testResourceConfiguration);
      tester(t);
    }

    await this.teardown(store, index);
    return;
  }
}

export abstract class BaseWhen<IStore, ISelection, IThenShape> {
  name: string;
  actioner: (x: ISelection) => IThenShape;

  constructor(name: string, actioner: (xyz: ISelection) => IThenShape) {
    this.name = name;
    this.actioner = actioner;
  }

  abstract andWhen(
    store: IStore,
    actioner: (x: ISelection) => IThenShape,
    testResource
  );

  async test(store: IStore, testResourceConfiguration?) {
    console.log(" When:", this.name);
    return await this.andWhen(store, this.actioner, testResourceConfiguration);
  }
}

export abstract class BaseThen<ISelection, IStore, IThenShape> {
  name: string;
  thenCB: (storeState: ISelection) => IThenShape;

  constructor(name: string, thenCB: (val: ISelection) => IThenShape) {
    this.name = name;
    this.thenCB = thenCB;
  }

  abstract butThen(store: any, testResourceConfiguration?): Promise<ISelection>;

  async test(store: IStore, testResourceConfiguration): Promise<IThenShape> {
    console.log(" Then:", this.name);
    return this.thenCB(await this.butThen(store, testResourceConfiguration));
  }
}

export abstract class BaseCheck<ISubject, IStore, ISelection, IThenShape> {
  name: string;
  features: BaseFeature[];
  checkCB: (whens, thens) => any;
  whens: BaseWhen<IStore, ISelection, IThenShape>[];
  thens: BaseThen<ISelection, IStore, IThenShape>[];

  constructor(
    name: string,
    features: BaseFeature[],
    checkCB: (
      whens: BaseWhen<IStore, ISelection, IThenShape>[],
      thens: BaseThen<ISelection, IStore, IThenShape>[]
    ) => any,
    whens: BaseWhen<IStore, ISelection, IThenShape>[],
    thens: BaseThen<ISelection, IStore, IThenShape>[]
  ) {

    this.name = name;
    this.features = features;
    this.checkCB = checkCB;
    this.whens = whens;
    this.thens = thens;

  }

  abstract checkThat(
    subject: ISubject,
    testResourceConfiguration?
  ): Promise<IStore>;

  async teardown(subject: IStore, ndx: number): Promise<unknown> {
    return;
  }

  async check(
    subject: ISubject,
    ndx: number,
    testResourceConfiguration,
    tester
  ) {
    console.log(`\n Check: ${this.name}`);
    const store = await this.checkThat(subject, testResourceConfiguration);
    await this.checkCB(
      mapValues(this.whens, (when: (p, tc) => any) => {
        return async (payload) => {
          return await when(payload, testResourceConfiguration).test(
            store,
            testResourceConfiguration
          );
        };
      }),
      mapValues(this.thens, (then: (p, tc) => any) => {
        return async (payload) => {
          const t = await then(payload, testResourceConfiguration).test(
            store,
            testResourceConfiguration
          );
          tester(t);
        };
      })
    );

    await this.teardown(store, ndx);
    return;
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////
abstract class TesterantoBasic<
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
      givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[],
      checks: BaseCheck<ISubject, IStore, ISelection, IThenShape>[]
    ) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape>
  >;

  givenOverides: Record<
    keyof GivenExtensions,
    (
      name: string,
      features: BaseFeature[],
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
    ) => BaseCheck<ISubject, IStore, ISelection, IThenShape>
  >;

  constructor(
    public readonly cc: IStore,
    suitesOverrides: Record<
      keyof SuiteExtensions,
      (
        name: string,
        givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[],
        checks: BaseCheck<ISubject, IStore, ISelection, IThenShape>[]
      ) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape>
    >,

    givenOverides: Record<
      keyof GivenExtensions,
      (
        name: string,
        features: BaseFeature[],
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
      ) => BaseCheck<ISubject, IStore, ISelection, IThenShape>
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
      features: BaseFeature[],
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
    ) => BaseCheck<ISubject, IStore, ISelection, IThenShape>
  > {
    return this.checkOverides;
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////
export class ClassySuite<Klass> extends BaseSuite<
  Klass,
  Klass,
  Klass,
  Klass,
  any
> {
  setup(s: Klass): Promise<Klass> {
    return new Promise((res, rej) => res(s));
  }
}

export class ClassyGiven<Klass> extends BaseGiven<Klass, Klass, Klass, any> {
  thing: Klass;

  constructor(
    name: string,
    features: BaseFeature[],
    whens: ClassyWhen<Klass>[],
    thens: ClassyThen<Klass>[],
    thing: Klass
  ) {
    super(name, features, whens, thens);
    this.thing = thing;
  }

  givenThat(subject: Klass, testResourceConfiguration?: any): Promise<Klass> {
    return new Promise((res) => res(this.thing));
  }
}

export class ClassyWhen<Klass> extends BaseWhen<Klass, Klass, any> {
  andWhen(thing: Klass): Klass {
    return this.actioner(thing);
  }
}

export class ClassyThen<Klass> extends BaseThen<Klass, Klass, any> {
  butThen(thing: Klass): Promise<Klass> {
    return new Promise((res) => res(thing));
  }
}

export class ClassyCheck<Klass> extends BaseCheck<Klass, Klass, Klass, any> {
  thing: Klass;

  constructor(
    name: string,
    features: BaseFeature[],
    callback: (whens, thens) => any,
    whens,
    thens,
    thing: Klass
  ) {
    super(name, features, callback, whens, thens);
    this.thing = thing;
  }

  checkThat(subject: Klass, testResourceConfiguration?: any): Promise<Klass> {
    return new Promise((res) => res(this.thing));
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////
export abstract class Testeranto<
  ITestShape extends ITTestShape,
  IInitialState,
  ISelection,
  IStore,
  ISubject,
  IWhenShape,
  IThenShape,
  ITestResource,
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
          givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[],
          checks: BaseCheck<ISubject, IStore, ISelection, IThenShape>[]
        ) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape>;
      },
      Given: {
        [K in keyof ITestShape["givens"]]: (
          name: string,
          features: BaseFeature[],
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
      Check: {
        [K in keyof ITestShape["checks"]]: (
          name: string,
          features: BaseFeature[],
          cbz:
            (
              ...any
              // a: any,
              // b: any
              // { TheEmailIsSetTo }: { TheEmailIsSetTo: any },
              // { TheEmailIs }: { TheEmailIs: any }
            ) => Promise<void>
        ) => any;
      }
    ) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape>[],

    input: IInput,

    suiteKlasser: (
      name: string,
      givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[],
      checks: BaseCheck<ISubject, IStore, ISelection, IThenShape>[]
    ) =>
      BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape>,
    givenKlasser: (n, f, w, t, z?) =>
      BaseGiven<ISubject, IStore, ISelection, IThenShape>,
    whenKlasser: (s, o) =>
      BaseWhen<IStore, ISelection, IThenShape>,
    thenKlasser: (s, o) =>
      BaseThen<IStore, ISelection, IThenShape>,
    checkKlasser: (n, f, cb, w, t) =>
      BaseCheck<ISubject, IStore, ISelection, IThenShape>,

    testResource?: ITestResource
  ) {
    const classySuites = mapValues(
      testImplementation.Suites,
      () => (somestring, givens, checks) =>
        new suiteKlasser.prototype.constructor(somestring, givens, checks)

    );

    const classyGivens = mapValues(
      testImplementation.Givens,
      (z) =>
        (name, features, whens, thens, ...xtrasW) =>
          new givenKlasser.prototype.constructor(name, features, whens, thens, z(...xtrasW))
    );

    const classyWhens = mapValues(
      testImplementation.Whens,
      (whEn: (thing, payload?: any) => any) => (payload?: any) =>
        new whenKlasser.prototype.constructor(
          `${whEn.name}: ${payload && payload.toString()}`,
          whEn(payload)
        )
    );

    const classyThens = mapValues(
      testImplementation.Thens,
      (thEn: (klass, ...xtrasE) => void) => (expected: any, x) =>
        new thenKlasser.prototype.constructor(
          `${thEn.name}: ${expected && expected.toString()}`,
          thEn(expected)
        )
    );

    const classyChecks = mapValues(
      testImplementation.Checks,
      (z) => (somestring, features, callback) => {
        return new checkKlasser.prototype.constructor(somestring, features, callback, classyWhens, classyThens);
      }
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
    > extends TesterantoBasic<
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
      /* @ts-ignore:next-line */
      classySuites,
      classyGivens,
      /* @ts-ignore:next-line */
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
      classyTesteranto.Check()
    );

    return suites.map((suite) => {
      return {
        test: suite,
        testResource,
        runner: async (testResourceConfiguration?) => {
          await suite.run(input, testResourceConfiguration[testResource]);
        },
      };
    });
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const TesterantoFactory = <
  TestShape extends ITTestShape,
  Input,
  Subject,
  Store,
  Selection,
  ThenShape,
  WhenShape,
  TestResourceShape,
  InitialStateShape
>(
  input: Input,
  testSpecification: ITestSpecification<TestShape>,
  testImplementation: ITestImplementation<
    InitialStateShape,
    Selection,
    WhenShape,
    ThenShape,
    TestShape
  >,
  beforeAll: (input: Input) => Subject,
  beforeEach: (subject: Subject, initialValues, testResource: TestResourceShape) => Promise<Store>,
  andWhen: (store: Store, actioner, testResource: TestResourceShape) => Promise<Selection>,
  butThen: (store: Store, callback, testResource: TestResourceShape) => Promise<Selection>,
  assertioner: (t: ThenShape) => any,
  teardown: (store: Store) => unknown,
  actionHandler: (b: () => any) => any,
  testResource: "port"

) => {
  return class extends Testeranto<
    TestShape,
    InitialStateShape,
    Selection,
    Store,
    Subject,
    WhenShape,
    ThenShape,
    TestResourceShape,
    Input
  > {
    constructor() {
      super(
        testImplementation,
        /* @ts-ignore:next-line */
        testSpecification,
        input,

        (class extends BaseSuite<Input, Subject, Store, Selection, ThenShape> {
          async setup(s: Input): Promise<Subject> {
            return beforeAll(s);
          }

          test(t: ThenShape): unknown {
            return assertioner(t);
          }

        }),

        class Given extends BaseGiven<Subject, Store, Selection, ThenShape> {

          initialValues: any;

          constructor(
            name: string,
            features: BaseFeature[],
            whens: BaseWhen<Store, Selection, ThenShape>[],
            thens: BaseThen<Selection, Store, ThenShape>[],
            initialValues: any,
          ) {
            super(name, features, whens, thens);
            this.initialValues = initialValues;
          }
          async givenThat(subject, testResource) {
            return beforeEach(subject, this.initialValues, testResource);
          }

        },

        class When extends BaseWhen<Store, Selection, WhenShape> {
          payload?: any;

          constructor(name: string, actioner: (...any) => any, payload?: any) {
            super(name, (store) => {
              return actionHandler(actioner)
            });
            this.payload = payload;
          }

          andWhen(store, actioner, testResource) {
            return andWhen(store, actioner, testResource);
          }
        },

        class Then extends BaseThen<Selection, Store, ThenShape> {

          constructor(
            name: string,
            callback: (val: Selection) => ThenShape
          ) {
            super(name, callback);
          }

          butThen(store: any, testResourceConfiguration?): Promise<Selection>{
            return butThen(store, this.thenCB, testResourceConfiguration)
          }
          // butThen(store, testResource) {
          //   const b = butThen(store, this.thenCB, testResource);
          //   return b;
          // }
        },

        class Check extends BaseCheck<Subject, Store, Selection, ThenShape> {
          initialValues: any;

          constructor(
            name: string,
            features: BaseFeature[],
            checkCallback: (a, b) => any,
            whens,
            thens,
            initialValues: any,
          ) {
            super(name, features, checkCallback, whens, thens);
            this.initialValues = initialValues;
          }

          async checkThat(subject, testResource) {
            return beforeEach(subject, this.initialValues, testResource);
          }
        },
        testResource

      );
    }
  }

};
