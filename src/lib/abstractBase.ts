import { IBaseTest } from "../Types";

import { ITTestResourceConfiguration, ITestArtifactory, ITLog } from ".";
import { PM } from "../PM/index.js";
// import { IUtils } from "./types";

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

    console.log("\nSuite:", this.index, this.name);
    tLog("\nSuite:", this.index, this.name);
    const sNdx = this.index;
    const sName = this.name;

    for (const [gNdx, g] of Object.entries(this.givens)) {
      const subject = await this.setup(
        input,
        suiteArtifactory,
        testResourceConfiguration,
        pm
      );

      const giver = this.givens[gNdx];
      try {
        this.store = await giver.give(
          subject,
          gNdx,
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

    const afterAllProxy = new Proxy(pm, {
      get(target, prop, receiver) {
        if (prop === "writeFileSync") {
          return (fp, contents) =>
            target[prop](`suite-${sNdx}/afterAll/${fp}`, contents);
        }

        if (prop === "browser") {
          return new Proxy(target[prop], {
            get(bTarget, bProp, bReceiver) {
              if (bProp === "pages") {
                return async () => {
                  return bTarget.pages().then((pages) => {
                    return pages.map((page) => {
                      return new Proxy(page, {
                        get(pTarget, pProp, pReciever) {
                          if (pProp === "screenshot") {
                            return async (x) => {
                              // console.log(
                              //   "custom-screenshot-MARK-afterAllProxy",
                              //   // arguments,
                              //   // x,
                              //   window["custom-screenshot"].toString()
                              // );
                              return await window["custom-screenshot"]({
                                ...x,
                                path:
                                  `${testResourceConfiguration.fs}/suite-${sNdx}/afterAll` +
                                  "/" +
                                  x.path,
                              });
                            };
                          }
                          // else if (pProp === "mainFrame") {
                          //   return () => target[pProp](...arguments);
                          // }
                          else {
                            return Reflect.get(...arguments);
                          }
                        },
                      });
                    });
                  });
                  // return (await target.pages()).map((page) => {
                  //   return new Proxy(page, handler2);
                  // });
                };
              }
            },
          });
        }

        return Reflect.get(...arguments);
      },
    });

    // pm.browser
    try {
      this.afterAll(this.store, artifactory, afterAllProxy);
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

export abstract class BaseGiven<ITestShape extends IBaseTest> {
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

  toObj() {
    return {
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

  async give(
    subject: ITestShape["isubject"],
    key: string,
    testResourceConfiguration,
    tester: (t: Awaited<ITestShape["then"]> | undefined) => boolean,
    artifactory: ITestArtifactory,
    tLog: ITLog,
    pm: PM,
    suiteNdx: number
  ) {
    tLog(`\n Given: ${this.name}`);

    const givenArtifactory = (fPath: string, value: unknown) =>
      artifactory(`given-${key}/${fPath}`, value);
    try {
      // tLog(`\n Given this.store`, this.store);

      const beforeEachProxy = new Proxy(pm, {
        get(target, prop, receiver) {
          if (prop === "writeFileSync") {
            console.log("beforeEachProx", arguments, target[prop]);
            return (fp, contents) =>
              target[prop](
                `suite-${suiteNdx}/given-${key}/when/beforeEach/${fp}`,
                contents
              );
          }

          return Reflect.get(...arguments);
        },
      });

      this.store = await this.givenThat(
        subject,
        testResourceConfiguration,
        givenArtifactory,
        this.givenCB,
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

      for (const thenStep of this.thens) {
        const t = await thenStep.test(
          this.store,
          testResourceConfiguration,
          tLog,
          pm
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
        // const afterEachProxy = new Proxy(pm, {
        //   get(target, prop, receiver) {
        //     if (prop === "writeFileSync") {
        //       console.log("afterEachProxy", arguments, target[prop]);
        //       return (fp, contents) =>
        //         // target[prop](`${key}/andWhen/${fp}`, contents);
        //         target[prop](`${key}/afterEach/${fp}`, contents);
        //     }

        //     return Reflect.get(...arguments);
        //   },
        // });

        // await this.afterEach(this.store, key, givenArtifactory, afterEachProxy);

        // await this.afterEach(this.store, key, givenArtifactory, pm);

        const afterEachProxy = new Proxy(pm, {
          get(target, prop, receiver) {
            if (prop === "writeFileSync") {
              return (fp, contents) =>
                target[prop](
                  `suite-${suiteNdx}/given-${key}/afterAll/${fp}`,
                  contents
                );
            }

            if (prop === "browser") {
              return new Proxy(target[prop], {
                get(bTarget, bProp, bReceiver) {
                  if (bProp === "pages") {
                    return async () => {
                      return bTarget.pages().then((pages) => {
                        return pages.map((page) => {
                          return new Proxy(page, {
                            get(pTarget, pProp, pReciever) {
                              if (pProp === "screenshot") {
                                return async (x) => {
                                  // console.log(
                                  //   "custom-screenshot-MARK-afterEachProxy",
                                  //   window["custom-screenshot"].toString()
                                  // );

                                  return await pTarget[pProp]({
                                    ...x,
                                    path:
                                      `${testResourceConfiguration.fs}/suite-${suiteNdx}/given-${key}/afterEach` +
                                      "/" +
                                      x.path,
                                  });
                                };
                              }
                              // else if (pProp === "mainFrame") {
                              //   return () => target[pProp](...arguments);
                              // }
                              else {
                                return Reflect.get(...arguments);
                              }
                            },
                          });
                        });
                      });
                      // return (await target.pages()).map((page) => {
                      //   return new Proxy(page, handler2);
                      // });
                    };
                  }
                },
              });
            }

            return Reflect.get(...arguments);
          },
        });

        await this.afterEach(this.store, key, givenArtifactory, afterEachProxy);
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
    pm: PM,
    key: string
  ) {
    tLog(" When:", this.name);

    const name = this.name;
    const andWhenProxy = new Proxy(pm, {
      get(target, prop, receiver) {
        if (prop === "writeFileSync") {
          console.log("andWhenProxy", arguments, target[prop]);
          return (fp, contents) =>
            // target[prop](`${key}/andWhen/${fp}`, contents);
            target[prop](`${key}/andWhen/${fp}`, contents);
        }

        return Reflect.get(...arguments);
      },
    });

    try {
      return await this.andWhen(
        store,
        this.whenCB,
        testResourceConfiguration,
        andWhenProxy
      );
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
    testResourceConfiguration?
  ): Promise<ITestShape["iselection"]>;

  async test(
    store: ITestShape["istore"],
    testResourceConfiguration,
    tLog: ITLog,
    pm: PM
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
      this.error = e.message;
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
