import { IBaseTest } from "../Types";

import { ITTestResourceConfiguration, ITestArtifactory, ITLog } from ".";
import { IUtils } from "./types";

export type IGivens<ITestShape extends IBaseTest> = Record<
  string,
  BaseGiven<ITestShape>
>;

export abstract class BaseSuite<ITestShape extends IBaseTest> {
  name: string;
  givens: IGivens<ITestShape>;
  checks: BaseCheck<ITestShape>[];
  store: ITestShape["istore"];
  fails: BaseGiven<ITestShape>[];
  testResourceConfiguration: ITTestResourceConfiguration;
  index: number;

  constructor(
    name: string,
    index: number,
    givens: IGivens<ITestShape> = {},
    checks: BaseCheck<ITestShape>[] = []
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

  setup(
    s: ITestShape["iinput"],
    artifactory: ITestArtifactory,
    tr: ITTestResourceConfiguration,
    utils: IUtils
  ): Promise<ITestShape["isubject"]> {
    return new Promise((res) => res(s as unknown as ITestShape["isubject"]));
  }

  assertThat(t: ITestShape["then"]): unknown {
    // console.log("base assertThat")
    return t;
  }

  async run(
    input: ITestShape["iinput"],
    testResourceConfiguration: ITTestResourceConfiguration,
    artifactory: (fPath: string, value: unknown) => void,
    tLog: (...string) => void,
    utils: IUtils
  ): Promise<BaseSuite<ITestShape>> {
    this.testResourceConfiguration = testResourceConfiguration;
    tLog("test resources: ", testResourceConfiguration);

    const suiteArtifactory = (fPath: string, value: unknown) =>
      artifactory(`suite-${this.index}-${this.name}/${fPath}`, value);
    const subject = await this.setup(
      input,
      suiteArtifactory,
      testResourceConfiguration,
      utils
    );

    tLog("\nSuite:", this.index, this.name);
    for (const k of Object.keys(this.givens)) {
      const giver = this.givens[k];
      try {
        this.store = await giver.give(
          subject,
          k,
          testResourceConfiguration,
          this.assertThat,
          suiteArtifactory,
          tLog,
          utils
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
        this.assertThat,
        suiteArtifactory,
        tLog,
        utils
      );
    }

    // @TODO fix me
    for (const k of Object.keys(this.givens)) {
      const giver = this.givens[k];

      try {
        giver.afterAll(this.store, artifactory, utils);
      } catch (e) {
        console.error(e);
        this.fails.push(giver);
        return this;
      }
    }
    ////////////////

    return this;
  }
}

export abstract class BaseGiven<ITestShape extends IBaseTest> {
  name: string;
  features: string[];
  whens: BaseWhen<ITestShape>[];
  thens: BaseThen<ITestShape>[];
  error: Error;
  store: ITestShape["istore"];
  recommendedFsPath: string;
  givenCB: ITestShape["given"];
  initialValues: any;

  constructor(
    name: string,
    features: string[],
    whens: BaseWhen<ITestShape>[],
    thens: BaseThen<ITestShape>[],
    givenCB: ITestShape["given"],
    initialValues: any
  ) {
    this.name = name;
    this.features = features;
    this.whens = whens;
    this.thens = thens;
    this.givenCB = givenCB;
    this.initialValues = initialValues;
  }

  beforeAll(store: ITestShape["istore"], artifactory: ITestArtifactory) {
    return store;
  }

  afterAll(
    store: ITestShape["istore"],
    artifactory: ITestArtifactory,
    utils: IUtils
  ) {
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
    subject: ITestShape["isubject"],
    testResourceConfiguration,
    artifactory: ITestArtifactory,
    givenCB: ITestShape["given"]
  ): Promise<ITestShape["istore"]>;

  async afterEach(
    store: ITestShape["istore"],
    key: string,
    artifactory: ITestArtifactory,
    utils: IUtils
  ): Promise<unknown> {
    return store;
  }

  async give(
    subject: ITestShape["isubject"],
    key: string,
    testResourceConfiguration,
    tester,
    artifactory: ITestArtifactory,
    tLog: ITLog,
    utils: IUtils
  ) {
    tLog(`\n Given: ${this.name}`);

    const givenArtifactory = (fPath: string, value: unknown) =>
      artifactory(`given-${key}/${fPath}`, value);
    try {
      this.store = await this.givenThat(
        subject,
        testResourceConfiguration,
        givenArtifactory,
        this.givenCB
      );

      // tLog(`\n Given this.store`, this.store);
      for (const whenStep of this.whens) {
        await whenStep.test(this.store, testResourceConfiguration, tLog, utils);
      }
      for (const thenStep of this.thens) {
        const t = await thenStep.test(
          this.store,
          testResourceConfiguration,
          tLog,
          utils
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
        await this.afterEach(this.store, key, givenArtifactory, utils);
      } catch (e) {
        console.error("afterEach failed! no error will be recorded!", e);
      }
    }
    return this.store;
  }
}

export abstract class BaseWhen<ITestShape extends IBaseTest> {
  public name: string;
  whenCB: (x: ITestShape["iselection"]) => ITestShape["then"];
  error: boolean;

  constructor(
    name: string,
    whenCB: (xyz: ITestShape["iselection"]) => ITestShape["then"]
  ) {
    this.name = name;
    this.whenCB = whenCB;
  }

  abstract andWhen(
    store: ITestShape["istore"],
    whenCB: (x: ITestShape["iselection"]) => ITestShape["then"],
    testResource
  );

  toObj() {
    return {
      name: this.name,
      error: this.error,
    };
  }

  async test(
    store: ITestShape["istore"],
    testResourceConfiguration,
    tLog: ITLog,
    utils: IUtils
  ) {
    tLog(" When:", this.name);
    try {
      return await this.andWhen(store, this.whenCB, testResourceConfiguration);
    } catch (e) {
      this.error = true;
      throw e;
    }
  }
}

export abstract class BaseThen<ITestShape extends IBaseTest> {
  public name: string;
  thenCB: (storeState: ITestShape["iselection"]) => ITestShape["then"];
  error: boolean;

  constructor(
    name: string,
    thenCB: (val: ITestShape["iselection"]) => ITestShape["then"]
  ) {
    this.name = name;
    this.thenCB = thenCB;
  }

  toObj() {
    return {
      name: this.name,
      error: this.error,
    };
  }

  abstract butThen(
    store: ITestShape["istore"],
    thenCB,
    testResourceConfiguration?
  ): Promise<ITestShape["iselection"]>;

  async test(
    store: ITestShape["istore"],
    testResourceConfiguration,
    tLog: ITLog,
    utils: IUtils
  ): Promise<ITestShape["then"] | undefined> {
    tLog(" Then:", this.name);
    try {
      const x = await this.butThen(
        store,
        this.thenCB,
        testResourceConfiguration
      );
      return x;
    } catch (e) {
      console.log("test failed", e);
      this.error = true;
      throw e;
    }
  }
}

export abstract class BaseCheck<ITestShape extends IBaseTest> {
  name: string;
  features: string[];
  checkCB: (whens, thens) => any;
  whens: {
    [K in keyof ITestShape["whens"]]: (p, tc) => BaseWhen<ITestShape>;
  };
  thens: {
    [K in keyof ITestShape["thens"]]: (p, tc) => BaseThen<ITestShape>;
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
    subject: ITestShape["isubject"],
    testResourceConfiguration,
    artifactory: ITestArtifactory
  ): Promise<ITestShape["istore"]>;

  async afterEach(
    store: ITestShape["istore"],
    key: string,
    cb,
    utils: IUtils
  ): Promise<unknown> {
    return;
  }

  async check(
    subject: ITestShape["isubject"],
    key: string,
    testResourceConfiguration,
    tester,
    artifactory: ITestArtifactory,
    tLog: ITLog,
    utils: IUtils
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
            tLog,
            utils
          );
        };
        return a;
      }, {}),
      Object.entries(this.thens).reduce((a, [key, then]) => {
        a[key] = async (payload) => {
          const t = await then(payload, testResourceConfiguration).test(
            store,
            testResourceConfiguration,
            tLog,
            utils
          );
          tester(t);
        };
        return a;
      }, {})
    );

    await this.afterEach(store, key, () => {}, utils);
    return;
  }
}
