import {
  ITTestResourceRequest,
  ITestJob,
  ITLog,
  ILogWriter,
  ITTestResourceConfiguration,
} from ".";
import { IBaseTest, ITestSpecification } from "../Types.js";

import {
  ISuiteKlasser,
  IGivenKlasser,
  IWhenKlasser,
  IThenKlasser,
  ICheckKlasser,
  IUtils,
} from "./types.js";

import {
  BaseCheck,
  BaseSuite,
  BaseWhen,
  BaseThen,
  BaseGiven,
} from "./abstractBase.js";

export abstract class BaseBuilder<
  ITestShape extends IBaseTest,
  SuiteExtensions,
  GivenExtensions,
  WhenExtensions,
  ThenExtensions,
  CheckExtensions
> {
  specs: any;

  assertThis: (t: any) => {};

  testResourceRequirement: ITTestResourceRequest;
  artifacts: Promise<unknown>[] = [];
  testJobs: ITestJob[];
  testSpecification: ITestSpecification<ITestShape>;
  suitesOverrides: Record<keyof SuiteExtensions, ISuiteKlasser<ITestShape>>;
  givenOverides: Record<keyof GivenExtensions, IGivenKlasser<ITestShape>>;
  whenOverides: Record<keyof WhenExtensions, IWhenKlasser<ITestShape>>;
  thenOverides: Record<keyof ThenExtensions, IThenKlasser<ITestShape>>;
  checkOverides: Record<keyof CheckExtensions, ICheckKlasser<ITestShape>>;

  constructor(
    public readonly input: ITestShape["iinput"],
    suitesOverrides: Record<keyof SuiteExtensions, ISuiteKlasser<ITestShape>>,
    givenOverides: Record<keyof GivenExtensions, IGivenKlasser<ITestShape>>,
    whenOverides: Record<keyof WhenExtensions, IWhenKlasser<ITestShape>>,
    thenOverides: Record<keyof ThenExtensions, IThenKlasser<ITestShape>>,
    checkOverides: Record<keyof CheckExtensions, ICheckKlasser<ITestShape>>,
    logWriter: ILogWriter,
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

    const suiteRunner =
      (suite: BaseSuite<ITestShape>, utils: IUtils) =>
      async (
        testResourceConfiguration: ITTestResourceConfiguration,
        tLog: ITLog,
        utils: IUtils
      ): Promise<BaseSuite<ITestShape>> => {
        return await suite.run(
          input,
          testResourceConfiguration,
          (fPath: string, value: unknown) =>
            logWriter.testArtiFactoryfileWriter(tLog, (p: Promise<void>) => {
              this.artifacts.push(p);
            })(testResourceConfiguration.fs + "/" + fPath, value),
          tLog,
          utils
        );
      };

    this.testJobs = this.specs.map(
      (suite: BaseSuite<ITestShape>, utils: IUtils) => {
        const runner = suiteRunner(suite, utils);

        return {
          test: suite,
          testResourceRequirement,

          toObj: () => {
            return suite.toObj();
          },

          runner,

          receiveTestResourceConfig: async function (
            testResourceConfiguration = {
              name: "",
              fs: ".",
              ports: [],
              scheduled: false,
            },
            y: IUtils
          ) {
            console.log(
              `testResourceConfiguration ${JSON.stringify(
                testResourceConfiguration,
                null,
                2
              )}`
            );

            await logWriter.mkdirSync(testResourceConfiguration.fs);
            logWriter.writeFileSync(
              `${testResourceConfiguration.fs}/tests.json`,
              JSON.stringify(this.toObj(), null, 2)
            );

            const logFilePath = `${testResourceConfiguration.fs}/log.txt`;

            const access = await logWriter.createWriteStream(logFilePath);

            const tLog = (...l: string[]) => {
              // console.log(...l);
              access.write(`${l.toString()}\n`);
            };
            const suiteDone: BaseSuite<ITestShape> = await runner(
              testResourceConfiguration,
              tLog,
              y
            );
            const resultsFilePath = `${testResourceConfiguration.fs}/results.json`;

            logWriter.writeFileSync(
              resultsFilePath,
              JSON.stringify(suiteDone.toObj(), null, 2)
            );

            const logPromise = new Promise((res, rej) => {
              access.on("finish", () => {
                res(true);
              });
            });
            access.end();

            const numberOfFailures = Object.keys(suiteDone.givens).filter(
              (k) => {
                // console.log(`suiteDone.givens[k].error`, suiteDone.givens[k].error);
                return suiteDone.givens[k].error;
              }
            ).length;
            logWriter.writeFileSync(
              `${testResourceConfiguration.fs}/exitcode`,
              numberOfFailures.toString()
            );
            console.log(
              `exiting gracefully with ${numberOfFailures} failures.`
            );
            return {
              failed: numberOfFailures,
              artifacts: this.artifacts || [],
              logPromise,
            };
          },
        };
      }
    );
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
