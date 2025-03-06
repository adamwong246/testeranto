import { PassThrough } from "stream";

import { ITTestResourceRequest, ITestJob, ITLog } from ".";
import { IBaseTest, ITestSpecification } from "../Types.js";

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
  >,
  SuiteExtensions,
  GivenExtensions,
  WhenExtensions,
  ThenExtensions,
  CheckExtensions
> {
  specs: any;

  assertThis: (t: ITestShape["then"]) => {};

  testResourceRequirement: ITTestResourceRequest;
  artifacts: Promise<unknown>[] = [];
  testJobs: ITestJob[];
  testSpecification: ITestSpecification<ITestShape>;
  suitesOverrides: Record<keyof SuiteExtensions, ISuiteKlasser<ITestShape>>;
  givenOverides: Record<keyof GivenExtensions, IGivenKlasser<ITestShape>>;
  whenOverides: Record<keyof WhenExtensions, IWhenKlasser<ITestShape>>;
  thenOverides: Record<keyof ThenExtensions, IThenKlasser<ITestShape>>;
  checkOverides: Record<keyof CheckExtensions, ICheckKlasser<ITestShape>>;
  puppetMaster: PM;

  constructor(
    public readonly input: ITestShape["iinput"],
    suitesOverrides: Record<keyof SuiteExtensions, ISuiteKlasser<ITestShape>>,
    givenOverides: Record<keyof GivenExtensions, IGivenKlasser<ITestShape>>,
    whenOverides: Record<keyof WhenExtensions, IWhenKlasser<ITestShape>>,
    thenOverides: Record<keyof ThenExtensions, IThenKlasser<ITestShape>>,
    checkOverides: Record<keyof CheckExtensions, ICheckKlasser<ITestShape>>,
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

    this.testJobs = this.specs.map((suite: BaseSuite<ITestShape>) => {
      const suiteRunner =
        (suite: BaseSuite<ITestShape>) =>
        async (
          puppetMaster: PM,
          tLog: ITLog
        ): Promise<BaseSuite<ITestShape>> => {
          const puppeteerBrowser = await puppetMaster.startPuppeteer(
            {
              browserWSEndpoint:
                puppetMaster.testResourceConfiguration.browserWSEndpoint,
            },
            puppetMaster.testResourceConfiguration.fs
          );

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

          // await puppetMaster.browser.disconnect();
          // puppeteerBrowser.close();
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
          // await puppetMaster.mkdirSync();

          const logFilePath = "log.txt";
          const access = await puppetMaster.createWriteStream(logFilePath);
          const tLog = (...l: string[]) => {
            puppetMaster.write(access, `${l.toString()}\n`);
          };

          const suiteDone: BaseSuite<ITestShape> = await runner(
            puppetMaster,
            tLog
          );

          const logPromise = new Promise((res, rej) => {
            puppetMaster.end(access);
            res(true);
          });

          const numberOfFailures = Object.keys(suiteDone.givens).filter((k) => {
            return suiteDone.givens[k].error;
          }).length;
          puppetMaster.writeFileSync(`exitcode`, numberOfFailures.toString());

          // if (numberOfFailures > 0) {
          //   puppetMaster.writeFileSync(
          //     `prompt`,
          //     `
          //     aider --message "make a script that prints hello" hello.js
          //     `
          //   );
          // }

          puppetMaster.writeFileSync(
            `tests.json`,
            JSON.stringify(this.toObj(), null, 2)
          );
          console.log(`exiting gracefully with ${numberOfFailures} failures.`);

          return {
            failed: numberOfFailures,
            artifacts: this.artifacts || [],
            logPromise,
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
      whens: BaseWhen<ITestShape>[],
      thens: BaseThen<ITestShape>[],
      gcb
    ) => BaseGiven<ITestShape>
  > {
    return this.givenOverides;
  }

  When(): Record<
    keyof WhenExtensions,
    (arg0: ITestShape["istore"], ...arg1: any) => BaseWhen<ITestShape>
  > {
    return this.whenOverides;
  }

  Then(): Record<
    keyof ThenExtensions,
    (
      selection: ITestShape["iselection"],
      expectation: any
    ) => BaseThen<ITestShape>
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
    ) => BaseCheck<ITestShape>
  > {
    return this.checkOverides;
  }
}
