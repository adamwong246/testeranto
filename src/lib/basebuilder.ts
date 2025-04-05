import { PassThrough } from "stream";

import { ITTestResourceRequest, ITestJob, ITLog } from ".";
import { Ibdd_in, Ibdd_out, ITestSpecification } from "../Types.js";

import {
  ISuiteKlasser,
  IGivenKlasser,
  IWhenKlasser,
  IThenKlasser,
  ICheckKlasser,
} from "./types.js";
import {
  BaseCheck,
  BaseSuite,
  BaseWhen,
  BaseThen,
  BaseGiven,
} from "./abstractBase.js";
import { PM } from "../PM/index.js";

export abstract class BaseBuilder<
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
  O extends Ibdd_out<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >,
  SuiteExtensions,
  GivenExtensions,
  WhenExtensions,
  ThenExtensions,
  CheckExtensions
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
  checkOverides: Record<keyof CheckExtensions, ICheckKlasser<I, O>>;
  puppetMaster: PM;

  constructor(
    public readonly input: I["iinput"],
    suitesOverrides: Record<keyof SuiteExtensions, ISuiteKlasser<I, O>>,
    givenOverides: Record<keyof GivenExtensions, IGivenKlasser<I>>,
    whenOverides: Record<keyof WhenExtensions, IWhenKlasser<I>>,
    thenOverides: Record<keyof ThenExtensions, IThenKlasser<I>>,
    checkOverides: Record<keyof CheckExtensions, ICheckKlasser<I, O>>,
    testResourceRequirement: ITTestResourceRequest,
    testSpecification: any
  ) {
    this.artifacts = [];
    this.testResourceRequirement = testResourceRequirement;
    this.suitesOverrides = suitesOverrides;
    this.givenOverides = givenOverides;
    this.whenOverides = whenOverides;
    this.thenOverides = thenOverides;
    this.checkOverides = checkOverides;
    this.testSpecification = testSpecification;

    this.specs = testSpecification(
      this.Suites(),
      this.Given(),
      this.When(),
      this.Then(),
      this.Check()
    );

    this.testJobs = this.specs.map((suite: BaseSuite<I, O>) => {
      const suiteRunner =
        (suite: BaseSuite<I, O>) =>
        async (puppetMaster: PM, tLog: ITLog): Promise<BaseSuite<I, O>> => {
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

        receiveTestResourceConfig: async function (puppetMaster: PM) {
          const logFilePath = "log.txt";
          const access = await puppetMaster.createWriteStream(logFilePath);
          const tLog = (...l: string[]) => {
            puppetMaster.write(access, `${l.toString()}\n`);
          };

          const suiteDone: BaseSuite<I, O> = await runner(puppetMaster, tLog);

          const logPromise = new Promise((res, rej) => {
            puppetMaster.end(access);
            res(true);
          });

          const numberOfFailures = Object.keys(suiteDone.givens).filter((k) => {
            return suiteDone.givens[k].error;
          }).length;
          puppetMaster.writeFileSync(`exitcode`, numberOfFailures.toString());

          const o = this.toObj();
          puppetMaster.writeFileSync(
            `littleBoard.html`,
            `
            <!DOCTYPE html>
<html lang="en">

<head>
  <meta name="description" content="Webpage description goes here" />
  <meta charset="utf-8" />
  <title>kokomoBay - testeranto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="author" content="" />

  <link rel="stylesheet" href="/TestReport.css" />
  <script src="/TestReport.js"></script>

</head>

  <body>
    <h1>Test report</h1>
            <div id="root"/>
  </body>
            `
          );

          puppetMaster.writeFileSync(
            `tests.json`,
            JSON.stringify(this.toObj(), null, 2)
          );

          return {
            failed: numberOfFailures,
            artifacts: this.artifacts || [],
            logPromise,
            features: suiteDone.features(),
          };
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

  Check(): Record<
    keyof CheckExtensions,
    (
      feature: string,
      callback: (whens, thens) => any,
      whens,
      thens,
      x
    ) => BaseCheck<I, O>
  > {
    return this.checkOverides;
  }
}
