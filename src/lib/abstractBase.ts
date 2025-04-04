import { IBaseTest } from "../Types";
import { PM } from "../PM/index.js";

import { ITTestResourceConfiguration, ITestArtifactory, ITLog } from ".";

export type IGivens<
  ITestShape extends IBaseTest<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> = Record<string, BaseGiven<ITestShape>>;

export abstract class BaseSuite<
  ITestShape extends IBaseTest<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> {
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

  public features() {
    const features = Object.keys(this.givens)
      .map((k) => this.givens[k].features)
      .flat()
      .filter((value, index, array) => {
        return array.indexOf(value) === index;
      });
    // .reduce((mm, lm) => {
    //   mm[lm] = lm;
    //   return mm;
    // }, {});
    return features || [];
  }

  public toObj() {
    const givens = Object.keys(this.givens).map((k) => this.givens[k].toObj());

    return {
      name: this.name,
      givens,
      fails: this.fails,
      features: this.features(),
    };
  }

  setup(
    s: ITestShape["iinput"],
    artifactory: ITestArtifactory,
    tr: ITTestResourceConfiguration,
    pm: PM
  ): Promise<ITestShape["isubject"]> {
    return new Promise((res) => res(s as unknown as ITestShape["isubject"]));
  }

  assertThat(t: ITestShape["then"]): unknown {
    return t;
  }

  afterAll(store: ITestShape["istore"], artifactory: ITestArtifactory, pm: PM) {
    return store;
  }

  async run(
    input: ITestShape["iinput"],
    testResourceConfiguration: ITTestResourceConfiguration,
    artifactory: (fPath: string, value: unknown) => void,
    tLog: (...string) => void,
    pm: PM
  ): Promise<BaseSuite<ITestShape>> {
    this.testResourceConfiguration = testResourceConfiguration;
    tLog("test resources: ", JSON.stringify(testResourceConfiguration));

    const suiteArtifactory = (fPath: string, value: unknown) =>
      artifactory(`suite-${this.index}-${this.name}/${fPath}`, value);

    // console.log("\nSuite:", this.index, this.name);
    tLog("\nSuite:", this.index, this.name);
    const sNdx = this.index;
    const sName = this.name;

    for (const [gKey, g] of Object.entries(this.givens)) {
      // console.log("gKey", gKey);
      const beforeAllProxy = new Proxy(pm, {
        get(target, prop, receiver) {
          if (prop === "customScreenShot") {
            return (opts, p) =>
              target.customScreenShot(
                {
                  ...opts,
                  // path: `${filepath}/${opts.path}`,
                  path: `suite-${sNdx}/beforeAll/${opts.path}`,
                },
                p
              );
          }

          if (prop === "writeFileSync") {
            return (fp, contents) =>
              target[prop](`suite-${sNdx}/beforeAll/${fp}`, contents);
          }

          return Reflect.get(...arguments);
        },
      });

      const subject = await this.setup(
        input,
        suiteArtifactory,
        testResourceConfiguration,
        beforeAllProxy
      );

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
        console.error(e);
        this.fails.push(giver);
        // return this;
      }
    }

    try {
      this.afterAll(
        this.store,
        artifactory,
        // afterAllProxy
        pm
      );
    } catch (e) {
      console.error(e);
      // this.fails.push(this);
      // return this;
    }

    // for (const [ndx, thater] of this.checks.entries()) {
    //   await thater.check(
    //     subject,
    //     thater.name,
    //     testResourceConfiguration,
    //     this.assertThat,
    //     suiteArtifactory,
    //     tLog,
    //     pm
    //   );
    // }

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

export abstract class BaseGiven<
  ITestShape extends IBaseTest<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> {
  name: string;
  features: string[];
  whens: BaseWhen<ITestShape>[];
  thens: BaseThen<ITestShape>[];
  error: Error;
  fail: any;
  store: ITestShape["istore"];
  recommendedFsPath: string;
  givenCB: ITestShape["given"];
  initialValues: any;
  key: string;

  constructor(
    name: string,
    features: string[],
    whens: BaseWhen<ITestShape>[],
    thens: BaseThen<ITestShape>[],
    givenCB: ITestShape["given"],
    initialValues: any
    // key: string
  ) {
    this.name = name;
    this.features = features;
    this.whens = whens;
    this.thens = thens;
    this.givenCB = givenCB;
    this.initialValues = initialValues;
  }

  beforeAll(
    store: ITestShape["istore"],
    // artifactory: ITestArtifactory
    // subject,
    initializer,
    artifactory,
    testResource,
    initialValues,
    pm
  ) {
    return store;
  }

  toObj() {
    return {
      key: this.key,
      name: this.name,
      whens: this.whens.map((w) => w.toObj()),
      thens: this.thens.map((t) => t.toObj()),
      error: this.error ? [this.error, this.error.stack] : null,
      // fail: this.fail ? [this.fail] : false,
      features: this.features,
    };
  }

  abstract givenThat(
    subject: ITestShape["isubject"],
    testResourceConfiguration,
    artifactory: ITestArtifactory,
    givenCB: ITestShape["given"],
    initialValues: any,
    pm: PM
  ): Promise<ITestShape["istore"]>;

  async afterEach(
    store: ITestShape["istore"],
    key: string,
    artifactory: ITestArtifactory,
    pm: PM
  ): Promise<unknown> {
    return store;
  }

  abstract uberCatcher(e);

  async give(
    subject: ITestShape["isubject"],
    key: string,
    testResourceConfiguration: ITTestResourceConfiguration,
    tester: (t: Awaited<ITestShape["then"]> | undefined) => boolean,
    artifactory: ITestArtifactory,
    tLog: ITLog,
    pm: PM,
    suiteNdx: number
  ) {
    this.key = key;

    tLog(`\n ${this.key}`);
    tLog(`\n Given: ${this.name}`);

    const givenArtifactory = (fPath: string, value: unknown) =>
      artifactory(`given-${key}/${fPath}`, value);
    try {
      // tLog(`\n Given this.store`, this.store);

      const beforeEachProxy = new Proxy(pm, {
        get(target, prop, receiver) {
          if (prop === "writeFileSync") {
            return (fp, contents) =>
              target[prop](
                `suite-${suiteNdx}/given-${key}/when/beforeEach/${fp}`,
                contents
              );
          }

          if (prop === "customScreenShot") {
            return (opts, p) =>
              target.customScreenShot(
                {
                  ...opts,
                  path: `suite-${suiteNdx}/given-${key}/when/beforeEach/${opts.path}`,
                },
                p
              );
          }

          if (prop === "screencast") {
            return (opts, p) =>
              target.screencast(
                {
                  ...opts,
                  path: `suite-${suiteNdx}/given-${key}/when/beforeEach/${opts.path}`,
                },
                p
              );
          }

          return Reflect.get(...arguments);
        },
      });

      this.uberCatcher((e) => {
        console.error(e);
        this.error = e.error;
        tLog(e.stack);
      });

      this.store = await this.givenThat(
        subject,
        testResourceConfiguration,
        givenArtifactory,
        this.givenCB,
        this.initialValues,
        beforeEachProxy
      );

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
      }
    } catch (e) {
      console.error(e);
      this.error = e;
      tLog(e.stack);
      // tLog("\u0007"); // bell

      // throw e;
    } finally {
      try {
        const afterEachProxy = new Proxy(pm, {
          get(target, prop, receiver) {
            if (prop === "customScreenShot") {
              return (opts, p) =>
                target.customScreenShot(
                  {
                    ...opts,
                    path: `suite-${suiteNdx}/given-${key}/afterEach/${opts.path}`,
                  },
                  p
                );
            }

            if (prop === "writeFileSync") {
              return (fp, contents) =>
                target[prop](
                  `suite-${suiteNdx}/given-${key}/afterEach/${fp}`,
                  contents
                );
            }

            return Reflect.get(...arguments);
          },
        });

        await this.afterEach(
          this.store,
          this.key,
          givenArtifactory,
          // pm
          afterEachProxy
        );
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
    testResource,
    pm: PM
  ): Promise<any>;

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
    pm: PM,
    filepath: string
  ) {
    tLog(" When:", this.name);

    const name = this.name;
    const andWhenProxy = new Proxy(pm, {
      get(target, prop, receiver) {
        if (prop === "customScreenShot") {
          return (opts, p) =>
            target.customScreenShot(
              {
                ...opts,
                path: `${filepath}/${opts.path}`,
              },
              p
            );
        }
        if (prop === "writeFileSync") {
          return (fp, contents) =>
            target[prop](`${filepath}/andWhen/${fp}`, contents);
        }

        return Reflect.get(...arguments);
      },
    });

    return await this.andWhen(
      store,
      this.whenCB,
      testResourceConfiguration,
      andWhenProxy
    ).catch((e) => {
      this.error = true;
      // throw e;
    });
    // try {
    //   return await this.andWhen(
    //     store,
    //     this.whenCB,
    //     testResourceConfiguration,
    //     andWhenProxy
    //   );
    // } catch (e) {
    //   this.error = true;
    //   throw e;
    // }
  }
}

export abstract class BaseThen<
  ITestShape extends IBaseTest<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> {
  public name: string;
  thenCB: (storeState: ITestShape["iselection"]) => ITestShape["then"];
  error: boolean;

  constructor(
    name: string,
    thenCB: (val: ITestShape["iselection"]) => ITestShape["then"]
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
    store: ITestShape["istore"],
    thenCB,
    testResourceConfiguration: ITTestResourceConfiguration,
    pm: PM
  ): Promise<ITestShape["iselection"]>;

  async test(
    store: ITestShape["istore"],
    testResourceConfiguration,
    tLog: ITLog,
    pm: PM,
    filepath: string
  ): Promise<ITestShape["then"] | undefined> {
    tLog(" Then:", this.name);
    try {
      const butThenProxy = new Proxy(pm, {
        get(target, prop, receiver) {
          if (prop === "customScreenShot") {
            return (opts, p) =>
              target.customScreenShot(
                {
                  ...opts,
                  path: `${filepath}/${opts.path}`,
                },
                p
              );
          }

          if (prop === "writeFileSync") {
            return (fp, contents) =>
              target[prop](`${filepath}/${fp}`, contents);
          }

          return Reflect.get(...arguments);
        },
      });

      return this.butThen(
        store,
        this.thenCB,
        testResourceConfiguration,
        butThenProxy
      ).catch((e) => {
        this.error = true;
        throw e;
      });
    } catch (e) {
      console.log("test failed", e);
      this.error = e.message;
      throw e;
    }
  }
}

export abstract class BaseCheck<
  ITestShape extends IBaseTest<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> {
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
    pm: PM
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
    pm: PM
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
            pm,
            "x"
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
            pm
          );
          tester(t);
        };
        return a;
      }, {})
    );

    await this.afterEach(store, key, () => {}, pm);
    return;
  }
}
