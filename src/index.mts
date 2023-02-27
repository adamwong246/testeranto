import pkg from 'graphology';
/* @ts-ignore:next-line */
const { DirectedGraph, UndirectedGraph } = pkg;

export class BaseFeature {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

abstract class TesterantoGraph {
  name: string;
  abstract graph;

  constructor(name: string) {
    this.name = name;
  }
}

export class TesterantoGraphUndirected implements TesterantoGraph {
  name: string;
  graph: typeof UndirectedGraph
  constructor(name: string) {
    this.name = name;
    this.graph = new UndirectedGraph();
  }
  connect(a, b, relation?: string) {
    this.graph.mergeEdge(a, b, { type: relation });
  }
}

export class TesterantoGraphDirected implements TesterantoGraph {
  name: string;
  graph: typeof DirectedGraph;
  constructor(name: string) {
    this.name = name;
    this.graph = new DirectedGraph();
  }
  connect(to, from, relation?: string) {
    this.graph.mergeEdge(to, from, { type: relation });
  }
}

export class TesterantoGraphDirectedAcyclic implements TesterantoGraph {
  name: string;
  graph: typeof DirectedGraph;
  constructor(name: string) {
    this.name = name;
    this.graph = new DirectedGraph();
  }
  connect(to, from, relation?: string) {
    this.graph.mergeEdge(to, from, { type: relation });
  }
}

export class TesterantoFeatures {
  features: Record<string, BaseFeature>;
  graphs: {
    undirected: TesterantoGraphUndirected[],
    directed: TesterantoGraphDirected[],
    dags: TesterantoGraphDirectedAcyclic[]
  }

  constructor(
    features: Record<string, BaseFeature>,
    graphs: {
      undirected: TesterantoGraphUndirected[],
      directed: TesterantoGraphDirected[],
      dags: TesterantoGraphDirectedAcyclic[]
    }
  ) {
    this.features = features;
    this.graphs = graphs;
  }

  networks() {
    return [
      ...this.graphs.undirected.values(),
      ...this.graphs.directed.values(),
      ...this.graphs.dags.values()
    ]
  }

  toObj() {
    return {
      features: Object.entries(this.features).map(([name, feature]) => {
        return {
          ...feature,
          inNetworks: this.networks().filter((network) => {
            return network.graph.hasNode(feature.name);
          }).map((network) => {
            return {

              network: network.name,
              neighbors: network.graph.neighbors(feature.name)
            }
          })
        }
      }),
      networks: this.networks().map((network) => {
        return {
          ...network
        }
      })
    };
  }
}

const testOutPath = "./dist/results/";

export type ITTestResourceRequirement = {
  "ports": number
};

type ITTestResource = {
  "ports": number[]
};

export type IT_FeatureNetwork = {
  name: string,
  // graph: DirectedGraph
};

export type IT = {
  toObj(): object;
  aborter: () => any;
  name: string;
  givens: BaseGiven<unknown, unknown, unknown, unknown, unknown>[];
  checks: BaseCheck<unknown, unknown, unknown, unknown, ITTestShape, unknown>[];
};

export type ITestJob = {
  toObj(): object;
  test: IT;
  runner: (testResource) => Promise<boolean>;
  testResource: ITTestResourceRequirement;
};

export type ITestResults = Promise<{
  test: IT;
}>[];

export type Modify<T, R> = Omit<T, keyof R> & R;

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
      givens: BaseGiven<unknown, unknown, unknown, unknown, unknown>[],
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
      // whens: BaseWhen<unknown, unknown, unknown>[],
      // thens: BaseThen<unknown, unknown, unknown>[],

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

class TestArtifact {
  binary: Buffer | string;

  constructor(binary) {
    this.binary = binary
  }
}

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
  aborted: boolean;
  fails: BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape>[];
  testResourceConfiguration: ITTestResource;

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

  async aborter() {
    this.aborted = true;
    await Promise.all((this.givens || []).map((g, ndx) => g.aborter(ndx)))
  }

  public toObj() {
    return {
      name: this.name,
      givens: this.givens.map((g) => g.toObj()),
      fails: this.fails
    }
  }

  setup(s: IInput): Promise<ISubject> {
    return new Promise((res) => res(s as unknown as ISubject));
  }

  test(t: IThenShape): unknown {
    return t;
  }

  async run(input, testResourceConfiguration: ITTestResource): Promise<boolean> {
    this.testResourceConfiguration = Object.keys(testResourceConfiguration).length ? testResourceConfiguration : { ports: [] };
    const subject = await this.setup(input);
    console.log("\nSuite:", this.name, testResourceConfiguration);
    for (const [ndx, giver] of this.givens.entries()) {
      try {
        if (!this.aborted) {
          this.store = await giver.give(subject, ndx, testResourceConfiguration, this.test);
        }
      } catch (e) {
        console.error(e);
        this.fails.push(giver)
        return false;
      }
    }
    for (const [ndx, thater] of this.checks.entries()) {
      await thater.check(subject, ndx, testResourceConfiguration, this.test);
    }
    return true;
  }
}

export abstract class BaseGiven<ISubject, IStore, ISelection, IThenShape, IFeatureShape> {
  name: string;
  features: (keyof IFeatureShape)[];
  whens: BaseWhen<IStore, ISelection, IThenShape>[];
  thens: BaseThen<ISelection, IStore, IThenShape>[];
  error: Error;
  abort: boolean;
  store: IStore;
  testArtifacts: Record<string, any[]>

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
    this.testArtifacts = {};
  }

  toObj() {
    return {
      name: this.name,
      whens: this.whens.map((w) => w.toObj()),
      thens: this.thens.map((t) => t.toObj()),
      errors: this.error,
      features: this.features,
      testArtifacts: this.testArtifacts,
    }
  }

  abstract givenThat(
    subject: ISubject,
    testResourceConfiguration?
  ): Promise<IStore>;

  saveTestArtifact(k: string, testArtifact: TestArtifact) {
    if (!this.testArtifacts[k]) {
      this.testArtifacts[k] = []
    }
    this.testArtifacts[k].push(testArtifact)
  }

  artifactSaver = {
    png: (testArtifact) => this.saveTestArtifact('afterEach', new TestArtifact(testArtifact))
  }

  async aborter(ndx: number) {
    this.abort = true;
    return Promise.all([
      ...this.whens.map((w, ndx) => new Promise((res) => res(w.aborter()))),
      ...this.thens.map((t, ndx) => new Promise((res) => res(t.aborter()))),
    ])
      .then(async () => {
        return await this.afterEach(this.store, ndx, this.artifactSaver)
      })
  }

  async afterEach(store: IStore, ndx: number, cb): Promise<unknown> {
    return;
  }

  async give(
    subject: ISubject,
    index: number,
    testResourceConfiguration,
    tester
  ) {
    console.log(`\n Given: ${this.name}`);
    try {
      if (!this.abort) {
        this.store = await this.givenThat(subject, testResourceConfiguration);
      }
      for (const whenStep of this.whens) {
        await whenStep.test(this.store, testResourceConfiguration);
      }
      for (const thenStep of this.thens) {
        const t = await thenStep.test(this.store, testResourceConfiguration);
        tester(t);
      }
    } catch (e) {
      this.error = e;
      console.log('\u0007');// bell
      throw e;
    } finally {

      try {
        await this.afterEach(this.store, index, this.artifactSaver);
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
  abort: boolean;

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

  aborter() {
    this.abort = true;
    return this.abort;
  }

  async test(store: IStore, testResourceConfiguration?) {
    console.log(" When:", this.name);
    if (!this.abort) {
      try {
        return await this.andWhen(store, this.actioner, testResourceConfiguration);
      } catch (e) {
        this.error = true;
        throw e
      }
    }
  }
}

export abstract class BaseThen<ISelection, IStore, IThenShape> {
  public name: string;
  thenCB: (storeState: ISelection) => IThenShape;
  error: boolean;
  abort: boolean;

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

  aborter() {
    this.abort = true;
    return this.abort;
  }

  async test(store: IStore, testResourceConfiguration): Promise<IThenShape | undefined> {
    if (!this.abort) {
      console.log(" Then:", this.name);
      try {
        return await this.thenCB(await this.butThen(store, testResourceConfiguration));
      } catch (e) {
        this.error = true;
        throw e
      }
    }
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
    testResourceConfiguration?
  ): Promise<IStore>;

  async afterEach(store: IStore, ndx: number, cb?): Promise<unknown> {
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

      (
        Object.entries(this.whens)
          .reduce((a, [key, when]) => {
            a[key] = async (payload) => {
              return await when(payload, testResourceConfiguration).test(
                store,
                testResourceConfiguration
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
                testResourceConfiguration
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
  IFeatureShape,
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

    testResource

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

    /* @ts-ignore:next-line */
    const toReturn: ITestJob[] = suites.map((suite) => {
      return {
        test: suite,
        testResource,

        toObj: () => {
          return suite.toObj()
        },

        runner: async (allocatedPorts: number[]) => {
          return suite.run(input, { ports: allocatedPorts });
        },

      };
    });

    return toReturn;
  }
}

export const Testeranto = async <
  TestShape extends ITTestShape,
  Input,
  Subject,
  Store,
  Selection,
  WhenShape,
  ThenShape,
  InitialStateShape,
  IFeatureShape
>(
  input: Input,
  testSpecification: ITestSpecification<TestShape, IFeatureShape>,
  testImplementation,
  // testImplementation: ITestImplementation<
  //   InitialStateShape,
  //   Selection,
  //   WhenShape,
  //   ThenShape,
  //   TestShape
  // >,
  testResource: ITTestResourceRequirement,

  testInterface: {
    actionHandler?: (b: (...any) => any) => any,
    afterEach?: (store: Store, ndx: number, cb) => unknown,
    andWhen: (store: Store, actioner, testResource: ITTestResource) => Promise<Selection>,
    assertioner?: (t: ThenShape) => any,
    beforeAll?: (input: Input) => Promise<Subject>,
    beforeEach?: (subject: Subject, initialValues, testResource: ITTestResource) => Promise<Store>,
    butThen?: (store: Store, callback, testResource: ITTestResource) => Promise<Selection>,
  },

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
          async setup(s: Input): Promise<Subject> {
            return beforeAll(s);
          }
          test(t: ThenShape): unknown {
            return assertioner(t);
          }
        }),

        class Given extends BaseGiven<Subject, Store, Selection, ThenShape, IFeatureShape> {
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
          async givenThat(subject, testResource) {
            return beforeEach(subject, this.initialValues, testResource);
          }
          afterEach(store: Store, ndx: number, cb): Promise<unknown> {
            return new Promise((res) => res(afterEach(store, ndx, cb)))
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

          async checkThat(subject, testResource) {
            return beforeEach(subject, this.initialValues, testResource);
          }

          afterEach(store: Store, ndx: number, cb): Promise<unknown> {
            return new Promise((res) => res(afterEach(store, ndx, cb)))
          }
        },
        testResource
      );
    }
  }

  const mrt = new MrT();

  console.log("requesting test resources from mothership...", testResource);
  /* @ts-ignore:next-line */
  process.send({
    type: 'testeranto:hola',
    data: {
      testResource
    }
  });

  console.log("awaiting test resources from mothership...");
  process.on('message', async function (packet: { data: { go?: boolean, goWithTestResources?: string[] } }) {
    await mrt[0].runner(packet.data.goWithTestResources);


    /* @ts-ignore:next-line */
    process.send({
      type: 'testeranto:adios',
      data: {
        testResource: mrt[0].test.testResourceConfiguration.ports,
        results: mrt[0].toObj()
      }
    }, (err) => {
      if (!err) { console.log(`✅`) }
      else { console.error(`❗️`, err) }
      process.exit(0); // :-)
    });


  });

  process.on('SIGINT', function () {

    console.log("SIGINT caught. Releasing test resources back to mothership...", mrt[0].test.testResourceConfiguration);
    console.log("`❗️`");
    /* @ts-ignore:next-line */
    process.send({
      type: 'testeranto:adios',
      data: {
        testResource: mrt[0].test.testResourceConfiguration?.ports || []
      }
    });

    process.exit(0); // :-)
  });

};
