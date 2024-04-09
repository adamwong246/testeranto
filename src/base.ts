import {
  ITTestShape, ITTestResourceConfiguration, ITestArtifactory, ITLog
} from "./lib";

export type IGivens<
  ISubject,
  IStore,
  ISelection,
  IThenShape
> = Record<
  string,
  BaseGiven<
    ISubject,
    IStore,
    ISelection,
    IThenShape
  >
>;

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
  index: number;

  constructor(
    name: string,
    index: number,
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
    BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape>
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
      error: this.error ? [this.error, this.error.stack] : null,
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
        givenArtifactory
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