import { ITTestResource, ITTestShape } from "./types";

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
  IThenShape,
  ITestShape extends ITTestShape
> {
  name: string;
  givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[];
  checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>[];
  store: IStore;
  aborted: boolean;
  fails: BaseGiven<ISubject, IStore, ISelection, IThenShape>[];

  constructor(
    name: string,
    givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[] = [],
    checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>[] = []
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

  async run(input, testResourceConfiguration: ITTestResource) {
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
        return false
      }
    }
    for (const [ndx, thater] of this.checks.entries()) {
      await thater.check(subject, ndx, testResourceConfiguration, this.test);
    }
    return true
  }
}

class TestArtifact {
  binary: Buffer | string;

  constructor(binary) {
    this.binary = binary
  }
}

export abstract class BaseGiven<ISubject, IStore, ISelection, IThenShape> {
  name: string;
  features: BaseFeature[];
  whens: BaseWhen<IStore, ISelection, IThenShape>[];
  thens: BaseThen<ISelection, IStore, IThenShape>[];
  error: Error;
  abort: boolean;
  store: IStore;
  testArtifacts: Record<string, any[]>

  constructor(
    name: string,
    features: BaseFeature[],
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
      errors: this.error
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
  ITestShape extends ITTestShape
> {
  name: string;
  features: BaseFeature[];
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
    features: BaseFeature[],
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