/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Do not add logging to this file as it is used by the pure runtime.

import { PassThrough } from "stream";
import { NonEmptyObject } from "type-fest";

import type {
  Ibdd_in_any,
  Ibdd_out_any,
  ITestImplementation,
  ITestSpecification,
  ITestAdapter,
} from "../CoreTypes";

import {
  ITestJob,
  ITLog,
  IFinalResults,
  ITTestResourceConfiguration,
  ITTestResourceRequest,
  ITestArtifactory,
  defaultTestResourceRequirement,
  DefaultAdapter,
} from "./index.js";
import { BaseGiven, IGivens } from "./BaseGiven";
import { BaseWhen } from "./BaseWhen.js";
import { BaseThen } from "./BaseThen.js";
import { IPM } from "./types.js";
import { BaseSuite } from "./BaseSuite";

type IExtenstions = Record<string, unknown>;

export default abstract class Tiposkripto<
  I extends Ibdd_in_any = Ibdd_in_any,
  O extends Ibdd_out_any = Ibdd_out_any,
  M = unknown
> {
  // Add the receiveTestResourceConfig method from TesterantoCore
  abstract receiveTestResourceConfig(
    partialTestResource: string
  ): Promise<IFinalResults>;
  specs: any;

  assertThis: (t: I["then"]) => any;

  testResourceRequirement: ITTestResourceRequest;
  artifacts: Promise<unknown>[] = [];
  testJobs: ITestJob[];
  private totalTests: number;
  testSpecification: ITestSpecification<I, O>;
  suitesOverrides: Record<keyof IExtenstions, any>;
  givenOverides: Record<keyof IExtenstions, any>;
  whenOverides: Record<keyof IExtenstions, any>;
  thenOverides: Record<keyof IExtenstions, any>;
  puppetMaster: IPM;

  constructor(
    input: I["iinput"],
    testSpecification: ITestSpecification<I, O>,
    testImplementation: ITestImplementation<I, O, M> & {
      suites: Record<string, NonEmptyObject<object>>;
      givens: Record<string, any>;
      whens: Record<string, any>;
      thens: Record<string, any>;
    },
    testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
    testAdapter: Partial<ITestAdapter<I>> = {},
    uberCatcher: (cb: () => void) => void = (cb) => cb()
  ) {
    const fullAdapter = DefaultAdapter<I>(testAdapter);

    // Create classy implementations
    const classySuites = Object.entries(testImplementation.suites).reduce(
      (a, [key], index) => {
        a[key] = (somestring: string, givens: IGivens<I>) => {
          return new (class extends BaseSuite<I, O> {
            afterAll(
              store: I["istore"],
              artifactory: ITestArtifactory,
              pm: IPM
            ) {
              return fullAdapter.afterAll(store, pm);
            }

            assertThat(t: Awaited<I["then"]>): boolean {
              return fullAdapter.assertThis(t);
            }

            async setup(
              s: I["iinput"],
              artifactory: ITestArtifactory,
              tr: ITTestResourceConfiguration,
              pm: IPM
            ): Promise<I["isubject"]> {
              return (
                fullAdapter.beforeAll?.(s, tr, pm) ??
                (s as unknown as Promise<I["isubject"]>)
              );
            }
          })(somestring, index, givens);
        };
        return a;
      },
      {}
    );

    const classyGivens = Object.entries(testImplementation.givens).reduce(
      (a, [key, g]) => {
        a[key] = (
          name: string,
          features: string[],
          whens: BaseWhen<I>[],
          thens: BaseThen<I>[],
          gcb: I["given"],
          initialValues: any
        ) => {
          return new (class extends BaseGiven<I> {
            uberCatcher = uberCatcher;

            async givenThat(
              subject,
              testResource,
              artifactory,
              initializer,
              initialValues,
              pm
            ) {
              return fullAdapter.beforeEach(
                subject,
                initializer,
                testResource,
                initialValues,
                pm
              );
            }

            afterEach(
              store: I["istore"],
              key: string,
              artifactory,
              pm
            ): Promise<unknown> {
              return Promise.resolve(fullAdapter.afterEach(store, key, pm));
            }
          })(
            name,
            features,
            whens,
            thens,
            testImplementation.givens[key],
            initialValues
          );
        };
        return a;
      },
      {}
    );

    const classyWhens = Object.entries(testImplementation.whens).reduce(
      (a, [key, whEn]: [string, (...x: any[]) => any]) => {
        a[key] = (...payload: any[]) => {
          return new (class extends BaseWhen<I> {
            async andWhen(store, whenCB, testResource, pm) {
              return await fullAdapter.andWhen(store, whenCB, testResource, pm);
            }
          })(`${key}: ${payload && payload.toString()}`, whEn(...payload));
        };
        return a;
      },
      {}
    );

    const classyThens = Object.entries(testImplementation.thens).reduce(
      (a, [key, thEn]: [string, (...x: any[]) => any]) => {
        a[key] = (...args: any[]) => {
          return new (class extends BaseThen<I> {
            async butThen(
              store: any,
              thenCB,
              testResource: any,
              pm: IPM
            ): Promise<I["iselection"]> {
              return await fullAdapter.butThen(store, thenCB, testResource, pm);
            }
          })(`${key}: ${args && args.toString()}`, thEn(...args));
        };
        return a;
      },
      {}
    );

    // Set up the overrides
    this.suitesOverrides = classySuites;
    this.givenOverides = classyGivens;
    this.whenOverides = classyWhens;
    this.thenOverides = classyThens;
    this.testResourceRequirement = testResourceRequirement;
    this.testSpecification = testSpecification;

    // Generate specs
    this.specs = testSpecification(
      this.Suites(),
      this.Given(),
      this.When(),
      this.Then()
    );

    // Calculate total number of tests (sum of all Givens across all Suites)
    // Each suite should have a 'givens' property that's a record of test names to BaseGiven instances
    this.totalTests = this.calculateTotalTests();
    console.log(`Total tests calculated: ${this.totalTests}`);

    // Create test jobs
    this.testJobs = this.specs.map((suite: BaseSuite<I, O>) => {
      const suiteRunner =
        (suite: BaseSuite<I, O>) =>
        async (puppetMaster: IPM, tLog: ITLog): Promise<BaseSuite<I, O>> => {
          try {
            const x = await suite.run(
              input,
              puppetMaster.testResourceConfiguration,
              (fPath: string, value: string | Buffer | PassThrough) =>
                puppetMaster.testArtiFactoryfileWriter(
                  tLog,
                  (p: Promise<void>) => {
                    this.artifacts.push(p);
                  }
                )(
                  puppetMaster.testResourceConfiguration.fs + "/" + fPath,
                  value
                ),
              tLog,
              puppetMaster
            );
            return x;
          } catch (e) {
            console.error(e.stack);
            throw e;
          }
        };

      const runner = suiteRunner(suite);

      return {
        test: suite,

        toObj: () => {
          return suite.toObj();
        },

        runner,

        receiveTestResourceConfig: async function (
          puppetMaster: IPM
        ): Promise<IFinalResults> {
          const tLog = async (...l: string[]) => {
            //
          };

          try {
            const suiteDone: BaseSuite<I, O> = await runner(puppetMaster, tLog);
            const fails = suiteDone.fails;
            await puppetMaster.writeFileSync(
              `tests.json`,
              JSON.stringify(this.toObj(), null, 2),
              "test"
            );

            return {
              failed: fails > 0,
              fails,
              artifacts: this.artifacts || [],
              features: suiteDone.features(),
              tests: 0, // Keep existing field
              runTimeTests: this.totalTests, // Add the total number of tests
            };
          } catch (e) {
            console.error(e.stack);
            return {
              failed: true,
              fails: -1,
              artifacts: this.artifacts || [],
              features: [],
              tests: 0, // Keep existing field
              runTimeTests: -1, // Set to -1 on hard error
            };
          }
        },
      };
    });
  }

  Specs() {
    return this.specs;
  }
  Suites() {
    return this.suitesOverrides;
  }

  Given(): Record<
    keyof IExtenstions,
    (
      name: string,
      features: string[],
      whens: BaseWhen<I>[],
      thens: BaseThen<I>[],
      gcb: I["given"]
    ) => BaseGiven<I>
  > {
    return this.givenOverides;
  }

  When(): Record<
    keyof IExtenstions,
    (arg0: I["istore"], ...arg1: any) => BaseWhen<I>
  > {
    return this.whenOverides;
  }

  Then(): Record<
    keyof IExtenstions,
    (selection: I["iselection"], expectation: any) => BaseThen<I>
  > {
    return this.thenOverides;
  }

  // Add a method to access test jobs which can be used by receiveTestResourceConfig
  getTestJobs(): ITestJob[] {
    return this.testJobs;
  }

  private calculateTotalTests(): number {
    let total = 0;
    for (const suite of this.specs) {
      if (suite && typeof suite === 'object') {
        // Access the givens property which should be a record of test names to BaseGiven instances
        // The givens property is typically on the suite instance
        if ('givens' in suite) {
          const givens = (suite as any).givens;
          if (givens && typeof givens === 'object') {
            total += Object.keys(givens).length;
          }
        }
      }
    }
    return total;
  }
}
