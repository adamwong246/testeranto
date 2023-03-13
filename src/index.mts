import fs from 'fs';
import path from 'path';

import { PassThrough } from 'stream';
import { BaseFeature } from './Features';

import { IBaseConfig } from "./IBaseConfig";
export type { IBaseConfig };

const defaultTestResource: ITTestResourceConfiguration = { "fs": ".", ports: [] };
const defaultTestResourceRequirement: ITTestResourceRequirement = { "fs": ".", ports: 0 };

type ITTestResourceConfiguration = {
  "fs": string,
  "ports": number[]
};
export type ITTestResourceRequirement = {
  "ports": number,
  "fs": string,
};

type IRunner = (x: ITTestResourceConfiguration, t: ITLog) => Promise<boolean>;

export type IT = {
  toObj(): object;
  name: string;
  givens: BaseGiven<unknown, unknown, unknown, unknown, Record<string, BaseFeature>>[];
  checks: BaseCheck<unknown, unknown, unknown, unknown, ITTestShape, unknown>[];
  testResourceConfiguration: ITTestResourceConfiguration
};

export type ITestJob = {
  toObj(): object;
  test: IT;
  runner: IRunner;
  testResourceRequirement: ITTestResourceRequirement;
  receiveTestResourceConfig: (testResource?) => boolean;
};

export type ITestResults = Promise<{ test: IT; }>[];

export type ITTestShape = {
  suites;
  givens;
  whens;
  thens;
  checks;
};

export type ITestSpecification<ITestShape extends ITTestShape, IFeatureShape> = (
  Suite: {
    [K in keyof ITestShape["suites"]]: (
      name: string,
      givens: BaseGiven<unknown, unknown, unknown, unknown, Record<string, BaseFeature>>[],
      checks: BaseCheck<unknown, unknown, unknown, unknown, ITestShape, IFeatureShape>[]
    ) => BaseSuite<unknown, unknown, unknown, unknown, unknown, ITestShape, IFeatureShape>;
  },
  Given: {
    [K in keyof ITestShape["givens"]]: (
      features: (keyof IFeatureShape)[],
      whens: BaseWhen<unknown, unknown, unknown>[],
      thens: BaseThen<unknown, unknown, unknown>[],
      ...xtras: ITestShape["givens"][K]
    ) => BaseGiven<unknown, unknown, unknown, unknown, unknown>;
  },
  When: {
    [K in keyof ITestShape["whens"]]: (
      ...xtras: ITestShape["whens"][K]
    ) => BaseWhen<unknown, unknown, unknown>;
  },
  Then: {
    [K in keyof ITestShape["thens"]]: (
      ...xtras: ITestShape["thens"][K]
    ) => BaseThen<unknown, unknown, unknown>;
  },
  Check: {
    [K in keyof ITestShape["checks"]]: (

      name: string,
      features: (keyof IFeatureShape)[],
      callbackA: (
        whens: {
          [K in keyof ITestShape["whens"]]: (...unknown) => BaseWhen<unknown, unknown, unknown>
        },
        thens: {
          [K in keyof ITestShape["thens"]]: (...unknown) => BaseThen<unknown, unknown, unknown>
        },

      ) => unknown,
      ...xtras: ITestShape["checks"][K]
    ) => BaseCheck<unknown, unknown, unknown, unknown, ITestShape, IFeatureShape>;
  }
) => any[];

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

///////////////////////////////////////////////////////////////////////////////////////////////////////////

type ITestArtifactory = (key: string, value: string) => unknown;
type ITLog = (...string) => void;

const testArtiFactoryfileWriter = (tLog: ITLog) => (fp) => (g) => (key, value: string | Buffer | PassThrough) => {
  tLog("testArtiFactory =>", key);

  const fPath = `${fp}/${g}/${key}`;
  const cleanPath = path.resolve(fPath);
  const targetDir = cleanPath.split('/').slice(0, -1).join('/');

  fs.mkdir(targetDir, { recursive: true }, async (error) => {
    if (error) { console.error(`❗️testArtiFactory failed`, targetDir, error); }

    if (Buffer.isBuffer(value)) {
      fs.writeFileSync(fPath, value, "binary");
    } else if (`string` === (typeof value)) {
      fs.writeFileSync(fPath, value.toString(), {
        encoding: 'utf-8'
      });
    } else {
      /* @ts-ignore:next-line */
      const pipeStream: PassThrough = value;
      var myFile = fs.createWriteStream(fPath);
      pipeStream.pipe(myFile);
      pipeStream.on("close", () => {
        myFile.close()
      })
    }
  });
};

export abstract class BaseSuite<
  IInput,
  ISubject,
  IStore,
  ISelection,
  IThenShape,
  ITestShape extends ITTestShape,
  IFeatureShape,
> {
  name: string;
  givens: BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>[];
  checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape>[];
  store: IStore;
  fails: BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>[];
  testResourceConfiguration: ITTestResourceConfiguration;

  constructor(
    name: string,
    givens: BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>[] = [],
    checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape>[] = []
  ) {
    this.name = name;
    this.givens = givens;
    this.checks = checks;
    this.fails = [];
  }

  public toObj() {
    return {
      name: this.name,
      givens: this.givens.map((g) => g.toObj()),
      fails: this.fails
    }
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
    tLog: (...string) => void,
  ): Promise<BaseSuite<IInput,
    ISubject,
    IStore,
    ISelection,
    IThenShape,
    ITestShape,
    IFeatureShape
  >> {

    this.testResourceConfiguration = testResourceConfiguration;

    const subject = await this.setup(input, artifactory("-1"));

    tLog("\nSuite:", this.name, testResourceConfiguration);

    for (const [ndx, giver] of this.givens.entries()) {
      try {
        this.store = await giver.give(
          subject,
          ndx,
          testResourceConfiguration,
          this.test,
          artifactory(ndx.toString()),
          tLog
        );
      } catch (e) {
        console.error(e);
        this.fails.push(giver)
        return this;
      }
    }
    for (const [ndx, thater] of this.checks.entries()) {
      await thater.check(subject, ndx, testResourceConfiguration, this.test, artifactory, tLog);
    }

    // @TODO fix me
    for (const [ndx, giver] of this.givens.entries()) {
      giver.afterAll(this.store, artifactory);
    }
    ////////////////

    return this;
  }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

export abstract class BaseGiven<
  ISubject,
  IStore,
  ISelection,
  IThenShape,
  IFeatureShape
> {
  name: string;
  features: (keyof IFeatureShape)[];
  whens: BaseWhen<IStore, ISelection, IThenShape>[];
  thens: BaseThen<ISelection, IStore, IThenShape>[];
  error: Error;
  store: IStore;
  recommendedFsPath: string;

  constructor(
    name: string,
    features: (keyof IFeatureShape)[],
    whens: BaseWhen<IStore, ISelection, IThenShape>[],
    thens: BaseThen<ISelection, IStore, IThenShape>[],
  ) {
    this.name = name;
    this.features = features;
    this.whens = whens;
    this.thens = thens;
  }

  afterAll(store: IStore, artifactory: ITestArtifactory) {
    return;
  };

  toObj() {
    return {
      name: this.name,
      whens: this.whens.map((w) => w.toObj()),
      thens: this.thens.map((t) => t.toObj()),
      errors: this.error,
      features: this.features,
    }
  }

  abstract givenThat(
    subject: ISubject,
    testResourceConfiguration,
    artifactory: ITestArtifactory,
  ): Promise<IStore>;

  async afterEach(store: IStore, ndx: number, artifactory: ITestArtifactory): Promise<unknown> {
    return;
  }

  async give(
    subject: ISubject,
    index: number,
    testResourceConfiguration,
    tester,
    artifactory: ITestArtifactory,
    tLog: ITLog
  ) {
    tLog(`\n Given: ${this.name}`);

    try {
      this.store = await this.givenThat(subject, testResourceConfiguration, artifactory);
      for (const whenStep of this.whens) {
        await whenStep.test(this.store, testResourceConfiguration, tLog);
      }
      for (const thenStep of this.thens) {
        const t = await thenStep.test(this.store, testResourceConfiguration, tLog);
        tester(t);
      }
    } catch (e) {
      this.error = e;
      tLog('\u0007');// bell
      // throw e;
    } finally {

      try {
        await this.afterEach(this.store, index, artifactory);
      } catch {
        console.error("afterEach failed! no error will be recorded!")
      }

    }
    return this.store;
  }
}

export abstract class BaseWhen<IStore, ISelection, IThenShape> {
  public name: string;
  actioner: (x: ISelection) => IThenShape;
  error: boolean;

  constructor(name: string, actioner: (xyz: ISelection) => IThenShape) {
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
    }
  }

  async test(store: IStore, testResourceConfiguration, tLog: ITLog) {
    tLog(" When:", this.name);
    try {
      return await this.andWhen(store, this.actioner, testResourceConfiguration);
    } catch (e) {
      this.error = true;
      throw e
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
    }
  }

  abstract butThen(store: any, testResourceConfiguration?): Promise<ISelection>;

  async test(store: IStore, testResourceConfiguration, tLog: ITLog): Promise<IThenShape | undefined> {
    tLog(" Then:", this.name);
    try {
      return this.thenCB(await this.butThen(store, testResourceConfiguration))
    } catch (e) {
      console.log("wtf")
      this.error = true;
      throw e
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
  ITestShape extends ITTestShape,
  IFeatureShape
> {
  name: string;
  features: (keyof IFeatureShape)[];
  checkCB: (whens, thens) => any;
  whens: {
    [K in keyof ITestShape["whens"]]: (p, tc) =>
      BaseWhen<IStore, ISelection, IThenShape>
  }
  thens: {
    [K in keyof ITestShape["thens"]]: (p, tc) =>
      BaseThen<ISelection, IStore, IThenShape>
  }

  constructor(
    name: string,
    features: (keyof IFeatureShape)[],
    checkCB: (
      whens,
      thens
    ) => any,
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
    artifactory: ITestArtifactory,
  ): Promise<IStore>;

  async afterEach(store: IStore, ndx: number, cb?): Promise<unknown> {
    return;
  }

  async check(
    subject: ISubject,
    ndx: number,
    testResourceConfiguration,
    tester,
    artifactory: ITestArtifactory,
    tLog: ITLog
  ) {
    tLog(`\n Check: ${this.name}`);
    const store = await this.checkThat(subject, testResourceConfiguration, artifactory);
    await this.checkCB(

      (
        Object.entries(this.whens)
          .reduce((a, [key, when]) => {
            a[key] = async (payload) => {
              return await when(payload, testResourceConfiguration).test(
                store,
                testResourceConfiguration,
                tLog,
              );
            };
            return a;
          }, {}
          )
      ),

      (
        Object.entries(this.thens)
          .reduce((a, [key, then]) => {
            a[key] = async (payload) => {
              const t = await then(payload, testResourceConfiguration).test(
                store,
                testResourceConfiguration,
                tLog
              );
              tester(t);
            };
            return a;
          }, {}
          )
      )
    );

    await this.afterEach(store, ndx);
    return;
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

export abstract class TesterantoLevelZero<
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
  IFeatureShape,

> {
  constructorator: IStore;

  suitesOverrides: Record<
    keyof SuiteExtensions,
    (
      name: string,
      givens: BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>[],
      checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape, IFeatureShape>[]
    ) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITTestShape, IFeatureShape>
  >;

  givenOverides: Record<
    keyof GivenExtensions,
    (
      name: string,
      features: (keyof IFeatureShape)[],
      whens: BaseWhen<IStore, ISelection, IThenShape>[],
      thens: BaseThen<ISelection, IStore, IThenShape>[],
      ...xtraArgs
    ) => BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>
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
    ) => BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape, IFeatureShape>
  >;

  constructor(
    public readonly cc: IStore,
    suitesOverrides: Record<
      keyof SuiteExtensions,
      (
        name: string,
        givens: BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>[],
        checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape, IFeatureShape>[]
      ) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITTestShape, IFeatureShape>
    >,

    givenOverides: Record<
      keyof GivenExtensions,
      (
        name: string,
        features: (keyof IFeatureShape)[],
        whens: BaseWhen<IStore, ISelection, IThenShape>[],
        thens: BaseThen<ISelection, IStore, IThenShape>[],
        ...xtraArgs
      ) => BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>
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
      ) => BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape, IFeatureShape>
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
      features: (keyof IFeatureShape)[],
      whens: BaseWhen<IStore, ISelection, IThenShape>[],
      thens: BaseThen<ISelection, IStore, IThenShape>[],
      ...xtraArgs
    ) => BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>
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
    ) => BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape, IFeatureShape>
  > {
    return this.checkOverides;
  }
}

export abstract class TesterantoLevelOne<
  ITestShape extends ITTestShape,
  IInitialState,
  ISelection,
  IStore,
  ISubject,
  IWhenShape,
  IThenShape,
  IInput,
  IFeatureShape extends Record<string, BaseFeature>
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
          givens: BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>[],
          checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape>[]
        ) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape>;
      },
      Given: {
        [K in keyof ITestShape["givens"]]: (
          name: string,
          features: (keyof IFeatureShape)[],
          whens: BaseWhen<IStore, ISelection, IThenShape>[],
          thens: BaseThen<ISelection, IStore, IThenShape>[],
          ...a: ITestShape["givens"][K]
        ) => BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>;
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
          features: (keyof IFeatureShape)[],
          cbz: (...any) => Promise<void>
        ) => any;
      }
    ) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape>[],

    input: IInput,

    suiteKlasser: (
      name: string,
      givens: BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>[],
      checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape>[]
    ) =>
      BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape>,
    givenKlasser: (n, f, w, t, z?) =>
      BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>,
    whenKlasser: (s, o) =>
      BaseWhen<IStore, ISelection, IThenShape>,
    thenKlasser: (s, o) =>
      BaseThen<IStore, ISelection, IThenShape>,
    checkKlasser: (n, f, cb, w, t) =>
      BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape>,

    testResourceRequirement,
    nameKey: string

  ) {
    const classySuites = Object.entries(testImplementation.Suites)
      .reduce((a, [key]) => {
        a[key] = (somestring, givens, checks) => {
          return new suiteKlasser.prototype.constructor(somestring, givens, checks);
        };
        return a;
      }, {}
      );

    const classyGivens = Object.entries(testImplementation.Givens)
      .reduce((a, [key, z]) => {
        a[key] = (features, whens, thens, ...xtrasW) => {
          return new givenKlasser.prototype.constructor(z.name, features, whens, thens, z(...xtrasW))
        };
        return a;
      }, {}
      );

    const classyWhens = Object.entries(testImplementation.Whens)
      .reduce((a, [key, whEn]) => {
        a[key] = (payload?: any) => {
          return new whenKlasser.prototype.constructor(
            `${whEn.name}: ${payload && payload.toString()}`,
            whEn(payload)
          )
        };
        return a;
      }, {}
      );

    const classyThens = Object.entries(testImplementation.Thens)
      .reduce((a, [key, thEn]) => {
        a[key] = (expected: any, x) => {
          return new thenKlasser.prototype.constructor(
            `${thEn.name}: ${expected && expected.toString()}`,
            thEn(expected)
          );
        };
        return a;
      }, {}
      );

    const classyChecks = Object.entries(testImplementation.Checks)
      .reduce((a, [key, z]) => {
        a[key] = (somestring, features, callback) => {
          return new checkKlasser.prototype.constructor(somestring, features, callback, classyWhens, classyThens);
        };
        return a;
      }, {}
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
      IThenShape,
      IFeatureShape,
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
      IThenShape,
      IFeatureShape
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
      classyTesteranto.Check()
    );


    const suiteRunner = (suite) => (
      testResourceConfiguration: ITTestResourceConfiguration,
      tLog: ITLog,
    ): BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape> => {
      return suite.run(
        input,
        testResourceConfiguration,
        testArtiFactoryfileWriter(tLog)(testResourceConfiguration.fs + "/"),
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
          return suite.toObj()
        },

        runner,

        receiveTestResourceConfig: async function (testResourceConfiguration = defaultTestResource) {
          console.log(`testResourceConfiguration ${JSON.stringify(testResourceConfiguration, null, 2)}`);

          await fs.mkdirSync(testResourceConfiguration.fs, { recursive: true });
          const logFilePath = path.resolve(`${testResourceConfiguration.fs}/log.txt`);
          var access = fs.createWriteStream(logFilePath);
          const tLog = (...l: string[]) => {
            console.log(...l);
            access.write(`${l.toString()}\n`);
          }
          const suiteDone: BaseSuite<
            IInput, ISubject, IStore, ISelection, IThenShape, ITestShape, IFeatureShape
          > = await runner(testResourceConfiguration, tLog);
          const resultsFilePath = path.resolve(`${testResourceConfiguration.fs}/results.json`)

          fs.writeFileSync(resultsFilePath, JSON.stringify(suiteDone.toObj(), null, 2));
          access.close();

          const numberOfFailures = suiteDone.givens.filter((g) => g.error).length;
          console.log(`exiting gracefully with ${numberOfFailures} failures.`)
          process.exitCode = numberOfFailures;

        }
      }
    });

    return toReturn;
  }

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type ITestArtificer = (key: string, data: any) => void;

export default async <
  TestShape extends ITTestShape,
  Input,
  Subject,
  Store,
  Selection,
  WhenShape,
  ThenShape,
  InitialStateShape,
  IFeatureShape extends Record<string, BaseFeature>,
>(
  input: Input,
  testSpecification: ITestSpecification<
    TestShape,
    IFeatureShape
  >,
  testImplementation,
  testInterface: {
    actionHandler?: (b: (...any) => any) => any,
    andWhen: (store: Store, actioner, testResource: ITTestResourceConfiguration) => Promise<Selection>,
    butThen?: (store: Store, callback, testResource: ITTestResourceConfiguration) => Promise<Selection>,
    assertioner?: (t: ThenShape) => any,

    afterAll?: (
      store: Store,
      artificer: ITestArtificer
    ) => any;
    afterEach?: (
      store: Store,
      ndx: number,
      artificer: ITestArtificer
    ) => Promise<unknown>,
    beforeAll?: (
      input: Input,
      artificer: ITestArtificer
    ) => Promise<Subject>,
    beforeEach?: (
      subject: Subject,
      initialValues,
      testResource: ITTestResourceConfiguration,
      artificer: ITestArtificer
    ) => Promise<Store>,
  },
  nameKey: string,
  testResourceRequirement: ITTestResourceRequirement = defaultTestResourceRequirement

) => {


  const butThen = testInterface.butThen || (async (a) => a as any);
  const { andWhen } = testInterface;
  const actionHandler = testInterface.actionHandler || function (b: (...any: any[]) => any) {
    return b;
  };
  const assertioner = testInterface.assertioner || (async (t) => t as any);
  const beforeAll = testInterface.beforeAll || (async (input) => input as any);
  const beforeEach = testInterface.beforeEach || async function (subject: Input, initialValues: any, testResource: any) {
    return subject as any;
  }
  const afterEach = testInterface.afterEach || (async (s) => s);
  const afterAll = testInterface.afterAll || ((store: Store) => undefined);

  class MrT extends TesterantoLevelOne<
    TestShape,
    InitialStateShape,
    Selection,
    Store,
    Subject,
    WhenShape,
    ThenShape,
    Input,
    IFeatureShape
  > {
    constructor() {
      super(
        testImplementation,
        /* @ts-ignore:next-line */
        testSpecification,
        input,
        (class extends BaseSuite<Input, Subject, Store, Selection, ThenShape, TestShape, IFeatureShape> {
          async setup(s: Input, artifactory): Promise<Subject> {
            return beforeAll(s, artifactory);
          }
          test(t: ThenShape): unknown {
            return assertioner(t);
          }
        }),

        class Given extends BaseGiven<
          Subject,
          Store,
          Selection,
          ThenShape,
          IFeatureShape
        > {
          initialValues: any;
          constructor(
            name: string,
            features: (keyof IFeatureShape)[],
            whens: BaseWhen<Store, Selection, ThenShape>[],
            thens: BaseThen<Selection, Store, ThenShape>[],
            initialValues: any
          ) {
            super(name, features, whens, thens);
            this.initialValues = initialValues;
          }
          async givenThat(subject, testResource, artifactory) {
            return beforeEach(subject, this.initialValues, testResource, artifactory);
          }

          afterEach(store: Store, ndx: number, artifactory): Promise<unknown> {
            return new Promise((res) => res(afterEach(store, ndx, artifactory)))
          }
          afterAll(store, artifactory) {
            return afterAll(store, artifactory);
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

          async andWhen(store, actioner, testResource) {
            return await andWhen(store, actioner, testResource);
          }
        },

        class Then extends BaseThen<Selection, Store, ThenShape> {
          constructor(
            name: string,
            callback: (val: Selection) => ThenShape
          ) {
            super(name, callback);
          }

          async butThen(store: any, testResourceConfiguration?: any): Promise<Selection> {
            return await butThen(store, this.thenCB, testResourceConfiguration)
          }
        },

        class Check extends BaseCheck<Subject, Store, Selection, ThenShape, TestShape, IFeatureShape> {
          initialValues: any;

          constructor(
            name: string,
            features: (keyof IFeatureShape)[],
            checkCallback: (a, b) => any,
            whens,
            thens,
            initialValues: any,
          ) {
            super(name, features, checkCallback, whens, thens);
            this.initialValues = initialValues;
          }

          async checkThat(subject, testResourceConfiguration, artifactory) {
            return beforeEach(subject, this.initialValues, testResourceConfiguration, artifactory);
          }

          afterEach(store: Store, ndx: number, artifactory): Promise<unknown> {
            return new Promise((res) => res(afterEach(store, ndx, artifactory)))
          }
        },
        testResourceRequirement,
        nameKey
      );
    }
  }

  const mrt = new MrT();
  const t: ITestJob = mrt[0];
  const testResourceArg = process.argv[2] || `{}`;
  try {
    const partialTestResource = JSON.parse(testResourceArg) as ITTestResourceConfiguration;

    if (partialTestResource.fs && partialTestResource.ports) {
      await t.receiveTestResourceConfig(partialTestResource);
      // process.exit(0); // :-)
    } else {
      console.log("test configuration is incomplete");

      if (process.send) {
        console.log("requesting test resources from pm2 ...", testResourceRequirement);
        /* @ts-ignore:next-line */
        process.send({
          type: 'testeranto:hola',
          data: {
            testResourceRequirement
          }
        });

        console.log("awaiting test resources from pm2...");
        process.on('message', async function (packet: {
          data: { testResourceConfiguration }
        }) {
          const resourcesFromPm2 = packet.data.testResourceConfiguration;
          const secondTestResource = ({
            ...JSON.parse(JSON.stringify(resourcesFromPm2)),
            ...JSON.parse(JSON.stringify(partialTestResource)),

          }) as ITTestResourceConfiguration;

          if (await t.receiveTestResourceConfig(secondTestResource)) {
            /* @ts-ignore:next-line */
            process.send({
              type: 'testeranto:adios',
              data: {
                testResourceConfiguration: mrt[0].test.testResourceConfiguration,
                results: mrt[0].toObj()
              }
            }, (err) => {
              if (!err) { console.log(`✅`) }
              else { console.error(`❗️`, err) }
              // process.exit(0); // :-)
            });
          }
        });
      } else {
        console.log("Pass run-time test resources by STDIN");
        process.stdin.on('data', async data => {

          const resourcesFromStdin = JSON.parse(data.toString());
          const secondTestResource = ({
            ...JSON.parse(JSON.stringify(resourcesFromStdin)),
            ...JSON.parse(JSON.stringify(partialTestResource)),

          }) as ITTestResourceConfiguration;
          await t.receiveTestResourceConfig(secondTestResource);
          // process.exit(0); // :-)

        });
      }

    }


  } catch (e) {
    console.error(`the test resource passed by command-line arugument "${process.argv[2]}" was malformed.`);
    process.exit(-1);
  }

};
