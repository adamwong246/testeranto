import { mapValues } from "lodash";

export abstract class BaseSuite<ISubject, IStore, ISelection> {
  name: string;
  givens: BaseGiven<ISubject, IStore, ISelection>[];

  constructor(name: string, givens: BaseGiven<ISubject, IStore, ISelection>[]) {
    this.name = name;
    this.givens = givens;
  }

  test(subject) {
    console.log("\nSuite:", this.name);
    this.givens.forEach(
      (givenThat: BaseGiven<ISubject, IStore, ISelection>) => {
        givenThat.test(subject);
      }
    );
  }
}

export abstract class BaseGiven<ISubject, IStore, ISelection> {
  name: string;
  whens: BaseWhen<IStore>[];
  thens: BaseThen<ISelection>[];
  feature: string;

  constructor(
    name: string,
    whens: BaseWhen<IStore>[],
    thens: BaseThen<ISelection>[],
    feature: string
  ) {
    this.name = name;
    this.whens = whens;
    this.thens = thens;
    this.feature = feature;
  }

  abstract givenThat(subject: ISubject): IStore;

  test(subject: ISubject) {
    console.log(`\n - ${this.feature} - \n\nGiven: ${this.name}`);
    const store = this.givenThat(subject);

    this.whens.forEach((whenStep) => {
      whenStep.test(store);
    });

    this.thens.forEach((thenStep) => {
      thenStep.test(store);
    });
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

  test(store: IStore): IStore {
    console.log(" When:", this.name);
    return this.andWhen(store, this.actioner);
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

  test(store: any) {
    console.log(" Then:", this.name);
    return this.callback(this.butThen(store));
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export abstract class TesterantoBasic<
  ISubject,
  IStore,
  ISelection,
  SuiteExtensions,
  GivenExtensions,
  WhenExtensions,
  ThenExtensions
> {
  constructorator: IStore;

  suitesOverrides: Record<
    keyof SuiteExtensions,
    (
      name: string,
      givens: BaseGiven<ISubject, IStore, ISelection>[]
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

  constructor(
    public readonly cc: IStore,
    suitesOverrides: Record<
      keyof SuiteExtensions,
      (
        name: string,
        givens: BaseGiven<ISubject, IStore, ISelection>[]
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
    >
  ) {
    this.constructorator = cc;
    this.suitesOverrides = suitesOverrides;
    this.givenOverides = givenOverides;
    this.whenOverides = whenOverides;
    this.thenOverides = thenOverides;
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
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class ClassySuite<Klass> extends BaseSuite<Klass, Klass, Klass> {}

export class ClassyGiven<Klass> extends BaseGiven<Klass, Klass, Klass> {
  thing: Klass;

  constructor(
    name: string,
    whens: ClassyWhen<Klass>[],
    thens: ClassyThen<Klass>[],
    feature: string,
    thing: Klass
  ) {
    super(name, whens, thens, feature);
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

export class ClassyThen<Klass> extends BaseThen<Klass> {
  butThen(thing: Klass): Klass {
    return thing;
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class TesterantoClassic<
  Klass,
  SuiteExtensions,
  GivenExtensions,
  WhenExtensions,
  ThenExtensions
> {
  constructorator: new (...any) => Klass;

  givenOverides: Record<
    keyof GivenExtensions,
    (
      feature: string,
      whens: ClassyWhen<Klass>[],
      thens: ClassyThen<Klass>[],
      ...xtraArgs
    ) => ClassyGiven<Klass>
  >;
  whenOverides: Record<keyof WhenExtensions, (any) => ClassyWhen<Klass>>;
  thenOverides: Record<keyof ThenExtensions, (any) => ClassyThen<Klass>>;

  constructor(
    public readonly cc: new () => Klass,
    suites: any,
    givenOverides: Record<
      keyof GivenExtensions,
      (
        feature: string,
        whens: ClassyWhen<Klass>[],
        thens: ClassyThen<Klass>[],
        ...xtraArgs
      ) => ClassyGiven<Klass>
    >,
    whenOverides: Record<keyof WhenExtensions, (c2: any) => ClassyWhen<Klass>>,
    thenOverides: Record<keyof ThenExtensions, (d2: any) => ClassyThen<Klass>>
  ) {
    this.constructorator = cc;
    this.givenOverides = givenOverides;
    this.whenOverides = whenOverides;
    this.thenOverides = thenOverides;
  }

  Suites(): Record<
    keyof SuiteExtensions | "Default",
    (a: ClassyGiven<Klass>[]) => ClassySuite<Klass>
  > {
    /* @ts-ignore:next-line */
    return {
      Default: (givenz: ClassyGiven<Klass>[]) =>
        new ClassySuite<Klass>("Default constructor", givenz),
    };
  }

  Given(): Record<
    keyof GivenExtensions,
    (
      feature: string,
      whens: ClassyWhen<Klass>[],
      thens: ClassyThen<Klass>[],
      ...xtraArgs
    ) => ClassyGiven<Klass>
  > {
    return {
      ...this.givenOverides,
    };
  }

  When(): Record<
    keyof WhenExtensions | keyof Klass,
    (any) => ClassyWhen<Klass>
  > {
    const objectdescription = Object.getOwnPropertyDescriptors(
      this.constructorator.prototype
    );

    let autogeneratedWhens = {};
    // Object.keys(objectdescription).forEach((k, ndx) => {
    //   autogeneratedWhens[k] = (...xArgs) =>
    //     new ClassyWhen<Klass>(`!${k}`, (y) => {
    //       return y[k](...xArgs);
    //     });
    // });

    /* @ts-ignore:next-line */
    return {
      ...autogeneratedWhens,
      ...this.whenOverides,
    };
  }

  Then(): Record<
    keyof ThenExtensions | keyof Klass,
    (any) => ClassyThen<Klass>
  > {
    let autogeneratedWhens = {};
    // Object.keys(
    //   Object.getOwnPropertyDescriptors(this.constructorator.prototype)
    // ).forEach(
    //   (publicMethod, ndx) =>
    //     (autogeneratedWhens[publicMethod] = (expected) =>
    //       new ClassyThen<Klass>(`!${publicMethod}`, (thing) =>
    //         assert.equal(thing[publicMethod](expected), expected)
    //       ))
    // );

    /* @ts-ignore:next-line */
    return {
      ...autogeneratedWhens,
      ...this.thenOverides,
    };
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type ISimpleSuites<ISuites> = {
  [ISuite in keyof ISuites]: string;
};

type ISimpleGivens<IGivens, Klass> = {
  [IGiven in keyof IGivens]: (
    /* @ts-ignore:next-line */
    ...arg0: IGivens[IGiven]
  ) => Klass;
};

type ISimpleWhens<IThens, Klass> = {
  [IThen in keyof IThens]: (
    arg0: Klass,
    /* @ts-ignore:next-line */
    ...arg1: IThens[IThen]
  ) => any;
};

type ISimpleThens<T, Klass> = {
  [K in keyof T]: (k: Klass, ...any) => void;

  // [K in keyof T]: (k: Klass, ...any) => [
  //   (actual, expected, message?: string) => void,
  //   unknown,
  //   unknown
  // ]
};

type IZ<T, Klass> = {
  [K in keyof T]: (
    /* @ts-ignore:next-line */
    ...arg1: T[K]
  ) => ClassyThen<Klass>;
};

type IZW<T, Klass> = {
  [K in keyof T]: (
    /* @ts-ignore:next-line */
    ...arg1: T[K]
  ) => ClassyWhen<Klass>;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const TesterantoClassicFactory = <Klass, ISS, IGS, IWS, ITS>(
  thing,
  tests: (
    s: Record<
      keyof ISS | "Default",
      (ss: ClassyGiven<Klass>[]) => ClassySuite<Klass>
    >,
    g: Record<
      keyof IGS,
      (ww: ClassyWhen<Klass>[], tt: ClassyThen<Klass>[]) => ClassyGiven<Klass>
    >,
    w: IZW<IWS, Klass>,
    t: IZ<ITS, Klass>
  ) => ClassySuite<Klass>[]
) => {
  return {
    run: (
      suites: ISimpleSuites<ISS>,
      givens: ISimpleGivens<IGS, Klass>,
      whens: ISimpleWhens<IWS, Klass>,
      thens: ISimpleThens<ITS, Klass>
    ) => {
      const classyGivens = mapValues(givens as any, (z) => {
        return (whens, thens, ...xtras) => {
          return new ClassyGiven(
            `width of 1 and height of 1`,
            /* @ts-ignore:next-line */
            whens,
            thens,
            "idk feature",
            z(...xtras)
          );
        };
      }) as {
        [K in keyof IGS]: (
          name: string,
          whens: ClassyWhen<Klass>[],
          thens: ClassyThen<Klass>[]
        ) => ClassyGiven<Klass>;
      };

      const classyWhens = mapValues(
        whens as any,
        (testHookImplementation: (thing: Klass, expectation: any) => any) => {
          return (arg0: any) =>
            new ClassyWhen(
              `${testHookImplementation.name}: ${arg0.toString()}`,

              (x) => testHookImplementation(x, arg0)
            );
        }
      ) as {
        [K in keyof IWS]: (c: Klass) => ClassyWhen<Klass>;
      };

      const classThens = mapValues(
        thens as any,
        (thEn: (klass, ...xtras) => void) => {
          return (expected: any) => {
            return new ClassyThen(
              `${thEn.name}: ${expected.toString()}`,
              (rectangle) => thEn(rectangle, expected)
            );
          };
        }
      ) as {
        [K in keyof ITS]: (c: Klass) => ClassyThen<Klass>;
      };
      const testerano = new TesterantoClassic<
        Klass,
        {},
        {
          [K in keyof IGS]: (
            feature: string,
            whens: ClassyWhen<Klass>[],
            thens: ClassyThen<Klass>[]
          ) => ClassyGiven<Klass>;
        },
        {
          [K in keyof IWS]: (...any) => ClassyWhen<Klass>;
        },
        {
          [K in keyof ITS]: (...any) => ClassyThen<Klass>;
        }
      >(thing, {}, classyGivens, classyWhens, classThens);
      tests(
        /* @ts-ignore:next-line */
        testerano.Suites(),
        testerano.Given(),
        testerano.When(),
        testerano.Then()
      ).forEach((test) => {
        test.test(thing);
      });
    },
  };
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const TesterantoBasicFactory = <
  IState,
  IStore,
  ISelection,
  IBasicTesteranto extends TesterantoBasic<
    IStore,
    IState,
    any,
    any,
    any,
    any,
    any
  >,
  IGS,
  IWS,
  ITS
>(
  testerano: IBasicTesteranto,
  suites: any,
  givens: ISimpleGivens<IGS, IStore>[],
  whens: ISimpleWhens<IWS, IState>,
  thens: ISimpleThens<ITS, ISelection>
): IBasicTesteranto => {
  return testerano;
};

export const TesterantoMetaFactory = <
  IStore,
  ISubject,
  ISelection,
  IState,
  ISS,
  IGS,
  IWS,
  ITS,
  IThenShape
>(
  store: ISubject,
  tests: (
    s: Record<
      keyof ISS,
      (
        name: string,
        givens: BaseGiven<any, any, any>[]
      ) => BaseSuite<any, any, any>
    >,
    g: Record<
      keyof IGS,
      (
        feature: string,
        whensFromGiven: BaseWhen<any>[],
        thensFromGiven: BaseThen<any>[],
        ...xtraArgs: any[]
      ) => BaseGiven<any, any, any>
    >,
    w: ISimpleWhens<IWS, IStore>,
    t: IThenShape
  ) => BaseSuite<any, any, any>[],
  CSuite,
  CGiven,
  CWhen,
  CThen
) => {
  return {
    run: (
      suites: ISimpleSuites<ISS>,
      givens: ISimpleGivens<IGS, IState>,
      whens: ISimpleWhens<IWS, IStore>,
      thens: ISimpleThens<ITS, ISelection>
    ) => {
      const classySuites = mapValues(suites as any, (suite) => {
        return (somestring, givens) => {
          return new CSuite(somestring, givens);
        };
      }) as unknown as {
        [K in keyof ISS]: (
          name: string,
          somestring: string,
          givens: BaseGiven<any, any, any>[]
        ) => BaseSuite<any, any, any>;
      };

      const classyGivens = mapValues(givens as any, (z) => {
        return (somestring, whens, thens, ...xtrasW) => {
          return new CGiven(somestring, whens, thens, somestring, z(...xtrasW));
        };
      }) as unknown as {
        [K in keyof IGS]: (
          name: string,
          whens: BaseWhen<any>[],
          thens: BaseThen<ISelection>[],
          ...xtraArgs: any[]
        ) => BaseGiven<any, any, any>;
      };

      const classyWhens = mapValues(
        whens as any,
        (whEn: (thing, payload?: any) => any) => {
          return (payload?: any) => {
            return new CWhen(
              `${whEn.name}: ${payload && payload.toString()}`,
              whEn(payload)
            );
          };
        }
      ) as unknown as {
        [K in keyof IWS]: (c: IState) => BaseWhen<any>;
      };

      const classyThens = mapValues(
        thens as any,
        (thEn: (klass, ...xtrasE) => void) => {
          return (expected?: any) => {
            return new CThen(
              `${thEn.name}: ${expected && expected.toString()}`,
              thEn(expected)
            );
          };
        }
      ) as unknown as {
        [K in keyof ITS]: (
          selection: IState,
          expectation: any
        ) => BaseThen<ISelection>;
      };

      class MetaTesteranto<
        ISubject,
        IState,
        ISelection,
        SuiteExtensions,
        GivenExtensions,
        WhenExtensions,
        ThenExtensions
      > extends TesterantoBasic<
        ISubject,
        IState,
        ISelection,
        SuiteExtensions,
        GivenExtensions,
        WhenExtensions,
        ThenExtensions
      > {}
      const testerano = new MetaTesteranto<
        ISubject,
        IStore,
        IState,
        {
          [K in keyof ISS]: (...any) => BaseSuite<ISubject, IStore, IState>;
        },
        {
          [K in keyof IGS]: (
            feature: string,
            whens: BaseWhen<any>[],
            thens: BaseThen<ISubject>[]
          ) => BaseGiven<IStore, IState, ISelection>;
        },
        {
          [K in keyof IWS]: (...any) => BaseWhen<IStore>;
        },
        {
          [K in keyof ITS]: (...any) => BaseThen<ISubject>;
        }
        /* @ts-ignore:next-line */
      >(store, classySuites, classyGivens, classyWhens, classyThens);
      tests(
        testerano.Suites(),
        testerano.Given(),
        testerano.When(),
        /* @ts-ignore:next-line */
        testerano.Then()
      ).forEach((suite) => {
        suite.test(store);
      });
    },
  };
};

// type ISpread<ITuple> = {
//   [t in keyof ITuple]: (
//     arg0: Klass,
//     /* @ts-ignore:next-line */
//     ...arg1: IThens[IThen]
//   ) => any;
// };

// type First<T extends any[]> = T extends [any, ...infer R]
//   ? T extends [...infer F, ...R]
//     ? F
//     : never
//   : never;

// type ISimpleThens<IThens, Klass> = {
//   [IThen in keyof IThens]: (
//     // arg0: Klass,
//     /* @ts-ignore:next-line */
//     ...xtras: IThens[IThen]
//   ) => any;
// };

// type ISimplerThens<IThens, Klass> = {
//   [IThen in keyof IThens]: (
//     // arg0: Klass,
//     /* @ts-ignore:next-line */
//     ...xtrasQW: IThens[IThen]?
//   ) => any;
// };
