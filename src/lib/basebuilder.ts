/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { PassThrough } from "stream";

import type {
  Ibdd_in_any,
  Ibdd_out_any,
  ITestSpecification,
} from "../CoreTypes";

import { ITestJob, ITLog, IFinalResults, ITTestResourceRequest } from ".";
import {
  ISuiteKlasser,
  IGivenKlasser,
  IWhenKlasser,
  IThenKlasser,
  IPM,
} from "./types.js";
import { BaseWhen, BaseThen, BaseGiven } from "./abstractBase.js";
import { BaseSuite } from "./BaseSuite";

export abstract class BaseBuilder<
  I extends Ibdd_in_any,
  O extends Ibdd_out_any,
  SuiteExtensions,
  GivenExtensions,
  WhenExtensions,
  ThenExtensions
> {
  specs: any;

  assertThis: (t: I["then"]) => {};

  testResourceRequirement: ITTestResourceRequest;
  artifacts: Promise<unknown>[] = [];
  testJobs: ITestJob[];
  testSpecification: ITestSpecification<I, O>;
  suitesOverrides: Record<keyof SuiteExtensions, ISuiteKlasser<I, O>>;
  givenOverides: Record<keyof GivenExtensions, IGivenKlasser<I>>;
  whenOverides: Record<keyof WhenExtensions, IWhenKlasser<I>>;
  thenOverides: Record<keyof ThenExtensions, IThenKlasser<I>>;
  puppetMaster: IPM;

  constructor(
    input: I["iinput"],
    suitesOverrides: Record<keyof SuiteExtensions, ISuiteKlasser<I, O>>,
    givenOverides: Record<keyof GivenExtensions, IGivenKlasser<I>>,
    whenOverides: Record<keyof WhenExtensions, IWhenKlasser<I>>,
    thenOverides: Record<keyof ThenExtensions, IThenKlasser<I>>,
    testResourceRequirement: ITTestResourceRequest,
    testSpecification: any
  ) {
    this.artifacts = [];
    this.testResourceRequirement = testResourceRequirement;
    this.suitesOverrides = suitesOverrides;
    this.givenOverides = givenOverides;
    this.whenOverides = whenOverides;
    this.thenOverides = thenOverides;
    this.testSpecification = testSpecification;

    this.specs = testSpecification(
      this.Suites(),
      this.Given(),
      this.When(),
      this.Then()
    );

    this.testJobs = this.specs.map((suite: BaseSuite<I, O>) => {
      const suiteRunner =
        (suite: BaseSuite<I, O>) =>
        async (puppetMaster: IPM, tLog: ITLog): Promise<BaseSuite<I, O>> => {
          const x = await suite.run(
            input,
            puppetMaster.testResourceConfiguration,
            (fPath: string, value: string | Buffer | PassThrough) =>
              puppetMaster.testArtiFactoryfileWriter(
                tLog,
                (p: Promise<void>) => {
                  this.artifacts.push(p);
                }
              )(puppetMaster.testResourceConfiguration.fs + "/" + fPath, value),
            tLog,
            puppetMaster
          );

          return x;
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
          const logFilePath = "log.txt";
          const access: number = await puppetMaster.createWriteStream(
            logFilePath
          );

          // deprecated?
          const tLog = async (...l: string[]) => {
            //
          };

          const suiteDone: BaseSuite<I, O> = await runner(puppetMaster, tLog);

          const logPromise = new Promise(async (res) => {
            await puppetMaster.end(access);
            res(true);
          });

          const fails = suiteDone.fails;

          await puppetMaster.writeFileSync(`bdd_errors.txt`, fails.toString());

          await puppetMaster.writeFileSync(
            `tests.json`,
            JSON.stringify(this.toObj(), null, 2)
          );

          return {
            failed: fails > 0,
            fails,
            artifacts: this.artifacts || [],
            logPromise,
            features: suiteDone.features(),
          };
        },
      };
    });
  }

  // testsJson() {
  //   puppetMaster.writeFileSync(
  //     `tests.json`,
  //     JSON.stringify({ features: suiteDone.features() }, null, 2)
  //   );
  // }

  Specs() {
    return this.specs;
  }
  Suites() {
    return this.suitesOverrides;
  }

  Given(): Record<
    keyof GivenExtensions,
    (
      name: string,
      features: string[],
      whens: BaseWhen<I>[],
      thens: BaseThen<I>[],
      gcb
    ) => BaseGiven<I>
  > {
    return this.givenOverides;
  }

  When(): Record<
    keyof WhenExtensions,
    (arg0: I["istore"], ...arg1: any) => BaseWhen<I>
  > {
    return this.whenOverides;
  }

  Then(): Record<
    keyof ThenExtensions,
    (selection: I["iselection"], expectation: any) => BaseThen<I>
  > {
    return this.thenOverides;
  }
}
