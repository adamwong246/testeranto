/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IT, OT } from "../Types.js";

import { ITTestResourceConfiguration, ITestArtifactory, ITLog } from ".";
import { IPM } from "./types.js";
import {
  afterAllProxy,
  afterEachProxy,
  andWhenProxy,
  beforeAllProxy,
  beforeEachProxy,
  butThenProxy,
} from "./pmProxy.js";

export type IGivens<I extends IT> = Record<string, BaseGiven<I>>;

export abstract class BaseSuite<I extends IT = IT, O extends OT = OT> {
  name: string;
  givens: IGivens<I>;
  checks: BaseCheck<I>[];
  store: I["istore"];
  testResourceConfiguration: ITTestResourceConfiguration;
  index: number;
  failed: boolean;
  fails: number;

  constructor(
    name: string,
    index: number,
    givens: IGivens<I> = {},
    checks: BaseCheck<I>[] = []
  ) {
    this.name = name;
    this.index = index;
    this.givens = givens;
    this.checks = checks;
    this.fails = 0;
  }

  public features() {
    const features = Object.keys(this.givens)
      .map((k) => this.givens[k].features)
      .flat()
      .filter((value, index, array) => {
        return array.indexOf(value) === index;
      });
    return features || [];
  }

  public toObj() {
    const givens = Object.keys(this.givens).map((k) => this.givens[k].toObj());
    const checks = Object.keys(this.checks).map((k) => this.checks[k].toObj());

    return {
      name: this.name,
      givens,
      checks,
      fails: this.fails,
      failed: this.failed,
      features: this.features(),
    };
  }

  setup(
    s: I["iinput"],
    artifactory: ITestArtifactory,
    tr: ITTestResourceConfiguration,
    pm: IPM
  ): Promise<I["isubject"]> {
    return new Promise((res) => res(s as unknown as I["isubject"]));
  }

  assertThat(t: Awaited<I["then"]> | undefined): boolean {
    return !!t;
  }

  afterAll(store: I["istore"], artifactory: ITestArtifactory, pm: IPM) {
    return store;
  }

  async run(
    input: I["iinput"],
    testResourceConfiguration: ITTestResourceConfiguration,
    artifactory: (fPath: string, value: unknown) => void,
    tLog: (...string) => void,
    pm: IPM
  ): Promise<BaseSuite<I, O>> {
    this.testResourceConfiguration = testResourceConfiguration;
    // tLog("test resources: ", JSON.stringify(testResourceConfiguration));

    const suiteArtifactory = (fPath: string, value: unknown) =>
      artifactory(`suite-${this.index}-${this.name}/${fPath}`, value);

    // console.log("\nSuite:", this.index, this.name);
    tLog("\nSuite:", this.index, this.name);
    const sNdx = this.index;
    // const sName = this.name;

    const subject = await this.setup(
      input,
      suiteArtifactory,
      testResourceConfiguration,
      beforeAllProxy(pm, sNdx.toString())
    );

    for (const [gKey, g] of Object.entries(this.givens)) {
      const giver = this.givens[gKey];
      try {
        this.store = await giver.give(
          subject,
          gKey,
          testResourceConfiguration,
          this.assertThat,
          suiteArtifactory,
          tLog,
          pm,
          sNdx
        );
      } catch (e) {
        this.failed = true;
        this.fails = this.fails + 1;
        console.error(e);
        // this.fails.push(giver);
        // return this;
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
        pm
      );
    }

    try {
      this.afterAll(
        this.store,
        artifactory,
        afterAllProxy(pm, sNdx.toString())
      );
    } catch (e) {
      console.error(e);
      // this.fails.push(this);
      // return this;
    }

    // @TODO fix me
    // for (const k of Object.keys(this.givens)) {
    //   const giver = this.givens[k];

    //   try {
    //     giver.afterAll(this.store, artifactory, pm);
    //   } catch (e) {
    //     console.error(e);
    //     this.fails.push(giver);
    //     return this;
    //   }
    // }
    ////////////////

    return this;
  }
}

export abstract class BaseGiven<I extends IT = IT> {
  name: string;
  features: string[];
  whens: BaseWhen<I>[];
  thens: BaseThen<I>[];
  error: Error;
  fail: any;
  store: I["istore"];
  recommendedFsPath: string;
  givenCB: I["given"];
  initialValues: any;
  key: string;
  failed: boolean;

  constructor(
    name: string,
    features: string[],
    whens: BaseWhen<I>[],
    thens: BaseThen<I>[],
    givenCB: I["given"],
    initialValues: any
  ) {
    this.name = name;
    this.features = features;
    this.whens = whens;
    this.thens = thens;
    this.givenCB = givenCB;
    this.initialValues = initialValues;
  }

  beforeAll(store: I["istore"]) {
    return store;
  }

  toObj() {
    return {
      key: this.key,
      name: this.name,
      whens: this.whens.map((w) => w.toObj()),
      thens: this.thens.map((t) => t.toObj()),
      error: this.error ? [this.error, this.error.stack] : null,
      failed: this.failed,
      features: this.features,
    };
  }

  abstract givenThat(
    subject: I["isubject"],
    testResourceConfiguration,
    artifactory: ITestArtifactory,
    givenCB: I["given"],
    initialValues: any,
    pm: IPM
  ): Promise<I["istore"]>;

  async afterEach(
    store: I["istore"],
    key: string,
    artifactory: ITestArtifactory,
    pm: IPM
  ): Promise<unknown> {
    return store;
  }

  abstract uberCatcher(e);

  async give(
    subject: I["isubject"],
    key: string,
    testResourceConfiguration: ITTestResourceConfiguration,
    tester: (t: Awaited<I["then"]> | undefined) => boolean,
    artifactory: ITestArtifactory,
    tLog: ITLog,
    pm: IPM,
    suiteNdx: number
  ) {
    this.key = key;

    tLog(`\n ${this.key}`);
    tLog(`\n Given: ${this.name}`);

    const givenArtifactory = (fPath: string, value: unknown) =>
      artifactory(`given-${key}/${fPath}`, value);

    this.uberCatcher((e) => {
      console.error(e);
      this.error = e.error;
      tLog(e.stack);
    });

    try {
      this.store = await this.givenThat(
        subject,
        testResourceConfiguration,
        givenArtifactory,
        this.givenCB,
        this.initialValues,
        beforeEachProxy(pm, suiteNdx.toString())
      );
    } catch (e) {
      console.error("failure 4 ", e);
      this.error = e;
      throw e;
    }

    try {
      // tLog(`\n Given this.store`, this.store);

      for (const [whenNdx, whenStep] of this.whens.entries()) {
        await whenStep.test(
          this.store,
          testResourceConfiguration,
          tLog,
          pm,
          `suite-${suiteNdx}/given-${key}/when/${whenNdx}`
        );
      }

      for (const [thenNdx, thenStep] of this.thens.entries()) {
        const t = await thenStep.test(
          this.store,
          testResourceConfiguration,
          tLog,
          pm,
          `suite-${suiteNdx}/given-${key}/then-${thenNdx}`
        );
        tester(t);
        // ((t) => {
        //   return tester(t);
        // })();
      }
    } catch (e) {
      this.failed = true;
      tLog(e.stack);
      throw e;
    } finally {
      try {
        await this.afterEach(
          this.store,
          this.key,
          givenArtifactory,

          afterEachProxy(pm, suiteNdx.toString(), key)
        );
      } catch (e) {
        console.error("afterEach failed!", e);
        this.failed = e;
        throw e;

        // this.error = e.message;
      }
    }
    return this.store;
  }
}

export abstract class BaseWhen<I extends IT> {
  public name: string;
  whenCB: (x: I["iselection"]) => I["then"];
  error: Error;

  constructor(name: string, whenCB: (xyz: I["iselection"]) => I["then"]) {
    this.name = name;
    this.whenCB = whenCB;
  }

  abstract andWhen(
    store: I["istore"],
    whenCB: (x: I["iselection"]) => I["then"],
    testResource,
    pm: IPM
  ): Promise<any>;

  toObj() {
    console.log("toObj error", this.error);
    return {
      name: this.name,
      error: this.error && this.error.name + this.error.stack,
    };
  }

  async test(
    store: I["istore"],
    testResourceConfiguration,
    tLog: ITLog,
    pm: IPM,
    filepath: string
  ) {
    tLog(" When:", this.name);

    return await this.andWhen(
      store,
      this.whenCB,
      testResourceConfiguration,
      andWhenProxy(pm, filepath)
    ).catch((e: Error) => {
      console.log("MARK9", e);
      this.error = e;
      throw e;
    });
  }
}

export abstract class BaseThen<I extends IT> {
  public name: string;
  thenCB: (storeState: I["iselection"]) => Promise<I["then"]>;
  error: boolean;

  constructor(
    name: string,
    thenCB: (val: I["iselection"]) => Promise<I["then"]>
  ) {
    this.name = name;
    this.thenCB = thenCB;
    this.error = false;
  }

  toObj() {
    return {
      name: this.name,
      error: this.error,
    };
  }

  abstract butThen(
    store: I["istore"],
    thenCB: (s: I["iselection"]) => Promise<I["isubject"]>,
    testResourceConfiguration: ITTestResourceConfiguration,
    pm: IPM,
    ...args: any[]
  ): Promise<I["iselection"]>;

  async test(
    store: I["istore"],
    testResourceConfiguration,
    tLog: ITLog,
    pm: IPM,
    filepath: string
  ): Promise<I["then"] | undefined> {
    return this.butThen(
      store,
      async (s: I["iselection"]) => {
        tLog(" Then!!!:", this.name);

        if (typeof this.thenCB === "function") {
          return await this.thenCB(s);
        } else {
          return this.thenCB;
        }
      },
      testResourceConfiguration,
      butThenProxy(pm, filepath)
    ).catch((e) => {
      console.log("test failed 3", e);
      this.error = e;
      throw e;
    });
  }

  check() {}
}

export abstract class BaseCheck<I extends IT = IT> {
  key: string;
  name: string;
  features: string[];
  checkCB: (store: I["istore"], pm: IPM) => any;
  initialValues: any;
  store: I["istore"];
  checker: any;

  constructor(
    name: string,
    features: string[],
    checker: (store: I["istore"], pm: IPM) => any,
    x: any,
    checkCB: any
  ) {
    this.name = name;
    this.features = features;
    this.checkCB = checkCB;
    this.checker = checker;
  }

  abstract checkThat(
    subject: I["isubject"],
    testResourceConfiguration,
    artifactory: ITestArtifactory,
    initializer,
    initialValues,
    pm: IPM
  ): Promise<I["istore"]>;

  toObj() {
    return {
      key: this.key,
      name: this.name,
      // functionAsString: this.checkCB.toString(),
      features: this.features,
    };
  }

  async afterEach(
    store: I["istore"],
    key: string,
    artifactory: ITestArtifactory,
    pm: IPM
  ): Promise<unknown> {
    return store;
  }

  beforeAll(store: I["istore"]) {
    return store;
  }

  async check(
    subject: I["isubject"],
    key: string,
    testResourceConfiguration,
    tester,
    artifactory: ITestArtifactory,
    tLog: ITLog,
    pm: IPM
  ) {
    this.key = key;
    tLog(`\n Check: ${this.name}`);
    this.store = await this.checkThat(
      subject,
      testResourceConfiguration,
      artifactory,
      this.checkCB,
      this.initialValues,
      pm
    );

    await this.checker(this.store, pm);

    return;
  }
}
